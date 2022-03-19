<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\SMS;
use App\Models\Notifier;
use App\Models\PickupRequest;
use App\Models\Package;
use App\Models\Sender;
use App\Models\Driver;
use App\Models\Price;
use App\Models\DeliveryZone;
use App\Models\DeliveryTrip;
use App\Models\CompanyProfile;
use App\Models\MobileAppSettings;
use App\Models\SystemSetting;
use App\Models\Promotion;
use App\Models\Report;
use App\Models\PublicStorage;
use App\Models\PendingTask;
use App\Models\PaymentTransaction;
use App\Models\DV;

//use App\Notification\OrderCreated;
//use App\Events\onDriverAssigned;

class ApiController extends Controller
{
    protected $pickupRequestModel;
    protected $senderModel;
    protected $packageModel;
    protected $deliveryZoneModel;
    protected $priceModel;
    protected $tripModel;
    protected $mobileAppSettingsModel;
    protected $reportModel;
    protected $companyModel;
    protected $transaction;
 
    public function __construct(){
        $this->pickupRequestModel = new PickupRequest();
        $this->senderModel = new Sender();
        $this->driverModel = new Driver();
        $this->packageModel = new Package();
        $this->priceModel = new Price();
        $this->tripModel = new DeliveryTrip();
        $this->deliveryZoneModel = new DeliveryZone();
        $this->UMModel = new UM();
        $this->reportModel = new Report();
        $this->companyModel = new CompanyProfile();
        $this->transaction= new PaymentTransaction();
        $this->mobileAppSettingsModel = new MobileAppSettings();
    }

    function externalLogin(Request $request){
        $app_id = $request->app_id;
        $login_name = $request->login_name;
        $pwd = $request->password; 

        $result = $this->UMModel->verifyUser($app_id,$login_name,$pwd);
        if($result->status =='OK'){
            //extendUserDetails() is to extend user's details. if $user->user_class =='merchant' => add props such as (sender_id,sender_code,sender_name,email,sender_type)
            //if $user->user_class='driver'=> add additional props such as (driver_id,driver_code,emp_type,driver_name,national_id,sex)
            $result->user = $this->UMModel->extendUserDetails($result->user);  
            
            $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
            // Encrypt acc token "acc_tk_dms"
            $result->user->access_token = $encrypter->encrypt($result->user->access_token,false); //FALSE => to avoid serialization issue in decryption
            $result->user->image_url = PublicStorage::getProfilePhoto_url($result->user->branch_id, $result->user->user_class, $result->user->official_id); 
         }
        return $result;
    }
    
    function updateSenderProfile(Request $request){
      $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
      if ($sender =='#350') return makeJsonResponse(null,350);
      $request->sender_id = $sender->id;
      $request->decrypted =1;
      //$request = {'name','name_kh','business_type','address','bank_accounts'=> [{'account_number','account_name','bank_name'},...{}] }
      $r = $this->senderModel->updateSenderProfile($request);
      if($r =='#350') 
        return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }

    function saveProfilePicture_driver(Request $request){
      $driver = $this->UMModel->getUserInfoByToken($request,'driver');  
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      $request->decrypted =1;

      $r = PublicStorage::saveDriverProfilePhoto($driver->branch_id,$driver->id,$request->file_type,$request->photo_data);
      //$r = $this->senderModel->saveProfilePicture($request);
      if($r =='#350') 
        return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
        return makeJsonResponse($r);
    }

    //$d = {'trx_type','trx_id','file_type','photo_data'}
    function saveTransactionPhoto_sender(Request $request){
      $user_class = "merchant";
      $user = $this->UMModel->getUserInfoByToken($user_class);
      if ($user =='#350') return makeJsonResponse(null,350);
      $request->decrypted =1;
      $trxModel = new PaymentTransaction();
      $r = $trxModel->savePhoto($request);
      return makeJsonResponse($r);
    }

      //$d = {'trx_type','trx_id','file_type','photo_data'}
      function saveTransactionPhoto_driver(Request $request){
        $user_class = "driver";
        $user = $this->UMModel->getUserInfoByToken($user_class);
        if ($user =='#350') return makeJsonResponse(null,350);
        $request->decrypted =1;
        $trxModel = new PaymentTransaction();
        $r = $trxModel->savePhoto($request);
        return makeJsonResponse($r);
      }

    function saveProfilePicture_sender(Request $request){
      $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
      if ($sender =='#350') return makeJsonResponse(null,350);
      $request->sender_id = $sender->id;
      $request->decrypted =1;

       $r = PublicStorage::saveMerchantProfilePhoto($sender->branch_id,$sender->id,$request->file_type,$request->photo_data);
       //$r = $this->senderModel->saveProfilePicture($request);
      if($r =='#350') 
        return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }

