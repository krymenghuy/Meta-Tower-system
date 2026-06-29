<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenant\Dashboard;
use JDV;
use XAuthService;

class DashboardController extends Controller
{
      public function getDashboardData(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result(Dashboard::getDataDashboard($req->all(), $ss));
    }
    public function getFilterOptions(Request $req){
      $ss = XAuthService::verifyAuth($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $data = Dashboard::getFilterOptions($req->all(),$ss);
      return JDV::result($data);
   }
    
}
