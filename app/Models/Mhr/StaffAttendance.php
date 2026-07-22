<?php

namespace App\Models\Mhr;

use DV;
use App\Models\Prm\GeneralSettings;
use DBX;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use XPublicStorage;
use Vsd\Vsloquent\VSModel;
use DateTime;

class StaffAttendance extends VSModel
{

    protected $userInfo = null;
    protected $table = 'emp_attendances';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function upsert($arr = [], $id = null, $ss = null)
    {

        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id|text=select_employee',
            'attendance_date' => '1|date|text=required_date',
            'scan_action' => '1|string|text=required_action',
            'scan_time' => '1|string|text=required_time',
            'work_shift_id' => '1|number|exists=work_shifts.id|text=select_work_shift',
            'attendance_status' => '0|string',
            'remarks' => '0|string',
        ];

        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);
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
        $scan_action = $inputs['scan_action'];

        $work_shift_id = $inputs['work_shift_id'] ?? null;
        if (!$work_shift_id && $emp_id) {
            $work_shift_id = DB::table('employees')->where('id', $emp_id)->value('work_shift_id');
        }

        $arr_attendance = [
            'emp_id' => $emp_id,
            'scan_time' => $scan_time,
            'scan_action' => $scan_action,
            // 'attendance_status' => $inputs['attendance_status'] ?? $arr['attendance_status'] ?? 'Present',
            'attendance_date' => $attendance_date ?? '',
            'work_shift_id' => $work_shift_id ?? null,
            'remarks' => $remarks,
        ];


        // unset($inputs['status']);
        $newID = DBX::saveData($ss, 'emp_attendances', ['id' => $id], $arr_attendance, [], 1, 1);
        return DV::depends($newID, ['emp_attendances' => $inputs, 'id' => $newID], 'Error message if any');
    }

    public function getStaffAttendanceListPaginate($filter = [], $ss = null)
    {
        $filter = (object) $filter;
        $branch_id = $filter->branch_id ?? null;
        $position_id = $filter->position_id ?? null;
        $emp_type_id = $filter->emp_type_id ?? null;
        $work_shift_id = $filter->work_shift_id ?? null;
        $attendance_date = $filter->attendance_date ?? null;
        $search_value = escape_like_str($filter->search_value ?? null);
        $current_page = $filter->current_page ?? 1;
        $per_page = $filter->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;
        $scan_date = DBX::formatDate('a.attendance_date', 'attendance_date');
        $dob = DBX::formatDate('emp.date_of_birth', 'dob');
        $query = DB::table('employees as emp')
            ->join('positions as p', 'emp.position_id', '=', 'p.id')
            ->join('emp_attendances as a', 'a.emp_id', '=', 'emp.id')
            ->join('work_shifts as ws', 'ws.id', '=', 'a.work_shift_id')
            ->selectRaw('a.id, a.attendance_date AS orderByDate, emp.id as emp_id, emp.phone_number, emp.name, emp.name_kh, emp.sex, emp.code as emp_code,'
                . $dob . ', ws.name as work_shift,'
                . $scan_date . ', a.scan_time, a.scan_action, a.remarks, p.name as position')
            ->orderByRaw('orderByDate DESC, emp.name, emp.code, a.work_shift_id');
        if ($search_value) {
            $query->where(function ($subQuery) use ($search_value) {
                $subQuery->where('emp.code', 'LIKE', "%{$search_value}%")
                    ->orWhere('emp.name', 'LIKE', "%{$search_value}%")
                    ->orWhere('emp.phone_number', 'LIKE', "%{$search_value}%");
            });
        }
        if ($branch_id) {
            $query->where('emp.branch_id', $branch_id);
        }
        if ($position_id) {
            $query->where('p.id', $position_id);
        }
        if ($emp_type_id) {
            $query->where('emp.emp_type_id', $emp_type_id);
        }
        if ($work_shift_id) {
            $query->where('a.work_shift_id', $work_shift_id);
        }
        if ($attendance_date) {
            $timestamp = strtotime($attendance_date);
            if ($timestamp !== false) {
                $formatted_date = date('Y-m-d', $timestamp);
                $query->whereDate('a.attendance_date', $formatted_date);
            }
        }
        $count = $query->count();
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
    function attendanceList($arr, $ss = null)
    {
        $d = (object) $arr;

        $search_value = $d->search_value ?? null;

        $str_search = '1=1';
        $query = $d->query;
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("emp.name LIKE '%" . $search_value . "%' OR emp.code LIKE '%" . $search_value . "%'");
        }
        $rows = $query->get();
        return $rows;
    }

    function getDetails($id, $ss = null)
    {
        if (empty($id)) {
            return response()->json([
                'message' => 'Attendance ID is required.',
                'status' => 400
            ], 400);
        }
        $row = DB::table('emp_attendances as a')
            ->join('employees as emp', 'emp.id', '=', 'a.emp_id')
            ->selectRaw('a.id, a.emp_id, emp.name as employee_name, emp.code as employee_code, emp.position_id, a.attendance_date, a.scan_time, a.scan_action, a.work_shift_id, a.remarks')
            ->where('a.id', $id)
            ->first();
        if (!$row) {
            return response()->json([
                'message' => 'Attendance ID not found.',
                'status' => 404
            ], 404);
        }
        return $row;
    }

    function deleteAttendance($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        $query = DB::table('emp_attendances')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Attendance record not found');
        }
        return DV::depends($query, null, 'Error deleting attendance record');
    }
    function getFormOptions($id, $ss)
    {
        $attendance = null;
        if ($id) {
            $attendance = self::getDetails($id, $ss);
        }
        return (object) [

            'employees' => GeneralSettings::options_employee(10, $ss),
            'positions' => DB::table('positions')->selectRaw('id, name')->get(),
            'departments' => DB::table('departments')->selectRaw('id,name')->get(),
            'work_shifts' => DB::table('work_shifts')->selectRaw('id, name')->get(),
            'attendance_statuses' => [
                (object) ['id' => 'Present', 'name' => 'Present'],
                (object) ['id' => 'Late', 'name' => 'Late'],
                (object) ['id' => 'Absent', 'name' => 'Absent'],
                (object) ['id' => 'Leave', 'name' => 'Leave'],
                (object) ['id' => 'Half Day', 'name' => 'Half Day'],
                (object) ['id' => 'Holiday', 'name' => 'Holiday'],
                (object) ['id' => 'Weekend', 'name' => 'Weekend'],
                (object) ['id' => 'Permission', 'name' => 'Permission'],
            ],


            'attendance' => $attendance,
        ];
    }

    function scanAttendance($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id ?? $branch_id = 1;
        $subs_id = isset($ss->subs_id) ? $ss->subs_id : getCurrentSubsId(true);
        $mins = $this->mins; // for find class start and end time which > between < mins

        $v_rule = [
            'employee_id' => '0|number',
            'employee_code' => '0|string|exists.employees.code',
            'employee_card_number' => '0|string|exists.employees.card_number',
            'remarks' => '0|string|1,150'
        ];

        $res = DBX::validateObject($arr, $v_rule, 0, [], $ss->lang, 0, null);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $employee_id =  $inputs['employee_id'] ?? null;
        $employee_code = $inputs['employee_code'] ??  null;
        $employee_card_number = $inputs['employee_card_number'] ??  null;
        $current_date = convertDate($arr['attendance_date'] ?? date('Y-m-d'));
        $present_time =  $arr['scan_time'] ??  date('H:i');


        $employee = null;
        $col_subs_id = DBX::getHEX('subs_id', 'subs_id');
        if ($employee_code) {
            $employee = DB::table('employees')->where('code', $employee_code)->selectRaw('id,name,code,work_shift_id,photo_file_name,status_id,' . $col_subs_id)->first();
        } else if ($employee_card_number) {
            $employee = DB::table('employees')->where('card_number', $employee_card_number)->selectRaw('id,name,code,work_shift_id,photo_file_name,status_id,' . $col_subs_id)->first();
        } else {
            $employee = DB::table('employees')->where('id', $employee_id)->selectRaw('id,name,code,work_shift_id,photo_file_name,status_id,' . $col_subs_id)->first();
        }
        if (!$employee) return DV::error('Employee not found');
        if ($employee->status_id != 10) return DV::error('Employee ' . $employee->name . ' are Resigned or Terminated ');
        $employee_id = $employee->id;
        $subs_id = $employee->subs_id ?? null;
        if (!$subs_id) {
            DV::error('One issue occured during attendance scan. We are reviewing it for you!');
            //The issue is that employees table record does not contains correct or it contains empty subs_id
        }
        $bin_subs_id = hex2bin($subs_id);
        $str_where = 'emp_id = ' . $employee_id;
        $q_session_date = DBX::convertToDate('attendance_date');
        $strsearch_date = "$q_session_date = '$current_date'";
        $work_shift_detail = null;
        $work_shift_id = $employee->work_shift_id;
        $str_work_shift = 'sd.work_shift_id=\'' . $work_shift_id . '\'';

        $work_shifts = null;
        $rows = DB::table('shift_details as sd')
            ->join('work_shifts as ws', 'ws.id', '=', 'sd.work_shift_id')
            ->whereRaw($str_work_shift)
            ->selectRaw('sd.id, sd.work_shift_id, sd.day, sd.time, sd.action ,sd.session, sd.start_time, sd.end_time, sd.shift_order_number')
            ->get();
        $date = new DateTime($current_date);
        $day = $date->format('D');
        $ds = WorkShift::getScanTimes($rows, $day);
        $work_shifts = $ds;

        $present_time = new DateTime($present_time);
        $present_time = $present_time->format('H:i');
        $action = null;
        foreach ($work_shifts as $work_shift) {
            $time = new DateTime($work_shift->start_time);
            $start_time = $time->format('H:i');
            $time = new DateTime($work_shift->end_time);
            $end_time = $time->format('H:i');

            if ($present_time >= $start_time && $present_time <= $end_time) {
                $work_shift_detail = $work_shift;
                $action = $work_shift->action;
                break;
            }
        }


        if (!$work_shift_detail) {
            return DV::error("No work shift found at this time ($present_time)!");
        }

        if (strtolower($action) == 'check in') {
            // $has_checked_in = DB::table('emp_attendances')->where('action_type', $action)->where('session', $work_shift_detail->session)->whereRaw($str_where)->whereRaw($strsearch_date)->value('id');
            $has_checked_in = self::getActionBySession($work_shift_detail->session, $action, $str_where, $strsearch_date);
            if ($has_checked_in) return DV::error('You already checked in this session!');
            else {
                $shift_order_number = (int)$work_shift_detail->shift_order_number - 1;
                $message = null;
                if ($shift_order_number >= 1) {
                    foreach ($work_shifts as $work_shift) {
                        if ($shift_order_number == $work_shift->shift_order_number) {
                            $session = self::getTranslateSession($work_shift->session);
                            $check_action = self::getActionBySession($work_shift->session, $work_shift->action, $str_where, $strsearch_date);
                            if (!$check_action) {
                                $message = "$work_shift->action $session not yet scan!";
                                break;
                            }
                        }
                    }
                }

                if ($message) return DV::error($message);
            }
        } else if (strtolower($action) == 'check out') {
            // $has_checked_out = DB::table('emp_attendances')->where('action_type', $action)->where('session', $work_shift_detail->session)->whereRaw($str_where)->whereRaw($strsearch_date)->value('id');
            $has_checked_out = self::getActionBySession($work_shift_detail->session, $action, $str_where, $strsearch_date);
            if ($has_checked_out) return DV::error('You already checked out this session!');
            else {
                $shift_order_number = (int)$work_shift_detail->shift_order_number - 1;
                // \Log::info($shift_order_number);
                $message = null;
                if ($shift_order_number >= 1) {
                    foreach ($work_shifts as $work_shift) {
                        if ($shift_order_number == $work_shift->shift_order_number) {
                            $session = self::getTranslateSession($work_shift->session);
                            $check_action = self::getActionBySession($work_shift->session, $work_shift->action, $str_where, $strsearch_date);
                            if (!$check_action) {
                                $message = "$work_shift->action $session not yet scan!";
                                break;
                            }
                        }
                    }
                }
                if ($message) return DV::error($message);
            }
        } else
            return DV::error('action incorrect!');
        $employee_name = $employee->name;
        $employee_code = $employee->code;
        $file_name = $employee->photo_file_name;
        $defaultPhoto = base_url('assets/images/default/') . 'default-staff.png';
        $image = XPublicStorage::getUrl(['subs_id' => $subs_id, 'dir' => 'employees'], 'image') . $file_name;

        $image_url = validateUrl($image, $defaultPhoto);
        //In case => need to alert to Finance Officer about overdue Scan, Premature scan
        $scan_status = null;

        // $check_in_out = DB::table('emp_attendances as att')->where('att.employee_id',$employee_id)->whereDate('att.session_date', '=', $current_date)->selectRaw('att.id,att.is_finished,id,session_date,att.pickup_status, att.pickup_id')->first();//->whereDate('session_date', '=', $current_date)
        // return $check_in_out;

        $status =  null; // status % Present, Absent,Permission %

        $in_diff_time = 0;
        $out_diff_time = 0;
        $remarks = "";
        $id = null;
        $today = date('Y-m-d');
        $day_name = date('D', strtotime($current_date));

        if ($current_date > $today) {
            return DV::error('It seems you are trying to scan ahead of time');
        }
        $work_shift_id = DB::table('employees')->where('id', $employee_id)->value('work_shift_id');

        $nowTime = getNowTime();
        $arr_attendance = [
            "subs_id" => $bin_subs_id,
            "attendance_date" => $current_date,
            "emp_id" => $employee_id,
            "scan_action" => $work_shift_detail->action,
            "created_at" => $nowTime,
            "scan_time" => $present_time,
            "remarks" => $remarks,
            // "is_finished" => $is_finished,
            'session' => $work_shift_detail->session,
            'work_shift_id' => $work_shift_id
        ];
        // $update = [];
        //$str_msg = $in_remarks;
        // if($id){
        //     $update = [
        //         'subs_id'=>$bin_subs_id,
        //         "is_finished" => $is_finished,
        //         "checkout_time" =>$present_time,
        //         'pickup_status'=> $pickup_id? 'success':null,
        //         'pickup_id'=>$pickup_id,
        //         "out_remarks" => $out_remarks,
        //         "checkout_status_id" => $status->status_id,
        //         "out_diff_time" => $out_diff_time,
        //         "updated_at" => $nowTime,
        //     ];
        //     DB::table('employee_attendances')->where('id',$id)->update($update);
        //     $success +=1;
        //     //$str_msg =$employee_name.' now checked out!';
        // }else{
        DB::table('emp_attendances')->insert($arr_attendance);

        //     $success +=1;
        // }


        $employee = (object)['employee_id' => $employee_id, 'id' => $employee_id, 'name' => $employee_name, 'code' => $employee_code];
        $d = (object)['subs_id' => $subs_id, 'branch_id' => $branch_id, 'sender_id' => $employee_id, 'scan_status' => $scan_status, 'check_time' => date('H:i'), 'diff_time' => $scan_status == 'out' ? $out_diff_time : $in_diff_time, 'employee' => $employee, 'persist' => 0];
        // Notifier::notify_admin('attendance_scanned', $d);

        $res = (object)[
            'scan_status' => $work_shift_detail->action,
            'employee_id' => $employee_id,
            'employee_name' => $employee_name,
            'image_url' => $image_url,
            'employee_code' => $employee_code,
            'remarks' => $scan_status === 'out' ? 'N/A' : $remarks
        ];
        return DV::depends(1, $res);
    }

    function getLastEmployeesScan($arr = [], $ss = null)
    {
        $d = (object)$arr;
        $ss = $ss ?? $this->userInfo;
        $subs_id = $ss->subs_id;
        $per_page = $d->per_page ?? 0;

        $query = DB::table('employees as emp')
            ->join('emp_attendances as at', 'at.emp_id', '=', 'emp.id')
            ->selectRaw('emp.id,emp.name,emp.code,emp.sex,at.scan_time,at.scan_action,at.session');
        $rows = $query->orderBy('at.updated_at', 'DESC')->take($per_page)->get();
        // foreach ($rows as $row) {
        //     $row->session = GeneralSettings::getSession($row->session_id)->name;
        //     $url = XPublicStorage::getUrl(['subs_id'=>$ss->subs_id,'dir'=>'student'],'image').$row->file_name;
        //     $row->image_url = validateUrl($url,Student::getDefaulPhoto($ss));

        //     $row->date_of_birth = date('d M Y', strtotime($row->date_of_birth));
        //     $row->session_date = date('d M Y', strtotime($row->session_date));
        //     $row->level = GeneralSettings::getLevel($row->level_id)->name;
        //     $row->in_remarks = formatMinsTime($row->in_diff_time);
        //     $row->out_remarks = formatMinsTime($row->out_diff_time);

        //     $row->parent_phone = DB::table('student_guardians as sg')->where('sg.student_id',$row->student_id)
        //                             ->join('guardians as g','sg.guardian_id','=','g.id')
        //                             ->selectRaw('g.phone_number')
        //                             ->get();
        //     $row->family_id = DB::table('student_guardians as sg')->where('sg.student_id',$row->student_id)->selectRaw('sg.family_code as family_id')->distinct()->first()->family_id;
        //     unset($row->file_name);
        // }
        return DV::depends(1, $rows);
    }

    // static function getWorkShift($scan_date)
    // {
    //     $scan_date = convertDate($scan_date);
    //     $str_dates =  "'$scan_date' " . ' BETWEEN ' . DBX::convertToDate('t.start_date') . ' AND ' . DBX::convertToDate('t.end_date');
    //     $col_start_date = DBX::formatDate('t.start_date', 'start_date');
    //     $col_end_date = DBX::formatDate('t.end_date', 'end_date');
    //     return DB::table('terms as t')->whereRaw($str_dates)->selectRaw("t.id,t.name,$col_start_date,$col_end_date, t.status_id")->first();
    // }

    // static function getTranslateSession($key_session)
    // {
    //     if (!$key_session) return null;
    //     $arr_session = [
    //         'm' => 'Morning',
    //         'a' => 'Afternoon',
    //         'e' => 'Evening',
    //         'n' => 'Night'
    //     ];
    //     return $arr_session[$key_session];
    // }

    static function getActionBySession($session, $action, $str_where, $strsearch_date)
    {
        // $has_checked_in_m = DB::table('emp_attendances')->where('session', 'm')->whereRaw($str_where)->where('action_type', 'Check In')->whereRaw($strsearch_date)->value('id');
        // $has_checked_out_m = DB::table('emp_attendances')->where('session', 'm')->whereRaw($str_where)->where('action_type', 'Check Out')->whereRaw($strsearch_date)->value('id');
        // $has_checked_in_a = DB::table('emp_attendances')->where('session', 'a')->whereRaw($str_where)->where('action_type', 'Check In')->whereRaw($strsearch_date)->value('id');
        // $has_checked_out_a = DB::table('emp_attendances')->where('session', 'a')->whereRaw($str_where)->where('action_type', 'Check Out')->whereRaw($strsearch_date)->value('id');
        // $has_checked_in_e = DB::table('emp_attendances')->where('session', 'e')->whereRaw($str_where)->where('action_type', 'Check In')->whereRaw($strsearch_date)->value('id');
        // $has_checked_out_e = DB::table('emp_attendances')->where('session', 'e')->whereRaw($str_where)->where('action_type', 'Check Out')->whereRaw($strsearch_date)->value('id');
        // $result = null;
        // switch ($session) {
        //     case 'm':
        //         if(strtolower($action) == 'check in'){
        //             $result = $has_checked_in_m ;
        //         }else {
        //             $result = $has_checked_out_m;
        //         }
        //         return $result;
        //         break;
        //     case 'a':
        //         if(strtolower($action) == 'check in'){
        //             $result = $has_checked_in_a ;
        //         }else {
        //             $result = $has_checked_out_a;
        //         }
        //         return $result;
        //         break;
        //     case 'e':
        //         if(strtolower($action) == 'check in'){
        //             $result = $has_checked_in_e ;
        //         }else {
        //             $result = $has_checked_out_e;
        //         }
        //         return $result;
        //         break;
        // }
        return DB::table('emp_attendances')->where('session', $session)->whereRaw($str_where)->where('scan_action', $action)->whereRaw($strsearch_date)->value('id');
    }
}
