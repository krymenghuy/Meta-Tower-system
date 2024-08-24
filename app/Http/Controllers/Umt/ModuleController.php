<?php

namespace App\Http\Controllers\Umt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use App\Models\Umt\Module;

class ModuleController extends Controller
{
    function getModuleList(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        //$arr = ['subs_id','role_id','search_value']
        $rows = Module::list($req->all(), $ss);
        return JDV::result($rows); 
    }

    function deleteModule(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->module_id;
        $mod = new Module($id,$ss);
        $res = $mod->delete($id);
        return JDV::raw($res); 
    }

    function saveModule(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->module_id;
        $mod = new Module($id,$ss);
        $res = $mod->save($req->all(),$id);
        return JDV::raw($res); 
    }

    /** Import json file */
    function importModules(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->module_id;
        $res = Module::importJson($req->all());
        return JDV::raw($res); 
    }

    function getFormOptions(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->module_id;
        $data = Module::getFormOptions($id,$ss);
        return JDV::result($data); 
    }
}
