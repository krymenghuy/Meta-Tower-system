<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use App\Services\EnrollmentManager;

class EnrollmentController extends Controller
{
    function list_paginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $m = new EnrollmentManager(null,$ss);
        return JDV::result($m->list_paginate($req->all()));
    }

    function saveEnrollment(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $m = new EnrollmentManager($req->id,$ss);
        $res = $m->saveEnrollment($req->all(),$req->id);
        return JDV::raw($res);
    }

    function getEnrollmentDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $m = new EnrollmentManager($req->id,$ss);
        $data = $m->getEnrollmentDetails($req->id);
        return JDV::result($data);
    }


    function deleteEnrollment(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $m = new EnrollmentManager($req->id,$ss);
        $res = $m->deleteEnrollment();
        return JDV::raw($res);
    }

    function deleteVerifiedEnrollment(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $m = new EnrollmentManager($req->id,$ss);
        $res = $m->deleteVerifiedEnrollment();
        return JDV::raw($res);
    }

    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $m = new EnrollmentManager(null,$ss);
        $options = $m->getFormOptions($req->enrollment_id,$ss);
        return JDV::result($options);
    }

    function finalizeEnrollment(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $m = new EnrollmentManager(null,$ss);
        $options = $m->finalizeEnrollment($req->all(),$ss);
        return JDV::result($options);
    }
}
