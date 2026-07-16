<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\Position;
use JDV;
use XAuthService;
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
        $id = $req->id ?? null;
        $prn_code = $id ? 219 : 220;
        $ss = XAuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $department = new Position($id, $ss);
        $res = $department->save($req->all());
        return JDV::raw($res);
    }

    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->positionModel->getList($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
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
        $ss = XAuthService::verifyAuth($req, 221);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->positionModel->deletePosition($req->id);
        return JDV::raw($res);
        //return JDV::result($this->positionModel->deletePosition($req->id, $ss)); THIS IS WRONG for Delete or Update. DO NOT USE ::result()
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->positionModel->getFormOptions($req->id, $ss));
    }
}
