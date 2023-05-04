<?php

namespace App\Models\Invoice;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use DB;

class Payment //extends Model
{
    //use HasFactory;
    protected $this_pmt_id =null;
    protected $user_info = null;
    function __construct($id =null,$user_info){
        $this->this_pmt_id = $id;
        $this->user_info = $user_info;
    }

    function getPmtId(){
       return $this->this_pmt_id;
    }
    function getId(){
        return $this->this_pmt_id;
     }
    function getUserInfo(){
       return $this->user_info;
    }

    static function get($id,$user_info){ 
       return new Payment($id,$user_info);
    }

    function delete($id = null,$ss=null){
       if (!$ss) $ss = $this->getUserInfo();
       if(!$id) $id = $this->getPmtId();
       $branch_id = $ss->branch_id;
       $invoice_id = self::getInvoiceId($id);
       $x = DB::table('invoice_payments')->where('id',$id)->delete();
       if($invoice_id){
          DB::statement(DB::raw("UPDATE invoices set amount_paid =IFNULL((SELECT SUM(d.amount) FROM invoice_payments AS d WHERE d.invoice_id =$invoice_id AND d.branch_id = $branch_id),0) WHERE invoices.id =$invoice_id AND invoices.branch_id = $branch_id"));
       }
       $invoiceInfo = getDataRow('invoices',['id'=>$invoice_id],"id,ref_number,amount_due,amount_paid,currency_code");
       return DV::success(['data'=>$invoiceInfo]);
    }

    function details($id=null){
      $id = $id? $id: $this->getPmtId();
      $cols = ['d.id','d.ref_number','invoice_id',DB::raw("CASE d.payer_name IS NULL WHEN 1 THEN getPatientName(v.customer_id) ELSE d.payer_name END as payer_name"),'v.customer_phone',DB::raw("DATE_FORMAT(d.payment_date,'%d %b %Y') AS payment_date"),'d.amount','d.tax_amount','d.currency_code','d.create_user',DB::raw("DATE_FORMAT(d.created_at,'%d %b %Y %r') AS created_at"),DB::raw("(SELECT m.`name` FROM payment_methods AS m WHERE m.id = d.pmt_method_id LIMIT 1) AS pmt_method"),'d.pmt_method_id','d.notes',];
      $rows = DB::table('invoice_payments as d')->join('invoices as v','v.id','=','d.invoice_id')->where('d.id',$id)->select($cols)->take(1)->get();
      return isset($rows[0])? $rows[0]: DV::error("Payment information was not found!");
    }
    
    function getDetails($id=null){
        $id = $id? $id: $this->getPmtId();
        $cols = ['d.id','d.ref_number','invoice_id',DB::raw("CASE d.payer_name IS NULL WHEN 1 THEN getPatientName(v.customer_id) ELSE d.payer_name END as payer_name"),'v.customer_phone',DB::raw("DATE_FORMAT(d.payment_date,'%d %b %Y') AS payment_date"),'d.amount','d.tax_amount','d.currency_code','d.create_user',DB::raw("DATE_FORMAT(d.created_at,'%d %b %Y %r') AS created_at"),DB::raw("(SELECT m.`name` FROM payment_methods AS m WHERE m.id = d.pmt_method_id LIMIT 1) AS pmt_method"),'d.pmt_method_id','d.notes'];
        $rows = DB::table('invoice_payments as d')->join('invoices as v','v.id','=','d.invoice_id')->where('d.id',$id)->select($cols)->take(1)->get();
        return isset($rows[0])? $rows[0]: DV::error("Payment information was not found!");
    }

    function getDetailsWithSummary($id=null){
        if (!$id) $id = $this->getPmtId();
        return (object)[
           'invoice'=>self::getInvoiceInfo($id),
           'payment'=> $this->details($id)
        ];
      
    }

    static function getInvoiceId($pmt_id=0){
        $row = getDataRow('invoice_payments',['id'=>$pmt_id],"invoice_id");
        return $row? $row->invoice_id : null;
    }

    static function getInvoiceInfo($pmt_id){
         $invoice_id = self::getInvoiceId($pmt_id);
         return getDataRow('invoices',["id"=>$invoice_id],"id,ref_number,(SELECT SUM(IFNULL(amount,0)) FROM invoice_payments WHERE invoice_id = invoices.id LIMIT 1) AS amount_paid,amount_due,currency_code,tax_amount,tax_rate,customer_id");   
    }

   static function getProps($id,$cols){
      return getDataRow('invoice_payments',['id'=>$id],$cols); 
   }

