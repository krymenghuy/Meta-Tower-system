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
        'contract_id'       => '0|integer|exists:contracts,id',
        'business_type_id'  => '0|integer|exists:business_types,id',
        'service_id'        => '0|integer|exists:services,id',
        'due_date'          => '1|date',
        'payment_status_id' => '0|integer|exists:payment_statuses,id|default=2',
        'purpose'           => '0|string|max:200',
        'remarks'           => '0|string|max:500',
        'currency_code'     => '0|string|max:10',
        'items'             => '1|array|min:1',
    ];

    $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang ?? 'en', 0, null);
    if ($res->error) {
        return DV::error($res->error);
    }

    $inputs = $res->values;
    $items  = $arr['items'] ?? [];
    unset($inputs['items']);

    if (empty($items)) {
        return DV::error('Please add at least one item.');
    }

    // Validate each item
    foreach ($items as $index => $item) {
        if (empty(trim($item['description'] ?? ''))) {
            return DV::error("Item #" . ($index + 1) . ": description is required.");
        }
        if (!isset($item['amount']) || (float)$item['amount'] < 0.01) {
            return DV::error("Item #" . ($index + 1) . ": amount must be at least 0.01.");
        }

        // Discount validation
        $discType  = $item['discount_type'] ?? 'fixed';
        $discValue = (float)($item['discount_value'] ?? $item['discount'] ?? 0);
        if ($discValue < 0) {
            return DV::error("Item #" . ($index + 1) . ": discount cannot be negative.");
        }
        if ($discType === 'percent' && $discValue > 100) {
            return DV::error("Item #" . ($index + 1) . ": percentage discount cannot exceed 100%.");
        }

        // Tax validation
        $taxType  = $item['tax_type'] ?? 'fixed';
        $taxValue = (float)($item['tax_value'] ?? $item['tax'] ?? 0);
        if ($taxValue < 0) {
            return DV::error("Item #" . ($index + 1) . ": tax cannot be negative.");
        }
        if ($taxType === 'percent' && $taxValue > 100) {
            return DV::error("Item #" . ($index + 1) . ": percentage tax cannot exceed 100%.");
        }
    }

    DB::beginTransaction();

    try {
        $created    = !$id;
        $invoice_id = DBX::saveData($ss, 'invoices', ['id' => $id], $inputs, [], 1);

        if (!$invoice_id) {
            throw new \Exception("Failed to save invoice header.");
        }

        $codeRes = null;
        if ($created && $branch_id) {
            $codeRes = setOfficialCodeInvoice(
                $branch_id,
                'invoice_code_control',
                'invoices',
                ['id' => $invoice_id],
                'I',
                5,
                null
            );

            if (!$codeRes || !isset($codeRes->status) || $codeRes->status !== 'OK') {
                \Log::warning("Invoice code generation failed for id: {$invoice_id}");
            }
        }

        if (!$created) {
            DB::table('invoice_items')->where('invoice_id', $invoice_id)->delete();
        }

        $itemRows = [];
        $grandTotal = 0;  // ← Declare here

        foreach ($items as $item) {
            $baseAmount = (float)($item['amount'] ?? 0);

            $discType   = $item['discount_type'] ?? 'fixed';
            $discValue  = (float)($item['discount_value'] ?? $item['discount'] ?? 0);
            $discount   = $discType === 'percent'
                ? $baseAmount * ($discValue / 100)
                : $discValue;

            $taxType    = $item['tax_type'] ?? 'fixed';
            $taxValue   = (float)($item['tax_value'] ?? $item['tax'] ?? 0);
            $tax        = $taxType === 'percent'
                ? $baseAmount * ($taxValue / 100)
                : $taxValue;

            $netAmount = $baseAmount - $discount + $tax;
            $grandTotal += $netAmount;  // ← Accumulate here

            $itemRows[] = [
                'invoice_id'      => $invoice_id,
                'service_id'      => $item['service_id'] ?? null,
                'type'            => $item['type']       ?? null,
                'description'     => trim($item['description']),
                'amount'          => $baseAmount,
                'discount'        => $discount,
                'discount_type'   => $discType,
                'discount_value'  => $discValue,
                'tax'             => $tax,
                'tax_type'        => $taxType,
                'tax_value'       => $taxValue,
                'notes'           => $item['notes'] ?? null,
                'created_at'      => now(),
                'updated_at'      => now(),
            ];
        }

        DB::table('invoice_items')->insert($itemRows);

        // Update invoice header with correct grand total
        DB::table('invoices')
            ->where('id', $invoice_id)
            ->update([
                'amount'     => $grandTotal,   // ← Now using the real calculated value
                'updated_at' => now(),
            ]);

        DB::commit();

        $return_data = ['id' => $invoice_id];
        if (isset($codeRes->code)) {
            $return_data['code'] = $codeRes->code;
        }

        return DV::depends(1, $return_data);

    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error("Invoice save failed: " . $e->getMessage(), [
            'trace' => $e->getTraceAsString()
        ]);
        return DV::error('Failed to save invoice: ' . $e->getMessage());
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
        $per_page     = (int)($d->per_page ?? 10);
        $skip         = ($current_page - 1) * $per_page;

        $query = DB::table('invoices as i')
            ->leftJoin('tenants as t',           't.id',  '=', 'i.tenant_id')
            ->leftJoin('services as s',          's.id',  '=', 'i.service_id')
            ->leftJoin('business_types as bt',  'bt.id',  '=', 'i.business_type_id')
            ->leftJoin('payment_statuses as ps', 'ps.id', '=', 'i.payment_status_id')
            ->leftJoin('contracts as ct',        'ct.id', '=', 'i.contract_id')
            ->leftJoin('building_spaces as bs',  'bs.id', '=', 'i.space_id')
            ->select([
                'i.id',
                'i.code',
                'i.tenant_id',
                'i.space_id',
                'i.amount',
                'i.paid_amount',
                DB::raw('(i.amount - COALESCE(i.paid_amount, 0)) as balance'),
                'i.due_date',
                'i.created_at',
                'i.updated_at',
                'i.update_user',
                'i.payment_status_id',
                'i.remarks',
                'i.currency_code',
                'i.contract_id',
                't.name as tenant_name',
                't.legal_name as tenant_legal_name',
                't.phone_number as tenant_phone',
                't.email as tenant_email',
                'ps.name as payment_status_name',
                'bs.code as space_code',
                'ct.price as contract_price',
                'ct.price_type as price_type_id',
                'ct.start_date as contract_start',
                'ct.end_date as contract_end',
                'ct.sqm_size as contract_sqm_size',
                's.name as service_name',
                's.price as service_price',
                'bt.name as business_type_name',
            ])
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

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function getInvoiceDetails($id)
    {
        $header = DB::table('invoices as i')
            ->leftJoin('tenants as t',           't.id',  '=', 'i.tenant_id')
            ->leftJoin('services as s',          's.id',  '=', 'i.service_id')
            ->leftJoin('payment_statuses as ps', 'ps.id', '=', 'i.payment_status_id')
            ->leftJoin('contracts as ct',        'ct.id', '=', 'i.contract_id')
            ->leftJoin('building_spaces as bs',  'bs.id', '=', 'i.space_id')
            ->leftJoin('business_types as bt',   'bt.id', '=', 'i.business_type_id')
            ->where('i.id', $id)
            ->select(
                'i.id',
                'i.tenant_id',
                'i.space_id',
                'i.code',
                'i.amount',
                'i.paid_amount',
                DB::raw('(i.amount - COALESCE(i.paid_amount, 0)) as balance'),
                'i.due_date',
                'i.created_at',
                'i.updated_at',
                'i.payment_status_id',
                'i.purpose',
                'i.remarks',
                'i.currency_code',
                'i.contract_id',
                't.name as tenant_name',
                't.legal_name as tenant_legal_name',
                't.phone_number as tenant_phone',
                't.email as tenant_email',
                't.address as tenant_address',
                'bs.code as space_code',
                'ct.price as contract_price',
                'ct.sqm_size as contract_sqm_size',
                'ct.price_type as price_type_id',
                'ct.start_date as contract_start_date',
                'ct.end_date as contract_end_date',
                'ps.name as payment_status_name',
                's.name as service_name',
                's.price as service_price',
                'bt.name as business_type_name',
            )
            ->first();

        if (!$header) {
            return null;
        }

        // Attach line items with all fields
        $header->items = DB::table('invoice_items as ii')
            ->leftJoin('services as s', 's.id', '=', 'ii.service_id')
            ->where('ii.invoice_id', $id)
            ->select(
                'ii.id',
                'ii.invoice_id',
                'ii.service_id',
                'ii.type',
                'ii.description',
                'ii.amount',
                'ii.discount',
                'ii.discount_type',
                'ii.discount_value',
                'ii.tax',
                'ii.tax_type',
                'ii.tax_value',
                'ii.notes',
                's.name as service_name',
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
