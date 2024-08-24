<?php
namespace App\Services\Umt;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
 
use App\Models\DV;
use App\Models\DBX;
use App\Models\Umt\UMTSettings;
use App\Models\Umt\User;
use App\Models\Umt\UMTSession;
use App\Models\Umt\Utils;
use Illuminate\Support\Facades\Session; /** Access to Laravel session cookie */
//use App\Models\SMS;
//use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Config;
use DB;
class AuthService {

  protected static $cookie_name = null;

  static function getCookieName(){
     self::$cookie_name = self::$cookie_name ?? Config::get('app.cookie_name');
     return self::$cookie_name;
  }

  static function user(){
     return Session::get('user');
  }

  /** add additional props to current User object */
  static function setUserInfo($key,$value){
    $user = self::user();
    if($user){
      $user->{$key} = $value;
      Session::put('user',$user);
      if($key ==='lang') Session::put('lang',$value);
    } 
  }

  // function encryptToken($token)
  // {
  //     return Crypt::encryptString($token);
  // }

  // function decryptToken($encryptedToken)
  // {
  //     return Crypt::decryptString($encryptedToken);
  // }

   static function getLinkedUser($user_id,$subs_id){
      return User::getLinkedUser($user_id,$subs_id);
   }

  /** verifyAuth() is to verify request object by checking if $request->user really exists. If not, it return status_code 401. 
   * If  $request->user  exists, it means the user is authenticate, so check if the user has relevant Permission. If not return status_code 403 
   * verifyAuth() is intended for use in Controller only in other to check user's permission.
   * It is assumed that user has already been authenticated by middleware "APIAuthenticate", when the request arrives at Controller 
   * */
  static function verifyAuth($request, $prn_code=null){
     $user = $request->user;
     if(!$user) return DV::authFailed($request->lang);
     $byPass = ($user->is_super_admin ?? $user->is_master_account);
     $needs_check = !$byPass && $prn_code !==-1;
     if($needs_check) if(!self::allowed($prn_code,$user->id)) return DV::permissionRequired($prn_code,$user->lang);
     $user->status_code =200;
     $default_branch_id= User::getDefaultBranchId($user->id,30) ?? 0;
     $user->branches = User::getBranches($user->id,30);
     $user->branch_id = $default_branch_id;
     $user->default_branch_id = $default_branch_id;
     return $user;
  }

  /** getAppAuthData() is for Web-based session only. getAppAuthData() return authenticated user information, and permissions, accessible modules for one app only */
  static function getAuthData($app_id){
    $current_user = Session::get('user');
    unset($current_user->access_token);
    unset($current_user->hpwd);
     if($app_id){
         $free_apps = UMTSettings::getFreeApps();
         /* Check if the app_id is mobile apps or merchant/customer portal then No need to control permissions. Client can access to all features on mobile apps and on their Portal */
         if (in_array($app_id,$free_apps)){
            $current_user->is_super_admin =1;
            return $current_user;
         }
         $user_id = $current_user->id;
         $prns = User::getPermissions( $user_id,$app_id);
         $mods = User::getAccessibleModules( $user_id,$app_id);
         $branches = User::getBranches($user_id,15);
         $current_user->prns = $prns;
         $current_user->mods = $mods;
         $current_user->branches = $branches;
         $current_user->is_super_admin =User::isAppAdmin($current_user->id,$app_id)? 1:0;
         if(!$current_user->is_super_admin){
          $current_user->is_super_admin = User::isMasterAccount($current_user->id)? 1:0;
         }
         $current_user->current_app_id = $app_id;
     }
     return $current_user;
  }
 
 static function getBranchId(){
    $user = Session::get('user');
    return $user->branch_id;
 }

