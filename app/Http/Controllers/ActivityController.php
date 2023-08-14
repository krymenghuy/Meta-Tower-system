<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\JDV;
use App\Models\UM;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    //

    function sendRequestChange(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $instance = new Activity();
        $send_request = $instance->sendRequestChange($req->all(),$ss);
        return JDV::raw($send_request);

    }
    function createRequestChange(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $instance = new Activity();
        $send_request = $instance->createRequest($req->all(),$ss);
        return JDV::raw($send_request);
    }

    function requestChangeListPaginateList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $instance = new Activity(null,$ss);
        $list = $instance->requestChangeListPaginateList($req->all(),$ss);
        return JDV::result($list);
    }

    // function approveGeneralListPaginateList(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return $ss;

    //     $instance = new Activity(null,$ss);
    //     $list = $instance->approveGeneralListPaginateList($req->all(),$ss);
    //     return JDV::result($list);
    // }

    function approveRequestChange(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $instance = new Activity(null,$ss);
        $approve = $instance->approveRequestChange($req->all(),$ss);
        return JDV::result($approve);

    }

    function sendRequestDiscount(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $instance = new Activity(null,$ss);
        $send_request = $instance->sendRequestDiscount($req->all(),$ss);
        return JDV::raw($send_request);
    }

    function deleteActivity(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

    }

    function requestDiscountCount(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $instance = new Activity(null,$ss);
        $count = $instance->requestDiscountCount($ss);
        return JDV::result($count);
    }

    function createRequestDiscount(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $instance = new Activity(null,$ss);
        $create = $instance->createRequestDiscount($req->all(),$ss);
        return JDV::raw($create);
        // requestDiscountListPaginate
    }
}
