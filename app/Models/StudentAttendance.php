<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DateTime;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
class StudentAttendance //extends Model
{
    // use HasFactory;
    protected $ss = null,$id=null;
    protected static $statuses = [
        1 => 'P',
        2 => 'Pr',
        3 => 'A',
    ]  , $mins = 15; //**  */


    function __construct($id=null,$ss=null){
        $this->id = $id;
        $this->ss = $ss;
    }

    function saveAttendance($arr=[],$id=null,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $id = $id?$id:$this->id;
        $mins = 15;

        $v_rule = [
            'student_id' => '1|number|exists=group_members.student_id',
            'in_remarks' => '0|string|1,150',
            'out_remarks' => '0|string|1,150',
            'checkin_time' => '0|string',
            'checkout_time' => '0|string',
            'status_id' => '1|number|exists=attendance_types.id',
            'is_finished' => '0|number|default=1',
            'session_date' => '1|string',
            'remarks' => '0|string|1,150'
        ];

        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $is_finished = $inputs['is_finished'];
        if($is_finished>1 || $is_finished <0)return DV::error('is_finished status must be 0,1');
        $student_id = $inputs['student_id'];
        $getGroup = GeneralSettings::getGroupByStudent($student_id,$ss);
        $level_id = 0 ;
        if(isset($getGroup->level_id)) $level_id = $getGroup->level_id;

        $level = GeneralSettings::getLevel($level_id,$ss);
        $inputs['program_id'] = $level->program_id;
        $inputs['level_id'] = $level->id;
        $session_date = date('Y-m-d',strtotime($inputs['session_date']));
        $today = date('Y-m-d');
        $day_name = date('D',strtotime($session_date));
        $except_days = [
            'Sun','Sat'
        ];
        if( in_array($day_name,$except_days)){
            return DV::error('The day is weekend');
        }
        if($session_date>$today){
            return DV::error('The day not yet come');
        }

        $d = (object)$inputs;
        $checkout_time = isset($d->checkout_time)?$d->checkout_time:date('Y-m-d');
        $checkin_time = isset($d->checkin_time)?$d->checkin_time:date('Y-m-d');

        $inputs['session_date'] = isset($inputs['session_date'])? date('Y-m-d',strtotime($inputs['session_date'])):date('Y-m-d');
        $d = (object)$inputs;
        $group = $this->getCheckInAndOutBetweenTime($student_id,$checkin_time,$mins);
        if(!$group) return DV::error('Group not found Please Input check in and out time for this group');
        $group_in = $group->checkin;
        if($group_in){
            $group = $group_in;
        }

        $checkInStatus = $this->checkInStatus($group->start,$checkin_time);
        $checkOutStatus = $this->checkOutStatus($group->end,$checkout_time);

        // $scan_in = 'in'; // check in;
        $earliness = abs($checkInStatus->early);
        $lateness = $checkInStatus->late;
        if($earliness){
            $in_remarks = "Check in ".formatMinsTime($earliness)." earlier";
            $in_diff_time= $earliness;
        }else{
            $in_remarks = "Check in ".formatMinsTime($lateness)." late";
            $in_diff_time = $lateness;
        }

        // $scan_out = 'out'; // check out;
        $earliness = abs($checkOutStatus->early);
        $lateness = $checkOutStatus->late;
        if($earliness){
            $out_remarks = "Check out ".formatMinsTime($earliness)." earlier";
            $out_diff_time = $earliness;
        }else{
            $out_remarks = "Check out ".formatMinsTime($lateness)." late";
            $out_diff_time = $lateness;
        }
        $is_finished = 1;

        $status_id = isset($inputs['status_id']) ? $inputs['status_id']:$group_in->status_id;

        $arr_attendance = [
            "session_date" => $session_date,
            "student_id" => $student_id,
            "level_id" => $level->id,
            "term_id" => $group->term_id,
            "group_id" => $group->id,
            "program_id" => $level->program_id,
            "status_id" => $status_id,
            "in_diff_time" => $in_diff_time,
            "out_diff_time" => $out_diff_time,
            "checkin_time" => $checkin_time,
            "checkout_time" => $checkout_time,
            "in_remarks" => $in_remarks,
            "out_remarks" => $out_remarks,
            "is_finished" => $is_finished,
            'remarks' => $inputs['remarks']
        ];

        $newID = saveData($ss,'student_attendances',['id' => $id],$arr_attendance,[],1,1);

        return DV::depends($newID,['group_out' => $group]);
    }

