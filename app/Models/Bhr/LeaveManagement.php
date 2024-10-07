<?php

namespace App\Models\Bhr;

use App\Models\DV;
use App\Models\Bhr\Employee;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
class LeaveManagement
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'leave_managements';

    function getDefaultOptions()
    {
        //price_list_id =11 (Normal Condition)
        $data = (object) [
            'price_list_id' => self::getDefaultPriceList()->id,
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
            'emp_id' => '1|number',
            'start_date' => '1|date',
            'end_date' => '1|date',
            'permission_details' => '1|string|0-250',
            'action_id' => '1|number|default = 1',

        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss,'leave_managements', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['leave_managements' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving leave management');
    }

    function getLeaveManagementListPaginate($arr, $ss)
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
        $search_status_id = $d->status_id ?? null;

        $str_search = '1=1';

        $query = DB::table('leave_managements as lm')
        ->join('action as a', 'a.id', '=', 'lm.action_id')
        ->join('employees as e', 'e.id', '=', 'lm.emp_id')
        ->join('positions as pos', 'pos.id', '=', 'e.positions_id')
        ->selectRaw('lm.id,e.id as emp_id,e.first_name ,e.last_name,e.positions_id as emp_position_id,pos.name as position,lm.action_id,lm.start_date,lm.end_date,lm.permission_details,a.name as status,e.photo_file_name as emp_photo')
        ->where('lm.branch_id', $branch_id);

        if ($search_id) {
            $query->where('lm.id', $search_id);
        }

        if ($search_status_id) {
            $query->where('lm.action_id', $search_status_id);
        }

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "e.first_name like '%{$search_value}%' or e.last_name like '%{$search_value}%' or lm.permission_details like '%{$search_value}%' or pos.name like '%{$search_value}%'";
            $query->whereRaw($str_search);
        }

        $count = $query->count();
        $query->orderBy('lm.id', 'desc');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->emp_photo) {
              $row->image_url = Employee::getProfilePicture($row->emp_id);
            }
            unset($row->emp_photo);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }



    function getDetails($id ,$ss =null)
    {
        $row = DB::table('leave_managements as lm')
        ->join('action as a', 'a.id', '=', 'lm.action_id')
        ->join('employees as e', 'e.id', '=', 'lm.emp_id')
        ->join('positions as pos', 'pos.id', '=', 'e.positions_id')
        ->selectRaw('lm.id,e.id as emp_id,e.first_name ,e.last_name,e.positions_id as emp_position_id,pos.name as position,lm.action_id,lm.start_date,lm.end_date,lm.permission_details,a.name as status,e.photo_file_name as emp_photo')
        ->where('lm.id', $id)->first();

        if ($row) {
            $row->image_url = Employee::getProfilePicture($id);
        } else {
            $row = null;
        }

        return $row;
    }

    function delete($id, $ss)
    {
        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('leave_managements')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Leave management not found');
        }
        // Return the query result
        return $query;
    }

    function getFormOptions($id, $ss)
    {
        $leave = null;
        if ($id) {
            $leave = self::getDetails($id, $ss);
        }
        return (object) [

            'employees' => DB::table('employees')->selectRaw('id,CONCAT(first_name," ",last_name) as name')->get(),
            'positions' => DB::table('positions')->selectRaw('id,name')->get(),
            'status' => DB::table('action')->selectRaw('id,name')->get(),

            'leave' => $leave,
        ];

    }



    function updateStatus($action_id, $id = null, $ss = null)
    {

        $ss = $ss ? $ss : $this->userInfo;
        $x = DB::table('leave_managements')->where('id', $id)->update([
            'action_id' => $action_id,
            'update_user'=>$ss->full_name,
            'update_date'=>getNowTime(),
            'update_uid'=>$ss->user_id
        ]);
        return DV::depends($x, ['leave management status', 'updated']);
    }



}