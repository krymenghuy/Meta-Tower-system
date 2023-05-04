<?php

namespace App\Models\Invoice;

use DB;
use App\Models\DV;
//use App\Models\Inventory\Item;
use App\Models\Invoice\InvoiceSettings;
use App\Models\Invoice\Customer;
use App\Models\Invoice\Payment;
//use App\Models\Patient;
use Illuminate\Pagination\LengthAwarePaginator;

class Invoice
{
  ////use HasFactory;
  //protected $table_invoice ="invoices";
  //protected $table_payment ="invoice_payments";
  protected $this_invoice_id = null;
  protected $userInfo = null;

  public function __construct($id = 0, $userInfo = null)
  {
    $this->userInfo = $userInfo;
    $this->this_invoice_id = $id;
  }

  function getUserInfo()
  {
    return $this->userInfo;
  }

  function getId()
  {
    return $this->this_invoice_id;
  }

  public function getInvoiceId()
  {
    return $this->this_invoice_id;
  }

  static function getCustomerInfo($patient_id, $cols = null)
  {
    if (!$cols) $cols = "c.id,p.id as person_id,CONCAT(p.last_name,' ',p.first_name) AS name,p.first_name,p.last_name,p.sex,p.phone_number,p.email,p.address";
    $rows = DB::table('patients as c')->join('persons as p', 'p.id', '=', 'c.person_id')->where('c.id', $patient_id)->selectRaw($cols)->take(1)->get();
    return isset($rows[0]) ? $rows[0] : null;
  }

  function create($d, $ss = null)
  {
    if (!$ss) $ss = $this->getUserInfo();
    $branch_id = $ss->branch_id;
    $customer_table = InvoiceSettings::$customer_table;
    $validate_rule = [
      "id" => "0|identity=1",
      "invoice_class" => "1|choice|Medical,Regular|default=Regular",
      "issue_date" => "0|date|text=Issue date is required",
      "due_date" => "0|date|text=Due date is not correct",
      "customer_id" => "1|number|exists=$customer_table.id|text=Client ID does not exist",
      "billing_address" => "0|string|0-250",
      "customer_phone" => "0|phone|0-30",
      "customer_email" => "0|phone|0-30",
      "terms" => "0|string|0-30",
      "description" => "0|string",
      "invoice_notes" => "0|string|0-200",
      "status_code" => "1|choice|active,inactive|default=active",
      "discount" => "0|number|default=0",
      "discount_type" => "1|choice|percentage,amount",
      "amount" => "0|number|default=0",
      "amount_due" => "0|number|default=0",
      "amount_paid" => "0|number|default=0",
      "signer_name" => "0|string|0-50",
      'inactive' => '1|choice|0,1|default=0',
      "items" => "1|array"
    ];
    $res = validateObject($d, $validate_rule, true, [], $ss->lang, false, []);
    if ($res->error) return DV::error($res->error);
    $invoice_id = $res->id;
    $inputs = $res->values;

    /** Always use today date for Issue date **/
    //if(!(bool)strtotime($inputs['issue_date'])) 
    $inputs['issue_date'] = getNowTime();

    $inputs['issue_date'] = convertDate($inputs['issue_date']);
    $inputs['due_date'] = convertDate($inputs['due_date']);
    $issue_date = $inputs['issue_date'];
    $due_date = $inputs['due_date'];

    if ((bool)strtotime($due_date))
      if ($due_date < $issue_date) return DV::error("Issue Date should be earlier or the same as Due Date");
      else $inputs['due_date'] = $issue_date;

    $customer_id = $inputs['customer_id'];
    $customer = Customer::getProps($customer_id, null); //self::getCustomerInfo($customer_id,"address,phone_number,email,CONCAT(last_name,' ',first_name) AS name");
    if (!$customer) return DV::error("It seems customer ID is not valid");
    if (empty($inputs['customer_phone'])) $inputs['customer_phone'] = $customer->phone_number;
    if (empty($inputs['billing_address'])) $inputs['billing_address'] = isset($customer->billing_address) ? $customer->billing_address : $customer->address;
    if (empty($inputs['customer_email'])) $inputs['customer_email'] = $customer->email;

    //On Update or Create => $items array contains both "products" and "services"  
    $items = $inputs['items'];
    unset($inputs['items']);
    $inputs['signer_name'] = InvoiceSettings::signer_name($branch_id);
    $account = InvoiceSettings::payment_bank($branch_id);
    $currency = InvoiceSettings::currency($branch_id);
    $inputs['pmt_account_number'] = $account->pmt_account_number;
    $inputs['pmt_bank_name'] = $account->pmt_bank_name;
    $inputs['pmt_account_name'] = $account->pmt_account_name;
    $inputs['currency_code'] = $currency->currency_code;
    $inputs['exchange_rate'] = $currency->exchange_rate;

    //$inputs['invoice_number'] = null ; //self::createInvoiceNumber($branch_id,$issue_date);
    $discount = $inputs['discount'];
    $discount_type = $inputs['discount_type'];
    unset($inputs['discount']);
    $invoice_id = saveData($ss, "invoices", ['id' => $invoice_id], $inputs, [], 1);
    if ($invoice_id > 0) {
      $m = self::saveInvoiceItems($ss, ['id' => $invoice_id, 'discount' => $discount, 'discount_type' => $discount_type], $items);
      if ($m->item_count <= 0) return DV::error('No invoice items have been saved. Those items may be invalid');
      $xres = self::setInvoiceNumber($branch_id, $invoice_id, "tax_line", $issue_date, null);
      return DV::success(['invoice_id' => $invoice_id, 'ref_number' => $xres->code, 'item_count' => $m->item_count]);
    }
    return DV::error("Something wrong saveing invoice!");
  }

