<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\JDV;
use App\Models\Bhr\Organization;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    protected $organizations;
    public function __construct()
    {
        $this->organizations = new Organization();
    }
    function save(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = $this->organizations->save($req->organization, $ss, $req->all());
        return JDV::raw($res);
    }
    public function getList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->organizations->getList($req->all(), $ss));
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
        return JDV::result($this->organizations->getDetails($req->id, $ss));
    }
    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->organizations->getFormOptions($req->id, $ss));
    }

    public function delete(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->organizations->delete($req->id, $ss);
        return JDV::raw($res);
    }
    public function getOrganization(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $school = new Organization();
        return JDV::result($school->getOrganizaiton($req->all(), $ss));
    }
}
