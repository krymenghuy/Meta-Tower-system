<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dms\DeliveryTrip;
use App\Models\Dms\BDelivery;
use App\Models\Dms\UM;
use App\Models\Dms\JDV;

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
    
    function approveDriverChange(Request $request){
      $r = $this->tripModel->approveDriverChange($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    function rejectDriverChange(Request $request){
      $r = $this->tripModel->rejectDriverChange($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }
 
    function getPendingRequests(Request $request){
      $r = $this->tripModel->getPendingRequests($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    
    function getDeliveryTrips(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(DeliveryTrip::list($req->all(),$ss));
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
    function startDeliveryTrip(Request $req){
      $ss = UM::getUserInfoBytoken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->delivery_id?$req->delivery_id:$req->id;
      $trip = new DeliveryTrip(null,null);
      $res= $trip->startTrip(['delivery_id'=>$id,'driver_id'=>$req->driver_id],$ss);
      if($res->status ==='OK') return JDV::success(['fleet_tracking_number'=>$res->fleet_tracking_number]);
      return JDV::error($res->error_message);
    }

    //start finishDeliveryTrip() is to force finishing the on-going delivery trip. This function takes one paremeter @delivery_id;
    function finishDeliveryTrip(Request $req){
      $ss = UM::getUserInfoBytoken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->delivery_id?$req->delivery_id:$req->id;
      $trip = new DeliveryTrip($id,$ss);
      $r = $trip->finishDeliveryTrip($req->all());
      return JDV::raw($r);
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
    function getPackageListByTripId(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->delivery_id?$req->delivery_id:$req->id;
      $trip = new DeliveryTrip($id,$ss);
      return JDV::result($trip->getPackageList($id));
    }
  
  //For backend, PDF printing or list of packages witin a trip
  function getPackageListByTripId_print(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->delivery_id?$req->delivery_id:$req->id;
    $trip = new DeliveryTrip($id,$ss); 
    return JDV::result( $trip->getPackageList_Print($req->all(),$id,$ss));
 }

  
  function changeDeliveryDriver(Request $req) { 
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->id ?? $req->delivery_id;
    $res = $this->tripModel->changeDeliveryDriver($req->all(),$id, $ss); 
    return JDV::raw($res); 
  }

  function removePackageFromTrip(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->delivery_id?$req->delivery_id:$req->id;
    $trip = new DeliveryTrip($id,$ss);
    $res = $trip->removePackage($req->barcode); 
    if($res->status_code ===200) return JDV::success([
      'delivery_id'=>$res->delivery_id,
      'package_count'=>$res->package_count,
      'trip_total'=>$res->trip_total,
      'trip_status'=>$res->trip_status,
      'last_status'=>$res->last_status //Latest trip status or updated trip status
    ]);
    return JDV::error($res->error_message);
  }
  
  function addPackageToTrip(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code!==200) return JDV::raw($ss);
    $id = $req->delivery_id?$req->delivery_id:$req->id;
    $trip = new DeliveryTrip($id,$ss);
    $res = $trip->addPackage($req->barcode);
    if($res->status ==='Error') return JDV::raw($res);
    return JDV::success(
      [
        'total'=>$res->total,
        'status_id'=>$res->status_id,
        //'status'=>$res->status_id ===3? 'Done':'On Delivery', /**NOTE: prop "status" is used by API to return status as "OK" or "Error"=> so it cannot be used as trip 's status text**/
        'trip_status'=>$res->trip_status,
        'package_count'=>$res->package_count,
        'prev_delivery_id'=>$res->prev_delivery_id,
        'prev_trip_deleted'=>$res->prev_trip_deleted,
        'prev_trip_package_count'=>$res->prev_trip_package_count,
        'prev_trip_status_id'=>$res->prev_trip_status_id,
        'prev_trip_status'=>$res->prev_trip_status,
        'prev_trip_total'=>$res->prev_trip_total
      ]
    );
  }
   
    function getForm_options_delivery_trip(Request $req){
        $ss= UM::getuserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        
        $data = $this->tripModel->getForm_options_delivery_trip($ss);
        return JDV::result($data);
    }

  function getForm_options_trip_list(Request $request){
      $r = $this->tripModel->getForm_options_trip_list($request);
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
    $ss = UM::getUserInfoByToken($request,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $res = $this->bTripModel->b_assignDeliveryDriver($request->all(),$ss);
    return JDV::raw($res);
  }
}
