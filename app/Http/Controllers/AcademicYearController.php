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
        if($ss->status_code !=200) return $ss;
        //$academic_year = $req->academic_year?$req->academic_year:$req->org_academic_year;
        $save = AcademicYear::save($req->all(),null,$ss);
        return JDV::raw($save);
    }

    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $academic_year = $req->academic_year?$req->academic_year:$req->org_academic_year;
        $data= AcademicYear::form_options($academic_year,$ss);
        return JDV::result($data);
    }

    function getList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $list = AcademicYear::list($ss);
        return JDV::result($list);
    }

    function getDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $academic_year = $req->academic_year?$req->academic_year:$req->org_academic_year;
        $details = AcademicYear::details($academic_year,$ss);
        return JDV::result($details);
    }

    function delete(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $academic_year = $req->academic_year?$req->academic_year:$req->org_academic_year;
        $x = AcademicYear::delete($academic_year,$ss);
        return JDV::raw($x);
    }
}
