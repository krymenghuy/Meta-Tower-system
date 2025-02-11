<?php

namespace App\Models;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\UM;
//use Session;
use App\Security\Sanitizer;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\GeneralSettings;
use Illuminate\Pagination\LengthAwarePaginator; 
use Illuminate\Support\Facades\Log;
class PaymentTransaction //extends Model
{
    //use HasFactory;
    protected $id =null;
    protected $userInfo = null;
    function __construct($id=null,$userInfo=null){
         $this->id = $id;
         $this->userInfo = $userInfo;
    }
    function getId(){
      return $this->id;
    }
    function getUserInfo(){
      return $this->userInfo;
    }

    function createUniqID($uss,$len=12){
      $branch_id = $uss->branch_id;
      $user_id = $uss->user_id; //login_name
      return strtoupper(uniqid($branch_id.$user_id));
      // for ($randomNumber = mt_rand(1, 8), $i = 1; $i < 10; $i++) {
      //    $randomNumber .= mt_rand(0, 8);
      // }
      // return $branch_id.$result;
  }
  
  static function quickDetails($trx_id,$trx_type){
    $table ='cash_receipts';
    $agent_name = 'payer_name AS agent_name,';
    $agent_type = 'payer_type as agent_type,';
    $agent_id  ='payer_id AS agent_id,';

    if(strtolower($trx_type) =='disbursement'){
      $agent_name = 'payee_name AS agent_name,';
      $agent_type = 'payee_type as agent_type,';
      $agent_id  ='payee_id AS agent_id,';
      $table='cash_disbursements';
    }
    return DB::table($table.' as r')->whereRaw('r.trx_id =UNHEX(\''.$trx_id.'\')')->selectRaw('r.trx_id,formatTime(r.payment_date) AS payment_date,'.$agent_name.$agent_type.$agent_id.'r.amount,r.currency_code,r.create_user')->first();
  }

  function deleteTransaction($arr,$ss){
     $ss =$ss? $ss:$this->userInfo;
     $d = (object)$arr;
     $trx_id = $d->trx_id;
     $prn_id = -1;
     $trx_type = strtolower($d->trx_type);
     if($trx_type ==='receipt'){
       $pmtInfo = DB::table('cash_receipts AS r')->whereRaw('trx_id = UNHEX(\''.$trx_id.'\')')->selectRaw('r.payment_date,create_user,amount,payer_id,Lower(payer_type) AS payer_type')->first();
       if(!$pmtInfo) return DV::error('Cash receipt identity does not exist');
        if ($pmtInfo->payer_type =='driver') $prn_id = 275; else $prn_id = 276;
        if (! \App\Models\UM::allowed($prn_id)) return DV::error('Permission '.$prn_id.' is needed to delete the trasnaction');
        DB::table('receipt_breakdowns')->whereRaw('trx_id = UNHEX(\''.$trx_id.'\')')->delete();
        DB::table('cash_receipts')->whereRaw('trx_id = UNHEX(\''.$trx_id.'\')')->delete();
        if (strtolower($pmtInfo->payer_type) =='driver')
           DB::table('package')->whereRaw('driver_trx_id = UNHEX(\''.$trx_id.'\')')->update(['driver_pmt_status_id'=>0,'driver_trx_id'=>null]);
        else
           DB::table('package')->whereRaw('sender_trx_id = UNHEX(\''.$trx_id.'\')')->update(['sender_pmt_status_id'=>0,'sender_trx_id'=>null]);
        return DV::success();
     }else{
          $pmtInfo = DB::table('cash_disbursements AS r')->whereRaw('trx_id = UNHEX(\''.$trx_id.'\')')->selectRaw('r.payment_date,create_user,amount,payee_id,payee_type')->first();
          if(!$pmtInfo) return DV::error('Cash disbursement identity does not exist');
          if ($pmtInfo->payee_type =='driver') $prn_id = 275; else $prn_id = 276;
          if (! \App\Models\UM::allowed($prn_id)) return DV::error('Permission '.$prn_id.' is needed to delete the trasnaction');
          DB::table('disbursement_breakdowns')->whereRaw('trx_id = UNHEX(\''.$trx_id.'\')')->delete();
          DB::table('cash_disbursements')->whereRaw('trx_id = UNHEX(\''.$trx_id.'\')')->delete();
          if (strtolower($pmtInfo->payee_type) =='driver')
              DB::table('package')->whereRaw('driver_trx_id = UNHEX(\''.$trx_id.'\')')->update(['driver_pmt_status_id'=>0,'driver_trx_id'=>null]);
          else
              DB::table('package')->whereRaw('sender_trx_id = UNHEX(\''.$trx_id.'\')')->update(['sender_pmt_status_id'=>0,'sender_trx_id'=>null]);
          return DV::success();
     }
  }

