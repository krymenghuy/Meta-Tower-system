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
        $res = $tenant->createTenant($req->all());
        return JDV::raw($res);
    }

    public function getListPaginate(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->tenants->getListPaginate($req->all(),$ss));
    }

    public function tenantDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->tenants->tenantDetails($req->id));
    }
    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->tenants->getFormOptions($req->id));
    }

    public function delete(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        $res = $this->tenants->delete($req->id);
        return JDV::raw($res);
    }

}
