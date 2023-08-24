<?php

namespace App\Http\Controllers\MobileApi;

use App\Http\Controllers\Controller;
use App\Models\JDV;
use App\Models\MobileApi\Attendance;
use App\Models\UM;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    //
    function attendanceList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $d = new Attendance();
        $list = $d->attendanceList($req->all());
        return JDV::result($list);
    }
}
