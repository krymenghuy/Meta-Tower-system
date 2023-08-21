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
        $save = $instance->saveAttendance($req->all());
        return JDV::raw($save);
    }

    function attendanceList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $instance = new StudentAttendance(null,$ss);
        $save = $instance->attendanceList($req->all(),$ss);
        return JDV::raw($save);
    }
}
