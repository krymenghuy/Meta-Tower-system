<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use DB;
class Deposit //extends Model
{
    // use HasFactory;
    static function save($arr=[],$id=null,$ss=null){
        $v_rule = [
            'student_name' => '1|string',
            'level_id' => '1|number|exists=program_levels.id',
            'campus_id' => '1|number|exists=campuses.id',
            'session_id' => '1|number|exists=sessions.id',
            'parent_phone' => '1|string|1,20',
            'amount' => '1|number',
            'date_of_birth' => '1|string',
            'expire_date' => '1|string',
            'note' => '0|string',
            'authorized'=>'0|number|default =0'
        ];

        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $amount = $inputs['amount'];
        unset($inputs['amount']);
        $inputs['date_of_birth'] = date('Y-m-d',strtotime($inputs['date_of_birth']));
        $inputs['expire_date'] = date('Y-m-d',strtotime($inputs['expire_date']));
        $inputs['deposite_amount'] = $amount;
        // $amount

        $inputs['status_id'] = 2; //** default 2 = authorized */
        $newID = saveData($ss,'deposite',['id' => $id],$inputs,[],1);
        if($newID) self::authorize($newID,$ss);
        return DV::depends($newID,null,'Failed to save deposit fee');
    }

    static function authorize($id,$ss){
        DB::table('deposite')->where('id',$id)->update([
          'authorized'=>1,
          'auth_user'=>$ss->full_name,
          'auth_uid'=>$ss->user_id,
          'auth_date'=>getNowTime()
        ]);
        return DV::success();
    }
    static function list_paginate($arr,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $term_id = isset($d->term_id)?$d->term_id:null;
        $academic_year = isset($d->academic_year)?$d->academic_year:null;
        //$campus_id = isset($d->campus_id)?$d->campus_id:null;
        //$level_id = isset($d->level_id)?$d->level_id:null;
        $search_value =isset($d->search_value)?$d->search_value:null;

        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_status =',CASE d.authorized WHEN 1 THEN \'authorized\' ELSE \'pending\'END AS `status`';
        $cols = 'd.id,d.deposite_amount as amount'.$str_status.',d.student_name,d.status_id,l.name as level,d.parent_phone,d.expire_date,formatDate(d.date_of_birth) as date_of_birth';
        $query = DB::table('deposite as d')
                ->join('program_levels as l','l.id','=','d.level_id')
                ->selectRaw($cols)
                ->where('d.branch_id',$branch_id);
        $count_query = clone  $query;
        $count = $count_query->count('d.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function getOldStudentInfo($id,$ss){
        $row = DB::table('students as s')
                ->join('enrollments as e','e.student_id','=','s.id')
                ->where('s.id',$id)
                ->selectRaw('s.id as student_id,s.name as student_name,e.campus_id,e.level_id,e.session_id,s.date_of_birth')
                ->get()->first();
        $row->parent_phone = self::getParentPhone($id);
        return $row;
    }

    static function getParentPhone($student_id){
        $row = DB::table('student_guardians as sg')
                ->join('guardians as g','g.id','=','sg.guardian_id')
                ->selectRaw('phone_number')
                ->get()->first();
        return $row->phone_number;
    }


    static function details($id=null,$ss){
        $branch_id = $ss->branch_id;
        $row = DB::table('deposite as d')
                ->join('program_levels as l','l.id','=','d.level_id')
                ->selectRaw('d.date_of_birth,d.expire_date,d.note,d.level_id,d.campus_id,d.session_id,d.deposite_amount as amount,d.status_id,d.student_name,d.id,l.name as level,d.parent_phone')
                ->where('d.branch_id',$branch_id)
                ->where('d.id',$id)
                ->get()->first();
        $status = $row->status_id == 1 ? 'pending':'authorized';
        $row->status = $status;

        return $row;
    }

    static function delete($id,$ss){
        $branch_id = $ss->branch_id;
        $delete = DB::table('deposite')->where('branch_id',$branch_id)->where('id',$id)->delete();
        return DV::depends($delete,'Deleted');
    }


}
