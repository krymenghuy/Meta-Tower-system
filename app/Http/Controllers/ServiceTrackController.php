<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
use App\Models\ServiceTrack;

class ServiceTrackController extends Controller
{

    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(ServiceTrack::form_options($req->id,$ss));
    }

    //getServices_performed() | getServicesPerformed() getServices
    function getServiceTracks(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(ServiceTrack::list($req->all(),$ss));
    }
    function getTrackDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id;
        return JDV::raw(ServiceTrack::trackDetails($id,$ss));
    }

    function saveTrack(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id;
        $st = new ServiceTrack($id,$ss);
        return JDV::raw($st->save($req->all()));
    }

    function deleteTrack(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id;
        $st = new ServiceTrack($id,$ss);
        return JDV::raw($st->delete());
    }
       
}
