<?php

namespace App\Http\Controllers\Ypg;

use App\Http\Controllers\Controller;
use App\Models\Ypg\DeceasedRegistration;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class DeceasedRegistrationController extends Controller
{
    public function save(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->deceased_registration_id ?? $req->id;
        $deceasedRegistration = new DeceasedRegistration($id, $ss);
        $res = $deceasedRegistration->save($req->all());
        return JDV::raw($res);
    }

    public function getlist(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $deceasedRegistration = new DeceasedRegistration();
        return JDV::result($deceasedRegistration->getList($req->all(), $ss));
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
        $deceasedRegistration = new DeceasedRegistration();
        return JDV::result($deceasedRegistration->getDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $deceasedRegistration = new DeceasedRegistration();
        return JDV::result($deceasedRegistration->getFormOptions($req->id, $ss));
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $deceasedRegistration = new DeceasedRegistration();
        $res = $deceasedRegistration->delete($id);
        return JDV::raw($res);
    }
}
