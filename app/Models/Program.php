<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class Program // extends Model
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
            'department_id' => '1|number|default=1',
            'name' => '0|string|1-200',
            'description' => '0|string|1-250',
            'prev_program_id' => '0|number|exists=programs.id'
        ];

        $res = validateObject($arr,$v_rule,false,[],$ss->lang,[],null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $newID = saveData($ss,'programs',['id'=>$id],$inputs,[],1);
        return DV::depends($newID,['action'=>$id?'Updated':'Saved','programs'=>self::list($ss)]);
    }

    function list($ss=null){
        $ss = $ss?$ss:$this->user_info;
        $branch_id = $ss->branch_id;
        $selectRow = 'p.id,p.department_id,d.name as department,p.description,p.name,p.prev_program_id,(SELECT `name` FROM programs WHERE id = p.prev_program_id LIMIT 1) AS prev_program,formatTime(p.updated_at) AS updated_at,p.update_user,p.create_user';
        return DB::table('programs as p')->join('departments as d','p.department_id','=','d.id')->selectRaw($selectRow)->where('p.branch_id',$branch_id)->get();
 
    }

    function details($id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;
        $row = DB::table('programs as p')->selectRaw('p.id,p.department_id,p.name,p.prev_program_id,p.description')
                ->where('p.branch_id',$branch_id)
                ->where('p.id',$id)->get()->first();
        return $row;
    }

    static function getLevelByProgram($d,$ss){
        $id = $d->id?$d->id:$d->program_id;
        $rows = DB::table('program_levels')->where('program_id',$id)->selectRaw('id,name,program_id')->get();
        return $rows;
    }

    function delete($id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;

        $exists_in_levels = DB::table('program_levels')->where('program_id',$id)->exists();
        if($exists_in_levels) return DV::error('Program is in use');

        $row = DB::table('programs')->where('id',$id)->where('branch_id',$branch_id)->delete();
        return DV::depends($row,['action'=>'Program Deleted','programs' => self::list($ss)]);
    }
}
