<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\EmployeeExperience;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class EmployeeExperienceController extends Controller
{
    protected $experiences;

    public function __construct()
    {
        $this->experiences = new EmployeeExperience();
    }

    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $emp_id = $req->emp_id ?? $req->employee_id ?? null;
        if (!$emp_id || !is_numeric($emp_id)) {
            return JDV::error('Invalid employee ID');
        }

        return JDV::result(EmployeeExperience::getListByEmployee($emp_id, $ss));
    }

    public function save(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? $req->experience_id ?? null;
        $experience = new EmployeeExperience($id, $ss);
        $res = $experience->upsert($req->all(), $id, $ss);

        return JDV::raw($res);
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $experience = new EmployeeExperience($req->id, $ss);
        $res = $experience->delete($req->id, $ss);

        return JDV::raw($res);
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

        return JDV::result($this->experiences->getDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? null;

        return JDV::result($this->experiences->getFormOptions($id, $ss));
    }
}
