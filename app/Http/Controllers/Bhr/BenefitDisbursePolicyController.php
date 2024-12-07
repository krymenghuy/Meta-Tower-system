<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\BenefitDisbursePolicy;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class BenefitDisbursePolicyController extends Controller
{
    protected $bdp;

    public function __construct(BenefitDisbursePolicy $bdp)
    {
        $this->bdp = $bdp;
    }

    public function saveBenefitDisbursePolicy(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return $this->bdp->save($req, $ss);
    }

    public function getBenefitDisbursePolicyListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->bdp->getBenefitDisbursePolicyListPaginate($req, $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->bdp->getDetails($req->id, $ss));
    }

    public function deleteBenefitDisbursePolicy(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->bdp->deleteBenefitDisbursePolicy($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->bdp->getFormOptions($req->id, $ss));
    }
}
