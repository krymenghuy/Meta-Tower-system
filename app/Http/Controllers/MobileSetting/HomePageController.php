<?php

namespace App\Http\Controllers\MobileSetting;

use App\Http\Controllers\Controller;
use App\Models\JDV;
use App\Models\MobileSetting\HomePage;
use App\Models\UM;
use Illuminate\Http\Request;

class HomePageController extends Controller
{
    //
    function connectedStudent(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $students = HomePage::getConnectedStudent($ss);
        return JDV::result($students);
    }
}
