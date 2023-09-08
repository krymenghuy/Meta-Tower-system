<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\JDV;
use App\Models\UM;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    //
    function studentInvoice(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new Invoice();
        $find = $x->studentInvoice($req->all(),$ss);
        return JDV::result($find);

    }

    function findStudent(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new Invoice(null,$ss);
        $find = $x->findStudent($req->all(),$ss);
        return JDV::result($find);
    }


    function schoolFeePay(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new Invoice();
        $pay = $x->schoolFeePay($req->all(),$ss)  ;//PriceList::schoolFeePay($req->all(),$ss);
        return JDV::raw($pay);
    }

    function generateInvoiceDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new Invoice();
        $details = $x->generateInvoiceDetails($req->all(),$ss);
        return JDV::result($details);
    }

    function generateInvoice(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new Invoice();
        $details = $x->generateInvoice($req->all(),$ss);
        return JDV::raw($details);
    }

    function deleteInvoice(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new Invoice();
        $delete = $x->deleteInvoice($req,$ss);
        return JDV::raw($delete);
    }

    function turnInvoiceToActive(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new Invoice();
        $active = $x->reviveInActiveInvoice($req,$ss);
        return JDV::raw($active);
    }

    function updateInvoice(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new Invoice();
        $update = $x->updateInvoice($req->all(),$ss);
        return JDV::raw($update);
    }

    /**
     * getInvoiceItems() for Invoice's expandable details
     */
    function getInvoiceItems(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $p = new Invoice(null,$ss);
        $data = $p->getInvoiceItems($req->invoice_id);
        return JDV::result($data);
    }
}
