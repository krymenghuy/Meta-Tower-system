<?php

namespace App\Http\Controllers\Dms;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dms\SystemSetting;

class SystemSettingController extends Controller
{
    protected $sys_settings;

    public function __construct(){
        $this->sys_settings = new SystemSetting();
    }

    function getData_magicEntry(Request $request){
      $r = $this->sys_settings->getData_magicEntry($request);
      if($r =='#350') 
         return makeJsonResponse($r,350);
      else if ($r =='@') return makeJsonResponse($r,360);
      return makeJsonResponse($r);
    }

    
    function getOrderListByMerchant(Request $request){
      $r = $this->sys_settings->getOrderListByMerchant($request); 
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    function getComboItems_price_list(Request $request){
        $r = $this->sys_settings->getComboItems_price_list($request); 
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
     }    
    
}
