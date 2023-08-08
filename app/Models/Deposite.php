<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class Deposite //extends Model
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
        return DV::depends($newID,['action' => 'saved','campuses' => self::list($ss)]);
    }

    static function list($ss){
        $branch_id = $ss->branch_id;
        $rows = DB::table('deposite as d')
                ->join('program_levels as l','l.id','=','d.level_id')
                ->selectRaw('d.deposite_amount as amount,d.status_id,d.student_name,d.id,l.name as level,d.parent_phone,d.expire_date,d.date_of_birth')
                ->where('d.branch_id',$branch_id)
                ->get();
        foreach($rows as $row){
            $status = $row->status_id == 1 ? 'pending':'authorized';
            $row->status = $status;
        }
        return $rows;
    }

    static function getOldStudentInfo($id,$ss){
        $row = DB::table('students as s')
                ->join('enrollments as e','e.student_id','=','s.id')
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
