<?php

namespace App\Models\Tenant;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;
class Staff //extends Model
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'staffs';
    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;

    }
function checkUniqueStaffByNID($nid, $id = null)
{
    if (!$nid) return null;
    $str_id = '1=1';
    if ($id > 0) $str_id = "s.id <> $id";
    
    $x = DB::table('staffs as s')
        ->where('s.national_id', $nid)
        ->whereRaw($str_id)
        ->select('id')
        ->take(1)
        ->exists();

    if ($x) return 'A staff member with National ID ' . $nid . ' already exists in the system.';
    return null;
}

function checkUniqueStaffByPassport($passport, $id = null)
{
    if (!$passport) return null;
    $str_id = '1=1';
    if ($id > 0) $str_id = "s.id <> $id";

    $x = DB::table('staffs as s')
        ->where('s.passport_number', $passport)
        ->whereRaw($str_id)
        ->select('id')
        ->take(1)
        ->exists();

    if ($x) return 'A staff member with this Passport number ' . $passport . ' already exists in the system.';
    return null;
}

function checkUniqueStaffByPhone($phone_number, $id = null)
{
    if (empty($phone_number)) {
        return 'Phone number cannot be empty.';
    }
    
    $query = DB::table('staffs')->where('phone_number', $phone_number);
    if ($id) {
        $query->where('id', '<>', $id);
    }

    if ($query->exists()) {
        return 'This phone number ' . $phone_number . ' is already associated with another staff member.';
    }
    return null;
}

