<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DV;
use DBX;

class Invoice
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'invoices';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function saveInvoice($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'tenant_id'         => '1|integer|exists:tenants,id',
            'building_id'       => '1|integer|exists:buildings,id',
            'floor_id'          => '1|integer|exists:floors,id',
            'space_id'          => '1|integer|exists:building_spaces,id',
            'contract_id'       => '1|integer|exists:contracts,id',
            'amount'            => '1|numeric|min:0.01',
            'due_date'          => '1|date|after_or_equal:today',
            'invoice_date'      => '0|date',
            'space_type_id'     => '0|integer|exists:space_types,id',
            'service_id'        => '0|integer|exists:services,id',
            'payment_status_id' => '0|integer|exists:payment_statuses,id|default=2',
            'paid_amount'       => '0|numeric|min:0',
            'invoice_type'      => '0|string|max:50',
            'purpose'           => '0|string|max:200',
            'remarks'              => '0|string|max:500',
            'currency_code'     => '0|string|size:3',
            'invoice_class'     => '0|string|max:20',
            'unit_id'           => '0|integer',
            'receiver_uid'      => '0|integer',
            'receiver'          => '0|string|max:50',
            'inactive'          => '0|boolean',
        ];

        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang ?? 'en', 0, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $d = (object) $inputs;

        // Duplicate check (consider if this is still desired — many systems allow multiple invoices per tenant/space)
        $duplicateId = self::checkDuplicateSpaceId(
            $d->building_id,
            $d->floor_id,
            $d->tenant_id,
            $id
        );

        if ($duplicateId) {
            return DV::error('Invoice already exists for this tenant/space/building/floor.');
        }

        $created = !$id;

        DB::beginTransaction();
        try {
            $id = DBX::saveData($ss, 'invoices', ['id' => $id], $inputs, [], 1);

            if ($created && $id) {
                $invoiceCode = self::createInvoiceNumber(
                    $branch_id,
                    $d->building_id,
                    $d->floor_id,
                    $d->tenant_id,
                    $d->space_id
                );

                DB::table('invoices')
                    ->where('id', $id)
                    ->update(['invoice_number' => $invoiceCode]);
            }

            DB::commit();
            return DV::depends(1, ['id' => $id, 'invoice' => $inputs]);

        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error($e->getMessage());
        }
    }


    public static function createInvoiceNumber($branch_id, $building_id, $floor_id, $tenant_id, $space_id)
    {
        $invoicePrefix = $tenant_id * 100;

        $row = DB::table('space_code_control')
            ->where('branch_id', $branch_id)
            ->where('prefix', $floor_id)
            ->first();

        $next_num = $row ? $row->last_id + 1 : 1;
        $invoiceCode = $invoicePrefix + $next_num;

        // Update space code
        DB::table('building_spaces')
            ->where('id', $space_id)
            ->update(['code' => $invoiceCode]);

        // Update or insert control record
        if ($row) {
            DB::table('space_code_control')
                ->where('branch_id', $branch_id)
                ->where('prefix', $floor_id)
                ->update(['last_id' => $next_num]);
        } else {
            DB::table('space_code_control')->insert([
                'branch_id' => $branch_id,
                'prefix'    => $floor_id,
                'last_id'   => $next_num,
            ]);
        }

        return (string) $invoiceCode;
    }

    public static function checkDuplicateSpaceId($building_id, $floor_id, $tenant_id, $invoice_id = null)
    {
        $query = DB::table('invoices as i')
            ->where('i.building_id', $building_id)
            ->where('i.floor_id', $floor_id)
            ->where('i.tenant_id', $tenant_id);

        if ($invoice_id) {
            $query->where('i.id', '!=', $invoice_id);
        }

        return $query->value('id');
    }

    public function getListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $current_page = max(1, (int)($d->current_page ?? 1));
        $per_page     = (int)($d->per_page ?? 10);
        $skip         = ($current_page - 1) * $per_page;

        $query = DB::table('invoices as i')
            ->leftJoin('tenants as t', 't.id', '=', 'i.tenant_id')                    // correct join
            ->leftJoin('space_types as st', 'st.id', '=', 'i.space_type_id')
            ->leftJoin('payment_statuses as ps', 'ps.id', '=', 'i.payment_status_id')
            ->leftJoin('contracts as ct', 'ct.id', '=', 'i.contract_id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->leftJoin('buildings as bb', 'bb.id', '=', 'i.building_id')
            ->select([
                'i.id',
                'i.invoice_number',
                'i.tenant_id',
                'i.building_id',
                'bb.name as building_name',
                'i.floor_id',
                'i.space_id',
                'i.amount',
                'i.due_date',
                'i.invoice_date',
                'i.created_at',
                'i.updated_at',
                'i.payment_status_id',
                'i.invoice_type',
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

        $count = (clone $query)->count();
        $rows  = $query->skip($skip)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
    public static function getInvoiceDetails($id)
{
    $row = DB::table('invoices as i')
        ->leftJoin('tenants as t', 't.id', '=', 'i.tenant_id')
        ->leftJoin('space_types as st', 'st.id', '=', 'i.space_type_id')
        ->leftJoin('payment_statuses as ps', 'ps.id', '=', 'i.payment_status_id')
        ->leftJoin('contracts as ct', 'ct.id', '=', 'i.contract_id')
        ->leftJoin('building_spaces as bs', 'bs.id', '=', 'i.space_id')
        ->leftJoin('buildings as b', 'b.id', '=', 'i.building_id')
        ->leftJoin('floors as f', 'f.id', '=', 'i.floor_id')
        ->where('i.id', $id)
        ->select(
            'i.id',
            't.name as tenant_name',
            't.legal_name as tenant_legal_name',
            't.phone_number as tenant_phone',
            't.email as tenant_email',
            't.address as tenant_address',
            'st.name as space_type_name',
            'bs.code as space_code',
            'b.name as building_name',
            'f.name as floor_name',
            'ct.price as contract_price',
            'ct.sqm_size as contract_sqm_size',
            'ct.price_type as price_type_id',
            'ct.start_date as contract_start_date',
            'ct.end_date as contract_end_date',
            'ps.name as payment_status_name',
        )
        ->first();
    return $row;
}

    public static function getFormOptions($id, $ss)
    {
        return (object) [
            'invoice_details' => $id ? self::invoiceDetails($id) : null,
            'buildings'       => GeneralSettings::options_building($ss),
            'statuses'        => GeneralSettings::options_payment_status($ss),

        ];
    }

    public function deleteInvoice($id = null)
    {
        $id = $id ?? $this->id;

        $deleted = DB::table('invoices')
            ->where('id', $id)
            ->delete();

        return $deleted
            ? DV::depends($deleted, ['action' => 'deleted'])
            : DV::error('Delete failed or record not found.');
    }
}
