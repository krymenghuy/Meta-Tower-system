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
      // $branch_id =Session::get('branch_id',0);
      // if (!$branch_id) return redirect('/');
        
        $p = processQueryString($query_string);
        $trx_id = $p->tid; 
        
        $data['receipt'] = null;; 
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
            //error invalid parameters provided
            return view('errors.500');
        }

        // //if(!isset($p->startdate) || !isset($p->enddate)) $p->usealldates =1;
        $rtype = strtolower(isset($p->rtype) ? $p->rtype:null);
        $data['rtype']= $rtype;
        if(!$rtype){
          //error invalid report type
          return view('errors.500');
        }

        $branch = CompanyProfile::details($branch_id);

        switch($rtype){
          case 'medical_report':{
            $data['branch']= $branch;
            $data['title'] = "Medical Report";
            $data['company_name'] = "Clinic";
            break;
          }
          case 'medical_certificate':{
            $data['branch']= $branch;
            $data['title'] = "Medical Certificate";
            $data['company_name'] = "Clinic";
            break;
          }
          default:{
              $data['title'] = "IT SEEMS NO MATCHING REPORT NAME :)"; 
              break;
          }
        }
        return view('reports.genreport',$data);
    }

    public function general_invoice($query_string = null){
      if (!Session::get('login_name',null)) return redirect('/');
        $branch_id =Session::get('branch_id',0);
        if (!$branch_id) return redirect('/');
        $data['branch'] = $this->reportModel->getBranchInfo($branch_id);
        $p = processQueryString($query_string);
      
        if(!$p) {
            //error invalid parameters provided
            return view('errors.500');
        }

        // //if(!isset($p->startdate) || !isset($p->enddate)) $p->usealldates =1;
        $rtype = strtolower(isset($p->rtype) ? $p->rtype:null);
        $data['rtype']= $rtype;
        if(!$rtype){
          //error invalid report type
          return view('errors.500');
        }

        $branch = CompanyProfile::details($branch_id);

        switch($rtype){
          case 'invoice_report':{
            $data['branch'] = $branch;
            $data['title'] = "INVOICE";
            break;
          }
          default:{
              $data['title'] = "IT SEEMS NO MATCHING REPORT NAME :)";
              break;
          }
        }
        return view('reports.geninvoice',$data);
    }
}
