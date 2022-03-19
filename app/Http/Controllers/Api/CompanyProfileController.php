<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Session;
use App\Models\CompanyProfile;

class CompanyProfileController extends Controller
{
 
  protected $companyProfileModel;
  public function __construct(){
	$this->companyProfileModel = new CompanyProfile();
  }

  function saveCompanyInfo(Request $request) {
	$r = $this->companyProfileModel->saveCompanyInfo($request);
	if($r =='#350') 
	  return makeJsonResponse($r,350); // user not authenticated
	else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
	return makeJsonResponse($r);
  }
  function getCompanyInfo(Request $request) {
    $r = $this->companyProfileModel->getCompanyInfo($request);
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
    }

 /** Start Save  and retrieve company's logo **/
  function saveCompanyLogo(Request $request)
  {   
     $r = $this->companyProfileModel->saveCompanyLogo($request);
	 if($r =='#350') 
	   return makeJsonResponse($r,350); // user not authenticated
     else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
     return makeJsonResponse($r);
  } 

  function getCompanyLogo(Request $request)
  {
	  $r = $this->companyProfileModel->getCompanyLogo($request);
	  if($r =='#350') 
	   return makeJsonResponse($r,350); // user not authenticated
	 else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
	 return makeJsonResponse($r);
  }
  
  function deleteCompanyLogo(Request $request)
  {
    $r = $this->companyProfileModel->deleteCompanyLogo($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

}
