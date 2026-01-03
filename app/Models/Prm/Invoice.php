<?php

namespace App\Models\Prm;

use App\Models\Ypg\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;


class Invoice //extends Model
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'invoices';

    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;

    }

    public function saveInvoice($arr = [], $id = null, $ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'due_date' => '0|date',
            'amount' => '0|number',
            'tenant_id' => '1|number|exists=tenants.id',
            'building_id'   => '1|number|exists=buildings.id',
            'invoice_number' => '0|number',
            'space_id'   => '1|number|exists=spaces.id',
            'price' => '0|number',
            'paid_amount' => '0|number',
            'floor_number' => '0|number',
            'remarks' => '0|string',
            'status_id' => '0|number|default=1',
            'service_id' => '0|number|exists=services.id',
           

        ];
        $res == DBX::validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);

        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object) $inputs;
        if(!$d->tenant_id){
            return DV::error('Tenant cannot be empty.');
        }
        $duplicateId = self::checkDuplicateIvoiceId (
            $d->tenant_id,
            $d->building_id,
            $d->floor_number,
            $id
        );
        if($duplicateId){
            return DV::error('Invoice already exists.');
        }

        $created = !$id;
        $id = DBX::saveData($ss, 'invoices', ['id' => $id], $inputs, [], 1);

        if($id && $created){
            self::createInvoiceNumber(
                $branch_id,
                $inputs['tenant_id'],
                (int)$inputs['building_id'],
                $id
            );
        }
        if($id > 0){
            return DV::depends(1, ['invoices' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving ...!');

    }
    function createInvoiiceNumber($branch_id, $building_id, $floor_number, $tenant_id){

    $invoicePrefix = $tenant_id * 100;

    $row = DB::table('space_code_control')
        ->where('branch_id', $branch_id)
        ->where('prefix', $floor_number)
        ->first();

    $next_num = $row ? $row->last_id + 1 : 1;
    $invoiceCode = $invoicePrefix + $next_num;

    DB::table('building_spaces')
        ->where('id', $space_id)
        ->update(['code' => $invoiceCode]);

    if ($row) {
        DB::table('space_code_control')
            ->where('branch_id', $branch_id)
            ->where('prefix', $floor_number)
            ->update(['last_id' => $next_num]);
    } else {
        DB::table('space_code_control')
            ->insert([
                'branch_id' => $branch_id,
                'prefix'    => $floor_number,
                'last_id'   => $next_num,
            ]);
    }

    return $invoiceCode;
    }

    static function checkDuplicateSpaceId($building_id, $floor, $tenant_id, $invoice_id = null){
        $query = DB::table('invoices as inv')
            ->where('inv.building_id', $building_id)
            ->where('inv.floor_number', $floor)
            ->where('inv.tenant_id', $tenant_id)
            ->where('inv.invoice_id', $invoice_id);

        if (!empty($invoice_id)) {
            $query->where('inv.id', '<>', $invoice_id);
        }

        $id = $query->value('id');
        return $id ?: null;
    }

    public function getListPaginate($arr, $ss = null){
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $search_value = $d->search_value ?? null;
        $building_id = $d->building_id ?? null;
        $tenant_id = $d->tenant_id ?? null;
        $status_id = $d->status_id ?? null;
        $space_type_id = $d->space_type_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if(!is_numeric($current_page)){
            $current_page = 1;
        }
        $skip_rows = ($current_page -1) * $per_page;
        
        $str_search = '1=1';
        $str_moreWhere = '2=2';
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = DBX::whereLowerCase('inv.name',"%$search_value%",'like');
        }
        if($building_id){
            $str_moreWhere .= ' AND inv.building_id = ' . $building_id;
        }
        if($tenant_id){
            $str_moreWhere .= ' AND inv.tenant_id = ' . $tenant_id;
        }
        if($status_id){
            $str_moreWhere .= ' AND inv.status_id = ' . $status_id;
        } 
        $updated_at = DBX::formatTime("inv.updated_at", 'updated_at');
        $selectCols = 'inv.id,inv.building_id,inv.name as building_name,inv.code,inv.floor_number,inv.tenant_id as tenant_name,st.name as space_type,inv.sqm_size,inv.price,inv.price_type,inv.status_id,inv.name as status,inv.update_user,'.$updated_at.'';
        $query = DB::table('invoices as i')
            ->join('invoices as inv','inv.id','=','inv.invoice_id')
            ->join('space_types as st','st.id','=','inv.space_type_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw($selectCols);
        $query->orderByRaw('inv.id desc');
        $clone_query = clone $query;
        $count = $clone_query->count('inv.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);    
    
    }
     public static function invoiceDetails($id){
        return DB::table('invoices as inv')
            ->where('inv.id',$id)
            ->selectRaw('inv.id,inv.building_space_code,inv.floor_number,inv.building_id,inv.tenant_id,inv.status_id,inv.space_type_id,inv.price,')
            ->first();

    }

    public static function getFormOptions($id,$ss){
        $invoice_details = $id ? self::invoiceDetails($id) : null;
        return (object)[
            'invoice_details' => $invoice_details,
            'buildings' =>GeneralSettings::options_building($ss),
            'tenants_id'=> GeneralSettings::options_tenant($ss)
        ];
    }
    public function delete($id = null){
        $id = $id ?? $this->id;
        $deleted = DB::table('invoices')->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Deleted failed.');
    }
}
