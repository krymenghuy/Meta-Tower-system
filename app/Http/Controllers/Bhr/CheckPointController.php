<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\CheckPoint;
use App\Models\JDV;
use App\Services\Umt\AuthService;
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
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = $this->check_points->save($req->check_point, $ss, $req->all());
        return JDV::raw($res);
    }
    public function getList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->check_points->getList($req->all(), $ss));
    }
    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->check_points->getDetails($req->id, $ss));
    }
    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->check_points->getFormOptions($req->id, $ss));
    }

    public function delete(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->check_points->delete($req->id, $ss));
    }
}
