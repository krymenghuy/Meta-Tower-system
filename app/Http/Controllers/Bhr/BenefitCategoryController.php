<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\BenefitCategory;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class BenefitCategoryController extends Controller
{
    protected $benefity_category;
    public function __construct(BenefitCategory $benefity_category)
    {
        $this->benefity_category = $benefity_category;
    }
    function
    saveBenefitCategory(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);
        $res = $this->benefity_category->save($req->benefit_type_id, $ss, $req->all());
        return JDV::raw($res);
    }
    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->benefity_category->getFormOptions($req->id, $ss));
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
    public function deleteBenefitCategory(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->benefity_category->deleteBenefitCategory($req->id, $ss));
    }
    public function getBenefitCategoryListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code != 200) return JDV::raw($ss);
        $benefity_category = new BenefitCategory($req->id, $ss);
        $data = $benefity_category->getBenefitCategoryListPaginate($req->all(), $ss);
        return JDV::result($data);
    }
    public function getBenefitCategoryList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $war = new BenefitCategory();
        return JDV::result($war->getBenefitCategoryList($req->all(), $ss));
    }
}
