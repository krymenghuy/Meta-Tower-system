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
            'name' => '0|string|1-50',
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

        $selectRow = "p.id,p.department_id,d.name as department,p.name,p.created_at,p.create_user";

        $rows = DB::table('programs as p')->join('departments as d','p.department_id','=','d.id')->selectRaw($selectRow)->where('p.branch_id',$branch_id)->get();

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
        $row = DB::table('programs as p')->selectRaw('p.id,p.department_id,p.name')
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

        $row = DB::table('programs')->where('id',$id)->where('branch_id',$branch_id)->delete();
        return DV::depends($row,['action'=>'Program Deleted','programs' => self::list($ss)]);
    }
}
