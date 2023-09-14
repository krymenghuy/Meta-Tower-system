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
        //$branch_id = $ss->branch_id;
        $v_rule = [
            'program_id'=>'0|number|exists=programs.id|text=The provided program does not exist',
            'name'=>'1|string',
            'fee_type_id' => '1|number|exists=fee_types.id',
            'description'=>'0|string|250',
            'amount_input_mode'=>'1|choice|manual,auto|default=auto',
            //'will_expire'=>'0|number|choice|0,1',
            'start_date'=>'0|date',
            'end_date'=>'0|date',
            //'academic_year'=>'0|string|1,25',
            'amount'=>'0|number|default=0',
            'currency_code' => '0|string|default='.$this->currency_code
        ];

        $unique = null;//[$branch_id.'|other_fees|name|id=id'];
        $res = validateObject($arr,$v_rule,true,['academic_year'=>['-']],$ss->lang,false,$unique);
        if($res->error) return Dv::error($res->error);
        $inputs =$res->values;
        $inputs['will_expire'] = isset($inputs['will_expire']) ? $inputs['will_expire'] : 0;
        $newID = saveData($ss,'other_fees',['id'=>$id],$inputs,[],1,false);
        if($newID) self::authorize($newID,$ss);
        return DV::depends($newID,['action'=>['id'=>$newID,'Saved'],'non_tuition_list'=>$this->getList()],'Failed to save Other Fee option');
    }

    static function authorize($id,$ss){
        DB::table('other_fees')->where('id',$id)->update([
            'authorized'=>1,
            'auth_date'=>getNowTime(),
            'auth_user'=>$ss->full_name,
            'auth_uid'=>$ss->user_id
        ]);
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

    function getList_paginate($arr = [],$ss=null){
        $ss =$ss?$ss:$this->user_info;
        $branch_id = $ss->branch_id;

        $d = (object)$arr;
        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;
        $str_search ='1=1';

        $search_value = isset($d->search_value)?$d->search_value:null;
        $search_value=$search_value?$search_value:0;
        if($search_value){
            $search_value = escape_like_str($search_value);
            $str_search ="(f.name LIKE '%$search_value%' OR f.description LIKE '%$search_value%')";
        }
        $get_program =',(SELECT `name` FROM programs as p where id = f.program_id LIMIT 1) AS program_name';
        $cols ='f.id,f.academic_year'.$get_program.',f.amount,f.currency_code,f.name,f.description,formatTime(f.updated_at) AS updated_at,f.update_user,f.authorized,f.auth_user,formatTime(f.auth_date) auth_date,f.program_id,f.amount_input_mode';
        $query = DB::table('other_fees as f')->where('f.branch_id',$branch_id)->whereRaw($str_search)->selectRaw($cols);
        $count_query = clone $query;
        $count = $count_query->count('f.id');
        $rows = $query->skip($skip_rows)->take($per_page)->orderByRaw('f.id DESC')->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getProgram($id){
        $row = DB::table('programs')->where('id',$id)->selectRaw('name')->first();
        if($row){
            return $row = $row->name;
        }
        return null;
    }


    function optionsFeeType(){
        return GeneralSettings::options_fee_type();
    }


    function getDetails($id=null,$ss=null){
        $ss =$ss?$ss:$this->user_info;
        $id =$id?$id:$this->id;
       $cols ='f.id,f.amount,f.academic_year,f.program_id,f.currency_code,f.name,f.description,f.amount_input_mode,f.update_user,formatTime(f.updated_at) AS updated_at';
       return DB::table('other_fees as f')->where('branch_id',$ss->branch_id)->where('f.id',$id)
            ->selectRaw($cols)->get()->first();
    }
}
