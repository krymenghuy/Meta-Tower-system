<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

use App\Models\SMS;
use Session;
use DB;
use Carbon\Carbon;
use Exception;
use Localization;
use Sanitizer;
use Config;

class UM extends Model
{
    use HasFactory;
    
    protected static $app_id = null; /** app_id for Admin Back Office **/
    protected static $user_classes = [];
    
    protected $company_id = null;
    protected $branch_id = null; //same as company_id
    protected $login_name = null;
    protected $full_name = null;
    protected $user_id = null;
   
    //### The variables below for JWT merchanism
        protected static $use_jwt = 1; //Tell UM class to use JWT mechanism to verify user'stoken
        protected static $jwt_encode ='HS256';
        protected static $jwt_lifespan =60*60; //default lifespan of JWT token (Time to expire)
        protected static $jwt_key ="This is JWT key";
        protected static $jwt_payload = [
          "iis"=>"",
          "aud"=>""
          //"iat"=>time(),
          //"nbf"=>time()+60*60
        ];
       
    //### The vaiables above for JWT merchanism
 
    protected static $use_phone_number_login = [
      'consultant'=>0,
      'doctor'=>0,
      'admin'=>0,
      'super_admin'=>0,  
      'admin_support'=>0 /* Backend user's login can be email, phone, or any name */
    ];

    protected static $required_official_profile = [
      'consultant'=>1,
      'doctor'=>1,
      'admin'=>0,
      'super_admin'=>0,  
      'admin_support'=>0
    ];

    protected static $new_user_required_password = [
      'consultant'=>1,
      'doctor'=>1,
      'admin'=>1,
      'super_admin'=>1,  
      'admin_support'=>1 /* Backend user's login can be email, phone, or any name */
    ];

