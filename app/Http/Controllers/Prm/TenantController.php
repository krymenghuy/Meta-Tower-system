<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Tenant;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    protected $tenants;
    public function __construct(){
        $this->tenants = new Tenant();
    }

    public function createTenant(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->tenant_id;
        $tenant = new Tenant($id,$ss);
        $create_tenant = $tenant->createTenant($req->all());
        return JDV::raw($create_tenant);
    }
}
