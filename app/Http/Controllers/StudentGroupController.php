<?php

namespace App\Http\Controllers;

use App\Models\JDV;
use App\Models\StudentGroup;
use App\Models\UM;
use Illuminate\Http\Request;

class StudentGroupController extends Controller
{
    //
    function save(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $g = new StudentGroup($req->id,$ss);
        $res = $g->save($req->all(),$req->id,$ss);
        return JDV::raw($res);
    }

    function getList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $g = new StudentGroup(null,$ss);
        $list =  $g->list($req->all(),$ss);
        return JDV::result($list);
    }

    function getList_paginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $g = new StudentGroup(null,$ss);
        $list =  $g->list_paginate($req->all(),$ss);
        return JDV::result($list);
    }

    function getDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $details = StudentGroup::details($req->id,$ss);
        return JDV::result($details);
    }

    function delete(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $g = new StudentGroup($req->id,$ss);
        $delete = $g->delete();
        return JDV::raw($delete);
    }

    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $g = new StudentGroup($req->id,$ss);
        $d = $g->getFormOptions($req->id,$ss);
        return JDV::result($d);

    }
}
