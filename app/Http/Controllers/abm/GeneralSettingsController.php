<?php

namespace App\Http\Controllers\Abm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Abm\GeneralSettings;
use App\Models\JDV;
use App\Models\UM;

class GeneralSettingsController extends Controller
{
    protected $settingModel;
    public function __construct()
    {
        $this->settingModel = new GeneralSettings();
    }

    function options_agent_status(){
      $data = [
        (object)['status_code'=>'Active'],
        (object)['status_code'=>'Inactive']
      ];
      return JDV::result($data);
    }

    function options_mobile_app(){
      $rows =  GeneralSettings:: options_mobile_app(null);
      return JDV::result($rows);
    }

    function getOptions_calendar_month($ss){
      $rows =  GeneralSettings:: options_calendar_month(null);
      return JDV::result($rows);
    }
    function getComboItems_country_zone(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !== 200) return JDV::raw($ss); 
       $rows = GeneralSettings::options_country_zone($ss);
       return JDV::result($rows);
    }

    function options_merchant_active(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !== 200) return JDV::raw($ss); 
       $rows = GeneralSettings::options_merchant_active($ss);
       return JDV::result($rows);
    }

    function options_driver_active(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !== 200) return JDV::raw($ss); 
       $rows = GeneralSettings::options_driver_active($ss);
       return JDV::result($rows);
    }

    function getComboItems_warehouse(Request $req){
       $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !== 200) return JDV::result([]); 
       $rows = GeneralSettings::options_warehouse($ss);
       return JDV::result($rows);
    }

    function getComboItems_driver(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::result([]); 
      return JDV::result(GeneralSettings::options_driver($ss));
   }

    function getComboItems_delivery_status(Request $req){
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !== 200) return JDV::result([]); 
          $rows = GeneralSettings::options_delivery_status($ss);
          return JDV::result($rows);
    }

    function options_lead_status(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::result([]); 
      $rows = GeneralSettings::options_lead_status($ss);
      return JDV::result($rows);
  }

    function getComboItems_pmt_status(Request $req){
     $ss = UM::getUserInfoByToken($req,-1);
     if($ss->status_code !== 200) return JDV::result([]); 
     $rows = GeneralSettings::options_pmt_status($ss);
     return JDV::result($rows);
   }

   function getComboItems_complete_status(Request $req){
     $ss = UM::getUserInfoByToken($req,-1);
     if($ss->status_code !== 200) return JDV::result([]); 
     $rows = GeneralSettings::options_complete_status($ss);
     return JDV::result($rows);
   }
   
   function getComboItems_sales_agent(Request $req){
     $ss = UM::getUserInfoByToken($req,-1);
     if($ss->status_code !== 200) return JDV::result([]); 
     $rows = GeneralSettings::options_sales_agent($ss);
     return JDV::result($rows);
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
