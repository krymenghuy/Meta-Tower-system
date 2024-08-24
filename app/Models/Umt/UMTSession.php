<?php

namespace App\Models\Umt;
use Firebase\JWT\JWT;
//use Firebase\JWT\Key;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\Umt\UMTSettings;
use App\Models\DBX;
use DB;

class UMTSession //extends Model
{
    //use HasFactory;
    
    static function get($token){
        return DB::table('um_sessions AS ss')->join('um_users as u', 'u.id', '=', 'ss.user_id')->where('ss.access_token', $token)->selectRaw("ss.lang,ss.user_id,u.full_name,u.user_class,u.login_name,ss.branch_id, u.official_id,u.official_code")->take(1)->first();
    }

    static function clearOldSessions(){
        DB::table('um_sessions')->whereRaw('DATEDIFF(now(),start_time) > 90')->delete();
    }

    static function createUserToken(){
        return  getUniqueString(38);
    }
      
   //Create token|createToken()| createJWT()
   //NOTE: $userInfo is array ['branch_id','official_id','user_class','full_name',...]
   static function createJWT($userInfo = [], $lifespan = null) {
        $nowTime = time();
        UMTSettings::$jwt_payload['iat'] = $nowTime; // Issue At
        UMTSettings::$jwt_payload['nbf'] = $nowTime; // Not Before

        $arr = (array)$userInfo;
        $user_class = $arr['user_class'];

        if ($lifespan === null) {
            $u_class =strtolower($user_class);  
            $info = isset( UMTSettings::$user_classes[$u_class])?  UMTSettings::$user_classes[$u_class]:null;
            $lifespan = $info?$info['token_age']:0;
        }

        if ($lifespan === 0) {
            $exp = $nowTime + 60 * 60 * 24 * 365 * 10; // Set token to expire in 10 years
        } elseif ($lifespan > 0) {
            $exp = $nowTime + $lifespan;
        } else {
            $exp = $nowTime + 180 * 60; // Default expiration if lifespan is negative
        }

        UMTSettings::$jwt_payload['exp'] = $exp; // Expire At

        foreach ($arr as $p => $value) {
            UMTSettings::$jwt_payload[$p] = $value;
        }

     return JWT::encode( UMTSettings::$jwt_payload,  UMTSettings::$jwt_key,  UMTSettings::$jwt_encode);
  }


    //UM::setUserSession() is a static function and is the same as UM->createSession()
    //create session can be => (1) create in database table um_sessions, (2) create session as file, which can be faster but cannot be queried
    //NOTE: parameter @user is object with minimum fields such as {'branch_id','id','lang','login_name'}
    //UM::setUserSession() is a static function and is the same as UM->createSession()
    //create session can be => (1) create in database table um_sessions, (2) create session as file, which can be faster but cannot be queried
    //NOTE: parameter @user is object with minimum fields such as {'branch_id','id','lang','login_name'}
    static function setUserSession($app_id,$user){
        //TODO: Do not allow creating session if user is not logged in
      $access_token = '';
      if (UMTSettings::$use_jwt===1) $access_token  = self::createJWT($user);
      else $access_token = self::createUserToken();
      $nowTime = getNowTime();

      //delete sessions that are older than 3 months from table "um_sessions"
      self::clearOldSessions();
      DB::table('um_users')->where('id',$user->id)->update(['last_login_date'=>$nowTime]);
      $csrf_code = getUniqueString(38);
      $session_id = getUniqueString(38);

      $lang = isset($user->lang)?$user->lang:'en';
      if(empty($user->login_name)) return DV::error('Failed to create session info',$lang,401);
        DB::table('um_sessions')->where('login_name',$user->login_name)->where('app_id',$app_id)->delete();
        //$bin_app_id = hex2bin($app_id);   
        DB::table('um_sessions')->insert([
          'branch_id'=>$user->branch_id,
          'app_id'=>hex2bin($app_id),
          'user_id'=>$user->id, //ineteger user_id
          'login_name'=>$user->login_name,
          'start_time'=>$nowTime,
          'last_active_time'=>$nowTime,
          'csrf_code'=>$csrf_code,
          'lang'=>$user->lang,
          'session_id'=>$session_id,
          'access_token'=>$access_token
        ]);
        return (object)['status'=>'OK','access_token'=>$access_token,'error_message'=>null];
   }

    // function getGUID()
    // {
    //     $bytes = random_bytes(20);
    //     return bin2hex($bytes);
    //    //$q = $this->db->query("SELECT REPLACE(UPPER(UUID()),'-','') as GUID limit 1");
    //    //return substr($q->result()[0]->GUID,0,35);
    // }

}
