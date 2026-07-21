<?php

namespace App\Models\Prm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DV;
use DBX;

class Receipt extends Model
{
    protected $table = 'receipts';
    protected $userInfo = null;
    protected $id = null;

    public function __construct($id = null, $userInfo = null)
    {
        parent::__construct();
        $this->id = $id;
        $this->userInfo = $userInfo;
    }


    public function getListPaginate($arr = [], $ss = null, $id = null)
    {
        $d = (object)$arr;

        $searchValue = trim((string)($d->search_value ?? ''));
        $statusId    = $d->status_id ?? null;
        $dateFrom    = $d->date_from ?? null;
        $dateTo      = $d->date_to ?? null;
        $tenantId    = $d->tenant_id ?? null;

        $currentPage = max(1, (int)($d->current_page ?? 1));
        $perPage     = max(1, (int)($d->per_page ?? 10));

        $fromDateTime = null;
        $toDateTime   = null;

        if (!empty($dateFrom) && strtotime($dateFrom) !== false) {
            $fromDateTime = date('Y-m-d 00:00:00', strtotime($dateFrom));
        }

        if (!empty($dateTo) && strtotime($dateTo) !== false) {
            $toDateTime = date('Y-m-d 23:59:59', strtotime($dateTo));
        }


        $applyFilters = function ($query, bool $withSearchJoins = true) use (
            $searchValue,
            $statusId,
            $fromDateTime,
            $toDateTime,
            $id,
            $tenantId
        ) {
            if ($searchValue !== '' && $withSearchJoins) {
                $query->where(function ($q) use ($searchValue) {
                    $q->whereRaw(DBX::whereLowerCase('r.code', "%{$searchValue}%", 'LIKE'))
                        ->orWhereRaw(DBX::whereLowerCase('t.name', "%{$searchValue}%", 'LIKE'))
                        ->orWhereRaw(DBX::whereLowerCase('i.code', "%{$searchValue}%", 'LIKE'));
                });
            }

            if (!empty($statusId)) {
                $query->where('r.receipt_status_id', (int)$statusId);
            }

            if ($fromDateTime !== null) {
                $query->where('r.receipt_date', '>=', $fromDateTime);
            }

            if ($toDateTime !== null) {
                $query->where('r.receipt_date', '<=', $toDateTime);
            }

            if (!empty($id)) {
                $query->where('r.id', $id);
            }

            if (!empty($tenantId)) {
                $query->where('r.tenant_id', (int)$tenantId);
            }
        };

        /*
    |--------------------------------------------------------------------------
    | Fast count query
    |--------------------------------------------------------------------------
    */
        $countQuery = DB::table('receipts as r');

        if ($searchValue !== '') {
            $countQuery
                ->leftJoin('tenants as t', 't.id', '=', 'r.tenant_id')
                ->leftJoin('invoices as i', 'i.id', '=', 'r.invoice_id');
        }

        $applyFilters($countQuery, true);

        $total = $countQuery->count();

        /*
    |--------------------------------------------------------------------------
    | Main query
    |--------------------------------------------------------------------------
    */
        $query = DB::table('receipts as r')
            ->leftJoin('tenants as t', 't.id', '=', 'r.tenant_id')
            ->leftJoin('invoices as i', 'i.id', '=', 'r.invoice_id')
            ->leftJoin('building_spaces as receipt_bs', 'receipt_bs.id', '=', 'r.space_id')
            ->leftJoin('building_spaces as invoice_bs', 'invoice_bs.id', '=', 'i.space_id')
            ->leftJoin('receipt_statuses as rs', 'rs.id', '=', 'r.receipt_status_id')
            ->select([
                'r.id',
                'r.code',
                'r.receipt_date',
                'r.total_received',
                'r.total_paid',
                'r.remarks',
                'r.updated_at',
                'r.update_user',
                'r.receipt_status_id',
                'r.deposit_id',
                't.name as tenant_name',
                't.phone_number as tenant_phone',
                'i.code as invoice_code',
                'i.amount as invoice_total',
                'i.issue_date',
                DB::raw('COALESCE(receipt_bs.code, invoice_bs.code) as space_code'),
                'rs.name as receipt_status_name',
            ]);
        $applyFilters($query, true);

        $rows = $query
            ->orderByDesc('r.id')
            ->forPage($currentPage, $perPage)
            ->get();

        /*
    |--------------------------------------------------------------------------
    | Receipt breakdown enrichment
    |--------------------------------------------------------------------------
    */
        if ($rows->isNotEmpty()) {
            $receiptIds = $rows->pluck('id')->all();

            $breakdowns = DB::table('receipt_breakdowns')
                ->select([
                    'receipt_id',
                    'method',
                    'bank_name',
                    'cheque_bank_name',
                    'card_type',
                    'amount',
                ])
                ->whereIn('receipt_id', $receiptIds)
                ->orderBy('id')
                ->get()
                ->groupBy('receipt_id');

            foreach ($rows as $row) {
                $items = $breakdowns->get($row->id, collect());

                $first = $items->first();
                $row->method = $first->method ?? null;

                $parts = [];

                foreach ($items as $item) {
                    $method = trim((string)($item->method ?? ''));

                    if ($method === '') {
                        continue;
                    }

                    $label = $method;

                    if (!empty($item->bank_name)) {
                        $label .= ' (' . trim($item->bank_name) . ')';
                    }

                    if (!empty($item->cheque_bank_name)) {
                        $label .= ' - ' . trim($item->cheque_bank_name);
                    }

                    if (!empty($item->card_type)) {
                        $label .= ' ' . trim($item->card_type);
                    }

                    $label .= ' : $' . number_format((float)$item->amount, 2);

                    $parts[] = $label;
                }

                $row->payment_methods = implode(' , ', $parts);

                setOfficialDates(
                    $row,
                    ['receipt_date', 'issue_date'],
                    ['updated_at'],
                    []
                );
            }
        }

        return new LengthAwarePaginator(
            $rows,
            $total,
            $perPage,
            $currentPage
        );
    }
    // public static function getReceiptDetails($id)
    // {
    //     $header = DB::table('receipts as r')
    //         ->leftJoin('tenants as t', 't.id', '=', 'r.tenant_id')
    //         ->leftJoin('invoices as i', 'i.id', '=', 'r.invoice_id')
    //         ->where('r.id', $id)
    //         ->select(
    //             'r.id',
    //             'r.code',
    //             'r.receipt_date',
    //             'r.total_received',
    //             'r.total_paid',
    //             'r.remarks',
    //             'r.invoice_id',
    //             'i.code as invoice_code',
    //             't.name as tenant_name',
    //             't.phone_number as tenant_phone'
    //         )
    //         ->first();

