<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Invoice;
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
        $id = $req->id ?? $req->invoice_id;
        $invoice = new Invoice($id, $ss);
        $res = $invoice->saveInvoice($req->all());
        return JDV::raw($res);

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

       return JDV::result($this->invoices->getFormOptions($req->id,$ss));
    }

    public function deleteInvoice(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }

       if(!isset($req->id) || !is_numeric($req->id)){
           return JDV::error('Invalid ID');
       }
       return JDV::raw($this->invoices->deleteInvoice($req->id));

    }

    // public function updateServiceStatus(Request $req){
    //     $ss = XAuthService::verifyAuth($req, -1);
    //     if ($ss->status_code !== 200) {
    //         return JDV::raw($ss);
    //     }
    //     $id = $req->id ?? null;
    //     $service = new Service();
    //     $res = $service->updateServiceStatus($req->status_id, $id,$ss);
    //     return JDV::raw($res);
    // }

}
