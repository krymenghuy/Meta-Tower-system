<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\EmployeeBenefit;
use JDV;
use XAuthService;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
class EmployeeBenefitController extends Controller
{
    protected $benefitModel;
    public function __construct()
    {
        $this->benefitModel = new EmployeeBenefit();
    }
    function saveBenefit(Request $req)
    {
        $id = $req->emp_benefit_id ?? $req->id;
        $prn_code = $id ? 273 : 274;
        $ss = XAuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $emp_benefit = new EmployeeBenefit($id, $ss);
        $res = $emp_benefit->save($req->all());
        return JDV::raw($res);
    }
    public function getAllBenefitList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        return JDV::result($this->benefitModel->getAllBenefitList($req->all(),$ss));
    }
    public function getDetails(Request $req)
    {
        $id =$req->id;
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        // $benefit_type_id = $req->id;

        return JDV::result($this->benefitModel->getDetails($id, $ss));
    }

    public function deleteBenefit(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 275);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->benefitModel->deleteBenefit($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id;
        return JDV::result($this->benefitModel->getFormOptions($id, $ss));
    }
    public function import(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 325);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $res = $this->benefitModel->importBenefits($req->all(), $ss);
        return JDV::raw($res);
    }
    
    
}
