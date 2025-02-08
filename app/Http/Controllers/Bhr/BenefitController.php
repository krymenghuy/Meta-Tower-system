<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Benefit;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class BenefitController extends Controller
{
    protected $benefits;
    public function __construct()
    {
        $this->benefits = new Benefit();
    }
    function saveBenefit(Request $req)
    {
        $id = $req->benefit_id ?? $req->id;
        $prn_code = $id ? 270 : 271;
        $ss = AuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $benefit = new Benefit($id, $ss);
        $res = $benefit->save($req->all());
        return JDV::raw($res);
    }
    public function getBenefitPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->benefits->getBenefitPaginate($req->all(), $ss));
    }
    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->benefits->getDetails($req->id, $ss));
    }
    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->benefits->getFormOptions($req->id, $ss));
    }

    public function deleteBenefit(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 272);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->benefits->deleteBenefit($req->id);
        return JDV::raw($res);
    }


}
