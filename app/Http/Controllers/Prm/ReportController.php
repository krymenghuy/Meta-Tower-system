<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Prm\Report;
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
  

    function getTotalPaymentHistory(Request $req){
        $ss = XAuthService::verifyAuth($req,290);
        if($ss->status_code != 200) return $ss;
        $report = new Report();
        return JDV::result($report->getTotalPaymentHistory($req->all(),$ss));
    }

    function getPaymentReport(Request $req){
        $ss = XAuthService::verifyAuth($req,289);
        if($ss->status_code != 200) return $ss;
        $report = new Report();
        return JDV::raw($report->getPaymentReport($req->all(),$ss));
    }
}
