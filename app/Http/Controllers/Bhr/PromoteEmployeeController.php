<?php

namespace App\Http\Controllers\Bhr;
use App\Services\Umt\AuthService;
use App\Models\JDV;
use App\Models\Bhr\PromoteEmployee;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PromoteEmployeeController extends Controller
{
    function promoteEmployee(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $x = new PromoteEmployee();
        $promote =$x->promoteEmployee($req->all(),$ss);
        return JDV::raw($promote);
        
    }
}
