<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\BenefitDisbursePolicy;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class BenefitDisbursePolicyController extends Controller
{
    protected $bdp;

    public function __construct()
    {
        $this->bdp = new BenefitDisbursePolicy();
    }

    public function saveBenefitDisbursePolicy(Request $req)
    {
        $id = $req->benefit_disburse_policy_id ?? $req->id;
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $bdp = new BenefitDisbursePolicy($id, $ss);
        $res = $bdp->save($req->all());
        return JDV::raw($res);
    }

    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->bdp->getList($req, $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->bdp->getDetails($req->id));
    }

    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 281);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->bdp->delete($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->bdp->getFormOptions($req->id, $ss));
    }
}