    function getCheckInAndOutBetweenTime($student_id,$checkin_time,$mins){

        $group_in = DB::table('student_groups as sg')
        ->join('group_members as gm','sg.id','=','gm.group_id')->where('gm.student_id',$student_id)
        ->whereBetween(DB::raw('TIME(checkin_time)'), [
            date('H:i', strtotime("$checkin_time -$mins minutes")),
            date('H:i', strtotime("$checkin_time +$mins minutes")),
        ])
        ->orderByRaw("ABS(TIME_TO_SEC(TIME(checkin_time)) - TIME_TO_SEC(?))", [$checkin_time])
        ->selectRaw('sg.id,sg.checkin_time,sg.checkin_time as start,sg.checkout_time,sg.checkout_time as end,sg.term_id')
        ->first();
        if($group_in) {
            $group_in->status_id = 1;
            return (object)[
                'checkin' => $group_in,
                // 'checkout' => $group_out
            ];
        }


        // $group_out = DB::table('student_groups as sg')
        // ->join('group_members as gm','sg.id','=','gm.group_id')->where('gm.student_id',$student_id)
        // ->whereBetween(DB::raw('TIME(checkout_time)'), [
        //     date('H:i', strtotime("$checkout_time -$mins minutes")),
        //     date('H:i', strtotime("$checkout_time +$mins minutes")),
        // ])->orderByRaw("ABS(TIME_TO_SEC(TIME(checkout_time)) - TIME_TO_SEC(?))", [$checkout_time])
        // ->selectRaw('sg.id,sg.checkin_time,sg.checkout_time,sg.term_id')
        // ->first();




        return null;
    }


