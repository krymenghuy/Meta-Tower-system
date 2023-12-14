<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SalesAgent;
use App\Models\UM;
use App\Models\JDV;

class SalesAgentController extends Controller
{
    protected $salesAgentModel;
    
    function saveSalesAgent(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id;
        $agent = new SalesAgent($id,$ss);
      return JDV::raw($agent->save($req->all()));
   }

   function deleteSalesAgent(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $req->id;
      $agent = new SalesAgent($id,$ss);
      return JDV::raw($agent->delete());
   }

   /** returns the paginated list */
   function getList(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      return JDV::result(SalesAgent::list($req->all(),$ss));
   }
   
     /** returns list of all Sales agent */
   function getListAll(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      return JDV::result(SalesAgent::listAll($req->all(),$ss));
   }

   function getFormOptions(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !== 200) return JDV::raw($ss);
    $id = $req->id;
    return JDV::result(SalesAgent::getFormOptions($id,$ss));
   }

   function getDetails(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !== 200) return JDV::raw($ss);
    $id = $req->id;
    return JDV::result(SalesAgent::details($id,$ss));
  }
}
