<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use App\Models\Mhr\TaxBracket;
use JDV;
use XAuthService;

use Illuminate\Http\Request;

class TaxBracketController extends Controller
{
    protected $taxBracket;

    public function __construct()
    {
        $this->taxBracket = new TaxBracket();
    }

    public function saveTaxBracket(Request $req)
    {
        $id = $req->id ?? $req->id;
        $prn_code = $id ? 253: 254;
        $ss = XAuthService::verifyAuth($req, $prn_code);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $tax = new TaxBracket($id,$ss);
        $res = $tax->save($req->all());

        return JDV::raw($res);
    }

    public function getTaxBracketListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->taxBracket->getTaxBracketListPaginate($req, $ss));
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
        return JDV::result($this->taxBracket->getDetails($req->id, $ss));
    }

    public function deleteTaxBracket(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, 255);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $res = $this->taxBracket->delete($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->taxBracket->getFormOptions($req->id, $ss));
    }
}
