<?php

namespace App\Models\Invoice;

use App\Models\Consultation;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;

class MedicalInvoice //extends Invoice //extends Model
{
    //use HasFactory;
    //One consultation -> one ticket -> one medical invoice
    protected $ticket_id = null; //Ticket's ID
    protected $id = null; //Medical invoice's ID
    protected $userInfo= null;

    //by defeault, the given $id, here, is the ticket_id, Not invoice ID
    public function __construct($ticket_id=null,$userInfo=null){
       $this->ticket_id = $ticket_id;
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
      return $this->ticket_id;
    }
    
    //return instance of Medical Invoice by $invoice_id
    function get($invoice_id,$ss=null){
       return new MedicalInvoice($invoice_id,$ss);
    }

    function getByTicketId($ticket_id,$ss=null){
       return new MedicalInvoice($ticket_id,$ss);
    }

    static function getItems($ticket_id,$ss){
      $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
      $branch_id = $ss->branch_id;
       //Get prescribed items
       $cols = [DB::raw("'product' AS invoice_item_class"),'pi.item_id','i.name','i.name as description','pi.qty','pi.sku'];
       $products = DB::table('patient_prescription_items as pi')->join('inv_items as i','i.id','=','pi.item_id')->where('pi.ticket_id',$ticket_id)->select($cols)->get();
 
      //Get prescribed services
      $cols = [DB::raw("'service' AS invoice_item_class"),'ps.service_id as item_id',"s.name","s.name as description",'ps.qty','ps.sku'];
      $services= DB::table('patient_services as ps')->join('medical_services as s','s.id','=','ps.service_id')->where('ps.ticket_id',$ticket_id)->where('ps.branch_id',$branch_id)->select($cols)->get(); 
       
      //Get labo tests items
      $cols = [DB::raw("'labo' AS invoice_item_class"),'t.test_id AS item_id','s.name','s.name AS description',DB::raw("1 AS qty"),DB::raw("'None' AS sku")];
      $labos = DB::table('patient_labo_tests AS t')->join('medical_services as s','s.id','=','t.test_id')->where('ticket_id',$ticket_id)->where('service_type','labo')->where('t.branch_id',$branch_id)->select($cols)->orderBy('s.name','ASC')->get();
      return $products->merge($services)->merge($labos);
    }

    static function createInvoiceHeaderInputs($ticket_id){
       return [
        'invoice_class'=>'Medical',
        'issue_date'=>getNowTime(),
        'due_date'=>getNowTime(),
        'customer_id'=>$ticket->client_id,
        'billing_address'=>$ticket->customer_address,
        'customer_phone'=>$ticket->customer_phone,
        'customer_email'=>$ticket->customer_email,
        'terms'=>'NA',
        'description'=>'',
         'invoice_notes'=>'',
         'discount'=>0,
         'discount_type'=>'percentage',
         'amount'=>0,
         'amount_due'=>0,
         'amount_paid'=>0,
         'signer_name'=>'',
         'inactive'=>0,
         'status_code'=>'active'   
       ];
    }

