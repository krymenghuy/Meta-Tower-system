<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DeliveryTrip;
use App\Models\BDelivery;

class DeliveryTripController extends Controller
{
    protected $tripModel;
    protected $bTripModel;
    public function __construct()
    {
        $this->tripModel = new DeliveryTrip(); 
        $this->bTripModel = new BDelivery();
    }

    function createDeliveryTrip(Request $request){
        $r = $this->tripModel->createDeliveryTrip($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }
    function getDeliveryTrips(Request $request){
        $r = $this->tripModel->getDeliveryTrips($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    } 

    function getTripInfo(Request $request){
      $r = $this->tripModel->getTripInfo($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }
    
    function getDeliveryTrip(Request $request){
        $r = $this->tripModel->getDeliveryTrip($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    } 

    function scanPackageOut(Request $request){
      $r = $this->tripModel->scanPackageOut($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    //start deliveryTrip() takes one paremeter @delivery_id;
    function startDeliveryTrip(Request $request){
      $r = $this->tripModel->startDeliveryTrip($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    //start finishDeliveryTrip() is to force finishing the on-going delivery trip. This function takes one paremeter @delivery_id;
    function finishDeliveryTrip(Request $request){
      $r = $this->tripModel->finishDeliveryTrip($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }
    
    //ReverseScannedPackage()
    function removeScannedPackage(Request $request){
      $r = $this->tripModel->removeScannedPackage($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    //deleteNewTrip() is to delete Newly Created Trip without delting related packages.
    //deleteDeliveryTrip() is to permmantently delete whole trip info including all related packages
    function deleteDeliveryTrip(Request $request){
        $r = $this->tripModel->deleteDeliveryTrip($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    } 

    //deleteNewTrip() is to delete Newly Created Trip without delting related packages.
    //deleteDeliveryTrip() is to permmantently delete whole trip info including all related packages
    function deleteNewTrip(Request $request){
      $r = $this->tripModel->deleteNewTrip($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    //getPackageListByTripId() returns list of packages belonging to a trip. It is used in backend system only
    function getPackageListByTripId(Request $request) { 
      $r = $this->tripModel->getPackageListByTripId($request); 
      if($r =='#350') 
       return makeJsonResponse($r,350); // user not authenticated
     else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
  
      return makeJsonResponse($r);
  }
  
  //For backend, PDF printing or list of packages witin a trip
  function getPackageListByTripId_print(Request $request) { 
    $r = $this->tripModel->getPackageListByTripId_print($request); 
    if($r =='#350') 
     return makeJsonResponse($r,350); // user not authenticated
   else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
}

  
  function changeDeliveryDriver(Request $request) { 
    $r = $this->tripModel->changeDeliveryDriver($request); 
    if($r =='#350') 
     return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
  function removePackageFromTrip(Request $request) { 
    $r = $this->tripModel->removePackageFromTrip($request); 
    if($r =='#350') 
     return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
  
  function addPackageToTrip(Request $request) { 
    $r = $this->tripModel->addPackageToTrip($request); 
    if($r =='#350') 
     return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
   
    function getForm_options_delivery_trip(Request $request){
        $r = $this->tripModel->getForm_options_delivery_trip($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }
  function getForm_options_trip_list(Request $request){
      $r = $this->tripModel->getForm_options_trip_list($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
  }
    
   
    function getComboItems_delivery_status(Request $request){
      $r = $this->tripModel->getComboItems_delivery_status($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
  }
  
  function getPackageInfoByBarcode(Request $request){
    $r = $this->tripModel->getPackageInfoByBarcode($request);
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
   
  function cleanEmptyTrip(Request $request){
    $r = $this->tripModel->cleanEmptyTrip($request);
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

  function getDeliveryTrips_print(Request $request){
    $r = $this->tripModel->getDeliveryTrips_print($request);
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

  //Pre-assign Driver delivery model (BDelivery Model)
  function b_assignDeliveryDriver(Request $request){
    $r = $this->bTripModel->b_assignDeliveryDriver($request);
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
}
