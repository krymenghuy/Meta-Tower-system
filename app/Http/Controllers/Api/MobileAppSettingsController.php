<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MobileAppSettings;
use Session;

class MobileAppSettingsController extends Controller
{
    protected $mobileAppSettingsModel;
    public function __construct()
    {
        $this->mobileAppSettingsModel = new MobileAppSettings(); 
    }

    //saveBrandIamge, saveBrandPhoto
    //$d = {app_name, 'file_type','photo_data'}
    function saveBrandImage(Request $request){
        $r = $this->mobileAppSettingsModel->saveBrandImage($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }
    function deleteBrandImage(Request $request){
        $r = $this->mobileAppSettingsModel->deleteBrandImage($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }
    
    //getBrandImages
    function getMobileBrandImages(Request $request){
        $r = $this->mobileAppSettingsModel->getMobileBrandImages($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }
}
