<?php

namespace App\Models\Tenant;

use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;
class Contracts  //extends Model
{
    protected $id = null;
    protected $userInfo = null;
    protected static $imag_dir = 'contracts';
    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;

    }

    public function saveContracts($arr = [], $id = null, $ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'name' => '1|string|0-150',
            'name_kh' => '1|string|0-150',
            'phone_number' => '1|phone|0-20',
            'email' => '1|email|1-50',
            'address' => '1|string|0-250',
            'remarks' => '1|string|0-250',
            'tenant_id' => '1|number',
            // 'code' => '1|number',
            // 'contract_id' => '1|number|0=50',
        ];
        $email_char = ['@','.','-','_'];
        $address_char = ['@',',','.','#'];

        $res = DBX::validateObject($arr, $v_rule,true,[],$ss->lang,false);
        if($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object) $inputs;
        $d->phone_number = str_replace(' ', ' ',$d->phone_number);
        $inputs['phone_number'] = $d->phone_number;

        if ($id > 0) {
       return DV::depends(1, ['contracts' => $inputs, 'id' => $id]);
    }

    return DV::error('Failed to save member');


    }

    public function getListContracts($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = $d->status_id ?? null;
        // $status_id = $d->status_id ?? null;

        $str_search = '1=1';
        $str_moreWhere = '1=1';
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(ct.name LIKE '%" . $search_value . "%' OR ct.phone_number LIKE '%" . $search_value . "%' OR ct.code LIKE '%" . $search_value . "%')";
        }
        // if($status_id){
        //     $str_moreWhere .= ' AND acc.status_id =\'' . $status_id . '\'';
        // }
        $updated_at = DBX::formatTime("ct.updated_at", 'updated_at');
        $telegram_link = "CONCAT('https://t.me/+', REPLACE(REPLACE(REPLACE(ct.phone_number, '+', ''), ' ', ''), '-', '')) AS telegram_link";
        $query = DB::table('contracts as ct')
            // ->join('staff_statuses as ss', 'ss.id', '=', 'acc.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("
                ct.id,
                ct.update_user,
                $updated_at,
                ct.tenant_id,
                ct.code,
                ct.name,
                ct.phone_number,
                ct.name_kh,
                ct.email,
                ct.address,
                ct.remarks,
                $telegram_link
            ")
            ->orderBy('ct.id', 'DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('ct.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function contractDetails($id, $ss=null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $row = DB::table('contracts as ct')
        ->where('ct.id',$id)
        ->selectRaw('ct.id,ct.name,ct.phone_number,ct.name_kh,ct.code,ct.email,ct.address,ct.remarks,ct.tenant_id,ct.update_user')->first();
        return $row;
    }

    public function getFormOptions($id,$ss){
        $contracts = $id ? self::contractDetails($id) : null;
        return (object)[
            'contracts' => $contracts,
            'statuses' => GeneralSettings::options_acc_staff_status($ss),

        ];
    }
    public function deleteContracts($id){
           $id = $id ?? $this->id;
           $deleted = Db::table('contracts')->where('id',$id)->delete();
           if($deleted){
               return DV::depends(1,['id'=>$id]);
           }
            return DV::error('Error delete contract...!!');
    }
}
