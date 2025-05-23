<?php

namespace App\Http\Controllers\Ypg;

use App\Http\Controllers\Controller;
use App\Models\Ypg\Report;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class ReportController extends Controller
{
  function getReportList(Request $req)
  {
    $ss = XAuthService::verifyAuth($req, -1);
    if ($ss->status_code != 200) return $ss; //user not authenticated
    //$branch_id = $ss->branch_id;
    return JDV::result(Report::list($ss));
  }

  function getMemberListByStatus(Request $req)
  {
    $ss = XAuthService::verifyAuth($req, -1);
      if ($ss->status_code !== 200) {
          return JDV::raw($ss);
      }
      $rpt = new Report();
      return JDV::result($rpt->getMemberListByStatus($req->all(),$ss));
  }

  function getExpiredMembers(Request $req)
  {
      $ss = XAuthService::verifyAuth($req, -1);
      if ($ss->status_code !== 200) {
          return JDV::raw($ss);
      }
      $rpt = new Report();
      return JDV::result($rpt->getExpiredMembers($req->all(),$ss));
  }

  function getTaskAssign(Request $req)
  {
      $ss = XAuthService::verifyAuth($req, -1);
      if ($ss->status_code !== 200) {
          return JDV::raw($ss);
      }
      $rpt = new Report();
      return JDV::result($rpt->getTaskAssign($req->all(),$ss));
  }

    //api getReportFilterOptions()| not web get
    function getReportFilterOptions(Request $req)
    {
      $ss = XAuthService::verifyAuth($req, -1);
      if ($ss->status_code != 200) return $ss; //user not authenticated
      //$branch_id = $ss->branch_id;
      $data = (object)[];
      $data->users =[]; //GeneralSettings::options_user($ss);
      return JDV::json($data);
    }

   function getActivities(Request $req){
      $ss = XAuthService::verifyAuth($req, -1);
      if ($ss->status_code != 200) return $ss; //user not authenticated
      //$branch_id = $ss->branch_id;
      $rpt = new Report();
      return JDV::result($rpt->getActivities($req->start_date,$req->end_date));
   }


}
