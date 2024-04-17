<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Dms\GeneralSettings;
use Illuminate\Http\Request;
use App\Models\Dms\Package;
use App\Models\Dms\JDV;
use App\Models\Dms\UM;
  
class PackageController extends Controller
{
    //protected $branch_id = null;
    //protected $user_name;
    protected $packageModel;
    function __construct()
    {
        $this->packageModel = new Package(); 
    }
     
    //return delivery price details for a given package data (sender_id, delivery_type,zone_code,billed_kg)
    function getDeliveryPriceInfo_api(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $p = new Package(null,$ss);
      $data = $p->getDeliveryPriceInfo_api($req->all());
      return JDV::raw($data);
    }

    function getPriceInfoByPackage(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->package_id?$req->package_id :$req->id;
        $p = new Package($id,$ss);
        $data = $p->getPriceInfoByPackage();
        return JDV::raw($data);
    } 

    
  function getDeliveryPriceInfo_magicEntry(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $p = new Package(null,$ss);
      $data = $p->getDeliveryPriceInfo_magicEntry($req->all());
      return JDV::result($data);
   } 

  function getPackageDetailsByBarcode(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !== 200) return JDV::raw($ss);
      $p = new Package($id,$ss);
      $data = $p->getDetailsByCode($req->barcode);
      return JDV::result($data);
  } 
    
    //  function getZonePrices (Request $req) {
    //   $ss = UM::getUserInfoByToken($req,-1);
    //   if($ss->status_code !== 200) return JDV::raw($ss);
    //   $p = new Package(null,$ss);
    //   $data = $p->getZonePrices($req->all());
    //   return JDV::result($data);
    // }
  
    function updatePackageReceiverInfo(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $req->package_id?$req->package_id:$req->id;
      $p = new Package($id,$ss);
      $res = $p->updateReceiverInfo($req->all(),$id);
      return JDV::raw($res);
  }

  function getPackageInfo(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !== 200) return JDV::raw($ss);
    $id = $req->package_id?$req->package_id:$req->id;
    $p = new Package($id,$ss);
    $data = $p->getPackageInfo();
    return JDV::result($data);
  }
 
   function getPackageReceiverInfo(Request $req) {
     $ss = UM::getUserInfoByToken($req,-1);
     if($ss->status_code !== 200) return JDV::raw($ss);
     $id = $req->package_id?$req->package_id:$req->id;
     $p = new Package($id,$ss);
     $data = $p->getPackageReceiverInfo();
     return JDV::result($data); 
  }

  function saveLabelPrintCount(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !== 200) return JDV::raw($ss);
    $id = $req->package_id ?? $req->id;
    $res = Package::saveLabelPrintCount($req->count,$id);
    return JDV::raw($res);
  }

 function getOutstandingPackageList(Request $req) { 
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !== 200) return JDV::raw($ss);
    $data = Package::list($req->all(),$ss);
    return JDV::result($data);
  }    
    function getOutstandingPackageList_print(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $data= Package::listAll($req->all(),$ss); 
      return JDV::result($data);
    }

  //  function getDeliveryDetails(Request $req) {    
  //     $ss = UM::getUserInfoByToken($req,-1);
  //     if($ss->status_code !== 200) return JDV::raw($ss);
  //       $trip_id = $req->delivery_id;
  //       $p = new Package(null,$ss);
  //       $data = $p->getDeliveryDetails($trip_id);
  //      return JDV::result($data); 
  //   }
 
  function getPackageDetails(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->package_id?$req->package_id:$req->id;
      $p = new Package($id,$ss);
      return JDV::result($p->getDetails());
   }

  function getPackageDetailsWithOptions(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->package_id?$req->package_id:$req->id;
    $p = new Package($id,$ss);
    return JDV::result($p->getDetailsWithOptions());
 }

   function updatePackageExpandedDetails(Request $req) {
    $ss = UM::getUserInfoBytoken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->id?$req->id:$req->package_id;
    $res =  $this->packageModel->saveDetails($req->all(),$id,$ss);
    return JDV::raw($res);
  }
 
    //  public function getSenderInfoByOrderCode(Request $request) {
    //     $r = $this->packageModel->getSenderInfoByOrderCode($request); 
    //     if($r =='#350') 
    //     return makeJsonResponse($r,350); // user not authenticated
    //   else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    //     return makeJsonResponse($r);
    // }

    
    function changeDeliveryDriver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $res = $this->packageModel->changeDeliveryDriver($req->all(),$ss);
      return JDV::result($res);
    }

    function assignDeliveryDriver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $res = $this->packageModel->assignDeliveryDriver($req->all(),$ss);
      return JDV::result($res); 
    }

    // function getReceiverInfo(Request $request){
    //   $r = $this->packageModel->getReceiverInfo($request);
    //   if($r =='#350') 
    //   return makeJsonResponse($r,350); // user not authenticated
    //   else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    //   return makeJsonResponse($r);
    // }

    // public function getDriverNameByCode(Request $request) {
    //     $name = $this->packageModel->getDriverNameByCode($request);
    //     if($name =='#350') 
    //     return makeJsonResponse($r,350); // user not authenticated
    //     else if ($name =='@') return makeJsonResponse($r,360); // need permision to access or do this task

    //     return makeJsonResponse($name);
    // }
    
  function getComboItems_driver(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss); 
    $rows =  GeneralSettings::options_driver($ss); 
    return JDV::result($rows);   
  }

    function getFilterOptions(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
        $p = new Package(null,$ss);
        $r = $p->getFilterOptions();
        return JDV::result($r);
    }
 
    //Find Driver or Sender (Merchant or store name) or Receiver (Customers) by id, name, phone number 
    function findPersons(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
        $p = new Package(null,$ss);
        $r = $p->findPersons($req->all());
        return JDV::result($r);
    }

    function deletePackage(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $byCol ="id";
      $barcode_or_id = $req->id?$req->id:$req->package_id;
      if(!($barcode_or_id > 0))
       {
         $barcode_or_id = $req->barcode;
         $byCol="barcode";
       }
      ////throw new \Exception("col = $byCol  barcode = ".$barcode_or_id." id = ".$req->package_id);
      $p = new Package(null,$ss);
      $res = $p->delete($barcode_or_id,$byCol);
      return JDV::raw($res); 
    }

  function getComboItems_package_status(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $options = GeneralSettings::options_package_status($ss);
    return JDV::result($options);
  }

    function updatePackageStatus(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $package_id = $req->package_id?$req->package_id:$req->id;
      $p = new Package($package_id,$ss);
      $data = ["package_id"=>$package_id,"update_trip_status"=>$req->update_trip_status,"status_id"=>$req->status_id,"failure_notes"=>$req->failure_notes];
      $res = $p->updateStatus($data,$package_id);
      return JDV::raw($res);
    }

    // function updatePakackgeStatus(Request $request) {
    //     $r = $this->packageModel->updatePakackgeStatus($request);
    //     if($r =='#350') 
    //     return makeJsonResponse($r,350); // user not authenticated
    //   else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    //     return makeJsonResponse($r);
    // }

  //   function performPickup(Request $request) {
  //     $r = $this->packageModel->performPickup($request);
  //     if($r =='#350') 
  //     return makeJsonResponse($r,350); // user not authenticated
  //   else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
  //     return makeJsonResponse($r);
  // }

  // function getSenderPromotionInfo(Request $request) {
  //   $r = $this->packageModel->getSenderPromotionInfo($request);
  //   if($r =='#350') 
  //   return makeJsonResponse($r,350); // user not authenticated
  //   else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
  //   return makeJsonResponse($r);
  // }

  // function getSenderPriceByZone(Request $request) {
  //   $r = $this->packageModel->getSenderPriceByZone1($request);
  //   if($r =='#350') 
  //   return makeJsonResponse($r,350); // user not authenticated
  //   else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
  //   return makeJsonResponse($r);
  // }
  
  function changeSender(Request $req) {
    $ss = UM::getUserInfoByToken($req,278);
    if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->id?$req->id:$req->package_id;
      $p = new Package($id,$ss);
      return JDV::raw($p->changeSender($req->all()));
  }
  
  function receivePackages(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $p = new Package(null,$ss);
    $res = $p->receivePackages($req->all());
    return JDV::raw($res);
  }
 
  function getDeliveryItemsByDriver(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $p = new Package(null,$ss);
    $rows = $p->getDeliveryItemsByDriver($req->all(),$ss);
    return JDV::result($rows); 
  }

  function getDeliveryItemsByDriver_mobile(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $p = new Package(null,$ss);
    $rows = $p->getDeliveryItemsByDriver_mobile($req->all(),$ss);
    return JDV::result($rows); 
  }

  function getDeliveryItemsBySender(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $p = new Package(null,$ss);
    $rows = $p->getDeliveryItemsBySender($req->all());
    return JDV::result($rows);
  }

  function returnPackage(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->package_id?$req->package_id:$req->id;
    $p = new Package($id,$ss);
    $res = $p->returnToStore($req->all());
    return JDV::raw($res);
  }
  
}
