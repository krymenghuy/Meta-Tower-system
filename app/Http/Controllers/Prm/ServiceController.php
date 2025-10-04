<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Model\Prm\Service;
use JDV;
use XAuthService;

class ServiceController extends Controller
{
    protected $services;
    public function __contruct(){
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
            return JDV::error('Invalid Id');
        }
        return JDV::result($this->services->serviceDetails($req->id));

    }

    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
    }
}