    //CreateInvoice() | saveInvoice()
    function create($ticket_id,$ss=null){
      if(!$ss) $ss = $this->getUserInfo();
      $branch_id = $ss->branch_id;
      $d = self::createInvoiceHeaderInputs($ticket_id);
      $validate_rule =[
        "id"=>"0|identity=1",
        "invoice_class"=>"1|choice|Medical,Regular|default=Regular",
        "issue_date"=>"0|date|text=Issue date is required",
        "due_date"=>"0|date|text=Due date is not correct",
        "customer_id"=>"1|number|exists=customers.id|text=Client ID does not exist",
        "billing_address"=>"0|string|0-250",
        "customer_phone"=>"0|phone|0-30",
        "customer_email"=>"0|phone|0-30",
        "terms"=>"0|string|0-30",
        "description"=>"0|string",
        "invoice_notes"=>"0|string|0-200",
        "status_code"=>"1|choice|active,inactive|default=active",
        "discount"=>"0|number|default=0",
        "discount_type"=>"1|choice|percentage,amount",
        "amount"=>"0|number|default=0",
        "amount_due"=>"0|number|default=0",
        "amount_paid"=>"0|number|default=0",
        "signer_name"=>"0|string|0-50",
        'inactive'=>'1|choice|0,1|default=0'
        //,"items"=>"1|array"
      ];

      $items = self::getItems($ticket_id,$ss);
      if(!isset($items[0])) return DV::error('There are no invoice items');
      $res = validateObject($d,$validate_rule,true,[],$ss->lang,false,[]);
      if($res->error) return DV::error($res->error);
      $invoice_id = $res->id;
      $inputs = $res->values;
 
      /** Always use today date for Issue date **/
      //if(!(bool)strtotime($inputs['issue_date'])) 
      $inputs['issue_date'] =getNowTime();

      $inputs['issue_date'] = convertDate($inputs['issue_date']); 
      $inputs['due_date'] = convertDate($inputs['due_date']);
      $issue_date = $inputs['issue_date'];
      $due_date = $inputs['due_date'];

      if((bool)strtotime($due_date))
        if($due_date < $issue_date) return DV::error("Issue Date should be earlier or the same as Due Date");
      else $inputs['due_date'] = $issue_date;

      $customer_id = $inputs['customer_id'];
      $customer = Customer::info($branch_id,$customer_id);
      if(!$customer) return DV::error("It seems customer ID is not valid");
      $inputs['customer_phone'] = $customer->phone_number;
      $inputs['billing_address'] = $customer->billing_address;
      $inputs['customer_email'] = $customer->email; 
  
      $inputs['signer_name'] = InvoiceSettings::signer_name($branch_id);
      $account = InvoiceSettings::payment_bank($branch_id);
      $currency = InvoiceSettings::currency($branch_id);
      $inputs['pmt_account_number'] = $account->pmt_account_number;
      $inputs['pmt_bank_name'] = $account->pmt_bank_name;
      $inputs['pmt_account_name'] = $account->pmt_account_name;
      $inputs['currency_code']= $currency->currency_code;
      $inputs['exchange_rate']= $currency->exchange_rate;
    
      //$inputs['invoice_number'] = null ; //self::createInvoiceNumber($branch_id,$issue_date);
      $discount = $inputs['discount'];
      $discount_type = $inputs['discount_type'];
      unset($inputs['discount']);
      $invoice_id = saveData($ss,"invoices",['id'=>$invoice_id],$inputs,[],1);
      if($invoice_id>0){
         $m = self::saveInvoiceItems($ss,['id'=>$invoice_id,'discount'=>$discount,'discount_type'=>$discount_type],$items);
         if($m->item_count<=0) return DV::error('No invoice items have been saved. Those items may be invalid');
         $xres = self::setInvoiceNumber($branch_id,$invoice_id,"tax_line",$issue_date,null);
         return DV::success(['invoice_id'=>$invoice_id,'ref_number'=>$xres->code,'item_count'=>$m->item_count]);
      }
      return DV::error("Something wrong saveing invoice!");
   }

   //$doc_class is invlice line. It is invoice line based on which to issue invoice for different Tax processing or tax treatment.
   static function setInvoiceNumber($branch_id,$invoice_id=0,$doc_class=null,$issue_date=null,$len=5,$onSuccess=null){
    if(!$len) $len=5;
    $def_prefix ="V";
    $table_name="invoice_number_control";
    $target_table ="invoices";
    $target_column ="ref_number";
    $com_branch_id = null;
    $str_company_branch ="1=1";
    if(!$invoice_id) return null;
    if($com_branch_id > 0) $str_company_branch ="c.com_branch_id =$com_branch_id";
    //if ($def_prefix) $where_branch .=" AND prefix ='$def_prefix'";
   
    $year = date('Y',strtotime($issue_date));

    $rows = DB::table($table_name." as c")->where('branch_id',$branch_id)->where('c.issue_year',$year)->where('c.doc_class',$doc_class)->whereRaw($str_company_branch)->selectRaw("last_id,prefix")->take(1)->get();
    $next_num = 0;
    $prefix=null;
    foreach($rows as $row){
      $next_num = $row->last_id;
      $prefix =$row->prefix;
    }
    if(!$prefix) $prefix = $def_prefix;
    if (!$prefix) $prefix ="I";
    $next_num++;
    //example invoice number => I12023-00003
    $new_code = $prefix.$branch_id.$year."-".formatNumber($next_num,$len);
 
    $x = DB::table($target_table)->where('id',$invoice_id)->update([$target_column=>$new_code]);
    if($x || $x===1){
       $updated = DB::table($table_name)->where('branch_id',$branch_id)->where('issue_year',$year)->where('doc_class',$doc_class)->whereRaw($str_company_branch)->update(['last_id'=>$next_num]);
       if (!$updated) DB::table($table_name)->insert(['branch_id'=>$branch_id,'com_branch_id'=>$com_branch_id,'doc_class'=>$doc_class,'issue_year'=>$year,'prefix'=>$prefix,'last_id'=>$next_num]);
       if ($onSuccess) $onSuccess();
       return (object)['status_code'=>200,'status'=>'OK','code'=>$new_code];
    } 
    return null;      
  }
 
