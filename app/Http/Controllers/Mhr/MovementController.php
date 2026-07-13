<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mhr\Movement;
use JDV;
use XAuthService;

class MovementController extends Controller
{
    protected $movement;
    public function __construct(){
        $this->movement = new Movement();
    }
    public function saveEmployeeMovement(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id ?? null;
        $res = $this->movement->upsert($req->all(),$id,$ss);

        return JDV::raw($res);
    }
     public function getEmployeeMovementListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->movement->getEventListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->movement->getDetails($req->id, $ss));
    }

    public function deleteEmpEvent(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->movement->deleteEmpEvent($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->movement->getFormOptions($req->id, $ss));
    }
}
