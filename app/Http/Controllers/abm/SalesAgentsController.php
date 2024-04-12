<?php

namespace App\Http\Controllers\abm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
use App\Models\abm\SalesAgents;

class SalesAgentsController extends Controller
{
    protected $salesAgentsModel;

    function saveSalesAgents(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id ?? $req->agents_id;
        $agents = new SalesAgents($id,$ss);
        return JDV::raw($agents->save($req->all(),$id,$ss));

    }
    function getList(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !== 200) return JDV::raw($ss);
        return JDV::result(SalesAgents::list($req->all(),$ss));
     }
}
