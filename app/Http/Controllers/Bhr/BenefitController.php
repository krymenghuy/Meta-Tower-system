<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Benefit;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;
class BenefitController extends Controller
{
    protected $benefitModel;
    public function __construct(Benefit $benefit)
    {
        $this->benefitModel = $benefit;
    }

    public function saveBenefit(Request $req)
    {
        $id = $req->id;
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = $this->benefitModel->save($req->all(),$id,$ss);
        return JDV::raw($res);
    }

    public function getAllBenefitList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        return JDV::result($this->benefitModel->getAllBenefitsList($req->all(),$ss));
    }
    public function getBonusList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        return JDV::result($this->benefitModel->getBonusList($req->all(),$ss));
    }

    public function getSeniorityList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        return JDV::result($this->benefitModel->getSeniorityList($req->all(), $ss));
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

        $id = $req->id ? :null;
        $as = $req->as;
       
        return JDV::result($this->benefitModel->deleteBenefit($id,$as, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id;
        return JDV::result($this->benefitModel->getFormOptions($id, $ss));
    }
}
