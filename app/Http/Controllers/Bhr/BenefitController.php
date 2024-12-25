<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Benefit;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class BenefitController extends Controller
{
    protected $benefity_category;
    public function __construct()
    {
        $this->benefity_category = new Benefit();
    }
    function saveBenefit(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->benefit_id ?? $req->id;
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
        return JDV::result($this->benefity_category->getBenefitPaginate($req->all(), $ss));
    }
    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->benefity_category->getDetails($req->id, $ss));
    }
    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->benefity_category->getFormOptions($req->id, $ss));
    }

    public function deleteBenefit(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->benefity_category->deleteBenefit($req->id, $ss));
    }


}
