<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PublicStorage;
use DB;
use Session;
use Carbon\Carbon;

class Sender extends Model
{
    use HasFactory;
    
    function getRandomNumbers($min, $max, $total) {
      $temp_arr = array();
      while(sizeof($temp_arr) < $total) $temp_arr[rand($min, $max)] = true;
      return $temp_arr;
    }

    //Check if a sender info exists based on the merchant's "name"
    function senderExists($uss,$name,$id) {
        $branch_id = $uss->branch_id;
        $rows = [];
        if($id>0)
          $rows = DB::table('sender')->where('branch_id',$branch_id)->where('name',$name)->where('id','<>',$id)->selectRaw('id')->limit(1)->get();
        else
          $rows = DB::table('sender')->where('branch_id',$branch_id)->where('name',$name)->selectRaw('id')->limit(1)->get(); 
        foreach($rows as $row) return true;
        return false;
    }

    function senderCodeExists($uss,$code,$id) {
        $branch_id = $uss->branch_id;
        $rows = [];
        if($id>0)
          $rows = DB::table('sender')->where('branch_id',$branch_id)->where('code',$code)->where('id','<>',$id)->selectRaw('id')->limit(1)->get();
        else
          $rows = DB::table('sender')->where('branch_id',$branch_id)->where('code',$code)->selectRaw('id')->limit(1)->get(); 
        foreach($rows as $row) return true;
        return false;
    }

    // function getSenderInfoById($data){
    //     $ss = getSessionInfo($data);
    //     if(!$ss) return '#350'; //user not authenticated
    //     if (!prn_allowed(2)) return '@'; //need permission to do this task
    //     $branch_id = $ss->branch_id;
    //     DB::table('um_sessions AS u')->where('ss.access_token',$ss->access_token)->selectRaw("ss.user_id")->limit(1)->get();
    //     $id = $data->sender_id;
    //     $rows = DB::table('sender')->where('branch_id',$branch_id)->where('id',$id)->selectRaw('id,code,name,name_kh,status_code,phone_number,email')->limit(1)->get();
    //     foreach($rows as $row) return $row;
    //     return null;
    // }  

      //getSenderAddress()
      function getVendorAddress($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@';
        
        $branch_id = $ss->branch_id;
        $sender_id = isset($d->sender_id)? sanitize($d->sender_id):0;
        $rows = DB::table('sender AS s')->where('branch_id',$branch_id)->where('id',$sender_id)->selectRaw("s.address")->limit(1)->get();
        foreach($rows as $row) return $row->address;
        return null;
     }
     
    function getSenderDetails($sender_id){  
        $rows = DB::table('sender AS s')->where('s.id',$sender_id)->selectRaw('s.id,s.code,s.name,s.name_kh,s.status_code,s.phone_number,s.email, s.address,s.adr_city_id, s.adr_district_id, s.adr_commune_id')->limit(1)->get();
        foreach($rows as $row) {
          $row->bank_accounts = DB::table('sender_bank_accounts AS acc')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->selectRaw('acc.id,acc.is_primary,acc.bank_name, acc.account_number, acc.account_name')->get(); 
          return $row;
        }
         return null;
    }  

    function newOTP($length=6)
    {
        return join('', array_map(function($value) { return $value == 1 ? mt_rand(1, 9) : mt_rand(0, 9); }, range(1, $length)));
    }

    function verify_otp_preregister($d){
      $phone_number = isset($d->phone_number)?$d->phone_number:null;
      $otp_code = isset($d->otp_code)?$d->otp_code:null;
      $app_id = '38DC051E122D11EC89909801A7B0D1FCH';
      $result = (object)['status'=>'OK'];

      if (empty($phone_number)){
        $result->status ='Error';
        $result->error_message ='Phone number cannot be empty';
        return $result;
      }

      if (empty($otp_code)){
        $result->status ='Error';
        $result->error_message ='otp code cannot be empty';
        return $result;
      } 

      $exists = DB::table('temp_otp')->where('app_id',$app_id)->where('phone_number',$phone_number)->where('otp_code',$otp_code)->limit(1)->exists();
      if ($exists) DB::table('temp_otp')->where('app_id',$app_id)->where('phone_number',$phone_number)->where('otp_code',$otp_code)->delete();
      $result->status ='OK';
      $result->data = ($exists)?1:0;
      return $result;
    }
    