  //CreateInvoice() | saveInvoice()
  function update($d, $ss = null)
  {
    if (!$ss) $ss = $this->getUserInfo();
    $branch_id = $ss->branch_id;
    $customer_table = InvoiceSettings::$customer_table;
    if ($this->hasPayments(isset($d['id']) ? $d['id'] : 0, $ss)) return DV::error("Cannot modify invoice with existing payments");
    $validate_rule = [
      "id" => "0|identity=1",
      "issue_date" => "1|date|text=Issue date is required",
      "due_date" => "1|date|text=Due date is not correct",
      "customer_id" => "1|number|exists=$customer_table.id|text=Client ID does not exist",
      "billing_address" => "0|string|0-250",
      "customer_phone" => "0|phone|0-30",
      "customer_email" => "0|phone|0-30",
      "terms" => "0|string|0-30",
      "description" => "0|string",
      "invoice_notes" => "0|string|0-200",
      "status_code" => "1|choice|active,inactive|default=active",
      "discount" => "0|number|default=0",
      "discount_type" => "1|choice|percentage,amount",
      "amount" => "0|number|default=0",
      "amount_due" => "0|number|default=0",
      "amount_paid" => "0|number|default=0",
      //"signer_name"=>"0|string|0-50",
      'inactive' => '1|choice|0,1|default=0',
      "items" => "1|array"
    ];
    $res = validateObject($d, $validate_rule, true, [], $ss->lang, false, []);
    if ($res->error) return DV::error($res->error);
    $invoice_id = $res->id;
    $inputs = $res->values;

    if (!(bool)strtotime($inputs['issue_date'])) $inputs['issue_date'] = getNowTime();

    $inputs['issue_date'] = convertDate($inputs['issue_date']);
    $inputs['due_date'] = convertDate($inputs['due_date']);
    $issue_date = $inputs['issue_date'];
    $due_date = $inputs['due_date'];

    if ((bool)strtotime($due_date))
      if ($due_date < $issue_date) return DV::error("Issue Date should be earlier or the same as Due Date");
      else $inputs['due_date'] = $issue_date;

    $customer_id = $inputs['customer_id'];
    $customer = Customer::getProps($customer_id, null);
    if (!$customer) return DV::error("It seems customer ID is not valid");
    if (empty($inputs['customer_phone'])) $inputs['customer_phone'] = $customer->phone_number;
    if (empty($inputs['billing_address'])) $inputs['billing_address'] = $customer->billing_address;
    if (empty($inputs['customer_email'])) $inputs['customer_email'] = $customer->email;
    //On Update or Create => $items array contains both "products" and "services"  
    $items = $inputs['items'];
    unset($inputs['items']);
    $discount = $inputs['discount'];
    $discount_type = $inputs['discount_type'];
    unset($inputs['discount']);

    if (!$invoice_id) return DV::error("Invoice ID is not valid");
    $invoice_id = saveData($ss, "invoices", ['id' => $invoice_id], $inputs, [], 1);
    $m = self::saveInvoiceItems($ss, ['id' => $invoice_id, 'discount' => $discount, 'discount_type' => $discount_type], $items, true); //True = "Delete all previous items before inserting invoice's items"
    if ($m->item_count <= 0) return DV::error('No invoice items have been saved. Those items may be invalid');
    //$xres = self::setInvoiceNumber($branch_id,$invoice_id,"tax_line",$issue_date,null);
    //$this->updateAmounts($invoice_id,$discount,$discount_type);
    return DV::success(['invoice_id' => $invoice_id, 'item_count' => $m->item_count]);
  }

