<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DV;
use DB;

class OtherFee //extends Model
{
    //use HasFactory;
    protected $id = null, $user_info = null,$currency_code = 'USD';
    function __construct($id=null,$user_info= null){
      $this->id = $id;
      $this->user_info = $user_info;
    }

    function save($arr=[],$id=null,$ss=null){
        $ss =$ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $v_rule = [
            'program_id'=>'0|number|exists=programs.id',
            'name'=>'1|string|1-200',
            'description'=>'0|string|250',
            'will_expire'=>'0|number|choice|0,1',
            // 'start_date'=>'0|date',
            // 'end_date'=>'0|date',
            'academic_year'=>'0|string|1,25',
            'amount'=>'0|number|default=0',
            'currency_code' => '0|string|default='.$this->currency_code
        ];
        $branch_id = $ss->branch_id;
        $unique = null;//[$branch_id.'|other_fees|name|id=id'];
        $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,$unique);
        if($res->error) return Dv::error($res->error);
        $inputs =$res->values;
        $inputs['will_expire'] = isset($inputs['will_expire']) ? $inputs['will_expire'] : 0;
        $newID = saveData($ss,'other_fees',['id'=>$id],$inputs,[],1,false);
        return DV::depends($newID,['action'=>['id'=>$newID,'Saved'],'non_tuition_list'=>$this->getList()],'Failed to save Other Fee option');
    }

    function delete($id=null,$ss=null){
        $ss =$ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
       $x =  DB::table('other_fees')->where('id',$id)->delete();
       return DV::depends($x,['action'=>'Deleted','non_tuition_list'=>$this->getList()],'failed to delete');
    }

    function getList($ss=null){
        $ss =$ss?$ss:$this->user_info;
       $cols ='f.id,f.academic_year,f.amount,f.currency_code,f.name,f.description,f.create_user,f.created_at,f.program_id';
       $rows = DB::table('other_fees as f')->where('branch_id',$ss->branch_id)
                ->selectRaw($cols)->get();
        foreach($rows as $row){
            $row->program_name = $this->getProgram($row->program_id);
        }
        return $rows;
    }

    function getProgram($id){
        $row = DB::table('programs')->where('id',$id)->selectRaw('name')->first();
        if($row){
            $row = $row->name;
        }
        return null;
    }



    function getDetails($id=null,$ss=null){
        $ss =$ss?$ss:$this->user_info;
        $id =$id?$id:$this->id;
       $cols ='f.id,f.amount,f.academic_year,f.program_id,f.currency_code,f.name,f.description,f.create_user,f.created_at';
       return DB::table('other_fees as f')->where('branch_id',$ss->branch_id)->where('f.id',$id)
            ->selectRaw($cols)->get()->first();
    }
}
