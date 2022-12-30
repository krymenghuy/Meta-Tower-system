<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dashboard;

class DashboardController extends Controller
{
    protected $dashboardModel;
    public function __construct()
    {
        $this->dashboardModel = new Dashboard();
    }
  
    function getDashboardData(Request $request){
        $r = $this->dashboardModel->getDashboardData($request); 
        return makeJsonResponse($r);
     
    }

    function getDashboardData_table(Request $request){
        $r = $this->dashboardModel->getDashboardData_table($request); 
        return makeJsonResponse($r);
    }
    
    function getDashboardData_piechart(Request $request){
        $r = $this->dashboardModel->getDashboardData_piechart($request); 
        return makeJsonResponse($r);
    }

    function getDashboardData_summary(Request $request){
        $r = $this->dashboardModel->getDashboardData_summary($request); 
        return makeJsonResponse($r);
    }
    
    function getDashboardData_barchart(Request $request){
        $r = $this->dashboardModel->getDashboardData_barchart($request); 
        return makeJsonResponse($r);
    }
    

    function getPackageCounts(Request $request) {
        $r = $this->dashboardModel->getPackageCounts($request); 
        return makeJsonResponse($r);
   }

  
}
