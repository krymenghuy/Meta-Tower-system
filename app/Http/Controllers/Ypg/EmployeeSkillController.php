<?php

namespace App\Http\Controllers\Ypg;

use App\Http\Controllers\Controller;
use App\Models\Ypg\EmployeeSkill;
use JDV;
use XAuthService;
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
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $employee_skill = new EmployeeSkill($id);
        return $employee_skill->save($req, $ss ,$id);
    }

    public function getEmployeeSkillListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->employee_skill->listpaginate($req, $ss));
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

        return JDV::result($this->employee_skill->getDetails($req->id, $ss));
    }

    public function deleteEmployeeSkill(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $res = $this->employee_skill->delete($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->employee_skill->getFormOptions($req->id, $ss));
    }
}
