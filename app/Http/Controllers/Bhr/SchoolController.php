<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\School;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    protected $schools;
    public function __construct()
    {
        $this->schools = new School();
    }
    function save(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 496);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = $this->schools->save($req->school, $ss, $req->all());
        return JDV::raw($res);
    }
    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->schools->getList($req->all(), $ss));
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
        return JDV::result($this->schools->getDetails($req->id));
    }
    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->schools->getFormOptions($req->id));
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
        $res = $this->schools->delete($req->id);
        return JDV::raw($res);
    }
    public function schoolList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $school = new School();
        return JDV::result($school->getSchoolList($req->all(), $ss));
    }
}