    //$d = {'bank_accounts'=>[],'bearerToken'}
    function saveBankAccounts_sender(Request $request){
        $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
        if ($sender =='#350') return makeJsonResponse(null,350);
        $request->sender_id = $sender->id;
        $request->decrypted =1;
        $r = $this->senderModel->saveBankAccounts_sender($request);
        if($r =='#350') 
          return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);
          return makeJsonResponse($r);
    }

    function getBankAccounts_sender(Request $request){
      $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
      if ($sender =='#350') return makeJsonResponse(null,350);
      $request->sender_id = $sender->id;
      $request->decrypted =1;
      $r = $this->senderModel->getBankAccounts($request);
      if($r =='#350') 
        return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
        return makeJsonResponse($r);
    }

    //return public $url for merchant profile photo
    function getProfilePictureUrl_sender(Request $request){
      $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
      if ($sender =='#350') return makeJsonResponse(null,350);
      $request->sender_id = $sender->id;
      $request->decrypted =1;
      $r = PublicStorage::getMerchantProfilePhoto_url($sender->branch_id,$sender->id);
      //$r = $this->senderModel->getProfilePicture($request);
      if($r =='#350') 
        return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }

    function getProfilePicture_sender(Request $request){
      $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
      if ($sender =='#350') return makeJsonResponse(null,350);
      $request->sender_id = $sender->id;
      $request->decrypted =1;
      $r = PublicStorage::getMerchantProfilePhoto($sender->branch_id,$sender->id);
      //$r = $this->senderModel->getProfilePicture($request);
      if($r =='#350') 
        return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }

    function getProfilePicture_driver(Request $request){
      $driver = $this->UMModel->getUserInfoByToken($request,'driver');  
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      $request->decrypted =1;
      $r = PublicStorage::getDriverProfilePhoto($driver->branch_id,$driver->id);
      //$r = $this->senderModel->getProfilePicture($request);
      if($r =='#350') 
        return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }

    //return public $url for Driver's profile photo
    function getProfilePictureUrl_driver(Request $request){
        $driver = $this->UMModel->getUserInfoByToken($request,'driver');  
        if ($driver =='#350') return makeJsonResponse(null,350);
        $request->driver_id = $driver->id;
        $request->decrypted =1;
        $r = PublicStorage::getDriverProfilePhoto_url($driver->branch_id,$driver->id);
        //$r = $this->senderModel->getProfilePicture($request);
        if($r =='#350') 
          return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);
        return makeJsonResponse($r);
    }

    //Used in Mobile Merchant app to delete bank account by account number and bank name
    function deleteBankAccount(Request $request) {
      $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
      if ($sender =='#350') return makeJsonResponse(null,350);
      $request->sender_id = $sender->id;
      $request->decrypted =1;
      //$request = {'sender_id','bank_name','account_number'}
      $r = $this->senderModel->deleteBankAccountByNumber($request);
      if($r =='#350') 
        return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }
    
    function updatebankAccount(Request $request) {
      $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
      if ($sender =='#350') return makeJsonResponse(null,350);
      $request->sender_id = $sender->id;
      $request->decrypted =1;
      //$request = {'sender_id',{bank_name,account_number, account_name}
      $r = $this->senderModel->updatebankAccount($request);
      if($r =='#350') 
        return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }
    //setPassword
    function setPassword_driver(Request $request){
        $driver = $this->UMModel->getUserInfoByToken($request,'driver');  
        if ($driver =='#350') return makeJsonResponse(null,350);
        $request->driver_id = $driver->id;
        $request->decrypted =1;
        $r = $this->UMModel->setPassword($request);
        if($r =='#350') 
          return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);
          return makeJsonResponse($r);
    }
    //setPassword
    function setPassword_sender(Request $request){
      $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
      if ($sender =='#350') return makeJsonResponse(null,350);
      $request->sender_id = $sender->id;
      $request->decrypted =1;
      $r = $this->UMModel->setPassword($request);
      if($r =='#350') 
        return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
  }
     //Vendor confirm that all item/packages are correct in terms of COD, fees, forwarding cost, etc. Confirm from mobile app
     //$d={order_id,sender_id}
     function confirmCorrectAmounts(Request $request) {
        $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
        if ($sender =='#350') return makeJsonResponse(null,350);
        $request->sender_id = $sender->id;
        $request->decrypted =1;
        $r = $this->packageModel->confirmCorrectAmounts($request);
        if($r =='#350') 
          return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);
        return makeJsonResponse($r);
    }

    //$request {'app_id'} //No authentication
    function getBrandImages_mobile(Request $request) {
        $r = $this->mobileAppSettingsModel->getBrandImages_mobile($request);
        if($r =='#350') 
          return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);
        return makeJsonResponse($r);
    }

    function addBankAccounts(Request $request) {
      $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
      if ($sender =='#350') return makeJsonResponse(null,350);
      $request->sender_id = $sender->id;
      $request->decrypted =1;
      //$request = {'sender_id','bank_accounts' => [{bank_name,account_number, account_name},...]}
      $r = $this->senderModel->addBankAccounts($request);
      if($r =='#350') 
        return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }

    function saveMerchantProfile_bank(Request $request){
      $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
      if ($sender =='#350') return makeJsonResponse(null,350);
      $request->sender_id = $sender->id;
      $request->decrypted =1;
      //$request = {'name','name_kh','business_type','address','bank_accounts'=> [{'account_number','account_name','bank_name'},...{}] }
      $r = $this->senderModel->saveMerchantProfile_bank($request);
      if($r =='#350') 
        return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }
 
    function getTermsAndConditions_merchant(Request $request){
      //$sender = $this->UMModel->getUserInfoByToken($request,null);  
      //if ($sender =='#350') return makeJsonResponse(null,350);
      $app_id = getMerchantAppId();
      //$app_id = ENV('merchant_app_id'); 
      $d = (object)['app_id'=>$app_id];
      $r = $this->mobileAppSettingsModel->getTermsAndConditions($d);
      // if($r =='#350') 
      //   return makeJsonResponse($r,350);
      // else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }

    function getTermsAndConditions_driver(Request $request){
      //$sender = $this->UMModel->getUserInfoByToken($request,null);  
      //if ($sender =='#350') return makeJsonResponse(null,350);
      $app_id ="584C7FF2122D11EC89909801A8B0D7XKD";
      //$app_id = ENV('driver_app_id');
      $d = (object)['app_id'=>$app_id];
      $r = $this->mobileAppSettingsModel->getTermsAndConditions($d);
      // if($r =='#350') 
      //   return makeJsonResponse($r,350);
      // else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }


    function savePickupRequest(Request $request){
        // $token = $this->decryptToken($request);
        // if(!$token){
        //     $result = (object)["status"=>"Error"];
        //     $result->error_message = "Authentication failed. Empty token (101)";
        //     $result->status_code = "350"; //Unthenticated user
        // }

        //$sender = $this->senderModel->getSenderInfoByToken($request);
        //  if ($sender == null) {
        //      $result = (object)array();
        //       $result->error_message = "Authentication failed. User unidentified (102)";
        //       $result->status_code = "350"; //Unthenticated user
        //       $result->status ="Error";
        //       $result->token = $request->acc_tk_dms;
        //       $result->decrypted_token = $token;
        //       return makeJsonResponse($result);
        // }

        $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
        if ($sender =='#350') return makeJsonResponse(null,350);
        $request->sender_code = $sender->code;
        $request->sender_id = $sender->id;
        $request->is_from_mobile =1;
        $r = $this->pickupRequestModel->savePickupRequest($request);
        if($r =='#350') 
          return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);
        return $r;
    }

    //driver creates Delivery Order for a merchant
    function savePickupRequest_driver(Request $request){
      $driver = $this->UMModel->getUserInfoByToken($request,'driver');  
      if ($driver =='#350') return makeJsonResponse(null,350);
      //$request->sender_code = $sender->code;
      //$request->sender_id = $sender->id;
      $request->is_from_mobile =1;
      $r = $this->pickupRequestModel->savePickupRequest($request);
      if($r =='#350') 
        return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return $r;
    }
    
    //returns list of outstanding Delivery Orders to Merchant Mobile App
    function getOutstandingDeliveryOrders(Request $request) {
        $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
        if ($sender =='#350') return makeJsonResponse(null,350);
        $request->sender_id = $sender->id;
        $r = $this->pickupRequestModel->getOutstandingDeliveryOrders($request);
        if($r =='#350') 
          return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);
        return makeJsonResponse($r);
    }

    //$d = {app_id,[sender_id],delivery_type,zone_code,height,width,length,billed_kg}
    function estimatePrice(Request $request){
        $user_class = null;
        if($request->app_id === getMerchantAppId()) $user_class = "merchant";
        //else if ($request->app_id === getDriverAppId())$user_class ='driver'; 
        else return  makeJsonResponse("app_id is not correct! This api is used Merchant App only",353);

        $sender = $this->UMModel->getUserInfoByToken($request,'sender');
        if ($sender =='#350') return makeJsonResponse(null,350);
        //$sender_id = isset($request->sender_id)?$request->sender_id:null;
        $sender_id = $sender->id;
        $delivery_type = $request->delivery_type;
        $zone_code = $request->zone_code;

        $width = is_numeric($request->width)?$request->width:0;
        $length = is_numeric($request->length)?$request->length:0;
        $height = is_numeric($request->height)?$request->height:0;
        $kg = ROUND(($height*$width*$length)/6015,2);
        $weight = is_numeric($request->weight)?$request->weight:0;
        if($kg> $weight) $weight = $kg;
        $r = $this->packageModel->getDeliveryPriceInfo($sender->branch_id,$sender_id,$delivery_type,$zone_code='all',$weight);
        if ($r->base_price >= 0 && $r->delivery_fee >=0)
          $r->total = ($r->base_price + $r->delivery_fee);
        else $r->total = 0;  
        return $r;
    }

    //get Delivery Price info for Estimate Price | and for Calculating total as merchant enters package details
    //$d = {app_id,sender_id,delivery_type,zone_code,weight}
    function getDeliveryPriceInfo(Request $request){
      $user_class = null;
      if($request->app_id === getMerchantAppId()) $user_class = "merchant";
      else if ($request->app_id === getDriverAppId())$user_class ='driver'; 
      else return  makeJsonResponse("app_id is not correct!",353);

      $user = $this->UMModel->getUserInfoByToken($request,$user_class);
      if ($user =='#350') return makeJsonResponse(null,350);
      $sender_id = $request->sender_id;
      $delivery_type = $request->delivery_type;
      $zone_code = $request->zone_code;
      $billed_kg = is_numeric($request->billed_kg)?$request->billed_kg:0;
      if (!$billed_kg) $billed_kg = is_numeric($request->weight)?$request->weight:0;
      $r = $this->packageModel->getDeliveryPriceInfo($user->branch_id,$sender_id,$delivery_type,$zone_code='all',$billed_kg);
      return $r;
    }

    //return a list of avaialble pickups for driver to accept
    function getAvailablePickupList(Request $request){
      $driver = $this->UMModel->getUserInfoByToken($request,'driver');
      if ($driver =='#350') return makeJsonResponse(null,350);
    
      $request->driver_code = $driver->code; 
      $request->driver_id = $driver->id;  
      $request->decrypted = 1; /** no need to decrypt token in getPickupList() **/  
         $r =  $this->pickupRequestModel->getAvailablePickupList($request);
         if($r =='#350') 
           return makeJsonResponse($r,350);
         else if ($r =='@') return makeJsonResponse($r,360);
           return makeJsonResponse($r);
     }

     function getAcceptedPickupListByDriver(Request $request){
      $driver = $this->UMModel->getUserInfoByToken($request,'driver');
      if ($driver =='#350') return makeJsonResponse(null,350);
    
      $request->driver_code = $driver->code; 
      $request->driver_id = $driver->id; 

      $request->decrypted = 1; /** no need to decrypt token in getPickupList() **/  
         $r =  $this->pickupRequestModel->getAcceptedPickupListByDriver($request);
         if($r =='#350') 
           return makeJsonResponse($r,350);
         else if ($r =='@') return makeJsonResponse($r,360);
           return makeJsonResponse($r);
     }

     
      //Returns list of zones for mobile apps
      function getComboItems_merchant(Request $request) {
        $sender = $this->UMModel->getUserInfoByToken($request,'driver');         
        if ($sender =='#350') return makeJsonResponse(null,350);
        //$request->sender_code = $sender->code;
        $r = SystemSetting::merchant_list($request);
        return makeJsonResponse($r);
     }

     //Returns list of zones for mobile apps
     function getZoneList_driver(Request $request) {
        $sender = $this->UMModel->getUserInfoByToken($request,'driver');         
        if ($sender =='#350') return makeJsonResponse(null,350);
        //$request->sender_code = $sender->code;
        $r = $this->deliveryZoneModel->getComboItems_zone($request);
        return makeJsonResponse($r);
     }

      //Returns list of zones for mobile apps
      function getZoneList_sender(Request $request) {
        $sender = $this->UMModel->getUserInfoByToken($request,'sender');         
        if ($sender =='#350') return makeJsonResponse(null,350);
        //$request->sender_code = $sender->code;
        $r = $this->deliveryZoneModel->getComboItems_zone($request);
        return makeJsonResponse($r);
     }

      function getPickupListBySender(Request $request){
        /** getUserInfoByToken() does decrypt $request->acc_tk_dms token and set $request->decrypted = 1, so Helpers.getSessionInfo() will not decrypt token again **/    
        $sender = $this->UMModel->getUserInfoByToken($request,'sender');
        if ($sender =='#350') return makeJsonResponse(null,350);
      
        $request->sender_code = $sender->code;
        $request->sender_id = $sender->id;
        $request->decrypted = 1; /** no need to decrypt token in getPickupList() **/  
           $r =  $this->pickupRequestModel->getPickupList($request);
           if($r =='#350') 
             return makeJsonResponse($r,350);
           else if ($r =='@') return makeJsonResponse($r,360);
             return makeJsonResponse($r);
        }
         
          function getSenderDetails(Request $request) {
            $sender = $this->UMModel->getUserInfoByToken($request,'sender');         
            if ($sender =='#350') return makeJsonResponse(null,350);
            //$request->sender_code = $sender->code;
            $r = $this->senderModel->getSenderDetails($sender->id);
            return makeJsonResponse($r);
       }

       function getVendorAddress(Request $request) {  
              $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
            if ($sender =='#350') return makeJsonResponse(null,350);
             //$request->decrypted =1;
             $request->sender_id = $sender->id;
             $r = $this->senderModel->getVendorAddress($request);
            return makeJsonResponse($r);
      }

          //For Merchant mobile app. Returns a order details with payment status.
         //$d = {tracking_number}
         function getOrderDetails_sender(Request $request) {  
         $sender = $this->UMModel->getUserInfoByToken($request,'sender');
         if ($sender =='#350') return makeJsonResponse(null,350);
         //$request->sender_code = $sender->code;
         //$request->decrypted =1;
         $request->sender_id = $sender->id;
         $r = $this->packageModel->getOrderDetails($request);
         return makeJsonResponse($r);
    }

    //test authentication
     function auth_test(Request $request) {
        $user_class = $request->role;
        $result = $this->UMModel->auth_test($request,$user_class);
        return makeJsonResponse($result);
     }

      //This function is called by both Merchant App and Driver App.
      function getOrderDetails(Request $request) {
       $user_class = strtolower($request->role);
       if($user_class !='sender' && $user_class !='merchant' && $user_class !='driver') return makeJsonResponse(null,350);   
       $dd = $this->UMModel->getUserInfoByToken($request,$user_class);  
       if ($dd =='#350') return makeJsonResponse(null,350);
       //$request->sender_code = $sender->code;
       $request->decrypted =1;
       $r = $this->packageModel->getOrderDetails($request);
       return makeJsonResponse($r);
  }
  

    function encryptData(Request $request){
      //$request->app_id = $request->app_id;
      //$r = $this->senderModel->registerSender($request);
      $m_str = $request->data;
      $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
      $m_str = $encrypter->encrypt($m_str,false); //FALSE => to avoid serialization issue in decryption
      return makeJsonResponse($m_str);     
    }

   function activateSender_otp(Request $request) {
      //get Driver ID by token 
      $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
      if ($sender =='#350') return makeJsonResponse(null,350);
      $request->sender_id = $sender->id;
      $r = $this->senderModel->activateSender_otp($request);
      return makeJsonResponse($r);
   }
   
   function getDeliveryItems_sender(Request $request) {
    //get Driver ID by token 
    $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
    if ($sender =='#350') return makeJsonResponse(null,350);
    $request->sender_id = $sender->id;
    $request->decrypted =1;
    // use_default_dates =0 => if no dates supplied then get package list for All dates
    //if use_default_dates =1 => if no dates supplied then use today dates to query data
    if(!isset($request->use_default_dates)) $request->use_default_dates = 0;
    $r = $this->packageModel->getDeliveryItemsBySender($request);
    return makeJsonResponse($r);
 }
 
    function updateProfile_sender(Request $request) {
        //get Driver ID by token 
        $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
        if ($sender =='#350') return makeJsonResponse(null,350);
        $request->sender_id = $sender->id;
        $request->decrypted =1;
        $r = $this->senderModel->updateProfile_sender($request);
        return makeJsonResponse($r);
    }

    //$d = {name, [phone_number], email, address}
    function updateProfile_driver(Request $request) {
      //get Driver ID by token 
      $driver = $this->UMModel->getUserInfoByToken($request,'driver');  
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      $request->decrypted =1;
      $r = $this->driverModel->updateProfile_driver($request);
      return makeJsonResponse($r);
   }

   function getTransactions_sender(Request $request) {
      //get Driver ID by token 
      $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
      if ($sender =='#350') return makeJsonResponse(null,350);
      $request->sender_id = $sender->id;
      $request->decrypted =1;
      $r = $transaction->getTransactionList_merchant($request);
      return makeJsonResponse($r);
   }

   function getTransactions_driver(Request $request) {
    //get Driver ID by token 
    $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
    if ($sender =='#350') return makeJsonResponse(null,350);
    $request->sender_id = $sender->id;
    $request->decrypted =1;
    $r = $this->transaction->getTransactionList_driver($request);
    return makeJsonResponse($r);
 }
  
 //for Merchant (only) to upload photo about payment transaction (Merchant Mobile app)
 //$d = {package_id,file-content or img_data}
 function savePackageAttachment(Request $request) {
    //get Driver ID by token 
    $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
    if ($sender =='#350') return makeJsonResponse(null,350);
    $request->sender_id = $sender->id;
    $request->decrypted =1;
    $r = $this->packageModel->savePackageAttachment($request);
    return makeJsonResponse($r);
 }
 
    //for Merchant (only) to upload photo about a package (Merchant Mobile app)
    //$d = {package_id,upload_id or id}
    function deletePackageAttachment(Request $request) {
      //get Driver ID by token 
      $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
      if ($sender =='#350') return makeJsonResponse(null,350);
      $request->sender_id = $sender->id;
      $request->decrypted =1;
      $r = $this->packageModel->deletePackageAttachment($request);
      return makeJsonResponse($r);
    }

   function registerDriver(Request $request) {
        //get Driver ID by token 
      // $driver = $this->UMModel->getUserInfoByToken($request,'sender');  
      // if ($driver =='#350') return makeJsonResponse(null,350);
      $request->app_id = $request->app_id;
      $r = $this->driverModel->registerDriver($request);
      return makeJsonResponse($r);
  }

   function activateDriver_otp(Request $request) {
      //get Driver ID by token 
      $driver = $this->UMModel->getUserInfoByToken($request,'driver');  
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      $r = $this->driverModel->activateDriver_otp($request);
      return makeJsonResponse($r);
   }

   //driver cancel order after being assigned to
   function cancelOrder(Request $request) {
      //get Driver ID by token 
      $driver = $this->UMModel->getUserInfoByToken($request,'driver');  
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      $r = $this->driverModel->cancelOrder($request);
      return makeJsonResponse($r);
  }

   function getProfileInfo_sender(Request $request){
     //get sender_id  by token 
     $sender = $this->UMModel->getUserInfoByToken($request,'sender');  
     if ($sender =='#350') return makeJsonResponse(null,350);
     $request->sender_id = $sender->id;
     $request->decrypted =1;
     $r = $this->senderModel->getProfileInfo($request);
     return makeJsonResponse($r);
 }

 function getProfileInfo_driver(Request $request){
      //get driver_id  by token 
      $driver = $this->UMModel->getUserInfoByToken($request,'driver');  
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      $request->decrypted =1;
      $r = $this->driverModel->getProfileInfo($request);
      return makeJsonResponse($r);
 }

 //returns list of product types to Merchan Mobile app
 function getComboItems_product_type(Request $request){
  //get Driver ID by token
   $user_class =$request->user_class;
   if(empty($user_class)) $user_class = "driver";    
   $user = $this->UMModel->getUserInfoByToken($request,$user_class);  
   if ($user =='#350') return makeJsonResponse(null,350);
  //$request->decrypted =1;
   $r = SystemSetting::product_types($request);
   return makeJsonResponse($r);

 }

 
   function pickOrder(Request $request) {
     //get Driver ID by token 
    $driver = $this->UMModel->getUserInfoByToken($request,'driver');  
    if ($driver =='#350') return makeJsonResponse(null,350);
    $request->driver_id = $driver->id;
    $r = $this->packageModel->pickOrder($request);
    return makeJsonResponse($r);
   }

   function getPackageListByDriver(Request $request){
    $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
    if ($driver =='#350') return makeJsonResponse(null,350);
    $request->driver_id = $driver->id;
    $r = $this->driverModel->getPackageListByDriver($request);
    return makeJsonResponse($r);
   }

   function pickOrderPackage(Request $request) {
    //get Driver ID by token
    $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
    if ($driver =='#350') return makeJsonResponse(null,350);
    $request->driver_id = $driver->id;
    $r = $this->packageModel->pickOrderPackage($request);
    return makeJsonResponse($r);
   }

   //$d = {'phone_number'}
   function send_otp_preregister(Request $request) {
     $r = $this->senderModel->send_otp_preregister($request);
     return makeJsonResponse($r);
   }

   //$d = {'phone_number','otp_code'}
   function verify_otp_preregister(Request $request) {
    $r = $this->senderModel->verify_otp_preregister($request);
    return makeJsonResponse($r);
  }

  //just send otp to user's phone number.
  //$d = {app_id, [purpose],[phone_number]}
  function sendSMS_otp(Request $request){
      $user_class =null;
      if($request->app_id === getMerchantAppId()) $user_class ='merchant';
      else if ($request->app_id === getDriverAppId()) $user_class ='driver';
      else return makeJsonResponse("app_id or user class is not correct!",352);

      $user = $this->UMModel->getUserInfoByToken($request,$user_class); 
      if ($user =='#350') return makeJsonResponse(null,350);
      $request->user_id = $user->id;
      $request->login_name = $user->login_name;
      $request->phone_number = $user->phone_number;
      $r = $this->UMModel->sendSMS_otp($request);
      return makeJsonResponse($r);
  }

  //verify otp_code by phone or email
  //$d= {app_id,otp_code,[login_name]}
  function verify_otp(Request $request){
      $user_class =null;
      if($request->app_id === getMerchantAppId()) $user_class ='merchant';
      else if ($request->app_id === getDriverAppId()) $user_class ='driver';
      else return makeJsonResponse("app_id or user class is not correct!",352);

      $user = $this->UMModel->getUserInfoByToken($request,$user_class); 
      if ($user =='#350') return makeJsonResponse(null,350);
      $request->user_id = $user->user_id; //NOTE: $user->id is the sender_id or driver_id, while $user->user_id is "um_users.id"
      $request->login_name = $user->login_name;
      //$request->phone_number = $user->phone_number;
      $r = $this->UMModel->verify_otp($request);
      return makeJsonResponse($r);
  }


  //$d= {'phone_number','password','confirm_pwd',['name'],['address'],['business_type']}
  function registerSender(Request $request) {
    // get Driver ID by token 
    // $driver = $this->UMModel->getUserInfoByToken($request,'sender');  
    // if ($driver =='#350') return makeJsonResponse(null,350);
    $request->app_id = $request->app_id;
    $r = $this->senderModel->registerSender($request);
    return makeJsonResponse($r);
  }


   function pickOrderPackages_fast_delivery(Request $request){
      $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      $r = $this->packageModel->pickOrderPackages_fast_delivery($request);
      return makeJsonResponse($r);
   }
   
   function getPackagesByDriver(Request $request){
      $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      $r = $this->packageModel->getPackagesByDriver($request);
      return makeJsonResponse($r);
   }

   function acceptPickupRequest(Request $request){
    $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
    if ($driver =='#350') return makeJsonResponse(null,350);
    $request->driver_id = $driver->id;
    $request->is_from_mobile = 1;
    $r = $this->pickupRequestModel->acceptPickupRequest($request);
    return makeJsonResponse($r);
 }
 function getExchangeRate_driver(Request $request){
  $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
  if ($driver =='#350') return makeJsonResponse(null,350);
  $request->driver_id = $driver->id;
  $r = $this->priceModel->getExchangeRate($request);
  return makeJsonResponse($r);
}
function getExchangeRate_sender(Request $request){
  $sender = $this->UMModel->getUserInfoByToken($request,'sender'); 
  if ($sender =='#350') return makeJsonResponse(null,350);
  $request->sender_id = $sender->id;
  $r = $this->priceModel->getExchangeRate($request);
  return makeJsonResponse($r);
}
function getActiveTrips(Request $request){
  $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
  if ($driver =='#350') return makeJsonResponse(null,350);
  $request->driver_id = $driver->id;
  $r = $this->driverModel->getActiveTrips($request);
  return makeJsonResponse($r);
}
 //getPackageListByTrip() for Driver mobile app. It returns list of packages within a given delivery trip  
  function getPackageListByTrip(Request $request){
    $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
    if ($driver =='#350') return makeJsonResponse(null,350);
    $request->driver_id = $driver->id;
    $r = $this->tripModel->getPackageListByTrip($request);
    return makeJsonResponse($r);
  }

  function updatePackageStatus_driver(Request $request){
      $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      $request->is_from_mobile =1;
      $r = $this->tripModel->updatePackageStatus_driver($request);
      return makeJsonResponse($r);
  }

  function updatePhoneNumber_merchant(Request $request){
    $sender = $this->UMModel->getUserInfoByToken($request,'sender'); 
    if ($sender =='#350') return makeJsonResponse(null,350);
    //$request->sender_id = $sender->id;
    $otp_code = $request->otp_code;
    $user_id = $sender->user_id;
    //$request->is_from_mobile =1;

     //finish(action_name,user_id,otp_code)
     //update phone number will also update login name
    $r = PendingTask::finish('change_phone_number',$user_id, $otp_code);
    return $r;
  }

  //$d= {otp_code,user_id}
  function updatePhoneNumber_driver(Request $request){
    $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
    if ($driver =='#350') return makeJsonResponse(null,350);
    //$request->sender_id = $sender->id;
    $otp_code = $request->otp_code;
    $user_id = $driver->user_id;
    //$request->is_from_mobile =1;

    //finish(action_name,user_id,otp_code)
    //update phone number will also update login name
    $r = PendingTask::finish('change_phone_number',$user_id, $otp_code);
    return $r;
  }
 
  //merchant or driver can submit old password, new password to set password
  function changePassword_merchant(Request $request){
    $sender = $this->UMModel->getUserInfoByToken($request,'sender'); 
    if ($sender =='#350') return makeJsonResponse(null,350);
    //$request->sender_id = $sender->id;
    //$request->is_from_mobile =1;

    $r = UM::changeUserPassword($sender->user_id, $request->old_password, $request->new_password);
    return makeJsonResponse($r);
  }

  //after successfully verified OTP code, user submit new password with that otp_code in order to set new password
  //$d = {app_id,password,otp_code}
  function setPassword_otp(Request $request){
    $app_id = $request->app_id;  
    if($app_id === getMerchantAppId()) $user_class= "merchant";
    elseif ($app_id === getDriverAppId()) $user_class ="driver";
    else return makeJsonResponse("App ID is not correct!",353); 
    
    $user = $this->UMModel->getUserInfoByToken($request,$user_class); 
    if ($user =='#350') return makeJsonResponse(null,350);

       //$otp_code = $request->otp_code;

      //***Add params for verify_otp() and setPassword()
      $request->login_name = $user->login_name;
 
    //verify_otp() return true if succeeded, otherwise returns error message
    $succesded = $this->UMModel->verify_otp($request);
    if (!$succesded) return DV::error("otp code is not correct!");
   
    $request->decrypted =1;
    //$request->newPwd = $request->password;
    $r = $this->UMModel->setPassword($request);
    return makeJsonResponse($r);
  }

  //merchant or driver can submit old password, new password to set password
  function changePassword_driver(Request $request){
    $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
    if ($driver =='#350') return makeJsonResponse(null,350);
    //$request->driver_id = $driver->id;
    //$request->is_from_mobile =1;

    //finish(action_name,user_id,otp_code)
    $r = UM::changeUserPassword($driver->user_id, $request->old_password, $request->new_password);
     return makeJsonResponse($r);
  }

  function finishDeliveryTrip_driver(Request $request){
    $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
    if ($driver =='#350') return makeJsonResponse(null,350);
    $request->driver_id = $driver->id;
    $r = $this->tripModel->finishDeliveryTrip($request);
    return makeJsonResponse($r);
  }

  function scanPackageOut_driver(Request $request){
    $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
    if ($driver =='#350') return makeJsonResponse(null,350);
    $request->driver_id = $driver->id;
    $r = $this->tripModel->scanPackageOut($request);
    return makeJsonResponse($r);
  }

  function startDeliveryTrip_driver(Request $request){
    $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
    if ($driver =='#350') return makeJsonResponse(null,350);
    $request->driver_id = $driver->id;
    $r = $this->tripModel->startDeliveryTrip($request);
    return makeJsonResponse($r);
  }

  function getComboItems_vehicleType(Request $request){
      $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      $r = $this->driverModel->getComboItems_vehicleType($request);
      return makeJsonResponse($r);
  }
  
    //This method is for Driver mobile app only to retrieve commissions for pickup and deliveries in summarized values
    function getCommissions_driver(Request $request){
      $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      /*request = {driver_id, start_date, end_date, delivery_type}*/
      $r = $this->reportModel->getDriverCommissionItems($request->driver_id, $request->start_date,$request->end_date);
      return makeJsonResponse($r);
    }
    //This method is for Driver mobile app only to retrieve total amount a driver as to pay to company
    function getTotalDue_driver(Request $request){
      $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      /*request = {driver_id, start_date, end_date, delivery_type}*/
      $r = $this->reportModel->getDriverTotalDue($request->driver_id, $request->start_date,$request->end_date);
      return makeJsonResponse($r);
    }
    function getReportData_driver(Request $request){
      $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      /*request = {driver_id, start_date, end_date, delivery_type}*/
      $r = $this->reportModel->getDriverReport_mobile($request->driver_id, $request->start_date,$request->end_date);
      return makeJsonResponse($r);
    }
    

    //This method is for Driver mobile app only. So must log in as driver to access this function
    function countPackagesByTrip(Request $request){
        $driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
        if ($driver =='#350') return makeJsonResponse(null,350);
        $request->driver_id = $driver->id;
        $r = $this->tripModel->countPackagesByTrip($request);
        return makeJsonResponse($r);
    }
   
    //This function NOT yet defined. This method is for Merchant mobile app only. So must log in as Merchant or Seller to access this function
      function countPackagesByOrder(Request $request){
        $sender = $this->UMModel->getUserInfoByToken($request,'sender'); 
        if ($sender =='#350') return makeJsonResponse(null,350);
        $request->sender_id = $sender->id;
        $r = $this->senderModel->countPackagesByOrder($request);
        return makeJsonResponse($r);
    }

    function sendNotificationMessage(Request $request){
       $notifier = new Notifier();
       $r = $notifier->sendNotificationMessage($request->message);
       return makeJsonResponse($r);
    }

    // //send OTP from Merchant app, Or Driver App. if $d->role is not given => then the default role = 'sender'
    // //$d = {'phone_number','login_name'}
    // function sendSMS_otp(Request $request){
    //   $role = isset($request->role)?strtolower($request->role):'sender';
    //   $dd = null;
    //   if ($role =='driver') {
    //     $dd = $this->UMModel->getUserInfoByToken($request,'driver');
    //     if ($dd =='#350') return makeJsonResponse(null,350);
    //     $request->driver_id = $dd->id;
    //     $request->role ='driver';
    //   }
    //   else  {
    //     $dd = $this->UMModel->getUserInfoByToken($request,'sender');
    //     if ($dd =='#350') return makeJsonResponse(null,350);
    //     $request->sender_id = $dd->id; 
    //     $request->role ='sender';
    //   }
 
    //   $request->decrypted =1;
    //   $r = $this->UMModel->sendSMS_otp($request);
    //   return makeJsonResponse($r);
    // }

    function sendSMS_otp_forget(Request $request){
      $user_class = isset($request->user_class)?strtolower($request->user_class):null;
      $r = $this->UMModel->sendSMS_otp_forget($request);
      return makeJsonResponse($r);
    }

    function sendSMS(Request $request){
      $sender_name = null;
      $r = SMS::send($request->phone_number,$request->text,$sender_name);
      return makeJsonResponse($r);
    }

    //return list of Promotions to Merchant App
    //$d = {'app_id',[category]}
    function getPromotionList_merchant(Request $request){
      $user = $this->UMModel->getUserInfoByToken($request,'merchant'); 
      if (is_string($user)) 
        return makeJsonResponse($user,350);
      else
        {
          $request->sender_id = $user->id;
          //$request->decrypted =1;
          //$request->acc_tk_dms = $request->bearerToken();
        }
      
        $promo = new Promotion();
        $user_class = null;
        if ($request->app_id === getMerchantAppId()) $user_class = 'merchant';
        //else if ($request->app_id ===getDriverAppId()) $user_class ='driver';
        //else $app_id = null => there is problem here  (todo:check and validate)
        if(!$user_class)  return makeJsonResponse("app_id must be a merchant app_id",301);
        $request->user_class=$user_class;
        $r = $promo->getPromotionList($request);
        return makeJsonResponse($r);     
    }

     
    //returns list of images for Driver's Mobile App
     function getBrandImages_driver(Request $request){
        //$driver = $this->UMModel->getUserInfoByToken($request,null); 
        //if ($driver =='#350') return makeJsonResponse(null,350);
        $driver_app_id = getDriverAppId();
        $request->app_id = $driver_app_id;
        $r = $this->companyModel->getBrandImages($request);
        return makeJsonResponse($r);
    }
     //returns list of images for Merchant's Mobile App // Images for Vendor App
    function getBrandImages_sender(Request $request){
      //$driver = $this->UMModel->getUserInfoByToken($request,'driver'); 
      //if ($driver =='#350') return makeJsonResponse(null,350);
      $request->app_id = getMerchantAppId();
      $r = $this->companyModel->getBrandImages($request);
      return makeJsonResponse($r);
   }

    //return list of counts of packages for status below "Picked and Booked", where Qty of packages are stored in table "order".qty  
   function getPackageCounts_order(Request $request){
      $user = $this->UMModel->getUserInfoByToken($request,'merchant'); 
      if (is_string($user)) 
        return makeJsonResponse($user);
      else
        $request->sender_id = $user->id; 
        
      $r = $this->pickupRequestModel->getPackageCounts_order($request);
      return makeJsonResponse($r);     
  }
 
  //return list of counts of packages by status Starting from "Arrived At Warehouse" to the complete (the end)
  function getPackageCounts_summary(Request $request){
    $user = $this->UMModel->getUserInfoByToken($request,'merchant'); 
    if (is_string($user)) 
       return makeJsonResponse($user);
    else
       $request->sender_id = $user->id; 
       
    $r = $this->packageModel->getPackageCounts_summary($request);
    return makeJsonResponse($r);     
  }
 
  //return list of COUNTS for merchant's app home screen (Order Summary)
  function getOrderSummaryCounts(Request $request){
    $user = $this->UMModel->getUserInfoByToken($request,'merchant'); 
    if (is_string($user)) 
       return makeJsonResponse($user);
    else
    {
      $request->sender_id = $user->id; 
    }
  
       //For status_id <= 4
      $arr_d = (array)$this->pickupRequestModel->getPackageCounts_order($request);
      $d1 = $this->packageModel->getPackageCounts_summary($request);
      foreach($d1 as $prop=>$value){
         $arr_d[$prop] = $value;
      }
      return makeJsonResponse((object)$arr_d);     
  }

   
   function getNotificationListByMerchant(Request $request){
      $user = $this->UMModel->getUserInfoByToken($request,'merchant'); 
      if (is_string($user)) 
        return makeJsonResponse($user);
      else
        $request->user_id = $user->id; //This @user_id is in fact the @sender_id    
     //$merchant_app_id = '38DC051E122D11EC89909801A7B0D1FCH';
     //$request->app_id = $merchant_app_id;
    
      $r = Notifier::getNotificationListByUser($request);
      return makeJsonResponse($r); 
  }

   function getNotificationListByDriver(Request $request){
    $user = $this->UMModel->getUserInfoByToken($request,'driver'); 
    if (is_string($user))  
      return makeJsonResponse($user);
    else
      $request->user_id = $user->id;     
      //$merchant_app_id = '38DC051E122D11EC89909801A7B0D1FCH';
      //$request->app_id = $merchant_app_id;
     
      $r = Notifier::getNotificationListByUser($request);
      return makeJsonResponse($r);
   }

   //return Order Summary list (that is list of packages or list of delivery orders) corresponding to each Order Summary count on home screen on Merchant App
   function getOrderSummary_list(Request $request){
    $sender = $this->UMModel->getUserInfoByToken($request,'merchant'); 
    if ($sender =='#350' || is_string($sender))  
      return makeJsonResponse($sender,350);
    else
      $request->sender_id = $sender->id; 
      
      $r = [];
      switch($request->status_id){
          case 1:{
            $r = $this->packageModel->getOrderSummarylist_available($request);
            break;
          }case 2:{
            $r = $this->packageModel->getOrderSummarylist_accepted($request);
            break; 
          }case 3:{
            $r = $this->packageModel->getOrderSummarylist_picked($request);
            break; 
          }case 4:{
            $r = $this->packageModel->getOrderSummarylist_picked($request);
            break; 
          }case 5:{
            $r = $this->packageModel->getOrderSummarylist_at_warehouse($request);
            break; 
          }case 6:{
            $r = $this->packageModel->getOrderSummarylist_on_delivery($request);
            break; 
          }
          case 8:{
            $r = $this->packageModel->getOrderSummarylist_delivered($request); 
            break;
          } 
          case 11:{
            $r = $this->packageModel->getOrderSummarylist_returned($request); 
            break;
          }default:{
            $r = [];
            break;
          }
      }
       return makeJsonResponse($r);
   }

    function findPackages_quick(Request $request){
      $sender = $this->UMModel->getUserInfoByToken($request,'merchant'); 
      if ($sender =='#350' || is_string($sender))  
        return makeJsonResponse($sender,350);
      else
        $request->sender_id = $sender->id;
      $r =  $this->packageModel->findPackages_quick($request);
      return makeJsonResponse($r);
    }
   
    function getComboItems_status(Request $request){
        // $sender = $this->UMModel->getUserInfoByToken($request,'merchant'); 
        // if ($sender =='#350' || is_string($sender))  
        //   return makeJsonResponse($sender,350);
        // else
        //   $request->sender_id = $sender->id;
        $r =  $this->packageModel->getComboItems_status($request);
        return makeJsonResponse($r);
    }

    //return list of settled packages per payment selttment
    function getSettledPackages(Request $request){
      $sender = $this->UMModel->getUserInfoByToken($request,'merchant'); 
      if ($sender =='#350' || is_string($sender))  
        return makeJsonResponse($sender,350);
      else
        $request->sender_id = $sender->id;
      $r =  $this->packageModel->getSettledPackages($request);
      return makeJsonResponse($r);
    }

    //return Pending Order count for Driver's App home screen
    function getPendingOrdersCount(Request $request){
      $driver = $this->UMModel->getUserInfoByToken($request,'driver');  
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      $cnt = $this->pickupRequestModel->getPendingOrdersCount($request);
      if(is_numeric($cnt)) return $cnt;
      else return 0;
   }

  //return My Taks count for Driver's App home screen
   function getDriverTaskCounts(Request $request){
      $driver = $this->UMModel->getUserInfoByToken($request,'driver');  
      if ($driver =='#350') return makeJsonResponse(null,350);
      $request->driver_id = $driver->id;
      $data= $this->pickupRequestModel->getDriverTaskCounts($request->branch_id,$request->driver_id);
      return $data;
  }
   
  function getPackageListPerOrder(Request $request){
    $driver = $this->UMModel->getUserInfoByToken($request,'driver');  
    if ($driver =='#350') return makeJsonResponse(null,350);
    $request->driver_id = $driver->id;
    $data= $this->packageModel->getPackageListPerOrder($request->order_id);
    return $data;
  }

  function deleteOrderPakcages(Request $request){
    $driver = $this->UMModel->getUserInfoByToken($request,'driver');  
    if ($driver =='#350') return makeJsonResponse(null,350);
    $request->driver_id = $driver->id;
    $barcode = $request->bar_code;
    if (empty($barcode)) $barcode = $request->barcode;
    $data= $this->packageModel->deleteOrderPakcages($request->order_id,$barcode);
    return $data;
  }
  
  
   //driver or merchant logs out => invalidate and clear access_token (mobile user has no session vars)
   //return True when logout success, otherwise, returns error message
   //login_mobile() requires $d = {app_id} 
   function logout_mobile(Request $request){
        $merchant_app_id = getMerhcantAppId();
        $driver_app_id = getDriverAppId();
        $user_class =null;
        if ($request->app_id === $driver_app_id) $user_class='driver';
        else if ($request->app_id === $merchant_app_id) $user_class='merchant';
        else return makeJsonResponse("Invalid app_id",352);

        $user = $this->UMModel->getUserInfoByToken($request,$user_class); 
        if ($user =='#350' || is_string($user))  
          return makeJsonResponse("It seems you have not logged in before",350);
        else {
           $r = UM::logout_mobile($user->user_id,$request->app_id);
           return makeJsonResponse($r);
        }
     }
 

}