    /*** send_otp_preregister($d). $d = {'phone_number'} => send_otp_preregister() will check if the phone number is already in use, 
        if the phone_number not yet in use then create OTP in templory table "temp_otp" waiting to be verified (otp_code is deleted after verified correctly or 1 minute later)      
    ***/
    //api/register-send-otp
    function send_otp_preregister($d){
      // $ss = getSessionInfo($d);
      // if(!$ss) return '#350'; //user not authenticated
      // if (!prn_allowed(2)) return '@'; //need permission to do this task

      //Generate new 6-digit OTP code
      $otp_code = $this->newOTP(6); 
      //$app_id = isset($d->app_id)? sanitize($d->app_id):null;
      $app_id = getMerchantAppId();
      $result = (object)array('status'=>'OK','error_message'=>null);
      
      //Make sure the app_id supplied is the Merchant Mobile App
      if ($app_id != '38DC051E122D11EC89909801A7B0D1FCH' || empty($app_id)) {
         return DV::error('App ID is not valid');
      }

      $branch_id =1; //1 = "Pro Express" // $this->getBranchByApp($app_id);
      $d->phone_number = isset($d->phone_number)? $d->phone_number:null;
      if (empty($d->phone_number)){
         return DV::error('Phone number cannot be empty');
      } 
      
      //Check if the phone_number is already in use
      $number_in_use = DB::table('um_users AS u')->where('app_id',$app_id)->where('login_name',$d->phone_number)->limit(1)->exists();
      if ($number_in_use) return DV::error('Phone number is already in use');
       
       //$text = get_settings_value($ss,'OTP_SMS_TEMPLATE','string'); //get sms template from settings storage table
       $text ='អរគុណសំរាប់ការចុះឈ្មោះ​។ លេខសម្ងាត់ #'; //for faster 
       $text = str_replace('#',$otp_code,$text); //here
      
       $m_result = SMS::send($d->phone_number,$text,null); 
       if ($m_result->status=='Error') {
          $result->sms_error =isset($m_result->error_message)?$m_result->error_message:null;
          return $result;
       }else{
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
            return $result;
         }
          
    }


  
     //Quick self register sender from Marchant mobile app
     //$d = {'name','phone_number','password','[email]','[address]'}
     //api/register
    function registerSender($d){
      // $ss = getSessionInfo($d);
      // if(!$ss) return '#350'; //user not authenticated
      // if (!prn_allowed(2)) return '@'; //need permission to do this task

      //$app_id = isset($d->app_id)? sanitize($d->app_id):null;
      $app_id = '38DC051E122D11EC89909801A7B0D1FCH';
      $result = (object)array('status'=>'OK','error_message'=>null);
      
      //Make sure the app_id supplied is the Merchant Mobile App
      if ($app_id != '38DC051E122D11EC89909801A7B0D1FCH' || empty($app_id)) {
        $result->status ='Error';
        $result->error_message ='App ID is not valid';
        return $result;
      }

      $branch_id =1; //1 = "Pro Express" // $this->getBranchByApp($app_id);
      $otp_code = null;
      $sender_id= null;
      $sender_code = null;
      $d->phone_number = isset($d->phone_number)? $d->phone_number:null;
      if(!isset($d->id)) $d->id = 0;
      $id = $d->id;

        //Optional parameters
          $d->adr_country_id = isset($d->adr_country_id)?sanitize($d->adr_country_id):null;
          $d->adr_city_id = isset($d->adr_city_id)?sanitize($d->adr_city_id):null;
          $d->adr_district_id = isset($d->adr_district_id)? sanitize($d->adr_district_id):null;
          $d->email = isset($d->email)? sanitize($d->email,'email'):null;

      if(empty($d->phone_number)) {
        $result->status ='Error';
        $result->error_message ='phone_number or login name cannot be empty';
        return $result;
      }

      if(!isset($d->name) || empty($d->name)) {
        $d->name = $d->phone_number;
        // $result->status ='Error';
        // $result->error_message ='Merchant name cannot be empty';
        // return $result;
      }
      
     //begin: check if the merchant's name already exists ***/
        $ss = (object)array("branch_id"=>$branch_id);
        // if ($this->senderExists($ss,$d->name,$d->id)) {
        //     $result->status ='Error';
        //     $result->error_message ="Login name `$d->name` already exists";
        //     return $result;
        // }
    //end: Check if merchant's name already exists

      // if ($this->senderCodeExists($ss,$d->code,$d->id)) {
      //     $result->status ='Error';
      //     $result->error_message ='Merchant ID already exists';
      //     return $result;
      // }

     if(!isset($d->name_kh)) $d->name_kh = $d->name;
     //start:: check phone number exists as login name
        $login_name = $d->phone_number;
        $rows = DB::table('um_users AS u')->where('login_name',$login_name)->selectRaw('login_name')->limit(1)->get();
        foreach($rows as $row){
          $result->status ='Error';
          $result->error_message ='Login name or phone number already exists';
          return $result;
        }
     //end:: check if phone number exists as login name

       $default_sender_type_id =2; // 2 = 'Normal', 1 = 'VIP' 
       $d->sender_type_id = isset($d->sender_type_id)? $d->sender_type_id:$default_sender_type_id;
          DB::table('sender')->insert(array(
              'branch_id'=>$branch_id,
              //'code'=>null
              'name'=>$d->name,
              'name_kh'=>$d->name_kh,
              'business_type'=>$d->business_type,
              'sender_type_id'=>$d->sender_type_id,
              //'sender_type'=>'Normal',
              'status_code'=>'Active', //"Active"
              'address'=>$d->address,
              'adr_country_id'=>$d->adr_country_id,
              'adr_city_id'=>$d->adr_city_id,
              'adr_district_id'=>$d->adr_district_id,
              'phone_number'=>$d->phone_number,
              'email'=>$d->email,
              'create_user'=>"self register",
              'create_date'=>getNowTime()
          )); 

          $sender_id = DB::getPdo()->lastInsertId();
          
          if ($sender_id > 0) {
                $sender_code = $this->getNextSenderCode($ss); // formatNumber($sender_id,5);
                DB::table('sender')->where('id',$sender_id)->where('branch_id',$branch_id)->update(array(
                    'code'=>$sender_code
                ));

                //begin::create user profile in table umt_users
                       $otp_code = $this->newOTP(6); 
                       $app_id ='38DC051E122D11EC89909801A7B0D1FCH'; //merchant app_id
                       $login_name = $d->phone_number; // user PHONE NUMBER as login name
                       $hpwd= PASSWORD_HASH($d->password,PASSWORD_DEFAULT);
                       $d->subs_id=null;
                       $d->work_location_id =null;
                       //Make sure role_id =14 is protected from being deleted in table "um_roles"
                       $default_role_id =14; // default_role_id = 14 => "Merchant" role. todo: protect role 14 from being deleted or renamed
                      
                      DB::table('um_users')->insert([
                      'otp_code'=>null,
                      'app_id'=>$app_id, /** NOTE that app_id usually depends on @user_class (method $this->getAppIdByUserClass() will returns same app_id for every "user_class" if all user_classes are allowed to log in to the same app) **/
                      'branch_id'=>$branch_id,
                      'login_name'=>$login_name,
                      'full_name'=>$d->name,
                      'official_id'=>$sender_id,
                      'official_code'=>$sender_code,
                      'hpwd'=>$hpwd,
                      'previlege_type'=>isset($d->previlege_type)? $d->previlege_type:'standard', //{'standard','admin'}
                      'user_class'=>'merchant', /* user_class = {student,parent,customer,viewer,patient,user}. It is whatever classification meaningful in specific Application Context. It provides directive to use "official_id" to link to meaning table such as Students or Employees or Customers or Parents etc...*/
                      'phone_number'=>$d->phone_number,
                      'email'=>$d->email,
                      'subs_id'=>$d->subs_id,
                      'status'=>'active',
                      'is_locked'=>0, // is_locked = 1 => needs activation before can user can make first login
                      'work_location_id'=>$d->work_location_id,
                      'create_user'=>'self register',
                      'create_date'=>getNowTime(),
                      'create_uid'=>null
                    ]);

                   $d->user_id  = DB::getPdo()->lastInsertId();
                   //$this->UMModel->addRoleMember1($ss,$default_role_id,$d->user_id); 
                   DB::table('um_user_roles')->where('branch_id',$branch_id)->where('role_id',$default_role_id)->where('user_id',$d->user_id)->delete();
                   DB::table('um_user_roles')->insert(array('branch_id'=>$branch_id,'user_id'=>$d->user_id,'role_id'=>$default_role_id,'app_id'=>$app_id));
                //end::create user profile
                 //When merchant user is registerred successfully => create bank accounts
                 if ($d->user_id > 0) {
                    if (!isset($d->bank_accounts)) $d->bank_accounts = [];
                    if (!is_array($d->bank_accounts)) $d->bank_accounts = [];
                    $this->saveBankAccounts($ss,$sender_id,$d->bank_accounts);

                    //begin:: create login's session and access_token => to allow Merchant's auto login, after registration
                          //UM::setUserSession() is a static function and is the same as UM->createSession() 
                          $sess = UM::setUserSession($app_id,$login_name,$d->user_id,$branch_id);
                          if($sess->status =='OK') {
                            $result->status ='OK';

                            $result->error_message =null;

                            //start:: get user`s details
                                $user = null;
                                $rows = DB::table('um_users AS u')->selectRaw('u.user_class,u.official_id,u.hpwd, u.id,u.login_name, u.branch_id, u.full_name, u.status, u.is_locked,u.email,u.phone_number,u.otp_code')->where('u.login_name',$login_name)->where('u.app_id',$app_id)->limit(1)->get();
                                foreach($rows as $row) $user = $row;
                                $user->access_token = $sess->access_token;
                            //end:: get user's details

                              //start:: encrypt token
                                $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
                                $user->access_token = $encrypter->encrypt($user->access_token,false);
                              //end:: encrypt token

                            $result->user = $user;
                            return $result;
                          } else {
                            //In case of error creating user's session table "um_sessions"
                            $result->user = (object)['access_token'=>null,'sender_id'=>$sender_id,'sender_code'=>$sender_code]; 
                            $result->status ='Error';
                            $result->error_message =$err;
                            return $result;
                          }
                  //end:: create login's session and access_token => to allow Merchant's auto login, after registration

                      // //$text = get_settings_value($ss,'OTP_SMS_TEMPLATE','string'); //get sms template from settings storage table
                      // $text ='អរគុណសំរាប់ការចុះឈ្មោះ​។ លេខសម្ងាត់ #'; //for faster 
                      // $text = str_replace('#',$otp_code,$text);
                      // $smsModel = new SMS();
                      // $m_result = $smsModel->_sendSMS($d->phone_number,$text,null); 
                      // if ($m_result->status=='Error') {
                      //    $result->sms_error =isset($m_result->error_message)?$m_result->error_message:null;
                      // }
                 }

              // $result->status ='OK';
              // $result->error_message =null;
              // $result->sender_id =$sender_id;
              // $result->code = $sender_code; //Official ID of the merchant
              // return $result;   
          } else {
              $result->status ='Error';
              $result->error_message ='There was a problem in creating your user profile'; // unexpected problem
              return $result;   
          }
         
    }