    function scanAttendance($arr=[],$ss=null){
        $ss = $ss?$ss:$this->ss;
        $mins = 15; // for find class start and end time which > between < mins
        $v_rule = [
            'student_id' => '1|number|exists=students.id',
            'remarks' => '0|string|1,150'
        ];

        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        // $enrollment_id = $inputs['enrollment_id'];
        $student_id = $inputs['student_id'];
        $inputs['present'] = isset($arr['present'])?$arr['present']:date('Y-m-d');
        $present = convertDate($inputs['present']);
        $present_time = isset($arr['present_time'])?$arr['present_time']: date('H:i');
        $group = null;


        $group_in = DB::table('student_groups as sg')
        ->join('group_members as gm','sg.id','=','gm.group_id')->where('gm.student_id',$student_id)
        ->whereBetween(DB::raw('TIME(checkin_time)'), [
            date('H:i', strtotime("$present_time -$mins minutes")),
            date('H:i', strtotime("$present_time +$mins minutes")),
        ])
        ->orderByRaw("ABS(TIME_TO_SEC(TIME(checkin_time)) - TIME_TO_SEC(?))", [$present_time])
        ->selectRaw('sg.id,sg.checkin_time,sg.checkout_time,sg.term_id')
        ->first();

        $group_out = DB::table('student_groups as sg')
        ->join('group_members as gm','sg.id','=','gm.group_id')->where('gm.student_id',$student_id)
        ->whereBetween(DB::raw('TIME(checkout_time)'), [
            date('H:i', strtotime("$present_time -$mins minutes")),
            date('H:i', strtotime("$present_time +$mins minutes")),
        ])->orderByRaw("ABS(TIME_TO_SEC(TIME(checkout_time)) - TIME_TO_SEC(?))", [$present_time])
        ->selectRaw('sg.id,sg.checkin_time,sg.checkout_time,sg.term_id')
        ->first();

        if($group_in){
            $group = $group_in;
        }else{
            $group = $group_out;
        }

        if(!$group)return DV::error('Student does not exist in group');
        $enr_info = DB::table('enrollments as e')->where('e.student_id',$student_id)->where('e.term_id',$group->term_id)->where('e.status_id','>=',3)->selectRaw('e.id,e.tuition_end_date,e.student_id,e.level_id,e.session_id,e.start_date')->first();

        $scan_status = null;
        if(!$enr_info){
            return  DV::error('Student might not enroll or exist in group yet');
        }
        if($enr_info->tuition_end_date < $present){
            return DV::error('Student enrollment is not available or expired');
        }
        $level = GeneralSettings::getLevel($enr_info->level_id,$ss);

        $current_date = isset($arr['current_date'])?date('Y-m-d',strtotime($arr['current_date'])):DB::raw('CURDATE()');
        $check_in_out = DB::table('student_attendances')->where('student_id',$student_id)->whereDate('session_date', '=', $current_date)->selectRaw('is_finished,id')->first();
        $check_in = isset($arr['check_in'])?$arr['check_in']:$group->checkin_time;
        $check_out = isset($arr['check_in'])?$arr['check_in']:$group->checkout_time;
        $status =  null; // status % Present, Absent,Permission %
        $in_diff_time = 0;
        $out_diff_time = 0;
        $in_remarks = "";
        $out_remarks = "";
        $id = null;
        $is_finished = $check_in_out?$check_in_out->is_finished:null;
        if($check_in_out){
            $id = $check_in_out->id;
        }

        if($is_finished === null || $is_finished <0){
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

        }else if($is_finished == 0 ){
            $scan_status = 'out'; // check in;
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
            return DV::error('Already check in and out');
        }

        $arr_attenance = [
            "session_date" => $current_date,
            "student_id" => $student_id,
            "level_id" => $level->id,
            "term_id" => $group->term_id,
            "group_id" => $group->id,
            "program_id" => $level->program_id,
            "status_id" => $status->status_id,
            "created_at" => getNowTime(),
            "in_diff_time" => $in_diff_time,
            "checkin_time" => $present_time,
            "in_remarks" => $in_remarks,
            "is_finished" => $is_finished,
            'enrollment_id' => $enr_info->id
        ];
        $update = [];

        if($id){
            $update = [
                "is_finished" => $is_finished,
                "checkout_time" => $present_time,
                "out_remarks" => $out_remarks,
                "out_diff_time" => $out_diff_time,
                "updated_at" => getNowTime(),
            ];
            DB::table('student_attendances')->where('id',$id)->update($update);
        }else{
            DB::table('student_attendances')->insert($arr_attenance);
        }


        $test = [
            'session_date' => getNowTime(),
            'diff_time' => $status,
            'status_' => $group->checkin_time,
            'count' => $check_in_out,
            "scan_status" => $scan_status,
            "early" => $status->early,
            "late" => $status->late,
            "id" => $id,
            "update"=>$update,
            "is_finished" => $is_finished,
            "group" => $group,
        ];

        return $test;

    }

    function checkOutStatus($class_end,$present_time){
        $diff_time = diff_time($class_end,$present_time);
        $status_id = 0;
        $late = 0;
        $early = 0;
        if($diff_time < 1){
            $early = $diff_time;
        }
        $late = $diff_time;

        return (object)['status_id'=>$status_id,'late'=>$late,'early'=>$early];
    }

    function checkInStatus($class_start,$present_time){
        $diff_time = diff_time($class_start,$present_time);
        $status_id = 0;
        $late = 0;
        $early = 0;
        if($diff_time < 1){
            $early = $diff_time;
        }
        $status_id = 1;// Present;
        $late = $diff_time;
        return (object)['status_id'=>$status_id,'late'=>$late,'early'=>$early];
    }

    function attendanceList($filter=[],$ss=null){
        $branch_id = $ss->branch_id;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            // $str_search ="(i.code ='$search_value' OR i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
        }

