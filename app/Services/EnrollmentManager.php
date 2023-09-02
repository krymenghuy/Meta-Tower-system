<?php
namespace App\Services;
use DB;
use App\Models\DV;
use App\Models\Student;
use App\Models\PublicStorage;
use App\Models\GeneralSettings;
use Illuminate\Pagination\LengthAwarePaginator;

class EnrollmentManager {

    protected $id =null, $user_info = null;
    function __construct($id=null,$user_info){
        $this->id = $id;
        $this->user_info = $user_info;
    }

    static function getFutureTime($daysToAdd) {
      $currentTimestamp = time();

      $futureTimestamp = $currentTimestamp + ($daysToAdd * 24 * 60 * 60);

      $futureDate = date('Y-m-d H:i:s', $futureTimestamp);

      return $futureDate;
   }

   static function getCampusName($id){
    $row = DB::table('campuses')->where('id',$id)->selectRaw('name')->first();
    if($row){
        return $row = $row->name;
    }
    return null;
  }


   /** create or Update Enrollment Info for primarily for new student */
     function saveEnrollment($arr,$id=null,$ss=null){ //** register only //without payment yet */
        $ss = $ss?$ss:$this->user_info;
        $id =$id?$id:$this->id;
        $v_rule = [
          'student_code' => '0|string|0-20',
          'name' => '1|string|1,150',
          'name_kh' => '1|string|1,150',
          'sex' => '1|choice|F,M,O',
          'date_of_birth' => '1|date',
          'phone_number' => '0|phone',
          'email' => '0|email',
          'place_of_birth' => '0|string|0-250',
          'address' => '0|string|0-350',
          'photo' => '0|image',
          'group_id' => '0|number|exists=student_groups.id',
          'level_id' => '0|number|exists=program_levels.id',
          'session_id'=> '1|number|exists=sessions.id',
          'campus_id'=> '1|number|exists=campuses.id',
          'prev_school_id' => '0|number',
          'shift_id' => '0|number|exists=shifts.id',
          'pmt_mode' => '0|number|default=1',
          'academic_year' => '1|string|1,25',
          'status_id' => '0|number|exists=status.id',
          // 'tuition' => '0|number|default=0',
          // 'tuition_due' => '0|number|default=0',
          'discount' => '0|number|default=0',
          // 'tuition_paid' => '0|number|default=0',
          'pmt_option_id' => '0|number|exists=pmt_options.id|default=2',
          'pmt_status' => '0|choice|paid,unpaid|default=unpaid',
          'referrer_id' => '0|number|exists=students.id',
          'term_id' => '1|number|exists=terms.id',
          'family_code' => '0|number|exists=student_guardians.family_code',
      ];
      $branch_id = $ss->branch_id;
      $email_char = ['@','.','-','_'];
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
      $level_id = $inputs['level_id'];
      if(!$level_id) $level_id = DB::table('student_groups AS g')->where('id',$group_id)->take(1)->value('level_id');
      if(!$level_id) return DV::error('Failed to identify Level or grade for the given group. Make sure the provided group is correct');

      $inputs['level_id'] = $level_id;
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
      $family_code = $inputs['family_code'];
      unset($inputs['status_id']);
      unset($inputs['student_code']);
      unset($inputs['tuition']);
      unset($inputs['tuition_due']);
      unset($inputs['discount']);
      unset($inputs['tuition_paid']);
      unset($inputs['academic_year']);
      unset($inputs['pmt_option_id']);
      unset($inputs['pmt_status']);
      unset($inputs['family_code']);



      // $is_create = (!$id || $id==0);

      unset($inputs['level_id'],$inputs['session_id'],$inputs['campus_id'],$inputs['previous_school'],$inputs['shift_id'],$inputs['term_id'],$inputs['pmt_mode']);
      $enrollmentInfo= null;
      $student_id =null;
      if($id > 0){
        $enrollmentInfo = DB::table('enrollments as e')->where('id',$id)->selectRaw('student_id')->take(1)->get()->first();
        if(!$enrollmentInfo) return DV::error('It seems the enrollment ID does not exist');
        $student_id = $enrollmentInfo->student_id;
      }

      $to_delete_image = $id && (!$image || isImage($image));
      if($to_delete_image){
        $prev_file_name = DB::table('students')->where('id',$id)->take(1)->value('file_name');
        if($prev_file_name) PublicStorage::delete($branch_id,'students','image',$prev_file_name);
        $inputs['file_name']=null;
      }

      if(!$id && Student::checkParentLoginName($parent_info)) return DV::error('Parent Login name is already taken. Father or mother phone number is used as parent login');
      $student_id = saveData($ss,'students',['id' =>$student_id],$inputs,[],1,1);

      if($student_id > 0){
          PublicStorage::saveImage($branch_id,"students",null,$image,null, ['id' => $student_id, 'store' => 'students.file_name']);
          //** give register student by generate code and update */
          ////if(!$code) Student::setStudentCode('ST',$ss,$newID);
          setOfficialCode($branch_id,'student_code_control','students',['id'=>$student_id]);

          $program = DB::table('programs as p')->join('program_levels as pl','p.id','=','pl.program_id')->selectRaw('p.id')->where('pl.id',$level_id)->first();
          if(!$level_id) return DV::error('Failed to identify program name based on the given level or grade');
          //** save or update enrollments table
          $en_student_data = [
              'student_id' => $student_id,
              'level_id' => $level_id,
              'program_id' => $program->id,
              'session_id' => $session_id,
              'campus_id' => $campus_id,
              'shift_id' => $shift_id,
              'pmt_mode' => $pmt_mode,
              'academic_year' => $academic_year,
              'term_id' => $term_id,
              'referrer_id' => $inputs['referrer_id'],
              'start_date' => convertDate($admission_date),
          ];
          if(!$id){
                  $en_student_data['status_id'] = $statusID;
                  $en_student_data['is_new_student'] = 1;
          }
          $enrollment_id = saveData($ss,'enrollments',['id'=>$id],$en_student_data,[],1);

        //   $save_pmt_paramsID=null;
        //   if($id == 0 || $id == 'undefined'){
        //           //** save into pmt_parameters */
        //           $pmt_params_data = [
        //               'expected_date' => self::getFutureTime(7),
        //               'pmt_option_id' => $pmt_option_id
        //           ];

        //           $save_pmt_paramsID = saveData($ss,'pmt_parameters',['id' => null],$pmt_params_data,[],1);

        //   }

          //$getEnrollment = DB::table('enrollments')->where('id',$enrollment_id)->selectRaw('session_id,school_id')->first();
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

        //   if($prev_school){
        //       $save_prev_school = saveData($ss,'school',['id' =>$getEnrollment?$getEnrollment->school_id:null],['name' => $prev_school],[],1);
        //       if($save_prev_school){
        //           DB::table('enrollments')->where('student_id',$newID)->update([
        //               'school_id' => $save_prev_school
        //           ]);
        //       }
        //   }

        //   //** save into guardian table and generate login information for female type or if one take that one
        //   //** link parent(s) to child
        //   //** using guardian's phone number for login name and password default = 123456 */
        //    if(){

        //    }else{
        //         $p_info = Student::saveParentInfo($parent_info,$student_id,$ss);
        //    }

        //   // **delete Images in Folder if not exists in DB;
        //   $folderPath = public_path('/uploads/public/'.$ss->branch_id.'_data/students/images');
        //   $filesInDatabase = DB::table('students')->pluck('file_name');
        //   $filesInFolder = glob($folderPath . '/*');

        //   foreach ($filesInFolder as $filePath) {
        //       $fileName = basename($filePath);
        //       if (!in_array($fileName, $filesInDatabase->toArray())) {
        //           unlink($filePath);
        //       }
        //   }

          // add student to group
          $g_id = DB::table('group_members')->where('enrollment_id',$enrollment_id)->take(1)->value('id');
          saveData($ss,'group_members',['id' => $g_id],[
              "student_id" => $student_id,
              'group_id' => $group_id,
              'enrollment_id' => $enrollment_id,
              'is_major'=>1,
              'fee_required'=>1
          ],[],1);
      }
      $enroll_path = (object)['academic_year'=>$academic_year,'campus_id'=>$campus_id,'term_id'=>$term_id,'program_id'=>$program->id,'level_id'=>$level_id,'session_id'=>$session_id];
      return DV::depends($enrollment_id,['enrollment_path'=>$enroll_path,'parent_info' =>$p_info],'Failed to save student enrollmemnt');
  }

