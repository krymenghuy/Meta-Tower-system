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
            'enrollment_id' => '1|number|exists=enrollments.id',
            'student_id' => '1|number|exists=students.id',
            'level_id' => '1|number|exists=program_levels.id',
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
        $level_id = $inputs['level_id'];

        $enr_info = DB::table('enrollments as e')->where('e.student_id',$student_id)->where('e.level_id',$level_id)->where('e.id',$enrollment_id)->where('e.status_id','>',2)->selectRaw('e.tuition_end_date,e.student_id,e.level_id,e.session_id,e.start_date')->first();

        if(!$enr_info){
            return  DV::error('Student might not enroll yet');
        }

        if($enr_info->tuition_end_date < $present){
            return DV::error('Student enrollment is not available or expired');
        }

        if($present)
        // $arr_attenance = [
        //     '' =>
        // ];
        $time = date('H:i:s');

        return $time;

    }
}
