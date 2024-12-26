<?php

namespace App\Models\Bhr;

use App\Models\DV;
use App\Models\Bhr\Employee;
use App\Models\DBX;
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
        $col_attendance_date = DBX::formatDate('a.attendance_date', 'attendance_date');
        $selectCols = 'emp.id as emp_id, emp.name, emp.name_kh, emp.sex, emp.code, emp.date_of_birth as dob, ws.name as work_shift, '. $col_attendance_date.', a.scan_time, a.scan_action, p.title as position';

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
        $query = $d->query;
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

    function scanAttendance($arr=[],$ss=null){
        $ss = $ss ?? $this->ss;
        $branch_id =1;
        //$branch_id = $ss->branch_id ?? $branch_id =1;

        $subs_id = isset($ss->subs_id)? $ss->subs_id : getCurrentSubsId(true);
        $mins = $this->mins; // for find class start and end time which > between < mins
        $force_checkin = $arr['force_checkin'] ?? 0;
        $force_checkout = $arr['force_checkout'] ?? 0;
        $v_rule = [
            'employee_id' => '0|number',
            'employee_code' => '0|string|exists.employees.code',
            'employee_card_number' => '0|string|exists.employees.card_number',
            'remarks' => '0|string|1,150'
        ];

        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        // $enrollment_id = $inputs['enrollment_id'];
        $employee_id =  $inputs['employee_id'] ?? null;
        $employee_code = $inputs['employee_code'] ??  null;
        $employee_card_number = $inputs['employee_card_number'] ??  null;
        $current_date = convertDate($arr['current_date'] ?? date('Y-m-d'));
        $present_time =  $arr['present_time'] ??  date('H:i');
        // $present_time = isset($arr['present_time'])?$arr['present_time']: date('H:i');
        // $group = null;
        $success = 0;

        // Check if a record with the specified date exists
        $employee =null;
        $col_subs_id = DBX::getHEX('subs_id','subs_id');
        if($employee_code){
            $employee= DB::table('employees')->where('code',$employee_code)->selectRaw('id,name,code,'.$col_subs_id)->first();
        }else if($employee_card_number){
            $employee = DB::table('employees')->where('card_number',$employee_card_number)->selectRaw('id,name,code,'.$col_subs_id)->first();
        }else{
            $employee = DB::table('employees')->where('id',$employee_id)->selectRaw('id,name,code,'.$col_subs_id)->first();
        }
        // \Log::info($arr);
        if(!$employee) return DV::error('Employee not found');
        $employee_id = $employee->id;
        $subs_id = $employee->subs_id ?? null;
        if (!$subs_id) {
            DV::error('One issue occured during attendance scan. We are reviewing it for you!');
            //The issue is that employees table record does not contains correct or it contains empty subs_id
        }
        $bin_subs_id = hex2bin($subs_id);
        $str_where = 'emp_id = '.$employee_id;
        $q_session_date = DBX::convertToDate('attendance_date');
        $strsearch_date = "$q_session_date = '$current_date'";
        $has_checked_in = DB::table('emp_attendances')->whereRaw($str_where)->whereRaw($strsearch_date)->selectRaw('id')->get();
        $group = null;

        $work_shift = null;// self::getWorkShift($current_date);
        if (!$work_shift) return DV::error('No work shift found based on the scan date ??::'.$current_date);
        /** If has_checked_in then process check_out action */

        $col_checkout_time = DBX::formatTimeOnly('g.checkout_time','checkout_time');
        $col_checkin_time = DBX::formatTimeOnly('g.checkin_time','checkin_time');
        if($has_checked_in){
            $query = DB::table('employees as st')
            ->join('group_members as gm','gm.employee_id','=','st.id')->join('enrollments as e','e.id','=','gm.enrollment_id')->whereRaw('ifnull(e.promoted,0)=0')->join('employee_groups as g','g.id','=','gm.group_id')->where('st.id',$employee_id)
            ->join('terms as t','t.id','=','g.term_id')
            //->whereRaw('t.status_id < 3')
            // ->whereRaw('t.status_id = 2 AND ifnull(t.is_finished,0)=0')
            ->whereRaw('IFNULL(gm.inactive,0)=0')
            ->where('e.term_id',$term->id)
            // ->whereBetween(DB::raw('TIME(g.checkout_time)'), [
            //     date('H:i', strtotime("$present_time - $mins minutes")),
            //     date('H:i', strtotime("$present_time + $mins minutes")),
            // ]);
            ->selectRaw($col_checkout_time.','.$col_checkin_time. ', ABS(TIME_TO_SEC(TIME(checkout_time)) - TIME_TO_SEC(\''.$present_time.'\'))/60 AS time_diff,t.status_id as term_status_id, t.start_date AS term_start_date,gm.enrollment_id,g.id AS group_id,g.checkin_time,g.checkout_time,g.term_id,g.name as group_name, st.`name` AS employee_name, st.code AS employee_code,st.file_name')
            ->orderByRaw('term_start_date DESC,time_diff ASC');
            // if(!$force_checkout){
            //   $query->whereBetween(DB::raw('TIME(g.checkout_time)'), [
            //     date('H:i', strtotime("$present_time - $mins minutes")),
            //     date('H:i', strtotime("$present_time + $mins minutes")),
            //   ]);
            // }
            $group = $query->first();
        }
        else {
            $group = DB::table('employees as st')
            ->join('group_members as gm','gm.employee_id','=','st.id')->join('enrollments as e','e.id','=','gm.enrollment_id')->join('employee_groups as g','g.id','=','gm.group_id')->where('st.id',$employee_id)
            ->join('terms as t','t.id','=','g.term_id')
            //->whereRaw('t.status_id < 3')
            // ->whereRaw('t.status_id = 2 AND ifnull(t.is_finished,0)=0')
            ->whereRaw('IFNULL(gm.inactive,0)=0')
            ->where('e.term_id',$term->id)
            // ->whereBetween(DB::raw('TIME(g.checkin_time)'), [
            //     date('H:i', strtotime("$present_time - $mins minutes")),
            //     date('H:i', strtotime("$present_time + $mins minutes")),
            // ])
            ->selectRaw($col_checkout_time.','.$col_checkin_time.', ABS(TIME_TO_SEC(TIME(checkin_time)) - TIME_TO_SEC(\''.$present_time.'\'))/60 AS time_diff,t.status_id as term_status_id,t.start_date AS term_start_date,gm.enrollment_id,g.id AS group_id,g.checkin_time,g.checkout_time,g.term_id,g.name as group_name, st.`name` AS employee_name, st.code AS employee_code,st.file_name')
            ->orderByRaw('term_start_date DESC,time_diff ASC')
            ->first();
        }
        
         //\Log::info(json_encode($group));  // {"checkout_time":"04:30:00","checkin_time":"07:30:00"}

        if(!$group && !$force_checkout){
            if($has_checked_in)
            {
                return DV::error("No class found at this time ($present_time). But you have checked in already!");
            } 
             else {
                $has_checked_out = DB::table('employee_attendances')->where('employee_id',$employee_id)->whereRaw($strsearch_date)->whereRaw('is_finished=1')->value('id');
                if($has_checked_out)  return DV::error('You already checked out today');
             }
            return DV::error('No group for checking in at '.$present_time);
        } else if (!$group) return DV::error('No group found in term ??::'.$term->id); 
        if($group->term_status_id ==3) return DV::error('?? is not in operation!::'. ($term->name ?? 'Term'));
        //remember employee's name for notification
        $employee_name = $group->employee_name;
        $employee_code = $group->employee_code;
        $file_name = $group->file_name;
        $employee_code = $group->employee_code;
        $defaultPhoto = PublicStorage::getUrl(['subs_id'=>$subs_id,'dir'=>'default'],'image').'default_image_employee.avif';
        $image = PublicStorage::getUrl(['subs_id'=>$subs_id,'dir'=>'employee'],'image').$file_name;
        $image_url = validateUrl($image,$defaultPhoto);
        //In case => need to alert to Finance Officer about overdue Scan, Premature scan
         
        $term_status_id = DB::table('terms')->where('id',$group->term_id)->selectRaw('status_id')->take(1)->value('status_id');
        $isActiveTerm = $term_status_id < 3? true:false;
        $isFinnishedTerm = $term_status_id == 3? true:false;

        $group_name = $group->group_name;
        if($isFinnishedTerm) return DV::error('Term is already finnished');

        // ** If term is not in operation set to in operattion when term start
        if(!$isActiveTerm){
            $today = date('Y-m-d');
            $str_term_date = 'DATE(start_date) >= \''.$today.'\' AND DATE(end_date) <= \''.$today.'\'';
            $x = DB::table('terms')->where('id',$group->term_id)->whereRaw($str_term_date)->update([
                'status_id' => 2
            ]);
            if(!$x)  return DV::error('Scan date not must be between Term start date and end date');
        }//return DV::error('Group('.$group_name.') term is not in operation');
        $enroll_info = DB::table('enrollments as e')->where('e.id',$group->enrollment_id)->selectRaw('e.id,e.status_id,e.tuition_end_date,e.employee_id,e.level_id,e.session_id,e.start_date')->first();

        $scan_status = null;
        if(!$enroll_info){
            //Group not found!
            return  DV::error('It seems that you have not been enrolled in any class yet');
        }

        if($enroll_info->status_id < 3){
            $alert_case = ['message'=>'Premature attendance attempt for employee '.$employee_code,'user_class'=>'Finance'];
            return DV::error('Tuition information needs to be verified');
        }
        else if($enroll_info->tuition_end_date < $current_date){
            $alert_case = ['message'=>'Ovedue Attendance for employee '.$employee_code, 'user_class'=>'Finance'];
            return DV::error('Tuition payment expired');
        }

        $level = GeneralSettings::getLevel($enroll_info->level_id,$ss);
        $check_in_out = DB::table('employee_attendances as att')->where('att.employee_id',$employee_id)->whereDate('att.session_date', '=', $current_date)->selectRaw('att.id,att.is_finished,id,session_date,att.pickup_status, att.pickup_id')->first();//->whereDate('session_date', '=', $current_date)
        // return $check_in_out;
        $check_in = isset($arr['check_in'])?$arr['check_in']:$group->checkin_time;
        $check_out = isset($arr['check_in'])?$arr['check_in']:$group->checkout_time;
        $status =  null; // status % Present, Absent,Permission %
        $pickup_status = $check_in_out? $check_in_out->pickup_status: null;
        $pickup_id = $check_in_out? $check_in_out->pickup_id: null; 
        $in_diff_time = 0;
        $out_diff_time = 0;
        $in_remarks = "";
        $out_remarks = "";
        $id = null;
        $today = date('Y-m-d');
        $is_finished = $check_in_out?$check_in_out->is_finished:null;
        if($check_in_out){
            $id = $check_in_out->id;
        }
        $except_days = [
            'Sun','Sat'
        ];
        $day_name = date('D',strtotime($current_date));
        if(in_array($day_name,$except_days)){
            return DV::error('Attendance is not allow to scan on weekends');
        }

        if($current_date > $today){
            return DV::error('It seems you are trying to scan ahead of time');
        }

        if($is_finished === null || $is_finished < 0 || $force_checkin == 1 ){
            $scan_status = 'in'; // check in;
            $status = $this->checkInStatus($check_in,$present_time);
            $earliness = abs($status->early);
            $lateness = $status->late;
            if($earliness){
                $in_remarks = "Check in ".formatMinsTime($earliness)." earlier";
                $in_diff_time= $earliness;
            }else{
                $in_remarks = "Check in ".formatMinsTime($lateness)." late";
                $in_diff_time = $lateness;
            }
            $is_finished = 0;

        }else if($is_finished == 0 || $force_checkout == 1 ){
            $scan_status = 'out'; // check out;
            $status = $this->checkOutStatus($check_out,$present_time);
            $earliness = abs($status->early);
            $lateness = $status->late;
            if($earliness){
                $out_remarks = "Check out ".formatMinsTime($earliness)." earlier";
                $out_diff_time = $earliness;
            }else{
                $out_remarks = "Check out ".formatMinsTime($lateness)." late";
                $out_diff_time = $lateness;
            }
            $is_finished = 1;
        }else{
            return DV::error('It seems you have checked in and checked out already');
        }

        $nowTime = getNowTime();
        $arr_attenance = [
            "subs_id"=> $bin_subs_id,
            "session_date" => $current_date,
            "employee_id" => $employee_id,
            "level_id" => $level->id,
            "term_id" => $group->term_id,
            "group_id" => $group->group_id,
            "program_id" => $level->program_id,
            "checkin_status_id" => $status->status_id,
            "created_at" => $nowTime,
            "updated_at" => $nowTime,
            "in_diff_time" => $in_diff_time,
            "checkin_time" => $present_time,
            "in_remarks" => $in_remarks,
            "is_finished" => $is_finished,
            'enrollment_id' => $enroll_info->id
        ];
        $update = [];
        //$str_msg = $in_remarks;
        if($id){
            $update = [
                'subs_id'=>$bin_subs_id, 
                "is_finished" => $is_finished,
                "checkout_time" =>$present_time,
                'pickup_status'=> $pickup_id? 'success':null,
                'pickup_id'=>$pickup_id,
                "out_remarks" => $out_remarks,
                "checkout_status_id" => $status->status_id,
                "out_diff_time" => $out_diff_time,
                "updated_at" => $nowTime,
            ];
            DB::table('employee_attendances')->where('id',$id)->update($update);
            $success +=1;
            //$str_msg =$employee_name.' now checked out!';
        }else{
            DB::table('employee_attendances')->insert($arr_attenance);
           
            $success +=1;
        }

        $pickupInProcess = 0;
        if($success > 0){
            if($scan_status ==='out' && $pickup_id){
                 $updated_at = DBX::$updated_at;
                 DB::table('employee_pickups')->where('id',$pickup_id)->update(['status'=>'success',$updated_at =>$nowTime]);
                 $pickupInProcess = self::isPickupInProcess($check_in_out->pickup_id ?? null, $current_date);
            }
           
            $parentLoginInfo = DB::table('guardians as g')->join('employee_guardians as sg','sg.guardian_id','=','g.id')->join('um_users as u','u.official_id','=','g.id')->selectRaw('u.`status`,u.id AS user_id, u.is_locked')->where('sg.employee_id',$employee_id)->first();
            if($parentLoginInfo && strtolower($parentLoginInfo->status) =='active'){

                $event = ($scan_status =='out'? 'employee_checkout' : 'employee_checkin');
                $title = ($scan_status =='out'? 'employee Checkout' : 'employee Checkin');
                $cdata = [
                    [
                        'user_class'=>'parent',
                        'user_id'=>$parentLoginInfo->user_id,
                        'pickup_in_process'=>$pickupInProcess,
                        'event'=> $event,
                        'persist'=>1,
                        'data'=>['event'=>$event,'employee_id'=>$employee->id, 'employee_name'=>$employee_name, 'employee_code'=>$employee->code,'pickup_in_process'=>$pickupInProcess],
                        'title'=>$title,
                        'message'=>'Your child '.$employee_name.' has '.($scan_status =='out'? 'checked out' : 'checked in')
                    ]
                ];
                Notifier::notify_mobile($ss->branch_id,$cdata);
            }

        }
        $employee = (object)['employee_id'=>$employee_id,'id'=>$employee_id,'name'=>$employee_name,'code'=>$employee_code];
        $d = (object)['subs_id'=>$subs_id,'branch_id' =>$branch_id,'sender_id' =>$employee_id,'scan_status'=>$scan_status,'check_time'=>date('H:i'),'diff_time'=>$scan_status=='out'? $out_diff_time: $in_diff_time,'employee'=>$employee,'persist'=>0];
        Notifier::notify_admin('attendance_scanned', $d);
        
        $res = (object)[
            'scan_status'=>$scan_status,
            'employee_id'=>$employee_id,
            'group' => $group_name,
            'pickup_in_process'=>$pickupInProcess,
            'employee_name' => $employee_name,
            'level' => $level->name,
            'image_url' => $image_url,
            'employee_code' => $employee_code,
            'remarks'=>$scan_status==='out'? $out_remarks:$in_remarks
        ];
        return DV::depends(1,$res);

    }

    static function getWorkShift($scan_date){
        $scan_date = convertDate($scan_date);
        $str_dates =  "'$scan_date' ". ' BETWEEN ' . DBX::convertToDate('t.start_date'). ' AND '. DBX::convertToDate('t.end_date');
        $col_start_date = DBX::formatDate('t.start_date','start_date');
        $col_end_date = DBX::formatDate('t.end_date','end_date');
        return DB::table('terms as t')->whereRaw($str_dates)->selectRaw("t.id,t.name,$col_start_date,$col_end_date, t.status_id")->first();
   }
}
