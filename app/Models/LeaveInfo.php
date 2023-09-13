<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DV;
use DB;

class LeaveInfo //extends Model
{
    //use HasFactory;

    protected $id =null, $user_info = null;
    function __construct($id=null,$user_info=null){
        $this->id = $id;
        $this->user_info = $user_info;
    }

    static function getTermInfo($enrollment_id){
        //Supposed to be the last enrollment???
        return DB::table('enrollments as e')->join('terms as t','t.id','=','e.term_id')->where('e.id',$enrollment_id)->take(1)->selectRaw('e.id,t.id AS term_id,e.student_id,e.enroll_finalized,t.name AS term_name,t.start_date,t.end_date,t.is_finished,e.tuition_end_date')->get()->first();
    }

    //Given a leave_type_id => decide the enrollment_status_id
    static function decideEnrollmentStatus($leave_type_id){
       if($leave_type_id == 1) return 2;
       else if($leave_type_id ==2) return 2;
    }
    static function getLeaveType($leave_type_id){
        return DB::table('leave_types as t')->where('id',$leave_type_id)->take(1)->value('name');
    }
    //$arr = ['term_id','student_id','leave_type']
    function save($arr,$id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id =$id?$id:$this->id;
        $v_rule = [
           //'term_id'=>'1|number|exists=terms.id',
           //'student_id'=>'1|number|exists=students.id',
           'enrollment_id'=>'1|number|exists=enrollments.id',
           //'program_id'=>'1|number|exists=programs.id',
           'leave_date'=>'0|date',
           'return_date' => '0|date',
           'leave_type_id'=>'1|number|exists=leave_types.id|text=Leave Type is not valid',
           'leave_remarks'=>'0|string|0-350',
           'has_returned'=>'0|number|default=0',
           'authorized'=>'0|number|default=0'
        ];

        $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $enrollment_id = $inputs['enrollment_id'];
        $leave_date = $inputs['leave_date'];
        if(!$leave_date){
            $leave_date = date('Y-m-d');
        }
        $leave_date = convertDate($leave_date);

        $inputs['leave_date'] = $leave_date;
        $return_date = $inputs['return_date'];
        $inputs['return_date'] = convertDate($return_date);

        $term = self::getTermInfo($enrollment_id);

        if(!$term) return DV::error('The provided Enrollment ID is not valid');
        if($term->enroll_finalized !=1) return DV::error('This enrollment is not yet finalized!');
        if($leave_date > convertDate($term->end_date)) return DV::error('Leave Date must be within the the given Term period');
        $student_id =$term->student_id;
        $inputs['student_id']=$student_id;
        if(!$term->student_id) return DV::error('The enrollment information unexpectedly does not have the student ID');
        $tuition_end_date = $term->tuition_end_date;
        $days_to_tuition_enddate = diffDays($tuition_end_date,$leave_date);
        $term_id = $term->term_id;
        $inputs['days_to_enddate'] = $days_to_tuition_enddate;
        $inputs['leave_term_id']=$term_id; //This is leave_term
        //$leave_type_id = $inputs['leave_type_id'];

        //Use $enrollment_id to find existing Leave Information if it exists or has already been authorized
        $row = DB::table('leaves')->where('enrollment_id',$enrollment_id)->selectRaw('id,authorized,auth_user,formatDate(leave_date) AS leave_date')->get()->first();
        if($row && $row->id > 0 && $row->authorized==1){
            return DV::error('Cannot update this Leave or Dropout Information because it has been authorized by '.$row->auth_user);
        }
        $id = saveData($ss,'leaves',['id'=>$row?$row->id:null],$inputs,[],1,false);

        if($id > 0) $this->finalize($id,$ss);
        return DV::depends($id,null,'Failed to save student leave information');
     }

