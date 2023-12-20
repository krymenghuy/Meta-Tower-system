<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;
use App\Models\UM;
use App\Models\JDV;
 
class LeadController extends Controller
{
    function saveLead(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        $id = $req->id;
        $lead = new Lead($id,$ss);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = $lead->save($req->all(),$id,$ss); 
        return JDV::raw($res);
    }
    function getList_paginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data =Lead::list($req->all(),$ss);
        return JDV::result($data);
    }

    function getList_all(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data =Lead::list_all($req->all(),$ss);
        return JDV::result($data);
    }

    function deleteLead(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id;
        $lead = new Lead($id,$ss);
         $res =$lead->delete();
        return JDV::raw($res);
    }

    function deleteSpecial(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id;
        $lead = new Lead($id,$ss);
         $res =$lead->deleteSpecial();
        return JDV::raw($res);
    }
    
    function updateStatus(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id;
        $lead = new Lead($id,$ss);
        $res =$lead->updateStatus($req->status_id,$id,$ss);
        return JDV::raw($res);
    }
}
