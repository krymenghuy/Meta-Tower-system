<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DeliveryZone;
use Session;

class DeliveryZoneController extends Controller
{
    protected $deliveryZone;
     public function __construct(){
          $this->deliveryZone = new DeliveryZone();
     }

     function getDeliveryZoneList(Request $request) {
        $r = $this->deliveryZone->getDeliveryZoneList($request); 
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
         else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
     }
     function saveDeliveryZone(Request $request) {
          $r = $this->deliveryZone->saveDeliveryZone($request); 
          if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
           else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
          return makeJsonResponse($r);
     }

     function deleteDeliveryZone(Request $request) {
          $r = $this->deliveryZone->deleteDeliveryZone($request); 
          if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
           else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
          return makeJsonResponse($r);
     }
     function getDeliveryZoneDetails(Request $request) {
          $r = $this->deliveryZone->getDeliveryZoneDetails($request); 
          if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
           else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
          return makeJsonResponse($r);
     }

     function getZoneName(Request $request) {
          $r = $this->deliveryZone->getZoneName($request); 
          if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
           else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
          return makeJsonResponse($r);
     }
     
     function getZoneInfo(Request $request) {
          $r = $this->deliveryZone->getZoneInfo($request); 
          if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
           else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
          return makeJsonResponse($r);
     }
}
