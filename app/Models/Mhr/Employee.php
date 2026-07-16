<?php

namespace App\Models\Mhr;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Vsd\Database\DBX;
use Vsd\Response\DV;
use XPublicStorage;
use App\Models\Prm\GeneralSettings;
use Vsd\Vsloquent\VSModel;
use Vsd\Money\Models\VSMoney;
use App\Models\Location\Country;
use App\Models\Umt\Branch;



class Employee extends VSModel
{
    protected $table = 'employees';
    protected static $img_dir = 'employees';

    protected $userInfo = null;

    static function getProps($id, $cols){
          if(!$cols) $cols = 'id,code,name,sex';
          return DB::table('employees as e')->where('e.id',$id)->selectRaw($cols)->first();
    }
    static function log($ss, $emp_id, $action_name, $message = ''){
       $inputs = [
         'emp_id'=>$emp_id,
         'action_name'=>$action_name,
         'description'=>$message
       ];
       DBX::saveData($ss,'employee_log',['id'=>null],$inputs,[],1,false);
    }

    public static function resolveWorkShiftId($ss)
    {
        $subsId = $ss->subs_id ?? null;
        $subsBin = $subsId ? @hex2bin($subsId) : null;

        if ($subsBin) {
            $id = DB::table('work_shifts')
                ->where('subs_id', $subsBin)
                ->orderBy('id')
                ->value('id');
            if ($id) {
                return $id;
            }
        }

        $id = DB::table('work_shifts')->orderBy('id')->value('id');
        if ($id) {
            return $id;
        }

        $now = getNowTime();
        return DB::table('work_shifts')->insertGetId([
            'name' => 'Default',
            'subs_id' => $subsBin,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    public static function checkUniqueEmployeeByPhone($phone_number, $id = null)
    {
        if (empty($phone_number)) {
            return 'Phone number cannot be empty';
        }
        $query = DB::table('employees')
            ->where('phone_number', $phone_number);
        if (!empty($id)) {
            $query->where('id', '<>', $id);
        }
        if ($query->exists()) {
            return 'Phone number "' . $phone_number . '" has already been used by another employee.';
        }
        return null;
    }

    function checkUniqueEmployeeByNID($nid, $id = null)
    {
        if(!$nid) return null;
        $str_id = '1=1';
        if (!$nid) return 'National ID cannot be empty';
        if ($id > 0) $str_id = "emp.id <> $id";
        $x = DB::table('employees as emp')->where('emp.nid', $nid)->whereRaw($str_id)->select('id')->take(1)->exists();
        if ($x) return 'National ID "' . $nid . '" has already been used by another employee.';
        return null;
    }
    static function isOnLeave($id){
        $today = date('Y-m-d');
        $start_date = DBX::convertToDate('l.start_date');
        $end_date = DBX::convertToDate('l.end_date');
        $str_dates = $today . " BETWEEN $start_date AND $end_date";
        return DB::table('leaves as l')->where('l.id',$id)->whereRaw($str_dates)->value('id');
    }
    public function upsert($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            // 'branch_id'=>'0|branch_id|exists='.DBX::branchTable().'.id',
            'name'            => '1|string|0-150|text=name_required::@key;@max;@value',
            'name_kh'         => '1|string|0-150|text=name_required::@key;@max;@value',
            'sex'             => '1|choice|F,M|text=select_gender',
            'phone_number'    => '1|string|1-30|text=phone_number_required',
            'email'           => '0|email|1-30',
            'nationality_id'  => '1|number|text=nationality_required',
            'date_of_birth'   => '1|date|text=date_of_birth_required',
            'birth_city_id'=>'0|number',
            'position_id' => '1|number',
            'emp_type_id' => '1|number',
            'salary' => '0|number',
            'currency_code' => '1|choice|KHR,USD|default=' . VSMoney::$base_currency,
            'work_shift_id' => '0|number|exists=work_shifts.id',
            'joining_date' => '1|date',
            'nssf_id' => '0|string|0-30',
            'nid' => '1|string|1-30|text=national_id_required',
            'nid_expiry_date' => '0|date|text=issue_date',
            'apply_payroll_tax' => '1|number|default = 1',
            'status_id' => '1|number|default = 10',
            'photo' => '0|image',
            'marital_status' => '1|string|0-30',
            'spouse_name' => '0|string|0-30',
            'spouse_emp_id' => '0|number',
            'spouse_occ_code' => '0|string|0-30',
            'passport_number' => '0|string|0-30',
            'passport_expiry_date' => '0|date',
            'address'         => '1|string|text=enter_address',
            'branch_id' => '1|number|default = 1',

        ];
        $checkUnique = null;
        $res = DBX::validateObject($arr, $v_rule, true, ['email' => GeneralSettings::$email_chars, 'photo' => GeneralSettings::$image_chars], $ss->lang, false, isset($arr['id']) ? null : $checkUnique);
        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object) $inputs;
        if (empty($inputs['work_shift_id'])) {
            $inputs['work_shift_id'] = self::resolveWorkShiftId($ss);
        }
        $inputs['currency_code'] = VSMoney::$base_currency ?: 'KHR';
        $d->currency_code = $inputs['currency_code'];
        $nid = $d->nid ?? null;
        if($nid){
            $expire_date = $d->nid_expiry_date ?? null;
            if (!$expire_date) return DV::error('Expiry Date for National ID Card is required');
            else $inputs['nid_expiry_date'] = convertDate($expire_date);
        } else $inputs['nid_expiry_date'] = null;

        $passport_number = $d->passport_number;
        if($passport_number){
            $expire_date = $d->passport_expiry_date ?? null;
            if (!$expire_date) return DV::error('Expiry Date for passport is required');
            else $inputs['passport_expiry_date'] = convertDate($expire_date);
        } else $inputs['passport_expiry_date'] = null;

        $photo = $d->photo;
        $d->phone_number = str_replace(' ', '', $inputs['phone_number']);
        $inputs['phone_number'] = $d->phone_number;
        $phone_check = $this->checkUniqueEmployeeByPhone($d->phone_number, $id);
        if ($phone_check) return DV::error($phone_check);

        $nid_check = $this->checkUniqueEmployeeByNID($d->nid, $id);
        if ($nid_check) return DV::error($nid_check);

        if (!$d->name_kh) {
            $d->name_kh = $d->name;
            $inputs['name_kh'] = $d->name_kh;
        }
        unset($inputs['photo']);
        $created = !$id;
        $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));
        $salary = $d->salary ?? 0;
        if ($d->emp_type_id == '3' && $d->position_id >0){
            if($created && !$salary){
                $position = DB::table('positions')->where('id', $d->position_id)->selectRaw('id,salary,currency_code')->first();
                if(!$position) return DV::error('Position ID does not exist');
                $inputs['salary'] = $position->salary ?? 0;
            }

        } elseif ($d->emp_type_id != '3') {
            $inputs['salary'] = $inputs['salary'] ?? 0;
        }

