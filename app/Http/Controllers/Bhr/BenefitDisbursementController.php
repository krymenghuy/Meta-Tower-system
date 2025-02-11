<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\BenefitDisbursement;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class BenefitDisbursementController extends Controller
{
    protected $benefitDisubrsement;
    public function __construct()
    {
        $this->benefitDisubrsement = new BenefitDisbursement();
    }

    public function saveBenefitDisbursement(Request $req)
    {
        $id = $req->emp_id ?? $req->id;
        $prn_code = $id ? 276 : 277;
        $ss = XAuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = $this->benefitDisubrsement->save($req->benefit_id,$ss, $req->all());
        return JDV::raw($res);
    }

    public function getBenefitDisbursementListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        return JDV::result($this->benefitDisubrsement->getBenefitDisbursementListPaginate($req->all(), $ss));
    }
    public function getBenefitDisbursementList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $war = new BenefitDisbursement();
        return JDV::result($war->getBenefitDisbursementList($req->all(), $ss));
    }
    public function getDetails(Request $req)
    {
        $id = $req->id;
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        // $benefit_disbursement_type_id = $req->id;

        return JDV::result($this->benefitDisubrsement->getDetails($id, $ss));
    }

    public function deleteBenefitDisbursement(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 278);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->benefitDisubrsement->deleteBenefitDisbursement($req->id);
        return JDV::raw($res);

    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id;
        return JDV::result($this->benefitDisubrsement->getFormOptions($id, $ss));
    }
}
