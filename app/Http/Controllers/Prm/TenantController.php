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
        $res = $tenant->createTenant($req->all(),$id,$ss);
        return JDV::raw($res);
    }

    public function getListPaginate(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->tenants->getListPaginate($req->all(),$ss));
    }

    public function getDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->tenants->getDetails($req->id));
    }
    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->tenants->getFormOptions($req->id,$ss));
    }

    public function delete(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        $res = $this->tenants->delete($req->id,$ss);
        return JDV::raw($res);
    }

    function getProfilePhoto(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        $id = $req->tenant_id ?? $req->id;
        $img = Tenant::profilePicture($id,$ss);
        return JDV::result($img);
    }
    function createProfilePhoto(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->tenant_id ?? $req->id;
        $photo = $req->photo ?? $req->img;
        $res = Tenant::saveProfilePicture($photo,null,$id,$ss);
        return JDV::raw($res);
    }
     function deleteProfilePhoto(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->employee_id ?? $req->id;
        $emp = new Tenant($id, $ss);
        $res = $emp->deleteProfilePicture($id);
        return JDV::raw($res);
    }

     public function getLeaseHistory(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        $id = $req->tenant_id ?? $req->id;
        if (!isset($id) || !is_numeric($id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->tenants->getLeaseHistory($id,$ss));
    }
    public function options_active_space(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
         $id = $req->tenant_id ?? $req->id;
        return JDV::result($this->tenants->getActiveSpaces($id,$ss));
    }

        public function option_select_all_tenant_info(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
         $id = $req->tenant_id ?? $req->id;
        return JDV::result($this->tenants->getTenantInfo($id,$ss));
    }

  public function option_select_all_tenant_info_service(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }
        $id = $req->tenant_id ?? $req->id;
        return JDV::result($this->tenants->getTenantWithSpacesAndServiceRequest($id,$ss));
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

        $tenantModel = new Tenant($tenant_id, $ss);
        $result = $tenantModel->getTenantWithSpacesAndMonths();
        return JDV::result($result);
    }
      function getList(Request $req){
        $ss = XAuthService::verifyAuth($req,278);
        if($ss->status_code != 200) return $ss;
        $list = new Tenant();
        return JDV::result($list->getList($req->all(),$ss));
    }
       public function contractFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id;
        $director_id = $req->director_id;
        $data = new Tenant();

        return JDV::result($data->contractFormOptions($id, $director_id, $ss));
    }

}
