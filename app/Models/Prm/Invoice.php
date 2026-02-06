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

    // protected $id = null;
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
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'tenant_id'         => '1|integer|exists:tenants,id',
            'building_id'       => '1|integer|exists:buildings,id',
            'space_id'          => '1|integer|exists:building_spaces,id',
            'contract_id'       => '1|integer|exists:contracts,id',
            'amount'            => '1|numeric|min:0.01',
            'due_date'          => '0|date|after_or_equal:today',
            'code'              => '0|string|0-100',
            'invoice_date'      => '0|date',
            'space_type_id'     => '0|integer|exists:space_types,id',
            'service_id'        => '0|integer|exists:services,id',
            'payment_status_id' => '0|integer|exists:payment_statuses,id|default=2',
            'paid_amount'       => '0|numeric|min:0',
            'purpose'           => '0|string|max:200',
            'remarks'           => '0|string|max:500',
            'currency_code'     => '0|string|size:3',
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
            $d->tenant_id,
            $id
        );

        $created = !$id;
        $id = DBX::saveData($ss, 'invoices', ['id'=>$id], $inputs, [], 1);
        if ($id){
            if($created){
                $prefix = 'I';
                $res = setOfficialCodeInvoice($branch_id,'invoice_code_control','invoices',['id'=>$id],$prefix,5,null);
                if (!$res || !isset($res->status) || $res->status !== 'OK') {
                    \Log::error('Failed to generate invoice code for id: ' . $id);
                }
                $return_data = ['id'=>$id, 'invoice'=>$inputs];
                if (isset($res->code)) {
                    $return_data['code'] = $res->code;
                    return DV::depends(1, $return_data);
                }
            }
            return DV::error('Failed to save invoice.');
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
                'i.code',
                'i.tenant_id',
                'i.building_id',
                'bb.name as building_name',
                'i.space_id',
                'i.amount',
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
            ->where('i.id', $id)
            ->select(
                'i.id',
                'i.tenant_id',
                'i.building_id',
                'i.space_id',
                'i.code',
                'i.amount',
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
        return $row;
}

    public static function getFormOptions($id, $ss)
    {
        return (object) [
            'invoice_details' => $id ? self::getInvoiceDetails($id) : null,
            'buildings'       => GeneralSettings::options_building($ss),
            'statuses'        => GeneralSettings::options_payment_status($ss),
        ];
    }

    public function deleteInvoice($id = null)
    {
        $id = $id ?? $this->id;
        $X = self::deleteBy(['id' => $id]);
        return DV::depends($X, 'Failed to delete invoice.');
    }




}
