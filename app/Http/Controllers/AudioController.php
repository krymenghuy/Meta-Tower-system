<?php

namespace App\Http\Controllers;

use App\Models\Audio;
use App\Models\UM;
use Illuminate\Http\Request;

class AudioController extends Controller
{
    //
    function saveAudio(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new Audio();
        $save = $x->saveAudio($req->all(),$ss);
        return $save;
    }

    function getAudio(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new Audio();
        $list = $x->getAudio($ss);
        return $list;
    }
}
