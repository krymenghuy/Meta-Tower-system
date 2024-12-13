<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Transaction;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
   protected $transaction;

    public function __construct()
    {
        $this->transaction = new Transaction();
    }

    public function saveTransaction(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return $this->transaction->save($req, $ss);
    }

    public function getTransactionListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->transaction->getTransactionListPaginate($req, $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->transaction->getDetails($req->id, $ss));
    }

    public function deleteTransaction(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->transaction->deleteTransaction($req->id, $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->transaction->getFormOptions($req->id, $ss));
    }
}
