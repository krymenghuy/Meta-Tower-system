<?php

namespace App\Models\Tenant;

use App\Models\Ypg\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;
class AccountStaff //extends Model
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'account_staff';
    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;

    }

    public function saveAccountStaff($arr = [],$id=null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'name' => '1|string|0-150',
            'sex' => '1|choice|f,F,m,M,o,O',
            'phone_number' => '1|phone|0-20',
            'status_id' => '0|number|default = 1',
            'role' => '0|string',
            'zones' => '0|number',
            'floors' => '0|number'
        ];
        $res = DBX::validateObject($arr, $v_rule,true,[],$ss->lang,false);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object) $inputs;
        $d->phone_number = str_replace(' ', '', $d->phone_number);
        $inputs['phone_number'] = $d->phone_number;

        $phone_check = $this->checkUniqueMemberByPhone($d->phone_number, $id);
        if ($phone_check) return DV::error($phone_check);
        $created = !$id;
        $id = DBX::saveData($ss, 'account_staff', ['id' => $id], $inputs, [], 1);

        if ($id && $created) {
            $prefix = 'MT';
            setOfficialCode($branch_id, 'staff_code_control', 'account_staff', ['id' => $id], $prefix, 5, null);
        }
    if ($id > 0) {
       return DV::depends(1, ['account_staff' => $inputs, 'id' => $id]);
    }

    return DV::error('Failed to save member');

    }
     function checkUniqueMemberByPhone($phone_number, $id = null)
    {
        $str_id = "1=1";
        if (!$phone_number) return 'Phone number cannot be empty';
        if ($id > 0) $str_id = "m.id <> $id";
        $x = DB::table('account_staff as acc')->where('acc.phone_number', $phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
        if ($x) return 'phone number"' . $phone_number . '" has been used by another member';
        return null;
    }
    public function getListAccountStaff($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = $d->search_value ?? null;
        $status_id = $d->status_id ?? null;


        $str_search = '1=1';
        $str_moreWhere = '1=1';
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(acc.name LIKE '%" . $search_value . "%' OR acc.phone_number LIKE '%" . $search_value . "%' OR acc.code LIKE '%" . $search_value . "%')";
        }
        if($status_id){
            $str_moreWhere .= ' AND acc.status_id =\'' . $status_id . '\'';
        }
        $updated_at = DBX::formatTime("acc.updated_at", 'updated_at');
        $telegram_link = "CONCAT('https://t.me/+', REPLACE(REPLACE(REPLACE(acc.phone_number, '+', ''), ' ', ''), '-', '')) AS telegram_link";
        $query = DB::table('account_staff as acc')
            ->join('staff_statuses as ss', 'ss.id', '=', 'acc.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("
                acc.id,
                acc.code,
                acc.update_user,
                $updated_at,
                acc.name,
                acc.sex,
                acc.role,
                acc.floors,
                acc.zones,
                acc.phone_number,
                acc.status_id,
                ss.name as status,
                $telegram_link
            ")
            ->orderBy('acc.id', 'DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('acc.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
     
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function accountStaffDetails($id, $ss=null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $row = DB::table('account_staff as acc')
            ->join('staff_statuses as ss','ss.id','=','acc.status_id')
            ->where('ss.id',$id)
            ->selectRaw('acc.id,acc.name,acc.sex,acc.role,acc.phone_number,acc.floors,acc.zones,acc.status_id,ss.name as status')->first();
            return $row;

    }

    public function getFormOptions($id,$ss){
        $acc_staff_details = self::accountStaffDetails($id) ?? null;
        return (object)[
            'acc_staff_details' => $acc_staff_details,
            'statuses' => GeneralSettings::options_acc_staff_status($ss),
        ];
    }

    public function deleteAccountStaff($id){
        $id = $id ?? $this->id;
        $deleted = DB::table('account_staff')->where('id',$id)->delete();
        if($deleted){
            return DV::depends(1,['id'=>$id]);
        }return Dv::error('Error delete staff account...!');
    }

    public function updateAccountStaffStatus($status_id,$id = null, $ss = null){
        $id = $id ?? $this->id;

        $ss = $ss ? $ss : $this->userInfo;
        $status = DB::table('account_staff')->where('id',$id)->value('status_id');
        if($status == $status_id){
            return DV::error('It is the same current status');
        }
        $update = DB::table('account_staff')->where('id',$id)->update([
            'status_id' =>$status_id,
            'update_user' => $ss->full_name,
            'updated_at' =>getNowTime(),
            'update_uid' =>$ss->user_id
        ]);
        return DV::depends($update,['Account Staff','updated']);
    }


}
