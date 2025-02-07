<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\EmployeeBenefit;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;
class EmployeeBenefitController extends Controller
{
    protected $benefitModel;
    public function __construct()
    {
        $this->benefitModel = new EmployeeBenefit();
    }
    function saveBenefit(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->emp_benefit_id ?? $req->id;
        $emp_benefit = new EmployeeBenefit($id, $ss);
        $res = $emp_benefit->save($req->all());
        return JDV::raw($res);
    }
    public function getAllBenefitList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        return JDV::result($this->benefitModel->getAllBenefitList($req->all(),$ss));
    }
    public function getDetails(Request $req)
    {
        $id =$req->id;
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        // $benefit_type_id = $req->id;

        return JDV::result($this->benefitModel->getDetails($id, $ss));
    }

    public function deleteBenefit(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->benefitModel->deleteBenefit($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id;
        return JDV::result($this->benefitModel->getFormOptions($id, $ss));
    }

    // public function importBenefit(Request $req)
    // {
    //     $ss = AuthService::verifyAuth($req, -1);
    //     if ($ss->status_code !== 200) return JDV::raw($ss);
    //     $res = $this->benefitModel->importBenefit($req->all(), $ss);
    //     return JDV::raw($res);
    // }
}
