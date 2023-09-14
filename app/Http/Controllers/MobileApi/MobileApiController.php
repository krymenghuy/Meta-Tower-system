<?php

namespace App\Http\Controllers\MobileApi;

use App\Http\Controllers\Controller;
use App\Models\JDV;
use App\Models\MobileApi\MobileApi;
use App\Models\UM;
use Illuminate\Http\Request;

class MobileApiController extends Controller
{

    function pickupMyKids(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $d = new MobileApi();
        //$students = $req->students;
        $res = $d->pickupMyKids($req->students,$ss);
        return JDV::raw($res);
    }

    function homePage(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $d = new MobileApi();
        $list = $d->homePage($ss);
        return JDV::result($list);
    }

    function attendanceList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $d = new MobileApi();
        $list = $d->attendanceList($req->all());
        return JDV::result($list);
    }

    function getChildrenInvoices(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $d = new MobileApi();
        $list = $d->getChildrenInvoices($req->all(),$ss);
        return JDV::result($list);
    }

    function getStudentEnrollment(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $d = new MobileApi();
        $enr_list = $d->getStudentEnrollemntDetails($req->student_id,$ss);
        return JDV::result($enr_list);
    }

    function getSocialMediaList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $d = new MobileApi();
        $enr_list = $d->getSocialMedia($ss);
        return JDV::result($enr_list);
    }

    function getChildLatestInvoice(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $d = new MobileApi();
        $inv = $d->childLatestInvoice($req->student_id,$ss);
        return JDV::result($inv);
    }

    function registerApp(Request $req){
        // $ss = UM::getUserInfoByToken($req,-1);
        // if($ss->status_code !=200) return $ss;
        $d = new MobileApi();
        $reg = $d->register($req->all());
        return JDV::result($reg);
    }

    function deleteAccount(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $d = new MobileApi();
        $delete = $d->deleteAccount($ss);
        return JDV::result($delete);
    }
}
