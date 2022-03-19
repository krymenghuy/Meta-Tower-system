<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Session;
use DB;
use Carbon\Carbon;

class PaymentTransaction extends Model
{
    use HasFactory;

    function createUniqID($uss,$len=12){
      $branch_id = $uss->branch_id;
      $user_id = $uss->user_id; //login_name
      return strtoupper(uniqid($branch_id.$user_id));
      // for ($randomNumber = mt_rand(1, 8), $i = 1; $i < 10; $i++) {
      //    $randomNumber .= mt_rand(0, 8);
      // }
      // return $branch_id.$result;
  }
  
  //$d = {'trx_type','id','settlement_id','payer_type'} ."settlement_id" and "payer_type" are optional but if supplied, this method works faster
  function deleteTransaction($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id); 
        $id = isset($d->trx_id)?$d->trx_id:null;
        $trx_type = isset($d->trx_type)? $d->trx_type:null;
        $payer_type = isset($d->payer_type)?$d->payer_type:null;
        $payee_type = isset($d->payee_type)?$d->payee_type:null;

        $trx_type = strtolower($trx_type);
        $amount = isset($d->amount)?$d->amount:null;

        $settlement_id = isset($d->settlement_id)?$d->settlement_id:null;
        if (empty($settlement_id)) $settlement_id = $this->getSettlementId($branch_id,$trx_type,$id);
        if (empty($id)) {
          return "Failed to delete because transaction id not not valid";
        } 

        if (empty($settlement_id)) {
          return "Failed to delete transaction because the settlement identifier is not found";
        }

        if (($trx_type !='disbursement') && $trx_type !='receipt'){
          return "Transaction type is not valid. The transaction type must be either receipt or disbursement";
        } else if ($trx_type =='receipt') {

          //$payer_type= null; //Retrieve payer_type if not supplied
          if ($payer_type !='driver' && $payer_type !='sender') {
            $rows = DB::table('cash_receipts AS c')->where('branch_id',$branch_id)->where('settlement_id',$settlement_id)->selectRaw('payer_type')->limit(1)->get();
            foreach($rows as $row) $payer_type = $row->payer_type;
          }
          
            $payer_type = strtolower($payer_type);
            if ($payer_type =='driver')
                {
                  DB::table('package')->where('branch_id',$branch_id)->where('driver_settlement_id',$settlement_id)->update(array(
                    'driver_settlement_id'=>null,
                    'driver_pmt_status_id'=>0
                  ));
                }
            else if ($payer_type =='sender')
                {
                  DB::table('package')->where('branch_id',$branch_id)->where('sender_settlement_id',$settlement_id)->update(array(
                    'sender_settlement_id'=>null,
                    'sender_pmt_status_id'=>0
                  ));
                } 
              DB::table('cash_receipts')->where('branch_id',$branch_id)->where('settlement_id',$settlement_id)->delete();
              return null;
        } else if (strtolower($trx_type =='disbursement'))
        {

          //$payee_type= null;
          $payee_type = strtolower($payee_type); 
          if ($payee_type !='driver' && $payee_type !='sender') {
            $rows = DB::table('cash_disbursements AS c')->where('c.branch_id',$branch_id)->where('c.settlement_id',$settlement_id)->selectRaw('payee_type')->limit(1)->get();
            foreach($rows as $row) $payee_type = $row->payee_type;
          }

          if ($payee_type =='sender') {
              DB::table('package')->where('branch_id',$branch_id)->where('sender_settlement_id',$settlement_id)->update(array(
                'sender_settlement_id'=>null,
                'sender_pmt_status_id'=>0
              ));
          } else if ($payee_type =='driver'){
            DB::table('package')->where('branch_id',$branch_id)->where('driver_settlement_id',$settlement_id)->update(array(
              'driver_settlement_id'=>null,
              'driver_pmt_status_id'=>0
            ));
          } 
          DB::table('cash_disbursements')->where('branch_id',$branch_id)->where('settlement_id',$settlement_id)->delete();
          return null;
        } 
        return "There was a problem in deleting transaction. The payee_type or payer_type is found invalid or missing";
      }

   function deletePayment($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id); 
        $id = isset($d->id)?$d->id:null;

        return "No yet defined";
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
 $ss = getSessionInfo($d);
 if(!$ss) return '#350'; //user not authenticated
 if (!prn_allowed(2)) return '@'; //need permission to do this task
 $branch_id = sanitize($ss->branch_id); 
 $id = isset($d->id)?$d->id:null;
 $settlement_id = isset($d->settlement_id)?$d->settlement_id:null;
 if (empty($settlement_id)) $settlement_id = $this->getSettlementId($branch_id,'disbursement',$id); 

 DB::table('package')->where('branch_id',$branch_id)->where('sender_settlement_id',$settlement_id)->update(array(
   'settlement_id'=>null,
   'sender_pmt_status_id'=>0
 ));
 DB::table('cash_disbursements')->where('branch_id',$branch_id)->where('settlement_id',$settlement_id)->delete();
 return null;
}

