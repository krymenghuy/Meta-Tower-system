<?php

namespace App\Http\Controllers\Dms;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Session;
use App\Models\Dms\CompanyProfile;
use App\Models\Dms\MobileAppSettings;
use App\Models\Dms\UM;
use App\Models\Dms\JDV;

class CompanyProfileController extends Controller
{
  
  function saveCompanyInfo(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $res = CompanyProfile::saveDetails($req->all(),$ss);
      return JDV::raw($res);
  }

  function getCompanyInfo(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    return JDV::result(CompanyProfile::details($ss->branch_id));
  }

 /** Start Save  and retrieve company's logo **/
  function saveCompanyLogo(Request $req)
  {   
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $res = CompanyProfile::saveLogo($req->all(),$ss);
	  return JDV::raw($res);
  } 

  function getCompanyLogo(Request $req)
  {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
	  return JDV::result(CompanyProfile::logoUrl($ss->branch_id));
  }
  
  function deleteCompanyLogo(Request $req)
  {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    return JDV::raw(CompanyProfile::deleteLogo($ss));  
  }

  function getBrandImages(Request $req)
  {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $app_id = UM::getAppIdByUserClass($req->user_class);
    return JDV::result(CompanyProfile::getBrandImages($app_id,$ss));  
  }

  function saveBrandImage(Request $req)
  {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $req['app_id'] = UM::getAppIdByUserClass($req->user_class);
    $res = CompanyProfile::saveBrandImage($req->all(),$ss);
    //NOTE $res->image is object {'url','title'}
    if($res->status ==='OK') return JDV::success(['image'=>$res->image,'imgs'=>$res->imgs]);
    return JDV::error($res->error_message);
  }

  function deleteBrandImage(Request $req)
  {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $req['app_id'] = UM::getAppIdByUserClass($req->user_class);
    $res = CompanyProfile::deleteBrandImage($req->all(),$ss);
    //NOTE $res->image is object {'url','title'}
    if($res->status ==='OK') return JDV::success(['imgs'=>$res->imgs]);
    return JDV::error($res->error_message);
  }

}