    function finalize($id=null,$ss=null){
        $id = $id?$id:$this->id;
        $ss = $ss? $ss : $this->user_info;
        $info = DB::table('leaves')->where('id',$id)->selectRaw('id,enrollment_id,leave_type_id,leave_term_id,leave_date,return_date,has_returned')->get()->first();
        if(!$info) return DV::error('Leave ID is not valid');
        $enroll_info = DB::table('enrollments as e')->where('id',$info->enrollment_id)->selectRaw('id,student_id,tuition_end_date')->take(1)->get()->first();
        if(!$enroll_info) return DV::error('Failed to retrieve the enrollment information against the provided leave information');
        if(! \App\Models\Student::exists($enroll_info->student_id)) return DV::error('Student information unexpectedly became invalid. This student may have been deleted');
        if(!(bool)strtotime($enroll_info->tuition_end_date))
          $days_to_tuition_enddate =0;
        else
          $days_to_tuition_enddate = diffDays($enroll_info->tuition_end_date,$info->leave_date);
        $inputs['days_to_enddate'] = $days_to_tuition_enddate;
        $x = DB::table('leaves')->where('id',$id)->update([
        'days_to_enddate'=>$days_to_tuition_enddate,
        'auth_user'=>$ss->full_name,
        'authorized'=>1,
        'auth_date'=>getNowTime(),
        'auth_uid'=>$ss->user_id
       ]);

       if($x){
            //set enrollment status id to be Dropout or Suspended
            DB::table('enrollments')->where('id',$info->enrollment_id)->update([
                'enrollment_status_id'=>self::decideEnrollmentStatus($info->leave_type_id)
            ]);
            //disabled current student's price list in table "student_pricelist", so that if this student come back to study => system will calculate price and discount as new student again
            saveData($ss,'student_pricelist',['student_id' => $enroll_info->student_id],[
                'inactive'=>1,
                'remarks'=>self::getLeaveType($info->leave_type_id)
            ],[],1,true);

       }
       return DV::depends($x,null,'Failed to finalize Leave information');
    }

    function delete($id =null){
        $id = $id?$id:$this->id;
        $leaveInfo = DB::table('leaves')->where('id',$id)->selectRaw('id,enrollment_id')->take(1)->get()->first();
        if($leaveInfo){
              //Change enrollment status to 1 = Active, if it exists
            $x = DB::table('enrollments')->where('id',$leaveInfo->enrollment_id)->update([
                'enrollment_status_id'=>1
            ]);
        }
        $x = DB::table('leaves')->where('id',$id)->delete();
        return DV::depends($x,null,'Failed to delete Leave info');
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
            //$session_id = isset($d->session_id)?$d->session_id:null;
            $search_value =isset($d->search_value)?$d->search_value:null;

            $current_page =isset($d->current_page)?$d->current_page:1;
            $per_page =isset($d->per_page)?$d->per_page:10;
            if(!is_numeric($current_page)) $current_page=1;
            $skip_rows = ($current_page -1) * $per_page;

            $str_leave_term ='1=1';
            if($term_id > 0) $str_leave_term ='t.id ='.$term_id;
            $str_search ="1=1";
            $str_moreWhere="1=1";
            if($search_value){
                $skip_rows =0;
                $search_value = escape_like_str($search_value);
                $str_search ="(st.code ='$search_value' OR st.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
            }
            if($academic_year) $str_moreWhere .= ' AND e.academic_year =\''.$academic_year.'\'';

            if($campus_id > 0) $str_moreWhere .= ' AND e.campus_id ='.$campus_id;
            //if($session_id > 0) $str_moreWhere .= ' AND e.session_id ='.$session_id;
            if($level_id > 0) $str_moreWhere .= ' AND e.level_id ='.$level_id;
            else if($program_id > 0) $str_moreWhere .= ' AND e.program_id ='.$program_id;

            $selectCols = 'le.id,e.id AS enrollment_id,st.id AS student_id,st.phone_number,formatDate(le.leave_date) AS leave_date,le.days_to_enddate,le.leave_term_id,tt.`name` AS leave_type, le.leave_remarks, c.`name` AS campus,l.`name` AS level_name, s.`name` as session_name,e.campus_id,e.academic_year,st.code as student_code,st.name,st.name_kh,st.sex,formatDate(st.date_of_birth) AS date_of_birth,st.file_name,le.update_user,formatTime(le.updated_at) as updated_at, CASE e.is_new_student WHEN 1 THEN \'NEW\' ELSE \'Old\' END AS student_type,e.promoted,le.authorized,le.auth_user,formatTime(le.auth_date) AS auth_date';

            $query = DB::table('leaves as le')
            ->join('enrollments as e','e.id','=','le.enrollment_id')
            ->join('leave_types as tt','tt.id','=','le.leave_type_id')
            ->join('students as st','e.student_id','=','st.id')
                    //->join('student_groups as g','g.id','=','gm.group_id')
                    ->join('campuses as c','c.id','=','e.campus_id')
                    ->join('program_levels as l','l.id','=','e.level_id')
                    ->join('sessions as s','s.id','=','e.session_id')
                    ->join('terms as t','t.id','=','le.leave_term_id')
                    ->selectRaw($selectCols)
                    ->where('e.branch_id',$branch_id)
                    ->whereRaw($str_leave_term)
                    ->whereRaw($str_moreWhere)->whereRaw($str_search);
                    $query->orderByRaw('e.id DESC,st.id');
            $count_query = clone $query;
            $count = $count_query->count('le.id');
            $rows = $query->skip($skip_rows)->take($per_page)->get();
            foreach($rows as $row) {
              $row->image_url=null;
              if($row->file_name){
                  $url = PublicStorage::getUrl($ss->branch_id,'students','image').$row->file_name;
                  $row->image_url = validateUrl($url,null);
              }
                //$row->parent_info = Student::getParentInfo($row->student_id);
                unset($row->file_name);
            }

            return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
      }

