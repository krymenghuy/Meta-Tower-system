<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MobileAppSettings;
use App\Models\UM;
use App\Models\JDV;
  
class MobileAppSettingsController extends Controller
{
     
    //saveBrandIamge, saveBrandPhoto
    //$d = {app_name, 'file_type','photo_data'}
    function saveBrandImage(Request $req){
       $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);
       $app_id = UM::getAppIdByUserClass($req->user_class); 
       $res = MobileAppSettings::saveBrandImage($req->all(),$app_id,$ss);
       return JDV::raw($res);
    }

    function deleteBrandImage(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $app_id = UM::getAppIdByUserClass($req->user_class);
      $res = MobileAppSettings::deleteBrandImage($req->id,$app_id,$ss);
      return JDV::raw($res);
    }
    
    //getBrandImages
    function getBrandImages(Request $req){
      //$ss = UM::getUserInfoByToken($req,-1);
      //if($ss->status_code !==200) return JDV::raw($ss);
      $ss = (object)['branch_id'=>1];
      $app_id = UM::getAppIdByUserClass($req->user_class); 
       return JDV::result(MobileAppSettings::getBrandImages($app_id));
    }
}