 //NOTE: one settlement can have two transactions of payment. One is in Cash, ther other by Bank Transfer. So settlement_id embraces all transactions within one settlement
 function getSettlementId($branch_id,$trx_type, $trx_id){
  $table ='cash_receipts';
  if($trx_type =='disbursement') $table ='cash_disbursements';
  $rows = DB::table($table)->where('branch_id',$branch_id)->where('id',$trx_id)->selectRaw('settlement_id')->limit(1)->get();
  foreach($rows as $row) return $row->settlement_id;
  return null;
}

//$d = {'settlement_id'} OR $d = {'id'} //for trx_id
function deleteCashDisbursement($d){
 $ss = UM::getUserInfoByToken($d);
 if ($ss->status_code !==200) return $ss; //user not authenticated
  //need permission to do this task
 $branch_id = Sanitizer::sanitize($ss->branch_id); 
 $id = isset($d->id)?$d->id:null;
 $settlement_id = isset($d->settlement_id)?$d->settlement_id:null;
 if (!$settlement_id) $settlement_id = $this->getSettlementId($branch_id,'disbursement',$id); 

 DB::table('package')->where('branch_id',$branch_id)->where('sender_settlement_id',$settlement_id)->update(array(
   'settlement_id'=>null,
   'sender_pmt_status_id'=>0
 ));
 DB::table('cash_disbursements')->where('branch_id',$branch_id)->where('settlement_id',$settlement_id)->delete();
 return null;
}

//return amount due from each driver since 31 days ago
//getAmountDue by driver and this method is used in Driver Mobile App
function getDriverDueInfo($driver_id,$start_date = null,$end_date=null){
  if (!$driver_id) return (object)[
    'amount'=>0,
    'package_count'=>0
  ];
  $str_dates = '3=3';
  if($start_date && $end_date){
     $str_dates = 'DATE(p.delivery_time) >=\''.$start_date.'\' AND DATE(p.delivery_time) <= \''.$end_date.'\'';
  }
  $str_pmt = 'p.status_id = 8 AND IFNULL(p.driver_pmt_status_id,0) =0';
  //$last_week_date = convertDate(Carbon::now()->addDay(-31));
  //$more_wheres = 'DATE(p.delivery_time) >= \''.$last_week_date.'\' AND IFNULL(p.driver_pmt_status_id,0) = 0 AND p.status_id = 8';
  $rows = DB::table('package AS p')->where('p.driver_id', $driver_id)->whereRaw($str_pmt)->whereRaw($str_dates)->selectRaw('SUM(IFNULL(p.driver_total,0)) AS total,COUNT(p.id) AS item_count')->get();
  foreach($rows as $row){
    return (object)[
      'amount'=> ($row? $row->total: 0),
      'package_count'=> ($row? $row->item_count:0)
   ];
  }
  return (object)[
    'amount'=> 0,
    'package_count'=>0
 ];
}

//used to return Transactions data to Driver's mobile app
function getTransactionList_driver($arr, $ss=null){
    $ss = $ss?$ss:$this->userInfo;
    $d = (object)$arr;
    $branch_id = Sanitizer::sanitize($ss->branch_id); 
    $driver_id = isset($d->driver_id)?$d->driver_id:null;
    $start_date = isset($d->start_date)?$d->start_date:null;
    $end_date = isset($d->end_date)?$d->end_date:null; 
    
    $start_date = convertDate($start_date);
    $end_date = convertDate($end_date);
    if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
    if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
    
    //Where payer_type ="driver"
    $more_wheres ='DATE(r.payment_date) >= \''.$start_date.'\' AND DATE(r.payment_date) <=\''.$end_date.'\' ';
    $select_cols ='NULL AS file_name,0 AS package_count,HEX(r.trx_id) AS trx_id, HEX(r.trx_id) AS settlement_id,r.payer_id,r.payer_name, r.payer_type, formatTime(r.payment_date) AS payment_date,IFNULL(r.remarks,CONCAT(\'Payment For \',r.package_count,\' pcs\')) AS description, r.amount,r.currency_code, \'Receipt\' AS pmt_type, \'Receipt\' AS trx_type,r.create_user AS cashier_name,r.authorized,r.auth_user,formatTime(r.auth_date) AS auth_date';
    $rows = DB::table('cash_receipts AS r')->where('r.branch_id',$branch_id)->where('r.payer_type','driver')->where('payer_id',$driver_id)->whereRaw($more_wheres)->selectRaw($select_cols)->orderByRaw('r.create_date DESC')->get(); 
    
    $cnt= 0;
    $total_amount =0;
    foreach($rows as $row){

      if (strtolower($row->trx_type)=='receipt') $bs_table ='receipt_breakdowns'; else $bs_table ='disbursement_breakdowns';
      $bs = DB::table($bs_table.' as bs')->whereRaw('bs.trx_id = UNHEX(\''.$row->trx_id.'\')')->selectRaw('bs.pmt_method,bs.currency_code,bs.amount,bs.exchange_rate,bs.notes')->get();
      $notes = '';
      foreach($bs as $x){
        $notes .= ($notes? '|':''). $x->pmt_method.' '.$x->amount.' '.$x->currency_code; 
      }
      $row->pmt_method = $notes;

      if($row->file_name) $row->image_url = XPublicStorage::getUrl($branch_id,'driver','image').$row->file_name;
      else  $row->image_url =null;
      $row->file_name = null;
      $total_amount += $row->amount;
      $cnt++;
    }
    $dueInfo = $this->getDriverDueInfo($driver_id);
    return (object)['amount_due'=>$dueInfo->amount,'package_count'=>$dueInfo->package_count,'count'=>$cnt?$cnt:0,'total'=>$total_amount?number_format($total_amount,2,'.',''):0,'transactions'=>$rows,'currency'=>'USD'];
 }
   
static function mergeWithDisbursements($branch_id,$data,$remaining_count=0,$agent_id='1=1',$str_dates='2=2',$str_authorize='3=3'){
    //Get disbursement tranactions if receipt transactions queried less then the $per_page count
      if ($agent_id >0) $str_agent ='payee_id = '.$agent_id;
      $cols ='HEX(r.trx_id) AS trx_id,\'Disbursement\' AS trx_type,r.payee_id AS agent_id,r.payee_name AS agent_name, r.payee_type AS agent_type,r.currency_code,formatTime(r.payment_date) AS payment_date,r.package_count, r.remarks, r.amount,r.update_user,r.update_date,r.create_user,r.create_date,authorized,auth_user,formatTime(auth_date) as auth_date';
      $disbursement_query = DB::table('cash_disbursements AS r')->where('r.branch_id',$branch_id)->where('r.payer_type','driver')->whereRaw($str_agent)->whereRaw($str_dates)->whereRaw($str_authorize)->take($remaining_count)->selectRaw($cols);
      $d_count = (clone $disbursement_query)->count('r.trx_id');
      $rows = $disbursement_query->take($remaining_count)->get();

}

static function getBankAccountInfo($agent_type,$agent_id){
   $table = 'sender_bank_accounts';
   if($agent_type==='driver') return 'No Bank Account';
   $b_notes = '';
   $rows = DB::table($table.' AS b')->where('sender_id',$agent_id)->where('is_primary',1)->selectRaw('b.bank_name,b.account_number,b.account_name')->get();
   foreach($rows AS $row){
    $b_notes .= ($b_notes? ';':'').$row->bank_name.': '.$row->account_number.'|'.$row->account_name;
   }
   return $b_notes;
}

static function getBreakdownNotes($trx_type, $trx_id){
  $bs_table ='receipt_breakdowns';
  if(strtolower($trx_type) =='disbursement') $bs_table ='disbursement_breakdowns';
  $bs = DB::table($bs_table .' as bs')->whereRaw('bs.trx_id = UNHEX(\''.$trx_id.'\')')->selectRaw('bs.pmt_method,bs.currency_code,bs.amount,bs.exchange_rate,bs.notes')->get();
  $notes = '';
  foreach($bs as $x){
    $amount = number_format($x->amount, 2, '.', ',');
    $notes .= ($notes? '|':''). $x->pmt_method.' '.$amount.' '.$x->currency_code; 
  }
}

//return "balance due" to driver App
function getDriverBalanceDue($driver_id,$start_date = null,$end_date=null){
  if(!$driver_id) return 0;
  $str_dates = '3=3';
  if($start_date && $end_date){
     $str_dates = 'DATE(p.delivery_time) >= \''.$start_date.'\' AND DATE(p.delivery_time) <=\''.$end_date.'\'';
  }
  $balance_due = DB::table('package as p')->where('driver_id',$driver_id)->whereRaw($str_dates)->whereRaw('IFNULL(p.driver_pmt_status_id,0) =0')->where('p,status_id',8)->sum('p.driver_total');
  return $balance_due ?? 0;
}

//getTransactions_driver() _driver transactions_driver transaction_driver is used For Admin Backend only. So far, getTransactions_driver() show only list of  payments from driver
//getPaymentsFromDriver()
function getTransactions_driver($arr, $ss){
  $ss = $ss?$ss:$this->userInfo;
  $branch_id = Sanitizer::sanitize($ss->branch_id); 
  $d = (object)$arr;
  $use_paginate = isset($d->use_paginate)?$d->use_paginate:null;
  if($use_paginate===null ||  $use_paginate ==1)  $use_paginate = true;
  $trx_type = strtolower(isset($d->trx_type)?$d->trx_type:'all');

  $current_page =isset($d->current_page)?$d->current_page:1;
  $per_page =isset($d->per_page)?$d->per_page:10;
  if(!is_numeric($current_page)) $current_page=1;
  $skip_rows = ($current_page -1) * $per_page;

  /* $status_id =>  1= Pending 2= Approved. translated to 1 become 0 (Pending), 2 Becomes 1 (Authorized) in database */
  $status_id = isset($d->status_id)?$d->status_id:null; 
  $driver_id = isset($d->driver_id)?$d->driver_id:null;
  $start_date = isset($d->start_date)?$d->start_date:null;
  $end_date = isset($d->end_date)?$d->end_date:null; 
  
  $use_all_dates = false;
  $start_date = convertDate($start_date) ?? date('Y-m-d');
  $end_date = convertDate($end_date) ?? date('Y-m-d');
  // if (!(bool)strtotime($start_date) && !(bool)strtotime($end_date)){
  //    if($status_id ==2){
  //       //If No dates selected, and "status = Approved" => then show Approved payments within from Yesterday to Today
  //       $start_date =date('Y-m-d', strtotime('-1 day'));
  //       $end_date = date('Y-m-d');
  //    }else $use_all_dates = true;
  // }else{
  //   if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
  //   if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
  // }
  
  $str_authorize = '';
  $str_payee =null;
  $str_payer =null;
  if ($driver_id >0){
    $str_payee =' AND payee_id = '.$driver_id;
    $str_payer =' AND payer_id = '.$driver_id;
  }else{
    if ($use_all_dates) $status_id =1;
  } 

  if ($status_id > 0){
     $authorized = $status_id ==2? 1:0;
     $str_authorize = ' AND IFNULL(r.authorized,0) = '.$authorized;
     //If user View Pending transaction, then show trasnaction for All Dates
     //if (!$authorized) $use_all_dates = true;
  } 

  $str_type_out =null;
  $str_type_in =null;
  if ($trx_type =='disbursement'){
    $str_type_out =null;
    $str_type_in ='1=3';
  }else if($trx_type =='receipt'){
    $str_type_out ='1=5';
    $str_type_in =null;
  }

  $str_paginate ='';
   
  if ($use_paginate) $str_paginate = ' LIMIT '.$per_page.' OFFSET '.$skip_rows;
  $str_dates =  $use_all_dates? '': ' AND DATE(r.payment_date) >= \''.$start_date.'\' AND DATE(r.payment_date) <=\''.$end_date.'\' ';
  $str_order_by = ' ORDER BY r.payer_name ASC';
  $cols ='HEX(r.trx_id) AS trx_id,\'Receipt\' AS trx_type,r.payer_id AS agent_id,r.payer_name as agent_name, r.payer_type AS agent_type,r.currency_code,formatTime(r.payment_date) AS payment_date,r.package_count, RTRIM(r.breakdown_notes) AS pmt_breakdowns, IFNULL(r.remarks,\'NA\') As remarks,r.cod_amount,r.fees,r.taxi_fees,r.amount,r.update_user,r.update_date,r.create_user,r.create_date,authorized,auth_user,formatTime(auth_date) as auth_date,file_name';
  $sql_in = 'SELECT '.$cols.' FROM `cash_receipts` as `r` '.
  ' WHERE `r`.`branch_id` = \''.$branch_id.'\' AND `r`.`payer_type` = \'driver\''.$str_payer.$str_dates.($str_type_in? ' AND '.$str_type_in:'').$str_authorize.$str_order_by.$str_paginate;
  
  $str_order_by = ' ORDER BY r.payee_name ASC';
  $cols ='HEX(r.trx_id) AS trx_id,\'Disbursement\' AS trx_type,r.payee_id AS agent_id,r.payee_name as agent_name, r.payee_type AS agent_type,r.currency_code,formatTime(r.payment_date) AS payment_date,r.package_count,RTRIM(r.breakdown_notes) AS pmt_breakdowns, IFNULL(r.remarks,\'NA\') As remarks,r.cod_amount,r.fees,r.taxi_fees,r.amount,r.update_user,r.update_date,r.create_user,r.create_date,authorized,auth_user,formatTime(auth_date) as auth_date,file_name';
  $sql_out = 'SELECT '.$cols.' FROM `cash_disbursements` as `r` '.
  ' WHERE `r`.`branch_id` = \''.$branch_id.'\' and `r`.`payee_type` = \'driver\''. $str_payee.$str_dates.$str_authorize.($str_type_out? ' AND '.$str_type_out:'').$str_order_by;
   
  $rem_count = 0;
  $a_count = DB::table('cash_receipts as r')->where('r.branch_id',$branch_id)->where('r.payer_type','driver')->whereRaw(($str_payer? '1=1 '.$str_payer:'1=1 ').$str_dates.$str_authorize)->whereRaw($str_type_in?$str_type_in:'7=7')->skip($skip_rows)->take($per_page)->count('r.trx_id');  
  $a_count = is_numeric($a_count)? $a_count:0;
  $rem_count = $per_page - $a_count;
   
  if($rem_count > 0){
     $str_paginate = $use_paginate? ' LIMIT '.$rem_count.' OFFSET 0':'';
     $sql = '('.$sql_in.')'.' UNION ('.$sql_out. $str_paginate.')';
  } else{
    if($use_paginate)
    {
      $sql = $sql_in;
    }  
     else $sql = '('.$sql_in.')'.' UNION ('.$sql_out.')';   
  }
 
  $sum_row_in = DB::table('cash_receipts as r')->where('r.branch_id',$branch_id)->where('r.payer_type','driver')->whereRaw($str_type_in? $str_type_in:'11=11')->whereRaw(($str_payer? '1=1 '.$str_payer:'1=1 ').$str_dates.$str_authorize)->selectRaw('(SUM(CASE IFNULL(r.authorized,0) WHEN 0 THEN 1 ELSE 0 END)) AS unauth_count, SUM(r.amount) As trx_total, COUNT(r.trx_id) AS trx_count')->get()->first(); 
  $sum_row_out = DB::table('cash_disbursements as r')->where('r.branch_id',$branch_id)->where('r.payee_type','driver')->whereRaw($str_type_out? $str_type_out:'9=9')->whereRaw(($str_payee? '1=1 '.$str_payee: '1=1 ').$str_dates.$str_authorize)->selectRaw('(SUM(CASE IFNULL(r.authorized,0) WHEN 0 THEN 1 ELSE 0 END)) AS unauth_count, SUM(r.amount) As trx_total, COUNT(r.trx_id) AS trx_count')->get()->first();
  $count = ($sum_row_out? $sum_row_out->trx_count:0) + ($sum_row_in?$sum_row_in->trx_count:0);
  $total = ($sum_row_out? $sum_row_out->trx_total:0) + ($sum_row_in? $sum_row_in->trx_total:0);
  $unauth_count = ($sum_row_out?$sum_row_out->unauth_count:0) + ($sum_row_in?$sum_row_in->unauth_count:0);
  $rows = DB::select(DB::raw($sql));
  
  /** BEGIN:: Calculate Overall breakdown items by pmt_method */
      //$str_payee1 = $str_payee?  $str_payee:'';
      //$str_payer1 = $str_payer? $str_payer:'';
      $bs_sql_in ='SELECT SUM(b.amount) AS amount,b.currency_code,b.pmt_method FROM  receipt_breakdowns AS b INNER JOIN cash_receipts as r ON r.trx_id = b.trx_id WHERE r.branch_id ='.$branch_id.' AND r.payer_type =\'Driver\' '.($str_type_out? ' AND '.$str_type_out:''). $str_payer.$str_dates.$str_authorize.' GROUP BY b.pmt_method,b.currency_code';
      $bs_sql_out ='SELECT SUM(b.amount) AS amount,b.currency_code,b.pmt_method FROM  disbursement_breakdowns AS b INNER JOIN cash_disbursements as r ON r.trx_id = b.trx_id WHERE r.branch_id ='.$branch_id.' AND r.payee_type =\'Driver\' '.($str_type_out? ' AND '.$str_type_out:''). $str_payee.$str_dates.$str_authorize.'  GROUP BY b.pmt_method,b.currency_code'; 
     
      $bs_row_in = DB::select(DB::raw($bs_sql_in));
      $bs_row_out = DB::select(DB::raw($bs_sql_out)); 
     
      $bds = [];
      foreach($bs_row_in as $b_row){
        if(!isset($bds[$b_row->pmt_method])) $bds[$b_row->pmt_method] = [];
        if (!isset($bds[$b_row->pmt_method][$b_row->currency_code])) $bds[$b_row->pmt_method][$b_row->currency_code] = $b_row->amount;
      }

      foreach($bs_row_out as $b_row){
        if(!isset($bds[$b_row->pmt_method])) $bds[$b_row->pmt_method] = [];
        if (isset($bds[$b_row->pmt_method][$b_row->currency_code])) $bds[$b_row->pmt_method][$b_row->currency_code] -= abs($b_row->amount);
        else $bds[$b_row->pmt_method][$b_row->currency_code] = -abs($b_row->amount);
      }

  /** END:: Calculate Overall breakdown items by pmt_method */

  foreach($rows as $row){
    if($use_paginate && $row->file_name) $row->image_url = XPublicStorage::getUrl($branch_id,'driver','image').$row->file_name;
    else $row->image_url = null;
     //$row->pmt_breakdowns = self::getBreakdownNotes($row->trx_type,$row->trx_id);
     /** Driver does not need to have bank account */
     //$row->bank_account_info = self::getBankAccountInfo($row->agent_type,$row->agent_id);
  }

  $paginate_rows = null;
  if($use_paginate) $paginate_rows = new LengthAwarePaginator($rows, $count, $per_page, $current_page);
   
  $currency_code = 'USD';
  $dueInfo = self::getDriverDueInfo($driver_id,$start_date,$end_date);
  return (object)[
      'start_date'=>date('d-m-Y',strtotime($start_date)),
      'end_date'=>date('d-m-Y',strtotime($end_date)),
      'balance_due'=>$dueInfo->amount ?? 0,
      'package_count'=>$dueInfo->package_count,
      'total'=>$total?$total:0,
      'pmt_breakdowns'=>$bds,
      'unauth_count'=> $unauth_count,
      'currency_code'=>$currency_code,
      'payment_count'=>$count,
      'data'=> ($use_paginate? $paginate_rows: $rows)
  ];
}

/** getTransactions_sender  | merchant transactions V2 */
function getTransactions_merchant($arr, $ss){
    $ss = $ss?$ss:$this->userInfo;
    $branch_id = Sanitizer::sanitize($ss->branch_id); 
    $d = (object)$arr;
    $use_paginate = isset($d->use_paginate)?$d->use_paginate:null;
    if($use_paginate===null ||  $use_paginate ==1)  $use_paginate = true;
    $trx_type = strtolower(isset($d->trx_type)?$d->trx_type:'all');

    $current_page =isset($d->current_page)?$d->current_page:1;
    $per_page =isset($d->per_page)?$d->per_page:10;
    if(!is_numeric($current_page)) $current_page=1;
    $skip_rows = ($current_page -1) * $per_page;

    /* $status_id =>  1= Pending 2= Approved. translated to 1 become 0 (Pending), 2 Becomes 1 (Authorized) in database */
    /** For merchant transaction  => there is no authorization */  
    $status_id = null; 
    $sender_id = isset($d->sender_id)?$d->sender_id:null;
    $start_date = isset($d->start_date)?$d->start_date:null;
    $end_date = isset($d->end_date)?$d->end_date:null; 
    $start_date = convertDate($start_date) ?? date('Y-m-d');
    $end_date = convertDate($end_date) ?? date('Y-m-d');

    $str_authorize = '';
    $str_payee =null;
    $str_payer =null;
    if ($sender_id >0){
      $str_payee =' AND payee_id = '.$sender_id;
      $str_payer =' AND payer_id = '.$sender_id;
    }
    if ($status_id > 0){
       $authorized = $status_id ==2? 1:0;
       $str_authorize = ' AND r.authorized = '.$authorized;
    } 
 
    $str_type_out =null;
    $str_type_in =null;
    if ($trx_type =='receipt'){
      $str_type_out ='1=4';
      $str_type_in =null;
    }else if($trx_type =='disbursement')
    {
      $str_type_out =null;
      $str_type_in ='1=3';
    }

    $str_paginate ='';
     
    if ($use_paginate) $str_paginate = ' LIMIT '.$per_page.' OFFSET '.$skip_rows;
    $str_order_by = ' ORDER BY r.payment_date ASC';
    $str_dates =' AND DATE(r.payment_date) >= \''.$start_date.'\' AND DATE(r.payment_date) <=\''.$end_date.'\' ';
    $cols ='HEX(r.trx_id) AS trx_id,\'Disbursement\' AS trx_type,r.payee_id AS agent_id,r.payee_name as agent_name, r.payee_type AS agent_type,r.currency_code,formatTime(r.payment_date) AS payment_date,r.package_count,RTRIM(r.breakdown_notes) AS pmt_breakdowns, IFNULL(r.remarks,\'NA\') AS remarks,r.cod_amount,r.fees,r.taxi_fees, r.amount,r.update_user,r.update_date,r.create_user,r.create_date,authorized,auth_user,formatTime(auth_date) as auth_date,file_name';
    $sql_out = 'SELECT '.$cols.' FROM `cash_disbursements` as `r` '.
    ' WHERE `r`.`branch_id` = \''.$branch_id.'\' and `r`.`payee_type` = \'merchant\''. $str_payee.$str_dates.$str_authorize.($str_type_out? ' AND '.$str_type_out:'').$str_order_by. $str_paginate;
    
    $str_order_by =' ORDER BY r.payment_date ASC';
    $cols ='HEX(r.trx_id) AS trx_id,\'Receipt\' AS trx_type,r.payer_id AS agent_id,r.payer_name as agent_name, r.payer_type AS agent_type,r.currency_code,formatTime(r.payment_date) AS payment_date,r.package_count, RTRIM(r.breakdown_notes) AS pmt_breakdowns,IFNULL(r.remarks,\'NA\') AS remarks,r.cod_amount,r.fees,r.taxi_fees, r.amount,r.update_user,r.update_date,r.create_user,r.create_date,authorized,auth_user,formatTime(auth_date) as auth_date,file_name';
    $sql_in = 'SELECT '.$cols.' FROM `cash_receipts` as `r` '.
    ' WHERE `r`.`branch_id` = \''.$branch_id.'\' AND `r`.`payer_type` = \'merchant\''.$str_payer.$str_dates.($str_type_in? ' AND '.$str_type_in:'').$str_authorize.$str_order_by;

    $rem_count = 0;
    //$str_where = ' WHERE `r`.`branch_id` = \''.$branch_id.'\' and `r`.`payee_type` = \'merchant\''. $str_payee.$str_dates.$str_authorize.($str_type_out? ' AND '.$str_type_out:'').$str_order_by. $str_paginate;
    //$count_rows = DB::select(DB::raw('SELECT COUNT(r.trx_id) AS cnt FROM cash_disbursements AS r '.$str_where));
    // $a_count =0;
    // foreach ($count_rows as $c_row ) $a_count = $c_row->cnt; 
    // $a_count = is_numeric($a_count)? $a_count:0;
    $c_rows = DB::table('cash_disbursements as r')->whereRaw('r.branch_id ='.$branch_id)->whereRaw('r.payee_type =\'merchant\'')->whereRaw(($str_payee? '1=1 '.$str_payee:'1=1 ').$str_dates.$str_authorize)->whereRaw($str_type_out?$str_type_out:'6=6')->selectRaw('payee_id')->skip($skip_rows)->take($per_page)->get(); 
    $a_count = count($c_rows);
    $rem_count = $per_page - $a_count;
    //Log::info('a_count = '.$a_count);
    if($rem_count > 0){
       $str_paginate = $use_paginate? ' LIMIT '.$rem_count.' OFFSET 0':'';
       $sql = '('.$sql_out.')'.' UNION ('.$sql_in. $str_paginate.')'; 
    } else{
      if($use_paginate){
        $sql = $sql_out;
      }
      else $sql = '('.$sql_out.')'.' UNION ('.$sql_in.')';   
    }

    //**IMPORTANT NOTE: $str_payer and $str_payee must contain ONLY one "and" at the beginning or otherwise does not contain any "AND" => example:  " AND r.payer_id =150" */
    $str_payer1 = $str_payer? str_replace('and','',strtolower($str_payer)): '9=9';
    $str_payee1 = $str_payee? str_replace('and','',strtolower($str_payee)): '9=9';
   
    $sum_row_out = null;
    if($trx_type =='all' || $trx_type =='disbursement') $sum_row_out = DB::table('cash_disbursements as r')->join('disbursement_breakdowns as b','b.trx_id','=','r.trx_id')->where('r.branch_id',$branch_id)->where('r.payee_type','merchant')->whereRaw($str_payee1.$str_dates.$str_authorize)->selectRaw('(SUM(CASE IFNULL(r.authorized,0) WHEN 0 THEN 1 ELSE 0 END)) AS unauth_count, SUM(r.cod_amount) AS total_cod, SUM(r.fees) AS total_fees, SUM(r.taxi_fees) AS total_taxi_fees, SUM(r.amount) As trx_total,COUNT(r.trx_id) AS trx_count')->get()->first();
   
    $sum_row_in = null;
    if($trx_type =='all' || $trx_type =='receipt') $sum_row_in = DB::table('cash_receipts as r')->join('receipt_breakdowns as b','b.trx_id','=','r.trx_id')->where('r.branch_id',$branch_id)->where('r.payer_type','merchant')->whereRaw($str_payer1.$str_dates.$str_authorize)->selectRaw('(SUM(CASE IFNULL(r.authorized,0) WHEN 0 THEN 1 ELSE 0 END)) AS unauth_count, SUM(r.cod_amount) AS total_cod, SUM(r.fees) AS total_fees, SUM(r.taxi_fees) AS total_taxi_fees,SUM(r.amount) As trx_total, COUNT(r.trx_id) AS trx_count')->get()->first();
     
    $count = ($sum_row_out? $sum_row_out->trx_count:0) + ($sum_row_in?$sum_row_in->trx_count:0);
    $out_amount = $sum_row_out? $sum_row_out->trx_total:0;
    $in_amount =$sum_row_in? $sum_row_in->trx_total:0;
    $total = 0;
    if($trx_type =='disbursement') 
      $total = $out_amount;
    else if ($trx_type == 'receipt')
      $total = $in_amount;
    else $total = $out_amount - $in_amount;
    $total_cod = ($sum_row_out? $sum_row_out->total_cod:0) + ($sum_row_in? $sum_row_in->total_cod:0);
    $total_fees = ($sum_row_out? $sum_row_out->total_fees:0) + ($sum_row_in? $sum_row_in->total_fees:0);
    $total_taxi_fees = ($sum_row_out? $sum_row_out->total_taxi_fees:0) + ($sum_row_in? $sum_row_in->total_taxi_fees:0);
    $unauth_count = ($sum_row_out?$sum_row_out->unauth_count:0) + ($sum_row_in?$sum_row_in->unauth_count:0);
    $rows = DB::select(DB::raw($sql));
    
    /*** BEGIN:: Calculate Overall breakdown items by pmt_method */
        //$str_payee1 = $str_payee? $str_payee:'';
        //$str_payer1 = $str_payer? $str_payer:'';
        $bs_sql_out = null;
        if($trx_type=='all' || $trx_type =='disbursement') $bs_sql_out ='SELECT SUM(b.amount) AS amount,b.currency_code,b.pmt_method FROM  disbursement_breakdowns AS b INNER JOIN cash_disbursements as r ON r.trx_id = b.trx_id WHERE r.branch_id ='.$branch_id.' AND r.payee_type =\'Merchant\' '. $str_payee.$str_dates.$str_authorize.'  GROUP BY b.pmt_method,b.currency_code'; 
        $bs_sql_in =null;
        if($trx_type=='all' || $trx_type =='receipt') $bs_sql_in ='SELECT SUM(b.amount) AS amount,b.currency_code,b.pmt_method FROM  receipt_breakdowns AS b INNER JOIN cash_receipts as r ON r.trx_id = b.trx_id WHERE r.branch_id ='.$branch_id.' AND r.payer_type =\'Merchant\' '. $str_payer.$str_dates.$str_authorize.' GROUP BY b.pmt_method,b.currency_code';
        
        $bs_row_out = $bs_sql_out ? DB::select(DB::raw($bs_sql_out)) : null; 
        $bs_row_in = $bs_sql_in ? DB::select(DB::raw($bs_sql_in)): null;
        $bds = [];
        if($bs_row_in){
          foreach($bs_row_in as $b_row){
            if(!isset($bds[$b_row->pmt_method])) $bds[$b_row->pmt_method] = [];
            if (!isset($bds[$b_row->pmt_method][$b_row->currency_code])) $bds[$b_row->pmt_method][$b_row->currency_code] =  $b_row->amount;
          }  
        }
       if($bs_row_out){
        foreach($bs_row_out as $b_row){
          if(!isset($bds[$b_row->pmt_method])) $bds[$b_row->pmt_method] = [];
          if (isset($bds[$b_row->pmt_method][$b_row->currency_code])) $bds[$b_row->pmt_method][$b_row->currency_code] -= abs($b_row->amount);
          else $bds[$b_row->pmt_method][$b_row->currency_code] =  -abs($b_row->amount);
        }
       }
    /*** END:: Calculate Overall breakdown items by pmt_method */

    foreach($rows as $row){
      if($use_paginate && $row->file_name) $row->image_url = XPublicStorage::getUrl($branch_id,'merchant','image').$row->file_name;
      else $row->image_url = null;
      $row->bank_account_info = self::getBankAccountInfo($row->agent_type,$row->agent_id);
    }
 
    $paginate_rows = null;
    if($use_paginate) $paginate_rows = new LengthAwarePaginator($rows, $count, $per_page, $current_page);
     
    $currency_code = 'USD';
    return (object)[
        'start_date'=>$start_date,
        'end_date'=>$end_date,
        'total'=>$total?$total:0,
        'total_cod'=>number_format($total_cod,2),
        'total_fees'=>number_format($total_fees,2),
        'total_taxi_fees'=>number_format($total_taxi_fees,2),
        'pmt_breakdowns'=>$bds,
        'unauth_count'=> $unauth_count,
        'currency_code'=>$currency_code,
        'currency_symbol'=>'$',
        'payment_count'=>$count,
        'data'=> ($use_paginate? $paginate_rows: $rows)
    ];
}
  
/** Make payment to merchant or driver alike. payToMerchant() payToDriver() */
function makePayment($arr,$ss=null){
  $ss = $ss?$ss:$this->userInfo;
  $v_rule = [
    'agent_id'=>'1|number',
    'agent_type'=>'1|choice|Driver,Merchant,driver,merchant',
    'trx_type'=>'0|choice|Disbursement,disbursement',
    'total'=>'1|number|default=0',
    //'exchange_rate'=>'1|number|default=1',
    'package_count'=>'0|number|default=0',
    'currency'=>'1|string|1-10|default=USD',
    'remarks'=>'0|string|250',
    'packages'=>'1|string',
    'breakdowns'=>'1|array'
  ];
  $res = DBX::validateObject($arr,$v_rule,true,['notes' => [':','.','$','-'],'remarks' => [':','.','$','-'],'packages'=>[',','|',';']],$ss->lang,false,null);
  if($res->error) return DV::error($res->error);
  $d = (object)$res->values;
  if(!$d->packages) return DV::error('No package list provided');
  $currency_code = isset($d->currency_code)?$d->currency_code:null;
  if(!$currency_code) $currency_code = isset($d->currency)? $d->currency:'USD';
  
  $agent_type = strtolower($d->agent_type);
  $a_table = 'sender';
  if($agent_type =='driver') $a_table ='driver';
  $agent = DB::table($a_table.' as d')->where('id',$d->agent_id)->selectRaw('d.id,d.name,d.code')->first();
  if(!$agent) return DV::error($d->agent_type.' identity does not exist');
  $inputs = [];
  $nowTime = getNowTime();

  $inputs = [
    'payment_date'=>$nowTime,
    'payee_id'=>$d->agent_id,
    'payee_name'=>$agent->name,
    'payee_type'=>$d->agent_type,
    'amount'=>$d->total,
    'currency_code'=>$currency_code,
    'package_count'=>$d->package_count,
    'remarks'=>$d->remarks
  ];

  $x = self::validatePmtInputs($d->breakdowns);
  if($x->status ==='Error') return DV::error($x->error_message);

    //Check if among the $d->packages profived, there are some package already be part of any previous payment transaction
    $trx_field = $agent_type =='driver'? 'driver_trx_id':'sender_trx_id';
    $row = DB::table('package as p')->join('cash_disbursements as r','r.trx_id','=','p.'.$trx_field)->whereIn('p.id',explode(',',$d->packages))->whereRaw('p.'.$trx_field.' IS NOT NULL')->take(1)->first();
    if($row){
       return DV::error('មានកញ្ចប់ទំនិញខ្លះបានធ្លាប់បានទូទាត់ពីមិនរួចហើយ អាចនឺងកំពុងរុងចាំការអនុម័ត!');
    }
  $trx_id = DBX::saveData($ss,'cash_disbursements',['trx_id'=>null],$inputs,[],1,false,false);
  if($trx_id){
    //Update other totals such as COD_amount, taxi, fees in table cash_receipts
    self::setOtherTotals('disbursement',$trx_id,$agent_type);

    $currency_code = isset($d->currency_code)?$d->currency_code:'USD';
    $breakdowns = $x->breakdowns;
    $b_count = 0 ;

    $bs = [];
    foreach($breakdowns as $item){
       $exchange_rate = isset($item->exchange_rate)?$item->exchange_rate:1;
       DB::table('disbursement_breakdowns')->insert([
        'trx_id'=>$trx_id,
        'pmt_method'=>$item->pmt_method,
        'currency_code'=>$item->currency_code,
        'amount'=>$item->amount,
        'exchange_rate'=>$exchange_rate,
        'notes'=>$item->notes,
        'create_uid'=>$ss->user_id,
        'create_user'=>$ss->full_name,
        'create_date'=>$nowTime,
        'update_date'=> $nowTime,
        'update_user'=>$ss->full_name,
        'update_uid'=>$ss->user_id
      ]);

      
      if(!isset($bs[$item->pmt_method])) $bs[$item->pmt_method] = '';
      $cur_amount_notes = $bs[$item->pmt_method]; 
      $b_amount = number_format(floatval($item->amount), 2, '.', ',');
      $cur_amount_notes .= ($cur_amount_notes? ' + ':'').$b_amount.' '.$item->currency_code;
      $bs[$item->pmt_method] = $cur_amount_notes;  
  
      $b_count++;
    }

    $bs_notes ='';
    foreach($bs as $pmt_method=>$cur_amount){
      //$amount = floatval($cur_amount)!==false ? number_format(floatval($cur_amount), 2, '.', ',') :$cur_amount;
      $bs_notes .= ($bs_notes? ' | ':'').$pmt_method.': '. $cur_amount; 
    }
    DB::table('cash_disbursements')->where('trx_id',$trx_id)->update(['breakdown_notes'=>$bs_notes]);
 
    if($b_count > 0){
       $p_ids = explode(',',$d->packages);
       if ($agent_type=='driver'){
        DB::table('package')->whereIn('id',$p_ids)->update([
          'driver_pmt_status_id'=>1, /* For merchant payment => auto authorize */
          'driver_trx_id'=>$trx_id,
          'driver_pmt_notes'=>'Paid by: '.$ss->full_name
         ]);
       }else if($agent_type =='merchant'){
        DB::table('package')->whereIn('id',$p_ids)->update([
          'sender_pmt_status_id'=>1, /* For merchant payment => auto authorize */
          'sender_trx_id'=>$trx_id,
          'sender_pmt_notes'=>'Paid by: '.$ss->full_name
         ]);
       }
     
     }
   }
   return DV::depends($trx_id,['trx_id'=>$trx_id,'package_count'=>$d->package_count,'trx_breakdown_count'=>$b_count],'Failed to save payment transaction');   
 }
 
