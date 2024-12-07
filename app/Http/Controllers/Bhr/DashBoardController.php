<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Dashboard;
use Illuminate\Http\Request;
use App\Services\Umt\AuthService;
use App\Models\JDV;
class DashboardController extends Controller
{
    protected $dashboard;

    public function __construct(Dashboard $dashboard)
    {
        $this->dashboard = $dashboard;
    }
    function getDashboardData(Request $req){
        $ss = AuthService::verifyAuth($req, -1);
            if($ss->status_code !== 200){
                return JDV::raw($ss);
            } 

        
        $db = new Dashboard(null,$ss);
        $data = $db->getData($req->all(),$ss);
        return JDV::result($data);
    }

    public function countEmployees(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->dashboard->countEmployees($req->all(), $ss));
    }

    public function getDepartments(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->dashboard->getDepartments($req->all(), $ss));
    }

    public function getLevels(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->dashboard->getLevels($req->all(), $ss));
    }

    public function getBenefits(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->dashboard->getBenefits($req->all(), $ss));
    }
    
}