  public function hasPayments($id = null, $ss = null)
  {
    if (!$id) $id = $this->getInvoiceId();
    if (!$ss) $ss = $this->getUserInfo();
    return DB::table('invoice_payments')->where('invoice_id', $id)->where('branch_id', $ss->branch_id)->select('id')->take(1)->exists();
  }

  //Update invoices.discount_percent, discount_amount,discount_type AFTER all invoice's items are saved
  static function updateInvoiceDiscount($invoice_id, $discount = 0, $discount_type = 'percentage')
  {
    //NOTE: invoices.amount is amount before overall invoice discount, amount_due is amount after discount
    //NOTE: i.net_amount = price * qty - discount_amount + i.tax_amount (sales tax);
    $rows = DB::table('invoice_items as i')->where('invoice_id', $invoice_id)->select(DB::raw("SUM(i.net_amount - IFNULL(i.tax_amount,0)) AS amount"))->get();
    $invoice = null;
    foreach ($rows as $row) $invoice = $row;
    $discount_amount = 0;
    $discount_percent = 0;
    if ($invoice) {
      //IMPORTANT NOTE: $invoice->amount is the invoice's amount, excluding tax. It is used as base for overall invoice's discount calculation
      $amount = $invoice->amount;
      if ($discount_type === 'percentage' || $discount_type === 'percent') {
        $discount_amount = $amount * $discount / 100;
        $discount_percent = $discount;
      } else {
        $discount_amount = $discount;
        $discount_percent = ($discount_amount * 100) / $amount;
      }
    }
    $inputs = ['discount_percent' => $discount_percent, 'discount_amount' => $discount_amount, 'discount_type' => $discount_type];
    DB::table('invoices')->where('id', $invoice_id)->update($inputs);
    return (object)$inputs;
  }

  //$doc_class is invlice line. It is invoice line based on which to issue invoice for different Tax processing or tax treatment.
  static function setInvoiceNumber($branch_id, $invoice_id = 0, $doc_class = null, $issue_date = null, $len = 5, $onSuccess = null)
  {
    if (!$len) $len = 5;
    $def_prefix = "V";
    $table_name = "invoice_number_control";
    $target_table = "invoices";
    $target_column = "ref_number";
    $com_branch_id = null;
    $str_company_branch = "1=1";
    if (!$invoice_id) return null;
    if ($com_branch_id > 0) $str_company_branch = "c.com_branch_id =$com_branch_id";
    //if ($def_prefix) $where_branch .=" AND prefix ='$def_prefix'";

    $year = date('Y', strtotime($issue_date));

    $rows = DB::table($table_name . " as c")->where('branch_id', $branch_id)->where('c.issue_year', $year)->where('c.doc_class', $doc_class)->whereRaw($str_company_branch)->selectRaw("last_id,prefix")->take(1)->get();
    $next_num = 0;
    $prefix = null;
    foreach ($rows as $row) {
      $next_num = $row->last_id;
      $prefix = $row->prefix;
    }
    if (!$prefix) $prefix = $def_prefix;
    if (!$prefix) $prefix = "I";
    $next_num++;
    //example invoice number => I12023-00003
    $new_code = $prefix . $branch_id . $year . "-" . formatNumber($next_num, $len);

    $x = DB::table($target_table)->where('id', $invoice_id)->update([$target_column => $new_code]);
    if ($x || $x === 1) {
      $updated = DB::table($table_name)->where('branch_id', $branch_id)->where('issue_year', $year)->where('doc_class', $doc_class)->whereRaw($str_company_branch)->update(['last_id' => $next_num]);
      if (!$updated) DB::table($table_name)->insert(['branch_id' => $branch_id, 'com_branch_id' => $com_branch_id, 'doc_class' => $doc_class, 'issue_year' => $year, 'prefix' => $prefix, 'last_id' => $next_num]);
      if ($onSuccess) $onSuccess();
      return (object)['status_code' => 200, 'status' => 'OK', 'code' => $new_code];
    }
    return null;
  }

