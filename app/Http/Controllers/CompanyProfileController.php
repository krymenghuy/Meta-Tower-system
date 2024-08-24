<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
//use Session;
use App\Models\CompanyProfile;
//use App\Models\MobileAppSettings;
use App\Models\UM;
use App\Models\JDV;
use App\Models\Umt\Subscription;
  
class CompanyProfileController extends Controller
{
  
  function saveCompanyInfo(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $res = CompanyProfile::saveDetails($req->all(),$ss);
      return JDV::raw($res);
  }

  function getConnectWithUsInfo(Request $req) {
    $def_subs = Subscription::defaultSubscription();
    $subs_id = $req->subs_id ?? $def_subs->id;
    $ss = (object)['subs_id'=>$subs_id];
     return JDV::result(CompanyProfile::connectWithUs($ss));
  }

  function getCompanyInfo(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    return JDV::result(CompanyProfile::details($ss));
  }

  function getContactInfo(Request $req){
    $def_subs = Subscription::defaultSubscription();
    $subs_id = $req->subs_id ?? $def_subs->id;
    $ss = (object)['subs_id'=>$subs_id];
    return JDV::result(CompanyProfile::contactInfo($ss));
  }

  function getConnectWithUs(Request $req) {
    $def_subs = Subscription::defaultSubscription();
    $subs_id = $req->subs_id ?? $def_subs->id;
    $ss = (object)['subs_id'=>$subs_id];;
    return JDV::result(CompanyProfile::connectWithUs($ss));
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
	  return JDV::result(CompanyProfile::logoUrl($ss));
  }
  
  function deleteCompanyLogo(Request $req)
  {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    return JDV::raw(CompanyProfile::deleteLogo($ss));  
  }
 
}
