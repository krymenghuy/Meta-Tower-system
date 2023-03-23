<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\UM;
use App\Models\JDV;
use App\Models\CompanyProfile;
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
       $branch_id =Session::get('branch_id',0);
      // if (!$branch_id) return redirect('/');
        
        $p = processQueryString($query_string);
        $pmt_id = $p->id; 
        $ss = (object)['branch_id'=>$branch_id];
        $payment = new \App\Models\Invoice\Payment($pmt_id,$ss);
        $data['receipt'] = $payment->getDetails();; 
        return view('reports.receipt',$data);
    }

   //generalReport()| genral report
    public function general_report($query_string=null) {
        if (!Session::get('login_name',null)) return redirect('/');
        $branch_id =Session::get('branch_id',0);
        if (!$branch_id) return redirect('/');
        $data['branch'] = $this->reportModel->getBranchInfo($branch_id);
        $p = processQueryString($query_string);

        if(!$p) {
          return view('errors.500');
        }
        
        $rtype = isset($p->rtype) ? $p->rtype : null;
        $ticket_id = isset($p->id) ? $p->id : null;
        $ss = (object)['branch_id'=>$branch_id];
        $consultation = new \App\Models\Consultation($ticket_id,$ss);
        $data['rtype'] = $rtype;

        switch($rtype){
          case 'medical_report':{
            $data['title']="Medical Report";
            $data['consult'] = $consultation->getDetails();
            break;
          }
          case 'general_report':{
            $data["title"] = "Client Report";
            $data["client"] = "";
            break;
          }
          case 'medical_certificate':{
            $data['title']="Medical Certificate";
            $data['consult'] = $consultation->getDetails();
            //dd($data);return;
            break;
          }
          default:{
            $data['title'] = "Title Report";
            return view('reports.genreport',$data);
            break;
          }
        }
        return view('reports.genreport',$data);
    }

    public function general_invoice($query_string=null){
      if (!Session::get('login_name',null)) return redirect('/');
        $branch_id =Session::get('branch_id',0);
        if (!$branch_id) return redirect('/');
        $data['branch'] = \App\Models\CompanyProfile::details($branch_id);   
        $p = processQueryString($query_string);

        if(!$p) {
          return view('errors.500');
        }

        $invoice_id = isset($p->id)?$p->id:0;
        $ss = (object)['branch_id'=>$branch_id];
        $invoice = new \App\Models\Invoice\MedicalInvoice($invoice_id,$ss);
        $data['invoice'] = $invoice->getDetails();
        $data['title'] = "ESTHEDERM Aesthetic & Dermatology";
        $data['rtype'] =$p->rtype;
        return view('reports.invoice', $data);
    }

    public function employee_profile($query_string = null){
      if (!Session::get('login_name',null)) return redirect('/');
        $branch_id =Session::get('branch_id',0);
        if (!$branch_id) return redirect('/');
        $data['branch'] = \App\Models\CompanyProfile::details($branch_id);   
        $p = processQueryString($query_string);

        if(!$p) {
          return view('errors.500');
        }

        $employee_id = isset($p->id) ? $p->id : 0;
        $ss = (object)['branch_id'=>$branch_id];

        $data["title"] = "Employee Profile";

        return view("reports.employee_profile",$data);
    }
}