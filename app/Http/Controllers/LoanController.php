<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\Loan;
use App\Models\JDV;

use Session;
use DB;


class LoanController extends Controller
{
    // public function __construct() {
    //     $this->loanModel = new Loan();
    // }
     
    //$d = {"start_date","first_pmt_date","customer_id"}
    function approveLoanApp (Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss); //user not authenticated
      $branch_id = $ss->branch_id;
      $disbursed = isset($req->disbursed)?$req->disbursed:0;  
      //$loan_app_id = $req->loan_app_id;

      //begin::ensure that loan_application is up to date
          $sanitize_options =[];
          $res = getValues($req,[
            'loan_app_id'=>"0|identity=1",
            'loan_type_id'=>'1|positive',
            'borrower_id'=>"1|positive",
            'purpose_id'=>'0|number',
            'loan_tenure'=>'1|positive|text=Loan period is required',
            'loan_tenure_unit'=>'1|choice|days,weeks,months',
            'compound_cycle'=>'1|choice|daily,weekly,monthly',
            'principal'=>'1|positive|default=0|text=Loan principal is required',
            'cbc_fee'=>'0|number',
            'admin_fee'=>'0|number',
            'laywer_fee'=>'0|number',
             'currency_code'=>'1|string|0-10',
            'period_interest_rate'=>"1|number",
            'start_date'=>'1|date|formatTo=Y-m-d',
            'first_pmt_date'=>'1|date',
            'payback_method_id'=>'1|positive',
            'credit_officer_id'=>'0|number',
            'referrer_id'=>'0|number', 
            'remarks'=>'0|string'
            ,'status_id'=>'0|number|default=2'
          ],true,$sanitize_options,false,null);

          //1=Pending , status_id =2 (Approved), status_id =3 (disbursed)
          if ($res->error) return JDV::error($res->error);
         $loan_app_id = isset($res->loan_app_id)?$res->loan_app_id:0;
         $inputs = $res->values;
        
         //convert some dates to correct mySql format 
         $inputs['first_pmt_date'] = convertDate($inputs['first_pmt_date']);
         $inputs['start_date'] = convertDate($inputs['start_date']);
         if ($disbursed==1)   $inputs['status_id']=3; 
         if (!$loan_app_id || $loan_app_id <=0) return JDV::error("It seems the loan application does not exist");
         //unset($inputs['loan_app_id']);
         $loan_app_id = saveData($ss,'loan_applications',['id'=>$loan_app_id],$inputs,[],1);

