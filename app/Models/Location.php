<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Session;
use DB;
use Carbon\Carbon;

class Location extends Model
{
    use HasFactory;

  function getComboItems_country($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
		    $branch_id = sanitize($ss->branch_id);
        $rows = DB::table('loc_countries AS c')->where('c.branch_id',$branch_id)->selectRaw('c.id AS country_id,c.name, c.name_kh')->orderByRaw('c.name ASC')->get();  
		    return $rows;
	}

      function createCountry($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $name = $d->name;
        $name_kh =$d->name_kh;
        $map_location = $d->map_location;
      DB::table('loc_countries')->insert(array(
          'branch_id'=>$branch_id,
          'name'=>$name,
          'name_kh'=>$name_kh,
          'map_location'=>$map_location,
          'create_user'=>$ss->login_name,
          'create_date'=>getNowTime()
      ));
  } 	 
 
  //create or Update country
    function saveCountry($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = sanitize($ss->branch_id);
        
      if(!isset($d->id)) $d->id=0;
      if(!isset($d->name) || empty($d->name)) return "Country name cannot be empty";
      if(!isset($d->name_kh) || empty($d->name_kh)) $d->name_kh = $d->name;
      if(!isset($d->map_location)) $d->map_location =null;

     if($this->countryExists($ss,$d->name,$d->id)) return "The provided country name already exists";
     if($d->id>0){
        DB::table('loc_countries')->where('id',$d->id)->update(array(
            //'branch_id'=>$branch_id,
            'name'=>$d->name,
            'name_kh'=>$d->name_kh,
            'map_location'=>$d->map_location
            //,'create_user'=>$ss->login_name,
            //'create_date'=>getNowTime()
        ));
     } else {
        DB::table('loc_countries')->insert(array(
            'branch_id'=>$branch_id,
            'name'=>$d->name,
            'name_kh'=>$d->name_kh,
            'map_location'=>$d->map_location,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
        ));
     }
    return null;
} 

  //create or Update City
    function saveCity($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = sanitize($ss->branch_id);
      
    if(!isset($d->id)) $d->id=0;
    if(!isset($d->country_id) || $d->country_id <=0) {
       return "Country id is not correct";
    } 

    if(!isset($d->name) || empty($d->name)) return "City name cannot be empty";
    if(!isset($d->name_kh) || empty($d->name_kh)) $d->name_kh = $d->name;
    if(!isset($d->map_location)) $d->map_location =null;

    if($this->cityExists($ss,$d->country_id,$d->name,$d->id)) return "The provided city name already exists";
   if($d->id>0){
      DB::table('loc_cities')->where('id',$d->id)->update(array(
          //'branch_id'=>$branch_id,
          'name'=>$d->name,
          'country_id'=>$d->country_id,
          'name_kh'=>$d->name_kh,
          'map_location'=>$d->map_location
          //,'create_user'=>$ss->login_name,
          //'create_date'=>getNowTime()
      ));
   } else {
      DB::table('loc_cities')->insert(array(
          'branch_id'=>$branch_id,
          'country_id'=>$d->country_id,
          'name'=>$d->name,
          'name_kh'=>$d->name_kh,
          'map_location'=>$d->map_location,
          'create_user'=>$ss->login_name,
          'create_date'=>getNowTime()
      ));
   }
  return null;
} 

//delete DeliveryZones
function deleteDeliveryZones($branch_id,$zone_type, $id) {
   if ($zone_type =='country')
       DB::table('zones')->where('branch_id',$branch_id)->where('country_id',$id)->delete();
   else if ($zone_type =='city') 
       DB::table('zones')->where('branch_id',$branch_id)->where('city_id',$id)->delete();
   else if ($zone_type =='district')
        DB::table('zones')->where('branch_id',$branch_id)->where('district_id',$id)->delete();
   else if ($zone_type =='commune')
        DB::table('zones')->where('branch_id',$branch_id)->where('commune_id',$id)->delete();
   return null;
}

//create or Update commune
function saveCommune($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = sanitize($ss->branch_id);
      
    if(!isset($d->id)) $d->id=0;
    if (!isset($d->district_id)) $d->district_id =0;
    if($d->district_id <=0 || empty($d->district_id)) {
      return "The provided district is not correct";
    } 

    if(!isset($d->name) || empty($d->name)) return "Commune name cannot be empty";
    if(!isset($d->name_kh) || empty($d->name_kh)) $d->name_kh = $d->name;
    if(!isset($d->map_location)) $d->map_location =null;
       
    if($this->communeExists($ss,$d->district_id,$d->name,$d->id)) return "The provided commune name already exists";
    if($d->id>0){
      DB::table('loc_communes')->where('id',$d->id)->update(array(
          'district_id'=>$d->district_id,
          'name'=>$d->name,
          'name_kh'=>$d->name_kh,
          'map_location'=>$d->map_location
          //,'create_user'=>$ss->login_name,
          //'create_date'=>getNowTime()
      ));
    } else {
      $rows = DB::table('loc_districts AS d')->join('loc_cities AS c','c.id','=','d.city_id')->where('d.branch_id',$branch_id)->where('d.id',$d->district_id)->selectRaw('d.city_id,c.country_id')->limit(1)->get();
      $country_id = null;
      $city_id = null;
      foreach($rows as $row) {
        $city_id = $row->city_id;
        $country_id = $row->country_id;
      }

      DB::table('loc_communes')->insert(array(
          'city_id'=>$city_id,
          'country_id'=>$country_id,
          'district_id'=>$d->district_id,
          'branch_id'=>$branch_id,
          'name'=>$d->name,
          'name_kh'=>$d->name_kh,
          'map_location'=>$d->map_location,
          'create_user'=>$ss->login_name,
          'create_date'=>getNowTime()
      ));
    }
    return null;
} 

//create or Update City
function saveDistrict($d){
  $ss = getSessionInfo($d);
  if(!$ss) return '#350'; //user not authenticated
  if (!prn_allowed(2)) return '@'; //need permission to do this task
  $branch_id = sanitize($ss->branch_id);
  
if(!isset($d->id)) $d->id=0;
if(!isset($d->city_id) || $d->city_id <=0) {
   return "City id is not correct";
} 

if(!isset($d->name) || empty($d->name)) return "City name cannot be empty";
if(!isset($d->name_kh) || empty($d->name_kh)) $d->name_kh = $d->name;
if(!isset($d->map_location)) $d->map_location =null;

if($this->districtExists($ss,$d->city_id,$d->name,$d->id)) return "The provided district name already exists";
if($d->id>0){
  DB::table('loc_districts')->where('id',$d->id)->update(array(
      //'branch_id'=>$branch_id,
      'city_id'=>$d->city_id,
      'name'=>$d->name,
      'name_kh'=>$d->name_kh,
      'map_location'=>$d->map_location
      //,'create_user'=>$ss->login_name,
      //'create_date'=>getNowTime()
  ));
} else {
  DB::table('loc_districts')->insert(array(
      'city_id'=>$d->city_id,
      'branch_id'=>$branch_id,
      'name'=>$d->name,
      'name_kh'=>$d->name_kh,
      'map_location'=>$d->map_location,
      'create_user'=>$ss->login_name,
      'create_date'=>getNowTime()
  ));
}
return null;
} 

