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

   
}
