<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DV;
use DBX;
use Vsd\Vsloquent\VSModel;

class Invoice extends VSModel
{
    protected $table    = 'invoices';
    protected $userInfo = null;
    protected static $img_dir = 'invoices';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id       = $id;
        $this->userInfo = $userInfo;
    }


    public function upsert($arr = [], $id = null, $ss = null)
    {
        $id        = $id ?? $this->id;
        $ss        = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id ?? null;

        $v_rule = [
            'tenant_id'         => '1|integer|exists:tenants,id',
            'space_id'          => '1|integer|exists:building_spaces,id',
            'due_date'          => '1|date',
            'invoice_date'      => '0|date',
            'start_time'        => '1|time',
            'payment_status_id' => '0|integer|exists:payment_statuses,id|default=2',
            'items'             => '1|array|min:1'
        ];

        $allowed_chars = ['@', ',', '-', '.', '#', '!', '?', '(', ')', "\n"];
        $res = DBX::validateObject(
            $arr,
            $v_rule,
            1,
            ['description' => $allowed_chars],
            $ss->lang ?? 'en',
            0,
            null
        );

        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $isNew = !$id;

        if ($isNew) {
            $inputs['invoice_date'] = $inputs['invoice_date'] ?? now()->toDateString();
        } else {
            unset($inputs['invoice_date']);
        }
        $items  = $arr['items'] ?? [];
        unset($inputs['items']);

        if (empty($items)) {
            return DV::error('Please add at least one item.');
        }

        \Log::info("Saving invoice", [
            'id' => $id,
            'inputs' => $inputs,
            'items' => $items,
            'user' => $ss->name ?? 'Admin'
        ]);


        DB::beginTransaction();

        try {
            $created = !$id;

            $id = DBX::saveData($ss, 'invoices', ['id' => $id], $inputs, [], 1);
            if (!$id) {
                throw new \Exception("Failed to save invoice header.");
            }

            $codeRes = null;
            if ($created && $id) {
                $prefix = 'I-';
                $codeRes = setOfficialCode(
                    $branch_id,
                    'invoice_code_control',
                    'invoices',
                    ['id' => $id],
                    $prefix,
                    5,
                    null
                );

                if (!$codeRes || !isset($codeRes->status) || $codeRes->status !== 'OK') {
                }
            }

            DB::table('invoice_items')->where('invoice_id', $id)->delete();


            $itemRows = [];
            foreach ($items as $item) {
                $itemType = strtolower($item['type'] ?? $item['item_type'] ?? 'service');
                $itemId = $item['item_id']  ?? null;
                $qty    = (int)($item['qty'] ?? 1);
                $price  = (float)($item['price'] ?? 0);
                $unitType = $item['unit_type'] ?? '-';

                if ($itemType === 'rent' && $itemId) {
                    $contractPrice = DB::table('contracts')
                        ->where('id', $itemId)
                        ->value('price');

                    if ($contractPrice !== null) {
                        $price = (float)$contractPrice;
                    }
                } else if ($itemType === 'service' && $itemId) {
                    $serviceData = DB::table('services')
                        ->where('id', $itemId)
                        ->select('price', 'unit_type')
                        ->first();

                    if ($serviceData) {
                        $price    = (float)$serviceData->price;
                        $unitType = $serviceData->unit_type ?? '-';
                    }
                }

                $price = (float)($item['price'] ?? 0);
                $qty   = (float)($item['qty'] ?? 1);

                $itemRows[] = [
                    'invoice_id'             => $id,
                    'item_id'                => $itemId,
                    'type'                   => $itemType,
                    'qty'                    => $qty,
                    'price'                  => $price,
                    'amount'                 => $item['amount'],
                    'unit_type'              => $unitType,
                    'remarks'                => $item['remarks'] ?? $item['description'] ?? '',
                    'discount'               => $item['discount_value'] ?? 0,
                    'discount_type'          => $item['discount_type'] ?? 0,
                    'special_discount_value' => $item['special_discount_value'] ?? 0,
                    'special_discount_type'  => $item['special_discount_type'] ?? 'percent',
                    'tax_rate'               => (float)($item['tax_rate'] ?? 0),
                    'start_date'             => convertDate($item['start_date']),
                    'end_date'               => convertDate($item['end_date']),
                    'created_at'             => now(),
                    'updated_at'             => now(),
                ];
            }

            if (!empty($itemRows)) {
                DB::table('invoice_items')->insert($itemRows);
            }

            $totalAmount = array_sum(array_column($itemRows, 'amount'));

            DB::table('invoices')
                ->where('id', $id)
                ->update([
                    'amount'         => $totalAmount,
                    'amount_payable' => $totalAmount,
                    'updated_at'     => now(),
                ]);

            DB::commit();

            return DV::depends(1, ['invoices' => $inputs, 'id' => $id]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Invoice save failed: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return DV::error('Failed to save invoice: ' . $e->getMessage());
        }
    }

    // ======================= Receive Payment ========================
    public function receive($data, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        $invoice_id     = (int)($data['invoice_id'] ?? 0);
        $remarks        = trim($data['remarks'] ?? '');
        $pmt_breakdowns = $data['pmt_breakdowns'] ?? $data['payment_breakdown'] ?? [];

        if ($invoice_id <= 0) {
            return DV::error('Invalid invoice ID.');
        }

        if (empty($pmt_breakdowns)) {
            return DV::error('Please add at least one payment method.');
        }

        DB::beginTransaction();

        try {
            $invoice = DB::table('invoices')->where('id', $invoice_id)->first();
            if (!$invoice) {
                throw new \Exception('Invoice not found.');
            }

            if ((int)$invoice->payment_status_id === 1) {
                throw new \Exception('Invoice is already fully paid.');
            }

            $total_received = array_sum(array_column($pmt_breakdowns, 'amount'));

            $receiptData = [
                'receipt_date'   => now()->toDateString(),
                'invoice_id'     => $invoice_id,
                'tenant_id'      => $invoice->tenant_id,
                'branch_id'      => $ss->branch_id ?? $invoice->branch_id ?? 1,
                'total_received' => $total_received,
                'remarks'        => $remarks,
                'create_user'    => $ss->name ?? 'Admin',
                'create_uid'     => $ss->uid ?? 1,
            ];

            $receipt_id = DBX::saveData($ss, 'receipts', [], $receiptData, [], 1);
            if (!$receipt_id) {
                throw new \Exception('Failed to create receipt.');
            }

            // Generate receipt code
            $codeRes = setOfficialCode(
                $receiptData['branch_id'],
                'receipt_code_control',
                'receipts',
                ['id' => $receipt_id],
                'R-',
                5,
                null
            );


            $methodMap = [
                'cash'          => 'Cash',
                'bank'          => 'Bank',
                'card'          => 'Card',
                'cheque'        => 'Cheque'
            ];
            $detailRows = [];
            foreach ($pmt_breakdowns as $bd) {
                $method = $methodMap[strtolower(trim($bd['method'] ?? ''))] ?? 'Cash';

                $bank_id = $bd['bank_id'] ?? null;
                $bank_name = null;

                if ($bank_id) {
                    $bank_name = DB::table('banks')
                        ->where('id', $bank_id)
                        ->value('name');
                }



                $detailRows[] = [
                    'receipt_id'       => $receipt_id,
                    'bank_id'          => $bank_id,
                    'method'           => $method,
                    'amount'           => (float)($bd['amount'] ?? 0),
                    'currency_code'    => $bd['currency_code'] ?? 'USD',
                    'bank_ref_number'  => $bd['bank_ref_number'] ?? null,
                    'bank_name'        => $bank_name ?? $bd['bank_name'] ?? null,

                    'card_number'      => $bd['card_number'] ?? null,
                    'card_type'        => in_array(strtolower($bd['card_type'] ?? ''), ['credit', 'debit'])
                        ? strtolower($bd['card_type'])
                        : null,

                    'cheque_number'    => $bd['cheque_number'] ?? null,
                    'cheque_bank_name' => ($method === 'cheque')
                        ? ($bank_name ?? $bd['cheque_bank_name'] ?? null)
                        : null,

                    'remarks'          => $bd['remarks'] ?? $remarks,
                    'created_at'       => now(),
                ];
            }

            if (!empty($detailRows)) {
                DB::table('receipt_breakdowns')->insert($detailRows);
            }

            // Update invoice payment status
            $new_paid_amount = (float)$invoice->paid_amount + $total_received;
            $total_invoice_amount = (float)$invoice->amount;
            $new_due_amount = max(0, $total_invoice_amount - $new_paid_amount);

            $payment_status_id = 2;
            $is_paid = 0;

            if ($new_due_amount <= 0.001) {
                $payment_status_id = 1;
                $is_paid = 1;
            } elseif ($new_paid_amount > 0) {
                $payment_status_id = 3; // partial
            }

            DB::table('invoices')
                ->where('id', $invoice_id)
                ->update([
                    'paid_amount'       => $new_paid_amount,
                    'due_amount'        => $new_due_amount,
                    'is_paid'           => $is_paid,
                    'payment_status_id' => $payment_status_id,
                    'updated_at'        => now(),
                    'update_user'       => $ss->name ?? 'Admin',
                    'update_uid'        => $ss->uid ?? 1,
                ]);

            DB::commit();

            return DV::depends(1, [
                'receipt_id'     => $receipt_id,
                'code'           => $codeRes->code ?? 'R-' . str_pad($receipt_id, 5, '0', STR_PAD_LEFT),
                'total_received' => $total_received,
                'new_paid_amount' => $new_paid_amount,
                'is_fully_paid'  => (bool)$is_paid
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Receive payment failed: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return DV::error('Failed to receive payment: ' . $e->getMessage());
        }
    }


    public static function checkDuplicateSpaceId($tenant_id, $invoice_id = null)
    {
        $query = DB::table('invoices as i')
            ->where('i.tenant_id', $tenant_id);

        if ($invoice_id) {
            $query->where('i.id', '!=', $invoice_id);
        }

        return $query->value('id');
    }
    public function getListPaginate($arr, $ss)
    {
        $d            = (object) $arr;
        $current_page = max(1, (int)($d->current_page ?? 1));
        $per_page     = max(10, (int)($d->per_page ?? 10));
        $skip         = ($current_page - 1) * $per_page;

        $query = DB::table('invoices as i')
            ->leftJoin('tenants as t',           't.id',  '=', 'i.tenant_id')
            ->leftJoin('payment_statuses as ps', 'ps.id', '=', 'i.payment_status_id')
            ->leftJoin('contracts as ct',        'ct.id', '=', 'i.contract_id')
            ->leftJoin('building_spaces as bs',  'bs.id', '=', 'i.space_id')
            ->leftJoin('invoice_items as ii',    'ii.invoice_id', '=', 'i.id')
            ->select([
                'i.id',
                'i.code',
                'i.tenant_id',
                'i.space_id',
                'i.amount',
                'i.paid_amount',
                'i.due_date',
                'i.invoice_date',
                'i.start_time',
                'i.created_at',
                'i.updated_at',
                'i.update_user',
                'i.payment_status_id',
                'i.contract_id',
                't.name as tenant_name',
                't.legal_name as tenant_legal_name',
                't.phone_number as tenant_phone',
                't.email as tenant_email',
                'ps.name as payment_status_name',
                'bs.code as space_code',
                'ct.price as contract_price',
                DB::raw("GROUP_CONCAT(DISTINCT ii.remarks SEPARATOR '; ') as remarks"),
                DB::raw('(i.amount - COALESCE(i.paid_amount, 0)) as balance')
            ])
            ->groupBy('i.id')
            ->orderByDesc('i.id');

        // Filters
        if (!empty($d->tenant_id)) {
            $query->where('i.tenant_id', $d->tenant_id);
        }

        if (!empty($d->payment_status_id)) {
            $query->where('i.payment_status_id', $d->payment_status_id);
        }

        if (!empty($d->search_value)) {
            $search = '%' . $d->search_value . '%';
            $query->where(function ($q) use ($search) {
                $q->where('i.code',    'like', $search)
                    ->orWhere('t.name',  'like', $search)
                    ->orWhere('bs.code', 'like', $search);
            });
        }

        $count = (clone $query)->count();
        $rows  = $query->skip($skip)->take($per_page)->get();

        foreach ($rows as $row) {
            $row = setOfficialDates($row, ['due_date', 'invoice_date'], ['updated_at', 'created_at'], []);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function getInvoiceDetails($id)
    {
        $header = DB::table('invoices as i')
            ->leftJoin('tenants as t',           't.id',  '=', 'i.tenant_id')
            ->leftJoin('payment_statuses as ps', 'ps.id', '=', 'i.payment_status_id')
            ->leftJoin('contracts as ct',        'ct.id', '=', 'i.contract_id')
            ->leftJoin('building_spaces as bs',  'bs.id', '=', 'i.space_id')
            ->where('i.id', $id)
            ->select(
                'i.id',
                'i.tenant_id',
                'i.space_id',
                'i.code',
                'i.amount',
                'i.paid_amount',
                'i.start_time',
                DB::raw('(i.amount - COALESCE(i.paid_amount, 0)) as balance'),
                'i.payment_status_id',
                'i.contract_id',
                't.name as tenant_name',
                't.phone_number as tenant_phone',
                't.email as tenant_email',
                'bs.code as space_code',
                'ct.legal_name as contract_legal_name'

            )
            ->first();

        if (!$header) {
            return null;
        }

        $header->items = DB::table('invoice_items as ii')
            ->leftJoin('services as s', function ($join) {
                $join->on('s.id', '=', 'ii.item_id')
                    ->where('ii.type', '=', 'service');
            })
            ->leftJoin('contracts as c', function ($join) {
                $join->on('c.id', '=', 'ii.item_id')
                    ->where('ii.type', '=', 'rent');
            })
            ->where('ii.invoice_id', $id)
            ->select(
                'ii.id',
                'ii.invoice_id',
                'ii.item_id',
                'ii.type',
                'ii.qty',
                'ii.unit_type',
                'ii.remarks',
                'ii.amount',
                'ii.discount',
                'ii.special_discount_value',
                'ii.special_discount_type',
                'ii.start_date',
                'ii.end_date',
                'ii.tax_rate',
                'ii.price',
                DB::raw("
                    COALESCE(
                        s.name,
                        CASE
                            WHEN ii.type = 'rent' THEN CONCAT('Rent - ', ii.remarks)
                            ELSE ii.remarks
                        END,
                        '—'
                    ) as item_name
                ")
            )
            ->get();

        return $header;
    }

    public static function getFormOptions($id, $ss)
    {
        return (object) [
            'invoice_details' => $id ? self::getInvoiceDetails($id) : null,
            'buildings'       => GeneralSettings::options_building($ss),
            'statuses'        => GeneralSettings::options_payment_status($ss),
            'tenants'         => GeneralSettings::options_tenant_with_active_contract($ss),
            'services'        => GeneralSettings::options_service($ss),
            'banks'           => GeneralSettings::options_bank($ss),
            'business_types'  => GeneralSettings::options_business_type($ss),
        ];
    }

    // public function deleteInvoice($id = null)
    // {
    //     $id = $id ?? $this->id;
    //     $X  = self::deleteBy(['id' => $id]);
    //     return DV::depends($X, 'Failed to delete invoice.');
    // }

    public function deleteInvoice($id = null)
    {
        $id = $id ?? $this->id;
        DB::beginTransaction();
        try {
            DB::table('invoice_items')->where('invoice_id', $id)->delete();
            $deleted = DB::table('invoices')->where('id', $id)->delete();

            if ($deleted) {
                DB::commit();
                return DV::depends(1, 'Invoice and items deleted successfully.');
            }

            throw new \Exception('Invoice record not found.');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Delete invoice failed: " . $e->getMessage());
            return DV::error('Failed to delete invoice and items: ' . $e->getMessage());
        }
    }

}
