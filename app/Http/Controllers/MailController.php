<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Mail;
use DB;
use Session;
use Carbon\Carbon;

class MailController extends Controller {
   public function basic_email() {
      $data = array('name'=>"Student's name");
   
      Mail::send(['text'=>'mail'], $data, function($message) {
         $message->to('vuthpg@gmail.com', 'Invoice')->subject
            ('Invoice No: PUC0000000001');
         $message->from('pucloan@puc.edu.kh','Paññāsāstra University');
      });
      echo "Basic Email Sent. Check your inbox.";
   }
   
   function getCompanyLogo($branch_id)
   {
         //$ss = getSessionInfo($data);
         //if(!$ss) return '#350'; //user not authenticated
         //if (!prn_allowed(2)) return '@'; //need permission to do this task
         //$branch_id = 1; //$ss->branch_id;
 
           $rows = DB::table('um_branches')->where('branch_id',$branch_id)->selectRaw('logo_file_name,logo_file_type')->limit(1)->get();
         foreach($rows as $row)
         {
           $content = readFileContent($row->logo_file_name);   
           $p = "data".getEncodedChar(':')."image".getEncodedChar("/").$row->logo_file_type.";"."base64".getEncodedChar(',');
           //****Return for javascript client
           //return $p.base64_encode($content);
           //**** return direct from server
           return  "data:image/jpg;base64,".base64_encode($content);
           
         }
         return null;
   }

   function getReceiptData_print($trx_id,$loan_id){
      // $ss = getSessionInfo($d);
      // if(!$ss) return '#350'; //user not authenticated
      // if (!prn_allowed(2)) return '@'; //need permission to do this task
      //$branch_id = 1; //$ss->branch_id;
      //$trx_id = 1; //isset($d->trx_id)?$d->trx_id:null;
      $cols ="r.branch_id,r.id, r.receipt_number,r.pmt_type, date_format(r.payment_date,'%d %b %Y') as payment_date,date_format(r.create_date,'%d %b %Y') as issue_date, r.amount, r.principal_amount,r.interest_amount,r.outstanding_principal,(SELECT name FROM pmt_methods WHERE id = r.pmt_method_id LIMIT 1) AS pmt_method,r.create_user,r.create_date,
       st.student_code as payer_code, CONCAT(b.last_name,' ',b.first_name) AS borrower_name, b.phone_number,b.email";

      $rows = DB::table('loan_collections As r')->join('loans as l','l.id','=','r.loan_id')->join('persons as b','b.id','=','l.borrower_id')->join('student_details as st','st.person_id','=','l.borrower_id')->where('r.id',$trx_id)->where('r.loan_id',$loan_id)->selectRaw($cols)->limit(1)->get();

      foreach($rows as $row){
         $data = [
             'to_email'=>$row->email,
             'branch_id'=>$row->branch_id, 
             'payment_date'=>$row->payment_date,
             'issue_date'=>$row->issue_date,
             'receipt_number'=>$row->receipt_number,
             'borrower_code'=>$row->payer_code,
             'payer_code'=>$row->payer_code,
             'payer_name'=>$row->borrower_name,
             'borrower_name'=>$row->borrower_name,
             'email'=>$row->email,
             'pmt_type'=>$row->pmt_type,
             'phone_number'=>$row->phone_number,
             'total'=>$row->amount,
             'currency'=>'$',
             'create_user'=>$row->create_user,
             'items'=>[
                 (object)['description'=>'Principal payment','pmt_method'=>$row->pmt_method,'amount'=>$row->principal_amount],
                 (object)['description'=>'Interest payment','pmt_method'=>$row->pmt_method,'amount'=>$row->interest_amount],
                 (object)['description'=>'Others','pmt_method'=>'NA','amount'=>'0']
             ]
         ]; 
         return (object)$data;    
      }
      return null;
      
  }

  //view receipt as html page 
  public function receipt($query_string){
      // $ss = getSessionInfo($d);
      // if(!$ss) return makeJsonResponse('#350'); //user not authenticated
      // if (!prn_allowed(2)) return makeJsonResponse('@'); //need permission to do this task
      // $p = processQueryString($d);
     
      $p = processQueryString($query_string);
      if(!$p) {
         echo "Failed to capture input data or receipt information!";
         return;
      }

      //$branch_id = $d->branch_id;
      $trx_id = $p->tid;
      $loan_id = $p->lid;

      $d = $this->getReceiptData_print($trx_id,$loan_id);
      if(!$d){
         echo "Failed to identify receipt information!";
         return;
      }
      //currently pass image logo as base64.
      $data['receipt'] = (object)['logo'=>$this->getCompanyLogo($d->branch_id),'data'=>$d];
      //echo var_dump($data['receipt'] );
      return view('reports.receipt',$data);
  }
 
