<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Carbon\Carbon;
use Session;
use Localization;
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
            'previous_school' => '0|string|1,100',
            'shift_id' => '0|number|exists=shifts.id',
            'pmt_mode' => '0|number|default=1',
            'academic_year' => '1|string|1,25',
            'status_id' => '0|number|exists=status.id',
            'tuition' => '0|number|default=0',
            'tuition_due' => '0|number|default=0',
            'discount' => '0|number|default=0',
            'tuition_paid' => '0|number|default=0',
            'pmt_option_id' => '0|number|exists=pmt_options.id|default=2',
            'pmt_status' => '0|string|default=unpaid',
            'student_code' => '0|string',
            'term_id' => '1|number|exists=terms.id'
        ];
        $branch_id = $ss->branch_id;
        $email_char = ['@','.'];
        $academic_year_char = ['-',','];
        $address_char = ['@','.','#'];
        $image_char = ['+',':',',',';','=','/','\\','?'];
        $res = validateObject($arr,$v_rule,1,['email'=>$email_char,'address'=>$address_char,'photo'=>$image_char,'academic_year'=>$academic_year_char],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $parent_info = isset($arr['parent_info']) ? $arr['parent_info'] :null;

        $code = $inputs['student_code'];
        $inputs['code'] = $code;
        //
        $image = $inputs['photo'];
        $prev_school = $inputs['previous_school'];
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

        $tuition = $inputs['tuition'];
        $tuition_due = $inputs['tuition_due'];

        $tuition_paid = $inputs['tuition_paid'];
        $academic_year = $inputs['academic_year'];
        $inputs['status_id'] = 1;
        $statusID = $inputs['status_id'];
        $inputs['date_of_birth'] = date('Y-m-d',strtotime($inputs['date_of_birth']));
        $admission_date = isset($arr['admission_date']) ? $arr['admission_date'] :null;
        unset($inputs['status_id']);
        unset($inputs['student_code']);
        unset($inputs['tuition']);
        unset($inputs['tuition_due']);
        unset($inputs['discount']);
        unset($inputs['tuition_paid']);
        unset($inputs['academic_year']);
        unset($inputs['pmt_option_id']);
        unset($inputs['pmt_status']);

        $is_create = (!$id || $id==0);

        unset($inputs['level_id'],$inputs['session_id'],$inputs['campus_id'],$inputs['previous_school'],$inputs['shift_id'],$inputs['term_id'],$inputs['pmt_mode']);

        if(!$id && self::checkExistsLoginName($parent_info)) return DV::error('Login name is already taken');;
        $newID = saveData($ss,'students',['id' => $id],$inputs,[],1,1);

        if($newID>0){
            PublicStorage::saveImage($branch_id,"students",null,$image,null, ['id' => $newID, 'store' => 'students.file_name']);
            //** give register student by generate code and update */
            if(!$code) self::setStudentCode('ST',$ss,$newID);

            $program = DB::table('programs as p')->join('program_levels as pl','p.id','=','pl.program_id')->selectRaw('p.id')->where('pl.id',$level_id)->first();

            //** save or update enrollments table
            $en_student_data = [
                'student_id' => $newID,
                'level_id' => $level_id,
                'program_id' => $program->id,
                'session_id' => $session_id,
                'campus_id' => $campus_id,
                'shift_id' => $shift_id,
                'pmt_mode' => $pmt_mode,
                'academic_year' => $academic_year,
                'term_id' => $term_id,
                'start_date' => date('Y-m-d',strtotime($admission_date)),
            ];
            if(!$id){
                    $en_student_data['status_id'] = $statusID;
                    $en_student_data['is_new_student'] = 1;
            }
            $enrollment_id = saveData($ss,'enrollments',['student_id'=>$id],$en_student_data,[],1);
            $save_pmt_paramsID=null;
            if($id == 0 || $id == 'undefined'){
                    //** save into pmt_parameters */
                    $pmt_params_data = [
                        'expected_date' => self::getFutureTime(7),
                        'pmt_option_id' => $pmt_option_id
                    ];

                    $save_pmt_paramsID = saveData($ss,'pmt_parameters',['id' => null],$pmt_params_data,[],1);

            }
            $getEnrollment = DB::table('enrollments')->where('id',$enrollment_id)->selectRaw('session_id,school_id')->first();
            //** save or update payment table
            if($enrollment_id){
                $en_payment_data = [
                    // 'tuition' => $tuition,
                    // 'tuition_due' => $tuition_due,
                    'pmt_status'=> $pmt_status,
                    // 'tuition_paid' => $tuition_paid,
                    'session_id' => $session_id,
                    'term_id' => $term_id,
                    'pmt_option_id' => 2,//* defualt 2 = semester
                    'enrollment_id' => $enrollment_id
                ];
                $savePaymentID = saveData($ss,'payments',['enrollment_id' => $id?$enrollment_id:null],$en_payment_data,[],1);

                if($savePaymentID && !$id || $id == 0){
                    DB::table('enrollment_payment')->insert([
                        'enrollment_id' => $enrollment_id,
                        'pmt_id' => $savePaymentID
                    ]);
                }
            }

            if($prev_school){
                $save_prev_school = saveData($ss,'school',['id' =>$getEnrollment?$getEnrollment->school_id:null],['name' => $prev_school],[],1);
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
        return DV::depends($newID,['action'=>'Saved','parent_info' => $p_info,'Parameter'=>$save_pmt_paramsID]);
    }

    //* for enrollments section
    static function studentListPaginate($filter=[],$ss){
        $campus = new Campus();
        $branch_id = $ss->branch_id;
        $campus_id = isset($filter['campus_id'])?$filter['campus_id']:null;
        $level_id = isset($filter['level_id'])?$filter['level_id']:null;
        $session_id = isset($filter['session_id'])?$filter['session_id']:null;
        $acadmic_year = isset($filter['academic_year'])?$filter['academic_year']:null;
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
            $str_search ="(i.code ='$search_value' OR i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
        }

        $selectCols = 'e.is_new_student,e.id as enrollment_id,s.name as session,e.level_id,e.campus_id,e.academic_year,st.id,st.code as student_code,st.name,st.sex,st.date_of_birth,st.file_name,e.school_id';
        $query = DB::table('students as st')
                ->join('enrollments as e','e.student_id','=','st.id')
                ->join('sessions as s','s.id','=','e.session_id')
                ->join('terms as t','t.id','=','e.term_id')
                ->selectRaw($selectCols)
                ->where('st.branch_id',$branch_id)
                ->whereRaw($str_moreWhere)->whereRaw($str_search);
                // if($level_id){
                //     $query->where('e.level_id',$level_id);
                // }
                // if($campus_id){
                //     $query->where('e.campus_id',$campus_id);
                // }
                // if($session_id){
                //     $query->where('e.session_id',$session_id);
                // }
                // if($acadmic_year){
                //     $query->where('e.academic_year',$acadmic_year);
                // }
                $query->orderBy('id','desc');
        $count_query = clone $query;
        $count = $count_query->count('st.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row) {
            $row->image_url = PublicStorage::getUrl($branch_id,'students','image').$row->file_name;
            $row->parent_info = self::getChildParent($row->id);
            unset($row->file_name);
            $row->campus = $campus->details($row->campus_id,$ss)->name;
            $row->level = self::getProgramLevel($row->level_id);
            $row->student_type = $row->is_new_student == 0 ? 'Old' : 'New';

            $row->previous_school = self::getPrevSchool($row->school_id)->name;
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function getChildParent($id){
        $row = DB::table('student_guardians as sg')
                ->join('students as s','s.id','=','sg.student_id')
                ->join('guardians as g','g.id','=','sg.guardian_id')
                ->where('s.id',$id)
                // ->where('g.role','mother')
                ->selectRaw('g.name as parent_name,g.phone_number,g.email')
                ->get()->first();
        $row->family_id = 'FML1200449';
        return $row;
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

    static function setCode($prefix,$ss,$id){
        $branch_id = $ss->branch_id;
        $new_code = $prefix.date('Y').$branch_id.formatNumber($id,4);
        return $new_code;
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
                'address' => $pf['address'],
                'sex' => isset($pf['father_name']) ?'M': 'F',
                'role' => $pf['role'],
                'religion' => $pf['religion'],
                'n_id' => $pf['father_nid'] ?? $pf['mother_nid'] ?? ''
            ];

            $exist = DB::table('guardians')
                ->where('id',isset($pf['id'])?$pf['id']:null)
                ->exists();
                $u_id = isset($pf['id'])?$pf['id']:null;
            $newID = saveData($ss,'guardians',['id' => $exist?$pf['id']:null],$inputs,[],1);

            if($newID>0){
                $family_id = self::setCode('FML',$ss,$child_id);
                $exists_fmlCode = DB::table('student_guardians')->where('student_id',$child_id)->where('family_code',null)->exists();
                if($exists_fmlCode){
                    DB::table('student_guardians')->where('guardian_id',$newID)->update(['family_code'=>$family_id]);
                }

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
                if(!$exist){
                    saveData($ss,'student_guardians',[],['guardian_id'=>$newID,'student_id'=>$child_id,'guardian_role'=>$pf['role']],[],1);
                }
            }
            $i++;
        }
        return $um_;
    }

    static function setStudentCode($prefix,$ss,$newID){
        $branch_id = $ss->branch_id;
        $new_code = $prefix.$branch_id.formatNumber($newID,4);
        DB::table('students')->where('id',$newID)->update(['code' => $new_code]);
    }

    static function getFutureTime($daysToAdd) {
        $currentTimestamp = time();

        $futureTimestamp = $currentTimestamp + ($daysToAdd * 24 * 60 * 60);

        $futureDate = date('Y-m-d H:i:s', $futureTimestamp);

        return $futureDate;
    }

    static function getStudentDetails($id,$ss){
        $selectCols = 'e.term_id,ss.name as session,e.school_id,e.campus_id,e.level_id,e.session_id,s.id,e.academic_year,s.sex,s.name,s.sex,s.date_of_birth,s.phone_number,s.email,s.address,s.name_kh,s.code as student_code,s.file_name,s.place_of_birth,e.start_date as admission_date';
        $row = DB::table('students as s')
                ->join('enrollments as e','e.student_id','=','s.id')
                ->join('sessions as ss','ss.id','=','e.session_id')
                ->where('s.id',$id)
                ->selectRaw($selectCols)
                ->first();
       if($row){
            $row->level = self::getProgramLevel($row->level_id);
            $row->campus = self::getCampus($row->campus_id);
            $row->parent_info = self::getGuardians($row->id);
            $row->previous_school = self::getPrevSchool($row->school_id)->name;
            $row->image_url = PublicStorage::getUrl($ss->branch_id,'students','image').$row->file_name;
            unset($row->file_name);
            return $row;
       }
    }

    static function getCampus($id){
        $row = DB::table('campuses')->where('id',$id)->selectRaw('name')->first();
        if($row){
            return $row = $row->name;
        }
        return null;
    }

    static function getProgramLevel($id){
        $row = DB::table('program_levels')->where('id',$id)->selectRaw('name')->first();
        if($row){
            return $row = $row->name;
        }
        return null;
    }
    static function getPrevSchool($id){
        $row =  DB::table('school')->where('id',$id)->selectRaw('id,name')->first();
        return $row? $row: (object)['name'=>'','id'=>null];
    }

    static function getGuardians($student_id){
        $rows = DB::table('student_guardians as sg')
                ->where('sg.student_id',$student_id)
                ->join('guardians as g','sg.guardian_id' ,'=', 'g.id')
                ->join('students as s','s.id','=','sg.student_id')
                ->selectRaw('g.id,g.name,g.role,g.phone_number,g.email,g.address,g.religion,g.n_id')
                ->get();
        foreach($rows as $row){
            if(strtolower($row->role) == 'father'){
                $row->father_name =$row->name;
                $row->father_phone =$row->phone_number;
                $row->father_email =$row->email;
                $row->father_nid = $row->n_id;
                $row->father_profile = "";
                unset($row->name);
                unset($row->email);
                unset($row->n_id);
                unset($row->phone_number);
            }
            if($row->role == 'mother'){
                $row->mother_name =$row->name;
                $row->mother_phone =$row->phone_number;
                $row->mother_email =$row->email;
                $row->mother_nid = $row->n_id;
                $row->mother_profile = "";
                unset($row->name);
                unset($row->email);
                unset($row->n_id);
                unset($row->phone_number);
            }
        }
        return $rows;
    }

    static function studentInformation($filter=[],$ss){
        $campus = new Campus();
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

        $selectCols = 'st.name_kh,st.sex,st.file_name,st.id,st.code as student_code,st.name,st.sex,st.date_of_birth,st.file_name';
        $query = DB::table('students as st')
                ->selectRaw($selectCols)
                ->where('st.branch_id',$branch_id)
                ->whereRaw($str_moreWhere)->whereRaw($str_search)
                ->orderBy('id','desc');
        $count_query = clone $query;
        $count = $count_query->count('st.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row) {
            $row->image_url = PublicStorage::getUrl($branch_id,'students','image').$row->file_name;
            $row->family_id = DB::table('student_guardians')->where('student_id',$row->id)->first()->family_code;
            unset($row->file_name);
            $row->enrollment_info = self::getStudentEnrollmentInfo($row->id,$ss);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    // static function getStudent


    static function deleteStudentEnrollment($id,$ss){
        // $file_name = DB::table('students')->where('id',$id)->take(1)->value('file_name');
        // if($file_name) PublicStorage::delete($ss->branch_id,'students','image',$file_name);
        $delete = DB::table('enrollments')->where('id',$id)->delete();
        return DV::depends($delete,['action' => 'Deleted']);
    }

    static function deleteVerifiedStudent($id,$ss){
        $branch_id = $ss->branch_id;
        $arr = [
            'status_id' => 1,
        ];
        $enr = DB::table('enrollments')->where('student_id',$id)->selectRaw('id')->get()->first();
        $delete = saveData($ss,'enrollments',['student_id' => $id],$arr,[],1);
        if($delete){
            $change_fields = [
                "tuition" => 0,
                "tuition_due" => 0,
                "tuition_paid" => 0,
                "session_id" => 0,
                "status_id" => 0,
                "price_list_id" => 0,
                "program_id" => 0,
                "level_id" => 0,
                'policy_discount' => 0,
            ];
            $updated = saveData($ss,'payments',['enrollment_id' => $enr->id],$change_fields,[],1);
        }
        return DV::depends($updated,'Delete verified student');
    }

    static function studentPaginate($filter=[],$ss){
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

        $selectCols = 's.name as session,e.level_id,e.campus_id,e.academic_year,st.id,st.code as student_code,st.name,st.sex,st.date_of_birth,st.file_name,e.school_id';
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
            // $row->campus = $campus->details($row->campus_id,$ss)->name;
            $row->level = self::getProgramLevel($row->level_id);
            $row->student_type = $status;

            $row->previous_school = self::getPrevSchool($row->school_id)->name;
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function getStudentEnrollmentInfo($d,$ss=null){
        // $d = (object)$d;
        $student_id = isset($d->student_id)?$d->student_id:isset($d->id);
        if(!$student_id){
            $student_id = $d;
        }
        // $filter = $d;
        $selectCols = 'e.session_id,e.id,c.name as campus,pmt.tuition,pmt.tuition_due,pmt.tuition_paid,pl.name as level,e.academic_year,e.status_id';
        // $branch_id = $ss->branch_id;
        // $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        // $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        // $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        // if(!is_numeric($current_page)) $current_page=1;
        // $skip_rows = ($current_page -1) * $per_page;
        // $str_search ="1=1";
        // $str_moreWhere="1=1";
        // if($search_value){
        //     $skip_rows =0;
        //     $search_value = escape_like_str($search_value);
        //     // $str_search ="(i.code ='$search_value' OR i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
        // }
        $query =  DB::table('enrollments as e')
                ->where('e.student_id', $student_id)
                ->join('payments as pmt','pmt.enrollment_id','=','e.id')
                ->join('campuses as c','e.campus_id','=','c.id')
                ->join('program_levels as pl','e.level_id','=','pl.id')
                ->selectRaw($selectCols);
                // ->whereRaw($str_search);

        // $count_query = clone $query;
        // $count = $count_query->count('e.id');
        // $rows = $query->skip($skip_rows)->take($per_page)->get();
        $rows = $query->get();
        foreach($rows as $row){
            $status = null;
            if($row->status_id == 1){
                $status = 'pending';
            }else if($row->status_id ==2){
                $status = 'verified';
            }else if($row->status_id ==3){
                $status = 'paid';
            }else if($row->status_id ==4){
                $status = 'surcharge';
            }
            $row->status = strtolower($status);
            $row->session = GeneralSettings::getSession($row->session_id)->name;
        }
        return $rows;
        // return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

}
