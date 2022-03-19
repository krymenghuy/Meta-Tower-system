<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models;
use App\Models\SMS;
use Session;
use DB;
use Carbon\Carbon;
use Exception;

class UM extends Model
{
    use HasFactory;
    
    protected $app_id = 'DFB15FKAEEC611EG2E7C9801A7CXD1HK'; /** app_id for Admin Back Office **/
    protected $user_classes = ['admin_support','driver','merchant'];
    
    protected $company_id = null;
    protected $branch_id = null; //same as company_id
    protected $login_name = null;
    protected $full_name = null;
    protected $user_id = null;
    
    // public function __construct(array $attributes = [])
    // {
    //     parent::__construct($attributes);
    //     // $this->company_id = session('branch_id');
    //     // $this->branch_id = $this->company_id;
    //     // $this->login_name = session('login_name');
    //     // $this->full_name = session('full_name');
    //     // $this->user_id = session('user_id'); 
    //     //$this->app_id = 'DFB15FKAEEC611EG2E7C9801A7CXD1HK';
    //     //$this->user_classes = ['admin_support','driver','merchant'];
       
    // }
    
    function extendUserDetails($user) {
       $id = isset($user->id)?$user->id:0;
       if($id ==0) $id = isset($user->user_id)?$user->user_id:0;
       if($id<=0 || empty($id)) return $user;
       $user->user_class = strtolower($user->user_class);
       if($user->user_class=='merchant' || $user->user_class=='sender') {
          $rows = DB::table('sender AS s')->where('s.id',$user->official_id)->selectRaw("s.id,s.code,s.name,s.phone_number,s.email,(SELECT `name` FROM sender_type AS t WHERE t.id =s.sender_type_id LIMIT 1) AS sender_type")->limit(1)->get();
          foreach($rows as $row) {
            $user->sender_code=$row->code; //sender official ID
            $user->full_name = $row->name; //sender name
            $user->phone_number = $row->phone_number;
            $user->email = $row->email;
            $user->sender_type = $row->sender_type;  
          }
        
       } else if ($user->user_class =='driver'){
          $rows = DB::table('driver AS s')->where('id',$user->official_id)->selectRaw("s.id,s.code,s.name,s.sex,s.phone_number,s.email,s.emp_type")->limit(1)->get();
          foreach($rows as $row) {
            $user->sender_code=$row->code; //sender official ID
            $user->full_name = $row->name; //sender name
            $user->phone_number = $row->phone_number;
            $user->email = $row->email;
            $user->emp_type = $row->emp_type;
            $user->sex = $row->sex;
          }
       } else return $user;

       return $user;
    }

     //UM::setUserSession() is a static function and is the same as UM->createSession() 
     function createSession($app_id,$login_name,$user_id,$branch_id=0){
       return self::setUserSession($app_id,$login_name,$user_id,$branch_id);
     } 

