<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\TaxAllowance;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;


class TaxAllowanceController extends Controller
{
    protected $tax_allowance;

    public function __construct()
    {
        $this->tax_allowance = new TaxAllowance();
    }

    public function saveTaxAllowance(Request $req)
    {
        $id = $req->id ?? $req->allowance_id;
        $prn_code = $id ? 490 : 491;
        $ss = AuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return $this->tax_allowance->save($req->all(),$id, $ss);
    }

    public function getList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->tax_allowance->getList($req->all(), $ss));
    }

    public function listAll(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->tax_allowance->getlistAll($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->allowance_id;
        return JDV::result($this->tax_allowance->getDetails($id, $ss));
    }

    public function deleteTaxAllowance(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 492);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->allowance_id;
        $res = $this->tax_allowance->delete($id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->allowance_id; 
        return JDV::result($this->tax_allowance->getFormOptions($id, $ss));
    }
}
