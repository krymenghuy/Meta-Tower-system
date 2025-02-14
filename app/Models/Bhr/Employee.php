<?php
namespace App\Models\Bhr;

use App\Models\Bhr\GeneralSettings;
use App\Models\Bhr\Event;
use DV;
use XPublicStorage;
use DBX;
use DB;
use App\Models\Umt\Branch;
use App\Models\Location\Country;
use Illuminate\Pagination\LengthAwarePaginator;
use VSMoney;
use Exception;

use PhpOffice\PhpSpreadsheet\IOFactory;


class Employee //extends Model
{
    //use HasFactory;

    protected $id = null;
    protected $userInfo = null;
    protected static $xlsx_keys = [
        'name','name_kh','sex','nationality_id','nid','nid_expiry_date','passport_number','date_of_birth','phone_number',
        'email','birth_city_id','nssf_id','marital_status','joining_date','branch_id','position_id','emp_type_id','work_shift_id','salary','address',
    ];
    protected static $img_dir = 'employees';
    //employees Regitration default options | senderDetaultOptions() | employeesDefaultOptions


    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

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
        if(!$nid) return null;
        $str_id = '1=1';
        if (!$nid) return 'National ID cannot be empty';
        if ($id > 0) $str_id = "emp.id <> $id";
        $x = DB::table('employees as emp')->where('emp.nid', $nid)->whereRaw($str_id)->select('id')->take(1)->exists();
        if ($x) return 'National ID ?? has been used by another employee::'. $nid;
        return null;
    }

    function save($arr = [], $id = null, $ss = null)
    {
        $emp_id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'branch_id'=>'0|branch_id|exists='.DBX::$branch_table.'.id',
            'name' => '1|string|0-100',
            'name_kh' => '0|string|0-100',
            'email' => '1|email',
            'phone_number' => '1|phone|0-20',
            'sex' => '1|choice|f,F,m,M,o,O',
            'nationality_id' => '1|number',
            'date_of_birth' => '1|date',
            'birth_city_id'=>'0|number',
            'address' => '0|string|0-250',
            'position_id' => '1|number',
            'emp_type_id' => '1|number',
            // 'branch_id' => '1|number',
            'salary' => '0|number',
            'currency_code' => '1|choice|KHR,USD|default=' . VSMoney::$base_currency,
            'work_shift_id' => '1|number|exists=work_shifts.id',
            'joining_date' => '1|date',
            'nssf_id' => '0|string|0-100',
            'nid' => '1|string|1-100',
            'nid_expiry_date' => '0|date',
            'apply_payroll_tax' => '1|number|default = 1',
            'status_id' => '1|number|default = 10',
            'photo' => '0|image',
            'marital_status' => '1|string|0-100',
            'spouse_name' => '0|string|0-100',
            'spouse_emp_id' => '0|number',
            'spouse_occ_code' => '0|string|0-100',
            'passport_number' => '0|string|0-100',
            'passport_expiry_date' => '0|date',
        ];

        $checkUnique = null;
        $res = DBX::validateObject($arr, $v_rule, true, ['email' => GeneralSettings::$email_chars, 'photo' => GeneralSettings::$image_chars], $ss->lang, false, isset($arr['id']) ? null : $checkUnique);
        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object) $inputs;
        if($d->currency_code !== VSMoney::$base_currency) return DV::error('The salary currency must be ??::'.VSMoney::$base_currency);
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
        $phone_check = $this->checkUniqueEmployeeByPhone($d->phone_number, $emp_id);
        if ($phone_check) return DV::error($phone_check);

        $nid_check = $this->checkUniqueEmployeeByNID($d->nid, $emp_id);
        if ($nid_check) return DV::error($nid_check);

        if (!$d->name_kh) {
            $d->name_kh = $d->name;
            $inputs['name_kh'] = $d->name_kh;
        }
        unset($inputs['photo']);
        $created = !$emp_id;
        $delete_prev_image = ($emp_id > 0 && (!$photo || isImage($photo)));
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
            $emp = self::getProps($emp_id,'id,joining_date');
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
        $emp_id = DBX::saveData($ss, 'employees', ['id' => $emp_id], $inputs, [], 1,false);
      
        if ($emp_id && $created) {
            // if($inputs['branch_id'] > 0){
            //     DB::table('employees')->where('id', $emp_id)->update(['branch_id' => $inputs['branch_id']]);
            // }
            $prefix = 'LC';
            $res = setOfficialCode($branch_id, 'employee_code_control', 'employees', ['id' => $emp_id], $prefix, 5, null);
         
        }else if($emp_id){
          //If user has changed the joining date, that can cause the seniority payment to be wrong
          if($change_joining_date){
              $message = "$ss->full_name changed joining date from $org_joining_date to $input_joining_date at ".getNowTime();
              Employee::log($ss,$id,'change_joining_date',$message);
          }
        }

        if ($emp_id > 0) {
            
            if ($delete_prev_image) {
                $file_name = DB::table('employees as emp')->where('emp.id', $id)->take(1)->value('emp.photo_file_name');
                if ($file_name) {
                    XPublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
                }

                DB::table('employees')->where('id', $id)->update(['photo_file_name' => null]);
            }
            XPublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo, null, ['id' => $emp_id, 'store' => 'employees.photo_file_name']);
            return DV::depends(1, ['employees' => $inputs, 'id' => $emp_id]);
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
    //       XPublicStorage::delete(['subs_id'=>$ss->subs_id,'dir'=>self::$img_dir],'image',$employee->photo_file_name);
    //       DB::table('employees')->where('id',$id)->update(['photo_file_name'=>null]);
    //     }
    //     return XPublicStorage::saveImage(['subs_id'=>$ss->subs_id,'dir'=> self::$img_dir] ,null,$photo_data,null,['id'=>$id,'store'=>'employees.photo_file_name']);
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
            XPublicStorage::delete(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'image', $employee->photo_file_name);
            DB::table('employees')->where('id', $id)->update(['photo_file_name' => null]);
        }
        $res = XPublicStorage::saveImage(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo_data, null, ['id' => $id, 'store' => 'employees.photo_file_name']);
        if($res->status ==='Error') return $res;
        $img = self::profilePicture($id);
        return DV::depends(1,['image_url'=>$img]);
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

    static function getBenefitDisburseInfo($emp_id,$benefit_id,$payroll)
    {
        $str_where = "((target_month = $payroll->month AND target_year = $payroll->year) OR (target_month =0 ))";
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
    static function benefitList($emp_id){
        return DB::table('emp_benefits as eb')
                    ->join('benefits as b', 'eb.benefit_id', '=', 'b.id')
                    ->where('eb.emp_id', $emp_id)
                    ->selectRaw('eb.id, eb.amount, eb.tax_option_id,eb.emp_id, eb.flat_tax_rate, eb.benefit_id,eb.currency_code,b.name,eb.effective_date')
                    ->get();
    }
    static function getPayrollListBenefit($payroll_id, $emp_id ,$ss)
    {
        $withdraw_rate = 0;
        $last_benefit_id = 0;
        $full_amount = 0;
        $tax_option_id = 0;
        $used_amount = 0;
        $benefit_count = 0;
        $payroll_currency = null;
        $benefit_currency = null;
        $flat_tax_rate = 0;
        $result = [];
        $dates = null;
        $during_payroll = null;
        $effective_date = null;

        $payroll = DB::table('payrolls as p')
            ->where('id', $payroll_id)
            ->selectRaw('p.id,p.month, p.year, p.currency_code, exchange_rate, p.start_date, p.end_date')
            ->first();

        $payroll_currency = $payroll->currency_code ?? null;
        $exchange_rate = $payroll->exchange_rate ?? 1;
        $payroll_start_date = convertDate($payroll->start_date);
        $payroll_end_date = convertDate($payroll->end_date);

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

            $full_amount = $benefit->amount ?? 0;
            if($benefit->currency_code != $payroll->currency_code){
                $full_amount = VSMoney::convert($ss,$full_amount,$benefit->currency_code,$payroll->currency_code,$payroll->exchange_rate);
            }
            $used_amount = $full_amount * $disburseInfo->withdraw_rate / 100;
            $inputs =  [
                            "emp_id" => $emp_id,
                            "payroll_id" => $payroll->id,
                            "withdraw_rate" => $disburseInfo->withdraw_rate,
                            "benefit_id" => $benefit_id,
                            "full_amount" => $full_amount,
                            "tax_option_id" => $benefit->tax_option_id,
                            "flat_tax_rate" => $benefit->flat_tax_rate ?? 0,
                            "used_amount" => $used_amount,
                            "emp_benefit_id" => $benefit->id,
                            "currency_code" => $payroll->currency_code
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
    public static function getWalletAccount($emp_id)
    {
        return DB::table('employees as e')
            ->join('accounts as a', 'a.emp_id', '=', 'e.id')
            ->where('e.id', $emp_id)
            ->where('a.account_type', 'Wallet')
            ->select([
                'e.id',
                'e.name',
                'a.id as account_id',
                'a.account_number'
            ])
            ->first();
    }

    function deleteProfilePicture($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $emp = DB::table('employees as s')->where('id', $id)->selectRaw('id,photo_file_name')->first();
        if (!$emp) return DV::error('Employee identity is not correct!');
        XPublicStorage::delete(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'image', $emp->photo_file_name);
        DB::table('employees')->where('id', $id)->update(['photo_file_name' => null]);
        return DV::success();
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
        } else {

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
        $col_date_of_birth = DBX::formatDate('emp.date_of_birth', 'date_of_birth');
        $col_joining_date = DBX::formatDate('emp.joining_date', 'joining_date');
        $nid_expiry_date = DBX::formatDate('emp.nid_expiry_date', 'nid_expiry_date');
        $passport_expiry_date = DBX::formatDate('emp.passport_expiry_date', 'passport_expiry_date');
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
            '.$passport_expiry_date.',
            emp.spouse_emp_id,
            emp.sex,
            '.$col_date_of_birth.',
            emp.address,
            emp.photo_file_name,
            '.$col_joining_date.',
            emp.nssf_id,
            emp.nid,
           '.$nid_expiry_date.',
            emp.position_id,
            p.title as position,
            emp.salary,
            emp.currency_code,
            emp.emp_type_id,
            el.name as type,
            emp.work_shift_id,
            ws.name as work_shift,
            emp.apply_payroll_tax,
            emp.marital_status,
            emp.status_id,
            b.name as branch_name,
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
                $row->image_url = XPublicStorage::getUrl($row->branch_id, 'customer', 'image') . $row->photo_file_name;
                unset($row->photo_file_name);
                if (!$row->image_url) $row->image_url = self::defaultImage($ss->branch_id);
            }
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
    static function defaultImage()
    {
        return XPublicStorage::getUrl(['subs_id' => null, 'dir' => 'default'], 'image') . 'mr3.jpg';
        // return XPublicStorage::getUrl($branch_id, 'default', 'image') . 'default_agent.png';
    }

    static function getDetails($id, $ss)
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
                '. DBX::formatDate('emp.passport_expiry_date','passport_expiry_date') .',
                '. DBX::formatDate('emp.date_of_birth','date_of_birth') .',
                emp.address,
                emp.photo_file_name,
                '.DBX::formatDate('emp.joining_date','joining_date').',
                emp.nssf_id,
                emp.nid,
                '.DBX::formatDate('nid_expiry_date','nid_expiry_date').',
                emp.position_id,
                p.title as position,
                p.title as position_title,
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
                b.name as branch_name,
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
            XPublicStorage::delete([
                'branch_id' => null,
                'subs_id' => $ss->subs_id,
                'dir' => self::$img_dir,
            ], 'images', $file_name);
        }

        $deleted = DB::table('employees')->where('id', $id)->delete();

        if (!$deleted) {
            return DV::error('employee not found or not deleted');
        }

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

        //$firstElement = ['id' => 0, 'name' => '(None)', 'name_kh'=>'(None)', 'sex'=>'','phone_number'=>'','image_url'=>'', 'position_id'=>'','email'=>''];

        $emps = GeneralSettings::options_employee(10, $ss); //->prepend($firstElement);
        return (object) [
            'payroll_taxes'=>[
                ['id' => '1', 'name' => 'tax'],
                ['id' => '0', 'name' => 'non tax'],
            ],
            'nationalities' => GeneralSettings::options_nationality($ss),
            'currency_codes' => VSMoney::options_currency($ss),
            'cities' => GeneralSettings::loc_options_city($ss),
            'branches' => GeneralSettings::options_branch($ss),
            'status' => DB::table('employee_statuses')->selectRaw('id,name')->get(),
            'departments' => DB::table('departments')->selectRaw('id,name')->get(),
            'positions' => GeneralSettings::options_position($ss),
            'types' => DB::table('emp_types')->selectRaw('id,name')->get(),
            'work_shifts' => GeneralSettings::options_work_shift($ss),
            'employee' => $employee,
            'employees' => $emps,
        ];
    }
    function getFormOptionPromotion($id, $ss)
    {
        $employee = null;
        if ($id) {
            $employee = self::getDetails($id, $ss);
        }
        return (object) [
            'branches' => GeneralSettings::options_branch($ss),
            'positions' => GeneralSettings::options_position($ss),
            'work_shifts' => GeneralSettings::options_work_shift($ss),
            'employee' => $employee,
        ];
    }
    function setTerminateStatus($status_id, $id = null, $ss = null)
    {
        $ss = $ss ? $ss : $this->userInfo;
        $id = $id ?? $this->id;

        $emp = self::getProps($id, 'status_id');
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

        $event_saved = DBX::saveData($ss, 'emp_events', [], $event_inputs, [], 1, false);
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
    function promoteNonStaff($emp_type_id, $id = null, $ss = null, $arr)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $d = (object)$arr;
        $remarks = $d->remarks;
        $event_date = $d->event_date;

        $emp_type_info = DB::table('emp_types')->where('id',$emp_type_id)->selectRaw('id,name,h_order')->first();
        if(!$emp_type_info) return DV::error('The provided employee type does not exist');
        $h_order = $emp_type_info->h_order;
        $emp = self::getProps($id,'id,code,name,emp_type_id');
        if(!$emp) return DV::error('The provided employee ID does not exist');
        $org_h_order = DB::table('emp_types')->where('id',$emp->emp_type_id)->value('h_order') ?? 0;
        if($org_h_order > $h_order) return DV::error('Cannot promote status backward');
        if($emp->emp_type_id == $emp_type_id) return DV::error('The old and new statuses are same');
        if ($event_date) $event_date = date('Y-m-d', strtotime($event_date));
        $events = [
            '1.2' => 'promote intern to probation',
            '1.3' => 'Promote intern to staff',
            '2.3' => 'Promote probation to staff'
        ];

        $key = $emp->emp_type_id . '.' . $emp_type_id;
        $event_name = $events[$key] ?? null;
        $event_id = self::getEventId($event_name);

        if (!$event_id) {
            $event_arr = (array)['name' => $event_name];
            $event_id = Event::createEvent($event_arr, $ss);
            $event_id = $event_id->status_code == 200 ? $event_id->data['id'] : '';
        }
        $id = DBX::saveData($ss, 'employees', ['id' => $id], ['emp_type_id' => $emp_type_id], [], 1, false);
        if ($id) {
            $impact = $emp_type_id > $emp->emp_type_id ? 'Positive' : ($emp_type_id < $emp->emp_type_id ? 'Negative' : 'Neutral');
            $inputs = [
                'emp_id' => $id,
                'event_id' => $event_id,
                'impact' => $impact,
                'remarks' => $remarks,
                'event_date' => $event_date
            ];
            DBX::saveData($ss, 'emp_events', [], $inputs, [], 1, false);
            return DV::depends($id, ['Employee', 'updated']);
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


        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $inputs['emp_id'] = $id;


        $emp = self::getProps($id, 'status_id');
        if (!$emp) {
            return DV::error('Employee ID not found!');
        }
        $latest_resignation = DB::table('resignations')
        ->where('emp_id', $id)
        ->orderBy('effective_date', 'DESC')
        ->first();

        if ($latest_resignation) {
            $latest_effective_date = $latest_resignation->effective_date;

            // Ensure new effective_date is after the latest effective_date
            if (strtotime($inputs['effective_date']) <= strtotime($latest_effective_date)) {
                return DV::error('The effective date must be later than the previous resignation\'s effective date (' . $latest_effective_date . ').');
            }
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

        $event_saved = DBX::saveData($ss, 'emp_events', [], $event_inputs, [], 1, false);
        if (!$event_saved) {
            return DV::error('Failed to log resignation event.');
        }


        $resign_id = DBX::saveData($ss, 'resignations', ['id' => null], $inputs, [], 1);
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
        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $inputs['emp_id'] = $id;
        $rejoin_date = $inputs['rejoin_date'];
        $emp = self::getProps($id, 'status_id');
        if (!$emp) {
            return DV::error('Employee ID not found!');
        }
        $latest_resignation = DB::table('resignations')
        ->where('emp_id', $id)
        ->orderBy('effective_date', 'DESC')
        ->first();

        if ($latest_resignation) {
            $latest_effective_date = $latest_resignation->effective_date;

            // Ensure the rejoin date is after the latest resignation's effective date
            if (strtotime($rejoin_date) <= strtotime($latest_effective_date)) {
                return DV::error('The rejoin date must be after the latest resignation\'s effective date (' . $latest_effective_date . ').');
            }
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

        $event_saved = DBX::saveData($ss, 'emp_events', [], $event_inputs, [], 1, false);
        if (!$event_saved) {
            return DV::error('Failed to log rejoin event.');
        }


        $rejoin_id = DBX::saveData($ss, 'rejoins', ['id' => null], $inputs, [], 1);
        if ($rejoin_id) {

            DB::table('employees')->where('id', $id)->update(['status_id' => 10, 'last_rejoin_date' => $rejoin_date]);

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
        $change_work_shift = $d->change_work_shift ?? null;

        if (!$change_branch && !$change_position && !$change_salary && !$change_work_shift) {
            return DV::error('No Promotion Request!');
        }

        DB::beginTransaction();
        // Create promotion record
        $promo_id = self::createPromotion($arr, $ss);
        if (!$promo_id) return DV::error('Failed to create promotion');

        $event_names = [];
        $remarks = $d->remarks ?? null;
        $event_date = $d->event_date ?? date('Y-m-d');

        if ($change_branch) {
            $resBranch = self::changeBranch($ss, $id, $promo_id, $change_branch);
            if ($resBranch->status_code == 200) {
                $event_names[] = 'Change Branch';
            } else {
                DB::rollBack();
                return $resBranch;
            }
        }

        if ($change_position) {
            $resPosition = self::changePosition($ss, $id, $promo_id, $change_position);
            if ($resPosition->status_code == 200) {
                $event_names[] = 'Change Position';
            } else {
                DB::rollBack();
                return $resPosition;
            }
        }

        if ($change_salary) {
            $resSalary = self::changeSalary($ss, $id, $promo_id, $change_salary);
            if ($resSalary ->status_code == 200) {
                $event_names[] = 'Change Salary';
            } else {
                DB::rollBack();
                return $resSalary;
            }
        }
        if($change_work_shift){
            $resWorkShift = self::changeWorkShift($ss, $id, $promo_id, $change_work_shift);
            if ($resWorkShift ->status_code == 200) {
                $event_names[] = 'Change Work Shift';
            } else {
                DB::rollBack();
                return $resWorkShift;
            }
        }
        DB::commit();

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

            $event_id = DBX::saveData($ss, 'emp_events', ['id'=>null], $inputs, [], 1, false);
            if(!$event_id){
                \Log::error('Employee->promoteStaff(): Failed to create record in table "emp_events"');
            }
        }
        return DV::success(['message' => 'Employee promotion was successful']);
    }

    static function changeBranch($ss, $emp_id, $promo_id, $arr)
    {
        if (!$arr) return;
         $v_rule = [
            'branch_id' => '0|number',
            'to_branch_id' => '1|number',
            'effective_date' => '0|date',
            'remarks' => '0|string|1-300',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang,false,null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $d = (object)$inputs;
        $emp = self::getProps($emp_id,'branch_id');
        if(!$emp) return DV::error('Failed to change position because the given Employee ID does not exist');
        if($d->to_branch_id == $emp->branch_id) return DV::Error('Please select a different branch to change');

        $inputs['promo_id'] = $promo_id;
        $inputs['emp_id'] = $emp_id;
        $effective_date = convertDate($d->effective_date ?? date('Y-m-d'));
        $inputs['effective_date'] = $effective_date;
        $id = DBX::saveData($ss, 'emp_branches', ['id' => null], $inputs, [], 1, false);
        $branch_id = $arr['to_branch_id'];
        $updated = DB::table('employees')->where('id', $emp_id)->update(['branch_id' => $branch_id]);
        return DV::depends(1, null);
    }

    static function changePosition($ss, $emp_id, $promo_id, $arr)
    {
        if (!$arr) return;
        $v_rule = [
            'position_id' => '0|number',
            'to_position_id' => '1|number',
            'start_date' => '0|date',
            'remarks' => '0|string|0-300'
        ];
        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $d = (object)$inputs;
        $inputs['promo_id'] = $promo_id;
        $inputs['emp_id'] = $emp_id;
        $emp = self::getProps($emp_id,'position_id');
        if(!$emp) return DV::error('Failed to change position because the given Employee ID does not exist');
        if($d->to_position_id == $emp->position_id) return DV::Error('Please select a different position to change');
        $start_date = convertDate($d->start_date ?? date('Y-m-d'));
        $inputs['start_date'] = $start_date;
        $id = DBX::saveData($ss, 'emp_positions', ['id' => null], $inputs, [], 1, false);
        $position_id = $arr['to_position_id'];
        $x = DB::table('employees')->where('id', $emp_id)->update(['position_id' => $position_id]);
        return DV::depends($x, null, 'Failed to change staff position');
    }

    static function changeSalary($ss, $emp_id, $promo_id, $arr)
    {
        if (!$arr) return;
        if (empty($arr['new_salary'])) {
            return DV::error('new salary is required.');
        }
        $v_rule = [
            'org_position_id' => '0|number',
            'new_position_id' => '0|number',
            //'effective_date'=>'0|date',
            'org_salary' => '0|decimal',
            'new_salary' => '1|decimal'
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $d = (object)$inputs;
        $emp = self::getProps($emp_id,'salary, currency_code');
        if(!$emp) return DV::error('Failed to change position because the given Employee ID does not exist');
        if($d->new_salary == $emp->salary) return DV::Error('Please select enter a different amount of salary for change');

        $org_salary = DB::table('employees')->where('id', $emp_id)->value('salary');
        $org_position_id = DB::table('employees')->where('id', $emp_id)->value('position_id');

        $inputs['promo_id'] = $promo_id;
        $inputs['emp_id'] = $emp_id;
        $inputs['org_salary'] = $org_salary;
        $inputs['org_position_id'] = $org_position_id;

        $id = DBX::saveData($ss, 'emp_salary_histories', ['id' => null], $inputs, [], 1, false);
        $salary = $arr['new_salary'];
        $x = DB::table('employees')->where('id', $emp_id)->update(['salary' => $salary]);
        return DV::depends(1, null, 'Failed to change staff salary');
    }

    static function changeWorkShift($ss, $emp_id, $promo_id, $arr)
    {
        if (!$arr) return;
        $v_rule = [
            'work_shift_id' => '0|number',
            'to_work_shift_id' => '1|number',
            'effective_date' => '0|date',
            'remarks' => '0|string|0-300'
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error)  return DV::error($res->error);
        $inputs = $res->values;
        $d = (object)$inputs;
        $emp = self::getProps($emp_id,'work_shift_id');
        if(!$emp) return DV::error('Failed to change position because the given Employee ID does not exist');
        if($d->to_work_shift_id == $emp->work_shift_id) return DV::Error('Please select a different workshift to change');

        $inputs['promo_id'] = $promo_id;
        $inputs['emp_id'] = $emp_id;
        $effective_date = convertDate($d->effective_date ?? date('Y-m-d'));
        $inputs['effective_date'] = $effective_date;

        $emp = self::getProps($emp_id,'name,code, work_shift_id');
        if(!$emp) return DV::error('Employee ID does not exist');
        $id = DBX::saveData($ss, 'emp_work_shifts', ['id' => null], $inputs, [], 1, false);
        $work_shift_id = $inputs['to_work_shift_id'];
        if($id){
            $emp_name =$emp->name."( $emp->code)";
            //$emp_name = $emp_name ?? "id $id";
            $message = "$ss->full_name changed workshift for staff $emp_name from $emp->work_shift_id to $work_shift_id at ".getNowTime();
            self::log($ss,$id,'change_work_shift',$message);
            DB::table('employees')->where('id', $emp_id)->update(['work_shift_id' => $work_shift_id]);
        }
        return DV::depends($id, null,'Failed to change employee work sift');
    }

    static function createPromotion($arr, $ss = null)
    {
        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number',
            'promotion_date' => '0|date',
            'change_branch' => '0|number|default=0',
            'change_position' => '0|number|default=0',
            'change_salary' => '0|number|default=0',
            'change_work_shift' => '0|number|default=0'

        ];
        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
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
        $change_work_shift = !empty($d->change_work_shift) ? 1 : 0;

        $promo_inputs = [
            'emp_id' => $emp_id,
            'promotion_date' => $promotion_date,
            'change_branch' => $change_branch,
            'change_position' => $change_position,
            'change_salary' => $change_salary,
            'change_work_shift' => $change_work_shift
        ];
        $id = DBX::saveData($ss, 'emp_promotions', ['id' => $id], $promo_inputs, [], 1, false);
        if ($id > 0) {
            return $id;
        }
        return null;
    }

    function getEmployeeList($arr, $ss = null)
    {
        $d = (object) $arr;
        $search_value = $d->search_value ?? null;
        $query = DB::table('employees as emp')
            ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
            ->selectRaw('emp.id,emp.phone_number,emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email,emp.address,emp.joining_date')
            ->where('emp.branch_id', $ss->branch_id);  // Ensure only records for the current branch are fetched
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("emp.name LIKE '%" . $search_value . "%' OR emp.code LIKE '%" . $search_value . "%'");
        }
        $rows = $query->get();
        return $rows;
    }
    static function isResigning($id)
    {
        $row = DB::table('resignations')->where('emp_id', $id)->select('effective_date')->first();
        if (!$row) return false;
        $effective_date = convertDate($row->effective_date);
        $today = date('Y-m-d');
        if ($today >= $effective_date) return true;
        return false;
    }

    static function contractFormOptions($id, $director_id = 0, $ss)
    {
        $emp = null;

        if ($id) {
            $emp = Employee::getDetails($id, $ss);
        }else return DV::error('Branch Can not be Empty!');

        $branch = self::getBranchInfo($emp->branch_id ?? null);
        if ($branch){
            $emp->branch_name = $branch->name ?? '(Branch not found)';
            $emp->branch_address = $branch->address_kh ?? '(address not available)';
            $emp->com_rep_name = $branch->director ? $branch->director->name_kh : null;
            $emp->com_rep_sex = $branch->director ? $branch->director->sex : null;
            $emp->com_rep_nid = $branch->director ? $branch->director->nid : null;
            $emp->com_rep_phone = $branch->director ? $branch->director->phone_number : null;
            $emp->emp_name = $emp->name_kh;
            $emp->emp_phone = $emp->phone_number;
            $emp->emp_nid = $emp->nid;
            $emp->emp_position = $emp->position;
            $emp->emp_sex = $emp->sex;
            $emp->emp_address = $emp->address;
        }
        return (object)[
            'contractInfo' => $emp,
        ];
    }

    static function getFormOptions_non_staff($emp_id, $ss){
        $emp = self::getProps($emp_id,'emp_type_id');
        $min_level = DB::table('emp_types as t')->where('t.id',($emp? $emp->emp_type_id : null))->value('h_order');
        return (object)['types'=>GeneralSettings::options_emp_type($min_level,$ss)];
    }

    static function getBranchInfo($branch_id)
    {
        // Fetch branch details
        $row = DB::table('um_branches as b')
            ->where('id', $branch_id)
            ->selectRaw('b.id, b.name, b.name_kh, b.address_kh, b.city_id, b.director_id')
            ->first();

        if (!$row) return null;

        // Fetch city and director details
        // $city = City::getById($row->city_id);
        // $row->city = $city ? $city->name : '';
        $row->director = self::getBranchDirector($row->director_id);

        return $row;
    }

    static function getBranchDirector($director_id)
    {
        if (!$director_id) return null;

        return DB::table('employees as e')
            ->where('e.id', $director_id)
            ->selectRaw('e.id, e.name, e.name_kh, e.sex, e.date_of_birth, e.phone_number, e.nid')
            ->first();
    }
    static function getEmpBenefitID($emp_id,$benefit_id,$date){
        $date = convertDate($date);
        return DB::table('emp_benefits')->where('emp_id',$emp_id)->where('benefit_id',$benefit_id)->where('effective_date',$date)->value('id');

    }
    static function convertImportedEmployee($rows){
        $result = [];
        foreach($rows as $index=>$row){
            if($index>=0){
                $keeper=[];
                $key=0;
                foreach($row as $index=>$value){
                    if($key<=count(self::$xlsx_keys)){
                        if($index>=0){
                            $keeper[self::$xlsx_keys[$key]] = strNoSpace($value);
                        }
                    }
                    $key++;
                }
                $result[] = $keeper;
            }
        }
        return $result;
    }
    static function readExcel($ss,$file_name,$start_index=null){
        $fullPath = XPublicStorage::getDiskPath(['subs_id'=>$ss->subs_id,'dir'=>self::$img_dir],'document').$file_name ;
        $reader = IOFactory::createReader('Xlsx');
        $spreadsheet = $reader->load($fullPath);
        $worksheet = $spreadsheet->getActiveSheet();
        $_data = $worksheet->toArray();
        $_data = array_filter($_data, function ($record) {
            return array_filter($record, function ($value) {
                return $value !== null && $value !== '' && $value !== false;
            }) !== [];
        });
        $i=$start_index?$start_index:1;
        $c = null;
        do {
            if (!isset($_data[$i])) break;
            $c = $_data[$i];
            $data_tracking[] = $c;
            $i++;
        } while ($c);
        return $data_tracking;
    }
    static function validateData($rows) {
        $duplicates_phone = [];
        $duplicates_nid = [];
        $duplicates_nssf = [];
        $rows = (object) $rows;
        $cnt = 0;
        foreach ($rows as &$row) {
            $cnt++;
            $row = (object) $row;
            $name = trim($row->name);
            $phone = trim($row->phone_number);
            if ($phone && in_array($phone,$duplicates_phone)) {
                return (object)['error' => "បុគ្គលិកឈ្មោះ $name លេខរៀងទី $cnt លេខទូរស័ព្ទរបស់គាត់មិនត្រឺមត្រូវទេ ។"];
            }else{
                $duplicates_phone[]=$phone;
            }
            $nid = trim($row->nid);
            if ($nid && in_array($nid,$duplicates_nid)) {
                return $rows->error = "បុគ្គលិកឈ្មោះ $name លេខរៀងទី $cnt មានលេខអត្តសញ្ញាណប័ណ្ណស្ទួនហ្នឺងបុគ្គលិផ្សេងទៀត";
            }else{
                $duplicates_nid[]=$nid;
            }
            
            $nssf = trim($row->nssf_id);
            if ($nssf && in_array($nssf,$duplicates_nssf)) {
                return $rows->error = "បុគ្គលិកឈ្មោះ $name លេខរៀងទី $cnt មានលេខ ប.​ប.ស​ ស្ទួន";
            }else{
                $duplicates_nssf[]=$nssf;
            }

            $nationality = trim($row->nationality_id);
            $nationality_id = DB::table('loc_countries')->where('nationality', $nationality)->value('id');
            if (!$nationality_id) {
                return (object)['error' => "បញ្ចូលទិន្នន័យបរាជ័យ សម្រាប់បុគ្គលិកឈ្មោះ $name : សញ្ជាតិ '".($nationality ?: 'មិនបានបញ្ជាក់')."' មិនត្រឺមត្រូវទេ"];
            }
            $row->nationality_id = $nationality_id;

            $branch = trim($row->branch_id);
            $row->branch_id = DB::table('um_branches')->where('name', $branch)->value('id');
            if (!$row->branch_id) {
                return (object)['error' => "បញ្ចូលទិន្នន័យបរាជ័យ សម្រាប់បុគ្គលិកឈ្មោះ $name : សាខា '".($branch ?: 'មិនបានបញ្ជាក់')."' មិនត្រឺមត្រូវទេ"];
            }

            $city =trim($row->birth_city_id);
            $row->birth_city_id = DB::table('loc_cities')->where('country_id',$row->nationality_id)->where('name_kh', $city)->value('id');
            if (!$row->birth_city_id) {
                return (object)['error' => "បញ្ចូលទិន្នន័យបរាជ័យ សម្រាប់បុគ្គលិកឈ្មោះ $name : ទីកន្លែងកំណើត '".($city ?: 'មិនបានបញ្ជាក់')."' មិនត្រឺមត្រូវទេ"];
            }

            $position = trim($row->position_id);
            $row->position_id = DB::table('positions')->where('title', $row->position_id)->value('id');
            if(!$row->position_id){
                return (object)['error'=>"ការបញ្ចូលទិន្នន័យបរាជ័យ សម្រាប់បុគ្គលិកឈ្មោះ $name : position '".($position ?: 'មិនបានបញ្ជាក់')."' មិនត្រឺមត្រូវទេ"];
            }

            $emp_type = trim($row->emp_type_id);
            $row->emp_type_id = DB::table('emp_types')->where('name', $row->emp_type_id)->value('id');
            if(!$row->emp_type_id){
                return (object)['error'=>"ការបញ្ចូលទិន្នន័យបរាជ័យ សម្រាប់បុគ្គលិកឈ្មោះ $name : Type '".($emp_type ?: 'មិនបានបញ្ជាក់')."' មិនត្រឺមត្រូវទេ"];
            }

            $work_shift =trim($row->work_shift_id);
            $row->work_shift_id = DB::table('work_shifts')->where('name', $row->work_shift_id)->value('id');
            if(!$row->work_shift_id){
                return (object)['error'=>"ការបញ្ចូលទិន្នន័យបរាជ័យ សម្រាប់បុគ្គលិកឈ្មោះ $name : Work Shift '".($work_shift ?: 'មិនបានបញ្ជាក់')."' មិនត្រឺមត្រូវទេ"];
            }
        }
        return $rows;
    }
    public function importEmployee($arr,$ss,$id=null){
        $emp_id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'file' => '1|string',
        ];
        $res = DBX::validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error_message);
        $inputs = $res->values;
        $base64 = str_replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,','',$inputs['file']);
        $x = XPublicStorage::savefile(['subs_id'=>$ss->subs_id,'dir'=>self::$img_dir],'xlsx',$base64,'document');
        if($x->status =='OK'){
            $import_id = saveData($ss,'imported_files',['id' => null],[
                'type' =>$x->file_type,
                'file_name' => 'Imported from Excel by '.$ss->full_name.' on '. date('d M Y H:i', time()), //$file_name,
                'imported_date' => date('Y-m-d H:i:s'),
                'title' => 'Import Employee',
                // 'status_id'=> 1
            ],[],1);
            $file_name = $x->file_name;
            $rows = self::readExcel($ss,$x->file_name,2);
            $data = self::convertImportedEmployee($rows);
            $data = self::validateData($data);

            if(isset($data->error)) return DV::error($data->error);

            $success = 0;

            DBX::beginTransaction();
            try {
                $employee = new Employee();

                foreach ((array)$data as $row) {
                    $arr = (array) $row;
                    $inputs = $arr;
                    $emp_res = $employee->save($inputs,null,$ss);
                    if($emp_res->status_code ==200){
                        $success++;
                    }else{
                        DBX::rollback();
                        return $emp_res;
                    }
                }
                    DBX::commit();
                    return DV::depends(1, ['success_count'=>$success]);
            }
            catch (Exception $e) {
                DBX::rollback();
                $file_name = basename($x->file_name);
                XPublicStorage::delete(['subs_id'=>$ss->subs_id,'dir'=>self::$img_dir],'documents',$file_name);
                \Log::error($e->getMessage() . "\n" . $e->getTraceAsString());
                return DV::error('There were some problem during importing. This is likely due to incorrect data format in Excel.');
            }
        }
    }



}
