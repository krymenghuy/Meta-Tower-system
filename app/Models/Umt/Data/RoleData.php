<?php

namespace App\Models\Umt\Data;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\Umt\Data\SubscriptionData;
use App\Models\Umt\Data\DataConvertor;

class RoleData //extends Model
{
    //use HasFactory;

    public static $roles = [];

    static function createData(){
        $subs = SubscriptionData::first();
        self::$roles[] = [
             'id'=>1,
             'subs_id'=>$subs['id'],
             'name'=>'System'  
        ];
    }

    static function first($bin_cols = []){
      self::createData();
      return DataConvertor::prepare($bin_cols,self::$roles[0]);
    }

    static function list($bin_cols = []){
        self::createData();
        return DataConvertor::prepare($bin_cols,self::$roles);
    }

}
