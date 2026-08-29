<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mhr\EmployeeBenefit;

use JDV;
use XAuthService;

class EmployeeBenefitController extends Controller
{
    protected $empBenefit;

    public function __construct(){
        $this->empBenefit = new EmployeeBenefit();
    }
    function saveBenefit(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->emp_benefit_id ?? $req->id;

        $emp_benefit = new EmployeeBenefit($id, $ss);
        $res = $emp_benefit->upsert($req->all());
        return JDV::raw($res);
    }
    public function getAllBenefitList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        return JDV::result($this->empBenefit->getAllBenefitList($req->all(),$ss));
    }
    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
         if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->empBenefit->getDetails($req->id, $ss));
    }

    public function deleteBenefit(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->empBenefit->deleteBenefit($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        return JDV::result($this->empBenefit->getFormOptions($req->id, $ss));
    }
    public function import(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $res = $this->empBenefit->importBenefits($req->all(), $ss);
        return JDV::raw($res);
    }
}
