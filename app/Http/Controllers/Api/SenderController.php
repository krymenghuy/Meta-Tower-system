<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sender;

class SenderController extends Controller
{
    protected $senderModel;
    public function __construct(){
        $this->senderModel = new Sender();
    }

    function saveSender(Request $sender){
       $r = $this->senderModel->saveSender($sender); 
       if($r =='#350') 
         return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

       return makeJsonResponse($r);
    }

    //getSenderAddress| getFullAddress
    function getVendorAddress(Request $request){
      $r = $this->senderModel->getVendorAddress($request); 
      if($r =='#350') 
       return makeJsonResponse($r,350); // user not authenticated
     else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
       return makeJsonResponse($r);
   }

    function deleteSender(Request $request){
        $r = $this->senderModel->deleteSender($request); 
        if($r =='#350') 
         return makeJsonResponse($r,350); // user not authenticated
       else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
         return makeJsonResponse($r);
     }

     function getSenderById(Request $request){
        $r = $this->senderModel->getSenderById($request); 
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
         return makeJsonResponse($r);
     }

     function updateSenderStatus(Request $request){
      $r = $this->senderModel->updateSenderStatus($request); 
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
       return makeJsonResponse($r);
   }

     function getSenderList(Request $request){
        $r = $this->senderModel->getSenderList($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task 
          return makeJsonResponse($r);
     }

     function getFormData_senderdialog(Request $request){
         $r = $this->senderModel->getFormData_senderdialog($request);
         if($r =='#350') 
         return makeJsonResponse($r,350); // user not authenticated
       else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
         return makeJsonResponse($r);
     }
}
