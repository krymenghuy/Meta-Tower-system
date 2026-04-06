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

    // ======================= Upsert Invoice ========================
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
        $isNew  = !$id;
        $items  = $arr['items'] ?? [];

        unset($inputs['items']);

        if (empty($items)) {
            return DV::error('Please add at least one item.');
        }

        // Handle invoice_date
        if ($isNew) {
            $inputs['invoice_date'] = $inputs['invoice_date'] ?? now()->toDateString();
        } else {
            unset($inputs['invoice_date']); // Protect original date on update
        }

        DB::beginTransaction();

        try {
            $id = DBX::saveData($ss, 'invoices', ['id' => $id], $inputs, [], 1);
            if (!$id) {
                throw new \Exception("Failed to save invoice header.");
            }

            // Generate official code only on creation
            if ($isNew) {
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
            }

            // Delete old items and re-insert new ones
            DB::table('invoice_items')->where('invoice_id', $id)->delete();

            $itemRows = [];
            foreach ($items as $item) {
                $itemType = strtolower($item['type'] ?? $item['item_type'] ?? 'service');
                $itemId   = $item['item_id'] ?? null;
                $qty      = (float)($item['qty'] ?? 1);
                $price    = (float)($item['price'] ?? 0);
                $unitType = $item['unit_type'] ?? '-';

                // Auto-fill price if not provided
                if ($price <= 0) {
                    if ($itemType === 'rent' && $itemId) {
                        $price = (float) DB::table('contracts')->where('id', $itemId)->value('price');
                    } elseif ($itemType === 'service' && $itemId) {
                        $service = DB::table('services')
                            ->where('id', $itemId)
                            ->select('price', 'unit_type')
                            ->first();
                        if ($service) {
                            $price    = (float)$service->price;
                            $unitType = $service->unit_type ?? $unitType;
                        }
                    }
                }

                $amount = $item['amount'] ?? ($qty * $price);

                $itemRows[] = [
                    'invoice_id'             => $id,
                    'item_id'                => $itemId,
                    'type'                   => $itemType,
                    'qty'                    => $qty,
                    'price'                  => $price,
                    'amount'                 => $amount,
                    'unit_type'              => $unitType,
                    'remarks'                => $item['remarks'] ?? $item['description'] ?? '',
                    'discount'               => $item['discount_value'] ?? 0,
                    'discount_type'          => $item['discount_type'] ?? 0,
                    'special_discount_value' => $item['special_discount_value'] ?? 0,
                    'special_discount_type'  => $item['special_discount_type'] ?? 'percent',
                    'tax_rate'               => (float)($item['tax_rate'] ?? 0),
                    'start_date'             => $item['start_date'] ?? null,
                    'end_date'               => $item['end_date'] ?? null,
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

            return DV::depends(1, ['id' => $id, 'invoice' => $inputs]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Invoice save failed: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
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

            $codeRes = setOfficialCode(
                $receiptData['branch_id'],
                'receipt_code_control',
                'receipts',
                ['id' => $receipt_id],
                'R-',
                5,
                null
            );

            // Build breakdown rows
            $methodMap = [
                'cash'   => 'Cash',
                'bank'   => 'Bank',
                'card'   => 'Card',
                'cheque' => 'Cheque'
            ];

            $detailRows = [];
            foreach ($pmt_breakdowns as $bd) {
                $method = $methodMap[strtolower(trim($bd['method'] ?? ''))] ?? 'Cash';

                $bank_id   = $bd['bank_id'] ?? null;
                $bank_name = $bank_id 
                    ? DB::table('banks')->where('id', $bank_id)->value('name') 
                    : null;

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
                                            ? strtolower($bd['card_type']) : null,
                    'cheque_number'    => $bd['cheque_number'] ?? null,
                    'cheque_bank_name' => ($method === 'Cheque') 
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
            $new_due_amount  = max(0, (float)$invoice->amount - $new_paid_amount);

            $payment_status_id = ($new_due_amount <= 0.001) ? 1 : ($new_paid_amount > 0 ? 3 : 2);
            $is_paid           = ($new_due_amount <= 0.001) ? 1 : 0;

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
                'new_paid_amount'=> $new_paid_amount,
                'is_fully_paid'  => (bool)$is_paid
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Receive payment failed: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return DV::error('Failed to receive payment: ' . $e->getMessage());
        }
    }

    // ======================= List Paginate ========================
    public function getListPaginate($arr, $ss)
    {
        $d = (object) $arr;

        $current_page = max(1, (int)($d->current_page ?? 1));
        $per_page     = max(10, (int)($d->per_page ?? 10));
        $skip         = ($current_page - 1) * $per_page;

        $query = DB::table('invoices as i')
            ->leftJoin('tenants as t',           't.id', '=', 'i.tenant_id')
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
                DB::raw('(i.amount - COALESCE(i.paid_amount, 0)) as balance'),
                'i.due_date',
                'i.invoice_date',
                'i.start_time',
                'i.created_at',
                'i.updated_at',
                'i.update_user',
                'i.payment_status_id',
                'i.contract_id',
                't.name as tenant_name',
                'ps.name as payment_status_name',
                'bs.code as space_code',
                DB::raw("GROUP_CONCAT(DISTINCT ii.remarks SEPARATOR '; ') as remarks")
            ])
            ->groupBy('i.id')
            ->orderByDesc('i.id');

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
            $row = setOfficialDates($row, ['due_date'], ['updated_at', 'created_at', 'invoice_date'], []);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    // ======================= Update Payment Status ========================
    public function setInvoiceStatus($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        $id        = $arr['id'] ?? null;
        $status_id = $arr['payment_status_id'] ?? null;

        if (!$id || !$status_id) {
            return DV::error('Missing required parameters: id and payment_status_id');
        }

        $statusExists = DB::table('payment_statuses')->where('id', $status_id)->exists();
        if (!$statusExists) {
            return DV::error('Invalid payment status.');
        }

        $data = [
            'payment_status_id' => $status_id,
            'update_user'       => $ss->name ?? $ss->full_name ?? 'System',
            'update_uid'        => $ss->uid ?? $ss->id ?? 1,
            'updated_at'        => now(),
        ];

        $updated = DB::table('invoices')
            ->where('id', $id)
            ->update($data);

        if ($updated === 0) {
            return DV::error('Invoice not found or no changes made.');
        }

        return DV::success([
            'message'           => 'Payment status updated successfully',
            'id'                => $id,
            'payment_status_id' => $status_id,
        ]);
    }

    // ======================= Other Methods ========================
    public static function checkDuplicateSpaceId($tenant_id, $invoice_id = null)
    {
        $query = DB::table('invoices as i')
            ->where('i.tenant_id', $tenant_id);

        if ($invoice_id) {
            $query->where('i.id', '!=', $invoice_id);
        }

        return $query->value('id');
    }

    public static function getInvoiceDetails($id)
    {
        $header = DB::table('invoices as i')
            ->leftJoin('tenants as t',           't.id', '=', 'i.tenant_id')
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
                $join->on('s.id', '=', 'ii.item_id')->where('ii.type', '=', 'service');
            })
            ->leftJoin('contracts as c', function ($join) {
                $join->on('c.id', '=', 'ii.item_id')->where('ii.type', '=', 'rent');
            })
            ->where('ii.invoice_id', $id)
            ->select(
                'ii.id', 'ii.item_id', 'ii.type', 'ii.qty', 'ii.unit_type',
                'ii.remarks', 'ii.amount', 'ii.discount', 'ii.special_discount_value',
                'ii.special_discount_type', 'ii.start_date', 'ii.end_date',
                'ii.tax_rate', 'ii.price',
                DB::raw("
                    COALESCE(
                        s.name,
                        CASE WHEN ii.type = 'rent' THEN CONCAT('Rent - ', ii.remarks)
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

    public function deleteInvoice($id = null)
    {
        $id = $id ?? $this->id;
        $X  = self::deleteBy(['id' => $id]);
        return DV::depends($X, 'Failed to delete invoice.');
    }
}