      //   function sendSMS_otp($branch_id, $login_name, $phone_number){
      //     //$text = get_settings_value($ss,'OTP_SMS_TEMPLATE','string'); //get sms template from settings storage table
      //     $text ='អរគុណសំរាប់ការចុះឈ្មោះ​។ លេខសម្ងាត់ #'; //for faster
      //     $new_otp_code = $this->newOTP();
      //     $text = str_replace('#',$new_otp_code,$text);
      //     $q = DB::table('um_users')->where('login_name',$login_name)->update(array('otp_code'=>$new_otp_code));
      //     if($q>0) {
      //       $smsModel = new SMS();
      //       //use internal function of smsModel 
      //       $result = $smsModel->_sendSMS($phone_number,$text,null);
      //       return $result;     
      //     } else 
      //       return (object)array('status'=>'Error','error_message'=>'The provided user login name does not seem to exists');
      // }

    //$d={'otp_code','login_name'}
    function activateSender_otp($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $otp_code = isset($d->otp_code)?$d->otp_code:null;
        //$user_id = $d->user_id;
        $login_name = isset($d->login_name)? $d->login_name:null;
        $result = (object)array('status'=>'OK','error_message'=>null);

        $rows = DB::table('um_users AS u')->where('login_name',$login_name)->selectRaw('u.otp_code')->limit(1)->get();
        foreach($rows as $row){
          if ($row->otp_code ==$otp_code) {
            DB::table('um_users')->where('login_name',$login_name)->update(array('otp_code'=>null,'status'=>'active','is_locked'=>0));
            $result->status ='OK';
            return $result;
          }else {
            $result->status ='Error';
            $result->error_message ='Incorrect otp code';
            return $result;
          }
        }
            $result->status ='Error';
            $result->error_message ='Could not find matching otp code';
            return $result;
    }

