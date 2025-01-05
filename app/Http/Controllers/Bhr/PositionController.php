<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Position;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;



class PositionController extends Controller
{
    protected $positionModel;
    public function __construct()
    {
        $this->positionModel = new Position();
    }

    public function savePosition(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $department = new Position($id, $ss);
        $res = $department->save($req->all());
        return JDV::raw($res);
    }

    public function getList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->positionModel->getList($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->positionModel->getDetails($req->id, $ss));
    }

    public function deletePosition(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->positionModel->deletePosition($req->id, $ss);
        return JDV::raw($res);
        //return JDV::result($this->positionModel->deletePosition($req->id, $ss)); THIS IS WRONG for Delete or Update. DO NOT USE ::result()
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->positionModel->getFormOptions($req->id, $ss));
    }
}
