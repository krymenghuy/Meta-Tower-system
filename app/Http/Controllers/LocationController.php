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
use Sanitizer;
use DB;

class LocationController extends Controller
{
    // public function __construct()
    // { 
    //     $this->location = new Location();
    // }

   function getComboItems_country(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $branch_id = $ss->branch_id;
        $rows = Country::select("id","name AS country_name")->orderBy("name","ASC")->get();
        return JDV::result($rows);
    } 
   
   function saveCountry(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $unique = ["$branch_id|loc_countries|id"];
        $res = validateReq($req,['id'=>'0|number|identity=1','name'=>'1|string|1-50'],true,[],$ss->lang,false,$unique);
        if ($res->error) return JDV::error($res->error);
        $id = $res->id;
        $inputs = $res->values;
        $id = saveData($ss,'loc_countries',['id'=>$id],$inputs,[],1);
        if($id>0) return JDV::success(['id'=>$id]);
        return JDV::error("Something wrong in saving country");
   } 	 
 
  //create or Update City
   function saveCity(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $sanitize_rules = [];
        $check_unique = ["$branch_id|loc_cities|name|id=id"];
        $res = validateReq($req,['id'=>'0|number|identity=1','name'=>'1|string',true,$sanitize_rules,$ss->lang,false,$check_unique]);
        if($res->error) return JDV::error($res->error);
        $inputs = $res->values;
        $id = saveData($ss,'loc_cities',['id'=>$id],$inputs,[],1);
        if($id >0) return JDV::success(["id"=>$id]);
        return JDV::error("something wrong during saving city name");
   } 
 
  function getCountryList(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    $branch_id = $ss->branch_id;
    $rows = DB::table('loc_countries AS c')->select('c.id','c.name','c.name_kh')->where('c.branch_id',$branch_id)->orderBy('name','ASC')->get(); 
    return JDV::result($rows);
  }

  function getDistrictList(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    $branch_id = Sanitizer::sanitize($ss->branch_id);
    $city_id = Sanitizer::sanitize(isset($req->city_id)?$req->city_id:0);
    $rows= DB::table('loc_districts AS z')->join('loc_cities AS c','c.id','=','z.city_id')->join('loc_countries AS c1','c1.id','=','c.country_id')->selectRaw('z.id,z.name,z.name_kh,c1.id as country_id,c1.name AS country_name,c.id as city_id,c.name AS city_name')->where('z.branch_id',$branch_id)->where('z.city_id',$city_id)->get();   
    return JDV::result($rows);
  }

  function getCityList(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    $branch_id = Sanitizer::sanitize($ss->branch_id);
    $country_id = isset($req->country_id)?$req->country_id:0; 
    $rows = DB::table('loc_cities')->where('branch_id',$branch_id)->where('country_id',$country_id)->selectRaw('id,name')->get(); 
    return JDV::result($rows); 
  }

  function getCommuneList(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    $branch_id = Sanitizer::sanitize($ss->branch_id);
    $district_id = isset($req->district_id)?$req->district_id:0;
    $rows = DB::table('loc_communes AS c')->join('loc_districts AS d','d.id','=','c.district_id')->join('loc_cities AS c1','c1.id','=','d.city_id')->where('c.branch_id',$branch_id)->where('c.district_id',$district_id)->selectRaw('c.id,c.name,c.name_kh, d.name_kh AS district_name, c1.name_kh AS city_name')->get();  
    return JDV::result($rows);
  }

  function deleteCountry(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = Sanitizer::sanitize($ss->branch_id);
      $country_id = isset($req->country_id)?$req->country_id:0; 
      DB::table("loc_countries")->where('id',$country_id)->delete();
      return JDV::success();
  }

  function deleteCity(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $branch_id = Sanitizer::sanitize($ss->branch_id);
    $city_id = isset($req->city_id)?$req->city_id:0; 
    DB::table("loc_cities")->where('id',$city_id)->delete();
    return JDV::success();
  }

  function deleteDistrict(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = Sanitizer::sanitize($ss->branch_id);
      $district_id = isset($req->district_id)?$req->district_id:0; 
      DB::table("loc_districts")->where('id',$district_id)->delete();
      return JDV::success();
  }

  function deleteCommune(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = Sanitizer::sanitize($ss->branch_id);
      $commune_id = isset($req->commune_id)?$req->commune_id:0; 
      DB::table("loc_communes")->where('id',$commune_id)->delete();
      return JDV::success();
  }
    
  function saveDistrict(Request $req){
     $ss = UM::getUserInfoByToken($req,-1);
     if($ss->status_code !=200) return $ss; //user not authenticated
     $branch_id = Sanitizer::sanitize($ss->branch_id);
  }

  function saveCommune(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $branch_id = Sanitizer::sanitize($ss->branch_id);
  }

  function getComboItems_city(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $rows = $this->location->getComboItems_city($ss->branch_id);
    return JDV::result($rows);
  }
  function getComboItems_district(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $rows = $this->location->getComboItems_district($ss->branch_id);
    return JDV::result($rows);
  }
   
  function getComboItems_commune(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $rows = $this->location->getComboItems_commune($ss->branch_id);
    return JDV::result($rows);
  }

  function getZoneItems(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $rows = $this->location->getZoneItems($ss->branch_id);
    return JDV::result($rows);
  }

  function getComboItems_zone(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $rows = $this->location->getComboItems_zone($ss->branch_id);
    return JDV::result($rows);
  }

}
