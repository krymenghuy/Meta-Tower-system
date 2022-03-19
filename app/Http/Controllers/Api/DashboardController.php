<?php

namespace App\Http\Controllers\Api;

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

    function getPackageCounts(Request $request) {
        $r = $this->dashboardModel->getPackageCounts($request); 
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
         else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
   }
   function getData_card1(Request $request) {
    $r = $this->dashboardModel->getData_card1($request); 
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
     else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
}
}
