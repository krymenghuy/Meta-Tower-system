<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
//use Carbon\Carbon;
//use Session;
//use Localization;
class Student //extends Model
{
    // use HasFactory;
    protected $id = null, $userInfo = null;
    function __construct($id = null,$userInfo=null){
       $this->id = $id;
       $this->userInfo = $userInfo;
    }

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
            //'previous_school' => '0|string|1,100',
            'prev_school_id'=>'0|number',
            'shift_id' => '0|number|exists=shifts.id',
            'pmt_mode' => '0|number|default=1',
            'academic_year' => '1|string|1,25',
            'status_id' => '0|number|exists=status.id',
            // 'tuition' => '0|number|default=0',
            // 'tuition_due' => '0|number|default=0',
            'discount' => '0|number|default=0',
            // 'tuition_paid' => '0|number|default=0',
            'pmt_option_id' => '0|number|exists=pmt_options.id|default=2',
            'pmt_status' => '0|string|default=unpaid',
            'student_code' => '0|string',
            'term_id' => '1|number|exists=terms.id',
            'group_id' => '1|number|exists=student_groups.id',
        ];
        $branch_id = $ss->branch_id;
        $email_char = ['@','.'];
        $academic_year_char = ['-',','];
        $address_char = ['@','.','#'];
        $image_char = ['+',':',',',';','=','/','\\','?'];
        $res = validateObject($arr,$v_rule,1,['email'=>$email_char,'address'=>$address_char,'photo'=>$image_char,'academic_year'=>$academic_year_char],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $parent_info = isset($arr['parent_info']) ? $arr['parent_info'] :[];
        $group_id = $inputs['group_id'];
        unset($inputs['group_id']);

        $code = $inputs['student_code'];
        $inputs['code'] = $code;
        //
        $image = $inputs['photo'];
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

        // $tuition = $inputs['tuition'];
        // $tuition_due = $inputs['tuition_due'];

        // $tuition_paid = $inputs['tuition_paid'];
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

        // $is_create = (!$id || $id==0);

        unset($inputs['level_id'],$inputs['session_id'],$inputs['campus_id'],$inputs['previous_school'],$inputs['shift_id'],$inputs['term_id'],$inputs['pmt_mode']);

        if(!$id && self::checkParentLoginName($parent_info)) return DV::error('Parent Login name is already taken. Father or mother phone number is used as parent login');
        $newID = saveData($ss,'students',['id' => $id],$inputs,[],1,1);

        if($newID > 0){
            PublicStorage::saveImage($branch_id,"students",null,$image,null, ['id' => $newID, 'store' => 'students.file_name']);
            //** give register student by generate code and update */
            //if(!$code) self::setStudentCode(null,$ss,$newID);
            setOfficialCode($branch_id,'student_code_control','students',['id'=>$newID]);

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

            // if($id == 0 || $id == 'undefined'){
            //         //** save into pmt_parameters */
            //         $pmt_params_data = [
            //             'expected_date' => self::getFutureTime(7),
            //             'pmt_option_id' => $pmt_option_id
            //         ];

            //         $save_pmt_paramsID = saveData($ss,'pmt_parameters',['id' => null],$pmt_params_data,[],1);

            // }

            ////$getEnrollment = DB::table('enrollments')->where('id',$enrollment_id)->selectRaw('session_id,school_id')->first();

            //** save or update payment table
            if($enrollment_id){
                $en_payment_data = [
                    // 'tuition' => $tuition,
                    // 'tuition_due' => $tuition_due,
                    'pmt_status'=>$pmt_status,
                    // 'tuition_paid' => $tuition_paid,
                    'session_id'=>$session_id,
                    'term_id' =>$term_id,
                    'pmt_option_id'=> 2,//* defualt 2 = semester
                    'enrollment_id'=> $enrollment_id
                ];
                $savePaymentID = saveData($ss,'payments',['enrollment_id' => $id?$enrollment_id:null],$en_payment_data,[],1);

                if($savePaymentID && !$id || $id == 0){
                    DB::table('enrollment_payment')->insert([
                        'enrollment_id' => $enrollment_id,
                        'pmt_id' => $savePaymentID
                    ]);
                }
            }

            // if($prev_school){
            //     $save_prev_school = saveData($ss,'school',['id' =>$getEnrollment?$getEnrollment->school_id:null],['name' => $prev_school],[],1);
            //     if($save_prev_school){
            //         DB::table('enrollments')->where('student_id',$newID)->update([
            //             'school_id' => $save_prev_school
            //         ]);
            //     }
            // }

            //** save into guardian table and generate login information for female type or if one take that one
            //** link parent(s) to child
            //** using guardian's phone number for login name and password default = 123456 */


            // // **delete Images in Folder if not exists in DB;
            // $folderPath = public_path('/uploads/public/'.$ss->branch_id.'_data/students/images');
            // $filesInDatabase = DB::table('students')->pluck('file_name');
            // $filesInFolder = glob($folderPath . '/*');

            // foreach ($filesInFolder as $filePath) {
            //     $fileName = basename($filePath);
            //     if (!in_array($fileName, $filesInDatabase->toArray())) {
            //         unlink($filePath);
            //     }
            // }

            // add student to group

            saveData($ss,'group_members',['student_id' => $newID],[
                "student_id" => $newID,
                'group_id' => $group_id
            ],[],1,true);
        }
        // return DV::depends($newID,['parent_info' =>$p_info,'Parameter'=>$save_pmt_paramsID]);
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

        $selectCols = 'e.is_new_student,e.id as enrollment_id,s.name as session,e.level_id,e.campus_id,e.academic_year,st.id,st.code as student_code,st.name,st.sex,st.date_of_birth,st.file_name,e.prev_school_id';
        $query = DB::table('students as st')
                ->join('enrollments as e','e.student_id','=','st.id')
                ->join('sessions as s','s.id','=','e.session_id')
                ->join('terms as t','t.id','=','e.term_id')
                // ->join('group_members as gm','gm.student_id','=','st.id')
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
            $row->parent_info = self::getParentInfo($row->id);
            unset($row->file_name);
            $row->campus = $campus->details($row->campus_id,$ss)->name;
            $row->level = self::getProgramLevel($row->level_id);
            $row->student_type = $row->is_new_student == 0 ? 'Old' : 'New';

            $row->previous_school = self::getPrevSchool($row->prev_school_id)->name;
            // $row->group_id = DB::table('group_members')->where('student_id',$row->id)->first()->group_id;

        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function getParentInfo($id){
        $row = DB::table('student_guardians as sg')
                ->join('students as s','s.id','=','sg.student_id')
                ->join('guardians as g','g.id','=','sg.guardian_id')
                ->where('s.id',$id)
                // ->where('g.role','mother')
                ->selectRaw('sg.family_code,g.name as parent_name,g.phone_number,g.email')
                ->get()->first();
        if(!$row) return null;
        $row->family_id = $row->family_code;
        unset($row->family_code);
        return $row;
    }

    static function checkParentLoginName($info){
        foreach ($info as $parentInfo) {
            // Check if the record with the unique identifier exists in the database
            $parent_login = $parentInfo['father_phone'] ?? $parentInfo['mother_phone'];
            $existingRecord = DB::table('um_users')->where('login_name', $parent_login)->first();
            // If the record exists, update it; otherwise, insert a new record
        }
        return $existingRecord?true:false;
    }

    static function makeFamilyCode($prefix,$ss,$id){
        $branch_id = $ss->branch_id;
        $new_code = $prefix.date('Y').$branch_id.formatNumber($id,4);
        return $new_code;
    }

    static function saveParentInfo($parent_info,$student_id,$ss){
        $def_password ='123456';
        // $student_code = DB::table('students')->where('id',$child_id)->pluck('id');
        $um = new UM();
        $um_res = null;
        $i = 0;
        $newID = 0; // default to reach to the bottom
        $login_account = [];

        foreach($parent_info as $pf){
            $new_family_code = null;
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

            $prev_id = DB::table('guardians')
                ->where('id',isset($pf['id'])?$pf['id']:null)->value('id');
                $u_id = isset($pf['id'])?$pf['id']:null;
            $created =  $prev_id>0? false:true;
            $newID = saveData($ss,'guardians',['id' =>$prev_id],$inputs,[],1,true);

            if($newID > 0){
                if($created){
                    $new_family_code = self::makeFamilyCode('FML',$ss,$student_id);
                    DB::table('student_guardians')->where('guardian_id',$newID)->update(['family_code'=>$new_family_code]);

                     /** Link parent or guardian to kid/student */
                    DB::table('student_guardians')->where('guardian_id',$newID)->where('student_id',$student_id)->delete();
                    DB::table('student_guardians')->insert(['guardian_id'=>$newID,'student_id'=>$student_id,'guardian_role'=>$pf['role'],'family_code'=>$new_family_code]);
                }

                if(!isset($parent_info[1])){
                    /** If there is only one parent provided in the array $parentInfo, use that parent as login account for parent mobile app */
                    $login_account = [
                        'login_name' => $inputs['phone_number'],
                        'user_class' => 'parent',
                        'role_id' => '16',
                        'official_id' => $newID,
                        // 'official_code' =>$student_code,
                        'email' =>$inputs['email'],
                        'password' =>$def_password,
                        'full_name' => $inputs['name']
                    ];
                }else{
                    /** If parentInfo array contains two parents including both Father and Mother, then take mother as parent account's login */
                    $female_guardian = DB::table('guardians')->selectRaw('id,name,phone_number,email')->where('id',$newID)->where('sex','F')->first();
                    if($female_guardian){
                        $login_account= [
                            'login_name' => $female_guardian->phone_number,
                            'user_class' => 'parent',
                            'role_id' => '16',
                            'official_id' => $female_guardian->id,
                            // 'official_code' =>$student_code,
                            'email' => $female_guardian->email,
                            'password' => $def_password,
                            'full_name' => $female_guardian->name,
                        ];
                    }
                }
                /** This create user login in case of Creating new parent. if use this code => Please put this code inside if ($created) { ..... }  above */
                //if(!UM::loginExists($login_account['login_name'])) $um_res = $um->saveUser($login_account,$ss);
            }
            $i++;
        }
        /** get parent's login account that is connected to this student_id. If it exists with the same phone_number then DO NOT create account anymore, otherwise create a login account for the parent */
        if($newID>0){
            $parent_login_info = self::getParentLoginInfo($newID,$student_id);
            if(!$parent_login_info)
            {
                $um_res = $um->saveUser($login_account,$ss);
                /** Create new to parent login name */
                $um_res->parent_login_changed = 0;
            }
            else if ($parent_login_info->login_name != $login_account['login_name']){
                $new_login_name = $login_account['login_name'];
                $um_res = $um->changeLoginName($parent_login_info->login_name,$new_login_name);
                $um_res->parent_login_changed = 1;
                $um_res->new_login_name =$new_login_name;
            }else{
                /** No change to parent login name */
                $um_res = (object)['parent_login_changed'=>0];
            }
        }
        return $um_res?$um_res:(object)['parent_login_changed'=>0];
    }

    function getDiscounts($program_id,$pmt_option_id,$id=null){
       $id =$id?$id:$this->id;
       $str_pmt_option = ($pmt_option_id > 0)? 'd.pmt_option_id ='.$pmt_option_id : '1=1';
       return DB::table('student_discounts AS d')->join('students as st','st.id','=','d.student_id')->where('st.id',$id)->whereRaw($str_pmt_option)->where('d.program_id',$program_id)->selectRaw('d.id,st.id AS student_id,d.program_id,d.pmt_option_id, d.special_discount, d.policy_discount,other_discount')->get();
    }

    function getDiscount($program_id,$pmt_option_id,$id=null){
        $id =$id?$id:$this->id;
        $row = DB::table('student_discounts AS d')->join('students as st','st.id','=','d.student_id')->where('st.id',$id)->where('pmt_option_id',$pmt_option_id)->where('d.program_id',$program_id)->selectRaw('d.id,st.id AS student_id,d.program_id,d.pmt_option_id, d.special_discount, d.policy_discount,d.other_discount')->get()->first();
        if(!$row) return (object)['discount'=>0,'dicount_percent'=>0,'discount_type'=>'percentage'];
        //**note =>  discount,discount_percent = policy_discount */
        $row->discount = $row->policy_discount;
        $row->discount_percent = $row->policy_discount;
        $row->discount_type = "percentage";
        return $row;
    }


    function savePaymentHistory($pmt_arr,$enrollment_id,$start_date,$student_id,$ss){
        $instance = new PriceList(null,$ss);
        // $preview = $instance->previewPendingPaymentDetails($pmt_arr,$enrollment_id,$ss);
        // $payment_info = $preview->payment_info;
        $oldEnrollment = DB::table('enrollments')
            ->where('student_id', $student_id)
            ->where('enrollment_status_id','>', 1)
            ->orderBy('id', 'desc')
            ->value('id');
        $selectCols = 'e.program_id,p.pmt_option_id,e.id as enrollment_id,e.student_id,e.term_id,p.price_list_id';
        $earliestEnrollment = DB::table('enrollments as e')->where('e.student_id', $student_id)
                ->where('e.id',$enrollment_id)
                ->join('payments as p','e.id','=','p.enrollment_id')
                ->where('e.enrollment_status_id',1)->where('e.enroll_finalized',1)
                ->orderBy('e.id','asc')
                ->selectRaw($selectCols)
                ->first();
        // if($oldEnrollment>0){
        //     $earliestEnrollment = DB::table('enrollments as e')->where('e.student_id', $student_id)
        //         ->where('e.id', '>', $oldEnrollment)
        //         ->join('payments as p','e.id','=','p.enrollment_id')
        //         ->where('e.enrollment_status_id',1)->where('e.enroll_finalized',1)
        //         ->orderBy('e.id','asc')
        //         ->selectRaw($selectCols)
        //         ->first();
            $pricelist_id = $earliestEnrollment->price_list_id;
            $studentPricelistID = saveData($ss,'student_pricelist',['id'=>null],[
                'student_id'=>$earliestEnrollment->student_id,
                'enrollment_id'=>$earliestEnrollment->enrollment_id,
                'inactive' => 0,
                'remarks' => 'this is the pricelist of comming back after dropped',
                'start_date' => $start_date,
                'term_id' => $earliestEnrollment->term_id,
                'price_list_id' => $pricelist_id
            ],[],1);
            if($studentPricelistID>0){
                $rows = DB::table('pmt_options')->selectRaw('id,name')->limit(3)->orderBy('id','asc')->get();
                foreach($rows as $row){
                    $discount = $instance->getPolicyDiscount($row->id,$pricelist_id);
                    if($row->id == 1){
                        $discount = $instance->getPolicyDiscount($row->id,$pricelist_id);
                        saveData($ss,'student_discounts',['id'=>null,],[
                            'student_id'=>$student_id,
                            'program_id'=>$earliestEnrollment->program_id,
                            'price_list_id'=>$earliestEnrollment->price_list_id,
                            'pmt_option_id'=>$row->id,
                            'policy_discount'=>$discount->discount_percent
                        ],[],1);
                    }
                    if($row->id == 2){
                        $discount = $instance->getPolicyDiscount($row->id,$pricelist_id);
                        saveData($ss,'student_discounts',['id'=>null,],[
                            'student_id'=>$student_id,
                            'program_id'=>$earliestEnrollment->program_id,
                            'price_list_id'=>$earliestEnrollment->price_list_id,
                            'pmt_option_id'=>$row->id,
                            'policy_discount'=>$discount->discount_percent
                        ],[],1);
                    }
                    if($row->id == 3){
                        $discount = $instance->getPolicyDiscount($row->id,$pricelist_id);
                        saveData($ss,'student_discounts',['id'=>null,],[
                            'student_id'=>$student_id,
                            'program_id'=>$earliestEnrollment->program_id,
                            'price_list_id'=>$earliestEnrollment->price_list_id,
                            'pmt_option_id'=>$row->id,
                            'policy_discount'=>$discount->discount_percent
                        ],[],1);
                    }
                }
            }
            return $earliestEnrollment;
        // }else{
        //     $earliestEnrollment = DB::table('enrollments as e')
        //         ->join('payments as p','e.id','=','p.enrollment_id')
        //         ->where('e.student_id',$student_id)
        //         ->where('e.enrollment_status_id',1)
        //         ->where('e.enroll_finalized',1)
        //         ->selectRaw($selectCols)
        //         ->orderBy('e.id','asc')
        //         ->first();
        //     $pricelist_id = $earliestEnrollment->price_list_id;
        //     $studentPricelistID = saveData($ss,'student_pricelist',['id'=>null],[
        //         'student_id'=>$earliestEnrollment->student_id,
        //         'enrollment_id'=>$earliestEnrollment->enrollment_id,
        //         'inactive' => 0,
        //         'remarks' => 'using this as payment info as long as student dropout',
        //         'start_date' => $start_date,
        //         'term_id' => $earliestEnrollment->term_id,
        //         'price_list_id' => $pricelist_id
        //     ],[],1);
            // if($studentPricelistID>0){
            //     $rows = DB::table('pmt_options')->selectRaw('id,name')->limit(3)->orderBy('id','asc')->get();
            //     foreach($rows as $row){
            //         if($row->id == 1){
            //             $discount = $instance->getPolicyDiscount($row->id,$pricelist_id);
            //             saveData($ss,'student_discounts',['id'=>null,],[
            //                 'student_id'=>$student_id,
            //                 'program_id'=>$earliestEnrollment->program_id,
            //                 'price_list_id'=>$earliestEnrollment->price_list_id,
            //                 'pmt_option_id'=>$row->id,
            //                 'policy_discount'=>$discount->discount_percent
            //             ],[],1);
            //         }
            //         if($row->id == 2){
            //             $discount = $instance->getPolicyDiscount($row->id,$pricelist_id);
            //             saveData($ss,'student_discounts',['id'=>null,],[
            //                 'student_id'=>$student_id,
            //                 'program_id'=>$earliestEnrollment->program_id,
            //                 'price_list_id'=>$earliestEnrollment->price_list_id,
            //                 'pmt_option_id'=>$row->id,
            //                 'policy_discount'=>$discount->discount_percent
            //             ],[],1);
            //         }
            //         if($row->id == 3){
            //             $discount = $instance->getPolicyDiscount($row->id,$pricelist_id);
            //             saveData($ss,'student_discounts',['id'=>null,],[
            //                 'student_id'=>$student_id,
            //                 'program_id'=>$earliestEnrollment->program_id,
            //                 'price_list_id'=>$earliestEnrollment->price_list_id,
            //                 'pmt_option_id'=>$row->id,
            //                 'policy_discount'=>$discount->discount_percent
            //             ],[],1);;
            //         }
            //     }
            // }
            // return $earliestEnrollment;
        // }
        // return false;
    }

    function getPriceListDiscount($program_id,$pmt_option_id){
        return null;
        //$row = DB::table('admissions as adm')->where('');
    }
    static function exists($id){
        $id = DB::table('students')->where('id',$id)->take(1)->value('id');
        return $id?true:false;
    }

    function deleteAudioFIle($id=null,$ss=null){
        $id =$id?$id:$this->id;
        $ss =$ss?$ss:$this->userInfo;
        $branch_id = $ss->branch_id;
        $audio_file = DB::table('students as st')->where('id',$id)->take(1)->value('audio_file');
        if($audio_file){
           PublicStorage::delete($branch_id,'students','audio',$audio_file);
           DB::table('students')->where('id',$id)->update(['audio_file'=>$audio_file]);
        }
        return DV::success();
    }

    function getAudioFIle($id=null,$ss=null){
        $id =$id?$id:$this->id;
        $ss =$ss?$ss:$this->userInfo;
        $branch_id = $ss->branch_id;
        $audio_file = DB::table('students as st')->where('id',$id)->take(1)->value('audio_file');
        $url = null;
        if($audio_file){
            $url = PublicStorage::getUrl($branch_id,'students','audio').$audio_file;
        }
        return (object)[
            'file_url'=>$url,
            'repeated'=>1
        ];
    }

    function saveAudioFile($base64, $id=null,$ss=null){
      $id =$id?$id:$this->id;
      $ss =$ss?$ss:$this->userInfo;
      $branch_id = $ss->branch_id;
      if(!self::exists($id)) return DV::error('Student ID does not exist');
      $prev_file = DB::table('students as st')->where('st.id',$id)->take(1)->value('audio_file');
      if($prev_file){
         PublicStorage::delete($branch_id,'students','audio',$prev_file);
      }
      $res = PublicStorage::saveAudio($branch_id,'students',null,$base64,null,['id'=>$id,'store'=>'students.audio_file']);
      return $res;
    }

    static function getParentLoginInfo($parent_id,$student_id){
      return DB::table('um_users as u')->join('guardians as g','g.id','=','u.official_id')->join('student_guardians AS sg','sg.guardian_id','=','g.id')->where('g.id',$parent_id)->where('sg.student_id',$student_id)->selectRaw('u.id,u.login_name,u.user_class')->get()->first();
    }


    static function getFutureTime($daysToAdd) {
        $currentTimestamp = time();

        $futureTimestamp = $currentTimestamp + ($daysToAdd * 24 * 60 * 60);

        $futureDate = date('Y-m-d H:i:s', $futureTimestamp);

        return $futureDate;
    }

    //getStudentDetails() | getDetails() | getEnrollmentDetails
    static function enrollmentDetails($enrollment_id,$ss){
        $selectCols = 'e.id,s.id AS student_id,e.term_id,ss.name as session,e.prev_school_id,e.campus_id,e.level_id,l.`name` AS `level`,c.`name` AS `campus`,e.session_id,s.id,e.academic_year,s.sex,s.`name`,s.sex,s.date_of_birth,s.phone_number,s.email,s.address,s.name_kh,s.code as student_code,s.file_name,s.place_of_birth,formatDate(e.start_date) as admission_date';
        $row = DB::table('students as s')
                ->join('enrollments as e','e.student_id','=','s.id')
                ->join('program_levels as l','l.id','=','e.level_id')
                ->join('campuses as c','c.id','=','e.campus_id')
                ->join('sessions as ss','ss.id','=','e.session_id')
                ->where('e.id',$enrollment_id)
                ->selectRaw($selectCols)
                ->first();
       if(!$row) return null;
            //$row->level = self::getProgramLevel($row->level_id);
            //$row->campus = self::getCampus($row->campus_id);
            $row->parent_info = self::getGuardians($row->student_id,$ss);
            $row->previous_school = self::getPrevSchool($row->prev_school_id)->name;
            $url =null;
            if($row->file_name) $url = PublicStorage::getUrl($ss->branch_id,'students','image').$row->file_name;
            $row->image_url= validateUrl($url,null);
            unset($row->file_name);
            return $row;

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
        $row =  DB::table('schools')->where('id',$id)->selectRaw('id,name')->first();
        return $row? $row: (object)['name'=>'','id'=>null];
    }

    static function getGuardians($student_id,$ss){
        $branch_id = $ss->branch_id;
        $rows = DB::table('student_guardians as sg')
                ->where('sg.student_id',$student_id)
                ->join('guardians as g','sg.guardian_id' ,'=', 'g.id')
                ->join('students as s','s.id','=','sg.student_id')
                ->selectRaw('g.id,g.name,g.role,g.phone_number,g.email,g.address,g.religion,g.n_id,g.file_name')
                ->get();
        foreach($rows as $row){
            if(strtolower($row->role) == 'father'){
                $row->father_name =$row->name;
                $row->father_phone =$row->phone_number;
                $row->father_email =$row->email;
                $row->father_nid = $row->n_id;
                if($row->file_name){
                    $row->father_profile = PublicStorage::getUrl($branch_id,'guardians','image').$row->file_name;
                }else $row->father_profile = "";
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
                if($row->file_name){
                    $row->mother_profile = PublicStorage::getUrl($branch_id,'guardians','image').$row->file_name;
                }else $row->mother_profile = "";

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
            $family = DB::table('student_guardians')->where('student_id',$row->id)->first();
            $row->image_url = PublicStorage::getUrl($branch_id,'students','image').$row->file_name;
            $row->family_id = $family?$family->family_code:null;
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
                "status_id" => 1,
                "price_list_id" => 0,
                "program_id" => 0,
                "level_id" => 0,
                'policy_discount' => 0,
            ];
            $updated = saveData($ss,'payments',['enrollment_id' => $enr->id],$change_fields,[],1);
        }
        return DV::depends($delete,'Delete verified student');
    }

    static function getStudentEnrollmentInfo($d,$ss=null){
        $student_id = isset($d->student_id)?$d->student_id:isset($d->id);
        if(!$student_id){
            $student_id = $d;
        }
        $selectCols = 'e.session_id,e.id,c.name as campus,pmt.tuition,pmt.tuition_due,pmt.tuition_paid,pl.name as level,e.academic_year,e.status_id';

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

    function updateStudentInfo($arr=[],$ss){
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '1|number|exists=students',
            'name' => '0|string|1,50',
            'name_kh' => '0|string|1,50',
            'sex' => '1|string|1,30',
            'date_of_birth' => '0|string',
            'phone_number' => '0|string|1,20',
            'email' => '0|string',
            'address' => '0|string',
            'photo' => '0|string',
            'place_of_birth' => '0|string|1,150',
            // 'prev_school_id' => '0|string',
        ];
        $address_char = ['#',',','@'];
        $email_char = ['#',',','_','@','.'];
        $img_char = ['+',':',',',';','=','/','\\','?'];
        $res = validateObject($arr,$v_rule,1,['email'=>$email_char,'address'=>$address_char,'photo'=>$img_char],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $id = $inputs['id'];
        $image = $inputs['photo'];
        unset($inputs['id']);
        unset($inputs['photo']);
        $inputs['date_of_birth'] = convertDate($inputs['date_of_birth']);
        $to_delete_image = $id && (!$image || isImage($image));
        if($to_delete_image){
            $prev_file_name = DB::table('students')->where('id',$id)->take(1)->value('file_name');
            if($prev_file_name){
                PublicStorage::delete($branch_id,'students','image',$prev_file_name);
                $inputs['file_name']=null;
            }
        }
        $existEmail = isExists('students',['id'=>$id],'email',$inputs['email']);
        if($existEmail) return DV::error('Email already exists');
        $existPhoneNumber = isExists('students',['id'=>$id],'phone_number',$inputs['phone_number']);
        if($existPhoneNumber) return DV::error('Phone number already exists');
        $newID = saveData($ss,'students',['id' => $id],$inputs,[],1);
        if($newID>0){
            PublicStorage::saveImage($branch_id,'students',null,$image,null,['id' => $newID,'store' => 'students.file_name']);
        }

        return DV::depends($newID,'Update');
    }

    function getStudentBasicInfoDetails($id,$ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;
        $row = DB::table('students')->where('id',$id)->selectRaw('name,name_kh,email,place_of_birth,date_of_birth,sex,phone_number,address,file_name')->first();
        if(!$row) return null;
        if($row->file_name !=null ){
            $row->image_url = PublicStorage::getUrl($branch_id,'students','image').$row->file_name;
        } else $row->image_url = null;
        return $row;
    }

    //**Student student Onleave  */
    function setLeave($arr,$id=null,$ss=null){
        $id = $id?$id:$this->id;
        $ss = $ss?$ss:$this->userInfo;
        $v_rule = [
            'student_id' => '1|number|exists=students.id',
            'leave_term_id' => '1|number|exists=terms.id',
            'leave_remarks' => '0|string|1,350',
            'return_remarks' => '0|string|1,350',
            'return_term_id' => '0|number|exists=terms.id',
            'return_date' => '0|date',
            'leave_type_id'=>'number|exists=leave_types.id',
            'leave_date' => '0|string',
        ];

        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object)$inputs;
        $leaveDate = $d->leave_date;
        $lastEnr = DB::table('enrollments')->where('student_id',$d->student_id)->where('term_id',$d->leave_term_id)->where('status_id','>',2)->selectRaw('id,tuition_end_date')->orderBy('id','desc')->get()->first();

        $leaveDiffDate = diffDays($lastEnr->tuition_end_date,$leaveDate);

        $inputs['leave_diff_days'] = $leaveDiffDate;
        $enr_status_id = 0;
        if($d->leave_type_id == 1){
            $enr_status_id = 2;// drop
        }else if ($d->leave_type_id == 2){
            $enr_status_id = 3;// suspend
        }
        $returned = 0;
        if(isset($d->return_date)){
            $returned = 1;
            $inputs['has_returned'] = 1;
        }
        $newID = saveData($ss,'leaves',['id' => $id],$inputs,['auth_uid'=>$ss->id,'auth_user'=>$ss->full_name],1);
        if($newID>0 && $returned < 1 && !$id){
            $updateEnrollment = [
                'enrollment_status_id' => $enr_status_id
            ];
            saveData($ss,'enrollments',['student_id' => $d->student_id,'term_id'=>$d->leave_term_id],[
                $updateEnrollment
            ],[],1);

            $updatePriceList = [
                'inactive' => 1
            ];
            saveData($ss,'student_pricelist',['student_id' => $d->student_id],[
                $updatePriceList
            ],[],1);
        }

        return DV::depends($newID,['on_leave' => true,'diff_date' => $leaveDiffDate]);

        // update enrollment -> drop
        // update student_pricelist -> inactive = 1;
    }

    function getActiveStudentPriceList($filter,$ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $branch_id = $ss->branch_id;
        $rows = DB::table('student_pricelist')->where('branch_id',$branch_id)->where('inactive',0)->get();
        return $rows;
    }

    function updateStudentPriceList(){
    }

}
