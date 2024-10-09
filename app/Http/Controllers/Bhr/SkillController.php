<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Skill;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    protected $skillModel;
    public function __construct(Skill $skillModel)
    {
        $this->skillModel = $skillModel;
    }

    public function saveSkill(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->skill_id ?? $req->id;
        $skill = new Skill($id, $ss);
        $res = $skill->save($req->all());
        return JDV::raw($res);

    }

    public function getSkillList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->skillModel->getSkills($req->all(), $ss));
    }

    public function getSkillListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        // Assuming 'perPage' is the second argument
        // $perPage = $req->input('perPage', 10);  // Default to 10 if not provided
        return JDV::result($this->skillModel->getSkillsPaginate($req->all(), $ss));
    }

    public function deleteSkill(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->skillModel->delete($req->id, $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->skillModel->getDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->skillModel->getFormOptions($req->id, $ss));
    }

    public function saveSkillLogo(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->skillModel->saveLogo($req->all(), $ss));
    }

    public function getSkillLogo(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->skillModel->getLogo($req->all(),$ss));
    }

    public function deleteSkillLogo(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->skillModel->deleteLogo($ss));
    }
}
