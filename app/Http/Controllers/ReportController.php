<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\JDV;
use App\Models\UM;
//use App\Models\GeneralSettings;

class ReportController extends Controller
{
  function getReportList(Request $req)
  {
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code != 200) return $ss; //user not authenticated
    //$branch_id = $ss->branch_id;
    return JDV::result(Report::list($ss));
  }

  //api getReportFilterOptions()| not web get
  function getReportFilterOptions(Request $req)
  {
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code != 200) return $ss; //user not authenticated
    //$branch_id = $ss->branch_id;
    $data = (object)[];
    $data->users =[]; //GeneralSettings::options_user($ss);
    return JDV::json($data);
  }

 function getActivities(Request $req){
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code != 200) return $ss; //user not authenticated
    //$branch_id = $ss->branch_id;
    $rpt = new Report();
    return JDV::result($rpt->getActivities($req->start_date,$req->end_date));
 }

  function getStudentList(Request $req){
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code != 200) return $ss; //user not authenticated
    //$branch_id = $ss->branch_id;
    $rpt = new Report();
    return JDV::result($rpt->getStudentList($req->term_id,$req->new_student));
  }

  function getNewStudents(Request $req){
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code != 200) return $ss; //user not authenticated
    //$branch_id = $ss->branch_id;
    $rpt = new Report();
    return JDV::result($rpt->getStudentList($req->term_id,1));
  }

  function getInvoicePayments(Request $req){
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code != 200) return $ss; //user not authenticated
    //$branch_id = $ss->branch_id;
    $rpt = new Report();
    return JDV::result($rpt->getInvoicePaymnents($req->all()));
  }

  function getInvoiceList(Request $req){
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code != 200) return $ss; //user not authenticated
    //$branch_id = $ss->branch_id;
    $rpt = new Report();
    return JDV::result($rpt->getInvoiceList($req->all()));
  }

  function getAttendanceList(Request $req){
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code != 200) return $ss;
    $rpt = new Report();
    return JDV::result($rpt->attendanceListReport($req->all(),$ss));
  }

  function getStudentInfoList(Request $req){
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code != 200) return $ss;
    $rpt = new Report();
    return JDV::result($rpt->getStudentListReport($req->all(),$ss));
  }

  function getFamilyInfoList(Request $req){
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code != 200) return $ss;
    $rpt = new Report();
    return JDV::result($rpt->getFamilyListReport($req->all(),$ss));
  }

  function optionsTerm(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code != 200) return $ss;
    $x = new Report();
    return JDV::result($x->optionsTerm($req->academic_year,$ss));
  }

}
