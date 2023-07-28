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
    protected $id = null, $user_info = null;
    function __construct($id=null,$user_info= null){
      $this->id = $id ;
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
            'start_date'=>'0|date',
            'end_date'=>'0|date',
            'amount'=>'0|number|default=0',
        ];
        $branch_id = $ss->branch_id;
        $umique = [$branch_id.'|other_fees|name|id=id'];
       $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,$umique);
       if($res->error) return Dv::error($res->error);
       $inputs =$res->values;
       $id = saveData($ss,'other_fees',['id'=>$id],$inputs,[],1,false);
       return DV::depends($id,['id'=>$id],'Failed to save Other Fee option'); 
    }

    function delete($id=null,$ss=null){
        $ss =$ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
       $x =  DB::table('other_fees')->where('id',$id)->delete();
       return DV::depends($x,null);
    }

    function getList($ss=null){
        $ss =$ss?$ss:$this->user_info;
       $cols ='f.id,f.program_id,f.amount,f.currency_code,f.name,f.description,f.create_user,f.created_at';
       return DB::table('other_fees as f')->where('branch_id',$ss->branch_id)->selectRaw($cols)->get();
       
    }

    function getDetails($id=null,$ss=null){
        $ss =$ss?$ss:$this->user_info;
        $id =$id?$id:$this->id;
       $cols ='f.id,f.amount,f.program_id,f.currency_code,f.name,f.description,f.create_user,f.created_at';
       return DB::table('other_fees as f')->where('branch_id',$ss->branch_id)->where('f.id',$id)->selectRaw($cols)->get()->first();
       
    }
}
