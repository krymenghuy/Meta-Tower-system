<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Building;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
    protected $buildings;
    public function __construct()
    {
        $this->buildings = new Building();
    }

    public function saveBuilding(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->building_id ?? $req->id;
        $building = new Building();
        $save = $building->saveBuilding($req->all(), $id, $ss);
        return JDV::raw($save);

    }

    public function getListBuilding(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->buildings->getListBuilding($req->all(), $ss));
    }

    public function buildingDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->buildings->buildingDetails($req->id));
    }
    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->buildings->getFormOptions($req->id, $req->building_id));
    }
    public function deleteBuilding(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->buildings->deleteBuilding($req->id);
        return JDV::raw($res);
    }
    public function addFloor(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->building_id ?? $req->id;
        $building = new Building();
        $save = $building->addFloor($req->all(), $id, $ss);
        return JDV::raw($save);

    }
    public function getListFloor(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code != 200)
            return $ss;

        $building_id = $req->building_id ?? $req->id;
        if (!$building_id) {
            return JDV::error('building_id is required');
        }
        $building = new Building();
        $list = $building->getListFloor($building_id, $ss);

        return JDV::result($list);
    }
    public function deleteFloor(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
            if (!isset($req->id) || !is_numeric($req->id)) {
                return JDV::error('Invalid ID');
            }
        $res = $this->buildings->deleteFloor($req->id);
        return JDV::raw($res);
    }



}
