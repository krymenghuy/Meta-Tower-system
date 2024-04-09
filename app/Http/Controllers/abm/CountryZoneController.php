<?php

namespace App\Http\Controllers\abm;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\abm\CountryZone;
use App\Models\UM;
use App\Models\JDV;


class CountryZoneController extends Controller
{
    function save(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
         $id = $req->id;
         $zone = new CountryZone($id,$ss); 
         $save = $zone->save($req->all());
         return JDV::raw($save); 
     }
     function getCountryZoneList_all(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = CountryZone::list_all($req->all(),$ss);
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
function delete(Request $req){
    $ss = UM::getUserInfoByToken($req, -1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id=$req->id;
    $country = new CountryZone();
    $delete = $country->delete($id);
    return JDV::raw($delete);
}



}