    function saveSender($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

        $branch_id = $ss->branch_id;
        $result =(object)[];
        $sender_id= null;
        $sender_code = null;

        if(!isset($d->id)) $d->id = 0;
        $id = $d->id;

        $d->adr_country_id = isset($d->adr_country_id)?sanitize($d->adr_country_id):null;
        $d->adr_city_id = isset($d->adr_city_id)?sanitize($d->adr_city_id):null;
        $d->adr_district_id = isset($d->adr_district_id)? sanitize($d->adr_district_id):null;
        $d->email = isset($d->email)? sanitize($d->email,'email'):null;
        $address = isset($d->address)? sanitize($d->address):null;
        $sales_agent_id = isset($d->sales_agent_id)? sanitize($d->sales_agent_id):null;
        if($sales_agent_id==0) $sales_agent_id= null; 
        
        if(!isset($d->name) || empty($d->name)) {
          $result->status ='Error';
          $result->error_message ='Merchant name cannot be empty';
          return $result;
        }

        if ($this->senderExists($ss,$d->name,$d->id)) {
            $result->status ='Error';
            $result->error_message ='Merchant name already exists';
            return $result;
        }

        if ($this->senderCodeExists($ss,$d->code,$d->id)) {
            $result->status ='Error';
            $result->error_message ='Merchant ID already exists';
            return $result;
        }

       if(!isset($d->name_kh)) $d->name_kh = $d->name;
        
       if ($id > 0) {
            DB::table('sender')->where('id',$id)->where('branch_id',$branch_id)->update(array(
                //'branch_id'=>$branch_id,
                'code'=>$d->code,
                'name'=>$d->name,
                'name_kh'=>$d->name_kh,
                'business_type'=>$d->business_type,
                'sender_type_id'=>$d->sender_type_id,  
                'address'=>$address,
                'adr_country_id'=>$d->adr_country_id,
                'adr_city_id'=>$d->adr_city_id,
                'adr_district_id'=>$d->adr_district_id,
                'phone_number'=>$d->phone_number,
                'email'=>$d->email,
                'sales_agent_id'=>$sales_agent_id,
                //'status_code'=>$d->status_code, //User can click on Change Status menu instead
                'update_user'=>$ss->login_name,
                'update_date'=>getNowTime()
            )); 
          $sender_id = $id;
          $sender_code = $d->code;   
       } else {
            DB::table('sender')->insert(array(
                'branch_id'=>$branch_id,
                //'code'=>null
                'name'=>$d->name,
                'name_kh'=>$d->name_kh,
                'business_type'=>$d->business_type,
                'sender_type_id'=>$d->sender_type_id,
                'status_code'=>$d->status_code,
                'address'=>$address,
                'adr_country_id'=>$d->adr_country_id,
                'adr_city_id'=>$d->adr_city_id,
                'adr_district_id'=>$d->adr_district_id,
                'phone_number'=>$d->phone_number,
                'email'=>$d->email,
                'sales_agent_id'=>$sales_agent_id,
                'status_code'=>'active',
                'create_user'=>$ss->login_name,
                'create_date'=>getNowTime()
            )); 

            $sender_id = DB::getPdo()->lastInsertId();
            $sender_code = $this->getNextSenderCode($ss); // formatNumber($sender_id,5);
            DB::table('sender')->where('id',$sender_id)->where('branch_id',$branch_id)->update(array(
                'code'=>$sender_code
            ));
       }

       if ($sender_id > 0) {
         $this->saveBankAccounts($ss,$sender_id,$d->banks);
       }

       $result->status ='OK';
       $result->error_message =null;
       $result->sender_id =$sender_id;
       $result->code = $sender_code; //Official ID of the merchant
       return $result;   
    }


    //updateSenderProfile() is used as api by Merchant mobile app to update merchant's profile
    //$d = {'name','name_kh','phone_number','address','business_type','bank_accounts'=> [{'account_number','account_name','bank_name'},...{}] }
    function updateSenderProfile($d) {
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task

      $branch_id = $ss->branch_id;
      $result =(object)[];
      $sender_id= isset($d->sender_id)?sanitize($d->sender_id):null;
      //$sender_code = null;
 
      //$d->adr_country_id = isset($d->adr_country_id)?sanitize($d->adr_country_id):null;
      //$d->adr_city_id = isset($d->adr_city_id)?sanitize($d->adr_city_id):null;
      //$d->adr_district_id = isset($d->adr_district_id)? sanitize($d->adr_district_id):null;
      //$d->email = isset($d->email)? sanitize($d->email,'email'):null;
      $address = isset($d->address)? sanitize($d->address):null;
      //$sales_agent_id = isset($d->sales_agent_id)? sanitize($d->sales_agent_id):null;
      //if($sales_agent_id==0) $sales_agent_id= null; 
      
      if(!isset($d->name) || empty($d->name)) {
        $result->status ='Error';
        $result->error_message ='Merchant name cannot be empty';
        return $result;
      }

      if ($this->senderExists($ss,$d->name,$sender_id)) {
          $result->status ='Error';
          $result->error_message ='It seems this name is already in use by another vendor';
          return $result;
      }

      if ($this->senderCodeExists($ss,$d->code,$sender_id)) {
          $result->status ='Error';
          $result->error_message ='Merchant ID already exists';
          return $result;
      }

     if(!isset($d->name_kh)) $d->name_kh = $d->name;
      
     if ($sender_id > 0) {
          DB::table('sender')->where('id',$sender_id)->where('branch_id',$branch_id)->update(array(
              //'branch_id'=>$branch_id,
              //'code'=>$d->code,
              'name'=>$d->name,
              'name_kh'=>$d->name_kh,
              'business_type'=>$d->business_type,
              'sender_type_id'=>$d->sender_type_id,
              'address'=>$address,
              //'adr_country_id'=>$d->adr_country_id,
              //'adr_city_id'=>$d->adr_city_id,
              //'adr_district_id'=>$d->adr_district_id,
              //'phone_number'=>$d->phone_number,
              //'email'=>$d->email,
              //'sales_agent_id'=>$sales_agent_id,
              //'status_code'=>$d->status_code, //User can click on Change Status menu instead
              'update_user'=>$ss->login_name,
              'update_date'=>getNowTime()
          )); 
       
        //$sender_code = $d->code;   
     }

    //  if ($sender_id > 0) {
    //    $this->saveBankAccounts($ss,$sender_id,$d->bank_accounts);
    //  }

     $result->status ='OK';
     $result->error_message =null;
     $result->sender_id =$sender_id;
     //$result->code = $sender_code; //Official ID of the merchant
     return $result;   
    }
 
    //Merchant updates his/her bank info on Mobile app
    function saveMerchantProfile_bank($d){
      $ss = getSessionInfo($d);
       if(!$ss) return '#350'; //user not authenticated
       if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $sender_id = isset($d->sender_id)?$d->sender_id:null;
        if(empty($sender_id)) return "Merchant identity is not valid";
        $bank_accounts = isset($d->bank_accounts)?$d->bank_accounts:[];
       $this->saveBankAccounts($ss,$sender_id,$bank_accounts);
       return null;
    }