     //UM::setUserSession() is a static function and is the same as UM->createSession() 
    //create session can be => (1) create in database table um_sessions, (2) create session as file, which can be faster but cannot be queried
    static function setUserSession($app_id,$login_name,$user_id,$branch_id=0){
       //TODO: Do not allow creating session if user is not logged in 
      //if (strtolower($login_name) != strtolower($this->login_name)) return;
      $access_token = getUniqueString(38);
      $csrf_code = getUniqueString(38);
      $session_id = getUniqueString(38);
      if(empty($login_name)) return null;
       DB::table('um_sessions')->where('login_name',$login_name)->where('app_id',$app_id)->delete();
       DB::table('um_sessions')->insert(array(
         'branch_id'=>$branch_id,
         'app_id'=>$app_id,
         'user_id'=>$user_id, //ineteger user_id
         'login_name'=>$login_name,
         'start_time'=>getNowTime(),
         'last_active_time'=>getNowTime(),
         'csrf_code'=>$csrf_code,
         'session_id'=>$session_id,
         'access_token'=>$access_token
       ));
       return (object)array('status'=>'OK','access_token'=>$access_token);
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
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
 
        $name = $data->name;
        $module_id = $data->module_id;
        $role_id = $data->role_id;
        if(empty($name)) return "Name cannot be empty";
        if(empty($module_id)) return "Module ID is not valid";
        $rows = DB::table('um_permissions')->where('name',$name)->where('app_id',$this->app_id)->selectRaw('id')->limit(1)->get();
 
        if(count($rows)) return "The permission already exists";

        DB::table('um_permissions')->insert([
            'app_id'=>$this->app_id ,
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
        if($user_class =='merchant' || $user_class =='sender') return "38DC051E122D11EC89909801A7B0D1FCH";
        else if ($user_class =='driver') return "584C7FF2122D11EC89909801A8B0D7XKD";
        else if ($user_class=='admin_support') return "DFB15FKAEEC611EG2E7C9801A7CXD1HK";
        else return "DFB15FKAEEC611EG2E7C9801A7CXD1HK";
    }

    function getModuleList($user_id =0){
        $rows = DB::table('um_app_modules AS m')->selectRaw("m.module_name, m.module_name_native, m.icon_image, m.target_url")->orderBy('display_order ASC')->get();
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
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = sanitize($ss->branch_id);
          $user_id = isset($d->user_id)?$d->user_id:null;
          $login_name =isset($d->login_name)?$d->login_name:null;
          $phone_number = isset($d->phone_number)?sanitize($d->phone_number):null;

          //usually the puspose of sending otp_code is to change password
          $purpose = isset($d->purpose)?sanitize($d->purpose):null; 

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
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        //in case login_name is email, sanitize() will mistakenly remove '@' => causing problem 
        $login_name = isset($d->login_name)?$d->login_name:null;
        $user_id = isset($d->user_id)?$d->user_id:null;

        //using sanitize() means that @otp_code cannot contains any special chars
        $otp_code = isset($d->otp_code)?sanitize($d->otp_code):null;
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
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $user_class = isset($d->user_class)?$d->user_class:null;
        $result = (object)array('status'=>'Error','error_message'=>null,'role_id'=>null);
        if (!isset($d->name) || empty($d->name)) {
            $result->error_message = "Role Name cannot be empty";
            $result->status="Error";
            return $result;
        }
        if(!isset($d->id)) $d->id = 0;
       
        if (!in_array(strtolower($user_class),$this->user_classes)) {
          $result->error_message = "User Class cannot be empty!";
          $result->status="Error";
          return $result;
        }

        if ($d->id > 0) { 
            if($this->role_exists($ss,$d->name,$d->id)) {
                $result->error_message = "Role Name already exists";
                $result->status="Error";
                return $result;
            } 

            DB::table('um_roles')->where('id',$d->id)->update(['name'=>$d->name,'user_class'=>$user_class]);
            $result->role_id = $d->id;
        } else {

            if($this->role_exists($ss,$d->name,null)) {
                $result->error_message = "Role Name already in use";
                $result->status="Error";
                return $result;
            } 

            DB::table('um_roles')->insert([
                 'user_class'=>$user_class,
                'name'=>$d->name,
                'app_id'=>$this->app_id,
                'branch_id'=>$branch_id,
                'create_user'=>$ss->login_name,
                'create_date'=>getNowTime()
            ]);
            $result->role_id = DB::getPdo()->lastInsertId();
        }

        $result->error_message = null;
        $result->status ='OK';
        return $result;    
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
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = $ss->branch_id;
          $id = $d->role_id;
          if(!$id || $id<=0) return "Role identifier is not valid";
          DB::table('um_roles')->where('id',$id)->where('app_id',$this->app_id)->delete();
          DB::table('um_user_roles')->where('role_id',$id)->where('app_id',$this->app_id)->delete();
          return null;
      }

        function addRoleMember($d){
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          return $this->addRoleMember1($ss,$d->role_id,$d->user_id);
      }

      protected function addRoleMember1($uss,$role_id,$user_id){
        $branch_id = $uss->branch_id;
        $result = (object)array('status'=>'Error');
        if(!isset($role_id) || empty($role_id)) {
          $result->status ='Error';
          $result->error_message ="Role ID is not valid";
          return $result;
        }
      
        DB::table('um_user_roles')->where('branch_id',$branch_id)->where('user_id',$user_id)->where('role_id',$role_id)->delete();

        DB::table('um_user_roles')->insert([
            'user_id'=>$user_id,
            'role_id'=>$role_id,
            'app_id'=>$this->app_id,
            'branch_id'=>$branch_id
        ]);
    
        $rows = DB::select(DB::raw("SELECT COUNT(ur.user_id) AS user_count FROM um_user_roles as ur WHERE ur.app_id ='$this->app_id' AND ur.role_id ='$role_id'"));
        
          $result->user_count = 0;
          foreach($rows as $row) $result->user_count = $row->user_count; 
          $result->status ='OK';
          $result->error_message =null;
        return $result;
    }

        function removeAccessibleModule($d) {
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = $ss->branch_id;

          $role_id = $d->role_id;
          $module_id = $d->module_id;
          DB::table('um_role_modules')->where('role_id',$role_id)->where('branch_id',$branch_id)->where('module_id',$module_id)->delete();
          DB::select(DB::raw("DELETE FROM um_role_permissions WHERE permission_id IN (SELECT id FROM um_permissions WHERE module_id ='".$module_id."') AND role_id ='".$role_id."' ")); 
          return null; 
      }

        function removeRoleMember($d){
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = $ss->branch_id;

          $role_id = $d->role_id;
          $user_id = $d->user_id;
          $result = (object)array('status'=>'Error');
          DB::table('um_user_roles')->where('branch_id',$branch_id)->where('app_id',$this->app_id)->where('role_id',$role_id)->where('user_id',$user_id)->delete();
          $rows = DB::table('um_user_roles')->where('app_id',$this->app_id)->where('role_id',$role_id)->selectRaw("COUNT(user_id) AS user_count")->get();
          $result->user_count = 0;
          foreach($rows as $row)  $result->user_count = $row->user_count; 
           
            $result->status ='OK';
            $result->error_message =null;
           return $result;
      }
        function getUserRoles($d){
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = $ss->branch_id;
          $user_id = $d->user_id;
          $rows = DB::table('um_user_roles AS u')->where('u.branch_id',$branch_id)->where('u.app_id',$this->app_id)->where('u.user_id',$user_id)->selectRaw("u.id,u.name")->get();
          return $rows;
      }

        function getRoleList($d){
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = sanitize($ss->branch_id);
          $rows = DB::table('um_roles AS r')->selectRaw("r.id, r.`name`,r.user_class, (SELECT COUNT(ur.user_id) FROM um_user_roles AS ur INNER JOIN um_users as u ON u.id = ur.user_id WHERE ur.branch_id = u.branch_id AND ur.role_id = r.id) AS user_count")->where('r.branch_id',$branch_id)->get();
          return $rows; 
        }

        function getRoleMembers($d){
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = $ss->branch_id; 
          $role_id = $d->role_id;
          $rows = DB::table('um_user_roles AS ur')->join('um_users AS u','u.id','=','ur.user_id')->selectRaw("u.id,u.login_name,u.full_name,u.official_code,u.phone_number, u.email")->where('u.branch_id',$branch_id)->where('ur.role_id',$role_id)->get();
          return $rows; 
      }

        function getRoleById($d) {
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = $ss->branch_id; 
          $id = $d->role_id; 
          $rows= DB::table('um_roles')->where('branch_id',$branch_id)->where('id',$id)->selectRaw('id,name,user_class')->limit(1)->get(); 
          foreach($rows as $row) return $row;
          return null; 
      }

        function getUserList($d){
          //$d = {search_value, user_class, work_location}
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = $ss->branch_id;

          $str_search ='';
          if(isset($d->search_value)) {
              if(!empty($d->search_value)) {
                  $str_search =" AND u.login_name LIKE '%". escape_like_str($d->search_value)."%' OR u.full_name LIKE '%".escape_like_str($d->search_value)."%' " ;
              }
          }
          $more_where = "1=1".$str_search;
          $rows = DB::table('um_users as u')->selectRaw("u.id,u.official_id,u.official_code, u.login_name, u.user_class, u.previlege_type, u.last_login_date, is_locked, `status`")->where('branch_id',$branch_id)->whereRaw($more_where)->get(); 
          return $rows;
        }

      //returns extended details about a user given by user's class, and user's official_code. A user can be Staff, Student, Teacher, parent, or Guest etc  
        function getUserExtendedDetails($d){
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          //$branch_id = $ss->branch_id;
          $phone_number = isset($d->phone_number)?$d->phone_number:null;
          $official_code = isset($d->official_code)?$d->official_code:null;
          return $this->getUserExtendedDetails1($ss,$official_code,$phone_number, $d->user_class);
      } 

      static function getUserProp($user_id,$prop){
        $rows = DB::table('um_users AS u')->where('id',$user_id)->selectRaw($prop)->limit(1)->get();
        if(!isset($rows[0])){
          $rows = DB::table('um_users AS u')->where('login_name',$user_id)->selectRaw($prop)->limit(1)->get();
        } 
        foreach($rows as $row) return $row->{$prop};
        return null;
      }

      static function getUserProps($user_id,$props){
          $cols = $props;
          if(is_array($props)){
            $cols = implode(',',$props);
          }
         $rows = DB::table('um_users AS u')->where('id',$user_id)->selectRaw($cols)->limit(1)->get(); 
        
        foreach($rows as $row) return $row;
        return null;
      }

      function getUserExtendedDetails1($uss,$official_code,$phone_number, $user_class){
        $branch_id = sanitize($uss->branch_id);
        $official_code = sanitize($official_code);
        $phone_number = sanitize($phone_number);
        $user_class = sanitize($user_class);
        
        $rows =[];
        $more_where = null;
        if(!empty($official_code))
           $more_where = " e.`code` ='$official_code'";
        else if(empty($official_code) && !empty($phone_number)){
           $more_where = " e.phone_number ='$phone_number'";
        }else $more_where ="1=1";

        if($user_class =='merchant' || $user_class =='sender') {
           $rows = DB::table('sender AS e')->where('branch_id',$branch_id)->whereRaw($more_where)->selectRaw("'merchant' AS user_class, e.id, e.code AS official_code,  e.name,e.phone_number,e.email")->limit(1)->get();
        } else if ($user_class =='driver')
        {
           $rows = DB::table('driver AS e')->where('branch_id',$branch_id)->whereRaw($more_where)->selectRaw("'driver' AS user_class, e.id, e.code AS official_code, e.`name` AS `name`, e.phone_number,e.email, e.sex")->limit(1)->get(); 
        } 
        // else if ($user_class =='admin_support')
        // {
            
        // } 
         
        foreach($rows as $row) return $row; 
        return null;
    } 

        //Create of UpdateUser() depending on $d->user_id;
        function saveUser($d){
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = sanitize($ss->branch_id);
          
          if(!isset($d->user_id)) $d->user_id = 0;
          $d->user_id = sanitize($d->user_id);

          if(!isset($d->subs_id)) $d->subs_id = null;
          $result = (object)array('status'=>'Error','error_message'=>null,'user_id'=>null); 
          if(!isset($d->login_name) || empty($d->login_name)) {
             $result->error_message ="Login name cannot be blank";
             $result->status ="Error"; 
             return $result;
          }
          if (!isset($d->user_class)) $d->user_class = null;
          if (!in_array(strtolower($d->user_class),$this->user_classes)){
            $result->error_message ="User Type or User Class is not correct";
            $result->status ="Error"; 
            return $result;
          }
          //Get app_id based on a given @user_class;
          $app_id = $this->getAppIdByUserClass($d->user_class);

          if ($this->user_exists($d->login_name,$d->user_id)) {
            $result->error_message ="The provided login name is already in use";
            $result->status ="Error"; 
            return $result;
          }
          if (!isset($d->password) || empty($d->password)) {
            $result->error_message ="Password cannot be empty";
            $result->status ="Error"; 
            return $result;
          }

          if(!isset($d->role_id) || empty($d->role_id)) {
             $result->error_message ="User must have at least one role";
             $result->status ="Error"; 
             return $result;
          }

          if(!isset($d->phone_number) || empty($d->phone_number)) {
              $d->phone_number = null;
            // $result->error_message ="Phone Number cannot be blank";
            // $result->status ="Error"; 
            // return $result;
         }
         /*NOTE that depending on Application Context, the  @user_class can be whatever meaningful classifications such as:
           For Hospital @user_class ={user,doctor,patient, etc } 
           For School @user_class = {Staff, Student,parent} 
           For Corporate @user_class = {customer,individual customer, corporate customer, Staff}
         */
         if(!isset($d->previlege_type)) $d->previlege_type ='Standard'; // previlege_type = {Standard,Admin}
         //if(!isset($d->user_class) ||  empty($d->user_class)) $d->user_class = "staff"; /** default user_class = 'Staff'**/
         if(!isset($d->official_id) ||  $d->official_id <=0) $d->official_id = null;
        
         if(!isset($d->email) || empty($d->email)) {
            //$result->error_message ="Email cannot be blank";
            //$result->status ="Error"; 
            //return $result;
            $d->email = null;
         }

         $user_details = $this->getUserExtendedDetails1($ss,$d->official_code,$d->phone_number,$d->user_class);
        
         if(!isset($d->full_name)) $d->full_name = $d->login_name;
         if(!isset($d->hr_id)) $d->hr_id =null;
         if(!isset($d->work_location_id)) $d->work_location_id = null;
 
         $hpwd = PASSWORD_HASH($d->password,PASSWORD_DEFAULT);
         $official_id = null;
         $official_code =null;
         if($user_details) {
           if(isset($user_details->id)) $official_id = $user_details->id;
           if(isset($user_details->official_code)) $official_code = $user_details->official_code;  
         } 

        if($d->user_class !='admin_support') {
          if(empty($official_id) || empty($official_code)) {
              $result->error_message ="The official ID is not valid for indentifying driver or merchant";
              $result->status ="Error"; 
              return $result;
          }

           if ($d->user_id <=0 && $this->official_id_exists($official_id,$app_id)) {
              $result->error_message ="The driver or merchant already has one account";
              $result->status ="Error"; 
              return $result;
          }
        }  
        if ($d->user_id > 0) {
              DB::table('um_users')->where('id',$d->user_id)->update([
                'app_id'=>$app_id, /** if @user_class changes => this app_id is changed too **/
                //'branch_id'=>$branch_id,
                'login_name'=>$d->login_name,
                'full_name'=>$d->full_name,
                //'official_id'=>$official_id,
                //'official_code'=>$official_code,
                //'hpwd'=>$hpwd,
                'previlege_type'=>$d->previlege_type, //{'standard','admin'}
                'user_class'=>$d->user_class, /* user_class = {student,parent,customer,viewer,patient,user}. It is whatever classification meaningful in specific Application Context. It provides directive to use "official_id" to link to meaning table such as Students or Employees or Customers or Parents etc...*/
                'phone_number'=>$d->phone_number,
                'email'=>$d->email,
                //'subs_id'=>$d->subs_id,
                //'status'=>'active',
                //'is_locked'=>0,
                'work_location_id'=>$d->work_location_id
                //,'create_user'=>$ss->login_name,
                //'create_date'=>getNowTime(),
                //'create_uid'=>$ss->user_id
            ]);
            //Renew user's role by deleteing and inserting it again
            DB::table('um_user_roles')->where('user_id',$d->user_id)->where('role_id',$d->role_id)->delete();
            $this->addRoleMember1($ss,$d->role_id,$d->user_id);

        } else {
            DB::table('um_users')->insert([
              'app_id'=>$app_id, /** NOTE that app_id usually depends on @user_class (method $this->getAppIdByUserClass() will returns same app_id for every "user_class" if all user_classes are allowed to log in to the same app) **/
              'branch_id'=>$branch_id,
              'login_name'=>$d->login_name,
              'full_name'=>$d->full_name,
              'official_id'=>$official_id,
              'official_code'=>$official_code,
              'hpwd'=>$hpwd,
              'previlege_type'=>$d->previlege_type, //{'standard','admin'}
              'user_class'=>$d->user_class, /* user_class = {student,parent,customer,viewer,patient,user}. It is whatever classification meaningful in specific Application Context. It provides directive to use "official_id" to link to meaning table such as Students or Employees or Customers or Parents etc...*/
              'phone_number'=>$d->phone_number,
              'email'=>$d->email,
              'subs_id'=>$d->subs_id,
              'status'=>'active',
              'is_locked'=>0,
              'work_location_id'=>$d->work_location_id,
              'create_user'=>$ss->login_name,
              'create_date'=>getNowTime(),
              'create_uid'=>$ss->user_id
            ]);
            $d->user_id  = DB::getPdo()->lastInsertId();
            $this->addRoleMember1($ss,$d->role_id,$d->user_id);
        }
        
          // $data = $d; /** this is because object $d contain $role_id and $access_token value for addRolemember() method to verify session info **/
          // //$data->role_id =$d->role_id; //already there
          // $data->user_id = $new_user_id; 
        
          $result->error_message = null;
          $result->user_id = $d->user_id;
          $result->status ='OK';
          return $result;
      }

      //param => $request->breaerToken()
      protected function decryptToken($request){
        $bearerToken = $request->bearerToken();
        if ($bearerToken== null) return null;
        //if(!isset($request->acc_tk_dms)) return null;
        //if (!isset($request->is_cookie)) $request->is_cookie = 0;
        $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
        // Encrypt acc token "acc_tk_dms"
        $decrypted_token = $encrypter->decrypt($bearerToken,false);
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
      $access_token = $this->decryptToken($request);
      return  $access_token;
      $rows = DB::table('um_sessions AS ss')->join('um_users as u','u.id','=','ss.user_id')->where('ss.access_token',$access_token)->selectRaw("ss.user_id, ss.branch_id,ss.app_id,u.login_name,u.official_id")->limit(1)->get();
      foreach($rows as $row) {
        $row->error = null;
        return $row;
      }
      return null;  
    }

    //getUserInfoByToken() returns user info (user details) based on two factors: 
    //1. based on given access_token stored in $request->acc_tk_dms
    //2. based on given @user_class = {driver, or merchant or (admin or NULL) }
    //This method is used in mobile app's api authentication, which does not depends on web session
    function getUserInfoByToken($request, $user_class){
        $access_token = $this->decryptToken($request);
        if(!$access_token){
            return "#350";
            // $result = (object)["status"=>"Error"];
            // $result->error_message = "Authentication failed. Empty token (101)";
            // $result->status_code = "350"; //Unthenticated user
        }
           
         $user_id = null;
         $branch_id =null;
         $official_id = null;
         $login_name = null;
         //Obtain $user_id, $official_id from table "um_users"
         $rows = DB::table('um_sessions AS ss')->join('um_users as u','u.id','=','ss.user_id')->where('ss.access_token',$access_token)->selectRaw("ss.user_id,u.login_name,ss.branch_id, u.official_id")->limit(1)->get();
         foreach($rows as $row) {
           $branch_id = $row->branch_id;
           $user_id = $row->user_id;
           $official_id = $row->official_id;
           $login_name = $row->login_name;
         }
         ////return "#user_id = ".$user_id." Official_id = ".$official_id;

         if ($user_class =="sender" || $user_class =="merchant")
         {
              if (!$official_id)  {
                //return null; // um_users.official_id is empty or acc_token does not exists
                return '#350'; //user not authenticated /*** column um_users.official_id is unexpectedly NULL, or token is not correct **/
              }
              $rows = DB::table('sender AS s')->where('s.branch_id',$branch_id)->where('s.id',$official_id)->selectRaw("'$user_id' AS user_id, '$login_name' AS login_name,s.id,s.branch_id,s.code,s.name,s.name_kh,s.status_code,s.phone_number,s.email")->limit(1)->get();
              foreach($rows as $row) {
                //$request->access_token = $access_token; 
                $request->acc_tk_dms = $access_token; 
                $request->decrypted = 1; /** token_decrypted => so no need to decrypt again by Helpers.getSessionInfo($request) **/
                 return $row;
              }
              return "#350"; //when returned '#350' then the apiConteroller's method called makeJsonResponse() to client as "Authentication Failed"
    
         } else if ($user_class =="driver") {
            if (!$official_id) return '#350';
            $rows = DB::table('driver AS d')->selectRaw("'$user_id' AS user_id,'$login_name' AS login_name, d.id,d.branch_id,d.code,d.name,d.name_kh,d.phone_number,d.sex,d.email")->where('branch_id',$branch_id)->where('id',$official_id)->limit(1)->get(); 
            foreach ($rows as $row) {
              //$request->access_token = $access_token; 
              $request->acc_tk_dms = $access_token; 
              $request->decrypted = 1; /** token_decrypted => so no need to decrypt again by Helpers.getSessionInfo($request) **/
               return $row;
            }
            return '#350';
          }else {
             //todo: return details of Admin user???
             return "#350";
         }
         
         return "#350"; /** instead of returning NULL, do return "#350" User authentication failed **/ 
     }
      
     function auth_test($request, $user_class){
      $access_token =null;
      try{
        $access_token = $this->decryptToken($request);
      } catch(Exception $e) {
         return $e;
      }
      
      if(!$access_token){
          return "UMModel->decryptToken() returns null";
          // $result = (object)["status"=>"Error"];
          // $result->error_message = "Authentication failed. Empty token (101)";
          // $result->status_code = "350"; //Unthenticated user
      }

       $user_id = null;
       $branch_id =null;
       $official_id = null;
       
       //Obtain $user_id, $official_id from table "um_users"
       $rows = DB::table('um_sessions AS ss')->join('um_users as u','u.id','=','ss.user_id')->where('ss.access_token',$access_token)->selectRaw("ss.user_id, ss.branch_id, u.official_id")->limit(1)->get();
       foreach($rows as $row) {
         $branch_id = $row->branch_id;
         $user_id = $row->user_id;
         $official_id = $row->official_id;
       }
       ////return "#user_id = ".$user_id." Official_id = ".$official_id;

       if ($user_class =="sender" || $user_class =="merchant")
       {
            if (!$official_id)  {
              //return null; // um_users.official_id is empty or acc_token does not exists
              return 'There is token supplied from request, but not found in table um_sessions'; //user not authenticated /*** column um_users.official_id is unexpectedly NULL, or token is not correct **/
            }
            $rows = DB::table('sender AS s')->where('s.branch_id',$branch_id)->where('s.id',$official_id)->selectRaw('s.id,s.code,s.name,s.name_kh,s.status_code,s.phone_number,s.email')->limit(1)->get();
            foreach($rows as $row) {
              $row->acc_tk_dms = $access_token; 
              $row->decrypted = 1; /** token_decrypted => so no need to decrypt again by Helpers.getSessionInfo($request) **/
               return $row;
            }
            return "The provided token does not match with Sender or Vendor identity in table `sender`. Make sure  um_users.Official_id is matched with sender.id"; //when returned '#350' then the apiConteroller's method called makeJsonResponse() to client as "Authentication Failed"
  
       } else if ($user_class =="driver") {
          if (!$official_id) return 'This case user_class is "Driver" and the official_id is null';
          $rows = DB::table('driver AS d')->selectRaw('d.id,d.code,d.name,d.name_kh,d.phone_number,d.sex,d.email')->where('branch_id',$branch_id)->where('id',$official_id)->limit(1)->get(); 
          foreach ($rows as $row) {
            $row->acc_tk_dms = $access_token; 
            $row->decrypted = 1; /** token_decrypted => so no need to decrypt again by Helpers.getSessionInfo($request) **/
             return $row;
          }
          return 'No matching official_id in driver table';
        }else {
           //todo: return details of Admin user???
           return "user class is not valid";
       }
       return "#350"; /** instead of returning NULL, do return "#350" User authentication failed **/ 
   }
 

      //getUserInfo() returns "id, previlege_type, user_class,is_locked,status"
        function getUserInfo($d){
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = $ss->branch_id;
          $id_or_name = $d->id_or_name;
          return $this->getUserInfo1($id_or_name); 
      }

      function getUserInfo1($id_or_name){
        $id_or_name = sanitize($id_or_name);
        $rows = [];
        if ($id_or_name> 0)
          $rows = DB::table('um_users AS u')->where('id',$id_or_name)->selectRaw("u.id, u.previlege_type, u.user_class, u.is_locked,u.status")->limit(1)->get();
        else
         $rows = DB::table('um_users AS u')->where('u.login_name',$id_or_name)->selectRaw("u.id, u.previlege_type, u.user_class, u.is_locked,u.status")->limit(1)->get();  
       foreach($rows as $row) return $row;
       return null;   
    }

        function deleteUser($d){
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = $ss->branch_id;
          $user_id = $d->user_id;
          $user = $this->getUserInfo1($user_id);
          //For one Application or one system, => There is one in-app Admin user denoted by his "previlege_type =Admin "
          //This Admin user cannot be delete, and he can create other in-app users if needed (Depending on permissions as well)
          if(strToLower($user->previlege_type) =='admin') {
              return "Cannot delete Admin user";
          } 
          DB::table('um_users')->where('branch_id',$branch_id)->where('id',$user_id)->delete();  
          return null;
      }

        function setUserStatus($d){
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
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
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = sanitize($ss->branch_id);
          $user_id = sanitize($d->user_id);
         DB::update(DB::raw("UPDATE um_users SET is_locked = 0 WHERE id ='".$user_id."' AND branch_id ='".$branch_id."' "));
         return null;
      } 
        function setLockStatus($d){
          //$action ={lock,unlock}
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = sanitize($ss->branch_id);
          $user_id = sanitize($d->user_id);
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
          $name = sanitize($name);
          $user_id = sanitize($user_id);
          if($user_id > 0) //in case of UPDATE
          {
             $q = DB::select(DB::raw("SELECT u.id FROM um_users AS u WHERE u.login_name ='".$name."' AND u.id <> ".$user_id." LIMIT 1"));
          } else //In case of ADD NEW
             $q = DB::select(DB::raw("SELECT u.id FROM um_users AS u WHERE u.login_name ='".$name."' LIMIT 1"));
          if(count($q) > 0) return true; 
          else return false;     
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
        if($col_name=='user_id') $col_name ='id';
        $where_sql = $col_name."='$val'";
        if (!empty($app_id))  $where_sql = $col_name."='$val' AND app_id ='$app_id'";
        return DB::table("um_users")->whereRaw($where_sql)->limit(1)->exists();
      }

      //checkUser , validateUser, checkPassword, login, Signin
      /** verifyUser() check user login and pwd and then returns object $result = {status, error_message, user} **/
        function verifyUser($app_id,$login_name,$password){
         $user_id = null; 
         $result = (object) array('status'=>'Error','user'=>null,'error_message'=>null);
         //NOTE: $login_name = {loginName, PhoneNumber,email} 
         if(empty($login_name))  {
             $result->error_message ="User name is not valid";
             $result->status ="Error";
             //$result->user= null;
             return $result;
        }

        $rows = DB::table('um_users AS u')->selectRaw('u.user_class,u.official_id,u.hpwd, u.id,u.login_name, u.branch_id, u.full_name, u.status, u.is_locked,u.email,u.phone_number,u.otp_code')->where('u.login_name',$login_name)->where('u.app_id',$app_id)->limit(1)->get();
 
        if(count($rows) <= 0)  {
            $result->error_message ="User name is not correct or does not have access to this application";
            $result->status ="Error";
            //$result->user= null;
            return $result;
        }
       //begin:: Check if the user is LOCKED OUT or DISABLED
        foreach($rows as $row) $user_id = $row->id;  
        $user = (object)array('user_id'=>$user_id);
        $x = $this->getUserInfo1($user_id);
        if($x->is_locked==1 || $x->is_locked==true) {
            $result->error_message ="Your account has been locked out.";
            $result->status ="Error";
            //$result->user= null;
            return $result;
        }

        if(trim(strtolower($x->status)) != 'active') {
            $result->error_message ="Your account has been disabled";
            $result->status ="Error";
            //$result->user= null;
            return $result;
        }
       //end:: Check if the user is LOCKED OUT or DISABLED
          
       $hpwd = '#$%&FDHK SDSFSF 2998FGK$343%$333';
       foreach($rows as $row) {
           $hpwd = $row->hpwd;
           unset($row->hpwd);
           $result->user = $row;

           if(password_verify($password,$hpwd)){
                //Login succeeded => create user session either in file or database table
                $sess = $this->createSession($app_id,$login_name,$user_id,$row->branch_id);
                if($sess->status =='OK') {
                  $result->status ='OK';
                  $result->error_message =null;
                  $result->user->access_token =$sess->access_token; 
                  return $result;
                } else {
                  $result->user = null; 
                  $result->status ='Error';
                  $result->error_message =$err;
                  return $result;
                }
              
           } else {
                $result->user = null; 
                $result->status ='Error';
                $result->error_message ='Password is not correct!';
                return $result;
             }
         }

         $result->user = null; 
         $result->status ='Error';
         $result->error_message ='Login name is not correct!';
         return $result;
    }

    //change user password
     static function changeUserPassword($user_id, $oldPwd, $newPwd){
            $new_password_hash = PASSWORD_HASH($newPwd,PASSWORD_DEFAULT);
            $rows = DB::select(DB::raw("SELECT u.hpwd, u.id FROM um_users as u WHERE u.id ='".$user_id."' LIMIT 1"));
            if (!isset($rows[0])) return "user identity is not valid";
            $hpwd = '$%^&**FffgW@$Mx9f5';
            foreach($rows as $row) $hpwd = $row->hpwd;
           
            // if (strtolower(session('user_name')) != strtolower($login_name)) {
            //       return "Failed to change password because there was problem identifying your identity"; 
            // }

            if (password_verify($oldPwd,$hpwd)){ 
              DB::table('um_users')->where('id',$user_id)->update(array('hpwd'=>$new_password_hash));
              return null;
            } else return "Old password is not correct!";
      }


       //In case: user changes their own password
        function changePassword($d){
            //$action ={lock,unlock}
            $ss = getSessionInfo($d);
            if(!$ss) return '#350'; //user not authenticated
            if (!prn_allowed(2)) return '@'; //need permission to do this task
            $branch_id = sanitize($ss->branch_id);

          $login_name = sanitize($d->login_name);
          $oldPwd =$d->oldPwd;
          $newPwd = $d->newPwd;
        $new_password_hash = PASSWORD_HASH($newPwd,PASSWORD_DEFAULT);
        $rows = DB::select(DB::raw("SELECT u.hpwd, u.id FROM um_users as u WHERE u.login_name ='".$login_name."' LIMIT 1"));
        $hpwd = '$%^&**FffgW@$Mx9f5';
        if (!isset($rows[0])) return "Failed to change password because user identity is not correct!";
        foreach($rows as $row) $hpwd = $row->hpwd;

        // if (strtolower(session('user_name')) != strtolower($login_name)) {
        //       return "Failed to change password because there was problem identifying your identity"; 
        // }

        if (password_verify($oldPwd,$hpwd)){ 
           DB::table('um_users')->where('login_name',$login_name)->update(array('hpwd'=>$new_password_hash));
           return null;
        } else return "Old password is not correct!";
      }

      function sendOTPCode_email($d){
        return null;
      }

      function sendOTPCode_phone($d){
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = sanitize($ss->branch_id);
          $phone_number = sanitize($d->phone_number);
      }
      
      //For Admin user to reset password for other user, or user themselve to just save password after otp_code code has been verified correctly
      //$d = {login_name, password} OR $d = {login_name,newPwd}
      function setPassword($d){
          $ss = getSessionInfo($d);
          if(!$ss) return '#350'; //user not authenticated
          if (!prn_allowed(2)) return '@'; //need permission to do this task
          $branch_id = sanitize($ss->branch_id);
          $login_name = sanitize($d->login_name);
          $newPwd = isset($d->newPwd)?$d->newPwd:null;
          if(empty($newPwd)) $newPwd = isset($d->password)?$d->password:null;

        //TODO:Check if the current user has right to set other users' password or not
        //if(empty($login_name)) return "Login name is unexpectedly empty!";
        if(!$this->user_exists($login_name,null)) return "Login name does not exist";
        if(empty($newPwd)) return "password cannot be empty";

        $hpwd = PASSWORD_HASH($newPwd,PASSWORD_DEFAULT);
        DB::table('um_users')->where('login_name',$login_name)->update(array('hpwd'=>$hpwd));
        return null;
    }

      function changeLoginName($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(36)) return '@'; //need permission to do this task permission 36
         $branch_id = sanitize($ss->branch_id);
         $login_name = sanitize($d->login_name);
         $new_login_name = sanitize($d->new_login_name);

         $rows =DB::table('um_users')->where('login_name',$login_name)->selectRaw('id')->limit(1)->get();
         $user_id = null;
         foreach($rows as $row) $user_id = $row->id;
         if (empty($user_id)) return "The provided login name does not exists";   
         if(empty($new_login_name)) return "New login name cannot be blank";

         if ($this->user_exists($new_login_name,$user_id)) {
             return "Login named `".$new_login_name."` already in use";
         } 
         if (strtolower($login_name) === strtolower($new_login_name)) return null;// "New login name cannot be the same as the old login name";
         DB::update(DB::raw("UPDATE um_users SET login_name ='".$new_login_name."' WHERE login_name ='".$login_name."'"));
         //DB::table('um_users')->where('login_name',$login_name)->update(array('login_name',$new_login_name)); //error WHY???
         return null;
      }

      function createLoginSession($user_id = null){
        $last_month_date =date('Y-m-d');
        $app_id = $this->app_id; 
        DB::delete(DB::raw("DELETE FROM um_sessions WHERE DATE(start_time) <= '".$last_month_date. "' AND app_id ='".$this->app_id."' "));
         $session_id = $this->getGUID();
         $rv_code  = $this->getGUID();
         $x = DB::table('um_sessions')>insert(['rv_code'=>$rv_code,'session_id'=>$session_id,'app_id'=>$app_id,'user_id'=>$user_id,'status'=>'Active']);
         if ($x) 
           return $session_id;
         else return null;  
   }

     function getComboItems_user($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(36)) return '@'; //need permission to do this task permission 36
       $branch_id = sanitize($ss->branch_id);
       $role_id = sanitize($d->role_id);
     $rows =[];
     if($role_id > 0) {
        $rows = DB::select(DB::raw("SELECT u.id, u.login_name FROM um_users AS u INNER JOIN um_user_roles as ur ON ur.user_id = u.id WHERE u.branch_id ='".$branch_id."' AND ur.role_id ='".$role_id."' ORDER BY u.`login_name` ASC "));
     } else 
        $rows = DB::select(DB::raw("SELECT u.id, u.login_name FROM um_users AS u WHERE u.branch_id ='".$branch_id."' ORDER BY u.`login_name` ASC "));   
    
    return $rows;
   }
  
