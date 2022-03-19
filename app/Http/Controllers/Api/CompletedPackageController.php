<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CompletedPackage;

class CompletedPackageController extends Controller
{
    protected $completedPackageModel;
    public function __construct() {
        $this->completedPackageModel = new CompletedPackage();
    }

    function getCompletedPackageList(Request $filter) { 
         $r = $this->completedPackageModel->getCompletedPackageList($filter);
         if($r =='#350') 
           return makeJsonResponse($r,350); // user not authenticated
         else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

         return makeJsonResponse($r);
    }
    function getCompletedPackageList_print(Request $filter) { 
      $r = $this->completedPackageModel->getCompletedPackageList($filter);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

      return makeJsonResponse($r);
   }
    function deleteCompletedPackage(Request $request) {
        $r = $this->completedPackageModel->deleteCompletedPackage($request);
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
   } 

   function getFormData_completed_delivery(Request $request){
    $r = $this->completedPackageModel->getFormData_completed_delivery($request);
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
   }

   function updateCompletedPackage(Request $data) {
        $r = $this->completedPackageModel->updateCompletedPackage($data);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
   } 
}