  function cityExists($uss,$country_id,$name,$id) {
    $rows = null;
    $branch_id = sanitize($uss->branch_id);
    if($id > 0)
     return  DB::table('loc_cities AS c')->where('c.branch_id',$branch_id)->where('c.country_id',$country_id)->where('c.name',$name)->where('c.id','<>',$id)->limit(1)->exists(); 
    else 
     return  DB::table('loc_cities AS c')->where('c.branch_id',$branch_id)->where('c.country_id',$country_id)->where('c.name',$name)->limit(1)->exists();     
 }

 function districtExists($uss,$city_id,$name,$id) {
    $rows = null;
    $branch_id = sanitize($uss->branch_id);
    if($id > 0)
    return  DB::table('loc_districts AS c')->where('c.branch_id',$branch_id)->where('c.city_id',$city_id)->where('c.name',$name)->where('c.id','<>',$id)->limit(1)->exists(); 
    else 
    return  DB::table('loc_districts AS c')->where('c.branch_id',$branch_id)->where('c.city_id',$city_id)->where('c.name',$name)->limit(1)->exists();     
 }

function communeExists($uss,$city_id,$name,$id) {
  $rows = null;
  $branch_id = sanitize($uss->branch_id);
  if($id > 0)
   return  DB::table('loc_communes AS c')->where('c.branch_id',$branch_id)->where('c.district_id',$city_id)->where('c.name',$name)->where('c.id','<>',$id)->limit(1)->exists(); 
  else 
   return  DB::table('loc_communes AS c')->where('c.branch_id',$branch_id)->where('c.district_id',$city_id)->where('c.name',$name)->limit(1)->exists();     
}

  function countryExists($uss,$name,$id) {
        $rows = null;
        $branch_id = sanitize($uss->branch_id);
        if($id > 0)
          $rows = DB::table('loc_countries as c')->selectRaw('c.id')->where('c.branch_id',$branch_id)->where('c.name',$name)->where('c.id','<>',$id)->limit(1)->get();
        else 
        $rows = DB::table('loc_countries as c')->selectRaw('c.id')->where('c.branch_id',$branch_id)->where('c.name',$name)->limit(1)->get();
         foreach($rows as $row) return true;
         return false;
    }

      function getCountryList($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);

