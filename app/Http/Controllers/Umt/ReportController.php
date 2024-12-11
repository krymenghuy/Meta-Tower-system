<?php

namespace App\Http\Controllers\Umt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use App\Models\Umt\Report;

class ReportController extends Controller
{
    function getReportList(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        //$arr = ['subs_id','role_id','search_value']
        $rows = Report::list($req->all(), $ss);
        return JDV::result($rows); 
    }

    function getReportActionNames(Request $req){
        $cols = Report::getActions(null);
        return JDV::result($cols);
    }
    function deleteReport(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->prn_id;
        $app = new Report($id,$ss);
        $res = $app->delete($id);
        return JDV::raw($res); 
    }

    function saveReport(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->prn_id;
        $app = new Report($id,$ss);
        $res = $app->save($req->all());
        return JDV::raw($res); 
    }

    function importJson(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->prn_id;
        $res = Report::importJson($req->all());
        return JDV::raw($res); 
    }

    function getFormOptions(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->prn_id;
        $data = Report::getFormOptions($id,$ss);
        return JDV::result($data);
    }
}
