<?php

namespace App\Http\Controllers;

use App\Models\Audio;
use Illuminate\Http\Request;

class AudioController extends Controller
{
    //
    function saveAudio(Request $req){
        $save = Audio::saveAudio($req);
        return $save;
    }
    function baseAudio(Request $req){
        $save = Audio::base64Audio($req);
        return $save;
    }
}
