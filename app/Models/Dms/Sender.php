<?php

namespace App\Models\Dms;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\Dms\PublicStorage;
use App\Models\Dms\GeneralSettings;
use App\Models\DV;
use App\Models\UM;
use DB;
use Sanitizer;
use Carbon\Carbon;
use Config;
use Illuminate\Pagination\LengthAwarePaginator; 
use Illuminate\Support\Facades\Log;
class Sender //extends Model
{
    //use HasFactory;
    
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'merchant';
    //Merchant Regitration default options | senderDetaultOptions() | merchantDefaultOptions
    function getDefaultOptions(){
      //price_list_id =11 (Normal Condition)
      $data =(object)[
        'price_list_id'=>self::getDefaultPriceList()->id,
        'cod'=>0,
        'cod_fee'=>0
      ];
      return $data;
    }
    
    function __construct($id=null,$userInfo=null){
         $this->id =$id;
         $this->userInfo = $userInfo;
    }
    
    static function getDefaultPriceList(){
      $row = DB::table('price_list_names AS l')->where('is_default',1)->take(1)->selectRaw('id,name')->first();
      if($row) return $row;
      return (object)['id'=>null,'name'=>''];
    }
    function getDetails($id=null,$ss=null,$includeProfilePicture=false,$includeBankAccount=true){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
       $row = DB::table('sender as s')->selectRaw('s.id,s.code,s.name,s.name_kh,s.address,s.cod,s.cod_fee,s.price_list_id,s.phone_number,s.email,s.business_type,s.sender_type_id, (SELECT t.name FROM sender_type AS t WHERE t.id = s.sender_type_id LIMIT 1) AS sender_type,s.price_list_id,sales_agent_id')->where('s.branch_id',$branch_id)->where('s.id',$id)->first();
     if($row){
         //$accounts = self::bankAccounts($id,1);
         if ($includeBankAccount) $row->bank_accounts = self::bankAccounts($id,null); //isset($accounts[0])?$accounts[0]:null;
         if($includeProfilePicture) $row->image_url = PublicStorage::getProfilePhoto_url($ss->user_id);
         return $row; 
       } 
      return null;
    }

    static function details($id,$ss,$includeProfilePicture=false,$includeBankAccount=true){
      $branch_id = $ss->branch_id;    
      $row = DB::table('sender as s')->selectRaw('s.id,s.code,IFNULL(s.name,\'Your Name\') AS name,s.name_kh,s.address,s.cod,s.cod_fee,s.price_list_id,s.phone_number,s.email,s.business_type,s.sender_type_id, (SELECT t.name FROM sender_type AS t WHERE t.id = s.sender_type_id LIMIT 1) AS sender_type,s.sales_agent_id AS referrer_id, s.price_list_id,s.sales_agent_id,s.loc_lat,s.loc_lng')->where('s.branch_id',$branch_id)->where('s.id',$id)->take(1)->first();
      if (!$row) return null;
          //$accounts = self::bankAccounts($id,1);
          if($row->loc_lat ==0) $row->loc_lat = null;
          if($row->loc_lng ==0) $row->loc_lng = null;
          if ($includeBankAccount) $row->bank_accounts = self::bankAccounts($id);
          if($includeProfilePicture) $row->image_url = PublicStorage::getProfilePhoto_url($ss->user_id);
          return $row;
   }

    static function bankAccounts($id=0,$is_primary=null){
      $str_primary ="1=1";
      if($is_primary ===1 || $is_primary ===0) $str_primary ='is_primary ='.$is_primary;
      return DB::table('sender_bank_accounts AS a')->where('sender_id',$id)->whereRaw($str_primary)->select('id','is_primary','account_number','account_name','bank_name')->orderBy('is_primary','DESC')->get(); 
    }

    function getRandomNumbers($min, $max, $total) {
      $temp_arr = array();
      while(sizeof($temp_arr) < $total) $temp_arr[rand($min, $max)] = true;
      return $temp_arr;
    }

    //Check if a sender info exists based on the merchant's "name"
    function senderExists($uss,$name,$id) {
        $branch_id = $uss->branch_id;
        $str_id = $id > 0? 's.id <> '.$id : '1=1';
        $row  = DB::table('sender AS s')->where('s.branch_id',$branch_id)->where('s.name',$name)->whereRaw($str_id)->selectRaw('id')->take(1)->first();
        return $row? true:false;
    }

    function senderCodeExists($uss,$code,$id) {
        $branch_id = $uss->branch_id;
        $rows = [];
        if (!$code) return false;
        $str_id = $id > 0 ? 's.id <> '.$id : '1=1';
        $row = DB::table('sender AS s')->where('s.branch_id',$branch_id)->where('s.code',$code)->whereRaw($str_id)->selectRaw('s.id')->take(1)->first();
        return $row? true:false;
    }
 
      //getSenderAddress()
      function getVendorAddress($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $sender_id = isset($d->sender_id)? Sanitizer::sanitize($d->sender_id):0;
        $rows = DB::table('sender AS s')->where('branch_id',$branch_id)->where('id',$sender_id)->selectRaw("s.address")->limit(1)->get();
        foreach($rows as $row) return $row->address;
        return null;
     }
     
    // function getSenderDetails($sender_id){  
    //     $rows = DB::table('sender AS s')->where('s.id',$sender_id)->selectRaw('s.id,s.code,s.name,s.name_kh,s.status_code,s.phone_number,s.email, s.address,s.price_list_id,s.cod,s.cod_fee,s.adr_city_id, s.adr_district_id, s.adr_commune_id')->limit(1)->get();
    //     foreach($rows as $row) {
    //       $row->bank_accounts = DB::table('sender_bank_accounts AS acc')->where('sender_id',$sender_id)->selectRaw('acc.id,acc.is_primary,acc.bank_name, acc.account_number, acc.account_name')->get(); 
    //       return $row;
    //     }
    //      return null;
    // }  

    function newOTP($length=6)
    {
        return join('', array_map(function($value) { return $value == 1 ? mt_rand(1, 9) : mt_rand(0, 9); }, range(1, $length)));
    }

    function saveProfilePicture($photo_data,$file_type = null,$id=null,$ss=null){
      $id = $id?$id:$this->id;
      $ss = $ss?$ss:$this->userInfo;
      $sender = DB::table('sender as s')->where('id',$id)->selectRaw('id,branch_id,photo_file_name')->first();
      $delete_image = (!$photo_data || isImage($photo_data));
      if(!$sender)return DV::error('Merchant identity is not correct!');
      if($delete_image){
        PublicStorage::delete($ss->branch_id,'merchant','image',$sender->photo_file_name);
        DB::table('sender')->where('id',$id)->update(['photo_file_name'=>null]);
      }
      return PublicStorage::saveImage($ss->branch_id,self::$img_dir, null,$photo_data,null,['id'=>$id,'store'=>'sender.photo_file_name']);  
    }