   function getComboItems_role($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(36)) return '@'; //need permission to do this task permission 36
       $branch_id = sanitize($ss->branch_id);
       $user_class = isset($d->user_class)?$d->user_class:null;
       $str_user_class =null;
       if(!empty($d->user_class)) $str_user_class =" AND r.user_class ='".$user_class."'";
       $rows = DB::select(DB::raw("SELECT r.name, r.id FROM um_roles AS r WHERE r.branch_id ='".$branch_id."' ".$str_user_class." ORDER BY `name` ASC "));
       return $rows;
    }

      function getComboItems_workloc($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task permission 36
         $branch_id = sanitize($ss->branch_id);

        $q = DB::select(DB::raw("SELECT c.name, c.name_native, c.id FROM um_worklocations AS c WHERE c.branch_id ='".$branch_id."' ORDER BY `name` ASC "));
        return $q;
     }

       function getComboItems_module($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task permission 36
        $branch_id = sanitize($ss->branch_id);
        $rows = DB::select(DB::raw("SELECT m.id,m.module_name as `name` FROM um_app_modules AS m WHERE IFNULL(m.hidden,0) =0 AND m.branch_id ='".$branch_id."' AND m.app_id ='".$this->app_id."' ORDER BY `name` ASC "));
        return $rows;
     }

       function getAccessibleModules_current_user($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task permission 36
         $branch_id = sanitize($ss->branch_id);
         $user_id = sanitize($ss->user_id);
         $rows = DB::select(DB::raw("SELECT DISTINCT m.id,m.disabled, m.module_name AS `name`, m.module_name_native AS name_native, m.icon_image, m.target_url 
         FROM um_app_modules AS m INNER JOIN um_role_modules AS rm ON m.id = rm.module_id 
         INNER JOIN um_user_roles AS ur ON ur.role_id = rm.role_id 
         WHERE IFNULL(m.hidden,0) =0 AND ur.user_id ='".$user_id."' ORDER BY m.disabled ASC, m.display_order ASC"));
         return $rows; 
    } 

      function getAccessibleModules($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task permission 36
        $branch_id = sanitize($ss->branch_id);
        $role_id = sanitize($d->role_id);
        $rows = DB::select(DB::raw("SELECT m.id, m.disabled, m.module_name AS `name`, m.module_name_native as name_native, m.icon_image, m.target_url FROM um_app_modules AS m INNER JOIN um_role_modules AS rm ON m.id = rm.module_id WHERE IFNULL(m.hidden,0) =0 AND m.branch_id ='".$branch_id."' AND m.app_id ='".$this->app_id."' AND rm.role_id ='".$role_id."' ORDER BY m.disabled, m.module_name ASC"));
        return $rows;
    } 
      function addAccessibleModule($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task permission 36
        $branch_id = sanitize($ss->branch_id);

        $role_id = sanitize($d->role_id);
        $module_id = sanitize($d->module_id);
        $rows = DB::select(DB::raw("SELECT ref_code FROM um_app_modules WHERE id ='".$module_id."' LIMIT 1"));
        if(count($rows) <=0) return "Module indentity is not valid";
        if($role_id<=0 || empty($role_id)) return "role ID is not valid";
        $module_code = null;
        foreach($rows as $row) $module_code = $row->ref_code;
        DB::delete(DB::raw("DELETE FROM um_role_modules WHERE role_id ='".$role_id."' AND module_id ='".$module_id."' "));
        DB::table('um_role_modules')->insert([
            'branch_id'=>$branch_id,
            'module_id'=>$module_id,
            'role_id'=>$role_id,
            'module_code'=>$module_code
        ]);
        return null;
    }

      function getPermissionsByRole($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task permission 36
        $branch_id = sanitize($ss->branch_id);
        $role_id = sanitize($d->role_id);
       $rows = DB::select(DB::raw("SELECT rp.role_id, p.id,p.name, (SELECT module_name FROM um_app_modules WHERE id =p.module_id LIMIT 1) AS module_name FROM um_permissions AS p INNER JOIN um_role_permissions as rp ON p.id = rp.permission_id WHERE p.app_id ='".$this->app_id."' AND rp.role_id ='".$role_id."'"));
       return $rows;
    }

      function findPermissions($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task permission 36
        $branch_id = sanitize($ss->branch_id);
        if(!isset($d->search_value)) $d->search_value =0;
        $search_value = escape_like_str($d->search_value);
        $rows = DB::select(DB::raw("SELECT p.id,p.name FROM um_permissions AS p WHERE p.app_id ='".$this->app_id."' AND (p.id ='".$search_value."' OR p.name LIKE'%".$search_value."%')"));
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
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task permission 36
        $branch_id = sanitize($ss->branch_id);
        $role_id =sanitize($d->role_id);
        $ids = sanitize($d->ids);
        if(empty($role_id)) return "role ID is not valid";
       
        $ms = explode('|',$ids);
        $errors = [];
        $success_count =0;
        $fail_count =0;
        foreach($ms as $m) {
            if ($m > 0) {
                      $module_id =null;
                      $rows = DB::table('um_permissions')->where('id',$m)->selectRaw('module_id,app_id')->limit(1)->get();
                      foreach($rows as $row) $module_id = $row->module_id;
                      if ($this->role_access_module($role_id,$module_id)) {
                          DB::delete(DB::raw("DELETE FROM um_role_permissions WHERE branch_id ='".$branch_id."' AND role_id ='".$role_id."' AND permission_id ='".$m."' "));
                          DB::table('um_role_permissions')->insert(array(
                              'branch_id'=>$branch_id,
                              'role_id'=>$role_id,
                              'permission_id'=>$m
                          ));
                          $success_count++;
                      } else {
                        $errors[] = "Cannot add permission numbered ".$m." because it belongs to inaccessible module";
                        $fail_count++;
                      }
            }
        }

        $result = (object)array('errors'=>[],'success_count'=>0,'fail_count'=>0); 
       //$result->status ='OK'; // it depends on number of failed cases VS number of successes 
       $result->errors = $errors;
       $result->success_count = $success_count;
       $result->fail_count = $fail_count;        
       return $result;      
    }

      function removePermissionFromRole($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task permission 36
        $branch_id = sanitize($ss->branch_id);
        $role_id = sanitize($d->role_id);
        /** $ids is a list of permission Ids separated by | **/
        $ids = sanitize($d->ids); 
        if(empty($role_id)) return "role ID is not valid";
        $ms = explode('|',$ids);
        foreach($ms as $m) {
            if ($m > 0) {
                DB::delete(DB::raw("DELETE FROM um_role_permissions WHERE branch_id ='".$branch_id."' AND role_id ='".$role_id."' AND permission_id ='".$m."' "));
            }
        }    
       return null;      
    }

      function getPermissionsByLoginName($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task permission 36
        $branch_id = sanitize($ss->branch_id);
        $login_name = sanitize($d->login_name);
        $user_id = 0;
        $q = DB::select(DB::raw("SELECT u.id FROM um_users AS u WHERE u.login_name ='".$login_name."' AND u.app_id ='".$this->app_id."' LIMIT 1"));
        foreach($q as $row) $user_id = $row->id; 
        $q = DB::select(DB::raw("SELECT DISTINCT rp.permission_id FROM um_user_roles AS ur INNER JOIN um_role_permissions AS rp ON ur.role_id = rp.role_id WHERE ur.user_id ='".$user_id."' AND ur.app_id ='".$this->app_id."' ORDER BY rp.permission_id ASC"));
        return $q;
    }

      function getPermissionsByUserId($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task permission 36
        $branch_id = sanitize($ss->branch_id);
        $$user_id = sanitize($d->user_id);
        $q = DB::select(DB::raw("SELECT DISTINCT rp.permission_id FROM um_user_roles AS ur INNER JOIN um_role_permissions AS rp ON ur.role_id = rp.role_id WHERE ur.user_id ='".$user_id."' AND ur.app_id ='".$this->app_Id."' ORDER BY rp.permission_id ASC"));
        return $q;
    }

      function getPermissionsByRoleId($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task permission 36
        $branch_id = sanitize($ss->branch_id);

        $role_id = sanitize($d->role_id);
        $rows = DB::select(DB::raw("SELECT DISTINCT rp.permission_id FROM um_user_roles AS ur INNER JOIN um_role_permissions AS rp ON ur.role_id = rp.role_id WHERE ur.role_id ='".$role_id."' AND ur.app_id ='".$this->app_id."' ORDER BY rp.permission_id ASC"));
        return $rows;
    }
    
    function localizePermissions($uss,$login_name){
      $uss->login_name = $login_name;
        $data = $this->getPermissionsByLoginName($uss);
        //session->put(('prns'),$data);
    }
     
    function allowed($prn_id){
          // if(!$prn_id || $prn_id <=0) return false;
          // if(!session->has('prns')) return false;
          // //return var_dump($_SESSION['prns']);
          // $prns = session('prns');
          // $i=0;
          // $c=null;
          // do{
          //     if(!isset($prns[$i])) break;
          //     $c = $prns[$i];
          //     if ($c->permission_id == $prn_id) return true; 
          //     $i++;
          // }while($c);

          return true;
    }

    //Check if current user has access to a MODULE refered by module_code or ref_code
      function accessibleModule($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task permission 36
        $branch_id = sanitize($ss->branch_id);

        $ref_code = sanitize($d->ref_code); 
        $user_id = sanitize($ss->user_id);

      //UMM = User Management Module
      if (strtoupper($ref_code) =='UMM'){
         $q = DB::select(DB::raw("SELECT u.previlege_type FROM um_users AS u WHERE u.user_id ='".$user_id."' LIMIT 1")); 
         $p_type ='standard';
         foreach($q as $row) $p_type = strtolower($row->previlege_type);
         if($p_type=='admin' || $p_type=='admins') return true;
      } 

      $q = DB::select(DB::raw("SELECT ur.user_id FROM  um_user_roles AS ur INNER JOIN um_role_modules AS rm ON ur.role_id = rm.role_id WHERE ur.user_id ='".$user_id."' AND rm.module_code ='".$ref_code."' LIMIT 1"));    
      if(count($q) >0) return true;
      return false;
    }

    function getComboItems_userclass($d=null){
      $this->user_classes;
      $items =[];
      foreach($this->user_classes as $c) $items[] = (object)(['user_class'=>$c]);
      return $items;   
    }

    static function logout_mobile($user_id,$app_id){
      if (!self::existsBy('user_id',$user_id,$app_id)) return "User identity not valid";   
      DB::table('um_sessions')->where('user_id',$user_id)->where('app_id',$app_id)->delete();
      return true;
    }

    static function correctUserClass($user_class){
      $user_classes = ['sender','merchant','driver'];
      if(in_array($user_class,$user_classes)) return true;
      else return false;
    }

}
