<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;

class Term //extends Model
{
    protected $id=null,$user_info=null;
    function __construct($id=null,$user_info=null){
        $this->id = $id;
        $this->user_info = $user_info;
    }
    // use HasFactory;
    function save($arr,$id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $v_rule = [
            'period_type' => '0|string|1-25',
            'name' => '1|string|1-50',
            'start_date' => '1|date',
            'end_date' => '1|date',
            'academic_year' => '1|string|1-50',
        ];

        $res = validateObject($arr,$v_rule,false,[],$ss->lang,[],null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;

        convertDate($inputs['start_date']);
        convertDate($inputs['end_date']);

        $newID = saveData($ss,'terms',['id'=>$id],$inputs,[],1);
        return DV::depends($newID,$id?'Updated':'Saved');
    }

    function list($ss=null){
        $ss = $ss?$ss:$this->user_info;
        $branch_id = $ss->branch_id;

        $selectRow = "id,name,period_type,start_date,end_date,academic_year,created_at,create_user";

        $rows = DB::table('terms')->selectRaw($selectRow)->where('branch_id',$branch_id)->get();

        foreach($rows as $row){
            $row->date = explode(' ',$row->created_at)[0];
            unset($row->created_at);
            unset($row->photo_file_name);
        }
        return DV::result($rows);
    }

    function details($id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;
        $selectRow = "id,name,period_type,start_date,end_date,academic_year,created_at,create_user";
        $row = DB::table('terms')->selectRaw($selectRow)
                ->where('branch_id',$branch_id)
                ->where('id',$id)->get()->first();
        return DV::result($row);
    }

    function delete($id=null,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;

        $row = DB::table('terms')->where('id',$id)->where('branch_id',$branch_id)->delete();
        return DV::depends($row,'Term Deleted');
    }
}
