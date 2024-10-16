<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Attendance
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr, $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        // Validation rules
        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1||exists=employees.id',
            'check_in_time' => '0|time',
            'check_out_time' => '0|time',
            'attendance_date' => '0|date',
            'status_id' => '1|enum|DEFAULT=Present',
            'remark' => '0|string',
        ];

        $res = validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $emp_id = $inputs['emp_id'];

        if (isset($inputs['attendance_date'])) {
            $attendance_date = date('Y-m-d', strtotime($inputs['attendance_date']));
        } else {
            return DV::error('Attendance date is required');
        }

        $day_name = date('D', strtotime($attendance_date));
        $except_days = ['Sun', 'Sat'];
        if (in_array($day_name, $except_days)) {
            return DV::error('The day is a weekend');
        }

        $check_in_time = isset($inputs['check_in_time']) ? date('H:i:s', strtotime($inputs['check_in_time'])) : '00:00:00';
        $check_out_time = isset($inputs['check_out_time']) ? date('H:i:s', strtotime($inputs['check_out_time'])) : '00:00:00';

        $status_id = isset($inputs['status_id']) ? $inputs['status_id'] : 'Present';
        $remark = isset($inputs['remark']) ? $inputs['remark'] : '';

        $arr_attendance = [
            'emp_id' => $emp_id,
            'check_in_time' => $check_in_time,
            'check_out_time' => $check_out_time,
            'attendance_date' => $attendance_date,
            'status_id' => $status_id,
            'remark' => $remark,
        ];

        unset($inputs['status_id']);

        $newID = saveData($ss, 'attendances', ['id' => $id], $arr_attendance, [], 1, 1);

        return DV::depends($newID, ['attendances' => $inputs, 'id' => $newID], $ss);
    }
    function getStaffAttendanceListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;

        $str_search = '1=1';

        $query = DB::table('attendances as a')
            ->join('employees as e', 'e.id', '=', 'a.emp_id')
            ->selectRaw('a.id, e.id as emp_id, e.name, e.name_kh,e.email as email, a.emp_id, a.check_in_time, a.check_out_time, a.attendance_date, a.remark, a.status_id');

        if ($search_id) {
            $query->whereRaw('a.id =' . $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "e.name like '%" . $search_value . "%' or a.remark like '%" . $search_value . "%'";
            $query->whereRaw($str_search);
        }

        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('a.id');
        $rows = $query->get();


        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
    function attendanceList($filter = [], $ss = null)
    {
        $branch_id = $ss->branch_id;
        $d = (object)$filter;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $search_value = $d->search_value ?? null;
        $employee_id = $d->emp_id ?? null;
        $attendance_date = $d->attendance_date ?? null;
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = '1=1';
        if ($str_search) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(emp.name = '$search_value' OR emp.code LIKE '%$search_value%')";
        }
        if ($attendance_date) {
            $formatted_attendance_date = date('Y-m-d', strtotime($attendance_date));  // Ensure the date is in 'Y-m-d' format
            $str_search .= " AND a.attendance_date = '$formatted_attendance_date'";
        }
        $selectCols = 'a.id,emp.id as employee_id,emp.gender,emp.name,emp.name_kh,emp.email,emp.code,emp.date_of_birth as dob,a.attendance_date,a.check_in_time,a.check_out_time, a.remark, a.status_id';
        $query = DB::table('employees as emp')
            ->join('attendances as a', 'a.emp_id', '=', 'emp.id')
            // ->join('enrollments as e','e.id','=','sa.enrollment_id')
            ->whereRaw($str_search)
            ->selectRaw($selectCols)
            ->distinct()
            ->orderBy('emp.id', 'desc');
        // $query = DB::table('student_attendances')->selectRaw();
        $count_query = clone $query;
        $count = $count_query->count('emp.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        if ($employee_id) {
            $rows = $rows->where('emp.id', $employee_id);
            $count = $rows->count();
            dd($count, $employee_id);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
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

    function deleteAttendance($id, $ss)
    {
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
    function getFormOptions($id,$ss) {
        $attendance = null;
        if ($id) {
            $attendance = self::getDetails($id, $ss);
        }
        return (object) [

            'employees' => DB::table('employees')->selectRaw('id,name,email')->get(),
            'attendance' => $attendance,
        ];
    }
}
