<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bhr\StaffBenefit;
use App\Models\JDV;
use App\Services\Umt\AuthService;

class StaffBenefitController extends Controller
{
    protected $staffBenefitModel;
    public function __construct(StaffBenefit $staffBenefitModel)
    {
        $this->staffBenefitModel = $staffBenefitModel;
    }

    public function saveStaffBenefit(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->staff_benefit_id ?? $req->id;
        $staffBenefit = new StaffBenefit($id, $ss);
        $res = $staffBenefit->save($req->all());
        return JDV::raw($res);
    }

    public function getStaffBenefitListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->staffBenefitModel->getStaffBenefitListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->staffBenefitModel->getDetails($req->id, $ss));
    }

    public function deleteStaffBenefit(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->staffBenefitModel->delete($req->id, $ss));
    }

}
