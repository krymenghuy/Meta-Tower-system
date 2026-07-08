<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\EmployeeSkill;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class EmployeeSkillController extends Controller
{
    protected $skills;

    public function __construct()
    {
        $this->skills = new EmployeeSkill();
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

        return JDV::result(EmployeeSkill::getListByEmployee($emp_id, $ss));
    }

    public function save(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->id ?? $req->skill_id ?? null;
        $skill = new EmployeeSkill($id, $ss);
        $res = $skill->upsert($req->all(), $id, $ss);

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

        $skill = new EmployeeSkill($req->id, $ss);
        $res = $skill->delete($req->id, $ss);

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

        return JDV::result(EmployeeSkill::getDetails($req->id, $ss));
    }
}
