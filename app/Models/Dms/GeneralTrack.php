<?php

namespace App\Models\Dms;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use DB;

class GeneralTrack //extends Model
{
    //use HasFactory;
    protected $id = null, $userInfo = null;
    function __construct($id=null, $userInfo=null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    
    static function delete($id,$ss){
       DB::table('general_tracks')->where('id',$id)->delete();
       return DV::success(); 
    }

    static function save($ss,$action_name,$des,$table_name,$pk_field,$pk_value, $pk_field_type='int'){
        try{
           $pk_field_type = $pk_field_type ?? 'int'; 
           $inputs= ['target_table'=>$table_name,'pk_field'=>$pk_field,'pk_value'=>$pk_value,'action_name'=>$action_name,'description'=>$des,'pk_field_type'=>$pk_field_type];
           $id = saveData($ss,'general_tracks',['id'=>null],$inputs,[],1,false);
           return null;
        }catch(\Exception $e){
           Log::error('Failed to create general track of action "'.$action_name.'" done by '.$ss->full_name);
               Log::error($e->getMessage());
               Log::error($e->getTraceAsString());
        }
    }
    static function list($arr,$ss){
        $cols = 't.id, t.create_date,t.create_user,t.action_name,t.description';
        $rows = DB::table('general_tracks AS t')->selectRaw($cols)->get();
        return $rows;
    }
}
