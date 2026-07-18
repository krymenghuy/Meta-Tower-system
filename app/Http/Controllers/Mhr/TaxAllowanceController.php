<?php

namespace App\Http\Controllers\Mhr;

use App\Models\Mhr\TaxAllowance;
use JDV;
use XAuthService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TaxAllowanceController extends Controller
{
    protected $taxAllowanceModel;

    public function __construct()
    {
        $this->taxAllowanceModel = new TaxAllowance();
    }

    public function saveTaxAllowance(Request $req)
    {
        $id = $req->id ?? null;
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $taxAllowance = new TaxAllowance($id, $ss);
        $res = $taxAllowance->save($req->all());
        return JDV::raw($res);
    }

    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->taxAllowanceModel->getList($req->all(), $ss));
    }

    public function listAll(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->taxAllowanceModel->listAll($req->all(), $ss));
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
        return JDV::result($this->taxAllowanceModel->getDetails($req->id, $ss));
    }

    public function deleteTaxAllowance(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->taxAllowanceModel->delete($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->taxAllowanceModel->getFormOptions($req->id, $ss));
    }
}
