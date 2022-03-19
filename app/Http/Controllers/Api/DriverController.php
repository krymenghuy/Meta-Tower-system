<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Driver;

class DriverController extends Controller
{
    protected $driverModel;

    public function __construct(){
        $this->driverModel = new Driver();
    }

    function saveDriver(Request $driver){
       $r = $this->driverModel->saveDriver($driver); 
       if($r =='#350') 
       return makeJsonResponse($r,350); // user not authenticated
     else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
       return makeJsonResponse($r);
    }

    function deleteDriver(Request $request){
        $r = $this->driverModel->deleteDriver($request); 
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
     }
     
     function saveDriverCommissions(Request $request){
      $r = $this->driverModel->saveDriverCommissions($request); 
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
   }

   function getDriverCommissions(Request $request){
    $r = $this->driverModel->getDriverCommissions($request); 
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
 }

     function updateDriverStatus(Request $request){
      $r = $this->driverModel->updateDriverStatus($request); 
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
   }
     function getDriverById(Request $request){ 
        $r = $this->driverModel->getDriverById($request);
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task 
        return makeJsonResponse($r);
     }

     function getDriverList(Request $request){
        $r = $this->driverModel->getDriverList($request); 
        if($r =='#350') 
         return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
     }

     function getFormData_driverdialog(Request $request){
         $r = $this->driverModel->getFormData_driverdialog($request);
         if($r =='#350') 
         return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
         return makeJsonResponse($r);
     }
}
