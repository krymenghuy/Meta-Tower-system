<?php
namespace App\Http\Controllers;
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
//use App\Models\BDeliveryTrip;
use App\Models\CompanyProfile;
use App\Models\MobileAppSettings;
//use App\Models\SystemSetting;
use App\Models\Promotion;
use App\Models\Report;
use App\Models\PublicStorage;
use App\Models\PendingTask;
use App\Models\PaymentTransaction;
use App\Models\DV;
use App\Models\JDV;
use App\Models\GeneralSettings;
use App\Models\Tracker;
use Config;
 
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
    protected $reportModel;
    protected $companyModel;
    protected $transaction;
    protected $driverModel;
    protected $UMModel;

    public function __construct(){
        $this->pickupRequestModel = new PickupRequest();
        $this->senderModel = new Sender();
        $this->driverModel = new \App\Models\Driver();
        $this->packageModel = new \App\Models\Package();
        $this->priceModel = new Price();
        $this->tripModel = new DeliveryTrip();
        $this->deliveryZoneModel = new DeliveryZone();
        $this->UMModel = new \App\Models\UM();
        $this->reportModel = new Report();
        $this->companyModel = new CompanyProfile();
        $this->transaction= new PaymentTransaction();
    }

    // function getNotificationList_admin(Request $req){
    //   $ss = UM::getUserInfoByToken($req,-1);
    //   if($ss->status_code !==200) return JDV::raw($ss);
    //   $rows= Notifier::getNotificationList_admin($ss->user_id);
    //   return JDV::result($rows);
    // }

    // function getUnreadCount_admin(Request $req){
    //   $ss = UM::getUserInfoByToken($req,-1);
    //   if($ss->status_code !==200) return JDV::raw($ss);
    //   $cnt= Notifier::getUnreadCount($ss->user_id,$ss->user_class);
    //   return JDV::result($cnt);
    // } 
   
    function sendToTelegram(Request $req){
      $res =  Tracker::sendToTelegram($req->message);
      return JDV::result($res);
    }
    
    function externalLogin(Request $request){
        $app_id = $request->app_id;
        $login_name = $request->login_name;
        $pwd = $request->password; 
        $result = $this->UMModel->verifyUser($app_id,$login_name,$pwd);
        if($result->status ==='OK'){
          $user =  $result->user;  
          $result->user->image_url = PublicStorage::getProfilePhoto_url($user->id);
          $result->user->notif_topic_private= $user->branch_id.topic_prefix($user->user_class)."private".$user->user_id;
          $result->user->notif_topic_general= $user->branch_id.topic_prefix($user->user_class)."general";
        }
        return $result;
    }
  
    function updateSenderProfile(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $sender =new Sender($ss->official_id,$ss);
      $res = $sender->updateProfile($req->all());
      if($res->status ==='OK') return JDV::success(['sender_id'=>$res->sender_id]);
      return JDV::error($res->error_message);
    }

    function saveProfilePicture_driver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $driver = new Driver($ss->official_id,$ss);
      $photo = $req->photo_data?$req->photo_data:$req->photoData;
      $res = $driver->saveProfilePicture($photo,$req->file_type);  
      if($res->status ==='OK') return JDV::success(['image_url'=>$res->image_url]);
      return JDV::error($res->error_message);
    }
 
    function savePackage_photo(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $barcode = $req->barcode?$req->barcode:$req->bar_code;
      //$id = $req->id;
      //if($id>0) $barcode = $id;
      $p = new Package($barcode,$ss,true);
      $req['barcode'] = $barcode;
      $res = $p->savePhoto($req->all(),null,$ss);
      if($res->status==='OK') return JDV::success(['image_url'=>$res->image_url]);
      return JDV::error($res->error_message); 
    }
 
    function deleteImageOrder(Request $req){
      $ss = UM::getUserInfoBytoken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss);
      $order_id = $req->id ?? $req->order_id;
      $res = $this->pickupRequestModel->deleteImageOrder($order_id,$ss);
      return JDV::raw($res); 
    }

    function deletePackage_photo(Request $req){
      $ss = UM::getUserInfoBytoken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss);
      $id = $req->id?$req->id:$req->image_id;
      $barcode = $req->barcode?$req->barcode:$req->bar_code;
      $p = new Package($barcode,$ss);
      $row = getDataRow('package',['qr_code'=>$barcode],'id');
      if(!$row) return JDV::error("barcode is not valid");
      $res = $p->deletePhoto($id,$row->id,$ss);
      return DV::success(); 
    }

    //getPackagePhotos()
    function getPackage_photos(Request $req){
      $ss = UM::getUserInfoBytoken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss);
      $barcode = $req->barcode?$req->barcode:$req->bar_code;
      $p = new package($barcode,$ss,true);
      return DV::result($p->getPhotos());
    }

    //$d = {'trx_type','trx_id','file_type','photo_data'}
    function saveTransactionPhoto_sender(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $trxModel = new PaymentTransaction();
        $res = $trxModel->savePhoto($req->all());
        return JDV::success(['image_url'=>$res->image_url]);
        return JDV::error($res->error_message);
    }

      //$d = {'trx_type','trx_id','file_type','photo_data'}
      function saveTransactionPhoto_driver(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $trxModel = new PaymentTransaction();
        $res = $trxModel->savePhoto($req->all());
        return JDV::success(['image_url'=>$res->image_url]);
        return JDV::error($res->error_message);
      }

    function saveProfilePicture_sender(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $sender = new Sender($ss->official_id,$ss);
      //$photo = $req->photo_data?$req->photo_data:$req->photoData;
      $res = $sender->saveProfilePicture($req->photo_data,$req->file_type);  
      if($res->status ==='OK') return JDV::success(['image_url'=>$res->image_url]);
      return JDV::error($res->error_message);
    }

    //$d = {'bank_accounts'=>[],'bearerToken'}
    function saveBankAccounts_sender(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $sender = new Sender($ss->official_id,$ss);
        $err = $sender->saveBankAccounts($req->all());
        if($err) return JDV::error($err);
        return JDV::success();
    }

    function getBankAccounts_sender(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $sender = new Sender($ss->official_id,$ss);
      $rows = $sender->getBankAccounts();
      return JDV::result($rows); 
    }
 
    //getProfilePhotos() for any user ($user_id)
    function getProfilePicture(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss); 
      $url = PublicStorage::getProfilePhoto_url($ss->user_id);
      return JDV::result($url); 
    }
 
    //Used in Mobile Merchant app to delete bank account by account number and bank name
    function deleteBankAccount(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss);
        $sender = new Sender($ss->official_id,$ss);
        $err = $sender->deleteBankAccountByNumber($req->all());
        if($err) return JDV::error($err);
        return JDV::success();  
    }
    
    function updatebankAccount(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $sender = new Sender($ss->official_id,$ss);
      $err = $sender->updatebankAccount($req->all());
      if($err) return JDV::error($err);
      return JDV::success();
    }

    //setPassword
    function setPassword_driver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $req['user_class'] = $ss->user_class;
      $req['driver_id'] = $ss->official_id;
      $req['user_id'] = $ss->user_id;
      $res = $this->UMModel->setPassword($req->all(),$ss);
      return JDV::raw($res); 
    }

    //setPassword
    function setPassword_sender(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $req['sender_id'] = $ss->official_id;
      $req['user_id'] = $ss->user_id;
      $res = $this->UMModel->setPassword($req->all(),$ss);
      return JDV::raw($res);
    }

     //Vendor confirm that all item/packages are correct in terms of COD, fees, forwarding cost, etc. Confirm from mobile app
     //$d={order_id,sender_id}
     function confirmCorrectAmounts(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
        $req['sender_id'] = $ss->official_id;
        $id = $req->package_id?$req->package_id:$req->id;
        $p = new Package($id,$ss);
        $r = $p->confirmCorrectAmounts($req->all(),$ss);
        return JDV::raw($r); 
    }

    //$request {'app_id'} //No authentication
    function getBrandImages_mobile_merchant(Request $request){
      $request['branch_id'] = 1;
      $app_id = Config::get('app.merchant_app_id');
      return JDV::result(MobileAppSettings::getBrandImages($app_id));  
    }

     //$request {'app_id'} //No authentication
     function getBrandImages_mobile_driver(Request $request){
      $request->branch_id = 1;
      $app_id = Config::get('app.driver_app_id');
      return JDV::result(MobileAppSettings::getBrandImages($app_id)); 
    }

    function addBankAccounts(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1); 
      if($ss->status_code !==200) return JDV::raw($ss);
      //$req = {'sender_id','bank_accounts' => [{bank_name,account_number, account_name},...]}
      $sender = new Sender($ss->official_id,$ss);
      $res = $sender->addBankAccounts($req->all());
      if($res->status ==='OK') return JDV::success(['success_count'=>$res->success_count]);
      return JDV::error($res->error_message);
    }

    function saveMerchantProfile_bank(Request $req){
      $ss = UM::getUserInfoByToken($req,-1); 
      if($ss->status_code !==200) return JDV::raw($ss);
      //$req = {'sender_id','bank_accounts' => [{bank_name,account_number, account_name},...]}
      $sender = new Sender($ss->official_id,$ss);
      $err = $sender->saveBankAccounts($req->bank_accounts);
      if($err)   return JDV::error($err);
      return JDV::success();  
    }
 
    function get_faq_list_driver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $app_id = Config::get('app.driver_app_id');
      //$req['app_id'] = $app_id;
      $r = MobileAppSettings::get_faq_list($app_id);
      return JDV::result($r);
    }

    //used to scan package on Driver Mobile app.
    function getPackageDetails(Request $request){
        $ss = UM::getUserInfoByToken($request,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $row = $this->tripModel->getPackageDetails($ss->branch_id,$request->all());
        //This line is to convert package's status_id to String. for Driver mobile app to work
        if (isset($row->status_id)) $row->status_id = strval($row->status_id);
        return JDV::result($row);
    }

    function get_faq_list_sender(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $app_id = Config::get('app.merchant_app_id');
      //$req['app_id'] = $app_id;
      $r = MobileAppSettings::get_faq_list($app_id);
      return JDV::result($r);
    }

    function getTermsAndConditions_merchant(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $app_id = Config::get('app.merchant_app_id');
      $text = MobileAppSettings::getTermsAndConditions($app_id,$ss);
      return JDV::result($text);
    }

    function getTermsAndConditions_driver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $app_id = Config::get('app.driver_app_id');
      $text = MobileAppSettings::getTermsAndConditions($app_id,$ss);
      return JDV::result($text);
    }
 
    function savePickupRequest(Request $req){
        $ss= UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $d = $req->all();
        if (strtolower($ss->user_class) ==='merchant'){
          $d['sender_id'] = $ss->official_id;
        }
        $d['is_from_mobile'] =1;
        $res = $this->pickupRequestModel->savePickupRequest($ss,$d);
        if($res->status ==='OK'){
            return JDV::success(['order_id'=>$res->order_id,'tracking_number'=>$res->tracking_number]);
        }else return JDV::error($res->error_message);
    }
  
    /** Driver App => create delivery Order by uploading package photos, the "QTY = count of photo"  */
    function createOrderWithPhotos(Request $req){
      $ss= UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $d = $req->all();
      if (strtolower($ss->user_class) !=='driver'){
        return JDV::error('Only Driver users are allowed to create Order by uploading photos');
      }
      $d['is_from_mobile'] =1;
      $res = $this->pickupRequestModel->createOrderWithPhotos($ss,$d);
      if($res->status ==='OK'){
          return JDV::success(['order_id'=>$res->order_id,'tracking_number'=>$res->tracking_number]);
      }else return JDV::error($res->error_message);
  }

  function pickPackagePhotos(Request $req){
    $ss= UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    if (strtolower($ss->user_class) !=='driver'){
      return JDV::error('Only Driver users are allowed to pick order by uploading photos');
    }
    $order_id = $req->order_id ?? $req->id;
    $res = $this->pickupRequestModel->pickPackagePhotos($req->photos, $order_id, $ss);
    return JDV::raw($res);  
}

    //returns list of outstanding Delivery Orders to Merchant Mobile App
    function getOutstandingDeliveryOrders(Request $req) {
      $ss= UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
       $order = new PickupRequest(null,$ss);
       //$ss->official_id is $sender_id, assuming that this api is called from Merchant Mobile app
       return JDV::result($order->getOutstandingDeliveryOrders($ss->official_id,$ss));
    }

    //$d = {[sender_id],delivery_type,zone_code,df_payer,price,height,width,length,billed_kg}
    //returns sender_total, driver_total,base_fee, delivery_fee,cod_fee, forwarding_cost 
    function estimatePrice(Request $req){
        $user_class = 'sender'; // $request->user_class;
        //if($request->app_id === Config::get('app.merchant_app_id')()) $user_class = "merchant";
        //else if ($request->app_id === Config::get('app.driver_app_id'))$user_class ='driver'; 
        //else return api_response("App ID is not correct! This api is used Merchant App only",353);

        $ss= UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

        $sender_id = $ss->official_id;
        $cod = $req->cod;
        $delivery_type = $req->delivery_type;
        $zone_code = $req->zone_code;
        $price =is_numeric($req->price)?$req->price:0;

        $width = is_numeric($req->width)?$req->width:0;
        $length = is_numeric($req->length)?$req->length:0;
        $height = is_numeric($req->height)?$req->height:0;
        $kg = ROUND(($height*$width*$length)/6015,2);
        $weight = is_numeric($req->weight)?$req->weight:0;
        $df_payer = isset($req->df_payer)? sanitize($req->df_payer):'sender';

        if($kg> $weight) $weight = $kg;
        $p = new Package(null,$ss);
        $priceInfo = $p->getDeliveryPriceInfo($ss->branch_id,$sender_id,$delivery_type,$zone_code,$weight,$cod);
        if ($priceInfo->base_fee < 0){
          $priceInfo->status_code =405;
          $priceInfo->status ='Error';
          $priceInfo->error_message ='មិនមានការកំណត់តំលៃដែលត្រូវតាមលក្ខខណ្ឌនេះទេ!';
          return JDV::raw($priceInfo);
        } 
        $cod_fee = 0;
        $sender_net = 0;
        if ($priceInfo->base_fee >= 0 && $priceInfo->delivery_fee >=0)
          {
            $fees = ($priceInfo->base_fee + $priceInfo->delivery_fee);
            $sender_net = $price;
            if($df_payer =='sender'){
               $cod_fee = ($price + $fees) * $priceInfo->cod_fee_percent/100;
               $sender_net -= ($fees + $cod_fee);
            }else {
              $sender_net -= $cod_fee;
            }  
            $priceInfo->total = ($sender_net <0)? (-$sender_net):$sender_net;
          }
        else $priceInfo->total = 0;

        $priceInfo->status_code ==200;
        return JDV::raw($priceInfo);
    }

    function getPriceInfo_merchant(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $req['user_class'] = strtolower($ss->user_class);
      return $this->getDeliveryPriceInfo($req);
    }

    function getPriceInfo_driver(Request $req){
      //$req->user_class ='driver';
      $req['user_class'] = 'driver';
      return $this->getDeliveryPriceInfo($req);
    }

    //get Delivery Price info for Estimate Price | and for Calculating total as merchant enters package details
    //$d = {app_id,sender_id,delivery_type,zone_code,[df_payer],weight | billed_kg,price}
    function getDeliveryPriceInfo(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $user_class = $ss->user_class;
      $sender_id = $ss->official_id;
      
      $delivery_type = $req->delivery_type;
      $zone_code = $req->zone_code;
      $cod =$req->cod;

      $price = isset($req->price)?$req->price:0;
      $df_payer = isset($req->df_payer)?$req->df_payer:'sender';
      $billed_kg = floatval($req->billed_kg)>=0 ? floatval($req->billed_kg):0;
      if (!$billed_kg) $billed_kg = is_numeric($req->weight)?$req->weight:0;
      $r = $this->packageModel->getDeliveryPriceInfo($ss->branch_id,$sender_id,$delivery_type,$zone_code,$billed_kg,$cod);
      
      $driver_total =0;
      $sender_total = 0;
      $cod_fee =0;
      if ($r->status ==='Error' || !isset($r->base_fee) || $r->base_fee < 0) {
        $r->sender_total =0;
        $r->driver_total =0;
        $r->base_fee = -1;
        $r->delivery_fee = -1;
        $r->total = 0; 
        return $r;

      }else{
         $sender_net =0;
         if($r->cod ==1) {
           $cod_fee = ($price + $r->base_fee + $r->delivery_fee) * $r->cod_fee_percent/100;
         }else {
          $price =0;
          $cod_fee =0;
         }

         if(strtolower($df_payer?$df_payer:"") ==='sender'){
            $sender_total = $r->base_fee + $r->delivery_fee + $cod_fee;
            $driver_total = $price;
            if ($cod ==1) $sender_net = $price - $cod_fee;
            $sender_net  -= $r->base_fee + $r->delivery_fee;
         } else{
            $driver_total = $price + $r->base_fee + $r->delivery_fee;
            if ($cod ==1) $sender_net = $price - $cod_fee; 
            $sender_total = $sender_net;
         }

         $r->driver_total = number_format($driver_total,2);
         $r->sender_total = number_format($sender_total,2);
         $r->cod_fee = number_format($cod_fee,2);
         //$r->cod= ($cod_fee>0)?1:0;

         if($user_class ==='merchant' || $user_class ==='sender')
           $r->total = number_format($sender_net,2);
         else 
           $r->total =number_format($driver_total,2);
         return $r;
      }  
     
    }

    /** return commissions for Driver only */ 
    function getDriverCommissions(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $rpt = new \App\Models\Report(); 
      $driver_id = 0;
      if(strtolower($ss->user_class) ==='driver') $driver_id =  $ss->official_id;
      $data = $rpt->getDriverCommissionItems($ss,null,$driver_id,$req->start_date,$req->end_date);
      return JDV::result($data);
    }

    //return a list of avaialble pickups for driver to accept.
    //Available orders may depend on driver's current location (distance measured in km)
    function getAvailableOrdersByDriver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if ($ss->status_code !==200) return JDV::raw($ss);
      $driver = new Driver($ss->official_id,$ss);  
      //$rows =  $this->pickupRequestModel->getAvailablePickupList($ss,$request->all());
      return JDV::result($driver->getAvailableOrders($req->all())); 
     }

     function getAcceptedOrdersByDriver(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !=200) return JDV::raw($ss);
        $driver = new Driver($ss->official_id,$ss);
        $rows =  $driver->getAcceptedOrders();
        return JDV::result($rows);
     }
      
      //Returns list of zones for mobile apps
      function getComboItems_merchant_mobile(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !=200) return JDV::raw($ss);
        $rows = (\App\Models\GeneralSettings::options_merchant_mobile($ss)); 
        return JDV::result($rows);
     }
 
      //   //Returns list of zones for mobile apps
      //   function getComboItems_merchant(Request $req) {
      //     $ss = UM::getUserInfoByToken($req,-1);
      //     if ($ss->status_code !=200) return JDV::raw($ss);
      //     $rows = (\App\Models\GeneralSettings::options_merchant($ss)); 
      //     return JDV::result($rows);
      //  }

    //  //Returns list of zones for mobile apps
    //  function getZoneList_driver(Request $request) {
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !== 200) return JDV::raw($ss);
    //     return JDV::result(\App\Models\GeneralSettings::options_zone($ss));
    //  }

    //   //Returns list of zones for mobile apps
    //   function getZoneList_sender(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !== 200) return JDV::raw($ss);
    //     return JDV::result(\App\Models\GeneralSettings::options_zone($ss));
    //  }

    //Returns list of zones for mobile apps
    function getComboItems_zone(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !== 200) return JDV::raw($ss);
        return JDV::result(\App\Models\GeneralSettings::options_zone($ss));
     }

    //Returns list of zones for mobile apps
    function getZoneList(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      return JDV::result(\App\Models\DeliveryZone::listAll($req->all(),$ss));
    }

      function getPickupListBySender(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !== 200) return JDV::raw($ss);
          $req['sender_id'] = $ss->official_id?$ss->official_id:-1;
          $rows =  $this->pickupRequestModel->getList($req->all(),$ss);
          return JDV::result($rows); 
        }
         
      function getSenderDetails(Request $req) {
            $ss = UM::getUserInfoByToken($req,-1);
            if($ss->status_code !==200) return JDV::raw($ss);
            return JDV::result(Sender::details($ss->official_id,$ss,true,true));
       }

      function getMerchantAddress(Request $req) {  
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !==200) return JDV::raw($ss);
          $sender = Sender::details($ss->official_id,$ss,false,false);
          return JDV::result($sender?$sender->address:'');
      }

      //For Merchant mobile app. Returns a order details with payment status.
      //$d = {tracking_number}
      function getOrderDetails_sender(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->order_id?$req->order_id:$req->id;
        $order = new \App\Models\DeliveryOrder($id,$ss);
        $data = $order->getDetails();
        return JDV::result($data);
    }

    //test authentication
     function auth_test(Request $request) {
        $user_class = $request->role;
        $result = $this->UMModel->auth_test($request,$user_class);
        return api_response($result);
     }

      //This function is called by both Merchant App and Driver App.
      function getOrderDetails(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $order_id = $req->id?$req->id:$req->order_id;
        return JDV::result($this->packageModel->getOrderDetails($order_id));     
      }
  

    function encryptData(Request $request){
      //$request->app_id = $request->app_id;
      $m_str = $request->data;
      $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
      $m_str = $encrypter->encrypt($m_str,false); //FALSE => to avoid serialization issue in decryption
      return api_response($m_str);     
    }

   function activateSender_otp(Request $req) {
     $ss = UM::getUserInfoByToken($req,-1);
     if($ss->status_code !==200) return JDV::raw($ss);
     $sender = new Sender($ss->official_id,$ss);
     $res = $sender->activateSender_otp($req->all()); 
     return JDV::raw($res); 
   }
   
   function getDeliveryItems_sender_mobile(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $req['sender_id'] = $ss->official_id;
    // use_default_dates =0 => if no dates supplied then get package list for All dates
    //if use_default_dates =1 => if no dates supplied then use today dates to query data
    if(!isset($req['use_default_dates'])) $req['use_default_dates'] = 0;
    $req['is_from_mobile'] =1;
    $p = new Package(null,$ss);
    $data= $p->getDeliveryItemsBySender_mobile($req->all(),$ss);
    return JDV::result($data);
 }

 function getDeliveryItems_driver_mobile(Request $req) {
    $ss = UM::getUserInfoByToken($req);
    if($ss->status_code !==200) return JDV::raw($ss);
    $p = new Package(null,$ss);
    $rows = $p->getDeliveryItemsByDriver_mobile($req->all());
    //if use_default_dates =1 => if no dates supplied then use today dates to query data
    return JDV::result($rows);
  }

  function updateProfile_sender(Request $req) {
        $ss = UM::getUserInfoByToken($req);
        if($ss->status_code !==200) return JDV::raw($ss);
        if(strtolower($ss->user_class) !='merchant') return DV::error('You are not a merchant or sender');
        $sender = new Sender($ss->official_id,$ss);
        $res = $sender->updateProfile_mobile($req->all(),$ss->official_id,$ss);
        return JDV::raw($res);
  }

    //$d = {name, [phone_number], email, address}
    function updateProfile_driver(Request $req) {
      $ss = UM::getUserInfoByToken($req);
      if($ss->status_code !==200) return JDV::raw($ss);
      if (strtolower($ss->user_class) !=='driver') return DV::error('You are not a driver');
      $id =  $ss->official_id;
      $d = new Driver($id,$ss);
      $res = $d->updateProfile_driver($req->all(),$id);
      return JDV::raw($res); 
   }

   function getRemarksList(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      return JDV::result(GeneralSettings::options_driver_remark($ss));
   }

  function getDeliveryRemarks(Request $req){
    //$ss = UM::getUserInfoByToken($req,-1);
    //if($ss->status_code !==200) return JDV::raw($ss);
    $ss = (object)['branch_id'=>1,'user_id'=>null];
    $category = strtolower($req->category? $req->category:'');
    if(!in_array($category,['failure','success'])) return DV::error('Please specify the category of remarks, which can be Failure or Success');
    return JDV::result(GeneralSettings::options_delivery_remark($req->category,$ss));
  }

   function getTransactionList_merchant(Request $req) {
      $ss = UM::getUserInfoByToken($req);
      if($ss->status_code !==200) return JDV::raw($ss);
      $req['sender_id'] = $ss->official_id;
      $trxModel = new PaymentTransaction(null,$ss);
      $data = $trxModel->getTransactionList_merchant($req->all());
      return JDV::result($data);
   }

   function getTransactions_merchant(Request $req) {
    $ss = UM::getUserInfoByToken($req);
    if($ss->status_code !==200) return JDV::raw($ss);
    $req['sender_id'] = $ss->official_id;
    $trxModel = new PaymentTransaction(null,$ss);
    $data = $trxModel->getTransactions_merchant($req->all(),$ss);
    return JDV::result($data);
   }
  
   function getTransactions_driver(Request $req) {
    $ss = UM::getUserInfoByToken($req);
    if($ss->status_code !==200) return JDV::raw($ss);
    $req['driver_id'] = $ss->official_id;
    $trxModel = new PaymentTransaction(null,$ss);
    $data = $trxModel->getTransactions_driver($req->all(),$ss);
    return JDV::result($data);
   }

   function getTransactionList_driver(Request $req) {
    $ss = UM::getUserInfoByToken($req);
    if($ss->status_code !==200) return JDV::raw($ss);
    $req['driver_id'] = $ss->official_id;
    $trxModel = new PaymentTransaction(null,$ss);
    $data = $trxModel->getTransactionList_driver($req->all());
    return JDV::result($data);
 }
  
 //for Merchant (only) to upload photo about payment transaction (Merchant Mobile app)
 //$d = {package_id,file-content or img_data}
 function savePackageAttachment(Request $req) {
    $ss = UM::getUserInfoByToken($req);
    if($ss->status_code !==200) return JDV::raw($ss);
    $req['sender_id'] =$ss->official_id;
    $id = $req->package_id?$req->package_id:$req->id;
    $p = new Package($id,$ss);
    $res = $p->savePackageAttachment($req->all());
    return JDV::raw($res);
 }
 
    //for Merchant (only) to upload photo about a package (Merchant Mobile app)
    //$d = {package_id,upload_id or id}
    function deletePackageAttachment(Request $req) {
      $ss = UM::getUserInfoByToken($req);
      if($ss->status_code !==200) return JDV::raw($ss);
      $req['sender_id'] = $ss->official_id;
      $package_id = $req->package_id;
      $image_id = $req->image_id;
      $p = new Package($package_id,$ss);
      $res = $p->deletePhoto($image_id);
      return JDV::raw($res);
    }

   function registerDriver(Request $request) {
      $request['app_id'] = $request->app_id;
      $r = $this->driverModel->registerDriver($request);
      return JDV::raw($r);
  }

   function activateDriver_otp(Request $req) {
    $ss = UM::getUserInfoByToken($req);
    if($ss->status_code !==200) return JDV::raw($ss);
      $req['driver_id'] = $ss->official_id;
      $d = new Driver($ss->official_id,$ss);
      $r = $d->activateDriver_otp($req->all(),$ss);
      return JDV::raw($r);
   }

   //driver cancel order after being assigned to
   function cancelOrder(Request $req) {
    $ss = UM::getUserInfoByToken($req);
    if($ss->status_code !==200) return JDV::raw($ss);
      $req['driver_id'] = $ss->official_id;
      $req['user_class'] = $ss->user_class;
      $d = new Driver(null,$ss);
      $res = $d->cancelOrder($req->all(),$ss);
      return JDV::raw($res);
  }

   //Driver deactive his account
  function deactivateMySelf_driver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $res = UM::deactivateMySelf($req->all(),$ss);
      return JDV::raw($res);
   }

  //Merchant deactive his account
  function deactivateMySelf_merchant(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !== 200) return JDV::raw($ss);
    $res = UM::deactivateMySelf($req->all(),$ss);
    return JDV::raw($res);
  }

  //getProfileInfo_driver() and getProfileInfo_sender()
  function getProfileInfo(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
    $data = null;
    if($ss->user_class==='merchant'){
      $data = Sender::details($ss->official_id,$ss,true,true);
    }else{
      $data =Driver::details_mobile($ss->official_id,$ss);
    }
    if(!$data) return JDV::error('It seems your profile information deos not exist or is missing');
    $data->notif_topic_private= $ss->branch_id.topic_prefix($ss->user_class)."private".$ss->user_id;
    $data->notif_topic_general=$ss->branch_id.topic_prefix($ss->user_class)."general";
    return JDV::result($data);
  }
     
  //returns $official_id based on a given @access_token
  function getOfficialId_driver(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    return JDV::result($ss);
  }

  function getOfficialId_merchant(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    return JDV::result($ss); 
  }
 
