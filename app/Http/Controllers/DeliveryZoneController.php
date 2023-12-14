<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DeliveryZone;
use App\Models\UM;
use App\Models\JDV;

class DeliveryZoneController extends Controller
{
     function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id?$req->id:$req->zone_id;
        $data = DeliveryZone::getFormOptions($id,$ss);
        return JDV::result($data);
     }

     function getZoneList(Request $req) {
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !==200) return JDV::raw($ss);
          $data = DeliveryZone::list($req->all(),$ss);
          return JDV::result($data); 
     }

     function getZoneList_all(Request $req) {
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !==200) return JDV::raw($ss);
          $data = DeliveryZone::list_all($req->all(),$ss);
          return JDV::result($data); 
     }

     function saveZone(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
         $id = $req->id;
         $zone = new DeliveryZone($id,$ss); 
         $res = $zone->save($req->all());
         return JDV::raw($res); 
     }

     function deleteZone(Request $req) {
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !==200) return JDV::raw($ss);
          $id = $req->id?$req->id:$req->zone_id;
          $zone = new DeliveryZone($id,$ss);
          return JDV::raw($zone->delete());
     }

     function getZoneDetails(Request $req) {
         $ss = UM::getUserInfoByToken($req,-1);
         if($ss->status_code !==200) return JDV::raw($ss);
         $id = $req->id?$req->id:$req->zone_id;
         $d = DeliveryZone::details($id);
         return JDV::result($d);
     }

     function getZoneName(Request $req) {
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !==200) return JDV::raw($ss);
          $code = $req->zone_code?$req->zone_code:$req->code;
          $zone_name = new DeliveryZone($code,$ss);
          return JDV::result($zone_name);
     }
     
     function getZoneInfo(Request $req) {
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !==200) return JDV::raw($ss);
          $code = $req->zone_code?$req->zone_code:$req->code;
          $d = DeliveryZone::getZoneInfoByCode($code,$ss); 
          return JDV::result($d);
     }
}
