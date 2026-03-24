<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Service;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class ServiceController extends Controller
{
    protected $services;
    public function __construct(){
        $this->services = new Service();
    }

    public function saveService(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->service_id;
        $service = new Service($id, $ss);
        $res = $service->saveService($req->all());
        return JDV::raw($res);
    }


    public function getListPaginate(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);

        }
        return JDV::result($this->services->getListPaginate($req->all(),$ss));
    }

    public function serviceDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->services->serviceDetails($req->id));

    }

    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->services->getFormOptions($req->id,$ss));
    }

    public function deleteService(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        $res = $this->services->deleteService($req->id,$ss);
        return JDV::raw($res);
    }

    public function option_select_all_service_info(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $data = $req->json()->all();
        $id   = $data['service_id'] ?? $data['id'] ?? null;

        $id = (int) $id;
        return JDV::result(
            $this->services->getServiceInfo($id, $ss)
        );
    }
     public function updateServiceStatus(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        return JDV::raw($this->services->updateServiceStatus($req->status_id,$id,$ss));

    }



}


