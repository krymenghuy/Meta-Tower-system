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
            // 'name' => '1|string',
            // 'total_students' => '1|string',
            'program_type' => '0|string',
            'level_id' => '1|number|exists=program_levels.id',
            'session_id' => '1|number|exists=sessions.id',
            'term_id' => '1|number|exists=terms.id',
            'check_in_time' => '1|string',
            'check_out_time' => '1|string',
        ];

        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $level_id = $inputs['level_id'];
        $session_id = $inputs['session_id'];

        $newID = saveData($ss,'student_groups',['id' => $id],$inputs,[],1);
        if($newID){
            $count = DB::table('group_members')->where('group_id',$newID)->count();
            DB::table('student_groups')->where('id',$newID)->update([
                'name' => self::setUniqueGroupNumber(5, $level_id,$session_id,$ss).$newID,
                'total_students' => $count
            ]);
        }
        return DV::depends($newID,['action' => 'saved','student_groups' => self::list($ss)]);
    }

    static function list($ss){
        $branch_id = $ss->branch_id;
        $rows = DB::table('student_groups as g')
                ->join('sessions as s','g.session_id' ,'=' ,'s.id')
                ->join('program_levels as pl','pl.id','=','g.level_id')
                ->selectRaw('g.id,g.name,g.total_students,g.program_type,s.name as session,pl.name as level')
                ->where('g.branch_id',$branch_id)->get();
        return $rows;
    }

    static function details($id,$ss){
        $branch_id = $ss->branch_id;
        $row = DB::table('student_groups as g')
                ->selectRaw('g.level_id,g.session_id,g.name,g.total_students,g.program_type')
                ->where('g.branch_id',$branch_id)
                ->where('g.branch_id',$branch_id)->first();
        return $row;
    }

    static function delete($id,$ss){
        $branch_id = $ss->branch_id;
        $row = DB::table('student_groups')->where('id',$id)->where('branch_id',$branch_id)->delete();
        return DV::depends($row,['action' => 'Deleted','student_groups' => self::list($ss)]);
    }


    static function setUniqueGroupNumber($len=null,$level_id,$session_id,$ss){
        if (!$len) $len = 5;
        $level = GeneralSettings::getLevel($level_id,$ss);
        $level_name = strtoupper(substr($level->name,0,2));
        $session = GeneralSettings::getSession($session_id);
        $session = $session->name;
        $string = $session;
        $letters = implode(" ", array_map(function ($word) {
            return strtoupper($word[0]);
        }, explode(" ", $string)));
        $session_prefix = str_replace(" ", "", $letters);
        $group_name = $level_name.'.'.$session_prefix;
        return $group_name;
    }


    static function assignGroupToStudent($arr,$ss){
        $v_rule = [
            'student_id' => '1|number|exists=students.id',
            'group_id' => '1|number|exists=student_groups.id',
        ];
        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $newID = saveData($ss,'group_members',['id' => null],$inputs,[],1);
        return DV::depends($newID,['action'=> 'Assigned']);
    }

    static function groupMemberList($ss){
        $branch_id = $ss->branch_id;
        $rows = DB::table('group_members as gm')->join('students as s','s.id','=','gm.student_id')->where('branch_id',$branch_id);
        return $rows;
    }
}