    function deleteProfilePicture($id=null,$ss=null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $sender = DB::table('sender as s')->where('id',$id)->selectRaw('id,branch_id,photo_file_name')->first();
        if(!$sender) return DV::error('Merchant identity is not correct!');
        PublicStorage::delete($ss->branch_id,'merchant','image',$sender->photo_file_name);
        DB::table('sender')->where('id',$id)->update(['photo_file_name'=>null]);
        return DV::success();
    }

    static function resetCodes($branch_id,$prefix){
      $i = 1;
      $prefix =$prefix ?? 'HM';
      $branch_id = $branch_id ?? 1;
      $rows = DB::table('sender as s')->selectRaw('s.id,s.name')->orderByRaw('s.create_date')->get();
      foreach($rows as $row){
          $new_code = $prefix.$branch_id.formatNumber($i,5);
          DB::table('sender')->where('id',$row->id)->update(['code'=>$new_code]);
          DB::table('um_users')->where('official_id',$row->id)->where('user_class','merchant')->update(['official_code'=>$new_code]);
          $i++;
      }
      $x = DB::table('sender_code_control')->where('prefix',$prefix)->update(['last_id'=>$i]);
      if(!$x){
          DB::table('sender_code_control')->insert(['branch_id'=>$branch_id,'prefix'=>$prefix,'last_id'=>$i]);
      }
      return (object)[
        'status'=>'OK',
        'message'=>$i. ' merchant codes were reset',
        'last_id'=>$i
      ];
    }

    static function getProfilePicture($id){
      $row = DB::table('sender as s')->where('id',$id)->selectRaw('s.branch_id,s.photo_file_name')->first();
      if(!$row){
         return self::defaultImage(1);
      }
      $url = PublicStorage::getUrl($row->branch_id,'merchant','image').$row->photo_file_name;
      return validateUrl($url,'');
    }

    function verify_otp_preregister($arr = []){
      $d = (object)$arr;
      $phone_number = isset($d->phone_number)?$d->phone_number:null;
      $otp_code = isset($d->otp_code)?$d->otp_code:null;
      $app_id = Config::get('app.merchant_app_id');
      if (!$phone_number) return DV::error('Phone number cannot be empty'); 

      if (!$otp_code) return DV::error('The given otp code is empty'); 

      $exists = DB::table('temp_otp')->where('app_id',$app_id)->where('phone_number',$phone_number)->where('otp_code',$otp_code)->take(1)->exists();
      if ($exists) DB::table('temp_otp')->where('app_id',$app_id)->where('phone_number',$phone_number)->where('otp_code',$otp_code)->delete();
      return $exists;
    }
    
