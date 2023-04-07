<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
use App\Models\Invoice\Invoice;
use App\Models\Invoice\Payment;

class InvoiceController extends Controller
{
    
    function getInvoiceList(Request $req){
      $ss= UM::getUserInfoBytoken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      return JDV::result(Invoice::list($req->all(),$ss));
    }

    function deleteInvoice(Request $req){
        $ss= UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $invoice = new Invoice($req->id,$ss);
        return JDV::raw($invoice->delete());
    }

    function getInvoiceDetails(Request $req){
        $ss= UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        //$invoice = new Invoice($req->id?$req->id:$req->invoice_id,$ss);
        return JDV::result(Invoice::Details($req->id,$ss));
    }

    function createInvoice(Request $req){
        $ss= UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $invoice = new Invoice(null,$ss);
        $res = $invoice->create($req->all());
        //$res = Invoice::createInvoice($ss,$req->all());
        if($res->status_code ===200) return JDV::success(['item_count'=>$res->item_count,'invoice_id'=>$res->invoice_id,'ref_number'=>$res->ref_number]);
        else return JDV::error($res->error_message);
    }

    function updateInvoice(Request $req){
        $ss= UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $invoice = new Invoice(null,$ss);
        $res = $invoice->update($req->all());
        //$res = Invoice::createInvoice($ss,$req->all());
        if($res->status_code ===200) return JDV::success(['item_count'=>$res->item_count,'invoice_id'=>$res->invoice_id]);
        else return JDV::error($res->error_message);
    }
   
    //getPaymentList()
    function getInvoicePayments(Request $req){
        $ss= UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $invoice_id = isset($req->id)? $req->id: $req->invoice_id;
        $invoice = new Invoice($invoice_id,$ss);
        //filter = ['search_value','start-date','end_date']
        $filter = $req->all();
        return JDV::result($invoice->getPayments(null,$filter));
    }

    function receivePayment(Request $req){
        $ss= UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $invoice = new Invoice($req->invoice_id,$ss);
        $res = $invoice->receivePayment($req->all());
        if($res->status_code ===200){
            return JDV::success([
                'invoice_id'=>$req->invoice_id,
                'currency_code'=>$res->currency_code,
                'amount_due'=>$res->amount_due,
                'total_paid'=>$res->amount_paid,
                'tax_amount'=>$res->tax_amount,
                'tax_rate'=>$res->tax_rate,
                'ref_number'=>$res->ref_number
            ]);
        }
        return JDV::error($res->error_message);
    }

    //Modify or update existing payment
    function updatePayment(Request $req){
        $ss= UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id;
        $res = Payment::get($id,$ss)->update($req->all());
        if($res->status_code ===200){
            return JDV::success([
                'invoice_id'=>$req->invoice_id,
                'currency_code'=>$res->currency_code,
                'amount_due'=>$res->amount_due,
                'total_paid'=>$res->amount_paid,
                'tax_amount'=>$res->tax_amount
            ]);
        }
        return JDV::error($res->error_message);
    }

    function deletePayment(Request $req){
        $ss= UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = isset($req->id)?$req->id:$req->pmt_id;
        return JDV::raw(Payment::get($id,$ss)->delete());
    }

    function receivePayments(Request $req){
        $ss= UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        //$invoice = new Invoice($req->invoice_id);
        $res = Invoice::get($ss,$req->invoice_id)->receivePayments($req->payments);
        if($res->status_code ===200){
            return JDV::success([
                'invoice_id'=>$req->invoice_id,
                'total_paid'=>$res->total_paid
            ]);
        }
        return JDV::error($res->error_message);
    }

    function getInvoicePayments_with_summary(Request $req){
        $ss= UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $invoice = new Invoice($req->id?$req->id:$req->invoice_id,$ss);
        $vinfo = $invoice->getDetails();
        if(!$vinfo) return JDV::result(NULL);

        $pmt_status = ($vinfo->amount_due <= $vinfo->amount_paid)? "Paid": ( $vinfo->amount_paid>0? "Partially Paid": "Unpaid");
        if ($vinfo->amount_due <=0)  $pmt_status ="NA";
        return JDV::result([
            'currency_code'=>$vinfo->currency_code,
            'amount_paid'=>$vinfo->amount_paid,
            'tax_amount'=>$vinfo->tax_amount,
            'pmt_status'=>$pmt_status,
            'payments'=> $invoice->getPayments()
        ]);
    }

    //getPaymentDetails()
    function getInvoicePaymentDetails(Request $req){
        $ss= UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $row = Invoice::get(null,$ss)->getPaymentDetails($req->id?$req->id:$req->pmt_id);
        return JDV::result($row);
    }

    //Get payment details with summary. Returns payment details and invoice info => for Modify payment form
    function getInvoicePaymentWithSummary(Request $req){
        $ss= UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $pmt_id =$req->id?$req->id:$req->pmt_id;
        //getDetailsWithSummary() return object = {'invoice'=>{},'payment'=>{}}. Where Invoice = {'ref_number','amount_due','amount_paid'}
        $row = Payment::get($pmt_id,$ss)->getDetailsWithSummary();
        return JDV::result($row);
    }

    function getBasicInfo(Request $req){
        $ss= UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $invoice_id =$req->id?$req->id:$req->invoice_id;
        $invoice = new Invoice($invoice_id,$ss);
        return JDV::result($invoice->getBasicInfo());
    }
    
    function getCustomerType(Request $req){
        $ss= UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $customer_type = (object)["customer_type" => ["value" => "general","text" => "General"]];
        return JDV::result($customer_type);
    }
}