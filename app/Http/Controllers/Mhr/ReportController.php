<?php

namespace App\Http\Controllers\Mhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mhr\Report;
use JDV;
use XAuthService;
class ReportController extends Controller
{
    function getReportList(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code != 200) return $ss; //user not authenticated
        //$branch_id = $ss->branch_id;
        return JDV::result(Report::list($ss));
    }
    public function getEmployeeMovementReport(Request $req){
      $ss = XAuthService::verifyAuth($req, -1);
      if ($ss->status_code !== 200) {
          return JDV::raw($ss);
      }
      $report = new Report();
      return JDV::result($report->getEmployeeMovementReport($req->all(),$ss));
    }

    public function getEmployeeBenefitReport(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $report = new Report();
        return JDV::result($report->getEmployeeBenefitsReport($req->all(),$ss));
    }
    public function getEmployeeList(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $report = new Report();
        return JDV::result($report->getEmployeeList($req->all(),$ss));
    }
    public function getPayrollList(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $report = new Report();
        return JDV::result($report->getPayrollList($req->all(),$ss));
    }

    function getIncomeByCategories(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code != 200) return $ss;
        $report = new Report();
        return JDV::result($report->getIncomeByCategories($req->all(),$ss));
    }
}
