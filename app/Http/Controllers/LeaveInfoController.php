<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use App\Models\LeaveInfo;

class LeaveInfoController extends Controller
{
    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $leave = new LeaveInfo(null,$ss);
        return JDV::result($leave->getFormOptions($req->id,$req->enrollment_id));
    }

    function getList_paginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $leave = new LeaveInfo(null,$ss);
        return JDV::result($leave->list_paginate($req->all()));
    }

    function saveLeave(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id?$req->id:$req->leave_id;
        $leave = new LeaveInfo($id,$ss);
        return JDV::raw($leave->save($req->all(),$id));
    }

    function finalize(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id?$req->id:$req->leave_id;
        $leave = new LeaveInfo($id,$ss);
        return JDV::raw($leave->finalize($id));
    }

    function deleteLeave(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id?$req->id:$req->leave_id;
        $leave = new LeaveInfo($id,$ss);
        return JDV::raw($leave->delete());
    }
}

