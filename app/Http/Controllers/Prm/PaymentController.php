<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Payment;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected  $payments;

    public function __construct()
    {
        $this->payments = new Payment();
    }
    
    public function savePayment(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);  
        }
        $id = $req->id ?? $req->payment_id;
        $payment = new Payment($id,$ss);
        $res = $payment->savePayment($req->all());
        return JDV::raw($res);
    }

    public function getListPayment(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->payments->getListPayment($req->all(),$ss));
    }

    public function paymentDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->payments->paymentDetails($req->id));
    }

    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }

        return JDV::result($this->payments->getFormOptions($req->id,$ss));
    }

    public function deletePayment(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numberic($req->id)){
            return JDV::error('Invalid ID');
        }
        $res = $this->payments->deletePayment($req->id);
        return JDV::raw($res);
    }

     public function updatePaymentStatus(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $payment = new Payment();
        $res = $payment->updatePaymentStatus($req->status_id, $id,$ss);
        return JDV::raw($res);
    }
}

