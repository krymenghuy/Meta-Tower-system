<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Tenant;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    protected $tenants;
    public function __construct(){
        $this->tenants = new Tenant();
    }

     public function saveBuilding(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->building_id ?? $req->id;
        $building = new Building();
        $save = $building->saveBuilding($req->all(),$id,$ss);
        return JDV::raw($save);

    }

    public function getListBuilding(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->tenants->getListBuilding($req->all(),$ss));
    }

    public function buildingDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->tenants->buildingDetails($req->id));
    }
     public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->tenants->getFormOptions($req->id));
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
        $res = $this->tenants->deleteBuilding($req->id);
        return JDV::raw($res);
    }
    
}
