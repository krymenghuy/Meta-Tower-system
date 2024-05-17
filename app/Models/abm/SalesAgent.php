<?php

namespace App\Models\Abm;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
use Sanitizer;
use App\Models\DV;
use App\Models\JDV;
use Illuminate\Pagination\LengthAwarePaginator; 
use App\Models\Dms\PublicStorage;
use Carbon\Carbon;
use App\Models\Sender;
use Config;
use Illuminate\Support\Facades\Cache;

class SalesAgent //extends Model
{
    protected $id = null, $userInfo = null;
    protected static $photo_dir = 'os_sales_agent';
    /** This is for Full-timer sales staff: the Threhold is set to 3000pcs in order to get $100 bonus, and each additional package, he gets 0.05 USD */
    protected static $ft_item_count_threhold = 500, $ft_amount_per_unit =0.05, $ft_bonus_amount =100;
    ///** This is the standard columns for commission summary. Some of these columns will be restructured or remaned according to whether the Summary is Closed or Real-time */
    //protected static $comm_summary_cols = ['id','agent_type','sales_agent_id','op_month','op_year','target_count','effective_count','amount_per_unit','bonus_amount','total_amount','paid_amount','currency_code','policy_id','policy_name','rule_class','a.id AS agent_type_id','remarks','summary_type','calculate_method','create_user','create_date'];
    public function __construct($id=null,$userInfo =null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo; 
    }

    function delete($id=null,$as=null,$ss =null){
       $id = $id ?? $this->id;
       $ss = $ss ?? $this->userInfo;
      //  return JDV::result([$as,$id]);
      //  $this->deleteProfilePhoto($id,$ss);
       $x = DB::table('affiliates as o')->where('o.id',$id)->delete();
       if($x){
        DB::table('suppliers')->where('sales_agent_id',$id)->update(['sales_agent_id'=>null]);
        // DB::table('leads')->where('sales_agent_id',$id)->update(['sales_agent_id'=>null]);
        // DB::table('um_users')->where('official_id',$id)->where('user_class','sales_agent')->delete();
        if($as=='sa'){
          DB::table('os_sales_agents')->where('affiliate_id',$id)->delete();
        }else
          DB::table('os_contact_persons')->where('affiliate_id',$id)->delete();

       }else
       return DV::depends(1,'Failed to delete sales agent'); 

       return DV::depends($x,['id'=>$id],'sales agent has deleted'); 

    }

    static function getPolicyId($agent_type_id){
       //2 = "Staff policy", 1 = "Freelancer commission policy"
       return $agent_type_id ==1? 2:1;
       //Policy_id => 1 = "Full time policy", 2 = "Freelanancer commission policy"
    }

