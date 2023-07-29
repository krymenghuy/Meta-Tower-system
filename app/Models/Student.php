<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
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
            'academic_year_id' => '1|number|exists=academic_years.id',
            'status_id' => '1|number|exists=status.id',
            'tuition' => '0|number|default=0',
            'tuition_due' => '0|number|default=0',
            'discount' => '0|number|default=0',
            'tuition_paid' => '0|number|default=0',
            'parent_info' => '0|array',
            'pmt_option_id' => '0|number|exists=pmt_options.id|default=2',
            'pmt_status' => '0|string|default=unpaid'
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
        $term_id = $inputs['term_id'];
        $pmt_option_id = $inputs['pmt_option_id'];
        $pmt_status = $inputs['pmt_status'];
        // $tuition_start_date = $inputs['tuition_start_date'];
        $tuition_end_date = getNowTime();
        $tuition = $inputs['tuition'];
        $tuition_due = $inputs['tuition_due'];
        $discount = $inputs['discount'];
        $tuition_paid = $inputs['tuition_paid'];
        $academic_year = $inputs['academic_year_id'];
        $statusID = $inputs['status_id'];

        unset($inputs['status_id']);
        unset($inputs['tuition_start_date']);
        unset($inputs['tuition_end_date']);
        unset($inputs['tuition']);
        unset($inputs['tuition_due']);
        unset($inputs['discount']);
        unset($inputs['tuition_paid']);
        unset($inputs['academic_year_id']);
        unset($inputs['pmt_option_id']);
        unset($inputs['pmt_status']);

        $is_create = (!$id || $id==0);

        unset($inputs['level_id'],$inputs['session_id'],$inputs['campus_id'],$inputs['prev_school'],$inputs['shift_id'],$inputs['term_id'],$inputs['pmt_mode']);

        if(self::checkExistsLoginName($parent_info)) return DV::error('Login name is already taken');
        // $save_prev_school = saveData($ss,'school',['id' => ]);
        // $newID = saveData($ss,'students',['id' => $id],$inputs,[],1,1);
        $newID = saveData($ss,'students',['id' => null],$inputs,[],1,1);

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
                'pmt_mode' => $pmt_mode,
                'tuition_end_date' => self::getFutureTime(7),
                'academic_year_id' => $academic_year,
                'status_id' => $statusID
                  // 'tuition' => $tuition,
                // 'tuition_due' => $tuition_due,
                // 'discount'=> $discount,
                // 'tuition_paid' => $tuition_paid,
                // term_id => $term_id
            ];
            $existsEnrollment = DB::table('enrollments')->where('student_id',$id)->selectRaw('school_id')->first();
            saveData($ss,'enrollments',['student_id'=>$existsEnrollment?$newID:null],$en_student,[],1);

            $en_payment = [
                'tuition' => $tuition,
                'tuition_due' => $tuition_due,
                'pmt_status'=> $pmt_status,
                'tuition_paid' => $tuition_paid,
                'term_id' => $term_id
            ];

            $saveEnrPayment = saveData($ss,'enrollment_payments',[],$en_payment,[],1);

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
        return DV::depends($newID,['action'=>'Saved','en_payment'=>$saveEnrPayment]);
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

                $female_guardian = DB::table('guardians')->selectRaw('name,phone_number,email')->where('id',$newID)->where('sex','F')->first();
                if($female_guardian){
                    // return $female_guardian;
                    $arr= [
                        'login_name' => $female_guardian->phone_number,
                        'user_class' => 'guardian',
                        'role_id' => '16',
                        'official_id' => $newID,
                        // 'official_code' =>$student_code,
                        'email' => $female_guardian->email,
                        'password' => "123456",
                        'full_name' => $female_guardian->name,
                    ];
                  $um_ = $um->saveUser($arr,$ss);


                }
                // link parent with child
                $link = saveData($ss,'student_guardians',[],['guardian_id'=>$newID,'student_id'=>$child_id,'guardian_role'=>$pf['roll']],[],1);


            }
        }
        return $um_;
    }

    static function setStudentCode($ss,$newID){
        $branch_id = $ss->branch_id;
        $prefix = 'ST';
        // $last_id = DB::table('students')->selectRaw('id')->orderBy('id','desc')->take(1)->first();
        $new_code = $prefix.$branch_id.formatNumber($newID,4);
        DB::table('students')->where('id',$newID)->update(['code' => $new_code]);
        // return $new_code;
    }


    static function student_payment_pending($filter=[],$ss){
        $branch_id = $ss->branch_id;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $owner_id = isset($filter['owner_id'])?$filter['owner_id']:null;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $group_id = isset($filter['group_id'])? $filter['group_id']:null;
        $country_id = isset($filter['country_id'])? $filter['country_id']:null;
        $category_id = isset($filter['category_id'])? $filter['category_id']:null;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
           $skip_rows =0;
          $search_value = escape_like_str($search_value);
          $str_search ="(i.code ='$search_value' OR i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
        }
        //if ($brand_id >0) $str_brand ="g.id =$brand_id";
        //order by group_name or group_code
        $query = DB::table('inv_items as i')
          ->join('inv_item_groups as g','g.id','=','i.group_id')
          ->join('inv_categories as c','c.id','=','g.category_id')
          ->join('inv_brands as b','b.id','=','g.brand_id')
          ->join('inv_item_prices as p','p.item_id','=','i.id')
          ->where('p.sales_type','retail')
          ->where('i.owner_id',$owner_id)
          ->where('i.branch_id',$branch_id)->whereRaw($str_moreWhere)->whereRaw($str_search)
          // ->selectRaw("t.id as detail_type_id,t.name as detailed_type,b.name as brand_name,b.id as brand_id,i.id,'Product' AS item_type,i.code,g.code as group_code,i.name,i.description,g.name as group_name,g.id as group_id,g.description as group_description, g.category_id, i.manufacturer_id, c.name AS category,getItemDetailType(g.detail_type_id) as detail_type,i.create_user,formatDate(i.created_at) as created_at")
          ->selectRaw("b.name as brand_name,b.id as brand_id,i.id,'Product' AS item_type,i.code,g.code as group_code,i.name,i.description,g.name as group_name,g.id as group_id,g.description as group_description, g.category_id, i.manufacturer_id, c.name AS category,i.create_user,formatDate(i.created_at) as created_at")
          ->orderByRaw("g.name ASC,i.code ASC");
      //   ->join('inv_item_groups as g','g.id','=','i.group_id')
      //   ->join('inv_categories as c','c.id','=','g.category_id')
      //   ->where("i.item_class",self::$item_class)->where('i.branch_id',$branch_id)
      //   ->whereRaw($str_moreWhere)->whereRaw($str_search)
      //   ->selectRaw("i.id,'Product' AS item_type,i.code,g.code as group_code,i.name,i.description,g.name as group_name,g.id as group_id,g.description as group_description, g.category_id, i.manufacturer_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,i.create_user,formatDate(i.created_at) as created_at")->orderByRaw("g.name ASC,i.code ASC");
        $count_query = clone $query;
        $count = $count_query->count('g.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function getFutureTime($daysToAdd) {
        // Get the current timestamp (UNIX timestamp)
        $currentTimestamp = time();

        // Calculate the future timestamp by adding the specified number of days
        $futureTimestamp = $currentTimestamp + ($daysToAdd * 24 * 60 * 60); // Convert days to seconds

        // Format the future timestamp as a human-readable date
        $futureDate = date('Y-m-d H:i:s', $futureTimestamp);

        return $futureDate;
    }
}
