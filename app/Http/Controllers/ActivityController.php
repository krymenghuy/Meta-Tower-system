<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\JDV;
use App\Models\UM;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    //

    function saveActivity(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $save = Activity::save($req->all(),$req->id,$ss);
        return JDV::raw($save);
    }

    function getActivitiesList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $list = Activity::list($ss);
        return JDV::raw($list);
    }

    function getAcitvityDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $details = Activity::details($req->id,$ss);
        return JDV::raw($details);
    }

    function deleteActivity(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $delete = Activity::delete($req->id,$ss);
        return JDV::raw($delete);
    }
}
