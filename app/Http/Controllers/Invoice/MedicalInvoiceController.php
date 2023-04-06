<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Invoice\MedicalInvoice;
use App\Models\JDV;
use App\Models\UM;

class MedicalInvoiceController extends Controller
{
    
    function createInvoice(Request $req){
       $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);
       $medInvoice = new MedicalInvoice(null,$ss);
       $ticket_id = $req->ticket_id?$req->ticket_id:$req->id;
       $res= $medInvoice->create($ticket_id);
       return JDV::result($res);
    }

    function deleteInvoice(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $ticket_id = $req->ticket_id?$req->ticket_id:$req->id;
        $medInvoice = new MedicalInvoice($ticket_id,$ss);
        $res= $medInvoice->delete();
        return JDV::raw($res);
    }

}
