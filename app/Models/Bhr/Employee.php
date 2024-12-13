<?php

namespace App\Models\Bhr;


use App\Models\Bhr\GeneralSettings;
use App\Models\Bhr\Event;

use App\Models\DV;
use App\Models\PublicStorage;
use Illuminate\Support\Facades\DB;
use App\Models\DBX;
use App\Models\Location\Country;
use Illuminate\Pagination\LengthAwarePaginator;

class Employee //extends Model
{
    //use HasFactory;

    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'employees';
    //employees Regitration default options | senderDetaultOptions() | employeesDefaultOptions


    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function checkUniqueEmployeeByPhone($phone_number, $id = null)
    {
        $str_id = "1=1";
        if (!$phone_number) return 'Phone number cannot be empty';
        if ($id > 0) $str_id = "emp.id <> $id";
        $x = DB::table('employees as emp')->where('emp.phone_number', $phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
        if ($x) return 'phone number"' . $phone_number . '" has been used by another employee';
        return null;
    }

    function checkUniqueEmployeeByNID($nid, $id = null)
    {
        $str_id = '1=1';
        if (!$nid) return 'National ID cannot be empty';
        if ($id > 0) $str_id = "emp.id <> $id";
        $x = DB::table('employees as emp')->where('emp.nid', $nid)->whereRaw($str_id)->select('id')->take(1)->exists();
        if ($x) return 'National ID "' . $nid . '" has been used by another employee';
        return null;
    }

    function save($arr = [], $id = null, $ss = null)
    {
        $emp_id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'name' => '1|string|0-100',
            'name_kh' => '0|string|0-100',
            'email' => '1|email',
            'phone_number' => '1|phone|0-20',
            'sex' => '1|choice|f,F,m,M,o',
            'nationality_id' => '1|number',
            'date_of_birth' => '1|date',
            'birth_city_id'=>'0|number',
            'address' => '0|string|0-250',
            'position_id' => '1|number',
            'emp_type_id' => '1|number',
            // 'branch_id' => '1|number',
            'salary' => '0|number',
            'work_shift_id' => '1|number',
            'joining_date' => '1|date',
            'nssf_id' => '0|string|0-100',
            'nid' => '1|string|1-100',
            'apply_payroll_tax' => '1|number|default = 0',
            'status_id' => '1|number|default = 10',
            'photo' => '0|image',
            'marital_status' => '1|string|0-100',
            'spouse_name' => '0|string|0-100',
            'spouse_emp_id' => '0|number',
            'spouse_occ_code' => '0|string|0-100',
            'passport_number' => '0|string|0-100',

        ];

        $checkUnique = null;

        $res = validateObject($arr, $v_rule, true, ['email' => GeneralSettings::$email_chars, 'photo' => GeneralSettings::$image_chars], $ss->lang, false, isset($arr['id']) ? null : $checkUnique);
        if ($res->error) {
            return DV::error($res->error);
        }


        $inputs = $res->values;
        $d = (object) $inputs;
        $photo = $d->photo;
        $d->phone_number = str_replace(' ', '', $inputs['phone_number']);
        $inputs['phone_number'] = $d->phone_number;
        $phone_check = $this->checkUniqueEmployeeByPhone($d->phone_number, $emp_id);
        if ($phone_check) return DV::error($phone_check);

        $nid_check = $this->checkUniqueEmployeeByNID($d->nid, $emp_id);
        if ($nid_check) return DV::error($nid_check);

        if (!$d->name_kh) {
            $d->name_kh = $d->name;
            $inputs['name_kh'] = $d->name_kh;
        }
        unset($inputs['photo']);
        $employee_created = !$emp_id;
        $delete_prev_image = ($emp_id > 0 && (!$photo || isImage($photo)));

        if ($d->emp_type_id == '3' && !empty($d->position_id)) {
            $position = DB::table('positions')->where('id', $d->position_id)->first(['salary']);
            if ($position) {
                $inputs['salary'] = $position->salary;
            } else {
                return DV::error('Position not found');
            }
        } else if ($d->emp_type_id != '3') {

            $inputs['salary'] = null;
        }

        //error_log('Saving data: ' . json_encode($inputs)); //Please remove uused log
        $save = !$emp_id;
        $id = saveData($ss, 'employees', ['id' => $emp_id], $inputs, [], 1);
        if ($save) {
            $prefix = 'LC';
            $res = setOfficialCode($branch_id, 'employee_code_control', 'employees', ['id' => $id], $prefix, 5, null);
            $new_code = $res->code;
        }
        if ($id > 0) {
            $new_code = null;

            if ($delete_prev_image) {
                $file_name = DB::table('employees as emp')->where('emp.id', $id)->take(1)->value('emp.photo_file_name');
                if ($file_name) {
                    PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
                }

                DB::table('employees')->where('id', $id)->update(['photo_file_name' => null]);
            }
            PublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo, null, ['id' => $id, 'store' => 'employees.photo_file_name']);
            return DV::depends(1, ['employees' => $inputs, 'id' => $id]);
        }

