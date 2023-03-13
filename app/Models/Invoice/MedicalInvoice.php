<?php

namespace App\Models\Invoice;

use App\Models\Invoice\Invoice;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;

class MedicalInvoice extends Invoice //extends Model
{
    //use HasFactory;
    public function __construct($id=null,$ss){
        parent::__construct($id,$ss);
        
    }

    //create Invoice based on ticket_id to pull items such as medications, services, and labo tests
    function createFromTicket($tiket_id,$ss){
       return "create now";
    }
    
    function getDetails($id=null,$ss=null){
       $id = $id?$id:$this->getId();
       $ss = $ss?$ss:$this->getUserInfo();
       $invoice = self::details($id,$ss);
       if($invoice){
         $invoice->service_items = [];
         $invoice->labo_test_items = [];
       }
       return $invoice;
    }
}
