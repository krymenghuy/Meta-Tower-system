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

    public function __construct(TaxAllowance $tax_allowance)
    {
        $this->tax_allowance = $tax_allowance;
    }

    public function saveTaxAllowance(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return $this->tax_allowance->save($req, $ss);
    }

    public function getTaxAllowanceListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->tax_allowance->getTaxAllowanceListPaginate($req, $ss));
    }

    public function listAll(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->tax_allowance->listAll($req, $ss));
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
        return JDV::result($this->tax_allowance->getDetails($req->id, $ss));
    }

    public function deleteTaxAllowance(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->tax_allowance->deleteTaxAllowance($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->tax_allowance->getFormOptions($req->id, $ss));
    }
}
