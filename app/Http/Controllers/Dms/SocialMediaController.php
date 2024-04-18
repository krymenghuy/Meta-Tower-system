<?php

namespace App\Http\Controllers\Dms;

use App\Http\Controllers\Controller;
use App\Models\Dms\JDV;
use App\Models\Dms\SocialMedia;
use App\Models\Dms\UM;
use Illuminate\Http\Request;

class SocialMediaController extends Controller
{
    function save(Request $req){
        $prn_code = $req->id?294:293;
        $ss = UM::getUserInfoByToken($req,$prn_code);
        if($ss->status_code !=200) return $ss;
        $d = new SocialMedia(null,$ss);
        $save = $d->save($req->all(),$req->id,$ss);
        return JDV::raw($save);
    }

    // function list(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return $ss;
    //     $d = new SocialMedia(null,$ss);
    //     $list = $d->list($req->all(),$ss);
    //     return JDV::result($list);
    // }

    function listAll(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $d = new SocialMedia(null,$ss);
        $list = $d->listAll($ss);
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
        $ss = UM::getUserInfoByToken($req,295);
        if($ss->status_code !=200) return $ss;
        $d = new SocialMedia($req->id,$ss);
        $delete = $d->delete();
        return JDV::result($delete);
    }
}
