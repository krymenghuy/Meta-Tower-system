<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Movement;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class MovementController extends Controller
{
    protected $movement;
    public function __construct(Movement $movement)
    {
        $this->movement = $movement;
    }

    public function saveMovement(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return $this->movement->save($req->all(), $ss);
    }

    public function getMovementListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->movement->getMovementListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->movement->getDetails($req->id, $ss));
    }

    public function deleteMovement(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return $this->movement->delete($req->id, $ss);
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->movement->getFormOptions($req->id, $ss));
    }

}
