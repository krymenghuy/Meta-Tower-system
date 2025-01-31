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
    public function bulkCreateAccounts(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->account_id ?? $req->id;
        $account = new Account($id, $ss);
        $res = $account->bulkCreateAccounts($req->account_type);
        return JDV::raw($res);
    }

    // public function saveMissingAccountWallet(Request $req)
    // {
    //     $ss = AuthService::verifyAuth($req, -1);
    //     if ($ss->status_code !== 200) {
    //         return JDV::raw($ss);
    //     }
    //     $id = $req->account_id ?? $req->id;
    //     $account = new Account($id, $ss);
    //     $res = $account->createAccountWalletMissing();
    //     return JDV::raw($res);
    // }

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
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->account->delete($req->id, $ss);
        return JDV::raw($res);
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id;
        return JDV::result($this->account->getFormOptions($id, $ss));
    }

    public function transfer(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $res = ($this->account->transfer($req->all(), $ss));
        return JDV::raw($res);
    }
    public function transferTo(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        $id = $req->id;
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $res = ($this->account->transferTo($req->all(),$id, $ss));
        return JDV::raw($res);
    }

    public function getAccountInfo(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $res = ($this->account->getAccountInfo($req->all(), $ss));
        return JDV::raw($res);
    }

    public function getConfirmTransfer(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $res = ($this->account->ConfirmTransfer($req->all(), $ss));
        return JDV::raw($res);
    }
    public function createTransactions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id;
        $res=($this->account->createTransaction($req->all(),true, $id, $ss));
        return JDV::raw($res);
    }
    public function printTransaction(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $res = ($this->account->printTransaction($req->all(), $ss));
        return JDV::raw($res);
    }
}
