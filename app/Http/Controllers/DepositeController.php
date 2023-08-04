<?php

namespace App\Http\Controllers;

use App\Models\Deposite;
use App\Models\JDV;
use App\Models\UM;
use Illuminate\Http\Request;

class DepositeController extends Controller
{
    //
    function save(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $save = Deposite::save($req->all(),$req->id,$ss);
        return JDV::raw($save);
    }

    function getList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $list = Deposite::list($ss);
        return JDV::result($list);
    }

    function getDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $details = Deposite::details($req->id,$ss);
        return JDV::result($details);
    }
    function delete(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $delete = Deposite::delete($req->id,$ss);
        return JDV::result($delete);
    }
}
