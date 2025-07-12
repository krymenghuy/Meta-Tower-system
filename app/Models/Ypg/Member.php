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

    protected static $img_dir ='members';
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

public function save($arr = [], $id = null)
{
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;
    $branch_id = $ss->branch_id;

    $v_rule = [
        'name' => '1|string|0-150',
        'sex' => '1|choice|f,F,m,M,o,O',
        'phone_number' => '1|phone|0-50',
        'address' => '0|string|0-250',
        'nationality_id' => '1|number',
        'status_id' => '0|number|default =1',
        'is_expired' => '0|number|default =0',
        'expiration_date' => '0|date',
        'photo' => '0|image'
    ];

    $res = DBX::validateObject($arr, $v_rule, true, ['photo'=>GeneralSettings::$image_chars,'address' => GeneralSettings::$address_map_chars], $ss->lang, false);

    if ($res->error) return DV::error($res->error);

    $inputs = $res->values;
    $d = (object) $inputs;

    $d->phone_number = str_replace(' ', '', $d->phone_number);
    $inputs['phone_number'] = $d->phone_number;

    $phone_check = $this->checkUniqueMemberByPhone($d->phone_number, $id);
    if ($phone_check) return DV::error($phone_check);

    $is_expired = $d->is_expired ?? 0;
    $expiration_date = $d->expiration_date ?? null;
    $inputs['is_expired'] = $is_expired;

    if ($is_expired == '1') {
        if (!$expiration_date) return DV::error('Expiration date is required');

        $converted_expiry = convertDate($expiration_date);
        if (strtotime($converted_expiry) < strtotime(date('Y-m-d'))) {
            return DV::error('Expiration date cannot be in the past.');
        }

        $inputs['expiration_date'] = $converted_expiry;
    } else {
        unset($inputs['expiration_date']);
    }

    $photo = $d->photo ?? null;
    unset($inputs['photo']);
    $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));

    $created = !$id;
    $id = DBX::saveData($ss, 'members', ['id' => $id], $inputs, [], 1);

    if ($id && $created) {
        $prefix = 'YP';
        setOfficialCode($branch_id, 'member_code_control', 'members', ['id' => $id], $prefix, 5, null);
    }
    if ($id > 0) {
        if ($delete_prev_image) {
            $file_name = DB::table('members as m')->where('m.id', $id)->take(1)->value('m.photo_file_name');
            if ($file_name) {
                XPublicStorage::delete([
                    'branch_id' => null,
                    'subs_id'   => $ss->subs_id,
                    'dir'       => self::$img_dir
                ], 'images', $file_name);
            }

            DB::table('members')->where('id', $id)->update(['photo_file_name' => null]);
        }
       XPublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo, null, ['id' => $id, 'store' => 'members.photo_file_name']);
       return DV::depends(1, ['members' => $inputs, 'id' => $id]);
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
            $str_search = "(m.name LIKE '%" . $search_value . "%' OR m.phone_number LIKE '%" . $search_value . "%' OR m.code LIKE '%" . $search_value . "%' OR m.address LIKE '%" . $search_value . "%')";
        }
        if($status_id){
            $str_moreWhere .= ' AND m.status_id =\'' . $status_id . '\'';
        }
        $expired_date = DBX::formatDate("m.expiration_date", 'expiration_date');
        $updated_at = DBX::formatTime("m.updated_at", 'updated_at');

        $telegram_link = "CONCAT('https://t.me/+', REPLACE(REPLACE(REPLACE(m.phone_number, '+', ''), ' ', ''), '-', '')) AS telegram_link";
        $query = DB::table('members as m')
            ->join('loc_countries as c', 'c.id', '=', 'm.nationality_id')
            ->join('member_statuses as ms', 'ms.id', '=', 'm.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("
                m.id,
                m.code,
                m.update_user,
                $updated_at,
                m.name,
                m.sex,
                m.phone_number,
                m.address,
                m.nationality_id,
                c.nationality,
                m.status_id,
                ms.name as status,
                m.is_expired,
                m.photo_file_name,
                $expired_date,
                $telegram_link
            ")
            ->orderBy('m.id', 'DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('m.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
            $row->image_url = '';
            if($row->photo_file_name){
                $row->image_url = self::profilePicture($row->id,$ss);
            }
            unset($row->photo_file_name);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
    static function profilePicture($id,$ss){
        $col_subs_id = DBX::getHex('m.subs_id','subs_id');
        $row = DB::table('members as m')->where('m.id',$id)->selectRaw($col_subs_id.',m.branch_id,m.photo_file_name')->first();
        $def_image = self::defaultPhoto($row ? $row->subs_id : null);
        $url = '';
        if($row){
            $url = XPublicStorage::getUrl(['subs_id'=>$row->subs_id,'dir'=>self::$img_dir],'image').$row->photo_file_name;
            return validateUrl($url,$def_image);
        }else return $def_image;
    }
    static function saveProfilePicture($photo_data,$file_type = null, $id = null, $ss = null){
        $id = $id ?? $id;
        $ss = $ss ?? $ss;
        $col_subs_id = DBX::getHEX('m.subs_id','subs_id');
        $member = DB::table('members as m')->where('m.id',$id)->selectRaw($col_subs_id.',m.id,m.branch_id,m.photo_file_name')->first();
        $delete_image = (!$photo_data || isImage($photo_data));
        if(!$member){
            return DV::error('Member identify is not correct!');
        }
        if($delete_image){
            XPublicStorage::delete(['subs_id'=>$ss->subs_id,'dir'=>self::$img_dir],'image',$member->photo_file_name);
            DB::table('members')->where('id',$id)->update(['photo_file_name'=>null]);
        }
        $res = XPublicStorage::saveImage(['subs_id'=>$ss->subs_id,'dir'=>self::$img_dir],null,$photo_data,null,['id'=>$id,'store'=>'members.photo_file_name']);
        if($res->status ==='Error') return $res;
        $img = self::profilePicture($id,$ss);
        return DV::depends(1,['image_url'=>$img]);
    }
    function deleteProfilePicture($id=null,$ss=null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $member = DB::table('members as m')->where('id',$id)->selectRaw('id,photo_file_name')->first();
        if(!$member) return DV::error('Member identify is not correct!');
        XPublicStorage::delete(['subs_id'=>$ss->subs_id,'dir'=>self::$img_dir],'image',$member->photo_file_name);
        DB::table('members')->where('id',$id)->update(['photo_file_name'=>null]);
        return DV::success();
    }


    static function defaultPhoto($subs_id)
    {
        return url('') . '/assets/images/default/default-staff.png';
    }
    public function getDetails($id, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $row = DB::table('members as m')
            ->join('loc_countries as c', 'c.id', '=', 'm.nationality_id')
            ->join('member_statuses as ms', 'ms.id', '=', 'm.status_id')
            ->where('m.id', $id)
            ->selectRaw('m.id,m.code, m.name,m.sex,m.photo_file_name, m.phone_number, m.address, m.nationality_id, c.name as nationality, m.status_id, ms.name as status, m.is_expired, m.expiration_date')
            ->first();
             if($row){
                $img = self::profilePicture($id,$ss);
                $row->image_url = $img;
                $row->photo = $img;
            } else $row = null;
        return $row;
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
        $deleted = DB::table('members')->where('id', $id)->delete();
        if ($deleted) {
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
