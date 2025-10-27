<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Zone;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    protected $Zone;
    public function saveZone(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->zone_id;
        $zone = new Zone($id, $ss);
        $res = $zone->saveZone($req->all(),$id);
        return JDV::raw($res);}


        public function getListZone(Request $req){
            $ss = XAuthService::verifyAuth($req, -1);
            if($ss->status_code !==200){
                return JDV::raw($ss);
            }
            $zone = new Zone();
            return JDV::result($zone->getListZone($req->all(),$ss));
        }

        public function zoneDetails(Request $req){
            $ss = XAuthService::verifyAuth($req, -1);
            if($ss->status_code !==200){
                return JDV::raw($ss);
            }
            $zone = new Zone();
            return JDV::result($zone->zoneDetails($req->id,$ss));
        }

        public function getFormOptions(Request $req){
            $ss = XAuthService::verifyAuth($req, -1);
            if($ss->status_code !==200){
                return JDV::raw($ss);
            }
            $zone = new Zone();
            return JDV::result($zone->getFormOptions($req->id,$ss));
        }

        public function deleteZone(Request $req){
            $ss = XAuthService::verifyAuth($req, -1);
            if($ss->status_code !==200){
                return JDV::raw($ss);
            }
            $id = $req->id ?? $req->zone_id;
            $zone = new Zone();
            $req = $zone->deleteZone($id);
            return JDV::raw($res);

        }
}