    function getNextSenderCode($uss,$len =4){
      $branch_id = $uss->branch_id;
      $prefix ='';
      $rows = DB::table('sender_code_control AS c')->where('branch_id',$branch_id)->limit(1)->selectRaw('TRIM(c.prefix) AS prefix,c.last_sender_number')->get();
      foreach($rows as $row) {
          $num = $row->last_sender_number;
          $prefix = trim($row->prefix);
          $num +=1;
          DB::table('sender_code_control')->where('branch_id',$branch_id)->update(array('last_sender_number'=>$num));
          return $prefix.$branch_id.formatNumber($num,$len);
      }
      DB::table('sender_code_control')->insert(array('branch_id'=>$branch_id,'last_sender_number'=>1));
      return $prefix.$branch_id.formatNumber(1,$len);
    }

  function sender_in_use($uss,$id) {
      $branch_id = $uss->branch_id;
      $rows = DB::table('order')->where('branch_id',$branch_id)->where('sender_id',$id)->selectRaw('sender_id')->limit(1)->get();
      if(count($rows) >0) return true;
      $rows = DB::table('package')->where('branch_id',$branch_id)->where('sender_id',$id)->selectRaw('sender_id')->limit(1)->get();
      if(count($rows) >0) return true;
      return false;
  }

  // //saveBankAccounts_sender() is called from Merchant's mobile app to update or add bank accounts
  // function saveBankAccounts_sender($d){
  //    $ss = getSessionInfo($d);
  //       if(!$ss) return '#350'; //user not authenticated
  //    if (!prn_allowed(2)) return '@'; //need permission to do this task
  //    //$branch_id = $ss->branch_id;
  //    if(!isset($d->bank_accounts)) $d->bank_accounts = [];
  //    return $this->saveBankAccounts($ss,$d->sender_id,$d->bank_accounts);
  // }

  //Add or update bank accounts. This is used for back end profile update
  function saveBankAccounts($ss,$sender_id, $banks){
      $branch_id = $ss->branch_id;
      $success_cnt =0;
      $failed_cnt =0;
      $cs = (array)$banks;
      $i=0;
      $c;
      do{
        if (!isset($cs[$i])) break;
        $c = (object)$cs[$i];
          $err = null;
          $c->is_primary = isset($c->is_primary)?$c->is_primary:0;
          $c->bank_name = isset($c->bank_name)?sanitize($c->bank_name):null;
          $c->account_number = isset($c->account_number)?sanitize($c->account_number):null;
          $c->account_name = isset($c->account_name)?sanitize($c->account_name):null;
          $c->id = isset($c->id)?sanitize($c->id):0;

          if (empty($c->bank_name)) 
             $err ='bank name cannot be empty';
           else if (empty($c->account_number)) 
             $err ='Account number cannot be empty';
            else if (empty($c->account_name)) 
              $err ='Account name cannot be empty';
             
              if ($err ==null) {
                    if ($c->id>0) {
                      DB::table('sender_bank_accounts')->where('branch_id',$branch_id)->where('id',$c->id)->update(array( 
                        //'sender_id'=>$sender_id,
                        'is_primary'=>$c->is_primary,
                        'bank_name'=>$c->bank_name,
                        'account_number'=>$c->account_number,
                        'account_name'=>$c->account_name,
                        'create_user'=>$ss->login_name,
                        'create_date'=>getNowTime()
                      ));
                  } else{
                    DB::table('sender_bank_accounts')->insert(array(
                      'branch_id'=>$branch_id,
                      'sender_id'=>$sender_id,
                      'is_primary'=>$c->is_primary,
                      'bank_name'=>$c->bank_name,
                      'account_number'=>$c->account_number,
                      'account_name'=>$c->account_name,
                      'create_user'=>$ss->login_name,
                      'create_date'=>getNowTime()
                    ));
              
                    $new_id = DB::getPdo()->lastInsertId();
                    // if ($new_id > 0) {
                    //   DB::table('sender_bank_accounts')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->whereRaw("id <> '".$new_id."' ")->delete();
                    // }  
                  }
                  $success_cnt++;
              }//end if there is no error ($err ==null)
              else  $failed_cnt++;
              
        $i++;
      }while($c); 

      return null;
  }
  
   //$d= {'sender_id','id','bank_name','account_name','account_number'}
   function saveBankAccount($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $id = isset($d->id)?$d->id:null;
        $sender_id = isset($d->sender_id)?$d->sender_id:null;
        $bank_name = isset($d->bank_name)?$d->bank_name:null;
        $account_number = isset( $d->account_number)?$d->account_number:null;
        $account_name =isset( $d->account_name)? $d->account_name:null;
        $is_primary = isset($d->is_primary)?$d->is_primary:0;

        $err = null;
        if ($id ==null || $id <=0) {
          $err ='Account identity is not valid';
        }
        else if ($sender_id ==null || $sender_id <=0) {
          $err = 'Merchant identity is not valid';
        }
        else if (empty($bank_name)) 
        $err ='bank name cannot be empty';
        else if (empty($account_number)) 
        $err ='Account number cannot be empty';
      else if (empty($account_name)) 
        $err ='Account name cannot be empty';
      if ($err != null)  return $err;

      if ($id >0){
          DB::table('sender_bank_accounts')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->where('id',$id)->update(array(
            'is_primary'=>$is_primary,
            'bank_name'=>$bank_name,
            'account_number'=>$account_number,
            'account_name'=>$account_name
          ));
      }else{
          DB::table('sender_bank_accounts')->insert(array(
            'branch_id'=>$branch_id,
            'sender_id'=>$sender_id,
            'is_primary'=>$is_primary,
            'bank_name'=>$bank_name,
            'account_number'=>$account_number,
            'account_name'=>$account_name,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
          ));
      }
     
     return null;
  }

  //used in mobile app, merchant to update their bank account info one by one
  //$d= {'sender_id','id','bank_name','account_name','account_number'}
  function updateBankAccount($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
    $id = isset($d->id)?$d->id:null;
    $sender_id = isset($d->sender_id)?$d->sender_id:null;
    $bank_name = isset($d->bank_name)?$d->bank_name:null;
    $account_number = isset( $d->account_number)?$d->account_number:null;
    $account_name =isset( $d->account_name)? $d->account_name:null;

    $err = null;
    if ($id ==null || $id <=0) {
      $err ='Account identity is not valid';
    }
    else if ($sender_id ==null || $sender_id <=0) {
      $err = 'Merchant identity is not valid';
    }
    else if (empty($bank_name)) 
    $err ='bank name cannot be empty';
    else if (empty($account_number)) 
    $err ='Account number cannot be empty';
   else if (empty($account_name)) 
     $err ='Account name cannot be empty';
   if ($err != null)  return $err;

      DB::table('sender_bank_accounts')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->where('id',$id)->update(array(
        'bank_name'=>$bank_name,
        'account_number'=>$account_number,
        'account_name'=>$account_name
      ));
 
  }