    //     if (!$header) {
    //         return null;
    //     }

    //     // Fetch the payment methods used for this receipt
    //     $header->breakdowns = DB::table('receipt_breakdowns as rb')
    //         ->leftJoin('banks as b', 'b.id', '=', 'rb.bank_id')
    //         ->where('rb.receipt_id', $id)
    //         ->select(
    //             'rb.id',
    //             'rb.method',
    //             'rb.amount',
    //             'rb.currency_code',
    //             'rb.bank_ref_number',
    //             'rb.bank_name as manual_bank_name',
    //             'b.name as registered_bank_name',
    //             'rb.card_number',
    //             'rb.card_type',
    //             'rb.remarks'
    //         )
    //         ->get();

    //     return $header;
    // }


    public static function getReceiptDetails($id)
    {
        $header = DB::table('receipts as r')
            ->leftJoin('tenants as t', 't.id', '=', 'r.tenant_id')
            ->leftJoin('invoices as i', 'i.id', '=', 'r.invoice_id')
            ->where('r.id', $id)
            ->select(
                'r.id',
                'r.code',
                'r.receipt_date',
                'r.total_received',
                'r.remarks',
                'r.invoice_id',
                'r.space_id',
                'r.total_paid',
                'i.code as invoice_code',
                't.name as tenant_name',
                't.phone_number as tenant_phone'
            )
            ->first();

        if (!$header) {
            return null;
        }

        if (!$header->invoice_id) {
            $spaceInfo = DB::table('building_spaces as bs')
                ->leftJoin('buildings as b', 'b.id', '=', 'bs.building_id')
                ->where('bs.id', $header->space_id)
                ->select('bs.code as space_code', 'b.name as building_name')
                ->first();

            $spaceCodeStr = $spaceInfo ? " (Unit {$spaceInfo->space_code})" : "";
            $header->space_code = $spaceInfo ? $spaceInfo->space_code : null;
            $header->building_name = $spaceInfo ? $spaceInfo->building_name : null;

            $header->items = [
                (object)[
                    'remarks' => $header->remarks ?: 'Deposit Payment',
                    'item_name' => ($header->remarks ?: 'Deposit Payment') . $spaceCodeStr,
                    'qty' => 1,
                    'start_date' => null,
                    'end_date' => null,
                    'price' => $header->total_received,
                    'discount' => 0,
                    'tax_rate' => 0,
                    'total' => $header->total_received,
                    'unit_type' => 'Unit'
                ]
            ];
            $header->amount = $header->total_received;
            $header->discount_value = 0;
            $header->amount_payable = $header->total_received;
            $header->due_amount = 0;
        }

        // Fetch the payment methods used for this receipt
        $header->breakdowns = DB::table('receipt_breakdowns as rb')
            ->leftJoin('banks as b', 'b.id', '=', 'rb.bank_id')
            ->where('rb.receipt_id', $id)
            ->select(
                'rb.id',
                'rb.method',
                'rb.amount',
                'rb.currency_code',
                'rb.bank_ref_number',
                'rb.bank_name as manual_bank_name',
                'b.name as registered_bank_name',
                'rb.card_number',
                'rb.card_type',
                'rb.remarks'
            )
            ->get();

        return $header;
    }

