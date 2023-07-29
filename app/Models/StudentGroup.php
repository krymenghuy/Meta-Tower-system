<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class StudentGroup //extends Model
{
    // use HasFactory;
    static function save($arr=[],$id=null,$ss){
        $v_rule = [
            'name' => '1|string',
            'total_students' => '1|string',
            'program_type' => '0|string',
            'level_id' => '1|number|exists=program_levels.id',
            'session_id' => '1|number|exists=sessions.id',
        ];

        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $newID = saveData($ss,'student_groups',['id' => $id],$inputs,[],1);
        return DV::depends($newID,['action' => 'saved','student_groups' => self::list($ss)]);
    }

    static function list($ss){
        $branch_id = $ss->branch_id;
        $rows = DB::table('student_groups as g')
                ->join('sessions as s','g.session_id' ,'=' ,'s.id')
                ->join('program_levels as pl','pl.id','=','g.level_id')
                ->selectRaw('g.name,g.total_students,g.program_type,s.name as session,pl.name as level')
                ->where('g.branch_id',$branch_id)->get();
        return $rows;
    }

    static function details($id,$ss){
        $branch_id = $ss->branch_id;
        $row = DB::table('student_groups as g')
                ->join('sessions as s','g.session_id' ,'=' ,'s.id')
                ->selectRaw('g.name,g.total_students,g.program_type,s.name as session')
                ->where('g.branch_id',$branch_id)
                ->where('g.branch_id',$branch_id)->first();
        return $row;
    }

    static function delete($id,$ss){
        $branch_id = $ss->branch_id;
        $row = DB::table('student_groups')->where('id',$id)->where('branch_id',$branch_id)->delete();
        return DV::depends($row,['action' => 'Deleted','student_groups' => self::list($ss)]);
    }
}