        $selectCols = 's.id as student_id,s.sex,s.name,s.name_kh,s.code,s.id,s.date_of_birth as dob';
        $query = DB::table('students as s')
                ->whereRaw($str_moreWhere)->whereRaw($str_search)
                ->selectRaw($selectCols)
                ->orderBy('id','desc');
        $count_query = clone $query;
        $count = $count_query->count('id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach($rows as $row) {
            $p_info = DB::table('student_guardians')->where('student_id',$row->id)->first();
            if($p_info){
                $p_info = $p_info->family_code;
            }
            $row->age = getAge($row->dob);
            $row->family_id = $p_info;
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function attendanceDateDetails($arr,$ss=null){
        $ss = $ss ? $ss:$this->ss;
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $id = isset($d->id)?$d->id:null;
        $group_id = isset($d->group_id)?$d->group_id:null;
        $date = isset($arr['date'])?$arr['date']:date('Y-m-d');
        $q = DB::table('student_attendances as sa');
                if($id){
                    $q->where('sa.id',$id);
                }
                // $q->where('sa.student_id',$student_id);

                // ->where('sa.session_date',$date)
        $row = $q->selectRaw("sa.id,sa.out_diff_time,sa.session_date,sa.student_id,sa.status_id,sa.in_diff_time,sa.is_finished,sa.in_remarks,sa.out_remarks,sa.checkin_time,sa.checkout_time,sa.level_id")->first();
        $group = DB::table('student_groups')->where('level_id',$group_id)->first();
        $date = date('Y-m-d',strtotime($date));
        $today = date('Y-m-d');
        $day_name = date('D',strtotime($date));
        $except_days = [
            'Sun','Sat'
        ];
        if( in_array($day_name,$except_days)){
            return (object)[
                'student_id' => '',
                'status_id' => 3,
                'in_diff_time' => '',
                'is_finished' => '',
                'in_remarks' => 'Weekends',
                'out_remarks' => '',
                'checkin_time' => '',
                'checkout_time' => '',
                'out_diff_time' => '',
            ];
        }

        if($date>$today) return (object)[
                            'student_id' => '',
                            'status_id' => '',
                            'in_diff_time' => '',
                            'is_finished' => '',
                            'in_remarks' => '',
                            'out_remarks' => '',
                            'checkin_time' => '',
                            'checkout_time' => '',
                            'out_diff_time' => '',
                        ];
        if(!$row || !isset($id)){
            return (object)[
                'student_id' => '',
                'status_id' => 3,
                'in_diff_time' => '',
                'is_finished' => '',
                'in_remarks' => '',
                'out_remarks' => '',
                'checkin_time' => $group->checkin_time,
                'checkout_time' => $group->checkout_time,
                'out_diff_time' => '',

            ];
        }
        $row->status = $this->getStatusText($row->status_id);
        return $row;
    }

    function getStatusText($status_id){
        return isset(self::$statuses[$status_id])?self::$statuses[$status_id]:null;
    }

    function getAttendanceInfo($rows,$day,$month,$year,$student_id){
        $c = null;
        $i=0;
        $date = date('Y-m-d',strtotime($year.'-'.$month.'-'.$day));
        $today = date('Y-m-d');
        $day_name = date('D',strtotime($date));
        $except_days = [
            'Sun','Sat'
        ];
        if(in_array($day_name,$except_days)) return (object)[
            'day' => (int)$day,
            'attendance_id' => '',
            'status' => $day_name,
            'check_in_remarks' => '',
            'check_out_remarks' => '',
            'status_id' => 4,
            "session_date" => $date,
            'check_in_time' => '',
            'check_out_time' =>'',
            'reason' => '',
            'group_id' => '',
            "class" => ''//

        ];

        if($date>$today) return (object)[
                            'day' => (int)$day,
                            'attendance_id' => '',
                            'status' => '?',
                            'check_in_remarks' => '',
                            'check_out_remarks' => '',
                            'status_id' => 6,
                            "session_date" => $date,
                            'check_in_time' => '',
                            'check_out_time' => '',
                            'group_id' => '',//$rows[0]->group_id,
                            "class" => '',//GeneralSettings::getLevel($rows[0]->elevl)->name
                        ];
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            $level = GeneralSettings::getLevel($c->level_id);
            if($day == $c->day){
                return (object)[
                    'day' =>(int)$c->day,
                    'attendance_id' => $c->attendance_id,
                    'status' => $this->getStatusText($c->status_id),
                    'check_in_remarks' => $c->in_remarks,
                    'check_out_remarks' => $c->out_remarks,
                    'status_id' => $c->status_id,
                    "session_date" => $date,
                    'check_in_time' => $c->checkin_time,
                    'check_out_time' => $c->checkout_time,
                    'reason' => $c->remarks,
                    'student_id' => $student_id,
                    'group_id' => $c->group_id,
                    "class" => $level?$level->name:null//
                ];
            }

            $i++;
        }while($c);

        return (object)[
            'day' => (int)$day,
            'attendance_id' => '',
            'check_in_remarks' => 'not scan',
            'check_out_remarks' => '',
            'status' => 'A',
            'status_id' => 3,
            "session_date" => $date,
            'check_in_time' => '',
            'check_out_time' => '',
            'group_id' => '',//$rows[0]->group_id,
            "class" => '',//GeneralSettings::getLevel($rows[0]->level_id)->name
        ];
    }