        $inputs['salary'] = $salary;
        $currency_code = VSMoney::$base_currency;
        $inputs['currency_code'] = $currency_code;
        $org_joining_date = null;
        $change_joining_date = false;
        if(!$created){
            $emp = self::getProps($id,'id,joining_date');
            $input_joining_date = convertDate($d->joining_date);
            $org_joining_date = convertDate($emp->joining_date);
            $change_joining_date =  $input_joining_date != $org_joining_date;
            unset($inputs['emp_type_id'],$inputs['position_id'], $inputs['salary'],$inputs['work_shift_id'], $inputs['branch_id']);
        }else{
             $branch_id = $d->branch_id ?? null;
             if(!$branch_id){
                return DV::error('Please specify the branch, in which the employee is based in');
             }
        }
        $id = DBX::saveData($ss, 'employees', ['id' => $id], $inputs, [], 1,false);

        if ($id && $created) {
            // if($inputs['branch_id'] > 0){
            //     DB::table('employees')->where('id', $id)->update(['branch_id' => $inputs['branch_id']]);
            // }
            $prefix = 'MT';
            $res = setOfficialCode($branch_id, 'employee_code_control', 'employees', ['id' => $id], $prefix, 5, null);

        }else if($id){
          //If user has changed the joining date, that can cause the seniority payment to be wrong
          if($change_joining_date){
              $message = "$ss->full_name changed joining date from $org_joining_date to $input_joining_date at ".getNowTime();
              Employee::log($ss,$id,'change_joining_date',$message);
          }
        }

