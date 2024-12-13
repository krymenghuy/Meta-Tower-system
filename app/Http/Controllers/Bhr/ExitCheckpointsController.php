<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\ExitCheckpoints;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class ExitCheckpointsController extends Controller
{
    protected $emp_exit_check_points;
    public function __construct()
    {
        $this->emp_exit_check_points = new ExitCheckpoints();
    }
    function saveExitCheckPointPoints(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = $this->emp_exit_check_points->save($req->emp_exit_check_point, $ss, $req->all());
        return JDV::raw($res);
    }
    public function getExitCheckpointsPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->emp_exit_check_points->getExitCheckpointsPaginate($req->all(), $ss));
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
        return JDV::result($this->emp_exit_check_points->getDetails($req->id, $ss));
    }
    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->emp_exit_check_points->getFormOptions($req->id, $ss));
    }

    public function deleteExitCheckpoints(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->emp_exit_check_points->deleteExitCheckpoints($req->id, $ss));
    }
}
