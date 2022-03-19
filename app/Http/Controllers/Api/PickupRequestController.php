<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\PickupRequest;
use App\Models\Package;
use Session;
use DB;

class PickupRequestController extends Controller
{
    protected $pickupRequestModel;
    public function __construct()
    {
         $this->pickupRequestModel = new PickupRequest();
    }

    public function savePickupRequest(Request $request){
        $r = $this->pickupRequestModel->savePickupRequest($request);
        if($r =='#350') 
           return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);

        return makeJsonResponse($r);
    }

    //$request = {'request_date','sender_id','status_id'}
    public function getPickupList(Request $request) {
        $r = $this->pickupRequestModel->getPickupList($request);
        if($r =='#350') 
           return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);

        return makeJsonResponse($r);
    }

    public function getPickupInfo(Request $request) {
     
       $r = $this->pickupRequestModel->getPickupInfo($request); 
       if($r =='#350') 
           return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);

       return makeJsonResponse($r);
    }

     function updatePickup(Request $request) {
        $r = $this->pickupRequestModel->updatePickup($request);
        if($r =='#350') 
           return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);
        return makeJsonResponse($r);
    }
    
    function pickOrderPackages(Request $request){
      $r = $this->pickupRequestModel->pickOrderPackages($request);
      if($r =='#350') 
         return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    } 
    function deleteOrderPackage(Request $request){
      $r = $this->pickupRequestModel->deleteOrderPackage($request);
      if($r =='#350') 
         return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }
    function getOrderPackageDetails(Request $request){
      $r = $this->pickupRequestModel->getOrderPackageDetails($request);
      if($r =='#350') 
         return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }

    function saveOrderPackageDetails(Request $request){
      $r = $this->pickupRequestModel->saveOrderPackageDetails($request);
      if($r =='#350') 
         return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }
    
    function getOrderPackageList(Request $request) {
      $r = $this->pickupRequestModel->getOrderPackageList($request);
      if($r =='#350') 
         return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
   } 

     function assignPickupDriver(Request $request) {
        //request->driver_id, order_id
        $r = $this->pickupRequestModel->assignPickupDriver($request);
        if($r =='#350') 
           return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);
        return makeJsonResponse($r);
    }
     function changePickupDriver(Request $request) {
      //request->driver_id, order_id
      $r = $this->pickupRequestModel->changePickupDriver($request);
      if($r =='#350') 
         return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
  }

    //Update Order status or Pickup status
    function updateOrderStatus(Request $request) {
        $r = $this->pickupRequestModel->updateOrderStatus($request);
        if($r =='#350') 
           return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);
        return makeJsonResponse($r); 
    } 
     //Delete Order or Pickup transaction
     function deletePickup(Request $request) {
          //$request = {order_id,access_token}
        $r = $this->pickupRequestModel->deletePickup($request);
        if($r =='#350') 
           return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);
        return makeJsonResponse($r); 
    } 

    function getComboItems_vehicleType(Request $request){
         $r = $this->pickupRequestModel->getComboItems_vehicleType($request);
         if($r =='#350') 
           return makeJsonResponse($r,350);
        else if ($r =='@') return makeJsonResponse($r,360);

         return makeJsonResponse($r);
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
     
     function getComboItems_delivery_condition(Request $request){
      $r = $this->pickupRequestModel->getComboItems_delivery_condition($request);
      if($r =='#350') 
         return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
   }

   function getFormData_pickup_request(Request $request){
      $r = $this->pickupRequestModel->getFormData_pickup_request($request);
      if($r =='#350') 
         return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
   }

   function getOrderInfo(Request $request){
      $r = $this->pickupRequestModel->getOrderInfo($request);
      if($r =='#350') 
         return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
   }
   function getSenderPriceInfo(Request $request){
      $r = $this->pickupRequestModel->getSenderPriceInfo($request);
      if($r =='#350') 
         return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
   }
    
}