    public function cancelReceipt($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $arr['id'] ?? null;
        $remarks = $arr['remarks'] ?? $arr['remark'] ?? '';
        $new_status_id = 2; // Canceled status

        if (!$id) {
            return DV::error('Missing required parameters');
        }

        return DB::transaction(function () use ($id, $new_status_id, $ss, $remarks) {
            $receipt = DB::table('receipts')->where('id', $id)->first();
            if (!$receipt) {
                return DV::error('Receipt not found');
            }

            $old_status_id = (int)$receipt->receipt_status_id;
            if ($old_status_id === $new_status_id) {
                return DV::error('Receipt is already canceled');
            }
            if($receipt->deposit_id){
                $deposit = DB::table('deposits')->where('id', $receipt->deposit_id)->first();
                if ($deposit) {
                    $contract = DB::table('contracts')->where('id', $deposit->contract_id)->first();
                    if ($contract) {
                        $terminatedStatusId = \App\Models\Prm\Contract::getTerminatedStatusId();
                        if ((int)$contract->status_id === (int)$terminatedStatusId) {
                            return DV::error(\Vsd\Locales\Localization::trans('cannot_cancel_deposit_terminated_contract', 'validation'));
                        }
                    }
                }

                $updated = DB::table('receipts')
                ->where('id', $id)
                ->update([
                    'receipt_status_id' => $new_status_id,
                    'remarks'           => $remarks,
                    'update_user'       => $ss->full_name ?? $ss->name ?? 'System',
                    'update_uid'        => $ss->id ?? $ss->uid ?? null,
                    'updated_at'        => now(),
                ]);

                $updated_deposit = DB::table('deposits')
                ->where('id', $receipt->deposit_id)
                ->update([
                    'status_id' => 1, 
                    'paid_amount' => 0,
                    'update_user'       => $ss->full_name ?? $ss->name ?? 'System',
                    'update_uid'        => $ss->id ?? $ss->uid ?? null,
                    'updated_at'        => now(),
                ]);

                return DV::success(['message' => 'This will restore to the due balance on the deposit']);
                
            }
            $updated = DB::table('receipts')
                ->where('id', $id)
                ->update([
                    'receipt_status_id' => $new_status_id,
                    'remarks'           => $remarks,
                    'update_user'       => $ss->full_name ?? $ss->name ?? 'System',
                    'update_uid'        => $ss->id ?? $ss->uid ?? null,
                    'updated_at'        => now(),
                ]);

            if ($updated) {
                $invoice = DB::table('invoices')->where('id', $receipt->invoice_id)->first();

                if ($invoice) {
                    $amount_to_reverse = (float)$receipt->total_received;
                    $current_paid = (float)$invoice->paid_amount;
                    $total_invoice = (float)$invoice->amount_payable;

                    $new_paid_amount = max(0, $current_paid - $amount_to_reverse);
                    $new_due_amount = max(0, $total_invoice - $new_paid_amount);

                    $inv_status = 2;
                    if ($new_due_amount <= 0.001) {
                        $inv_status = 1; // Paid
                    } elseif ($new_paid_amount > 0) {
                        $inv_status = 3; // Partial
                    }

                    DB::table('invoices')->where('id', $receipt->invoice_id)->update([
                        'paid_amount'       => $new_paid_amount,
                        'due_amount'        => $new_due_amount,
                        'payment_status_id' => $inv_status,
                        'is_paid'           => ($inv_status == 1 ? 1 : 0),
                        'updated_at'        => now(),
                        'update_user'       => $ss->full_name ?? $ss->name ?? 'System',
                        'update_uid'        => $ss->id ?? $ss->uid ?? null,
                    ]);
                }
            }

            return DV::success(['message' => 'Receipt canceled and invoice balance restored successfully']);
        });
    }


    public function getFormOptions($arr = [], $ss = null)
    {
        $ss = $ss ? $ss : $this->userInfo;
        $d = (object)$arr;
        $id = $d->id ?? $this->id;
        return (object)[
            'receipt_statuses'  => GeneralSettings::options_receipt_status($ss)

        ];
    }
}