  // //Create Invoice based on ticket_id to pull items such as medications, services, and labo tests
  // function createInvoice($ticket_id=null,$ss=null){
  //    $ss = $ss?$ss:$this->getUserInfo();
  //    $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
  //    if(!$ticket_id) return DV::error("The given ticket_id is empty or not valid");
  //     $items = self::getItems($ticket_id,$ss); 
    //     $m = null;
    //     $total_cost = 0;
    //     $total_tax =0;
    //     $sub_total =0;
    //     return $items;
    //     $m = self::createInvoiceItems($items,$ss);
    //     $total_cost += $m->total_cost;
    //     $total_tax += $m->total_tax;
    //     $sub_total += $m->sub_total;
   
    //     // return (object)[
    //     //  'product_items' =>$consult->getPrescribedITems(),
    //     //  'labo_tests' => $consult->getLaboTests(),
    //     //  'service_items' =>$consult->getPrescribedServices()
    //     // ];

    //   //  Invoice::create($data);
    //   //  return DV::success();
    // }
    

    //@params $invoiceInfo = ['id','discount','discount_type']
    static function saveInvoiceItems($ss,$invoiceInfo,$items,$deletePreviousItems = false){
      $branch_id = $ss->branch_id;
      $invoice_id =isset($invoiceInfo['id'])? $invoiceInfo['id']:0;
      $success_cnt =0;
      $total_cost = 0;
      $total_amount = 0 ;
      $total_tax =0;
      if ($deletePreviousItems) DB::table("invoice_items")->where('invoice_id',$invoice_id)->delete();
      foreach($items as $x){
         $item_id = isset($x->id)?$x->id:null; // isset($x['item_id'])?$x['item_id']:null;
         if(!$item_id) $item_id = isset($x->item_id)?$x->item_id:null;
         $itemInfo = Item::info($item_id);
         if($itemInfo){
           //item's discount is always in percentage
           $discount_type ='percentage';
           $discount_percent = isset($x->discount_percent)?$x->discount_percent:0;
           // $discount_type = isset($x->discount_type)?$x->discount_type:null;
           // $discount = isset($x->discount)? $x->discount:0;
           // if (!$discount_type){
           //   $discount_percent = isset($x->discount_percent)?$x->discount_percent:0;
           //   if ($discount_percent > 0){
           //      $discount_type ='percentage';
           //      $discount = $discount_percent;

           //   } 
           // } 

           //if discount_percent is supplied => then we user discount as percentage, otherwise, use disocunt in currency amount
           $tax_rate = isset($x->tax_rate)?$x->tax_rate:$itemInfo->sales_tax_rate;
           if(!$tax_rate) $tax_rate =0;
           $amount = $x->qty * $x->price;
           $discount_amount = $amount * $x->discount_percent/100;
           $net_amount = $amount - $discount_amount;
           $tax_amount = $net_amount * $tax_rate/100;
           $net_amount += $tax_amount;

           //Example => $x->invoice_item_class = {'product','service','labo'}
           $description =isset($x->description)?$x->description: $itemInfo->name;
           $new_id = saveData($ss,'invoice_items',['id'=>0],[
             'invoice_item_class'=>$x->invoice_item_class,
             'invoice_id'=>$invoice_id, 
             'item_id'=>$item_id,
             'item_name'=>$itemInfo->name,
             'description'=>$description,
             'qty'=>$x->qty,
             'sku'=>$itemInfo->sku,
             'price'=>$x->price,
             'cost'=>$itemInfo->cost,
             'discount_percent'=>$x->discount_percent,
             'discount_amount'=>$discount_amount,
             'discount_type'=>$discount_type,
             'tax_rate'=>$tax_rate,
             'tax_amount'=>$tax_amount,
             //'amount'=>$amount,
             'net_amount'=>$net_amount
           ],[],1);

           if ($new_id){
             $total_amount +=$net_amount;
             $total_tax += $tax_amount;
             $total_cost +=$itemInfo->cost;
             $success_cnt++;
           }
         }
      }

     $discount = isset($invoiceInfo['discount'])?$invoiceInfo['discount']:0;
     $discount_type = isset($invoiceInfo['discount_type'])?$invoiceInfo['discount_type']:0;
     self::updateAmounts($invoice_id,$discount,$discount_type);
     //  $overall_discount_amount =0;
     //  $overall_discount_percent =0;
     //  DB::table('invoices')->where('id',$invoice_id)->where('branch_id',$branch_id)->update([
     //   'total_cost'=>$total_cost,
     //   'tax_amount'=>$total_tax
     //   //,'amount'=>$total_amount,
     //   //'amount_due'=>$total_amount,
     //   //'discount_amount'=>$overall_discount_amount,
     //   //'discount_percent'=>$overall_discount_percent
     //  ]);
      return (object)['item_count'=>$success_cnt,'total_tax'=>$total_tax,'total_cost'=>$total_cost];
   }

