<?php

namespace App\Models\Tenant;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;
use Carbon\Carbon;

class Team
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'team_member';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function checkUniqueStaffByNID($nid, $id = null)
    {
        if (!$nid) return null;
        $str_id = '1=1';
        if ($id > 0) $str_id = "s.id <> $id";
        
        $x = DB::table('team_member as s')
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

        $x = DB::table('team_member as s')
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
        
        $query = DB::table('team_member')->where('phone_number', $phone_number);
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

        $query = DB::table('team_member')->where('email', $email);
        if ($id) {
            $query->where('id', '<>', $id);
        }

        if ($query->exists()) {
            return 'This email ' . $email . ' is already associated with another staff member.';
        }
        return null;
    }

    public function createTeam($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id ?? null;
        
        $v_rule = [
            'space_id'     => '1|number|text=space_required',
            'member_count' => '1|number|text=member_count_required',
            'team_name'    => '1|string|0-30|text=name_required',
            'code'         => '0|string|0-100',
        ];
        
        $res = DBX::validateObject($arr, $v_rule, 0, $ss->lang);
        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object) $inputs;

        $inputs['tenant_id'] = $ss->official_id;
        $inputs['member_count'] = $d->member_count ?? 0;
        if (empty($inputs['code']) && !empty($d->space_id)) {
            $inputs['code'] = DB::table('building_spaces')->where('id', $d->space_id)->value('code');
        }

        $id = DBX::saveData($ss, 'tenant_team', ['id' => $id], $inputs, [], 1);
        if (!$id) {
            return DV::error('create_failed');
        }

        return DV::depends(1, ['tenant_team' => $inputs, 'id' => $id]);
    }

    public function getTeamList($arr = [], $ss = null)
    {
        if (is_object($arr)) {
            $ss = $arr;
            $arr = [];
        }
        $ss = $ss ?? $this->userInfo;

        $query = DB::table('tenant_team as s')
            ->where('s.tenant_id', $ss->official_id)
            ->selectRaw("s.id, s.tenant_id, s.space_id, s.code, s.team_name, s.member_count, s.branch_id, s.created_at")
            ->orderBy('s.created_at', 'desc');
        
        return $query->get();
    }

    public function saveTeamMember($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id ?? null;
        $created = !$id;

        $v_rule = [
            'code'            => '0|string|0-20',
            'name'            => '1|string|0-30|text=name_required',
            'sex'             => '1|choice|F,M|text=select_gender',
            'date_of_birth'   => '1|date|text=date_of_birth_required',
            'phone_number'    => '1|string|0-20|text=phone_required',
            'email'           => '1|email|1-100|text=email_required',
            'position'        => '0|string|0-50',
            'password'        => '0|string|0-255', 
            'address'         => '0|string|0-350',
            'nationality_id'  => '1|number|text=nationality_required',
            'nid_issue_date'  => '0|date|text=nid_issue_date',
            'national_id'     => '0|string|0-20',
            'passport_number' => '0|string|0-20',
            'start_date'      => '0|date|text=start_date_required',
            'status_id'       => '0|number',
            'photo'           => '0|image',
        ];

        $email_char = ['@', '.', '-', '_'];
        $address_char = ['@', ',', '.', '#', '-', '/', ' '];

        $res = DBX::validateObject($arr, $v_rule, 1, [
            'photo'   => GeneralSettings::$image_chars, 
            'email'   => $email_char, 
            'address' => $address_char
        ], $ss->lang, 0, null);
        
        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object) $inputs;

        // 1. Email Validations
        $email = $d->email ?? null;
        if ($email !== null && $email !== '') {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return DV::error('invalid_email_format');
            }
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

        // 3. Start Date Validation
        $start_date = $d->start_date ?? null;
        if ($start_date) {
            $startDt = new \DateTime($start_date);
            if ($dob) {
                $birthDt = new \DateTime($dob);
                if ($startDt < $birthDt) {
                    return DV::error('start_date_cannot_be_before_date_of_birth');
                }
            }
            $maxFuture = (new \DateTime('today'))->modify('+1 year');
            if ($startDt > $maxFuture) {
                return DV::error('start_date_too_far_in_the_future');
            }
        }

        // 4. Document identification checks
        $nationality_id = intval($d->nationality_id ?? 0);
        $national_id = $d->national_id ?? null;
        $passport = $d->passport_number ?? null;

        if ($nationality_id === 14) {
            if (empty($national_id)) return DV::error('national_id_required');
            if (empty($d->nid_issue_date)) return DV::error('nid_issue_date');
        } else {
            if (empty($passport)) return DV::error('passport_number_required');
            $inputs['nid_issue_date'] = null;
        }

        if (!empty($national_id)) {
            $nid_check = $this->checkUniqueStaffByNID($national_id, $id);
            if ($nid_check) return DV::error($nid_check);
        }
        if (!empty($passport)) {
            $passport_check = $this->checkUniqueStaffByPassport($passport, $id);
            if ($passport_check) return DV::error($passport_check);
        }

        // 5. Phone Processing
        $phone_number = isset($d->phone_number) ? str_replace(' ', '', $d->phone_number) : null;
        $phone_check = $this->checkUniqueStaffByPhone($phone_number, $id);
        if ($phone_check) return DV::error($phone_check);
        $inputs['phone_number'] = $phone_number;

        // 6. Address Validation
        if (empty($d->address)) {
            return DV::error('address_required');
        }

        // --- Photo Handling ---
        $photo = $d->photo ?? null;
        unset($inputs['photo']);

        $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));

        // 7. Password Hashing
        if (!empty($d->password)) {
            $inputs['password'] = password_hash($d->password, PASSWORD_BCRYPT);
        } elseif ($created) {
            $inputs['password'] = null;
        } else {
            unset($inputs['password']);
        }

        // 8. Normalize dates
        foreach (['date_of_birth', 'nid_issue_date', 'start_date'] as $dateField) {
            if (!empty($inputs[$dateField])) {
                $parsed = date_create($inputs[$dateField]);
                if ($parsed) {
                    $inputs[$dateField] = $parsed->format('Y-m-d');
                }
            }
        }

        $inputs['status_id'] = $d->status_id ?? 1;
        $inputs['tenant_id'] = $ss->official_id;

        // 9. Save to database
        $saved_id = DBX::saveData($ss, 'team_member', ['id' => $id], $inputs, [], 1);
        if (!$saved_id) {
            return DV::error('create_failed');
        }

        // 10. Auto Code Generator
        if ($created) {
            setOfficialCode($branch_id, 'staff_code_control', 'team_member', ['id' => $saved_id], 'S', 4, null);
        }

        // Photo Storage
        if ($delete_prev_image) {
            $file_name = DB::table('team_member')
                ->where('id', $saved_id)
                ->value('photo_file_name');
            if ($file_name) {
                XPublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
            }
            DB::table('team_member')->where('id', $saved_id)->update(['photo_file_name' => null]);
        }

        XPublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo, null, ['id' => $saved_id, 'store' => 'team_member.photo_file_name']);

        return DV::depends(1, ['team_member' => $inputs, 'id' => $saved_id]);
    }

    public function getListTeamMemberPaginate($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $status_id = $d->status_id ?? null;
        $search_value = $d->search_value ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;

        if (!is_numeric($current_page)) $current_page = 1;
        $skip_rows = ($current_page - 1) * $per_page;

        $str_search = "1=1";
        $str_moreWhere = "2=2";

        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(s.name LIKE '%" . $search_value . "%' OR s.phone_number LIKE '%" . $search_value . "%' OR s.code LIKE '%" . $search_value . "%')";
        }
        if ($status_id) {
            $str_moreWhere .= ' AND s.status_id =' . $status_id;
        }

        $query = DB::table('team_member as s')
            ->join('staff_statuses as ss', 'ss.id', '=', 's.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->where('s.tenant_id', $ss->official_id)
            ->selectRaw("
                s.id, s.name, s.sex, s.date_of_birth, s.nationality_id,
                s.code, s.national_id, s.photo_file_name, s.position, s.start_date,
                s.passport_number, s.phone_number, s.email, s.address,
                s.status_id, ss.name as status,
                s.updated_at, s.update_user
            ")
            ->orderBy('s.status_id', 'asc')
            ->orderBy('s.created_at', 'desc');

        $clone_query = clone $query;
        $count = $clone_query->count('s.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->photo_file_name) {
                $row->image_url = self::profilePicture($row->id, $ss);
            }
            unset($row->photo_file_name);
            $row = setOfficialDates($row, ['date_of_birth', 'start_date', 'end_date'], ['updated_at'], []);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function profilePicture($id, $ss)
    {
        $col_subs_id = DBX::getHex('s.subs_id', 'subs_id');
        $row = DB::table('team_member as s')
            ->where('s.id', $id)
            ->selectRaw($col_subs_id . ',s.branch_id,s.photo_file_name')
            ->first();

        $def_image = self::defaultPhoto($row ? $row->subs_id : null);
        
        if ($row && $row->photo_file_name) {
            $url = XPublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => self::$img_dir], 'image') . $row->photo_file_name;
            return validateUrl($url, $def_image);
        }
        return $def_image;
    }

    static function defaultPhoto($subs_id)
    {
        return url('') . '/assets/images/default/placeholder.svg';
    }

    public static function getFormOptions($id, $ss)
    {
        return (object) [
            'spaces'       => GeneralSettings::create_team_space_options($ss),
            'nationalities'=> GeneralSettings::options_nationality($ss),
        ];
    }

    public static function getDetails($id, $ss = null)
    {
        $date_of_birth = DBX::formatDate("s.date_of_birth", 'date_of_birth');
        $nid_issue_date = DBX::formatDate("s.nid_issue_date", 'nid_issue_date');
        
        $row = DB::table('team_member as s')
            ->join('staff_statuses as ss', 'ss.id', '=', 's.status_id')
            ->where('s.id', $id)
            ->selectRaw("s.id,s.branch_id,s.name,s.code,s.national_id,s.passport_number,$date_of_birth,$nid_issue_date,s.nationality_id,s.photo_file_name,s.sex,s.status_id,ss.name as status,s.phone_number,s.email,s.address")
            ->first();
            
        if ($row) {
            $img = self::profilePicture($id, $ss);
            $row->image_url = $img;
            $row->photo = $img;
        }
        return $row;
    }

    public function deleteTeam($id)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('team_member')->where('id', $id)->delete();
        if ($deleted) {
            return DV::depends(1, ['id' => $id]);
        }
        return DV::error('Error deleting team member!');
    }

    public static function createProfilePicture($photo_data, $file_type = null, $id = null, $ss = null)
    {
        $col_subs_id = DBX::getHex('s.subs_id', 'subs_id');
        $team = DB::table('team_member as s')
            ->where('s.id', $id)
            ->selectRaw($col_subs_id . ',s.id,s.branch_id,s.photo_file_name')
            ->first();

        if (!$team) {
            return DV::error('Team member identify is not correct!');
        }

        $delete_image = (!$photo_data || isImage($photo_data));
        if ($delete_image && !empty($team->photo_file_name)) {
            XPublicStorage::delete(['subs_id' => $team->subs_id, 'dir' => self::$img_dir], 'image', $team->photo_file_name);
            DB::table('team_member')->where('id', $id)->update(['photo_file_name' => null]);
        }

        $res = XPublicStorage::saveImage(['subs_id' => $team->subs_id, 'dir' => self::$img_dir], null, $photo_data, null, ['id' => $id, 'store' => 'team_member.photo_file_name']);
        if ($res->status === 'Error') return $res;

        $img = self::profilePicture($id, $ss);
        return DV::depends(1, ['image_url' => $img]);
    }

    public function deleteProfilePicture($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $col_subs_id = DBX::getHex('s.subs_id', 'subs_id');
        $team = DB::table('team_member as s')
            ->where('id', $id)
            ->selectRaw($col_subs_id . ',s.id,s.photo_file_name')
            ->first();

        if (!$team) return DV::error('Team member identify is not correct!');

        if (!empty($team->photo_file_name)) {
            XPublicStorage::delete(['subs_id' => $team->subs_id, 'dir' => self::$img_dir], 'image', $team->photo_file_name);
        }
        DB::table('team_member')->where('id', $id)->update(['photo_file_name' => null]);

        return DV::success();
    }
}