    function save($arr, $id = null, $ss = null){
      $ss = $ss ?? $this->userInfo;
      $id = $id ?? $this->id;
      $v_rule = [
        'name'=>'1|string|1-150',
        'sex'=>'1|choice|M,F,O',
        'agent_type'=>'1|choice|client_affiliate,freelancer,full_time|default=client_affiliate',
        'phone_number'=>'1|phone',
        'email'=>'0|email',
        'address'=>'0|address',
        'status_code' => '0|choice|Active,Inactive|default=Active', //Add status_code to table os_sales_agents
        //  'agent_type_id'=>'1|number|exists=sales_agent_types.id',
        'code'=>'0|string|0-25',         //Add new code column to table os_sales_agent
        'photo'=>'0|image'        //Add new photo_file_name to table os_sales_agent

      ];
      $email_chars = ['@','-','.','_'];
      $img_char = ['+',':',',',';','/','\\','=','?'];
      $address_chars = ['.','#'];
      $branch_id = $ss->branch_id;
      $res = validateObject($arr,$v_rule,true,['address'=>$address_chars,'email'=>$email_chars,'photo'=>$img_char],$ss->lang,false,null);
      if($res->error) return DV::error($res->error);
      $inputs = $res->values;
      $d = (object)$inputs;
      $photo = $d->photo;
      unset($inputs['photo']); 
      $created = !$id;
      $create_login = $created;
      $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));
      $id = saveData($ss,'affiliates',['id'=>$id],$inputs,[],1,false);
      if($id>0){
        $new_code = null;

        if($delete_prev_image){
          $file_name = DB::table('affiliates as s')->where('s.id',$id)->take(1)->value('s.photo_file_name');
          if($file_name) PublicStorage::delete($branch_id,self::$photo_dir,'image',$file_name);
          DB::table('affiliates as s')->where('s.id',$id)->update(['photo_file_name'=>null]);
        }
        PublicStorage::saveImage($branch_id,self::$photo_dir,null,$photo,null,['id'=>$id,'store'=>'affiliates.photo_file_name']);  
        
        if($created){
            $new_code  = self::setAgentCode($ss,5);
            $n = (object)$new_code;
            DB::table('affiliates')->where('id',$n->last_id)->update(['code'=>$n->code]);
            $as = (object)$arr;
            
            // return JDV::result([$as->as]);
            $sa_agent_type='';
            if($d->agent_type =='client_affiliate') $sa_agent_type = 1 ;
            else if($d->agent_type =='freelanser' ) $sa_agent_type = 2 ;
            else if($d->agent_type =='full_time' ) $sa_agent_type = 3 ;
            if($as->as=='sa'){
              $sa_arr=['affiliate_id'=>$n->last_id,'agent_type'=>$sa_agent_type];
              $sa_v_rule = [
                'affiliate_id'=>'1|number',
                'agent_type'=>'1|choice|1,2,3',
              ];
              $sa_res = validateObject($sa_arr,$sa_v_rule,true,[],$ss->lang,false,null);
              if($res->error) return DV::error($res->error);
              $sa_inputs = $sa_res->values;
              $sa_id='';
              $sa_id = saveData($ss,'os_sales_agents',['id'=>$sa_id],$sa_inputs,[],1,false);
              // return JDV::result($sa_inputs);
            }
            else{
              $cp_type=1;

              $sa_arr=['affiliate_id'=>$n->last_id,'cp_type'=>$cp_type];
              $sa_v_rule = [
                'affiliate_id'=>'1|number',
                'cp_type'=>'0|choice|1,2',
                'sender_id'=>'0|number',
              ];
              $sa_res = validateObject($sa_arr,$sa_v_rule,true,[],$ss->lang,false,null);
              if($res->error) return DV::error($res->error);
              $sa_inputs = $sa_res->values;
              $sa_id='';
              $sa_id = saveData($ss,'os_contact_persons',['id'=>$sa_id],$sa_inputs,[],1,false);
            }
            // return JDV::result('erorr');

        }

      }

      return DV::depends($id,['id'=>$id],'Failed to save sales agent');
    }
 
    static function createAppLogin($agent_id,$agent_code,$d,$ss){
       //begin::create user profile in table um_users
                       //$otp_code = $this->newOTP(6); 
                       $app_id = Config::get('app.sales_app_id');
                       $login_name = $d->login_name ?? $d->phone_number;
                       $hpwd= PASSWORD_HASH(($d->password ?? $login_name),PASSWORD_DEFAULT);
                       $d->subs_id=null;
                       $d->work_location_id =null;
                       //Make sure role_id =14 is protected from being deleted in table "um_roles"
                       $default_role_id =18; // default_role_id = 18 => "Sales Agent" role. todo: protect role 14 from being deleted or renamed
                      
                      DB::table('um_users')->insert([
                      'otp_code'=>null,
                      'app_id'=>$app_id, /** NOTE that app_id usually depends on @user_class (method $this->getAppIdByUserClass() will returns same app_id for every "user_class" if all user_classes are allowed to log in to the same app) **/
                      'branch_id'=>$ss->branch_id,
                      'login_name'=>$login_name,
                      'full_name'=>$d->name,
                      'official_id'=>$agent_id,
                      'official_code'=>$agent_code,
                      'hpwd'=>$hpwd,
                      'previlege_type'=>isset($d->previlege_type)? $d->previlege_type:'standard', //{'standard','admin'}
                      'user_class'=>'sales_agent',
                      'phone_number'=>$d->phone_number,
                      'email'=>$d->email,
                      'subs_id'=>isset($d->subs_id)? $d->subs_id : null,
                      'status'=>'active',
                      'is_locked'=>0,
                      //'work_location_id'=>$d->work_location_id,
                      'create_user'=>$ss->full_name,
                      'create_date'=>getNowTime(),
                      'create_uid'=>$ss->user_id
                    ]);
                    $d->user_id  = DB::getPdo()->lastInsertId();

                    $um = new \App\Models\UM();
                    $um->addRoleMember($d->user_id,$default_role_id,$ss);
    }

    function saveProfilePhoto($photo, $id,$ss){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        if(isImage($photo)){
          $file_name = DB::table('sales_agents as a')->where('id',$id)->take(1)->value('photo_file_name');
          if($file_name) PublicStorage::delete($branch_id,self::$photo_dir,'image',$file_name);
          $m_res = PublicStorage::saveImage($branch_id,self::$photo_dir,null,$photo,null,['id'=>$id,'store'=>'sales_agents.photo_file_name']); 
          if($m_res->status =='Error') return DV::error($m_res->error_message);
          else return DV::success();
        }
       return DV::error('Failed to save agent profile photo');  
    }

    function deleteProfilePhoto($id,$ss){
      $id = $id ?? $this->id;
      $ss = $ss ?? $this->userInfo;
      $branch_id = $ss->branch_id;
      $file_name = DB::table('sales_agents as a')->where('id',$id)->take(1)->value('photo_file_name');

      if($file_name) PublicStorage::delete($branch_id,self::$photo_dir,'image',$file_name);
      return DV::depends(1);       
  }

    function agent_name_exists($branch_id,$name,$id) {
       $str_id = $id>0 ? 'id <> '.$id:'1=1'; 
       $row = DB::table('sales_agents AS a')->where('a.branch_id',$branch_id)->where('a.name',$name)->whereRaw($str_id)->selectRaw('id')->take(1)->first();
       return $row?true:false;
    }

    function setAgentCode($uss,$len =5){
        $branch_id = $uss->branch_id;
        $prefix ='HA';
        $str_prefix = $prefix? 'prefix =\''.$prefix.'\'' : '2=2';
        $row = DB::table('agent_code_control AS c')->where('branch_id',$branch_id)->whereRaw($str_prefix)->selectRaw('TRIM(c.prefix) AS prefix,c.last_id')->take(1)->first();
       if($row) {
            $num = $row->last_id;
            $prefix = trim($row->prefix);
            $num +=1;
            DB::table('agent_code_control')->where('branch_id',$branch_id)->whereRaw($str_prefix)->update(['last_id'=>$num]);
        return ['code'=>$prefix.$branch_id.formatNumber($num,$len),'last_id'=>$num];
        // return $prefix.$branch_id.formatNumber($num,$len);
        }
        DB::table('agent_code_control')->insert(['branch_id'=>$branch_id,'last_id'=>1,'prefix'=>$prefix]);
        return ['code'=>$prefix.$branch_id.formatNumber(1,$len),'last_id'=>$row->last_id];
    }
    
    static function getFormOptions($id,$ss){
        $d = null;
        if ($id) $d = self::details($id,$ss);
        // return DB::table('os_agent_types')->selectRaw('name as id,name AS agent_type')->get();
        return (object)[
           'details'=>$d, 
           'statuses'=>DB::table('sales_agent_statuses AS ss')->selectRaw('ss.code As status_code,ss.name AS status_name')->get(),
           'agent_types'=> DB::table('os_agent_types')->selectRaw('name as id,name AS agent_type')->get(),
           'cp_types'=> DB::table('os_contact_person_types')->selectRaw('name as id,name AS cp_types')->get(),
        ];
    }

    /** returns filter options. list of agent, and list of agent type*/
    static function getPaymentFormOptions($include_all,$active_only,$ss){
      $agents = GeneralSettings::options_sales_agent($ss,$include_all,$active_only);
      //$months = GeneralSettings::options_calendar_month(null);
      //$years =  GeneralSettings::options_calendar_year(20);
      $month_years = GeneralSettings::options_calendar_month_year(null);
      return (object)[
         'agents'=>$agents,
         //'months'=>$months,
         //'years'=>$years,
         'month_years'=>$month_years,
         'pmt_methods' => DB::table('payment_methods as m')->selectRaw('m.id,m.name AS pmt_method')->get(),
         'exchange_info'=>GeneralSettings::getExchangeRate(null,$ss),
         'agent_types'=> DB::table('sales_agent_types')->selectRaw('id,name AS agent_type')->get(),
      ];
    }

    function newOTP($length=6)
    {
      return join('', array_map(function($value) { return $value == 1 ? mt_rand(1, 9) : mt_rand(0, 9); }, range(1, $length)));
    }
    
    /*** send_otp_preregister($d). $d = {'phone_number'} => send_otp_preregister() will check if the phone number is already in use, 
        if the phone_number not yet in use then create OTP in templory table "temp_otp" waiting to be verified (otp_code is deleted after verified correctly or 1 minute later)      
       api/reg-send-otp
       $d = {phone_number}
    */
    function send_otp_preregister($arr = []){
      $d = (object)$arr;
      //Generate new 6-digit OTP code
      $otp_code = $this->newOTP(6); 
      //$app_id = isset($d->app_id)? Sanitizer::sanitize($d->app_id):null;
      $app_id = getAppIdByUserClass($d->user_class);
      //$result = (object)array('status'=>'OK','error_message'=>null);
      
      //Make sure the app_id supplied is the Merchant Mobile App
      if (empty($app_id)) {
         return DV::error('App ID is not valid');
      }

      $branch_id =1; //1 = "HOU XPRESS branch_id =1 "
      $d->phone_number = isset($d->phone_number)? $d->phone_number:null;
      if (empty($d->phone_number)){
         return DV::error('Phone number cannot be empty');
      } 
      
      //Check if the phone_number is already in use
      $number_in_use = DB::table('um_users AS u')->where('app_id',$app_id)->where('login_name',$d->phone_number)->take(1)->exists();
      if ($number_in_use) return DV::error('Phone number is already in use');
       
       //$text = get_settings_value($ss,'OTP_SMS_TEMPLATE','string'); //get sms template from settings storage table
       $text ='អរគុណសំរាប់ការចុះឈ្មោះ​។ លេខសម្ងាត់ #';
       $text = str_replace('#',$otp_code,$text); 
      
       $m_result = SMS::send($d->phone_number,$text,null); 
       if ($m_result->status === 'Error') 
          return DV::error($m_result->error_message); 
       else{
            //Save OTP_CODE after successfully sent otp_code sms 
            $expiry_time = Carbon::now()->addSeconds(60);
            DB::table('temp_otp')->where('app_id',$app_id)->where('phone_number',$d->phone_number)->delete();
            DB::table('temp_otp')->insert(array(
              'branch_id'=>$branch_id,
              'app_id'=>$app_id,
              'phone_number'=>$d->phone_number,
              'otp_code'=>$otp_code,
              'expiry_time'=>$expiry_time
            ));
            return DV::depends(1,['otp_code'=>$otp_code]);
         }  
  }

  function verify_otp_preregister($arr=[]){
       $d = (object)$arr;
        $phone_number = isset($d->phone_number)?$d->phone_number:null;
        $otp_code = isset($d->otp_code)?$d->otp_code:null;
        $app_id = getAppIdByUserClass($d->user_class);
        if (empty($phone_number)) return DV::error("Phone number cannot be empty $phone_number"); 

        if (empty($otp_code)) return DV::error('otp code cannot be empty'); 

        $exists = DB::table('temp_otp')->where('app_id',$app_id)->where('phone_number',$phone_number)->where('otp_code',$otp_code)->take(1)->exists();
        if ($exists) DB::table('temp_otp')->where('app_id',$app_id)->where('phone_number',$phone_number)->where('otp_code',$otp_code)->delete();
        
        return DV::success(['data'=>($exists)?1:0]);
  }
   

    /** Sales Agent self-register via Sales Mobile App */
    function register($arr = [],$ss){
      $ss = (object)['branch_id'=>1,'lang'=>'en','user_id'=>null,'login_name'=>'self','full_name'=>'self'];  
      $v_rule = [
         'phone_number'=>'1|phone',
         'name'=>'1|string|1-150',
         'sex'=>'0|choice|M,F',
         'email'=>'0|email|0-100',
         'agent_type_id'=>'1|number|exists=sales_agent_types.id',
         'password'=>'1|string|0-150',
         'photo'=>'0|image'
      ];
      $branch_id = $ss->branch_id;
      $res = validateObject($arr,$v_rule,true,['email'=>['@','-','.','_']],$ss->lang,false,null);
      if($res->error) return DV::error($res->error);
      $inputs = $res->values;
      $d = (object)$inputs;
      $photo = $inputs['photo'];
      unset($inputs['photo'],$inputs['password']);

      $id = null;
      $agent_code = null;
      $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));
      $id = saveData($ss,'sales_agents',['id'=>$id],$inputs,[],1,false);
      if($id > 0){
        if($delete_prev_image){
            $file_name = DB::table('sales_agents as a')->where('id',$id)->take(1)->value('photo_file_name');
            if($file_name) PublicStorage::delete($branch_id,self::$photo_dir,'image',$file_name);
            DB::table('sales_agents as a')->where('id',$id)->update(['photo_file_name'=>null]);
        }
        $agent_code = self::setAgentCode($ss,5);
        DB::table('sales_agents')->where('id',$id)->update(['code'=>$agent_code]);
        PublicStorage::saveImage($branch_id,self::$photo_dir,null,$photo,null,['id'=>$id,'sales_agent.photo_file_name']);
         
              //begin::create user profile in table umt_users
                       //$otp_code = $this->newOTP(6); 
                       $app_id = Config::get('app.sales_app_id');
                       $login_name = $d->phone_number; // user PHONE NUMBER as login name
                       $hpwd= PASSWORD_HASH($d->password,PASSWORD_DEFAULT);
                       $d->subs_id=null;
                       $d->work_location_id =null;
                       //Make sure role_id =18 is protected from being deleted in table "um_roles"
                       $default_role_id =18; // default_role_id = 14 => "Merchant" role. todo: protect role 14 from being deleted or renamed
                      
                      DB::table('um_users')->insert([
                      'otp_code'=>null,
                      'app_id'=>$app_id, /** NOTE that app_id usually depends on @user_class (method $this->getAppIdByUserClass() will returns same app_id for every "user_class" if all user_classes are allowed to log in to the same app) **/
                      'branch_id'=>$branch_id,
                      'login_name'=>$login_name,
                      'full_name'=>$d->name,
                      'official_id'=>$id,
                      'official_code'=>$agent_code,
                      'hpwd'=>$hpwd,
                      'previlege_type'=>isset($d->previlege_type)? $d->previlege_type:'standard', //{'standard','admin'}
                      'user_class'=>'sales_agent', /* user_class = {student,parent,customer,viewer,patient,user}. It is whatever classification meaningful in specific Application Context. It provides directive to use "official_id" to link to meaning table such as Students or Employees or Customers or Parents etc...*/
                      'phone_number'=>$d->phone_number,
                      'email'=>$d->email,
                      'subs_id'=>$d->subs_id,
                      'status'=>'active',
                      'is_locked'=>0, // is_locked = 1 => needs activation before can user can make first login
                      'work_location_id'=>$d->work_location_id,
                      'create_user'=>'self',
                      'create_date'=>getNowTime(),
                      'create_uid'=>null
                    ]);

                   $d->user_id  = DB::getPdo()->lastInsertId();
                   //$this->UMModel->addRoleMember1($ss,$default_role_id,$d->user_id); 
                   DB::table('um_user_roles')->where('branch_id',$branch_id)->where('role_id',$default_role_id)->where('user_id',$d->user_id)->delete();
                   DB::table('um_user_roles')->insert(['branch_id'=>$branch_id,'user_id'=>$d->user_id,'role_id'=>$default_role_id,'app_id'=>$app_id,'is_primary_role'=>1]);
             //end::create user profile

               //begin:: create login's session and access_token => to allow Merchant's auto login, after registration
                          //UM::setUserSession() is a static function and is the same as UM->createSession()
                          $user = DB::table('um_users AS u')->selectRaw('u.lang,u.user_class,u.official_id,u.hpwd, u.id,u.login_name, u.branch_id, u.full_name, u.status, u.is_locked,u.email,u.phone_number,u.otp_code')->where('u.login_name',$login_name)->where('u.app_id',$app_id)->first(); 
                          if(!$user) return DV::error('Sales Agent account was created but auto login failed');
                          unset($user->hpwd);

                          $sess = UM::setUserSession($app_id,$user);
                          if($sess->status =='OK') {
                            //start:: get user`s details    
                                $user->access_token = $sess->access_token;
                            //end:: get user's details
                              // //start:: encrypt token
                              //   $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
                              //   $user->access_token = $encrypter->encrypt($user->access_token,false);
                              // //end:: encrypt token
                            return DV::depends(1,['user'=>$user]);
                          } else {
                            //In case of error creating user's session table "um_sessions"
                            $user = (object)['access_token'=>null,'id'=>$id,'code'=>$agent_code];
                            return DV::error( $sess->error_message);
                          }
                  //end:: create login's session and access_token => to allow Merchant's auto login, after registration

      }
      return DV::depends($id,['code'=>$agent_code],'Failed to save sales agent profile');
    }

    static function defaultImage($branch_id){
        return PublicStorage::getUrl($branch_id,'default','image').'mr3.jpg';
    }

  static function setCommissionPolicy($policy_id,$id){
     DB::table('sales_agents')->where('id',$id)->update([
       'policy_id'=>$policy_id
     ]);
     return DV::depends(1);
  }
  function updateStatus($status_code,$id=null){
    if(!in_array(strtolower($status_code),['active','inactive'])) return DV::error('Status code is not correct');
    DB::table('affiliates')->where('id',$id)->update(['status_code'=>$status_code]);
    return DV::depends(1,['update'=>'don']);
  }
    //Called by Sales mobile app to update user profile quickly
   function updateProfile_mobile($arr = [],$id= null,$ss =null){
    $ss =$ss?$ss:$this->userInfo;
    $id = $id?$id:$this->id; 
    $branch_id = $ss->branch_id;
    $v_rule = [
      'name'=>'1|string|1-250',
      'phone_number'=>'1|phone',
      'email'=>'0|email|0-100',
      'address'=>'0|string|0-300'
    ];
    $address_map_chars = ['/', ':', ',', '!', '@', '?', '=', '&', '[', ']', '(', ')', '!', '.', '/', ':', '?', '=', '&', '#', '[', ']', '@', '!', '$', "'", '(', ')', '*', '+', ',', ';', '%'];
    $res = validateObject($arr,$v_rule,true,['address'=>$address_map_chars],$ss->lang,false,null);
    if($res->error) return DV::error($res->error);
    $inputs = $res->values;
    $d = (object)$inputs;

    $phone_err = self::checkUniquePerson($branch_id,$d->phone_number,$id);
    if ($phone_err) return DV::error($phone_err);
    //if ($this->agentExists($ss,$d->name,$id)) return DV::error('It seems this name is already in use by another merchant');  
    $org_agent = self::getAgentProp($id,'phone_number');
    $org_phone_number = $org_agent? $org_agent->phone_number : null;
    if ($org_phone_number && $d->phone_number && ($org_phone_number != $d->phone_number)){
        unset($inputs['phone_number']);
    }
    $id = saveData($ss,'sales_agents',['id'=>$id],$inputs,[],1,false);
    if($id){
      $sms_err = null;
      //Check if sales changed his phoner number   
        if ($org_phone_number && $d->phone_number && ($org_phone_number != $d->phone_number)){
            $new_otp_code = $this->newOTP();
            $res = PendingTask::create('change_phone_number',$branch_id,$ss->user_id,$org_phone_number,$d->phone_number,$new_otp_code);
            if ($res->status==='OK'){
               $m = SMS::send($org_phone_number,"លេខសំងាត់ $new_otp_code សំរាប់ប្តូរលេខទូរសព្ទ័");
               if ($m->status ==='Error') $sms_err = $m->error_message;
               return DV::depends(1,['otp_code'=>$new_otp_code,'change_phone_number'=>1,'sms_error'=>$sms_err]);
            }else return DV::error($res->error_message);
        }
      //end of checking Phone number changing
       return DV::depends(1,['otp_code'=>null,'change_phone_number'=>0,'sms_error'=>$sms_err]); 
    }else return DV::error('Problem in updating Sales Personel profile');
}

