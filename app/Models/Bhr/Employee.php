<?php

namespace App\Models\Bhr;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\Bhr\GeneralSettings;
use App\Models\DV;
use App\Models\PublicStorage;
use Illuminate\Support\Facades\DB;
use App\Models\DBX;
use Illuminate\Pagination\LengthAwarePaginator;

class Employee//extends Model
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

    function checkUniqueEmployeeByPhone($phone_number,$id=null){
        $str_id = "1=1";
        if(!$phone_number) return 'Phone number cannot be empty';
        if($id > 0 ) $str_id = "emp.id <> $id";
        $x = DB::table('employees as emp')->where('emp.phone_number',$phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
        if($x) return 'phone number"'.$phone_number.'" has been used by another employee';
        return null;
    }

    function checkUniqueEmployeeByNID($nid,$id=null){
        $str_id = '1=1';
        if(!$nid) return 'National ID cannot be empty';
        if($id > 0) $str_id = "emp.id <> $id";
        $x = DB::table('employees as emp')->where('emp.nid',$nid)->whereRaw($str_id)->select('id')->take(1)->exists();
        if($x) return 'National ID "' .$nid. '" has been used by another employee';
        return null;
    }

    function save($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string|0-100',
            'name_kh' => '0|string|0-100',
            'email' => '1|email',
            'phone_number' => '1|phone|0-20',
            'sex' => '1|string|0-6',
            'nationality' => '0|string|0-150',
            'date_of_birth' => '1|date',
            'address' => '0|string|0-250',
            'position_id' => '1|number',
            'emp_type_id' => '1|number',
            'work_shift_id' => '1|number',
            'joining_date' => '1|date',
            'nssf_id' => '0|string|0-100',
            'nid'=> '1|string|1-100',
            'status_id' => '1|number|default = 10',
            'photo' => '0|image',
        ];


        $checkUnique = null;

        $res = validateObject($arr, $v_rule, true, ['email' => GeneralSettings::$email_chars, 'photo' => GeneralSettings::$image_chars], $ss->lang, false, isset($arr['id']) ? null : $checkUnique);
        if ($res->error) {
            return DV::error($res->error);
        }

        $emp_id = $res->id;
        $inputs = $res->values;
        $d = (object) $inputs;
        $photo = $d->photo;
        $d->phone_number = str_replace(' ', '', $inputs['phone_number']);
        $inputs['phone_number'] = $d->phone_number;
        $phone_check = $this->checkUniqueEmployeeByPhone($d->phone_number,$emp_id);
        if($phone_check) return DV::error($phone_check);
        // if (!$d->phone_number) {
        //     error_log('Phone number is required for valid  employee');
        //     return DV::error('Phone number is required for valid  employee');
        // }
        $nid_check = $this->checkUniqueEmployeeByNID($d->nid,$emp_id);
        if($nid_check) return DV::error($nid_check);
        
        if(!$d->name_kh){
            $d->name_kh = $d->name;
            $inputs['name_kh'] = $d->name_kh;
        }
        unset($inputs['photo']);
        $employee_created = !$emp_id;
        $delete_prev_image = ($emp_id > 0 && (!$photo || isImage($photo)));

        error_log('Saving data: ' . json_encode($inputs));
        $save = !$emp_id;
        $id = saveData($ss, 'employees', ['id' => $emp_id], $inputs, [], 1);
        if($save){
            $prefix = 'LC';
            $res = setOfficialCode($branch_id,'employee_code_control','employees',['id'=>$id],$prefix,5,null);
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

      static function isOnLeave($id){
        $today = date('Y-m-d');
        $start_date = DBX::convertToDate('l.start_date');
        $end_date = DBX::convertToDate('l.end_date');
        $str_dates = $today." BETWEEN $start_date AND $end_date";
         return DB::table('leaves as l')->where('l.id',$id)->whereRaw($str_dates)->value('id');
      }

      static function getCurrentLeaveInfo($id){
        $today = date('Y-m-d');
        $start_date = DBX::convertToDate('l.start_date');
        $end_date = DBX::convertToDate('l.end_date');
        $str_dates = $today." BETWEEN $start_date AND $end_date";
        $col_start_date = DBX::formatDate('l.start_date','start_date');
        $col_end_date = DBX::formatDate('l.end_date','end_date');
        $col_update_date = DBX::formatDate('l.updated_at','update_date');
        return DB::table('leaves as l')->join('leave_types as t','t.id','=','l.leave_type_id')->where('l.id',$id)->whereRaw($str_dates)->selectRaw("l.id,$col_start_date, $col_end_date, l.leave_type_id, t.name AS leave_type, remarks, update_user, $col_update_date")->first();
      }


      function deleteProfilePicture($id=null,$ss=null){
          $id = $id ?? $this->id;
          $ss = $ss ?? $this->userInfo;
          $sender = DB::table('employees as s')->where('id',$id)->selectRaw('id,branch_id,photo_file_name')->first();
          if(!$sender) return DV::error('Employee identity is not correct!');
          PublicStorage::delete(['subs_id'=>$ss->subs_id,'dir'=>self::$img_dir],'image',$sender->photo_file_name);
          DB::table('sender')->where('id',$id)->update(['photo_file_name'=>null]);
          return DV::success();
      }

    static function profilePicture($id){
        $col_subs_id = DBX::getHex('e.subs_id','subs_id');
        $row = DB::table('employees as e')->where('e.id',$id)->selectRaw($col_subs_id.',e.branch_id,e.photo_file_name')->first();
        $def_image = self::defaultPhoto($row? $row->subs_id: null);
        $url = '';
        if($row){
          $url = PublicStorage::getUrl(['subs_id'=>$row->subs_id,'dir'=>self::$img_dir],'image').$row->photo_file_name;
          return validateUrl($url,$def_image);
        }else return $def_image;
    }

    static function defaultPhoto($subs_id){
        return url('').'/assets/images/default/default-staff.png';
    }

  
    function getListPaginate($arr, $ss)
    {
        $subs_id = $ss->subs_id;
        //$branch_id = $ss->branch_id;
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 5;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $status = $d->status_id ?? 10; 
        $type = $d->emp_type_id ?? 3;  
        $search_value = $d->search_value ?? null;
        $str_srch = '1=1';
        $str_where = '2=2';
    
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_srch = "(emp.name LIKE '%".$search_value."%' OR emp.code = '".$search_value."' OR emp.nid = '".$search_value."' OR emp.phone_number = '".$search_value."')";
        }
    
        if($status){
            $str_where = 'emp.status_id =\'' . $status . '\'';
        }
    
        if($type){
            $str_where .= ' AND emp.emp_type_id =\'' . $type . '\'';
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
                emp.nationality,
                emp.date_of_birth,
                emp.address,
                emp.photo_file_name,
                formatDate(emp.joining_date) as joining_date,
                emp.nssf_id,
                emp.nid,
                emp.position_id,
                p.title as position,
                emp.emp_type_id,
                el.name as type,
                emp.work_shift_id,
                ws.name as work_shift,
                emp.status_id,
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
    
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
    


    static function props($id, $cols){
        if(!$id) return null;
        return DB::table('employees as e')->where('e.id',$id)->selectRaw($cols)->first();
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
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_srch = "(emp.name LIKE '%".$search_value."%' OR emp.name_kh = '".$search_value."' OR emp.nid = '".$search_value."' OR emp.phone_number = '".$search_value."')";
        }
        if($status){
            $str_where = 'emp.status_id =\'' . $status . '\'';

        }
        if($type){
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
            emp.nationality,
            emp.date_of_birth,
            emp.address,
            emp.photo_file_name,
            emp.joining_date,
            emp.nssf_id,
            emp.nid,
            emp.position_id,
            p.title as position,
            ws.name as work_shift,
            emp.status_id,
            es.name as status
        ')
        ->orderBy('emp.id', 'ASC');

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

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id,$ss)
    {
        $branch_id = $ss->branch_id;

        $row =DB::table('employees as emp')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('employee_statuses as es', 'es.id', '=', 'emp.status_id')
            ->join('emp_types as el', 'el.id', '=', 'emp.emp_type_id')
            ->join('work_shifts as ws', 'ws.id', '=', 'emp.work_shift_id')
            ->selectRaw('
                emp.code,
                emp.id,
                emp.name,
                emp.name_kh,
                emp.email,
                emp.phone_number,
                emp.sex,
                emp.nationality,
                emp.date_of_birth,
                emp.address,
                emp.photo_file_name,
                emp.joining_date,
                emp.nssf_id,
                emp.nid,
                emp.position_id,
                p.title as position,
                emp.emp_type_id,
                el.name as type,
                emp.work_shift_id,
                ws.name as work_shift,
                emp.status_id,
                es.name as status
            ')
            ->where('emp.branch_id',$branch_id)
            ->where('emp.id', $id)
            ->first();

        if ($row) {
            $row->image_url = self::profilePicture($id);
        } else {
            $row = null; // Or handle the case where employee is not found
        }

        return $row;
    }


    function delete($id, $ss)
    {
        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Ensure $ss contains necessary data
        if (!isset($ss->branch_id) || !isset($ss->subs_id)) {
            return DV::error('Invalid session data');
        }

        // Retrieve the file name associated with the profile
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
    static function currentPosition($id){
        return DB::table('employees as e')->join('positions as p', 'p.id', '=', 'e.position_id')->selectRaw('p.title , p.id')->first();
    }

    function getFormOptions($id, $ss)
    {
        $employee = null;
        if ($id) {
            $employee = self::getDetails($id, $ss);
        }
        return (object) [

            'status' => DB::table('employee_statuses')->selectRaw('id,name')->get(),
            'positions' => DB::table('positions')->selectRaw('id,title')->get(),
            'types' => DB::table('emp_types')->selectRaw('id,name')->get(),
            'work_shifts' => DB::table('work_shifts')->selectRaw('id,name')->get(),
            'employee' => $employee,
        ];

    }
    function updateStatus($status_id, $id = null, $ss = null)
    {

        $ss = $ss ? $ss : $this->userInfo;
        $x = DB::table('employees')->where('id', $id)->update([
            'status_id' => $status_id,
            'update_user'=>$ss->full_name,
            'update_date'=>getNowTime(),
            'update_uid'=>$ss->user_id
        ]);
        return DV::depends($x, ['Employee  status', 'updated']);
    }
}
