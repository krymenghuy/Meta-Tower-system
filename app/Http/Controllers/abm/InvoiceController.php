<?php

namespace App\Http\Controllers\Abm;
use App\Http\Controllers\Controller;
use App\Models\Abm\Invoice;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;


class InvoiceController extends Controller
{
    protected $invoice = null;
    function __construct(){
        $this->invoice = new Invoice();
    }
    function save(Request $req){

        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return JDV::raw($ss);
        $id = $req->id;
        $save = $this->invoice->save($req->all(),$id,$ss);    
        return JDV::raw($save);
    }
    function getInvoiceList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $this->invoice->getInvoiceList();
        
        return JDV::result($data);
    }
    function getInvoiceListPaginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $this->invoice->getInvoiceListPaginate($req->all(),$ss);
        
        return JDV::result($data);
    }
    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss);
         $id = $req->id?$req->id:$req->sender_id;  
         $data = $this->invoice->getFormOptions($id,$ss); 
         return JDV::result($data);
     }
     function deleteInvoice(Request $req)
     {
         $ss = UM::getUserInfoByToken($req, -1);
         if ($ss->status_code !== 200)
             return JDV::raw($ss);
         $id = $req->id;
         $invoice = new Invoice();
         $delete = $invoice->deleteInvoice($id);
         return JDV::raw($delete);
     }
     function ListPaginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $this->invoice->ListPaginate($req->all(),$ss);
        
        return JDV::result($data);
    }

 
}
