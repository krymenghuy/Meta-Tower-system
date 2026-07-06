<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Contracts;
use JDV;
use XAuthService;
use Illuminate\Http\Request;


class ContractsController extends Controller
{
    protected $contracts;
    public function saveContracts(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->contracts_id ?? $req->id;
        $contracts = new Contracts($id, $ss);
        $res = $contracts->saveContracts($req->all(),$id);
        return JDV::raw($res);

    }

    public function getListContracts(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $contracts = new Contracts();
        return JDV::result($contracts->getListContracts($req->all(),$ss));
    }

    public function contractsDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $contracts = new Contracts();
        return JDV::result($contracts->contractsDetails($req->id,$ss));
    }

    public function getListRenewals(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $contracts = new Contracts();
        return JDV::result($contracts->getListRenewalsPaginate($req->all(), $ss));
    }

    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $contracts = new Contracts();
        return JDV::result($contracts->getFormOptions($req->id,$ss));
    }

    public function deleteContracts(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->contracts_id;
        $contracts = new Contracts();
        $res = $contracts->deleteContracts($id);
        return JDV::raw($res);

    }


}

