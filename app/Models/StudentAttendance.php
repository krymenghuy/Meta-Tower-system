<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
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
        $mins = 15; // for find class start and end time which > between < mins
        $v_rule = [
            'student_id' => '1|number|exists=students.id',
            'remarks' => '0|string|1,150'
        ];

        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        // $enrollment_id = $inputs['enrollment_id'];
        $student_id = $inputs['student_id'];
        $inputs['present'] = isset($arr['present'])?$arr['present']:date('Y-m-d');
        $present = convertDate($inputs['present']);
        $present_time = isset($arr['present_time'])?$arr['present_time']: date('H:i');
        $group = null;


        $group_in = DB::table('student_groups as sg')
        ->join('group_members as gm','sg.id','=','gm.group_id')->where('gm.student_id',$student_id)
        ->whereBetween(DB::raw('TIME(checkin_time)'), [
            date('H:i', strtotime("$present_time -$mins minutes")),
            date('H:i', strtotime("$present_time +$mins minutes")),
        ])
        ->orderByRaw("ABS(TIME_TO_SEC(TIME(checkin_time)) - TIME_TO_SEC(?))", [$present_time])
        ->selectRaw('sg.id,sg.checkin_time,sg.checkout_time,sg.term_id')
        ->first();

        $group_out = DB::table('student_groups as sg')
        ->join('group_members as gm','sg.id','=','gm.group_id')->where('gm.student_id',$student_id)
        ->whereBetween(DB::raw('TIME(checkout_time)'), [
            date('H:i', strtotime("$present_time -$mins minutes")),
            date('H:i', strtotime("$present_time +$mins minutes")),
        ])->orderByRaw("ABS(TIME_TO_SEC(TIME(checkout_time)) - TIME_TO_SEC(?))", [$present_time])
        ->selectRaw('sg.id,sg.checkin_time,sg.checkout_time,sg.term_id')
        ->first();

        if($group_in){
            $group = $group_in;
        }else{
            $group = $group_out;
        }

        if(!$group)return DV::error('Student does not exist in group');
        $enr_info = DB::table('enrollments as e')->where('e.student_id',$student_id)->where('e.term_id',$group->term_id)->where('e.status_id','>=',3)->selectRaw('e.id,e.tuition_end_date,e.student_id,e.level_id,e.session_id,e.start_date')->first();

        $scan_status = null;
        if(!$enr_info){
            return  DV::error('Student might not enroll or exist in group yet');
        }
        if($enr_info->tuition_end_date < $present){
            return DV::error('Student enrollment is not available or expired');
        }
        $level = GeneralSettings::getLevel($enr_info->level_id,$ss);

        $current_date = isset($arr['current_date'])?date('Y-m-d',strtotime($arr['current_date'])):DB::raw('CURDATE()');
        $check_in_out = DB::table('student_attendances')->where('student_id',$student_id)->whereDate('session_date', '=', $current_date)->selectRaw('is_finished,id')->first();
        $check_in = isset($arr['check_in'])?$arr['check_in']:$group->checkin_time;
        $check_out = isset($arr['check_in'])?$arr['check_in']:$group->checkout_time;
        $status =  null; // status % Present, Absent,Permission %
        $in_diff_time = 0;
        $out_diff_time = 0;
        $in_remarks = "null";
        $out_remarks = "";
        $id = null;
        $is_finished = $check_in_out?$check_in_out->is_finished:null;
        if($check_in_out){
            $id = $check_in_out->id;
        }

        if($is_finished === null || $is_finished <0){
            $scan_status = 'in'; // check in;
            $status = $this->checkInStatus($check_in,$present_time);
            $earliness = abs($status->early);
            $lateness = $status->late;
            if($earliness){
                $in_remarks = "Check in ".formatMinsTime($earliness)." earlier";
                $in_diff_time= $earliness;
            }else{
                $in_remarks = "Check in ".formatMinsTime($lateness)." late";
                $in_diff_time = $lateness;
            }
            $is_finished = 0;

        }else if($is_finished == 0 ){
            $scan_status = 'out'; // check in;
            $status = $this->checkOutStatus($check_out,$present_time);
            $earliness = abs($status->early);
            $lateness = $status->late;
            if($earliness){
                $out_remarks = "Check out ".formatMinsTime($earliness)." earlier";
                $out_diff_time = $earliness;
            }else{
                $out_remarks = "Check out ".formatMinsTime($lateness)." late";
                $out_diff_time = $lateness;
            }
            $is_finished = 1;
        }else{
            return DV::error('Already check in and out');
        }

        $arr_attenance = [
            "session_date" => $current_date,
            "student_id" => $student_id,
            "level_id" => $level->id,
            "term_id" => $group->term_id,
            "group_id" => $group->id,
            "program_id" => $level->program_id,
            "status_id" => $status->status_id,
            "created_at" => getNowTime(),
            "in_diff_time" => $in_diff_time,
            "checkin_time" => $present_time,
            "in_remarks" => $in_remarks,
            "is_finished" => $is_finished,
        ];
        $update=[];

        if($id){
            $update = [
                "is_finished" => $is_finished,
                "checkout_time" => $present_time,
                "out_remarks" => $out_remarks,
                "out_diff_time" => $out_diff_time,
                "updated_at" => getNowTime(),
            ];
            DB::table('student_attendances')->where('id',$id)->update($update);
        }else{
            DB::table('student_attendances')->insert($arr_attenance);
        }


        $test = [
            'session_date' => getNowTime(),
            'diff_time' => $status,
            'status_' => $group->checkin_time,
            'count' => $check_in_out,
            "scan_status" => $scan_status,
            "early" => $status->early,
            "late" => $status->late,
            "id" => $id,
            "update"=>$update,
            "is_finished" => $is_finished,
            "group" => $group,
        ];

        return $test;

    }

    function checkOutStatus($class_end,$present_time){
        $diff_time = diff_time($class_end,$present_time);
        $status_id = 0;
        $late = 0;
        $early = 0;
        if($diff_time < 1){
            $early = $diff_time;
        }
        $late = $diff_time;

        return (object)['status_id'=>$status_id,'late'=>$late,'early'=>$early];
    }

    function checkInStatus($class_start,$present_time){
        $diff_time = diff_time($class_start,$present_time);
        $status_id = 0;
        $late = 0;
        $early = 0;
        if($diff_time < 1){
            $early = $diff_time;
        }
        $status_id = 1;// Present;
        $late = $diff_time;
        return (object)['status_id'=>$status_id,'late'=>$late,'early'=>$early];
    }



    function attendanceList($filter=[],$ss=null){
        $branch_id = $ss->branch_id;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            // $str_search ="(i.code ='$search_value' OR i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
        }

        $selectCols = 's.sex,s.name,s.name_kh,s.code,s.id,s.date_of_birth as dob';
        $query = DB::table('students as s')
                ->whereRaw($str_moreWhere)->whereRaw($str_search)
                ->selectRaw($selectCols)
                ->orderBy('id','desc');
        $count_query = clone $query;
        $count = $count_query->count('id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row) {
            $row->age = getAge($row->dob);
            $row->family_id = DB::table('student_guardians')->where('student_id',$row->id)->first()->family_code;
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function attendanceDetails($d,$ss){
        $id = isset($d->student_id)?$d->student_id:$d;
        $ss = $ss?$ss:$this->ss;
        $selectCols = 'formatDate(sa.session_date) as date';
        $rows = DB::table('student_attendances as sa')->where('sa.student_id',$id)
            ->selectRaw($selectCols)
            ->get();
        foreach($rows as $row){
            // $status = 'A'; // absent
            // if($row->status_id == 1){
            //     $status = 'P';
            // }else if($row->status_id == 2){
            //     $status = 'PR';
            // }
            $row->date = date('M-Y',strtotime($row->date));
            $row->attendance_list = $this->getAttendanceInMonth($row->date);

            // $row->check_in = formatMinsTime($row->in_diff_time);
            // $row->check_out = formatMinsTime($row->out_diff_time);
            unset($row->in_diff_time);
            unset($row->out_diff_time);
        }
        return $rows;
    }

    function getAttendanceInMonth($date){
        $selectCols = 'sa.status_id,sa.in_diff_time,out_diff_time,in_remarks as check_in_remarks,out_remarks as check_out_remarks';
        // $findDate = date('M',strtotime($date));
        $findMonth = date('m',strtotime($date));
        $findYear = date('Y',strtotime($date));
        $rows = DB::table('student_attendances as sa')->whereMonth('sa.session_date', $findMonth)
        ->whereYear('sa.session_date', $findYear)->selectRaw($selectCols)->get();
        foreach($rows as $row){
            $status = 'A'; // absent
            if($row->status_id == 1){
                $status = 'P';
            }else if($row->status_id == 2){
                $status = 'PR';
            }
            $row->status = $status;
            $row->check_in = formatMinsTime($row->in_diff_time);
            $row->check_out = formatMinsTime($row->out_diff_time);
            unset($row->in_diff_time);
            unset($row->out_diff_time);
        }

        return $rows;
    }
}
