<?php

namespace App\Http\Controllers\Umt;
use App\Http\Controllers\Controller;
use App\Models\Campus;
use App\Services\Umt\AuthService;
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

    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->branch_id;
        $user_id = $req->user_id;
        $data = Campus::getFormOptions($id,$user_id,$ss);
        return JDV::result($data); 
    }
}