    function statusCount($student_id,$month,$year){
        $rows = $this->getAttendanceDetailsByMonth($student_id,$month,$year);
        $statusA = [];
        $statusP = [];
        $statusPr = [];
        foreach($rows as $row){
            if($row->status == 'A'){
               $statusA[] = $row->status;
            }
            if($row->status == 'P'){
                $statusP[] = $row->status;
             }
             if($row->status == 'Pr'){
                $statusPr[] = $row->status;
             }
        }
        $res = (object)[
            'absent' => count($statusA),
            'present' => count($statusP),
            'permission' => count($statusPr),
        ];

        return $res;
    }

    function getAttendanceDetails($arr){
        $d = (object)$arr;
        $student_id = isset($d->student_id)?$d->student_id:null;
        $limit = isset($d->limit)?$d->limit:6;
        $is_shortMonthName = isset($d->short_month_name)?$d->short_month_name:true;
        $aToz = isset($d->a_to_z)?$d->a_to_z:null;
        if($aToz){
            $aToz ='DESC';
        }else $aToz = 'ASC';

        $session_date = isset($d->session_date)?date('Y-m-d',strtotime($d->session_date)):null;
        $startDate =  isset($d->start_date)?date('Y-m-d',strtotime($d->start_date)):null;
        $endDate =  isset($d->end_date)?date('Y-m-d',strtotime($d->end_date)):null;
        if(!$student_id){
            return DV::error('Student ID is required');
        }
        $exist = DB::table('student_attendances')->where('student_id',$student_id)->exists();
        if(!$exist){
            return DV::error('Student not exists in attendance list');
        }

        $sessionDateCondition = "1 = 1";
        if ($session_date) {
            $sessionDateCondition = "session_date = '$session_date'";
        }
        if($startDate && $endDate) {
            $sessionDateCondition = "session_date BETWEEN '$startDate' AND '$endDate'";
        }
        $rows = DB::select(DB::raw("SELECT DISTINCT MONTH(session_date) AS month, YEAR(session_date) AS year,group_id FROM student_attendances WHERE $sessionDateCondition ORDER BY year, month $aToz LIMIT $limit"));
        foreach($rows as $row){
            $row->date = getMonthName($row->month,$is_shortMonthName).'-'.$row->year;
            $row->status = $this->statusCount($student_id,$row->month,$row->year);
            $row->attendance_list = $this->getAttendanceDetailsByMonth($student_id,$row->month,$row->year);
        }
        return $rows;
    }

