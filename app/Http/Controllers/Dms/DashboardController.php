<?php

namespace App\Http\Controllers\Dms;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dms\Dashboard;
use App\Models\JDV;
use App\Models\UM;
use Illuminate\Support\Facades\Cache;
//use DB;

class DashboardController extends Controller
{
    protected $dashboardModel;
    public function __construct()
    {
        $this->dashboardModel = new Dashboard();
    }
     
    function getDashboardData(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $cache_key = 'dashb_'.$ss->user_class.$ss->user_id;
        $cache_data = Cache::get($cache_key);
        if($cache_data !== null) return JDV::result($cache_data);
        $db = new Dashboard(null,$ss);
        $data = $db->getData($req->all(),$ss);
        Cache::put($cache_key,$data,30);
        return JDV::result($data);
    }
     
    function getPerformanceStats(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $cache_key = 'dashbperformancestats_'.$ss->user_class.$ss->user_id;
        $cache_data = Cache::get($cache_key);
        if($cache_data !== null) return JDV::result($cache_data);
        $start_date = date('Y-m-d');
        $end_date = $start_date;
        //$db = new Dashboard();
        $data = Dashboard::getPerformanceStats($start_date,$end_date,$ss);
        Cache::put($cache_key,$data,5);
        return JDV::result($data);
    }
 
    function getPackageStatistics(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $cache_key = 'dashbpgstats_'.$ss->user_class.$ss->user_id;
        $cache_data = Cache::get($cache_key);
        if($cache_data !== null) return JDV::result($cache_data);
        $start_date = date('Y-m-d');
        $end_date = $start_date;
        $data = Dashboard::getPackageStatistics($start_date,$end_date,$ss);
        Cache::put($cache_key,$data,5);
        return JDV::result($data);
    }
    
    function getPayableVendors_table(Request $request){
        $ss = UM::getUserInfoByToken($request,-1);
        if($ss->status_code !=200) return $ss;
        $r = $this->dashboardModel->getPayableVendors_table($request->all(),$ss); 
        return JDV::result($r);
    }

    //getCollections| getDataTable_one| getCashCollection| getPayment 
    function getDailyCollections(Request $request){
        $ss = UM::getUserInfoByToken($request,-1);
        if($ss->status_code !=200) return $ss;
        //if(!UM::access_mod(200)) return JDV::result((object)[]);
        $r = $this->dashboardModel->getDailyCollections($request->all(),$ss); 
        return JDV::result($r);
    }

    function getDashboardData_table(Request $request){
        $ss = UM::getUserInfoByToken($request,-1);
        if($ss->status_code !=200) return $ss;
        $r = $this->dashboardModel->getDashboardData_table($request->all(),$ss); 
        return JDV::result($r);
    }
    
    function getDashboardData_piechart(Request $request){
        $ss = UM::getUserInfoByToken($request,-1);
        if($ss->status_code !=200) return $ss;
        $r = $this->dashboardModel->getDashboardData_piechart($request->all(),$ss); 
        return JDV::result($r);
    }

    function getDashboardData_summary(Request $request){
        $ss = UM::getUserInfoByToken($request);
        if($ss->status_code !=200) return $ss;
        $r = $this->dashboardModel->getDashboardData_summary($request,$ss); 
        return JDV::result($r);
    }
    
    function getDashboardData_barchart(Request $request){
        $ss = UM::getUserInfoByToken($request,-1);
        if($ss->status_code !=200) return $ss;
        $r = $this->dashboardModel->getDashboardData_barchart($request,$ss); 
        return JDV::result($r);
    }
     
//     function getPackageCounts(Request $request) {
//         $ss = UM::getUserInfoByToken($request);
//         if($ss->status_code !=200) return $ss;

//         $r = $this->dashboardModel->getPackageCounts($request,$ss); 
//        return JDV::result($r); 
//    }
//    function getData_card1(Request $request) {
//     $ss = UM::getUserInfoByToken($request);
//     if($ss->status_code !=200) return $ss;

//     $r = $this->dashboardModel->getData_card1($ss,$request); 
//     return JDV::result($r);
// }
}