    public function __construct(array $attributes = [])
    {
       //NOTE: Config::get('app.app_id') returns Backend system's app_id stored as APP_ID in env file
        self::$app_id = Config::get('app.app_id');
        $app_url = ENV('APP_URL'); // Config::get('app.app_url'); //todo: /config/app.php
        self::$jwt_payload=[
          "iis"=> $app_url,
          "aud"=> $app_url
        ];
 
        self::$user_classes = [
          'admin'=>['used'=>1,'name'=>'Admin','app_id'=>getAdminAppId()],
          'staff'=>['used'=>1,'name'=>'Staff','app_id'=>getAdminAppId()],
          //'client'=>['used'=>1,'name'=>'Client','app_id'=>getClientAppId()],
          'superadmin'=>['used'=>1,'name'=>'Super Admin','app_id'=>getAdminAppId()],
          'admin_support'=>['used'=>0,'name'=>'Admin Support','app_id'=>getAdminAppId()],
          'super_admin'=>['used'=>0,'name'=>'Super Admin','app_id'=>getAdminAppId()]
        ];
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

     //UM::setUserSession() is a static function and is the same as UM->createSession() 
     function createSession($app_id,$user){
         return self::setUserSession($app_id,$user);
     } 

     //UM::setUserSession() is a static function and is the same as UM->createSession() 
    //create session can be => (1) create in database table um_sessions, (2) create session as file, which can be faster but cannot be queried
    //NOTE: parameter @user is object with minimum fields such as {'branch_id','id','lang','login_name'}
    //UM::setUserSession() is a static function and is the same as UM->createSession() 
    //create session can be => (1) create in database table um_sessions, (2) create session as file, which can be faster but cannot be queried
    //NOTE: parameter @user is object with minimum fields such as {'branch_id','id','lang','login_name'}
    static function setUserSession($app_id,$user){
        //TODO: Do not allow creating session if user is not logged in 
      //if (strtolower($login_name) != strtolower($this->login_name)) return;
      $access_token = "";
      if (self::$use_jwt===1)  $access_token  = self::createJWT($user);
      else $access_token = self::createUserToken();

      $csrf_code = getUniqueString(38);
      $session_id = getUniqueString(38);

      $lang = isset($user->lang)?$user->lang:'en';
      if(empty($user->login_name)) return DV::error('Failed to create session info',$lang,401);
        DB::table('um_sessions')->where('login_name',$user->login_name)->where('app_id',$app_id)->delete();
        DB::table('um_sessions')->insert(array(
          'branch_id'=>$user->branch_id,
          'app_id'=>$app_id,
          'user_id'=>$user->id, //ineteger user_id
          'login_name'=>$user->login_name,
          'start_time'=>getNowTime(),
          'last_active_time'=>getNowTime(),
          'csrf_code'=>$csrf_code,
          'lang'=>$user->lang,
          'session_id'=>$session_id,
          'access_token'=>$access_token
        ));
        return (object)['status'=>'OK','access_token'=>$access_token];
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

    function getAppIdByUserClass($user_class){
       return self::$user_classes[$user_class]['app_id'];
    }

    function getModuleList($user_id =0){
        $rows = DB::table('um_app_modules AS m')->selectRaw("m.module_name, m.module_name_native, m.icon_image, m.target_url,m.display_order,m.disabled")->orderBy('display_order ASC')->get();
        return $rows;
    }
      
    function newOTP($length=6)
    {
        return join('', array_map(function($value) { return $value == 1 ? mt_rand(1, 9) : mt_rand(0, 9); }, range(1, $length)));
    }

     //Send OTP code by sms, send sms, send_sms(), sendMessage(0) 
     //sendSMS_otp()  $d = {user_id,[phone_number],[purpose]}
     //@purpose = {'change_password'}
      function sendSMS_otp($d){
          $ss = self::getUserInfoByToken($d,-1);
          if($ss->status_code !=200) return $ss; //user not authenticated

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
          $text = SMS::getMessageTemplate($purpose);
          $new_otp_code = $this->newOTP();
          $text = str_replace('otp_code',$new_otp_code,$text);
          DB::table('um_users')->where('login_name',$login_name)->update(array('otp_code'=>$new_otp_code));
          $m = SMS::send($phone_number,$text,null);
          if($m->status =='Error'){
            $e = (object)["sms_error"=>$m->error_message];
            $e->otp_code = $new_otp_code;
            return $e;
          }
          return DV::success(["otp_code"=>$new_otp_code]);
      }
   
      //verify if otp_code provided by user is correct. If correct then the otp_code is cleared out from table "um_users.otp_code"
      //$d = {otp_code,[login_name] or [user_id]}. This method returns int as 1  or 0
      function verify_otp($d){
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated

        $branch_id = Sanitizer::sanitize($ss->branch_id);
        //in case login_name is email, Sanitizer::sanitize() will mistakenly remove '@' => causing problem 
        $login_name = isset($d->login_name)?$d->login_name:null;
        $user_id = isset($d->user_id)?$d->user_id:null;

        //using Sanitizer::sanitize() means that @otp_code cannot contains any special chars
        $otp_code = isset($d->otp_code)?Sanitizer::sanitize($d->otp_code):null;
        $rows= [];

        if($login_name) 
          $rows= DB::table('um_users AS u')->where('login_name',$login_name)->where('otp_code',$otp_code)->selectRaw("id")->limit(1)->get();
        else 
          $rows= DB::table('um_users AS u')->where('id',$user_id)->where('otp_code',$otp_code)->selectRaw("id")->limit(1)->get();
        foreach($rows as $row) return 1;
        return 0;
      }

      function sendSMS($phone_number, $text,$sender_name=null){
         SMS::send($phone_number,$text,$sender_name);  
      }

      function saveRole($d){
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;

        $user_class = isset($d->user_class)?$d->user_class:null;
        $result = (object)array('status'=>'Error','error_message'=>null,'role_id'=>null);
        if (!isset($d->name) || empty($d->name)) return DV::error("Role name cannot be empty",$ss->lang,); 
        if(!isset($d->id)) $d->id = 0;
        if (empty(self::$app_id)) return DV::error("app id is not valid");
        if (!self::correctUserClass($user_class)) return DV::error("User class cannot be empty",$ss->lang);  

        if ($d->id > 0) { 
            if($this->role_exists($ss,$d->name,$d->id)) return DV::error("Role name already exists",$ss->lang);  
            DB::table('um_roles')->where('id',$d->id)->update(['name'=>$d->name,'User_class'=>$user_class]);
            $result->role_id = $d->id;
        } else {

            if($this->role_exists($ss,$d->name,null)) return DV::error("Role name already in use",$ss->lang);  

            DB::table('um_roles')->insert([
                'user_class'=>$user_class,
                'name'=>$d->name,
                'app_id'=>self::$app_id,
                'branch_id'=>$branch_id,
                'create_user'=>$ss->login_name,
                'create_date'=>getNowTime()
            ]);
            $result->role_id = DB::getPdo()->lastInsertId();
        }
        return DV::success();
    }  
       function role_exists($uss,$name,$id){
          $rows ;
          $branch_id = $uss->branch_id;
         if($id > 0){
             $rows = DB::table('um_roles')->selectRaw('id')->where('branch_id',$branch_id)->where('name',$name)->where('id','<>',$id)->limit(1)->get();
             
         } else {
            $rows = DB::table('um_roles')->selectRaw('id')->where('branch_id',$branch_id)->where('name',$name)->limit(1)->get();
            
                 }
         if(count($rows) >0) return true;
         else return false;
      } 

        function deleteRole($d) {
          $ss = self::getUserInfoByToken($d,103);
          if($ss->status_code !=200) return $ss; //user not authenticated
          $branch_id = $ss->branch_id;
          $lang = $ss->lang;
          $id = $d->role_id;
          if(!$id || $id<=0) return DV::error("Role identifier is not valid",$lang);
          DB::table('um_roles')->where('id',$id)->where('app_id',self::$app_id)->delete();
          DB::table('um_user_roles')->where('role_id',$id)->where('app_id',self::$app_id)->delete();
          return DV::success();
      }

        function addRoleMember($d){
          $ss = self::getUserInfoByToken($d,107);
          if($ss->status_code !=200) return $ss; //user not authenticated
          return $this->addRoleMember_internal($ss,$d->role_id,$d->user_id);
      }

      protected function addRoleMember_internal($uss,$role_id,$user_id){
        $branch_id = $uss->branch_id;
        $lang = $uss->lang;
        if(!isset($role_id) || empty($role_id)) return DV::error("Role ID is not valid",$lang);  
      
        DB::table('um_user_roles')->where('branch_id',$branch_id)->where('user_id',$user_id)->where('role_id',$role_id)->delete();

        DB::table('um_user_roles')->insert([
            'user_id'=>$user_id,
            'role_id'=>$role_id,
            'app_id'=>self::$app_id,
            'branch_id'=>$branch_id
        ]);
    
        $rows = DB::select(DB::raw("SELECT COUNT(ur.user_id) AS user_count FROM um_user_roles as ur WHERE ur.app_id ='".self::$app_id."' AND ur.role_id ='$role_id'"));
         $user_count = 0;
          foreach($rows as $row) $user_count = $row->user_count; 
          
        return DV::success(['user_count'=>$user_count]);
    }

        function removeAccessibleModule($d) {
          $ss = self::getUserInfoByToken($d,110);
          if($ss->status_code !=200) return $ss; //user not authenticated
         
          $branch_id = $ss->branch_id;

          $role_id = $d->role_id;
          $module_id = $d->module_id;
          DB::table('um_role_modules')->where('role_id',$role_id)->where('branch_id',$branch_id)->where('module_id',$module_id)->delete();
          DB::select(DB::raw("DELETE FROM um_role_permissions WHERE permission_id IN (SELECT id FROM um_permissions WHERE module_id ='".$module_id."') AND role_id ='".$role_id."' ")); 
          return null; 
      }

        function removeRoleMember($d){
          $ss = self::getUserInfoByToken($d,108);
          if($ss->status_code !=200) return $ss; //user not authenticated
         
          $branch_id = $ss->branch_id;

          $role_id = $d->role_id;
          $user_id = $d->user_id;
          $result = (object)array('status'=>'Error');
          DB::table('um_user_roles')->where('branch_id',$branch_id)->where('app_id',self::$app_id)->where('role_id',$role_id)->where('user_id',$user_id)->delete();
          $rows = DB::table('um_user_roles')->where('app_id',self::$app_id)->where('role_id',$role_id)->selectRaw("COUNT(user_id) AS user_count")->get();
          $result->user_count = 0;
          foreach($rows as $row)  $result->user_count = $row->user_count; 
           
            $result->status ='OK';
            $result->error_message =null;
           return $result;
      }
        function getUserRoles($d){
          $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
          $branch_id = $ss->branch_id;
          $user_id = $d->user_id;
          $rows = DB::table('um_user_roles AS u')->where('u.branch_id',$branch_id)->where('u.app_id',self::$app_id)->where('u.user_id',$user_id)->selectRaw("u.id,u.name")->get();
          return $rows;
      }

        function getRoleList($d){
          $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
          $branch_id = Sanitizer::sanitize($ss->branch_id);
          $rows = DB::table('um_roles AS r')->selectRaw("r.id, r.`name`,r.user_class, (SELECT COUNT(ur.user_id) FROM um_user_roles AS ur INNER JOIN um_users as u ON u.id = ur.user_id WHERE ur.branch_id = u.branch_id AND ur.role_id = r.id) AS user_count")->where('r.branch_id',$branch_id)->get();
          return $rows; 
        }

        function getRoleMembers($d){
          $ss = self::getUserInfoByToken($d,-1);
          if($ss->status_code !=200) return $ss; //user not authenticated
          $branch_id = $ss->branch_id; 
          $role_id = $d->role_id;
          $role_name = self::getRoleName($role_id);
          $rows = DB::table('um_user_roles AS ur')->join('um_users AS u','u.id','=','ur.user_id')->selectRaw("'$role_name' as role_name,u.id,u.login_name,u.full_name,u.official_code,u.phone_number, u.email,u.otp_code,u.user_class")->where('u.branch_id',$branch_id)->where('ur.role_id',$role_id)->get();
          return $rows; 
       }

        function getRoleById($d) {
          $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
          $branch_id = $ss->branch_id; 
          $id = $d->role_id; 
          $rows= DB::table('um_roles')->where('branch_id',$branch_id)->where('id',$id)->selectRaw('id,name,user_class')->limit(1)->get(); 
          foreach($rows as $row) return $row;
          return null; 
      }

        function getUserList($d){
          $ss = self::getUserInfoByToken($d,-1);
          if($ss->status_code !=200) return $ss; //user not authenticated
          $branch_id = $ss->branch_id;
          $str_user_class ="1=1";
          $user_class = isset($d->user_class)?$d->user_class:null;
          if($user_class) $str_user_class="u.user_class ='$user_class'";

          $str_search ='';
          if(isset($d->search_value)) {
              if(!empty($d->search_value)) {
                  $str_search =" AND u.login_name LIKE '%". escape_like_str($d->search_value)."%' OR u.full_name LIKE '%".escape_like_str($d->search_value)."%' " ;
              }
          }
          $more_where = "1=1".$str_search;
          $rows = DB::table('um_users as u')->whereRaw($str_user_class)->whereRaw($more_where)->selectRaw("u.id,u.official_id,u.official_code, u.full_name, u.login_name, u.user_class, u.previlege_type, u.last_login_date, is_locked, `status`")->where('branch_id',$branch_id)->get(); 
          return $rows;
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
         $rows = DB::table('um_users AS u')->where('id',$user_id)->selectRaw($cols)->limit(1)->get(); 
        
        foreach($rows as $row) return $row;
        return null;
      }
      
      /** getProfileInfo()| getUserProfile()| getOfficialProfile() **/
      //return official profile information of a user including "official_id, official_code, name, sex, phone_number,email, address" 
      static function officialProfileInfo($branch_id,$official_code,$user_class,$cols=null){
         $profile_classes = ['staff','consultant','doctor'];
         $tables = [
            "staff"=>"employees",
            "consultant"=>"employees",
            "doctor"=>"employees"
         ];

         $rows = [];
         //NOTE: column_name can be also prefixed with alias "s."
         if(!$cols) $cols = "p.id as person_id,t.id as official_id, t.code as official_code,p.name,p.email,p.phone_number";
         if(in_array($user_class,$profile_classes)){
            $tblname = $tables[$user_class];
            if($tblname) $rows = DB::table("persons as p")->join("$tblname as t",'t.person_id','=','p.id')->where('t.code',$official_code)->where('t.branch_id',$branch_id)->selectRaw($cols)->get();
            return isset($rows[0])?$rows[0]:null;
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
       return true; //(Session::get('user_id') === 1);
    }

    //getUserListByRole()| getUsersByRole()| getUsersByRoleId()
    static function user_list_by_roles($branch_id,$role_ids){
         $str_roles = 'ur.role_id IN ('.implode(',',$role_ids).')';
         $rows = DB::table('um_users as u')->join('um_user_roles as ur','ur.user_id','=','u.id')->where('u.branch_id',$branch_id)->whereRaw($str_roles)->selectRaw("u.id,u.login_name as staff_name,u.full_name")->get();
         return $rows; 
    }

    // function person_exists($id){
    //    $rows = DB::table('persons as p')->where('id',$id)->selectRaw('id')->limit(1)->get();
    //    foreach($rows as $row) return true;
    //    return false;
    // }
       
     //Create or UpdateUser() depending on $d->user_id;
     //@params $d = {login_name,password,email,full_name,phone_number,user_class,role_id,official_id}
     function saveUser($d){
          $ss = self::getUserInfoByToken($d,100);
          if($ss->status_code !=200) return $ss; //user not authenticated
          $branch_id = $ss->branch_id;

          $validate_rule =[
             'user_id'=>"0|identity=1",
             "login_name"=>"1|string|1-35|text=The login name is too long. Max 35 characters",
             "password"=>"0|string|0-100",
             "email"=>"0|email",
             "user_class"=>"1|choice|admin,driver,merchant,sender",
             "subs_id"=>"0|string",
             "role_id"=>"1|number|exists=um_roles.id|text=User role is missing",
             "official_code"=>"0|string|1-25",
             //"official_id"=>"0|number",
             "full_name"=>"0|string",
             "previlege_type"=>"0|choice|standard|default=standard",
             "work_location_id"=>"0|string",
             "lang"=>"0|choice|en,km|default=en", 
             "status"=>"0|string|default=active"
          ];

          $check_unique = ["$branch_id|um_users|login_name|id|text=login name is already in use"]; 
          $res = validateObject($d,$validate_rule,true,['email'=>['.','@','-']],$ss->lang,false,$check_unique);
          if($res->error) return DV::error($res->error);
          $inputs = $res->values; 
          $user_id = $res->user_id;
          $user_class = $inputs['user_class'];

          if (!self::correctUserClass($user_class)) return DV::error("User Type or User Class is not correct",$ss->lang);
          //Get app_id based on a given @user_class;
          $app_id = $this->getAppIdByUserClass($user_class);
          ////$app_id = self::$app_id;
           
          //if official profile info is required
          $official_code = $inputs['official_code'];
          if (self::$required_official_profile[$user_class] === 1){
              if(!$official_code) return DV::error("Official ID is missing");
              $profile = self::officialProfileInfo($branch_id,$official_code,$user_class,null);
              if(!$profile) return DV::error("Official profile is not found for $user_class user with id $official_code");  
              //if full_name is not supplied or param $d['full_name'] is empty, then use $profile->name as user's full name
              if(!empty($inputs['full_name'])) $inputs['full_name']= $profile->name;
              if(!empty($inputs['phone_number'])) $inputs['phone_number']= $profile->phone_number;
              if(!empty($inputs['email'])) $inputs['email']= $profile->email;
              //use $profile->id or profile->official_id as official_id
              if(!isset($inputs['official_id'])) $inputs['official_id']= isset($profile->id)?$profile->id:$profile->official_id;
          }

          //$inputs['full_name'] = empty($inputs['full_name'])? $inputs['login_name']:null;
          if(empty($inputs['full_name'])) return DV::error("Full name is required");

          //$single_role_name =null;// $first_role->name;
          //$first_role =self::firstRole($d->role_id);
          if (self::$use_phone_number_login[$user_class]==1){
              if(!isset($inputs['phone_number'])) $inputs['phone_number'] = $inputs['login_name']; 
          }
           
         /*NOTE that depending on Application Context, the  @user_class can be whatever meaningful classifications such as:
           For Hospital @user_class ={doctor,patient,general people etc } 
           For School @user_class = {Staff, Student,parent} 
           For Corporate @user_class = {customer,individual customer, corporate customer, Staff}
         */
 
         $role_id = $inputs['role_id'];
         unset($inputs['role_id']);
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
         $user_id = saveData($ss,"um_users",["id"=>$user_id],$inputs,[],0);
         if($user_id >0){
              //Renew user's role by deleteing and inserting it again
              DB::table('um_user_roles')->where('user_id',$d->user_id)->where('role_id',$role_id)->delete();
              $this->addRoleMember_internal($ss,$role_id,$user_id);
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

    //getUserExtendedInfo() return object as person_info ('name','emp_code' or 'student_code','phone_number','email',etc). 
    //if $official_id <=0 it returns NULL, meaning that the user has no extended details
    //if $official_id > 0 and there is no matching person profile or no matching employee's profile => it returns '#350', meaning Authentication failed
    //depending on switch statement code specified here, getUserExtendedInfo()() may returns NULL for some $user_class such as "admin"
    static function getUserExtendedInfo($user_class,$official_id=0){
        if ($official_id<=0) return null;
        $user_class = strtolower($user_class);
        switch($user_class){
              case 'borrower':{
                $rows = DB::table('persons AS p')->where('p.branch_id',$branch_id)->where('p.id',$official_id)->selectRaw("'$user_id' AS user_id, '$login_name' AS login_name,p.id,p.n_id, CONCAT(p.last_name,' ',p.first_name) AS name ,p.phone_number,p.email")->limit(1)->get();
                foreach($rows as $row) return $row;
                return '#350';   
                break;
              }
              case 'lender':{
                $rows = DB::table('persons AS p')->where('p.branch_id',$branch_id)->where('p.id',$official_id)->selectRaw("'$user_id' AS user_id, '$login_name' AS login_name,p.id,p.n_id, CONCAT(p.last_name,' ',p.first_name) AS name ,p.phone_number,p.email")->limit(1)->get();
                foreach($rows as $row) return $row;
                return '#350';   
                break;
              }
              case 'investor':{
                $rows = DB::table('persons AS p')->where('p.branch_id',$branch_id)->where('p.id',$official_id)->selectRaw("'$user_id' AS user_id, '$login_name' AS login_name,p.id,p.n_id, CONCAT(p.last_name,' ',p.first_name) AS name ,p.phone_number,p.email")->limit(1)->get();
                foreach($rows as $row) return $row;
                return '#350';
                break;
              }
              case 'admin':{
                //admin = "back end users, who may be classififed in different groups. Each group has different permisisons level"
                return null;
                break;
              } 
              default:{
                return null;
                break;
              }
        }
       
    }

    //getUserInfoByToken() returns user info (user details) based on two factors: 
    //1. based on given access_token stored in $request->acc_tk_dms
    //2. based on given @user_class = {driver, or merchant or (admin or NULL) }
    //This method is used in mobile app's api authentication, which does not depends on web session
    static function getUserInfoByToken($request, $prn_code=-1,$prn_error_message=null){
      $def_lang ="en";
      //$access_token = self::decryptToken($request);
      $access_token = $request->bearerToken();
      if(!$access_token) return DV::error('User authentication failed',$def_lang,401);

      if (!self::allowed($prn_code)){
        if (!$prn_error_message) $prn_error_message = "Permission $prn_code is required!";
        return DV::error($prn_error_message,403); //authorization failed or No Permission
      }
      
      if (self::$use_jwt===1){
          /*
              NOTE: This will now be an object instead of an associative array. To get
              an associative array, you will need to cast it as such:
          */

          try{
              //   $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
              //   //$access_token= null;
              //   try{
              //     $access_token = $encrypter->decrypt($access_token,false);
              //   }catch(Exception $e){
              //       return null; 
              //   } 
            JWT::$leeway = 60; // $leeway in seconds
            $decoded = JWT::decode($access_token, new Key(self::$jwt_key, self::$jwt_encode));
            if(!isset($decoded->user_id)) $decoded->user_id = $decoded->id;

            //#begin:: Get special active fields "is_locked,status,lang". These fields need to be updated in the decoded JWT token on every api call
                $decoded->status="active";
                $row = self::getUserProps($decoded->user_id,"is_locked,status,lang");
                if (!$row)
                $decoded->lang = $row->lang;
                $decoded->is_locked = $row->is_locked;
                $decoded->status = $row->status;

                if (strtolower($decoded->status)==='disabled' || $decoded->is_locked === 1) return DV::error('User status is disabled or locked out',$def_lang,400);
            //#end::Get special active fields "is_locked,status,lang". These fields need to be updated in the decoded JWT token on every api call
            $ret =(object)['status_code'=>200,'status'=>'OK'];
            foreach((array)$decoded as $prop=>$value) $ret->{$prop} = $value;
            return $ret;
         }catch(\Exception $e){
              $err = $e->getMessage(); 
              if($err==="Expired token")  return DV::error($err,$def_lang,402); 
               
                \Log::error($err, [
                  'file' => $e->getFile(),
                  'line' => $e->getLine()
                  ]);
              
                 return DV::error($err,$def_lang,500); //Invalid token => user unauthenticated
         }
        
      }else{
        //NOTE: verifyUserToken() will check if the given token is Not yet expired, and is valid, then return the valid token
         $res = self::verifyUserToken($access_token);
         if ($res->status==='Error') return DV::error($res->error_message,$def_lang,$res->error_code); 
         
          $access_token = $res->access_token; 
          $user_id = null;
          $branch_id =null;
          $official_id = null;
          $login_name = null;

          //Obtain $user_id, $official_id from table "um_users"
          $rows = DB::table('um_sessions AS ss')->join('um_users as u','u.id','=','ss.user_id')->where('ss.access_token',$access_token)->selectRaw("ss.lang,ss.user_id,u.full_name,u.user_class,u.login_name,ss.branch_id, u.official_id,u.official_code")->limit(1)->get();
          foreach($rows as $row){
                return (object)['status_code'=>200,'status'=>'OK',
                'user_id'=>$row->user_id,
                'lang'=>$row->lang,
                'branch_id'=>$row->branch_id,
                'official_id' =>$row->official_id,
                'user_class'=>$row->user_class,
                'login_name'=>$row->login_name
                ,'full_name'=>$row->full_name
             ];
          }
          
          return DV::error('User authentication failed',null,401);
      }
   }

      //getUserInfo() returns "id, previlege_type, user_class,is_locked,status"
        function getUserInfo($d){
          $ss = self::getUserInfoByToken($d,-1);
          if($ss->status_code !=200) return $ss; //user not authenticated
          $branch_id = $ss->branch_id;
          $id_or_name = $d->id_or_name;
          return $this->getUserInfo1($id_or_name); 
      }

    function getUserInfo1($id_or_name){
        $id_or_name = Sanitizer::sanitize($id_or_name);
        $rows = [];
        if ($id_or_name> 0)
          $rows = DB::table('um_users AS u')->where('id',$id_or_name)->selectRaw("u.id, u.previlege_type, u.user_class, u.is_locked,u.status")->limit(1)->get();
        else
         $rows = DB::table('um_users AS u')->where('u.login_name',$id_or_name)->selectRaw("u.id, u.previlege_type, u.user_class, u.is_locked,u.status")->limit(1)->get();  
       foreach($rows as $row) return $row;
       return null;   
    }

        function deleteUser($d){
          $ss = self::getUserInfoByToken($d,101);
          if($ss->status_code !=200) return $ss; //user not authenticated
        
          $branch_id = $ss->branch_id;
          $user_id = $d->user_id;
          $user = $this->getUserInfo1($user_id);
          //For one Application or one system, => There is one in-app Admin user denoted by his "previlege_type =Admin "
          //This Admin user cannot be delete, and he can create other in-app users if needed (Depending on permissions as well)
          if(strToLower($user->previlege_type) ==='admin') {
              return DV::error("Cannot delete Admin user");
          }
          DB::table('um_users')->where('branch_id',$branch_id)->where('id',$user_id)->delete();  
          return DV::success();
      }

        function setUserStatus($d){
          $ss = self::getUserInfoByToken($d,106);
          if($ss->status_code !=200) return $ss; //user not authenticated
          $branch_id = $ss->branch_id;

          if(strtoLower($status) !='active' && strtolower($status) !='inactive') {
              return "Status is not correct";
          }
          $user_id = $d->user_id;
          $status = $d->status;
          DB::table('um_users')->where('branch_id',$branch_id)->where('id',$user_id)->update(array('status'=>$status));
          return null;
      } 
      
        function unlockUser($d){
          $ss = self::getUserInfoByToken($d,-1);
          if($ss->status_code !=200) return $ss; //user not authenticated
          $branch_id = Sanitizer::sanitize($ss->branch_id);
          $user_id = Sanitizer::sanitize($d->user_id);
         DB::update(DB::raw("UPDATE um_users SET is_locked = 0 WHERE id ='".$user_id."' AND branch_id ='".$branch_id."' "));
         return null;
      } 
        function setLockStatus($d){
          $ss = self::getUserInfoByToken($d,-1);
          if($ss->status_code !=200) return $ss; //user not authenticated
          $branch_id = Sanitizer::sanitize($ss->branch_id);
          $user_id = Sanitizer::sanitize($d->user_id);
          $action = strtolower($d->action);

          if($action =='lock') {
             DB::update(DB::raw("UPDATE um_users set is_locked =1 WHERE branch_id ='".$branch_id."' AND id ='".$user_id."' "));
          } else {
            DB::update(DB::raw("UPDATE um_users set is_locked =0 WHERE branch_id ='".$branch_id."' AND id ='".$user_id."' "));
          }
          return null;
      }
       function official_id_exists($official_id,$app_id) {
         if(empty($official_id) || empty($app_id)) return false;
         return DB::table('um_users')->where('official_id',$official_id)->where('app_id',$app_id)->limit(1)->exists();
       }
        function user_exists($name,$user_id){
          //$branch_id = $uss->branch_id;
          $q ;
          $name =$name;
          $user_id = Sanitizer::sanitize($user_id);
          if($user_id > 0) //in case of UPDATE
          {
             $q = DB::select(DB::raw("SELECT u.id FROM um_users AS u WHERE u.login_name ='".$name."' AND u.id <> ".$user_id." LIMIT 1"));
          } else //In case of ADD NEW
             $q = DB::select(DB::raw("SELECT u.id FROM um_users AS u WHERE u.login_name ='".$name."' LIMIT 1"));
          if(count($q) > 0) return true; 
          else return false;     
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
   static function createJWT($userInfo=[], $lifespan=0){
     $nowTime = time();
     self::$jwt_payload['iat'] = $nowTime; //Issue At
     self::$jwt_payload['nbf'] = $nowTime; //nbf = Not Before
     if (!$lifespan) $lifespan = self::$jwt_lifespan;
     self::$jwt_payload['exp'] =$nowTime + $lifespan; //Expire At
       
     $arr  = (array)$userInfo; 
     foreach($arr as $p=>$value) self::$jwt_payload[$p]=$value;
     return JWT::encode(self::$jwt_payload, self::$jwt_key, self::$jwt_encode);
   }
 
   //checkUser , validateUser, checkPassword, login, Signin
   /** login() | verifyUser() check user login and pwd and then returns object $result = {status, error_message, user} **/
   function verifyUser($app_id,$login_name,$password,$lang='en'){
         $user_id = null;
         //NOTE: $login_name = {loginName, PhoneNumber,email} 
        if(empty($login_name)) return DV::error("User name is not valid",$lang,400);
        $rows = DB::table('um_users AS u')->selectRaw('u.lang,u.id,u.user_class,u.official_id,u.official_code,u.hpwd,u.login_name, u.branch_id, u.full_name, u.status, u.is_locked,u.email,u.phone_number,u.otp_code')->where('u.login_name',$login_name)->where('u.app_id',$app_id)->take(1)->get();
 
        if(count($rows) <= 0) return DV::error("User name is not correct or does not have access to this application",$lang,400); 

       //begin:: Check if the user is LOCKED OUT or DISABLED
        foreach($rows as $row){
            $user_id = $row->id;
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
                        $refresh_token =self::createJWT(['login_name'=>$row->login_name,'user_class'=>$row->user_class],60*60);
                        // if(self::$use_jwt===1) 
                        //   $row->access_token = self::createJWT($row,60);
                        // else 
                        //    $row->access_token = $sess->access_token;
                        return (object)['status'=>'OK','status_code'=>200,'user'=>$row,'refresh_token'=>$refresh_token];
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
            $new_password_hash = PASSWORD_HASH($newPwd,PASSWORD_DEFAULT);
            $rows = DB::table('um_users as u')->where('u.id',$user_id)->selectRaw("u.id,u.hpwd")->limit(1)->get();
            if (!isset($rows[0])) return DV::error("user identity is not valid",$lang);
            $hpwd = '$%^&**FffgW@$Mx9f5';
            foreach($rows as $row) $hpwd = $row->hpwd;
           
            // if (strtolower(session('user_name')) != strtolower($login_name)) {
            //       return "Failed to change password because there was problem identifying your identity"; 
            // }

            if (password_verify($oldPwd,$hpwd)){ 
              DB::table('um_users')->where('id',$user_id)->update(array('hpwd'=>$new_password_hash));
              return DV::success();
            } else return DV::error("Old password is not correct!",$lang,null);
      }


       //In case: user changes their own password
        function changePassword($d){
          $ss = self::getUserInfoByToken($d,-1);
          if($ss->status_code !=200) return $ss; //user not authenticated
          $branch_id = Sanitizer::sanitize($ss->branch_id);
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

      function sendOTPCode_phone($d){
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
          $branch_id = Sanitizer::sanitize($ss->branch_id);
          $phone_number = Sanitizer::sanitize($d->phone_number);
      }
      
      //For Admin user to reset password for other user, or user themselve to just save password after otp_code code has been verified correctly
      //$d = {login_name, password} OR $d = {login_name,newPwd}
      function setPassword($d){
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
          $lang = $ss->lang;
          $branch_id = Sanitizer::sanitize($ss->branch_id);
          //$login_name = $d->login_name;
          //todo: later sanitize login_name first
          $login_name = $d->login_name; //Sanitizer::sanitize($d->login_name,'email');
          $newPwd = isset($d->newPwd)?$d->newPwd:null;
          if(empty($newPwd)) $newPwd = isset($d->password)?$d->password:null;
        //TODO:Check if the current user has right to set other users' password or not
        //if(empty($login_name)) return "Login name is unexpectedly empty!";
        if(!$this->user_exists($login_name,null)) return DV::error($login_name? "Login name $login_name does not exist":"Login name is unexpectedly missing or empty",$lang);
        if(empty($newPwd)) return DV::error("password cannot be empty",$lang);

        $hpwd = PASSWORD_HASH($newPwd,PASSWORD_DEFAULT);
        DB::table('um_users')->where('login_name',$login_name)->update(array('hpwd'=>$hpwd));
        return DV::success();
    }

      function changeLoginName($d){
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
         $lang = $ss->lang;
         $branch_id = Sanitizer::sanitize($ss->branch_id);
         $login_name = Sanitizer::sanitize($d->login_name);
         $new_login_name = Sanitizer::sanitize($d->new_login_name);

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

     function getComboItems_user($d){
      $ss = self::getUserInfoByToken($d,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
       $branch_id = Sanitizer::sanitize($ss->branch_id);
       $role_id = Sanitizer::sanitize($d->role_id);
     $rows =[];
     if($role_id > 0) {
        $rows = DB::select(DB::raw("SELECT u.id, u.login_name FROM um_users AS u INNER JOIN um_user_roles as ur ON ur.user_id = u.id WHERE u.branch_id ='$branch_id' AND ur.role_id ='$role_id' ORDER BY u.`login_name` ASC "));
     } else 
        $rows = DB::select(DB::raw("SELECT u.id, u.login_name FROM um_users AS u WHERE u.branch_id ='$branch_id' ORDER BY u.`login_name` ASC "));   
    
     return $rows;
   }
  
   function getComboItems_role($d){
       $ss = self::getUserInfoByToken($d,-1);
       if($ss->status_code !=200) return $ss; //user not authenticated
       $branch_id = Sanitizer::sanitize($ss->branch_id);
       $user_class = isset($d->user_class)?$d->user_class:null;
       $str_user_class =null;
       if(!empty($d->user_class)) $str_user_class =" AND r.user_class ='$user_class'";
       return DB::select(DB::raw("SELECT r.name, r.id FROM um_roles AS r WHERE r.branch_id ='$branch_id' $str_user_class ORDER BY `name` ASC "));
    }

      function getComboItems_workloc($d){
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
         //$lang = $ss->lang;
         $branch_id = Sanitizer::sanitize($ss->branch_id);
         return DB::select(DB::raw("SELECT c.name, c.name_native, c.id FROM um_worklocations AS c WHERE c.branch_id ='$branch_id' ORDER BY `name` ASC "));
     }

       function getComboItems_module($d){
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        return DB::select(DB::raw("SELECT m.id,m.module_name as `name` FROM um_app_modules AS m WHERE IFNULL(m.hidden,0) =0 AND m.branch_id ='$branch_id' AND m.app_id ='".self::$app_id."' ORDER BY `name` ASC "));
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

      function getAccessibleModules($d){
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $role_id = Sanitizer::sanitize($d->role_id);
        $rows = DB::select(DB::raw("SELECT m.id, m.disabled, m.module_name AS `name`, m.module_name_native as name_native, m.icon_image, m.target_url FROM um_app_modules AS m INNER JOIN um_role_modules AS rm ON m.id = rm.module_id WHERE IFNULL(m.hidden,0) =0 AND m.branch_id ='$branch_id' AND m.app_id ='".self::$app_id."' AND rm.role_id ='$role_id' ORDER BY m.disabled, m.module_name ASC"));
        return $rows;
    } 
      function addAccessibleModule($d){
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $lang = $ss->lang;
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $role_id = Sanitizer::sanitize($d->role_id);
        $module_id = Sanitizer::sanitize($d->module_id);
        $rows = DB::select(DB::raw("SELECT ref_code FROM um_app_modules WHERE id ='$module_id' LIMIT 1"));
        if(count($rows) <=0) return DV::error("Module indentity is not valid",$lang);
        if($role_id<=0 || empty($role_id)) return DV::error("role ID is not valid",$lang);

        $module_code = null;
        foreach($rows as $row) $module_code = $row->ref_code;
        DB::delete(DB::raw("DELETE FROM um_role_modules WHERE role_id ='$role_id' AND module_id ='$module_id' "));
        DB::table('um_role_modules')->insert([
            'branch_id'=>$branch_id,
            'module_id'=>$module_id,
            'role_id'=>$role_id,
            'module_code'=>$module_code
        ]);
        return DV::sccess();
    }

      //$d = {role_id, [show_all]}
      function getPermissionsByRole($d) {
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return DV::emptyResult($ss,[],$ss->lang); //user not authenticated

        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $role_id = Sanitizer::sanitize($d->role_id);
        $search_value = isset($d->search_value)?$d->search_value:null;
        $show_all = isset($d->show_all)?$d->show_all:0;
        $rows = [];

        $str_search = "1=1";
        if($search_value) {
          $search_value = escape_like_str($search_value);
          $str_search = " (p.id = '$search_value' OR p.name LIKE '%$search_value%' OR m.module_name LIKE '%$search_value%')";
        }

        if($show_all==0)
          $rows = DB::select(DB::raw("SELECT rp.role_id, p.id,p.name, m.module_name AS module_name, 1 as has_prn FROM um_permissions AS p INNER JOIN um_role_permissions as rp ON p.id = rp.permission_id INNER JOIN um_app_modules AS m ON m.id = p.module_id WHERE p.app_id ='".self::$app_id."' AND rp.role_id ='$role_id' AND $str_search"));
        else
          $rows = DB::table('um_permissions as p')->join('um_app_modules as m','m.id','=','p.module_id')->where('p.app_id',self::$app_id)->whereRaw($str_search)->selectRaw("p.id,p.name,m.module_name AS module_name, has_prn($role_id,p.id) as has_prn")->orderByRaw('has_prn DESC,module_id')->get();

         return $rows;
    }

      function findPermissions($d){
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        if(!isset($d->search_value)) $d->search_value =0;
        $search_value = escape_like_str($d->search_value);
        $rows = DB::select(DB::raw("SELECT p.id,p.name FROM um_permissions AS p WHERE p.app_id ='".self::$app_id."' AND (p.id ='$search_value' OR p.name LIKE'%".$search_value."%')"));
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
       
      function addPermissionToRole($d) {
            $ss = self::getUserInfoByToken($d,105);
            if($ss->status_code != 200) return $ss; //user not authenticated
            $lang = $ss->lang;

            $branch_id = Sanitizer::sanitize($ss->branch_id);
            $role_id =Sanitizer::sanitize($d->role_id);
            $id = Sanitizer::sanitize($d->id);
            if(empty($role_id)) return DV::error("role ID is not valid",$lang);
          
            $module_id =null;
            $module_name = null;
            $rows = DB::table('um_permissions as p')->join('um_app_modules as m','m.id','=','p.module_id')->where('p.id',$id)->selectRaw('p.module_id,p.app_id,m.module_name')->limit(1)->get();
            foreach($rows as $row){
              $module_id = $row->module_id;
              $module_name = $row->module_name;
            } 
            if(!$module_id) return DV::error("It seems that the permission $id is not valid. Module information is not found!",$lang);
            
            if ($this->role_access_module($role_id,$module_id)) {
              DB::delete(DB::raw("DELETE FROM um_role_permissions WHERE branch_id ='".$branch_id."' AND role_id ='".$role_id."' AND permission_id ='".$id."' "));
              DB::table('um_role_permissions')->insert(array(
                  'branch_id'=>$branch_id,
                  'role_id'=>$role_id,
                  'permission_id'=>$id
              ));
              return DV::success(['role_id'=>$role_id,'prn_id'=>$id,'module_id'=>$module_id]);
          } else {
            return DV::error("Failed to add permission $id because it belongs to inaccessible module \"$module_name\" ",$lang);
          }
          
    }
 
    // $d = {role_id,id|ids}
      function removePermissionFromRole($d){
        $ss = self::getUserInfoByToken($d,106);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $lang = $ss->lang;

        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $role_id = Sanitizer::sanitize($d->role_id);
        /** $ids is a list of permission Ids separated by | **/
        $ids = isset($d->id)? Sanitizer::sanitize($d->id):null; 
        if(!$ids) $ids = isset($d->ids)? Sanitizer::sanitize($d->ids):null;

        if(empty($role_id)) return DV::error("role ID is not valid",$lang);
        $ms = explode('|',$ids);
        foreach($ms as $m) {
            if ($m > 0) {
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

     function getAccessibleModulesByUserId_internal($user_id){
        if(!($user_id>0)) $user_id = Sanitizer::sanitize($user_id);
        $mods = DB::select(DB::raw("SELECT DISTINCT m.id,m.display_order,m.disabled,m.hidden,m.module_name AS `name` 
        FROM um_app_modules AS m INNER JOIN um_role_modules AS rm ON m.id = rm.module_id 
        INNER JOIN um_user_roles AS ur ON ur.role_id = rm.role_id 
        WHERE IFNULL(m.hidden,0) =0 AND ur.user_id ='".$user_id."' ORDER BY m.disabled ASC, m.display_order ASC"));
        return $mods;
     }

     function getPermissionsByUserId_internal($user_id){
       $q = DB::select(DB::raw("SELECT DISTINCT rp.permission_id FROM um_user_roles AS ur INNER JOIN um_role_permissions AS rp ON ur.role_id = rp.role_id WHERE ur.user_id ='".$user_id."' AND ur.app_id ='".self::$app_id."' ORDER BY rp.permission_id ASC"));
       return $q;
     }

     static function access_mod($mod_id){
          if(!$mod_id) return false;
          if(self::isSuperAdmin_cu()) return true;
          $mods = session::get('mods',[]);
          $i=0;
          $c;
          do{ 
            if(!isset($mods[$i])) break;
            $c = $mods[$i];
            if($c->id == $mod_id) return true;
            $i++;
          }while($c);
          return false;
     }

     function getAuthData($d){
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
        $prns = DB::select(DB::raw("SELECT DISTINCT rp.permission_id FROM um_user_roles AS ur INNER JOIN um_role_permissions AS rp ON ur.role_id = rp.role_id WHERE ur.user_id ='$user_id' AND ur.app_id ='".self::$app_id."' ORDER BY rp.permission_id ASC"));
         
        $mods = DB::select(DB::raw("SELECT DISTINCT m.id,m.disabled, m.module_name AS `name`, m.module_name_native AS name_native, m.icon_image, m.target_url,m.display_order 
        FROM um_app_modules AS m INNER JOIN um_role_modules AS rm ON m.id = rm.module_id 
        INNER JOIN um_user_roles AS ur ON ur.role_id = rm.role_id 
        WHERE IFNULL(m.hidden,0) =0 AND ur.user_id ='$user_id' ORDER BY m.disabled ASC, m.display_order ASC"));
 
        return (object)['prns'=>$prns,'modules'=>$mods,'is_super_admin'=>self::isSuperAdmin_cu()];
   }

   function getPermissionsByRoleId($d){
      $ss = self::getUserInfoByToken($d,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = Sanitizer::sanitize($ss->branch_id);

        $role_id = Sanitizer::sanitize($d->role_id);
       return DB::select(DB::raw("SELECT DISTINCT rp.permission_id FROM um_user_roles AS ur INNER JOIN um_role_permissions AS rp ON ur.role_id = rp.role_id WHERE ur.role_id ='$role_id' AND ur.app_id ='".self::$app_id."' ORDER BY rp.permission_id ASC"));
        
    }
    
    function localizePermissions($d){
      $ss = self::getUserInfoByToken($d,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
        //$d->login_name = $ss->login_name;
        $data = $this->getPermissions_cu($d);
        //session->put(('prns'),$data);
    }
     
    static function allowed($prn_id,$module_id=null){
          if($module_id) return self::access_mod($module_id);
          //prn_id = -1 means No need to check for permission
          if($prn_id ==-1) return true;
          if(self::isSuperAdmin_cu()) return true;
          if(!$prn_id) return false;
          //if(!Session::exists('prns')) return false;
          //return var_dump($_SESSION['prns']);
          $prns = session::get('prns',[]);

          $i=0;
          $c=null;
          do{
              if(!isset($prns[$i])) return false;
              $c = $prns[$i];
              if ($c->permission_id === $prn_id) return true; 
              $i++;
          }while($c);

          return false;
    }

    //Check if current user has access to a MODULE refered by module_code or ref_code
      function accessibleModule($d) {
        $ss = self::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = Sanitizer::sanitize($ss->branch_id);

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
      $rows = DB::table('um_user_roles as ur')->join('um_roles as r','ur.role_id','=','r.id')->where('ur.user_id',$user_id)->selectRaw('ur.user_id,r.id,r.name')->limit(1)->get();
      foreach($rows as $row) return $row;
      return null;
   } 

    static function getRoleName($id){
      $rows = DB::table('um_roles as r')->where('r.id',$id)->selectRaw("r.name")->limit(1)->get();
      return isset($row->name)?$row->name:null;
    }

    static function correctUserClass($user_class){
      foreach(self::$user_classes as $key=>$c){
           if($key === $user_class) return true;
      }
      return false;
    }

}
