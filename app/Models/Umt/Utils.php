<?php

namespace App\Models\Umt;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
// use Illuminate\Support\Facades\Log;
use App\Models\DBX;
use Illuminate\Support\Facades\Cache;
//use Config;
use DB;

class Utils //extends Model
{
    //use HasFactory;
    public static function getRoleName($role_id){
      return DB::table('um_roles as r')->where('id',$role_id)->take(1)->value('name');
    }

    public static function correctUserClass($user_class) {
      if(!$user_class) return false;
      return isset(\App\Models\Umt\UMTSettings::$user_classes[strtolower($user_class)]);
    }
 
    public static function getAppId($prn_id,$mod_id){
        $key ='appidsprns1127';
        $rows = Cache::get($key,null);
        if($rows ==null){
          $rows =  $rows = DB::table('um_permissions as prn')->join('um_app_modules as m','m.id','=','prn.module_id')->selectRaw( DBX::getHEX('m.app_id','app_id').',prn.module_id, prn.id as permission_id')->get();
          Cache::put($key,$rows,60*30); 
        }
        $founds = $rows->filter(function($x) use($prn_id,$mod_id){
            if($prn_id) return $x->permission_id == $prn_id;
            else return $x->module_id == $mod_id;
        });
        if(isset($founds[0])) return $founds->first()->app_id;
        else return null; 
     }

    public static function getAppIdByPermission($prn_id){
        return self::getAppId($prn_id,null); 
     }
    public static function getAppIdByModule($mod_id){
        return self::getAppId(null,$mod_id); 
     }
}
