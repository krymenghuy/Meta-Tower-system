<?php

namespace App\Http\Controllers\Bhr;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bhr\Job_Level;
use App\Services\Umt\AuthService;
use App\Models\JDV;

class JobLevelController extends Controller
{
    protected $job_level;
    public function __construct()
    {
        $this->job_level = new Job_Level();
    }
    function saveJobLevel(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);

        if ($ss->status_code != 200) return JDV::raw($ss);
        $job_level = new Job_Level($req->id, $ss);
        $res = $job_level->save($req->all());
        return JDV::raw($res);
    }

    function getJobLevelList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code != 200) return JDV::raw($ss);
        $job_level = new Job_Level($req->id, $ss);
        $data = $job_level->getList($ss);
        return JDV::result($data);
    }
    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->job_level->getFormOptions($req->id, $ss));
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
        return JDV::result($this->job_level->getDetails($req->id, $ss));
    }
    public function deleteJobLevel(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->job_level->deleteJobLevel($req->id, $ss));
    }
    public function getJobLevelListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code != 200) return JDV::raw($ss);
        $job_level = new Job_Level($req->id, $ss);
        $data = $job_level->getJobLevelListPaginate($req->all(), $ss);
        return JDV::result($data);
    }
}
