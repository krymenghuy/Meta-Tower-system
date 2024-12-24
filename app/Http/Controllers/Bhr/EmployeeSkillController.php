<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\EmployeeSkill;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;


class EmployeeSkillController extends Controller
{
   protected $employee_skill;

    public function __construct()
    {
        $this->employee_skill = new EmployeeSkill();
    }

    public function saveEmployeeSkill(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return $this->employee_skill->save($req, $ss,$req->id ?? null);
    }

    public function getEmployeeSkillListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->employee_skill->listpaginate($req, $ss));
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

        return JDV::result($this->employee_skill->getDetails($req->id, $ss));
    }

    public function deleteEmployeeSkill(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        return JDV::result($this->employee_skill->delete($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->employee_skill->getFormOptions($req->id, $ss));
    }
}
