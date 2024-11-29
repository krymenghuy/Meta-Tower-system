<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Attendance
{

    protected $id = null;
    protected $userInfo = null,$mins=40;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr=[], $id = null, $ss = null)
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
            'status' => '0|string',
            'remarks' => '0|string',
        ];
        $remarks = [':', "'", '-', '.', '?', '$', '\'', '@'];
        $res = validateObject($arr, $v_rule, 1, ["remarks" => $remarks], $ss->lang, 0, null);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $emp_id = $inputs['emp_id'];
        $attendance_date = date('Y-m-d',strtotime($inputs['attendance_date']));
        $today = date('Y-m-d');
        $day_name = date('D',strtotime($attendance_date));
        $except_days = ['Sun'];
        if (in_array($day_name, $except_days)) {
            return DV::error('The day is a weekend');
        }
        $existingAttendance = DB::table('attendances')
            ->where('emp_id', $emp_id)
            ->whereDate('attendance_date', $attendance_date)
            ->first();
        if ($existingAttendance) {
            if (!$id || $id != $existingAttendance->id) {
                return DV::error('Attendance for this employee on this date already exists.');
            }
            $id = $existingAttendance->id; // Use existing ID for updates
        }

        $d = (object)$inputs;


        $scan_time = isset($inputs['scan_time']) ? date('H:i:s', strtotime($inputs['scan_time'])) : '00:00:00';
        $scan_action = 
        $status = ($scan_time <= '08:00:00') ? 'Present' : 'Late';
        $remarks = isset($inputs['remarks']) ? $inputs['remarks'] : (($scan_time < '08:00:00') ? 'On time' : '');

        $arr_attendance = [
            'emp_id' => $emp_id,
            'scan_time' => $scan_time,
            'scan_action' => $scan_action,
            'attendance_date' => $attendance_date,
            'status' => $status,
            'remarks' => $remarks,
        ];

        // unset($inputs['status']);

        $newID = saveData($ss, 'attendances', ['id' => $id], $arr_attendance, [], 1, 1);

        return DV::depends($newID, ['attendances' => $inputs, 'id' => $newID], $ss);
    }



    function getStaffAttendanceListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 20;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;
        $search_status_id = $d->status_id ?? null;
        $attendance_date = $d->attendance_date ?? date('Y-m-d');
        $UNINFORM_LEAVE_TYPE_ID = 8;
        $attendance_date = date('Y-m-d', strtotime($attendance_date));
        $query = DB::table('attendances as a')
            ->join('employees as e', 'e.id', '=', 'a.emp_id')
            ->leftJoin('leaves as l', function ($join) use ($attendance_date) {
                $join->on('l.emp_id', '=', 'e.id')
                    ->whereIn('l.status_id', [2, 3]) // Include Approved (2) and Rejected (3) statuses
                    ->whereDate('l.start_date', '<=', $attendance_date)
                    ->whereDate('l.end_date', '>=', $attendance_date);
            })
            ->selectRaw(
                '
        a.id,
        e.id as emp_id,
        e.photo_file_name as emp_photo,
        e.name,
        e.name_kh,
        e.email as email,
        a.emp_id,
        a.check_in_time,
        a.check_out_time,
        a.attendance_date,
        a.remark,
        CASE 
            WHEN l.id IS NOT NULL AND l.status_id = 3 THEN "Absent" -- Rejected leaves are considered Absent
            WHEN l.id IS NOT NULL AND l.leave_type_id = ? THEN "Absent"
            WHEN l.id IS NOT NULL THEN "Permission"
            ELSE a.status_id
        END as status_id
        ',
                [$UNINFORM_LEAVE_TYPE_ID]
            );

        // Apply filters if provided
        if ($search_id) {
            $query->where('a.id', $search_id);
        }
        if ($search_status_id) {
            $query->where('a.status_id', $search_status_id);
        }
        if ($attendance_date) {
            $query->whereDate('a.attendance_date', $attendance_date);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->where(function ($q) use ($search_value) {
                $q->where('e.name', 'LIKE', "%{$search_value}%")
                    ->orWhere('a.remark', 'LIKE', "%{$search_value}%")
                    ->orWhere('e.email', 'LIKE', "%{$search_value}%")
                    ->orWhere('a.attendance_date', 'LIKE', "%{$search_value}%");
            });
        }

        $rows = $query->paginate($per_page, ['*'], 'page', $current_page);

        foreach ($rows as $row) {
            $row->image_url = '';
            if (isset($row->emp_id) && $row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);

            if ($row->status_id === "Absent" && empty($row->remark)) {
                $row->remark = "Don't know the reason";
            }

            // Format the status
            if ($row->status_id === "Absent") {
                $row->formatted_status = '<span style="color: red;">Absent</span>';
            } elseif ($row->status_id === "Late") {
                $row->formatted_status = '<span style="color: orange;">Late</span>';
            } elseif ($row->status_id === "Permission") {
                $row->formatted_status = '<span style="color: blue;">Permission</span>';
            } else {
                $row->formatted_status = '<span style="color: green;">Present</span>';
            }
        }

        return $rows;
    }


    function attendanceList($filter = [], $ss = null)
    {
        $branch_id = $ss->branch_id;
        $d = (object)$filter;
        $current_page = isset($d->current_page) && is_numeric($d->current_page) ? $d->current_page : 1;
        $per_page = isset($d->per_page) && is_numeric($d->per_page) ? $d->per_page : 10;
        $search_value = isset($d->search_value) ? escape_like_str($d->search_value) : null;
        $employee_id = isset($d->emp_id) ? $d->emp_id : null;
        $attendance_date = isset($d->attendance_date) ? date('Y-m-d', strtotime($d->attendance_date)) : null;
        $skip_rows = ($current_page - 1) * $per_page;

        // Start building the query
        $query = DB::table('attendances as a')
            // ->join('attendances as a', 'a.emp_id', '=', 'emp.id')
            ->join('employees as emp', 'emp.id', '=', 'a.emp_id')
            ->join('employee_statuses as e', 'e.id', '=', 'a.status_id')
            ->where('a.branch_id', $branch_id)
            ->where('a.attendance_date', '>=', date('Y-m-d', strtotime('-30 days')))
            ->where('a.attendance_date', '<=', date('Y-m-d'))
            ->selectRaw('a.id, emp.id as employee_id, emp.gender, emp.name, emp.name_kh, emp.email, emp.code, emp.date_of_birth as dob, a.attendance_date, a.check_in_time, a.check_out_time, a.remark, a.status_id, e.photo_file_name as emp_photo')
            ->orderBy('emp.name', 'asc');
        // ->selectRaw('a.id, emp.id as employee_id, emp.gender, emp.name, emp.name_kh, emp.email, emp.code, emp.date_of_birth as dob, a.attendance_date, a.check_in_time, a.check_out_time, a.remark, a.status_id, e.photo_file_name as emp_photo')
        // ->distinct();

        // Build the search conditions
        $str_search = '1=1';

        if ($search_value) {
            $str_search .= " AND (emp.name LIKE '%$search_value%' OR emp.code LIKE '%$search_value%')";
        }

        if ($attendance_date) {
            $str_search .= " AND a.attendance_date = '$attendance_date'";
        }

        // Apply search conditions
        $query->whereRaw($str_search);

        // Clone query for count
        $count_query = clone $query;
        $count = $count_query->count();

        // Filter by employee_id if provided
        if ($employee_id) {
            $query->where('emp.id', $employee_id);
        }

        // Get the rows with pagination
        $rows = $query->skip($skip_rows)->take($per_page)->get();

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
