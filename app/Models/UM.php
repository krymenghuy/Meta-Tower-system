<?php
namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
//use App\Models\Dms;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

use App\Models\Dms\SMS;
use App\Models\Dms\PublicStorage;
//use App\Security\Sanitizer as SecuritySanitizer;
// use App\Security\Sanitizer as SecuritySanitizer;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Session;
use DB;
// use Carbon\Carbon;
use Exception;
// use Localization;
use App\Models\JDV;
use Sanitizer;
use Config;
//use Illuminate\Contracts\Session\Session as SessionSession;
use Illuminate\Support\Facades\Cache;
//use Illuminate\Pagination\LengthAwarePaginator;
class UM //extends Model
{
    //use HasFactory;
    protected static $app_id = null; /** app_id for Admin Back Office **/
    protected static $user_classes = [
      'admin'=>['used'=>1,'name'=>'Admin','app_id'=>'to be set in constructor','token_age'=>null],
      'driver'=>['used'=>1,'name'=>'Driver','app_id'=>'to be set in constructor','token_age'=>0],
      'merchant'=>['used'=>1,'name'=>'Merchant','app_id'=>'to be set in constructor','token_age'=>0],
      'sales_agent'=>['used'=>1,'name'=>'Sales Agent','app_id'=>'to be set in constructor','token_age'=>0]
    ];

    protected static $profile_tables = [
        'merchant' =>['table'=>'sender','key_field'=>'id','code_field'=>'code','photo_field'=>'photo_file_name'],
        'driver' =>['table'=>'driver','key_field'=>'id','code_field'=>'code','photo_field'=>'photo_file_name'],
        'sales_agent' =>['table'=>'sales_agents','key_field'=>'id','code_field'=>'code','photo_field'=>'photo_file_name'],
        'admin' =>['table'=>'um_users','key_field'=>'id','code_field'=>'official_code','photo_field'=>'photo_file_name']
    ];
    protected $company_id = null;
    protected $branch_id = null; //same as company_id
    protected $login_name = null;
    protected $full_name = null;
    protected $user_id = null;

    //### The variables below for JWT merchanism
        protected static $use_jwt = 1; //Tell UM class to use JWT mechanism to verify user'stoken
        protected static $jwt_encode ='HS256';
        protected static $jwt_lifespan =2147483647; //43800; //180*60; // one month = 43800 minutes //default lifespan of JWT token (Time to expire)
        protected static $jwt_key ="This is JWT key";
        protected static $jwt_payload = [
          "iis"=>"",
          "aud"=>""
          //"iat"=>time(),
          //"nbf"=>time()+60*60
        ];

    //### The vaiables above for JWT merchanism

    /** Login via phone number or email or name **/
    protected static $login_kind = [
      'driver'=>'phone',
      'merchant'=>'phone',
      'admin'=>'name',
      'sales_agent'=>'phone',
      //'admin_support'=>'name' /* Backend user's login can be email, phone, or any name */
    ];

    //Used when creating new login, whether or not required official ID to link to official profile
    protected static $required_official_profile = [
      'driver'=>1,
      'merchant'=>1,
      'admin'=>0,
      'sales_agent'=>1,
      //'admin_support'=>0
    ];

    protected static $new_user_required_password = [
      'driver'=>1,
      'merchant'=>1,
      'admin'=>1,
      'sales_agent'=>1,
      //'admin_support'=>1 /* Backend user's login can be email, phone, or any name */
    ];


    protected $userInfo = null;
    public function __construct($userInfo = null)
    {
        $this->userInfo = $userInfo;
       //NOTE: Config::get('app.app_id') returns Backend system's app_id stored as APP_ID in env file
        self::$app_id = Config::get('app.app_id');
        $app_url = ENV('APP_URL'); // Config::get('app.app_url'); //todo: /config/app.php
        self::$jwt_payload=[
          "iis"=> $app_url,
          "aud"=> $app_url
        ];
        // Init app_id values in self::$user_classes. use values from .env files
        foreach(self::$user_classes AS $user_class =>$val){
          self::$user_classes[$user_class]['app_id'] = getAppIdByUserClass($user_class);
        }
        //parent::__construct($attributes);
    }

    // //Temporary function, getting auth code
    // function getUserInfoByToken1($req,$user_class=null){
    //    $ss = self::getUserInfoByToken($req,-1);
    //    if($ss->status_code !=200)
    //       return '#350';
    //    else{
    //       $ss->id = $ss->official_id;
    //       $ss->code = $ss->official_code;
    //       return $ss;
    //    }
    // }

    static function getUserClasses(){
      return self::$user_classes;
    }

    /**
     * return user_id based on the given "official_id" or "login_name"
    */
    static function getUserId($user_class,$col_name,$check_value){
       if(!in_array($col_name,['official_id','login_name'])) return null;
       if(!self::correctUserClass($user_class)) return null;
       return DB::table('um_users as u')->where('u.'.$col_name,$check_value)->where('u.user_class',$user_class)->take(1)->value('id');
    }
    //change phone number for a user, and if the user's class also use phone_number as login_name, it also changes lohin_name too
    static function updatePhoneNumber($phone_number,$id){
      if(!$id) return DV::success();
      $user = self::getUserProps($id,'user_class,official_id');
      if(!$user) return DV::error('Failed to update user phone number because the given User ID does not exist');
      $loginVia = isset(self::$login_kind[$user->user_class])? self::$login_kind[$user->user_class]:null;
      if ($loginVia ==='phone'){
         $other_user = DB::table('um_users as u')->where('u.login_name',$phone_number)->whereRaw('u.id <>'.$id)->selectRaw('u.id,u.user_class')->take(1)->first();
         if($other_user) {
          $user_class = str_replace('_',' ',$other_user->user_class ?? '');
          return DV::error('The phone number is being used as login by other '.$user_class);
         }
         DB::table('um_users')->where('id',$id)->update(['phone_number'=>$phone_number,'login_name'=>$phone_number]);
         $tableInfo = self::$profile_tables[strtolower($user->user_class)];
         if($tableInfo){
             $table =   $tableInfo['table'];
             $pk_field = $tableInfo['key_field'];
             if($table !=='um_users'){
               try{
                   DB::table($table)->where($pk_field,$user->official_id)->update(['phone_number'=>$phone_number]);  
               }catch(\Exception $e){
                  Log::info('Failed to update phone number for '.$user->user_class.' ID: '.$user->official_id.' new phone number: '.$phone_number);
               }
             }
         }
      }else DB::table('um_users')->where('id',$id)->update(['phone_number'=>$phone_number]);
      return DV::success();
    }

    static function updateEmail($email,$id){
      $user = self::getUserProps($id,'user_class,official_id');
      if(!$user) return null;
      $loginVia = isset(self::$login_kind[$user->user_class])? self::$login_kind[$user->user_class]:null;
      if ($loginVia ==='email'){
         DB::table('um_users')->where('id',$id)->update(['email'=>$email,'login_name'=>$email]);
         $tableInfo = self::$profile_tables[strtolower($user->user_class)];
         if($tableInfo){
             $table =   $tableInfo['table'];
             $pk_field = $tableInfo['key_field'];
             if($table !=='um_users'){
               try{
                   DB::table($table)->where($pk_field,$user->official_id)->update(['email'=>$email]);  
               }catch(\Exception $e){
                  Log::info('Failed to update email for '.$user->user_class.' ID: '.$user->official_id.' new email: '.$email);
               }
             }
         }
      }else DB::table('um_users')->where('id',$id)->update(['email'=>$email]);
      return null;
    }

