<?php

namespace App\Models\Bhr;

use App\Models\DV;
use App\Models\Bhr\Employee;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Attendance
{

    protected $id = null;
    protected $userInfo = null, $mins = 40;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr = [] , $id = null, $ss = null )
    {

        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $mins = $this->mins;


        $v_rule = [
            'emp_id' => '1|number|exists=employees.id',
            'attendance_date' => '0|date',
            'scan_time' => '0|string',
            'scan_action' => '0|string',
            'action_type' => '0|string',
            'remarks' => '0|string',
        ];

        $res = validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $emp_id = $inputs['emp_id'];
        $attendance_date = date('Y-m-d', strtotime($inputs['attendance_date']));
        $today = date('Y-m-d');
        $day_name = date('D', strtotime($attendance_date));
        $except_days = ['Sun'];
        if (in_array($day_name, $except_days)) {
            return DV::error('The day is a weekend');
        }


        $d = (object) $arr;
        $remarks = $d->remarks;
        $scan_time = $d->scan_time ? date('H:i:s', strtotime($d->scan_time)) : '00:00:00';
        $scan_action = $d->scan_action;
        $action_type = $d->action_type;


        $arr_attendance = [
            'emp_id' => $emp_id,
            'scan_time' => $scan_time,
            'scan_action' => $scan_action,
            'action_type' => $action_type,
            'attendance_date' => $attendance_date ?? '',
            'remarks' => $remarks,
        ];


        // unset($inputs['status']);

        $newID = saveData($ss, 'emp_attendances', ['id' => $id], $arr_attendance, [], 1, 1);

        return DV::depends($newID, ['emp_attendances' => $inputs, 'id' => $newID], $ss);
    }

    function getStaffAttendanceListPaginate($filter = [], $ss = null)
    {
        $d = (object) $filter;
        $search_value = $d->search_value ?? null;
        $current_page = $d->current_page ?? 1;
        $branch_id = $d->branch_id ?? null;
        $department_id = $d->department_id ?? null;
        $emp_type_id = $d->emp_type_id ?? null;
        $work_shift_id = $d->work_shift_id ?? null;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) $current_page = 1;
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = "1=1";
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(emp.code = '$search_value' OR emp.name LIKE '%$search_value%')";
        }
        if (!$search_value) {
            if ($branch_id) $str_moreWhere .= ' AND emp.branch_id = ' . $branch_id;
            if ($department_id) $str_moreWhere .= ' AND d.id = ' . $department_id;
            if ($emp_type_id) $str_moreWhere .= ' AND emp.emp_type_id = ' . $emp_type_id;
            if ($work_shift_id) $str_moreWhere .= ' AND emp.work_shift_id = ' . $work_shift_id;
        }
        $selectCols = 'emp.id as emp_id, emp.name, emp.name_kh, emp.sex, emp.code, emp.date_of_birth as dob, ws.name as work_shift, DATE_FORMAT(a.attendance_date, "%d %b %Y") as attendance_date, a.scan_time, a.scan_action, p.title as position';

    $query = DB::table('employees as emp')
        ->join('work_shifts as ws', 'ws.id', '=', 'emp.work_shift_id')
        ->join('positions as p', 'emp.position_id', '=', 'p.id')
        ->join('departments as d', 'p.department_id', '=', 'd.id')
        ->join('emp_attendances as a', 'a.emp_id', '=', 'emp.id')
        ->whereRaw($str_moreWhere)
        ->whereRaw($str_search)
        ->selectRaw($selectCols)
        ->orderBy('a.attendance_date', 'desc')
        ->orderBy('emp.id', 'desc'); // Order by attendance date first

    $rawRows = $query->skip($skip_rows)->take($per_page)->get();

    $rows = $rawRows
        ->groupBy(function ($item) {
            return $item->emp_id . '_' . $item->attendance_date; // Group by emp_id and attendance_date
        })
        ->map(function ($group) {
            $first = $group->first();
            return [
                'code' => $first->code,
                'name' => $first->name,
                'sex' => $first->sex,
                'position' => $first->position,
                'attendance_date' => $first->attendance_date,
                'work_shift' => $first->work_shift,
                'scan_info' => $group->map(function ($item) {
                    return [
                        'time' => $item->scan_time,
                        'action' => $item->scan_action,
                    ];
                })->values(),
            ];
        })->values();


        // Pagination
        $count_query = clone $query;
        $count = $count_query->count('emp.id');

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function attendanceList($arr, $ss = null)
    {
        $d = (object) $arr;

        $search_value = $d->search_value ?? null;

        $str_search = '1=1';

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("emp.name LIKE '%" . $search_value . "%' OR emp.code LIKE '%" . $search_value . "%'");
        }

        // Execute the query and fetch all matching records
        $rows = $query->get();

        // Return the rows as a result
        return $rows;
    }


    function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        if (empty($id)) {
            return response()->json([
                'message' => 'Attendance ID is required.',
                'status' => 400
            ], 400);
        }
        $row = DB::table('attendances as a')->selectRaw('a.id,a.emp_id,a.attendance_date,a.check_in_time,a.check_out_time,a.remark')->where('a.branch_id', $branch_id)->where('a.id', $id)->first();
        if (!$row) {
            return response()->json([
                'message' => 'Attendance ID not found.',
                'status' => 404
            ], 404);
        }
        return $row;
    }

    function deleteAttendance($id = null)
    {
        $id = $id ?? $this->id;

        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('attendances')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('attendances not found');
        }
        // Return the query result
        return $query;
    }
    // Other functions...
    function getFormOptions($id, $ss)
    {
        $attendance = null;
        if ($id) {
            $attendance = self::getDetails($id, $ss);
        }
        return (object) [

            'employees' => GeneralSettings::options_employee(10, $ss),
            'branches' => GeneralSettings::options_branch($ss),
            'positions' => DB::table('positions')->selectRaw('id,title')->get(),
            'departments' => DB::table('departments')->selectRaw('id,name')->get(),



            'attendance' => $attendance,
        ];
    }
}
