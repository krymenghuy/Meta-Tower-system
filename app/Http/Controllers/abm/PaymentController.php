<?php

namespace App\Http\Controllers\Abm;

use App\Http\Controllers\Controller;
use App\Models\Abm\Payment;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
class PaymentController extends Controller
{
    protected $payment = null;
    function __construct(){
        $this->payment = new Payment();
    }
    function save(Request $req){

        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return JDV::raw($ss);
        $id = $req->id;
        $save = $this->payment->save($req->all(),$id,$ss);    
        return JDV::raw($save);
    }
    function saveMany(Request $req){

        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return JDV::raw($ss);
        $id = $req->id;
        $save = $this->payment->saveMany($req->all(),$id,$ss);    
        return JDV::raw($save);
    }

    function details(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $this->payment->detailsForPayment($req->all(),$ss);
        return JDV::result($data);
    }
    function delete(Request $req)
    {
        $ss = UM::getUserInfoByToken($req, -1);
        if ($ss->status_code !== 200)
            return JDV::raw($ss);
        $id = $req->id;
        $payment = new Ospayment();
        $delete = $payment->delete($id);
        return JDV::raw($delete);
    }

    function getSuplierListPaginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $this->payment->getSuplierListPaginate($req->all(),$ss);
        
        return JDV::result($data);
    }


    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss);
         $id = $req->id?$req->id:$req->sender_id;  
         $data = $this->payment->getFormOptions($id,$ss); 
         return JDV::result($data);
     }

    function updatePaymentStatus(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
        $id = $req->id?$req->id:$req->sender_id;
        $payment = new Ospayment($id,$ss);
        $res = $payment->updateStatus($req->status_code,$id);
        return JDV::raw($res);
    }

    
}