     //UM::setUserSession() is a static function and is the same as UM->createSession()
     function createSession($app_id,$user){
         return self::setUserSession($app_id,$user);
     }
   static function clearOldSessions(){
     DB::table('um_sessions')->whereRaw('DATEDIFF(now(),start_time) > 90')->delete();
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
      if (self::$use_jwt===1) $access_token  = self::createJWT($user);
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

        DB::table('um_sessions')->insert([
          'branch_id'=>$user->branch_id,
          'app_id'=>$app_id,
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

    function getGUID()
    {
        $bytes = random_bytes(20);
        return bin2hex($bytes);
       //$q = $this->db->query("SELECT REPLACE(UPPER(UUID()),'-','') as GUID limit 1");
       //return substr($q->result()[0]->GUID,0,35);
    }

    /* Begin::adhoc methods => Adhoc methods are used to create Applications, Permissions, and module name etc. They are used only in Development time */
      function createApplication($app_name){
        $app_id =$this->getGUID();
        DB::table('um_applications')->insert([
            'app_id'=>$app_id,
            'name'=>$app_name,
            'name_native'=>$app_name
        ]);
    }

    // function createAppComponent($app_name){
    //     $app_id =$this->getGUID();
    //     DB::table('um_applications')->insert([
    //         'app_id'=>$app_id,
    //         'name'=>$app_name,
    //         'name_native'=>$app_name
    //     ]);
    // }

      function createPermission($data){
        $ss = self::getUserInfoByToken($data,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated

        $name = $data->name;
        $module_id = $data->module_id;
        $role_id = $data->role_id;
        $prn_id = $data->prn_id;

        if(!$name) return "Name cannot be empty";
        if(!$module_id) return "Module ID is not valid";
        if(!$prn_id) return "Permission Number is not valid";
        $rows = DB::table('um_permissions')->where('name',$name)->where('app_id',self::$app_id)->selectRaw('id')->limit(1)->get();

        if(count($rows)) return "The permission already exists";

        DB::table('um_permissions')->insert([
            'app_id'=>self::$app_id,
            'id'=>$prn_id,
            'module_id'=>$module_id,
            'name'=>$name
        ]);
        $new_id = DB::getPdo()->lastInsertId();

        if($new_id > 0) {
            if($role_id > 0) {
                DB::table('um_role_permissions')->insert([
                    'branch_id'=>$this->company_id,
                    'role_id'=>$role_id,
                    'permission_id'=>$new_id
                ]);
            }
        }
        return null;
    }

    /*End::adhoc methods (Adhoc   functions are used only in Development time) */

/*##### begin::InApp UserModel ##### */

    static function getAppIdByUserClass($user_class){
       if ($user_class ==='driver') return Config::get('app.driver_app_id');
       else  if ($user_class ==='merchant') return Config::get('app.merchant_app_id');
       else  if ($user_class ==='sender') return Config::get('app.merchant_app_id');
       else  if ($user_class ==='sales_agent') return Config::get('app.sales_app_id');
       else return Config::get('app.app_id');
       //return self::$user_classes[$user_class]['app_id'];
    }

    function moduleList($ss){
      $ss = $ss?$ss:$this->userInfo;
      return DB::table('um_app_modules as am')->selectRaw('am.id,am.ref_code,am.module_name')->orderBy('am.id','asc')->get();
    }

    function getModuleList($user_id =0){
        return DB::table('um_app_modules AS m')->selectRaw("m.module_name, m.module_name_native, m.icon_image, m.target_url,m.display_order,m.disabled")->orderBy('display_order','ASC')->get();
    }

    function newOTP($length=6)
    {
        return join('', array_map(function($value) { return $value == 1 ? mt_rand(1, 9) : mt_rand(0, 9); }, range(1, $length)));
    }

     //Send OTP code by sms, send sms, send_sms(), sendMessage(0)
     //sendSMS_otp()  $d = {user_id,[phone_number],[purpose]}
     //@purpose = {'change_password'}
      function sendSMS_otp($d){
          $need_authentication = isset($d->need_authentication)? $d->need_authentication:1;
          $ss = (object)['branch_id'=>1];

          if($need_authentication ===1){
            $ss = self::getUserInfoByToken($d,-1);
            if($ss->status_code !=200) return $ss; //user not authenticated
          }

          $branch_id = Sanitizer::sanitize($ss->branch_id);
          $user_id = isset($d->user_id)?$d->user_id:null;
          $login_name =isset($d->login_name)?$d->login_name:null;
          $phone_number = isset($d->phone_number)?Sanitizer::sanitize($d->phone_number):null;

          //usually the puspose of sending otp_code is to change password
          $purpose = isset($d->purpose)?Sanitizer::sanitize($d->purpose):null;

          //IMPORTANT NOTE: always make sure that um_users.phone_number is that same as sender.phone_number
          if (empty($phone_number)) $phone_number = self::getUserProp($user_id,'phone_number');
          //todo: optionally, we can  check if user is Merchant or Driver and then get phone_number from table "driver" or "sender" accordingly.

          //found number not found in table "um_users", but may exists in table "sender" or "driver"
          if (empty($phone_number)) return DV::error("Phone number not found");

          //$text = get_settings_value($ss,'OTP_SMS_TEMPLATE','string');

          $new_otp_code = $this->newOTP();
          $text = SMS::getMessageTemplate($branch_id,$purpose,$new_otp_code);
          //$text = str_replace('otp_code',$new_otp_code,$text);
          DB::table('um_users')->where('login_name',$login_name)->update(['otp_code'=>$new_otp_code]);
          $m = SMS::send($phone_number,$text,null);
          if($m->status =='Error'){
            $e = (object)['sms_error'=>$m->error_message];
            $e->otp_code = $new_otp_code;
            return $e;
          }
          return DV::success(["otp_code"=>$new_otp_code]);
      }
     

      static function resetPassword_forget($login_name,$user_class,$otp_code,$password){
        if(self::matchOTP($login_name,$otp_code,$user_class)){
            //begin set new password | reset password
            //$branch_id = sanitize($ss->branch_id);
            $login_name = htmlspecialchars($login_name);
            if(empty($password)) return DV::error("New password is required");
            $app_id =self::getAppIdByUserClass($user_class);
            if(!$app_id) return DV::error('User class is not valid');
            if(!self::existsBy('login_name',$login_name,$app_id)) return "Login name does not exist";
            $str_user_class ="1=1";
            if($user_class) $str_user_class ="user_class='$user_class'";
           $hpwd = PASSWORD_HASH($password,PASSWORD_DEFAULT);
           $x = DB::table('um_users')->where('login_name',$login_name)->whereRaw($str_user_class)->update(['hpwd'=>$hpwd]);
           if($x){
                 return DV::success();
           }else return DV::error("Something went wrong! The password was not reset"); //can be problem with user_class
        }else{
            $row = getDataRow('um_users',['otp_code'=>$otp_code],"user_class");
            if($row){
               if($row->user_class !==$user_class) return DV::error("$login_name was found to be a $row->user_class, not a $user_class");
            }
            return DV::error("OTP code is not correct");
        };
     }

      //verifyOTP()
      static function matchOTP($login_name,$otp_code,$user_class=null){
        $str_user_class ="1=1";
        if($user_class) $str_user_class ="u.user_class ='$user_class'";
        //\Log::info('login_name = '.$login_name);
        //\Log::info('user-class = '.$str_user_class);
        //\Log::info('otp_code = '.$otp_code);
        return DB::table('um_users AS u')->where('u.login_name',$login_name)->whereRaw($str_user_class)->where('otp_code',$otp_code)->select("id")->take(1)->exists();
      }

      // //verify if otp_code provided by user is correct. If correct then the otp_code is cleared out from table "um_users.otp_code"
      // //$d = {otp_code,[login_name] or [user_id]}. This method returns int as 1  or 0
      // function verify_otp($otp_code,$ss){
      //   //in case login_name is email, Sanitizer::sanitize() will mistakenly remove '@' => causing problem
      //   //$login_name = $ss->login_name;
      //   $user_id = $ss->user_id;

      //   //using Sanitizer::sanitize() means that @otp_code cannot contains any special chars
      //   $otp_code = Sanitizer::sanitize($otp_code);
      //   $rows= [];
      //   //if($login_name)
      //     //$rows= DB::table('um_users AS u')->where('login_name',$login_name)->where('otp_code',$otp_code)->selectRaw("id")->limit(1)->get();
      //   //else
      //     $user_id= DB::table('um_users AS u')->where('id',$user_id)->where('otp_code',$otp_code)->take(1)->value('id');
      //   return $user_id?1:0;
      // }

      function sendSMS($phone_number, $text,$sender_name=null){
         SMS::send($phone_number,$text,$sender_name);
      }

  static function getSubscriptionId ($user_id){
     $row = DB::table('um_users as u')->where('u.id',$user_id)->selectRaw('u.subs_id')->take(1)->first();
     if(!$row) return null;
     $subs_id  = $row->subs_id;
     $sub = DB::table('um_subscriptions as b')->where('subs_id',$subs_id)->selectRaw('subs_id,primary_email,phone_number')->first();
     if(!$sub) return null;
     return $sub->subs_id; 
  }

  function saveRole($arr = [], $ss = null)
  {
    $ss = $ss ? $ss : $this->userInfo;
    $branch_id = $ss ? $ss->branch_id : null;
    $d = (object)$arr;
    //$str_branch_id = $ss? "branch_id =$branch_id":"1=1";
    if (!$branch_id) return DV::error("Branch ID is not valid");
    $user_class = isset($d->user_class) ? $d->user_class : null;
    //$result = (object)['status'=>'Error','error_message'=>null,'role_id'=>null];

    if (!isset($d->name) || empty($d->name)) return DV::error("Role name cannot be empty", $ss->lang,);
    if (!isset($d->id)) $d->id = 0;
    if (empty(self::$app_id)) return DV::error("app id is not valid");
    if (!self::correctUserClass($user_class)) return DV::error("User class cannot be empty", $ss->lang);
    $subs_id = self::getSubscriptionId($ss->user_id);
    if(!$subs_id) return DV::error('Subscription ID is not found!');
    if ($d->id > 0) {
      if ($this->role_exists($ss, $d->name, $d->id)) return DV::error("Role name already exists", $ss->lang);
      DB::table('um_roles')->where('id', $d->id)->update(['name' => $d->name, 'User_class' => $user_class]);
      return DV::depends(['action','updated']);
    } else {

      if ($this->role_exists($ss, $d->name, null)) return DV::error("Role name already in use", $ss->lang);
      $nowTime = getNowTime();
      DB::table('um_roles')->insert([
        'subs_id'=>$subs_id,
        'user_class' => $user_class,
        'name' => $d->name,
        'app_id' => self::$app_id,
        'branch_id' => $branch_id,
        'create_user' => $ss->login_name,
        'create_date' => $nowTime,
        'update_user' => $ss->login_name,
        'update_date' => $nowTime
      ]);
      return DV::depends(['action','created']);
    }
     
  }

       function role_exists($uss,$name,$id){
        //   $rows ;
          $branch_id = $uss->branch_id;
         if($id > 0){
             $rows = DB::table('um_roles')->selectRaw('id')->where('branch_id',$branch_id)->where('name',$name)->where('id','<>',$id)->limit(1)->get();

         } else {
            $rows = DB::table('um_roles')->selectRaw('id')->where('branch_id',$branch_id)->where('name',$name)->limit(1)->get();

                 }
         if(count($rows) >0) return true;
         else return false;
      }


        function addRoleMember($user_id,$role_id,$ss=null){
          $isRoleID = DB::table('um_roles')->where('id',$role_id)->take(1)->value('id');
          if(!$isRoleID) return DV::error('Role does not exists');
          if(!$user_id) return DV::error('The given User ID is empty');
          return $this->addRoleMember_internal($ss,$role_id,$user_id);
        }

        function addRoleMembers($user_ids,$role_id,$ss=null){
          $isRoleID = DB::table('um_roles')->where('id',$role_id)->take(1)->value('id');
          if(!$isRoleID) return DV::error('Role does not exists');
          if(!$user_ids) return DV::error('No user IDs given');
          $sts = explode('|',$user_ids);
          $success_count = 0 ;
          $user_count = 0;
          foreach($sts as $user_id){
             $res = $this->addRoleMember_internal($ss,$role_id,$user_id);
             if($res->status_code ==200){
                $user_count = $res->data['user_count'];
                $success_count++;
             } 
          }
          return DV::depends(1, ['role_id'=>$role_id, 'user_count'=>$user_count, 'success_count'=>$success_count], 'Failed to add role members to role '.$role_id);  
       }
         
      protected function addRoleMember_internal($uss,$role_id,$user_id){
        $branch_id = $uss->branch_id;
        $lang = $uss->lang;
        if(!isset($role_id) || empty($role_id)) return DV::error("Role ID is not valid",$lang);

        //Delete all roles for this user first => ensuring one user has only one role, for now
        DB::table('um_user_roles')->where('branch_id',$branch_id)->where('user_id',$user_id)->delete();
        $user_class = DB::table('um_roles')->where("id",$role_id)->value('user_class');
        DB::table('um_user_roles')->insert([
            'user_id'=>$user_id,
            'role_id'=>$role_id,
            'is_primary_role' => 1,
            'branch_id'=>$branch_id
        ]);
        DB::table("um_users")->where("id",$user_id)->update(["user_class"=>$user_class]);
         $rows = DB::select(DB::raw("SELECT COUNT(ur.user_id) AS user_count FROM um_user_roles as ur WHERE ur.role_id ='$role_id'"));
         $user_count = 0;
          foreach($rows as $row) $user_count = $row->user_count;

        return DV::depends(1,['role_id'=>$role_id,'user_count'=>$user_count],'Failed to add user to the given role');
    }

    function removeAccessibleModule($module_id, $role_id, $ss = null) {
          DB::table('um_role_modules')->where('role_id',$role_id)->where('module_id',$module_id)->delete();
          DB::select(DB::raw("DELETE FROM um_role_permissions WHERE permission_id IN (SELECT id FROM um_permissions WHERE module_id ='".$module_id."') AND role_id ='".$role_id."' "));
          $user_role = DB::table('um_user_roles')->where('role_id',$role_id)->selectRaw('user_id')->get();
            foreach($user_role as $ur){
                DB::table('um_user_modules')->where('user_id',$ur->user_id)->where('module_id',$module_id)->where('role_id',$role_id)->delete();
            }
          return null;
    }

    function removeRoleMember($user_id, $role_id, $ss = null)
    {
        //$branch_id = $dss? $ss->branch_id:null;
        if(!$role_id) return DV::error('Role not found');
        $result = (object)array('status' => 'Error');
        // ->where('app_id', self::$app_id)
        DB::table('um_user_roles')->where('role_id', $role_id)->where('user_id', $user_id)->delete();
        $row = DB::table('um_user_roles')->where('role_id', $role_id)->selectRaw("COUNT(user_id) AS user_count")->get()->first();
        $user_count = $row? $row->user_count : 0;
        return DV::depends(1,['user_count'=>$user_count,'role_id'=>$role_id]);  
    }

    //     function removeRoleMember($d){
    //       $def_user_class ="admin";

    //       $ss = self::getUserInfoByToken($d,108);
    //       if($ss->status_code !=200) return $ss; //user not authenticated

    //       $branch_id = $ss->branch_id;
    //       $role_id = $d->role_id;
    //       $user_id = $d->user_id;

    //       DB::table('um_user_roles')->where('branch_id',$branch_id)->where('app_id',self::$app_id)->where('role_id',$role_id)->where('user_id',$user_id)->delete();
    //       $user_count = DB::table('um_user_roles')->where('app_id',self::$app_id)->where('role_id',$role_id)->count("id");
    //       DB::table("um_users")->where("id",$user_id)->update(["user_class"=>$def_user_class]);
    //       return DV::success(["user_count"=>$user_count]);
    //   }
        function getUserRoles($arr,$ss){
          $d = (object)$arr;
          $branch_id = $ss->branch_id;
          $user_id = $d->user_id;
          $app_id = DB::table('um_users')->where('id',$user_id)->take(1)->value('app_id');
          return DB::table('um_user_roles AS u')->where('u.branch_id',$branch_id)->where('u.app_id',$app_id)->where('u.user_id',$user_id)->selectRaw("u.id,u.name")->get();
      }

      function getRoleList($arr, $ss = null)
      {
        $ss = $ss ? $ss : $this->userInfo;
        //$str_branch = "1=1";
        $d = (object)$arr;
        $search_value = isset($d->search_value)? $d->search_value: null;
        $str_search = '7=7';
        if($search_value){
          $search_value = escape_like_str($search_value);
          $str_search = '(r.name LIKE \'%'.$search_value.'%\')';
        }
        $rows = DB::table('um_roles AS r')
        ->selectRaw("r.id, r.`name`,r.create_date,r.create_user,r.user_class, (SELECT COUNT(ur.user_id) FROM um_user_roles AS ur INNER JOIN um_users as u ON u.id = ur.user_id WHERE ur.branch_id = u.branch_id AND ur.role_id = r.id) AS user_count")
        ->orderBy('r.id','ASC')
        ->whereRaw($str_search)
        ->get();
        if($search_value && !isset($rows[0])){
          $str_search = '(r.id IN (SELECT ur.role_id FROM um_user_roles AS ur INNER JOIN um_users as u ON ur.user_id = u.id WHERE u.login_name LIKE \'%'.$search_value.'%\' OR u.phone_number = \''.$search_value.'\' OR u.official_code = \''.$search_value.'\' OR u.full_name LIKE \'%'.$search_value.'%\') )';
          $rows = DB::table('um_roles AS r')
          ->selectRaw('\''.$search_value.'\' AS user_search_value,' ."r.id, r.`name`,r.create_date,r.create_user,r.user_class, (SELECT COUNT(ur.user_id) FROM um_user_roles AS ur INNER JOIN um_users as u ON u.id = ur.user_id WHERE ur.branch_id = u.branch_id AND ur.role_id = r.id) AS user_count")
          ->orderBy('r.id','ASC')
          ->whereRaw($str_search)
          ->get();
        }
        return $rows;
      }

      function getRoleList_paginate($arr,$ss = null)
      {
        $ss = $ss ? $ss : $this->userInfo;
        $d = (object)$arr;
        $branch_id = $ss->branch_id;

        $current_page = isset($d->current_page) ? $d->current_page : 1;
        $search_value = isset($d->search_value) ? $d->search_value : null;
        $per_page = isset($d->per_page) ? $d->per_page : 10;
        $skip_rows = ($current_page - 1) * $per_page;
        if (!is_numeric($current_page)) $current_page = 1;

        $str_search = '2=2';
        if ($search_value) {
          $search_value = escape_like_str($search_value);
          $str_search = "(r.name ='$search_value' OR r.name LIKE '%" . $search_value . "%' OR r.user_class ='" . $search_value . "' )";
        } 

        $str_branch = "1=1";
        $query = DB::table('um_roles AS r')
        ->selectRaw("r.id, r.`name`,r.user_class, (SELECT COUNT(ur.user_id) FROM um_user_roles AS ur INNER JOIN um_users as u ON u.id = ur.user_id WHERE ur.branch_id = u.branch_id AND ur.role_id = r.id) AS user_count")
        ->whereRaw($str_branch)
        ->whereRaw($str_search);

        $count_query = clone $query;
        $count = $count_query->count('r.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
      }

      function getRoleMembers($arr,$ss){
          $ss =$ss?$ss:$this->userInfo;
          $branch_id = $ss->branch_id;

          $d = (object)$arr;

          $current_page = isset($d->current_page) ? $d->current_page : 1;
          $search_value = isset($d->search_value) ? $d->search_value : null;
          $role_id = isset($d->role_id) ? $d->role_id : null;
          
          $per_page = isset($d->per_page) ? $d->per_page : 10;
          $skip_rows = ($current_page - 1) * $per_page;
          if (!is_numeric($current_page)) $current_page = 1;

          $role_id = $d->role_id ?? -1;
          $role_name = self::getRoleName($role_id);
          $search_value = escape_like_str(isset($d->search_value)?$d->search_value:null);
          $str_search = '7=7';
          $str_role_id = '1=1';
          if($search_value){
              $str_search = '(u.login_name LIKE \'%'.$search_value.'%\' OR u.official_code LIKE \'%'.$search_value.'%\' OR u.phone_number = \''.$search_value.'\' OR u.full_name LIKE \'%'.$search_value.'%\')';
          }
          if($role_id){
            $str_role_id = $role_id? 'ur.role_id =\''.$role_id.'\'' : '1=1';

            
          }
          $query = DB::table('um_user_roles AS ur')
          ->join('um_users AS u','u.id','=','ur.user_id')
          ->selectRaw('\''.$role_name.'\' as role_name,\''.$search_value.'\' AS search_value,u.id,u.login_name,u.full_name,u.official_code,u.phone_number,formatTime(u.create_date) as create_date, formatTime(u.last_login_date) AS last_login_date, u.is_locked,u.status, u.create_user, u.email,u.lang,u.otp_code,u.user_class')
          // ->where('u.branch_id',$branch_id)
          //->where('ur.role_id',$role_id)
          ->whereRaw($str_role_id)

          ->whereRaw($str_search)
          ->orderBy('u.id','DESC')
          ;
          
          $count_query = clone $query;
          $count = $count_query->count('u.id');
          $rows = $query->skip($skip_rows)->take($per_page)->get();
          foreach($rows as $row){
            $role = self::getPrimaryRole($row->id);
            if($role){
               $row->role_id = $role->id;
               $row->role_name = $role->name;
            } 
            $row->image_url = self::getUserPhoto($branch_id,$row->user_class,$row->id);
          }
          return new LengthAwarePaginator($rows, $count, $per_page, $current_page);    
       }
  
      function getUserList($arr,$ss=null){
            $branch_id = 1;//$ss ? $ss->branch_id : 1;
            $str_user_class = "1=1";
            $d = (object)$arr;
            $user_class = isset($d->user_class) ? $d->user_class : null;
            $search_value = isset($d->search_value) ? $d->search_value : null;
            if ($user_class) $str_user_class = 'u.user_class =\'' . $user_class . '\'';

            $current_page = isset($d->current_page) ? $d->current_page : 1;
            $per_page = isset($d->per_page) ? $d->per_page : 10;
            if (!is_numeric($current_page)) $current_page = 1;
            $skip_rows = ($current_page - 1) * $per_page;

            $str_search = '';
            if ($search_value) {
              $search_value = escape_like_str($search_value);
              if ($search_value) {
                $str_search = " AND u.official_code ='$search_value' OR u.login_name LIKE '%" . $search_value . "%' OR u.full_name LIKE '%" . $search_value . "%' OR u.phone_number = '$search_value'";
              }
            }
            $more_where = "1=1" . $str_search;
            //$get_primary_role = ',(SELECT r.`name` FROM um_user_roles AS ur INNER JOIN um_roles AS r ON r.id = ur.role_id WHERE user_id = u.id AND ur.is_primary_role =1 LIMIT 1) AS primary_role';
            $query = DB::table('um_users as u')->whereRaw($str_user_class)->whereRaw($more_where)->selectRaw('u.id,u.official_id,u.official_code, u.full_name,u.login_name, LOWER(u.user_class) AS user_class, u.previlege_type,formatTime(u.last_login_date) AS last_login_date, is_locked, `status`,u.phone_number,formatDate(u.create_date) as start_date,u.photo_file_name')->orderBy('u.id','DESC')->where('u.branch_id', $branch_id);
            $count_query = clone $query;
            $count = $count_query->count('u.id');
            $rows = $query->skip($skip_rows)->take($per_page)->get();
            foreach($rows as $row){
                $role = self::getPrimaryRole($row->id);
                if($role){
                   $row->role_id = $role->id;
                   $row->role_name = $role->name;
                } 
                $row->image_url = self::getUserPhoto($branch_id,$row->user_class,$row->id);
            }
            return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
        }

      static function getUserProp($user_id,$prop){
        $rows = DB::table('um_users AS u')->where('id',$user_id)->selectRaw($prop)->limit(1)->get();
        if(!isset($rows[0])){
          $rows = DB::table('um_users AS u')->where('login_name',$user_id)->selectRaw($prop)->limit(1)->get();
        }
        foreach($rows as $row) return $row->{$prop};
        return null;
      }

      //$cols = "id,full_name"
      static function getUserProps($user_id,$cols){
        return DB::table('um_users AS u')->where('id',$user_id)->selectRaw($cols)->take(1)->first();
      }
      static function updateUserProps($user_id,$inputs=[]){
        return DB::table('um_users')->where('id',$user_id)->update($inputs);
      }
      static function updateUserByOfficialId($official_id,$inputs=[]){
        return DB::table('um_users')->where('official_id',$official_id)->update($inputs);
      }

      /** getProfileInfo()| getUserProfile()| getOfficialProfile() **/
      //return official profile information of a user including "official_id, official_code, name, sex, phone_number,email, address"
      static function officialProfileInfo($branch_id,$official_code,$user_class,$cols=null){
         $rows = [];
         //NOTE: column_name can be also prefixed with alias "s."
         if(!$cols) $cols = "s.id as official_id, s.code as official_code,s.name,s.email,s.phone_number";
         if($user_class === 'merchant' || $user_class === 'sender'){
            $rows = DB::table("sender as s")->where('s.code',$official_code)->where('s.branch_id',$branch_id)->selectRaw($cols)->get();
            return isset($rows[0])?$rows[0]:null;
         }else if($user_class === 'driver'){
            $rows = DB::table("driver as s")->where('s.code',$official_code)->where('s.branch_id',$branch_id)->selectRaw($cols)->get();
            return isset($rows[0])?$rows[0]:null;
          }else if ($user_class === 'admin'){
            //todo: Later, we can return admin profile as a person info such as full_name, NID, phone, email, address
            return null;
         }else if ($user_class ==='superadmin' || $user_class ==='super_admin'){
           //todo: Later, we can return admin profile as a person info such as full_name, NID, phone, email, address
           return null;
         }else{
            //todo: Later, we can return admin profile as a person info such as full_name, NID, phone, email, address
            return null;
         }
      }

    //Check if current user is super admin (with user_id =1)
    static function isSuperAdmin_cu(){
       $user_id = Session::get('user_id');
       $x = DB::table('um_users as u')->where('id',$user_id)->value('is_system_admin');
       return $x==1?true:false;
    }

    //getUserListByRole()| getUsersByRole()| getUsersByRoleId()
    static function user_list_by_roles($branch_id,$role_ids){
         $str_roles = 'ur.role_id IN ('.implode(',',$role_ids).')';
         $rows = DB::table('um_users as u')->join('um_user_roles as ur','ur.user_id','=','u.id')->where('u.branch_id',$branch_id)->whereRaw($str_roles)->selectRaw("u.id,u.login_name as staff_name,u.full_name")->get();
         return $rows;
    }
    function getRoleById($id,$ss) {
      $ss = $ss ?? $this->userInfo;
      $branch_id = $ss->branch_id;
      $rows= DB::table('um_roles')->where('branch_id',$branch_id)->where('id',$id)->selectRaw('id,name,user_class')->limit(1)->get();
      foreach($rows as $row) return $row;
      return null;
  }

    // function person_exists($id){
    //    $rows = DB::table('persons as p')->where('id',$id)->selectRaw('id')->limit(1)->get();
    //    foreach($rows as $row) return true;
    //    return false;
    // }

     //Create or UpdateUser() depending on $d->user_id;
     //@params $d = {login_name,password,email,full_name,phone_number,user_class,role_id,official_id}
     function saveUser($arr,$id = null,$ss=null){
         //permission 100 => for Creating new user account
        //   $ss = self::getUserInfoByToken($d,-1);
        //   if($ss->status_code !=200) return $ss; //user not authenticated
          $branch_id = $ss->branch_id;
          //if(!self::allowed(100)) return DV::error("Permission 100 is required");
          $str_user_classes = implode(',', array_keys(self::$user_classes));
          $validate_rule =[
             'id'=>"0|identity=1",
             'login_name'=>'1|string|1-35|text=Login name is between 1 to 35 characters, and no spaces allowed',
             'password'=>'0|string|0-100',
             'email'=>'0|email',
             'user_class'=>'1|choice|'.$str_user_classes,
             'subs_id'=>'0|string',
             'role_id'=>'1|number|exists=um_roles.id|text=User role is missing',
             'official_code'=>'0|string|1-25',
             'official_id'=>'0|number',
             "full_name"=>"0|string",
             'previlege_type'=>'0|choice|standard|default=standard',
             //'work_location_id'=>'0|string',
             'lang'=>'0|choice|en,km|default=en',
             'status'=>'0|string|default=active',
             'photo' => '0|image',
             'phone_number' => '0|phone',
          ];

          $check_unique = ["$branch_id|um_users|login_name|id|text=login name or phone number is already in use by another user"];
          $img_char = ['+',':',',',';','=','/','\\','?'];
          $res = validateObject($arr,$validate_rule,true,['email'=>['.','@','-'],'login_name'=>['@','-','.','_'],'photo' => $img_char],$ss->lang,false,$check_unique);
          if($res->error) return DV::error($res->error);
          $inputs = $res->values;
          $user_id = $id ?? $res->id;
          if ($user_id > 0){
             if(!self::allowed(112)) return  DV::error('You need permission number ? to update user information::'.'112');
          }else{
             if(!self::allowed(100)) return  DV::error('You need permission number ? to update user information::'.'100');

             $subs_id = self::getSubscriptionId($ss->user_id);
             if(!$subs_id) return DV::error('Subscription ID is not found!');
             $inputs['subs_id'] = $subs_id;
          }
          $official_id = null;
          $official_code = null;
          /** Ensure no space, no special characters in login_name */
          $login_name = Sanitizer::sanitize($inputs['login_name']);
          $login_name = preg_replace('/[^a-zA-Z0-9@.]/', '', $login_name);
          $inputs['login_name'] =$login_name;

          $user_class = strtolower($inputs['user_class']);
          if (!self::correctUserClass($user_class)) return DV::error("User Type or User Class is not correct",$ss->lang);

          $inputs['phone_number'] = str_replace(' ','',$inputs['phone_number']);
          $p = self::$profile_tables[$user_class];
          $p_table = $p['table'];
          $pk_field = $p['key_field'];
          $code_field = $p['code_field'];
          $photo_field = $p['photo_field'];
          if ($p_table !=='um_users'){
             /** Assuming here the $p_table has columns "id", and "code". Example, sender.id and sender.code */
             $official_id = $inputs['official_id'];
             $official_code = $inputs['official_code'];
             if(!$official_id){
               if($user_id> 0)
                $official_id = DB::table('um_users')->where('id',$user_id)->take(1)->value('official_id');  
               else 
                $official_id = DB::table($p_table)->where($code_field,$official_code)->take(1)->value($pk_field);  
            }
             $profileInfo = DB::table($p_table)->where($pk_field,$official_id)->select($pk_field,$code_field)->first();
             if (!$profileInfo) return DV::error($p_table.' ID does not exist. The given official ID is not valid');
             $official_id = $profileInfo->$pk_field;
             $official_code = $profileInfo->$code_field;
             $inputs['official_id'] = $official_id;
             $inputs['official_code'] = $official_code;
          }

          //Get app_id based on a given @user_class;
          $app_id = self::getAppIdByUserClass($user_class);
          $image = $inputs['photo'];
          ////$app_id = self::$app_id;

          //$inputs['full_name'] = empty($inputs['full_name'])? $inputs['login_name']:null;
          if(empty($inputs['full_name'])) return DV::error("Full name is required");

          //$single_role_name =null;// $first_role->name;
          //$first_role =self::firstRole($d->role_id);
          $loginVia = isset(self::$login_kind[$user_class])?self::$login_kind[$user_class]:null;
          if ($loginVia === 'phone'){
              if(!isset($inputs['phone_number'])) $inputs['phone_number'] = $inputs['login_name'];
          }

          if($user_id && (!$image || isImage($image))){
            self::deleteUserPhoto($user_id,$user_class); 
          }
         $role_id = $inputs['role_id'];
         unset($inputs['role_id'],$inputs['photo']);
         $password = $inputs['password'];
         unset($inputs['password']);
         $hpwd = PASSWORD_HASH($password,PASSWORD_DEFAULT);

         $inputs['app_id']=$app_id;
         if(!$user_id || $user_id ==0) {
           //todo: Check password strenth rule here
           if (!$password && self::$new_user_required_password[$user_class]===1) return DV::error("Password is required");
           $inputs['hpwd'] = $hpwd;
         }

         $inputs['branch_id']=$branch_id;
         if ($user_id > 0){
           unset($inputs['hpwd'],$inputs['status'],$inputs['is_locked'],$inputs['user_class'],$inputs['official_id'],$inputs['official_code']);
         }
         $user_id = saveData($ss,"um_users",["id"=>$user_id],$inputs,[],0);
         if($user_id >0){
            $this->addRoleMember_internal($ss,$role_id,$user_id);
            $x = PublicStorage::saveImage($ss->branch_id,$user_class,null,$image,null,[]);
            if($x->status == 'OK'){     
                $primary_key = $p_table ==='um_users'? ['id'=>$user_id]: [$pk_field => ($official_id ?? -3)];
                saveData($ss,$p_table,$primary_key,[
                  $photo_field => $x->file_name
                ],[],1);
            }
            return DV::success(['id'=>$user_id]);
         }else{
             return DV::error("Something went wrong in saving user data");
         }

      }

      //param => $request->breaerToken()
      protected static function decryptToken($request){
        $bearerToken = $request->bearerToken();
        if ($bearerToken == null) return null;
        //if(!isset($request->acc_tk_dms)) return null;
        //if (!isset($request->is_cookie)) $request->is_cookie = 0;
        $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
        $decrypted_token= null;
        try{
          $decrypted_token = $encrypter->decrypt($bearerToken,false);
        }catch(Exception $e){
            return null;
        }

        if (strpos($decrypted_token,'|')>0) {
            $parts = explode('|',$decrypted_token);
            if(isset($parts[1]))
              $decrypted_token = $parts[1];
             else return null;
        }
        return $decrypted_token;
    }

    // //return user info based on a given @access_token
    // //(Thsi method is used in PusherController->PusherAuth() method to get user info after token is validated already)
    // //NOTE $this->decryptToken() can undertand both Token from mobile api user, and token from web client user that has = sign in it;
    // static function getUserSessionInfo($access_token,$is_decrypted_token=1){
    //   if($is_decrypted_token !=1){

    //     $access_token = $this->decryptToken($request);
    //   }
    //   $rows = DB::table('um_sessions AS ss')->join('um_users as u','u.id','=','ss.user_id')->where('ss.access_token',$access_token)->selectRaw("ss.user_id, ss.branch_id,ss.app_id,u.login_name,u.official_id")->limit(1)->get();
    //   foreach($rows as $row) return $row;
    //   return null;
    // }

    //used in PusherController->PusherAuth() method to validate socket connection, private channel
    function getUserByToken($request){
      //NOTE: non-static method cannot be called in static method
      //decryptToken() looks for $request->bearerToken()
      $access_token = self::decryptToken($request);
      return  $access_token;
      $rows = DB::table('um_sessions AS ss')->join('um_users as u','u.id','=','ss.user_id')->where('ss.access_token',$access_token)->selectRaw("ss.user_id, ss.branch_id,ss.app_id,u.login_name,u.official_id")->limit(1)->get();
      foreach($rows as $row) {
        $row->error = null;
        return $row;
      }
      return null;
    }
 
    static function getUserInfo_quick($user_id, $cols)
    {
        $key = 'userinfo_'.$user_id;
        $this_user = cache::get($key,null);
        if(!$this_user){
            $this_user = DB::table('um_users AS u')->where('id', $user_id)->selectRaw($cols)->take(1)->first();
            /** 60 x 5 = 300 => use 5 minutes cache for this user */
            cache::put($key,$this_user,120);
        }
        return $this_user;
    }

    static function useJWT(){
       return self::$use_jwt;
    }
    //getUserInfoByToken() returns user info (user details) based on two factors:
    //1. based on given access_token stored in $request->acc_tk_dms
    //2. based on given @user_class = {driver, or merchant or (admin or NULL) }
    //This method is used in mobile app's api authentication, which does not depends on web session
    static function getUserInfoByToken($request, $prn_code = -1, $prn_error_message = null)
    {
      $def_lang = 'en';
      //$access_token = self::decryptToken($request);
      $access_token = $request->bearerToken();
      if (!$access_token) return DV::error('User authentication failed', $def_lang, 401);
      if (self::$use_jwt === 1) {
            /*
                NOTE: This will now be an object instead of an associative array. To get
                an associative array, you will need to cast it as such:
            */

        JWT::$leeway = 60; // $leeway in seconds
        $decoded = $request->user;
        if(!$decoded){ 
          try {
            $decoded = JWT::decode($access_token, new Key(self::$jwt_key, self::$jwt_encode));
          } catch (\Exception $e) {
              return DV::error($e->getMessage(), $def_lang, 403);
          }
        }
      if (!isset($decoded->user_id)) $decoded->user_id = $decoded->id;

        //#begin:: Get special active fields "is_locked,status,lang". These fields need to be updated in the decoded JWT token on every api call
        $decoded->status = 'inactive';
        $row = self::getUserInfo_quick($decoded->user_id, 'is_locked,status,lang,is_system_admin');
        if ($row) {
          $decoded->lang = $row->lang;
          $decoded->is_locked = $row->is_locked;
          $decoded->status = $row->status;
          $decoded->is_system_admin = $row->is_system_admin; //
        }
        if (in_array(strtolower($decoded->status),['inactive','disabled','locked']) || $decoded->is_locked == 1) return DV::error('It seems your token expired or your status is inactive. But you may try login again to verify your credentials', $def_lang, 400);
        //#end::Get special active fields "is_locked,status,lang". These fields need to be updated in the decoded JWT token on every api call
        $ret = (object)['status_code' => 200, 'status' => 'OK'];

        if (!self::allowed($prn_code,null,$decoded->user_id)) {
          $prn_error_message = 'Permission ' . $prn_code . ' is required!';
            try{
              DV::error($prn_error_message, $def_lang,402);
            }catch(\throwable $e){
              \Log::info($e->getMessage());
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

        //Obtain $user_id, $official_id from table "um_users"
        $row = DB::table('um_sessions AS ss')->join('um_users as u', 'u.id', '=', 'ss.user_id')->where('ss.access_token', $access_token)->selectRaw("ss.lang,ss.user_id,u.full_name,u.user_class,u.login_name,ss.branch_id, u.official_id,u.official_code")->take(1)->first();
        if ($row) {
          return (object)[
            'status_code' => 200, 'status' => 'OK',
            'user_id' => $row->user_id,
            'lang' => $row->lang,
            'branch_id' => $row->branch_id,
            'official_id' => $row->official_id,
            'user_class' => $row->user_class,
            'login_name' => $row->login_name, 'full_name' => $row->full_name
          ];
        }
        else return DV::error('User authentication failed', null, 401);
      }
    }
 
    function deleteUser($id){
          //$branch_id = $ss->branch_id;
          //For one Application or one system, => There is one in-app Admin user denoted by his "previlege_type =Admin "
          //This Admin user cannot be delete, and he can create other in-app users if needed (Depending on permissions as well)
          if(self::isSystemAdmin($id)) return DV::error('Cannot delete system admin');
          // if(strToLower($user->previlege_type) ==='admin') {
          //     return DV::error("Cannot delete Admin user");
          // }
          DB::table('um_user_roles')->where('user_id',$id)->delete();
          DB::table('um_users')->where('id',$id)->delete();
          return DV::success();
      }
      
      function deleteRole($role_id, $ss = null)
      {
        $ss = $ss ? $ss : $this->userInfo;
        $tables = ['um_user_roles','um_user_modules','um_user_permissions'];
        //if(!$id || $id<=0) return DV::error("Role identifier is not valid",$lang);
        DB::table('um_roles')->where('id', $role_id)->delete();
        foreach($tables as $table){
          DB::table($table)->where('role_id',$role_id)->delete();
        }
        return DV::success();
      }

      function setUserStatus($status_code, $user_id,$updateProfile = true,$ss = null)
      {
        $branch_id = $ss ? $ss->branch_id : null;
        $str_branch = "1=1";
        if ($branch_id > 0) $str_branch = "branch_id=$branch_id";
        $valid_statuses = ['active', 'inactive','lock','locked','unlock','unlocked'];
        if (strtolower($status_code) =='unlocked' || strtolower($status_code) =='unlock') $status_code ='active';
        if(self::isSystemAdmin($user_id) && in_array(strtolower($status_code),['inactive','lock','locked'])) return DV::error('Cannot deactivate system admin user');
        if (!in_array(strtoLower($status_code), $valid_statuses)) {
          return DV::error('Status is not correct '.$status_code);
        }
        DB::table('um_users')->whereRaw($str_branch)->where('id', $user_id)->update(['status' => $status_code,'is_locked'=> strtolower($status_code) =='active'?0:1]);
        if ($updateProfile){
          $user = DB::table('um_users AS u')->whereRaw($str_branch)->where('id', $user_id)->selectRaw('LOWER(u.user_class) AS user_class,u.official_id')->first();
          if($user){
            $p = self::$profile_tables[$user->user_class];
            /** Update status as "Ative |Inactive" in table "driver", "sender" */
            $p_table = $p['table'];
            if($p_table !=='um_users'){
              DB::table($p_table)->where('id',$user->official_id)->whereRaw($str_branch)->update([
                'status_code'=>$status_code
              ]);
            }
          }
        }
        return DV::success();
      }

      function enable($id){
        return $this->setUserStatus( 'active',$id,true);
      }
      function disable($id){
        return $this->setUserStatus( 'inactive',$id,true);
      }

      static function getAccountInfo($id,$byCol ='official_id',$user_class = null){
         $id = Sanitizer::sanitize($id);
         $str_where = $byCol ==='official_id'? 'u.official_id =\''.$id.'\'': 'u.id ='.$id;
         $str_user_class = '2=2';
         if($user_class) $str_user_class = 'u.user_class =\''.$user_class.'\'';
         $row = DB::table('um_users as u')->whereRaw($str_where)->whereRaw($str_user_class)->selectRaw('u.id,u.official_id,u.login_name,full_name,u.`status`, u.is_locked')->first();
         if($row){
           if($row->is_locked ==1) $row->status ='locked';
         }
         return $row;
      }

      function unlockUser($user_id)
      {
        $this->setUserStatus('active',$user_id,true);
      }

      /**
       * $action = lock|unlock
       * **/
      function setLockStatus($action, $user_id, $updateProfile =true,$ss = null)
      {
        $status_code = 'inactive';
        $lock_status = ['locked','lock','disabled','disable','inactive','deactive'];
        $active_status = ['active','enabled','enable','unlock','unlocked'];
        if( in_array(strtolower($action),$lock_status)) $status_code ='inactive';
        else if (in_array(strtolower($action),$active_status)) $status_code ='active';

        return $this->setUserStatus($status_code,$user_id,$updateProfile,$ss);
        // $action = strtolower($action);
        // $ss = $ss ? $ss : $this->userInfo;
        // $branch_id = $ss ? $ss->branch_id : null;
        // $str_branch = "1=1";
        // if ($branch_id > 0) $str_branch = "branch_id =$branch_id";
        // if ($action === 'lock' || $action === 'inactive') {
        //   DB::table('um_users')->where('id',$user_id)->whereRaw($str_branch)->update(['is_locked'=>1,'status'=>'Inactive']);
        // } else {
        //   DB::table('um_users')->where('id',$user_id)->whereRaw($str_branch)->update(['is_locked'=>0,'status'=>'Active']);
        // }
        // return DV::success();
      }

       function official_id_exists($official_id,$app_id) {
         if(empty($official_id) || empty($app_id)) return false;
         return DB::table('um_users')->where('official_id',$official_id)->where('app_id',$app_id)->selectRaw('id')->limit(1)->exists();
       }

      function user_exists($login_name,$user_id){
          $str_id = $user_id > 0 ? 'id <> '.$user_id : '1=1';
          $row = DB::table('um_users AS u')->whereRaw($str_id)->where('login_name',$login_name)->selectRaw('id,login_name,full_name')->first();
          return $row;
      }

      static function verifyUserToken($token=null){
        return (object)['access_token'=>$token,'status'=>'OK','error_message'=>null,'status_code'=>200];
        //in case of error:
            //"User unthenticated"  =>  return (object)['status'=>'Error','access_token'=>$token,'error_message'=>"User authentication failed",'status_code'=>401];
        //In case of Token Expired => also use error 401 (User authentication failed)
     }

      //create user token in case that the JWT is not used
      static function createUserToken(){
        return  getUniqueString(38);
      }

      function createRandomNumber($length=6)
      {
          return join('', array_map(function($value) { return $value == 1 ? mt_rand(1, 9) : mt_rand(0, 9); }, range(1, $length)));
      }

      function verifyOTP($app_id,$login_name,$otp_code){
        $b = DB::table('um_users AS u')->where('app_id',$app_id)->where('login_name',$login_name)->where('otp_code',$otp_code)->limit(1)->exists();
        if ($b==true || $b==1) DB::table('um_users')->where('app_id',$app_id)->where('login_name',$login_name)->update(array('otp_code'=>null));
        return $b;
      }

      //user exists by colName: login_name or user_id
      static function existsBy($col_name,$val,$app_id=null){
        if($col_name ==='user_id') $col_name ='id';
        $where_sql = $col_name."='$val'";
        if (!empty($app_id))  $where_sql = $col_name."='$val' AND app_id ='$app_id'";
        return DB::table("um_users")->whereRaw($where_sql)->limit(1)->exists();
      }

   //Create token|createToken()| createJWT()
   //NOTE: $userInfo is array ['branch_id','official_id','user_class','full_name',...]
   static function createJWT($userInfo = [], $lifespan = null) {
    $nowTime = time();
    self::$jwt_payload['iat'] = $nowTime; // Issue At
    self::$jwt_payload['nbf'] = $nowTime; // Not Before

    $arr = (array)$userInfo;
    $user_class = $arr['user_class'];

    if ($lifespan === null) {
        $u_class =strtolower($user_class);  
        $info = isset(self::$user_classes[$u_class])? self::$user_classes[$u_class]:null;
        $lifespan = $info?$info['token_age']:0;
    }

    if ($lifespan === 0) {
        $exp = $nowTime + 60 * 60 * 24 * 365 * 10; // Set token to expire in 10 years
    } elseif ($lifespan > 0) {
        $exp = $nowTime + $lifespan;
    } else {
        $exp = $nowTime + 180 * 60; // Default expiration if lifespan is negative
    }

    self::$jwt_payload['exp'] = $exp; // Expire At

    foreach ($arr as $p => $value) {
        self::$jwt_payload[$p] = $value;
    }

    return JWT::encode(self::$jwt_payload, self::$jwt_key, self::$jwt_encode);
 }

   //checkUser , validateUser, checkPassword, login, Signin
   /** login() | verifyUser() check user login and pwd and then returns object $result = {status, error_message, user} **/
   function verifyUser($app_id,$login_name,$password,$lang='en'){
         //$user_id = null;
         //NOTE: $login_name = {loginName, PhoneNumber,email}
        if(empty($login_name)) return DV::error("User name is not valid",$lang,400);
        $rows = DB::table('um_users AS u')->selectRaw('u.lang,u.id,u.user_class,u.official_id,u.official_code,u.hpwd,u.login_name, u.branch_id, u.full_name, u.status, u.is_locked,u.email,u.phone_number,u.otp_code')->where('u.login_name',$login_name)->where('u.app_id',$app_id)->take(1)->get();

        if(!isset($rows[0])) return DV::error("User name is not correct or does not have access to this application",$lang,400);

       //begin:: Check if the user is LOCKED OUT or DISABLED
        foreach($rows as $row){
            //$user_id = $row->id;
            if($row->is_locked===1 || $row->is_locked ===true) return DV::error("Your account has been locked out.",$lang,400);
            if(trim(strtolower($row->status)) != 'active') return DV::error("Your account has been disabled",$lang,400);

            $hpwd = '#$%&FDHK SDSFSF 2998FGK$343%$333';
            $hpwd = $row->hpwd;
            unset($row->hpwd);

            if(password_verify($password,$hpwd)){
                  //Login succeeded => create user session either in file or database table
                  $sess = self::setUserSession($app_id,$row);
                  if($sess->status ==='OK')
                     {
                        //return object {access_token,user}
                        $row->user_id = $row->id;
                        $row->mods = $this->getAccessibleModulesByUserId_internal($row->user_id);
                        $row->prns = $this->getPermissionsByUserId_internal($row->user_id);
                        $row->access_token = $sess->access_token;
                        $token_age = self::$user_classes[strtolower($row->user_class)]['token_age'];
                        $refresh_token =self::createJWT(['login_name'=>$row->login_name,'user_class'=>$row->user_class],$token_age);
                        $isSystemAdmin = self::isSystemAdmin($row->id)?1:0;
                        // if(self::$use_jwt===1)
                        //   $row->access_token = self::createJWT($row,60);
                        // else
                        //    $row->access_token = $sess->access_token;
                        return (object)['status'=>'OK','status_code'=>200,'user'=>$row,'refresh_token'=>$refresh_token,'is_system_admin'=>$isSystemAdmin];
                        //return DV::success(['user'=>$row,'refresh_token'=>$refresh_token],200);
                     }
                  else return DV::error($sess->error_message,$lang,400);
            } else return DV::error('Password is not correct!',$lang,401);

        }
       //end:: Check if the user is LOCKED OUT or DISABLED
         return DV::error('Login name is not correct!',$lang,401);

    }

    //change user password | setPassword()
     static function changeUserPassword($user_id, $oldPwd, $newPwd){
            if(!self::allowed(109,100)) return DV::error('It seesm that you do not have permission to do this: 109/100');
            $new_password_hash = PASSWORD_HASH($newPwd,PASSWORD_DEFAULT);
            $rows = DB::table('um_users as u')->where('u.id',$user_id)->selectRaw("u.id,u.hpwd")->limit(1)->get();
            if (!isset($rows[0])) return DV::error('user identity is not valid');
            $hpwd = '$%^&**FffgW@$Mx9f5';
            foreach($rows as $row) $hpwd = $row->hpwd;

            // if (strtolower(session('user_name')) != strtolower($login_name)) {
            //       return "Failed to change password because there was problem identifying your identity";
            // }

            if (password_verify($oldPwd,$hpwd)){
              DB::table('um_users')->where('id',$user_id)->update(array('hpwd'=>$new_password_hash));
              return DV::success();
            } else return DV::error('Old password is not correct!');
      }


       //In case: user changes their own password
        function changePassword($d){
          $ss = self::getUserInfoByToken($d,-1);
          if($ss->status_code !=200) return $ss; //user not authenticated
          //$branch_id = Sanitizer::sanitize($ss->branch_id);
          $lang = $ss->lang;

          $login_name = Sanitizer::sanitize($d->login_name);
          //if login_name is not provided then try to change if current user tries to change his own password
          if(!$login_name) $login_name = $ss->login_name;

          $oldPwd =$d->oldPwd;
          $newPwd = $d->newPwd;
        $new_password_hash = PASSWORD_HASH($newPwd,PASSWORD_DEFAULT);
        $rows = DB::table('um_users as u')->where('u.login_name',$login_name)->selectRaw('u.id,u.hpwd')->limit(1)->get();
        $hpwd = '$%^&**FffgW@$Mx9f5';
        if (!isset($rows[0])) return DV::error("Failed to change password because user identity is not correct!",$lang);
        foreach($rows as $row) $hpwd = $row->hpwd;

        // if (strtolower(session('user_name')) != strtolower($login_name)) {
        //       return "Failed to change password because there was problem identifying your identity";
        // }

        if (password_verify($oldPwd,$hpwd)){
           DB::table('um_users')->where('login_name',$login_name)->update(array('hpwd'=>$new_password_hash));
           return DV::success();
        } else return DV::error($lang,"Old password is not correct!");
      }

      function sendOTPCode_email($d){
        return null;
      }

      //sendOTP() | sendPhoneOTP()
      function sendOTPCode_phone($arr,$ss=null){
        $branch_id = Session::get('branch_id',1);
        $d = (object)$arr;
        $phone_number = isset($d->login_name)?$d->login_name: (isset($d->phone_number)? $d->phone_number:null);
        if(!$phone_number) return DV::error('Phone number is not provided yet');
        $new_otp_code = $this->newOTP();
        $message = SMS::getMessageTemplate($branch_id,'forget_password',$new_otp_code);
        $res  = SMS::send($phone_number,$message);
        //if($res->status ==='OK'){
          $x = DB::table('um_users')->where('login_name',$phone_number)->update(['otp_code'=>$new_otp_code]);
          if(!$x) return DV::error("Login name $phone_number does not exist");
          return DV::depends(1,['otp_code'=>$new_otp_code]);
        //}
        //return DV::error("Failed to send OTP code");
    }

      //For Admin user to reset password for other user, or user themselve to just save password after otp_code code has been verified correctly
      //$d = {login_name, password} OR $d = {login_name,newPwd}
      function setPassword($arr,$ss){
         $d = (object)$arr;
          //todo: later sanitize login_name first
          $login_name = $d->login_name; //Sanitizer::sanitize($d->login_name,'email');
          $newPwd = isset($d->newPwd)?$d->newPwd:null;
          if(empty($newPwd)) $newPwd = isset($d->password)?$d->password:null;
        //TODO:Check if the current user has right to set other users' password or not
        //if(empty($login_name)) return "Login name is unexpectedly empty!";
        if(!$this->user_exists($login_name,null)) return DV::error($login_name? 'Login name '.$login_name.' does not exist':'Login name is unexpectedly missing or empty');
        if(empty($newPwd)) return DV::error('password cannot be empty');

        $hpwd = PASSWORD_HASH($newPwd,PASSWORD_DEFAULT);
        DB::table('um_users')->where('login_name',$login_name)->update(array('hpwd'=>$hpwd));
        return DV::depends(1);
    }
 
      function changeLoginName($arr,$ss=null){
        $d = (object)$arr;
        if($ss->status_code !=200) return $ss; //user not authenticated
         $lang = $ss->lang;
         //$branch_id = Sanitizer::sanitize($ss->branch_id);
         $login_name = Sanitizer::sanitize($d->login_name,['@','-','.']);
         $new_login_name = Sanitizer::sanitize($d->new_login_name,['@','-','.']);

         $rows =DB::table('um_users')->where('login_name',$login_name)->selectRaw('id')->limit(1)->get();
         $user_id = null;
         foreach($rows as $row) $user_id = $row->id;
         if (empty($user_id)) return DV::error("The provided login name does not exists",$lang);
         if(empty($new_login_name)) return DV::error("New login name cannot be blank",$lang);

         if ($this->user_exists($new_login_name,$user_id)) {
             return DV::error("Login named `$new_login_name` already in use",$lang);
         }
         if (strtolower($login_name) === strtolower($new_login_name)) return null;// "New login name cannot be the same as the old login name";
         DB::update(DB::raw("UPDATE um_users SET login_name ='$new_login_name' WHERE login_name ='$login_name'"));
         //DB::table('um_users')->where('login_name',$login_name)->update(array('login_name',$new_login_name)); //error WHY???
         return DV::success();
      }

      function createLoginSession($user_id = null){
        $last_month_date =date('Y-m-d');
        $app_id = self::$app_id;
        DB::delete(DB::raw("DELETE FROM um_sessions WHERE DATE(start_time) <= '$last_month_date' AND app_id ='".self::$app_id."'"));
         $session_id = $this->getGUID();
         $rv_code  = $this->getGUID();
         $x = DB::table('um_sessions')>insert(['rv_code'=>$rv_code,'session_id'=>$session_id,'app_id'=>$app_id,'user_id'=>$user_id,'status'=>'Active']);
         if ($x)
           return $session_id;
         else return null;
   }

     function getComboItems_user($arr,$ss){
        $d = (object)$arr;
       $branch_id = Sanitizer::sanitize($ss->branch_id);
       $role_id = Sanitizer::sanitize($d->role_id);
     $rows =[];
     if($role_id > 0) {
        $rows = DB::select(DB::raw("SELECT u.id, u.login_name FROM um_users AS u INNER JOIN um_user_roles as ur ON ur.user_id = u.id WHERE u.branch_id ='$branch_id' AND ur.role_id ='$role_id' ORDER BY u.`login_name` ASC "));
     } else
        $rows = DB::select(DB::raw("SELECT u.id, u.login_name FROM um_users AS u WHERE u.branch_id ='$branch_id' ORDER BY u.`login_name` ASC "));

     return $rows;
   }

    function getComboItems_role($user_class,$ss=null){
       //$branch_id = Sanitizer::sanitize($ss->branch_id);
       $str_user_class ='1=1';
       if(!empty($user_class)) $str_user_class ='r.user_class =\''.$user_class.'\'';
       return DB::table('um_roles as r')->whereRaw($str_user_class)->selectRaw('r.name, r.id ')->orderByRaw('`name` ASC')->get();
    }

      function getComboItems_workloc($d){
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
         //$lang = $ss->lang;
         $branch_id = Sanitizer::sanitize($ss->branch_id);
         return DB::select(DB::raw("SELECT c.name, c.name_native, c.id FROM um_worklocations AS c WHERE c.branch_id ='$branch_id' ORDER BY `name` ASC "));
     }

      function getComboItems_module($ss){
        $branch_id = $ss->branch_id;
        return DB::select(DB::raw("SELECT m.id,m.module_name as `name` FROM um_app_modules AS m WHERE IFNULL(m.hidden,0) =0 AND m.app_id ='".self::$app_id."' ORDER BY `name` ASC "));
     }

       //getAccessibleModules_current_user
       function getAccessibleModules_cu($d){
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated

         $branch_id = Sanitizer::sanitize($ss->branch_id);
         $user_id = Sanitizer::sanitize($ss->user_id);
         $rows = DB::select(DB::raw("SELECT DISTINCT m.display_order, m.id,m.disabled,m.hidden, m.module_name AS `name`
         FROM um_app_modules AS m INNER JOIN um_role_modules AS rm ON m.id = rm.module_id
         INNER JOIN um_user_roles AS ur ON ur.role_id = rm.role_id
         WHERE IFNULL(m.hidden,0) =0 AND ur.user_id ='$user_id' ORDER BY m.disabled ASC, m.display_order ASC"));
         return $rows;
    }


  
  /*** $arr = ['email','full_name','phone_number','start_date'] */
  function createSubscription($arr,$ss){
     $def_lang = 'en';
     $v_rule = [
       'email'=>'1|email',
       'full_name'=>'1|string|150',
       'phone_number'=>'0|phone',
       'start_date'=>'0|date'
     ];
     $res = validateObject($arr,$v_rule,1,[],$def_lang,false,null);
     if($res->error) return DV::error($res->error);
     $inputs = $res->values;
     $d = (object)$inputs;
     if(!$d->start_date) $inputs['start_date'] = getNowTime();
     $inputs['subs_id'] = createUUID();
     $inputs['create_date'] = getNowTime();
     $inputs['create_user'] = $ss->full_name;
     $inputs['update_date'] = getNowTime();
     $inputs['update_user'] = $ss->full_name;
     DB::table('um_subscriptions')->insert($inputs);
     return DV::depends(1);
  }
  function getAccessibleModules($role_id,$ss){
    $ss = $ss?$ss:$this->userInfo;
    $role_id = Sanitizer::sanitize($role_id);
    return DB::select(DB::raw("SELECT m.id, m.disabled, m.module_name AS `name`, m.module_name_native as name_native, m.icon_image, m.target_url FROM um_app_modules AS m INNER JOIN um_role_modules AS rm ON m.id = rm.module_id WHERE IFNULL(m.hidden,0) =0 AND m.app_id ='".self::$app_id."' AND rm.role_id ='$role_id' ORDER BY m.disabled, m.module_name ASC"));
}

  function getRoleApps($arr, $ss){
    $d = (object) $arr;
    $app_id = isset($d->app_id)? $d->app_id:null;
    $role_id = isset($d->role_id)? $d->role_id:null;
    $role_id = $role_id ?? 0;
    $search_value = isset($d->search_value) ? $d->search_value : null;
    $str_app = '2=2';
    $str_search = '3=3';
    if($search_value){
      $search_value = escape_like_str($search_value);
      $str_search = " (app.name LIKE '%$search_value%')";

    }
    $query = DB::table('um_applications as app')
          ->join('um_roles as r','r.app_id','=','app.app_id')
          ->where('r.id',$role_id)
          ->whereRaw($str_app)
          ->whereRaw($str_search)
          ->selectRaw('app.app_id,app.name,app.icon_file_name')->get();
  
    return $query;
    
     
  }
//   function getRoleReports($arr, $ss){
//     $d = (object)$arr;
//     $app_id = isset($d->app_id)? $d->app_id:null;
//     $role_id = isset($d->role_id)? $d->role_id:null;
//     $role_id  =  $role_id  ?? 0;
//     $search_value =isset($d->search_value) ? $d->search_value : null;
//     $str_app = '1=1';
//     $str_search = '2=2';
//     if($search_value){
//        $search_value = escape_like_str($search_value);
//        if ($search_value > 0) $str_search = 'prn.id = '.$search_value;
//        else $str_search = '(rpt.name LIKE \'%'.$search_value.'%\' OR prn.name LIKE \'%'.$search_value.'%\')';
//     }else{
//       if($app_id) $str_app = 'rc.app_id =\''.$app_id.'\'';
//     }
//     $cols = 'prn.id, prn.name AS permission_name,rpt.id as report_id, rpt.category_id,rc.name AS category, rpt.code as report_code, has_prn('.$role_id.',prn.id) AS status_id';
//     $rows = DB::table('um_permissions as prn')
//     ->join('reports as rpt','rpt.permission_id','=','prn.id')
//     ->join('report_categories as rc','rc.id','=','rpt.category_id')
//     ->whereRaw($str_app)
//     ->whereRaw($str_search)
//     ->selectRaw($cols)->get();
//     $data = [];
//     foreach($rows as $row){
//       // $I=0;
//       if (!isset($data[$row->category])){
//        $data[$row->category] = (object)[
//          'id'=>$row->category_id,
//          'name'=>$row->category,
//          'items'=>[]
//        ];
//       }
      
//       $data[$row->category]->items[] =(object)[
//        'id'=>$row->id,
//        'name'=>$row->permission_name,
//        'report_code'=>$row->report_code,
//        //'report_id'=>$row->report_id,
//        'status_id'=>$row->status_id
//       ];
     
//     }
//     return $data;

//  }

  function addAccessibleModule($module_id, $role_id, $ss = null)
  {
    $ss = $ss ? $ss : $this->userInfo;
    $branch_id = $ss ? $ss->branch_id : null;

    $branch_id = Sanitizer::sanitize($branch_id);
    $role_id = Sanitizer::sanitize($role_id);
    $module_id = Sanitizer::sanitize($module_id);
    $mod = DB::table('um_app_modules as m')->where('m.id', $module_id)->take(1)->selectRaw('id,module_name AS `name`')->get()->first();
    if (!$mod)  return DV::error('The provided module ID is not valid');
    $role = DB::table('um_roles')->where('id', $role_id)->take(1)->selectRaw('id,name')->get()->first();
    if (!$role)  return DV::error('The provided role ID is not valid');
    $id = DB::table('um_role_modules')->where('module_id', $module_id)->where('role_id', $role_id)->value('id');
    if (!$id) {
      $inputs = ['module_id' => $module_id, 'role_id' => $role_id, 'start_date' => getNowTime()];
      $id = saveData($ss, 'um_role_modules', ['id' => null], $inputs, [], 0, false);
    }
    if ($id) {
      $users = DB::table('um_user_roles')->where('role_id', $role_id)->selectRaw('user_id')->distinct()->get();
      foreach ($users as $user) {
        $test_id = DB::table('um_user_modules')->where('user_id', $user->user_id)->where('module_id', $module_id)->take(1)->value('id');
        if (!$test_id) {
          $inputs = ['user_id' => $user->user_id, 'module_id' => $module_id,'role_id'=>$role_id,'start_date' => getNowTime()];
          saveData($ss, 'um_user_modules', ['id' => null], $inputs, [], 0, false);
        }
      }
    }
    return DV::depends($id, null, 'Failed to add role module');
  }
      //$d = {role_id, [show_all]}
      function getPermissionsByRole($arr,$ss) {
        $d = (object)$arr;
        //$branch_id = Sanitizer::sanitize($ss->branch_id);
        $role_id = Sanitizer::sanitize($d->role_id);
        $search_value = isset($d->search_value)?$d->search_value:null;
        $show_all = isset($d->show_all)?$d->show_all:0;
        $rows = [];
        $app_id = DB::table('um_roles')->where('id',$role_id)->take(1)->value('app_id');
        $str_search = "1=1";
        if($search_value) {
          $search_value = escape_like_str($search_value);
          $str_search = " (p.id = '$search_value' OR p.name LIKE '%$search_value%' OR m.module_name LIKE '%$search_value%')";
        }

        if($show_all==0)
          $rows = DB::select(DB::raw('SELECT rp.role_id, p.id,p.name, m.module_name AS module_name, 1 as has_prn FROM um_permissions AS p INNER JOIN um_role_permissions as rp ON p.id = rp.permission_id INNER JOIN um_app_modules AS m ON m.id = p.module_id WHERE p.app_id =\''.$app_id.'\' AND rp.role_id ='.($role_id?$role_id:0).' AND '.$str_search));
        else
          $rows = DB::table('um_permissions as p')->join('um_app_modules as m','m.id','=','p.module_id')->where('p.app_id',$app_id)->whereRaw($str_search)->selectRaw("p.id,p.name,m.module_name AS module_name, has_prn($role_id,p.id) as has_prn")->orderByRaw('has_prn DESC,module_id')->get();

         return $rows;
    }

    function getRoleReports($arr, $ss){
      $d = (object)$arr;
      $app_id = isset($d->app_id)? $d->app_id:null;
      $role_id = isset($d->role_id)? $d->role_id:null;
      $role_id  =  $role_id  ?? 0;
      $search_value =isset($d->search_value) ? $d->search_value : null;
      $str_app = '1=1';
      $str_search = '2=2';
      if($search_value){
         $search_value = escape_like_str($search_value);
         if ($search_value > 0) $str_search = 'prn.id = '.$search_value;
         else $str_search = '(rpt.name LIKE \'%'.$search_value.'%\' OR prn.name LIKE \'%'.$search_value.'%\')';
      }else{
        if($app_id) $str_app = 'rc.app_id =\''.$app_id.'\'';
      }
      $cols = 'prn.id, prn.name AS permission_name,rpt.id as report_id, rpt.category_id,rc.name AS category, rpt.code as report_code, has_prn('.$role_id.',prn.id) AS status_id';
      $rows = DB::table('um_permissions as prn')
      ->join('reports as rpt','rpt.permission_id','=','prn.id')
      ->join('report_categories as rc','rc.id','=','rpt.category_id')
      ->whereRaw($str_app)
      ->whereRaw($str_search)
      ->selectRaw($cols)->get();
      $data = [];
      foreach($rows as $row){
        // $I=0;
        if (!isset($data[$row->category])){
         $data[$row->category] = (object)[
           'id'=>$row->category_id,
           'name'=>$row->category,
           'items'=>[]
         ];
        }
        
        $data[$row->category]->items[] =(object)[
         'id'=>$row->id,
         'name'=>$row->permission_name,
         'report_code'=>$row->report_code,
         //'report_id'=>$row->report_id,
         'status_id'=>$row->status_id
        ];
       
      }
      return $data;
  
   }

      function findPermissions($search_value){
        //$d = (object)$arr;
        //if(!isset($d->search_value)) $d->search_value =0;
        $search_value = escape_like_str($search_value);
        $rows = DB::select(DB::raw("SELECT p.id,p.name FROM um_permissions AS p WHERE (p.id ='$search_value' OR p.name LIKE'%".$search_value."%')"));
        return $rows;
    }

      //Test whether a given @role can access to use a specified Application Module
      function role_access_module($role_id,$module_id){
        $x = DB::table('um_role_modules')->where('role_id',$role_id)->where('module_id',$module_id)->limit(1)->exists();
        return $x;  //false/true
      }

      //test if a permision belongs to a module
      function prn_belongsToModule($permission_id,$module_id) {
        $m = DB::table('um_permissions')->where('permission_id',$permission_id)->where('module_id',$module_id)->limit(1)->exists();
        return $m;
      }

      function addPermissionToRole($prn_id, $role_id, $ss = null)
        {
            $auto_add_module_access = true;
            $ss = $ss ? $ss : $this->userInfo;
            $branch_id = $ss ? $ss->branch_id : null;
            $branch_id = Sanitizer::sanitize($branch_id);
            $role_id = Sanitizer::sanitize($role_id);
            //$str_branch =$branch_id>0? "m.branch_id =$branch_id" :"1=1";
            if (empty($role_id)) return DV::error("role ID is not valid");

            $module_id = null;
            $module_name = null;
            $row = DB::table('um_permissions as p')
            ->join('um_app_modules as m', 'm.id', '=', 'p.module_id')
            ->where('p.id', $prn_id)
            ->selectRaw('p.module_id,p.app_id,m.module_name')
            ->take(1)
            ->get()
            ->first();
            if ($row) {
            $module_id = $row->module_id;
            $module_name = $row->module_name;
            }

            if ($module_id) {
                if (!self::role_access_module($role_id, $module_id)) {
                if ($auto_add_module_access) {
                    // $inputs = ['role_id' => $role_id, 'module_id' => $module_id, 'start_date' => getNowTime()];
                    DB::table('um_role_modules')->insert([
                        'role_id' => $role_id,
                        'module_id' => $module_id
                    ]);
                } else return DV::error("Need access to $module_name in order to use permission $prn_id");
                }
            } else {
            $test_id = DB::table('um_permissions')->where('id', $prn_id)->take(1)->value('id');
            if (!$test_id) return DV::error('Permission Number id not valid');
            }

            $id = DB::table('um_role_permissions')->where('role_id', $role_id)->where('permission_id', $prn_id)->take(1)->value('id');
            $inputs = ['role_id' => $role_id, 'permission_id' => $prn_id, 'start_date' => getNowTime()];
            $id = saveData($ss, 'um_role_permissions', ['id' => $id], $inputs, [], 0, false);
            if ($id > 0) {
            //Ensure that all users in the provided $role_id has this permission ($prn_id)
            $users = DB::table('um_user_roles as ur')->join('um_users as u','u.id','=','ur.user_id')->where('ur.role_id', $role_id)->select('ur.user_id')->get();
            foreach ($users as $user) {
                $test_id = DB::table('um_user_permissions')->where('user_id', $user->user_id)->where('permission_id', $prn_id)->take(1)->value('id');
                if (!$test_id) {
                $inputs = ['user_id' => $user->user_id,'role_id' => $role_id, 'permission_id' => $prn_id, 'start_date' => getNowTime()];
                saveData($ss, 'um_user_permissions', ['id' => null], $inputs, [], 0, false);
                }
            }
            }
            return DV::success(['role_id' => $role_id, 'prn_id' => $prn_id, 'module_id' => $module_id]);
        }

    // $d = {role_id,id|ids}
        function removePermissionFromRole($ids, $role_id, $ss = null)
        {
        //$branch_id = Sanitizer::sanitize($ss->branch_id);
        $role_id = Sanitizer::sanitize($role_id);
        /** $ids is a list of permission Ids separated by | **/
        $ids = isset($ids) ? Sanitizer::sanitize($ids) : null;

        if (empty($role_id)) return DV::error("role ID is not valid");
        $ms = explode('|', $ids);
        foreach ($ms as $m) {
            if ($m > 0) {
            DB::table('um_user_permissions')->where('role_id',$role_id)->where('permission_id',$m)->delete();
            DB::delete(DB::raw("DELETE FROM um_role_permissions WHERE role_id ='$role_id' AND permission_id ='$m' "));
            }
        }
        return DV::success();
        }

      //get permission list for the currently loged in user
      function getPermissions_cu($d){
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = Sanitizer::sanitize($ss->branch_id);

        //$login_name = null;
        //get permission list for the currently loged in user
        //$login_name = Sanitizer::sanitize($d->login_name);
        //if(!$login_name) $login_name = Sanitizer::sanitize($ss->login_name);

        $user_id = $ss->user_id;
        //$q = DB::select(DB::raw("SELECT u.id FROM um_users AS u WHERE u.login_name ='".$login_name."' AND u.app_id ='".self::$app_id."' LIMIT 1"));
        //foreach($q as $row) $user_id = $row->id;
        $rows = DB::select(DB::raw("SELECT DISTINCT rp.permission_id FROM um_user_roles AS ur INNER JOIN um_role_permissions AS rp ON ur.role_id = rp.role_id WHERE ur.user_id ='$user_id' AND ur.app_id ='".self::$app_id."' ORDER BY rp.permission_id ASC"));
        return $rows;
    }

    function getPermissionsByUserId($d){
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $$user_id = Sanitizer::sanitize($d->user_id);
        return DB::select(DB::raw("SELECT DISTINCT rp.permission_id FROM um_user_roles AS ur INNER JOIN um_role_permissions AS rp ON ur.role_id = rp.role_id WHERE ur.user_id ='".$user_id."' AND ur.app_id ='".self::$app_id."' ORDER BY rp.permission_id ASC"));

     }

     function getAccessibleModulesByRoleId_internal($role_id)
     {
       if (!($role_id > 0)) $role_id = Sanitizer::sanitize($role_id);
       $mods = DB::select(DB::raw('SELECT DISTINCT m.id,m.display_order,m.disabled,m.hidden,m.module_name AS `name`
           FROM um_app_modules AS m INNER JOIN um_role_modules AS rm ON m.id = rm.module_id
           WHERE IFNULL(m.hidden,0) =0 AND rm.role_id =' . ($role_id ? $role_id : 0) . ' ORDER BY m.disabled ASC, m.display_order ASC'));
       return $mods;
     }

     function getAccessibleModulesByUserId_internal($user_id){
        $user_id = $user_id?$user_id:0;
        if(!($user_id>0)) $user_id = Sanitizer::sanitize($user_id);
        $mods = DB::table('um_user_modules as um')->where('user_id',$user_id)->join('um_app_modules as m','m.id','=','um.module_id')->selectRaw('m.id,m.disabled')->distinct()->get();
        // $mods = DB::select(DB::raw("SELECT DISTINCT m.id,m.display_order,m.disabled,m.hidden,m.module_name AS `name`
        // FROM um_app_modules AS m INNER JOIN um_user_modules AS um ON m.id = um.module_id
        // WHERE IFNULL(m.hidden,0) =0 AND um.user_id = $user_id ORDER BY m.disabled ASC, m.display_order ASC"));
        return $mods;
     }

     function getPermissionsByUserId_internal($user_id){
        return DB::table('um_user_permissions')->where('user_id',$user_id)->selectRaw('permission_id,role_id')->get();
     }

     static function belongToClass($user_id,$user_class){
       return DB::table("um_users")->where("id",$user_id)->where("user_class",$user_class)->value("id");
     }

  static function isSystemAdmin($user_id){
      $users = Cache::get('users',null);
      if(!$users){
        $users = DB::table('um_users as u')->selectRaw('u.id,u.login_name,u.is_locked,u.`status`,u.lang,u.user_class,u.is_system_admin')->get();
        Cache::put('users',$users,30);
      }
      $rows = $users->filter(function($user) use($user_id){
        $is_system_admin = isset($user->is_system_admin)?$user->is_system_admin:0;
        return $user_id == $user->id && $is_system_admin == 1;
      });

      return count($rows)>0? true : false;
  }

  static function access_mod($mod_id, $user_id = null,$module_ids = null) {
      if($module_ids){
         foreach($module_ids as $mid){
           $x = self::access_mod($mid, $user_id);
           if($x) return true;
         }
         return false;
      }
      if(!$user_id) $user_id = Session::get('user_id');
      if (!$mod_id || !$user_id) return false;
      if (self::isSystemAdmin($user_id)) return true;

      $key = 'user_mods_' . $user_id;
      $mods = Cache::remember($key, 10, function () use ($user_id) {
        //   return DB::table('um_user_roles AS ur')
        //       ->join('um_role_modules as rm', 'rm.role_id', '=', 'ur.role_id')
        //       ->where('ur.user_id', $user_id)
        //       ->selectRaw('rm.module_id AS id')
        //       ->get();
        return DB::table('um_user_modules as ur')->where('ur.user_id', $user_id)->selectRaw('ur.module_id AS id')->get();
      });
      $row = $mods->filter(function($m) use($mod_id){
        return $m->id == $mod_id;
      });
      return count($row)>0? true:false;
  }

  function getAuthData($d)
  {
        $ss = self::getUserInfoByToken($d, -1);
        if ($ss->status_code != 200) return $ss; //user not authenticated
        $user_id = $ss->user_id;
        //$q = DB::select(DB::raw("SELECT u.id FROM um_users AS u WHERE u.login_name ='".$login_name."' AND u.app_id ='".self::$app_id."' LIMIT 1"));
        //foreach($q as $row) $user_id = $row->id;
        // $prns = DB::select(DB::raw("SELECT DISTINCT rp.permission_id FROM um_user_roles AS ur INNER JOIN um_role_permissions AS rp ON ur.role_id = rp.role_id WHERE ur.user_id ='$user_id' AND ur.app_id ='" . self::$app_id . "' ORDER BY rp.permission_id ASC"));
        $prns = DB::table('um_user_permissions')->where('user_id',$user_id)->selectRaw('permission_id,role_id')->get();
        $mods =  $mods = DB::table('um_user_modules as um')->where('user_id',$user_id)->join('um_app_modules as m','m.id','=','um.module_id')->selectRaw('m.id,m.disabled')->distinct()->get();
        // $mods = DB::select(DB::raw("SELECT DISTINCT m.id,m.disabled
        // FROM um_app_modules AS m INNER JOIN um_role_modules AS rm ON m.id = rm.module_id
        // INNER JOIN um_user_roles AS ur ON ur.role_id = rm.role_id
        // WHERE IFNULL(m.hidden,0) =0 AND ur.user_id ='$user_id' ORDER BY m.disabled ASC, m.display_order ASC"));

        return (object)['user'=>(object)['id'=>$user_id,'login_name'=>$ss->login_name,'name'=>$ss->full_name,'user_class'=>$ss->user_class],'prns' => $prns, 'modules' => $mods, 'is_super_admin' => self::isSystemAdmin($user_id),'user_id' => $user_id];
   }

  //      function getAuthData($d){
  //         $ss = self::getUserInfoByToken($d,-1);
  //         if($ss->status_code !=200) return $ss; //user not authenticated
  //         //$branch_id = Sanitizer::sanitize($ss->branch_id);

  //         //$login_name = null;
  //         //get permission list for the currently loged in user
  //         //$login_name = Sanitizer::sanitize($d->login_name);
  //         //if(!$login_name) $login_name = Sanitizer::sanitize($ss->login_name);

  //         $user_id = $ss->user_id;
  //         //$q = DB::select(DB::raw("SELECT u.id FROM um_users AS u WHERE u.login_name ='".$login_name."' AND u.app_id ='".self::$app_id."' LIMIT 1"));
  //         //foreach($q as $row) $user_id = $row->id;
  //         $prns = DB::select(DB::raw("SELECT DISTINCT rp.permission_id FROM um_user_roles AS ur INNER JOIN um_role_permissions AS rp ON ur.role_id = rp.role_id WHERE ur.user_id ='$user_id' AND ur.app_id ='".self::$app_id."' ORDER BY rp.permission_id ASC"));

  //         $mods = DB::select(DB::raw("SELECT DISTINCT m.id,m.disabled, m.module_name AS `name`, m.module_name_native AS name_native, m.icon_image, m.target_url,m.display_order
  //         FROM um_app_modules AS m INNER JOIN um_role_modules AS rm ON m.id = rm.module_id
  //         INNER JOIN um_user_roles AS ur ON ur.role_id = rm.role_id
  //         WHERE IFNULL(m.hidden,0) =0 AND ur.user_id ='$user_id' ORDER BY m.disabled ASC, m.display_order ASC"));
  //         return (object)['user'=>(object)['id'=>$user_id,'user_id'=>$user_id,'login_name'=>$ss->login_name,'name'=>$ss->full_name,'user_class'=>$ss->user_class],'prns'=>$prns,'modules'=>$mods,'is_super_admin'=>self::isSystemAdmin($user_id)];
  //    }

  function getPermissionsByRoleId($role_id,$ss=null){
    $app_id = DB::table('um_roles')->where('id',$role_id)->take(1)->value('app_id');
    $role_id = Sanitizer::sanitize($role_id);
    return DB::select(DB::raw("SELECT DISTINCT rp.permission_id FROM um_user_roles AS ur INNER JOIN um_role_permissions AS rp ON ur.role_id = rp.role_id WHERE ur.role_id ='$role_id' AND ur.app_id ='".$app_id."' ORDER BY rp.permission_id ASC"));
  }
  function localizePermissions($d){
      $ss = self::getUserInfoByToken($d,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
        //$d->login_name = $ss->login_name;
        $data = $this->getPermissions_cu($d);
        //session->put(('prns'),$data);
  }

  static function allowed($prn_id, $module_id = null,$user_id=null)
  {
    //prn_id = -1 means No need to check for permission
    if ($prn_id == -1) return true;
    if (!$user_id) $user_id = Session::get('user_id');
    if(!$user_id) return false;
    if (self::isSystemAdmin($user_id)) return true;
    // if ($module_id){
    //   if(!self::access_mod($module_id,$user_id)) return false;
    // }
    if (!$prn_id) return false;
    $key = 'user_prns_'.$user_id;
    $prns = Cache::get($key,null);
    if(!$prns){
       $prns = DB::table('um_user_permissions as p')->where('p.user_id',$user_id)->selectRaw('p.user_id,p.permission_id')->get();
       Cache::put($key,$prns,20);
    }
    $rows = $prns->filter(function($r) use($prn_id){
       return $r->permission_id == $prn_id;
    });
     return count($rows)>0?true:false;
  }

    //Check if current user has access to a MODULE refered by module_code or ref_code
      function accessibleModule($d) {
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        //$branch_id = Sanitizer::sanitize($ss->branch_id);
        $ref_code = Sanitizer::sanitize($d->ref_code);
        $user_id = Sanitizer::sanitize($ss->user_id);

      //UMM = User Management Module
      if (strtoupper($ref_code) =='UMM'){
         $q = DB::select(DB::raw("SELECT u.previlege_type FROM um_users AS u WHERE u.user_id ='".$user_id."' LIMIT 1"));
         $p_type ='standard';
         foreach($q as $row) $p_type = strtolower($row->previlege_type);
         if($p_type ==='admin' || $p_type ==='admins') return true;
      }

      $q = DB::select(DB::raw("SELECT ur.user_id FROM  um_user_roles AS ur INNER JOIN um_role_modules AS rm ON ur.role_id = rm.role_id WHERE ur.user_id ='$user_id' AND rm.module_code ='$ref_code' LIMIT 1"));
      if(count($q) >0) return true;
      return false;
    }

    function getComboItems_userclass($d=null){
      $items = [];
      foreach(self::$user_classes as $key=>$item){
        if ($item['used'] ===1) $items[] = (object)['user_class'=>$key,'user_class_name'=>$item['name']];
      }
      return $items;
    }

    static function logout_mobile($user_id,$app_id){
      if (!self::existsBy('user_id',$user_id,$app_id)) return "User identity not valid";
      DB::table('um_sessions')->where('user_id',$user_id)->where('app_id',$app_id)->delete();
      return true;
    }

    static function currentUser(){
       if (!Session('user_id',null)) return null;
       return (object)[
           'id'=>Session('user_id'),
           'official_id'=>Session('official_id'),
           'name'=>Session('full_name'),
           'email'=>Session('email'),
           'user_class'=>Session('user_class'),
           'mods'=>Session('mods'),
           'prns'=>Session('prns')
       ];
    }

    //UM::hasRole('Providers')?
    static function hasRole($role_name_or_id =null,$user_id=null){
       if(!$role_name_or_id) return false;
        $role_id = 0;
        $app_id = self::$app_id;
        if (!($role_name_or_id > 0)) {
           $rows = DB::table('um_roles as r')->where('r.name',$$role_name_or_id)->selectRaw('r.id')->take(1)->get();
           foreach($rows as $r) $role_id = $r->id;
        }

       if(!$user_id) {
         $cu = self::currentUser();
         if ($cu) $user_id = $cu->id; else return false;
       }
       $rows = DB::table('um_user_roles as r')->where('user_id',$user_id)->where('role_id',$role_id)->where('r.app_id',$app_id)->selectRaw('user_id')->limit(1)->get();
       return count($rows)>0;
    }

  //   static function hasRoleName($role_name=null,$user_id=null){
  //     if (!$role_name) return false;
  //     if(!$user_id) {
  //       $cu = self::currentUser();
  //       if ($cu) $user_id = $cu->id; else return false;
  //     }

  //     $rows = DB::table('um_user_roles as r')->where('user_id',$user_id)->where('role_id',$role_id)->selectRaw('user_id')->limit(1)->get();
  //     if(isset($rows[0])) return true;
  //     return false;
  //  }

   //return one first role randomly. role is object {id,name}
    static function firstRole($user_id=0){
      return DB::table('um_user_roles as ur')->join('um_roles as r','ur.role_id','=','r.id')->where('ur.user_id',$user_id)->selectRaw('ur.user_id,r.id,r.name')->take(1)->first();
   }

  static function getRoleName($id){
    return DB::table('um_roles as r')->where('r.id',$id)->take(1)->value('name');
  }

   static function correctUserClass($user_class) {
     if(!$user_class) return false;
     return isset(self::$user_classes[strtolower($user_class)]);
   }

    static function deactivateMySelf($arr, $ss){
      $user_id =$ss->user_id;
      DB::table('um_users')->where('id',$user_id)->update(['status'=>'inactive','updated_at'=>getNowTime(),'update_uid'=>$user_id,'update_user'=>$ss->full_name]);
      return DV::success();
    }

    function getUserRoleListPaginate($arr,$user_id=0,$ss=null)
    {
        //$branch_id = $ss->branch_id;
        $d = (object)$arr;
        $app_id = DB::table('um_users')->where('id',$user_id)->take(1)->value('app_id');
        $current_page = isset($d->current_page) ? $d->current_page : 1;
        $per_page = isset($d->per_page) ? $d->per_page : 10;
        if (!is_numeric($current_page)) $current_page = 1;
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = isset($d->search_value) ? $d->search_value:null;
        $str_search = '1=1';
        if($search_value){
            $str_search = '(r.name LIKE \'%' . $search_value . '%\' OR r.id = \''.$search_value.'\')';
            $skip_rows = 0;
        }
        $query = DB::table('um_roles as r')
        ->where('r.app_id',$app_id)
        ->whereRaw($str_search)

        ->selectRaw('r.id,r.name,r.app_id')
        ->orderBy('r.id','DESC');
        $count_query = clone $query;
        $count = $count_query->count('r.id');
        if($search_value && $count > 0) $per_page = $count;
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        $user_roles = DB::table('um_users as u')->where('u.id',$user_id)->join('um_user_roles as ur', 'u.id', '=', 'ur.user_id')->get();//;
        foreach($rows as $row){
            $has_role = self::getUserWithRole($user_roles,$row->id);
            $row->allowed = $has_role->allowed;
            $row->label = $has_role->label;
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function getUserWithRole($rows,$role_id){
        $c = null;
        $i = 0;
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            if($c->role_id == $role_id){
                return (object)[
                    'allowed' => 1,
                    'label' => 'Remove'
                ];
            }
            $i++;
        }while($c);
        return (object)[
            'allowed' => 0,
            'label' => 'Add'
        ];
    }


  function getUserModuleListPaginate($arr = null,$user_id=0,$ss = null)
  {
    $branch_id = $ss->branch_id;

    $d = (object)$arr;
    $app_id = DB::table('um_users as u')->where('id',$user_id)->take(1)->value('app_id');
    $current_page = isset($d->current_page) ? $d->current_page : 1;
    $per_page = isset($d->per_page) ? $d->per_page : 10;
    if (!is_numeric($current_page)) $current_page = 1;
    $skip_rows = ($current_page - 1) * $per_page;
    $search_value = isset($d->search_value) ? $d->search_value:null;
    $str_search = '1=1';
    if($search_value){
        $str_search = '(am.module_name LIKE \'%' . $search_value . '%\' OR am.id = \''.$search_value.'\')';
        $skip_rows = 0;
    }
    $query = DB::table('um_app_modules as am')->whereRaw($str_search)->where('am.app_id',$app_id)->whereRaw('IFNULL(am.hidden,0) =0')->selectRaw('am.id,am.ref_code,am.module_name')->orderBy('am.id','asc');
    $count_query = clone $query;
    $count = $count_query->count('am.id');
    if($search_value && $count > 0) $per_page = $count;
    $rows = $query->skip($skip_rows)->take($per_page)->get();
    $user_permissions = DB::table('um_users as u')->where('u.branch_id',$branch_id)->where('u.id',$user_id)->join('um_user_modules as um', 'u.id', '=', 'um.user_id')->get();//;
    foreach($rows as $row){
        $has_prn = self::getUserWithModule($user_permissions,$row->id);
        $row->access = $has_prn->access;
        $row->label = $has_prn->label;
    }
    return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
  }

  function addModuleToUser($mod_id, $user_id = null, $ss = null)
  {
    if (!$user_id) $user_id = $ss ? $ss->user_id : null;
    if(!$mod_id) return DV::error('Module ID does not exist');
    if (!$user_id) return DV::error('User ID not found');
    $exists = DB::table('um_users')->where('id',$user_id)->take(1)->value('id');
    if(!$exists) return DV::error('User ID not not valid');
    $isModID = DB::table('um_app_modules')->where('id',$mod_id)->take(1)->value('id');
    if(!$isModID) return DV::error('Module does not exists');
    $success = 0;
    $test_id = DB::table('um_user_modules')->where('user_id', $user_id)->where('module_id', $mod_id)->take(1)->value('id');
    if (!$test_id) {
      $inputs = ['user_id' => $user_id, 'module_id' => $mod_id, 'start_date' => getNowTime()];
      $test_id = saveData($ss,'um_user_modules', ['id' => null], $inputs, [], 0, false);
      $success=1;
    }
    return DV::depends($success, null, 'Module is aready assigned');
  }
 
  function removeUserModule($mod_id, $user_id = null, $ss = null)
  {
    //if(!$user_id) $user_id = $ss? $ss->user_id:null;
    if (!$user_id) return DV::error('User ID not not valid');
    $isModID = DB::table('um_app_modules')->where('id',$mod_id)->take(1)->value('id');
    if(!$isModID) return DV::error('Module does not exists');
    $x = DB::table('um_user_modules')->where('user_id', $user_id)->where('module_id', $mod_id)->delete();

    /** start:: Remove all user's permissions that belong to this module */ 
      DB::table('um_user_permissions')
      ->where('user_id', $user_id)
      ->whereIn('permission_id', function ($query) use ($mod_id) {
          $query->select('id')
                ->from('um_permissions')
                ->where('module_id', $mod_id);
      })
      ->delete();
       /** end:: Remove all user's permissions that belong to this module */ 
      return DV::depends($x, null, 'Failed to remove user module');
  }

  static function getUserWithModule($rows,$module_id){
    $i=0;
    $c=null;
    do{
        if(!isset($rows[$i])) break;
        $c = $rows[$i];
        if($c->module_id == $module_id){
            return (object)[
                'access' => 1,
                'label' => 'Remove',
            ];
        }
        $i++;
    }while($c);
    return (object)[
        'access' => 0,
        'label' => 'Add',
    ];
  }

  function permissionList($ss){
    $rows = DB::table('um_permissions as p')->where('p.category','<>','report')->join('um_app_modules as um','um.id','=','p.module_id')->selectRaw('p.id,p.name,p.module_id,CONCAT(um.module_name,\'(\',p.module_id,\')\') as module_name,p.app_id,p.category')->orderBy('p.id','ASC')->get();
    return $rows;
  }

  function getUserPermissions_paginate($arr,$user_id=0,$ss){
    $branch_id = $ss->branch_id;

    $d = (object)$arr;
    $app_id = DB::table('um_users')->where('id',$user_id)->take(1)->value('app_id');
    $current_page = isset($d->current_page) ? $d->current_page : 1;
    $per_page = isset($d->per_page) ? $d->per_page : 10;
    if (!is_numeric($current_page)) $current_page = 1;
    $skip_rows = ($current_page - 1) * $per_page;
    $search_value = isset($d->search_value) ? $d->search_value:null;
    $str_search = '1=1';
    if($search_value){
        $str_search = '(p.name LIKE \'%' . $search_value . '%\' OR p.id = \''.$search_value.'\')';
        $skip_rows = 0;
    }
    $query = DB::table('um_permissions as p')->join('um_app_modules as um','um.id','=','p.module_id')->whereRaw($str_search)->where('p.category','<>','report')->where('p.app_id',$app_id)->selectRaw('p.id,p.name,p.module_id,CONCAT(um.module_name,\'(\',p.module_id,\')\') as module_name,p.app_id,p.category')->orderBy('p.id','DESC');
    $count_query = clone $query;
    $count = $count_query->count('p.id');
    if($search_value && $count > 0) $per_page = $count;
    $rows = $query->skip($skip_rows)->take($per_page)->get();
    $user_permissions = DB::table('um_users as u')->join('um_user_permissions as um', 'u.id', '=', 'um.user_id')->where('u.branch_id',$branch_id)->where('u.id',$user_id)->selectRaw('permission_id,user_id')->get();//;
    foreach($rows as $row){
        $has_prn = self::getUserWithPermission($user_permissions,$row->id);
        $row->allowed = $has_prn->allowed;
        $row->label = $has_prn->label;
    }
    return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
  }

  static function getUserWithPermission($rows,$permission_id){
    $i=0;
    $c=null;
    do{
        if(!isset($rows[$i])) break;
        $c = $rows[$i];
        if($c->permission_id == $permission_id){
            return (object)[
                'allowed' => 1,
                'label' => 'Remove',
            ];
        }
        $i++;
    }while($c);
    return (object)[
        'allowed' => 0,
        'label' => 'Add',
    ];
  }
 
  function addPermissionToUser($prn_id, $user_id = null, $ss = null)
  {
    if(!self::allowed(105)) return DV::error('You need permission 105 to do this job');
    if (!$user_id) $user_id = $ss ? $ss->user_id : null;
    if (!$user_id) return DV::error('User ID not valid');
    $success = 0;
    $user_prn_id = DB::table('um_user_permissions')->where('user_id', $user_id)->where('permission_id', $prn_id)->take(1)->value('id');
    if (!$user_prn_id) {
      $prn = DB::table('um_permissions as p')->where('id',$prn_id)->selectRaw('id,module_id')->take(1)->first();
      if(!$prn) return DV::error('Permission ID ? does not exists::'.$prn_id);
      self::addModuleToUser($prn->module_id,$user_id,$ss);
      $inputs = ['user_id' => $user_id, 'permission_id' => $prn_id, 'role_id' => null, 'start_date' => getNowTime()];
      $user_prn_id = saveData($ss, 'um_user_permissions', ['id' => null], $inputs, [], 0, false);
      $success=1;
    }
    return DV::depends($success, null, 'Failed assign permission '.$prn_id);
  }

  function removeUserPermission($prn_id, $user_id = null, $ss = null)
  {
    if (!$user_id) return DV::error('User ID not not valid');
    $x = DB::table('um_user_permissions')->where('user_id', $user_id)->where('permission_id', $prn_id)->delete();
    return DV::depends($x, null, 'Failed to remove user permission');
  }
 
  /** returns list of reports with status "allowed" or "denied" for a given role 
    * $arr = ['role_id', 'app_id','serch_value']
  */
  // function getRoleReports($arr, $ss){
  //    $d = (object)$arr;
  //    $app_id = isset($d->app_id)? $d->app_id:null;
  //    $role_id = isset($d->role_id)? $d->role_id:null;
  //    $role_id  =  $role_id  ?? 0;
  //    $search_value =isset($d->search_value) ? $d->search_value : null;
  //    $str_app = '1=1';
  //    $str_search = '2=2';
  //    if($search_value){
  //       $search_value = escape_like_str($search_value);
  //       if ($search_value > 0) $str_search = 'prn.id = '.$search_value;
  //       else $str_search = '(rpt.name LIKE \'%'.$search_value.'%\' OR prn.name LIKE \'%'.$search_value.'%\')';
  //    }else{
  //      if($app_id) $str_app = 'rc.app_id =\''.$app_id.'\'';
  //    }
  //    $cols = 'prn.id, prn.name AS permission_name,rpt.id as report_id, rpt.category_id,rc.name AS category, rpt.code as report_code, has_prn('.$role_id.',prn.id) AS status_id';
  //    $rows = DB::table('um_permissions as prn')->join('reports as rpt','rpt.permission_id','=','prn.id')->join('report_categories as rc','rc.id','=','rpt.category_id')->whereRaw($str_app)->whereRaw($str_search)->selectRaw($cols)->get();
  //    $data = [];
  //    foreach($rows as $row){
  //      if (!isset($data[$row->category])){
  //       $data[$row->category] = (object)[
  //         'id'=>$row->category_id,
  //         'name'=>$row->category,
  //         'items'=>[]
  //       ];
  //      }
       
  //      $data[$row->category]->items[] =(object)[
  //       'id'=>$row->id,
  //       'name'=>$row->permission_name,
  //       'report_code'=>$row->report_code,
  //       //'report_id'=>$row->report_id,
  //       'status_id'=>$row->status_id
  //      ];
  //      return $data;
  //    }

  // }

  function getUserViewReportPermission_paginate($arr,$user_id,$ss=null){
    $d = (object)$arr;
    $app_id = DB::table('um_users')->where('id',$user_id)->take(1)->value('app_id');
    $current_page = isset($d->current_page) ? $d->current_page : 1;
    $per_page = isset($d->per_page) ? $d->per_page : 10;
    if (!is_numeric($current_page)) $current_page = 1;
    $skip_rows = ($current_page - 1) * $per_page;
    $search_value = isset($d->search_value) ? $d->search_value:null;
    $str_search = '1=1';
    if($search_value){
        $str_search = '(p.name LIKE \'%' . $search_value . '%\' OR p.id = \''.$search_value.'\')';
        $skip_rows = 0;
    }
    $query = DB::table('um_permissions as p')->whereRaw($str_search)->where('p.category','=','report')->where('p.app_id',$app_id)->join('um_app_modules as um','um.id','=','p.module_id')->selectRaw('p.id,p.name,p.module_id,CONCAT(um.module_name,\'(\',p.module_id,\')\') as module_name,p.app_id,p.category')->orderBy('p.id','DESC');
    $count_query = clone $query;
    $count = $count_query->count('p.id');
    if($search_value && $count > 0) $per_page = $count;
    $rows = $query->skip($skip_rows)->take($per_page)->get();
    $user_permissions = DB::table('um_users as u')->where('u.id',$user_id)->join('um_user_permissions as up', 'u.id', '=', 'up.user_id')->selectRaw('up.permission_id')->get();//;
    foreach($rows as $row){
        $has_prn = self::getUserWithReportPermission($user_permissions,$row->id);
        $row->allowed = $has_prn->allowed;
        $row->label = $has_prn->label;
    }
    if(!isset($rows[0])) $rows=[];
    return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
  }

  static function getUserWithReportPermission($rows,$permission_id){
    $i=0;
    $c=null;
    do{
        if(!isset($rows[$i])) break;
        $c = $rows[$i];
        if($c->permission_id == $permission_id){
            return (object)[
                'allowed' => 1,
                'label' => 'Remove'
            ];
        }
        $i++;
    }while($c);
    return (object)[
        'allowed' => 0,
        'label' => 'Add'
    ];
  }

  static function geDefaultUserPhoto($branch_id){
    return PublicStorage::getUrl($branch_id,'default','image').'default-user.png';
  }

  static function getPrimaryRole($id){
    return DB::table('um_user_roles AS ur')->join('um_roles as r','r.id','=','ur.role_id')->where('ur.user_id',$id)->where('ur.is_primary_role',1)->selectRaw('r.id,r.name')->first();
  }

  /**
   * $rows = [{user_id,role_name,role_id,is_primary_role}]
  */
  static function getPrimaryRole_local ($rows,$user_id){
     $rows->filter(function($row) use($user_id){
       return $row->user_id ==$user_id && $row->is_primary_role ==1; 
     });
    $row = isset($rows[0])? $rows[0]: (object)['role_id'=>null,'role_name'=>null];
    return (object)[
      'id'=>$row->role_id,
      'name'=>$row->role_name
    ];
  }

  function getUserDetails($id,$ss){
    $branch_id = $ss->branch_id;
    if(!$id) return DV::error('User identity is required');
    $selectCols = 'LOWER(u.user_class) AS user_class,u.login_name,u.phone_number,formatTime(u.last_login_date) AS last_login_date,u.full_name,u.official_id,u.official_code,\'\' AS role_id,u.id';
    $row = DB::table('um_users AS u')->where('u.id',$id)->selectRaw($selectCols)->first();
    if($row) {
      $role = self::getPrimaryRole($row->id);
      if($role){
        $row->role_id = $role->id;
        $row->role_name = $role->name;
      }
      $row->image_url = self::getUserPhoto($branch_id,$row->user_class,$row->id);
    }
    return $row;
  }
  
    static function getUserPhoto($branch_id,$user_class,$user_id,$file_name=null){
      $key = strtolower($user_class);
      $p = isset(self::$profile_tables[$key])? self::$profile_tables[$key]:null;
      if(!$p) return self::geDefaultUserPhoto($branch_id);
      $p_table = $p['table'];

      if($p_table ==='um_users'){
          $file_name = DB::table('um_users')->where('id',$user_id)->take(1)->value('photo_file_name');
          $url = PublicStorage::getUrl($branch_id,strtolower($user_class),'image').$file_name;
          return validateUrl($url,self::geDefaultUserPhoto($branch_id));
      }else if($p_table){
        $official_id = DB::table('um_users')->where('id',$user_id)->take(1)->value('official_id');
        if(!$official_id){
          Log::error('Failed to retrieve photo file for user id '.$user_id.' (class : '.$user_class.') because his or her official ID is missing. The default photo is used');
          return self::geDefaultUserPhoto($branch_id);
        }
    
        $pk_field = $p['key_field'];
        $photo_field = isset($p['photo_field'])?$p['photo_field']:'photo_file_name';
        $file_name = DB::table($p_table)->where($pk_field,$official_id)->take(1)->value($photo_field);
        $url = PublicStorage::getUrl($branch_id,strtolower($user_class),'image').$file_name;
        return validateUrl($url,self::geDefaultUserPhoto($branch_id)); 
      }
      return self::geDefaultUserPhoto($branch_id);
  }

  static function deleteUserPhoto($user_id,$user_class){
    $key = strtolower($user_class);
    $p = isset(self::$profile_tables[$key])?self::$profile_tables[$key]:null;
    if(!$p) return null;
    $p_table = $p['table'];
    $user = DB::table('um_users')->where('id',$user_id)->selectRaw('id,user_class,branch_id,official_id,photo_file_name')->take(1)->first();
    if(!$user) return null;
    if($p_table ==='um_users'){
      $file_name = $user->photo_file_name;
      if($file_name) PublicStorage::delete($user->branch_id,$user_class,'image',$file_name);
    }else{
      $pk_field = $p['key_field'];
      $photo_field = $p['photo_field'];
      $file_name = DB::table($p_table)->where($pk_field,$user->official_id)->take(1)->value($photo_field);
      if($file_name) PublicStorage::delete($user->branch_id,$user_class,'image',$file_name);
    }
    return true;
  }
 
  function getUserManagementOptions()
  {
    $user_classes = self::getUserClasses();
    return (object)[
      "user_classes" => $user_classes,
      "single_user_class" => (isset($user_classes[0]) && !isset($user_classes[1])),
      "allow_add_remove_role_member" => 1,
      "allow_create_user" => 1,
      "allow_edit_user_details" => 1,
      "allow_add_remove_role" => 1,
      "allow_modify_role" => 0
    ];
  }
}





