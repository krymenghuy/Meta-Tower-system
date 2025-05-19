<?php

namespace App\Http\Controllers\Ypg;

use App\Http\Controllers\Controller;
use App\Models\Ypg\Experience;
use Illuminate\Http\Request;
use JDV;
use XAuthService;
use Auth;
class ExperienceController extends Controller
{
    protected $experience = null;
    public function __construct()
    {
        $this->experience = new Experience();
    }
    public function save(Request $req)
    {
        $id = $req->id ?? $req->id;
        $prn_code = $id ? 497 : 498;
        $ss = XAuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code != 200) return JDV::raw($ss);
        $edu = $this->experience->saveExperience($req->all(), $id, $ss);
        return JDV::raw($edu);
    }

    public function ListAll(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $edu = $this->experience->getListAll($req->all(), $ss);

        return JDV::result($edu);
    }

    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        $edu = $this->experience->details($req->id, $ss);

        return JDV::result($edu);
    }


    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $edu = $this->experience->formOptions($req->id, $ss);
        return JDV::result($edu);
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 499);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $res = $this->experience->delete($req->id, $ss);
        return JDV::raw($res);
    }
}
