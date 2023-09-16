<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
use App\Models\OtherFee;
class OtherFeeController extends Controller
{
    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new OtherFee(null,$ss);
        return JDV::result($p->getFormOptions());
    }

    function getList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new OtherFee(null,$ss);

        return JDV::result($p->getList());
    }

    function getList_paginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new OtherFee(null,$ss);
        return JDV::result($p->getList_paginate($req->all()));
    }

    function saveOtherFee(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new OtherFee($req->id,$ss);
        return JDV::raw($p->save($req->all()));
    }

    function deleteOtherFee(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new OtherFee($req->id,$ss);
        return JDV::raw($p->delete());
    }

    function getDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new OtherFee($req->id,$ss);
        return JDV::result($p->getDetails());
    }

    function optionsFeeType(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new OtherFee();
        return JDV::result($p->optionsFeeType());
    }
}
