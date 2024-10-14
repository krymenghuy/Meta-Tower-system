<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Movements;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class MovementsController extends Controller
{
    protected $movements;
    public function __construct(Movements $movements)
    {
        $this->movements = $movements;
    }

    public function saveMovements(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return $this->movements->save($req->all(), $ss);
    }

    public function getMovementsListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->movements->getMovementsListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->movements->getDetails($req->id, $ss));
    }

    public function deleteMovements(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return $this->movements->delete($req->id, $ss);
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->movements->getFormOptions($req->id, $ss));
    }

}