    // //NOTE: parameter $item_class = {product,service,labo,etc...}
    // static function createInvoiceItems($item_class,$items=[],$ss=null){
    //   //$ss = $ss?$ss:$this->getUserInfo();
    //   $i=0;$c;
    //   do{
    //      if(!isset($items[$i])) break;
    //      $c = $items[$i];
           
    //      $i++;
    //   }while($c); 
    // }

  //Update invoices.discount_percent, discount_amount,discount_type AFTER all invoice's items are saved
  static function updateInvoiceDiscount($invoice_id,$discount=0,$discount_type='percentage'){
    //NOTE: invoices.amount is amount before overall invoice discount, amount_due is amount after discount
    //NOTE: i.net_amount = price * qty - discount_amount + i.tax_amount (sales tax);
    $rows = DB::table('invoice_items as i')->where('invoice_id',$invoice_id)->select(DB::raw("SUM(i.net_amount - IFNULL(i.tax_amount,0)) AS amount"))->get();
    $invoice = null;
    foreach($rows as $row ) $invoice = $row;
    $discount_amount =0;
    $discount_percent =0;
    if($invoice){
      //IMPORTANT NOTE: $invoice->amount is the invoice's amount, excluding tax. It is used as base for overall invoice's discount calculation
       $amount = $invoice->amount;
       if($discount_type ==='percentage' || $discount_type==='percent'){
          $discount_amount = $amount * $discount/100;
          $discount_percent = $discount;
      }else{
        $discount_amount = $discount;
        $discount_percent =($discount_amount *100)/$amount;
      }
    }
    $inputs = ['discount_percent'=>$discount_percent,'discount_amount'=>$discount_amount,'discount_type'=>$discount_type];
    DB::table('invoices')->where('id',$invoice_id)->update($inputs);
    return (object)$inputs;
  }

  //update invoices.amount,amount_due,tax_amount,tax_rate (average tax rate)
  static function updateAmounts($id=0,$discount=0,$discount_type='percentage'){
    //NOTE: important to ensure that the invoices.discount_amount has correct value before calling this method updateAmounts()
    self::updateInvoiceDiscount($id,$discount,$discount_type);
    DB::statement(DB::raw("UPDATE invoices set amount_due = (select SUM(net_amount) - IFNULL(invoices.discount_amount,0) FROM invoice_items WHERE invoice_id = $id),
    tax_amount = (select SUM(IFNULL(tax_amount,0)) FROM invoice_items WHERE invoice_id =$id),
    tax_rate = (select AVG(tax_rate) FROM invoice_items WHERE invoice_id =$id)
    WHERE id =$id"));
     //Not very important to update column "invoices.amount"
     DB::statement(DB::raw("UPDATE invoices set amount = amount_due + IFNULL(discount_amount,0) WHERE id =$id"));
     return true;
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
