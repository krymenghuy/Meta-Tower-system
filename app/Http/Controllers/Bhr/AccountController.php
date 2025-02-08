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
        $ss = AuthService::verifyAuth($req, 315);
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
        $ss = AuthService::verifyAuth($req, 210);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->account_id ?? $req->id;
        $account = new Account($id, $ss);
        $res = $account->bulkCreateAccounts($req->account_type);
        return JDV::raw($res);
    }


    public function getPayrollAccountList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $req['account_type'] = 'Payroll';
        return JDV::result($this->account->getList($req->all(), $ss));
    }

    public function getWalletAccountList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $req['account_type'] = 'Wallet';
        return JDV::result($this->account->getList($req->all(), $ss));
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
        return JDV::result($this->account->getDetails($req->id));
    }

    public function deleteAccount(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 212);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        $res = $this->account->delete($req->id);
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
    public function deposit(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 326);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->accuont_id;
        $amount = $req->amount;
        $currency_code = $req->currency_code;
        $remarks = $req->remarks;
        $account_number = $req->account_number;
        $account_name = $req->account_name;
        // function deposit($amount, $currency_code, $account_number, $account_name, $remarks, $id = null, $ss)
        $res = ($this->account->deposit($amount, $currency_code, $account_number, $account_name, $remarks, $id, $ss));
        return JDV::raw($res);
    }
    public function withdraw(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->accuont_id;
        $amount = $req->amount;
        $currency = $req->currency_code;
        $remarks = $req->remarks;

        $res = ($this->account->withdraw($amount, $currency, $remarks, $id, $ss));
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
        return ($this->account->confirmTransfer($req->all(), $ss));
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

    function getFormOptions_deposit(Request $req){
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $acc = new Account();
        $id =$req->id ?? $req->account_id;
        $data =  $acc->getFormOptions_deposit($id,$ss);
        return JDV::result($data);
    }


}
