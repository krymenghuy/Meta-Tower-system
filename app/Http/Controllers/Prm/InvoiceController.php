<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Model\Prm\Invoice;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    protected $invoices;
    public function __construct(){
        $this->invoices = new Invoice();
    }

    public function saveInvoice(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->invoice_id ?? $req->id;
        $invoice = new Invoice();
        $save = $invoice->saveInvoice($req->all(),$id,$ss);
        return JDV::raw($save);

    }

    public function getListPaginate(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }

        return JDV:: result($this->invoices->getListPaginate($req->all(),$ss));
    }

    public function invoiceDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        
        return JDV::result($this->invoices->invoiceDetails($req->id));
    }

    public function getFormOptions(Request $req){
        $ss = XauthService::verifyAuth($req,-1);
        if ($ss->status_code !== 200){
            return JDV::raw($ss);
        }

        return JDV::result($this->invoices->getFormOptions($req->id));
    }

    public function deleteInvoice(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }

       if(!isset($req->id) || !is_numeric($req->id)){
           return JDV::error('Invalid ID');
       }
       $res = $this->invoices->deleteInvoice($req->id);
       return JDV::raw($res);

    }

}
