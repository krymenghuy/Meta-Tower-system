<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use App\Models\JDV;
use App\Models\UM;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    //
    function saveHolidayDate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $d = new Holiday($req->id,$ss);
        $save = $d->save();
        return JDV::raw($save);
    }
    function holidayList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $d = new Holiday($req->id,$ss);
        $list = $d->list();
        return JDV::raw($list);
    }
    function holidayDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $d = new Holiday($req->id,$ss);
        $details = $d->details();
        return JDV::raw($details);
    }
    function delete(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $d = new Holiday($req->id,$ss);
        $delete = $d->delete();
        return JDV::raw($delete);
    }
}
