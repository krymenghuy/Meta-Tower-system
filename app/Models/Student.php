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
            'academic_year' => '0|string|1,50',
            'tuition_start_date'=> '1|string|default=2/2/2',
            'tuition_end_date'=> '1|string|default=2/2/2',
            'tuition' => '0|number|default=0',
            'tuition_due' => '0|number|default=0',
            'discount' => '0|number|default=0',
            'tuition_paid' => '0|number|default=0',
            'parent_info' => '0|array',
        ];
        $branch_id = $ss->branch_id;
        $email_char = ['@','.'];
        $address_char = ['@','.','#'];
        $image_char = ['+',':',',',';','=','/','\\','?'];
        $res = validateObject($arr,$v_rule,1,['email'=>$email_char,'address'=>$address_char,'photo'=>$image_char],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        //
        $image = $inputs['photo'];
        $parent_info = $inputs['parent_info'];
        unset($inputs['parent_info']);
        $prev_school = $inputs['prev_school'];
        unset($inputs['photo']);
        $level_id = $inputs['level_id'];
        $session_id = $inputs['session_id'];
        $campus_id = $inputs['campus_id'];
        $shift_id = $inputs['shift_id'];
        $term_id = $inputs['term_id'];
        $pmt_mode = $inputs['pmt_mode'];
        $tuition_start_date = $inputs['tuition_start_date'];
        $tuition_end_date = $inputs['tuition_end_date'];
        $tuition = $inputs['tuition'];
        $tuition_due = $inputs['tuition_due'];
        $discount = $inputs['discount'];
        $tuition_paid = $inputs['tuition_paid'];
        $academic_year = $inputs['academic_year'];

        unset($inputs['tuition_start_date']);
        unset($inputs['tuition_end_date']);
        unset($inputs['tuition']);
        unset($inputs['tuition_due']);
        unset($inputs['discount']);
        unset($inputs['tuition_paid']);
        unset($inputs['academic_year']);

        $is_create = (!$id || $id==0);

        unset($inputs['level_id'],$inputs['session_id'],$inputs['campus_id'],$inputs['prev_school'],$inputs['shift_id'],$inputs['term_id'],$inputs['pmt_mode']);
        // $save_prev_school = saveData($ss,'school',['id' => ]);
        $newID = saveData($ss,'students',['id' => $id],$inputs,[],1,1);

        if($newID>0){
            PublicStorage::saveImage($branch_id,"students",null,$image,null, ['id' => $newID, 'store' => 'students.file_name']);
            self::setStudentCode($ss,$newID);

            $program_id = DB::table('programs as p')->join('program_levels as pl','p.id','=','pl.program_id')->selectRaw('p.id')->where('pl.id',$level_id)->first();
            $en_student = [
                'student_id' => $newID,
                'level_id' => $level_id,
                'program_id' => $program_id->id,
                'session_id' => $session_id,
                'campus_id' => $campus_id,
                'shift_id' => $shift_id,
                'term_id' => $term_id,
                'pmt_mode' => $pmt_mode,
                'tuition_start_date' => $tuition_start_date,
                'tuition_end_date' => $tuition_end_date,
                'tuition' => $tuition,
                'tuition_due' => $tuition_due,
                'discount'=> $discount,
                'tuition_paid' => $tuition_paid,
                'academic_year' => $academic_year,
            ];
            $existsEnrollment = DB::table('enrollments')->where('student_id',$id)->selectRaw('school_id')->first();

            saveData($ss,'enrollments',['student_id'=>$existsEnrollment?$newID:null],$en_student,[],1);

            if($prev_school){
                $save_prev_school = saveData($ss,'school',['id' =>$existsEnrollment?$existsEnrollment->school_id:null],['name' => $prev_school],[],1);
                if($save_prev_school){
                    DB::table('enrollments')->where('student_id',$newID)->update([
                        'school_id' => $save_prev_school
                    ]);
                }
            }
            $p_info = self::saveStudentParent($parent_info,$newID,$ss);
        }
        return $p_info;
        // return DV::depends($newID,['action'=>'Saved','test'=>$p_info]);
    }


    static function saveStudentParent($parent_info,$child_id,$ss){

        // $student_code = DB::table('students')->where('id',$child_id)->pluck('id');
        $um = new UM();
        foreach($parent_info as $pf){
            $inputs = [
                'name' => $pf['father_name'] ?? $pf['mother_name']?? '',
                'email' => $pf['father_email'] ?? $pf['mother_email']?? '',
                'phone_number' => $pf['father_phone'] ?? $pf['mother_phone']?? '',
                'address' => $pf['father_address'] ?? $pf['mother_address']?? '',
                'sex' => $pf['sex'],
                'roll' => $pf['roll'],
            ];

            $newID = saveData($ss,'guardians',[],$inputs,[],1);

            if($newID>0){
                if(count($parent_info)==1){
                    $arr= [
                        'login_name' => $inputs['name'],
                        'user_class' => 'guardian',
                        'role_id' => '16',
                        'official_id' => $newID,
                        // 'official_code' =>$student_code,
                        'email' =>$inputs['email'],
                        'password' => "123456",
                        'full_name' => $inputs['name']
                    ];
                   $um->saveUser($arr,$ss);

                }

                $female_guardian = DB::table('guardians')->selectRaw('name,phone_number,email')->where('id',$newID)->where('sex','F')->first();
                if($female_guardian){
                    // return $female_guardian;
                    $arr= [
                        'login_name' => $female_guardian->name,
                        'user_class' => 'guardian',
                        'role_id' => '16',
                        'official_id' => $newID,
                        // 'official_code' =>$student_code,
                        'email' => $female_guardian->email,
                        'password' => "123456",
                        'full_name' => $female_guardian->name,
                    ];
                  $um->saveUser($arr,$ss);

                }
                // link parent with child
                $link = saveData($ss,'student_guardians',[],['guardian_id'=>$newID,'student_id'=>$child_id,'guardian_role'=>$pf['roll']],[],1);


            }
        }
        return $parent_info;

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
