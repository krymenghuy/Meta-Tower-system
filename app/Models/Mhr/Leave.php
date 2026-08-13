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
            'leave_type_id' => '1|number|exists=leave_types.id|text=select_leave_type',
            'start_date' => '1|date|text=required_start_date',
            'end_date' => '1|date|text=required_end_date',
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
        $status_id = $inputs['status_id'] ?? null;
        if ($id) {
            if (is_null($status_id)) {
                $status_id = DB::table('leaves')->where('id', $id)->value('status_id');
                $inputs['status_id'] = $status_id;
            }
        } else {
            if (is_null($status_id)) {
                $status_id = 1; // Default to Pending (1)
                $inputs['status_id'] = 1;
            }
        }

        if ($status_id !== 4) {

        if ($start_date < $today || $end_date < $today) {
                return DV::error(
                    'Leave dates cannot be in the past. Please check the start date and end date.'
                );
            }
        }
        if ($start_date > $end_date) {
            return DV::error(
                'Start date cannot be later than end date.'
            );
        }
         $duplicateQuery = DB::table('leaves')
            ->where('emp_id', $emp_id)
            ->where('start_date', $start_date)
            ->where('end_date', $end_date);

        if ($id) {
            $duplicateQuery->where('id', '<>', $id);
        }

        if ($duplicateQuery->exists()) {
            return DV::error(
                'emp_already_leave'
            );
        }
        $overlapQuery = DB::table('leaves')
            ->where('emp_id', $emp_id)
            ->whereIn('status_id', [1, 2, 4])
            ->whereDate('start_date', '<=', $end_date)
            ->whereDate('end_date', '>=', $start_date);

        if ($id) {
            $overlapQuery->where('id', '<>', $id);
        }

        if ($overlapQuery->exists()) {
            return DV::error(
                'The employee already has a leave during the selected date range.'
            );
        }
        $attendanceDates = DB::table('emp_attendances')
            ->where('emp_id', $emp_id)
            ->whereDate('attendance_date', '>=', $start_date)
            ->whereDate('attendance_date', '<=', $end_date)
            ->select('attendance_date')
            ->distinct()
            ->pluck('attendance_date');

        if ($attendanceDates->isNotEmpty()) {

            $dates = $attendanceDates
                ->map(function ($date) {
                    return date('d-M-Y', strtotime($date));
                })
                ->implode(', ');

            return DV::error('Cannot create leave because the employee has attendance scan(s) on: ' . $dates . '.');
        }
        try {
        DB::beginTransaction();
        $leaveId = DBX::saveData($ss,'leaves',['id' => $id],$inputs,[],1,false);
        if (!$leaveId) {
            DB::rollBack();
            return DV::error('Failed to save Leave Information.');
        }
        DB::commit();
        return DV::depends($id, ['action', 'leave saved'], 'Failed to save Leave Information');

    } catch (\Throwable $e) {
        DB::rollBack();
        return DV::error('Failed to save Leave Information: ' . $e->getMessage());
    }
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
        // Determine date filter: use today's date if no date range is provided, otherwise use specified range
        $today = date('Y-m-d');
        if ($start_date && $end_date) {
            $end_date = convertDate($end_date);
            $start_date = convertDate($start_date);
            if ((bool) strtotime($start_date) && (bool) strtotime($end_date)) {
                // Check if there is any overlap between the leave period and the given date range
                $str_dates = "(
                    (l.start_date BETWEEN '$start_date' AND '$end_date') OR
                    (l.end_date BETWEEN '$start_date' AND '$end_date') OR
                    (l.start_date <= '$start_date' AND l.end_date >= '$end_date')
                )";
            }
        } else {
            // Default to today's date if no start_date and end_date are provided
            $str_dates = "'$today' BETWEEN l.start_date AND l.end_date";
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $leave_days_calc = "DATEDIFF(l.end_date, l.start_date) + 1 AS leave_days";

        $query = DB::table('leaves as l')
            ->join('employees as emp', 'emp.id', '=', 'l.emp_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->join('leave_types as lt', 'lt.id', '=', 'l.leave_type_id')
            ->join('leave_statuses as ls', 'ls.id', '=', 'l.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_status)
            ->whereRaw($str_dates)  // Apply date filter based on user input or default to current date
            // ->whereNotIn('l.status_id', [4])
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


    function getLeaveUninformedList1($arr, $ss)
    {
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $search_value = $d->search_value ?? null;
        $work_shift_id = $d->work_shift_id ?? $d->shifts ?? null;
        $skip_rows = ($current_page - 1) * $per_page;

        $str_search = '1=1';
        if ($search_value) {
            $skip_rows = 0;
            $str_search = "(e.name LIKE '%" . $search_value . "%')";
        }
        $excuse_status_id = DB::table('leave_statuses')
            ->where('name', 'LIKE', '%excuse%')
            ->value('id') ?? 5;

        $query = DB::table('leaves as l')
            ->leftJoin('employees as e', 'l.emp_id', '=', 'e.id')
            ->leftJoin('positions as p', 'p.id', '=', 'e.position_id')
            ->leftJoin('work_shifts as ws', 'ws.id', '=', 'e.work_shift_id')
            ->leftJoin('leave_statuses as ls', 'ls.id', '=', 'l.status_id')
            ->whereIn('l.status_id', [4, $excuse_status_id])
            ->whereRaw($str_search)
            ->orderBy('l.id', 'DESC');

        if ($work_shift_id) {
            $query->where('e.work_shift_id', $work_shift_id);
        }

        $query->select(
            'l.id', 'l.emp_id', 'l.start_date', 'l.end_date', 'l.status_id', 'ls.name as status', 'l.updated_at', 'l.update_user', 'e.name as emp_name', 'e.code as emp_code', 'e.salary as emp_salary', 'l.deduction', 'p.name as position_name', 'ws.name as work_shift_name', 'l.remarks',
            DB::raw("IF(l.remarks LIKE '%Warning issued%', 1, 0) as has_warning")
        );
        $clone_query = clone  $query;
        $count = $clone_query->count('l.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            $start = Carbon::parse($row->start_date);
            $end = Carbon::parse($row->end_date);
            $days_count = $start->diffInDays($end) + 1;
            $row->date_period = self::formatDatePeriod($row->start_date, $row->end_date, $days_count);

            setOfficialDates($row, ['start_date', 'end_date'], ['updated_at'], ['']);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
    function getLeaveUninformedList2($arr, $ss)
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
        $start_date = $d->start_date ?? date('d-M-Y');
        $end_date = $d->end_date ?? date('d-M-Y');
        // $start_date = $d->date ?? date('d-M-Y');
        // $end_date = $d->date ?? date('d-M-Y');

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

        $today = date('Y-m-d');
        $emp_leav_uninform_list = [
            'day' => null,
        ];
        $emp_leav_uninform = [];

        if ($start_date && $end_date) {
            $work_shifts = null;
            $rows = DB::table('shift_details as sd')
                ->join('work_shifts as ws', 'ws.id', '=', 'sd.work_shift_id')
                ->whereRaw($str_work_shift)
                ->selectRaw('sd.id, sd.work_shift_id, sd.day, sd.time, sd.action ,sd.session, sd.start_time, sd.end_time, sd.shift_order_number')
                // ->where('ws.id', $work_shift_id)
                ->get();

            $date = new DateTime($today);
            $day = $date->format('D');
            $ds = ShiftDetails::getScanTimes($rows, $day);
            $work_shifts = $ds;


            $filterDays = self::getDatesWithDays($start_date,$end_date);
            // $arrDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            foreach ($filterDays as $filterDay) {
                $day = $filterDay['day'];
                $ds = ShiftDetails::getScanTimes($rows, $day);
                $leav_uninform['day'] = $filterDay['date']. ' ('.$day.')';

                foreach($ds as $scenTime){
                    $leav_uninform['shifts'][] = $scenTime;
                    $q_start_date = DBX::convertToDate('l.start_date');
                    $q_end_date = DBX::convertToDate('l.end_date');
                    $str_time = "(
                        ($q_start_date BETWEEN '$start_date' AND '$end_date') OR
                        ($q_end_date BETWEEN '$start_date' AND '$end_date') OR
                        ($q_start_date <= '$start_date' AND $q_end_date >= '$end_date')
                    )";

                    $employees = DB::table('employees as emp')
                        ->join('work_shifts as ws','ws.id','=','emp.work_shift_id')
                        ->where('emp.status_id',10)->whereRaw($str_search)
                        ->whereRaw($str_work_shift)
                        ->selectRaw('emp.id,emp.name as employee,emp.code as emp_code')
                        ->get();

                    $date = new DateTime($filterDay['date']);
                    $date = $date->format('Y-m-d');
                    $q_session_date = DBX::convertToDate('attendance_date');
                    $strsearch_date = "$q_session_date = '$date'";
                    // return $work_shifts[0];
                    $leav_uninform['employees'] =  [];
                    foreach($employees as $emp){
                        $has_checked_in_m = DB::table('emp_attendances')->where('session','m')->where('emp_id',$emp->id)->whereRaw($strsearch_date)->value('id');
                        if(!$has_checked_in_m){
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
        } else {
            $employees = DB::table('employees as emp')
                ->join('work_shifts as ws','ws.id','=','emp.work_shift_id')
                ->where('emp.status_id',10)
                ->whereRaw($str_work_shift)
                ->selectRaw('emp.id,emp.name as employee,emp.code as emp_code')
                ->get();

            $q_session_date = DBX::convertToDate('attendance_date');
            $strsearch_date = "$q_session_date = '$today'";
            // return $work_shifts[0];

            foreach($employees as $emp){
                $has_checked_in_m = DB::table('emp_attendances')
                    ->where('session','m')
                    ->where('emp_id',$emp->id)
                    ->whereRaw($strsearch_date)
                    ->value('id');
                if(!$has_checked_in_m){
                    $emp->leave_date = $today;
                    $emp->leave_type = 'Uninformed';
                    $emp->image_url = Employee::profilePicture($emp->id);
                    $emp_leav_uninform [] = $emp;
                    $count += 1;
                }
            }

        }
        return new LengthAwarePaginator($emp_leav_uninform, $count, $per_page, $current_page);
    }
    public function getLeaveUninformedList($arr, $ss)
    {
        $subs_id = $ss->subs_id;
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value  = $d->search_value ?? null;
        $status_id     = $d->status_id ?? null;
        $leave_type_id = $d->leave_type_id ?? null;
        $work_shift_id = $d->work_shift_id ?? null;
        $start_date = $d->start_date ?? date('d-M-Y');
        $end_date   = $d->end_date ?? date('d-M-Y');

        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = '1=1';
        $str_work_shift = '1=1';
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = '(emp.name LIKE \'%' . $search_value . '%\' OR emp.code LIKE \'%' . $search_value . '%\')';
        }

        if ($work_shift_id) {
            $str_work_shift = 'ws.id = ' . (int) $work_shift_id;
        }
        $startDate = convertDate($start_date);
        $endDate   = convertDate($end_date);

        if (!$startDate || !$endDate) {
            return DV::error('Invalid date range.');
        }

        if ($startDate > $endDate) {
            return DV::error(
                'Start date cannot be later than end date.'
            );
        }
        $rows = DB::table('shift_details as sd')
            ->join('work_shifts as ws','ws.id','=','sd.work_shift_id')
            ->whereRaw($str_work_shift)
            ->select([
                'sd.id',
                'sd.work_shift_id',
                'sd.day',
                'sd.time',
                'sd.action',
                'sd.session',
                'sd.start_time',
                'sd.end_time',
                'sd.shift_order_number',
            ])
            ->get();


        $employeesQuery = DB::table('employees as emp')
            ->join('work_shifts as ws','ws.id','=','emp.work_shift_id')
            ->where('emp.status_id', 10)
            ->whereRaw($str_search)
            ->whereRaw($str_work_shift);

        $employees = $employeesQuery
            ->select([
                'emp.id',
                'emp.name as employee',
                'emp.code as emp_code',
                'emp.work_shift_id',
            ])
            ->get();
        $result = [];

       $filterDays = self::getDatesWithDays($start_date,$end_date);

        foreach ($filterDays as $filterDay) {

            $date = convertDate($filterDay['date']);
            $day  = $filterDay['day'];
            $dayShifts = ShiftDetails::getScanTimes($rows,$day);

            $uninformedEmployees = [];

            foreach ($employees as $employee) {
                $hasCheckedIn = DB::table('emp_attendances')
                    ->where('emp_id', $employee->id)
                    ->where('session', 'm')
                    ->whereDate('attendance_date', $date)
                    ->exists();
                if ($hasCheckedIn) {
                    continue;
                }
                $hasLeaveQuery = DB::table('leaves as l')
                    ->where('l.emp_id', $employee->id)
                    ->whereIn('l.status_id', [1, 2])
                    ->whereDate('l.start_date', '<=', $date)
                    ->whereDate('l.end_date', '>=', $date);

                if ($status_id) {
                    $hasLeaveQuery->where(
                        'l.status_id',
                        (int) $status_id
                    );
                }
                if ($leave_type_id) {
                    $hasLeaveQuery->where(
                        'l.leave_type_id',
                        (int) $leave_type_id
                    );
                }

                $hasLeave = $hasLeaveQuery->exists();
                if ($hasLeave) {
                    continue;
                }
                $employee->leave_date = $date;
                $employee->leave_type = 'Uninformed';
                $employee->image_url = Employee::profilePicture(
                    $employee->id
                );

                $uninformedEmployees[] = $employee;
            }
            if (!empty($uninformedEmployees)) {

                $result[] = [
                    'day' => $filterDay['date']
                        . ' ('
                        . $day
                        . ')',

                    'shifts' => $dayShifts,

                    'employees' => $uninformedEmployees,
                ];
            }
        }
        $total = count($result);
        $pagedData = array_slice($result,$skip_rows,$per_page);
        return new LengthAwarePaginator($pagedData,$total,$per_page,$current_page);
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
            return DV::error('You already approved this leave.');
        }

        if (in_array($req->status_id, [3, 4, 5])) {
            return DV::error('Request already processed.');
        }

        $start_date_col = DBX::convertToDate('start_date');
        $end_date_col = DBX::convertToDate('end_date');
        $exists = DB::table('leaves')
            ->where('id', '!=', $id)
            ->where('emp_id', $req->emp_id) 
            ->where('status_id', 2)         
            ->whereRaw("
                $start_date_col <= ? AND $end_date_col >= ?
            ", [$req->end_date, $req->start_date])
            ->exists();

        if ($exists) {
            return DV::error('This employee already has an approved leave request that overlaps with this date range.');
        }

        $updated = DB::table('leaves')
            ->where('id', $id)
            ->update([
                'status_id'   => 2,
                'update_user' => $ss->full_name ?? '',
                'update_uid'  => $ss->user_id ?? $ss->id ?? null,
                'updated_at'  => getNowTime(),
            ]);

        if (!$updated) {return DV::error('Update failed.');}

        return DV::success(['message' => 'Leave accepted successfully']);
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
            ->selectRaw('l.id, l.emp_id, emp.work_shift_id as work_shift_id, emp.code as emp_code, emp.name as employee, emp.salary as emp_salary, l.deduction, p.name, l.leave_type_id, lt.name as leave_type,' . $leave_dates . ', ls.name as status, l.remarks, l.update_user, emp.photo_file_name as emp_photo,' . $col_update_date)
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

        if ($status_id === 'excuse' || $status_id === 'excused' || $status_id == 5) {
            $resolved_status_id = DB::table('leave_statuses')
                ->where('name', 'LIKE', '%excuse%')
                ->value('id');
            $status_id = $resolved_status_id ?? 5;
        }

        if ($status_id === 'deduct' || $status_id === 'uninformed' || $status_id == 4) {
            $resolved_status_id = DB::table('leave_statuses')
                ->where('name', 'LIKE', '%uninformed%')
                ->value('id');
            $status_id = $resolved_status_id ?? 4;
        }

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
                'remarks' => $extra['remarks'] ?? '-',
                'deduction' => $extra['deduction'] ?? 0.00,
                'branch_id' => $ss->branch_id,
                'subs_id' => hex2bin($ss->subs_id),
                'created_at' => getNowTime(),
                'updated_at' => getNowTime(),
                'update_user' => $ss->full_name,
                'update_uid' => $ss->user_id ?? $ss->id ?? null
            ]);

            // Sync to overlapping active payrolls
            $payroll_start_date = date('Y-m-d', strtotime($extra['start_date']));
            $payroll_end_date = date('Y-m-d', strtotime($extra['end_date']));
            $payrolls = DB::table('payrolls')
                ->where('authorized', 0)
                ->where('disbursed', 0)
                ->where('start_date', '<=', $payroll_end_date)
                ->where('end_date', '>=', $payroll_start_date)
                ->get();

            foreach ($payrolls as $p) {
                $pl_id = DB::table('payroll_list')
                    ->where('payroll_id', $p->id)
                    ->where('emp_id', $extra['emp_id'])
                    ->value('id');

                if ($pl_id) {
                    $payrollModel = new Payroll($p->id, $ss);
                    $payrollModel->calculate($p->id, $ss);
                }
            }

            return DV::success([
                'message' => 'Leave status updated successfully',
                'id' => $insert_id
            ]);
        }

        $currLeave = DB::table('leaves')->where('id', $id)->selectRaw('status_id, deduction, remarks')->first();
        if ($currLeave) {
            $currentStatus = $currLeave->status_id;
            $currentDeduction = (float) $currLeave->deduction;
            $hasDeductionChange = isset($extra['deduction']) && ($currentDeduction != (float) $extra['deduction']);
            $currentRemarks = $currLeave->remarks;
            $hasRemarksChange = isset($extra['remarks']) && ($currentRemarks != $extra['remarks']);

            if ($currentStatus == $status_id && !$hasDeductionChange && !$hasRemarksChange) {
                return DV::success([
                    'message' => 'Leave status updated successfully',
                    'id' => $id
                ]);
            }
        }

        $updateData = [
            'status_id' => $status_id,
            'update_user' => $ss->full_name,
            'updated_at' => getNowTime(),
            'update_uid' => $ss->user_id ?? $ss->id ?? null
        ];
        if (isset($extra['remarks'])) {
            $updateData['remarks'] = $extra['remarks'];
        }
        if (isset($extra['deduction'])) {
            $updateData['deduction'] = $extra['deduction'];
        }

        $x = DB::table('leaves')->where('id', $id)->update($updateData);

        // Sync to overlapping active payrolls
        $leave = DB::table('leaves')->where('id', $id)->first();
        if ($leave) {
            $emp_id = $leave->emp_id;
            $start_date = $leave->start_date;
            $end_date = $leave->end_date;

            $payrolls = DB::table('payrolls')
                ->where('authorized', 0)
                ->where('disbursed', 0)
                ->where('start_date', '<=', $end_date)
                ->where('end_date', '>=', $start_date)
                ->get();

            foreach ($payrolls as $p) {
                $pl_id = DB::table('payroll_list')
                    ->where('payroll_id', $p->id)
                    ->where('emp_id', $emp_id)
                    ->value('id');

                if ($pl_id) {
                    $payrollModel = new Payroll($p->id, $ss);
                    $payrollModel->calculate($p->id, $ss);
                }
            }
        }

        return DV::success([
            'message' => 'Leave status updated successfully',
            'id' => $id
        ]);
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
