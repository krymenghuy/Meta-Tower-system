<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location\Country;
use App\Models\Location\City;
use App\Models\Location\District;
use App\Models\Location\Commune;

use App\Models\JDV;
use App\Models\UM;

class LocationController extends Controller
{
 
   function getComboItems_country(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        return JDV::result(Country::list($ss));
    } 
   
   function saveCountry(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $res = Country::save($req->all(),$ss);
        if($res->status ==='OK') return JDV::success(['country'=>$res->country]);
        return JDV::error($res->error_message);
   } 	 
 
  //create or Update City
   function saveCity(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $res = City::save($req->all(),$ss);
        if($res->status ==='OK') return JDV::success(['city'=>$res->city]);
        return JDV::error($res->error_message);
   } 
 
   function saveDistrict(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    $res = District::save($req->all(),$ss);
    if($res->status ==='OK') return JDV::success(['district'=>$res->district]);
    return JDV::error($res->error_message);
  } 

  function saveCommune(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    $res = Commune::save($req->all(),$ss);
    if($res->status ==='OK') return JDV::success(['commune'=>$res->commune]);
    return JDV::error($res->error_message);
  }

  function getCountryList(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    return JDV::result(Country::list($ss));
  }
  function getCityList(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    return JDV::result(City::list($req->country_id,$ss)); 
  }

  function getDistrictList(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    return JDV::result(District::list($req->city_id,$ss)); 
  }

  function getCommuneList(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    return JDV::result(Commune::list($req->district_id,$ss)); 
  }

  function deleteCountry(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $id =$req->id?$req->id:$req->country_id;
      $res = Country::delete($id,$ss);
      if($res->status ==='OK') return JDV::result();
      return JDV::error($res->error_message);
  }

  function deleteCity(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $id = isset($req->city_id)?$req->city_id:$req->id; 
    $res = City::delete($id,$ss);
    if($res->status ==='OK') return JDV::success();
    return JDV::error($res->error_message);
  }

  function deleteDistrict(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $id = $req->id?$req->id:$req->district_id;
      $res = District::delete($id,$ss);
      if($res->status ==='OK') return JDV::success();
      return JDV::error($res->error_message);
  }

  function deleteCommune(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $id = $req->id?$req->id:$req->commune_id; 
      $res = Commune::delete($id,$ss);
      if($res->status ==='OK') return JDV::success();
      return JDV::error($res->error_message);
  }
   
  function getComboItems_city(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $country_id = $req->country_id?$req->country_id:-1;
    return JDV::result(\App\Models\GeneralSettings::options_city($country_id,$ss));
  }

  function getComboItems_district(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $city_id =$req->city_id?$req->city_id:-1;
    return JDV::result(\App\Models\GeneralSettings::options_district($city_id,$ss));
  }
   
  function getComboItems_commune(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $district_id = $req->district_id?$req->district_id:-1;
    return JDV::result(\App\Models\GeneralSettings::options_commune($district_id,$ss));
  }

  function getZoneItems(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    return JDV::result(\App\Models\DeliveryZone::list($ss));
  }
  function getComboItems_zone(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    return JDV::result(\App\Models\GeneralSettings::options_zone($ss));
  }

}
