<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Prm\Dashboard;
use JDV;
use XAuthService;


class DashboardController extends Controller
{
    public function summarizeDashboard(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $building_id = $req->building_id ?? 1;

        return JDV::result(Dashboard::summarizeDashboardCards($building_id, $ss));
    }

    public function getCharts(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $building_id = $req->building_id ?? 1;
        return JDV::result(Dashboard::getCharts($building_id, $ss));
    }
    public function getActivities(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $building_id = $req->building_id ?? 1;
        return JDV::result(Dashboard::getActivities($building_id, $ss));
    }
    public function getLeaseExpiry(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $building_id = $req->building_id ?? 1;
        return JDV::result(Dashboard::getLeaseExpiry($building_id, $ss));
    }
    public function getFilterOptions(Request $req){
      $ss = XAuthService::verifyAuth($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $data = Dashboard::getFilterOptions($req->all(),$ss);
      return JDV::result($data);
   }
}
