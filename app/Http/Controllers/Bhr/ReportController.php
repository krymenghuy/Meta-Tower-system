<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Report;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class ReportController extends Controller
{
  function getReportList(Request $req)
  {
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code != 200) return $ss; //user not authenticated
    //$branch_id = $ss->branch_id;
    return JDV::result(Report::list($ss));
  }
  public function getEmployeeList(Request $req){
      $ss = AuthService::verifyAuth($req, -1);
      if ($ss->status_code !== 200) {
          return JDV::raw($ss);
      }
      $rpt = new Report();
      return JDV::result($rpt->getEmployeeList($req->all(),$ss));
  }
  public function getEmployeeListByType(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeListByType($req->all(),$ss));
  }

  public function getEmployeeAttendance(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeAttendance($req->all(),$ss));
  }

  public function getEmployeeAttendanceSummary(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeAttendanceSummary($req->all(),$ss));
  }

  public function getPayrollExpensesByMonth(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getPayrollExpensesByMonth($req->all(),$ss));
  }
  public function getPayrollList(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getPayrollList($req->all(),$ss));
  }
  public function getEmployeeAccountReport(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeAccountReport($req->all(),$ss));
  }
  public function getEmployeeBenefitsReport(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeBenefitsReport($req->all(),$ss));
  }
  public function getForEachAccount(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getForEachAccount($req->all(),$ss));
  }
  public function getWalletAccountList(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getWalletAccountList($req->all(),$ss));
  }
  public function getPayslipPrint(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getPayslipPrint($req->all(),$ss));
  }
  public function getEmployeeMovementReport(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeMovementReport($req->all(),$ss));
  }
  public function getPrintEmployeeCV(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getPrintEmployeeCV($req->all(),$ss));
  }
  
    //api getReportFilterOptions()| not web get
    function getReportFilterOptions(Request $req)
    {
      $ss = AuthService::verifyAuth($req, -1);
      if ($ss->status_code != 200) return $ss; //user not authenticated
      //$branch_id = $ss->branch_id;
      $data = (object)[];
      $data->users =[]; //GeneralSettings::options_user($ss);
      return JDV::json($data);
    }
  
   function getActivities(Request $req){
      $ss = AuthService::verifyAuth($req, -1);
      if ($ss->status_code != 200) return $ss; //user not authenticated
      //$branch_id = $ss->branch_id;
      $rpt = new Report();
      return JDV::result($rpt->getActivities($req->start_date,$req->end_date));
   }
  
}