  function getMailingInfo($trx_id,$loan_id){
    $rows = DB::table('loan_collections AS c')->join('loans AS l','l.id','=','c.loan_id')->join('persons AS p','p.id','=','l.borrower_id')->where('c.id',$trx_id)->where('l.id',$loan_id)->selectRaw("l.branch_id,l.id,p.email,p.phone_number, CONCAT(p.last_name,' ',p.first_name) AS borrower_name,c.receipt_number,date_format(c.payment_date,'%d %b %Y') AS payment_date")->limit(1)->get();
    foreach($rows as $row) return $row;
    return null;
  }

  //send email to student with a link to view reeceipt as html page
  function mailReceipt(Request $d) {
   $ss = getSessionInfo($d);
   if(!$ss) return makeJsonResponse('#350'); //user not authenticated
   if (!prn_allowed(2)) return makeJsonResponse('@'); //need permission to do this task
   $branch_id = $ss->branch_id; 

   //getMailingInfo() return object {'to_email','phone_number','borrower_name'}
   $ms = $this->getMailingInfo($d->trx_id,$d->loan_id);
   if(!$ms) return makeJsonResponse((object)['status'=>'Error','error_message'=>"Failed to identify receipt information!"]);
   //$mRes = $this->getReceiptData_print($d->trx_id,$d->loan_id);
   
   //if(!$mRes) return makeJsonResponse((object)['status'=>'Error','error_message'=>"Failed to identify receipt information!"]);
   
   //$to_email = $mRes->to_email;
   //return makeJsonResponse($email1);

   //$branch_id = $mRes->branch_id;
   //$to_phone_number = $mRes->phone_number; 
   //$img = $this->getCompanyLogo($branch_id);
     
   $q ="tid=$d->trx_id&lid=$d->loan_id&bid=$branch_id";
   $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
   $encrypted_q = $encrypter->encrypt($q,false); //FALSE => to avoid serialization issue in decryption

   $email_text = "We have received your payment on $ms->payment_date. Your receipt number is $ms->receipt_number.";
   $data = ['payment_date'=>$ms->payment_date,'receipt_number'=>$ms->receipt_number,'borrower_name'=>$ms->borrower_name,'encrypted_q'=>$encrypted_q,'email_text'=>$email_text];
   Mail::send('mail', $data, function($message) use ($ms){
      //$ms->email is destination email, or receiving email
      $message->to($ms->email, 'Receipt of Payment')->subject
         ('Receipt:');
      $message->from('pucloan@puc.edu.kh','Paññāsāstra University');
   });
   return makeJsonResponse((object)['status'=>'OK']);
   //echo "HTML Email Sent. Check your inbox.";
}


   public function html_email() {
      //$c = new \App\Models\CompanyProfile();
      $student = (object)['name'=>'student name'];
      $img = $this->getCompanyLogo(1);
      $receipt = $this->getReceiptData_print();
      $data = ['student'=>$student,'logo'=>$img];
      Mail::send('mail', $data, function($message) {
         $message->to('samsethy@gmail.com', 'Receipt of Payment')->subject
            ('Receipt:');
         $message->from('pucloan@puc.edu.kh','Paññāsāstra University');
      });
      return null;
      //echo "HTML Email Sent. Check your inbox.";
   }

   public function attachment_email() {
      $data = array('name'=>"Student's name");
      Mail::send('mail', $data, function($message) {
         $message->to('vuthpg@gmail.com', 'Invoice')->subject
            ('Invoice No: PUC0000000001 with Attachment');
         $message->attach('D:\Laravel\SendMail\public\uploads\puc.jpg');
         $message->attach('D:\Laravel\SendMail\public\uploads\attach.txt');
         $message->from('pucloan@puc.edu.kh','Paññāsāstra University');
      });
      echo "Email Sent with attachment. Check your inbox.";
   }
}