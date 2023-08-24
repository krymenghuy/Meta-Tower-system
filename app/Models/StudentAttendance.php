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
    ]  , $mins = 15;


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
        ];
        $update=[];

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
            $row->age = getAge($row->dob);
            $row->family_id = DB::table('student_guardians')->where('student_id',$row->id)->first()->family_code;
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function attendanceDateDetails($arr,$ss=null){
        $ss = $ss ? $ss:$this->ss;
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $id = isset($d->id)?$d->id:null;
        $date = isset($arr['date'])?$arr['date']:date('Y-m-d');
        $row = DB::table('student_attendances as sa')
                ->where('sa.id',$id)
                // ->where('sa.student_id',$student_id)
                // ->where('sa.session_date',$date)
                ->selectRaw("sa.id,sa.out_diff_time,sa.session_date,sa.student_id,sa.status_id,sa.in_diff_time,sa.is_finished,sa.in_remarks,sa.out_remarks,sa.checkin_time,sa.checkout_time")->first();
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
                'checkin_time' => '',
                'checkout_time' => '',
                'out_diff_time' => '',

            ];
        }
        $row->status = $this->getStatusText($row->status_id);
        return $row;
    }





    // function attendanceDetails($d,$ss){
    //     $id = isset($d->student_id)?$d->student_id:$d;
    //     $ss = $ss?$ss:$this->ss;
    //     $selectCols = 'sa.student_id,DATE_FORMAT(session_date, "%b-%Y") as date';

    //     $subquery = DB::table('student_attendances')
    //         ->selectRaw('MAX(session_date) as max_date')
    //         ->where('student_id', $id)
    //         ->groupBy(DB::raw('YEAR(session_date), MONTH(session_date)'));

    //     $rows = DB::table('student_attendances as sa')
    //         ->joinSub($subquery, 'sub', function ($join) {
    //             $join->on('sa.session_date', '=', 'sub.max_date');
    //         })
    //         ->where('sa.student_id', $id)
    //         ->selectRaw($selectCols)
    //         ->get();
    //     foreach($rows as $row){
    //         $row->date = date('M-Y',strtotime($row->date));
    //         $row->attendance_list = $this->getAttendanceInMonth($row->date,$id);
    //         unset($row->in_diff_time);
    //         unset($row->out_diff_time);
    //     }
    //     return $rows;
    // }

    // function getAttendanceInMonth($date,$student_id){
    //     $selectCols = 'sa.id,sa.session_date,sa.status_id,sa.in_diff_time,out_diff_time,in_remarks as check_in_remarks,out_remarks as check_out_remarks';
    //     $findMonth = date('m',strtotime($date));
    //     $findYear = date('Y',strtotime($date));

    //     $rows = DB::table('student_attendances as sa')
    //         ->selectRaw($selectCols)
    //         ->whereYear('sa.session_date', $findYear)
    //         ->whereMonth('sa.session_date', $findMonth)
    //         ->where('sa.student_id',$student_id)
    //         ->get();
    //     foreach($rows as $row){
    //         $status = 'A'; // absent
    //         if($row->status_id == 1){
    //             $status = 'P';
    //         }else if($row->status_id == 2){
    //             $status = 'Pr';
    //         }
    //         $row->day = date('d',strtotime($row->session_date));
    //         $row->status = $status;
    //         $row->check_in = formatMinsTime($row->in_diff_time);
    //         $row->check_out = formatMinsTime($row->out_diff_time);
    //         unset($row->in_diff_time);
    //         unset($row->out_diff_time);
    //     }

    //     return $rows;
    // }

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
        if( in_array($day_name,$except_days)) return (object)[
            'day' => $day,
            'attendance_id' => '',
            'status' => $day_name,
            'check_in_remarks' => 'Weekends',
            'check_out_remarks' => '',
            'status_id' => '',
            "session_date" => $date,
            'check_in_time' => '',
            'check_out_time' => '',
        ];

        if($date>$today) return (object)[
                            'day' => $day,
                            'attendance_id' => '',
                            'status' => '?',
                            'check_in_remarks' => '',
                            'check_out_remarks' => '',
                            'status_id' => '',
                            "session_date" => $date,
                            'check_in_time' => '',
                            'check_out_time' => '',
                        ];
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            if($day == $c->day){
                return (object)[
                    'day' => $c->day,
                    'attendance_id' => $c->attendance_id,
                    'status' => $this->getStatusText($c->status_id),
                    'check_in_remarks' => $c->in_remarks,
                    'check_out_remarks' => $c->out_remarks,
                    'status_id' => '',
                    "session_date" => $date,
                    'check_in_time' => '',
                    'check_out_time' => '',
                ];
            }


            $i++;
        }while($c);

        return (object)[
            'day' => $day,
            'attendance_id' => '',
            'check_in_remarks' => 'not scan',
            'check_out_remarks' => '',
            'status' => 'A',
            'status_id' => 3,
            "session_date" => $date,
            'check_in_time' => '',
            'check_out_time' => '',
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
    function getAttendanceDetails($student_id){
        $rows = DB::select(DB::raw('select DISTINCT MONTH(session_date) as month,YEAR(session_date) as year from student_attendances Order by year,month asc limit 6'));
        foreach($rows as $row){
            $row->date = numToMonth($row->month,true).'-'.$row->year;
            $row->status = $this->statusCount($student_id,$row->month,$row->year);
            $row->attendance_list = $this->getAttendanceDetailsByMonth($student_id,$row->month,$row->year);
        }
        return $rows;
    }

    function getAttendanceDetailsByMonth($student_id,$month,$year){
        $days = days_in_month($month,$year);
        $i=0;
        $attendance_list =[];
        $rows = DB::table('student_attendances')->whereMonth('session_date',$month)->whereYear('session_date',$year)->where('student_id',$student_id)->selectRaw('id as attendance_id,student_id,group_id,session_date,DAY(session_date) as day,status_id,in_remarks,out_remarks')->get();
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

    function optionsGroup($arr,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $d = (object)$arr;
        $id = isset($d->group_id) ? $d->group_id:$d->id;
        if($id){
            $id = $d;
        }
        $rows = GeneralSettings::optionsGroup($id,$ss);
        return $rows;
    }

    function optionsAttendanceTypes(){
        return GeneralSettings::optionsAttendanceTypes();
    }

    function attendanceListReport($arr=[],$ss=null){
        $ss = $ss?$ss:$this->ss;
        $rows = DB::table('students as s')
            ->join('enrollments as e','e.student_id','=','s.id')
            ->selectRaw('student_attendances')
            ->get();
        return $rows;
    }
}
