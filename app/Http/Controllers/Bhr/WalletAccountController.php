<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\WalletAccount;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class WalletAccountController extends Controller
{
    protected $walletAccount;

    public function __construct(WalletAccount $walletAccount)
    {
        $this->walletAccount = $walletAccount;
    }

    public function saveWalletAccount(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->account_id ?? $req->id;
        $walletAccount = new WalletAccount($id, $ss);
        $res = $walletAccount->save($req->all());
        return JDV::raw($res);
    }

    public function getWalletAccountListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->walletAccount->getWalletAccountListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->walletAccount->getDetails($req->all(), $ss));
    }

    public function deleteWalletAccount(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->walletAccount->deleteWalletAccount($req->all(), $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->walletAccount->getFormOptions($req->all(), $ss));
    }
}
