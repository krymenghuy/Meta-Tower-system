<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\BillPayment;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class BillPaymentController extends Controller
{
    protected $billPayment;

    public function __construct()
    {
        $this->billPayment = new BillPayment();
    }

    public function savePayment(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        $id           = $req->id ?? null;
        $bill_payment = new BillPayment($id, $ss);
        return JDV::raw($bill_payment->savePayment($req->all(), $id, $ss));
    }

    public function getListPaginate(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        $payment = new BillPayment(null, $ss);
        return JDV::result($payment->getListPaginate($req->all(), $ss));
    }

    public function getFormOptions(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        $bill_id = $req->bill_id ?? $req->id ?? null;
        return JDV::result(BillPayment::getFormOptions($bill_id, $ss));
    }

    public function deletePayment(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid payment ID.');
        }

        $payment = new BillPayment(null, $ss);
        return JDV::raw($payment->deletePayment($req->id, $ss));
    }

    public function cancelPayment(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) return JDV::raw($ss);

        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid payment ID.');
        }

        $d = (object)[
            'id'  => $req->id,
            'note' => $req->note ?? null ,
        ];

        $x = new BillPayment(null, $ss);
        return JDV::raw($x->cancelPayment($d, $ss));
    }
}