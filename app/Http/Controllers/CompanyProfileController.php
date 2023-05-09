<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
//use Session;
use App\Models\CompanyProfile;
use App\Models\UM;
use App\Models\JDV;

class CompanyProfileController extends Controller
{
 
  // protected $companyProfileModel;
  // public function __construct(){
	//    $this->companyProfileModel = new CompanyProfile();
  // }

  function saveCompanyInfo(Request $req) {
	   $ss= UM::getUserInfoByToken($req,-1);
     if($ss->status_code !==200) return JDV::raw($ss);
     $c = new CompanyProfile($ss);
     $res = $c->save($req->all());
     return JDV::raw($res); 
  }

  function getCompanyInfo(Request $req) {
    $ss= UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $c = new CompanyProfile($ss);
    return JDV::result($c->getDetails());
  }

 /** Start Save  and retrieve company's logo **/
  function saveCompanyLogo(Request $req)
  {  
    $ss= UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
     $c = new CompanyProfile($ss);
     $res = $c->saveLogo($req->all());
     return JDV::raw($res);
  } 

  function getCompanyLogo(Request $req)
  {
    $ss= UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
     $c = new CompanyProfile($ss);
    return JDV::result($c->getLogo());
  }
  
  function deleteCompanyLogo(Request $req)
  {
    $ss= UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $c = new CompanyProfile($ss);
    return JDV::raw($c->deleteLogo());
  }

}