//  function getProfileInfo_driver(Request $req){
//     $ss = UM::getUserInfoByToken($req,-1);
//     if($ss->status_code !==200) return JDV::raw($ss);
//     //NOTE that method Driver::details($ss->official_id,$ss) returns full details (but not include "notif_topic" ) and used by Backend only
//     $data = Driver::details_mobile($ss->official_id,$ss);
//     if(!$data) $data=(object)[];
//     $data->notif_topic_private= $ss->branch_id.topic_prefix($ss->user_class)."private".$ss->user_id;
//     $data->notif_topic_general=$ss->branch_id.topic_prefix($ss->user_class)."general";
//     return JDV::result($data); 
//  }

 function getMyTasks(Request $req){
  $ss = UM::getUserInfoByToken($req,-1);
  if($ss->status_code !==200) return JDV::raw($ss);
  //$driver_id = $ss->official_id;
  $driver = new Driver($ss->official_id,$ss);
  return JDV::result($driver->getMyTasks());
}

function getMyTaskCounts(Request $req){
  $ss = UM::getUserInfoByToken($req,-1);
  if($ss->status_code !==200) return JDV::raw($ss);
  $driver = new Driver($ss->official_id,$ss);
  return JDV::result($driver->getMyTaskCounts());
}

 //returns list of product types to Merchan Mobile app
 function getComboItems_product_type(Request $request){
  $ss = UM::getUserInfoByToken($req,-1);
  if($ss->status_code !==200) return JDV::raw($ss);
   return JDV::result(\App\Models\GeneralSettings::options_product_type($ss));
 }
     
   function pickOrder(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $req['driver_id'] = $ss->official_id;
    $p = new Package(null,$ss);
    $r = $p->pickOrder($req->all(),$ss);
    return JDV::raw($r);
   }

   function getPackageListByDriver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1); 
      if ($ss->status_code !=200) return JDV::raw($ss);
      $req['driver_id'] =$ss->official_id;
      $rows = $this->driverModel->getPackageListByDriver($ss,$req);
      return JDV::result($rows);
   }
  
   function pickOrderPackages(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1); 
    if ($ss->status_code !=200) return JDV::raw($ss);
    $req['driver_id'] = $ss->official_id;
    $p = new Package(null,$ss);
    $data = $p->pickOrderPackages($req->all());
    return JDV::raw($data);
   }

   function send_otp_preregister_driver(Request $req) {
    $res = $this->driverModel->send_otp_preregister($req->all());
    return JDV::raw($res);
  }

   //$d = {'phone_number'}
   function send_otp_preregister_sender(Request $req) {
     $res = $this->senderModel->send_otp_preregister($req->all());
     return JDV::raw($res);
   }

  //  //$d = {'phone_number','otp_code'}
  //  function verify_otp_preregister(Request $req) {
  //   $res = $this->senderModel->verify_otp_preregister($req->all());
  //   return JDV::result($res);
  // }
  function verify_otp_preregister_driver(Request $req) {
    $res = $this->driverModel->verify_otp_preregister($req->all());
    return JDV::result($res);
  }

  function verify_otp_preregister_sender(Request $req) {
    $res = $this->senderModel->verify_otp_preregister($req->all());
    return JDV::result($res);
  }

  //just send otp to user's phone number.
  //$d = {app_id, [purpose],[phone_number]}
  //@purpose ={'change_password'}
  function sendSMS_otp(Request $request){
      $res = $this->UMModel->sendSMS_otp($request);
      return JDV::result($res);
  }

  // //verify otp_code by phone or email
  // //$d= {app_id,otp_code,[login_name]}
  // function verify_otp(Request $req){
  //     $ss = UM::getUserInfoByToken($req,-1);
  //     if(!$ss->status_code !==200) return JDV::raw($ss);
  //     //$user_class =null;
  //     //if($req->app_id === Congig::get('app.merchant_app_id')) $user_class ='merchant';
  //     //else if ($req->app_id === Config::get('app.driver_app_id')) $user_class ='driver';
  //     //else return JDV::error("app_id or user class is not correct!");
   
  //     //$req->user_id = $user->user_id; //NOTE: $user->id is the sender_id or driver_id, while $user->user_id is "um_users.id"
  //     //$req->login_name = $user->login_name;
  //     //$request->phone_number = $user->phone_number;
  //     $success = $this->UMModel->verify_otp($req->otp_code,$ss);
  //     return JDV::result($success);
  // }
 
  //$d= {'phone_number','password','confirm_pwd',['name'],['address'],['business_type']}
  function registerSender(Request $req) {
    $r = $this->senderModel->registerSender($req->all());
    return JDV::raw($r);
  }
 
   function pickOrderPackages_fast_delivery(Request $req){
      $ss = UM::getUserInfoByToken($req,-1); 
      if ($ss->status_code !=200) return JDV::raw($ss);
      $req['driver_id'] = $ss->official_id;
      $data = $this->packageModel->pickOrderPackages_fast_delivery($req->all());
      return api_response($data);
   }
   
   function getPackagesByDriver(Request $req){
     $ss = UM::getUserInfoByToken($req,-1); 
     if ($ss->status_code !=200) return JDV::raw($ss);
      $req['driver_id'] = $ss->official_id;
      $p = new Package(null,$ss);
      $r = $p->getPackagesByDriver($req->all());
      return api_response($r);
   }

   function acceptPickupRequest(Request $req){
    return JDV::error("ចាំការបញ្ជារពី Admin");
    // $ss = UM::getUserInfoByToken($req,-1);
    // if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
    // $res = $this->pickupRequestModel->acceptPickupRequest($ss,$req);
    // if($res->status==='OK') return JDV::success(['order'=>$res->order]);
    // else return JDV::error($res->error_message);
 }

  function getExchangeRate(Request $req){
    $ss = UM::getUserInfoByToken($req,-1); 
    if ($ss->status_code !=200) return JDV::raw($ss);
    $req['driver_id'] = $ss->official_id;
    $ex = GeneralSettings::getExchangeRate(null,$ss);
    return JDV::raw($ex);
 }