    //save payment Info UPDATE 
    //@params $d = ['payment_date','amount','notes'], $ss is optional parameter. It is user info (authentication)
    function update($d=[],$ss=[]){
        if(!$ss) $ss = $this->getUserInfo();
        $id = $this->getPmtId();
        $validate_rule = [
            "id"=>"0|identity=1",
            //"invoice_id"=>"1|string|exists=invoices.id|text=Provided invoice id is not found!",
            "payment_date"=>"1|date",
            "payer_name"=>"0|string|0-50",
            "amount"=>"1|positive",
            "pmt_method_id"=>"1|number|exists=payment_methods.id",
            "currency_code"=>"0|string|0-10",
            "tax_amount"=>"0|number|default=0",
            "notes"=>"0|string" 
        ];
        $res = validateObject($d,$validate_rule,true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $id = $res->id;
        $inputs = $res->values;
        $payment_date = $inputs['payment_date'];
        //$tax_amount =$inputs['tax_amount'];
        $amount = $inputs['amount'];

        $pmt = getDataRow('invoice_payments',['id'=>$id],"id,amount,tax_amount");
        if(!$pmt) return DV::error("Payment identity is not valid");
        $org_amount = $pmt->amount;
        //$diff_amount = $org_amount - $amount;

        $invoice = self::getInvoiceInfo($id);
        if(!$invoice) return DV::error("Payment ID is not valid");
        $invoice_id = $invoice->id;
        $amount_paid = $invoice->amount_paid;
        $tax_amount = $amount * $invoice->tax_rate/100;
        $inputs['tax_amount'] =$tax_amount;
        //if ($invoice->amount_due - $amount_paid <=0) return DV::error("Invoice ID $invoice_id has been fully paid");
        $excess_amount = $amount_paid - $org_amount + $amount - $invoice->amount_due;
        if($excess_amount>0) return DV::error("Amount ".$amount." ".$invoice->currency_code." will cause the invoice to be overpaid by $excess_amount ".$invoice->currency_code);

        $inputs['currency_code']= $invoice->currency_code;
        $id = saveData($ss,"invoice_payments",['id'=>$id],$inputs,[],1);
        if($id>0){
          //$xres = self::setReceiptNumber($branch_id,$id,"tax_line",$payment_date,null);
          DB::statement(DB::raw("UPDATE invoices set amount_paid =(SELECT SUM(d.amount) FROM invoice_payments AS d WHERE d.invoice_id =$invoice_id) WHERE id =$invoice_id"));
          $updated_invoice = self::getInvoiceInfo($id);
          return DV::success(['id'=>$id,
          'currency_code'=>$invoice->currency_code,
          'amount_due'=>$invoice->amount_due,
          'amount_paid'=>$updated_invoice->amount_paid,
          'tax_rate'=>$updated_invoice->tax_rate,
          'tax_amount'=>$updated_invoice->tax_amount]);
        }else return DV::error("Something went wrong in saving payment information");
    }

    //$filter = ['search_value','start_date','end_date']
    function list($invoice_id=null,$filter=null){
        $str_invoice = "1=1";
        $str_search ="1=1";
        $str_dates ="1=1";
        if($filter){
            $start_date = isset($filter['start_date'])? convertDate($filter['start_date']):null;
            $end_date = isset($filter['end_date'])?convertDate($filter['end_date']):null;
            if(!(bool)strtotime($end_date) && (bool)strtotime($start_date)) $end_date = $start_date;
            if(!(bool)strtotime($start_date) && (bool)strtotime($end_date)) $start_date = $end_date;
            if((bool)strtotime($start_date)){
                $str_dates = "DATE(d.payment_date) >='$start_date' AND DATE(d.payment_date)<='$end_date'";
            }
            $search_value = isset($filter['search_value'])?$filter['search_value']:null;
            if($search_value) $str_search = "(d.payer_name LIKE '%$search_value%' OR v.customer_phone ='$search_value')";
        }
        if($invoice_id) $str_invoice ="d.invoice_id = $invoice_id";
         
        $cols = ['d.id','d.ref_number','invoice_id','d.payer_name','v.customer_phone',DB::raw("DATE_FORMAT(d.payment_date,'%d %b %Y') AS payment_date"),'d.amount','d.tax_amount','d.currency_code','d.pmt_method_id','m.name as pmt_method','d.create_user',DB::raw("DATE_FORMAT(d.created_at,'%d %b %Y %r') AS created_at"),'d.notes'];
        return DB::table('invoice_payments as d')->join('invoices as v','v.id','=','d.invoice_id')->join("payment_methods as m","m.id","=","d.pmt_method_id")->whereRaw($str_invoice)->whereRaw($str_dates)->whereRaw($str_search)->select($cols)->get();
         
    }
}
