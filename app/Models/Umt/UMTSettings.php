<?php

namespace App\Models\Umt;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DBX;
use Config;

class UMTSettings //extends Model
{
  // use HasFactory;
 public static $apps_by_route = [];
 protected static $free_apps = null;
 public static $user_classes = [
    'admin'=>[
        'used'=>1,'name'=>'Staff',
        'token_age'=>null,
        'login_type'=>'name',
        'new_user_password_required'=>1
      ],
    // 'customer'=>[
    //     'used'=>1,
    //     'name'=>'Customer',
    //     'token_age'=>0,
    //     'login_type'=>'phone',
    //     'new_user_password_required'=>1
    // ],
    // 'sales_agent'=>[
    //     'used'=>1,
    //     'name'=>'Sales Agent',
    //     'token_age'=>0,
    //     'login_type'=>'phone',
    //     'new_user_password_required'=>1
    //     ]
];

 /** By setting $profile_tables here, UMT will know which user_class needs to store profile-info in another table besides table "um_users". 
  * If extended user profile is stored in another table, example : "driver" then the driver's official ID (or code) is required to match with the value in "um_users.official_id" 
 */
  static $profile_tables = [
      'merchant' =>['table'=>'sender','key_field'=>'id','code_field'=>'code','photo_field'=>'photo_file_name'],
      'driver' =>['table'=>'driver','key_field'=>'id','code_field'=>'code','photo_field'=>'photo_file_name'],
      'sales_agent' =>['table'=>'sales_agents','key_field'=>'id','code_field'=>'code','photo_field'=>'photo_file_name'],
      'admin' =>['table'=>'um_users','key_field'=>'id','code_field'=>'official_code','photo_field'=>'photo_file_name']
  ];
 
   //### The variables below for JWT merchanism
      public static $use_jwt = 1; //Tell UM class to use JWT mechanism to verify user'stoken
      public static $jwt_encode ='HS256';
      public static $jwt_lifespan =2147483647; //43800; //180*60; // one month = 43800 minutes //default lifespan of JWT token (Time to expire)
      public static $jwt_key ="This is JWT key";
      public static $jwt_payload = [
        "iis"=>"",
        "aud"=>""
        //"iat"=>time(),
        //"nbf"=>time()+60*60
      ];

    //### The vaiables above for JWT merchanism
     
        // //Used when creating new login, whether or not required official ID to link to official profile
        // protected static $required_official_profile = [
        //     'driver'=>1,
        //     'merchant'=>1,
        //     'admin'=>0,
        //     'sales_agent'=>1,
        //     //'admin_support'=>0
        // ];

        // protected static $new_user_required_password = [
        //     'driver'=>1,
        //     'merchant'=>1,
        //     'admin'=>1,
        //     'sales_agent'=>1,
        //     //'admin_support'=>1 /* Backend user's login can be email, phone, or any name */
        // ];


        /** Example, route named  "dms" has some specific app_id  */
    static function getAppIdFromRoute($route_name){
      if (isset(self::$apps_by_route[$route_name])){
          return self::$apps_by_route[$route_name]['app_id'];
      }
      $app_id = null;
      $app_id_field = DBX::getHex('id','app_id'); 
      $row = DB::table('um_applications as app')->where('home_route',$route_name)->selectRaw($app_id_field.', name')->take(1)->first();
      if ($row){
          $app_id = $row->app_id;
          self::$apps_by_route[$route_name] = ['app_id'=>$app_id,'name'=>$row->name]; 
      }
      return $app_id;
  }

  public static function getFreeApps(){
      if(self::$free_apps) return self::$free_apps;
      self::$free_apps = [Config::get('app.merchant_app_id'), Config::get('app.merchant_portal_app_id'),Config::get('app.driver_app_id'),Config::get('app.sales_app_id')];
      return self::$free_apps;
  } 
  public static function correctUserClass($user_class) {
    if(!$user_class) return false;
    return isset(\App\Models\Umt\UMTSettings::$user_classes[strtolower($user_class)]);
  }
  
  static function options_role_group($ss){
    $subs_id = $ss->subs_id;
    return DB::table('um_role_groups as g')->where('subs_id',hex2bin($subs_id))->selectRaw('g.id,g.name as role_group_name')->get();
  }

  static function options_role($ss){
    $subs_id = $ss->subs_id;
    return DB::table('um_roles as r')->where('subs_id',hex2bin($subs_id))->selectRaw('r.id,r.name as role_name')->get();
  }
  
  static function options_user_class($d=null){
    $items = [];
    foreach(self::$user_classes as $key=>$item){
      if ($item['used'] ===1) $items[] = (object)['user_class'=>$key,'user_class_name'=>$item['name']];
    }
    return $items;
  }
  static function options_branch($ss){
    $subs_id = $ss->subs_id;
    return DB::table('um_branches as b')->join('um_subscriptions as sb','sb.id','=','b.subs_id')->where('sb.id',hex2bin($subs_id))->selectRaw('b.id,b.name as branch_name')->get();
  }

  static function options_user($user_class,$ss){
    $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
    $q = DB::table('um_users as u')->where('u.subs_id',hex2bin($subs_id))->selectRaw('id,login_name,full_name AS user_name,email,phone_number');
    if($user_class) $q->where('u.user_class',$user_class);
    return $q->get();
  }

  static function options_app($ss){
    $subs_id = $ss->subs_id;
    return DB::table('um_applications as app')->join('um_subs_apps as sa','sa.app_id','=','app.id')->where('sa.subs_id',hex2bin($subs_id))->selectRaw( DBX::getHEX('app.id','id'). ', app.name AS app_name')->get();
  }

  static function options_web_app($ss){
    $subs_id = $ss->subs_id;
    return DB::table('um_applications as app')->join('um_subs_apps as sa','sa.app_id','=','app.id')->where('sa.subs_id',hex2bin($subs_id))->where('app.is_mobile_app',0)->selectRaw( DBX::getHEX('app.id','id'). ', app.name AS app_name')->get();
  }

  static function options_mobile_app($ss,$filter_code = null){
    $subs_id = $ss->subs_id;
    $q = DB::table('um_applications as app')->join('um_subs_apps as sa','sa.app_id','=','app.id')->where('sa.subs_id',hex2bin($subs_id))->where('app.is_mobile_app',1)->selectRaw( DBX::getHEX('app.id','id'). ', app.name AS app_name');
    if($filter_code ==='promo'){
      $merchant_app_id = Config::get('app.merchant_app_id');
       $q->whereIn('app.id',[hex2bin($merchant_app_id)]);
    }
    return $q->get();
  }

  static function getComboItems_userclass($d=null){
    $items = [];
    foreach(self::$user_classes as $key=>$item){
      if ($item['used'] ===1) $items[] = (object)['user_class'=>$key,'user_class_name'=>$item['name']];
    }
    return $items;
  }
}