  /** After login success, set user information object in the laravel session that is stored in http-only cookie */
  static function login($user){
    Session::put('lang',$user->lang);
    Session::put('user',$user);
    //Log::info('set session data: '.json_encode(Session::get('user')));
  }
    /** 
    * getUserInfoByToken() returns user info (user details) based on two factors:
    * 1. based on given access_token stored in $request->acc_tk_dms
    * 2. based on given @user_class = {driver, or merchant or (admin or NULL) }
    * This method is used in mobile app's api authentication, which does not depends on web session
    **/
    static function getUserInfoByToken($request, $prn_code = -1, $prn_error_message = null)
    {
      $def_lang = 'en';
      //$access_token = self::decryptToken($request);
      $access_token = $request->bearerToken();
      if (!$access_token) return DV::error('User authentication failed', $def_lang, 401);
      if (UMTSettings::$use_jwt === 1) {
            /*
                NOTE: This will now be an object instead of an associative array. To get
                an associative array, you will need to cast it as such:
            */

        JWT::$leeway = 60; // $leeway in seconds
        $decoded = $request->user;
        if(!$decoded){ 
          try {
            $decoded = JWT::decode($access_token, new Key(UMTSettings::$jwt_key, UMTSettings::$jwt_encode));
          } catch (\Exception $e) {
              return DV::error($e->getMessage(), $def_lang, 403);
          }
        }
      if (!isset($decoded->user_id)) $decoded->user_id = $decoded->id;

        //#begin:: Get special active fields "is_locked,status,lang". These fields need to be updated in the decoded JWT token on every api call
        $decoded->status = 'inactive';
        $row = User::getUserInfo_quick($decoded->user_id, 'is_locked,status,lang,is_master_account');
        if ($row) {
          $decoded->lang = $row->lang;
          $decoded->is_locked = $row->is_locked;
          $decoded->status = $row->status;
          $decoded->is_master_account = $row->is_master_account;
        }else return DV::error('User identity does not exist');
        if (in_array(strtolower($decoded->status),['inactive','disabled','locked']) || $decoded->is_locked == 1) return DV::error('It seems your token expired or your status is inactive. But you may try login again to verify your credentials', $def_lang, 400);
        //#end::Get special active fields "is_locked,status,lang". These fields need to be updated in the decoded JWT token on every api call
        $ret = (object)['status_code' => 200, 'status' => 'OK'];

        if (!self::allowed($prn_code,null,$decoded->user_id)) {
            $prn_error_message = 'Permission ' . $prn_code . ' is required!';
            try{
              DV::error($prn_error_message, $def_lang,402);
            }catch(\throwable $e){
              Log::info($e->getMessage());
              DV::error($e->getMessage(), $def_lang);
            }
     
        }
        foreach ((array)$decoded as $prop => $value) $ret->{$prop} = $value;
        return $ret;
      } else {
        //NOTE: verifyUserToken() will check if the given token is Not yet expired, and is valid, then return the valid token
        $res = self::verifyUserToken($access_token);
        if ($res->status === 'Error') return DV::error($res->error_message, $def_lang, $res->error_code);

        $access_token = $res->access_token;

        if (!self::allowed($prn_code,null)) {
          if (!$prn_error_message) $prn_error_message = 'Permission ' . $prn_code . ' is required!';
          return DV::error($prn_error_message, $def_lang,402);
        }
       
        $umt_session = UMTSession::get($access_token);

        if ($umt_session) {
          return (object)[
            'status_code' => 200, 'status' => 'OK',
            'user_id' => $umt_session->user_id,
            'lang' => $umt_session->lang,
            'branch_id' => $umt_session->branch_id,
            'official_id' => $umt_session->official_id,
            'user_class' => $umt_session->user_class,
            'login_name' => $umt_session->login_name, 'full_name' => $umt_session->full_name
          ];
        }
        else return DV::error('User authentication failed', null, 401);
      }
    }
 
    /**Check for http cookie that stores token, if this cookie exists with request header, then return the token from this cookie
     * NOTE that when this web cookie exists, it means user request via Web HTTP or web browser or Admin panel api requests
     */
    static function getWebToken($request,$encrypted_token = false){
         $cookie_name = self::getCookieName();
         $access_token = $request->cookie($cookie_name);
         if ($encrypted_token === true) $access_token = decrypt($access_token);
         return $access_token;
    }

    static function authenticateRequest($request,$encrypted_token = false, $def_lang = 'en'){
        $access_token = self::getWebToken($request,$encrypted_token);
        return self::authenticateToken($access_token,$encrypted_token,$def_lang);
    }

    static function authenticateToken($access_token, $encrypted_token = false,$def_lang ='en')
    {
      if ($encrypted_token === true) $access_token = decrypt($access_token);
      if(UMTSettings::$use_jwt !== 1) return DV::error('Server-side authentication is not configured to use JWT',$def_lang,401);
      if (!$access_token) return DV::error('User authentication failed', $def_lang, 401);
       
            JWT::$leeway = 60; // $leeway in seconds
            $decoded = null;
            try {
              $decoded = JWT::decode($access_token, new Key(UMTSettings::$jwt_key, UMTSettings::$jwt_encode));
            } catch (\Exception $e) {
                return DV::error($e->getMessage(), $def_lang, 401);
            }

          if (!isset($decoded->user_id)) $decoded->user_id = $decoded->id;
    
            //#begin:: Get special active fields "is_locked,status,lang". These fields need to be updated in the decoded JWT token on every api call
            $decoded->status = 'inactive';
            $user_cols = DBX::getHex('subs_id','subs_id').',is_locked,status,lang,is_master_account,login_name,full_name,email,phone_number,official_id,official_code';
            $row = User::getUserInfo_quick($decoded->user_id, $user_cols);
            if ($row) {
              $props = (array)$row;
              foreach($props as $key => $value) $decoded->$key = $value;
            }else return DV::error('User identity does not exist',$def_lang,401);
            if (in_array(strtolower($decoded->status),['inactive','disabled','locked']) || $decoded->is_locked == 1) return DV::error('It seems your token expired or your status is inactive. But you may try login again to verify your credentials', $def_lang, 401);
            //#end::Get special active fields "is_locked,status,lang". These fields need to be updated in the decoded JWT token on every api call
            $ss = (object)['status_code' => 200, 'status' => 'OK','user'=>$decoded]; 
            return $ss;       
    }
  
