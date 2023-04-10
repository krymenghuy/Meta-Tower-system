<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\ServicePlan;
use App\Models\JDV;

class ServicePlanController extends Controller
{
    function saveServicePlan(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $sp = new ServicePlan($req->id,$ss);
      return JDV::raw($sp->save($req->all()));
    }

    function deleteServicePlan(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $sp = new ServicePlan($req->id,$ss);
        return JDV::raw($sp->delete());
   }

   function getServicePlans(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $sp = new ServicePlan($req->id,$ss);
    return JDV::result($sp->getList());
   }
   function getServicePlanDetails(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $sp = new ServicePlan($req->id,$ss);
    return JDV::result($sp->getDetails());
    
   }

}
