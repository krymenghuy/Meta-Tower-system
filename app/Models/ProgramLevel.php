<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class ProgramLevel //extends Model
{
    // use HasFactory;
    protected $id=null,$user_info=null;
    function __construct($id=null,$user_info=null){
        $this->id = $id;
        $this->user_info = $user_info;
    }

    function save($arr,$id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $v_rule = [
            'program_id' => '1|number|exists=programs.id',
            'name' => '0|string|1-100',
            'prev_level_id' => '0|number|exists=program_levels.id'
        ];

        $res = validateObject($arr,$v_rule,false,[],$ss->lang,[],null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $program_id = $inputs['program_id'];
        $newID = saveData($ss,'program_levels',['id'=>$id],$inputs,[],1);

        return DV::depends($newID,['action'=>$id?'Updated':'Saved','levels'=>$this->list($program_id,$ss)]);
    }

    function list($program_id,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $branch_id = $ss->branch_id;

        $selectRow = "pl.id,pl.program_id,p.name as program,pl.name,pl.created_at,pl.create_user";

        $rows = DB::table('program_levels as pl')->join('programs as p','pl.program_id','=','p.id')->where('p.id',$program_id)->selectRaw($selectRow)->where('p.branch_id',$branch_id)->get();

        foreach($rows as $row){
            $row->date = explode(' ',$row->created_at)[0];
            unset($row->created_at);
            unset($row->photo_file_name);
        }
        return $rows;
    }

    function details($id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;
        $row = DB::table('program_levels as pl')
                ->selectRaw('pl.id,pl.program_id,pl.name')
                ->where('pl.branch_id',$branch_id)
                ->where('pl.id',$id)->get()->first();
        return $row;
    }

    function delete($id=null,$program_id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;

        $exist_in_student_group = DB::table('student_groups')->where('level_id',$id);
        if($exist_in_student_group) return DV::error('Level is in use');

        $row = DB::table('program_levels')->where('id',$id)->where('branch_id',$branch_id)->delete();

        return DV::depends($row,['levels'=>$this->list($program_id,$ss)]);

    }
}
