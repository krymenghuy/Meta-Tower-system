<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
use App\Models\PolicyDiscount;
class PolicyDiscountController extends Controller
{

    function getDiscountList_paginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PolicyDiscount(null,$ss);
        return JDV::result($p->list_paginate($req->all()));
    }

    function saveDiscount(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PolicyDiscount(null,$ss);
        return JDV::raw($p->save($req->all()));
    }

    function deleteDiscount(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PolicyDiscount($req->id,$ss);
        return JDV::raw($p->delete());
    }

    function select_options(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

        $options = PolicyDiscount::select_options($ss);
        return JDV::result($options);
    }

    function getDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(PolicyDiscount::details($req->id));
    } 
}