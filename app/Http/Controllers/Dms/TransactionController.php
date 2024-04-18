<?php

namespace App\Http\Controllers\Dms;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dms\PaymentTransaction;
use App\Models\Dms\UM;
use App\Models\Dms\JDV;

class TransactionController extends Controller
{
    protected $transactionModel;
    public function __construct() {
        $this->transactionModel = new PaymentTransaction();
    }
     
   function getOutstandingPayments_merchant(Request $req){
      $ss = UM::getUserInfoBytoken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss); 
      $trx = new PaymentTransaction(null,$ss);
      $id = $req->sender_id?$req->sender_id:$req->id;
      $data = $trx->getOutstandingPayments_merchant($req->all(),$id,$ss);
      return JDV::result($data);
   }
   
        //Delete attachment or photo in trasnaction detail
        function deleteTransactionAttachment(Request $request){
            $r = $this->transactionModel->deleteTransactionAttachment($request); 
            if($r =='#350') 
            return makeJsonResponse($r,350); // user not authenticated
            else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
            return makeJsonResponse($r);
        }
        
        
        function authorizePayments_driver(Request $req){
          $ss = UM::getUserInfoByToken($req,274);
          if($ss->status_code !==200) return JDV::raw($ss); 
           $pmt = new PaymentTransaction(null,$ss);
           $res = $pmt->authorizePayments_driver($req->all(),$ss);
           return JDV::raw($res); 
        }

        function authorizePayment_driver(Request $req){
          $ss = UM::getUserInfoByToken($req,274);
          if($ss->status_code !==200) return JDV::raw($ss); 
           $pmt = new PaymentTransaction(null,$ss);
           $res = $pmt->authorizePayment_driver($req->trx_id,$req->trx_type,$ss);
           return JDV::raw($res); 
        }

        function deleteTransaction(Request $req){
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !==200) return JDV::raw($ss); 
           //$arr = {'trx_type' => 'receipt|disbursement','trx_id'}
           $pmt = new PaymentTransaction(null,$ss);
           $res = $pmt->deleteTransaction($req->all(),$ss);
           return JDV::raw($res); 
        }

        function getPaymentFormOptions(Request $req){
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !==200) return JDV::raw($ss);         
           $data = PaymentTransaction::paymentFormOptions(null,$ss);
           return JDV::result($data); 
        }

        //@params = {'trx_type',trx_id,user_class} 
        function saveTransactionPhoto(Request $req){
            $ss = UM::getUserInfoByToken($req,-1);
            if($ss->status_code !==200) return JDV::raw($ss); 
             //$d = {'user_class','trx_type','trx_id','file_type','photo_data'}
             $id = $req->id?$req->id:$req->trx_id;
             $pmt = new PaymentTransaction($id,$ss);
             $res = $pmt->savePhoto($req->all());
             return JDV::raw($res); 
          }

          function deleteTransactionPhoto(Request $req){
            $ss = UM::getUserInfoByToken($req,-1);
            if($ss->status_code !==200) return JDV::raw($ss); 
              //$d = {'trx_type','trx_id','user_class'}
              $id = $req->id?$req->id:$req->trx_id;
              $res = $this->transactionModel->deletePhoto($id); 
              return JDV::raw($res);
          }

        function receivePayment(Request $req){
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !==200) return JDV::raw($ss); 
            $pmt = new PaymentTransaction(null,$ss);
            /** {"agent_id","agent_type","trx_type":"Receipt"} */
            $res = $pmt->receivePayment($req->all(),$ss);
            return JDV::raw($res);
        }
 
        function makePayment(Request $req){
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !==200) return JDV::raw($ss); 
          $pmt = new PaymentTransaction(null,$ss);
          $res = $pmt->makePayment($req->all(),$ss);
          return JDV::raw($res);
        }
 
        function settleZero_driver(Request $req){
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !==200) return JDV::raw($ss); 
           $pmt = new PaymentTransaction(null,$ss);
          $res = $pmt->settleZero_driver($req->all(),$ss);
           return JDV::raw($res);
        }
        
        function settleZero_sender(Request $req){
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !==200) return JDV::raw($ss); 
           $pmt = new PaymentTransaction(null,$ss);
            $res = $pmt->settleZero_sender($req->all(),$ss);
            return JDV::raw($res);
        }

        function deletePayment(Request $req) {
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !==200) return JDV::raw($ss); 
          $res = $this->transactionModel->deletePayment($req->all());
           return JDV::raw($res); 
          }
           
          function deleteCashDisbursement(Request $request) {
            $r = $this->transactionModel->deleteCashDisbursement($request);
            if($r =='#350') 
            return makeJsonResponse($r,350); // user not authenticated
            else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
            return makeJsonResponse($r);
          }
        
         
          function getTransactions_driver(Request $req){
            $ss = UM::getUserInfoByToken($req,-1);
            if($ss->status_code !==200) return JDV::raw($ss); 
            $pmt = new PaymentTransaction(null,$ss);
            $data = $pmt->getTransactions_driver($req->all(),$ss);
            return JDV::result($data);
         }
         function getTransactions_merchant(Request $req){
          $ss = UM::getUserInfoByToken($req,-1);
          if($ss->status_code !==200) return JDV::raw($ss); 
          $pmt = new PaymentTransaction(null,$ss);
          $data = $pmt->getTransactions_merchant($req->all(),$ss);
          return JDV::result($data);
         }
         
}