  //$doc_class is invoice line. It is invoice line based on which to issue invoice for different Tax processing or tax treatment.
  static function setReceiptNumber($branch_id, $payment_id = 0, $doc_class = null, $issue_date = null, $len = 5, $onSuccess = null)
  {
    if (!$len) $len = 5;
    $def_prefix = "P";
    $table_name = "receipt_number_control";
    $target_table = "invoice_payments";
    $target_column = "ref_number";
    $com_branch_id = null;
    $str_company_branch = "1=1";
    if (!$payment_id) return null;
    if ($com_branch_id > 0) $str_company_branch = "c.com_branch_id =$com_branch_id";
    //if ($def_prefix) $where_branch .=" AND prefix ='$def_prefix'";

    $year = date('Y', strtotime($issue_date));

    $rows = DB::table($table_name . " as c")->where('branch_id', $branch_id)->where('c.issue_year', $year)->where('c.doc_class', $doc_class)->whereRaw($str_company_branch)->selectRaw("last_id,prefix")->take(1)->get();
    $next_num = 0;
    $prefix = null;
    foreach ($rows as $row) {
      $next_num = $row->last_id;
      $prefix = $row->prefix;
    }
    if (!$prefix) $prefix = $def_prefix;
    if (!$prefix) $prefix = "I";
    $next_num++;
    //example invoice number => I12023-00003
    $new_code = $prefix . $branch_id . $year . "-" . formatNumber($next_num, $len);

    $x = DB::table($target_table)->where('id', $payment_id)->update([$target_column => $new_code]);
    if ($x || $x === 1) {
      $updated = DB::table($table_name)->where('branch_id', $branch_id)->where('issue_year', $year)->where('doc_class', $doc_class)->whereRaw($str_company_branch)->update(['last_id' => $next_num]);
      if (!$updated) DB::table($table_name)->insert(['branch_id' => $branch_id, 'com_branch_id' => $com_branch_id, 'doc_class' => $doc_class, 'issue_year' => $year, 'prefix' => $prefix, 'last_id' => $next_num]);
      if ($onSuccess) $onSuccess();
      return (object)['status_code' => 200, 'status' => 'OK', 'code' => $new_code];
    }
    return null;
  }

  static function itemInfo($item_id)
  {
    $cols = ["i.id", "i.code", "i.name as item_name", "i.description", "i.sku", "i.group_id", "g.name AS group_name", "g.category_id", "i.cost", "i.ws_selling_price", "i.selling_price", "i.sales_tax_rate"];
    $rows = DB::table("inv_items as i")->join('inv_item_groups AS g', 'g.id', '=', 'i.group_id')->where("i.id", $item_id)->select($cols)->take(1)->get();
    return isset($rows[0]) ? $rows[0] : null;
  }

  static function serviceInfo($service_id)
  {
    $cols = ["i.id", "i.name as item_name", "i.description", "i.sku", "i.cost", "i.price AS selling_price", "i.tax_rate as sales_tax_rate"];
    $rows = DB::table("medical_services as i")->where("i.id", $service_id)->select($cols)->take(1)->get();
    return isset($rows[0]) ? $rows[0] : null;
  }

  static function saveInvoiceItems($ss, $invoiceInfo, $items, $deletePreviousItems = false)
  {
    $branch_id = $ss->branch_id;
    $invoice_id = isset($invoiceInfo['id']) ? $invoiceInfo['id'] : 0;
    $success_cnt = 0;
    $total_cost = 0;
    $total_amount = 0;
    $total_tax = 0;
    if ($deletePreviousItems) DB::table("invoice_items")->where('invoice_id', $invoice_id)->delete();
    foreach ($items as $x) {
      $item_id = isset($x->id) ? $x->id : null; // isset($x['item_id'])?$x['item_id']:null;
      if (!$item_id) $item_id = isset($x->item_id) ? $x->item_id : null;
      $itemInfo = null;
      $itm_class = strtolower($x->invoice_item_class);
      if ($itm_class === 'service') $itemInfo = self::serviceInfo($item_id);
      else $itemInfo = self::itemInfo($item_id);

      if ($itemInfo) {
        //item's discount is always in percentage
        $discount_type = 'percentage';
        $discount_percent = isset($x->discount_percent) ? $x->discount_percent : 0;
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
        $tax_rate = isset($x->tax_rate) ? $x->tax_rate : $itemInfo->sales_tax_rate;
        if (!$tax_rate) $tax_rate = 0;
        $price = isset($x->price) ? $x->price : 0;
        if (!$price) $price = isset($itemInfo->selling_price) ? $itemInfo->selling_price : 0;
        $amount = $x->qty * $price;
        $discount_percent = isset($x->discount_percent) ? $x->discount_percent : 0;
        $discount_amount = $amount * $discount_percent / 100;
        $net_amount = $amount - $discount_amount;
        $tax_amount = $net_amount * $tax_rate / 100;
        $net_amount += $tax_amount;

        //Example => $x->invoice_item_class = {'product','service','labo'}
        $description = isset($x->description) ? $x->description : (isset($itemInfo->item_name) ? $itemInfo->item_name : $itemInfo->name);
        $new_id = saveData($ss, 'invoice_items', ['id' => 0], [
          'invoice_item_class' => $x->invoice_item_class,
          'invoice_id' => $invoice_id,
          'item_id' => $item_id,
          'item_name' => isset($itemInfo->name) ? $itemInfo->name : $itemInfo->item_name,
          'description' => $description,
          'qty' => $x->qty,
          'sku' => $itemInfo->sku,
          'price' => $price,
          'cost' => $itemInfo->cost,
          'discount_percent' => $discount_percent,
          'discount_amount' => $discount_amount,
          'discount_type' => $discount_type,
          'tax_rate' => $tax_rate,
          'tax_amount' => $tax_amount,
          //'amount'=>$amount,
          'net_amount' => $net_amount
        ], [], 1);

        if ($new_id) {
          $total_amount += $net_amount;
          $total_tax += $tax_amount;
          $total_cost += $itemInfo->cost;
          $success_cnt++;
        }
      }
    }

    $discount = isset($invoiceInfo['discount']) ? $invoiceInfo['discount'] : 0;
    $discount_type = isset($invoiceInfo['discount_type']) ? $invoiceInfo['discount_type'] : 0;
    self::updateAmounts($invoice_id, $discount, $discount_type);
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
    return (object)['item_count' => $success_cnt, 'total_tax' => $total_tax, 'total_cost' => $total_cost];
  }

