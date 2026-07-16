<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\Skill;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class SkillController extends Controller
{
    protected $skillModel;

    public function __construct()
    {
        $this->skillModel = new Skill();
    }

    public function saveSkill(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->skill_id ?? $req->id;
        $skill = new Skill($id, $ss);
        $res = $skill->upsert($req->all(), $id, $ss);

        return JDV::raw($res);
    }

    public function getSkillListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->skillModel->getSkillListPaginate($req->all(), $ss));
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

        return JDV::result(Skill::getDetails($req->id, $ss));
    }

    public function deleteSkill(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $res = $this->skillModel->deleteSkill($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->skillModel->getAdminFormOptions($req->id, $ss));
    }
}
