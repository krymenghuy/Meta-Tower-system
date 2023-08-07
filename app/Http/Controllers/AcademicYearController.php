<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\JDV;
use App\Models\UM;
use Illuminate\Http\Request;
//use App\Models\GeneralSettings;

class AcademicYearController extends Controller
{
    //
    function save(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        //$academic_year = $req->academic_year?$req->academic_year:$req->org_academic_year;
        $res = AcademicYear::save($req->all(),$ss);
        return JDV::raw($res);
    }

    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $data= AcademicYear::form_options($req->id,$ss);
        return JDV::result($data);
    }

    function getList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $list = AcademicYear::list($ss);
        return JDV::result($list);
    }

    function getDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $details = AcademicYear::details($req->id,$ss);
        return JDV::result($details);
    }

    function delete(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return DV::raw($ss);
        $x = AcademicYear::delete($req->id,$ss);
        return JDV::raw($x);
    }
}
