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
    protected $table = 'invoices';
    protected $userInfo = null;
    protected static $img_dir = 'invoices';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function upsert($arr = [], $id = null, $ss = null)
    {
        $id        = $id ?? $this->id;
        $ss        = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id ?? null;

        $v_rule = [
            'tenant_id'         => '1|integer|exists:tenants,id',
            'building_id'       => '0|integer|exists:buildings,id',
            'space_id'          => '1|integer|exists:building_spaces,id',
            'contract_id'       => '0|integer|exists:contracts,id',
            'due_date'          => '1|date|after_or_equal:today',
            'invoice_date'      => '0|date',
            'payment_status_id' => '0|integer|exists:payment_statuses,id|default=2',
            'purpose'           => '0|string|max:200',
            'remarks'           => '0|string|max:500',
            'currency_code'     => '0|string|size:3',
            'items'             => '1|array|min:1',
        ];

        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang ?? 'en', 0, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        // Pull items from original $arr (not from validated inputs)
        $items = $arr['items'] ?? [];
        unset($inputs['items']);

        // Validate items manually
        if (empty($items)) {
            return DV::error('Please add at least one item.');
        }

        foreach ($items as $index => $item) {
            if (empty(trim($item['description'] ?? ''))) {
                return DV::error("Item #" . ($index + 1) . ": description is required.");
            }
            if (!isset($item['amount']) || (float)$item['amount'] < 0.01) {
                return DV::error("Item #" . ($index + 1) . ": amount must be at least 0.01.");
            }
        }

        // Calculate totals from items
        $subtotal = $total_disc = $total_tax = 0;
        foreach ($items as $item) {
            $subtotal   += (float)($item['amount']   ?? 0);
            $total_disc += (float)($item['discount'] ?? 0);
            $total_tax  += (float)($item['tax']      ?? 0);
        }

        $inputs['amount']     = $subtotal - $total_disc + $total_tax;
        $inputs['updated_at'] = now();

        DB::beginTransaction();

        try {
            $created    = !$id;
            $invoice_id = DBX::saveData($ss, 'invoices', ['id' => $id], $inputs, [], 1);

            if (!$invoice_id) {
                throw new \Exception("Failed to save invoice header.");
            }

            // Generate code on create
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

            // Clear old items on update
            if (!$created) {
                DB::table('invoice_items')->where('invoice_id', $invoice_id)->delete();
            }

            // Insert line items
            $itemRows = [];
            foreach ($items as $item) {
                $itemRows[] = [
                    'invoice_id'  => $invoice_id,
                    'service_id'  => $item['service_id'] ?? null,
                    'description' => trim($item['description']),
                    'amount'      => (float)($item['amount']   ?? 0),
                    'discount'    => (float)($item['discount'] ?? 0),
                    'tax'         => (float)($item['tax']      ?? 0),
                    'notes'       => $item['notes'] ?? null,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ];
            }

            DB::table('invoice_items')->insert($itemRows);

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

    public static function checkDuplicateSpaceId($building_id, $tenant_id, $invoice_id = null)
    {
        $query = DB::table('invoices as i')
            ->where('i.building_id', $building_id)
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
            ->leftJoin('tenants as t',          't.id',  '=', 'i.tenant_id')
            ->leftJoin('space_types as st',     'st.id', '=', 'i.space_type_id')
            ->leftJoin('payment_statuses as ps','ps.id', '=', 'i.payment_status_id')
            ->leftJoin('contracts as ct',       'ct.id', '=', 'i.contract_id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->leftJoin('buildings as bb',       'bb.id', '=', 'i.building_id')
            ->select([
                'i.id',
                'i.code',
                'i.tenant_id',
                'i.building_id',
                'bb.name as building_name',
                'i.space_id',
                'i.amount',
                'i.paid_amount',
                DB::raw('(i.amount - COALESCE(i.paid_amount, 0)) as balance'),
                'i.due_date',
                'i.invoice_date',
                'i.created_at',
                'i.updated_at',
                'i.update_user',
                'i.payment_status_id',
                'i.purpose',
                'i.remarks',
                'i.currency_code',
                'i.contract_id',
                't.name as tenant_name',
                't.legal_name as tenant_legal_name',
                't.phone_number as tenant_phone',
                't.email as tenant_email',
                'ps.name as payment_status_name',
                'st.name as space_type_name',
                'bs.code as space_code',
                'ct.price as contract_price',
                'ct.price_type as price_type_id',
                'ct.start_date as contract_start',
                'ct.end_date as contract_end',
                'ct.sqm_size as contract_sqm_size',
            ])
            ->orderByDesc('i.id');

        if (!empty($d->tenant_id)) {
            $query->where('i.tenant_id', $d->tenant_id);
        }

        if (!empty($d->building_id)) {
            $query->where('i.building_id', $d->building_id);
        }

        if (!empty($d->payment_status_id)) {
            $query->where('i.payment_status_id', $d->payment_status_id);
        }

        if (!empty($d->search_value)) {
            $search = '%' . $d->search_value . '%';
            $query->where(function ($q) use ($search) {
                $q->where('i.code',      'like', $search)
                  ->orWhere('t.name',    'like', $search)
                  ->orWhere('bb.name',   'like', $search)
                  ->orWhere('bs.code',   'like', $search);
            });
        }

        $count = (clone $query)->count();
        $rows  = $query->skip($skip)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function getInvoiceDetails($id)
    {
        $header = DB::table('invoices as i')
            ->leftJoin('tenants as t',          't.id',  '=', 'i.tenant_id')
            ->leftJoin('space_types as st',     'st.id', '=', 'i.space_type_id')
            ->leftJoin('payment_statuses as ps','ps.id', '=', 'i.payment_status_id')
            ->leftJoin('contracts as ct',       'ct.id', '=', 'i.contract_id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->leftJoin('buildings as b',        'b.id',  '=', 'i.building_id')
            ->where('i.id', $id)
            ->select(
                'i.id',
                'i.tenant_id',
                'i.building_id',
                'i.space_id',
                'i.code',
                'i.amount',
                'i.paid_amount',
                DB::raw('(i.amount - COALESCE(i.paid_amount, 0)) as balance'),
                'i.due_date',
                'i.invoice_date',
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
                'st.name as space_type_name',
                'bs.code as space_code',
                'b.name as building_name',
                'ct.price as contract_price',
                'ct.sqm_size as contract_sqm_size',
                'ct.price_type as price_type_id',
                'ct.start_date as contract_start_date',
                'ct.end_date as contract_end_date',
                'ps.name as payment_status_name',
            )
            ->first();

        if (!$header) {
            return null;
        }

        // Attach line items
        $header->items = DB::table('invoice_items')
            ->where('invoice_id', $id)
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
        ];
    }

    public function deleteInvoice($id = null)
    {
        $id = $id ?? $this->id;
        $X  = self::deleteBy(['id' => $id]);
        return DV::depends($X, 'Failed to delete invoice.');
    }
}
