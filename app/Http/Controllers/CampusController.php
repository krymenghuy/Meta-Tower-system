<?php

namespace App\Http\Controllers;

use App\Models\Campus;
use App\Models\JDV;
use App\Models\UM;
use Illuminate\Http\Request;

class CampusController extends Controller
{
    //
    function save(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $save = Campus::save($req->all(),$req->id,$ss);
        return JDV::raw($save);
    }

    function getList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $list = Campus::list($ss);
        return JDV::result($list);
    }

    function getList_paginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $list = Campus::list_paginate($req->all(),$ss);
        return JDV::result($list);
    }

    function getDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $details = Campus::details($req->id,$ss);
        return JDV::result($details);
    }

    function delete(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $delete = Campus::delete($req->id,$ss);
        return JDV::raw($delete);
    }
}
