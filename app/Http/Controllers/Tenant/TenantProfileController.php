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
}
