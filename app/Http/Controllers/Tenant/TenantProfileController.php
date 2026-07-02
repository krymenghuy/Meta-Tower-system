<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\TenantProfile;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class TenantProfileController extends Controller
{
    protected $tenants;
    public function __construct()
    {
        $this->tenants = new TenantProfile();
    }

    public function createTenant(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->tenant_id;
        $tenant = new TenantProfile($id, $ss);
        $res = $tenant->createTenant($req->all(), $id, $ss);
        return JDV::raw($res);
    }

    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->tenants->getListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $ss->official_id ?? null;
        if (!isset($id) || !is_numeric($id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->tenants->getDetails($id, $ss));
    }
    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->tenants->getFormOptions($req->id, $ss));
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
        $res = $this->tenants->delete($req->id, $ss);
        return JDV::raw($res);
    }

    function getProfilePhoto(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->tenant_id ?? $req->id;
        $img = TenantProfile::profilePicture($id, $ss);
        return JDV::result($img);
    }
    function createProfilePhoto(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->tenant_id ?? $req->id;
        $photo = $req->photo ?? $req->img;
        $res = TenantProfile::createProfilePicture($photo, null, $id, $ss);
        return JDV::raw($res);
    }
    function deleteProfilePhoto(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->tenant_id ?? $req->id;
        $emp = new TenantProfile($id, $ss);
        $res = $emp->deleteProfilePicture($id);
        return JDV::raw($res);
    }

    public function getLeaseHistory(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->tenant_id ?? $req->id;
        if (!isset($id) || !is_numeric($id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->tenants->getLeaseHistory($id, $ss));
    }
    public function options_active_space(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->tenant_id ?? $req->id;
        return JDV::result($this->tenants->getActiveSpaces($id, $ss));
    }

    public function option_select_all_tenant_info(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->tenant_id ?? $req->id;
        return JDV::result($this->tenants->getTenantInfo($id, $ss));
    }

    public function option_select_all_tenant_info_service(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->tenant_id ?? $req->id;
        return JDV::result($this->tenants->getTenantWithSpacesAndServiceRequest($id, $ss));
    }

    public function getTenantOptionsWithSpacesAndMonths(Request $request)
    {
        $ss = XAuthService::verifyAuth($request, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $tenant_id = $request->input('tenant_id')
            ?? $request->json('tenant_id')
            ?? $request->input('id')
            ?? null;

        $tenantModel = new TenantProfile($tenant_id, $ss);
        $result = $tenantModel->getTenantWithSpacesAndMonths();
        return JDV::result($result);
    }
}
