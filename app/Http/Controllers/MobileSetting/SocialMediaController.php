<?php

namespace App\Http\Controllers\MobileSetting;

use App\Http\Controllers\Controller;
use App\Models\JDV;
use App\Models\MobileSetting\SocialMedia;
use App\Models\UM;
use Illuminate\Http\Request;

class SocialMediaController extends Controller
{
    //
    function save(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $d = new SocialMedia(null,$ss);
        $save = $d->save($req->all(),$req->id);
        return JDV::raw($save);
    }

    function list(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $d = new SocialMedia(null,$ss);
        $list = $d->list($ss);
        return JDV::result($list);
    }

    function details(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $d = new SocialMedia($req->id,$ss);
        $details = $d->details();
        return JDV::result($details);
    }

    function delete(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $d = new SocialMedia($req->id,$ss);
        $delete = $d->delete();
        return JDV::result($delete);
    }
}
