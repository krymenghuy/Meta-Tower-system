<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Package;
use DB;
use Session;
use Carbon\Carbon;

class PackageController extends Controller
{
    //protected $branch_id = null;
    //protected $user_name;
    protected $packageModel;
    public function __construct()
    {
        $this->packageModel = new Package(); 
    }

    // //returns @count of random number betweeen $min and $max
    // protected function getRandomNumbers($min, $max, $count)
    // {
    //     if ($count > (($max - $min)+1))
    //     {
    //         return false;
    //     }
    //     $values = range($min, $max);
    //     shuffle($values);
    //     return array_slice($values,0, $count);
    // }

    // //returns @count of random number betweeen $min and $max. Each number is unique
    // function unique_randoms($min, $max, $count) {
    //     $arr = array();
    //     while(count($arr) < $count){
    //          $tmp =mt_rand($min,$max);
    //          if(!in_array($tmp, $arr)){
    //             $arr[] = $tmp;
    //          }
    //     }
    //    return $arr;
    // }

    public function getAutoCompleteItems_zone(Request $request)
    {
      $rows = [];
      // $ss = getSessionInfo($request);
      // if(!$ss)  return response()->json($rows); //user not authenticated, returning empty $rows[]
      // if (!prn_allowed(2))  return response()->json($rows); //need permission to do this task, returning empty $rows[]
      // $branch_id = $ss->branch_id;
       $branch_id = Session::get('branch_id',0); // get branch_id based on current session
       //if invalid session or timeout => return empty array []
       if($branch_id==0) return response()->json([]);
       if($request->has('term')){
            $search = sanitize($request->term); //can be zone_code or part of zone_name
            $more_wheres = "(z.zone_code ='".$search."' OR z.zone_name LIKE '%".$search."%')";
            $rows = DB::table("zones AS z")->where('z.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw("z.zone_code, z.zone_name")->get(); 
        }
        return response()->json($rows);
    }

     function getSenderInfoByCode (Request $request) {
        $r = $this->packageModel->getSenderInfoByCode($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

        return makeJsonResponse($r);
    }
    
    //return delivery price details for a given package data (sender_id, delivery_type,zone_code,billed_kg)
    function getDeliveryPriceInfo_api(Request $request){
      $r = $this->packageModel->getDeliveryPriceInfo_api($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

      return makeJsonResponse($r);
    }
    function getPriceInfoByPackage(Request $request){
        $r = $this->packageModel->getPriceInfoByPackage($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    } 

  function getPackageDetailsByBarcode(Request $request){
      $r = $this->packageModel->getPackageDetailsByBarcode($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
  } 
    
     function getZonePrices (Request $request) {
      $r = $this->packageModel->getZonePrices($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }
  
    function updatePackageReceiverInfo(Request $request) {
      $r = $this->packageModel->updatePackageReceiverInfo($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

      return makeJsonResponse($r);
  }

  function getPackageInfo(Request $request) {
    $r = $this->packageModel->getPackageInfo($request);
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

    return makeJsonResponse($r);
}

   function getPackageReceiverInfo(Request $request) {
      $r = $this->packageModel->getPackageReceiverInfo($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

      return makeJsonResponse($r);
  }
function getOutstandingPackageList(Request $filter) { 
        $r = $this->packageModel->getOutstandingPackageList($filter); 
        if($r =='#350') 
         return makeJsonResponse($r,350); // user not authenticated
       else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

        return makeJsonResponse($r);
    }
    
    public function getOutstandingPackageList_print(Request $filter) { 
      $r = $this->packageModel->getOutstandingPackageList_print($filter); 
      if($r =='#350') 
       return makeJsonResponse($r,350); // user not authenticated
     else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

      return makeJsonResponse($r);
    }

    public function getDeliveryDetails(Request $request) {    
        $r = $this->packageModel->getDeliveryDetails($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }
    function createDelivery(Request $data){
       $r = $this->packageModel->createDelivery($data); 
       if($r =='#350') 
       return makeJsonResponse($r,350); // user not authenticated
       else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
       return makeJsonResponse($r);
    }

    function updateDelivery(Request $request){
        $r = $this->packageModel->updateDelivery($request);
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
     }
 
    function deleteDelivery(Request $request) {
        $r = $this->packageModel->deleteDelivery($request); 
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

        return makeJsonResponse($r);
    }

    function getPackageDetails(Request $request) {
      $r = $this->packageModel->getPackageDetails($request); 
      if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

      return makeJsonResponse($r);
  }
   function updatePackageExpandedDetails(Request $request) {
    $r = $this->packageModel->updatePackageExpandedDetails($request); 
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
  else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

    return makeJsonResponse($r);  
  }
   

     public function getSenderInfoByOrderCode(Request $request) {
        $r = $this->packageModel->getSenderInfoByOrderCode($request); 
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }

    
    function changeDeliveryDriver(Request $request){
      $r = $this->packageModel->changeDeliveryDriver($request);
      if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    function assignDeliveryDriver(Request $request){
      $r = $this->packageModel->assignDeliveryDriver($request);
      if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

      return makeJsonResponse($r);
    }
    function getReceiverInfo(Request $request){
      $r = $this->packageModel->getReceiverInfo($request);
      if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }
    public function getDriverNameByCode(Request $request) {
        $name = $this->packageModel->getDriverNameByCode($request);
        if($name =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
        else if ($name =='@') return makeJsonResponse($r,360); // need permision to access or do this task

        return makeJsonResponse($name);
    }
    public function getComboItems_driver(Request $request){
        $r = $this->packageModel->getComboItems_driver($request);
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

        return makeJsonResponse($r);
    }

    function getForm_options_package_list(Request $request) { 
        $r = $this->packageModel->getForm_options_package_list($request); 
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
       else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

        return makeJsonResponse($r);
    }
 
    //Find Driver or Sender (Merchant or store name) or Receiver (Customers) by id, name, phone number 
    function findPersons(Request $request) {
        $r = $this->packageModel->findPersons($request);
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }

    function deletePackage(Request $request) {
        $r = $this->packageModel->deletePackage($request);
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }

  function getComboItems_package_status(Request $request){
        $r = $this->packageModel->getComboItems_package_status($request); 
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }

    function updatePackageStatus(Request $request){
        $r = $this->packageModel->updatePackageStatus($request);
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }

    function updatePakackgeStatus(Request $request) {
        $r = $this->packageModel->updatePakackgeStatus($request);
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }
    function performPickup(Request $request) {
      $r = $this->packageModel->performPickup($request);
      if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
  }

  function getSenderPromotionInfo(Request $request) {
    $r = $this->packageModel->getSenderPromotionInfo($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
  function getSenderPriceByZone(Request $request) {
    $r = $this->packageModel->getSenderPriceByZone1($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
  
  function receivePackages(Request $request) {
    $r = $this->packageModel->receivePackages($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

  
  function getDeliveryItemsByDriver(Request $request){
    $r = $this->packageModel->getDeliveryItemsByDriver($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); //user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
  function getDeliveryItemsBySender(Request $request){
    $r = $this->packageModel->getDeliveryItemsBySender($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); //user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

  function returnPackage(Request $request){
    $r = $this->packageModel->returnPackage($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); //user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
  
}
