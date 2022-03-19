<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FailedPackage;

class FailedPackageController extends Controller
{
    protected $failedPackageModel;
    public function __construct() {
        $this->failedPackageModel = new FailedPackage();
    }

    function getFailedPackageList(Request $filter) { 
         $r = $this->failedPackageModel->getFailedPackageList($filter);
         if($r =='#350') 
           return makeJsonResponse($r,350); // user not authenticated
         else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

         return makeJsonResponse($r);
    }
    function deleteFailedPackage(Request $request) {
        $r = $this->failedPackageModel->deleteFailedPackage($request);
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
   } 

   function getFormData_failed_delivery(Request $request){
    $r = $this->failedPackageModel->getFormData_failed_delivery($request);
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
   }

   function updateFailedPackage(Request $data) {
        $r = $this->failedPackageModel->updateFailedPackage($data);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
   } 
}
