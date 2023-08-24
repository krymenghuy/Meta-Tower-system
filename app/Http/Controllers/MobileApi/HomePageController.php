<?php

namespace App\Http\Controllers\MobileApi;

use App\Http\Controllers\Controller;
use App\Models\JDV;
use App\Models\MobileApi\HomePage;
use App\Models\UM;
use Illuminate\Http\Request;

class HomePageController extends Controller
{
    //
    function homePage(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $d = new HomePage();
        $list = $d->homePage($ss);
        return JDV::result($list);
    }
}