  function delete($id = null, $ss = null)
  {
    if (!$ss) $ss = $this->getUserInfo();
    if (!$id) $id = $this->getInvoiceId();
    $branch_id = $ss->branch_id;
    if (!$id) return DV::error('Invoice not found!');
    DB::table("invoice_payments")->where('invoice_id', $id)->where('branch_id', $branch_id)->delete();
    DB::table("invoice_items")->where('invoice_id', $id)->where('branch_id', $branch_id)->delete();
    DB::table("invoices")->where('id', $id)->where('branch_id', $branch_id)->delete();
    return DV::success();
  }

  // static function details($id=null,$ss=null){
  //     ////if (!$ss) $ss = $this->getUserInfo();
  //     ////if(!$id) $id = $this->getInvoiceId(); 
  //     $branch_id = $ss->branch_id;
  //     $cols = ['invoice_class','v.id','ref_number','exchange_rate',DB::raw('formatDate(v.issue_date) AS issue_date'),DB::raw('formatDate(v.due_date) as due_date'),'customer_id','v.customer_phone','v.customer_email',DB::raw('NULL AS customer_tax_number'),'terms','v.billing_address','v.amount','v.discount_percent','v.discount_amount','discount_type','v.total_cost','signer_name','v.currency_code','v.exchange_rate','v.amount_due','v.tax_amount','v.tax_rate',DB::raw("(SELECT SUM(IFNULL(amount,0)) FROM invoice_payments WHERE invoice_id =v.id) AS amount_paid"),'v.pmt_bank_name','v.pmt_account_number','v.pmt_account_name','v.description','v.invoice_notes'];
  //     $rows =DB::table('invoices as v')->where('v.id',$id)->where('v.branch_id',$branch_id)->select($cols)->take(1)->get();
  //     foreach($rows as $row){
  //        $row->items = self::getInvoiceItems($ss,$id);
  //        return $row;
  //     }
  //     return null;
  // }

  static function details($id, $ss)
  {
    ////if (!$ss) $ss = $this->getUserInfo();
    ////if(!$id) $id = $this->getInvoiceId(); 
    $branch_id = $ss->branch_id;
    $customer_table = InvoiceSettings::$customer_table;
    $cols = ['invoice_class', 'v.id', 'ref_number', 'exchange_rate', DB::raw("(select code from $customer_table where id =v.customer_id LIMIT 1) AS customer_code"), DB::raw('formatDate(v.issue_date) AS issue_date'), DB::raw('formatDate(v.due_date) as due_date'), 'customer_id', 'v.customer_phone', 'v.customer_email', DB::raw('NULL AS customer_tax_number'), 'terms', 'v.billing_address', 'v.amount', 'v.discount_percent', 'v.discount_amount', 'discount_type', 'v.total_cost', 'signer_name', 'v.currency_code', 'v.exchange_rate', 'v.amount_due', 'v.tax_amount', 'v.tax_rate', DB::raw("(SELECT SUM(IFNULL(amount,0)) FROM invoice_payments WHERE invoice_id =v.id) AS amount_paid"), 'v.pmt_bank_name', 'v.pmt_account_number', 'v.pmt_account_name', 'v.description', 'v.invoice_notes'];
    $rows = DB::table('invoices as v')->where('v.id', $id)->where('v.branch_id', $branch_id)->select($cols)->take(1)->get();
    $data = self::getInvoiceItems($ss, $id);

    foreach ($rows as $row) {
      $row->products = $data->products;
      $row->services = $data->services;
      //$row->labo_tests = $data->labo_tests;
      return $row;
    }
    return null;
  }

  function getDetails($id = null, $ss = null)
  {
    if (!$ss) $ss = $this->getUserInfo();
    if (!$id) $id = $this->getInvoiceId();
    return self::details($id, $ss);
  }

