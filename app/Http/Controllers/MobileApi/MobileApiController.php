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
        $student_id = $req->student_id;
        $res = $d->pickupMyKids($student_id,$ss);
        return JDV::result($res);
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
}
