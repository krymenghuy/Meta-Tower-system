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
            'academic_info'=> '1|array', // level_id,session_id,campus_id
        ];
        $branch_id = $ss->branch_id;
        $email_char = ['@','.'];
        $address_char = ['@','.','#'];
        $res = validateObject($arr,$v_rule,1,['email'=>$email_char,'address'=>$address_char],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $image = $inputs['photo'];
        unset($inputs['photo']);
        $academic_info = $inputs['academic_info'];
        unset($inputs['academic_info']);

        // $newID = saveData($ss,'students',['id' => $id],$inputs,[],1);
        // if($newID){
        //     PublicStorage::saveImage($branch_id,'students',null,$image,null,['id' => $newID, 'store'=>'students.file_name']);
        //     self::setStudentCode($ss,$newID);
        // }
        // return DV::depends($newID,['actiion'=>$id?'Updated':'Registered']);
        return self::saveEnrollmentStudent(1,$academic_info);
    }


    static function saveEnrollmentStudent($st_id,$academic_info){

        // saveData($ss,'enrollments',['student_id'=>$st_id],$inputs);
        $obj = (object)$academic_info;
        return $obj->level_id;
    }

    static function setStudentCode($ss,$newID){
        $branch_id = $ss->branch_id;
        $prefix = 'ST';
        $last_id = DB::table('students')->selectRaw('id')->orderBy('id','desc')->take(1)->first();
        $next_id = $newID;
        $new_code = $prefix.$branch_id.formatNumber($next_id,4);
        DB::table('students')->where('id',$newID)->update(['code',$new_code]);
        // return $new_code;
    }
}
