<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Contract;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    protected  $contracts;


    public function __construct()
    {
        $this->contracts = new Contract();
    }
    public function saveContract(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->contract_id;
        $contract = new Contract($id, $ss);
        $res = $contract->saveContract($req->all());

        return JDV::raw($res);
    }
    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        // Apply contract unit updates for renewals whose start date is today (when renewal changed unit).
        Contract::applyPendingRenewalUnitChanges();

        return JDV::result($this->contracts->getListPaginate($req->all(), $ss));
    }

    public function getListRenewals(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->contracts->getListRenewalsPaginate($req->all(), $ss));
    }

    public function contractDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !== 200){
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        return JDV::result($this->contracts->contractDetails($req->id));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->contracts->getFormOptions($req->id,$ss));
    }

    public function deleteContract(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $res = $this->contracts->deleteContract($req->id);

        return JDV::raw($res);
    }

    public function terminateContract(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $res = $this->contracts->terminateContract($req->id, $ss);

        return JDV::raw($res);
    }

        public function renewContract(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->contract_id;
        $contract = new Contract($id, $ss);
        $res = $contract->renewContract($req->all());

        return JDV::raw($res);
    }
     function getTenantInfo(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::raw(Contract::getTenantInfo($req->all(),$ss));
    }
}