    /*** send_otp_preregister($d). $d = {'phone_number'} => send_otp_preregister() will check if the phone number is already in use, 
        if the phone_number not yet in use then create OTP in templory table "temp_otp" waiting to be verified (otp_code is deleted after verified correctly or 1 minute later)      
    ***/
    //api/register-send-otp
    function send_otp_preregister($arr = []){
      $d = (object)$arr;
      //Generate new 6-digit OTP code
      $otp_code = $this->newOTP(6); 
      //$app_id = isset($d->app_id)? Sanitizer::sanitize($d->app_id):null;
      $app_id = Config::get('app.merchant_app_id');
      //Make sure the app_id supplied is the Merchant Mobile App
      if (empty($app_id)) {
         return DV::error('App ID is not valid');
      }

      $branch_id =1; //1 = "HOU EXPRESS" // $this->getBranchByApp($app_id);
      $d->phone_number = isset($d->phone_number)? $d->phone_number:null;
      if (empty($d->phone_number)){
         return DV::error('Phone number cannot be empty');
      } 
      
      //Check if the phone_number is already in use
      $number_in_use = DB::table('um_users AS u')->where('app_id',$app_id)->where('login_name',$d->phone_number)->limit(1)->exists();
      if ($number_in_use) return DV::error('Phone number is already in use');
      $company_name = DB::table('um_branches as b')->where('branch_id',$branch_id)->take(1)->value('name');
      $company_name =$company_name ?$company_name :'យើងខ្ញុំ'; 
       //$text = get_settings_value($ss,'OTP_SMS_TEMPLATE','string'); //get sms template from settings storage table
       $text = 'សូមស្វាគមន៍មកកាន់ក្រុមហ៊ុន '.$company_name. '។​ លេខសំងាត់សំរាប់ការចុះឈ្មោះ​របស់អ្នកគឺ #'; //for faster 
       $text = str_replace('#',$otp_code,$text); //here
      
       $m_result = SMS::send($d->phone_number,$text,null); 
       if ($m_result->status ==='Error') 
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
 
     //Quick self register sender from Marchant mobile app
     //$d = {'name','phone_number','password','[email]','[address]'}
    //registerSender()| registerMerchant | Merchant Registration | api/register
    function registerSender($arr){
      $def_lang ='en';
      $branch_id =1; //1 = "HOUEXPRESS" // $this->getBranchByApp($app_id);

      $v_rule = [
        'name'=>'0|string|0-250',
        'business_type'=>'0|string|1-150',
        'phone_number'=>'0|phone|1-25',
        'email'=>'0|email',
        'password'=>'0|string|0-150',
        'address'=>'0|string|0-250'
      ];

      $res = validateObject($arr,$v_rule,true,['email'=>['@','-','.','_'],$def_lang,false,null]);
      if($res->error) return DV::error($res->error);
      $d = (object)$res->values;
      $d->phone_number = str_replace(' ','',$d->phone_number);

      $app_id = Config::get('app.merchant_app_id');     
      //Make sure the app_id supplied is the Merchant Mobile App
      if (!$app_id) return DV::error('App ID is not valid');  
 
      $sender_id= null;
      $sender_code = null;

      if(!isset($d->id)) $d->id = 0;
        //Optional parameters
          $d->adr_country_id = isset($d->adr_country_id)?Sanitizer::sanitize($d->adr_country_id):null;
          $d->adr_city_id = isset($d->adr_city_id)?Sanitizer::sanitize($d->adr_city_id):null;
          $d->adr_district_id = isset($d->adr_district_id)? Sanitizer::sanitize($d->adr_district_id):null;
          $d->email = isset($d->email)? Sanitizer::sanitize($d->email,'email'):null;
      if(!$d->name) {
        $d->name = $d->phone_number;
      }
   
     $ss = (object)['branch_id'=>$branch_id];

     $phone_err = $this->checkUniquePerson($branch_id,$d->phone_number,null);
     if ($phone_err) return DV::error( $phone_err);   

     if(!isset($d->name_kh)) $d->name_kh = $d->name;
     //start:: check phone number exists as login name
        $login_name = $d->phone_number;
        $existing_user = DB::table('um_users AS u')->where('login_name',$login_name)->selectRaw('login_name')->first();
        if($existing_user) return DV::error('Login name or phone number already exists'); 
     //end:: check if phone number exists as login name

     //getDefaultOptions() return object {'price_list_id','cod','cod_fee'}
       $def = $this->getDefaultOptions();
       $default_sender_type_id =2; // 2 = 'Normal', 1 = 'VIP' 
       $d->sender_type_id = isset($d->sender_type_id)? $d->sender_type_id:$default_sender_type_id;
          DB::table('sender')->insert([
              'branch_id'=>$branch_id,
              //'code'=>null
              'name'=>$d->name,
              'name_kh'=>$d->name_kh,
              'business_type'=>isset($d->business_type)?$d->business_type:'General',
              'sender_type_id'=>$d->sender_type_id,
              //'sender_type'=>'Normal',
              'status_code'=>'Active', //"Active"
              'address'=>$d->address,
              'cod'=>$def->cod,
              'cod_fee'=>$def->cod_fee,
              'price_list_id'=>$def->price_list_id,
              'adr_country_id'=>$d->adr_country_id,
              'adr_city_id'=>$d->adr_city_id,
              'adr_district_id'=>$d->adr_district_id,
              'phone_number'=>$d->phone_number,
              'email'=>$d->email,
              'create_user'=>'self',
              'create_date'=>getNowTime()
          ]); 

          $sender_id = DB::getPdo()->lastInsertId();

          if ($sender_id > 0) {
                $sender_code = $this->getNextSenderCode($ss); // formatNumber($sender_id,5);
                DB::table('sender')->where('id',$sender_id)->where('branch_id',$branch_id)->update(array(
                    'code'=>$sender_code
                ));

                //begin::create user profile in table umt_users
                       //$otp_code = $this->newOTP(6); 
                       $app_id = Config::get('app.merchant_app_id'); //'38DC051E122D11EC89909801A7B0D1FCH'; //merchant app_id
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
                      'create_user'=>'self',
                      'create_date'=>getNowTime(),
                      'create_uid'=>null
                    ]);

                   $d->user_id  = DB::getPdo()->lastInsertId();
                   //$this->UMModel->addRoleMember1($ss,$default_role_id,$d->user_id); 
                   DB::table('um_user_roles')->where('branch_id',$branch_id)->where('role_id',$default_role_id)->where('user_id',$d->user_id)->delete();
                   DB::table('um_user_roles')->insert(['branch_id'=>$branch_id,'user_id'=>$d->user_id,'role_id'=>$default_role_id,'app_id'=>$app_id,'is_primary_role'=>1]);
                //end::create user profile
                 //When merchant user is registerred successfully => create bank accounts
                 if ($d->user_id > 0) {
                    if (!isset($d->bank_accounts)) $d->bank_accounts = [];
                    if (!is_array($d->bank_accounts)) $d->bank_accounts = [];
                    $this->saveBankAccounts($d->bank_accounts,$sender_id,$ss);

                    //begin:: create login's session and access_token => to allow Merchant's auto login, after registration
                          //UM::setUserSession() is a static function and is the same as UM->createSession()
                          $user = DB::table('um_users AS u')->selectRaw('u.lang,u.user_class,u.official_id,u.hpwd, u.id,u.login_name, u.branch_id, u.full_name, u.status, u.is_locked,u.email,u.phone_number,u.otp_code')->where('u.login_name',$login_name)->where('u.app_id',$app_id)->first(); 
                          if(!$user) return DV::error('Merchant account was created but auto login failed');
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
                            $user = (object)['access_token'=>null,'sender_id'=>$sender_id,'sender_code'=>$sender_code];
                            return DV::error( $sess->error_message);
                          }
                  //end:: create login's session and access_token => to allow Merchant's auto login, after registration
                 }  
          } else {
             return DV::error('There was a problem in creating your user profile');
          }
         
    }
 
    //$arr ={'otp_code','login_name'}
    function activateSender_otp($arr = []){
        $d = (object)$arr;
        //$branch_id = $ss->branch_id;
        $otp_code = isset($d->otp_code)?$d->otp_code:null;
        //$user_id = $d->user_id;
        $login_name = isset($d->login_name)? $d->login_name:null;
        $rows = DB::table('um_users AS u')->where('login_name',$login_name)->selectRaw('u.otp_code')->take(1)->get();
        foreach($rows as $row){
          if ($row->otp_code ==$otp_code) {
            DB::table('um_users')->where('login_name',$login_name)->update(array('otp_code'=>null,'status'=>'active','is_locked'=>0));
            return DV::success();
          }else return DV::error('Incorrect otp code');

        }
         return DV::error('Could not find matching otp code');   
    }

    static function updateMerchantName($id,$name){
        DB::table('package')->where('sender_id',$id)->update(['sender_name'=>$name]);
        DB::table('order_receivers')->where('sender_id',$id)->update(['sender_name'=>$name]);
        DB::table('deleted_package')->where('sender_id',$id)->update(['sender_name'=>$name]);
        DB::table('archived_package')->where('sender_id',$id)->update(['sender_name'=>$name]);
        DB::table('um_users')->where('user_class','merchant')->where('official_id',$id)->update(['full_name'=>$name]);
        return null;
    }

    static function updateMerchantPhone($id,$phone_number){
      $user_id = UM::getUserId('merchant','official_id',$id);
      if($user_id){
        $res = UM::updatePhoneNumber($phone_number,$user_id);
        if($res->status =='Error') return $res->error_message;
      }
      DB::table('package')->where('sender_id',$id)->update(['sender_phone'=>$phone_number]);
      DB::table('order_receivers')->where('sender_id',$id)->update(['sender_phone'=>$phone_number]);
      DB::table('deleted_package')->where('sender_id',$id)->update(['sender_phone'=>$phone_number]);
      DB::table('archived_package')->where('sender_id',$id)->update(['sender_phone'=>$phone_number]);
      return null;
   }
    //saveSender()
    function save($arr=[],$ss=null){
      $ss = $ss ?? $this->userInfo;
      $branch_id = $ss->branch_id; 
      $v_rule =[
        'id'=>'0|identity=1',
        'lead_id'=>'0|number',
        'name'=>'1|string|0-100',
        'name_kh'=>'0|string|0-100',
        'sender_type_id'=>'1|positive|exists=sender_type.id',
        'business_type'=>'0|string|0-150',
        'email'=>'0|email',
        'address'=>'0|string|0-250',
        'phone_number'=>'1|phone|0-50',
        'sales_agent_id'=>'0|number',
        'adr_country_id'=>'0|number',
        'adr_city_id'=>'0|number',
        'adr_district_id'=>'0|number',
        'cod'=>'0|choice|0,1|default=0',
        'cod_fee'=>'0|number|default=0',
        'price_list_id'=>'0|number',
        'code'=>'0|string|0-25',
        'address_link'=>'0|string|500',
        //'loc_lat'=>'0|number|default=0',
        //'loc_lng'=>'0|number|default=0',
        'sales_agent_id'=>'0|number',
        'banks'=>'0|array',
        'bank_account_changed'=>'0|number|default=0',
        'photo'=>'0|image'
      ];
      $checkUnque = ["$branch_id|sender|name,phone_number,code|id=id|text=Sender or merchant already exists by name, phone number, or email"];
      //$address_map_chars = ['/', ':', ',', '!', '@', '?', '=', '&', '[', ']', '(', ')', '!', '.', '/', ':', '?', '=', '&', '#', '[', ']', '@', '!', '$', "'", '(', ')', '*', '+', ',', ';', '%'];
      $res = validateObject($arr,$v_rule,true,['address_link'=>GeneralSettings::$address_map_chars,'address'=>GeneralSettings::$address_map_chars,'email'=>GeneralSettings::$email_chars],$ss->lang,false,$checkUnque);
      if ($res->error) return DV::error($res->error);
      $id = $res->id;
      $inputs = $res->values;
      $d = (object)$inputs;
      $photo = $d->photo;

      $d->phone_number = str_replace(' ','',$inputs['phone_number']);
      $inputs['phone_number'] = $d->phone_number;
      if(!$d->phone_number) return DV::error('Phone number is required for valid merchant account');

      $pinned_address = $d->address_link;
      $address = $d->address;
      if (!$pinned_address){
        if($address){
           if (isURL($address)){
             $pinned_address = $address;
             $inputs['address']= '';
           }
        }
      }
      $pinned_location = self::getLocation($pinned_address);
      if ($pinned_location){
         $inputs['loc_lat'] = $pinned_location->latitude;
         $inputs['loc_lng'] = $pinned_location->longitude;
      }
      unset($inputs['address_link'],$inputs['bank_account_changed']);

      //Additional check
      if($inputs['cod_fee'] < 0) return DV::error("COD fee is not correct!");
      if ($this->senderCodeExists($ss,$inputs['code'],$id)) return DV::error('Merchant ID already exists');
      $phone_err = $this->checkUniquePerson($branch_id,$inputs['phone_number'],$id);
      if ($phone_err) return DV::error( $phone_err);   
       
      if(!isset($inputs['name_kh'])) $inputs['name_kh'] = $inputs['name'];
      if($inputs['cod_fee'] > 0) $inputs['cod'] =1;
      $bank_accounts = $inputs['banks'];
      unset($inputs['banks'],$inputs['photo']);
      $sender_created = !$id;
      $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));
      if($id > 0){
         $org_sender = DB::table('sender as s')->where('s.id',$id)->selectRaw('s.name,s.phone_number')->take(1)->first();
         if(!$org_sender) return DV::error('Failed to identify existing merchant for updating their information');
         if ($d->phone_number != $org_sender->phone_number){
              //Change merchant's phone number in tables "um_users","package","order_receivers", and then notify merchant Mobile App
              $change_phone_error = self::updateMerchantPhone($id,$d->phone_number);
              if( $change_phone_error) return DV::error($change_phone_error);
         }
         if ($org_sender->name != $d->name){
           //Change merchant's name in tables "um_users","package","order_receivers", and then notify Merchant mobile App
           $change_name_error = self::updateMerchantName($id,$d->name);
           if($change_name_error) return DV::error($change_name_error);
         }
      }
      $id = saveData($ss,'sender',['id'=>$id],$inputs,[],1);
      if($id > 0){
           $new_code = null;

           if($delete_prev_image){
            $file_name = DB::table('sender as s')->where('s.id',$id)->take(1)->value('s.photo_file_name');
            if($file_name) PublicStorage::delete($branch_id,self::$img_dir,'image',$file_name);
            DB::table('sender as s')->where('s.id',$id)->update(['photo_file_name'=>null]);
           }
           PublicStorage::saveImage($branch_id,self::$img_dir,null,$photo,null,['id'=>$id,'store'=>'sender.photo_file_name']);  
           if ($sender_created){
              $new_code = $this->getNextSenderCode($ss); // formatNumber($sender_id,5);
              //$inputs['code'] = $new_code;
              DB::table('sender')->where('id',$id)->update(['code'=>$new_code]);
           }
           $can_update_bank_info = false;
           if(!$id) 
             $can_update_bank_info = true;
           else if (UM::allowed(285)){
              $can_update_bank_info = true;
           }
           if ($can_update_bank_info) $this->saveBankAccounts($bank_accounts,$id,$ss);
           UM::updateUserByOfficialId($id,['full_name'=>$inputs['name']]);
           $inputs['id']= $id;
           $info_message = '';
           if($d->bank_account_changed){
                $info_message = $can_update_bank_info? '':'You do not have permission to change merchant\'s bank account information';
           }
           return DV::depends(1,['sender'=>$inputs,'id'=>$id,'info_message'=>$info_message]);
           //return DV::success(['sender_id'=>$sender_id,'code'=>$sender_code]);
      }
      return DV::error('Something went wrong in saving sender profile');
    }
 
    function checkUniquePerson($branch_id,$phone_number,$id=null){
      $str_id ="1=1";
      if(!$phone_number) return 'Phone number cannot be empty';
      if ($id>0) $str_id="s.id <> $id";
      $x = DB::table('sender as s')->where('s.branch_id',$branch_id)->where("s.phone_number",$phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
      if ($x) return 'Phone number "'.$phone_number.'" has been used by another registered merchant';
      $x = DB::table('driver as s')->where('s.branch_id',$branch_id)->where("s.phone_number",$phone_number)->select('id')->take(1)->exists();
      if($x) return 'Phone number "'.$phone_number.'" has been used by a driver';
      $x = DB::table('sales_agents as s')->where('s.branch_id',$branch_id)->where("s.phone_number",$phone_number)->select('id')->take(1)->exists();
      if($x) return 'Phone number "'.$phone_number.'" has been used by a sales personnel';
      return null;
    }
 
    //updateSenderProfile() is used as api by Merchant mobile app to update merchant's profile
    //$d = {'name','name_kh','phone_number','address','business_type','bank_accounts'=> [{'account_number','account_name','bank_name'},...{}] }
    function updateProfile($arr,$id=null,$ss=null) {
      $ss = $ss ?? $this->userInfo;
      $id =$id ?? $this->id;
      $d = (object)$arr;  
      $branch_id = $ss->branch_id;
      
      $res = validateObject($arr,['name'=>'1|string|1-150','code'=>'0|string|0-25','name_kh'=>'0|string|0-150','business_type'=>'0|string|0-150','sender_type_id'=>'1|number|exists=sender_type.id','address'=>'0|string|0-250','loc_lat'=>'0|number','loc_lng'=>'0|number'],true,[],$ss->lang,false,[]);
      if($res->error) return DV::error($res->error);
      $id = $res->id;
      $inputs = $res->values;
      $name = $inputs['name'];
    
      if ($this->senderExists($ss,$name,$id)) return DV::error('It seems this name is already in use by another vendor');  

      if ($this->senderCodeExists($ss,$inputs['code'],$id)) return DV::error('Merchant ID already exists');  
 
      if(!isset($inputs['name_kh'])) $inputs['name_kh'] = $name;
      $id= saveData($ss,'sender',['id'=>$id],$inputs,[],1);
      if($id>0){
          return DV::success(['sender_id'=>$id]);
      }else return DV::error('Something went wrong in saving Sender profile');
    }
  
    function getNextSenderCode($uss,$len =4){
      $branch_id = $uss->branch_id;
      $prefix ='HM';
      $str_prefix = $prefix? 'prefix =\''.$prefix.'\'' : '2=2';
      $row = DB::table('sender_code_control AS c')->where('branch_id',$branch_id)->whereRaw($str_prefix)->selectRaw('TRIM(c.prefix) AS prefix,c.last_id')->take(1)->first();
      if($row) {
          $num = $row->last_id;
          $prefix = trim($row->prefix);
          $num +=1;
          DB::table('sender_code_control')->where('branch_id',$branch_id)->whereRaw($str_prefix)->update(['last_id'=>$num]);
          return $prefix.$branch_id.formatNumber($num,$len);
      }
      DB::table('sender_code_control')->insert(array('branch_id'=>$branch_id,'last_id'=>1,'prefix'=>$prefix));
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
 
  //Add or update bank accounts. This is used for back end profile update
  function saveBankAccounts($banks=[],$sender_id = null,$ss=null){
      $ss = $ss ?? $this->userInfo;
      $sender_id = $sender_id ?? $this->id;
      $branch_id = $ss->branch_id;

      $success_cnt =0;
      $failed_cnt =0;
      $cs = (array)$banks;
      $i=0;
      $c =null;
      do{
        if (!isset($cs[$i])) break;
        $c = (object)$cs[$i];
          $err = null;
          $c->is_primary = isset($c->is_primary)?$c->is_primary:0;
          $c->bank_name = isset($c->bank_name)?Sanitizer::sanitize($c->bank_name):null;
          $c->account_number = isset($c->account_number)?Sanitizer::sanitize($c->account_number):null;
          $c->account_name = isset($c->account_name)?Sanitizer::sanitize($c->account_name):null;
          $c->id = isset($c->id)?Sanitizer::sanitize($c->id):0;

          if (empty($c->bank_name)) 
             $err ='bank name cannot be empty';
           else if (empty($c->account_number)) 
             $err ='Account number cannot be empty';
            else if (empty($c->account_name)) 
              $err ='Account name cannot be empty';
             
              if (!$err) {
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
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
        $id = isset($d->id)?$d->id:null;
        $sender_id = isset($d->sender_id)?$d->sender_id:null;
        $bank_name = isset($d->bank_name)?$d->bank_name:null;
        $account_number = isset( $d->account_number)?$d->account_number:null;
        $account_name =isset( $d->account_name)? $d->account_name:null;
        $is_primary = isset($d->is_primary)?$d->is_primary:1;

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
       if($is_primary){
         $id = DB::table('sender_bank_accounts AS ac')->where('ac.is_primary',1)->take(1)->value('id');
       }
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
  function updateBankAccount($arr=[],$id=null, $ss=null){
    $ss =$ss ?? $this->userInfo;
    $id = $id ?? $this->id;
    $branch_id = $ss->branch_id;
    $d = (object)$arr;
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
    return null;
  }

  //Add bank accounts to Sender profile
  //$d = {'sender_id','bank_accounts'=> [{bank_name,account_number, account_name},...]}
  function addBankAccounts($bank_accounts=[],$id=null, $ss=null){
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;
    $branch_id = $ss->branch_id;
    $result = (object)array('success_count'=>0, 'failed_count'=>0,'status'=>'OK','error_message'=>null);
 
    if (!isset($bank_accounts[0])) return DV::error('No account data provided');
    $rows = DB::table('sender_bank_accounts AS b')->where('b.branch_id',$branch_id)->where('b.sender_id',$id)->selectRaw('COUNT(b.id) AS cnt')->get();
    $cnt = 0;
    foreach($rows as $row) $cnt = $row->cnt;
    
    if ($cnt >2) return DV::error('Only two bank accounts are allowed for each merchant');  
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
        $c->bank_name = isset($c->bank_name)?Sanitizer::sanitize($c->bank_name):null;
        $c->account_number = isset($c->account_number)?Sanitizer::sanitize($c->account_number):null;
        $c->account_name = isset($c->account_name)?Sanitizer::sanitize($c->account_name):null;
        $c->id = isset($c->id)?Sanitizer::sanitize($c->id):0;

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
       return DV::error("The provided bank accounts information were not acceptable, so there were no bank accounts created");
    } else {
       return DV::success(['success_count'=>$success_cnt]);
    } 
  }
 
  function getBankInfo($id=null,$ss= null){
      $ss = $ss ?? $this->userInfo;
      $id = $id ?? $this->id;
      $branch_id = $ss->branch_id;
      $rows = DB::table('sender_bank_accounts AS b')->where('b.branch_id',$branch_id)->where('b.sender_id',$id)->where('b.is_primary',1)->selectRaw("b.id,b.bank_name,b.account_number,b.account_name")->limit(1)->get();
      foreach($rows as $row) return $row;
      return (object)['bank_name'=>'','account_number'=>'','account_name'=>'Bank account not found!'];
  }

  //delete bank account. $d= {'sender_id','bank_name','account_number'}
  function deleteBankAccountByNumber($d,$id=null,$ss=null) {
      $ss = $ss ?? $this->userInfo;
      $id = $id ?? $this->id;
      $branch_id = $ss->branch_id;
    if(!isset($d->sender_id)) $d->sender_id =0;
    $bank_name = isset($d['bank_name'])?$d['bank_name']:null;
    $account_number = isset($d['account_number'])?$d['account_number']:null;
    DB::table('sender_bank-accounts')->where('branch_id',$branch_id)->where('sender_id',$id)->where('bank_name',$bank_name)->where('account_number',$account_number)->delete();
    return null;
  } 

  static function getOutstandingBalanceError($id){
     $row = DB::table('package as p')->join('sender as s','s.id','=','p.sender_id')->where('p.status_id',8)->where('s.id',$id)->whereRaw('IFNULL(p.sender_pmt_status_id,0) =0')->selectRaw('COUNT(p.id) AS item_count,SUM(IFNULL(p.sender_total,0)) AS amount')->get()->first();
     if(!$row) return null;
     if ($row->item_count > 0 ) return 'មិន​អាច​លុប ឬ​បិទ​គណនី​នេះ​បាន​ទេ ព្រោះ​មាន​កញ្ចប់ '.$row->item_count.' ដែល​មិន​ទាន់​បាន​ទូទាត់​ប្រាក់';
     return null;
  }

  function updateStatus($status_code,$id=null,$ss=null){
    $ss = $ss?$ss:$this->userInfo;
    $id = $id?$id:$this->id;
    if(in_array(strtolower($status_code),['inactive','locked','disabled'])){
      $err = self::getOutstandingBalanceError($id);
      if($err) return DV::error($err);
     }
    $x = DB::table('sender')->where('id',$id)->update([
        'status_code'=>$status_code
    ]);
    //if(!$x) return DV::error('It seems that provided merchant identity does not exist');
    $um = new \App\Models\UM();
    $user_id = DB::table('um_users')->where('official_id',$id)->take(1)->value('id');
    $res = $um->setUserStatus($status_code,$user_id);
    return $res;
  }

  function deleteMobileAccount($user_class,$official_id){
    $user_id = null;
    $official_id = $official_id || -1;
    $row = DB::table('um_users as u')->where('u.official_id',$official_id)->where('user_class',$user_class)->selectRaw('u.login_name, u.id as user_id')->take(1)->first();
    if(!$row) return false;
    $user_id = $row->user_id;
    $um = new UM();
    $um->deleteUser($user_id);
    return true;
  }
  
  function updateMobileAccountStatus($user_class,$official_id, $status_code ='inactive'){
    $user_id = null;
    $row = DB::table('um_users as u')->where('u.official_id',$official_id)->where('user_class',$user_class)->selectRaw('u.login_name, u.id as user_id')->take(1)->first();
    if(!$row) return false;
    $user_id = $row->user_id;
    $um = new \App\Models\UM();
    $um->setUserStatus($user_id,$status_code);
    return true;
  }

  function deleteSpecial($id=null,$ss=null){
    $id =$id?$id:$this->id;
    $ss = $ss?$ss:$this->userInfo;
    $pg = new \App\Models\Package();
    $pg_rows = DB::table('package as p')->where('p.sender_id',$id)->selectRaw('p.id')->get();
    foreach($pg_rows as $row){
      $pg->deleteSpecial($row->id,$ss);
    }

    $tables = ['sender_id'=>['package','order_receivers','sender_price_list','deleted_package','sender_bank_accounts','sender_cod_charges','sender_exchange_rates']];
    foreach($tables as $key => $tbl_list){
       foreach($tbl_list as $table){
          try{
            DB::table($table)->where($key,$id)->delete();
          }catch( \Exception $e){
            Log::error('Error sanitizing string at method Sender->deleteSpecial('.$id.') '.": {$e->getMessage()}\r\n{$e->getTraceAsString()}");
          }
         
       }
    }
     
    /** delete Receipt transactions */
    DB::statement(DB::raw('DELETE FROM receipt_breakdowns WHERE trx_id IN (SELECT trx_id FROM cash_receipts AS r WHERE r.payer_type = \'Merchant\' AND r.payer_id = '.$id.' )'));
    DB::statement(DB::raw('DELETE FROM cash_receipts WHERE trx_id IN (SELECT trx_id FROM cash_receipts AS r WHERE r.payer_type = \'Merchant\' AND r.payer_id = '.$id.' )'));
    
    /** delete Disbursement transactions */
    DB::statement(DB::raw('DELETE FROM disbursement_breakdowns WHERE trx_id IN (SELECT trx_id FROM cash_disbursements AS r WHERE r.payee_type = \'Merchant\' AND r.payee_id = '.$id.' )'));
    DB::statement(DB::raw('DELETE FROM cash_disbursements WHERE trx_id IN (SELECT trx_id FROM cash_disbursements AS r WHERE r.payee_type = \'Merchant\' AND r.payee_id = '.$id.' )'));
     
   
    DB::table('sender')->where('id',$id)->delete();
    DB::table('um_users')->where('official_id',$id)->where('user_class','merchant')->delete();
    return DV::depends(1,['id'=>$id]);
  }

  function delete($id=null,$ss = null){
      $id =$id?$id:$this->id;
      $ss = $ss?$ss:$this->userInfo;
      $branch_id = $ss->branch_id;
      $err = self::getOutstandingBalanceError($id);
      if($err) return DV::error($err);

      if ($this->sender_in_use($ss,$id)){
         DB::table('sender')->where('id',$id)->update(['status_code'=>'inactive']);
         $this->updateMobileAccountStatus('merchant',$id,'inactive');
         return DV::success(['action'=>'deactivated']);
      }else{
        DB::table('sender_bank_accounts')->where('branch_id',$branch_id)->where('sender_id',$id)->delete();
        DB::table('sender_base_price')->where('branch_id',$branch_id)->where('sender_id',$id)->delete();
        DB::table('sender_cod_charges')->where('branch_id',$branch_id)->where('sender_id',$id)->delete();
        //$sender =  self::getSenderProp($id,"phone_number");
        DB::table('sender')->where('branch_id',$branch_id)->where('id',$id)->delete();
         //delete data from table "um_users" and "um_user_roles"
         $this->deleteMobileAccount('merchant',$id);
         return DV::success(['action'=>'deleted']);
      }
  }
  
  function setPriceList($price_list_id,$id=null,$ss =null){
    $ss = $ss ?? $this->userInfo;
    $id = $id ?? $this->id;
    $branch_id = Sanitizer::sanitize($ss->branch_id);
    $p = getDataRow('price_list_names',["id"=>$price_list_id],"id,name");
    if(!$p) return DV::error("Price list ID is not valid");
    $p_name = $p->name;
    DB::table('sender')->where('id',$id)->update(array(
    'price_list_id'=>$price_list_id));
    return DV::success(['list_name'=>$p_name,'list_id'=>$price_list_id]);
}
 
 function getBankAccounts($id=null,$ss=null){
    $id = $id?$id:$this->id;
    //$ss = $ss?$ss:$this->userInfo;
    return self::bankAccounts($id);
  }
  
 //return senderInfo (name, name_kh, phone_number, address,email) to Merchant mobile app
 //when Merchant tries to update their profile info
 function getProfileInfo($d) {
  $ss = UM::getUserInfoByToken($d);
  if ($ss->status_code !==200) return $ss; //user not authenticated
   //need permission to do this task
  $branch_id = $ss->branch_id;
  $sender_id = isset($d->sender_id)?$d->sender_id:0;
    /***
      $users = DB::table('users')
          ->join('contacts', 'users.id', '=', 'contacts.user_id')
          ->join('orders', 'users.id', '=', 'orders.user_id')
          ->select('users.*', 'contacts.phone', 'orders.price')
          ->get();  
      ***/
      $branch_id =  $branch_id? $branch_id:0;
      
      $str_topic_general = $branch_id.topic_prefix('merchant')."general";
      $str_topic_private = $branch_id.topic_prefix('merchant')."private$sender_id";
    $rows = DB::table('sender as s')->selectRaw("s.id, $branch_id AS branch_id, '$str_topic_general' AS notif_topic_general, '$str_topic_private'  AS notif_topic_private, s.name,s.name_kh,s.email,s.phone_number,s.address,s.cod,s.cod_fee,s.price_list_id, (SELECT `name` FROM price_list_names WHERE id = s.price_list_id LIMIT 1) AS price_list_name")->where('s.branch_id',$branch_id)->where('s.id',$sender_id)->limit(1)->get();
    //  foreach($rows as $row){
    //    $row->bank_accounts = DB::table('sender_bank_accounts AS acc')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->selectRaw('acc.id,acc.is_primary,acc.bank_name, acc.account_number, acc.account_name')->get(); 
    //    return $row;
    //  } 
    foreach($rows as $row){
      $row->image_url = PublicStorage::getProfilePhoto_url($ss->user_id);
      return $row;
    }
    return null; 
}

 static function list_all($arr,$ss){
  $d = (object)$arr;
  $branch_id =$ss->branch_id;
 
  $status = isset($d->status_code)?$d->status_code:'active';
  //$sender_type_id = isset($d->sender_type_id)? $d->sender_type_id:null;
  $business_type = isset($d->business_type)?$d->business_type:null;
  $search_value = isset($d->search_value)?$d->search_value:null;
  $sales_agent_id = isset($d->sales_agent_id)?$d->sales_agent_id:-1;
  $str_agent = '12=12';
  if ($sales_agent_id > 0 || $sales_agent_id <-1) $str_agent = 's.sales_agent_id ='.$sales_agent_id; 
  //$str_sender_type = null;
  $str_business_type ='1=1';
  $str_status ='3=3'; // Active, Inactive
  $str_search ='2=2';
  //$str_agent = null;

  if ($search_value) 
  {
    $search_value = escape_like_str($search_value);
    $str_search = "(s.code ='$search_value' OR s.name LIKE '%". $search_value."%' OR s.phone_number ='".$search_value."' )";
  }else{
     //if($sender_type_id>0) $str_sender_type ="AND s.sender_type_id ='".Sanitizer::sanitize($sender_type_id)."' ";
     if($business_type) { 
       $business_type = escape_like_str($business_type);
       $str_business_type ='s.business_type LIKE \'%'.$business_type.'%\'';
    }
     if(in_array(strtolower($status),['active','inactive'])) $str_status = 's.status_code =\''.$status.'\'';
   }
   $select_referrer_name = ',(SELECT r.`name` FROM sales_agents as r WHERE r.id = s.sales_agent_id LIMIT 1) AS referrer_name'; 
   $query = DB::table('sender as s')->selectRaw('s.branch_id,s.id,s.code,s.status_code,s.photo_file_name,s.name,s.name_kh,s.address,s.phone_number,s.price_list_id, getPriceListName(s.price_list_id) AS price_list_name,s.cod,s.cod_fee,s.email,s.business_type,s.address,s.sender_type_id, (SELECT t.name FROM sender_type AS t WHERE t.id = s.sender_type_id LIMIT 1) AS sender_type,s.sales_agent_id AS referrer_id '.$select_referrer_name.',s.create_user,formatTime(s.create_date) AS created_at')->where('s.branch_id',$branch_id)->whereRaw($str_agent)->whereRaw($str_search)->whereRaw($str_status)->whereRaw($str_business_type)->orderBy('s.id','DESC');
   $rows = $query->get();
   foreach($rows as $row){
     $row->image_url = '';
     $row->bank_accounts = self::bankAccounts($row->id,null);
     $row->mobile_login = \App\Models\UM::getAccountInfo($row->id,'official_id','merchant');
     if($row->photo_file_name) $row->image_url = PublicStorage::getUrl($row->branch_id,'merchant','image').$row->photo_file_name;
     unset($row->photo_file_name);
     if(!$row->image_url) $row->image_url =self::defaultImage($ss->branch_id);
   }
   return $rows;
  }
 
   /** return Sender List paginated */
   static function list($arr,$ss){
    $d = (object)$arr;
    $branch_id =$ss->branch_id;

    $current_page =isset($d->current_page)?$d->current_page:1;
    $per_page =isset($d->per_page)?$d->per_page:10;
    if(!is_numeric($current_page)) $current_page=1;
    $skip_rows = ($current_page -1) * $per_page;

    $status = isset($d->status_code)?$d->status_code:'active';
    //$sender_type_id = isset($d->sender_type_id)? $d->sender_type_id:null;
    $business_type = isset($d->business_type)?$d->business_type:null;
    $search_value = isset($d->search_value)?$d->search_value:null;
    $sales_agent_id = isset($d->sales_agent_id)?$d->sales_agent_id: null;
    $str_agent = '11=11';
    /** $sales_agent_id = -1 means "To query merchants who are not referred by any sales agent " 
     *  $sales_agent_id = null or zero => means query merchants either refered by agent or no referrer
    */
    if ($sales_agent_id ==-1) $str_agent = 's.sales_agent_id IS NULL';
    else if ($sales_agent_id > 0) $str_agent = 's.sales_agent_id ='.$sales_agent_id; 
    //$str_sender_type = null;
    $str_business_type ='1=1';
    $str_status ='3=3'; // Active, Inactive
    $str_search ='2=2';
    //$str_agent = null;

    if ($search_value) 
    {
      $search_value = escape_like_str($search_value);
      $str_search = "(s.code ='$search_value' OR s.name LIKE '%". $search_value."%' OR s.phone_number ='".$search_value."' )";
    }else{
       //if($sender_type_id>0) $str_sender_type ="AND s.sender_type_id ='".Sanitizer::sanitize($sender_type_id)."' ";
       if($business_type) { 
         $business_type = escape_like_str($business_type);
         $str_business_type ='s.business_type LIKE \'%'.$business_type.'%\'';
      }
       if(in_array(strtolower($status),['active','inactive'])) $str_status = 's.status_code =\''.$status.'\'';
     }
     $select_referrer_name = ',(SELECT r.`name` FROM sales_agents as r WHERE r.id = s.sales_agent_id LIMIT 1) AS referrer_name'; 
     $query = DB::table('sender as s')->selectRaw('s.branch_id,s.id,s.code,s.status_code,s.photo_file_name,s.name,s.name_kh,s.address,s.phone_number,s.price_list_id, getPriceListName(s.price_list_id) AS price_list_name,s.cod,s.cod_fee,s.email,s.business_type,s.address,s.sender_type_id, (SELECT t.name FROM sender_type AS t WHERE t.id = s.sender_type_id LIMIT 1) AS sender_type,s.sales_agent_id AS referrer_id '.$select_referrer_name.',s.create_user,formatTime(s.create_date) AS created_at')->where('s.branch_id',$branch_id)->whereRaw($str_agent)->whereRaw($str_search)->whereRaw($str_status)->whereRaw($str_business_type)->orderBy('s.id','DESC');
     
     $count_query = clone $query;
     $count = $count_query->count('s.id');
     $rows = $query->skip($skip_rows)->take($per_page)->get();
     foreach($rows as $row){
       $row->image_url = '';
       $row->bank_accounts = self::bankAccounts($row->id,null);
       $row->mobile_login = UM::getAccountInfo($row->id,'official_id','merchant');
       if($row->photo_file_name) $row->image_url = PublicStorage::getUrl($row->branch_id,'merchant','image').$row->photo_file_name;
       unset($row->photo_file_name);
       if(!$row->image_url) $row->image_url =self::defaultImage($ss->branch_id);
     }
    
     return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
  }
 
   function reverseToLead($id=null,$ss=null){
     $id = $id ?? $this->id;
     $ss = $ss ?? $this->userInfo;
     $sender = DB::table('sender as s')->where('id',$id)->selectRaw('s.id,s.status_code,s.lead_id,s.sales_agent_id')->first();
     if(!$sender) return DV::error('Merchant identity is not valid');
     $lead = DB::table('sender as s')->join('leads as l','s.lead_id','=','l.id')->where('l.id',$sender->lead_id)->selectRaw('l.id,l.name')->first();
     if(!$lead){
      $msg = $sender->lead_id > 0? 'The lead or prospect does not exist or has been deleted': 'The merchant does not have any referrer'; 
      return DV::error($msg);
     } 
     $row = DB::table('package as p')->where('p.sender_id',$sender->id)->selectRaw('id')->take(1)->first();
     if($row) return DV::error('The merchant cannot be reversed to be a lead or prospect because there has been some packages booked already');
     $res = $this->deleteSpecial($id);
     DB::table('leads')->where('id',$sender->lead_id)->update([
         'status_id'=>2,
         'update_uid'=>$ss->user_id,
         'update_user'=>$ss->full_name,
         'update_date'=>getNowTime()
     ]);
     if($res->status_code ==200){
       $des = $ss->full_name.' reversed merchant back to be a lead (change status back to In Review) at '.date('d M Y H:i', strtotime('now'));
       \App\Models\Lead::trackStatus($ss,$sender->lead_id,2,$des);
       return DV::depends(1);
     }
     else return DV::error($res->error_message);
  }

  static function defaultImage($branch_id){
    return PublicStorage::getUrl($branch_id,'default','image').'default_merchant.png';
  }

   //static method getSenderProp($sender_id,$prop)
   static function getSenderProp($id,$prop){
      return DB::table('sender')->where('id',$id)->selectRaw($prop)->take(1)->first();
   }
 
   /** returns object {"latitude","longitude"} */
   static function getLocation($googleMapLink) {
    if(!$googleMapLink) return false;
    // Define regular expression patterns for both types of Google Maps links
    $patterns = [
        '/@([-0-9.]+),([-0-9.]+)/',  // Matches links with @latitude,longitude
        '/\/place\/([-0-9.]+),([-0-9.]+)/'  // Matches links with /place/latitude,longitude
    ];

    foreach ($patterns as $pattern) {
        // Perform a regular expression match and return the result if successful
        if (preg_match($pattern, $googleMapLink, $matches)) {
            return (object)['latitude' => $matches[1], 'longitude' => $matches[2]];
        }
    }
    // Return false if no match is found
    return false;
}

   //Called by merchant mobile app to update user profile quickly
   function updateProfile_mobile($arr = [],$id= null,$ss =null){
        $ss =$ss?$ss:$this->userInfo;
        $id = $id?$id:$this->id; 
        $branch_id = $ss->branch_id;
        $v_rule = [
          'name'=>'1|string|1-250',
          'phone_number'=>'1|phone',
          'email'=>'0|email|0-100',
          'address'=>'0|string|0-300',
          'address_link'=>'0|string|0-800',
          'business_type'=>'0|string|0-150|default=General'
        ];
        $address_map_chars = GeneralSettings::$address_map_chars; 
        //$address_map_chars = ['/', ':', ',', '!', '@', '?', '=', '&', '[', ']', '(', ')', '!', '.', '/', ':', '?', '=', '&', '#', '[', ']', '@', '!', '$', "'", '(', ')', '*', '+', ',', ';', '%'];
        $res = validateObject($arr,$v_rule,true,['address_link'=>$address_map_chars,'address'=>$address_map_chars],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object)$inputs;
        $pinned_address = $d->address_link;
        $pinned_location = self::getLocation($pinned_address);
        if ($pinned_location){
           $inputs['loc_lat'] = $pinned_location->latitude;
           $inputs['loc_lng'] = $pinned_location->longitude;
        }
        unset($inputs['address_link']);
        $phone_err = self::checkUniquePerson($branch_id,$d->phone_number,$id);
        if ($phone_err) return DV::error($phone_err);
        if ($this->senderExists($ss,$d->name,$id)) return DV::error('It seems this name is already in use by another merchant');  
        $org_sender = self::getSenderProp($id,'phone_number');
        $org_phone_number = $org_sender? $org_sender->phone_number : null;
        if ($org_phone_number && $d->phone_number && ($org_phone_number != $d->phone_number)){
            unset($inputs['phone_number']);
        }
        $id = saveData($ss,'sender',['id'=>$id],$inputs,[],1,false);
        if($id){
          $sms_err = null;
          //Check if merchant changed his phoner number   
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
        }else return DV::error('Problem in updating merchant profile');
   }
  
    static function getFormOptions($id,$ss){   
        $branch_id = $ss->branch_id;
        $sender_details = null;
        if($id>0) $sender_details = self::details($id,$ss);
        $data= (object)[];
        $data->sender = $sender_details;
        $data->branches = [(object)['id'=>1,'branch_name'=>'Head Quarter']];
        $data->sender_types = DB::table('sender_type')->where('branch_id',$branch_id)->selectRaw('id,name AS sender_type')->get();
        $data->business_types = DB::table('sender_business_types')->selectRaw('business_type AS code,business_type')->get();
        $data->sender_statuses = DB::table('sender_statuses')->selectRaw('code as status_code, name AS status_name')->get();
        $data->sales_agents = DB::table('sales_agents AS sa')->where('branch_id',$branch_id)->selectRaw('sa.id,sa.name AS agent_name')->get();
        $data->price_list = DB::table('price_list_names AS l')->where('branch_id',$branch_id)->selectRaw('l.id,l.name')->get();
        return $data;
    }
}
