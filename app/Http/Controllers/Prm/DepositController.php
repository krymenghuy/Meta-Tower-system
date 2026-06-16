<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Deposit;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class DepositController extends Controller
{
    protected $deposits;

    public function __construct()
    {
        $this->deposits = new Deposit();
    }

    public function saveDeposit(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->deposit_id ?? $req->contract_id;
        $deposit = new Deposit($id, $ss);
        $res = $deposit->saveDeposit($req->all());
        return JDV::raw($res);
    }

    public function getListDeposit(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->deposits->getListDeposit($req->all(), $ss));
    }

    public function depositDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->deposits->depositDetails($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->deposits->getFormOptions($req->id, $ss));
    }

    public function deleteDeposit(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::raw($this->deposits->deleteDeposit($req->id, $ss));
    }

    public function updateDepositStatus(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        return JDV::raw($this->deposits->updateDepositStatus($req->status_id, $id, $ss));
    }

    /*
    public function uploadDepositAttachment(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $deposit = new Deposit($req->id, $ss);
        return JDV::raw($deposit->uploadAttachment($req->all(), $req->id, $ss));
    }

    public function viewDepositAttachment(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $deposit = new Deposit($req->id, $ss);
        return JDV::raw($deposit->viewDepositAttachment($req->id, $ss));
    }

    public function deleteDepositAttachment(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }

        $deposit = new Deposit($req->id, $ss);
        return JDV::raw($deposit->deleteAttachment($req->id, $ss));
    }
    */
}