  static function getProps($id, $cols)
  {
    $rows = DB::table("invoices")->where('id', $id)->select($cols)->take(1)->get();
    foreach ($rows as $row) return $row;
    return null;
  }

  //  static function getInvoiceItems($ss,$id){
  //    $branch_id = $ss->branch_id;
  //    $cols = ['i.id','i.item_id','i.item_code','i.item_name','i.description','i.qty','i.price','i.cost','i.sku','i.discount_percent','i.discount_amount','tax_rate','i.net_amount as line_total'];
  //    return DB::table('invoice_items as i')->where('i.invoice_id',$id)->where('i.branch_id',$branch_id)->select($cols)->orderBy('i.id','DESC')->get();
  //  }

  static function getInvoiceItems($ss, $id)
  {
    $branch_id = $ss->branch_id;
    $cols = ['invoice_item_class', 'i.id', 'i.item_id', 'i.item_code', 'i.item_name', 'i.description', 'i.qty', 'i.price', 'i.cost', 'i.sku', 'i.discount_percent', 'i.discount_amount', 'tax_rate', 'i.net_amount as line_total'];
    $rows = DB::table('invoice_items as i')->where('i.invoice_id', $id)->where('i.branch_id', $branch_id)->select($cols)->orderBy('invoice_item_class', 'ASC')->orderBy('i.id', 'DESC')->get();
    $products = [];
    $services = [];
    $labo_tests = [];
    foreach ($rows as $row) {
      $inv_item_class = strtolower($row->invoice_item_class);
      if ($inv_item_class === 'labo' || $inv_item_class === 'labo_test') {
        $labo_tests[] = $row;
      } else if ($inv_item_class === 'service') {
        $services[] = $row;
      } else $products[] = $row;
    }
    return (object)[
      'products' => $products,
      'services' => $services,
      'labo_tests' => $labo_tests
    ];
  }

  static function list($d, $ss)
  {
    //NOTE: self::$customer_table = "patients" for mClinic system, "customers" for accounting system
    $customer_table = InvoiceSettings::$customer_table;
    /** customers or patients table **/
    $branch_id = $ss->branch_id;
    $search_value = isset($d['search_value']) ? $d['search_value'] : null;
     
    $str_search = "1=1";
    if ($search_value) {
      $search_value = escape_like_str($search_value);
      $str_search = "(v.ref_number ='$search_value' OR p.phone_number ='$search_value' || CONCAT(p.last_name,' ',p.first_name) LIKE '%$search_value%' )";
    }
    $cols = ['v.id', DB::raw('formatDate(v.issue_date) as issue_date'), DB::raw('formatDate(v.due_date) as due_date'), 'v.ref_number', 'v.description', 'v.customer_id', DB::raw("CONCAT(p.last_name,' ',p.first_name) as customer_name"), 'p.phone_number as customer_phone', 'p.email as customer_email', 'c.billing_address', 'v.currency_code', 'v.amount', 'v.discount_amount', 'v.discount_percent', 'v.amount_due', 'v.amount_paid'];
    return DB::table("invoices AS v")->join($customer_table . " as c", 'c.id', '=', 'v.customer_id')->join('persons as p', 'p.id', '=', 'c.person_id')->where('v.branch_id', $branch_id)->whereRaw($str_search)->select($cols)->orderBy("v.id", "DESC")->get();
    
    //$rows = DB::table("invoices AS v")->join('customers as c','c.id','=','v.customer_id')->where('v.branch_id',$branch_id)->select($cols)->orderBy("v.id", "DESC")->get(); 
  }

  static function list_perginate($d, $ss)
  {
    //NOTE: self::$customer_table = "patients" for mClinic system, "customers" for accounting system
    $customer_table = InvoiceSettings::$customer_table;
    /** customers or patients table **/
    $branch_id = $ss->branch_id;
    $search_value = isset($d['search_value']) ? $d['search_value'] : null;
    $current_page = isset($d['current_page']) ? $d['current_page'] :1;
    $per_page = isset($d['per_page']) ? $d['per_page'] : 15;
    $skip_rows =($current_page - 1) * $per_page;

    $str_search = "1=1";
    if ($search_value) {
      $skip_rows=0;
      $search_value = escape_like_str($search_value);
      $str_search = "(v.ref_number ='$search_value' OR p.phone_number ='$search_value' || CONCAT(p.last_name,' ',p.first_name) LIKE '%$search_value%' )";
    }
    $cols = ['v.id', DB::raw('formatDate(v.issue_date) as issue_date'), DB::raw('formatDate(v.due_date) as due_date'), 'v.ref_number', 'v.description', 'v.customer_id', DB::raw("CONCAT(p.last_name,' ',p.first_name) as customer_name"), 'p.phone_number as customer_phone', 'p.email as customer_email', 'c.billing_address', 'v.currency_code', 'v.amount', 'v.discount_amount', 'v.discount_percent', 'v.amount_due', 'v.amount_paid'];
    $query = DB::table("invoices AS v")->join($customer_table . " as c", 'c.id', '=', 'v.customer_id')->join('persons as p', 'p.id', '=', 'c.person_id')->where('v.branch_id', $branch_id)->whereRaw($str_search)->select($cols)->orderBy("v.id", "DESC");
    $count = $query->count('v.id');
    
    $rows = $query->skip($skip_rows)->take($per_page)->get();
    //$rows = DB::table("invoices AS v")->join('customers as c','c.id','=','v.customer_id')->where('v.branch_id',$branch_id)->select($cols)->orderBy("v.id", "DESC")->get(); 
    return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
  }