  //Add bank accounts to Sender profile
  //$d = {'sender_id','bank_accounts'=> [{bank_name,account_number, account_name},...]}
  function addBankAccounts($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
    $sender_id = isset($d->sender_id)?$d->sender_id:0;
    $bank_accounts = isset($d->bank_accounts)?$d->bank_accounts:[];
    $result = (object)array('success_count'=>0, 'failed_count'=>0,'status'=>'OK','error_message'=>null);
 
    if (!isset($d->bank_accounts[0])) {
      $result->status ='Error';
      $result->error_message ='No account data provided';
      return $result;
    } 
    $success_cnt =0;
    $failed_cnt =0;
  
    $rows = DB::table('sender_bank_accounts AS b')->where('b.branch_id',$branch_id)->where('b.sender_id',$sender_id)->selectRaw('COUNT(b.id) AS cnt')->get();
    $cnt = 0;
    foreach($rows as $row) $cnt = $row->cnt;
    
    if ($cnt >2) {
      $result->status ='Error';
      $result->error_message ='Only two bank accounts are allowed for each merchant';
      return $result;
    }
    $cs = (array)$bank_accounts;
    $i=0;
    $c;
    $primary_cnt = 0;
    do{
      if (!isset($cs[$i])) break;
      $c = (object)$cs[$i];
        $err = null;
        $c->is_primary = isset($c->is_primary)?$c->is_primary:1;
        if ($c->is_primary ==1) $primary_cnt++;
        if ($c->is_primary ==1 && $primary_cnt >1) $c->is_primary =0; 
        $c->bank_name = isset($c->bank_name)?sanitize($c->bank_name):null;
        $c->account_number = isset($c->account_number)?sanitize($c->account_number):null;
        $c->account_name = isset($c->account_name)?sanitize($c->account_name):null;
        $c->id = isset($c->id)?sanitize($c->id):0;

        if (empty($c->bank_name)) 
           $err ='bank name cannot be empty';
         else if (empty($c->account_number)) 
           $err ='Account number cannot be empty';
          else if (empty($c->account_name)) 
            $err ='Account name cannot be empty';
           
            if ($err ==null) {
              DB::table('sender_bank_accounts')->insert(array(
                'branch_id'=>$branch_id,
                'sender_id'=>$sender_id,
                'is_primary'=>$c->is_primary,
                'bank_name'=>$c->bank_name,
                'account_number'=>$c->account_number,
                'account_name'=>$c->account_name,
                'create_user'=>$ss->login_name,
                'create_date'=>getNowTime()
              ));
              $new_id = DB::getPdo()->lastInsertId();
              if ($new_id > 0) $success_cnt++;
               
            }//end of => if there is no error ($err ==null)
           else $failed_cnt++;
            
      $i++;
    }while($c); 

    if ($success_cnt ==0)  {
      $result->status ='Error';
      $result->error_message ="The provided bank accounts information were not acceptable, so there were no bank accounts created";
      $result->success_count = $success_cnt ;
      $result->failed_count = $failed_cnt;
    } else {
      if ($failed_cnt ==0 && $success_cnt > 0) {
        $result->status ='OK'; 
        $result->error_message = null;
      }
      else {
        $result->status ='Error';
        $result->error_message = $failed_cnt.' accounts failed due to invalid data provided';
      }
      $result->success_count = $success_cnt;
      $result->failed_count = $failed_cnt;
      return $result;
    } 
  }
 
  //delete bank account. $d= {'sender_id','bank_name','account_number'}
  function deleteBankAccountByNumber($d) {
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
    if(!isset($d->sender_id)) $d->sender_id =0;
    $sender_id = $d->sender_id;
    $bank_name = $d->bank_name;
    $account_number = $d->account_number;
    DB::table('sender_bank-accounts')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->where('bank_name',$bank_name)->where('account_number',$account_number)->delete();
    return null;
  } 

  function updateSenderStatus($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
    if(!isset($d->sender_id)) $d->sender_id =0;
    $id = $d->sender_id;
    DB::table('sender')->where('branch_id',$branch_id)->where('id',$id)->update(array(
        'status_code'=>$d->status_code
    ));
    return null;
  }

  function deleteLogin_by_officialId($user_class,$official_id=-1){
    $login_name = null;
    $user_id = null;
    $rows = DB::table('um_users as u')->where('u.official_id',$official_id)->where('user_class',$user_class)->selectRaw('u.login_name, u.id as user_id')->limit(1)->get();
    foreach($rows as $row) {
      $login_name = $row->login_name;
      $user_id = $row->user_id;
    }
    
    DB::table('um_user_roles')->where('user_id',$user_id)->delete();
    DB::table('um_users')->where('id',$user_id)->delete();
  }

  function deleteSender($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

      $branch_id = $ss->branch_id;
      $id = $d->sender_id;
      if ($this->sender_in_use($ss,$id)) {
          return "Cannot delete this merchant because there are some transactions involved already";
      }
      
      DB::table('sender_bank_accounts')->where('branch_id',$branch_id)->where('sender_id',$id)->delete();
      DB::table('sender_base_price')->where('branch_id',$branch_id)->where('sender_id',$id)->delete();
      DB::table('sender_cod_charges')->where('branch_id',$branch_id)->where('sender_id',$id)->delete();
      DB::table('sender')->where('branch_id',$branch_id)->where('id',$id)->delete();

      //delete data from table "um_users" and "um_user_roles"
      $this->deleteLogin_by_officialId('merchant',$id);
      return null;
  }

