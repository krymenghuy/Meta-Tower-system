<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaymentTransaction;

class TransactionController extends Controller
{
    protected $transactionModel;
    public function __construct() {
        $this->transactionModel = new PaymentTransaction();
    }

    function getTransactionList_merchant(Request $filter) { 
         $r = $this->transactionModel->getTransactionList_merchant($filter);
         if($r =='#350') 
           return makeJsonResponse($r,350); // user not authenticated
         else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

         return makeJsonResponse($r);
    }

    function getTransactionList_driver(Request $filter) { 
        $r = $this->transactionModel->getTransactionList_driver($filter);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

        return makeJsonResponse($r);
   }
    function receivePayment(Request $filter) { 
        $r = $this->transactionModel->receivePayment($filter);
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task

        return makeJsonResponse($r);
    }

          
        //Delete attachment or photo in trasnaction detail
        function deleteTransactionAttachment(Request $request){
            $r = $this->transactionModel->deleteTransactionAttachment($request); 
            if($r =='#350') 
            return makeJsonResponse($r,350); // user not authenticated
            else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
            return makeJsonResponse($r);
        }

       
        function saveTransactionPhoto(Request $reqest){
             //$d = {'user_class','trx_type','trx_id','file_type','photo_data'}
              $r = $this->transactionModel->savePhoto($reqest);
              if($r =='#350') 
                  return makeJsonResponse($r,350); // user not authenticated
              else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
              return makeJsonResponse($r);
          }

          function deleteTransactionPhoto(Request $request){
              //$d = {'trx_type','trx_id','user_class'}
              $r = $this->transactionModel->deleteTransactionPhoto($request); 
              if($r =='#350') 
                  return makeJsonResponse($r,350); // user not authenticated
              else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
              return makeJsonResponse($r);
            }

        //get transaction photo files. This method returns array [{trx_id,img_data}]
        function getTransactionAttachments(Request $reqest){
        $r = $this->transactionModel->deleteTransactionAttachment($request); 
        if($r =='#350') 
            return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
        }

        //Save Transaction photo (disbursement or receipt)   
        function saveTransactionAttachment(Request $request) {
            $r = $this->transactionModel->saveTransactionAttachment($request); 
            if($r =='#350') 
            return makeJsonResponse($r,350); // user not authenticated
            else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
            return makeJsonResponse($r);
        }

        function deletePayment(Request $request) {
            $r = $this->transactionModel->deletePayment($request);
            if($r =='#350') 
            return makeJsonResponse($r,350); // user not authenticated
            else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
            return makeJsonResponse($r);
          }
          
          function deleteTransaction(Request $request) {
            $r = $this->transactionModel->deleteTransaction($request);
            if($r =='#350') 
            return makeJsonResponse($r,350); // user not authenticated
            else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
            return makeJsonResponse($r);
          }
          
          function deleteCashDisbursement(Request $request) {
            $r = $this->transactionModel->deleteCashDisbursement($request);
            if($r =='#350') 
            return makeJsonResponse($r,350); // user not authenticated
            else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
            return makeJsonResponse($r);
          }
        
          function payToVendor(Request $request) {
            $r = $this->transactionModel->payToVendor($request);
            if($r =='#350') 
            return makeJsonResponse($r,350); // user not authenticated
            else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
            return makeJsonResponse($r);
          }
         
          //Receive multiple payments at once (example, receive two payments from driver. One by Cash, and the other by ABA bank)
          function receivePayments(Request $request) {
            $r = $this->transactionModel->receivePayments($request);
            if($r =='#350') 
            return makeJsonResponse($r,350); // user not authenticated
            else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
            return makeJsonResponse($r);
          }

          function getPaymentsToDriver(Request $request){
            $r = $this->transactionModel->getPaymentsToDriver($request);
            if($r =='#350') 
            return makeJsonResponse($r,350); //user not authenticated
            else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
            return makeJsonResponse($r);
          }
        
          function getPaymentsFromDriver(Request $request){
            $r = $this->transactionModel->getPaymentsFromDriver($request);
            if($r =='#350') 
            return makeJsonResponse($r,350); //user not authenticated
            else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
            return makeJsonResponse($r);
          }

}
