<?php

namespace App\Models\Bhr;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\Bhr\GeneralSettings;
use App\Models\DV;
use App\Models\PublicStorage;
use DB;
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

    function save($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string|0-100',
            'name_kh' => '1|string|0-100',
            'email' => '1|email',
            'phone_number' => '1|phone|0-20',
            'gender' => '1|string|0-6',
            'nationality' => '1|string|0-150',
            'date_of_birth' => '1|date',
            'address' => '0|string|0-250',
            'positions_id' => '1|number',
            'emp_role_id' => '1|number',
            'joining_date' => '1|date',
            'nssf_id' => '0|string|0-100',
            'nid'=> '0|number',
            'status_id' => '1|number|default = 1',
            'photo' => '0|image',
        ];


        $checkUnque = [
            "$branch_id|employees|phone_number|id=id|text=employee already exists by phone number",
            "$branch_id|employees|email|id=id|text=employee already exists by email",
        ];

        $res = validateObject($arr, $v_rule, true, ['email' => GeneralSettings::$email_chars, 'photo' => GeneralSettings::$image_chars], $ss->lang, false, isset($arr['id']) ? null : $checkUnque);
        if ($res->error) {
            error_log('Validation error: ' . json_encode($res->error));
            return DV::error($res->error);
        }

        $id = $res->id;

        $inputs = $res->values;



        $d = (object) $inputs;
        $photo = $d->photo;
        $d->phone_number = str_replace(' ', '', $inputs['phone_number']);
        $inputs['phone_number'] = $d->phone_number;
        if (!$d->phone_number) {
            error_log('Phone number is required for valid  employee');
            return DV::error('Phone number is required for valid  employee');
        }
        unset($inputs['photo']);
        $employee_created = !$id;
        $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));

        error_log('Saving data: ' . json_encode($inputs));
        $save = !$id;
        $id = saveData($ss, 'employees', ['id' => $id], $inputs, [], 1);
        if($save){
            $prefix = 'emp';
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

    public static function getProfilePicture($id)
    {
        $col_subs_id = DBX::getHex('p.subs_id', 'subs_id');
        $row = DB::table('employees as p')->where('id', $id)->selectRaw($col_subs_id . ',p.branch_id,p.photo_file_name')->first();
        $url = '';
        if ($row) {
           $url = PublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => 'employees'], 'images') . $row->photo_file_name;
            return validateUrl($url);
        } else {
            // return self::defaultImage($row ? $row->subs_id : null);
        }
    }

    function getListPaginate($arr, $ss)
    {
        $branch_id = $ss->branch_id;
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 5;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $status = $d->status_id ?? null;
        $search_value = $d->search_value ?? null;
        $str_srch = '1=1';
        $str_where = '2=2';
        if($search_value){
            $skip_rows = 0;
            $str_srch = "(emp.name LIKE '%".$search_value."%' OR emp.name_kh = '".$search_value."' OR emp.nid = '".$search_value."' OR emp.phone_number = '".$search_value."')";
        }
        if($status){
            $str_where = 'emp.status_id =\'' . $status . '\'';

        }
        $query = DB::table('employees as emp')
            ->join('positions as p', 'p.id', '=', 'emp.positions_id')
            ->join('employee_status as es', 'es.id', '=', 'emp.status_id')
            ->join('emp_roles as el', 'el.id', '=', 'emp.emp_role_id')
            ->whereRaw($str_srch)
            ->whereRaw($str_where)
            ->selectRaw('
            emp.code,
            emp.id,
            emp.name,
            emp.name_kh,
            emp.email,
            emp.phone_number,
            emp.gender,
            emp.nationality,
            emp.date_of_birth,
            emp.address,
            emp.photo_file_name,
            emp.joining_date,
            emp.nssf_id,
            emp.nid,
            emp.positions_id,
            p.title as position,
            emp.emp_role_id,
            el.name as role,
            emp.status_id,
            es.name as status
        ')
        ->orderBy('emp.id', 'ASC');

        // if ($search_value) {
        //     $search_value = addcslashes($search_value, '%_'); // Escape special characters used in LIKE query
        //     $query->where(function($q) use ($search_value) {
        //         $q->where('emp.name', 'like', '%' . $search_value . '%')
        //           ->orWhere('emp.name_kh', 'like', '%' . $search_value . '%')
        //           ->orWhere('emp.email', 'like', '%' . $search_value . '%')
        //           ->orWhere('emp.phone_number', 'like', '%' . $search_value . '%')
        //           ->orWhere('p.name', 'like', '%' . $search_value . '%')
        //           ->orWhere('emp.address', 'like', '%' . $search_value . '%')
        //           ->orWhere('emp.joining_date', 'like', '%' . $search_value . '%')
        //           ->orWhere('emp.nssf_id', 'like', '%' . $search_value . '%')
        //           ->orWhere('emp.nid', 'like', '%' . $search_value . '%');
        //     });
        // }

        $clone_query = clone $query;
        $count = $clone_query->count('emp.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->photo_file_name) {
              $row->image_url = self::getProfilePicture($row->id);
            }
            unset($row->photo_file_name);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function getDetails($id,$ss)
    {
        $branch_id = $ss->branch_id;

        $row =DB::table('employees as emp')
            ->join('positions as p', 'p.id', '=', 'emp.positions_id')
            ->join('employee_status as es', 'es.id', '=', 'emp.status_id')
            ->join('emp_roles as el', 'el.id', '=', 'emp.emp_role_id')
            ->selectRaw('
                emp.code,
                emp.id,
                emp.name,
                emp.name_kh,
                emp.email,
                emp.phone_number,
                emp.gender,
                emp.nationality,
                emp.date_of_birth,
                emp.address,
                emp.photo_file_name,
                emp.joining_date,
                emp.nssf_id,
                emp.nid,
                emp.positions_id,
                p.title as position,
                emp.emp_role_id,
                el.name as role,
                emp.status_id,
                es.name as status
            ')
            ->where('emp.branch_id',$branch_id)
            ->where('emp.id', $id)
            ->first();

        if ($row) {
            $row->image_url = self::getProfilePicture($id);
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

            'status' => DB::table('employee_status')->selectRaw('id,name')->get(),
            'positions' => DB::table('positions')->selectRaw('id,title')->get(),
            // 'genders' => DB::table('genders')->selectRaw('id,name')->get(),
            'roles' => DB::table('emp_roles')->selectRaw('id,name')->get(),


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
