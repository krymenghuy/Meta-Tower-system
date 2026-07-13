<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mhr\Benefit;

use JDV;
use XAuthService;

class BenefitController extends Controller
{
   protected $benefits;
    public function __construct()
    {
        $this->benefits = new Benefit();
    }
    function saveBenefit(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->benefit_id ?? $req->id;
        $benefit = new Benefit($id, $ss);
        $res = $benefit->upsert($req->all());
        return JDV::raw($res);
    }
    public function getBenefitPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->benefits->getBenefitPaginate($req->all(), $ss));
    }
    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->benefits->getDetails($req->id));
    }
    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->benefits->getFormOptions($req->id, $ss));
    }

    public function deleteBenefit(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
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