function getPaymentsFromDriver($d){
 $ss = getSessionInfo($d);
 if(!$ss) return '#350'; //user not authenticated
 if (!prn_allowed(2)) return '@'; //need permission to do this task
 $branch_id = sanitize($ss->branch_id); 
 $driver_id = isset($d->driver_id)?$d->driver_id:null;
 $start_date = isset($d->start_date)?$d->start_date:null;
 $end_date = isset($d->end_date)?$d->end_date:null; 
 
 $start_date = convertDate($start_date);
 $end_date = convertDate($end_date);
 if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
 if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
 
 //Where payer_type ="driver"
 $more_wheres ="DATE(r.payment_date) >= '".$start_date."' AND DATE(r.payment_date) <='".$end_date."' ";
 $select_cols ="r.id,r.payer_id,r.payer_name, r.payer_type, DATE_FORMAT(r.payment_date,'%d %b %Y') AS payment_date, r.description, r.amount, r.pmt_type, r.pmt_method,r.cashier_name";
 $rows = DB::table('cash_receipts AS r')->where('branch_id',$branch_id)->where('payer_type','driver')->where('payer_id',$driver_id)->whereRaw($more_wheres)->selectRaw($select_cols)->get(); 
 return $rows;
}

//payToSender(), also used to settle zero payment to Vendor, save it to cash_disbursements table
function payToVendor($d) {
 $ss = getSessionInfo($d);
 if(!$ss) return '#350'; //user not authenticated
 if (!prn_allowed(2)) return '@'; //need permission to do this task
 $branch_id = sanitize($ss->branch_id);
 $ids = isset($d->ids)?$d->ids:null;
 $payee_id = isset($d->payee_id)?$d->payee_id:null;
 $payment_date = isset($d->payment_date)?convertDate($d->payment_date):null;
 $payee_type = isset($d->payee_type)?sanitize($d->payee_type):null; // {'payment to vendor', driver, sender, etc..}
 $payee_name = isset($d->payee_name)?($d->payee_name):null;
 $amount_due = isset($d->amount_due)?sanitize($d->amount_due):0;
 $amount = isset($d->amount)? sanitize($d->amount):0; //Amount pay to vendor
 $description = isset($d->description)?sanitize($d->description):null;
 if($description==null) $description = isset($d->notes)?sanitize($d->notes):null; 
 $pmt_method = isset($d->pmt_method)? $d->pmt_method:null;
 $pmt_type ="Payment to Vendor";
 if (empty( $description ))  $description  ='Pay to vendor';
 if ($payee_type =='sender') $pmt_type ='Payment to Vendor';
 $result = (object)array('status'=>'OK','error_message'=>null);
 if (empty($pmt_method)){
   $result->status ='Error';
   $result->error_message ='Payment method not correct';
   return $result;
 } 
 if (empty($payee_id) || $payee_id <=0){
   $result->status ='Error';
   $result->error_message ='Payee identity is not correct!';
   return $result;
 }

 $settlement_id = $this->createUniqID($ss,10);
 
 if (!(bool)strtotime($payment_date)) $payment_date = getNowTime();
 DB::table('cash_disbursements')->insert(array(
   'settlement_id'=>$settlement_id,
   'branch_id'=>$branch_id,
   'payee_id'=>$payee_id, //very important to sender_id (payee)
   'payment_date'=>$payment_date,
   'payee_name'=>$payee_name,
   'payee_type'=>$payee_type, /*sender */
   'description'=>$description,
   'amount'=>$amount,
   'pmt_method'=>$pmt_method, /* Cash, Wing,ABA,ACLEDA, ... */
   'pmt_type'=>$pmt_type, /** "Payment to vendor" **/
   'cashier_name'=>$ss->login_name,
   'create_user'=>$ss->login_name,
   'create_date'=>getNowTime()
 ));

 $new_id = DB::getPdo()->lastInsertId();
 if ($new_id>0) {
     // if(empty($ids)) $ids =0;
     // $ids = str_replace('|',',',$ids);
     // $more_wheres = "id IN (".$ids.")";
     // DB::table('package')->where('branch_id',$branch_id)->whereRaw($more_wheres)->update(array(
     //   'driver_pmt_status_id'=>1,
     //   'driver_trx_id'=>$new_id
     // ));

     if (isset($d->packages)) {
       $cs = (array)$d->packages;
       $c; $i=0;
       do{
          if(!isset($cs[$i])) break;
          $c = (object)$cs[$i];
          $c->cod_amount = isset($c->cod_amount)?$c->cod_amount:0;
          $c->price = $c->cod_amount;
          $c->forwarding_cost = isset($c->forwarding_cost)?$c->forwarding_cost:0;  

           DB::table('package')->where('branch_id',$branch_id)->where('id',$c->package_id)->update(array(
             'sender_pmt_status_id'=>1,
             //'sender_trx_id'=>$new_id,
             'sender_settlement_id'=>$settlement_id,
             'price'=>$c->cod_amount,
             'forwarding_cost'=>$c->forwarding_cost,
             //'sender_adjust_amount'=>is_numeric($c->adjust_amount)?$c->adjust_amount:0,
             'sender_pmt_notes'=>$c->adjust_notes //payment notes
           ));   
          $i++;
       }while($c);
     }
     $result->status ='OK';
     $result->error_message =null;
     return $result;
 }
   return DV::error('Failed to save payment');
}

   //returns list of settled packages per settlement
   function getSettledPackages($d){
         $ss = getSessionInfo($d);
         if(!$ss) return '#350'; //user not authenticated
         if (!prn_allowed(2)) return '@'; //need permission to do this task
         $branch_id = sanitize($ss->branch_id); 
         $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
         $settlement_id = isset($d->settlement_id)?$d->settlement_id:null;
         $rows = DB::select(DB::raw("SELECT p.id,p.delivery_type,p.sender_id,DATE_FORMAT(p.create_date,'%d %b %Y') AS booking_date, p.sender_name, p.receiver_name,p.receiver_phone,p.zone_code,
         p.df_payer,
         cod,price,
         IFNULL(p.cod_fee,0) AS cod_fee, 
         get_cod_amount(p.cod,p.price,p.cod_fee) AS cod_amount,
         (p.base_fee + IFNULL(p.delivery_fee,0)) AS fee,
         ifnull(p.sender_total,0) AS sender_total,
         p.failure_notes,p.billed_kg, p.status_id, ps.name AS `status`,d.code AS driver_code, d.name AS driver_name FROM `package` AS `p`
         INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
         INNER JOIN `driver` as `d` ON d.id = p.driver_id LIMIT 10"
         //." WHERE p.branch_id =$branch_id AND p.sender_settlement_id ='$settlement_id' ORDER BY p.create_date DESC"
         ));
     
         return $rows;
   }


   //delete attachment| delete transaction photo
   function deleteTransactionAttachment($d){
     $ss = getSessionInfo($d);
     if(!$ss) return '#350'; //user not authenticated
     if (!prn_allowed(2)) return '@'; //need permission to do this task
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
    // //Upload attachment for vendor transaction | upload image or upload photo
    // function saveTransactionAttachment($d){
    //    $ss = getSessionInfo($d);
    //    if(!$ss) return '#350'; //user not authenticated
    //    if (!prn_allowed(2)) return '@'; //need permission to do this task

    //    $result = (object)array('error_message'=>null,'status'=>'OK');

    //    $branch_id = sanitize($ss->branch_id); 
    //    $trx_type = isset($d->trx_type)?$d->trx_type:null;
    //    $trx_id = isset($d->trx_id)?$d->trx_id:null;

    //    if (empty($trx_id) || $trx_id <=0) {
    //      $result->error_message ='Transaction id is not valid';
    //      $result->status ='Error';
    //      return $result;
    //    }

    //    if (strtolower($trx_type) !='disbursement' && strtolower($trx_type) !='receipt') {
    //      $result->error_message ='Transaction type is not valid';
    //      $result->status ='Error';
    //      return $result;
    //    }

    //    $file_content = isset($d->file_content)?$d->file_content:null;
    //    if(empty($file_content)) $file_content = isset($d->img_data)?$d->img_data:null;
    //    $file_type = isset($d->file_type)? sanitize($d->file_type):null;
                 
    //    $allowed_file_types = ['jpg','png','jpeg','svg'];

    //      //$dir = getcwd(). '/storage/companies/'.$branch_id.'_data/identity/';
    //      $dir = getcwd(). '/uploads/companies/'.$branch_id.'_data/transactions_merchant/';
    //      //DB::table('um_branches')->where('branch_id',1)->update(array('photo_file_name'=>$dir));   
    //      $fileName =$dir.$branch_id."_trx_img_".date('Ymd_hms');
    //      $mResult = createFile($file_type,$fileName,$file_content);   
    //      ////DB::table('um_branches')->where('branch_id',$branch_id)->update(array('photo_file_name'=>$mResult->error)); 
    //      if (!$mResult->error)
    //      {
    //        if (strtolower($trx_type)=='disbursement') {
    //            $rows = DB::table('cash_disbursements AS d')->where('d.branch_id',$branch_id)->where('d.id',$trx_id)->limit(1)->selectRaw('file_name')->get();
    //            foreach($rows as $row) deleteFile($row->file_name); 
    //             //re-save the file   
    //             DB::table('cash_disbursements')->where('id',$trx_id)->where('branch_id',$branch_id)->update(array(
    //               'file_type'=>$file_type,
    //               'file_name'=>$mResult->filename
    //             ));
    //        }else {
    //          $rows = DB::table('cash_receipts AS d')->where('d.branch_id',$branch_id)->where('d.id',$trx_id)->limit(1)->selectRaw('file_name')->get();
    //          foreach($rows as $row) deleteFile($row->file_name); 
    //             //re-save the file   
    //             DB::table('cash_receipts')->where('id',$trx_id)->where('branch_id',$branch_id)->update(array(
    //               'file_type'=>$file_type,
    //               'file_name'=>$mResult->filename
    //             ));
    //        }
    //        //here, assume the update was effective. Todo: Change this code later to verify if update of file_name is succeeded
    //        $result->error_message =null;
    //        $result->status ='OK';     
    //      } 
    //      else 
    //      {
    //        $result->error_message =$mResult->error;
    //        $result->status ='Error';
    //        return $result;
    //      }		  
           
    //      return $result;
 
    // }
 

      //getTransactions() used by merchant mobile app, Not backend system
      //$d={sender_id,[start_date],[$end_date]}// today date is used when no dates given
      function getTransactions_sender($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id); 
        $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
        $start_date = isset($d->start_date)?$d->start_date:null;
        $end_date = isset($d->end_date)?$d->end_date:null; 
         
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
         
          if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
          if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
         
        $str_pay_sender =" AND d.payee_type ='Sender' AND d.payee_id ='".$sender_id."' ";
        $str_from_sender = " AND d.payer_type ='Sender' AND d.payer_id ='".$sender_id."' ";
        $str_dates = " AND DATE(d.payment_date) >= '".$start_date."' AND DATE(d.payment_date) <= '".$end_date."'";
  
        $sql ="SELECT d.file_name, d.id, DATE_FORMAT(d.payment_date,'%d %b %Y') AS payment_date,'Disbursement' AS trx_type, 'ទទួល' AS special_notes, `description`, d.amount,d.pmt_method,d.cashier_name from cash_disbursements AS d WHERE d.branch_id ='".$branch_id."'".$str_pay_sender.$str_dates. 
        " UNION
        SELECT d.file_name, d.id, DATE_FORMAT(d.payment_date,'%d %b %Y') AS payment_date,'Receipt' AS trx_type, 'វេរចេញ' AS special_notes, `description`, d.amount,d.pmt_method,d.cashier_name from cash_receipts AS d WHERE d.branch_id ='".$branch_id."' ".$str_from_sender.$str_dates;
        $rows = DB::select(DB::raw($sql));
        //load image for each transaction
        foreach($rows as $row) {
          $content = readFileContent($row->file_name);   
          //$p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->photo_file_type.";"."base64".getEncodedChar(',');
          //****Return for javascript client
          //return $p.base64_encode($content);
          //**** return direct from server
          $img_data = "data:image/jpg;base64,".base64_encode($content);
          $row->file_name = null;
          $row->img_data = $img_data; 
        }
        return $rows;
      }
  
  //returns photo or screenshot of bank transfer for a given transaction id
  function getAttachmentsByTransaction_sender($id){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = sanitize($ss->branch_id); 
      $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
  } 

  function getPaymentsToVendor($d){
    $ss = getSessionInfo($d);
    if(!$ss) return '#350'; //user not authenticated
    if (!prn_allowed(2)) return '@'; //need permission to do this task
    $branch_id = sanitize($ss->branch_id); 
    $sender_id = isset($d->sender_id)?$d->sender_id:null;
    $start_date = isset($d->start_date)?$d->start_date:null;
    $end_date = isset($d->end_date)?$d->end_date:null; 
    
    $start_date = convertDate($start_date);
    $end_date = convertDate($end_date);
    if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
    if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
    //where payer_type ="sender"
    $more_wheres ="DATE(b.payment_date) >= '".$start_date."' AND DATE(b.payment_date) <='".$end_date."' ";
    $select_cols ="b.id,b.payee_id,b.payee_name, b.payee_type, DATE_FORMAT(d.payment_date,'%d %b %Y') AS payment_date,b.description. b.amount, b.pmt_type, b.pmt_method,encode_email(b.cashier_name) AS cashier_name";
    $rows = DB::table('cash_disbursements AS b')->where('branch_id',$branch_id)->where('payee_type','sender')->where('payee_id',$sender_id)->whereRaw($more_wheres)->selectRaw($select_cols)->get(); 
    return $rows;
  }

     function deletePackageAttachment($d){
       return "This method not yet working";
     }
 
     //saveTransactionPhoto()
     //$user_class is important for WHERE to save image file. There are public/1_data/merchant or driver or general
     //user_class = {'merchant','driver','general'}
     //$d = {'user_class','trx_type','trx_id','file_type','photo_data'}
     function savePhoto($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $trx_id = isset($d->trx_id)?$d->trx_id:null;
        $trx_type = isset($d->trx_type)?$d->trx_type:null;
        $user_class =isset($d->user_class)?$d->user_class:null;
        $file_type =isset($d->file_type)?$d->file_type:null;
        $photo_data = isset($d->photo_data)?$d->photo_data:null;
        $prev_file_name = null;

        $result = (object)['error_message'=>null,'status'=>'OK'];

        //get previous uploaded image, if any (the image file to be deleted after new photo uploaded)
        $info = $this->getProps($trx_type,$trx_id,['file_name']);
        if($info) $prev_file_name = $info->file_name; 
        $m = $this->savePhoto_local($ss, $user_class,$trx_type,$trx_id,$file_type,$photo_data);
        if(!$m->error) {
          //$result->upload_id = $m->upload_id;
          $result->image_url = htmlspecialchars(PublicStorage::getUrl($branch_id,$user_class,'image').$m->file_name);
          if($prev_file_name) {
              $prev_file_path = PublicStorage::getDiskPath($branch_id,$user_class,'image').$prev_file_name;
              deleteFile($prev_file_path);
          }

        }else $result->error_message =$m->error; 
        if(!empty($result->error_message)) $result->status ='Error';
        return $result;
     }

     //$d = {'trx_type',trx_id,user_class}
     function deleteTransactionPhoto($d){
      $ss = getSessionInfo($d);
      if(!$ss) return '#350'; //user not authenticated
      if (!prn_allowed(2)) return '@'; //need permission to do this task
      $branch_id = sanitize($ss->branch_id);
      $trx_id = isset($d->trx_id)?$d->trx_id:null;
      $trx_type = isset($d->trx_type)?$d->trx_type:null;
      $user_class =isset($d->user_class)?$d->user_class:null;
      $file_name = null;

      $info = $this->getProps($trx_type,$trx_id,['file_name']);
      if($info) $file_name = $info->file_name;
     
      if($file_name){
        $file_path = PublicStorage::getDiskPath($branch_id,$user_class,'image').$file_name;
        $del_err = deleteFile($file_path);
        if(!empty($del_err)) return $del_err;
      }
      return null;
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
      

        $m = PublicStorage::saveImage($branch_id, $user_class,$file_type,$photo_data);
        if($m->status=='OK')
        {
            $file_name = $m->file_name;
            $file_url = PublicStorage::getUrl($branch_id,$user_class,$category).$file_name;
            DB::table($table1)->where('id',$trx_id)->update(array('file_type'=>$file_type,'file_name'=>$file_name));  

            // DB::table('uploads')->insert(array(
            //    'branch_id'=>$branch_id,
            //    "user_class"=>$user_class,
            //    'file_type'=>$file_type,
            //    "file_name"=>$file_name,
            //    "category"=>"image",
            //    "is_private"=>0,
            //    "owner_user_id"=>$ss->user_id,
            //    "create_date"=>getNowTime(),
            //    'create_user'=>$ss->login_name
            // ));
            //$res->upload_id = DB::getPdo()->lastInsertId();
            
            $res->file_name = $file_name;
            if ($res->upload_id){
                DB::table($table)->insert(array(
                  'trx_type'=>$trx_type,
                  'branch_id'=>$branch_id,
                  'trx_id'=>$trx_id,
                  'upload_id'=>$res->upload_id,
                  'file_url'=>$file_url,
                  'create_user'=>$ss->login_name,
                  'create_date'=>getNowTime()
                ));
                $res->error_message = null;
                return $res;
            } else {
              //failed to insert record to table "uploads"
              $res->error_message = "File saved but failed to book data about the upload info";
              return $res;
            }  
            
        }else $res->error_message = $f_error;

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
          $row->image_url = PublicStorage::getUrl($branch_id,$user_class,'image').$row->file_name;
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

     //getTransactions getPaymentsBySender(), getpaymentList by Merchant, payments to merchant
     function getTransactionList_merchant($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id); 
        $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
        $start_date = isset($d->start_date)?$d->start_date:null;
        $end_date = isset($d->end_date)?$d->end_date:null; 
         
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
        if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
        if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
        $str_pay_sender =" AND d.payee_type ='Sender' AND d.payee_id ='".$sender_id."' ";
        $str_from_sender = " AND d.payer_type ='Sender' AND d.payer_id ='".$sender_id."' ";
        $str_dates = " AND DATE(d.payment_date) >= '".$start_date."' AND DATE(d.payment_date) <= '".$end_date."'";
  
        $sql ="SELECT d.id as trx_id,d.settlement_id,d.file_name, DATE_FORMAT(d.payment_date,'%d %b %Y') AS payment_date,'Disbursement' AS trx_type, CONCAT('Pay to ',payee_name) AS special_notes, description, d.amount,d.pmt_method,d.cashier_name from cash_disbursements AS d WHERE d.branch_id ='".$branch_id."'".$str_pay_sender.$str_dates. 
        " UNION
        SELECT d.id as trx_id,d.settlement_id,d.file_name, DATE_FORMAT(d.payment_date,'%d %b %Y') AS payment_date,'Receipt' AS trx_type, CONCAT('Received from ',payer_name) AS special_notes, description, d.amount,d.pmt_method,d.cashier_name from cash_receipts AS d WHERE d.branch_id ='".$branch_id."' ".$str_from_sender.$str_dates;
        $rows = DB::select(DB::raw($sql));
         //load image for each transaction
         foreach($rows as $row)
         {
            $row->image_url = htmlspecialchars(PublicStorage::getUrl($branch_id,'merchant','image').$row->file_name);
            if(!isset($row->image_url)) $row->image_url=null;      
            $row->file_name = null;
         }
        return $rows;
      }
   

      //receivePayments() takes array as paramters. Receiving two payments at once (one pmt in Cash and the otner pmt by bank transfer such as ABA transfer or ACLEDA trasnfer)
 //$d = {'packages'= [], 'pmts'=[]}. ($d->pmts  and $d->packages) will be used
 function receivePayments($d) {
  $ss = getSessionInfo($d);
  if(!$ss) return '#350'; //user not authenticated
  if (!prn_allowed(2)) return '@'; //need permission to do this task
  $branch_id = sanitize($ss->branch_id);
  //$ids = isset($d->ids)?$d->ids:null;
  $pmts = isset($d->pmts)? (array)$d->pmts:[];
  $result = (object)array('status'=>'OK','error_message'=>null);
  
  $x = 0;
  $settlement_id = $this-> createUniqID($ss,10); //must be declared outide the loop
  do{ 
     if(!isset($pmts[$x])) break;
          $p = (object)$pmts[$x];
          $payer_id = isset($p->payer_id)?$p->payer_id:null;
          $payment_date = isset($p->payment_date)?convertDate($p->payment_date):null;
          $payer_type = isset($p->payer_type)?sanitize($p->payer_type):null; // {driver, sender, etc..}
          $payer_name = isset($p->payer_name)?($p->payer_name):null;
          $amount_due = isset($p->amount_due)?sanitize($p->amount_due):0;
          $amount = isset($p->amount)? sanitize($p->amount):0;
          $description = isset($p->description)?sanitize($p->description):null;
          if($description==null) $description = isset($d->notes)?sanitize($d->notes):null; 
          if($description==null) $description ='Payment received';
          $pmt_method = isset($p->pmt_method)? $p->pmt_method:null;
          $pmt_type ="driver payment";
          if ($payer_type =='sender') $pmt_type ='sender payment';
        
          if (empty($pmt_method)){
            $result->status ='Error';
            $result->error_message ='Payment method "'.$pmt_method.'" not correct';
            return $result;
          } 
          if (empty($payer_id) || $payer_id <=0){
            $result->status ='Error';
            $result->error_message ='Payer identity is not correct!';
            return $result;
          }
          if (!(bool)strtotime($payment_date)) $payment_date = getNowTime();
          
          DB::table('cash_receipts')->insert(array(
            'settlement_id'=>$settlement_id, //settlement_id consists of one or many trx_ids because one settlement can be two transactions: one in Cash and ther other one by Bank transfer 
            'branch_id'=>$branch_id,
            'payer_id'=>$payer_id, //very important to identify driver or sender for reporting
            'payment_date'=>$payment_date,
            'payer_name'=>$payer_name,
            'payer_type'=>$payer_type, /* driver, sender */
            'description'=>$description,
            'amount'=>$amount,
            'pmt_method'=>$pmt_method, /* Cash, Wing,ABA,ACLEDA, ... */
            'pmt_type'=>$pmt_type, /** "driver payment", "sender payment" **/
            'cashier_name'=>$ss->login_name,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
          ));
          // if (empty($settlement_id)) {
          //    $new_id = DB::getPdo()->lastInsertId();
          //    DB::table('cash_receipts')->where('branch_id',$branch_id)->where('id',$new_id)->update(array('settlement_id',$new_id));
          // }
         
     $x++;
  }while($p);
    
  if ($x>0) {
      // if(empty($ids)) $ids =0;
      // $ids = str_replace('|',',',$ids);
      // $more_wheres = "id IN (".$ids.")";
      // DB::table('package')->where('branch_id',$branch_id)->whereRaw($more_wheres)->update(array(
      //   'driver_pmt_status_id'=>1,
      //   'driver_trx_id'=>$new_id
      // ));

       $cs = isset($d->packages)?(array)$d->packages:[];     
        $c; $i=0;
        if ($payer_type =='sender') 
        {
                do{
                  if(!isset($cs[$i])) break;
                  $c = (object)$cs[$i];
                  $c->cod_amount = isset($c->cod_amount)?$c->cod_amount:0;
                  $c->price = $c->cod_amount;
                  $c->forwarding_cost = isset($c->forwarding_cost)?$c->forwarding_cost:0;   
                  DB::table('package')->where('branch_id',$branch_id)->where('id',$c->package_id)->update(array(
                    'sender_pmt_status_id'=>1,
                    'sender_settlement_id'=>$settlement_id,
                    'price'=>$c->cod_amount,
                    'forwarding_cost'=>$c->forwarding_cost,
                    'sender_adjust_amount'=>is_numeric($c->adjust_amount)?$c->adjust_amount:0,
                    'sender_pmt_notes'=>$c->adjust_notes //payment notes
                  ));   
                  $i++;
              }while($c);
        }else if ($payer_type =='driver') {
                do{
                  if(!isset($cs[$i])) break;
                  $c = (object)$cs[$i];
                  //NOTE: it is important to update Price (or COD_amount) and update frowarding_cost when receiving payment from driver
                  DB::table('package')->where('branch_id',$branch_id)->where('id',$c->package_id)->update(array(
                    'driver_pmt_status_id'=>1,
                    'driver_settlement_id'=>$settlement_id,
                    'price'=>$c->cod_amount,
                    //'cod_amount'=>$c->cod_amount,
                    'forwarding_cost'=>is_numeric($c->forwarding_cost)?$c->forwarding_cost:0,
                    'driver_pmt_notes'=>$c->adjust_notes //payment notes
                  ));   
                  $i++;
              }while($c);
        }
      $result->status ='OK';
      $result->error_message =null;
      return $result;
  }

      $result->status ='Error';
      $result->error_message ='Failed to save payment';
      return $result;
}

      //get transaction attachments or photo files. This methos returns array [{trx_id,img_data}]
    function getTransactionAttachments($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id); 
        $sender_id = isset($d->sender_id)? sanitize($d->sender_id):null;
        $start_date = isset($d->start_date)?$d->start_date:null;
        $end_date = isset($d->end_date)?$d->end_date:null; 
         
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
         
          if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
          if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
         
        $str_pay_sender =" AND d.payee_type ='Sender' AND d.payee_id ='".$sender_id."' ";
        $str_from_sender = " AND d.payer_type ='Sender' AND d.payer_id ='".$sender_id."' ";
        $str_dates = " AND DATE(d.payment_date) >= '".$start_date."' AND DATE(d.payment_date) <= '".$end_date."'";
  
        $sql ="SELECT d.id, d.file_name,d.file_type from cash_disbursements AS d WHERE d.branch_id ='".$branch_id."'".$str_pay_sender.$str_dates. 
        " UNION
        SELECT d.id, d.file_name, d.file_type from cash_receipts AS d WHERE d.branch_id ='".$branch_id."' ".$str_from_sender.$str_dates;
        $rows = DB::select(DB::raw($sql));
        $imgs= [];
        foreach($rows as $row){
           $content = readFileContent($row->file_name);   
          //$p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->photo_file_type.";"."base64".getEncodedChar(',');
          //****Return for javascript client
          //return $p.base64_encode($content);
          //**** return direct from server
           $imgs[] = (object)array('trx_id'=>$row->id,'img_data'=>"data:image/jpg;base64,".base64_encode($content));
  
        }
        return $imgs;
      }

      //Must also allow zero payment to be saved as a transaction (called zero settlement)
    function receivePayment($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $ids = isset($d->ids)?$d->ids:null;
        $payer_id = isset($d->payer_id)?$d->payer_id:null;
        $payment_date = isset($d->payment_date)?convertDate($d->payment_date):null;
        $payer_type = isset($d->payer_type)?sanitize($d->payer_type):null; // {driver, sender, etc..}
        $payer_name = isset($d->payer_name)?($d->payer_name):null;
        $amount_due = isset($d->amount_due)?sanitize($d->amount_due):0;
        $amount = isset($d->amount)? sanitize($d->amount):0;
        $description = isset($d->description)?sanitize($d->description):null;
        if($description==null) $description = isset($d->notes)?sanitize($d->notes):null; 
        if($description==null) $description ='Payment received';
        $pmt_method = isset($d->pmt_method)? $d->pmt_method:null;
        $pmt_type ="driver payment";
        if ($payer_type =='sender') $pmt_type ='sender payment';
        $result = (object)array('status'=>'OK','error_message'=>null);
        if (empty($pmt_method)){
          $result->status ='Error';
          $result->error_message ='Payment method not correct';
          return $result;
        } 
        if (empty($payer_id) || $payer_id <=0){
          $result->status ='Error';
          $result->error_message ='Payer identity is not correct!';
          return $result;
        }

        $settlement_id = $this->createUniqID($ss,10);
        if (!(bool)strtotime($payment_date)) $payment_date = getNowTime();
        DB::table('cash_receipts')->insert(array(
          'settlement_id'=>$settlement_id,
          'branch_id'=>$branch_id,
          'payer_id'=>$payer_id, //very important to identify driver or sender for reporting
          'payment_date'=>$payment_date,
          'payer_name'=>$payer_name,
          'payer_type'=>$payer_type, /* driver, sender */
          'description'=>$description,
          'amount'=>$amount,
          'pmt_method'=>$pmt_method, /* Cash, Wing,ABA,ACLEDA, ... */
          'pmt_type'=>$pmt_type, /** "driver payment", "sender payment" **/
          'cashier_name'=>$ss->login_name,
          'create_user'=>$ss->login_name,
          'create_date'=>getNowTime()
        ));
        $new_id = DB::getPdo()->lastInsertId();
        if ($new_id>0) {
            // if(empty($ids)) $ids =0;
            // $ids = str_replace('|',',',$ids);
            // $more_wheres = "id IN (".$ids.")";
            // DB::table('package')->where('branch_id',$branch_id)->whereRaw($more_wheres)->update(array(
            //   'driver_pmt_status_id'=>1,
            //   'driver_trx_id'=>$new_id
            // ));

            if (isset($d->packages)) {
              $cs = (array)$d->packages;
              $c; $i=0;
              if ($payer_type =='sender') 
              {
                      do{
                        if(!isset($cs[$i])) break;
                        $c = (object)$cs[$i];
                        $c->cod_amount = isset($c->cod_amount)?$c->cod_amount:0;
                        $c->price = $c->cod_amount;
                        $c->forwarding_cost = isset($c->forwarding_cost)?$c->forwarding_cost:0;   
                        DB::table('package')->where('branch_id',$branch_id)->where('id',$c->package_id)->update(array(
                          'sender_pmt_status_id'=>1,
                          'sender_settlement_id'=>$settlement_id,
                          //'sender_trx_id'=>$new_id,
                          'price'=>$c->cod_amount,
                          'forwarding_cost'=>$c->forwarding_cost,
                          'sender_adjust_amount'=>is_numeric($c->adjust_amount)?$c->adjust_amount:0,
                          'sender_pmt_notes'=>$c->adjust_notes //payment notes
                        ));   
                        $i++;
                    }while($c);
              }else if ($payer_type =='driver') {
                      do{
                        if(!isset($cs[$i])) break;
                        $c = (object)$cs[$i];
                        //NOTE: it is important to update Price (or COD_amount) and update frowarding_cost when receiving payment from driver
                        DB::table('package')->where('branch_id',$branch_id)->where('id',$c->package_id)->update(array(
                          'driver_pmt_status_id'=>1,
                          'driver_settlement_id'=>$settlement_id,
                          //'driver_trx_id'=>$new_id,
                          'price'=>$c->cod_amount,
                          //'cod_amount'=>$c->cod_amount,
                          'forwarding_cost'=>is_numeric($c->forwarding_cost)?$c->forwarding_cost:0,
                          'driver_pmt_notes'=>$c->adjust_notes //payment notes
                        ));   
                        $i++;
                    }while($c);
              }
            }
            $result->status ='OK';
            $result->error_message =null;
            return $result;
        }
            return DV::error('Failed to save payment');
      }

}
