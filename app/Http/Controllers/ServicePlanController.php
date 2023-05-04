<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\ServicePlan;
use App\Models\JDV;

class ServicePlanController extends Controller
{
    function getFormOptions(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      return JDV::result(ServicePlan::form_options($ss));
    }

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
    return JDV::result($sp->getList($req->all()));
   }

   function getServicePlanDetails(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $sp = new ServicePlan($req->id,$ss);
    return JDV::result($sp->getDetails());
   }

   function removeSubscriber(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->service_plan_id? $req->service_plan_id : $req->id;
    $sp = new ServicePlan($id,$ss);
    return JDV::raw($sp->removeSubscriber($req->client_id));
   }
   
   function addSubscriber(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->service_plan_id? $req->service_plan_id : $req->id;
      $sp = new ServicePlan($id,$ss);
      return JDV::raw($sp->addSubscriber($req->all()));
   }

   function getSubscribers(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $sp = new ServicePlan($req->id,$ss);
    return JDV::result($sp->getSubscribers());
   }

   function getSubscriberCount(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $sp = new ServicePlan($req->id,$ss);
      return JDV::result($sp->getSubscriberCount());
   }

}
