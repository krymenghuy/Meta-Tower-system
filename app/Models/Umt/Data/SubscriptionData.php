<?php

namespace App\Models\Umt\Data;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\Umt\Data\CustomerData;
use App\Models\Umt\Data\PlanData;
use App\Models\Umt\Data\AppData;
use App\Models\Umt\Data\DataConvertor;

class SubscriptionData //extends Model
{
     //use HasFactory;
     public static $subs_infos = [];
     
     public static $subs_apps = [];
      
     static function createData()
     {  
        //customer's ID is a BINARY(16) data type
        $customer = (object) CustomerData::first();
        $plan = (object) PlanData::first();
        $apps = AppData::list([]);
        self::$subs_infos = [
          [
            'id'=>createUUID(true),
            'customer_id'=>hex2bin($customer->id),
            'start_date'=>getNowTime(),
            'plan_id'=>$plan->id,
            'description'=>'default subscription',
            'status_code'=>'Active',
            'apps'=>$apps
          ]
        ];
       
     }
   
     static function first($bin_cols = []){
        if (!isset(self::$subs_infos[0])) self::createData();
        return DataConvertor::prepare($bin_cols,self::$subs_infos[0]);
     }
}