  public function getInvoiceList($d, $ss = null)
  {
    if (!$ss) $ss = $this->getUserInfo();
    return self::list($d, $ss);
  }

  static function get($id = null, $ss = null)
  {
    return new Invoice($id, $ss);
  }

  //return Invoice's basic info (display info when receiving payment) => such as amount due, amount paid, ref_number, open amount
  public function getBasicInfo($id = null, $ss = null)
  {
    if (!$id) $id = $this->getInvoiceId();
    if (!$ss) $ss = $this->getUserInfo();
    return getDataRow('invoices', ['invoices.id' => $id], "id,amount_due,(SELECT SUM(IFNULL(amount,0)) FROM invoice_payments WHERE invoice_id =invoices.id) AS amount_paid,tax_amount,currency_code");
  }

  public function getPayments($invoice_id = null, $filter = [], $ss = null)
  {
    if (!$ss) $ss = $this->getUserInfo();
    $inv_id = $invoice_id ? $invoice_id : $this->getInvoiceId();
    $branch_id = isset($ss->branch_id) ? $ss->branch_id : null;
    return Payment::get(null, $ss)->list($inv_id, $filter);
    //if(!$inv_id) return [];
    //$cols = ['pmt.id','pmt.ref_number',DB::raw("DATE_FORMAT(pmt.payment_date,'%d %b %Y %r') AS payment_date"),'amount','pmt.tax_amount','pmt.currency_code','pmt.exchange_rate','pmt.create_user',DB::raw("DATE_FORMAT(pmt.created_at,'%d %b %Y %r') AS created_at"),"pmt.notes"];
    //return DB::table("invoice_payments as pmt")->where('pmt.invoice_id',$inv_id)->where('pmt.branch_id',$branch_id)->select($cols)->get();
  }

  public function getPaymentDetails($pmt_id, $ss = null)
  {
    if (!$ss) $ss = $this->getUserInfo();
    return Payment::get($pmt_id, $ss)->details();
  }

  //d = array {'id','invoice_id',[payer_name],amount,[payment_date]}
  public function receivePayment($d, $ss = null)
  {
    if (!isset($ss)) $ss = $this->getUserInfo();
    $branch_id = $ss->branch_id;
    $validate_rule = [
      "id" => "0|identity=1",
      "invoice_id" => "1|string|exists=invoices.id|text=Provided invoice id is not found!",
      "payment_date" => "1|date",
      "payer_name" => "0|string|0-50",
      "amount" => "1|positive",
      'pmt_method_id'=>'1|number|exists=payment_methods.id',
      "currency_code" => "0|string|0-10",
      "tax_amount" => "0|number|default=0",
      "notes" => "0|string"
    ];

    $res = validateObject($d, $validate_rule, true, [], $ss->lang, false, null);
    if ($res->error) return DV::error($res->error);

    $id = $res->id;
    $inputs = $res->values;
    //always use today date for receive payment
    $inputs['payment_date'] = getNowTime();
    $invoice_id = $inputs['invoice_id'];
    $payment_date = $inputs['payment_date'];
    //$tax_amount =$inputs['tax_amount'];
    $amount = $inputs['amount'];

    $invoice = self::getProps($invoice_id, ["id", DB::raw("(SELECT SUM(IFNULL(amount,0)) FROM invoice_payments WHERE invoice_id = invoices.id) AS amount_paid"), "amount_due", "currency_code", "tax_rate", "customer_id"]);
    if (!$invoice) return DV::error("Invoice identity is not valid");
    $amount_paid = $invoice->amount_paid;
    $tax_amount = $amount * $invoice->tax_rate / 100;
    $inputs['tax_amount'] = $tax_amount;
    if ($invoice->amount_due - $amount_paid <= 0) return DV::error("Invoice ID $invoice_id has been fully paid");
    $diff = $amount_paid + $amount - $invoice->amount_due;
    if ($diff > 0) return DV::error("Amount " . $amount . " " . $invoice->currency_code . " will cause invoice ID $invoice_id to be overpaid");
    $inputs['currency_code'] = $invoice->currency_code;
    $id = saveData($ss, "invoice_payments", ['id' => $id], $inputs, [], 1);
    if ($id > 0) {
      $xres = self::setReceiptNumber($branch_id, $id, "tax_line", $payment_date, null);
      $this->updateAmountPaid($invoice_id, $ss);
      $updated_invoice = $this->getProps($invoice_id, ["amount_paid", "tax_amount", "tax_rate"]);
      return DV::success([
        'id' => $id,
        'currency_code' => $invoice->currency_code,
        'amount_due' => $invoice->amount_due,
        'amount_paid' => $updated_invoice->amount_paid,
        'tax_rate' => $updated_invoice->tax_rate,
        'tax_amount' => $updated_invoice->tax_amount,
        'ref_number' => $xres->code
      ]);
    } else return DV::error("Something went wrong in saving payment information");
  }

