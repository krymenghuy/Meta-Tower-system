<?php

namespace App\Models\Bhr;

use App\Models\DV;
use App\Models\Bhr\Employee;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DBX;

class Leave
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'leave';


    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr, $id=null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '0|number|exists=employees.id',
            'start_date' => '1|date',
            'end_date' => '1|date',
            'leave_type_id' => '1|number',
            'remarks' => '0|string|250',
            // 'has_returned' =>'number|default=0',
            'status_id' => '1|number|default = 2',
        ];

        // $checkUnque = ["$branch_id|leaves|emp_id|id=id|text=Employee has already Leave "];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang,false,null);

        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object) $inputs;
        if(!$d->emp_id) return DV::error('Employee ID is missing');
        $emp = Employee::props($d->emp_id, 'id,name,code');
        if(!$emp) return DV::error('Employee ID does not exist');
        if (!$id && Employee::isOnleave($d->emp_id)){
            return DV::error('Staff named ?? is already on leave::'.$emp->name);
        }


        $id = saveData($ss,'leaves', ['id' => $id], $inputs, [], 1,false);
        return DV::depends($id,null, 'Failed to save Leave Information');
        // if ($id > 0) {
        //     return DV::depends(1, ['leaves' => $inputs, 'id' => $id]);
        // }

        // return DV::error('Error saving leave management');
    }

    function getLeaveListPaginate($arr, $ss)
    {

        $subs_id = $ss->subs_id;
        $d = (object) $arr;
        $branch_id = $d->branch_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $status_id = $d->status_id ?? null;
        $leave_type_id = $d->leave_type_id ?? null;
        $search_value = $d->search_value ?? null;
        $start_date = $d->start_date ?? null;
        $end_date = $d->end_date ?? null;
        $str_search = '1=1';
        $str_status = '1=1';
        $str_dates = '1=1';
        $str_leave_type = '1=1';

        $str_branch = $branch_id > 0 ? 'l.branch_id ='.$branch_id : '3=3';
        $search_value = $d->search_value ?? null;
        if ($search_value){
             $search_value = escape_like_str($search_value);
             $str_search = "emp.email = '$search_value' OR emp.name LIKE '%$search_value%' OR emp.phone_number LIKE '%$search_value%' OR l.remarks LIKE '%$search_value%'";
        } else{
            $status_id = $d->status_id ?? null;
            $str_status = $status_id > 0? 'l.status_id = \'' . $status_id . '\'' : '1=1';
            $str_leave_type = $leave_type_id > 0? 'l.leave_type_id = \'' . $leave_type_id . '\'' : '1=1';
            $end_date = convertDate($end_date);
            $start_date = convertDate($start_date);

            if (strtotime($start_date) && strtotime($end_date)) {
                $str_dates = DBX::convertToDate('l.end_date') ." BETWEEN '$start_date' AND '$end_date'";
            }
        }


        $skip_rows = ($current_page - 1) * $per_page;
        $col_dates = DBX::formatDate('l.start_date','start_date').','.DBX::formatDate('l.end_date','end_date');
        $query = DB::table('leaves as l')
        ->join('employees as emp', 'emp.id', '=', 'l.emp_id')
        ->join('positions as p', 'p.id', '=', 'emp.postion_id')
        ->join('leave_types as lt', 'lt.id', '=', 'l.leave_type_id')
        ->join('leave_statuses as ls', 'ls.id', '=', 'l.status_id')
        ->where('l.subs_id', hex2bin($ss->subs_id))
        ->whereRaw($str_branch)
        ->whereRaw($str_search)
        ->whereRaw($str_status)
        ->whereRaw($str_leave_type)
        ->whereRaw($str_dates)
        ->selectRaw('l.id, emp.id as emp_id, emp.name as employee, p.title, l.leave_type_id, lt.name as leave_type,'
            . $col_dates
            . ', ls.name as status, l.remarks, l.update_user, l.update_date, l.status_id, emp.photo_file_name as emp_photo')
        ->orderBy('l.id', 'DESC');



        // Clone the query to get the total count
        $clone_query = clone $query;
        $count = $clone_query->count('l.id');

        // Paginate the results
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if (isset($row->emp_id) && $row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);  // Clean up unnecessary data
        }


        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function getDetails($id ,$ss =null)
    {

        $leave_dates = DBX::formatDate('l.start_date','start_date').','.DBX::formatDate('l.end_date','end_date');
        $col_update_date = DBX::formatDate('l.updated_at','update_date');

        $leave = DB::table('leaves as l')
        ->join('employees as emp', 'emp.id', '=', 'l.emp_id')
        ->join('positions as p', 'p.id', '=', 'emp.postion_id')
        ->join('leave_types as lt', 'lt.id', '=', 'l.leave_type_id')
        ->join('leave_statuses as ls', 'ls.id', '=', 'l.status_id')
        ->where('l.id', $id)
        //->where('l.status_id',2

        ->selectRaw('l.id AS emp_id, emp.name as employee, p.title, l.leave_type_id, lt.name as leave_type,'.$leave_dates.', ls.name as status, l.remarks, l.update_user, emp.photo_file_name as emp_photo,'.$col_update_date)

        ->first();
        return $leave;
    }

    function delete($id, $ss)
    {
        $id = $id ?? $this->id;

        $delete = DB::table('leaves')->where('id',$id)->delete();
        return DV::depends($delete,['action','deleted']);
    }

    function getFormOptions($id, $ss)
    {
        $leave = null;
        if ($id) $leave = self::getDetails($id, $ss);
        return (object) [
            'employees' => GeneralSettings::options_employee(10,$ss),
            'leave_types' =>GeneralSettings::options_leave_type($ss),
            'status' =>GeneralSettings::options_leave_status($ss),
            'leave_request' => $leave,

        ];

    }






}
