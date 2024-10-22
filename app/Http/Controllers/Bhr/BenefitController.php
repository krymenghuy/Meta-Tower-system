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
        $id = $req->id ?? $req->benefit_id;
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $benefit = new Benefit($id, $ss);
        $res = $benefit->save($req->all());
        return JDV::raw($res);
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
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $id =$req->id;
        $benefit_type_id = $req->benefit_type_id;
       
        return JDV::result($this->benefitModel->getDetails($benefit_type_id,$id, $ss));
    }

    public function deleteBenefit(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->benefitModel->deleteBenefit($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->benefitModel->getFormOptions($req->id, $ss));
    }
}
