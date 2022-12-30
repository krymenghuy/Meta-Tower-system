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
use Session;
use DB;

class LocationController extends Controller
{
    // public function __construct()
    // { 
    //     $this->location = new Location();
    // }

   function getComboItems_country(Request $req){
        // $ss = UM::getUserInfoByToken($req,-1);
        // if($ss->status_code !=200) return JResponse::emptyResult($ss); //user not authenticated
        // //$branch_id = $ss->branch_id;
        // $rows = Country::selectRaw("id,name")->orderByRaw("name ASC")->get();
        // return JResponse::json($rows);
    } 
   
   function saveCountry(Request $req){
        // $ss = UM::getUserInfoByToken($req,-1);
        // if($ss->status_code !=200) return JResponse::failed($ss); //user not authenticated
        // $res = Country::save($req->all());
        // return JResponse::jsonRaw($res);
   } 	 
 
  //create or Update City
   function saveCity(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $sanitize_rules = [];
        $check_unique = ["$branch_id|loc_cities|name|id=id"];
        $res = getValues($req,['name'=>'1|string',true,$sanitize_rules,$ss->lang,false,$check_unique]);
        if($res->error) return JDV::error($res->error);
        $id = saveData($ss,'loc_cities',['id'=>$id],0);
        if($new_id >0) return JDV::success(["id"=>$new_id]);
        return JDV::error("something wrong during saving city name");
   } 
 
  function getCountryList(Request $request){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::emptyResult($ss,[],401); //user not authenticated
    $branch_id = $ss->branch_id;
    $rows = DB::table('loc_countries AS c')->selectRaw('c.id,c.name,c.name_kh')->where('c.branch_id',$branch_id)->get(); 
    return JDV::json($rows);
  }

  function getDistrictList(Request $request){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::emptyResult($ss,[],401); //user not authenticated
    $branch_id = Sanitizer::sanitize($ss->branch_id);
    $city_id = Sanitizer::sanitize(isset($req->city_id)?$req->city_id:0);
    $rows= DB::table('loc_districts AS z')->join('loc_cities AS c','c.id','=','z.city_id')->join('loc_countries AS c1','c1.id','=','c.country_id')->selectRaw('z.id,z.name,z.name_kh,c1.id as country_id,c1.name AS country_name,c.id as city_id,c.name AS city_name')->where('z.branch_id',$branch_id)->where('z.city_id',$city_id)->get();   
    return $rows;
  }

  function getCityList(Request $request){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::emptyResult($ss,[],401); //user not authenticated
    $branch_id = Sanitizer::sanitize($ss->branch_id);
    $country_id = isset($req->country_id)?$req->country_id:0; 
    $rows = DB::table('loc_cities')->where('branch_id',$branch_id)->where('country_id',$country_id)->selectRaw('id,name')->get(); 
    return JDV::json($rows); 
  }

  function getCommuneList(Request $request){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::emptyResult($ss,[],401); //user not authenticated
    $branch_id = Sanitizer::sanitize($ss->branch_id);
    $district_id = isset($req->district_id)?$req->district_id:0;
    $rows = DB::table('loc_communes AS c')->join('loc_districts AS d','d.id','=','c.district_id')->join('loc_cities AS c1','c1.id','=','d.city_id')->where('c.branch_id',$branch_id)->where('c.district_id',$district_id)->selectRaw('c.id,c.name,c.name_kh, d.name_kh AS district_name, c1.name_kh AS city_name')->get();  
    return JDV::json($rows);
  }

  function deleteCountry(Request $request){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = Sanitizer::sanitize($ss->branch_id);
      $country_id = isset($req->country_id)?$req->country_id:0; 
      DB::table("loc_countries")->where('id',$country_id)->delete();
      return JDV::success();
  }

  function deleteCity(Request $request){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $branch_id = Sanitizer::sanitize($ss->branch_id);
    $city_id = isset($req->city_id)?$req->city_id:0; 
    DB::table("loc_cities")->where('id',$city_id)->delete();
    return JDV::success();
  }

  function deleteDistrict(Request $request){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = Sanitizer::sanitize($ss->branch_id);
      $district_id = isset($req->district_id)?$req->district_id:0; 
      DB::table("loc_districts")->where('id',$district_id)->delete();
      return JDV::success();
  }

  function deleteCommune(Request $request){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = Sanitizer::sanitize($ss->branch_id);
      $commune_id = isset($req->commune_id)?$req->commune_id:0; 
      DB::table("loc_communes")->where('id',$commune_id)->delete();
      return JDV::success();
  }
    
  function saveDistrict(Request $request){
     $ss = UM::getUserInfoByToken($req,-1);
     if($ss->status_code !=200) return $ss; //user not authenticated
     $branch_id = Sanitizer::sanitize($ss->branch_id);
  }

  function saveCommune(Request $request){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $branch_id = Sanitizer::sanitize($ss->branch_id);
  }

  function getComboItems_city(Request $request){
    $r = $this-> location->getComboItems_city($request);
    return makeJsonResponse($r);
  }
  function getComboItems_district(Request $request){
    $r = $this-> location->getComboItems_district($request);
    return makeJsonResponse($r);
  }
   
  function getComboItems_commune(Request $request){
    $r = $this->location->getComboItems_commune($request);
    return makeJsonResponse($r);
  }
  function getZoneItems(Request $request){
    $r = $this->location->getZoneItems($request);
    return makeJsonResponse($r);
  }

  function getComboItems_zone(Request $request){
    $r = $this->location->getComboItems_zone($request);
    return makeJsonResponse($r);
  }

}
