<?php

namespace App\Models\Invoice;

use App\Models\Consultation;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;

class MedicalInvoice //extends Invoice //extends Model
{
    //use HasFactory;

    //One consultation -> one ticket -> one medical invoice
    protected $ticket_id = null; //Ticket's ID
    protected $id = null; //Medical invoice's ID
    protected $userInfo= null;

    //by defeault, the given $id, here, is the ticket_id, Not invoice ID
    public function __construct($id=null,$ss,$use_invoice_id = false){
       if($use_invoice_id) 
         $this->id = $id;
       else $this->ticket_id = $id;
       $this->userInfo = $userInfo;
        //parent::__construct($id,$ss);
    }

    function getTicketId(){
      return $this->ticket_id;
    }
    function getUserInfo(){
      return $this->userInfo;
    }
    function getId(){
      return $this->id;
    }
    
    //return instance of Medical Invoice by $invoice_id
    function get($invoice_id,$ss=null){
      return new MedicalInvoice($invoice_id,$ss,true);
    }
    function getByTicketId($ticket_id,$ss=null){
      return new MedicalInvoice($ticket_id,$ss,false);
    }

    //Create Invoice based on ticket_id to pull items such as medications, services, and labo tests
    function createInvoice($ticket_id=null,$ss=null){
       $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
       if(!$ticket_id) return DV::error("The given ticket_id is empty or not valid");
       $consult = new Consultation($ticket_id,$ss);
       $product_items = $consult->getPrescriptions();
       $labo_tests = $consult->getLaboTests();
       $service_items = $consult->getPrescribedServices();
       Invoice::create($data);
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
