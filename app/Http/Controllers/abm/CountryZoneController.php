<?php

namespace App\Http\Controllers\Abm;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Abm\CountryZone;
use App\Models\UM;
use App\Models\JDV;


class CountryZoneController extends Controller
{
    function saveZoneCountry(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
         $id = $req->id;
         $zone = new CountryZone($id,$ss); 
         $save = $zone->saveZone($req->country_id,$req->zone_code,$req->country_code,$req->country_name,$ss);
         return JDV::raw($save); 
    }
     
    function getCountryZoneList(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = CountryZone::list($req->all(),$ss);
        return JDV::result($data); 
    }

    function details(Request $req ){

        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return JDV::raw($ss); 
        $id=$req->id;
        $country= new CountryZone($id,$ss);
        $detail = $country->details($id,$ss);
        return JDV::raw($detail);

    }
    function deleteZoneCountry(Request $req){
        $ss = UM::getUserInfoByToken($req, -1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id= $req->id;
        $country_id = $req->country_id;
        $zone = new CountryZone(null,null);
        $delete = $zone->deleteZone($country_id,$ss);
        return JDV::raw($delete);
    }

    // function getComboItems_country_zone(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !== 200) return JDV::raw($ss); 
    //     $country = new CountryZone();
    //     $rows = $country->options_country_zone($ss);
    //     return JDV::result($rows);
    // }

    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !== 200) return JDV::raw($ss); 
        $data = CountryZone::getFormOptions($req->id, $req->country_id, $ss);
        return JDV::result($data);
    }

}
