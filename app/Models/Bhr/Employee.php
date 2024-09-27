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
    //Employees Regitration default options | senderDetaultOptions() | employeesDefaultOptions
    function getDefaultOptions()
    {
        //price_list_id =11 (Normal Condition)
        $data = (object) [
            'price_list_id' => self::getDefaultPriceList()->emp_id,
            'cod' => 0,
            'cod_fee' => 0,
        ];
        return $data;
    }

    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    //saveSender()
    function save($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'first_name' => '1|string|0-100',
            'last_name' => '1|string|0-100',
            'email' => '1|email',
            'phone_number' => '1|phone|0-20',
            'gender_id' => '1|number',
            'nationality' => '1|string|0-150',
            'date_of_birth' => '1|date',
            'address' => '0|string|0-250',
            'positions_id' => '1|number',
            'session_id' => '1|number',
            'joining_date' => '0|date',
            'NSSF' => '0|string|0-100',
            'identity_card_number'=> '0|number',
            'status_id' => '1|number|default = 1',
            'photo' => '0|image',
        ];


        $checkUnque = [
            "$branch_id|employees|phone_number|id=id|text=Employee already exists by phone number",
            "$branch_id|employees|email|id=id|text=Employee already exists by email",
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
        $d->phone_nuper = str_replace(' ', '', $inputs['phone_number']);
        $inputs['phone_number'] = $d->phone_nuper;
        if (!$d->phone_nuper) {
            error_log('Phone numer is required for valid  Employee');
            return DV::error('Phone numer is required for valid  Employee');
        }
        unset($inputs['photo']);
        $employee_created = !$id;
        $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));

        error_log('Saving data: ' . json_encode($inputs));
        $id = saveData($ss, 'employees', ['id' => $id], $inputs, [], 1);

        if ($id > 0) {
            $new_code = null; // $this->getNextSenderCode($ss);
            if($id){
            $prefix = 'EM';
            $res = setOfficialCode($branch_id,'employee_code_control','employees',['id'=>$id],$prefix,5,null);
            $new_code = $res->code;
            }
            if ($delete_prev_image) {
                $file_name = DB::table('employees as em')->where('em.id', $id)->take(1)->value('em.photo_file_name');
                if ($file_name) {
                    PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
                }

                DB::table('employees')->where('id', $id)->update(['photo_file_name' => null]);
            }
            PublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo, null, ['id' => $id, 'store' => 'employees.photo_file_name']);
            return DV::depends(1, ['employees' => $inputs, 'id' => $id]);
        }

        return DV::error('Failed to save data');
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
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 5;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;
        $search_position_id = $d->position_id ?? null;
        $search_status_id = $d->status_id ?? null;

        $str_search = '1=1';

        $query = DB::table('employees as em')
        ->join('genders as g', 'g.id', '=', 'em.gender_id')
        ->join('positions as p', 'p.id', '=', 'em.positions_id')
        ->join('dep_status as ds', 'ds.id', '=', 'em.status_id')
        ->join('sessions as s', 's.id', '=', 'em.session_id')
        ->selectRaw('
            em.code,
            em.id,
            em.first_name,
            em.last_name,
            em.email,
            em.phone_number,
            em.gender_id,
            em.nationality,
            em.date_of_birth,
            em.address,
            em.photo_file_name,
            em.joining_date,
            em.nssf,
            em.identity_card_number,
            g.name as gender,
            em.positions_id,
            p.name as position,
            em.session_id,
            s.name as session,
            em.status_id,
            ds.name as status
        ')
        ->where('em.branch_id', $branch_id);



        if ($search_id) {
            $query->where('em.id', $search_id);

        }

        if ($search_position_id) {
            $query->where('em.positions_id', $search_position_id);
        }

        if ($search_status_id) {
            $query->where('em.status_id', $search_status_id);
        }

        if ($search_value) {
            $search_value = addcslashes($search_value, '%_'); // Escape special characters used in LIKE query
            $query->where(function($q) use ($search_value) {
                $q->where('em.first_name', 'like', '%' . $search_value . '%')
                  ->orWhere('em.last_name', 'like', '%' . $search_value . '%')
                  ->orWhere('em.email', 'like', '%' . $search_value . '%')
                  ->orWhere('em.phone_number', 'like', '%' . $search_value . '%')
                  ->orWhere('p.name', 'like', '%' . $search_value . '%')
                  ->orWhere('em.address', 'like', '%' . $search_value . '%')
                  ->orWhere('em.joining_date', 'like', '%' . $search_value . '%')
                  ->orWhere('em.nssf', 'like', '%' . $search_value . '%')
                  ->orWhere('em.identity_card_number', 'like', '%' . $search_value . '%');
            });
        }


        $count = $query->count();
        $query->orderBy('em.id', 'asc');
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


    function getDetails($id)
    {
        $row = DB::table('employees as em')
        ->join('genders as g', 'g.id', '=', 'em.gender_id')
        ->join('positions as p', 'p.id', '=', 'em.positions_id')
        ->join('dep_status as ds', 'ds.id', '=', 'em.status_id')
        ->join('sessions as s', 's.id', '=', 'em.session_id')
        ->selectRaw('
            em.code,
            em.id,
            em.first_name,
            em.last_name,
            em.email,
            em.phone_number,
            em.gender_id,
            em.nationality,
            em.date_of_birth,
            em.address,
            em.photo_file_name,
            em.joining_date,
            em.nssf,
            em.identity_card_number,
            g.name as gender,
            em.positions_id,
            p.name as position,
            em.session_id,
            s.name as session,
            em.status_id,
            ds.name as status
            ')
            ->where('em.id', $id)
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

        // Update the profile to remove the photo file name
        DB::table('employees')->where('id', $id)->update(['photo_file_name' => null]);

        // Delete the profile
        $deleted = DB::table('employees')->where('id', $id)->delete();

        // Check if the query was successful
        if (!$deleted) {
            return DV::error('Employee not found or not deleted');
        }

        // Return success response
        return DV::depends(1, ['id' => $id, 'deleted' => $file_name ?? 'No file found']);
    }

    function getFormOptions($id, $ss)
    {
        $employee = null;
        if ($id) {
            $employee = self::getDetails($id, $ss);
        }
        return (object) [

            'status' => DB::table('dep_status')->selectRaw('id,name')->get(),
            'positions' => DB::table('positions')->selectRaw('id,name')->get(),
            'genders' => DB::table('genders')->selectRaw('id,name')->get(),
            'sessions' => DB::table('sessions')->selectRaw('id,name')->get(),


            'employee' => $employee,
        ];

    }

}