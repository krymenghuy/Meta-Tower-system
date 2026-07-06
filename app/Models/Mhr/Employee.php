<?php

namespace App\Models\Mhr;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Vsd\Database\DBX;
use Vsd\Response\DV;
use XPublicStorage;
use App\Models\Prm\GeneralSettings;
use Vsd\Vsloquent\VSModel;

class Employee extends VSModel
{
    protected $table = 'employees';
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
    public function __construct($id = null, $userInfo = null)
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
        if(!$nid) return null;
        $str_id = '1=1';
        if (!$nid) return 'National ID cannot be empty';
        if ($id > 0) $str_id = "emp.id <> $id";
        $x = DB::table('employees as emp')->where('emp.nid', $nid)->whereRaw($str_id)->select('id')->take(1)->exists();
        if ($x) return 'National ID ?? has been used by another employee::'. $nid;
        return null;
    }
     public function upsert($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        return $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'branch_id'=>'0|branch_id|exists='.DBX::branchTable().'.id',
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
            'work_shift_id' => '1|number|exists=work_shifts.id',
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
            $prefix = 'LC';
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
}
