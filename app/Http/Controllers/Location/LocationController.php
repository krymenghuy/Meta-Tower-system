<?php

namespace App\Http\Controllers\Location;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location\Country;
use App\Models\Location\City;
use App\Models\Location\District;
use App\Models\Location\Commune;
use App\Models\JDV;
use App\Services\UMt\AuthService;

class LocationController extends Controller
{

    protected $country;
    protected $city;
    protected $district;
    protected $commune;

    public function __construct()
    {
        $this->country = new Country();
        $this->city = new City();
        $this->district = new District();
        $this->commune = new Commune();
    }

    public function getDetailCountry(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        return JDV::result($this->country->getDetailCountry($req->id, $ss));
    }

   function getComboItems_country(Request $req){
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->country->options_country($req->id, $ss));
    }

   function saveCountry(Request $req){
        $ss =AuthService::verifyAuth($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);

        $id = $req->country_id?$req->country_id:$req->id;
        $country = new Country($id,$ss);
        $res = $country->save($req->all());
        return JDV::raw($res);
   }

  //create or Update City
   function saveCity(Request $req){
        $ss =AuthService::verifyAuth($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $res = City::save($req->all(),$ss);
        if($res->status ==='OK') return JDV::success(['city'=>$res->city]);
        return JDV::error($res->error_message);
   }

   function saveDistrict(Request $req){
    $ss =AuthService::verifyAuth($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    $res = District::save($req->all(),$ss);
    if($res->status ==='OK') return JDV::success(['district'=>$res->district]);
    return JDV::error($res->error_message);
  }

  function saveCommune(Request $req){
    $ss =AuthService::verifyAuth($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    $res = Commune::save($req->all(),$ss);
    if($res->status ==='OK') return JDV::success(['commune'=>$res->commune]);
    return JDV::error($res->error_message);
  }

  function getCountryList(Request $req){
    $ss =AuthService::verifyAuth($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    return JDV::result(Country::list($req->all(),$ss));
  }
  function getCityList(Request $req){
    $ss =AuthService::verifyAuth($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    return JDV::result(City::list($req->country_id,$ss));
  }

  function getDistrictList(Request $req){
    $ss =AuthService::verifyAuth($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    return JDV::result(District::list($req->city_id,$ss));
  }

  function getCommuneList(Request $req){
    $ss =AuthService::verifyAuth($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    return JDV::result(Commune::list($req->district_id,$ss));
  }

  function deleteCountry(Request $req){
      $ss =AuthService::verifyAuth($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $id =$req->id?$req->id:$req->country_id;
      $res = Country::delete($id,$ss);
      if($res->status ==='OK') return JDV::result();
      return JDV::error($res->error_message);
  }

  function deleteCity(Request $req){
    $ss =AuthService::verifyAuth($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $id = isset($req->city_id)?$req->city_id:$req->id;
    $res = City::delete($id,$ss);
    if($res->status ==='OK') return JDV::success();
    return JDV::error($res->error_message);
  }

  function deleteDistrict(Request $req){
      $ss =AuthService::verifyAuth($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $id = $req->id?$req->id:$req->district_id;
      $res = District::delete($id,$ss);
      if($res->status ==='OK') return JDV::success();
      return JDV::error($res->error_message);
  }

  function deleteCommune(Request $req){
      $ss =AuthService::verifyAuth($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $id = $req->id?$req->id:$req->commune_id;
      $res = Commune::delete($id,$ss);
      if($res->status ==='OK') return JDV::success();
      return JDV::error($res->error_message);
  }

  function getComboItems_city(Request $req){
    $ss =AuthService::verifyAuth($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $country_id = $req->country_id?$req->country_id:-1;
    return JDV::result(City::options_city($country_id,$ss));
  }

  function getComboItems_district(Request $req){
    $ss =AuthService::verifyAuth($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $city_id =$req->city_id?$req->city_id:-1;
    return JDV::result(District::options_district($city_id,$ss));
  }

  function getComboItems_commune(Request $req){
    $ss =AuthService::verifyAuth($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $district_id = $req->district_id?$req->district_id:-1;
    return JDV::result(Commune::options_commune($district_id,$ss));
  }

  function deleteFlag(Request $req){
    $ss = AuthService::verifyAuth($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->country_id ?? $req->id;
    $country = new Country($id,$ss);
    $res = $country->deleteFlag($id);
    return JDV::raw($res);
}

 function saveFlag(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

        $id = $req->country_id ?? $req->id;
        $flag = $req->flag?? $req->img;
        $res = Country::saveFlag($flag,null,$id,$ss);
        return JDV::raw($res);
     }


}
