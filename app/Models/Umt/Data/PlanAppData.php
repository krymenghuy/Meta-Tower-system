<?php

namespace App\Models\Umt\Data;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\Umt\Data\AppData;
use App\Models\Umt\Data\PlanData;
use App\Models\Umt\Data\DataConvertor;

class PlanAppData //extends Model
{
    //use HasFactory;
    public static $planApps = [];

    static function createData()
    { 
        $apps = AppData::list();
        $plan = PlanData::first();
        foreach($apps as $app){
            self::$planApps[] =  [
                'app_id'=>$app['id'],
                'subs_id'=> $plan['id'],
                'is_super_admin'=>1
            ];
        }
       
    }

    static function list($bin_cols = []){
        self::createData(); 
        return DataConvertor::prepare($bin_cols,self::$planApps);
    }
}