function agentCodeExists($uss,$code,$id) {
  $branch_id = $uss->branch_id;
  $rows = [];
  if (!$code) return false;
  $str_id = $id > 0 ? 's.id <> '.$id : '1=1';
  $row = DB::table('sales_agents AS s')->where('s.branch_id',$branch_id)->where('s.code',$code)->whereRaw($str_id)->selectRaw('s.id')->take(1)->first();
  return $row? true:false;
}

static function getAgentProp($id,$prop){
  return DB::table('sales_agents')->where('id',$id)->selectRaw($prop)->take(1)->first();
}

function checkUniquePerson($branch_id,$phone_number,$id=null){
  $str_id ="1=1";
  if(!$phone_number) return 'Phone number cannot be empty';
  if ($id>0) $str_id="s.id <> $id";
  $x = DB::table('sales_agents as s')->where('s.branch_id',$branch_id)->where("s.phone_number",$phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
  if ($x) return 'Phone number "'.$phone_number.'" has been used by another registered sales personnel';
  $x = DB::table('driver as s')->where('s.branch_id',$branch_id)->where("s.phone_number",$phone_number)->select('id')->take(1)->exists();
  if($x) return 'Phone number "'.$phone_number.'" has been used by a driver';
  $x = DB::table('sender as s')->where('s.branch_id',$branch_id)->where("s.phone_number",$phone_number)->select('id')->take(1)->exists();
  if($x) return 'Phone number "'.$phone_number.'" has been used by a merchant';
  return null;
}

    static function getSalesAgentList($arr,$ss=null){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $search_value = isset($d->search_value)?$d->search_value:null;

        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $status_code = isset($d->status_code)? Sanitizer::sanitize($d->status_code):null;
        $agent_type =isset($d->agent_type)? $d->agent_type : null; 
        
        $str_agent_type = '3=3';
        $str_status = '1=1';
        $str_search = '2=2';
        if($search_value){
          $search_value = escape_like_str($search_value);
          $str_search = ' (d.status_code =\''.$search_value.'\' OR d.name LIKE \'%'.$search_value.'%\' OR d.phone_number =\''.$search_value.'\')';
        }else{
          $str_agent_type = $agent_type? 'd.agent_type =\''.$agent_type.'\'' : '3=3';
          $str_status = $status_code? 'd.status_code =\''.$status_code.'\'' : '1=1';
        }
       
        $query = DB::table('os_sales_agents AS sa')
        ->join('affiliates as d','d.id','=','sa.affiliate_id')
        ->where('sa.branch_id',$branch_id)
        ->whereRaw($str_search)
        ->whereRaw($str_status)
        ->whereRaw($str_agent_type)
        ->selectRaw('d.id,d.code,d.name,d.status_code,d.email,d.phone_number,d.address,d.photo_file_name,d.agent_type,d.branch_id,formatDate(d.create_date) AS start_date,formatTime(d.create_date) AS create_date')
        ->orderBy('d.id', 'DESC'); 
        $count_query = clone $query;
        $count = $count_query->count('d.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
          $row->image_url = '';
        //   //$row->mobile_login = \App\Models\UM::getAccountInfo($row->id,'official_id');
          if($row->photo_file_name) $row->image_url = PublicStorage::getUrl($row->branch_id,self::$photo_dir,'image').$row->photo_file_name;
          // $url = $row->photo_file_name? $row->image_url = PublicStorage::getUrl($branch_id,self::$photo_dir,'image').$row->photo_file_name:null;
          // $row->image_url = validateUrl($url,self::defaultImage($branch_id));
          unset($row->photo_file_name);
        //   //$pol = self::getPolicyInfo($row->policy_id,$ss);
        //   //$row->policy_name = $pol? $pol->name: 'NA';
          if(!$row->image_url) $row->image_url =self::defaultImage($ss->branch_id);
        //   $user_info = self::getLoginInfo(  $row->id,$ss);
        //   if($user_info){
        //      $row->login_name = $user_info->login_name;
        //      $row->user_id = $user_info->id;
        //   }
        //   $current_month = date('m');
        //   $current_year = date('Y');
        //   $row->current_month = getMonthName($current_month);
        //   $row->current_year = $current_year;
        //   $countInfo = self::countTarget($current_year,$current_month,$row->id,$ss);
        //   $row->count_type = $countInfo->count_type;
        //   $row->target_count = $countInfo->count; 
        //   $row->summary_type = $countInfo->summary_type;
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function getContactPersonList($arr,$ss=null){
      $branch_id = $ss->branch_id;
      $d = (object)$arr;
      $search_value = isset($d->search_value)?$d->search_value:null;

      $current_page =isset($d->current_page)?$d->current_page:1;
      $per_page =isset($d->per_page)?$d->per_page:10;
      if(!is_numeric($current_page)) $current_page=1;
      $skip_rows = ($current_page -1) * $per_page;

      $status_code = isset($d->status_code)? Sanitizer::sanitize($d->status_code):null;
      $agent_type =isset($d->agent_type)? $d->agent_type : null; 
      
      $str_agent_type = '3=3';
      $str_status = '1=1';
      $str_search = '2=2';
      if($search_value){
        $search_value = escape_like_str($search_value);
        $str_search = ' (d.status_code =\''.$search_value.'\' OR d.name LIKE \'%'.$search_value.'%\' OR d.phone_number =\''.$search_value.'\')';
      }else{
        $str_agent_type = $agent_type? 'd.agent_type =\''.$agent_type.'\'' : '3=3';
        $str_status = $status_code? 'd.status_code =\''.$status_code.'\'' : '1=1';
      }
     
      $query = DB::table('os_contact_persons AS cp')
      ->join('affiliates as d','d.id','=','cp.affiliate_id')
      ->where('cp.branch_id',$branch_id)
      ->whereRaw($str_search)
      ->whereRaw($str_status)
      // ->whereRaw($str_agent_type)
      ->selectRaw('d.id,d.code,d.name,d.status_code,d.email,d.phone_number,d.address,d.photo_file_name,d.agent_type,d.branch_id,formatDate(d.create_date) AS start_date,formatTime(d.create_date) AS create_date')
      ->orderBy('d.id', 'DESC'); 
      $count_query = clone $query;
      $count = $count_query->count('d.id');
      $rows = $query->skip($skip_rows)->take($per_page)->get();
      foreach($rows as $row){
        $row->image_url = '';
      //   //$row->mobile_login = \App\Models\UM::getAccountInfo($row->id,'official_id');
        if($row->photo_file_name) $row->image_url = PublicStorage::getUrl($row->branch_id,self::$photo_dir,'image').$row->photo_file_name;
        // $url = $row->photo_file_name? $row->image_url = PublicStorage::getUrl($branch_id,self::$photo_dir,'image').$row->photo_file_name:null;
        // $row->image_url = validateUrl($url,self::defaultImage($branch_id));
        unset($row->photo_file_name);
      //   //$pol = self::getPolicyInfo($row->policy_id,$ss);
      //   //$row->policy_name = $pol? $pol->name: 'NA';
        if(!$row->image_url) $row->image_url =self::defaultImage($ss->branch_id);
      //   $user_info = self::getLoginInfo(  $row->id,$ss);
      //   if($user_info){
      //      $row->login_name = $user_info->login_name;
      //      $row->user_id = $user_info->id;
      //   }
      //   $current_month = date('m');
      //   $current_year = date('Y');
      //   $row->current_month = getMonthName($current_month);
      //   $row->current_year = $current_year;
      //   $countInfo = self::countTarget($current_year,$current_month,$row->id,$ss);
      //   $row->count_type = $countInfo->count_type;
      //   $row->target_count = $countInfo->count; 
      //   $row->summary_type = $countInfo->summary_type;
      }
      return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
  }
    
    static function getLoginInfo($id,$ss){
      $branch_id = $ss->branch_id;
       $cache_key = 'sales_agentlist11';
       $rows = Cache::get($cache_key);
       if(!$rows){
         $rows = DB::table('um_users as u')->where('user_class','sales_agent')->where('branch_id',$branch_id)->selectRaw('u.id,u.official_id,u.phone_number,u.full_name,u.login_name')->get();
         Cache::put($cache_key,$rows,5); 
       }
      foreach($rows as $row){
         if($row->official_id ==$id) return $row;
      }
      return null;
    }

    static function getPolicyInfo($policy_id, $ss)
    {
        $branch_id = $ss->branch_id;
        $key = 'commpolicies';
        $cacheDuration = 3; // Set your cache duration 3 seconds
    
        $policies = Cache::remember($key, now()->addMinutes($cacheDuration), function () use ($branch_id) {
            return DB::table('commission_policies as p')->where('p.branch_id', $branch_id)->select('id', 'name','count_type','rule_class')->get();
        });
        //NOTE:: $policies is a "collection", not array
        return $policies->firstWhere('id', $policy_id);
    }
   
    /** $arr = {"month","year"}*/
    function closeCommissionSummary($arr,$id=null,$ss = null){
       $id = $id ?? $this->id;
       $ss =$ss ?? $this->userInfo;
       $branch_id = $ss->branch_id;
       $d = (object)$arr;
       $d->month = isset($d->month)?  $d->month:date('m');
       $d->year = isset($d->year)?  $d->year:date('Y');
       $d->remarks = isset($d->remarks)? $d->remarks: null;
        
       $agent = DB::table('sales_agents as a')->join('commission_policies AS p','p.id','=','a.policy_id')->where('a.id',$id)->where('a.branch_id',$branch_id)->selectRaw('a.id,a.agent_type_id,a.policy_id,a.agent_type_id, p.name AS policy_name,p.rule_class,p.count_type')->first();
       if(!$agent)return DV::error('Sales Agent ID does not exist or there is no commission policy assigned to the agent');
       $rule = strtoupper($agent->rule_class);
       if ($rule =='A'){
         $x = self::calculateRuleA($d->month,$d->year,$id,$ss);
         $inputs = [
          'sales_agent_id'=>$id,
          'op_month'=>$d->month,
          'op_year'=>$d->year,
          'agent_type_id'=>$agent->agent_type_id,
          'rule_class'=>$rule,
          'merchant_count'=>$x->merchant_count,
          'marker_qty'=>self::$ft_item_count_threhold,
          'count_type'=>$x->count_type,
          'target_count'=>$x->target_count,
          'effective_count'=>$x->effective_count,
          'bonus_amount'=>$x->bonus_amount,
          'policy_id'=> $x->policy_id,
          'policy_name'=> $agent->policy_name, 
          'total_amount'=>$x->total_amount,
          'amount_per_unit'=>$x->amount_per_unit,
          'currency_code'=>$x->currency_code,
          'remarks'=>$d->remarks,
          'calculate_method'=> $x->calculate_method
       ];
      }else if ($rule =='B'){
          $x = self::calculateRuleB($d->month,$d->year,$id,$agent->policy_id,$ss);
          $inputs = [
            'sales_agent_id'=>$id,
            'op_month'=>$d->month,
            'op_year'=>$d->year,
            'agent_type_id'=>$agent->agent_type_id,
            'rule_class'=>$rule,
            'count_type'=>$x->count_type,
            'merchant_count'=>$x->merchant_count,
            'marker_qty'=>0, /** Rule B => No market_qty*/
            'target_count'=>$x->target_count,
            'effective_count'=>$x->effective_count,
            'bonus_amount'=>$x->bonus_amount,
            'policy_id'=> $x->policy_id,
            'policy_name'=> $agent->policy_name, 
            'total_amount'=>$x->total_amount,
            'amount_per_unit'=>$x->amount_per_unit,
            'currency_code'=>$x->currency_code,
            'remarks'=>$d->remarks,
            'calculate_method'=> $x->calculate_method
         ];
         
      } else return DV::error('Invalid Rule for calculating commission. Note rule must be A or B');
      
        $closing_id = DB::table('closed_commissions as c')->where('c.sales_agent_id',$id)->where('op_month',$d->month)->where('op_year',$d->year)->value('id');
        $closing_id = saveData($ss,'closed_commissions',['id'=>$closing_id],$inputs,[],1,false);
        return DV::depends($closing_id,[],'Failed to close commission summary'); 
      }

    function makeCommissionPayment($arr,$id =null,$ss=null){
        $id = $id ?? $this->id;
        $ss =$ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
           'payment_date'=>'0|date',
           'amount'=>'1|number|default=0',
           'remarks'=>'0|string|0-250',
           'pmt_method'=>'1|string|1-35',
           'agent_id'=>'1|number|exists=sales_agents.id',
           'agent_type'=>'0|string|0-50}default=sales_agent', /* sales_agent*/
           'op_month'=>'1|number|1-12',
           'op_year'=>'1|number|default=0',
           'currency_code'=>'0|string|0-10|default=USD'
        ];
        $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object)$inputs;
        unset($inputs['month'],$inputs['year'], $inputs['agent_id'], $inputs['agent_type']);
        $trx_id = null;
        $closing_id = DB::table('closed_commissions')->where('op_month',$d->op_month)->where('op_year',$d->op_year)->take(1)->value('id');
        if (!$closing_id) return DV::error('You have not yet closed the commission summary for this sales agent');
        $d->payment_date = $d->payment_date ?? date('Y-m-d');
        $inputs['payment_date'] = convertDate($d->payment_date);
        $inputs['closing_id'] = $closing_id;
        $inputs['payee_id']= $id;
        $inputs['payee_type'] = 'sales_agent';

        $trx_id = saveData($ss,'commission_payments',['id'=>$trx_id],$inputs,[],1,false);
        if($trx_id){
          self::updateTotalCommissionPaid($d->op_month,$d->op_year,$closing_id);
        }
        return DV::depends($trx_id,[],'Failed to create commission paymetn transaction'); 
    }

    function deleteCommissionPayment($trx_id,$id =null,$ss=null){
      $id = $id ?? $this->id;
      $ss =$ss ?? $this->userInfo;
      $branch_id = $ss->branch_id;
      $row = DB::table('commission_payments')->where('id',$trx_id)->selectRaw('closing_id,MONTH(payment_date) AS `month`, YEAR(payment_date) AS `year`')->first();
      if(!$row) return DV::error('Transaction ID does not exist');

      $x = DB::table('commission_payments')->where('id',$trx_id)->delete();
      if($x){
         self::updateTotalCommissionPaid($row->month,$row->year,$row->closing_id);
      }
      return DV::depends(1);
    }

    static function updateTotalCommissionPaid($month,$year,$closing_id,$id=null){
        $month = $month ?? 0;
        $year = $year ?? 0;
        $closing_id = $closing_id ?? 0;
        $str_closing_id = ' WHERE closing_id ='.$closing_id;
        DB::statement(DB::raw('update closed_commissions set paid_amount = (SELECT (SUM(pmt.amount)) FROM commission_payments AS pmt '.$str_closing_id.') WHERE id ='.$closing_id));
        return DV::depends(1);
    }

    /** Get commission payments */
    function getCommissionPayments($arr, $id=null,$ss= null){
       $id = $id ?? $this->id;
       $ss = $ss ?? $this->userInfo;
       $d = (object)$arr;
       if(strtolower($ss->user_class) =='sales_agent') $id = $ss->official_id;
       $start_date = isset($d->start_date)? convertDate($d->start_date) : null;
       $end_date = isset($d->end_date)? convertDate($d->end_date):null;
       $str_dates = '1=1';
       $rows = DB::table('commission_payments AS p')->join('closed_commissions as c','c.id','=','p.closing_id')->where('p.payee_id',$id)->where('payee_type','sales_agent')->whereRaw($str_dates)->selectRaw('p.id,p.closing_id,formatTime(p.payment_date) AS payment_date,p.amount,c.amount_per_unit,p.payee_id AS sales_agent_id,p.payee_id,c.target_count, c.count_type,c.policy_id,p.payee_type,p.pmt_method,p.create_user,formatTime(p.create_date) AS create_date,p.remarks')->get();
       $total = 0;
       foreach($rows as $row){
          $total += $row->amount;
       }
       return (object)[
         'currency'=>'USD',
         'total'=>$total,
         'payments'=>$rows
       ];
    }

    /** Given sales_agent_id, return policy details indlucing policy ID , policy name, and detailed items or conditions */
    static function getCommissionPolicyDetails($id){
       $agent = DB::table('sales_agents AS a')->where('a.id',$id)->selectRaw('a.branch_id,a.id,a.agent_type_id,a.policy_id')->first();
       if(!$agent) return null;
       $cm = new \App\Models\SalesCommissionPolicy($agent->policy_id);
       $ss = (object)['branch_id'=>$agent->branch_id];
       $pol = self::getPolicyInfo($agent->policy_id,$ss);
       if(!$pol) return null;
       return (object)[
         'policy_name'=>$pol->name,
         'policy_id'=>$pol->id,
         'rule_class'=>$pol->rule_class,
         'items'=>$cm->getItems()
       ];
    }

    static function listAll($arr,$ss=null){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;

        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
         
        $status_code = isset($d->status_code)?Sanitizer::sanitize($d->status_code):null;
        $agent_type_id =isset( $d->agent_type_id)? Sanitizer::sanitize( $d->agent_type_id):null;
        
        $str_status = $status_code? 'status_code =\''.$status_code.'\'' : '1=1';
        $str_agent_type = $agent_type_id > 0 ? 'agent_type_id ='.$agent_type_id : '2=2';

        $rows = DB::table('sales_agents AS d')->join('sales_agent_types AS t','t.id','=','d.agent_type_id')->where('branch_id',$branch_id)->whereRaw($str_status)->whereRaw($str_agent_type)->selectRaw('d.id,d.name,d.code,d.policy_id,d.email,d.phone_number,d.address,d.status_code,t.name AS agent_type')->get(); 
   
        foreach($rows as $row){
          $row->image_url = '';
          //$row->mobile_login = \App\Models\UM::getAccountInfo($row->id,'official_id');
          if($row->photo_file_name) $row->image_url = PublicStorage::getUrl($branch_id,strtolower($ss->user_class),'image').$row->photo_file_name;
          unset($row->photo_file_name);
          $pol = self::getPolicyInfo($row->policy_id,$ss);
          $row->policy_name = $pol? $pol->name: 'NA';
          if(!$row->image_url) $row->image_url =self::defaultImage($branch_id);
        }
        return $rows;
    }

    static function details($id,$ss){ 
        $branch_id = $ss->branch_id;
        $row = DB::table('affiliates AS d')
        // ->join('sales_agent_types AS t','t.id','=','d.agent_type_id')
        ->where('d.id',$id)
        ->selectRaw('d.id,d.name,d.agent_type,d.code,d.email,d.phone_number,d.sex,d.address,d.status_code,formatDate(d.create_date) AS create_date')->take(1)->first(); 
        // if($row){
        //    $pol = self::getPolicyInfo($row->policy_id,$ss);
        //    $row->policy_name = $pol? $pol->name: 'NA';
        //    $url = $row->photo_file_name? PublicStorage::getUrl($branch_id,self::$photo_dir,'image').$row->photo_file_name: null;
        //    $url = validateUrl($url,self::defaultImage($branch_id));
        //    $row->photo = $url;
        //    $row->image_url = $url;
        // } 
        return $row;
    }

    function setStatus($status_code,$id=null,$ss = null){
        $ss = $ss?$ss:$this->userInfo;
        $id = $id? $id : $this->id;
        //$branch_id = $ss->branch_id;
        $x = DB::table('sales_agents')->where('id',$id)->update(['status_code'=>$status_code]);
        return DV::depends($x,null,'Failed to update Agent status');
    }

  //$arr = ['status_code'=>'Active|inactive']
  static function merchantList($arr=[], $id,$ss){
        if(!$id || $id ==-1) $id =-11;
        $arr['sales_agent_id'] = $id;
        $arr['search_value'] =null;
        $rows = DB::table('sender as s')->where('s.sales_agent_id',$id)->where('s.branch_id',$ss->branch_id)->selectRaw('COUNT(s.id) AS cnt, s.status_code')->groupBy('s.status_code')->get();
        $statusCounts =['active'=>0,'inactive'=>0];
        foreach($rows as $row){
          $statusCounts[$row->status_code] = $row->cnt;
        }
        return (object)[
          'status_counts'=>$statusCounts,
          'paginate_data'=>Sender::list($arr,$ss)
        ];
  }

  static function merchantList_all($arr=[], $id,$ss){
      if(!$id || $id ==-1) $id =-11;
      $arr['sales_agent_id'] = $id;
      $arr['search_value'] =null;
      return Sender::list_all($arr,$ss);
  }
 
  static function getAmountPerUnit($count,$policy_id){
     $strInterval = ($count?$count:-1).' BETWEEN i.lower_count AND i.upper_count';
     $row = DB::table('commission_policy_rule_b AS i')->where('policy_id',$policy_id)->whereRaw($strInterval)->selectRaw('i.lower_count,i.upper_count,i.amount_per_unit')->first();
     $amount_per_unit = $row?$row->amount_per_unit : 0;
     return (object)['error'=>null,'amount_per_unit'=>$amount_per_unit,'summary_type'=>'real-time','count'=>$count,'count_type'=>'item','policy_id'=>$policy_id];
  }

  static function getCommissionAmountPerUnit_realtime($year,$month,$id =null,$ss = null){
    $agent = DB::table('sales_agents as a')->where('id',$id)->selectRaw('id,name,policy_id,agent_type_id')->first();
    if(!$agent) return (object)['error'=>'Agent ID '.$id.' does not exist','summary_type'=>null,'amount_per_unit'=>0,'count'=>0];
    $policy = self::getPolicyInfo($agent->policy_id,$ss);
    if(!$policy) return (object)['error'=>'There is no commission policy set for agent ID '.$id.' does not exist','summary_type'=>null,'amount_per_unit'=>0,'policy_id'=>null,'count'=>0,'count_type'=>null];
    
    if (!in_array($policy->count_type,['item','merchant'])) return (object)['error'=>'Policy ID '.$policy->id.' does not have valid count_type','summary_type'=>null,'amount_per_unit'=>0,'policy_id'=>null,'summary_type'=>null,'count'=>0,'count_type'=>null];
    $count = -1;
    if($policy->count_type ==='item'){
       //Count packages
        $str_status ='(p.status_id =8 OR p.collectible =1)';
        $query = DB::table('package as p')->join('sender as s','s.id','=','p.sender_id')->join('package_sales_commissions AS cmm','cmm.package_id','=','p.id')->join('sales_agents AS a','a.id','=','s.sales_agent_id')->where('a.id',$id)->whereRaw($str_status)->whereRaw('MONTH(p.delivery_date) ='.$month)->whereRaw('YEAR(p.delivery_date) ='.$year);
        $count = $query->count('p.id');
        $count = $count ?? 0;
    }else {
      //Count merchants
      $str_months = 'MONTH(s.create_date) ='.$month.' AND YEAR(s.create_date) ='.$year;
      $str_status = 's.status_code =\'active\''; 
      $count = DB::table('sender as s')->join('sales_agents as a','a.id','=','s.sales_agent_id')->where('a.id',$id)->whereRaw($str_status)->whereRaw($str_months)->count('s.id');
    }
    //Here if $count == -1 then it means the process above does not count or query correctly => suspected error 500
    $strInterval = $count.' BETWEEN i.lower_count AND i.upper_count';
    $row = DB::table('commission_policy_rule_b AS i')->where('policy_id',$agent->policy_id)->whereRaw($strInterval)->selectRaw('i.lower_count,i.upper_count,i.amount_per_unit')->first();
    if ($row) return (object)['error'=>null,'amount_per_unit'=>$row->amount_per_unit,'summary_type'=>'real-time','count'=>$count,'count_type'=>$policy->count_type];
    else if ($count > 0){
      return (object)['error'=>'In policy '.$policy->name.', there is no matched count criteria for target count of '.$count. '','amount_per_unit'=>0,'summary_type'=>null,'count'=>$count,'count_type'=>null,'policy_id'=>null];
    }else{
      return (object)['error'=>null,'amount_per_unit'=>0,'summary_type'=>'real-time','count'=>$count,'count_type'=>$policy->count_type,'policy_id'=>$policy->id];
    }
}


 
  function getCommissionAmountPerUnit($year,$month,$id =null,$ss = null){
      $ss = $ss ?? $this->userInfo;
      $id = $id ?? $this->id;
      $agent = DB::table('sales_agents as a')->where('id',$id)->selectRaw('id,name,policy_id,agent_type_id')->first();
      if(!$agent) return (object)['error'=>'Agent ID '.$id.' does not exist','summary_type'=>null,'amount_per_unit'=>0];
      $closed_summary = DB::table('closed_commissions AS c')->where('op_month',$month)->where('op_year',$year)->selectRaw('id,sales_agent_id,policy_id,count_type,amount_per_unit')->first();
      if($closed_summary) return (object)['error'=>null,'summary_type'=>'closed','amount_per_unit'=>$closed_summary->amount_per_unit,'count_type'=>$closed_summary->count_type,'policy_id'=>$closed_summary->policy_id];
      $policy = self::getPolicyInfo($agent->policy_id,$ss);
      if(!$policy) return (object)['error'=>'There is no commission policy set for agent ID '.$id.' does not exist','summary_type'=>null,'amount_per_unit'=>0,'policy_id'=>null,'count_type'=>null];
      
      if (!in_array($policy->count_type,['item','merchant'])) return (object)['error'=>'Policy ID '.$policy->id.' does not have valid count_type','summary_type'=>null,'amount_per_unit'=>0,'policy_id'=>null,'summary_type'=>null,'count_type'=>null];
      $count = -1;
      if($policy->count_type ==='item'){
          $str_status ='(p.status_id =8 OR p.collectible =1)';
          $query = DB::table('package as p')->join('sender as s','s.id','=','p.sender_id')->join('package_sales_commissions AS cmm','cmm.package_id','=','p.id')->join('sales_agents AS a','a.id','=','s.sales_agent_id')->where('a.id',$id)->whereRaw($str_status)->whereRaw('MONTH(p.delivery_date) ='.$month)->whereRaw('YEAR(p.delivery_date) ='.$year);
          $count = $query->count('p.id');
          $count = $count ?? 0;
      }else {
        $str_months = 'MONTH(s.create_date) ='.$month.' AND YEAR(s.create_date) ='.$year;
        $str_status = 's.status_code =\'active\''; 
        $count = DB::table('sender as s')->join('sales_agents as a','a.id','=','s.sales_agent_id')->where('a.id',$id)->whereRaw($str_status)->whereRaw($str_months)->count('s.id');
        $count = $count  ?? 0;
      } 
      //Here if $count == -1 then it means the process above does not count or query correctly => suspected error 500

      $strInterval = $count.' BETWEEN i.lower_count AND i.upper_count';
      $row = DB::table('commission_policy_rule_b AS i')->where('policy_id',$agent->policy_id)->whereRaw($strInterval)->selectRaw('i.lower_count,i.upper_count,i.amount_per_unit')->first();
      if ($row) return (object)['error'=>null,'amount_per_unit'=>$row->amount_per_unit,'summary_type'=>'real-time','count_type'=>$policy->count_type];
      else return (object)['error'=>'No matched count criteria for '.$count. '','amount_per_unit'=>0,'summary_type'=>'real-time','count_type'=>$policy->count_type,'policy_id'=>$policy->id];
  }
 
  static function getCommissionAmountPerPackage($agent_id,$package_count =0,$policy_id=null,$month =0, $year=0){
     if(!$month || !$year || !$package_count) return 0;
     $str_month= 'MONTH(p.delivery_time) = '.$month.' AND YEAR(p.delivery_time) ='.$year;
     $row = DB::table('package_sales_commissions AS c')->join('package as p','p.id','=','c.package_id')->where('c.sales_agent_id',$agent_id)->whereRaw($str_month)->where('c.comm_pmt_status_id',1)->selectRaw('c.comm_amount')->first();
     if($row){
       return $row->amount_per_unit ?? 0;
     }else{
       if(!$policy_id) return 0;
       $str_interval ='('.$package_count.' BETWEEN i.lower_count AND i.upper_count)';
       $row = DB::table('commission_policy_rule_b AS i')->where('i.policy_id',$policy_id)->whereRaw($str_interval)->selectRaw('i.amount_per_unit')->first();
       if(!$row) return 0; /** No matched policy item */
       return $row->amount_per_unit;
     }
  }
 
  static function getCommissionAmountPerMerchant($merchant_count,$policy_id =null){
     if(!$policy_id || !$merchant_count) return 0;
     $str_interval = '('.$merchant_count.' BETWEEN i.lower_count AND i.upper_count)';
     $row = DB::table('commission_policy_rule_b as i')->where('policy_id',$policy_id)->whereRaw($str_interval )->selectRaw('i.amount_per_unit')->first(); 
     return $row? $row->amount_per_unit : 0;    
  }
 
 static function getPaidAmount($id, $month,$year){
   $month = $month?$month : 0;
   $year = $year? $year : 0;
   $str_month = '(c.op_month = '.$month.' AND c.op_year = '.$year.')';
   $rows = DB::table('closed_commissions as c')->where('c.sales_agent_id',$id)->whereRaw($str_month)->selectRaw('c.paid_amount')->get();
   foreach($rows as $row) return $row->paid_amount?$row->paid_amount:0;
   return 0;
 }
 
 /** revertCommissionSummary() reopen commissions */
 static function reopenCommissionSummary($closing_id,$month,$year,$id,$ss){
   //$branch_id = $ss->branch_id;
   $row = DB::table('closed_commissions AS c')->where('c.sales_agent_id',$id)->where('op_month',$month)->where('op_year',$year)->selectRaw('c.id,c.paid_amount')->first();
   if(!$row) return DV::error('The Commission Summary has not been closed yet');
   if($row->paid_amount > 0) return DV::error('There is some payment already');
   $x = DB::table('closed_commissions')->where('sales_agent_id',$id)->where('op_month',$month)->where('op_year',$year)->delete();
   return DV::depends($x,null,'Failed to revert the Commission Summary');
 }

 //This funciton getClosedCommissionSummary() is used in rare case of Editing or getting just one (Closed) summary details 
 static function getClosedCommissionSummary($year, $month,$id,$ss){
    $cols = 'c.id AS closing_id,c.sales_agent_id,c.op_month,c.op_year,c.policy_id,c.count_type,c.amount_per_unit,c.total_amount,c.target_count, c.paid_amount,c.policy_name,c.agent_type_id,t.name AS agent_type,c.currency_code,formatDate(c.create_date) AS create_date,c.create_user,\'Closed\' AS summary_type,c.remarks,\'\' AS issue,calculate_method'; 
    $closed_summary = DB::table('closed_commissions as c')->join('sales_agent_types as t','t.id','=','c.agent_type_id')->where('c.sales_agent_id',$id)->where('op_month',$month)->where('op_year',$year)->selectRaw($cols)->first();
    if($closed_summary){
      $closed_summary->count = $closed_summary->target_count;
      return $closed_summary;
    }
    return null;
 }
 
 /**
  * getCommissionSummaries() will query the closed_commissions first, and loop through the closed commissions comparing to the filtered months. If any month that does not have any closed commission, it will getLiveCommissionSummary() instead. For this complex process, we need to ensure that the specific Sales Agent ID is supplied
  * Use the $ending_month to provide either the closed_summary or Live-summary
 */
 function getCommissionSummaries($arr,$id = null,$ss=null){
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;
    $branch_id = $ss->branch_id;
    $d = (object)$arr;
    $month_range = isset($d->month_range)?$d->month_range:null;
    if(!$month_range) return DV::error('month_range is required. For example: Feb 2023 to Mar 2024');
    $where_months = getSQLParts_months($month_range,'c.op_month','c.op_year');
    if($where_months->error) return DV::error($where_months->error);

    $str_agent = '1=1';
    if($id > 0) $str_agent ='c.sales_agent_id = '.$id;

    $cols =['c.id AS closing_id','t.name AS agent_type','a.name AS agent_name','c.merchant_count','c.marker_qty','c.sales_agent_id','c.op_month','c.op_year','c.target_count','c.effective_count','c.amount_per_unit','c.bonus_amount','c.total_amount','c.paid_amount','c.currency_code','c.policy_id','c.policy_name','c.rule_class','t.id AS agent_type_id','c.remarks','\'Closed\'summary_type','c.calculate_method','c.create_user','formatDate(c.create_date) AS create_date'];
    $str_cols = implode(',',$cols);
    $rows = DB::table('closed_commissions AS c')->join('sales_agents AS a','a.id','=','c.sales_agent_id')->join('sales_agent_types as t','t.id','=','a.agent_type_id')->where('a.branch_id',$branch_id)->whereRaw($str_agent)->whereRaw($where_months->sql)->selectRaw($str_cols)->get();
    $last_op_months = [];
    $last_op_year = 0 ;
    $last_op_month = 0;
    
    $found_closed_rows =[];
    foreach($rows as $row){
      $found_closed_rows[$row->op_month.'_'.$row->op_year] =1;
       if($row->op_year > $last_op_year){
         $last_op_year = $row->op_year;
         if ($row->op_month > $last_op_month){
           $last_op_month = $row->op_month;
           $last_op_months[$last_op_year]['last_month'] = $row->op_month;
         }   
       } 
    }

    $issue = '';
    if($id > 0){
        foreach($where_months->months as $year => $months){
            foreach($months as $mon_num){
              $key = $mon_num.'_'.$year;
              if(!isset($found_closed_rows[$key])){
                $d = self::getLiveCommissionSummary(['month'=>$mon_num,'year'=>$year],$id,$ss);
                $issue = $d->error; 
                if($d->data) $rows = $rows->add($d->data);
              }  
            }
          
        }
    }
  

    // if (!$last_op_months || $last_op_months ===0){
    //     return (object)[
    //       'list'=>$rows,
    //       'issue'=>$issue
    //   ];
    // }
    
    // if(!isset($last_op_months[$last_op_year])) $last_op_months[$last_op_year] =[];
    // $bx = isset($last_op_months[$last_op_year])?$last_op_months[$last_op_year]:[];
    // $last_op_month = isset($bx['last_month'])?$bx['last_month']:null;

    // $live_comm = null;
    // //$where_months->last_month_info->year is the filter_info
    // if ($where_months->last_month_info->year >= $last_op_year){
    //     if($last_op_month < $where_months->last_month_info->month){
    //         //Add the Live Summary in the last filter month: this case => the last filtering month does not have a closed summary yet
    //         if (!$id){
    //           $issue = 'There are no closed commissions in '.getMonthName($where_months->last_month_info->month,true);
    //         }else{
    //           $d = self::getLiveCommissionSummary(['month'=>$where_months->last_month_info->month,'year'=>$where_months->last_month_info->year],$id,$ss);
    //           $issue = $d->error;
    //           $live_comm = $d->data;
    //         }
    //     }
    // }

    //if($live_comm) $rows = $rows->add($live_comm);
    $rows = self::sortRowsByYearMonth($rows,'ASC');
    return (object)[
       'list'=>$rows,
       'issue'=>$issue
    ];
 }

 /** sortRowsByYearMonth() is used to sort commission summaries by op_year and op_month. 
  ** The reason is that suppose user filter commisions from "Oct 2023 to Mar 2024" then in some months the commisions have not been closed, so we will pick and calcuate real-time count and commission amount from "package" table directly */
 static function sortRowsByYearMonth($rows, $order = 'ASC') {
  // Extract op_year and op_month values and create a temporary array
  $tempArray = [];
  foreach ($rows as $row) {
      $tempArray[] = [
          'op_year' => $row->op_year,
          'op_month' => $row->op_month,
          'data' => $row, // Keep a reference to the original data
      ];
  }

  // Sort the temporary array based on op_year and op_month
  usort($tempArray, function ($a, $b) use ($order) {
      if ($a['op_year'] == $b['op_year']) {
          return $order === 'ASC' ? $a['op_month'] <=> $b['op_month'] : $b['op_month'] <=> $a['op_month'];
      }
      return $order === 'ASC' ? $a['op_year'] <=> $b['op_year'] : $b['op_year'] <=> $a['op_year'];
  });

  // Extract sorted data from the temporary array
  $sortedRows = [];
  foreach ($tempArray as $item) {
      $sortedRows[] = $item['data'];
  }

  return collect($sortedRows);
}
  
 static function calculateRuleA($month,$year,$agent_id,$ss){
  $countInfo = self::countTarget($year,$month,$agent_id,$ss);
  $effective_count = $countInfo->count - self::$ft_item_count_threhold;
  $effective_count =  $effective_count >=0?  $effective_count: 0;
  $add_amt = $effective_count * self::$ft_amount_per_unit;
  $bonus =  $countInfo->count >= self::$ft_item_count_threhold ? self::$ft_bonus_amount:0;
  $total = $add_amt + $bonus;
  $cal_method =  'Bonus: $'.$bonus.' + overtarget: '.$effective_count.' x $'.self::$ft_amount_per_unit.' = '.'$'.$total;
  return (object)[
   'policy_id'=>$countInfo->policy_id,
   'merchant_count'=>$countInfo->merchant_count,
   'count_type'=>$countInfo->count_type,
   'amount_per_unit'=>self::$ft_amount_per_unit, 
   'effective_count'=>$effective_count,
   'target_count'=>$countInfo->count,
   'additional_amount'=>$add_amt,
   'bonus_amount'=>$bonus,
   'total_amount'=>$total,
   'currency_code'=>'USD',
   'calculate_method'=>$cal_method 
  ];
 }

 static function calculateRuleB($month,$year,$agent_id,$policy_id,$ss){
  $countInfo = self::countTarget($year,$month,$agent_id,$ss);
  $effective_count = $countInfo->count;
  $info = self::getAmountPerUnit($countInfo->count,$policy_id);
  $total = $effective_count * $info->amount_per_unit;
  $cal_method = $effective_count.' pcs x $'.$info->amount_per_unit.'= $'.$total;
  return (object)[
     'policy_id'=>$policy_id,
     'merchant_count'=>$countInfo->merchant_count,
     'count_type'=> $countInfo->count_type,
     'effective_count'=>$countInfo->count,
     'target_count'=>$countInfo->count,
     'amount_per_unit'=>$info->amount_per_unit,
     'additional_amount'=>0,
     'bonus_amount'=>0,
     'total_amount'=>$total,
     'currency_code'=>'USD',
     'calculate_method'=>$cal_method
  ];
 }

 /**
  * getLiveCommissionSummary() returns Live commission summary as single row object for One Sales Agent in One month only
  * @arr = ['month','year']
  * @id is required
 */
 static function getLiveCommissionSummary($arr,$id,$ss){
    $d = (object)$arr;
    $branch_id = $ss->branch_id;

    $month = isset($d->month)? $d->month:date('m');
    $year = isset($d->year)? $d->year:date('Y');

    $pol = DB::table('sales_agents as a')->join('commission_policies AS p','p.id','=','a.policy_id')->join('sales_agent_types as t','t.id','=','a.agent_type_id')->where('a.id',$id)->selectRaw('\'\' AS closing_id,a.name AS agent_name, a.code AS agent_code,p.id AS policy_id,p.name AS policy_name,a.agent_type_id,t.id as agent_type_id,t.name AS agent_type,p.count_type,p.rule_class')->first(); 
    if(!$pol){
      return (object)[
        'error'=>'No commission policy assigned to the sales agent',
        'data'=>null
      ];
      //return (object)['id'=>null,'agent_type'=>'','sales_agent_id'=>'','op_month'=>'','op_year'=>'','target_count'=>'','effective_count'=>'','amount_per_unit'=>'' ,'bonus_amount'=>'','total_amount'=>'','paid_amount'=>0,'currency_code'=>'','rule_class'=>'A','policy_id'=>'','policy_name'=>'','agent_type_id'=>'','remarks'=>'Real-time','summary_type'=>'real-time','calculate_method'=>''];  
    }
    $rule = $pol->rule_class;
    $currency_code = 'USD';

    if($rule =='A'){
       //Full-time staff: if he gets 3000 packages in this month, he get $100 bonus.  (Any extra package count) * 0.05
       $x = self::calculateRuleA($month,$year,$id,$ss);
       $data = (object)['closing_id'=>'','agent_name'=>$pol->agent_name,'agent_type'=>$pol->agent_type,'sales_agent_id'=>$id,'op_month'=>$month,'op_year'=>$year,'merchant_count'=>$x->merchant_count,'marker_qty'=>self::$ft_item_count_threhold,'target_count'=>$x->target_count,'effective_count'=>$x->effective_count,'merchant_count'=>$x->merchant_count,'amount_per_unit'=>self::$ft_amount_per_unit,'bonus_amount'=>$x->bonus_amount,'total_amount'=>$x->total_amount,'paid_amount'=>0,'currency_code'=>$x->currency_code,'rule_class'=>'A','policy_id'=>$pol->policy_id,'policy_name'=>$pol->policy_name,'agent_type_id'=>$pol->agent_type_id,'remarks'=>'Real-time','summary_type'=>'real-time','calculate_method'=>$x->calculate_method];
       return (object)[
         'error'=>null,
         'data'=>$data
       ];  
    }else if($rule =='B'){
        //Freelancer sales agent:(package count) * rate. rate depends on intervals defined in table "commission_policy_rule_b"
        $x = self::calculateRuleB($month,$year,$id,$pol->policy_id,$ss);
        $data= (object)['closing_id'=>'','agent_type'=>$pol->agent_type,'agent_name'=>$pol->agent_name,'sales_agent_id'=>$id,'op_month'=>$month,'op_year'=>$year,'merchant_count'=>$x->merchant_count,'marker_qty'=>self::$ft_item_count_threhold, 'target_count'=>$x->target_count,'effective_count'=>$x->effective_count,'merchant_count'=>$x->merchant_count, 'amount_per_unit'=>$x->amount_per_unit,'bonus_amount'=>0,'total_amount'=>$x->total_amount,'paid_amount'=>0,'currency_code'=>$x->currency_code,'policy_id'=>$pol->policy_id,'policy_name'=>$pol->policy_name,'rule_class'=>'B','agent_type_id'=>$pol->agent_type_id,'remarks'=>'Real-time','summary_type'=>'real-time','calculate_method'=>$x->calculate_method];  
        return (object)[
           'error'=>null,
           'data'=>$data
        ];
     }
    return null;
  }

  /**
   * @arr = ['month_range'=>'Nov 2023 to Mar 2024']
   * @id is optional, but has to set to null if no target Agent ID
  */
 static function getClosedCommissionSummaries($arr,$id,$ss){
  $d = (object)$arr;
  $branch_id = $ss->branch_id;

  $month_range = isset($d->month_range)? $d->month_range:null;
  if(!$month_range) return DV::error('Please select months');
  $where_months = getSQLParts_months($month_range,'c.op_month','c.op_year');
  if($where_months->error) return DV::error($where_months->error);

  $agent_id = isset($d->sales_agent_id)?$d->sales_agent_id:null;

        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;
 
      $str_month ='1=1';
      $str_agent = '2=2';
      if($agent_id > 0) $str_agent ='c.sales_agent_id ='.$agent_id;

      $cols =['c.id','t.name AS agent_type','c.sales_agent_id','c.op_month','c.op_year','c.target_count','c.effective_count','c.amount_per_unit','c.bonus_amount','c.total_amount','c.paid_amount','c.currency_code','c.policy_id','c.policy_name','c.rule_class','t.id AS agent_type_id','c.remarks','\'Closed\'summary_type','c.calculate_method','c.create_user','formatDate(c.create_date) AS create_date'];
      $str_cols = implode(',',$cols);

      $query = DB::table('closed_commissions as c')->join('commission_policies as p','p.id','=','c.policy_id')->join('sales_agent_types as t','t.id','=','c.agent_type_id')->where('c.branch_id',$branch_id)->whereRaw($str_agent)->whereRaw($where_months->sql)->selectRaw($str_cols);
      $count_query = clone $query;
      $count = $count_query->count('c.id');
      $rows = $query->skip($skip_rows)->take($per_page)->get();
      return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
}

 /** countTarget() is similar to getTargetCountInfo_realtime() , but it is less complicated and works faster */
 static function countTarget($year, $month,$id,$ss){
    $agent = DB::table('sales_agents as a')->where('id',$id)->selectRaw('id,name,policy_id,agent_type_id')->first();
    if(!$agent) return (object)['count'=>0,'count_type'=>null,'summary_type'=>null];
    $policy = self::getPolicyInfo($agent->policy_id,$ss);
    if(!$policy) return (object)['count'=>0,'count_type'=>null,'summary_type'=>null];
    $countInfo= null;
    if(strtolower($policy->count_type) ==='item'){
        $countInfo = self::countPackages($id,$month,$year,$ss);
    }else {
        $countInfo = self::countReferredMerchants(  $id,$month,$year,$ss);
    }
    return (object)['policy_id'=>$agent->policy_id,'count'=>$countInfo->count,'merchant_count'=> $countInfo->merchant_count, 'count_type'=>$countInfo->count_type,'summary_type'=>$countInfo->summary_type];
 }

//  static function getTargetCountInfo_realtime($year, $month,$id,$ss){
//     $agent = DB::table('sales_agents as a')->join('sales_agent_types as t','t.id','=','a.agent_type_id')->join('commission_policies as p','p.id','=','a.policy_id')->selectRaw('a.id,a.policy_id,p.name as policy_name,p.rule_class,p.count_type,t.id as agent_type_id, t.name as agent_type')->first();
//     if(!$agent) return null;
//     $count = 0 ;
//     $rule = strtoupper($agent->rule_class);
//     if ($rule =='A'){
//        $x = self::calculateRuleA($month,$year,$id,$ss);

//     }else if ($rule =='B'){
//        $x = self::calculateRuleB($month,$year,$id,$agent->policy_id,$ss);

//     }else return null; //invalid rule class

//     //c.id,c.policy_id,c.count_type,c.amount_per_unit,c.total_amount,c.target_count, c.paid_amount,p.name AS policy_name,c.agent_type_id,t.name AS agent_type,c.currency_code,formatDate(c.create_date) AS create_date,c.create_user,c.remarks
//     $d = self::getCommissionAmountPerUnit_realtime($year,$month,$id,$ss);
    
//     //if($d->error) return DV::error($d->error);
//     $count = $d->count;
//     $total_amount = $count * $d->amount_per_unit;
//     return (object)[
//         'id'=>null,
//         'policy_id'=>$agent->policy_id,
//         'target_count'=>$count,
//         'count_type'=>$agent->count_type,
//         'amount_per_unit'=>$d->amount_per_unit,
//         'total_amount'=>$total_amount,
//         'paid_amount'=>0,
//         'policy_name'=>$agent->policy_name,
//         'agent_type_id'=>$agent->agent_type_id,
//         'agent_type'=>$agent->agent_type,
//         'currency_code'=>'USD',
//         'remarks'=>'',
//         'create_date'=>date('d M Y'),
//         'create_user'=>$ss->full_name,
//         'summary_type'=>'real-time',
//         'issue'=>$d->error
//     ];
//  }

 static function countPackages($id, $month, $year,$ss=null){
     $cache_key = 'cmm_itemcount_'.$id.'_'.$month.'_'.$year;
     $countInfo = Cache::get($cache_key);
     if($countInfo  !== null) return $countInfo;
     $str_branch = $ss? 's.branch_id = '.$ss->branch_id: '2=2';
     $row = DB::table('closed_commissions as c')->where('c.sales_agent_id',$id)->where('c.op_month',$month)->where('c.op_year',$year)->selectRaw('c.target_count,c.merchant_count,c.marker_qty,c.count_type')->first();
     if($row){
       $countInfo = (object)['count'=>$row->target_count,'merchant_count'=>$row->merchant_count,'marker_qty'=>$row->marker_qty,'count_type'=>$row->count_type,'summary_type'=>'closed'];
       Cache::put($cache_key, $countInfo , 2);
       return $countInfo;
     }

     $str_status ='(p.status_id =8)';
     $query = DB::table('package as p')->join('sender as s','s.id','=','p.sender_id')->join('sales_agents AS a','a.id','=','s.sales_agent_id')->whereRaw($str_branch)->where('a.id',$id)->whereRaw($str_status)->whereRaw('MONTH(p.delivery_time) ='.$month)->whereRaw('YEAR(p.delivery_time) ='.$year);
     $merchant_count = 0 ; //$query->distinct()->count('s.id');
     $count = 0 ; // $query->count('p.id');
     $rows =  $query->selectRaw('COUNT(p.id) AS package_count,s.id, s.code,s.name,s.business_type,s.phone_number')->groupByRaw('s.id, s.code,s.name,s.business_type,s.phone_number')->get();
     foreach($rows as $row){
       $count += $row->package_count; 
       $merchant_count++;
     }
     $countInfo = (object)['count'=>$count,'count_type'=>'item','merchant_count'=>$merchant_count,'marker_qty'=>self::$ft_item_count_threhold,'summary_type'=>'real-time'];
     Cache::put($cache_key,  $countInfo, 2);
     return $countInfo;
 }

 static function countReferredMerchants($id, $month, $year,$ss =null){
    $cache_key = 'referred_merchantcount_'.$id.'_'.$month.'_'.$year;
    $countInfo = Cache::get($cache_key);
    if($countInfo !==null) return $countInfo;
    $row = DB::table('closed_commissions as c')->where('sales_agent_id',$id)->where('op_month',$month)->where('op_year',$year)->selectRaw('c.target_count,c.count_type')->first();
    if($row){
      $countInfo = (object)['count'=>$row->target_count,'count_type'=>$row->count_type,'summary_type'=>'closed'];
      Cache::put($cache_key, $row->target_count, 2);
      return  $countInfo;
    }
    $str_months = 'MONTH(s.create_date) ='.$month.' AND YEAR(s.create_date) ='.$year;
    $str_status = 's.status_code =\'active\''; 
    $count = DB::table('sender as s')->join('sales_agents as a','a.id','=','s.sales_agent_id')->where('a.id',$id)->whereRaw($str_status)->whereRaw($str_months)->count('s.id');
    $countInfo = (object)['count'=>$count,'merchant_count'=>$count,'count_type'=>'merchant','summary_type'=>'real-time'];
    Cache::put($cache_key, $countInfo, 2);
    return $countInfo;
  }

  static function countReferredMerchants_realtime($month, $year,$id,$ss){
    $cache_key = 'referred_merchantcount_'.$id.'_'.$month.'_'.$year;
    $count = Cache::get($cache_key); 
    $str_months = 'MONTH(s.create_date) ='.$month.' AND YEAR(s.create_date) ='.$year;
    $str_status = 's.status_code =\'active\''; 
    $count = DB::table('sender as s')->join('sales_agents as a','a.id','=','s.sales_agent_id')->where('a.id',$id)->whereRaw($str_status)->whereRaw($str_months)->count('s.id');
    Cache::put($cache_key, $count, 5);
    return $count;
  }

  /** Sales commission for Full-time staff. Count merchants. NOTE that $arr = ['month','year']. 
    * The default month and year are extracted from current system date 
    ** used to be getCommissionsByMerchantCountByMonth()
  **/
  function getCommissionSummary_mobile($arr=[],$id=null,$ss=null){
     $id = $id ?? $this->id;
     $ss = $ss ?? $this->userInfo;
     $d = (object)$arr;
     $month_range = isset($d->month_range)?$d->month_range:'';
     $data =  $this->getCommissionSummaries($arr,$id,$ss); 
     $rows = $data->list;
     $merchant_count = 0 ;
     $package_count = 0 ;
     $bal = 0;
     foreach($rows as $row){
        $row->month =  getMonthName($row->op_month,false).' '.$row->op_year;
        $row->additional = number_format($row->effective_count * $row->amount_per_unit,2);
        $row->bonus_amount = number_format($row->bonus_amount,2);
        $row->total_amount = number_format($row->total_amount,2);
        $merchant_count += $row->merchant_count;
        $package_count += $row->target_count;
        $bal += $row->total_amount;
     }
     $data->summary = (object)[
      'month_range' =>$month_range,
      'package_count' => $package_count,
      'merchant_count'=>$merchant_count,
      'balance'=>$bal ?? 111,
      'currency_code'=>'KHR',
       'month_range' => $month_range
     ];
   
     return $data;
      //  return (object)[
      //    'agent_type_id'=>$agent->agent_type_id,
      //    'agent_type'=>$agent->agent_type,
      //    'current_policy_id'=>$current_policy->id,
      //    'current_policy_name'=>$current_policy->name,
      //    //'unit_amount'=>$current_per_unit,
      //    'target_count'=>$grand_target_count,
      //    'target_counts'=>$grand_target_counts,
      //    'paid_amount'=>$grand_total_paid,
      //    'total_amount'=>$grand_total,
      //    'currency_code'=>'USD',
      //    'issues'=>$issues,
      //    'list'=>$rows
      //  ];
  }

  static function getPayments($arr,$ss){
      $d = (object)$arr;
      $agent_id = isset($d->agent_id)?$d->agent_id:null;
      $agent_id = $agent_id ?? (isset($d->sales_agent_id)? $d->sales_agent_id:null);
      $start_date = isset($d->start_date)? convertDate($d->start_date): date('Y-m-d');
      $end_date = isset($d->end_date)? convertDate($d->end_date):date('Y-m-d');
      $str_dates = ($start_date && $end_date)? 'DATE(p.payment_date) >=\''.$start_date.'\' AND date(p.payment_date) <\''.$end_date.'\'':'1=1';
      $str_agent = $agent_id > 0 ? 'p.payee_id ='.$agent_id :'2=2'; 
      $rows = DB::table('commission_payments as p')->join('closed_commissions as c','c.id','=','p.closing_id')->join('sales_agent_types as t','t.id','=','c.agent_type_id')->join('sales_agents as a','a.id','=','p.payee_id')->where('p.branch_id',$ss->branch_id)->whereRaw($str_agent)->whereRaw($str_dates)->selectRaw('p.id,p.id AS trx_id,a.name AS payee_id,IFNULL(p.payee_name,a.name) AS payee_name,p.amount,formatTime(p.payment_date) AS payment_date, t.`name` AS sales_agent_type, c.paid_amount, c.total_amount, c.currency_code, c.agent_type_id, c.target_count, c.policy_id, c.rule_class, p.create_user, p.remarks,p.closing_id,p.pmt_method')->get();
      $total = 0;
      foreach($rows as $row){
         $total += $row->amount;
      }
      $summary = (object)[
         'total_amount'=>$total,
         'currency_code'=>'USD'
      ];
      return (object)[
         'summary'=>$summary,
         'list'=>$rows
      ];
  }
 
  static function getPaymentsByClosingId($closing_id,$agent_id, $ss){
      $str_agent = $agent_id > 0 ? 'a.id ='.$agent_id : '1=1';
      $rows = DB::table('commission_payments as p')->join('closed_commissions AS c','c.id','=','p.closing_id')->join('sales_agents as a','a.id','=','p.payee_id')->join('sales_agent_types as t','t.id','=','a.agent_type_id')->where('p.closing_id',$closing_id)->whereRaw($str_agent)->selectRaw('p.id,p.id AS trx_id,p.payee_id, a.`name` AS payee_name,c.op_month,c.op_year, t.`name` AS sales_agent_type, c.merchant_count,c.target_count, p.amount,formatTime(p.payment_date) AS payment_date, p.create_user, p.remarks,p.closing_id,p.pmt_method')->get();
      return $rows;
  }

  function getCommissionsByPackageCountByMonth($arr=[],$id=null,$ss=null){
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;
     $d = (object)$arr;
     if(!isset($d->month))  $d->month = date('m');
     if(!isset($d->year))  $d->year = date('Y');
      
     // $x = getMonthYearObject($d->start_date,$d->end_date);
     //$months = implode(',',$x->months);
     //$years = implode(',',$x->years);
     $str_months = 'MONTH(p.delivery_time) ='.$d->month.' AND YEAR(p.delivery_time) ='.$d->year;
     $rows = DB::table('sender as s')->join('package as p','s.id','=','p.sender_id')->join('package_sales_commissions as c','c.package_id','=','p.id')->where('c.sales_agent_id',$id)->whereRaw($str_months)->selectRaw('COUNT(p.id) AS package_count, SUM(CASE c.comm_pmt_status_id =1 WHEN 1 THEN c.comm_amount ELSE 0 END) AS verified_amount,SUM(CASE c.comm_pmt_status_id =2 WHEN 1 THEN c.comm_amount ELSE 0 END) AS paid_amount, SUM(c.comm_amount) AS total, MONTH(p.delivery_time) AS op_month, s.id,s.name,s.code,s.phone_number')->groupByRaw('op_month, s.id,s.name,s.code,s.phone_number')->get();
     
     $has_verified_commission = false;
     $error_pol_no_details = false;
     $error_pol_not_exist = false;
     $pol = DB::table('sales_agents as a')->join('commission_policies as c','c.id','=','a.policy_id')->where('a.id',$id)->selectRaw('c.id,c.name,a.name as agent_name')->first();
     if(!$pol) $error_pol_not_exist = true ; // return DV::error('Agent ? does not have commission policy::'.$id); 
     if($pol){
      $item = DB::table('commission_policy_rule_b as i')->where('i.policy_id',$pol->id)->selectRaw('i.id')->take(1)->first();
      if(!$item) $error_pol_no_details = true; //return DV::error('Commission policy ? assigned to ? does not have details::'.$pol->name.';'.$pol->agent_name);
     }
     $total_package_count = 0;
     foreach($rows as $row) $total_package_count += $row->package_count; 
     $merchant_cnt = 0;
     $total_paid = 0;
     $total_amount = 0;
     $comm_per_unit =0;
     foreach($rows as $row){
        $comm_per_unit = self::getCommissionAmountPerPackage($id,$total_package_count,($pol?$pol->id:null), $d->month,$d->year);
        $row->month_name = getMonthName($row->op_month);
        $row->amount_per_unit = $comm_per_unit;
        $has_verified_commission = $row->verified_amount > 0;
        if (!$row->paid_amount <=0){
          $row->total = $row->amount_per_unit * $row->package_count;
        }else {
          $total_paid += $row->paid_amount;
          $has_verified_commission = true;
        }
       
        $total_amount += $row->total;
        $row->currency_code ='USD';
        $merchant_cnt++;
     }
     
     /** Issues occur when the commission has not yet paid to Agent, And the commission policy not yet assigned to agent OR commission policy is not yet defined */
     $issues = [];
     if (!$has_verified_commission){
        if ($error_pol_not_exist) $issues[] = 'No assigned commission policy';
        if($error_pol_no_details) $issues[] = 'No policy details'; 
     } 
     return (object)[
       'agent_type_id'=>2,
       'policy_id'=>$pol->id,
       'count_type'=>'item',
       'target_count'=>$total_package_count,
       'amount_per_unit'=>$comm_per_unit,
       'merchant_count'=>$merchant_cnt,
       'package_count'=>$total_package_count,
       'paid_amount'=>$total_paid,
       'total_amount'=>$total_amount,
       'currency_code'=>'USD',
       'issues'=>$issues,
       'list'=>$rows
     ];
  }
}