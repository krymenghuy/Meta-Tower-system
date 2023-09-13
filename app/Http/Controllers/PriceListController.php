<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use App\Models\PriceList;

class PriceListController extends Controller
{
    function getPriceList_paginate(Request $req){
       $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);
       $p = new PriceList($req->id,$ss);
       $data = $p->list_paginate($req->all());
       return JDV::result($data);
    }

    function savePriceList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PriceList($req->id,$ss);
        return JDV::raw($p->save($req->all()));
    }

    function getStudentDiscountInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PriceList(null,$ss);
        //params = {pmt_option_id,enrollment_id,program_id,session_id}
        return JDV::result($p->getStudentDiscountInfo($req->pmt_option_id,$req->enrollment_id,$req->program_id,$req->session_id));
    }
    
    function deletePriceList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PriceList($req->id,$ss);
        return JDV::raw($p->delete());
    }

    function getPriceListDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(PriceList::details($req->id));
    }

    function getPriceListItems(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(PriceList::items($req->id));
    }

    function getPriceListItemDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(PriceList::itemDetails($req->id));
    }

    function saveItem(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PriceList($req->id,$ss);
        return JDV::raw($p->saveItem($req->all()));
    }

    function deleteItem(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PriceList($req->id,$ss);
        return JDV::raw($p->deleteItem($req));
    }

    function weeklyFee(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

        $row = new PriceList(null,$ss);
        // $fee = $row->getWeeklyTuitionDue();
        $fee = $row->payment_processing($req->all());
        return JDV::result($fee);
    }

    function monthlyFee(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

        $row = new PriceList(null,$ss);
        // $fee = $row->getWeeklyTuitionDue();
        $fee = $row->getMonthlyFee($req->all());
        return JDV::result($fee);
    }

    //getPendingPayment()
    function getTuitionReviewList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

        $rows = PriceList::tuitionReviewList($req->all(),$ss);
        return JDV::result($rows);
    }

    function previewPendingPaymentDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

        $row = new PriceList($req->id,$ss);
        $preview = $row->previewPendingPaymentDetails($req->all(),$req->id,$ss);
        return JDV::result($preview);
    }
 
    function getPreviewPaymentOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $list = new PriceList(null,$ss);
        $id = $req->id ? $req->id:$req->enrollment_id;
        $data = $list->getPaymentPreviewOptions($id,$ss);
        return JDV::result($data);
    }

    function updatePendingPayment(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

        $row = PriceList::verifyPendingStudent($req->all(),$ss);
        return JDV::raw($row);
    }

    function getStudentPendingPaymentDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $row = new PriceList(null,$ss);
        $details =$row->studentPendingPaymentDetails($req->id);
        return JDV::result($details);
    }

    // function studentInvoice(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return $ss;

    //     $find = PriceList::studentInvoice($req->all(),$ss);
    //     return JDV::result($find);

    // }

    // function findStudent(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return $ss;

    //     $find = PriceList::findStudent($req->all(),$ss);
    //     return JDV::result($find);
    // }

    // function schoolFeePay(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return $ss;
    //     $pay = PriceList::schoolFeePay($req->all(),$ss);
    //     return JDV::result($pay);
    // }

    function generateInvoiceDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new Invoice();
        $details = $x->generateInvoiceDetails($req->all(),$ss);
        return JDV::result($details);
    }

    // function generateInvoice(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return $ss;

    //     $details = PriceList::generateInvoice($req->all(),$ss);
    //     return JDV::raw($details);
    // }

    // function deleteInvoice(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return $ss;

    //     $delete = PriceList::deleteInvoice($req,$ss);
    //     return JDV::raw($delete);
    // }

    // function turnInvoiceToActive(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return $ss;

    //     $active = PriceList::reviveInActiveInvoice($req,$ss);
    //     return JDV::raw($active);
    // }

    // function updateInvoice(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return $ss;

    //     $update = PriceList::updateInvoice($req->all(),$ss);
    //     return JDV::raw($update);
    // }

    // /**
    //  * getInvoiceItems() for Invoice's expandable details
    //  */
    // function getInvoiceItems(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return $ss;
    //     $p = new PriceList(null,$ss);
    //     $data = $p->getInvoiceItems($req->invoice_id);
    //     return JDV::result($data);
    // }

}
