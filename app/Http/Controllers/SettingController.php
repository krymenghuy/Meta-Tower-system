<?php

namespace App\Http\Controllers;

use App\Models\JDV;
use App\Models\Setting;
use App\Models\UM;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    //
    function select_options(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

        $options = Setting::select_options($ss);
        return JDV::result($options);
    }

    function prevPrograms(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

        $options = Setting::prevProgramOptions($ss);
        return JDV::result($options);
    }

    function prevProgramLevels(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

        $options = Setting::prevProgramLevelOptions($ss);
        return JDV::result($options);
    }


}
