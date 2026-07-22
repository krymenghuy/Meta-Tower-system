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

    function getLeaveUninformList($arr, $ss)
    {
        $subs_id = $ss->subs_id;
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $status_id = $d->status_id ?? null;
        $leave_type_id = $d->leave_type_id ?? null;
        $work_shift_id = $d->work_shift_id ?? null;
        // $start_date = $d->start_date ?? date('d-M-Y');
        // $end_date = $d->end_date ?? date('d-M-Y');
        $start_date = $d->date ?? date('d-M-Y');
        $end_date = $d->date ?? date('d-M-Y');

        $str_search = '1=1';
        $str_work_shift = '5=5';

        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = '(emp.name LIKE \'%' . $search_value . '%\' OR emp.code LIKE \'%' . $search_value . '%\')';
        }
        if ($status_id) {
            $str_status = 'l.status_id = \'' . $status_id . '\'';
        }
        if ($work_shift_id) {
            $str_work_shift = 'ws.id = \'' . $work_shift_id . '\'';
        }
        if ($leave_type_id) {
            $str_leave_type_id = 'l.leave_type_id = \'' . $leave_type_id . '\'';
        }
        $count = 0;

        // Determine date filter: use today's date if no date range is provided, otherwise use specified range
        $today = date('Y-m-d');
        $emp_leav_uninform_list = [
            'day' => null,
        ];
        $emp_leav_uninform = [];

        if ($start_date && $end_date) {

            $work_shifts = null; // self::getWorkShift($current_date);
            $rows = DB::table('shift_details as sd')
                ->join('work_shifts as ws', 'ws.id', '=', 'sd.work_shift_id')
                ->whereRaw($str_work_shift)
                ->selectRaw('sd.id, sd.work_shift_id, sd.day, sd.time, sd.action ,sd.session, sd.start_time, sd.end_time, sd.shift_order_number')
                // ->where('ws.id', $work_shift_id)
                ->get();
            $date = new DateTime($today);
            $day = $date->format('D');
            $ds = WorkShift::getScanTimes($rows, $day);
            $work_shifts = $ds;


            $filterDays = self::getDatesWithDays($start_date, $end_date);
            // $arrDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            foreach ($filterDays as $filterDay) {
                $day = $filterDay['day'];
                $ds = WorkShift::getScanTimes($rows, $day);
                $leav_uninform['day'] = $filterDay['date'] . ' (' . $day . ')';

                foreach ($ds as $scenTime) {
                    $leav_uninform['shifts'][] = $scenTime;
                    $q_start_date = DBX::convertToDate('l.start_date');
                    $q_end_date = DBX::convertToDate('l.end_date');
                    $str_time = "(
                        ($q_start_date BETWEEN '$start_date' AND '$end_date') OR
                        ($q_end_date BETWEEN '$start_date' AND '$end_date') OR
                        ($q_start_date <= '$start_date' AND $q_end_date >= '$end_date')
                    )";

                    $employees = DB::table('employees as emp')->join('work_shifts as ws', 'ws.id', '=', 'emp.work_shift_id')->where('emp.status_id', 10)->whereRaw($str_search)->whereRaw($str_work_shift)->selectRaw('emp.id,emp.name as employee,emp.code as emp_code')->get();

                    $date = new DateTime($filterDay['date']);
                    $date = $date->format('Y-m-d');
                    $q_session_date = DBX::convertToDate('attendance_date');
                    $strsearch_date = "$q_session_date = '$date'";
                    // return $work_shifts[0];
                    $leav_uninform['employees'] =  [];
                    foreach ($employees as $emp) {
                        $has_checked_in_m = DB::table('emp_attendances')->where('session')->where('emp_id', $emp->id)->whereRaw($strsearch_date)->value('id');
                        if (!$has_checked_in_m) {
                            $emp->leave_date = $today;
                            $emp->leave_type = 'Uninformed';
                            $emp->image_url = Employee::profilePicture($emp->id);
                            $leav_uninform['employees'][] = $emp;
                        }
                    }
                }
                $count += 1;
                $emp_leav_uninform[] = $leav_uninform;
            }

            // $end_date = convertDate($end_date);
            // $start_date = convertDate($start_date);
            // if ((bool) strtotime($start_date) && (bool) strtotime($end_date)) {
            //     // Check if there is any overlap between the leave period and the given date range
            //     $str_dates = "(
            //         (l.start_date BETWEEN '$start_date' AND '$end_date') OR
            //         (l.end_date BETWEEN '$start_date' AND '$end_date') OR
            //         (l.start_date <= '$start_date' AND l.end_date >= '$end_date')
            //     )";
            // }

        } else {
            // Default to today's date if no start_date and end_date are provided
            // $str_dates = "'$today' BETWEEN l.start_date AND l.end_date";

            // $col_dates = DBX::formatDate('l.start_date', 'start_date') . ',' . DBX::formatDate('l.end_date', 'end_date');

            // $leave_days_calc = "DATEDIFF(l.end_date, l.start_date) + 1 AS leave_days";

            $employees = DB::table('employees as emp')->join('work_shifts as ws', 'ws.id', '=', 'emp.work_shift_id')->where('emp.status_id', 10)->whereRaw($str_work_shift)->selectRaw('emp.id,emp.name as employee,emp.code as emp_code')->get();

            $q_session_date = DBX::convertToDate('attendance_date');
            $strsearch_date = "$q_session_date = '$today'";
            // return $work_shifts[0];

            foreach ($employees as $emp) {
                $has_checked_in_m = DB::table('emp_attendances')->whereNull('session')->where('emp_id', $emp->id)->whereRaw($strsearch_date)->value('id');
                if (!$has_checked_in_m) {
                    $emp->leave_date = $today;
                    $emp->leave_type = 'Uninformed';
                    $emp->image_url = Employee::profilePicture($emp->id);
                    $emp_leav_uninform[] = $emp;
                    $count += 1;
                }
            }
        }

        // return $emp_leav_uninform;
        // return$emp_leav_uninform;
        // $clone_query = clone $query;
        // $count = $clone_query->count('l.id');

        // $rows = $query->skip($skip_rows)->take($per_page)->get();

        // foreach ($rows as $row) {
        //     $row->image_url = '';
        //     if (isset($row->emp_id) && $row->emp_photo) {
        //         $row->image_url = Employee::profilePicture($row->emp_id);
        //     }
        //     unset($row->emp_photo);
        // }

        return new LengthAwarePaginator($emp_leav_uninform, $count, $per_page, $current_page);
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
            ->selectRaw('l.id ,l.emp_id,emp.code as emp_code, emp.name as employee, p.name, l.leave_type_id, lt.name as leave_type,' . $leave_dates . ', ls.name as status, l.remarks, l.update_user, emp.photo_file_name as emp_photo,' . $col_update_date)
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
    function updateStatus($status_id, $id = null, $ss = null)
    {

        $ss = $ss ? $ss : $this->userInfo;
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