      static function details($id){
        $get_level_name = ',(SELECT lev.`name` FROM program_levels as lev WHERE lev.id = e.level_id LIMIT 1) AS level_name';
        $get_group_name = ',(SELECT g.`name` FROM student_groups AS g  INNER JOIN group_members AS gm ON gm.group_id = g.id WHERE gm.enrollment_id =e.id AND gm.student_id =e.student_id LIMIT 1) AS group_name';
        $student_info =',st.branch_id,st.id AS student_id,st.name AS student_name,st.sex,st.phone_number,st.file_name';
        $cols = 'l.id,e.id AS enrollment_id,l.leave_term_id,l.leave_type_id,l.leave_date, l.leave_remarks,l.has_returned,return_remarks,formatDate(l.return_date) As return_date,e.level_id'.$student_info.$get_group_name.$get_level_name.',l.update_user,formatTime(l.updated_at) As updated_at,l.authorized,formatTime(l.auth_date) AS auth_date,formatTime(l.auth_date) AS auth_date';
        return DB::table('leaves as l')->join('enrollments AS e','e.id','=','l.enrollment_id')->join('students as st','st.id','=','e.student_id')->where('l.id',$id)->selectRaw($cols)->take(1)->get()->first();
        //if(!$row) return null;
        //$row->image_url = ($row->file_name)? PublicStorage::getUrl($row->branch_id,'students','image').$row->file_name : '';
        //return $row;
     }

      static function getEnrollmentInfo($enrollment_id){
        $get_leave_id = ',(select lv.id from leaves AS lv WHERE lv.enrollment_id = e.id AND lv.student_id =e.student_id LIMIT 1) leave_id';
        $get_group_name = ',(SELECT g.`name` FROM student_groups AS g  INNER JOIN group_members AS gm ON gm.group_id = g.id WHERE gm.enrollment_id =e.id AND gm.student_id =e.student_id LIMIT 1) AS group_name';
        $row = DB::table('students AS st')->join('enrollments as e','e.student_id','=','st.id')->join('program_levels as lev','lev.id','=','e.level_id')->where('e.id',$enrollment_id)->selectRaw('st.file_name,st.id,st.branch_id,st.name AS student_name,st.sex,st.phone_number,e.level_id,e.session_id,e.status_id,e.enrollment_status_id,e.is_new_student,formatDate(e.tuition_end_date) AS tuition_end_date,e.term_id AS leave_term_id,lev.`name` AS level_name,e.academic_year,st.file_name'.$get_group_name.$get_leave_id)->take(1)->get()->first();
        $row->image_url = ($row->file_name)? PublicStorage::getUrl($row->branch_id,'students','image').$row->file_name : '';
        return $row;
      }

      function getFormOptions($id,$enrollment_id,$ss=null){
         $ss=$ss?$ss:$this->user_info;
         $enroll_info = self::getEnrollmentInfo($enrollment_id);
         if(!$id) $id = $enroll_info->leave_id;
         return (object)[
            'enrollment_info'=>$enroll_info,
            'leave_info'=>self::details($id),
            //'terms'=>GeneralSettings::options_acad_term($ss),
            'leave_types'=>GeneralSettings::options_leave_type($ss),
            'academic_years'=>GeneralSettings::options_academic_year($ss)
         ];
      }

}
