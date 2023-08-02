<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Carbon\Carbon;
use Session;
class Student //extends Model
{
    // use HasFactory;

    static function saveStudent($arr,$id=null,$ss){ //** register only //without payment yet */
        $v_rule = [
            'name' => '1|string|1,30',
            'name_kh' => '1|string|1,30',
            'sex' => '1|choice|F,M',
            'date_of_birth' => '1|string',
            'phone_number' => '0|string',
            'email' => '0|email',
            'place_of_birth' => '0|string',
            'address' => '1|string',
            'photo' => '0|image',
            'level_id' => '1|number|exists=program_levels.id',
            'session_id'=> '1|number|exists=sessions.id',
            'campus_id'=> '1|number|exists=campuses.id',
            'prev_school' => '0|string|1,100',
            'shift_id' => '0|number|exists=shifts.id',
            'term_id' => '0|number|exists=terms.id',
            'pmt_mode' => '0|number|default=1',
            'academic_year' => '1|string|1,25',
            'status_id' => '0|number|exists=status.id',
            'tuition' => '0|number|default=0',
            'tuition_due' => '0|number|default=0',
            'discount' => '0|number|default=0',
            'tuition_paid' => '0|number|default=0',
            'parent_info' => '0|array',
            'pmt_option_id' => '0|number|exists=pmt_options.id|default=2',
            'pmt_status' => '0|string|default=unpaid',
            'student_code' => '0|string'
        ];
        $branch_id = $ss->branch_id;
        $email_char = ['@','.'];
        $academic_year_char = ['-',','];
        $address_char = ['@','.','#'];
        $image_char = ['+',':',',',';','=','/','\\','?'];
        $res = validateObject($arr,$v_rule,1,['email'=>$email_char,'address'=>$address_char,'photo'=>$image_char,'academic_year'=>$academic_year_char],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $code = $inputs['student_code'];
        $inputs['code'] = $code;
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
        $term_id = $inputs['term_id'];
        $pmt_option_id = $inputs['pmt_option_id'];
        $pmt_status = $inputs['pmt_status'];
        // $tuition_start_date = $inputs['tuition_start_date'];
        $tuition_end_date = getNowTime();
        $tuition = $inputs['tuition'];
        $tuition_due = $inputs['tuition_due'];
        $discount = $inputs['discount'];
        $tuition_paid = $inputs['tuition_paid'];
        $academic_year = $inputs['academic_year'];
        $statusID = $inputs['status_id'];
        $inputs['date_of_birth'] = date('Y-m-d',strtotime($inputs['date_of_birth']));

        unset($inputs['status_id']);
        unset($inputs['student_code']);
        unset($inputs['tuition_start_date']);
        unset($inputs['tuition_end_date']);
        unset($inputs['tuition']);
        unset($inputs['tuition_due']);
        unset($inputs['discount']);
        unset($inputs['tuition_paid']);
        unset($inputs['academic_year']);
        unset($inputs['pmt_option_id']);
        unset($inputs['pmt_status']);

        $is_create = (!$id || $id==0);

        unset($inputs['level_id'],$inputs['session_id'],$inputs['campus_id'],$inputs['prev_school'],$inputs['shift_id'],$inputs['term_id'],$inputs['pmt_mode']);

        if(self::checkExistsLoginName($parent_info)) return DV::error('Login name is already taken');
        // $save_prev_school = saveData($ss,'school',['id' => ]);
        // $newID = saveData($ss,'students',['id' => $id],$inputs,[],1,1);
        $newID = saveData($ss,'students',['id' => $id],$inputs,[],1,1);


        if($newID>0){
            PublicStorage::saveImage($branch_id,"students",null,$image,null, ['id' => $newID, 'store' => 'students.file_name']);
            //** give register student by generate code and update */
            if(!$code) self::setStudentCode($ss,$newID);

            $program = DB::table('programs as p')->join('program_levels as pl','p.id','=','pl.program_id')->selectRaw('p.id')->where('pl.id',$level_id)->first();

            //** save into enrollments table
            $en_student_data = [
                'student_id' => $newID,
                'level_id' => $level_id,
                'program_id' => $program->id,
                'session_id' => $session_id,
                'campus_id' => $campus_id,
                'shift_id' => $shift_id,
                'pmt_mode' => $pmt_mode,
                'academic_year' => $academic_year,
                'status_id' => $statusID
            ];
            $enrollment_id = saveData($ss,'enrollments',['student_id'=>null],$en_student_data,[],1);

            //** save into pmt_parameters */
            $pmt_params_data = [
                'expected_date' => self::getFutureTime(7),
                'pmt_option_id' => $pmt_option_id
            ];
            $save_pmt_paramsID = saveData($ss,'pmt_parameters',[],$pmt_params_data,[],1);

            //** save to enrollmen_payment table
            if($enrollment_id){
                $getEnrollment = DB::table('enrollments')->where('id',$enrollment_id)->selectRaw('session_id')->first();
                $en_payment_data = [
                    'tuition' => $tuition,
                    'tuition_due' => $tuition_due,
                    'pmt_status'=> $pmt_status,
                    'tuition_paid' => $tuition_paid,
                    'term_id' => $term_id,
                    'enrollment_id' => $enrollment_id
                ];
                $saveEnrPaymentID = saveData($ss,'enrollment_payments',[],$en_payment_data,[],1);

            }



            if($save_pmt_paramsID){
                DB::table('enrollment_payments')->where('enrollment_id',$enrollment_id)->update([
                    'parameter_id' => $save_pmt_paramsID
                ]);
            }


            if($prev_school){
                $save_prev_school = saveData($ss,'school',['id' =>null],['name' => $prev_school],[],1);
                if($save_prev_school){
                    DB::table('enrollments')->where('student_id',$newID)->update([
                        'school_id' => $save_prev_school
                    ]);
                }
            }

            //** save into guardian table and generate login information for female type or if one take that one
            //** link parent(s) to child
            //** using guardian's phone number for login name and password default = 123456 */
            $p_info = self::saveStudentParent($parent_info,$newID,$ss);

            // **delete Images in Folder if not exists in DB;
            $folderPath = public_path('/uploads/public/'.$ss->branch_id.'_data/students/images');
            $filesInDatabase = DB::table('students')->pluck('file_name');
            $filesInFolder = glob($folderPath . '/*');

            foreach ($filesInFolder as $filePath) {
                $fileName = basename($filePath);
                if (!in_array($fileName, $filesInDatabase->toArray())) {
                    unlink($filePath);
                }
            }
        }
        return DV::depends($newID,['action'=>'Saved','parent_info' => $p_info]);
    }

    static function studentListPaginate($filter=[],$ss){
        $campus = new Campus();
        $level = new ProgramLevel(null,$ss);
        $branch_id = $ss->branch_id;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows =0;
            $search_value = escape_like_str($search_value);
            // $str_search ="(i.code ='$search_value' OR i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
        }

        $selectCols = 's.name as session,e.level_id,e.campus_id,e.academic_year,st.id,st.code as student_code,st.name,st.sex,st.date_of_birth,st.file_name';
        $query = DB::table('students as st')
                ->join('enrollments as e','e.student_id','=','st.id')
                ->join('sessions as s','s.id','=','e.session_id')
                ->selectRaw($selectCols)
                ->where('st.branch_id',$branch_id)
                ->whereRaw($str_moreWhere)->whereRaw($str_search)
                ->orderBy('id','desc');
        $count_query = clone $query;
        $count = $count_query->count('st.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row) {
            $status = rand(0,1)?'New':'Old';
            $row->image_url = PublicStorage::getUrl($branch_id,'students','image').$row->file_name;
            $row->parent_info = self::getChildParent($row->id);
            unset($row->file_name);
            $row->campus = $campus->details($row->campus_id,$ss)->name;
            $row->level = $level->details($row->level_id,$ss)->name;
            $row->student_type = $status;
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function getChildParent($id){
        return DB::table('student_guardians as sg')
                ->join('students as s','s.id','=','sg.student_id')
                ->join('guardians as g','g.id','=','sg.guardian_id')
                ->where('s.id',$id)
                ->selectRaw('g.name as parent_name,g.phone_number,g.email')
                ->get()->first();
    }


    static function updateStudent(){

    }

    static function checkExistsLoginName($info){
        foreach ($info as $parentInfo) {
            // Check if the record with the unique identifier exists in the database
            $uniqueIdentifier = $parentInfo['father_phone'] ?? $parentInfo['mother_phone'];
            $existingRecord = DB::table('um_users')->where('login_name', $uniqueIdentifier)
                                        ->first();
            // If the record exists, update it; otherwise, insert a new record
        }
        return $existingRecord?true:false;
    }

    static function saveStudentParent($parent_info,$child_id,$ss){
        // $student_code = DB::table('students')->where('id',$child_id)->pluck('id');
        $um = new UM();
        $um_ = null;
        $i = 0;
        foreach($parent_info as $pf){
            $inputs = [
                'name' => $pf['father_name'] ?? $pf['mother_name']?? '',
                'email' => $pf['father_email'] ?? $pf['mother_email']?? '',
                'phone_number' => $pf['father_phone'] ?? $pf['mother_phone']?? '',
                'address' => $pf['father_address'] ?? $pf['mother_address']?? '',
                'sex' => isset($pf['father_name']) ?'M': 'F',
                'role' => $pf['role'],
                'religion' => $pf['religion'],
                'n_id' => $pf['father_nid'] ?? $pf['mother_nid'] ?? ''
            ];

            $newID = saveData($ss,'guardians',[],$inputs,[],1);

            if($newID>0){
                if(count($parent_info)==1){
                    $arr= [
                        'login_name' => $inputs['phone_number'],
                        'user_class' => 'guardian',
                        'role_id' => '16',
                        'official_id' => $newID,
                        // 'official_code' =>$student_code,
                        'email' =>$inputs['email'],
                        'password' => "123456",
                        'full_name' => $inputs['name']
                    ];
                   $um_ = $um->saveUser($arr,$ss);

                }

                $female_guardian = DB::table('guardians')->selectRaw('id,name,phone_number,email')->where('id',$newID)->where('sex','F')->first();
                if($female_guardian){
                    // return $female_guardian;
                    $arr= [
                        'login_name' => $female_guardian->phone_number,
                        'user_class' => 'guardian',
                        'role_id' => '16',
                        'official_id' => $female_guardian->id,
                        // 'official_code' =>$student_code,
                        'email' => $female_guardian->email,
                        'password' => "123456",
                        'full_name' => $female_guardian->name,
                    ];
                  $um_ = $um->saveUser($arr,$ss);
                }
                // link parent with child
                $link = saveData($ss,'student_guardians',[],['guardian_id'=>$newID,'student_id'=>$child_id,'guardian_role'=>$pf['role']],[],1);

            }
            $i++;
        }
        return $um_;
    }

    static function setStudentCode($ss,$newID){
        $branch_id = $ss->branch_id;
        $prefix = 'ST';
        $new_code = $prefix.$branch_id.formatNumber($newID,4);
        DB::table('students')->where('id',$newID)->update(['code' => $new_code]);
    }


    static function student_payment_pending($filter=[],$ss){
        $branch_id = $ss->branch_id;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $pmt_status = isset($filter['pmt_status'])?$filter['pmt_status']:null;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows =0;
            $search_value = escape_like_str($search_value);
            $str_search ="(i.code ='$search_value' OR i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
        }

        $selectCols = 'pmt.expected_date,ss.name as session,ep.tuition,ep.tuition_due,ep.tuition_paid,s.name,s.id,st.name as status';
        $query = DB::table('enrollment_payments as ep')
                ->join('enrollments as e','e.id','=','ep.enrollment_id')
                ->join('students as s','s.id','=','e.student_id')
                ->join('sessions as ss','ss.id','=','e.session_id')
                ->join('status as st','st.id','=','e.status_id')
                ->join('pmt_parameters as pmt','pmt.id','=','ep.parameter_id')
                ->where('st.name','pending')
                ->selectRaw($selectCols)
                ->where('ep.branch_id',$branch_id);
                // ->whereRaw($str_moreWhere)->whereRaw($str_search);
        $count_query = clone $query;
        $count = $count_query->count('ep.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function getFutureTime($daysToAdd) {
        $currentTimestamp = time();

        $futureTimestamp = $currentTimestamp + ($daysToAdd * 24 * 60 * 60);

        $futureDate = date('Y-m-d H:i:s', $futureTimestamp);

        return $futureDate;
    }

    static function verify_pending_payment($arr=[]){
        $pmt_option = isset($arr['pmt_option']) ? $arr['pmt_option'] :null;
        $session_id = isset($arr['session_id']) ? $arr['session_id'] : null;
    }

    static function deleteStudent($id,$ss){
        $file_name = DB::table('students')->where('id',$id)->take(1)->value('file_name');
        if($file_name) PublicStorage::delete($ss->branch_id,'students','image',$file_name);
        $delete = DB::table('students')->where('id',$id)->delete();
        return DV::depends($delete,['action' => 'Deleted']);
    }

    // static function payment_section($arr,$id,$ss){
    //     $v_rule = [
    //         // 'tuition' => '1|number',
    //     ];

    //     $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
    //     if($res->error) return DV::error($res->error);

    //     $inputs = $res->values;

    //     return $inputs;
    // }




    /**
     * $arr ['start_date','acadmic_year','program_id','session_id']
    */
}
