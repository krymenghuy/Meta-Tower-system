<?php

namespace App\Models\Umt\Data;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\Umt\Data\DataConvertor;

class PlanData //extends Model
{
    public static $planInfos = [
      [
         'id'=>1,
         'name'=>'Default Plan'
      ]
    ];
    //use HasFactory;
 

    static function first($bin_cols = []){
        return DataConvertor::prepare($bin_cols,self::$planInfos[0]);
    }
}
