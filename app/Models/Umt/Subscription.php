<?php

namespace App\Models\Umt;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
// use Illuminate\Pagination\LengthAwarePaginator;
// use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Facades\Cache;
use App\Models\DV;
use App\Models\DBX;
use DB;

class Subscription //extends Model
{
    //use HasFactory;
    protected $user_info = null, $subs_id =null;
    function __construct($subs_id = null, $user_info=null)
    {
        $this->subs_id = $subs_id;
        $this->user_info = $user_info;
    }

    static function exists($subs_id){
        return DB::table('um_subscriptions')->where('id',hex2bin($subs_id))->value('id');
    }
    static function quickDetails($id){
        return DB::table('um_subscriptions')->where('id',hex2bin($id))->selectRaw(DBX::getHEX('id','id').',customer_id AS subscriber_id')->first();
    }

    function save($arr,$subs_id,$ss){
        $v_rule = [
           'name'=>'1|string|250', 
           'email'=>'1|email',
           'phone_number'=>'1|phone',
           'billing_address'=>'1|string|1-250',
           'plan_id'=>'1|number|exists=um_plans.id'
        ];
        $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $subs_id = saveData($ss,'um_subscriptions',['subs_id'=>$subs_id],[],$inputs,0,false,false);
    }

    //used for merchant registeration via mobile app
    static function defaultSubscription(){
        $col_subs_id = DBX::getHex('id','id');
        $col_subscriber = DBX::getHEX('customer_id','subscriber_id');
        $row = DB::table('um_subscriptions as s')->selectRaw($col_subs_id.','.$col_subscriber)->first();
        if(!$row) return (object)['id'=>null,'subscriber_id'=>null];
        return $row;
    }
    
    static function props($id, $cols = ''){
      if(!$id) return null;
      return DB::table('um_subscriptions as s')->join('um_customers as c','c.id','=','s.customer_id')->where('s.id',hex2bin($id))->selectRaw($cols)->first();  
    }
}