  static function getPrevSchool($id){
    $row =  DB::table('schools')->where('id',$id)->selectRaw('id,name')->first();
    return $row? $row: (object)['name'=>'','id'=>null];
  }

function deleteEnrollment($id=null,$ss=null){
    $ss= $ss?$ss:$this->user_info;
    $id = $id?$id:$this->id;
    $info =  DB::table('enrollments')->where('id',$id)->selectRaw('id,status_id')->take(1)->get()->first();
    if(!$info) return DV::error('Enrollment info does not exist');
    if($info->status_id >=3) return DV::error('Cannot delete enrollment because the student already paid tuition fee');
    $x = DB::table('enrollments')->where('id',$id)->delete();
    return DV::depends($x,null);
}

//delete enrollment that has verified payment
function deleteVerifiedEnrollment($id=null,$ss=null){
    $ss = $ss?$ss:$this->user_info;
    $id = $id?$id:$this->id;
    //$branch_id = $ss->branch_id;
    $enr = DB::table('enrollments')->where('id',$id)->selectRaw('id')->get()->first();
    $delete = saveData($ss,'enrollments',['id' => $id],[
        'status_id' => 1,
    ],[],1);
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


    function getEnrollmentDetails($id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $selectCols = 'e.id,s.id AS student_id,e.term_id,e.student_id,ss.name as session,e.prev_school_id,e.program_id,e.level_id,e.campus_id,e.session_id,g.id AS group_id,g.name AS group_name, l.`name` AS `level`,c.`name` AS `campus`,e.academic_year,s.sex,s.`name`,s.sex,formatDate(s.date_of_birth) AS date_of_birth,s.phone_number,s.email,s.address,s.name_kh,s.code as student_code,s.file_name,s.place_of_birth,formatDate(e.start_date) as admission_date';
        $row = DB::table('students as s')
                ->join('enrollments as e','e.student_id','=','s.id')
                ->where('e.id',$id)
                ->join('group_members as gm','e.id','=','gm.enrollment_id')
                ->join('student_groups as g','g.id','=','gm.group_id')
                ->join('program_levels as l','l.id','=','e.level_id')
                ->join('campuses as c','c.id','=','e.campus_id')
                ->join('sessions as ss','ss.id','=','e.session_id')

                ->selectRaw($selectCols)
                ->first();
            if(!$row) return null;
                $row->parent_info = Student::getGuardians($row->student_id,$ss);
                $row->prev_school_name = self::getPrevSchool($row->prev_school_id)->name;
                $url =null;
                if($row->file_name){
                    $url = PublicStorage::getUrl($ss->branch_id,'students','image').$row->file_name;
                    $row->image_url = validateUrl($url,null);
                }
                unset($row->file_name);
            return $row;
    }

    /** getFormOptions is postive in case of Editing existing Enrollment  */
    function getFormOptions($enrollment_id,$ss){
            $res = [
                //'price_list'=>GeneralSettings::price_list_options($ss),
                'sessions' => GeneralSettings::options_session($ss),
                //'pmt_options' => GeneralSettings::options_pmt($ss),
                'programs' => GeneralSettings::options_program($ss),
                'levels' => GeneralSettings::options_level(null,$ss),
                'campuses' => GeneralSettings::options_campus($ss),
                'academic_years' => GeneralSettings::options_academic_year($ss),
                'terms' => GeneralSettings::options_term(null,$ss),
                'schools' => GeneralSettings::options_school($ss),
                'enrollment_info'=> $this->getEnrollmentDetails($enrollment_id,$ss)
            // ,'groups' => GeneralSettings::options_group($term_id,$ss)
            ];
            return $res;
    }

   function list_paginate($filter,$ss=null){
      $ss = $ss?$ss:$this->user_info;
      $branch_id = $ss->branch_id;
      $d = (object)$filter;
      $term_id = isset($d->term_id)?$d->term_id:null;
      $academic_year = isset($d->academic_year)?$d->academic_year:null;
      $campus_id = isset($d->campus_id)?$d->campus_id:null;
      $program_id = isset($d->program_id)?$d->program_id:null;
      $level_id = isset($d->level_id)?$d->level_id:null;
      $session_id = isset($d->session_id)?$d->session_id:null;
      $search_value =isset($d->search_value)?$d->search_value:null;

      $current_page =isset($d->current_page)?$d->current_page:1;
      $per_page =isset($d->per_page)?$d->per_page:10;
      if(!is_numeric($current_page)) $current_page=1;
      $skip_rows = ($current_page -1) * $per_page;

      $str_search ="1=1";
      $str_moreWhere="1=1";
      if($search_value){
          $skip_rows =0;
          $search_value = escape_like_str($search_value);
          $str_search ="(i.code ='$search_value' OR i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
      }
      if($academic_year) $str_moreWhere .= ' AND e.academic_year =\''.$academic_year.'\'';

      if($campus_id > 0) $str_moreWhere .= ' AND e.campus_id ='.$campus_id;
      if($session_id > 0) $str_moreWhere .= ' AND e.session_id ='.$session_id;
      if($level_id > 0) $str_moreWhere .= ' AND e.level_id ='.$level_id;
      else if($program_id > 0) $str_moreWhere .= ' AND e.program_id ='.$program_id;

      $selectCols = 'e.id,st.id AS student_id,e.is_new_student,s.name AS session,e.level_id,g.`name` AS group_name, g.id AS group_id, e.prev_school_id,c.`name` AS campus,l.`name` AS level,e.campus_id,e.academic_year,st.code as student_code,st.name,st.name_kh,st.sex,formatDate(st.date_of_birth) AS date_of_birth,st.file_name, CASE e.is_new_student WHEN 1 THEN \'NEW\' ELSE \'Old\' END AS student_type';
      $query = DB::table('enrollments as e')
              ->join('group_members as gm','e.id','=','gm.enrollment_id')
              ->join('student_groups as g','g.id','=','gm.group_id')
              ->join('students as st','e.student_id','=','st.id')
              ->join('campuses as c','c.id','=','e.campus_id')
              ->join('program_levels as l','l.id','=','e.level_id')
              ->join('sessions as s','s.id','=','e.session_id')
              ->join('terms as t','t.id','=','e.term_id')
              ->selectRaw($selectCols)
              ->where('st.branch_id',$branch_id)
              ->where('e.term_id',$term_id)
              ->whereRaw($str_moreWhere)->whereRaw($str_search);
              $query->orderByRaw('e.id desc,s.id');
      $count_query = clone $query;
      $count = $count_query->count('st.id');
      $rows = $query->skip($skip_rows)->take($per_page)->get();
      foreach($rows as $row) {
        $row->image_url=null;
        if($row->file_name){
            $url = PublicStorage::getUrl($ss->branch_id,'students','image').$row->file_name;
            $row->image_url = validateUrl($url,null);
        }
          $row->parent_info = Student::getParentInfo($row->student_id);
          unset($row->file_name);
          $row->previous_school = self::getPrevSchool($row->prev_school_id)->name;
      }

      return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function generateNewEnrollentToStudent($arr=[],$id,$ss){
        $v_rule = [];
        return '';
    }
}
?>
