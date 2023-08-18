<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Models\JDV;
use App\Models\UM;
use Illuminate\Http\Request;

class GuardianController extends Controller
{
    //
    function save(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return $ss;

        $save = Guardian::save($req->all(),$req->id,$ss);
        return JDV::raw($save);
    }
}
