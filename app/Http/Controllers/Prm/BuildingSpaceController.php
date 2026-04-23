<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\BuildingSpace;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class BuildingSpaceController extends Controller
{
    protected $building_spaces;

    public function __construct(){
        $this->building_spaces = new BuildingSpace();
    }

    public function saveBuildingSpace(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->building_space_id;
        $building_space = new BuildingSpace($id, $ss);
        $res = $building_space->saveBuildingSpace($req->all());
        return JDV::raw($res);

    }
    public function getListPaginate(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::row($ss);

        }
         return JDV::result($this->building_spaces->getListPaginate($req->all(),$ss));
    }

    public function getDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->building_spaces->getDetails($req->id));
    }

    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        return JDV::result($this->building_spaces->getFormOptions($req->all(),$ss));
    }

    public function delete(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::raw($this->building_spaces->delete($req->id));
    }
    public function updateBuildingSpaceStatus(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $building_space = new BuildingSpace();
        $res = $building_space->updateBuildingSpaceStatus($req->status_id, $id,$ss);
        return JDV::raw($res);
    }
    public function createBooking(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->building_space_id;
        $building_space = new BuildingSpace($id, $ss);
        $res = $building_space->createBooking($req->all());
        return JDV::raw($res);

    }
    public function viewBookingDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        $building_space = new BuildingSpace();
        $res = $building_space->viewBookingDetails($req->id);
        return JDV::result($res);
    }
}