        return DV::error('Failed to save employee');
    }


    // function saveProfilePicture($photo_data,$file_type = null,$id=null,$ss=null){
    //     $id = $id ?? $this->id;
    //     $ss = $ss ?? $this->userInfo;
    //     $col_subs_id = DBX::getHex('e.subs_id','subs_id');
    //     $employee = DB::table('employees as e')->where('e.id',$id)->selectRaw($col_subs_id.',e.id,e.branch_id,e.photo_file_name')->first();
    //     $delete_image = (!$photo_data || isImage($photo_data));
    //     if(!$employee)return DV::error('Emplyee identity is not correct!');
    //     if($delete_image){
    //       PublicStorage::delete(['subs_id'=>$ss->subs_id,'dir'=>self::$img_dir],'image',$employee->photo_file_name);
    //       DB::table('employees')->where('id',$id)->update(['photo_file_name'=>null]);
    //     }
    //     return PublicStorage::saveImage(['subs_id'=>$ss->subs_id,'dir'=> self::$img_dir] ,null,$photo_data,null,['id'=>$id,'store'=>'employees.photo_file_name']);
    //   }
    static function saveProfilePicture($photo_data, $file_type = null, $id = null, $ss = null)
    {
        $id = $id ?? $id; // Remove the reference to $this->id
        $ss = $ss ?? $ss;
        $col_subs_id = DBX::getHex('e.subs_id', 'subs_id');
        $employee = DB::table('employees as e')->where('e.id', $id)->selectRaw($col_subs_id . ',e.id,e.branch_id,e.photo_file_name')->first();
        $delete_image = (!$photo_data || isImage($photo_data));
        if (!$employee) {
            return DV::error('Employee identity is not correct!');
        }
        if ($delete_image) {
            PublicStorage::delete(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'image', $employee->photo_file_name);
            DB::table('employees')->where('id', $id)->update(['photo_file_name' => null]);
        }
        return PublicStorage::saveImage(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo_data, null, ['id' => $id, 'store' => 'employees.photo_file_name']);
    }

    static function isOnLeave($id)
    {
        $today = date('Y-m-d');
        $start_date = DBX::convertToDate('l.start_date');
        $end_date = DBX::convertToDate('l.end_date');
        $str_dates = $today . " BETWEEN $start_date AND $end_date";
        return DB::table('leaves as l')->where('l.id', $id)->whereRaw($str_dates)->value('id');
    }



    static function getCurrentLeaveInfo($id)
    {
        $today = date('Y-m-d');
        $start_date = DBX::convertToDate('l.start_date');
        $end_date = DBX::convertToDate('l.end_date');
        $str_dates = $today . " BETWEEN $start_date AND $end_date";
        $col_start_date = DBX::formatDate('l.start_date', 'start_date');
        $col_end_date = DBX::formatDate('l.end_date', 'end_date');
        $col_update_date = DBX::formatDate('l.updated_at', 'update_date');
        return DB::table('leaves as l')->join('leave_types as t', 't.id', '=', 'l.leave_type_id')->where('l.id', $id)->whereRaw($str_dates)->selectRaw("l.id,$col_start_date, $col_end_date, l.leave_type_id, t.name AS leave_type, remarks, update_user, $col_update_date")->first();
    }

    static function getPayrollListBenefit($payroll_id, $emp_id)
    {
        $withdraw_rate = 0;
        $benefit_id = 0;
        $full_amount = 0;
        $tax_option_id = 0;
        $used_amount = 0;

        $payroll = DB::table('payrolls as p')
            ->where('id', $payroll_id)
            ->selectRaw('p.month, p.year')
            ->first();

        if ($payroll) {
            $bdp = DB::table('benefit_disburse_policies')
                ->where('target_month', $payroll->month)
                ->where('target_year', $payroll->year)
                ->selectRaw('id,withdraw_rate, benefit_id')
                ->first();
        }
        $withdraw_rate = $bdp->withdraw_rate ?? 0;
        $benefit_id = $bdp->benefit_id ?? 0;

        $bd = DB::table('benefit_disbursements')
            ->where('benefit_id', $benefit_id)
            ->where('emp_id', $emp_id)
            ->selectRaw('id,withdraw_rate,target_month,target_year')
            ->first();

        if($bd)$withdraw_rate = $bd->withdraw_rate;

        $emp_benefit = DB::table('emp_benefits')
            ->where('emp_id', $emp_id)
            ->where('benefit_id', $benefit_id)
            ->selectRaw('id,amount, tax_option_id,flat_tax_rate')
            ->first();

        $full_amount = $emp_benefit->amount ?? 0;
        $tax_option_id = $emp_benefit->tax_option_id ?? 0;
        $used_amount = $full_amount * ($withdraw_rate / 100);

        $result = (object) [
            "emp_id" => $emp_id,
            "payroll_id" => $payroll_id,
            "withdraw_rate"=> $withdraw_rate,
            "benefit_id" => $benefit_id,
            "full_amount"=> $full_amount,
            "tax_option_id" => $tax_option_id,
            "used_amount"=> $used_amount,

        ];
        return $result;
    }
    static function savePayrollListBenefit($arr, $ss)
    {
        $v_rule = [
            'id' => '0|identity=1',
            'payroll_id' => '1|number',
            'emp_id' => '1|number',
            'benefit_id' => '1|number',
            'full_amount' => '1|number',
            'withdraw_rate' => '0|number',
            'tax_option_id' => '1|number',
            'used_amount' => '0|number',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        $inputs['id'] = $inputs['id'] ?? null;

        $existing = DB::table('payroll_list_benefits')
            ->where('payroll_id', $inputs['payroll_id'])
            ->where('emp_id', $inputs['emp_id'])
            ->where('benefit_id', $inputs['benefit_id'])
            ->first();

        if ($existing) {
            return DV::depends(1, ['message' => 'Record already exists', 'id' => $existing->id]);
        }

        $id = saveData($ss, 'payroll_list_benefits', ['id' => $inputs['id']], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['payroll_list_benefits' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving payroll list benefit!');
    }



    function deleteProfilePicture($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $sender = DB::table('employees as s')->where('id', $id)->selectRaw('id,branch_id,photo_file_name')->first();
        if (!$sender) return DV::error('Employee identity is not correct!');
        PublicStorage::delete(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'image', $sender->photo_file_name);
        DB::table('sender')->where('id', $id)->update(['photo_file_name' => null]);
        return DV::success();
    }

    static function profilePicture($id)
    {
        $col_subs_id = DBX::getHex('e.subs_id', 'subs_id');
        $row = DB::table('employees as e')->where('e.id', $id)->selectRaw($col_subs_id . ',e.branch_id,e.photo_file_name')->first();
        $def_image = self::defaultPhoto($row ? $row->subs_id : null);
        $url = '';
        if ($row) {
            $url = PublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => self::$img_dir], 'image') . $row->photo_file_name;
            return validateUrl($url, $def_image);
        } else return $def_image;
    }

    static function defaultPhoto($subs_id)
    {
        return url('') . '/assets/images/default/default-staff.png';
    }


    function getListPaginate($arr, $ss)
    {
        $subs_id = $ss->subs_id;
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $status = $d->status_id ?? 10;
        $type = $d->emp_type_id ?? 3;
        $search_value = $d->search_value ?? null;
        $branch = $d->branch_id ?? null;
        $work_shift = $d->work_shift_id ?? null;
        $str_srch = '1=1';
        $str_where = '2=2';

        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_srch = "(emp.name LIKE '%" . $search_value . "%' OR emp.code = '" . $search_value . "' OR emp.nid = '" . $search_value . "' OR emp.phone_number = '" . $search_value . "')";
        }else{

            if ($status) {
                $str_where = 'emp.status_id =\'' . $status . '\'';
            }

            if ($type) {
                $str_where .= ' AND emp.emp_type_id =\'' . $type . '\'';
            }
            if ($branch) {
                $str_where .= ' AND emp.branch_id=\'' . $branch . '\'';
            }
            if ($work_shift) {
                $str_where .= ' AND emp.work_shift_id=\'' . $work_shift . '\'';
            }
        }

        $countries = Country::listAll($ss);
        $query = DB::table('employees as emp')
        ->join('positions as p', 'p.id', '=', 'emp.position_id')
        ->join('departments as d', 'd.id', '=', 'p.department_id')
        ->join('employee_statuses as es', 'es.id', '=', 'emp.status_id')
        ->join('emp_types as el', 'el.id', '=', 'emp.emp_type_id')
        ->join('work_shifts as ws', 'ws.id', '=', 'emp.work_shift_id')
        ->join('um_branches as b', 'b.id', '=', 'emp.branch_id')
        ->join('loc_countries as c', 'c.id', '=', 'emp.nationality_id')
        ->whereRaw($str_srch)
            ->whereRaw($str_where)
            ->selectRaw('
            emp.code,
            emp.id,
            emp.branch_id,
            emp.name,
            emp.name_kh,
            emp.email,
            emp.phone_number,
            emp.nationality_id,
            c.name as nationality,
            emp.spouse_name,
            emp.spouse_occ_code,
            emp.passport_number,
            emp.spouse_emp_id,
            emp.sex,
            DATE_FORMAT(emp.date_of_birth, "%d %b %Y") as date_of_birth,
            emp.address,
            emp.photo_file_name,
            DATE_FORMAT(emp.joining_date, "%d %b %Y") as joining_date,
            emp.nssf_id,
            emp.nid,
            emp.position_id,
            p.title as position,
            emp.salary,
            emp.emp_type_id,
            el.name as type,
            emp.work_shift_id,
            ws.name as work_shift,
            emp.apply_payroll_tax,
            emp.marital_status,
            emp.status_id,
            b.name as branch_name,
            es.name as status
        ')
            ->orderBy('emp.id', 'DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('emp.id');

        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->photo_file_name) {
                $row->image_url = self::profilePicture($row->id);
            }
            unset($row->photo_file_name);
        }
        foreach($rows as &$row){
             $row->nationality = Country::nationality($row->nationality_id,$countries);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function props($id, $cols)
    {
        if (!$id) return null;
        return DB::table('employees as e')->where('e.id', $id)->selectRaw($cols)->first();
    }


    function find($arr, $ss)
    {
        $subs_id = $ss->subs_id;
        //$branch_id = $ss->branch_id;
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $status = $d->status_id ?? null;
        $type = $d->emp_type_id ?? null;
        $search_value = $d->search_value ?? null;
        $str_srch = '1=1';
        $str_where = '2=2';
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_srch = "(emp.name LIKE '%" . $search_value . "%' OR emp.name_kh = '" . $search_value . "' OR emp.nid = '" . $search_value . "' OR emp.phone_number = '" . $search_value . "')";
        }
        if ($status) {
            $str_where = 'emp.status_id =\'' . $status . '\'';
        }
        if ($type) {
            $str_where = 'emp.emp_type_id =\'' . $type . '\'';
        }
        $query = DB::table('employees as emp')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('employee_statuses as es', 'es.id', '=', 'emp.status_id')
            ->join('emp_types as el', 'el.id', '=', 'emp.emp_type_id')
            ->join('work_shifts as ws', 'ws.id', '=', 'emp.work_shift_id')
            ->whereRaw($str_srch)
            ->whereRaw($str_where)
            ->selectRaw('
            emp.code,
            emp.id,
            emp.name,
            emp.name_kh,
            emp.email,
            emp.phone_number,
            emp.sex,
            emp.date_of_birth,
            emp.address,
            emp.photo_file_name,
            emp.joining_date,
            emp.nssf_id,
            emp.nid,
            emp.position_id,
            p.title as position,
            emp.salary,
            ws.name as work_shift,
            emp.marital_status,
            emp.status_id,
            emp.apply_payroll_tax,
            es.name as status
        ')
            ->orderBy('emp.id', 'ASC');

        $clone_query = clone $query;
        $count = $clone_query->count('emp.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->photo_file_name) {
                $row->image_url = PublicStorage::getUrl($row->branch_id, 'customer', 'image') . $row->photo_file_name;
                unset($row->photo_file_name);
                if (!$row->image_url) $row->image_url = self::defaultImage($ss->branch_id);
            }
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
    static function defaultImage()
    {
        return PublicStorage::getUrl(['subs_id' => null, 'dir' => 'default'], 'image') . 'mr3.jpg';
        // return PublicStorage::getUrl($branch_id, 'default', 'image') . 'default_agent.png';
    }
    function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;

        $row = DB::table('employees as emp')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('employee_statuses as es', 'es.id', '=', 'emp.status_id')
            ->join('emp_types as el', 'el.id', '=', 'emp.emp_type_id')
            ->join('work_shifts as ws', 'ws.id', '=', 'emp.work_shift_id')
            ->join('um_branches as b', 'b.id', '=', 'emp.branch_id')

            ->selectRaw('
                emp.code,
                emp.id,
                emp.branch_id,
                emp.name,
                emp.name_kh,
                emp.email,
                emp.phone_number,
                emp.sex,
                emp.nationality_id,
                emp.passport_number,
                emp.date_of_birth,
                emp.address,
                emp.photo_file_name,
                emp.joining_date,
                emp.nssf_id,
                emp.nid,
                emp.position_id,
                p.title as position,
                emp.salary,
                emp.emp_type_id,
                el.name as type,
                emp.work_shift_id,
                ws.name as work_shift,
                emp.apply_payroll_tax,
                emp.status_id,
                emp.spouse_name,
                emp.spouse_occ_code,
                emp.spouse_emp_id,
                b.name as branch_name,
                es.name as status,
                emp.marital_status,
                emp.birth_city_id
            ')
            ->where('emp.id', $id)
            ->first();

        if ($row) {
            $row->image_url = self::profilePicture($id);
            $row->nationality = Country::nationality($row->nationality_id,null);
        } else {
            $row = null; // Or handle the case where employee is not found
        }

        return $row;
    }


    function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        if (!isset($ss->branch_id) || !isset($ss->subs_id)) {
            return DV::error('Invalid session data');
        }

        $file_name = DB::table('employees')->where('id', $id)->value('photo_file_name');
        if ($file_name) {
            // Delete the file from the storage
            PublicStorage::delete([
                'branch_id' => null,
                'subs_id' => $ss->subs_id,
                'dir' => self::$img_dir,
            ], 'images', $file_name);
        }

        // Update the profile to rempove the photo file name
        DB::table('employees')->where('id', $id)->update(['photo_file_name' => null]);

        // Delete the profile
        $deleted = DB::table('employees')->where('id', $id)->delete();

        // Check if the query was successful
        if (!$deleted) {
            return DV::error('employee not found or not deleted');
        }

        // Return success response
        return DV::depends(1, ['id' => $id, 'deleted' => $file_name ?? 'No file found']);
    }
    static function currentPosition($id)
    {
        return DB::table('employees as e')->join('positions as p', 'p.id', '=', 'e.position_id')->selectRaw('p.title , p.id')->first();
    }
    function getFormOptions($id, $ss)
    {
        $employee = null;
        if ($id) {
            $employee = self::getDetails($id, $ss);
        }
        return (object) [
            'nationalities' => GeneralSettings::options_nationality($ss),
            'cities' => GeneralSettings::loc_options_city($ss),
            'branches' => GeneralSettings::options_branch($ss),
            'status' => DB::table('employee_statuses')->selectRaw('id,name')->get(),
            'departments'=>DB::table('departments')->selectRaw('id,name')->get(),
            'positions' => DB::table('positions')->selectRaw('id,title')->get(),
            'types' => DB::table('emp_types')->selectRaw('id,name')->get(),
            'work_shifts' => DB::table('work_shifts')->selectRaw('id,name')->get(),
            'employee' => $employee,
            'spouse_employee' => GeneralSettings::options_employee(10, $ss),
        ];
    }
    function setTerminateStatus($status_id, $id = null, $ss = null)
    {
        $ss = $ss ? $ss : $this->userInfo;
        $id = $id ?? $this->id;

        $emp = $this->getProps($id, 'status_id');
        if (!$emp) {
            return DV::error('Employee ID not found!');
        }


        $events = [
            'active.30' => 'Terminated'
        ];
        $key = $emp->status_id . '.' . $status_id;
        $event_name = $events[$key] ?? 'Terminated';

        $event_id = self::getEventId($event_name);
        if (!$event_id) {
            $event_data = ['name' => $event_name];
            $event_result = Event::createEvent($event_data, $ss);
            $event_id = $event_result->status_code == 200 ? $event_result->data['id'] : '';
        }


        if (!$event_id) {
            return DV::error('Failed to create or retrieve terminated event.');
        }
        $event_date = date('Y-m-d');
        $impact = $status_id > $emp->status_id ? 'Positive' : ($status_id < $emp->status_id ? 'Negative' : 'Neutral');
        $event_inputs = [
            'emp_id' => $id,
            'event_id' => $event_id,
            'impact' => $impact,
            'remarks' => 'terminated',
            'event_date' => $event_date
        ];

        $event_saved = saveData($ss, 'emp_events', [], $event_inputs, [], 1, false);
        if (!$event_saved) {
            return DV::error('Failed to log resignation event.');
        }
        $x = DB::table('employees')->where('id', $id)->update(['status_id' => $status_id]);
        return DV::depends($x, ['Employee status', 'updated']);
    }
    static function getEventId($name)
    {
        return DB::table('events')->where('name', $name)->value('id');
    }
    function getProps($id, $props = [])
    {
        $cols = is_array($props) ? implode(',', $props) : $props;
        $row = DB::table('employees')->where('id', $id)->selectRaw($cols)->first();
        return $row;
    }
    function promoteIntern($emp_type_id, $id = null, $ss = null, $arr)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $d = (object)$arr;
        $remarks = $d->remarks;
        $event_date = $d->event_date;

        if ($event_date) {
            $event_date = date('Y-m-d', strtotime($event_date));
        }

        $events = [
            '1.2' => 'promote intern to probation',
            '1.3' => 'Promote intern to staff',
            '2.3' => 'Promote probation to staff'
        ];

        $emp = $this->getProps($id, 'emp_type_id');
        if (!$emp) {
            return DV::error('Employee ID not found!');
        }

        $key = $emp->emp_type_id . '.' . $emp_type_id;
        $event_name = $events[$key] ?? null;
        $event_id = self::getEventId($event_name);

        if (!$event_id) {
            $event_arr = (array)['name' => $event_name];
            $event_id = Event::createEvent($event_arr, $ss);
            $event_id = $event_id->status_code == 200 ? $event_id->data['id'] : '';
        }

        $save_emp_type_id = saveData($ss, 'employees', ['id' => $id], ['emp_type_id' => $emp_type_id], [], 1, false);

        if ($save_emp_type_id) {

            $impact = $emp_type_id > $emp->emp_type_id ? 'Positive' : ($emp_type_id < $emp->emp_type_id ? 'Negative' : 'Neutral');
            $inputs = [
                'emp_id' => $id,
                'event_id' => $event_id,
                'impact' => $impact,
                'remarks' => $remarks,
                'event_date' => $event_date
            ];

            saveData($ss, 'emp_events', [], $inputs, [], 1, false);

            return DV::depends($save_emp_type_id, ['Employee', 'updated']);
        }

        return DV::error('Failed to update employee.');
    }
    public function setResignStatus($arr = [], $id = null, $ss = null, $status_id)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;

        $v_rule = [
            'effective_date' => '1|date',
            'resign_date' => '1|date',
            'remarks' => '0|string|1-300'
        ];


        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $inputs['emp_id'] = $id;


        $emp = $this->getProps($id, 'status_id');
        if (!$emp) {
            return DV::error('Employee ID not found!');
        }


        $events = [
            'active.20' => 'Resignation'
        ];
        $key = $emp->status_id . '.' . $status_id;
        $event_name = $events[$key] ?? 'Resignation';

        $event_id = self::getEventId($event_name);
        if (!$event_id) {
            $event_data = ['name' => $event_name];
            $event_result = Event::createEvent($event_data, $ss);
            $event_id = $event_result->status_code == 200 ? $event_result->data['id'] : '';
        }


        if (!$event_id) {
            return DV::error('Failed to create or retrieve resignation event.');
        }

        $event_date = date('Y-m-d', strtotime($inputs['resign_date']));
        // $impact = $status_id > $emp->status_id ? 'Positive' : ($status_id < $emp->status_id ? 'Negative' : 'Neutral');
        $event_inputs = [
            'emp_id' => $id,
            'event_id' => $event_id,
            'impact' => 'Negative',
            'remarks' => $inputs['remarks'] ?? '',
            'event_date' => $event_date
        ];

        $event_saved = saveData($ss, 'emp_events', [], $event_inputs, [], 1, false);
        if (!$event_saved) {
            return DV::error('Failed to log resignation event.');
        }


        $resign_id = saveData($ss, 'resignations', ['id' => null], $inputs, [], 1);
        if ($resign_id) {

            DB::table('employees')->where('id', $id)->update(['status_id' => 20]);

            return DV::depends(1, ['new resign' => $inputs], 'Resignation processed successfully.');
        }

        return DV::error('Failed to save resignation record.');
    }
    public function setRejoinStatus($arr = [], $id = null, $ss = null, $status_id)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $v_rule = [
            'rejoin_date' => '1|date',
            'remarks' => '0|string|1-300'
        ];
        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $inputs['emp_id'] = $id;
        $emp = $this->getProps($id, 'status_id');
        if (!$emp) {
            return DV::error('Employee ID not found!');
        }


        $events = [
            'active.10' => 'Rejoin'
        ];
        $key = $emp->status_id . '.' . $status_id;
        $event_name = $events[$key] ?? 'Rejoin';

        $event_id = self::getEventId($event_name);
        if (!$event_id) {
            $event_data = ['name' => $event_name];
            $event_result = Event::createEvent($event_data, $ss);
            $event_id = $event_result->status_code == 200 ? $event_result->data['id'] : '';
        }
        if (!$event_id) {
            return DV::error('Failed to create or retrieve rejoin event.');
        }

        $event_date = date('Y-m-d', strtotime($inputs['rejoin_date']));
        // $impact = $status_id > $emp->status_id ? 'Positive' : ($status_id < $emp->status_id ? 'Negative' : 'Neutral');
        $event_inputs = [
            'emp_id' => $id,
            'event_id' => $event_id,
            'impact' => 'Positive',
            'remarks' => $inputs['remarks'] ?? '',
            'event_date' => $event_date
        ];

        $event_saved = saveData($ss, 'emp_events', [], $event_inputs, [], 1, false);
        if (!$event_saved) {
            return DV::error('Failed to log rejoin event.');
        }


        $rejoin_id = saveData($ss, 'rejoins', ['id' => null], $inputs, [], 1);
        if ($rejoin_id) {

            DB::table('employees')->where('id', $id)->update(['status_id' => 10]);

            return DV::depends(1, ['rejoin' => $inputs], 'rejoin processed successfully.');
        }

        return DV::error('Failed to save rejoin record.');
    }

    function promoteStaff($arr, $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $d = (object)$arr;
        $change_branch = $d->change_branch ?? null;
        $change_position = $d->change_position ?? null;
        $change_salary = $d->change_salary ?? null;

        if (!$change_branch && !$change_position && !$change_salary) {
            return DV::error('No Promotion Request!');
        }

        // Create promotion record
        $promo_id = self::createPromotion($arr, $ss);
        if (!$promo_id) return DV::error('Failed to create promotion');

        $event_names = [];
        $remarks = $d->remarks ?? null;
        $event_date = $d->event_date ?? date('Y-m-d');

        if ($change_branch) {
            $resBranch = self::changeBranch($ss, $id, $promo_id, $change_branch);
            if ($resBranch) $event_names[] = 'Change Branch';
        }

        if ($change_position) {
            $resPosition = self::changePosition($ss, $id, $promo_id, $change_position);
            if ($resPosition) $event_names[] = 'Change Position';
        }

        if ($change_salary) {
            $resSalary = self::changeSalary($ss, $id, $promo_id, $change_salary);
            if ($resSalary) $event_names[] = 'Change Salary';
        }

        foreach ($event_names as $event_name) {
            $event_data = [
                'name' => $event_name,
                'remarks' => $remarks,
                'event_date' => $event_date,
            ];

            $event_id = self::getEventId($event_name);
            if (!$event_id) {
                $event = Event::createEvent($event_data, $ss);
                $event_id = $event->status_code == 200 ? $event->data['id'] : null;
            }

            if (!$event_id) {
                return DV::error("Failed to create or fetch event: $event_name.");
            }

            $inputs = [
                'emp_id' => $id,
                'event_id' => $event_id,
                'impact' => 'Positive',
                'remarks' => $remarks,
                'event_date' => $event_date,
            ];

            saveData($ss, 'emp_events', [], $inputs, [], 1, false);
        }

        return DV::success(['message' => 'Employee promotion updated successfully.']);
    }

    static function changeBranch($ss, $emp_id,$promo_id,$arr)
    {

    if (!$arr) return;

    $v_rule = [
        'branch_id' => '1|number',
        'effective_date' => '1|date',
        'remarks' => '0|string|1-300',
    ];

    $res = validateObject($arr, $v_rule, true, [], $ss->lang);
    if ($res->error) {
        return DV::error($res->error);
    }

    $inputs = $res->values;
    $inputs['promo_id'] = $promo_id;
    $inputs['emp_id'] = $emp_id;

    $id = saveData($ss, 'emp_branches', ['id' => null], $inputs, [], 1, false);
    $branch_id = $arr['branch_id'];
    $updated = DB::table('employees')->where('id', $emp_id)->update(['branch_id' => $branch_id]);
    return DV::depends(1,null);
    }

    static function changePosition($ss,$emp_id,$promo_id,$arr){
        if(!$arr) return;
        $v_rule = [
            'position_id' => '1|number',
            'start_date' => '1|date',
            'remarks' =>'0|string|0-300'
        ];
        $res = validateObject($arr,$v_rule,true,[],$ss->lang);
        if($res->error) {
            return DV::error($res->error);
        }
        if (empty($inputs['effective_date'])) {
            return DV::error('The effective date is required.');
        }
        $inputs = $res->values;
        $inputs['promo_id'] =$promo_id;
        $inputs['emp_id'] = $emp_id;

        $id = saveData($ss,'emp_positions',['id'=>null],$inputs,[],1,false);
        $position_id = $arr['position_id'];
        $updated = DB::table('employees')->where('id',$emp_id)->update(['position_id'=>$position_id]);


        return DV::depends(1,null);


    }
    static function changeSalary($ss,$emp_id,$promo_id,$arr){
        if(!$arr) return;
        $v_rule = [
            'org_position_id' =>'0|number',
            'new_position_id' =>'0|number',
            'org_salary' => '0|decimal',
            'new_salary' => '0|decimal',


        ];
        $res = validateObject($arr,$v_rule,true,[],$ss->lang);
        $inputs = $res->values;
        $org_salary = DB::table('employees')->where('id', $emp_id)->value('salary');
        $org_position_id = DB::table('employees')->where('id', $emp_id)->value('position_id');

        $inputs['promo_id'] = $promo_id;
        $inputs['emp_id'] = $emp_id;
        $inputs['org_salary'] = $org_salary;
        $inputs['org_position_id'] = $org_position_id;


            $id = saveData($ss,'emp_salary_histories',['id'=>null],$inputs,[],1,false);
            $salary = $arr['new_salary'];
            $updated = DB::table('employees')->where('id',$emp_id)->update(['salary'=>$salary]);


        return DV::depends(1,null);


    }
    static function createPromotion($arr,$ss = null){
        $ss = $ss ?? self::userInfo;
        $branch_id = $ss->branch_id;

          $v_rule = [
            'id' => '0|identity=1',
            'emp_id'=>'1|number',
            'promotion_date' => '0|date',
            'change_branch' => '0|number|default=0',
            'change_position' => '0|number|default=0',
            'change_salary' => '0|number|default=0',

        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return null;
        }
        $id = $res->id;
        $inputs = $res->values;
        $d = (object)$inputs;
        $promotion_date = $d->promotion_date;
        $emp_id = $d->emp_id;
        $change_branch = !empty($d->change_branch) ? 1 : 0;
        $change_position = !empty($d->change_position) ? 1 : 0;
        $change_salary = !empty($d->change_salary) ? 1 : 0;

        $promo_inputs = [
            'emp_id' => $emp_id,
            'promotion_date' => $promotion_date,
            'change_branch' => $change_branch,
            'change_position' => $change_position,
            'change_salary' => $change_salary,
        ];


        $id = saveData($ss, 'emp_promotions', ['id' => $id], $promo_inputs, [], 1,false);
        if ($id > 0) {
            return $id;
        }

        return null;
    }

    function getEmployeeList($arr, $ss=null) {
        $d = (object) $arr;

        $search_value = $d->search_value ?? null;

        $str_search = '1=1';
        $query = DB::table('employees as emp')
        ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
        ->selectRaw('emp.id, emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email,emp.address,emp.joining_date')
        ->where('emp.branch_id', $ss->branch_id);  // Ensure only records for the current branch are fetched
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("emp.name LIKE '%" . $search_value . "%' OR emp.code LIKE '%" . $search_value . "%'");
        }
        $rows = $query->get();
        return $rows;
   }
}
