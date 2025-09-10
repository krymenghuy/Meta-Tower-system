<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
     public function saveBuilding(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
         $id = $req->building_id ?? $req->id;
        $building = new Building($id,$ss);
        $res = $building->saveBuilding($req->all(),$id);
        return JDV::raw($res);

    }

    public function getListAccountStaff(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $acc_staff = new AccountStaff();
        return JDV::result($acc_staff->getListAccountStaff($req->all(),$ss));
    }
    
}