function checkUniqueStaffByEmail($email, $id = null)
{
    if (empty($email)) {
        return 'Email cannot be empty.';
    }

    $query = DB::table('staffs')->where('email', $email);
    if ($id) {
        $query->where('id', '<>', $id);
    }

    if ($query->exists()) {
        return 'This email ' . $email . ' is already associated with another staff member.';
    }
    return null;
}

    public function saveStaff($arr = [], $id = null, $ss = null) {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id ?? null;

        $v_rule = [
            'code'            => '0|string|0-20',
            'name'            => '1|string|0-30|text=name_required',
            'legal_name'      => '1|string|0-30|text=legal_name_required',
            'sex'             => '1|choice|F,M|text=select_gender',
            'date_of_birth'   => '1|date|text=date_of_birth_required',
            'phone_number'    => '1|string|0-20|text=phone_required',
            'email'           => '1|email|1-100|text=email_required',
            'position'        => '0|string|0-50',
            'password'        => '0|string|0-255', 
            'address'         => '0|string|0-350',
            'nationality_id'  => '1|number|text=nationality_required',
            'national_id'     => '0|string|0-20',
            'passport_number' => '0|string|0-20',
            'start_date'      => '1|date|text=start_date_required',
            'status_id'       => '0|number',
            // 'photo'           => '0|image'
        ];

        $email_char = ['@', '.', '-', '_'];
        $address_char = ['@', ',', '.', '#', '-', '/', ' '];

        $res = DBX::validateObject($arr, $v_rule, 1, ['photo' => GeneralSettings::$image_chars, 'email' => $email_char, 'address' => $address_char], $ss->lang, 0, null);
        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object) $inputs;

        \Log::info('SSS', [$ss, $d]);
        
        // 1. Email Validations
        $email = $d->email ?? null;
        if ($email !== null && $email !== '') {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return DV::error('invalid_email_format');
            }
            // Assuming checkUniqueStaffByEmail exists now
            $email_check = $this->checkUniqueStaffByEmail($email, $id);
            if ($email_check) return DV::error($email_check);
        }

        // 2. Age Limit Checking
        $dob = $d->date_of_birth ?? null;
        if ($dob) {
            $birth = new \DateTime($dob);
            $today = new \DateTime();
            if ($birth > $today) return DV::error('date_of_birth_cannot_be_in_the_future');
            $age = $today->diff($birth)->y;
            if ($age < 18) return DV::error('staff_must_be_18');
            if ($age > 120) return DV::error('invalid_date_of_birth_age');
        }

        // 3. Document identification checks by nationality
        $nationality_id = intval($d->nationality_id ?? 0);
        $national_id = $d->national_id ?? null;
        $passport = $d->passport_number ?? null;

        if ($nationality_id === 14) {
            if (empty($national_id)) {
                return DV::error('national_id_required');
            }
        } else {
            if (empty($passport)) {
                return DV::error('passport_number_required');
            }
        }

        if (!empty($national_id)) {
            $nid_check = $this->checkUniqueStaffByNID($national_id, $id);
            if ($nid_check) return DV::error($nid_check);
        }
        if (!empty($passport)) {
            $passport_check = $this->checkUniqueStaffByPassport($passport, $id);
            if ($passport_check) return DV::error($passport_check);
        }

        // 4. Phone Strip Processing
        $phone_number = isset($d->phone_number) ? str_replace(' ', '', $d->phone_number) : null;
        $phone_check = $this->checkUniqueStaffByPhone($phone_number, $id);
        if ($phone_check) return DV::error($phone_check);
        $inputs['phone_number'] = $phone_number;

        // 5. Address Validation
        $address = $d->address ?? null;
        if (!$address) {
            return DV::error('address_required');
        }

        // 6. Password Hashing Processing
        if (!empty($d->password)) {
            $inputs['password'] = password_hash($d->password, PASSWORD_BCRYPT);
        } else if (!$id) {
            $inputs['password'] = null; 
        } else {
            unset($inputs['password']); 
        }

        // Set Default Status if missing
        $inputs['status_id'] = $d->status_id ?? 1;
        $inputs['tenant_id'] = $ss->official_id;

        // 7. Save Database Data Operation
        $created = !$id;
        $id = DBX::saveData($ss, 'staffs', ['id' => $id], $inputs, [], 1);
        if (!$id) {
            return DV::error('create_failed');
        }

        // 8. Auto Code Generator Hook
        if ($created) {
            setOfficialCode($branch_id, 'staff_code_control', 'staffs', ['id' => $id], 'S', 4, null);
        }

        return DV::depends(1, ['staffs' => $inputs, 'id' => $id]);
    }


    public function getListPaginate($arr, $ss = null)
    {

        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $status_id = $d->status_id ?? null;
        $search_value = $d->search_value ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = "2=2";
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(t.name LIKE '%" . $search_value . "%' OR t.phone_number LIKE '%" . $search_value . "%' OR t.legal_name LIKE '%" . $search_value . "%' OR t.code LIKE '%" . $search_value . "%')";
        }
        if ($status_id) {
            $str_moreWhere .= ' AND t.status_id =' . $status_id;
        }

        $query = DB::table('staffs as t')
            ->join('staff_statuses as ts', 'ts.id', '=', 't.status_id')

            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->where('t.tenant_id',$ss->official_id)
            ->selectRaw("
            t.id,t.name,t.sex,t.date_of_birth,t.nationality_id,
            t.legal_name,t.code,t.national_id,
            t.passport_number,t.phone_number,t.email,t.address,
            t.status_id,ts.name as status,
            t.updated_at,t.update_user
            ")
            ->orderBy('t.status_id', 'asc')
            ->orderBy('t.created_at', 'desc');

        // ->orderBy('t.id','DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('t.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {

            // $row->image_url = '';
            // if ($row->photo_file_name) {
            //     $row->image_url = self::profilePicture($row->id, $ss);
            // }
            // unset($row->photo_file_name);
            $row = setOfficialDates($row, ['date_of_birth', 'start_date', 'end_date'], ['updated_at'], []);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }




     function checkUniqueMemberByPhone($phone_number, $id = null)
    {
        $str_id = "1=1";
        if (!$phone_number) return 'Phone number cannot be empty';
        if ($id > 0) $str_id = "ct.id <> $id";
        $x = DB::table('contract_team as ct')->where('ct.phone_number', $phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
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
            $str_search = "(ct.name LIKE '%" . $search_value . "%' OR ct.phone_number LIKE '%" . $search_value . "%' OR ct.code LIKE '%" . $search_value . "%')";
        }
        // if($status_id){
        //     $str_moreWhere .= ' AND acc.status_id =\'' . $status_id . '\'';
        // }
        $updated_at = DBX::formatTime("ct.updated_at", 'updated_at');
        $telegram_link = "CONCAT('https://t.me/+', REPLACE(REPLACE(REPLACE(ct.phone_number, '+', ''), ' ', ''), '-', '')) AS telegram_link";
        $query = DB::table('contract_team as ct')
            // ->join('staff_statuses as ss', 'ss.id', '=', 'acc.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("
                ct.id,
                ct.contract_id,
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

    public function accountStaffDetails($id, $ss=null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $row = DB::table('contract_team as ct')
            // ->join('staff_statuses as ss','ss.id','=','acc.status_id')
            ->where('ct.id',$id)
            ->selectRaw('ct.id,ct.name,ct.phone_number,ct.name_kh,ct.code,ct.email,ct.address,ct.remarks,ct.tenant_id,ct.update_user')->first();
            return $row;

    }

    public function getFormOptions($id,$ss){
        $acc_staff_details = $id ? self::accountStaffDetails($id) : null;
        return (object)[
            'acc_staff_details' => $acc_staff_details,
            'statuses' => GeneralSettings::options_acc_staff_status($ss),
        ];
    }

    public function deleteAccountStaff($id){
        $id = $id ?? $this->id;
        $deleted = DB::table('contract_team')->where('id',$id)->delete();
        if($deleted){
            return DV::depends(1,['id'=>$id]);
        }return Dv::error('Error delete staff account...!');
    }

    public function updateAccountStaffStatus($status_id,$id = null, $ss = null){
        $id = $id ?? $this->id;

        $ss = $ss ? $ss : $this->userInfo;
        $status = DB::table('contract_team')->where('id',$id)->value('status_id');
        if($status == $status_id){
            return DV::error('It is the same current status');
        }
        $update = DB::table('contract_team')->where('id',$id)->update([
            // 'status_id' =>$status_id,
            'update_user' => $ss->full_name,
            'updated_at' =>getNowTime(),
            'update_uid' =>$ss->user_id
        ]);
        return DV::depends($update,['Account Staff','updated']);
    }


}
