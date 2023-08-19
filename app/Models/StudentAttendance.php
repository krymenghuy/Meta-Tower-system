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
            'enrollment_id' => '0|number|exists=enrollments.id',
            'student_id' => '1|number|exists=students.id',
            'level_id' => '1|number|exists=program_levels.id',
            'term_id' => '1|number|exists=terms.id',
            'group_id' => '1|number|exists=student_groups.id',
            'session_date' => '0|date',
            'status_id' => '0|number',
            'remarks' => '0|string|1,150'
        ];

        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $enrollment_id = $inputs['enrollment_id'];
        $student_id = $inputs['student_id'];
        $inputs['present'] = isset($arr['present'])?$arr['present']:date('Y-m-d');
        $present = convertDate($inputs['present']);
        $present_time = isset($arr['present_time'])?$arr['present_time']: date('H:i:s');
        $level_id = $inputs['level_id'];
        $term_id = $inputs['term_id'];
        $group_id = $inputs['group_id'];

        $enr_info = DB::table('enrollments as e')->where('e.student_id',$student_id)->where('e.level_id',$level_id)->where('e.id',$enrollment_id)->where('e.status_id','>=',3)->selectRaw('e.tuition_end_date,e.student_id,e.level_id,e.session_id,e.start_date')->first();
        $level = GeneralSettings::getLevel($level_id,$ss);
        $scan_status = null;
        if(!$enr_info){
            return  DV::error('Student might not enroll or exist in group yet');
        }
        if($enr_info->tuition_end_date < $present){
            return DV::error('Student enrollment is not available or expired');
        }
        $selectGroup = 'sg.checkin_time,sg.checkout_time';
        $group = DB::table('group_members as gm')->where('gm.student_id',$student_id)
                ->join('student_groups as sg','sg.id','=','gm.group_id')->selectRaw($selectGroup)
                ->first();
        $time = date('H:i:s');
        $check_in_out_count = DB::table('student_attendances')->where('student_id',$student_id)->whereDate('session_date', '=', DB::raw('CURDATE()'))->count();
        $check_in = isset($arr['check_in'])?$arr['check_in']:$group->checkin_time;
        $check_out = isset($arr['check_in'])?$arr['check_in']:$group->checkout_time;
        $status =  null; // status % Present, Absent,Permission %

        //** */
        if($check_in_out_count < 1){
            $scan_status = 'in'; // check in;
            $status = $this->checkInStatus($check_in,$present_time);
        }else if ($check_in_out_count <2){
            $scan_status = 'out'; // check out;
            $status = $this->checkOutStatus($check_in,$present_time);
        }else {
            return DV::error('Already check in and out');
        }

        $arr_attenance = [
            "session_date" => date('Y-m-d'),
            "student_id" => $student_id,
            "level_id" => $level_id,
            "term_id" => $term_id,
            "group_id" => $group_id,
            "program_id" => $level->program_id,
            "status_id" => $status->status_id,
            "scan_status" => $scan_status,
            "created_at" => getNowTime(),
            "updated_at" => getNowTime(),
            "in_out_time" => $present_time
        ];
        $newID = DB::table('student_attendances')->insert($arr_attenance);

        $test = [
            'session_date' => getNowTime(),
            'diff_time' => $status,
            'status_' => $group->checkin_time,
            'count' => $check_in_out_count,
            "scan_status" => $scan_status,
            "early" => $status->early,
            "late" => $status->late,
        ];

        return $test;

    }

    function checkOutStatus($class_end,$present_time){
        $diff_time = diff_time($class_end,$present_time);
        $status_id = 0;
        $late = 0;
        $early = 0;
        if($diff_time < 1){
            $early = abs( $diff_time);
            return (object)['status_id'=>$status_id,'late'=>$late,'early'=>$early];
        }
        if($diff_time >1 && $diff_time < 15){
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
            $early = abs( $diff_time);
            return (object)['status_id'=>$status_id,'late'=>$late,'early'=>$early];
        }
        if($diff_time >1 && $diff_time < 15){
            $status_id = 1;// Present;
            $late = $diff_time;
            return (object)['status_id'=>$status_id,'late'=>$late,'early'=>$early];
        }
        return (object)['status_id'=>$status_id,'late'=>$late,'early'=>$early];
    }
}