    static function allowed($prn_id, $user_id = null){
      if ($prn_id == -1) return true;
      if (!$user_id){
          $user = self::user();
          if( $user && ($user->is_master_account ?? $user->is_super_amin) ==1) return true;
          $user_id = $user? $user->id:null;
      }
      if(!$user_id) return false;
      $app_id = Utils::getAppId($prn_id,null);
      if (User::isAppAdmin($user_id,$app_id)) return true;
     
      if (!$prn_id) return false;
      $key = 'user_prns_'.$user_id;
      $prns = Cache::get($key,null);
      if(!$prns){
         $prns = User::getPermissions($user_id,null,null); 
         Cache::put($key,$prns,30);
      }
      $founds = $prns->filter(function($r) use($prn_id){
         return $r->permission_id == $prn_id;
      });
      if($founds) return $founds->first()? true: false;
      return false;
  }

    static function access_mod($mod_id, $user_id = null,$module_ids = null) {
      if(!$user_id){
        $user = self::user();
        $user_id = $user? $user->id : null;
      };

      if($module_ids){
         foreach($module_ids as $mid){
           $x = self::access_mod($mid, $user_id);
           if($x) return true;
         }
         return false;
      }
       
      if (!$mod_id || !$user_id) return false;
      $x = User::isMasterAccount($user_id);
      if($x) return true;
      
      $app_id = Utils::getAppId(null,$mod_id);
      if (User::isAppAdmin($user_id,$app_id)) return true;

      $key = 'user_mods_' . $user_id;
      $mods = Cache::remember($key, 30, function () use ($user_id,$app_id) {
        return User::getAccessibleModules($user_id,$app_id,'module_id');
      });
      $row = $mods->filter(function($m) use($mod_id){
        return $m->module_id == $mod_id;
      });
      return count($row)>0? true:false;
  }
    