 function getSettledPackages_sender($trx_id,$ss=null){
  $ss =$ss?$ss:$this->userInfo;
  $branch_id =$ss->branch_id;
  $check_paid_or_unpaid = '(CASE p.sender_pmt_status_id =1 WHEN 1 THEN \'Paid\' ELSE \'Unpaid\' END) ';
  //NOTE: "p.id as package_id" is used by Mobile app api to retrieved photos for each package 
  $rows = DB::select(DB::raw('SELECT p.id,p.id as package_id,p.sender_pmt_status_id,p.delivery_type,p.sender_id,formatDate(p.arrival_time) AS arrival_date,formatTime(p.delivery_time) AS finish_date, p.sender_name, p.receiver_address, p.receiver_name,p.receiver_phone,p.zone_code,p.zone_name,
  p.df_payer,
  cod,price,
  IFNULL(p.cod_fee,0) AS cod_fee, 
  get_cod_amount(p.cod,p.price,p.cod_fee) AS cod_amount1,
  (p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,
  format_amount(\'$\',
    get_cod_amount(p.cod,p.price,p.cod_fee) - IFNULL(p.forwarding_cost,0)- CASE LOWER(p.df_payer) WHEN \'sender\' THEN IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0) ELSE 0 END
  ) AS total,
  CASE (IFNULL(p.sender_pmt_status_id,0) = 0 AND p.sender_trx_id IS NOT NULL) WHEN 1 THEN \'Pending\' ELSE '.$check_paid_or_unpaid.' END AS pmt_status,
  CASE p.status_id WHEN 9 THEN p.failure_notes WHEN 11 THEN p.failure_notes ELSE p.delivery_notes END AS notes,
  p.billed_kg, p.status_id, ps.name AS `status`,d.code AS driver_code, d.name AS driver_name FROM `package` AS `p`
  INNER JOIN package_statuses AS ps ON ps.id = p.status_id
  INNER JOIN `driver` as `d` ON d.id = p.driver_id '
  .' WHERE p.branch_id ='.($branch_id?$branch_id:0).' AND p.sender_trx_id = UNHEX(\''.$trx_id.'\') ORDER BY p.create_date DESC'
  ));
  return $rows;
}

   //returns list of settled packages per settlement (For Merchant App)
   function getSettledPackages_sender_old($settlement_id,$ss=null){
         $ss =$ss?$ss:$this->userInfo;
         $branch_id =$ss->branch_id;
         //NOTE: "p.id as package_id" is used by Mobile app api to retrieved photos for each package 
         $rows = DB::select(DB::raw('SELECT p.id,p.id as package_id,p.sender_pmt_status_id,p.delivery_type,p.sender_id,formatDate(p.create_date) AS booking_date, p.sender_name, p.receiver_address, p.receiver_name,p.receiver_phone,p.zone_code,p.zone_name,
         p.df_payer,
         cod,price,
         IFNULL(p.cod_fee,0) AS cod_fee, 
         get_cod_amount(p.cod,p.price,p.cod_fee) AS cod_amount1,
         (p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,
         format_amount(\'$\',
           get_cod_amount(p.cod,p.price,p.cod_fee) - IFNULL(p.forwarding_cost,0)- CASE LOWER(p.df_payer) WHEN \'sender\' THEN IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0) ELSE 0 END
         ) AS total,
         CASE p.status_id WHEN 9 THEN p.failure_notes WHEN 11 THEN p.failure_notes ELSE p.delivery_notes END AS notes,
         p.billed_kg, p.status_id, ps.name AS `status`,d.code AS driver_code, d.name AS driver_name FROM `package` AS `p`
         INNER JOIN package_statuses AS ps ON ps.id = p.status_id
         INNER JOIN `driver` as `d` ON d.id = p.driver_id '
         .' WHERE p.branch_id ='.($branch_id?$branch_id:0).' AND p.sender_trx_id = UNHEX(\''.$settlement_id.'\') ORDER BY p.create_date DESC'
         ));
         return $rows;
   }
   
    //returns list of settled packages per settlement (For Drver)
    function getSettledPackages_driver($trx_id,$ss=null){
      $ss =$ss?$ss:$this->userInfo;
      $branch_id = $ss->branch_id;
      $check_paid_or_unpaid = '(CASE p.driver_pmt_status_id =1 WHEN 1 THEN \'Paid\' ELSE \'Unpaid\' END)';
      $rows = DB::select(DB::raw('SELECT p.id,p.id as package_id,p.driver_pmt_status_id,p.delivery_type,p.sender_id,formatDate(p.arrival_time) AS arrival_date,formatTime(p.delivery_time) AS finish_date, p.sender_name,p.receiver_address, p.receiver_name,p.receiver_phone,p.zone_code,p.zone_name,
      p.df_payer,
      cod,price,
      IFNULL(p.cod_fee,0) AS cod_fee, 
      get_cod_amount(p.cod,p.price,p.cod_fee) AS cod_amount,
      (p.base_fee + IFNULL(p.delivery_fee,0)) AS fees,
      ifnull(p.sender_total,0) AS sender_total,
      ifnull(p.driver_total,0) AS driver_total,
      CASE p.status_id WHEN 9 THEN p.failure_notes WHEN 11 THEN p.failure_notes ELSE delivery_notes END AS notes,
      CASE (IFNULL(p.driver_pmt_status_id,0) = 0 AND p.driver_trx_id IS NOT NULL) WHEN 1 THEN \'Pending\' ELSE '.$check_paid_or_unpaid.' END AS pmt_status,
      p.billed_kg, p.status_id, ps.name AS `status`,d.code AS driver_code, d.name AS driver_name FROM `package` AS `p`
      INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
      INNER JOIN `driver` as `d` ON d.id = p.driver_id '
      .' WHERE p.branch_id ='.$branch_id.' AND p.driver_trx_id =UNHEX(\''.$trx_id.'\') ORDER BY p.create_date DESC'
      ));
  
      return $rows;
  }


   //returns list of settled packages per settlement (For Drver)
   function getSettledPackages_driver_old($settlement_id,$ss=null){
    $ss =$ss?$ss:$this->userInfo;
    $branch_id = $ss->branch_id;
    $rows = DB::select(DB::raw('SELECT p.id,p.id as package_id,p.driver_pmt_status_id,p.delivery_type,p.sender_id,formatDate(p.create_date) AS booking_date, p.sender_name,p.receiver_address, p.receiver_name,p.receiver_phone,p.zone_code,p.zone_name,
    p.df_payer,
    cod,price,
    IFNULL(p.cod_fee,0) AS cod_fee, 
    get_cod_amount(p.cod,p.price,p.cod_fee) AS cod_amount,
    (p.base_fee + IFNULL(p.delivery_fee,0)) AS fees,
    ifnull(p.sender_total,0) AS sender_total,
    ifnull(p.driver_total,0) AS driver_total,
    CASE p.status_id WHEN 9 THEN p.failure_notes WHEN 11 THEN p.failure_notes ELSE delivery_notes END AS notes,
    p.billed_kg, p.status_id, ps.name AS `status`,d.code AS driver_code, d.name AS driver_name FROM `package` AS `p`
    INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
    INNER JOIN `driver` as `d` ON d.id = p.driver_id '
    .' WHERE p.branch_id ='.$branch_id.' AND p.driver_trx_id =UNHEX(\''.$settlement_id.'\') ORDER BY p.create_date DESC'
    ));

    return $rows;
 }

   //delete attachment| delete transaction photo
   function deleteTransactionAttachment($d){
     $ss = UM::getUserInfoByToken($d);
     if ($ss->status_code !==200) return $ss; //user not authenticated
      //need permission to do this task
     $branch_id = $ss->branch_id;
     $trx_id = isset($d->trx_id)?$d->trx_id:null;
     $trx_type = isset($d->trx_type)?$d->trx_type:null;
     //$upload_id = $d->upload_id;
     if (strtolower( $trx_type) =='disbursement'){
       $rows = DB::table('cash_disbursements AS d')->where('id',$trx_id)->where('branch_id',$branch_id)->selectRaw('file_name')->limit(1)->get();
       foreach($rows as $row) deleteFile($row->file_name);
       DB::table('cash_disbursements AS d')->where('id',$trx_id)->where('branch_id',$branch_id)->update(array(
         'file_name'=>null,
         'file_type'=>null
       )); 
     }else {
       $rows = DB::table('cash_receipts AS d')->where('id',$trx_id)->where('branch_id',$branch_id)->selectRaw('file_name')->limit(1)->get();
       foreach($rows as $row) deleteFile($row->file_name);
       DB::table('cash_receipts AS d')->where('id',$trx_id)->where('branch_id',$branch_id)->update(array(
         'file_name'=>null,
         'file_type'=>null
       ));
     }
     return null;
    
   }
    
     //saveTransactionPhoto()
     //$user_class is important for WHERE to save image file. There are public/1_data/merchant or driver or general
     //user_class = {'merchant','driver','general'}
     //$d = {'user_class','trx_type','trx_id','file_type','photo_data'}
     function savePhoto($arr=[],$ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $d = (object)$arr;
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $trx_id = isset($d->trx_id)?$d->trx_id:null;
        $trx_type = isset($d->trx_type)?$d->trx_type:null;
        $user_class =isset($d->user_class)?$d->user_class:null;
        $file_type =isset($d->file_type)?$d->file_type:null;
        $photo_data = isset($d->photo_data)?$d->photo_data:null;
        $prev_file_name = null;
 
        //get previous uploaded image, if any (the image file to be deleted after new photo uploaded)
        $info = $this->getProps($trx_type,$trx_id,['file_name']);
        if($info) $prev_file_name = $info->file_name; 
        $m = $this->savePhoto_local($ss, $user_class,$trx_type,$trx_id,$file_type,$photo_data);
        if(!$m->error) {
          //$result->upload_id = $m->upload_id;
          $image_url = htmlspecialchars(XPublicStorage::getUrl($branch_id,$user_class,'image').$m->file_name);
          if($prev_file_name) XPublicStorage::delete($branch_id,$user_class,'image',$prev_file_name); 
          return DV::depends(1,['image_url'=>$image_url]); 
        }else return DV::error($m->error); 
        
     }

     /**
      * $arr = {'trx_type',trx_id,user_class} 
     */
     function deletePhoto($arr,$ss=null){
      $ss = $ss?$ss:$this->userInfo;
      $branch_id = Sanitizer::sanitize($ss->branch_id);

      $d = (object)$arr;
      $trx_id = isset($d->trx_id)?$d->trx_id:0;
      $trx_type = isset($d->trx_type)?$d->trx_type:null;
      $user_class =isset($d->user_class)?$d->user_class:null;
      $file_name = null;

      $info = $this->getProps($trx_type,$trx_id,['file_name']);
      if($info) $file_name = $info->file_name;
  
      if($file_name){
        $x = XPublicStorage::delete($branch_id,$user_class,'image',$file_name);
        return DV::depends($x);
      }else return DV::error('Failed to delete photo');
     }

     function savePhoto_local($ss,$user_class,$trx_type,$trx_id,$file_type,$photo_data){
        $trx_type = strtolower($trx_type);
        $branch_id = $ss->branch_id;
        $res = (object)['error'=>null,'upload_id'=>null];
        $table ='cash_disbursements_attachments';
        $table1 = 'cash_disbursements';
        if($trx_type==='receipt') {
          $table ='cash_receipts_attachments';
          $table1 ='cash_receipts';
        }
        //delete all previous attachments belonging to this trx_type/trx_id
        //DB::table($table)->where('trx_type',$trx_type)->where('trx_id',$trx_id)->delete();
        $category ='image';
        $file_name =null;
        //$file_type is file extension without dot such as "png" "jpg"
        //if(empty($file_name)) $file_name = $branch_id."_".uniqid()."_".date('Ymd_hms').".".$file_type;
      

        $m = XPublicStorage::saveImage($branch_id, $user_class,$file_type,$photo_data);
        if($m->status ==='OK')
        {
            $file_name = $m->file_name;
            $file_url = XPublicStorage::getUrl($branch_id,$user_class,$category).$file_name;
            DB::table($table1)->where('id',$trx_id)->update(array('file_type'=>$file_type,'file_name'=>$file_name));  
 
            $res->file_name = $file_name;
            if ($res->upload_id){
                DB::table($table)->insert([
                  'trx_type'=>$trx_type,
                  'branch_id'=>$branch_id,
                  'trx_id'=>$trx_id,
                  'upload_id'=>$res->upload_id,
                  'file_url'=>$file_url,
                  'create_user'=>$ss->login_name,
                  'create_date'=>getNowTime()
                ]);
                $res->error_message = null;
                return $res;
            } else {
              //failed to insert record to table "uploads"
              $res->error_message = "File saved but failed to book data about the upload info";
              return $res;
            }  
            
        }else $res->error_message = $m->error_message;

        //$res->error_message ="Failed to save image file";
        $res->status ='Error';
        return $res;
     }

     //return info {'image_url','file_name','file_type'}
     function getImageInfo($branch_id,$user_class,$trx_type,$trx_id){
        $trx_type = strtolower($trx_type);
        //$branch_id = $ss->branch_id;
         //$result = (object)['image_url'=>null,'upload_id'=>null];
        $table = 'cash_receipts';
        if($trx_type ==='cash_disbursements') $table ='cash_disbursements';
        $rows = DB::table($table)->where('id',$trx_id)->selectRaw("file_name,file_type")->limit(1)->get();
        foreach($rows as $row){
          $row->image_url = XPublicStorage::getUrl($branch_id,$user_class,'image').$row->file_name;
          return $row;
        } 
        return null;

        //  if($trx_type==='receipt'){
        //     $rows = DB::table('cash_receipts_attachments')->where('trx_id',$trx_id)->selectRaw("file_url AS image_url,upload_id")->limit(1)->get();
        //     foreach($rows as $row) return $row; 
        //  } else if($trx_type==='disbursement'){
        //     $rows = DB::table('cash_disbursements_attachments')->where('trx_id',$trx_id)->selectRaw("file_url AS image_url,upload_id")->limit(1)->get();
        //     foreach($rows as $row) return $row; 
        //  }else {
        //    return null;
        //  }
     }
      
     function getProps($trx_type,$trx_id,$props=[]){
        $trx_type = strtolower($trx_type);
        $cols = implode(',',$props);

        $table = null;
        if($trx_type ==='receipt') $table ='cash_receipts';
        else $table ='cash_disbursements';
        $rows = DB::table($table)->where('id',$trx_id)->selectRaw($cols)->limit(1)->get();
       foreach($rows as $row) return $row;
       return null;
     }

     //For Merchant's mobiele app's transactions . getTransactions getPaymentsBySender(), getpaymentList by Merchant, payments to merchant
     function getTransactionList_merchant($arr,$ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $d = (object)$arr;
        $sender_id = isset($d->sender_id)? Sanitizer::sanitize($d->sender_id):null;
        $start_date = isset($d->start_date)?$d->start_date:null;
        $end_date = isset($d->end_date)?$d->end_date:null; 
         
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
        if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
        if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
        $str_pay_sender =" AND d.payee_type ='Sender' AND d.payee_id ='".$sender_id."' ";
        $str_from_sender = " AND d.payer_type ='Sender' AND d.payer_id ='".$sender_id."' ";
        $str_dates = " AND DATE(d.payment_date) >= '".$start_date."' AND DATE(d.payment_date) <= '".$end_date."'";
        /*** IMPORTANT NOTE: Unlike Driver App, this merchant/transactions() => returns field "description" as special_notes to match with Merchant's mobile app's Transaction view to display remarks correctly **/
        $sql ="SELECT 0 AS package_count,HEX(d.trx_id) AS trx_id, HEX(d.trx_id) AS settlement_id,d.file_name, formatDate(d.payment_date) AS payment_date,'Receipt' AS trx_type, CONCAT('Pay to ',payee_name) AS `description`, d.remarks AS special_notes, d.amount,d.currency_code,d.create_user AS cashier_name,d.create_date FROM cash_disbursements AS d WHERE d.branch_id ='".$branch_id."'". 
        " UNION
        SELECT 0 as package_count, HEX(d.trx_id) AS trx_id, HEX(d.trx_id) AS settlement_id,d.file_name, formatDate(d.payment_date) AS payment_date,'Disbursement' AS trx_type, CONCAT('Received from ',payer_name) AS `description`, d.remarks AS special_notes, d.amount,d.currency_code,d.create_user AS cashier_name,d.create_date FROM cash_receipts AS d WHERE d.branch_id ='".$branch_id."' "." ORDER BY create_date DESC";
        $rows = DB::select(DB::raw($sql));
         //load image for each transaction
         $cnt=0;
         $total = 0;
         /** NOTE: for Merchant Mobile App=> Disbursement means Receipt, and Receipt means disbursement **/
         foreach($rows as $row)
         {
            if (strtolower($row->trx_type)=='receipt') $bs_table ='receipt_breakdowns'; else $bs_table ='disbursement_breakdowns';
            $bs = DB::table($bs_table.' as bs')->whereRaw('bs.trx_id = UNHEX(\''.$row->trx_id.'\')')->selectRaw('bs.pmt_method,bs.currency_code,bs.amount,bs.exchange_rate,bs.notes')->get();
            $notes = '';
            foreach($bs as $x){
              $notes .= ($notes? '|':''). $x->pmt_method.' '.$x->amount.' '.$x->currency_code; 
            }
            $row->pmt_method = $notes;

            $row->image_url = htmlspecialchars(XPublicStorage::getUrl($branch_id,'merchant','image').$row->file_name);
            if(!isset($row->image_url)) $row->image_url=null;      
            $row->file_name = null;
            if (strtolower($row->trx_type)=='receipt') $row->amount = abs($row->amount);
            else $row->amount = ($row->amount <=0)? $row->amount:(-$row->amount); 
            $total += $row->amount;
            $cnt++;
         }
        return (object)['transactions'=>$rows,'count'=>is_numeric($cnt)?$cnt:0,'currency'=>'USD','total'=>is_numeric($total)?number_format($total,2):0];
      }
   
/**  $arr = {driver_id,total,currency_code,packages,package_count}*/ 
function settleZero_driver($arr,$ss){
    $ss = $ss?$ss:$this->userInfo;
    $d = (object)$arr;
    $currency_code = $d->currency_code;
    $driver_id = isset($d->driver_id)?$d->driver_id:$d->id;
    $driver = DB::table('driver as d')->where('id',$driver_id)->selectRaw('d.id,d.name,d.code')->first();
    if(!$driver) return DV::error('Driver identity does not exist');
    $nowTime = getNowTime();
    $inputs = [
      'payer_name'=>$driver->name,
      'payer_id'=>$driver->id,
      'payment_date'=>$nowTime,
      'payer_type'=>'Driver',
      'amount'=>$d->total,
      'currency_code'=>$currency_code,
      'package_count'=>$d->package_count,
      'remarks'=>"zero settlement",
      'authorized'=>0
    ];

    $trx_id = DBX::saveData($ss,'cash_receipts',['trx_id'=>null],$inputs,[],1,false,false);
    $success_count = 0 ;
    if($trx_id){
      $p_ids = explode(',',isset($d->packages)?$d->packages:'');
      if(!isset($p_ids[0])) return DV::error('No packages provided for settlement');
      $x = DB::table('package')->whereIn('id',$p_ids)->update([
      'driver_pmt_status_id'=>0,
      'driver_trx_id'=>$trx_id,
      'driver_pmt_notes'=>'Received by: '.$ss->full_name.' | Zero settlement'
      ]);
      if ($x) $success_count++;
      if ($success_count > 0)
        return DV::depends($success_count,['success_count'=>$success_count],'Failed to settle zero amount for driver');
      else return DV::error('0 packages where updated. Something may have gone wrong in commiting zero-amount transaction for driver');
    }
    return DV::error('Something may have gone wrong in commiting zero-amount transaction for driver');
}
 
function settleZero_sender($arr,$ss){
  $ss = $ss?$ss:$this->userInfo;
  $d = (object)$arr;
  $currency_code = $d->currency_code;
  $sender = DB::table('sender as d')->where('id',$d->sender_id)->selectRaw('d.id,d.name,d.code')->first();
  if(!$sender) return DV::error('Driver identity does not exist');
  $nowTime = getNowTime();
  $inputs = [
    'payee_name'=>$sender->name,
    'payment_date'=>$nowTime,
    'payee_id'=>$d->sender_id,
    'payee_type'=>'Merchant',
    'amount'=>$d->total,
    'currency_code'=>$currency_code,
    'package_count'=>$d->package_count,
    'remarks'=>"zero settlement",
    'authorized'=>1,
    'auth_user'=>$ss->full_name,
    'auth_uid'=>$ss->user_id
  ];

  $trx_id = DBX::saveData($ss,'cash_disbursements',['trx_id'=>null],$inputs,[],1,false,false);
  $success_count = 0 ;
    if($trx_id){
      $p_ids = explode(',',isset($d->packages)?$d->packages:'');
      if(!isset($p_ids[0])) return DV::error('No packages provided for settlement');
      $x = DB::table('package')->whereIn('id',$p_ids)->update([
      'sender_pmt_status_id'=>0,
      'sender_trx_id'=>$trx_id,
      'sender_pmt_notes'=>'Received by: '.$ss->full_name.' | Zero settlement'
      ]);
      if ($x) $success_count++;
      if ($success_count > 0)
        return DV::depends($success_count,['success_count'=>$success_count],'Failed to settle zero amount for merchant');
      else return DV::error('0 packages where updated. Something may have gone wrong in commiting zero-amount transaction for merchant');
    }
    return DV::error('Something may have gone wrong in commiting zero-amount transaction for merchant');
}

/** Given a @driver_trx_id or @sender_trx_id, update the "cod_amount","fees","taxi" in table cash_receipts or cash_disbursements accordingly */
static function setOtherTotals($trx_type,$trx_id,$agent_type){
  $trx_type = strtolower($trx_type);
  $agent_type = strtolower($agent_type);
   $table = null;
   $q_field = null;
   if($trx_type == 'disbursement') $table ='cash_disbursements';
   else if($trx_type == 'receipt') $table ='cash_receipts';
   if(!$table) return 'Invalid @trx_type';
   if ($agent_type==='driver') $q_field ='p.driver_trx_id';
   else if($agent_type=='merchant') $q_field ='p.sender_trx_id';
   if(!$q_field) return 'invalid @agent_type';
   //NOTE: $trx_id is BINARY(16)
   $fee_col ='';
   if ($agent_type =='merchant')  $fee_col = ',SUM(CASE LOWER(p.df_payer) WHEN \'sender\' THEN p.base_fee + IFNULL(p.delivery_fee,0) + IFNULL(p.cod_fee,0)) ELSE 0 END AS fees';
   else if ($agent_type =='driver')  $fee_col = ',SUM(CASE LOWER(p.df_payer) WHEN \'receiver\' THEN p.base_fee + IFNULL(p.delivery_fee,0)) ELSE 0 END AS fees';

   $row = DB::table('package as p')->where($q_field,$trx_id)->selectRaw('SUM(p.price) AS cod_amount,SUM(p.forwarding_cost) AS taxi'.$fee_col)->get()->first(); 
   $cod_amount = 0;
   $fees = 0;
   $taxi =0;
   if ($row){
     $cod_amount = $row->cod_amount;
     $taxi = $row->taxi;
     $fees = $row->fees;
   }
   DB::table($table)->where('trx_id',$trx_id)->update([
    'cod_amount'=>$cod_amount,
    'taxi_fees'=>$taxi,
    'fees'=>$fees
   ]);
   return null;
}

/** Receive payment from Driver or from merchant in the same fashion
 * $packages is comma-separated string of package_ids such as "1023,23454,2345,..."
*/
function receivePayment($arr,$ss=null){
    $ss = $ss?$ss:$this->userInfo;
    $v_rule = [
      'agent_id'=>'1|number',
      'agent_type'=>'1|choice|driver,merchant,Driver,Merchant',
      'trx_type'=>'0|choice|receipt,Receipt',
      'total'=>'1|number|default=0',
      //'exchange_rate'=>'1|number|default=1',
      'package_count'=>'0|number|default=0',
      'currency'=>'1|string|1-10|default=USD',
      'remarks'=>'0|string|250',
      'packages'=>'1|string',
      'breakdowns'=>'1|array'
    ];
    $res = DBX::validateObject($arr,$v_rule,true,['notes' => [':','.','$','-'],'remarks' => [':','.','$','-'],'packages'=>[',','|',';']],$ss->lang,false,null);
    if($res->error) return DV::error($res->error);
    $d = (object)$res->values;
    if(!$d->packages) return DV::error('No package list provided');
    $currency_code = isset($d->currency_code)?$d->currency_code:null;
    if(!$currency_code) $currency_code = isset($d->currency)? $d->currency:'USD';
    $agent_type = strtolower($d->agent_type);

    $a_table ='sender';
    if($agent_type =='driver') $a_table ='driver';
    $agent = DB::table($a_table.' as d')->where('id',$d->agent_id)->selectRaw('d.id,d.name,d.code')->first();
    if(!$agent) return DV::error($d->agent_type.' identity does not exist');
    $inputs = [];
    $nowTime = getNowTime();
   
    $inputs = [
      'payment_date'=>$nowTime,
      'payer_id'=>$d->agent_id,
      'payer_name'=>$agent->name,
      'payer_type'=>$d->agent_type,
      'amount'=>$d->total,
      'currency_code'=>$currency_code,
      'package_count'=>$d->package_count,
      'remarks'=>$d->remarks
    ];

    $x = self::validatePmtInputs($d->breakdowns);
    if($x->status ==='Error') return DV::error($x->error_message);
    
    //Check if among the $d->packages profived, there are some package already be part of any previous payment transaction
    $trx_field = $agent_type =='driver'? 'driver_trx_id':'sender_trx_id';
    $row = DB::table('package as p')->join('cash_receipts as r','r.trx_id','=','p.'.$trx_field)->whereIn('p.id',explode(',',$d->packages))->whereRaw('p.'.$trx_field.' IS NOT NULL')->take(1)->first();
    if($row){
       return DV::error('មានកញ្ចប់ទំនិញខ្លះបានធ្លាប់បានទូទាត់ពីមិនរួចហើយ អាចនឺងកំពុងរុងចាំការអនុម័ត!');
    }

    $trx_id = DBX::saveData($ss,'cash_receipts',['trx_id'=>null],$inputs,[],1,false,false);
    if($trx_id){
      //Update other totals such as COD_amount, taxi, fees in table cash_receipts
      self::setOtherTotals('receipt',$trx_id,$agent_type);
      $currency_code = isset($d->currency_code)?$d->currency_code:'USD';
      $breakdowns = $x->breakdowns;
      $b_count = 0 ;
 
      $bs = [];
      foreach($breakdowns as $item){
         $exchange_rate = isset($item->exchange_rate)?$item->exchange_rate:1;
         DB::table('receipt_breakdowns')->insert([
          'trx_id'=>$trx_id,
          'pmt_method'=>$item->pmt_method,
          'currency_code'=>$item->currency_code,
          'amount'=>$item->amount,
          'exchange_rate'=>$exchange_rate,
          'notes'=>$item->notes,
          'create_uid'=>$ss->user_id,
          'create_user'=>$ss->full_name,
          'create_date'=>$nowTime,
          'update_date'=> $nowTime,
          'update_user'=>$ss->full_name,
          'update_uid'=>$ss->user_id
        ]);

        if(!isset($bs[$item->pmt_method])) $bs[$item->pmt_method] = '';
        $cur_amount_notes = $bs[$item->pmt_method]; 
        $b_amount = number_format(floatval($item->amount), 2, '.', ',');
        $cur_amount_notes .= ($cur_amount_notes? ' + ':'').$b_amount.' '.$item->currency_code;
        $bs[$item->pmt_method] = $cur_amount_notes;  
        $b_count++;
      }
      
      $bs_notes ='';
      foreach($bs as $pmt_method=>$cur_amount){
        $bs_notes .= ($bs_notes? ' | ':'').$pmt_method.': '. $cur_amount; 
      }

      DB::table('cash_receipts')->where('trx_id',$trx_id)->update(['breakdown_notes'=>$bs_notes]);

      if($b_count > 0){
         $p_ids = explode(',',$d->packages);
         if ($agent_type =='driver'){
           DB::table('package')->whereIn('id',$p_ids)->update([
            'driver_pmt_status_id'=>0, /* Pending*/
            'driver_trx_id'=>$trx_id,
            'driver_pmt_notes'=>'Received by: '.$ss->full_name
           ]);
         }else if ($agent_type =='merchant'){
           DB::table('package')->whereIn('id',$p_ids)->update([
            'sender_pmt_status_id'=>1, /* Pending*/
            'sender_trx_id'=>$trx_id,
            'sender_pmt_notes'=>'Received by: '.$ss->full_name
           ]);
         }
      }
    }
    return DV::depends($trx_id,['trx_id'=>$trx_id,'package_count'=>$d->package_count,'trx_breakdown_count'=>$b_count],'Failed to save payment transaction');   
  }

  static function authorizeReceipts_driver($arr,$ss){
    $currency_code ='USD';
    
    $branch_id = Sanitizer::sanitize($ss->branch_id); 
    $d = (object)$arr;

    /* $status_id =>  1= Pending 2= Approved. translated to 1 become 0 (Pending), 2 Becomes 1 (Authorized) in database table */
    //$status_id = isset($d->status_id)?$d->status_id:null;
    $driver_id = isset($d->driver_id)?$d->driver_id:null;
    $start_date = isset($d->start_date)?$d->start_date:null;
    $end_date = isset($d->end_date)?$d->end_date:null; 
    $start_date = convertDate($start_date);
    $end_date = convertDate($end_date);

    if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
    if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');

    $str_authorize = 'IFNULL(r.authorized,0) =0';
    $str_driver ="1=1";
    if ($driver_id >0) $str_driver ='payer_id = '.$driver_id;
    
    $str_dates ='DATE(r.payment_date) >= \''.$start_date.'\' AND DATE(r.payment_date) <=\''.$end_date.'\' ';
     
  $sum_row = DB::table('cash_receipts as r')->where('r.branch_id',$branch_id)->where('r.payer_type','driver')->whereRaw($str_driver)->whereRaw($str_dates)->whereRaw($str_authorize)->selectRaw('( SUM(CASE IFNULL(r.authorized,0) WHEN 0 THEN 1 ELSE 0 END)) AS unauth_count, SUM(r.amount) As trx_total, COUNT(r.trx_id) AS trx_count')->get()->first();
  
  $trx_query =  DB::table('cash_receipts as r')->where('r.branch_id',$branch_id)->where('r.payer_type','driver')->whereRaw($str_driver)->whereRaw($str_dates)->whereRaw($str_authorize);
  $rows = $trx_query->selectRaw('HEX(trx_id) AS trx_id')->get();
  $trx_query->update(['authorized'=>1,'auth_user'=>$ss->full_name,'auth_date'=>getNowTime(),'auth_uid'=>$ss->user_id]);
  
  foreach($rows as $row){
    DB::table('package')->whereRaw('driver_trx_id =UNHEX(\''.$row->trx_id.'\')')->update(['driver_pmt_status_id'=>1]);
  }
   return DV::depends(1,[
    'affected_trx_count'=>$sum_row->trx_count,
    'total'=>$sum_row->trx_total,
    'currency'=>$currency_code
   ]); 
 }

 static function authorizeDisbursements_driver($arr,$ss){
  $currency_code ='USD';
  $branch_id = Sanitizer::sanitize($ss->branch_id); 
  $d = (object)$arr;

  /* $status_id =>  1= Pending 2= Approved. translated to 1 become 0 (Pending), 2 Becomes 1 (Authorized) in database table */
  //$status_id = isset($d->status_id)?$d->status_id:null;
  $driver_id = isset($d->driver_id)?$d->driver_id:null;
  $start_date = isset($d->start_date)?$d->start_date:null;
  $end_date = isset($d->end_date)?$d->end_date:null; 
  $start_date = convertDate($start_date);
  $end_date = convertDate($end_date);

  if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
  if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');

  $str_authorize = 'IFNULL(r.authorized,0) =0';
  $str_driver ="1=1";
  if ($driver_id >0) $str_driver ='payee_id = '.$driver_id;
  
  $str_dates ='DATE(r.payment_date) >= \''.$start_date.'\' AND DATE(r.payment_date) <=\''.$end_date.'\' ';

$sum_row = DB::table('cash_disbursements as r')->where('r.branch_id',$branch_id)->where('r.payee_type','driver')->whereRaw($str_driver)->whereRaw($str_dates)->whereRaw($str_authorize)->selectRaw('( SUM(CASE IFNULL(r.authorized,0) WHEN 0 THEN 1 ELSE 0 END)) AS unauth_count, SUM(r.amount) As trx_total, COUNT(r.trx_id) AS trx_count')->get()->first();

$trx_query =  DB::table('cash_disbursements as r')->where('r.branch_id',$branch_id)->where('r.payee_type','driver')->whereRaw($str_driver)->whereRaw($str_dates)->whereRaw($str_authorize);
$rows = $trx_query->selectRaw('HEX(trx_id) AS trx_id')->get();
$trx_query->update(['authorized'=>1,'auth_user'=>$ss->full_name,'auth_date'=>getNowTime(),'auth_uid'=>$ss->user_id]);

foreach($rows as $row){
  DB::table('package')->whereRaw('driver_trx_id =UNHEX(\''.$row->trx_id.'\')')->update(['driver_pmt_status_id'=>1]);
}
 return DV::depends(1,[
  'affected_trx_count'=>$sum_row->trx_count,
  'total'=>$sum_row->trx_total,
  'currency'=>$currency_code
 ]); 
}

  static function authorizePayments_driver($arr,$ss){
    $currency_code = 'USD';
    $receipt = self::authorizeReceipts_driver($arr,$ss);
    $disburse = self::authorizeDisbursements_driver($arr,$ss);
    $affect_count =0;
    $affect_sum = 0;
    if ($receipt->status_code ==200){
      $d = (object)$receipt->data;
      $affect_count = $d->affected_trx_count;
      $affect_sum =  $d->total;
    }
    if ($disburse->status_code ==200){
      $d = (object)$receipt->data;
      $affect_count += $d->affected_trx_count;
      $affect_sum +=  $d->total;
    }
    $start_date = isset($d->start_date)?$d->start_date:date('d M Y'); 
    $end_date = isset($d->end_date)?$d->end_date:date('d M Y');
    $driver_id = isset($d->driver_id)?$d->driver_id:null;
    $driver_name = $driver_id> 0? DB::table('driver as d')->where('id',$driver_id)->take(1)->value('name') : '(All)';
    if($affect_count == 0) return DV::error('វាហាក់ដូចជាមិនមានប្រតិបត្តិការដែលត្រូវអនុម័តទេ សំរាប់ អ្នកដឹក'.$driver_name.' ចន្លោះថ្ងៃ '.$start_date.' ដល់ '.$end_date);        
    return DV::depends(1,[
      'affected_trx_count'=>$affect_count,
      'total'=>$affect_sum,
      'currency_code'=>$currency_code,
      'start_date'=>$start_date,
      'end_date'=>$end_date,
      'driver_name'=>$driver_name
    ]); 
  }

  static function authorizePayment_driver($trx_id,$trx_type,$ss){
     $trx_type = strtolower($trx_type);
     $table = 'cash_receipts';
     if($trx_type =='disbursement') $table ='cash_disbursements';
     $x = DB::table($table)->whereRaw('trx_id =UNHEX(\''.$trx_id.'\')')->update([
       'authorized'=>1,
       'auth_user'=>$ss->full_name,
       'auth_uid'=>$ss->user_id,
       'auth_date'=>getNowTime()
     ]);
    
    $query =  DB::table('package')->whereRaw('driver_trx_id =UNHEX(\''.$trx_id.'\')');
    $count_query = clone $query;
    $cnt = $count_query->count('id');
    $query->update([
      'driver_pmt_status_id'=>1
    ]);
    return DV::depends($x,['affected_count'=>$cnt],'It seems that the authorization failed');
  }

  static function authorizePayment_merchant($trx_id,$trx_type,$ss){
    $trx_type = strtolower($trx_type);
    $table = 'cash_receipts';
    if($trx_type =='disbursement') $table ='cash_disbursements';
    $x = DB::table($table)->whereRaw('trx_id =UNHEX(\''.$trx_id.'\')')->update([
      'authorized'=>1,
      'auth_user'=>$ss->full_name,
      'auth_uid'=>$ss->user_id,
      'auth_date'=>getNowTime()
    ]);
   
   $query =  DB::table('package')->whereRaw('sender_trx_id =UNHEX(\''.$trx_id.'\')');
   $count_query = clone $query;
   $cnt = $count_query->count('id');
   $query->update([
     'sender_pmt_status_id'=>1
   ]);
   return DV::depends($x,['affected_count'=>$cnt],'It seems that the authorization failed');
 }

  static function validatePmtInputs($breakdowns){
    return (object)[
      'status'=>'OK',
      'breakdowns'=>$breakdowns
    ];
  } 
 
    /**
     * getOutstandingPayments Outstanding balances merchant balance Balance due => depending on the given option $type = "payable|receivable" returns list of records group by merchant name (merchant, total, date)  
     * $arr = {'type'=> "payable|receivable", 'sender_id','start_date','end_date' }
    * */  
    function getOutstandingPayments_merchant($arr,$sender_id = null, $ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $d = (object)$arr;
        //$branch_id = $ss->branch_id;
        if (!$sender_id) $sender_id = isset($d->sender_id) ? $d->sender_id : null;
        $warehouse_id = isset($d->warehouse_id)?$d->warehouse_id:0;

        /** view_name = date|merchant. "merchant" means group abd sum all amount by merchant name regardless of any dates */
        $view_name = isset($d->view_name)?$d->view_name:'date';
        $type =isset($d->type)?$d->type:'all'; /* payable | receivable*/
        $start_date = isset($d->start_date)?$d->start_date:null;
        $end_date = isset($d->end_date)?$d->end_date:null;
        
        $str_dates ='2=2';
        if((bool)strtotime($start_date) && (bool)strtotime($end_date)){
            $start_date = convertDate($start_date);
            $end_date = convertDate($end_date);
            $str_dates = '(DATE(p.arrival_time) >=\''.$start_date.'\' AND DATE(p.arrival_time) <=\''.$end_date.'\')';
        }
        else if ((bool)strtotime($end_date)){
          $days_ago =-90;
          $end_date = convertDate($end_date);
          $start_date = convertDate(Carbon::now()->addDay($days_ago));
          $str_dates = '( DATE(p.arrival_time) >=\''.$start_date.'\' AND DATE(p.arrival_time) <=\''.$end_date.'\')'; 
 
        }else{
          //No start_date and No end_date
          $days_ago =-90;
          $currentDate = date('Y-m-d');
          if(!(bool)strtotime($start_date )) $start_date =  date('Y-m-d', strtotime($currentDate . ' -90 days'));
          $end_date = date('Y-m-d');
          $str_dates = '( DATE(p.arrival_time) >=\''.$start_date.'\' AND DATE(p.arrival_time) <=\''.$end_date.'\')'; 
        }
      
        $str_sender = '1=1';
        $str_pmt_status = 'p.status_id =8 AND IFNULL(p.sender_pmt_status_id,0) =0';
        if($sender_id > 0) $str_sender ='sender_id ='.$sender_id;

        $groupByDate ='';
        $select_date = '';
        $orderByDate ='';
        if($view_name === 'date'){
          $select_date = 'DATE_FORMAT(p.arrival_time,\'%d %b %Y\') AS `date`,DATE(p.arrival_time) AS arrival_date,';
          $groupByDate =',date,arrival_date';
          $orderByDate =',arrival_date DESC';
        }

        $cols = $select_date.'HEX(p.sender_trx_id) AS sener_trx_id, SUM(CASE lower(p.df_payer) WHEN \'sender\' THEN (IFNULL(p.delivery_fee,0) + IFNULL(p.base_fee,0)) ELSE 0 END) AS fees, SUM(IFNULL(p.forwarding_cost,0)) AS forwarding_cost, SUM(IFNULL(p.cod_fee,0)) AS cod_fee, SUM(CASE p.cod WHEN 1 THEN IFNULL(p.price,0) ELSE 0 END) AS price, COUNT(p.id) AS package_count, s.id,s.code, s.name as sender_name' 
        .',(SELECT CONCAT(acc.account_number,\'|\',acc.account_name,\'|\',acc.bank_name) as account_info FROM sender_bank_accounts AS acc WHERE acc.is_primary =1 AND acc.sender_id = s.id LIMIT 1) AS account_info ';
 
        $rows = DB::table('package as p')->join('sender as s','s.id','=','p.sender_id')
        ->whereRaw('p.warehouse_id ='.$warehouse_id)
        ->whereRaw($str_pmt_status)
        ->whereRaw($str_dates)
        ->whereRaw($str_sender)
        ->selectRaw($cols)
        ->groupByRaw('sender_trx_id,s.code,s.id,s.name'.$groupByDate)
        ->orderByRaw('s.id'.$orderByDate)->get();
       
        $new_rows = [];
        $total_payable =0;
        $total_receivable = 0;
        $pg_count_payable =0;
        $pg_count_receivable =0;

        foreach($rows as $row){
           $row->cod_amount = $row->price;
           $amount = $row->cod_amount - $row->fees - $row->forwarding_cost;
           $row->amount = number_format(floatval($amount),2,'.');
           $row->total_fees = $row->fees - $row->cod_fee;
           $row->total_fees = number_format(floatval($row->total_fees),2,'.');
           $sts = explode('|',$row->account_info ?? '');

           $row->account_number = $sts[0];
           $row->account_name = isset($sts[1])?$sts[1]:'';
           $row->bank_name = isset($sts[2])?$sts[2]:'';
           if($type ==='payable'){
              if($amount >0){
                 $new_rows[] = $row; 
                 $total_payable += $amount;
                 $pg_count_payable += $row->package_count;
              }
           }else{
              if($amount < 0){
                $new_rows[] = $row;
                $total_receivable += $amount;
                $pg_count_receivable +=$row->package_count;
              }
           }
        }

        $packages = null;
        if ($sender_id > 0){
           $p_rows = DB::table('package as p')
           ->join('sender as d', 'd.id', '=', 'p.sender_id')
           ->whereRaw('IFNULL(p.sender_pmt_status_id,0) = 0 AND p.status_id = 8')
           ->where('p.warehouse_id',$warehouse_id)
           ->whereRaw($str_dates)
           ->whereRaw($str_sender)
           ->whereRaw($str_pmt_status)
           //->whereRaw($str_search)
           ->selectRaw('p.id')->get();
           foreach($p_rows as $row){
             $packages .= ($packages? ',':'').$row->id;
           }
        }

        $currency_code = 'USD';
        $exchange_rate = GeneralSettings::getExchangeRate($end_date);
        $net_total = $total_receivable + $total_payable;
        return (object)[
          'sender_id'=>$sender_id,
          'total_count'=>($pg_count_payable + $pg_count_receivable),
          'total'=>number_format($net_total,2,'.',''),
          'currency_code'=>$currency_code,
          'items'=>$new_rows,
          'packages'=>$packages,
          'exchange_info'=>(object)[
             'currency_pair'=>$exchange_rate->currency_pair,
             'buy_rate'=>$exchange_rate->buy_rate
          ]
        ];
     }

     static function paymentFormOptions($id=null, $ss=null){
      return (object)[
          'exchange_info'=>GeneralSettings::getExchangeRate(null),
          'currency_code'=>'USD',
          'local_currency'=>'KHR',
          'pmtMethods'=>DB::table('payment_methods as m')->selectRaw('m.id,m.name AS pmt_method')->get()
      ];    
   }
}
