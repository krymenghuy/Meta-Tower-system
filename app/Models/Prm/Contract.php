<?php

namespace App\Models\Prm;

use App\Models\prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;

class Contract
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'contracts';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    public function saveContract($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);

        $v_rule = [
            'tenant_id'        => '1|number|exists=tenants.id',
            'legal_name'       => '0|string|0-100',
            'business_type_id' => '1|number|exists=business_types.id',
            'space_type_id'    => '1|number|exists=space_types.id',
            'status_id'        => '0|number|default = 2',
            'space_id'         => '1|number|exists=building_spaces.id',
            // 'space_status_id'  => '1|number|in=3,4', // Reserved | Occupied
            'sqm_size'         => '0|number',
            'price'            => '0|number',
            'price_type'       => '0|string|default=sqm',
            'start_date'       => '1|date',
            'end_date'         => '1|date',
            'remarks'          => '0|string|0-255',
        ];
        $legal_name_char = ['@',',','.','#'];

        $res = DBX::validateObject($arr, $v_rule, 1, [ 'legal_name' => $legal_name_char], $ss->lang, 0, null);
        if ($res->error) return DV::error($res->error);
        // $allowSign = ['$', '#', '@', '!', '.', '-', '_', '=', '?'];
        $inputs = $res->values;
        $d = (object) $arr;
        $space_id = $d->space_id;
        $dup_id = self::checkDuplicateContract($space_id ?? null, $id);
        if ($dup_id) {
            return DV::error('This space already has a contract.');
        }
        $created = !$id;
        $id = DBX::saveData($ss, 'contracts', ['id' => $id], $inputs, [], 1);
        if ($id) {
            DB::table('building_spaces')
                ->where('id', $space_id)
                ->update(['status_id' => 2]);
        }
        if ($id > 0) {
            return DV::depends(1, ['contracts' => $inputs, 'id' => $id]);
        }

        return DV::error($created ? 'Create failed.' : 'Update failed.');
    }

  static function checkDuplicateContract($space_id, $id = null)
    {
        if (!$space_id) return null;

        $query = DB::table('contracts as c')
            ->where('c.space_id', $space_id);

        if ($id) {
            $query->where('c.id', '<>', $id);
        }

        return $query->value('id');
    }
    public function getListPaginate($arr, $ss = null){

        $d = (object) $arr;
        $search_value = $d->search_value ?? null;
        $tenant_id = $d->tenant_id ?? null;
        $status_id = $d->status_id ?? null;
        $space_type_id = $d->space_type_id ?? null;
        $business_type_id = $d->business_type_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;  
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = '1=1';
        $str_moreWhere = '2=2';
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(t.name LIKE '%".$search_value."%')";
        }
        if($tenant_id){
            $str_moreWhere .= ' AND c.tenant_id = ' . $tenant_id;
        }
        if($status_id){
            $str_moreWhere .= ' AND c.status_id =' . $status_id ;
        }
        if($space_type_id){
            $str_moreWhere .= ' AND c.space_type_id = ' . $space_type_id;
        }
        if($business_type_id){
            $str_moreWhere .= ' AND c.business_type_id = ' . $business_type_id;
        }
        $start_date = DBX::formatDate("c.start_date", 'start_date' );
        $end_date = DBX::formatDate("c.end_date", 'end_date' );
        $updated_at = DBX::formatTime("c.updated_at", 'updated_at' );
        $selectCols = 'c.id,c.tenant_id,t.name as tenant_name,t.email,t.phone_number,c.legal_name,c.status_id,cs.name as status,'.$start_date.','.$end_date.',c.business_type_id,bt.name as business_type,c.space_type_id,st.name as space_type,c.space_id, bs.code as space_code,c.sqm_size,c.price,c.price_type,c.remarks,c.update_user,'.$updated_at.'';
        $query = DB::table('contracts as c')
            ->join('tenants as t', 't.id', '=', 'c.tenant_id')
            ->join('contract_statuses as cs', 'cs.id', '=', 'c.status_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'c.space_id')
            ->join('business_types as bt', 'bt.id', '=', 'c.business_type_id')
            ->join('space_types as st', 'st.id', '=', 'c.space_type_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw($selectCols)
            ->orderByRaw('c.id desc');
        $clone_query = clone $query;
        $count = $clone_query->count('c.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    
    public static function contractDetails($id)
{
    return DB::table('contracts as c')
       ->where('c.id', $id)
        ->selectRaw('c.id,c.tenant_id,c.legal_name,c.space_id,c.status_id,c.business_type_id,c.space_type_id,c.sqm_size,c.price,c.price_type,c.start_date,c.end_date,c.remarks')
        ->first();
}

    public static function getFormOptions($id,$ss)
    {
        $contract_details = $id ? self::contractDetails($id) : null;
        return (object) [
            'contract_details' => $contract_details,
            'tenants'      => GeneralSettings::options_tenant($ss),
            'legal_names'      => GeneralSettings::options_legal($ss),
            'statuses'      => GeneralSettings::options_contract_status($ss),
            'space_types'      => GeneralSettings::options_space_type($ss),
            'building_spaces'      => GeneralSettings::options_building_space($ss),
            'business_types'   => GeneralSettings::options_business_type($ss)
        ];
    }
    public static function deleteContract($id = null){
        $id = $id ?? $this->id;
        $deleted = DB::table('contracts')->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Deleted failed.');
    }
    
}
        