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
      $rpt = new Report();
      return JDV::result($rpt->getEmployeeMovementReport($req->all(),$ss));
    }

    function getTotalPaymentHistory(Request $req){
        $ss = XAuthService::verifyAuth($req,290);
        if($ss->status_code != 200) return $ss;
        $report = new Report();
        return JDV::result($report->getTotalPaymentHistory($req->all(),$ss));
    }

    function getVendorPaymentReport(Request $req){
        $ss = XAuthService::verifyAuth($req,299);
        if($ss->status_code != 200) return $ss;
        $report = new Report();
        return JDV::raw($report->getVendorPaymentReport($req->all(),$ss));
    }
    function getTenantDepositList(Request $req){
        $ss = XAuthService::verifyAuth($req,300);
        if($ss->status_code != 200) return $ss;
        $report = new Report();
        return JDV::result($report->getTenantDepositList($req->all(),$ss));
    }

    function getIncomeByCategories(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code != 200) return $ss;
        $report = new Report();
        return JDV::result($report->getIncomeByCategories($req->all(),$ss));
    }
}