  function updateAmountPaid($id = 0)
  {
    DB::statement(DB::raw("UPDATE invoices set amount_paid = (select SUM(amount) FROM invoice_payments WHERE invoice_id = $id),
     tax_amount = (select SUM(IFNULL(tax_amount,0)) FROM invoice_payments WHERE invoice_id =$id) 
     where id =$id"));
    return true;
  }

  //update invoices.amount,amount_due,tax_amount,tax_rate (average tax rate)
  static function updateAmounts($id = 0, $discount = 0, $discount_type = 'percentage')
  {
    //NOTE: important to ensure that the invoices.discount_amount has correct value before calling this method updateAmounts()
    self::updateInvoiceDiscount($id, $discount, $discount_type);
    DB::statement(DB::raw("UPDATE invoices set amount_due = (select SUM(net_amount) - IFNULL(invoices.discount_amount,0) FROM invoice_items WHERE invoice_id = $id),
    tax_amount = (select SUM(IFNULL(tax_amount,0)) FROM invoice_items WHERE invoice_id =$id),
    tax_rate = (select AVG(tax_rate) FROM invoice_items WHERE invoice_id =$id)
    WHERE id =$id"));
    //Not very important to update column "invoices.amount"
    DB::statement(DB::raw("UPDATE invoices set amount = amount_due + IFNULL(discount_amount,0) WHERE id =$id"));
    return true;
  }

  function getAmountPaid($id = 0)
  {
    $row = getDataRow('invoices', ['id' => $id], "amount_paid");
    if ($row) return $row->amount_paid;
    return 0;
  }

  public function receivePayments($pmts = [])
  {
    $success_cnt = 0;
    $failed_cnt = 0;
    $total_paid = 0;
    $total_tax_paid = 0;

    $ss = $this->userInfo;
    if (!$ss) return DV::error("Authentication failed", "en", 401);

    $invoice_id = $this->this_invoice_id;
    if (!$invoice_id) return DV::error("Invoice ID is not valid");
    $invoice = self::getProps($invoice_id, ['amount_due', 'amount_paid']);
    if (!$invoice) return DV::error("Invoice ID is not valid");
    $amount_due = $invoice->amount_due;
    $amount_paid = $invoice->amount_paid;

    //Error per invoice payment
    $item_errors = [];
    $failed_cnt = 0;
    $success_cnt = 0;
    foreach ($pmts as $pmt) {
      $invoice = self::getProps($pmt->invoice_id, ['id', 'amount_due', 'amount_paid', 'curreency_code']);
      if ($invoice) {
        $res = $this->receivePayment($ss, $pmt);
        if ($res->status_code === 200) {
          $amount = $pmt->amount;
          $diff =  $amount_paid + $amount - $amount_due;
          if ($diff > 0) {
            $failed_cnt++;
            $item_errors[] = "Failed to receive payment " . $amount . $invoice->currency_code . " for invoice " . $invoice->id . " because this amount can cause total payment to exceed original invoice amount";
          } else if ($diff === 0) {
            $failed_cnt++;
            $item_errors[] = "The invoice ID " . $invoice->id . " has been fully paid";
          } else {
            $success_cnt++;
          }
        } else {
          $failed_cnt++;
          $item_errors[] = $res->error_message;
        }
      } else {
        $failed_cnt++;
        $item_errors[] = "Failed to receive payment for invoice ID " . $invoice->id ? $invoice->id : 'NULL' . " because it does not exist";
      }
    }

    if ($success_cnt > 0) {
      return DV::success(['success_count' => $success_cnt, 'failed_count' => $failed_cnt, 'errors' => $item_errors]);
    } else return (object)[
      'status' => 'Error',
      'status_code' => 405,
      'error_message' => 'No payments were received',
      'errors' => $item_errors
    ];
  }
}