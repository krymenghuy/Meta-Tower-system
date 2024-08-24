<?php

namespace App\Http\Controllers\Umt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use App\Models\Umt\Application;

class ApplicationController extends Controller
{
    function getApplicationList(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        //$arr = ['subs_id','role_id','search_value']
        $rows = Application::list($req->all(), $ss);
        return JDV::result($rows); 
    }

    function getEligibleUsers(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->app_id;
        $app = new Application($id,$ss);
        $app_id = $req->app_id;
        $data = $app->getEligibleUsers($app_id,$ss);
        return JDV::result($data); 
    }

    function deleteApplication(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->app_id;
        $app = new Application($id,$ss);
        $res = $app->delete($id);
        return JDV::raw($res); 
    }

    function saveApplication(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->app_id;
        $app = new Application($id,$ss);
        $res = $app->save($req->all());
        return JDV::raw($res); 
    }
    function getFormOptions(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->app_id;
        $data = Application::getFormOptions($id,$ss);
        return JDV::result($data); 
    }
}