    function getAttendanceDetailsByMonth($student_id,$month,$year,$from_day=null,$to_day=null){
        $days = $to_day?$to_day:days_in_month($month,$year);
        $i=$from_day?$from_day-1:0;
        $attendance_list =[];
        $rows = DB::table('student_attendances')->whereMonth('session_date',$month)->whereYear('session_date',$year)->where('student_id',$student_id)->selectRaw('remarks,id as attendance_id,student_id,group_id,session_date,DAY(session_date) as day,status_id,in_remarks,out_remarks,checkin_time,checkout_time')->get();
        foreach($rows as $row){
            $row->level_id = DB::table('student_groups')->where('id',$row->group_id)->first()->level_id;
        }
        do{
            $i++;
            $x = $this->getAttendanceInfo($rows,$i,$month,$year,$student_id);
            $attendance_list[] = $x;
        }while ($i<$days);

        return $attendance_list;
    }

    function studentListInfoByGroup($d,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $branch_id = $ss->branch_id;
        $id = isset($d->group_id) ? $d->group_id : $d->id;
        $rows = DB::table('group_members as gm')->where('gm.group_id',$id)
            ->join('students as s','s.id','=','gm.student_id')
            ->selectRaw('gm.id,s.id as student_id,s.name as student_name,s.code')
            ->where('gm.branch_id',$branch_id)->get();
        return $rows;
    }

    function optionsGroup($ss=null,$d=null){
        $ss = $ss?$ss:$this->ss;
        $level_id = $d->level_id;
        $campus_id = $d->campus_id;
        $rows = GeneralSettings::optionsGroup($ss,$level_id,$campus_id);
        return $rows;
    }

    function optionsAttendanceTypes(){
        return GeneralSettings::optionsAttendanceTypes();
    }

    function attendanceListReport($arr=[],$ss=null){
        $ss = $ss?$ss:$this->ss;
        $d = (object)$arr;
        $group_id =isset($d->group_id)?$d->group_id:null;
        if(!$group_id) return DV::error('Group ID is required');
        $session_date = isset($d->session_date)?date('Y-m-d',strtotime($d->session_date)):null;
        $startDate =  isset($d->start_date)?date('Y-m-d',strtotime($d->start_date)):null;
        $endDate =  isset($d->end_date)?date('Y-m-d',strtotime($d->end_date)):null;
        $limit = isset($d->limit)?$d->limit:6;
        $is_shortMonthName = isset($d->short_month_name)?$d->short_month_name:false;
        $aToz = isset($d->a_to_z)?$d->a_to_z:null;
        $row = DB::table('student_groups as sg')->where('sg.id',$group_id)
            ->selectRaw('sg.id as group_id,sg.campus_id,sg.level_id,sg.session_id')->first();
        $arr_report = [
            "session_date" => $session_date,
            "a_to_z" => $aToz,
            "limit" => $limit,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'short_month_name' => $is_shortMonthName,
        ];
        $row->program = GeneralSettings::getProgramByLevel($row->level_id,$ss)->name;
        $row->campus = GeneralSettings::getCampus($row->campus_id)->name;
        $row->level = GeneralSettings::getLevel($row->level_id,$ss)->name;
        $row->session = GeneralSettings::getSession($row->session_id)->name;
        $row-> count_students = $this->countGroupMembers($group_id,$ss);
        $row->session_date = $this->studentGroupAttendanceReport($group_id,$arr_report,$ss);

        return $row;

    }

    function getAttendanceRows($start_date=null,$end_date=null,$group_id=null,$student_id=null){
        $start_date = convertDate($start_date);
        $day = date('d',strtotime($start_date));
        $end_date = convertDate($end_date);

        $strSearchDate ='1=1';
        if($start_date && $end_date){
            $strSearchDate = "DATE(session_date) BETWEEN '$start_date' AND '$end_date'";
        }
        $rows = DB::table('student_attendances')->whereRaw($strSearchDate)->where('group_id',$group_id)->where('student_id',$student_id)->selectRaw('level_id,group_id,remarks,checkin_time,checkout_time,in_remarks,out_remarks,status_id,student_id,id as attendance_id,DAY(session_date) as day,MONTH (session_date) as `month`, YEAR(session_date) as `year`')->get();

        if(!isset($rows[0])) return [
                (object)[
                    'day' => (int)$day,
                    'attendance_id' => 'sdfsdf',
                    'status' => 'A',
                    'in_remarks' => 'Not Scan',
                    'out_remarks' => '',
                    'status_id' => 3,
                    "session_date" => '',
                    'checkin_time' => '',
                    'checkout_time' => '',
                    'group_id' => '',
                    "class" => '',
                    'level_id' => '',
                    'student_id' => '',
                    'remarks' => '',
                    'name' => '',

                ]
            ];
        return $rows;
    }

