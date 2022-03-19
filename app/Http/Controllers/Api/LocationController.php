<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location; 

class LocationController extends Controller
{
    protected $location;
    public function __construct()
    { 
        
        $this->location = new Location();
    }

   function getComboItems_country(Request $request){
      $r = $this-> location->getComboItems_country($request);
      if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
     return makeJsonResponse($r);
   } 
   
   function createCountry(Request $request){
      $r = $this-> location->createCountry($request); 
      if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
     return makeJsonResponse($r);
   } 	 

    //create or Update country
    function saveCountry(Request $request){
        $r = $this-> location->saveCountry($request);
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
       return makeJsonResponse($r);
    } 

        //create or Update City
        function saveCity(Request $request){
            $r = $this-> location->saveCity($request);
            if($r =='#350') 
            return makeJsonResponse($r,350); // user not authenticated
          else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
           return makeJsonResponse($r);
        } 
 
  function getCountryList(Request $request){
       $r = $this-> location->getCountryList($request);
       if($r =='#350') 
       return makeJsonResponse($r,350); // user not authenticated
     else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
  }

  function getDistrictList(Request $request){
    $r = $this-> location->getDistrictList($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
  else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
   return makeJsonResponse($r); 
  }

  function getCityList(Request $request){
    $r = $this-> location->getCityList($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
  else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
   return makeJsonResponse($r);
  }

  function getCommuneList(Request $request){
     $r = $this-> location->getCommuneList($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
  else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
   return makeJsonResponse($r);
  }

  function deleteCountry(Request $request){
    $r = $this-> location->deleteCountry($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
  else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
   return makeJsonResponse($r);
  }

  function deleteCity(Request $request){
    $r = $this-> location->deleteCity($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
  else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
   return makeJsonResponse($r);
  }

  function deleteDistrict(Request $request){
    $r = $this-> location->deleteDistrict($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
  else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
   return makeJsonResponse($r);
  }

  function deleteCommune(Request $request){
    $r = $this-> location->deleteCommune($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
  else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
   return makeJsonResponse($r);
  }
   

  function saveDistrict(Request $request){
    $r = $this-> location->saveDistrict($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
  else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
   return makeJsonResponse($r);
  }

  function saveCommune(Request $request){
        $r = $this-> location->saveCommune($request);
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
  }

  function getComboItems_city(Request $request){
    $r = $this-> location->getComboItems_city($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
  function getComboItems_district(Request $request){
    $r = $this-> location->getComboItems_district($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
   
  function getComboItems_commune(Request $request){
    $r = $this->location->getComboItems_commune($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
  function getZoneItems(Request $request){
    $r = $this->location->getZoneItems($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

  function getComboItems_zone(Request $request){
    $r = $this->location->getComboItems_zone($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

}