   //checkUser , validateUser, checkPassword, login, Signin
   /** login() | verifyUser() check user login and pwd and then returns object $result = {status, error_message, user} **/
   static function verifyUser($default_app_id,$login_name,$password,$lang='en'){
        //$user_id = null;
        //NOTE: $login_name = {loginName, PhoneNumber,email}
        if(empty($login_name)) return DV::error('User name is not valid',$lang,400);
        $row = User::specialDetails($login_name);
        if(!$row) return DV::error('User name ? does not exist::'.$login_name,$lang,400);

        $default_app =null;
        $default_app_id = $default_app_id ?? $row->default_app_id;
        $apps = User::getAccessibleApps($row->id);
 
        $app_count = isset($apps[0])? $apps->count() : 0;
        if($app_count === 0) return DV::error('It seems you dont have access to any applications');
        if($app_count === 1 && !$default_app_id){
            $default_app = $apps[0];
            $default_app_id = $apps[0]->id;
        } else if ($app_count > 1){
             $founds = $apps->filter(function($x) use($default_app_id){
                return $x->app_id === $default_app_id;
             });
             if($founds) $default_app = $founds->first();
            
        };
        $default_app =null;
        //begin:: Check if the user is LOCKED OUT or DISABLED
            //$user_id = $row->id;
            if($row->is_locked===1 || $row->is_locked ===true) return DV::error("Your account has been locked out.",$lang,400);
            if(trim(strtolower($row->status)) != 'active') return DV::error("Your account has been disabled",$lang,400);

            $hpwd = '#$%&FDHK SDSFSF 2998FGK$343%$333';
            $hpwd = $row->hpwd;
            unset($row->hpwd);

            if(password_verify($password,$hpwd)){
                    //Login succeeded => create user session either in file or database table
                    $sess =  UMTSession::setUserSession($default_app_id,$row);
                    if($sess->status ==='OK')
                     {
                        $default_branch_id = User::getDefaultBranchId($row->id,0);
                        //return object {access_token,user}
                        $row->user_id = $row->id;
                        $row->branch_id = $default_branch_id;
                        $row->branches = User::getBranches($row->id,5);
                        $row->apps = $apps;
                        $row->default_app = $default_app;
                        $row->mods = User::getAccessibleModules($row->id); // $this->getAccessibleModulesByUserId_internal($row->user_id);
                        $row->prns =  User::getPermissions($row->id); // $this->getPermissionsByUserId_internal($row->user_id);
                        $row->access_token = $sess->access_token;
                        $token_age = UMTSettings::$user_classes[strtolower($row->user_class)]['token_age'];
                        $refresh_token =UMTSession::createJWT(['id'=>$row->id,'lang'=>$row->lang,'login_name'=>$row->login_name,'user_class'=>$row->user_class,'official_id'=>$row->official_id,'official_code'=>$row->official_code,'full_name'=>$row->full_name,'email'=>$row->email,'phone_number'=>$row->phone_number],$token_age);
                        $isSuperAdmin = $default_app_id? (User::isAppAdmin($row->id,$default_app_id)? 1 : 0 ): 0;
                        $row->is_master_account = User::isMasterAccount($row->id) ? 1:0; 
                        $row->is_super_admin = $isSuperAdmin;
                        $row->image_url = User::getPhoto($row->id,'id',$row->user_class);
                        // if(self::$use_jwt===1)
                        //   $row->access_token = self::createJWT($row,60);
                        // else
                        //    $row->access_token = $sess->access_token;
                        return (object)['status'=>'OK','status_code'=>200,'user'=>$row,'refresh_token'=>$refresh_token,'is_system_admin'=>$isSuperAdmin];
                        //return DV::success(['user'=>$row,'refresh_token'=>$refresh_token],200);
                    }
                    else return DV::error($sess->error_message,$lang,400);
            } else return DV::error('Password is not correct!',$lang,401);

       //end:: Check if the user is LOCKED OUT or DISABLED
       return DV::error('Login name is not correct!',$lang,401);

   }
   
    /**
     * TOD: verifyUserToken() is not yet complete function
    */
    static function verifyUserToken($token=null){
        return (object)['access_token'=>$token,'status'=>'OK','error_message'=>null,'status_code'=>200];
        //in case of error:
            //"User unthenticated"  =>  return (object)['status'=>'Error','access_token'=>$token,'error_message'=>"User authentication failed",'status_code'=>401];
        //In case of Token Expired => also use error 401 (User authentication failed)
    }

    static function matchOTP($login_name,$otp_code,$user_class=null){
      $str_user_class ='1=1';
      if($user_class) $str_user_class ='u.user_class =\''.$user_class.'\'';
      return DB::table('um_users AS u')->where('u.login_name',$login_name)->whereRaw($str_user_class)->where('otp_code',$otp_code)->select('id')->exists();
    }
  
    static function resetPassword_forget($password,$otp_code,$login_name,$user_class = null){
      if(self::matchOTP($login_name,$otp_code,$user_class)){
          $login_name = htmlspecialchars($login_name);
          if(empty($password)) return DV::error("New password is required");
          $user = User::getPropsBy(['login_name'=>$login_name],'id,full_name');
          if(!$user) return "Login name does not exist";
       
          // $str_user_class ="1=1";
          // if($user_class) $str_user_class ='user_class=\''.$user_class.'\'';
         $hpwd = PASSWORD_HASH($password,PASSWORD_DEFAULT);
         $x = User::updateProps($user->id,['hpwd'=>$hpwd]);
         return DV::depends($x,[],'Failed to reset password');
      }else{
          $row = User::getPropsBy(['otp_code'=>$otp_code],'user_class');
          if($row){
             if($row->user_class !==$user_class) return DV::error("$login_name was found to be a $row->user_class, not a $user_class");
          }
          return DV::error("OTP code is not correct");
      };
   }

    static function useJWT(){
        return UMTSettings::$use_jwt;
    }

    static function getPasswordSalt($user_id){
      return null;
    }

    static function hashPassword($password,$user_id = null){
      $salt = null;
      if($user_id) $salt = self::getPasswordSalt($user_id);
      return PASSWORD_HASH($password,PASSWORD_DEFAULT);
    }

    static function Logout(){
       //perform some logout tasks, if any
       Session::flush();
       return;
    }

    static function logout_mobile($user_id,$app_id){
      if (!User::existsBy('user_id',$user_id)) return "User identity not valid";
      $q = DB::table('um_sessions')->where('user_id',$user_id);
      if($app_id) $q->where('app_id',hex2bin($app_id));
      $q->delete();
      return true;
    }
}
?>