        if ($id > 0) {

            if ($delete_prev_image) {
                $file_name = DB::table('employees as emp')->where('emp.id', $id)->take(1)->value('emp.photo_file_name');
                if ($file_name) {
                    XPublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
                }

                DB::table('employees')->where('id', $id)->update(['photo_file_name' => null]);
            }
            XPublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo, null, ['id' => $id, 'store' => 'employees.photo_file_name']);
            return DV::depends(1, ['employees' => $inputs, 'id' => $id]);
        }
        return DV::error('Failed to save employee');
    }

    public function getListPaginate($arr, $ss = null)
    {
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $branch_id = $ss->branch_id;
        $status_id = $d->status_id ?? null;
        $branch_id_filter = $d->branch_id ?? null;
        $emp_type_id = $d->emp_type_id ?? null;
        $search_value = $d->search_value ?? null;
        $str_search = "1=1";
        $str_moreWhere = "1=1";
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(emp.name LIKE '%" . $search_value . "%' OR emp.code LIKE '%" . $search_value . "%' OR emp.phone_number LIKE '%" . $search_value . "%' OR emp.nid LIKE '%" . $search_value . "%')";
        }
        if ($status_id) {
            $str_moreWhere .= ' AND emp.status_id =' . (int) $status_id;
        } else {
            // Hide resigned/inactive from default employee cards
            $str_moreWhere .= ' AND emp.status_id = 10';
        }
        if ($branch_id_filter) {
            $str_moreWhere .= ' AND emp.branch_id =' . (int) $branch_id_filter;
        }
        if ($emp_type_id) {
            $str_moreWhere .= ' AND emp.emp_type_id =' . (int) $emp_type_id;
        }
        $countries = Country::listAll($ss);

     $query = DB::table('employees as emp')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('employee_statuses as es', 'es.id', '=', 'emp.status_id')
            ->join('emp_types as el', 'el.id', '=', 'emp.emp_type_id')
            ->join('work_shifts as ws', 'ws.id', '=', 'emp.work_shift_id')
            ->join('loc_countries as c', 'c.id', '=', 'emp.nationality_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
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
            emp.passport_expiry_date,
            emp.spouse_emp_id,
            emp.sex,
            emp.date_of_birth,
            emp.address,
            emp.photo_file_name,
            emp.joining_date,
            emp.nssf_id,
            emp.nid,
            emp.nid_expiry_date,
            emp.position_id,
            p.name as position,
            emp.salary,
            emp.currency_code,
            emp.emp_type_id,
            el.name as type,
            emp.work_shift_id,
            ws.name as work_shift,
            emp.apply_payroll_tax,
            emp.marital_status,
            emp.status_id,
            es.name as status,
            emp.birth_city_id
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
        foreach ($rows as &$row) {
            $row->nationality = Country::nationality($row->nationality_id, $countries);
            $row->city_name = DB::table('loc_cities')->where('id', $row->birth_city_id)->value('name_kh');

        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function getDetails($id, $ss)
    {
        $row = DB::table('employees as emp')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('employee_statuses as es', 'es.id', '=', 'emp.status_id')
            ->join('emp_types as el', 'el.id', '=', 'emp.emp_type_id')
            ->leftJoin('work_shifts as ws', 'ws.id', '=', 'emp.work_shift_id')
            // ->leftJoin('um_branches as b', 'b.id', '=', 'emp.branch_id')
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
                '. DBX::formatDate('emp.passport_expiry_date','passport_expiry_date') .',
                '. DBX::formatDate('emp.date_of_birth','date_of_birth') .',
                emp.address,
                emp.photo_file_name,
                '.DBX::formatDate('emp.joining_date','joining_date').',
                emp.nssf_id,
                emp.nid,
                '.DBX::formatDate('nid_expiry_date','nid_expiry_date').',
                emp.position_id,
                p.name as position,
                p.name as position_title,
                emp.salary,
                emp.currency_code,
                emp.emp_type_id,
                el.name as type,
                emp.work_shift_id,
                ws.name as work_shift,
                emp.apply_payroll_tax,
                emp.status_id,
                emp.spouse_name,
                emp.spouse_occ_code,
                emp.spouse_emp_id,
                es.name as status,
                emp.marital_status,
                emp.birth_city_id
            ')
            ->where('emp.id', $id)
            ->first();

        if ($row) {
            $img = self::profilePicture($id);
            $row->image_url = $img;
            $row->photo = $img;
            $row->nationality = Country::nationality($row->nationality_id, null);
            $row->city_name = DB::table('loc_cities')->where('id', $row->birth_city_id)->value('name_kh');
            $row->skills = EmployeeSkill::getListByEmployee($id, $ss);
            $row->educations = EmployeeEducation::getListByEmployee($id, $ss);
            $row->experiences = EmployeeExperience::getListByEmployee($id, $ss);
            $row->documents = EmployeeDocument::getListByEmployee($id, $ss);
        } else {
            $row = null;
        }
        return $row;
    }
        static function profilePicture($id)
    {
        $col_subs_id = DBX::getHex('e.subs_id', 'subs_id');
        $row = DB::table('employees as e')->where('e.id', $id)->selectRaw($col_subs_id . ',e.branch_id,e.photo_file_name')->first();
        $def_image = self::defaultPhoto($row ? $row->subs_id : null);
        $url = '';
        if ($row) {
            $url = XPublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => self::$img_dir], 'image') . $row->photo_file_name;
            return validateUrl($url, $def_image);
        } else return $def_image;
    }

    static function defaultPhoto($subs_id)
    {
        return url('') . '/assets/images/default/default-staff.png';
    }

    public static function getFormOptions($id,$ss)
    {
       $employee = null;
       if($id){
            $employee = self::getDetails($id,$ss);
       }
       $emp = GeneralSettings::options_employee(10, $ss); //->prepend($firstElement);
        return (object) [
            'payroll_taxes'=>[
                ['id' => '1', 'name' => 'tax'],
                ['id' => '0', 'name' => 'non tax'],
            ],
            'nationalities' => GeneralSettings::options_nationality($ss),
            'currency_codes' => VSMoney::options_currency($ss),
            'cities' => GeneralSettings::loc_options_city($ss),
            'status' => DB::table('employee_statuses')->selectRaw('id,name')->get(),
            'positions' => GeneralSettings::options_position($ss),
            'types' => DB::table('emp_types')->selectRaw('id,name')->get(),
            'work_shifts' => GeneralSettings::options_work_shift($ss),
            // 'branches' => GeneralSettings::options_branch($ss),
            'employee' => $employee,
            'employees' => $emp,
        ];
    }

    public function deleteEmployee($id = null , $ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $employee = DB::table('employees')->where('id',$id)->first();
        if(!$employee){
             return DV::error('Employee not found');
        }
        $deleted = DB::table('tenants')->where('id', $id)->delete();

        return $deleted
            ? DV::depends($deleted, ['action' => 'deleted'])
            : DV::error('Delete failed.');
    }

    static function savePayrollListBenefit($payroll_id, $emp_id ,$ss)
    {

        $full_amount = 0;
        $used_amount = 0;
        $effective_date = null;

        $payroll = DB::table('payrolls as p')
            ->where('id', $payroll_id)
            ->selectRaw('p.id,p.month, p.year, p.currency_code, exchange_rate, p.start_date, p.end_date')
            ->first();

        if (!$payroll){
            return DV::error('Payroll not found');
        }
        $emp_benefits = self::benefitList($emp_id);
        DB::beginTransaction();
        foreach($emp_benefits as $benefit){
            $benefit_id = $benefit->benefit_id;
            $disburseInfo = self::getBenefitDisburseInfo($emp_id, $benefit_id, $payroll);

            if($disburseInfo->error){
                continue;
            }
            $disburse_all = $disburseInfo->target_month == 0;
            $can_disburse = true;
            if($disburse_all){
                $effective_date = convertDate($benefit->effective_date);
                $can_disburse = $effective_date >= $payroll->start_date && $effective_date <= $payroll->end_date;

            }
            if(!$can_disburse){
                continue;
            }

            $full_amount = $benefit->balance ?? 0;
            if($benefit->currency_code != $payroll->currency_code){
                $full_amount = VSMoney::convert($ss,$full_amount,$benefit->currency_code,$payroll->currency_code,$payroll->exchange_rate);
            }
            $used_amount = $full_amount * $disburseInfo->withdraw_rate / 100;
            $inputs =  [
                            'emp_id' => $emp_id,
                            'payroll_id' => $payroll->id,
                            'withdraw_rate' => $disburseInfo->withdraw_rate,
                            'benefit_id' => $benefit_id,
                            'full_amount' => $full_amount,
                            'tax_option_id' => $benefit->tax_option_id,
                            'flat_tax_rate' => $benefit->flat_tax_rate ?? 0,
                            'used_amount' => $used_amount,
                            'emp_benefit_id' => $benefit->id,
                            'currency_code' => $payroll->currency_code,
                            'target_month' => $disburseInfo->target_month,

                        ];
            $b_id = DB::table('payroll_list_benefits')->where('payroll_id', $payroll->id)->where('emp_id', $emp_id)->where('benefit_id', $benefit_id)->where('emp_benefit_id', $benefit->id)->value('id');
            $b_id = DBX::saveData($ss, 'payroll_list_benefits', ['id' => $b_id], $inputs, [], 1);
            if(!$b_id){
                DB::rollBack();
                $emp = self::getProps($emp_id, 'code,name');
                return DV::error("Failed to save benefit for employee {$emp->name} ({$emp->code})");
            }
        }
        DB::commit();
        return DV::depends(1);
    }
        static function benefitList($emp_id){
        return DB::table('emp_benefits as eb')
                    ->join('benefits as b', 'eb.benefit_id', '=', 'b.id')
                    ->where('eb.emp_id', $emp_id)
                    ->selectRaw('eb.id, eb.amount,eb.balance, eb.tax_option_id,eb.emp_id, eb.flat_tax_rate, eb.benefit_id,eb.currency_code,b.name,eb.effective_date')
                    ->get();
    }
     static function getBenefitDisburseInfo($emp_id,$benefit_id,$payroll)
    {
        $str_where = "((target_month =0) OR (target_month = $payroll->month AND target_year = $payroll->year))";
        $bd = DB::table('benefit_disbursements as bd')
            ->join('benefits as b', 'b.id', '=', 'bd.benefit_id')
            ->where('bd.emp_id', $emp_id)
            ->where('bd.benefit_id', $benefit_id)
            ->whereRaw($str_where)
            ->selectRaw('bd.benefit_id, bd.withdraw_rate,b.name,bd.target_month')
            ->first();

        if($bd){
            return (object)[
                'benefit_id' => $bd->benefit_id,
                'withdraw_rate' => $bd->withdraw_rate,
                'target_month'=>$bd->target_month,
                'error' => null
            ];
        }
        $bdp = DB::table('benefit_disburse_policies')
            ->where('benefit_id', $benefit_id)
            ->whereRaw($str_where)
            ->selectRaw('benefit_id, withdraw_rate,target_month')
            ->first();
        if($bdp){
            return (object)[
                'benefit_id' => $bdp->benefit_id,
                'withdraw_rate' => $bdp->withdraw_rate,
                'target_month'=>$bdp->target_month,
                'error' => null
            ];
        }
        $b = DB::table('benefits')->where('id', $benefit_id)->selectRaw('name')->first();
        return (object)[
            'error'=>'No disbursement policy found for '.($b?->name ?? 'benefit id '.$benefit_id),
        ];

    }
      public static function getPayrollAccount($emp_id)
    {
        return DB::table('employees as e')
            ->join('accounts as a', 'a.emp_id', '=', 'e.id')
            ->where('e.id', $emp_id)
            ->where('a.account_type', 'Payroll')
            ->select([
                'e.id',
                'e.name',
                'a.id as account_id',
                'a.account_number',
            ])
            ->first();
    }

    public function setResign($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $d = (object) $arr;
        $emp_id = $d->emp_id ?? $this->id;

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id',
            'resign_date' => '1|date',
            'effective_date' => '1|date',
            'remarks' => '0|string|0-250',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $emp_id = $inputs['emp_id'];

        $emp = DB::table('employees')->where('id', $emp_id)->first();
        if (!$emp) {
            return DV::error('Employee not found');
        }
        if ((int) $emp->status_id === 11) {
            return DV::error('Employee is already inactive');
        }

        $resign_date = $inputs['resign_date'];
        $effective_date = $inputs['effective_date'];
        if (strtotime($effective_date) < strtotime($resign_date)) {
            return DV::error('Effective date cannot be earlier than resign date');
        }

        $payload = [
            'emp_id' => $emp_id,
            'resign_date' => $resign_date,
            'effective_date' => $effective_date,
            'remarks' => $inputs['remarks'] ?? null,
        ];

        $id = DBX::saveData($ss, 'resignations', ['id' => null], $payload, [], 1);
        if (!($id > 0)) {
            return DV::error('Error saving resignation');
        }

        DBX::saveData($ss, 'employees', ['id' => $emp_id], ['status_id' => 11], [], 1, false);

        // Show on Employee Movements list
        $resignEvent = DB::table('events')->where('name', 'Resignation')->first();
        $event_id = $resignEvent->id ?? 5;
        $movement = new Movement(null, $ss);
        $movement->upsert([
            'emp_id' => $emp_id,
            'event_id' => $event_id,
            'event_date' => $resign_date,
            'remarks' => $inputs['remarks'] ?? null,
            'impact' => $resignEvent->impact ?? 'Negative',
        ], null, $ss);

        return DV::depends(1, ['id' => $id, 'emp_id' => $emp_id]);
    }
}