        $rows = DB::table('loc_countries AS c')->selectRaw('c.id,c.name,c.name_kh')->where('c.branch_id',$branch_id)->get(); 
        return $rows;
    }

      function getDistrictList($d){
       $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $city_id = sanitize($d->city_id);
        $rows= DB::table('loc_districts AS z')->join('loc_cities AS c','c.id','=','z.city_id')->join('loc_countries AS c1','c1.id','=','c.country_id')->selectRaw('z.id,z.name,z.name_kh,c1.id as country_id,c1.name AS country_name,c.id as city_id,c.name AS city_name')->where('z.branch_id',$branch_id)->where('z.city_id',$city_id)->get();   
        return $rows;
    }

      function getCityList($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $country_id = $d->country_id; 
        $rows = DB::table('loc_cities')->where('branch_id',$branch_id)->where('country_id',$country_id)->selectRaw('id,name')->get(); 
        return $rows; 
    }
    
    function getCommuneList($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = sanitize($ss->branch_id);
      $district_id = isset($d->district_id)?$d->district_id:0;
        $rows = DB::table('loc_communes AS c')->join('loc_districts AS d','d.id','=','c.district_id')->join('loc_cities AS c1','c1.id','=','d.city_id')->where('c.branch_id',$branch_id)->where('c.district_id',$district_id)->selectRaw('c.id,c.name,c.name_kh, d.name_kh AS district_name, c1.name_kh AS city_name')->get();  
        return $rows;
    }

      function deleteCountry($d){
         $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $country_id = sanitize($d->country_id);
        DB::table('loc_cities')->where('branch_id',$branch_id)->where('country_id',$country_id)->delete();
        DB::raw("DELETE FROM loc_districts WHERE branch_id ='".$branch_id."' AND city_id IN (SELECT c1.id FROM loc_cities AS c1 WHERE c1.branch_id = loc_districts.branch_id AND c1.country_id ='".$country_id."')");
        DB::table('loc_countries')->where('branch_id',$branch_id)->where('id',$country_id)->delete();
        $this->deleteDeliveryZones($branch_id,'country',$country_id);
        return null;
    }
 
      function deleteCity($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);

        $city_id = sanitize($d->city_id);
        DB::table('loc_districts')->where('branch_id',$branch_id)->where('city_id',$city_id)->delete(); 
        DB::table('loc_cities')->where('branch_id',$branch_id)->where('id',$city_id)->delete();
        $this->deleteDeliveryZones($branch_id,'city',$city_id);
        return null;
    }
    
    function deleteDistrict($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = sanitize($ss->branch_id);

      $district_id = sanitize($d->district_id);
      DB::table('loc_communes')->where('branch_id',$branch_id)->where('district_id',$district_id)->delete(); 
      DB::table('loc_districts')->where('branch_id',$branch_id)->where('id',$district_id)->delete();
      $this->deleteDeliveryZones($branch_id,'district',$district_id);
      return null;
  }

  function deleteCommune($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = sanitize($ss->branch_id);
    $commune_id = isset($d->commune_id)? $d->commune_id:0;
    $commune_id = sanitize($d->commune_id);
    DB::table('loc_communes')->where('branch_id',$branch_id)->where('id',$commune_id)->delete(); 
    $this->deleteDeliveryZones($branch_id,'commune',$commune_id);
    return null;
}

      function getComboItems_city($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $country_id = sanitize($d->country_id); 
        $rows  = DB::table('loc_cities')->where('branch_id',$branch_id)->where('country_id',$country_id)->selectRaw('id AS city_id,name,name_kh')->get();
        return $rows;
    }

    function getComboItems_district($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = sanitize($ss->branch_id);
      $city_id = sanitize($d->city_id); 
      $rows  = DB::table('loc_districts AS d')->where('d.branch_id',$branch_id)->where('d.city_id',$city_id)->selectRaw('d.id AS district_id,d.name,d.name_kh')->orderByRaw('d.name ASC')->get();
      return $rows;
  }

  function getComboItems_zone($d) {
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = sanitize($ss->branch_id);
    $rows =DB::table('zones')->where('branch_id',$branch_id)->selectRaw("zone_code,CONCAT(zone_code,' | ',zone_name) AS zone_name")->orderByRaw("zone_code ASC")->get();
    return $rows;
  }

  function getZoneInfo($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = sanitize($ss->branch_id);
    $zone_code = sanitize($d->zone_code);
    //if(!$zone_code) $zone_code = $zone_code = sanitize($d->code);
    $rows =DB::table('zones')->where('branch_id',$branch_id)->where('zone_code',$zone_code)->selectRaw("zone_code,zone_name,country_id,city_id,district_id,commune_id,price")->limit(1)->get();
    foreach($rows as $row) return $row;
    return null;
  }

  function getComboItems_commune($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = sanitize($ss->branch_id);
    $district_id = sanitize($d->district_id); 
    $rows  = DB::table('loc_communes AS c')->where('c.branch_id',$branch_id)->where('c.district_id',$district_id)->selectRaw('c.id AS commune_id,c.name,c.name_kh')->orderByRaw('c.name ASC')->get();
    return $rows;
  }
  
  //returns a list of zones to Mobile App (Driver App)
  function getZoneItems($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = sanitize($ss->branch_id);
    $rows = DB::table('zones AS z')->join('loc_communes AS c','c.id','=','z.commune_id')->where('branch_id',$branch_id)->distinct()->selectRaw('c.name AS commune_name,z.zone_name,z.zone_code,z.district_id,z.commune_id,z.city_id')->get();
    return $rows;
  }
}
