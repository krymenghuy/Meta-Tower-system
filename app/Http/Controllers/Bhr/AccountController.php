<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Account;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    protected $account;
    public function __construct()
    {
        $this->account = new Account();
    }

    public function saveAccount(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->account_id ?? $req->id;
        $account = new Account($id, $ss);
        $res = $account->save($req->all());
        return JDV::raw($res);
    }

    public function getPayrollAccountListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->account->PayrollList($req->all(), $ss));
    }

    public function getWalletAccountListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->account->WalletList($req->all(), $ss));
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
        return JDV::result($this->account->getDetails($req->id, $ss));
    }

    public function deleteAccount(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->account->delete($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->account->getFormOptions($req->id, $ss));
    }

    public function transfer(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return ($this->account->transfer($req->all(), $ss));
    }

    public function getAccountInfo(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return ($this->account->getAccountInfo($req->all(), $ss));
    }
}
