<?php

namespace App\Http\Controllers;

use App\Models\JDV;
use App\Models\StudentAttendance;
use App\Models\UM;
use Illuminate\Http\Request;

class StudentAttendanceController extends Controller
{
    //

    function saveAttendance(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $instance = new StudentAttendance(null,$ss);
        $save = $instance->saveAttendance($req->all(),$req->id,$ss);
        return JDV::raw($save);
    }

    function scanAttendance(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $instance = new StudentAttendance(null,$ss);
        $save = $instance->scanAttendance($req->all());
        return JDV::raw($save);
    }

    function attendanceList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $instance = new StudentAttendance(null,$ss);
        $list = $instance->attendanceList($req->all(),$ss);
        return JDV::result($list);
    }

    function getAttendanceDateDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_id !=200) return $ss;
        $instance = new StudentAttendance(null,$ss);
        $list = $instance->attendanceDateDetails($req->student_id,$req->date,$ss);
        return JDV::result($list);


    }

    function attendanceDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $instance = new StudentAttendance(null,$ss);
        // $list = $instance->attendanceDetails($req,$ss);
        $list = $instance->getAttendanceDetails($req->student_id);
        return JDV::result($list);
    }

    function studentListByGroup(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $instance = new StudentAttendance(null,$ss);
        $list = $instance->studentListInfoByGroup($req,$ss);
        return JDV::result($list);
    }

    function optionsGroup(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $instance = new StudentAttendance(null,$ss);
        $list = $instance->optionsGroup($req->all(),$ss);
        return JDV::result($list);
    }

    function optionsAttendanceTypes(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $instance = new StudentAttendance(null,$ss);
        $list = $instance->optionsAttendanceTypes();
        return JDV::result($list);
    }
}
