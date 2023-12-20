<?php

namespace App\Models;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
 
use DB;
use Sanitizer;
use App\Models\DV;
use Illuminate\Pagination\LengthAwarePaginator; 
use App\Models\PublicStorage;
use Carbon\Carbon;
use Config;
class SalesAgent //extends Model
{
    protected $id = null, $userInfo = null;
    protected static $photo_dir = 'sales-agent';
    public function __construct($id=null,$userInfo =null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo; 
    }

    function delete($id=null,$ss =null){
       $id = $id? $id: $this->id;
       $x = DB::table('sales_agents')->where('id',$id)->delete();
       DB::table('sender')->where('sales_agent_id',$id)->update(['sales_agent_id'=>null]);
       return DV::depends($x,'Failed to delete sales agent'); 
    }

    function save($arr, $id = null, $ss = null){
      $ss = $ss ?? $this->userInfo;
      $id = $id ?? $this->id;
      $v_rule = [
         'name'=>'1|string|1-150',
         'sex'=>'1|choice|M,F,O',
         'agent_type'=>'1|choice|Part Time, Full Time, Any',
         'phone_number'=>'1|phone',
         'email'=>'0|email',
         'address'=>'0|address',
         'start_date'=>'0|date',
         'photo'=>'0|image',
         'commission'=>'0|number',
         'status_code' => '0|choice|Active,Inactive|default=Active'
      ];

      $branch_id = $ss->branch_id;
      $res = validateObject($arr,$v_rule,true,['email'=>['@','-','.','_']],$ss->lang,false,null);
      if($res->error) return DV::error($res->error);
      $inputs = $res->values;
      $photo = $inputs['photo'];
      unset($inputs['photo']);
      $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));

      $id = saveData($ss,'sales_agents',['id'=>$id],$inputs,[],1,false);
      if($id > 0){
        if($delete_prev_image){
            $file_name = DB::table('sales_agents as a')->where('id',$id)->take(1)->value('photo_file_name');
            if($file_name) PublicStorage::delete($branch_id,self::$photo_dir,'image',$file_name);
            DB::table('sales_agents as a')->where('id',$id)->update(['photo_file_name'=>null]);
        }
        $new_code = self::setAgentCode($ss,5);
        DB::table('sales_agents')->where('id',$id)->update(['code'=>$new_code]);
        PublicStorage::saveImage($branch_id,self::$photo_dir,null,$photo,null,['id'=>$id,'sales_agent.photo_file_name']); 
      }

      return DV::depends($id,['id'=>$id,'code'=>$new_code],'Failed to save sales agent');
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
            return $prefix.$branch_id.formatNumber($num,$len);
        }
        DB::table('agent_code_control')->insert(['branch_id'=>$branch_id,'last_id'=>1,'prefix'=>$prefix]);
        return $prefix.$branch_id.formatNumber(1,$len);
    }
 
    static function getFormOptions($id,$ss){
        $d = null;
        if ($id) $d = self::details($id,$ss);
        return (object)[
           'details'=>$d, 
           'statuses'=>DB::table('sales_agent_statuses AS ss')->selectRaw('ss.code As status_code,ss.name AS status_name')->get(),
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
        return PublicStorage::getUrl($branch_id,'agent','image').'def-agent.png';
    }

    static function list($arr,$ss=null){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $status_code = isset($d->status_code)?Sanitizer::sanitize($d->status_code):null;
        $sales_agent_type =isset($d->sales_agent_type)? Sanitizer::sanitize( $d->sales_agent_type):null;

        $str_agent_type = $sales_agent_type? 's.salges_agent_type ='.$sales_agent_type : '3=3';
        $str_status = $status_code? 'status_code =\''.$status_code.'\'' : '1=1';
        
        $query = DB::table('sales_agents AS d')->join('sales_agent_types AS t','t.id','=','d.agent_type_id')->where('branch_id',$branch_id)->whereRaw($str_status)->whereRaw($str_agent_type)->selectRaw('d.id,d.name,d.code,d.email,d.phone_number,d.address,d.status_code,t.name AS agent_type,photo_file_name'); 
        $count_query = clone $query;
        $count = $count_query->count('d.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
          $row->image_url = '';
          //$row->mobile_login = \App\Models\UM::getAccountInfo($row->id,'official_id');
          if($row->photo_file_name) $row->image_url = PublicStorage::getUrl($row->branch_id,'agent','image').$row->photo_file_name;
          unset($row->photo_file_name);
          if(!$row->image_url) $row->image_url =self::defaultImage($ss->branch_id);
        }
       
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);

    }

    static function listAll($arr,$ss=null){
        $ss =$ss?$ss:$this->userInfo;
        $branch_id = $ss->branch_id;
        $d = (object)$arr;

        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $status_code = isset($d->status_code)?Sanitizer::sanitize($d->status_code):null;
        $agent_type_id =isset( $d->agent_type_id)? Sanitizer::sanitize( $d->agent_type_id):null;
        
        $str_status = $status_code? 'status_code =\''.$status_code.'\'' : '1=1';
        $str_agent_type = $agent_type_id > 0 ? 'agent_type_id ='.$agent_type_id : '2=2';

        $rows = DB::table('sales_agents AS d')->join('sales_agent_types AS t','t.id','=','d.agent_type_id')->where('branch_id',$branch_id)->whereRaw($str_status)->whereRaw($str_agent_type)->selectRaw('d.id,d.name,d.code,d.email,d.phone_number,d.address,d.status_code,t.name AS agent_type')->get(); 
   
        foreach($rows as $row){
          $row->image_url = '';
          //$row->mobile_login = \App\Models\UM::getAccountInfo($row->id,'official_id');
          if($row->photo_file_name) $row->image_url = PublicStorage::getUrl($row->branch_id,'agent','image').$row->photo_file_name;
          unset($row->photo_file_name);
          if(!$row->image_url) $row->image_url =self::defaultImage($ss->branch_id);
        }
        return $rows;
    }

    static function details($id,$ss)
    {
        $branch_id = $ss->branch_id;
        $row = DB::table('sales_agents AS d')->join('sales_agent_types AS t','t.id','=','d.agent_type_id')->where('d.id',$id)->selectRaw('d.id,d.name,d.agent_type_id,d.code,d.email,d.phone_number,d.address,d.status_code,d.commission, t.name AS agent_type,d.photo_file_name')->take(1)->first(); 
        if($row){
           $row->image_url = PublicStorage::getUrl($branch_id,'agent','image').$row->photo_file_name;
        } 
        return $row;
    }

    function setStatus($status_code,$id=null,$ss = null){
        $ss = $ss?$ss:$this->userInfo;
        $id = $id? $id : $this->id;
        //$branch_id = $ss->branch_id;
        $x = DB::table('sales_agents')->where('id',$id)->update(['status_code'=>$status_code]);
        return DV::depends($x,null,'Failed to update Agent status');
    }
}
