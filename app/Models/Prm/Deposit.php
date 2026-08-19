<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use Vsd\Response\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Vsd\Database\DBX;
use Vsd\Storage\PublicStorage as XPublicStorage;
use Log;

class Deposit
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function saveDeposit($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $arr['id'] ?? null;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'id'                    => '0|number',
            'contract_id'           => '1|number|exists=contracts.id',
            'tenant_id'             => '1|number|exists=tenants.id',
            'amount'                => '1|number|min=0|text=Amount is required.',
            'paid_amount'           => '0|number|min=0',
            'deposit_date'          => '1|date|text=Deposit date is required.',
            'status_id'             => '0|integer',
            'status'                => '0|string',
            'remarks'               => '0|string|0-255',
            'payment_method'        => '1|string',
            'ref_no'                => '0|string|0-50',
        ];

        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;

        if (in_array($inputs['payment_method'] ?? '', ['Bank Transfer', 'Cheque']) && empty(trim($inputs['ref_no'] ?? ''))) {
            return DV::error(\Vsd\Locales\Localization::trans('reference_no_is_required', 'validation'));
        }

        $statusInput = $inputs['status_id'] ?? $inputs['status'] ?? null;
        $status_id = null;
        if ($statusInput !== null && $statusInput !== '') {
            if (is_numeric($statusInput)) {
                $status_id = intval($statusInput);
            } else {
                $statusRow = DB::table('deposit_statuses')->where('status_code', $statusInput)->first();
                if ($statusRow) {
                    $status_id = $statusRow->id;
                }
            }
        }

        if (empty($status_id) || $status_id == 1 || $status_id == 2) {
            $amount = floatval($inputs['amount']);
            $paidAmount = floatval($inputs['paid_amount'] ?? 0.00);
            if ($paidAmount >= $amount && $amount > 0) {
                $status_id = 2; 
            } else {
                $status_id = 1; 
            }
        }

        $saveData = [
            'contract_id'  => $inputs['contract_id'],
            'tenant_id'    => $inputs['tenant_id'],
            'amount'       => $inputs['amount'],
            'paid_amount'  => $inputs['paid_amount'] ?? 0.00,
            'deposit_date' => convertDate($inputs['deposit_date']),
            'status_id'    => $status_id,
            'remarks'      => $inputs['remarks'] ?? null,
        ];

        DB::beginTransaction();
        try {
            $existing = null;
            if ($id) {
                $existing = DB::table('deposits')->where('id', $id)->first();
            }

            $savedId = DBX::saveData($ss, 'deposits', ['id' => $id], $saveData, [], 1);
            if (!$savedId) {
                throw new \Exception('Error saving deposit.');
            }

            // Create receipt if transitioned to paid
            $wasPaid = $existing && intval($existing->status_id) === 2;
            $isPaidNow = intval($status_id) === 2;

            if ($isPaidNow && !$wasPaid) {
                // Create receipt
                $space_id = DB::table('contracts')->where('id', $saveData['contract_id'])->value('space_id');

                $receiptData = [
                    'receipt_date'      => convertDate($inputs['deposit_date']) ?? now()->toDateString(),
                    'invoice_id'        => null,
                    'deposit_id'        => $savedId,
                    'tenant_id'         => $saveData['tenant_id'],
                    'space_id'          => $space_id,
                    'branch_id'         => $ss->branch_id ?? 1,
                    'total_received'    => $saveData['paid_amount'],
                    'remarks'           => $saveData['remarks'] ?? 'Deposit Payment',
                    'create_user'       => $ss->full_name ?? $ss->name ?? 'Admin',
                    'create_uid'        => $ss->user_id ?? $ss->uid ?? $ss->id ?? 1,
                    'receipt_status_id' => 1, // Active/Paid
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ];

                $receipt_id = DBX::saveData($ss, 'receipts', [], $receiptData, [], 1);
                if (!$receipt_id) {
                    throw new \Exception('Failed to create receipt.');
                }

                // Generate receipt code
                setOfficialCode(
                    $receiptData['branch_id'],
                    'receipt_code_control',
                    'receipts',
                    ['id' => $receipt_id],
                    'R-',
                    5,
                    null
                );

                // Insert receipt breakdown
                $method = $inputs['payment_method'] ?? 'Cash';
                $methodMap = [
                    'cash'          => 'Cash',
                    'bank transfer' => 'Bank',
                    'bank'          => 'Bank',
                    'card'          => 'Card',
                    'cheque'        => 'Cheque'
                ];
                $mappedMethod = $methodMap[strtolower(trim($method))] ?? 'Cash';

                $breakdown = [
                    'receipt_id'      => $receipt_id,
                    'method'          => $mappedMethod,
                    'amount'          => floatval($saveData['paid_amount']),
                    'currency_code'   => 'USD',
                    'bank_ref_number' => $inputs['ref_no'] ?? null,
                    'remarks'         => $saveData['remarks'] ?? 'Deposit Payment',
                    'created_at'      => now(),
                ];

                DB::table('receipt_breakdowns')->insert($breakdown);
            }

            DB::commit();
            return DV::depends($savedId, ['deposits' => $saveData, 'id' => $savedId]);
        } catch (\Exception $e) {
            DB::rollBack();
            // \Log::error("Save deposit and receipt failed: " . $e->getMessage());
            return DV::error('Failed to save deposit: ' . $e->getMessage());
        }
    }

    public function getListDeposit($arr = [], $ss = null)
    {
        $d = (object) $arr;
        $search_value = $d->search_value ?? null;
        $status_id    = $d->status_id    ?? null;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : null;
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : null;
        $current_page = $d->current_page ?? 1;
        $per_page     = $d->per_page     ?? 10;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = "2=2";

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "(t.name LIKE '%" . $search_value . "%' OR bs.code LIKE '%" . $search_value . "%' OR t.phone_number LIKE '%" . $search_value . "%')";
        } else {
            if ($start_date && $end_date) {
                $str_moreWhere .= " AND DATE(d.deposit_date) BETWEEN '$start_date' AND '$end_date'";
            }
            if ($status_id) {
                $str_moreWhere .= ' AND d.status_id = ' . $status_id;
            }
        }

        $query = DB::table('deposits as d')
            ->join('contracts as c', 'c.id', 'd.contract_id')
            ->join('tenants as t', 't.id', 'd.tenant_id')
            ->join('building_spaces as bs', 'bs.id', 'c.space_id')
            ->leftJoin('buildings as b', 'b.id', 'bs.building_id')
            ->leftJoin('deposit_statuses as ds', 'ds.id', 'd.status_id')
            ->leftJoin('deposit_refunds as dr', 'dr.contract_id', '=', 'd.contract_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("   d.id, d.contract_id, d.tenant_id, t.name as tenant_name, t.phone_number,
                           b.name as building_name, bs.code as space_code,
                           c.start_date, c.end_date,
                           d.amount as total_amount, 
                           d.paid_amount,
                           dr.refund_amount,
                           d.deposit_date,
                           (CASE WHEN d.status_id = 2 THEN d.deposit_date ELSE NULL END) as paid_date,
                           d.status_id,
                           ds.status_code as status,
                           d.remarks as remark,
                           d.update_user, d.updated_at
                       ")
            ->orderBy('d.id', 'desc');

        $count = (clone $query)->count('d.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            setOfficialDates($row, ['start_date', 'end_date', 'deposit_date', 'paid_date'], ['updated_at'], []);
            $row->total_amount = floatval($row->total_amount);
            $row->paid_amount = floatval($row->paid_amount);
            $row->refund_amount = $row->refund_amount !== null ? floatval($row->refund_amount) : null;
            $row->balance = max(0, $row->total_amount - $row->paid_amount);
        }
        unset($row);

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function depositDetails($id, $ss = null)
    {
        $row = DB::table('deposits as d')
            ->join('contracts as c', 'c.id', 'd.contract_id')
            ->join('tenants as t', 't.id', 'd.tenant_id')
            ->join('building_spaces as bs', 'bs.id', 'c.space_id')
            ->leftJoin('buildings as b', 'b.id', 'bs.building_id')
            ->leftJoin('deposit_statuses as ds', 'ds.id', 'd.status_id')
            ->leftJoin('deposit_refunds as dr', 'dr.contract_id', '=', 'd.contract_id')
            ->where('d.id', $id)
            ->selectRaw("   d.id, d.contract_id, d.tenant_id, t.name as tenant_name, t.phone_number,
                           b.name as building_name, bs.code as space_code,
                           c.start_date, c.end_date,
                           d.amount as total_amount, 
                           d.paid_amount,
                           dr.refund_amount,
                           d.deposit_date,
                           d.status_id,
                           ds.status_code as status,
                           d.remarks as remark,
                           d.update_user, d.updated_at
                       ")
            ->first();
        if ($row) {
            setOfficialDates($row, ['start_date', 'end_date', 'deposit_date', 'paid_date'], ['updated_at'], []);
            $row->total_amount = floatval($row->total_amount);
            $row->paid_amount = floatval($row->paid_amount);
            $row->refund_amount = $row->refund_amount !== null ? floatval($row->refund_amount) : null;
            $row->balance = max(0, $row->total_amount - $row->paid_amount);
        }
        return $row;
    }

    public static function getFormOptions($id = null, $ss = null)
    {
        $deposit_details = $id ? self::depositDetails($id, $ss) : null;

        $statuses = DB::table('deposit_statuses')
            ->select('id', 'name')
            ->get();

        return (object) [
            'deposit_details' => $deposit_details,
            'tenants'         => GeneralSettings::options_tenant($ss),
            'buildings'       => GeneralSettings::options_building($ss),
            'deposit_statuses' => $statuses,
            
        ];
    }

    public function deleteDeposit($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $deposit = DB::table('deposits')->where('id', $id)->first();
        if (!$deposit) {
            return DV::error('Deposit not found.');
        }

        DB::beginTransaction();
        try {
            DB::table('deposits')->where('id', $id)->delete();
            DB::commit();
            return DV::depends(1, ['action' => 'deleted']);
        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error($e->getMessage());
        }
    }

    public function updateDepositStatus($status_id, $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        if (!is_numeric($status_id)) {
            $statusRow = DB::table('deposit_statuses')->where('status_code', $status_id)->first();
            if ($statusRow) {
                $status_id = $statusRow->id;
            } else {
                $knownStatuses = [
                    'unpaid' => 'Unpaid',
                    'paid' => 'Paid',
                    'refunded' => 'Refunded',
                ];
                $statusCode = strtolower(trim($status_id));
                if (isset($knownStatuses[$statusCode])) {
                    $status_id = DB::table('deposit_statuses')->insertGetId([
                        'name' => $knownStatuses[$statusCode],
                        'status_code' => $statusCode,
                    ]);
                } else {
                    return DV::error('Invalid status.');
                }
            }
        }

        $currentStatusId = DB::table('deposits')->where('id', $id)->value('status_id');
        if ($currentStatusId == $status_id) return DV::error('It is the same current status.');

        $update = [
            'status_id'   => $status_id,
            'update_user' => $ss->full_name,
            'updated_at'  => getNowTime(),
        ];

        if ($status_id == 2) { // 2 = paid
            $amount = DB::table('deposits')->where('id', $id)->value('amount');
            $update['paid_amount'] = $amount;
        }

        $x = DB::table('deposits')->where('id', $id)->update($update);

        if ($x) {
            $refundedStatusId = DB::table('deposit_statuses')
                ->where(function ($q) {
                    $q->whereRaw('LOWER(TRIM(name)) = ?', ['refunded'])
                      ->orWhereRaw('LOWER(TRIM(status_code)) = ?', ['refunded']);
                })
                ->value('id') ?? 3;

            if ($status_id == $refundedStatusId) {
                $contractId = DB::table('deposits')->where('id', $id)->value('contract_id');
                if ($contractId) {
                    DB::table('deposit_refunds')
                        ->where('contract_id', $contractId)
                        ->update([
                            'status' => 'refunded',
                            'updated_at' => now(),
                        ]);
                }
            }
        }

        return DV::depends($x, ['Deposit status', 'updated']);
    }

    // public function updateRefundStatus($contract_id, $status, $ss = null)
    // {
    //     $ss = $ss ?? $this->userInfo;
    //     $validStatuses = ['pending', 'approved', 'refunded', 'completed', 'rejected'];
    //     $status = strtolower(trim($status));
    //     if (!in_array($status, $validStatuses)) {
    //         return DV::error('Invalid refund status.');
    //     }

    //     DB::beginTransaction();
    //     try {
    //         $updated = DB::table('deposit_refunds')
    //             ->where('contract_id', $contract_id)
    //             ->update([
    //                 'status' => $status,
    //                 'updated_at' => now()
    //             ]);

    //         if ($updated) {
    //             // If status is 'refunded' or 'completed', sync to the deposits table
    //             if ($status === 'refunded' || $status === 'completed') {
    //                 $refundedStatusId = DB::table('deposit_statuses')
    //                     ->where(function ($q) {
    //                         $q->whereRaw('LOWER(TRIM(name)) = ?', ['refunded'])
    //                           ->orWhereRaw('LOWER(TRIM(status_code)) = ?', ['refunded']);
    //                     })
    //                     ->value('id') ?? 3;

    //                 DB::table('deposits')
    //                     ->where('contract_id', $contract_id)
    //                     ->update([
    //                         'status_id' => $refundedStatusId,
    //                         'update_user' => $ss->full_name ?? 'Admin',
    //                         'updated_at' => getNowTime()
    //                     ]);
    //             }
    //         }

    //         DB::commit();
    //         return DV::depends(1, ['Refund status', 'updated']);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return DV::error('Failed to update refund status: ' . $e->getMessage());
    //     }
    // }

    
}
