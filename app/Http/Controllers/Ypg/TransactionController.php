<?php

namespace App\Http\Controllers\Ypg;

use App\Http\Controllers\Controller;
use App\Models\Ypg\Transaction;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
     
    public function getList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $trx = new Transaction(); 
        $data = $trx->getList($req->all(), $ss);
        return JDV::result($data);
    }

    public function getDetails(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->trx_id;
        $trx = new Transaction($id, $ss); 
        $data = $trx->getDetails();
        return JDV::result($data);
    }

    public function deleteTransaction(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->trx_id;
        $trx = new Transaction($id, $ss); 
        $res = $trx->delete();
        return JDV::raw($res);
        ////return JDV::result($this->transaction->deleteTransaction($req->id, $ss)); DO NOT use JDV::result() for DELETE, UPDATE
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $trx = new Transaction(null, $ss); 
        return JDV::result($trx->getFormOptions($req->id, $ss));
    }
}