  function getSenderById($d) {
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = $ss->branch_id;
    $sender_id = isset($d->sender_id)?$d->sender_id:0;
      /***
        $users = DB::table('users')
            ->join('contacts', 'users.id', '=', 'contacts.user_id')
            ->join('orders', 'users.id', '=', 'orders.user_id')
            ->select('users.*', 'contacts.phone', 'orders.price')
            ->get();  
        ***/
     $rows = DB::table('sender as s')->selectRaw("s.id,s.code,s.name,s.name_kh,s.address,s.phone_number,encode_email(s.email) AS email,s.business_type,s.sender_type_id, (SELECT t.name FROM sender_type AS t WHERE t.id = s.sender_type_id LIMIT 1) AS sender_type")->where('s.branch_id',$branch_id)->where('s.id',$sender_id)->limit(1)->get();
     foreach($rows as $row){
       $row->bank_accounts = DB::table('sender_bank_accounts AS acc')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->selectRaw('acc.id,acc.is_primary,acc.bank_name, acc.account_number, acc.account_name')->get(); 
       return $row;
     } 
     return null;
 }

 function getBankAccounts($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = $ss->branch_id;
      $sender_id = isset($d->sender_id)?$d->sender_id:0;
      $rows = DB::table('sender_bank_accounts AS acc')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->selectRaw('acc.id,acc.is_primary,acc.bank_name, acc.account_number, acc.account_name')->get(); 
      return $rows;
 }

 //return senderInfo (name, name_kh, phone_number, address,email) to Merchant mobile app
 //when Merchant tries to update their profile info
 function getProfileInfo($d) {
  $ss = getSessionInfo($d);
  if(!$ss) return '#350'; //user not authenticated
  if (!prn_allowed(2)) return '@'; //need permission to do this task
  $branch_id = $ss->branch_id;
  $sender_id = isset($d->sender_id)?$d->sender_id:0;
    /***
      $users = DB::table('users')
          ->join('contacts', 'users.id', '=', 'contacts.user_id')
          ->join('orders', 'users.id', '=', 'orders.user_id')
          ->select('users.*', 'contacts.phone', 'orders.price')
          ->get();  
      ***/
    $rows = DB::table('sender as s')->selectRaw("s.id,s.name,s.name_kh,s.email,s.phone_number,s.address")->where('s.branch_id',$branch_id)->where('s.id',$sender_id)->limit(1)->get();
    //  foreach($rows as $row){
    //    $row->bank_accounts = DB::table('sender_bank_accounts AS acc')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->selectRaw('acc.id,acc.is_primary,acc.bank_name, acc.account_number, acc.account_name')->get(); 
    //    return $row;
    //  } 
    foreach($rows as $row){
      $row->image_url = PublicStorage::getProfilePhoto_url($branch_id,'merchant',$sender_id);
      return $row;
    }
    return null; 
}

 function getSenderList($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task

     $branch_id =$ss->branch_id;
     $status = $d->status;
     $sender_type_id = isset($d->sender_type_id)? $d->sender_type_id:null;
     $business_type = isset($d->business_type)?$d->business_type:null;
     $search_value = isset($d->search_value)?$d->search_value:null;
     $sales_agent_id = isset($d->sales_agent_id)?$d->sales_agent_id:-1;

     $str_sender_type = null;
     $str_business_type =null;
     $str_status =null; // Active, Inactive
     $str_search =null;
     $str_agent = null;
     if (!empty($search_value)) 
     {
      $str_search = "AND (s.name LIKE '%".escape_like_str($search_value)."%' OR s.phone_number ='".sanitize($search_value)."' )";
     }else{
        if($sender_type_id>0) $str_sender_type ="AND s.sender_type_id ='".sanitize($sender_type_id)."' ";
        if(!empty($business_type)) $str_business_type ="AND s.business_type ='".sanitize($business_type)."' ";
        if(!empty($status)) $str_status = "AND s.status_code ='".$status."'";
              if ($sales_agent_id ==-1)  //Vendors with and without referrrers
              $str_agent = null;
            else
            {
                if($sales_agent_id > 0) $str_agent =" AND s.sales_agent_id ='".$sales_agent_id."' "; //vendors wit specific referer
                else  $str_agent =" AND s.sales_agent_id IS NULL"; //Vendors without referrers
            }
      }
      
      $str_more_clauses = " 1=1 ".$str_search.$str_business_type.$str_sender_type.$str_agent.$str_status;
      $rows = DB::table('sender as s')->selectRaw("s.id,s.code,s.status_code,s.name,s.name_kh,s.address,s.phone_number, getPriceListName(s.price_list_id) AS price_list_name, encode_email(s.email) AS email,s.business_type,s.address,s.sender_type_id, (SELECT t.name FROM sender_type AS t WHERE t.id = s.sender_type_id LIMIT 1) AS sender_type")->where('s.branch_id',$branch_id)->whereRaw($str_more_clauses)->get();
      return $rows;
   }
   
   //static method getSenderProp($sender_id,$prop)
   static function getSenderProp($id,$prop){
      $rows = DB::table('sender')->where('id',$id)->selectRaw($prop)->limit(1)->get();
      foreach($rows as $row) return $row->{$prop};
      return null;
   }

   //non-static method getSenderProp($branch_id,$sender_id,$prop)
   function getSenderProp1($branch_id,$id,$prop){
      $rows = DB::table('sender')->where('branch_id',$branch_id)->where('id',$id)->selectRaw($prop)->limit(1)->get();
      foreach($rows as $row) return $row->{$prop};
      return null;
   }

