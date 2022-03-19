<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GeneralSettings;

class GeneralSettingsController extends Controller
{
    protected $settingModel;
    public function __construct()
    {
        $this->settingModel = new GeneralSettings();
    }

    function getProductTypes(Request $request) {
        $r = $this->settingModel->getProductTypes($request); 
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
         else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
   }

   
   //$d = {phone_number,text}
   function sendMessage(Request $request) {
          $r = $this->settingModel->sendMessage($request); 
          if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
          else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
          return makeJsonResponse($r);
   }

   function deleteProductType(Request $request) {
        $r = $this->settingModel->deleteProductType($request); 
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
   }

   function saveProductType(Request $request){
        $r = $this->settingModel->saveProductType($request); 
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
   }
}
