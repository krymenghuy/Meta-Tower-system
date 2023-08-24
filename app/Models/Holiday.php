<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class Holiday //extends Model
{
    // use HasFactory;
    protected $id = null,$ss = null;
    function __construct($id = null,$ss=null){
        $this->id = $id;
        $this->ss = $ss;
    }

    function save($arr=[],$id=null,$ss=null){
        $id = $id?$id:$this->id;
        $ss = $ss?$ss:$this->id;
        $v_rule = [
            "name" => '1|string|1,150',
            'date' => '0|date'
        ];

        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $newID = saveData($ss,'holidays',['id' => $id],$inputs,[],1);

        return DV::depends($newID,['action' => 'Save']);
    }

    function list($ss=null){
        $ss = $ss?$ss:$this->id;
        $rows = DB::table('holidays')->where('branch_id',$ss->branch_id)
                ->selectRaw('name,id,date')
                ->get();
        return $rows;
    }

    function details($id=null,$ss=null){
        $id = $id?$id:$this->id;
        $ss = $ss?$ss:$this->id;
        $row = DB::table('holidays')->where('branch_id',$ss->branch_id)
                ->selectRaw('name,id,date')
                ->first();
        return $row;
    }

    function delete($id=null,$ss=null){
        $id = $id?$id:$this->id;
        $ss = $ss?$ss:$this->id;
        $rows = DB::table('holidays')->where('branch_id',$ss->branch_id)
                ->selectRaw('name,id,date')
                ->get();
        return $rows;
    }
}
