<?php

namespace App\Http\Controllers\Ypg;

use App\Http\Controllers\Controller;
use App\Models\Ypg\Dashboard;
use Illuminate\Http\Request;
use XAuthService;
use JDV;
class DashboardController extends Controller
{
    protected $dashboard;

    public function __construct()
    {
        $this->dashboard = new Dashboard();
    }
    function getDashboardData(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
            if($ss->status_code !== 200){
                return JDV::raw($ss);
            }
        $db = new Dashboard(null,$ss);
        $data = $db->getData($req->all(),$ss);
        return JDV::result($data);
    }

}
