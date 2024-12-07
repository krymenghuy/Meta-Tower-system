<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\BenefitDisbursement;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class BenefitDisbursementController extends Controller
{
    protected $benefitDisubrsementModel;
    public function __construct(BenefitDisbursement $benefit_disbursement)
    {
        $this->benefitDisubrsementModel = $benefit_disbursement;
    }

    public function saveBenefitDisbursement(Request $req)
    {
        $id = $req->emp_id ?? $req->id;
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = $this->benefitDisubrsementModel->save($req->benefit_type_id, $id, $ss, $req->all());
        return JDV::raw($res);
    }

    public function getBenefitDisbursementListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        return JDV::result($this->benefitDisubrsementModel->getBenefitDisbursementListPaginate($req->all(), $ss));
    }
    public function getBenefitDisbursementList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $war = new BenefitDisbursement();
        return JDV::result($war->getBenefitDisbursementList($req->all(), $ss));
    }
    public function getDetails(Request $req)
    {
        $id = $req->id;
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        // $benefit_disbursement_type_id = $req->id;

        return JDV::result($this->benefitDisubrsementModel->getDetails($id, $ss));
    }

    public function deleteBenefitDisbursement(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        $id = $req->id ?: null;
        // $as = $req->as;

        return JDV::result($this->benefitDisubrsementModel->deleteBenefitDisbursement($id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id;
        return JDV::result($this->benefitDisubrsementModel->getFormOptions($id, $ss));
    }
}
