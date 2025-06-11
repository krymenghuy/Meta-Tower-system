<?php

namespace App\Models\Ypg;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;

class Member
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function checkUniqueMemberByPhone($phone_number, $id = null)
    {
        $str_id = "1=1";
        if (!$phone_number) return 'Phone number cannot be empty';
        if ($id > 0) $str_id = "m.id <> $id";
        $x = DB::table('members as m')->where('m.phone_number', $phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
        if ($x) return 'phone number"' . $phone_number . '" has been used by another member';
        return null;
    }

    public function save($arr = [], $id = null,$ss=null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'name' => '1|string|0-150',
            'sex' => '1|choice|f,F,m,M,o,O',
            'phone_number' => '1|phone|0-50',
            'email' => '1|email',
            'address' => '0|string|0-250',
            'nationality_id' => '1|number',
            'status_id' => '1|number|default = 1',
            'is_expiry' => '1|number|default = 0',
            'expiry_date' => '0|date',
        ];
        $checkUnique = null;
        $res = DBX::validateObject($arr, $v_rule, true, ['email' => GeneralSettings::$email_chars,'address'=> GeneralSettings::$address_map_chars], $ss->lang, false, isset($arr[' id']) ? null : $checkUnique);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object) $inputs;
        $d->phone_number = str_replace(' ', '', $inputs['phone_number']);
        $inputs['phone_number'] = $d->phone_number;
        $phone_check = $this->checkUniqueMemberByPhone($d->phone_number, $id);
        if ($phone_check) return DV::error($phone_check);

        $expiry_date = $d->expiry_date ?? null;
        $is_expiry = $d->is_expiry ?? 0;
        if ($is_expiry == 1 && !$expiry_date) {
            return DV::error('Expiry date is required');
        }
        if ($expiry_date) {
            $converted_expiry= convertDate($expiry_date);
            if (strtotime($converted_expiry) < strtotime(date('Y-m-d'))) {
                return DV::error('Expiry date cannot be in the past.');
            }
            $inputs['expiry_date'] = $converted_expiry;
        } else {
            unset($inputs['expiry_date']);
        }
        $created = !$id;
        $new_id = DBX::saveData($ss, 'members', ['id' => $id], $inputs, [], 1, false);

        if ($new_id && $created) {

            $prefix = 'YP';
            $res = setOfficialCode($branch_id, 'member_code_control', 'members', ['id' => $new_id], $prefix, 5, null);

        }

        if ($new_id > 0) {
            return DV::depends($new_id, ['members' => $inputs, 'id' => $new_id]);
        }

        return DV::error('Failed to save member');

    }

    public function getList($arr, $ss = null)
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
            $str_search = "(m.name LIKE '%" . $search_value . "%' OR m.phone_number ='" . $search_value . " ' OR m.code ='" . $search_value . "')";
        }
        if($status_id){
            $str_moreWhere .= ' AND m.status_id =\'' . $status_id . '\'';
        }
        $expiry_date = DBX::formatDate("m.expiry_date", 'expiry_date');
        $updated_at = DBX::formatTime("m.updated_at", 'updated_at');
        $query = DB::table('members as m')
            ->join('loc_countries as c', 'c.id', '=', 'm.nationality_id')
            ->join('member_statuses as ms', 'ms.id', '=', 'm.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw('m.id,m.code, m.update_user,'.$updated_at.',m.name,m.sex, m.phone_number, m.email, m.address, m.nationality_id, c.nationality, m.status_id, ms.name as status, m.is_expiry, ' . $expiry_date . '')
            ->orderBy('m.id', 'DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('m.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $query = DB::table('members as m')
            ->join('loc_countries as c', 'c.id', '=', 'm.nationality_id')
            ->join('member_statuses as ms', 'ms.id', '=', 'm.status_id')
            ->where('m.id', $id)
            ->selectRaw('m.id,m.code, m.name,m.sex, m.phone_number, m.address, m.nationality_id, c.name as nationality, m.status_id, ms.name as status, m.is_expiry, m.expiration')
            ->first();
        return $query;
    }

    public function getFormOptions($id,$ss)
    {
        $subs_id = $ss->subs_id;
        $member_details = self::getDetails($id) ?? null;

        return (object) [
            'member_details' => $member_details,
            'statuses' => GeneralSettings::options_member_status($ss),
            'countries' => GeneralSettings::options_country($ss),
            'nationality' => GeneralSettings::options_nationality($ss),
        ];

    }

    public function delete($id)
    {
        $id = $id ?? $this->id;
        if (empty($id)) {
            return DV::error('Invalid ID');
        }
        $res = DB::table('members')->where('id', $id)->delete();
        if ($res) {
            return DV::depends(1, ['id' => $id]);
        }
        return DV::error('Error deleting member');
    }

    function updateStatus($status_id, $id = null, $ss = null)
    {

        $ss = $ss ? $ss : $this->userInfo;
        $currentStatus = DB::table('members')->where('id', $id)->value('status_id');

        if ($currentStatus == $status_id) {
            return DV::error('It is the same current status');
        }
        $x = DB::table('members')->where('id', $id)->update([
            'status_id' => $status_id,
            'update_user'=>$ss->full_name,
            'update_date'=>getNowTime(),
            'update_uid'=>$ss->user_id
        ]);
        return DV::depends($x, ['member status', 'updated']);
    }

}
