<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Currency;
use App\Models\UM;
use App\Models\JDV;

class CurrencyController extends Controller
{
    
    function saveCurrency(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        //$d = $req->all();
        $res = Currency::commitSave($ss,$req->all());
        if($res->status ==='OK'){
            return JDV::success(["id"=>$res->id]);
        }else return JDV::raw($res);
    }

    function deleteCurrency(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $res = Currency::commitDelete($ss,$req->id);
        return JDV::raw($res);
    }

    function getCurrencyList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $rows = Currency::list($ss);
        return JDV::result($rows);
    }

    function getCurrencyDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Currency::details($ss,$req->id));
    }

}
