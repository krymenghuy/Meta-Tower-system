<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Skill;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    protected $skillModel;
    public function __construct()
    {
        $this->skillModel = new Skill();
    }

    public function saveSkill(Request $req)
    {
        $id = $req->skill_id ?? $req->id;
        $prn_code = $id ? 201 : 202;
        $ss = XAuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $skill = new Skill($id, $ss);
        $res = $skill->save($req->all());
        return JDV::raw($res);

    }

    public function getSkillList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->skillModel->getSkills($req->all(), $ss));
    }

    public function getSkillListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->skillModel->getSkillsPaginate($req->all(), $ss));
    }

    public function deleteSkill(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 203);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->skillModel->delete($req->id, $ss);
        return JDV::raw($res);
    }

    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->skillModel->getDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->skillModel->getFormOptions($req->id, $ss));
    }

    public function saveSkillPhoto(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->skillModel->saveSkillPhoto($req->all(), $ss));
    }

    public function getSkillPhoto(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->skill_id ?? $req->id;
        return JDV::result($this->skillModel->getSkillPhoto($id));
    }

    public function deleteSkillPhoto(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->skill_id ?? $req->id;
        return JDV::raw($this->skillModel->deleteSkillPhoto($id,$ss));
    }
}