    function studentGroupAttendanceReport($group_id,$arr=[],$ss=null){
        $ss = $ss?$ss:$this->ss;
        $d = (object)$arr;
        $limit = isset($d->limit)?$d->limit:6;
        $is_shortMonthName = isset($d->short_month_name)?$d->short_month_name:true;
        $aToz = isset($d->a_to_z)?$d->a_to_z:null;
        if($aToz){
            $aToz ='DESC';
        }else $aToz = 'ASC';



        $session_date = isset($d->session_date)?date('Y-m-',strtotime($d->session_date)):date('Y-m-d');
        $startDate =  isset($d->start_date)?date("Y-m-d",strtotime($d->start_date)):null;
        $endDate =  isset($d->end_date)?date("Y-m-d",strtotime($d->end_date)):null;

        // $existSessionDate = DB::table('student_attendances')->where('session_date',$startDate)->exists();

        $sessionDateCondition = "1=1";
        if ($session_date) {
            $sessionDateCondition = "DATE(session_date) = '$session_date'";
        }
        if($startDate && $endDate) {
            $sessionDateCondition = "DATE(session_date) BETWEEN '$startDate' AND '$endDate'";
        }
        // $att_items = $this->getAttendanceRows($startDate,$endDate,$group_id);
        $students = DB::table('group_members as gm')
                ->join('students as s','s.id','=','gm.student_id')
                ->join('enrollments as e','e.id','=','gm.enrollment_id')
                ->where('gm.group_id',$group_id)
                ->selectRaw('s.id as student_id,s.name,s.date_of_birth,s.sex,e.start_date')
                ->get();

        $start_timestamp = strtotime($startDate);
        $end_timestamp = strtotime($endDate);

        $tmp_months =[];
        $months = [];
        $current_timestamp = $start_timestamp;
        while ($current_timestamp <= $end_timestamp) {
            $year = date("Y", $current_timestamp);
            $month = date("m", $current_timestamp);
            $unique_key = $year . '-' . $month;

            if (!in_array($unique_key, $tmp_months)) {
                $tmp_months[] = $unique_key;
                $months[] = (object)[
                    'month' => $month,
                    'year' => $year
                ];
            }

            $current_timestamp = strtotime("+1 month", $current_timestamp);

        }

        $attendanceData = [];

        foreach ($months as $date) {
            $year = $date->year;
            $month = $date->month;

            $current_date = new DateTime("$year-$month-01");
            $end_date_obj = new DateTime("$year-$month-01");
            $end_date_obj->modify('last day of this month');

            $days_between = [];

            // based on month and year of the start_date field
            $start_day = ($year == date('Y', $start_timestamp) && $month == date('m', $start_timestamp))
                ? max(date('d', $start_timestamp), 1)
                : 1;

            // based on month and year of the end_date field
            $end_day = ($year == date('Y', $end_timestamp) && $month == date('m', $end_timestamp))
                ? min(date('d', $end_timestamp), (int)$end_date_obj->format('d'))
                : (int)$end_date_obj->format('d');

            for ($day = $start_day; $day <= $end_day; $day++) {
                $days_between[] = ['day' => $day]; //str_pad($day, 2, '0', STR_PAD_LEFT)
            }

            $monthData = [
                'date' => $year . '-' . getMonthName($month, $is_shortMonthName),
                'days' => $days_between,
                'students' => []
            ];

            $daily_attendance = [];
            $guardian_phoneNum = [];

            foreach ($students as $st) {
                $current_date = new DateTime("$year-$month-01");
                $end_date_obj = new DateTime("$year-$month-01");
                $end_date_obj->modify('last day of this month');
                $att_items = $this->getAttendanceRows($startDate,$endDate,$group_id,$st->student_id);

                $att_info = [];
                while ($current_date <= $end_date_obj) {
                    if ($current_date >= new DateTime($startDate) && $current_date <= new DateTime($endDate)) {
                        $att_info[] = $this->getAttendanceInfo($att_items,$current_date->format('d'),$month,$year,$st->student_id);
                    }
                    $current_date->modify('+1 day');
                }

                $guardian_phoneNum[] = DB::table('student_guardians as sg')->where('sg.student_id',$st->student_id)
                                    ->join('guardians as g','sg.guardian_id','=','g.id')
                                    ->selectRaw('g.phone_number')
                                    ->get();

                $stData = [
                    'student_id' => $st->student_id,
                    'name' => $st->name,
                    'sex' => $st->sex,
                    'date_of_birth' => $st->date_of_birth,
                    'start_date' => $st->start_date,
                    'list' => $att_info,
                ];

                $count_col_absent = 0;
                $count_col_present = 0;
                $count_col_permission = 0;
                $count_rowsA=[];
                $count_rowsP=[];
                $count_rowsPr=[];
                foreach($att_info as $att){

                    if($att->status == 'A' || $att->status_id == 3){

                        $count_rowsA[] = $count_col_absent ++;
                    }
                    if($att->status == 'P' || $att->status_id == 1){

                        $count_rowsP[] = $count_col_present ++;
                    }
                    if($att->status == 'Pr' || $att->status_id == 2){

                        $count_rowsPr[] = $count_col_permission ++;
                    }

                    $daily_attendance[] = self::countDailyAttendance($att_info, $att->day);

                }

                $processedData = [];

                foreach ($daily_attendance as $item) {
                    $day = $item->day;

                    if (!isset($processedData[$day])) {
                        $processedData[$day] = [
                            'day' => $day,
                            'absent' => 0,
                            'present' => 0,
                            'permission' => 0
                        ];
                    }

                    if ($item->absent == 1) {
                        $processedData[$day]['absent']++;
                    }

                    if ($item->present == 1) {
                        $processedData[$day]['present']++;
                    }

                    if ($item->permission == 1) {
                        $processedData[$day]['permission']++;
                    }
                }
                $result = array_values($processedData);



                // $monthData['monthly_attendance'][]= [
                //     'absent' =>$count_col_absent,
                //     'permission' => $count_col_permission,
                //     'present' => $count_col_present,
                // ];
                $monthData['monthly_attendance'][]= [
                    'absent' =>count($count_rowsA),
                    'permission' => count($count_rowsPr),
                    'present' =>count($count_rowsP),
                ];
                $monthData['daily_attendance'] = $result;
                $monthData['phone_number'] = $guardian_phoneNum;
                $monthData['students'][] = $stData;

            }

            $attendanceData[] = $monthData;

        }

        return $attendanceData;

    }

    function countDailyAttendance($arr, $day) {
        $filteredData = array_filter($arr, function ($att) use ($day) {
            return $att->day == $day;
        });

        $countA = 0;
        $countP = 0;
        $countPr = 0;

        foreach ($filteredData as $att) {
            if ($att->status == 'A' || $att->status_id == 3) {
                $countA++;
            }
            if ($att->status == 'P' || $att->status_id == 1) {
                $countP++;
            }
            if ($att->status == 'Pr' || $att->status_id == 2) {
                $countPr++;
            }
        }

        return (object)[
            'day' => $day,
            'absent' => $countA,
            'present' => $countP,
            'permission' => $countPr
        ];
    }

    function countGroupMembers($group_id,$ss){
        $rows = DB::table('group_members as gm')
            ->join('students as s','s.id','=','gm.student_id')
            ->where('gm.group_id',$group_id)
            ->selectRaw('s.sex')->get();
        $female = [];
        $all = [];
        foreach($rows as $row){
            if($row->sex == 'F'){
                $female[] = $row->sex;
            }
            $all[] = $row->sex;
        }
        return (object)[
            'female' => count($female),
            'all' => count($all),
            'male' => count($all) - count($female)
        ];
    }
}
