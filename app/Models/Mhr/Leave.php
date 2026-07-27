<?php

namespace App\Models\Mhr;

use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use DV;
use DateTime;
use Carbon\Carbon;


use XPublicStorage;
use Vsd\Vsloquent\VSModel;

class Leave extends VSModel
{
    protected $userInfo = null;
    protected $table = 'leaves';

    protected static $img_dir = 'leaves';
    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    public function upsert($arr = [], $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id|text=select_employee',
            'start_date' => '1|date|text=start_date_required',
            'end_date' => '1|date|text=end_date_required',
            'leave_type_id' => '1|number|exists=leave_types.id',
            'status_id' => '0|number|exists=leave_statuses.id',
            'remarks' => '0|string|250',
        ];
        $chars = ['$', '#', '@', '!', '/', '.', '-', '_', '=', '?', "'"];
        $res = DBX::validateObject($arr, $v_rule, true, ['remarks' => $chars], $ss->lang, false, null);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object) $inputs;
        $emp_id = $inputs['emp_id'];
        if (!$d->emp_id) return DV::error('Employee ID is missing');
        $employee_info = DB::table('employees as emp')
            ->where('emp.id', $emp_id)
            ->selectRaw('id, status_id, name, code')
            ->first();
        if (!$employee_info) return DV::error('It seems the employee information does not exist');
        if ($employee_info->status_id !== 10) return DV::error('The Employee is not active');
        $today = date('Y-m-d');
        $start_date = $inputs['start_date'] ?? $today;
        $end_date = $inputs['end_date'];
        $remarks = $inputs['remarks'];

        if ($start_date < $today || $end_date < $today) {
            return DV::error('It seems your date request leave in the past. Please check start date and end date!');
        }
        if (strtotime($start_date) > strtotime($end_date)) {
            return DV::error('It seems your request start date later end date. Please check start date and end date!');
        }
        if (!$id) {
            $existingLeave = DB::table('leaves')
                ->where('emp_id', $d->emp_id)
                ->where('start_date', $start_date)
                ->where('end_date', $end_date)
                ->exists();
            if ($existingLeave) {
                return DV::error('The employee already has leave for the specified date range.');
            }
        }
        if (Employee::isOnLeave($d->emp_id)) {
            return DV::error('Staff named ' . $employee_info->name . ' is already on leave.');
        }
        \Log::info(print_r($inputs, true));

        $id = DBX::saveData($ss, 'leaves', ['id' => $id], $inputs, [], 1, false);
        return DV::depends($id, ['action', 'leave saved'], 'Failed to save Leave Information');
    }




    // static function checkLeaveError($id,$start_date, $end_date, $remarks) {
    //     $leave = DB::table('leaves as l')->where('l.id',$id)->selectRaw('id,formatDate(start_date) as start_date, formatDate(end_date) as end_date,status_id')->first();
    //     if(!$leave) return 'Failed to identify employee leave';
    //     $today = date('Y-m-d');
    //     $start_date = convertDate($start_date);
    //     $end_date = convertDate($end_date);

    //     if ($start_date > $end_date) {
    //         return 'The start date cannot be later than '.$end_date;
    //     }

    //     if ($start_date < $today) {
    //         return 'The start date cannot be earlier than '.$today;
    //     }

    //     if ($end_date < $today) {
    //         return 'The end date cannot be earlier than '.$today;
    //     }

    //     if ($start_date < $today && $end_date < $today) {
    //         return 'Both the start date and end date are incorrect.';
    //     }

    //     if ($start_date && $end_date && strtotime($start_date) > strtotime($end_date)) {
    //         return 'Leave Date and End Date are not reasonable.';
    //     }

    //     if (!$remarks) {
    //         return'Remarks are required for Dropout or Suspend.';
    //     }

    //     return null;
    // }


    function getLeaveListPaginate($arr, $ss)
    {
        $subs_id = $ss->subs_id;
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $search_value = $d->search_value ?? null;
        $status_id = $d->status_id ?? null;
        $leave_type = $d->leave_type_id ?? null;
        $start_date = $d->start_date ?? null;
        $end_date = $d->end_date ?? null;

        $str_search = '1=1';
        $str_status = '2=2';
        $str_dates = '3=3';

        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = '(emp.name LIKE \'%' . $search_value . '%\' OR emp.code LIKE \'%' . $search_value . '%\')';
        }
        if ($status_id) {
            $str_status = 'l.status_id = \'' . $status_id . '\'';
        }

        $skip_rows = ($current_page - 1) * $per_page;
        $col_dates = DBX::formatDate('l.start_date', 'start_date') . ',' . DBX::formatDate('l.end_date', 'end_date');

        $leave_days_calc = "DATEDIFF(l.end_date, l.start_date) + 1 AS leave_days";

        $query = DB::table('leaves as l')
            ->join('employees as emp', 'emp.id', '=', 'l.emp_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('leave_types as lt', 'lt.id', '=', 'l.leave_type_id')
            ->join('leave_statuses as ls', 'ls.id', '=', 'l.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_status)
            ->whereRaw($str_dates)  // Apply date filter based on user input or default to current date
            ->whereNotIn('l.status_id', [4])
            ->selectRaw('l.id, emp.id as emp_id, emp.code as emp_code, emp.name as employee_name, emp.sex, p.name as position,l.start_date, l.end_date, l.leave_type_id, lt.name as leave_type, ls.name as status, l.remarks, l.update_user, l.updated_at, l.status_id, emp.photo_file_name as emp_photo,'
                . $leave_days_calc)
            ->orderBy('l.id', 'DESC');
        if ($leave_type) {
            $query->where('l.leave_type_id', $leave_type);
        }
        $clone_query = clone $query;
        $count = $clone_query->count('l.id');

        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if (isset($row->emp_id) && $row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);
            $row = setOfficialDates($row, ['start_date', 'end_date'], ['updated_at'], ['']);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function getLeaveUninformedList($arr, $ss)
    {
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $search_value = $d->search_value ?? null;
        $skip_rows = ($current_page - 1) * $per_page;

        $str_search = '1=1';
        if ($search_value) {
            $skip_rows = 0;
            $str_search = "(e.name LIKE '%" . $search_value . "%')";
        }
        $query = DB::table('leaves as l')
            ->leftJoin('employees as e', 'l.emp_id', '=', 'e.id')
            ->leftJoin('positions as p', 'p.id', '=', 'e.position_id')
            ->leftJoin('work_shifts as ws', 'ws.id', '=', 'e.work_shift_id')
            ->where('l.status_id', 4)
            ->whereRaw($str_search)
            ->select('l.id', 'l.emp_id', 'l.start_date', 'l.end_date', 'l.status_id', 'l.updated_at', 'l.update_user', 'e.name as emp_name', 'e.code as emp_code', 'p.name as position_name', 'ws.name as work_shift_name');
        $clone_query = clone  $query;
        $count = $clone_query->count('l.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            setOfficialDates($row, ['start_date', 'end_date'], ['updated_at'], ['']);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    private static function formatDatePeriod($start, $end, $count)
    {
        if ($start === $end) {
            return date('d M Y', strtotime($start)) . " (1 day)";
        }
        $s_time = strtotime($start);
        $e_time = strtotime($end);
        $s_year = date('Y', $s_time);
        $e_year = date('Y', $e_time);
        $s_month = date('M', $s_time);
        $e_month = date('M', $e_time);

        if ($s_year !== $e_year) {
            return date('d M Y', $s_time) . ' - ' . date('d M Y', $e_time) . " ($count days)";
        }
        if ($s_month !== $e_month) {
            return date('d M', $s_time) . ' - ' . date('d M Y', $e_time) . " ($count days)";
        }
        return date('d', $s_time) . ' - ' . date('d M Y', $e_time) . " ($count days)";
    }

    private static function buildGroupedRecord($group)
    {
        $first = $group[0];
        $last = end($group);
        $count = count($group);

        $leave_id = null;
        $status_id = 1; // Pending
        $status = 'Pending';
        $resolution = '-';

        foreach ($group as $item) {
            if ($item['leave_id'] !== null) {
                $leave_id = $item['leave_id'];
                $status_id = $item['status_id'];
                $status = $item['status'];
                $resolution = $item['resolution'];
                break;
            }
        }

        return (object) [
            'id' => $leave_id,
            'emp_id' => $first['emp_id'],
            'employee' => $first['employee'],
            'emp_code' => $first['emp_code'],
            'image_url' => $first['image_url'],
            'department' => $first['department'],
            'position' => $first['position'],
            'work_shift' => $first['work_shift'],
            'work_shift_time' => $first['work_shift_time'],
            'start_date' => $first['date'],
            'end_date' => $last['date'],
            'days' => $count,
            'date_period' => self::formatDatePeriod($first['date'], $last['date'], $count),
            'status_id' => $status_id,
            'status' => $status,
            'resolution' => $resolution
        ];
    }


    public function acceptLeave($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $d  = (object) $arr;

        $id = $d->id ?? null;

        if (!$id) {
            return DV::error('Invalid request id');
        }

        // 1. Added emp_id to selection to scope the conflict check to the specific employee
        $req = DB::table('leaves as l')
            ->select(
                'id',
                'emp_id',
                'status_id',
                'start_date',
                'end_date',
                'leave_type_id'
            )
            ->where('id', $id)
            ->first();

        if (!$req) {
            return DV::error('Leave not found');
        }

        if ($req->status_id == 2) {
            return DV::error('You already accepted this leave.');
        }

        if (in_array($req->status_id, [3, 4, 5])) {
            return DV::error('Request already processed.');
        }

        $start_date_col = DBX::convertToDate('start_date');
        $end_date_col = DBX::convertToDate('end_date');

        // 2. Fixed slot checking logic to catch any overlapping dates for this employee
        $exists = DB::table('leaves')
            ->where('id', '!=', $id)
            ->where('emp_id', $req->emp_id) // Scoped to the individual employee
            ->where('status_id', 2)         // Only look at already accepted leaves
            ->whereRaw("
                $start_date_col <= ? AND $end_date_col >= ?
            ", [$req->end_date, $req->start_date])
            ->exists();

        if ($exists) {
            return DV::error(
                'This employee already has an accepted leave request that overlaps with this date range.'
            );
        }

        $updated = DB::table('leaves')
            ->where('id', $id)
            ->update([
                'status_id'   => 2,
                'update_user' => $ss->full_name ?? '',
                'update_uid'  => $ss->user_id ?? $ss->id ?? null,
                'updated_at'  => getNowTime(),
            ]);

        if (!$updated) {
            return DV::error('Update failed.');
        }

        return DV::success([
            'message' => 'Leave accepted successfully'
        ]);
    }

    function rejectLeave($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $d = (object) $arr;

        $id = $d->id ?? null;
        $remarks = $d->remarks ?? $d->remark ?? null;

        if (empty($id)) {
            return DV::error('ID is required.');
        }

        $reject = DB::table('leaves')
            ->where('id', $id)
            ->update([
                'status_id'   => 3,
                'remarks'     => $remarks,
                'update_user' => $ss->full_name ?? '',
                'update_uid'  => $ss->user_id ?? $ss->id ?? null,
                'updated_at'  => getNowTime(),
            ]);

        if (!$reject) {
            return DV::error('Reject process failed.');
        }

        return DV::success([
            'message' => 'Leave request rejected successfully.'
        ]);
    }


    function getDatesWithDays($start_date, $end_date)
    {
        $start = Carbon::createFromFormat('d-M-Y', $start_date);
        $end = Carbon::createFromFormat('d-M-Y', $end_date);

        $dates = [];
        while ($start <= $end) {
            $dates[] = [
                'day' => $start->format('D'),
                'date' => $start->format('d-M-Y'),
            ];
            $start->addDay();
        }

        return $dates;
    }


    function getDetails($id, $ss = null)
    {

        $leave_dates = DBX::formatDate('l.start_date', 'start_date') . ',' . DBX::formatDate('l.end_date', 'end_date');
        $col_update_date = DBX::formatDate('l.updated_at', 'update_date');

        $leave = DB::table('leaves as l')
            ->join('employees as emp', 'emp.id', '=', 'l.emp_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('leave_types as lt', 'lt.id', '=', 'l.leave_type_id')
            ->join('leave_statuses as ls', 'ls.id', '=', 'l.status_id')
            ->where('l.id', $id)
            //->where('l.status_id',2
            ->selectRaw('l.id, l.emp_id, emp.work_shift_id as work_shift_id, emp.code as emp_code, emp.name as employee, p.name, l.leave_type_id, lt.name as leave_type,' . $leave_dates . ', ls.name as status, l.remarks, l.update_user, emp.photo_file_name as emp_photo,' . $col_update_date)
            ->first();
        return $leave;
    }

    function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $delete = DB::table('leaves')->where('id', $id)->delete();
        return DV::depends($delete, null, 'Error deleting leave');
    }

    function getFormOptions($id, $ss)
    {
        $leave = null;
        if ($id) $leave = self::getDetails($id, $ss);
        return (object) [
            'employees' => GeneralSettings::options_employee(10, $ss),
            'leave_types' => GeneralSettings::options_leave_type($ss),
            'work_shifts' => DB::table('work_shifts')->selectRaw('id,name')->get(),
            // 'sessions' =>GeneralSettings::options_session($ss),
            'status' => GeneralSettings::options_leave_status($ss),
            'leave_request' => $leave,
        ];
    }
    function updateStatus($status_id, $id = null, $ss = null, $extra = [])
    {
        $ss = $ss ? $ss : $this->userInfo;

        if (empty($id) && !empty($extra['emp_id'])) {
            $uninformed_leave_type_id = DB::table('leave_types')
                ->where('name', 'LIKE', '%uninformed%')
                ->value('id') ?? 1;

            $insert_id = DB::table('leaves')->insertGetId([
                'emp_id' => $extra['emp_id'],
                'start_date' => date('Y-m-d', strtotime($extra['start_date'])),
                'end_date' => date('Y-m-d', strtotime($extra['end_date'])),
                'leave_type_id' => $uninformed_leave_type_id,
                'status_id' => $status_id,
                'remarks' => '-',
                'branch_id' => $ss->branch_id,
                'subs_id' => hex2bin($ss->subs_id),
                'created_at' => getNowTime(),
                'updated_at' => getNowTime(),
                'update_user' => $ss->full_name,
                'update_uid' => $ss->user_id ?? $ss->id ?? null
            ]);

            return DV::success([
                'message' => 'Leave status updated successfully',
                'id' => $insert_id
            ]);
        }

        $currentStatus = DB::table('leaves')->where('id', $id)->value('status_id');
        if ($currentStatus == $status_id) {
            return DV::error('It is the same current status.');
        }
        $x = DB::table('leaves')->where('id', $id)->update([
            'status_id' => $status_id,
            'update_user' => $ss->full_name,
            'updated_at' => getNowTime(),
            'update_uid' => $ss->user_id ?? $ss->id ?? null
        ]);
        return DV::depends($x, ['Leave  status', 'updated']);
    }
    function getLeaveList($arr, $ss)
    {
        $d = (object) $arr;

        $search_value = $d->search_value ?? null;

        $str_search = '1=1';

        // Query to fetch attendance records
        $query = DB::table('leaves as l')
            ->join('employees as e', 'e.id', '=', 'l.emp_id')
            ->selectRaw('l.id, l.emp_id,l.leave_type_id,l.start_date, l.end_date, l.remarks,l.status_id')
            ->where('l.branch_id', $ss->branch_id);  // Ensure only records for the current branch are fetched

        // Aply search filters if a search value is provided
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("l.remarks LIKE '%" . $search_value . "%'");
        }
        $rows = $query->get();

        // Return the rows as a result
        return $rows;
    }
}
