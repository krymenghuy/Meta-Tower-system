<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Models\JDV;
use App\Models\UM;
use Illuminate\Http\Request;

class GuardianController extends Controller
{
    //
    function save(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return $ss;

        $instance = new Guardian();
        $save = $instance->save($req->all(),$req->id,$ss);
        return JDV::raw($save);
    }

    function list(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return $ss;

        $instance = new Guardian();
        $list = $instance->guardianList($req->all(),$ss);
        return JDV::result($list);
    }

    function parentChildrenDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return $ss;

        $instance = new Guardian();
        $list = $instance->parentChildren($req->all(),$ss);
        return JDV::result($list);
    }

    function parentRequestAccount(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return $ss;

        $instance = new Guardian();
        $save = $instance->requestAccount($req->all(),$ss);
        return JDV::result($save);

    }
}
