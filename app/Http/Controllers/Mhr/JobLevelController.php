<?php

namespace App\Http\Controllers\Mhr;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mhr\JobLevel;
use XAuthService;
use JDV;

class JobLevelController extends Controller
{
    protected $job_level;
    public function __construct()
    {
        $this->job_level = new JobLevel();
    }
    function saveJobLevel(Request $req)
    {
        $id = $req->id ?? null;
        $prn_code = $id ? 204 : 205;
        $ss = XAuthService::verifyAuth($req, $prn_code);

        if ($ss->status_code != 200) return JDV::raw($ss);
        $job_level = new JobLevel($id, $ss);
        $res = $job_level->save($req->all());
        return JDV::raw($res);
    }

    // function getJobLevelList(Request $req)
    // {
    //     $ss = XAuthService::verifyAuth($req, -1);
    //     if ($ss->status_code != 200) return JDV::raw($ss);
    //     $job_level = new Job_Level($req->id, $ss);
    //     $data = $job_level->getList($req->all(),$ss);
    //     return JDV::result($data);
    // }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->job_level->getFormOptions($req->id, $ss));
    }
    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->job_level->getDetails($req->id, $ss));
    }
    public function deleteJobLevel(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 206);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->job_level->delete($req->id, $ss);
        return JDV::raw($res);
    }
    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code != 200) return JDV::raw($ss);
        $job_level = new JobLevel($req->id, $ss);
        $data = $job_level->getList($req->all(), $ss);
        return JDV::result($data);
    }
}
