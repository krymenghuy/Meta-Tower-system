<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class StudentAttendance //extends Model
{
    // use HasFactory;
    protected $ss = null,$id=null;
    function __construct($id=null,$ss=null){
        $this->id = $id;
        $this->ss = $ss;
    }

    function saveAttendance($arr=[],$ss=null){
        $ss = $ss?$ss:$this->ss;
        $v_rule = [
            // 'enrollment_id' => '0|number|exists=enrollments.id',
            'student_id' => '1|number|exists=students.id',
            // 'level_id' => '1|number|exists=program_levels.id',
            'term_id' => '1|number|exists=terms.id',
            'group_id' => '1|number|exists=student_groups.id',
            'session_date' => '0|date',
            'status_id' => '0|number',
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
        // $level_id = $inputs['level_id'];
        // $term_id = $inputs['term_id'];
        // $group_id = $inputs['group_id'];

        $group = DB::table('student_groups')
        ->whereBetween(DB::raw('TIME(checkin_time)'), [
            date('H:i', strtotime("$present_time -15 minutes")),
            date('H:i', strtotime("$present_time +15 minutes")),
        ])
        ->orderByRaw("ABS(TIME_TO_SEC(TIME(checkin_time)) - TIME_TO_SEC(?))", [$present_time])
        ->selectRaw('id,checkin_time,checkout_time,term_id')
        ->first();

        // $member = DB::table('group_members')->where('student_id', $student_id)->where('group_id', $group->id)->first();

        // $enr_info = DB::table('enrollments as e')->where('e.student_id',$student_id)->where('e.term_id',$group->term_id)->where('e.status_id','>=',3)->selectRaw('e.id,e.tuition_end_date,e.student_id,e.level_id,e.session_id,e.start_date')->first();
        // $level = GeneralSettings::getLevel($enr_info->level_id,$ss);
        // $scan_status = null;
        // if(!$enr_info){
        //     return  DV::error('Student might not enroll or exist in group yet');
        // }
        // if($enr_info->tuition_end_date < $present){
        //     return DV::error('Student enrollment is not available or expired');
        // }
        // // $selectGroup = 'sg.checkin_time,sg.checkout_time';
        // // $group = DB::table('group_members as gm')->where('gm.student_id',$student_id)
        // //         ->join('student_groups as sg','sg.id','=','gm.group_id')->selectRaw($selectGroup)
        // //         ->first();
        // $current_date = isset($arr['current_date'])?date('Y-m-d',strtotime($arr['current_date'])):DB::raw('CURDATE()');
        // $check_in_out = DB::table('student_attendances')->where('student_id',$student_id)->whereDate('session_date', '=', $current_date)->selectRaw('is_finished,id')->first();
        // $check_in = isset($arr['check_in'])?$arr['check_in']:$group->checkin_time;
        // $check_out = isset($arr['check_in'])?$arr['check_in']:$group->checkout_time;
        // $status =  null; // status % Present, Absent,Permission %
        // $in_diff_time = 0;
        // $out_diff_time = 0;
        // $in_remarks = "null";
        // $out_remarks = "";
        // $id = null;
        // $is_finished = $check_in_out?$check_in_out->is_finished:null;
        // if($check_in_out){
        //     $id = $check_in_out->id;
        // }

        // if($is_finished === null || $is_finished <0){
        //     $scan_status = 'in'; // check in;
        //     $status = $this->checkInStatus($check_in,$present_time);
        //     $earliness = $status->early;
        //     $lateness = $status->late;
        //     if($earliness){
        //         $in_remarks = "Check in ".$this->formatMinsTime($earliness)." early";
        //         $in_diff_time= $earliness;
        //     }else{
        //         $in_remarks = "Check in ".$this->formatMinsTime($lateness)." late";
        //         $in_diff_time = $lateness;
        //     }
        //     $is_finished = 0;

        // }else if($is_finished == 0 ){
        //     $scan_status = 'out'; // check in;
        //     $status = $this->checkOutStatus($check_out,$present_time);
        //     $earliness = $status->early;
        //     $lateness = $status->late;
        //     if($earliness){
        //         $out_remarks = "Check out ".$this->formatMinsTime($earliness)." early";
        //         $out_diff_time = $earliness;
        //     }else{
        //         $out_remarks = "Check out ".$this->formatMinsTime($lateness)." late";
        //         $out_diff_time = $lateness;
        //     }
        //     $is_finished = 1;
        // }else{
        //     return DV::error('Already check in and out');
        // }

        // $arr_attenance = [
        //     "session_date" => $current_date,
        //     "student_id" => $student_id,
        //     "level_id" => $level->id,
        //     "term_id" => $group->term_id,
        //     "group_id" => $group->id,
        //     "program_id" => $level->program_id,
        //     "status_id" => $status->status_id,
        //     "created_at" => getNowTime(),
        //     "in_diff_time" => $in_diff_time,
        //     "checkin_time" => $present_time,
        //     "in_remarks" => $in_remarks,
        //     "is_finished" => $is_finished,
        // ];
        // $update=[];


        // if($id){
        //     $update = [
        //         "is_finished" => $is_finished,
        //         "checkout_time" => $present_time,
        //         "out_remarks" => $out_remarks,
        //         "out_diff_time" => $out_diff_time,
        //         "updated_at" => getNowTime(),
        //     ];
        //     DB::table('student_attendances')->where('id',$id)->update($update);
        // }else{
        //     DB::table('student_attendances')->insert($arr_attenance);
        // }


        // $test = [
        //     'session_date' => getNowTime(),
        //     'diff_time' => $status,
        //     'status_' => $group->checkin_time,
        //     'count' => $check_in_out,
        //     "scan_status" => $scan_status,
        //     "early" => $status->early,
        //     "late" => $status->late,
        //     "id" => $id,
        //     "update"=>$update,
        //     "is_finished" => $is_finished,
        //     "group" => $group,
        // ];

        return $group;

    }

    function checkOutStatus($class_end,$present_time){
        $diff_time = diff_time($class_end,$present_time);
        $status_id = 0;
        $late = 0;
        $early = 0;
        if($diff_time < 1){
            $early = $diff_time;
            return (object)['status_id'=>$status_id,'late'=>$late,'early'=>$early];
        }
        if($diff_time >=1 && $diff_time < 15){
            $status_id = 1;// Present;
            $late = $diff_time;
            return (object)['status_id'=>$status_id,'late'=>$late,'early'=>$early];
        }
        return (object)['status_id'=>$status_id,'late'=>$late,'early'=>$early];
    }

    function checkInStatus($class_start,$present_time){
        $diff_time = diff_time($class_start,$present_time);
        $status_id = 0;
        $late = 0;
        $early = 0;
        if($diff_time < 1){
            $early = $diff_time;
            return (object)['status_id'=>$status_id,'late'=>$late,'early'=>$early];
        }
        if($diff_time >=1 && $diff_time < 15){
            $status_id = 1;// Present;
            $late = $diff_time;
            return (object)['status_id'=>$status_id,'late'=>$late,'early'=>$early];
        }
        return (object)['status_id'=>$status_id,'late'=>$late,'early'=>$early];
    }

    function formatMinsTime($minutes) {
        if ($minutes < 60) {
            return $minutes . " min";
        } else {
            $hours = floor($minutes / 60);
            $remainingMinutes = $minutes % 60;
            return $hours . " hour" . ($hours > 1 ? "s" : "") . ($remainingMinutes > 0 ? " " . $remainingMinutes . " min" : "");
        }
    }
}
