<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Prm\GeneralSettings;
use JDV;
use App\Models\UM;
use XAuthService;


class GeneralSettingsController extends Controller
{
    protected $settingModel;
    public function __construct()
    {
        $this->settingModel = new GeneralSettings();
    }
    function select_options(Request $req){
      $ss = XAuthService::verifyAuth($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $options = GeneralSettings::select_options($req->all(),$ss);
      return JDV::result($options);
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


    function options_merchant_active(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !== 200) return JDV::raw($ss);
       $rows = GeneralSettings::options_merchant_active($ss);
       return JDV::result($rows);
    }


    function getComboItems_warehouse(Request $req){
       $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !== 200) return JDV::result([]);
       $rows = GeneralSettings::options_warehouse($ss);
       return JDV::result($rows);
    }


    function getComboItems_pmt_status(Request $req){
     $ss = UM::getUserInfoByToken($req,-1);
     if($ss->status_code !== 200) return JDV::result([]);
     $rows = GeneralSettings::options_pmt_status($ss);
     return JDV::result($rows);
   }

    function getOptions_Floors(Request $req)
    {
          $ss = XAuthService::verifyAuth($req,-1);
        if ($ss->status_code != 200) return $ss; //user not authenticated
        $building_id = $req->building_id ? $req->building_id : $req->id;

        return JDV::result(GeneralSettings::options_floors($building_id));
    }

     function options_service(Request $req)
    {
          $ss = XAuthService::verifyAuth($req,-1);
        if ($ss->status_code != 200) return $ss; //user not authenticated
        $category_id = $req->category_id ?? $req->service_type_id ?? $req->id ?? null;

        return JDV::result(GeneralSettings::options_service_request_type($category_id));
    }

}
