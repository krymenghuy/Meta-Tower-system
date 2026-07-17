<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\CheckPoint;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class CheckPointController extends Controller
{
    protected $check_points;
    public function __construct()
    {
        $this->check_points = new CheckPoint();
    }
    function save(Request $req)
    {
        $id = $req->id ?? null;
        $prn_code = $id ? 301 : 302;
        $ss = XAuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = $this->check_points->save($id, $ss, $req->all());
        return JDV::raw($res);
    }
    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->check_points->getList($req->all(), $ss));
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
        return JDV::result($this->check_points->getDetails($req->id, $ss));
    }
    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->check_points->getFormOptions($req->id));
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 303);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->check_points->delete($req->id);
        return JDV::raw($res);
    }
}