//  function getExchangeRate_driver(Request $req){
//   $ss = UM::getUserInfoByToken($req,-1); 
//   if ($ss->status_code !=200) return JDV::raw($ss);
//   $req['driver_id'] = $ss->official_id;
//   $r = $this->priceModel->getExchangeRateBySender($req->all(),$ss);
//   return JDV::result($r);
//  }

// function getExchangeRate_sender(Request $req){
//   $ss = UM::getUserInfoByToken($req,-1); 
//   if ($ss->status_code !=200) return JDV::raw($ss);
//   $req['sender_id'] = $ss->official_id;
//   $r = $this->priceModel->getExchangeRateBySender($req->all(),$ss);
//   return JDV::result($r);
// }

function getActiveTrips(Request $req){
  $ss = UM::getUserInfoByToken($req,-1);
  if($ss->status_code !==200) return JDV::raw($ss);
  $id = $req->driver_id?$req->driver_id:$req->id;
  $driver = new Driver($id,$ss);
  $data = $driver->getActiveTrips();
  return JDV::result($data);
}
 //getPackageListByTrip() for Driver mobile app. It returns list of packages within a given delivery trip  
  function getPackageListByTrip(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->delivery_id?$req->delivery_id:$req->id;
    $trip = new DeliveryTrip($id,$ss);
    $data = $trip->getPackageList();
    return JDV::result($data);
  }

  //driver updates package status from "On Delivery" to "Delivered" or to "Failed" with a reason
  function updatePackageStatus_driver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $req['driver_id'] = $ss->official_id;
      $req['is_from_mobile'] =1;
      $res = $this->tripModel->updatePackageStatus_driver($req->all(),$ss);
      //Avoid two layers of response causing confusion: status='OK', data:{ status:'Error',error_message='some error here'}
      //if ($r->status ==='Error') return response()->json($r);
      if($res->status ==='OK'){
        unset($res->status);
        unset($res->status_code);
        unset($res->error_message);
        return JDV::result($res);
      }
      return JDV::raw($res);
  }

  function updatePhoneNumber_merchant(Request $req){
    $ss = UM::getUserInfoByToken($req,-1); 
    if($ss->status_code !==200) return JDV::raw($ss);
    $res = PendingTask::finish('change_phone_number',$ss->user_id, $req->otp_code);
    return JDV::raw($res);
  }

  //$d= {otp_code,user_id}
  function updatePhoneNumber_driver(Request $req){
    $ss = UM::getUserInfoByToken($req,-1); 
    if($ss->status_code !==200) return JDV::raw($ss);
    //$driver_id = $ss->official_id; 
     //finish(action_name,user_id,otp_code)
     //update phone number will also update login name
    $res = PendingTask::finish('change_phone_number',$ss->user_id, $req->otp_code);
    return JDV::raw($res);
  }
 
  //merchant or driver can submit old password, new password to set password
  function changePassword_merchant(Request $req){
    $ss = UM::getUserInfoByToken($req,-1); 
    if($ss->status_code !==200) return JDV::raw($ss);
    $res = UM::changeUserPassword($ss->user_id, $req->old_password, $req->new_password);
    return JDV::raw($res);
  }

  //after successfully verified OTP code, user submit new password with that otp_code in order to set new password
  //$d = {login_name,password,otp_code}
  function setPassword_otp(Request $req){   
    $ss = UM::getUserInfoByToken($req,-1); 
    if($ss->status_code !==200) return JDV::raw($ss);
    $login_name = $req->login_name ?? $req->phone_number;
    $otp_code = $req->otp_code; 
    //verify_otp() return true if succeeded, otherwise returns error message
    $success = UM::matchOTP($login_name,$otp_code,$ss->user_class);
    if ($success){
      $res = $this->UMModel->setPassword($req->all(),$ss);
      return JDV::raw($res);
    }else return JDV::error('OTP Code is not correct!'); 
  }

  //Reset password. In case of Forget password
  //@d = {'phone_number','otp_code','password'};
  function resetPassword_driver(Request $request){
    $user_class = 'driver';
    $login_name = $request->login_name?$request->login_name:$request->phone_number;
    //if no login_name supplied => use "phone_number" as login name
    //if(!$login_name) $login_name = $request->phone_number;
    $otp_code = $request->otp_code;
    $password = $request->password;
    $res = UM::resetPassword_forget($login_name,$user_class,$otp_code,$password);
    return JDV::raw($res);
  }

  //Reset password. In case of Forget password
  //@d = {'phone_number','otp_code','password'};
  function resetPassword_merchant(Request $request){
    $user_class = 'merchant';
    $login_name = $request->login_name?$request->login_name:$request->phone_number;
    $otp_code = $request->otp_code;
    $password = $request->password;
    $res = UM::resetPassword_forget($login_name,$user_class,$otp_code,$password);
    return JDV::raw($res);
  }

  //merchant or driver can submit old password, new password to set password
  function changePassword_driver(Request $req){
    $ss = UM::getUserInfoByToken($req,-1); 
    if($ss->status_code !==200) return JDV::raw($ss);
    //finish(action_name,user_id,otp_code)
    $r = UM::changeUserPassword($ss->user_id, $req->old_password, $req->new_password);
     return JDV::raw($r);
  }

  function finishDeliveryTrip_driver(Request $req){
    $ss = UM::getUserInfoByToken($req,-1); 
    if($ss->status_code !==200) return JDV::raw($ss);
    $req['driver_id'] = $ss->official_id;
    $id = $req->delivery_id?$req->delivery_id:$req->id;
    $trip = new DeliveryTrip($id,$ss);
    $res = $trip->finishDeliveryTrip($req->all(),$ss);
    return JDV::raw($res);
  }

    //Driver scan package out On Delivery. Driver uses Mobile app to scan package.
    //$d = {'driver_id','bcarcode' or 'package_id'}
    function scanPackageOut_driver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1); 
      if($ss->status_code !==200) return JDV::raw($ss);
      $req['driver_id'] = $ss->official_id;
      $req['is_from_mobile'] =1;
      $res = $this->tripModel->scanPackageOut_driver($ss,$req->all());
      return JDV::raw($res);
    }

  function startDeliveryTrip_driver(Request $req){
    $ss = UM::getUserInfoByToken($req,-1); 
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->delivery_id?$req->delivery_id:$req->id;
    $trip = new DeliveryTrip(null,null);
    $res= $trip->startTrip(['delivery_id'=>$id,'driver_id'=>$ss->official_id],$ss);
    if($res->status ==='OK') return JDV::success(['fleet_tracking_number'=>$res->fleet_tracking_number]);
    return JDV::error($res->error_message);
  }

  function getComboItems_vehicleType(Request $req){
     $ss = UM::getUserInfoByToken($req,-1); 
     if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->driver_id?$req->driver_id:$req->id;
      $d = new Driver($id,$ss);
      $r = $d->getComboItems_vehicleType($ss);
      return JDV::result($r);
  }
  
    //This method is for Driver mobile app only to retrieve commissions for pickup and deliveries in summarized values
    function getDriverCommissionItems_mobile(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $driver_id = $ss->official_id;
      if(strtolower($ss->user_class) !=='driver') $driver_id =$req->driver_id; 
      /*request = {driver_id, start_date, end_date, delivery_type}*/
      $data = $this->reportModel->getDriverCommissionItems_mobile($ss,$driver_id, $req->start_date,$req->end_date);
      return JDV::result($data);
    }

    //This method is for Driver mobile app only to retrieve total amount a driver as to pay to company
    function getTotalDue_driver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $driver_id = $ss->official_id;
      if(strtolower($ss->user_class) !== 'driver') $driver_id = $req->driver_id;
      /*request = {driver_id, start_date, end_date, delivery_type}*/
      $data = $this->reportModel->getDriverTotalDue($driver_id, $req->start_date,$req->end_date);
      return JDV::result($data);
    }
    function getReportData_driver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $driver_id =$ss->official_id;
      if($ss->user_class !=='driver') $driver_id = $req->driver_id;
      /*request = {driver_id, start_date, end_date, delivery_type}*/
      $data = $this->reportModel->getDriverReport_mobile($ss,$driver_id, $req->start_date,$req->end_date);
      return JDV::result($data);
    }
    

    //This method is for Driver mobile app only. So must log in as driver to access this function
    function countPackagesByTrip(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
        $driver_id = $ss->official_id;
        if(strtolower($ss->user_class) !=='driver') $driver_id = $req->driver_id;
        $cnt = $this->tripModel->countPackagesByTrip($req->all(),$ss);
        return JDV::result($cnt);
    }
     
    //Check if (phone_number,otp_code) is exists in table um_users (used in forget password case)
    function matchOTP_driver(Request $request){
      $user_class ='driver';
      $login_name = $request->login_name ?? $request->phone_number;
      $otp_code = $request->otp_code;
      $r = UM::matchOTP($login_name,$otp_code,$user_class);
      return JDV::result($r?'true':'false');
    }

    function matchOTP_merchant(Request $request){
      $user_class = 'merchant';
      $login_name =  $request->login_name ?? $request->phone_number;
      $otp_code = $request->otp_code;
      $r = $this->UMModel->matchOTP($login_name,$otp_code,$user_class);
      return JDV::result($r);
    }

    //Send OTP to phone when forgeting password (Driver mobile)
    function sendOTPCode_phone_driver(Request $req){
      //$user_class = isset($request->user_class)?strtolower($request->user_class):null;
      //$d = {"phone_number","user_class"}
      $ss = ['branch_id'=>1];
      $req['user_class'] ='driver';
      $res = $this->UMModel->sendOTPCode_phone($req->all(),$ss);
      return JDV::raw($res);
    }
    
     //Send OTP to phone when forgeting password (Merchant mobile)
    function sendOTPCode_phone_merchant(Request $req){
      $ss = ['branch_id'=>1];
      $req['user_class'] ="merchant";
      $res = $this->UMModel->sendOTPCode_phone($req->all(),$ss);
      return JDV::raw($res);
    }

    function sendSMS(Request $request){
      $sender_name = null;
      $res = SMS::send($request->phone_number,$request->text,$sender_name);
      return JDV::raw($res);
    }

    //return list of Promotions to Merchant App
    //$d = {'app_id',[category]}
    function getPromotionList_merchant(Request $request){
      $ss = UM::getUserInfoByToken($request,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $promo = new Promotion();
        $rows = $promo->getPromotionList($ss,$request->all());
        return JDV::result($rows);     
    }
      
    //returns list of images for Driver's Mobile App
     function getBrandImages_driver(Request $request){
        $driver_app_id = Config::get('app.driver_app_id');
        return JDV::result(MobileAppSettings::getBrandImages($driver_app_id,null));
    }
     //returns list of images for Merchant's Mobile App // Images for Vendor App
    function getBrandImages_sender(Request $request){
      $merchant_app_id = Config::get('app.merchant_app_id');
      return JDV::result(MobileAppSettings::getBrandImages($merchant_app_id,null));
   }

    //return list of counts of packages for status below "Picked and Booked", where Qty of packages are stored in table "order".qty  
   function getPackageCounts_order(Request $req){
     $ss = UM::getUserInfoByToken($req,-1);
     if($ss->status_code !==200) return JDV::raw($ss);
      $sender_id = $ss->official_id;
      $data = $this->pickupRequestModel->getPackageCounts_order($sender_id,$ss);
      return JDV::result($data);   
  }
 
  //return list of counts of packages by status Starting from "Arrived At Warehouse" to the complete (the end)
  function getPackageCounts_summary(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
     //Assuming that $ss->user_class = "merchant"
      $id = $ss->official_id;
      $data = $this->packageModel->getPackageCounts_summary($id,$ss);
      return JDV::result($data);     
  }
 
  //return list of COUNTS for merchant's app home screen (Order Summary)
  function getOrderSummaryCounts(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    //Assuming that $ss->user_class = "merchant"
      $id = $ss->official_id;
      /** NOTE: $arr_d returned by getPackageCounts_order() must be an object */
      $arr_d =$this->pickupRequestModel->getPackageCounts_order($id,$ss); 
      $d1 = $this->packageModel->getPackageCounts_summary($id,$ss);
      //combine multiple steps into on step called "picked_count" count on Merchant app home screen. "picked_count" is displayed as "Pickup" on Merchant Mobile App
      $combine_steps_as_pending = ['available_count','accepted_count'];
      $combine_steps_as_picked = ['picked_count'];
      $combine_steps_as_at_warehouse = ['at_warehouse_count','on_delivery_count'];
      $pending_count =0;
      $picked_count =0; // $pending_count = $available_count + accepted_count + picked_count + at_warehouse_count
      $on_delivery_count = 0; /** Combine on_delivery = At_warehouse + On_delivery */
      foreach($arr_d as $prop=>$value){
        if(in_array($prop,$combine_steps_as_pending)){
           $pending_count += $value;
           //$arr_d->$prop = $value; // maybe used to avoid mobile App error
        }else if(in_array($prop,$combine_steps_as_picked)){
            $picked_count+= $value;
        } 
        else $arr_d->$prop = $value;
      }
      foreach($d1 as $prop=>$value){
        if (in_array($prop,$combine_steps_as_at_warehouse))
          $on_delivery_count += $value;
        else $arr_d->$prop = $value;
      }

      $arr_d->available_count = $pending_count;
      $arr_d->pending_count = $pending_count;
      $arr_d->picked_count = $picked_count;
      $arr_d->on_delivery_count = $on_delivery_count;
      return JDV::result($arr_d);     
  }
  
   function getNotificationListByUser(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code!==200) return $ss;
      $rows = Notifier::getNotificationListByUser($ss);
      return JDV::result($rows); 
  }
 
   //return Order Summary list (that is list of packages or list of delivery orders) corresponding to each Order Summary count on home screen on Merchant App
   //getOrderSummary()
   function getOrderSummary_list(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
      $sender_id = $ss->official_id;
      $r = [];
      switch($req->status_id){
          case 1:{
            $r = $this->packageModel->getOrderSummarylist_pending($sender_id,$ss);
            break;
          }
          case 2:{
            $r = $this->packageModel->getOrderSummarylist_pending($sender_id,$ss);
            break;
          }
          // case 1:{
          //   $r = $this->packageModel->getOrderSummarylist_available($sender_id,$ss);
          //   break;
          // }case 2:{
          //   $r = $this->packageModel->getOrderSummarylist_accepted($sender_id,$ss);
          //   break; 
          // }
          case 3:{
            $r = $this->packageModel->getOrderSummarylist_picked($sender_id,$ss);
            break; 
          }
          //case 4:
          //{
          //   $r = $this->packageModel->getOrderSummarylist_picked($sender_id,$ss);
          //   break; 
          // }case 5:{
          //   $r = $this->packageModel->getOrderSummarylist_at_warehouse($sender_id,$ss);
          //   break; 
          // }
          case 6:{
            $r = $this->packageModel->getOrderSummarylist_on_delivery($sender_id,$ss);
            break; 
          }
          case 8:{
            $r = $this->packageModel->getOrderSummarylist_delivered($sender_id,$ss); 
            break;
          } 
          case 9:{
            $r = $this->packageModel->getOrderSummarylist_failed($sender_id,$ss); 
            break;
          } 
          case 11:{
            $r = $this->packageModel->getOrderSummarylist_returned($sender_id,$ss); 
            break;
          }default:{
            $r = [];
            break;
          }
      }
       return JDV::result($r);
   }

    function find_packages(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $p = new Package(null,$ss);
      $items=  $p->findPackages_quick($req->all(),$ss);
      return JDV::result($items);
    }
   
    //return list of settled packages per payment selttment (Merchant App)
    function getSettledPackages_sender_old(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $sender_id = $ss->official_id;
      if($ss->user_class !=='merchant' && $ss->user_class !=='sender') $sender_id = $req->sender_id;
      $trxModel = new PaymentTransaction();  
      return JDV::result($trxModel->getSettledPackages_sender_old($req->settlement_id,$ss));
    }

    function getSettledPackages_sender(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      // $sender_id = $ss->official_id;
      // if($ss->user_class !=='merchant' && $ss->user_class !=='sender') $sender_id = $req->sender_id;
      $trxModel = new PaymentTransaction();
      $trx_id = $req->trx_id?$req->trx_id: $req->sender_trx_id;
      return JDV::result($trxModel->getSettledPackages_sender($trx_id,$ss));
    }

    //return filter statuses for packages list in "Histories" page of Driver or Merchant app
    function getComboItems_filter_status_sender(Request $req){
      //$ss = UM::getUserInfoByToken($req,-1);
      //if($ss->status_code !==200) return JDV::raw($ss);
      $ss = (object)["branch_id"=>1];
      return JDV::result(\App\Models\GeneralSettings::options_pmt_status($ss));
    }

     //return filter statuses for packages list in "Histories" page of Driver or Merchant app
     function getComboItems_filter_package_status_sender(Request $req){
      return JDV::result(\App\Models\GeneralSettings::options_package_status(null));
    }
        
    function markReadAll(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $err =  Notifier::markReadAll($ss->user_id);
      if($err) return JDV::error($err);
      return JDV::success();
    }
  
    function markRead_driver(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $notif_id = $req->id? $req->id : $req->notif_id;   
        $r = Notifier::markRead($notif_id,$ss->user_id);
        return JDV::success();
    }

    function markRead_sender(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $notif_id = $req->id? $req->id : $req->notif_id;   
      $r =  Notifier::markRead($notif_id,$ss->user_id);
      return JDV::success();
    }

    // function markReadAll_sender(Request $request){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !==200) return JDV::raw($ss);
    //     $res =  Notifier::markReadAll($ss->user_id);
    //     return JDV::success();
    // }

    function getUnreadCount(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $cnt =  Notifier::getUnreadCount($ss->user_id,$ss->user_class);
      return JDV::result($cnt);
    }
 
    function getComboItems_filter_status_driver(Request $req){
      //$ss = UM::getUserInfoByToken($req,-1);
      //if($ss->status_code !==200) return JDV::raw($ss);
      return JDV::result(\App\Models\GeneralSettings::options_pmt_status(null));
    }

    function getComboItems_filter_package_status_driver(Request $req){
        //$ss = UM::getUserInfoByToken($req,-1);
        //if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(\App\Models\GeneralSettings::options_package_status(null));
    }

    //return list of settled packages per payment selttment (Driver App)
    function getSettledPackages_driver_old(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $driver_id = $ss->official_id;
      if($ss->user_class !=='driver') $driver_id = $req->driver_id;
      $trxModel = new PaymentTransaction();  
      return JDV::result($trxModel->getSettledPackages_driver_old($req->settlement_id,$ss));
    }

    function getSettledPackages_driver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      //$driver_id = $ss->official_id;
      //if($ss->user_class !=='driver') $driver_id = $req->driver_id;
      $trxModel = new PaymentTransaction();
      $trx_id = $req->trx_id?$req->trx_id: $req->driver_trx_id;  
      return JDV::result($trxModel->getSettledPackages_driver($trx_id,$ss));
    }

    //return Pending Order count for Driver's App home screen
    function getPendingOrderCount(Request $req){
      $ss = UM::getUserInfoBytoken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->driver_id?$req->driver_id:$req->id;
      $order = new PickupRequest(null,$ss);
      $data= $order->getPendingOrderCount($ss);
      return JDV::result($data);
   }

  //return My Taks count for Driver's App home screen
   function getDriverTaskCounts(Request $req){
      $ss = UM::getUserInfoBytoken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->driver_id?$req->driver_id:$req->id;
      $driver = new Driver($id,$ss);
      $data= $driver->getMyTaskCounts();
      return JDV::result($data);
  }
  
  function saveCurrentLocation_driver(Request $req){
    $ss = UM::getUserInfoBytoken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $driver_id = $ss->official_id;
    if($ss->user_class !=='driver'){
      $driver_id = $req->driver_id;
      $req['driver_id'] =$driver_id;
    }
    $err= $this->driverModel->saveCurrentLocation($req->all(),$driver_id,$ss);
    if(!$err) return JDV::success();
    return JDV::error($err);
  }

  function getCurrentLocation_driver(Request $req){
    $ss = UM::getUserInfoBytoken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $driver_id = $ss->official_id;
    if($ss->user_class !=='driver'){
      $driver_id = $req->driver_id;
      $req['driver_id'] =$driver_id;
    }
    $r= $this->driverModel->getCurrentLocation($driver_id,$ss);
    return JDV::result($r);
  }
 
  function getPackageListPerOrder(Request $req){
    $ss = UM::getUserInfoBytoken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $order_id = $req->order_id?$req->order_id:$req->id;
    $rows= $this->packageModel->getPackageListPerOrder($order_id);
    return JDV::result($rows);
  }
  
  function deleteOrderPakcages(Request $req){
    $ss = UM::getUserInfoBytoken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $barcode = $req->bar_code?$req->bar_code:$req->barcode;
    $res= $this->packageModel->deleteOrderPakcages($req->order_id,$barcode);
    if($res->status ==='OK') return JDV::success();
    return JDV::raw($res);
  }

  //Driver notify Merchant on arrived 
  //$d = {'minutes','merchant_id',['message']}
  function notifyArrival_pickup_driver(Request $request){
    $ss = UM::getUserInfoBytoken($request,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    //The caller app is Driver app
    $driver_id = $ss->official_id;
    $request['driver_id'] = $driver_id;
    $branch_id = $ss->branch_id;
    $merchant_id = $request->merchant_id;
    if(!$merchant_id) $merchant_id = $request->sender_id;
    //$order_id = $request->order_id;
    if (!$merchant_id) return JDV::error("Target Merchant ID is missing");
    //todo: if no merchant_id => user $order_id to get merchant_id
    //if(!$merchant_id || $merchant_id <=0) $merchant_id =$request->sender_id;
    $in_minutes = ($request->minutes > 0)?$request->minutes:0;  
    if(!$in_minutes) $in_minutes = ($request->in_minutes >0)?$request->in_minutes:0;
    $msg ="អ្នកដឹកជញ្ជូនមកដល់ ដើម្បីយកទំនិញ";
    if($in_minutes > 0)  $msg = $in_minutes."នាទីទៀត អ្នកដឹកជញ្ជូនមកដល់!";

        $cdata =[
            [
                'user_class'=>'merchant',
                'target_user_id'=>$merchant_id,
                'title'=>"",
                'message'=> $msg,
                'persist'=>1,
                'data'=>null
            ]
        ];
        $err = Notifier::notify_mobile($branch_id,$cdata);
        if($err) return JDV::error($err);
        return JDV::success();
  }

  function options_package_status(Request $req){
     return \App\Models\GeneralSettings::options_package_status($ss);
  }
  
   //driver or merchant logs out => invalidate and clear access_token (mobile user has no session vars)
   //return True when logout success, otherwise, returns error message
   //login_mobile() requires $d = {app_id} 
   function logout_mobile(Request $req){
        $merchant_app_id = COnfig::get('app.merchant_app_id');
        $driver_app_id = Config::get('app.driver_app_id');
        $user_class =null;
        if ($req->app_id === $driver_app_id) $user_class='driver';
        else if ($req->app_id === $merchant_app_id) $user_class='merchant';
        else return JDV::error("Invalid App ID");

        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200){
          return JDV::error("It seems you have not logged in before");
        }
        $r = UM::logout_mobile($ss->user_id,$req->app_id);
        return JDV::result($r);
     } 

}