         if ($disbursed==1){
            $m_res = $this->disburseLoan_internal($ss,$req);
            if ($m_res->status ==='Error') return JDV::error($m_res->error_message);
            else return JDV::success($m_res->data);
            // deleteDataRow('loans',['loan_app_id'=>$loan_app_id,'branch_id'=>$branch_id]);

            // $inputs['loan_app_id'] = $loan_app_id;
            // $new_loan_id = saveData($ss,'loans',['id'=>0],$inputs,[],1);

            // $new_loan_code ="";
            // if ($new_loan_id>0){
            //   $new_loan_code = Loan::set_loan_code($ss,$new_loan_id);
            //   Loan::set_borrower_code($ss,$new_loan_id);
            // }
            //return JDV::success(['loan_app_id'=>$loan_app_id,'loan_id'=>$new_loan_id,'loan_code'=>$new_loan_code]);
         }
      //End:: Update application data
      return JDV::success(['loan_app_id'=>$loan_app_id]);
       
    }

    function discountPrincipal(Request $request) { 
      $r = $this->loanModel->discountPrincipal($request);
      return makeJsonResponse($r);
    }

    function getPromisoryNoteList(Request $request) { 
      $r = $this->loanModel->getPromisoryNoteList($request);
      return makeJsonResponse($r);
    }

    function savePromisoryNote(Request $request) { 
      $r = $this->loanModel->savePromisoryNote($request);
      return makeJsonResponse($r);
    }

    function deletePromisoryNote(Request $request) { 
      $r = $this->loanModel->deletePromisoryNote($request);
      return makeJsonResponse($r);
    }
 
    function getPayOffData (Request $request) { 
      $r = $this->loanModel->getPayOffData($request);
      return makeJsonResponse($r);
    }
 
    function temp_create_logins (Request $request) { 
        $r = $this->loanModel->temp_create_logins($request);
        return makeJsonResponse($r);
    }

    function payOffLoan (Request $request) { 
      $r = $this->loanModel->payOffLoan($request);
      return makeJsonResponse($r);
    }

    function getLoanInfo (Request $request) { 
      $r = $this->loanModel->getLoanInfo($request);
      return makeJsonResponse($r);
    }
    
    function getGuarantorList(Request $request) { 
      $r = $this->loanModel->getGuarantorList($request);
      return makeJsonResponse($r);
    }

    function getBorrowerList(Request $request) { 
      $r = $this->loanModel->getBorrowerList($request);
      return makeJsonResponse($r);
    }

    function getReceiptData_print(Request $request) { 
      $r = $this->loanModel->getReceiptData_print($request);
      return makeJsonResponse($r);
    }
    

    function getLoanAppInfo_disburse (Request $request) { 
      $r = $this->loanModel->getLoanAppInfo_disburse($request);
      return makeJsonResponse($r);
    }

    function deleteLoan (Request $request) { 
        $r = $this->loanModel->deleteLoan($request);
        return makeJsonResponse($r);
    }

    function saveLoan (Request $request) { 
        $r = $this->loanModel->saveLoan($request);
        return makeJsonResponse($r);
    }

    //$d = {'loan_app_id'}
    protected function disburseLoan_internal($ss,$req){
      $branch_id = $ss->branch_id;
      //begin::ensure that loan_application is up to date
          $sanitize_options =[];
          $res = getValues($req,[
            'loan_app_id'=>"0|number|identity=1",
            'borrower_id'=>"1|positive",
            'loan_type_id'=>'1|positive',
            'purpose_id'=>'0|number',
            'loan_tenure'=>'1|positive|default=0',
            'loan_tenure_unit'=>'1|choice|days,weeks,months',
            'currency_code'=>'1|string|0-10',
            'compound_cycle'=>'1|choice|daily,weekly,monthly',
            'principal'=>'1|positive|default=0|text=Loan principal is required',
            'period_interest_rate'=>"1|number",
            'lawyer_fee'=>'0|number|default=0',
            'cbc_fee'=>'0|number|default=0',
            'admin_fee'=>'0|number|default=0',
            'start_date'=>'1|date|formatTo=Y-m-d',
            'first_pmt_date'=>'1|date',
            'maturity_date'=>'0|date',
            'payback_method_id'=>'1|positive',
            'credit_officer_id'=>'0|number',
            'referrer_id'=>'0|number', 
            'remarks'=>'0|string'
            ,'status_id'=>'0|number|default=3'
          ],true,$sanitize_options,false,null);

          //1=Pending , status_id =2 (Approved), status_id =3 (disbursed)
          if ($res->error) return (object)['status'=>'Error','error_message'=>$res->error];
         $loan_app_id = isset($res->loan_app_id)?$res->loan_app_id:0;
         $inputs = $res->values;
         //convert some dates to correct mySql format 
         $inputs['first_pmt_date'] = convertDate($inputs['first_pmt_date']);
         $inputs['start_date'] = convertDate($inputs['start_date']);
         $inputs['status_id']=3; 
          
         if (!$loan_app_id || $loan_app_id <=0) return (object)['status'=>'Error','error_message'=>"It seems the loan application does not exist"];
         //unset($inputs['loan_app_id']);
         $loan_app_id = saveData($ss,'loan_applications',['id'=>$loan_app_id],$inputs,[],1);
 
         deleteDataRow('loans',['loan_app_id'=>$loan_app_id,'branch_id'=>$branch_id]);

         $inputs["loan_app_id"] = $loan_app_id;
         //For new loan only: loan's status =1 (Active) 2(Finished)
         $inputs['status_id'] =1;
         $inputs['outstanding_principal'] =$inputs['principal'];
         $new_loan_id = saveData($ss,'loans',['id'=>0],$inputs,[],1);
         $new_loan_code=null;
         if ($new_loan_id>0){
           $new_loan_code = Loan::set_loan_code($ss,$new_loan_id);
           Loan::set_borrower_code($ss,$new_loan_id);
         }
         return (object)['status'=>'OK','data'=>['loan_app_id'=>$loan_app_id,'loan_id'=>$new_loan_id,'loan_code'=>$new_loan_code]];

    }

    function disburseLoan (Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss); //user not authenticated
      $res = $this->disburseLoan_internal($ss,$req);
      if ($res->status ==='Error') return JDV::error($res->error_message);
      //NOTE: $res->data is resulted data to be sent back to frontend.
      return JDV::success($res->data);
    }

    function getLoanList(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult(401,[],"en",$ss->error_message); //user not authenticated
      $branch_id = $ss->branch_id;
      $select_cols ="l.id,getCurSymbol(l.currency_code,'$') as cur_symbol, l.code, date_format(l.start_date,'%d %b %Y') AS start_date, date_format(l.maturity_date,'%d %b %Y') as maturity_date, date_format(l.first_pmt_date,'%d %b %Y') as first_pmt_date,l.principal,l.outstanding_principal,l.period_interest_rate,l.loan_tenure,l.loan_tenure_unit,l.compound_cycle,l.borrower_id,l.admin_fee,l.cbc_fee,l.lawyer_fee,l.remarks,l.status_id,ss.name as status,l.create_date,
      CONCAT(p.last_name,' ',p.first_name) AS borrower_name, p.sex, p.phone_number as borrower_phone";
      $rows = DB::table("loans as l")->join('persons as p','p.id','=','l.borrower_id')->join('loan_statuses as ss','ss.id','=','l.status_id')->where('status_id',1)->where("l.branch_id",$branch_id)->selectRaw($select_cols)->orderByRaw("l.create_date DESC")->get();
      return JDV::json($rows);
    }
 
    function getFinishedLoanList (Request $request) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss); //user not authenticated
      $branch_id = $ss->branch_id;

      $select_cols ="l.id,getCurSymbol(l.currency_code,'$') as cur_symbol, l.code, date_format(l.start_date,'%d %b %Y') AS start_date, date_format(l.maturity_date,'%d %b %Y') as maturity_date, date_format(l.first_pmt_date,'%d %b %Y') as first_pmt_date,l.principal,l.outstanding_principal,l.period_interest_rate,l.loan_tenure,l.loan_tenure_unit,l.compound_cycle,l.borrower_id,l.admin_fee,l.cbc_fee,l.lawyer_fee,l.remarks,l.status_id,ss.name as status,
      CONCAT(p.last_name,' ',p.first_name) AS borrower_name, p.sex, p.phone_number as borrower_phone";
      $rows = DB::table("loans as l")->join('persons as p','p.id','=','l.borrower_id')->join('loan_statuses as ss','ss.id','=','l.status_id')->where('status_id',2)->where("l.branch_id",$branch_id)->selectRaw($select_cols)->get();
      return JDV::json($rows);
    }

    function getPaymentList(Request $request) { 
        $r = $this->loanModel->getPaymentList($request);
        return makeJsonResponse($r);
    }

    function getPaymentList_cu(Request $request) { 
      $r = $this->loanModel->getPaymentList_cu($request);
      return makeJsonResponse($r);
    }
         
    function saveLoanInterest(Request $request) { 
        if(!$request->discount_percent) $request->discount_percent =0;
        $ss = (object)['branch_id'=>session::get('branch_id',null)] ;
        $r = $this->loanModel->saveLoanInterest($request);
        return makeJsonResponse($r);
    }

    function calculatePmtAmounts(Request $request) { 
      if(!$request->discount_percent) $request->discount_percent =0;
      $ss = (object)['branch_id'=>session::get('branch_id',null)] ;

      $r = $this->loanModel->calculatePmtAmounts($ss,$request->loan_id,$request->amount,$request->discount_percent,$request->payment_date);
 
      return makeJsonResponse($r);
    }

    function getComboItems_loan(Request $request) { 
      $r = $this->loanModel->getComboItems_loan($request);
      return makeJsonResponse($r);
    }
    
    function getLoanList_cu(Request $request) { 
      $r = $this->loanModel->getLoanList_cu($request);
      return makeJsonResponse($r);
    }

  
    function getPaymentDetails(Request $request) { 
        $r = $this->loanModel->getPaymentDetails($request);
        return makeJsonResponse($r);
    }

    function deletePayment(Request $request) { 
        $r = $this->loanModel->deletePayment($request);
        return makeJsonResponse($r);
    }

    function savePayment(Request $request) { 
        $r = $this->loanModel->savePayment($request);
        return makeJsonResponse($r);
    }

    function getUsedups(Request $request) { 
        $r = $this->loanModel->getUsedups($request);
        return makeJsonResponse($r);
    }

    function saveUsedup(Request $request) { 
        $r = $this->loanModel->saveUsedup($request);
        return makeJsonResponse($r);
    }

    function deleteUsedup(Request $request) { 
        $r = $this->loanModel->deleteUsedup($request);
        return makeJsonResponse($r);
    }

}
