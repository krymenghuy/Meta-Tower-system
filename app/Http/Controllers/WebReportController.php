<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\UM;
use App\Models\JDV;
use Session;
use Carbon\Carbon;
use DB;

class WebReportController extends Controller
{
    protected $reportModel;
    public function __construct(){
       $this->reportModel = new Report();
    }
    
    //api getReportList, not for Web Get
    function getReportList(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = $ss->branch_id;

      $rows =DB::select("SELECT id, `name`, `hidden`, code,category,rpt.module_id,rpt.params,rpt.display_order,rpt.hidden FROM reports AS rpt WHERE IFNULL(rpt.hidden,0) = 0 ORDER BY rpt.display_order ASC");
      return JDV::json($rows); 
        //    $rows = [
        //     (object)['id'=>1,'code'=>'revenues_by_level','name'=>"Revenues by level",'category'=>'payment'],
        //     (object)['id'=>2,'code'=>'summarized_revenues','name'=>"Summarized Revenues by semester",'category'=>'payment'],
        //     (object)['id'=>3,'code'=>'unpaid_students','name'=>"Unpaid Students by Level",'category'=>'payment'],
        //     (object)['id'=>4,'code'=>'enrolled_students','name'=>"Enrolled Students by Level",'category'=>'payment'],
        //    ];
        //  return JDV::json($rows);
   }

    //api getReportFilterOptions()| not web get
    function getReportFilterOptions(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = $ss->branch_id;
      $data = (object)[];
      $data->users= DB::select("SELECT id as `user_id`,  full_name As `user_name` FROM um_users AS u WHERE u.branch_id = '$branch_id' ORDER BY u.full_name asc");
      return JDV::json($data); 
   }
 
    public function receipt($query_string) { 
      // if (!Session::get('login_name',null)) return redirect('/');
      // $branch_id =Session::get('branch_id',0);
      // if (!$branch_id) return redirect('/');
        
        $p = processQueryString($query_string);
        $trx_id = $p->tid; 
        
        $data['receipt'] = null;; 
        return view('reports.receipt',$data);
    }
     
    public function pawn_contract($query_string=null){
        if (!Session::get('login_name',null)) return redirect('/');
        $branch_id =Session::get('branch_id',0);
        if (!$branch_id) return redirect('/');
        $data= [];
        
        $p = processQueryString($query_string);
        $loan_app_id = $p->loanappid;
        $loan_id = $p->loanid;

        $data['contract'] =$this->reportModel->getPawnContract($loan_app_id,$loan_id);
        $data['branch'] = $this->reportModel->getBranchInfo($branch_id);

        if(!$p) {
            //error invalid parameters provided
            return view('errors.500');
        }
        return view('reports.pawn_contract',$data);
    }

    public function loan_contract($query_string=null){
      if (!Session::get('login_name',null)) return redirect('/');
      $branch_id =Session::get('branch_id',0);
      if (!$branch_id) return redirect('/');
      $data= [];
      $data['branch'] = $this->reportModel->getBranchInfo($branch_id);
      $p = processQueryString($query_string);
     
      if(!$p) {
          //error invalid parameters provided
          return view('errors.500');
      }
      return view('reports.loan_contract',$data);
   }

   //generalReport()| genral report
    public function general_report($query_string=null) {
        if (!Session::get('login_name',null)) return redirect('/');
        $branch_id =Session::get('branch_id',0);
        if (!$branch_id) return redirect('/');
        $data['branch'] = $this->reportModel->getBranchInfo($branch_id);
        //$p = null;
        //try{
          $p = processQueryString($query_string);
          echo $p->rtype;
          return;
        //}catch(\Exception $e){
          //return response()->view('errors.500');
        //}finally {
          //return response()->view('errors.500');
        //}
      
        if(!$p) {
            //error invalid parameters provided
            return view('errors.500');
        }

        // //if(!isset($p->startdate) || !isset($p->enddate)) $p->usealldates =1;
        $rtype = strtolower(isset($p->rtype)?$p->rtype:null);
        $data['rtype']= $rtype;
        if(!$rtype){
          //error invalid report type
          return view('errors.500');
        }
  
        switch($rtype){
          case 'pmt_schedule':{
            $payback_method_id = isset($p->paybackmethodid)?$p->paybackmethodid:0;
            $data['title']="តារាងបង់ប្រាក់";
            // $start_date =isset($p->startdate)? $p->startdate:null;
            // $end_date = isset($p->enddate)?$p->enddate:null;
            $data['loan'] = [];
            if ($payback_method_id ==1) 
             {
                  $data['loan'] = $this->reportModel->getLoanSchedule_anuity([
                    'loan_id'=>isset($p->loanid)?$p->loanid:0,
                    'loan_app_id'=>isset($p->loanappid)?$p->loanappid:0,
                    'principal'=>$p->principal,
                    'loan_tenure'=>$p->loantenure,
                    'loan_tenure_unit'=>$p->loantenureunit,
                    'period_interest_rate'=>$p->periodinterestrate,
                    'compound_cycle'=>$p->compoundcycle,
                    'start_date'=>$p->startdate,
                    'first_pmt_date'=>$p->firstpmtdate,
                    'currency_code'=>$p->currencycode
                ]);
                $data['subtitle'] ="បង់ចំនួនស្មើរមានដើមនិងការប្រាក់";
                //From genreport.php => refers to report content file "pmt_sched_anuity.php"
                $data['rtype']= 'pmt_sched_anuity';
             }
            else if ($payback_method_id ==2){
                    $data['loan'] = $this->reportModel->getLoanSchedule_balloon([
                      'loan_id'=>$p->loanid,
                      'loan_app_id'=>$p->loanappid,
                      'principal'=>$p->principal,
                      'loan_tenure'=>$p->loantenure,
                      'loan_tenure_unit'=>$p->loantenureunit,
                      'period_interest_rate'=>$p->periodinterestrate,
                      'compound_cycle'=>$p->compoundcycle,
                      'start_date'=>$p->startdate,
                      'first_pmt_date'=>$p->firstpmtdate,
                      'currency_code'=>$p->currencycode
                    ]);
                    $data['subtitle'] ="បង់តែការប្រាក់និងបង់ប្រាក់ដើមចុងគ្រា";
                   //From genreport.php => refers to report content file "pmt_sched_anuity.php"
                   $data['rtype']= 'pmt_sched_balloon';
            }
            break;
          }
          default:{
              $data['title'] ="IT SEEMS NO MATCHING REPORT NAME :)"; 
              break;
          }
        }
        return view('reports.genreport',$data);
    }
}
