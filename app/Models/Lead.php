<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;

class Lead extends Model
{
    use HasFactory;
    protected $table = 'leads';
    protected $guarded = ['id'];
    protected $fillable = [];
 
    protected $primaryKey = 'id';
    public $incrementing = true;
    //protected $keyType = 'string';
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d';
    
    protected $attributes = [
        //'inactive' => 0,
        'branch_id'=>0
    ];
 
    // static function createIfNotExists($ss,$inputs,$key_field=[],$transform_cols=[],$v_rules=null){
    //      $key_field="";
    //      $key_value ="";
    //      foreach($key_field as $f=>$v){
    //         $key_field =$f;
    //         $key_value = $v;
    //      }
        
    //      //$prop is the array key within the $inputs array. such as "client_phone".
    //      //$official_field is official column name in the target database table. such as "phone_number"
    //      //The code below is to transform "client_phone" to "phone_number" in order to avoid SQL insert error
    //      foreach($transform_cols as $prop=>$official_field){
    //         $inputs[$official_field] = $inputs[$prop];
    //         unset($inputs[$prop]);
    //      }
         
    //      $inputs['create_user']=$ss->full_name;
    //      $inputs['create_uid']=$ss->user_id;
    //      $inputs['created_at']=time();
    //      $m = self::create($inputs);
    //      if ($m->id>0) return $m->id; 
    // }
}
