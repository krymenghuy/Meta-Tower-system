<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MobileAppSettings;
use XAuthService;
use JDV;
use Config;
  
class MobileAppSettingsController extends Controller
{
     
    function getHomeScreenData(Request $req){
      $ss = XAuthService::verifyAuth($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $app_id = $req->app_id ?? getAppIdByUserClass($ss->user_class);
      $subs_id = $req->subs_id ?? ($ss->subs_id ?? getCurrentSubsId(true));
      $data = MobileAppSettings::getHomeScreenData($subs_id, $app_id,$ss);
      return JDV::result($data);
    }

    //saveBrandIamge, saveBrandPhoto
    //$d = {app_name, 'file_type','photo_data'}
    function saveBrandImage(Request $req){
       $ss = XAuthService::verifyAuth($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);
       $res = MobileAppSettings::saveBrandImage($req->all(),$req->app_id,$ss);
       return JDV::raw($res);
    }

    function getAppSettings(Request $req){
      $ss = XAuthService::verifyAuth($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $app_id = Config::get('app.merchant_app_id');
      $data = MobileAppSettings::appSettings($app_id,$ss);
      return JDV::result($data);
    }

    function deleteBrandImage(Request $req){
      $ss = XAuthService::verifyAuth($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $app_id =$req->app_id;
      $res = MobileAppSettings::deleteBrandImage($req->id,$app_id,$ss);
      return JDV::raw($res);
    }
    
    function getPrivacyContent(Request $req){
      // $ss = XAuthService::verifyAuth($req,-1);
      // if($ss->status_code !==200) return JDV::raw($ss);
      $app_id = $req->app_id;
      $res = MobileAppSettings::getPrivacyContent($app_id);
      return JDV::result($res);
    }

    function savePrivacyContent(Request $req){
      $ss = XAuthService::verifyAuth($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $app_id = $req->app_id;
      $content = $req->content;
      $res = MobileAppSettings::savePrivacyContent($app_id,$content,$ss);
      return JDV::result($res);
    }

    function getTermsAndConditions(Request $req){
      // $ss = XAuthService::verifyAuth($req,-1);
      // if($ss->status_code !==200) return JDV::raw($ss);
      $app_id = $req->app_id;
      $ss = (object)['branch_id'=>1];
      $res = MobileAppSettings::getTermsAndConditions($app_id,$ss);
      return JDV::result($res);
    }

    function saveTermsAndConditions(Request $req){
      $ss = XAuthService::verifyAuth($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $app_id = $req->app_id;
      $content = $req->content; 
      $res = MobileAppSettings::saveTermsAndConditions($app_id,$content,$ss);
      return JDV::result($res);
    }

    //getBrandImages
    function getBrandImages(Request $req){
       $ss = (object)['branch_id'=>1];
       $app_id = $req->app_id;
       return JDV::result(MobileAppSettings::getBrandImages($app_id,$ss));
    }
}
