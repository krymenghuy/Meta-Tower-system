<?php

namespace App\Http\Controllers;

use App\Models\Deposit;
use App\Models\JDV;
use App\Models\UM;
use Illuminate\Http\Request;

class DepositController extends Controller
{
    //
    function save(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $save = Deposit::save($req->all(),$req->id,$ss);
        return JDV::raw($save);
    }

    function getList_paginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $list = Deposit::list_paginate($req->all(),$ss);
        return JDV::result($list);
    }

    function getDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $details = Deposit::details($req->id,$ss);
        return JDV::result($details);
    }
    function delete(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $delete = Deposit::delete($req->id,$ss);
        return JDV::result($delete);
    }

    function getOldStudentInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $info = Deposit::getOldStudentInfo($req->id,$ss);
        return JDV::result($info);
    }
}
