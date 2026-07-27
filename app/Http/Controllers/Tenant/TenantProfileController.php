<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\TenantProfile;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class TenantProfileController extends Controller
{
    function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        return JDV::result(TenantProfile::details($ss));
    }

    function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        return JDV::result(TenantProfile::getFormOptions($ss));
    }

    function saveProfilePhoto(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $photo = $req->photo ?? $req->img;
        return JDV::raw(TenantProfile::savePhoto($photo, $ss));
    }

    function deleteProfilePhoto(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        return JDV::raw(TenantProfile::deletePhoto($ss));
    }
}
