<?php

namespace App\Http\Controllers\Umt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Umt\AuthService;
use App\Models\JDV;
use App\Models\Umt\UMTSettings;

class UMTSettingController extends Controller
{
    function options_role_group(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data =UMTSettings::options_role_group ($ss);
        return JDV::result($data); 
    }
    
    function options_user_class(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data =UMTSettings::options_user_class ($ss);
        return JDV::result($data); 
    }

    function options_web_app(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data =UMTSettings::options_web_app($ss);
        return JDV::result($data); 
    }

    function options_mobile_app(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data =UMTSettings::options_mobile_app($ss,$req->filter_code);
        return JDV::result($data); 
    }

    function options_app(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data =UMTSettings::options_app($ss);
        return JDV::result($data); 
    }

    function options_branch(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data =UMTSettings::options_branch($ss);
        return JDV::result($data); 
    }  
}
