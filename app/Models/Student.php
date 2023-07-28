<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class Student //extends Model
{
    // use HasFactory;
    static function saveStudent($arr,$id=null,$ss){
        $v_rule = [
            'name' => '1|string|1,30',
            'name_kh' => '1|string|1,30',
            'sex' => '1|choice|F,M',
            'date_of_birth' => '1|string',
            'phone_number' => '0|string',
            'email' => '0|email',
            'address' => '1|string',
            'photo' => '0|image',
            'level_id' => '1|number|exists=program_levels.id',
            'session_id'=> '1|number|exists=sessions.id',
            'campus_id'=> '1|number|exists=campuses.id',
            'prev_school' => '0|string|1,100',
            'shift_id' => '0|number|exists=shifts.id',
            'term_id' => '0|number|exists=terms.id',
            'pmt_mode' => '0|number|default=1',
            'tuition_start_date'=> '1|string|default=2/2/2',
            'tuition_end_date'=> '1|string|default=2/2/2',
            'tuition' => '0|number|default=0',
            'tuition_due' => '0|number|default=0',
            'discount' => '0|number|default=0',
            'tuition_paid' => '0|number|default=0',
        ];
        $branch_id = $ss->branch_id;
        $email_char = ['@','.'];
        $address_char = ['@','.','#'];
        $res = validateObject($arr,$v_rule,1,['email'=>$email_char,'address'=>$address_char],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        //
        $image = $inputs['photo'];
        $prev_school = $inputs['prev_school'];
        unset($inputs['photo']);
        $level_id = $inputs['level_id'];
        $session_id = $inputs['session_id'];
        $campus_id = $inputs['campus_id'];
        $shift_id = $inputs['shift_id'];
        $term_id = $inputs['term_id'];

        $created = (!$id || $id==0);

        unset($inputs['level_id'],$inputs['session_id'],$inputs['campus_id'],$inputs['prev_school'],$inputs['shift_id'],$inputs['term_id']);
        // $save_prev_school = saveData($ss,'school',['id' => ]);
        $newID = saveData($ss,'students',['id' => $id],$inputs,[],1,1);
        $get_prev_school = DB::table('enrollments')->where('student_id',$id)->selectRaw('school_id')->first();
        if($newID){
            PublicStorage::saveImage($branch_id,'students',null,$image,null,['id' => $newID, 'store'=>'students.file_name']);
            self::setStudentCode($ss,$newID);
            $save_prev_school = saveData($ss,'school',['id' => $get_prev_school?$get_prev_school->id:null],['name' => $prev_school],[],1);
            self::saveEnrollmentStudent($newID,$level_id,$session_id,$campus_id,$shift_id,$term_id,$ss);
        }
        return DV::depends($newID,['action'=>'Saved']);
    }


    static function saveEnrollmentStudent($st_id,$level_id,$session_id,$campus_id,$shift_id,$term_id,$ss){
        $program_id = DB::table('programs as p')->join('program_levels as pl','p.id','=','pl.program_id')->selectRaw('p.id')->where('pl.id',$level_id)->first();
        $inputs = [
            'student_id' => $st_id,
            'level_id' => $level_id,
            'program_id' => $program_id->id,
            'session_id' => $session_id,
            'campus_id' => $campus_id,
        ];
        saveData($ss,'enrollments',['student_id'=>null],$inputs,[],1);
    }

    static function setStudentCode($ss,$newID){
        $branch_id = $ss->branch_id;
        $prefix = 'ST';
        // $last_id = DB::table('students')->selectRaw('id')->orderBy('id','desc')->take(1)->first();
        $new_code = $prefix.$branch_id.formatNumber($newID,4);
        DB::table('students')->where('id',$newID)->update(['code' => $new_code]);
        // return $new_code;
    }
}
