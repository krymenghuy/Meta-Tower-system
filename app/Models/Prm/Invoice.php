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
            'due_date'          => '1|date',
            'payment_status_id' => '0|integer|exists:payment_statuses,id|default=2',
            'remarks'           => '0|string|max:500',
            'items'             => '1|array|min:1',
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
        $items  = $arr['items'] ?? [];
        unset($inputs['items']);

        if (empty($items)) {
            return DV::error('Please add at least one item.');
        }

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

                    if (!in_array($itemType, ['service', 'rent', 'utility'])) {
                        \Log::warning("Invalid item type received, forced to 'service'", [
                            'received' => $item['type'] ?? 'missing',
                            'item'     => $item
                        ]);
                        $itemType = 'service';
                    }

                if (!in_array($itemType, ['service', 'rent','utility',])) {
                    $itemType = 'service';
                }

                $itemId = $item['item_id']  ?? null;
                $qty    = (int)($item['qty'] ?? 1);
                $price  = (float)($item['price'] ?? 0);
                $unitType = '-';

                // Auto-load price from contract when type = rent
                if ($itemType === 'rent' && $itemId) {
                    $contractPrice = DB::table('contracts')
                        ->where('id', $itemId)
                        ->value('price');

                    if ($contractPrice !== null) {
                        $price = (float)$contractPrice;
                    }
                }
                // Auto-load price + unit_type from service
                else if ($itemType === 'service' && $itemId) {
                    $serviceData = DB::table('services')
                        ->where('id', $itemId)
                        ->select('price', 'unit_type')
                        ->first();

                    if ($serviceData) {
                        $price    = (float)$serviceData->price;
                        $unitType = $serviceData->unit_type ?? '-';
                    }
                }

                $baseAmount = $qty * $price;

                // === FIXED CALCULATION (your requested example) ===
                $discountValue   = (float)($item['discount'] ?? $item['special_discount_value'] ?? 0);
                $discountType    = $item['special_discount_type'] ?? 'percent';
                $taxRate         = (float)($item['tax_rate'] ?? 0);

                // Step 1: Apply discount (10% or $10)
                if ($discountType === 'percent') {
                    $discountAmount = $baseAmount * ($discountValue / 100);
                } else {
                    $discountAmount = $discountValue;
                }
                $afterDiscount = $baseAmount - $discountAmount;

                // Step 2: Apply tax on the discounted amount (10%)
                $taxAmount = $afterDiscount * ($taxRate / 100);

                // Final net amount
                $finalAmount = $afterDiscount + $taxAmount;

                $amount = round($finalAmount, 2);


                $itemRows[] = [
                    'invoice_id'              => $id,
                    'item_id'                 => $itemId,
                    'type'                    => $itemType,
                    'qty'                     => $qty,
                    'unit_type'               => $unitType,
                    'remarks'                 => $item['remarks'] ?? $item['description'] ?? '',
                    'amount'                  => $amount,
                    'discount'                => (float)($item['discount'] ?? 0),
                    'special_discount_value'  => $discountValue,
                    'special_discount_type'   => in_array($item['special_discount_type'] ?? '', ['amount', 'percent'])
                                                    ? $item['special_discount_type']
                                                    : 'percent',
                    'tax_rate'                => $taxRate,
                    'created_at'              => now(),
                    'updated_at'              => now(),
                    'start_date'              => $item['start_date'] ?? null,
                    'end_date'                => $item['end_date']   ?? null,
                ];
            }

            if (!empty($itemRows)) {
                DB::table('invoice_items')->insert($itemRows);
            }

            // Calculate and update total
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
                DB::raw('(i.amount - COALESCE(i.paid_amount, 0)) as balance'),
                'i.payment_status_id',
                'i.remarks',
                'i.contract_id',
                't.name as tenant_name',
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
                DB::raw("
                    COALESCE(
                        s.name,
                        CASE
                            WHEN ii.type = 'rent' THEN CONCAT('Rent - ', ii.remarks)
                            ELSE ii.remarks
                        END,
                        '—'
                    ) as item_name
                "),
                DB::raw("
                    COALESCE(
                        NULLIF(ii.unit_type, ''),
                        '—'
                    ) as unit_type_display"
                ),
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
