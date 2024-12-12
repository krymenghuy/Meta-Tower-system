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
      return JDV::result($rpt->getEmployeeListByType($req->all(),$ss));
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
    return JDV::result($rpt->getEmployeeListByType($req->all(),$ss));
  }

  public function getEmployeeAttendanceSummary(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeListByType($req->all(),$ss));
  }

  public function getPayrollExpensesByMonth(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeListByType($req->all(),$ss));
  }
  public function getPayrollList(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeListByType($req->all(),$ss));
  }
  public function getEmployeeAccountReport(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeListByType($req->all(),$ss));
  }
  public function getEmployeeBenefitsReport(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeListByType($req->all(),$ss));
  }
  public function getForEachAccount(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeListByType($req->all(),$ss));
  }
  public function getWalletAccountList(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeListByType($req->all(),$ss));
  }
  public function getPayslipPrint(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeListByType($req->all(),$ss));
  }
  public function getEmployeeMovementReport(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeListByType($req->all(),$ss));
  }
  public function getPrintEmployeeCV(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $rpt = new Report();
    return JDV::result($rpt->getEmployeeListByType($req->all(),$ss));
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
  
    function getStudentList(Request $req){
      $ss = AuthService::verifyAuth($req, -1);
      if ($ss->status_code != 200) return $ss; //user not authenticated
      //$branch_id = $ss->branch_id;
      $rpt = new Report();
      return JDV::result($rpt->getStudentList($req->term_id,$req->new_student));
    }
  
    function getNewStudents(Request $req){
      $ss = AuthService::verifyAuth($req, -1);
      if ($ss->status_code != 200) return $ss; //user not authenticated
      //$branch_id = $ss->branch_id;
      $rpt = new Report();
      return JDV::result($rpt->getStudentList($req->term_id,1));
    }
  
    function getInvoicePayments(Request $req){
      $ss = AuthService::verifyAuth($req, -1);
      if ($ss->status_code != 200) return $ss; //user not authenticated
      //$branch_id = $ss->branch_id;
      $rpt = new Report();
      return JDV::result($rpt->getInvoicePaymnents($req->all()));
    }
  
    function getInvoiceList(Request $req){
      $ss = AuthService::verifyAuth($req, -1);
      if ($ss->status_code != 200) return $ss; //user not authenticated
      //$branch_id = $ss->branch_id;
      $rpt = new Report();
      return JDV::result($rpt->getInvoiceList($req->all()));
    }
  
    function getAttendanceList(Request $req){
      $ss = AuthService::verifyAuth($req, 277);
      if ($ss->status_code != 200) return $ss;
      $rpt = new Report();
      return JDV::result($rpt->attendanceListReport($req->all(),$ss));
    }
  
    function getStudentInfoList(Request $req){
      $ss = AuthService::verifyAuth($req, -1);
      if ($ss->status_code != 200) return $ss;
      $rpt = new Report();
      return JDV::result($rpt->getStudentListReport($req->all(),$ss));
    }
  
    function getFamilyInfoList(Request $req){
      $ss = AuthService::verifyAuth($req, -1);
      if ($ss->status_code != 200) return $ss;
      $rpt = new Report();
      return JDV::result($rpt->getFamilyListReport($req->all(),$ss));
    }
  
    function optionsTerm(Request $req){
      $ss = AuthService::verifyAuth($req,-1);
      if($ss->status_code != 200) return $ss;
      $x = new Report();
      return JDV::result($x->optionsTerm($req->academic_year,$ss));
    }
  
    function getDailyCashList(Request $req){
      $ss = AuthService::verifyAuth($req,279);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->getDailyCash($req->all(),$ss));
    }
    function getMonthlyCashList(Request $req){
      $ss = AuthService::verifyAuth($req,280);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->getMonthlyCash($req->all(),$ss));
    }
  
  
    function getReferalFeeList(Request $req){
      $ss = AuthService::verifyAuth($req,278);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->getReferalFeeList($req->all(),$ss));
    }
  
    function getNonTuitionFeeList(Request $req){
      $ss = AuthService::verifyAuth($req,281);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->getNonTuitionFee($req->all(),$ss));
    }
  
    function getReceivers(Request $req){
      $ss = AuthService::verifyAuth($req,-1);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->getReceivers());
    }
  
    function getIncomeByCategories(Request $req){
      $ss = AuthService::verifyAuth($req,'282.view');
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->getIncomeByCategories($req->all(),$ss));
    }
  
    function getIncomeByClass(Request $req){
      $ss = AuthService::verifyAuth($req,283);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->getIncomeByClass($req->all(),$ss));
    }
  
    function getStudentDepositeList(Request $req){
      $ss = AuthService::verifyAuth($req,284);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->getStudentDeposit($req->all(),$ss));
    }
  
    function getTotalPaymentByMonth(Request $req){
      $ss = AuthService::verifyAuth($req,285);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->getTotalPaymentByMonth($req->all(),$ss));
    }
  
    function getTotalPaymentByYear(Request $req){
      $ss = AuthService::verifyAuth($req,286);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->getTotalPaymentByYear($req->all(),$ss));
    }
  
    function getTotalStudentPaymentHistory(Request $req){
      $ss = AuthService::verifyAuth($req,290);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->getTotalStudentPaymentHistory($req->all(),$ss));
    }
  
    function getLeaveStudent(Request $req){
      $ss = AuthService::verifyAuth($req,287);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->LeaveStudents($req->all(),$ss));
    }
  
    function getComeBackStudents(Request $req){
      $ss = AuthService::verifyAuth($req,287);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->ComeBackStudents($req->all(),$ss));
    }
  
    function getTotalPaymentHistoryByYear(Request $req){
      $ss = AuthService::verifyAuth($req,288);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->getTotalPaymentHistoryByYear($req->all(),$ss));
    }
  
    function getSchoolFee(Request $req){
      $ss = AuthService::verifyAuth($req,291);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->getSchoolFee($req->all(),$ss));
    }
  
    function getStudentPaymentHistory(Request $req){
      $ss = AuthService::verifyAuth($req,289);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::raw($report->getStudentPaymentHistory($req->all(),$ss));
    }
  
    function studentRequestChange(Request $req){
      $ss = AuthService::verifyAuth($req,289);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->studentRequestChange($req->all(),$ss));
    }
  
    function crossYearReceipt(Request $req){
      $ss = AuthService::verifyAuth($req,289);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->crossYearReceipt($req->all(),$ss));
    }
  
    function upgradeFee(Request $req){
      $ss = AuthService::verifyAuth($req,289);
      if($ss->status_code != 200) return $ss;
      $report = new Report();
      return JDV::result($report->upgradeFee($req->all(),$ss));
    }

}
