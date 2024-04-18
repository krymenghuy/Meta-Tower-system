<?php

namespace App\Http\Controllers\Dms;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Dms\PickupRequest;
 
use App\Models\JDV;
use App\Models\UM;
   
class PickupRequestController extends Controller
{
    protected $pickupRequestModel;
    public function __construct()
    {
         $this->pickupRequestModel = new PickupRequest();
    }
     
    function createQuickOrder(Request $req){
      $ss= UM::getUserInfoByToken($req,220);
      if($ss->status_code !==200) return JDV::raw($ss);
      $order = new PickupRequest(null,$ss);
      $res= $order->createQuickOrder($req->all());
      return JDV::raw($res);
    }

    function receivePackages(Request $req){
      $ss= UM::getUserInfoByToken($req,222);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->id?$req->id:$req->order_id;
      $order = new PickupRequest($id,$ss);
      $res= $order->receivePackages($req->all(),$id,$ss);
      return JDV::raw($res);
    }

    function getFormOptions(Request $req){
      $ss= UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $order = new PickupRequest(null,$ss);
      $data= $order->getFormOptions($ss);
      return JDV::result($data);
    }
    
   function savePickupRequest(Request $req){
      $ss= UM::getUserInfoByToken($req,222);
      if($ss->status_code !==200) return JDV::raw($ss);
      $arr = $req->all();
      if ($ss->user_class ==='merchant'){
         $arr['sender_code'] = $ss->official_code;
         $arr['sender_id'] = $ss->official_id;
      }
      $arr['is_from_mobile'] =0;
      $res = $this->pickupRequestModel->savePickupRequest($ss,$arr);
      if($res->status ==="OK"){
          return JDV::success(['order_id'=>$res->order_id,'tracking_number'=>$res->tracking_number]);
      }else return JDV::error($res->error_message);
    }
 
    function getOrderInfo_magicEntry(Request $request){
      $r = $this->pickupRequestModel->getOrderInfo_magicEntry($request);
      if($r =='#350') 
         return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);

      return makeJsonResponse($r);
   }

    //$request = {'request_date','sender_id','status_id'}
    public function getPickupList(Request $req) {
        $ss= UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $order = new PickupRequest(null,$ss);
        return JDV::result($order->getList($req->all()));
    }

    public function getPickupInfo(Request $req) {
      $ss= UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->id?$req->id:$req->order_id;
      $order = new PickupRequest($id,$ss);
      $data = $order->getDetails();
      return JDV::result($data); 
    }

     function updatePickup(Request $request) {
        $r = $this->pickupRequestModel->updatePickup($request);
        if($r =='#350') 
           return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);
        return makeJsonResponse($r);
    }
    
    function pickOrderPackages(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $order_id = $req->order_id ?? $req->id;
      $res = $this->pickupRequestModel->pickOrderPackages($req->all(),$order_id,$ss);
      return JDV::raw($res); 
    } 
    function deleteOrderPackage(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $res = $this->pickupRequestModel->deleteOrderPackage($req->all(),$ss);
      return JDV::raw($res);  
    }
    function getOrderPackageDetails(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $order_id = $req->order_id;
      $data = $this->pickupRequestModel->getOrderPackageDetails($req->all(),$order_id,$ss);
      return JDV::result($data); 
    }

    function saveOrderPackageDetails(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $res = $this->pickupRequestModel->saveOrderPackageDetails($req->all(),$ss);
      return JDV::raw($res);
      //return JDV::raw(['price_error'=>$res->price_error,'package'=>$res->package,'package_id'=>$res->package_id,'package_count'=>$res->package_count]); 
       
    }
    
    function getOrderPackageList(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->order_id ?? $req->id;
      $rows = $this->pickupRequestModel->getOrderPackageList($id,$ss);
      return JDV::result($rows);
   } 

   function getOrderPackagePhotos(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->order_id ?? $req->id;
      $rows = $this->pickupRequestModel->getOrderPackagePhotos($id,$ss);
      return JDV::result($rows);
   } 

   function deletePackagePhotos(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->order_id ?? $req->id;
    $photo_ids = $req->photo_ids ?? $req->ids;
    $rows = $this->pickupRequestModel->deletePackagePhotos($photo_ids,$id,$ss);
    return JDV::result($rows);
 }

   function assignPickupDriver(Request $req) {
      $ss = UM::getUserInfoByToken($req,221);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->order_id ?? $req->id;
      $res = $this->pickupRequestModel->assignPickupDriver($req->all(),$id,$ss); 
      return JDV::raw($res);
   }

  // function changePickupDriver(Request $req) {
  //     $ss = UM::getUserInfoByToken($req,-1);
  //     if($ss->status_code !==200) return JDV::raw($ss);
  //     $id = $req->order_id ?? $req->id;
  //     $res = $this->pickupRequestModel->changePickupDriver($req->all(),$id,$ss);
  //     return JDV::raw($res); 
  // }

    //Update Order status or Pickup status
    function updateOrderStatus(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
       
      $id =$req->id?$req->id:$req->order_id;
      $order = New PickupRequest($id,$ss);
      $res = $order->updateStatus($req->all());
      return JDV::raw($res);
    } 

     //Delete Order or Pickup transaction
     function deletePickup(Request $req) {
        $ss = UM::getUserInfoByToken($req,229);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id =$req->id?$req->id:$req->order_id;
        $order = New PickupRequest($id,$ss);
        $res = $order->delete();
        return JDV::raw($res);
    } 

    function getComboItems_vehicleType(Request $request){
      $rows = $this->pickupRequestModel->getComboItems_vehicleType(null);
      return JDV::result($rows);
    }

    function getComboItems_sender(Request $request){
        $r = $this->pickupRequestModel->getComboItems_sender($request);
        return makeJsonResponse($r);
    }

     function getForm_options_pickuplist(Request $request){
        $r = $this->pickupRequestModel->getForm_options_pickuplist($request);
        if($r =='#350') 
           return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);
        return makeJsonResponse($r);
     }
   
   function getFormData_pickup_request(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);  
      if ($ss->status_code !=200) return JDV::raw($ss);
      $data = $this->pickupRequestModel->getFormData_pickup_request($ss);
      return JDV::result($data);  
   }

   function getOrderInfo(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);  
      if ($ss->status_code !=200) return JDV::raw($ss);
      $order_id = $req->id ?? $req->order_id;
      $order = $this->pickupRequestModel->getOrderInfo($order_id);
      return JDV::result($order);
   }
   
   function getSenderPriceInfo(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);  
      if ($ss->status_code !=200) return JDV::raw($ss);
      $data = $this->pickupRequestModel->getSenderPriceInfo($req->all(),$ss);
      return JDV::result($data); 
   }
 
   //return array of image_urls for an order (image order)
   function getOrderImages(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);  
      if ($ss->status_code !=200) return JDV::raw($ss);
      $order_id = isset($req->order_id)?$req->order_id:$req->id;
      //retrieve array of images only by $order_id
      $r = $this->pickupRequestModel->getOrderImages(['order_id'=>$order_id],$order_id,$ss);
      return JDV::result($r);
  }
    
}
