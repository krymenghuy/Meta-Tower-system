<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\JDV;
use App\Models\UM;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    //
    function save(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $save = AcademicYear::save($req->all(),$req->id,$ss);
        return JDV::raw($save);
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

        $details = AcademicYear::details($req->id,$ss);
        return JDV::result($details);
    }

    function delete(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $delete = AcademicYear::delete($req->id,$ss);
        return JDV::raw($delete);
    }
}