   //Called by merchant mobile app to update user profile quickly
   function updateProfile_sender($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = isset($ss->branch_id)? sanitize($ss->branch_id):null;
        $result = (object)array('error_message'=>null,'status'=>'OK', 'change_phone_number'=>0);
        
        $sender_id = isset($d->sender_id)?$d->sender_id:null;
        $name = isset($d->name)?$d->name:null;
        $phone_number = isset($d->phone_number)?$d->phone_number:null;
        $address = isset($d->address)?$d->address:null;
        $email = isset($d->name)?$d->name:null;
        //business_type is defaulted to "General"
        $business_type = isset($d->business_type)?$d->business_type:'General'; 
        $required_fields =['name','phone_number'];
        $res = nonEmptyFields($d,$required_fields);
        if($res->status =='Error') return $res;
        
        if ($this->senderExists($ss,$name,$sender_id)) {
          $result->status ='Error';
          $result->error_message ='It seems this name is already in use by another merchant';
          return $result;
       }

        //Check if merchant changed his phoner number
          $org_phone_number = self::getSenderProp($sender_id,"phone_number");
          if (!empty($org_phone_number) && !empty($phone_number) && ($org_phone_number != $phone_number)){
              $new_otp_code = $this->newOTP();
              $res = PendingTask::create('change_phone_number',$branch_id,$ss->user_id,$org_phone_number,$phone_number,$new_otp_code);
              if ($res->status=='OK'){
                 $m = SMS::send($org_phone_number,"លេខសំងាត់ $new_otp_code សំរាប់ប្តូរលេខទូរសព្ទ័");
                 if ($m->status =='Error') {
                  $result->sms_error = $m->error_message;
                 } 
                 $result->otp_code = $new_otp_code;
                 $result->change_phone_number = 1;
              }else return $res;
          }
        //end of checking Phone number changing

        //// use dynamic arrays of fields to be updates
        // $inputs = [];
        // //Do not update phone number field, because it requires OTP code verification first
        // foreach($d as $prop => $value){
        //     if ($prop !='phone_numner')
        //       if(!empty($value)) $input[] = [$prop=>$value];   
        // }

        //use static fields to be updated
        $inputs = [
          'name'=>$name,
          //'address'=>$address,
          //'email'=>$email,
          'business_type'=>$business_type
        ];

        // if(!isset($inputs[0])){
        //   $result->status ='Error';
        //   $result->error_message ='There is nothing to update';
        //   return $result;
        // } 

        DB::table('sender')->where('branch_id',$branch_id)->where('id',$sender_id)->update($inputs);
        //if(!isset($result->change_phone_number)) $result->change_phone_number =1;
        return $result;
   }

  
  //  //$d=> {'sender_id','file_type','photo_data'}
  //   function saveProfilePicture($d)
  //   {   
  //     $ss = getSessionInfo($d);
  //     if(!$ss) return '#350'; //user not authenticated
  //     if (!prn_allowed(2)) return '@'; //need permission to do this task
    
  //     $result = (object)array('error_message'=>null,'status'=>'OK');
  //     $fileTypes = ['jpg','png','jpeg','svg'];
  //     $branch_id = $ss->branch_id;
  //     $file_type= isset($d->file_type)?$d->file_type:null;
  //     $fileContent= $d->photo_data;
  //     $sender_id = $d->sender_id;

  //     if (!$branch_id) return "Failed to upload file due to invalid company identity";
  //       $merchant_dir = $branch_id.'_data/merchants/';
  //       $dir = getStoragePath(false).$merchant_dir;   
  //       //$dir = getcwd(). '/uploads/companies/'.$branch_id.'_data/merchants/';
  //       //$path = Storage::disk('local')->path($filename);
  //       //DB::table('um_branches')->where('branch_id',1)->update(array('photo_file_name'=>$dir));   
      
  //     $fileName = $branch_id."profile-pic-".date('Ymd_hms');
  //     $filePath = $dir.$filename;
  //     $fileUrl = getStorageUrl().$merchant_dir.$fileName; //$dir.$branch_id."profile-pic-".date('Ymd_hms');
      
  //     $mResult = createFile($file_type,$filePath,$fileContent);
  //     ////DB::table('um_branches')->where('branch_id',$branch_id)->update(array('photo_file_name'=>$mResult->error)); 
  //     if (!$mResult->error)
  //     {	
  //         $rows = DB::table('sender')->where('branch_id',$branch_id)->where('id',$sender_id)->selectRaw('photo_file_name')->limit(1)->get();  
  //        //todo: detect for error when two users try to delete this file at same time
  //        foreach($rows as $row) {
  //          $del_path = getStoragePath(false).$row->photo_file_name;
  //          deleteFile($del_path);
  //        }
  //         DB::table('sender')->where('branch_id',$branch_id)->where('id',$sender_id)->update(array('photo_file_type'=>$file_type,'photo_file_name'=>$fileName));
  //         $result->error_message =null;
  //         $result->status ='OK'; 
  //     } else 
  //     {
  //       $result->error_message =$mResult->error;
  //       $result->status ='Error';
  //           return $result;
  //     }		  
        
  //     return $result;
  //   }
    


    // //$d = {'sender_id'} 
    // function getProfilePicture($d)
    // {
    //     $ss = getSessionInfo($d);
    //     if(!$ss) return '#350'; //user not authenticated
    //     if (!prn_allowed(2)) return '@'; //need permission to do this task
    //     $branch_id = $ss->branch_id;
    //     $sender_id = isset($d->sender_id)?$d->sender_id:null;   
    //     $rows = DB::table('sender')->where('branch_id',$branch_id)->where('id',$sender_id)->selectRaw('photo_file_name,photo_file_type')->limit(1)->get();
    //     foreach($rows as $row)
    //     {
    //         $content = readFileContent($row->photo_file_name);   
    //         $p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->photo_file_type.";"."base64".getEncodedChar(',');
    //         //****Return for javascript client
    //         //return $p.base64_encode($content);
    //         //**** return direct from server
    //         return  "data:image/jpg;base64,".base64_encode($content);
    //     }
    //     return null;
    // }
     
    function getFormData_senderdialog($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        
        $branch_id = $ss->branch_id;
        $data= (object)[];
        $data->sender_types = DB::table('sender_type')->where('branch_id',$branch_id)->selectRaw('id,name AS sender_type')->get();
        $data->business_types = DB::table('sender_business_types')->selectRaw('business_type')->get();
        $data->sender_statuses = DB::table('sender_statuses')->selectRaw('code as status_code, name AS status_name')->get();
        $data->sales_agents = DB::table('sales_agents AS sa')->where('branch_id',$branch_id)->selectRaw('sa.id,sa.name AS agent_name')->get();
        return $data;
    }

   function getTermsAndConditions($d){
      //$ss = getSessionInfo($d);
      //if(!$ss) return '#350'; //user not authenticated
      //if (!prn_allowed(2)) return '@'; //need permission to do this task
      //$branch_id = $ss->branch_id;

      return "Here some terms and condition text for Merchant";
   } 
}
