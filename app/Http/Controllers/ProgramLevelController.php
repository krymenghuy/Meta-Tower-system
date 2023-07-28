<?php

namespace App\Http\Controllers;

use App\Models\JDV;
use App\Models\ProgramLevel;
use App\Models\UM;
use Illuminate\Http\Request;

class ProgramLevelController extends Controller
{
    //
    function save(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new ProgramLevel($req->id,$ss);
        $save = $row->save($req->all());
        return JDV::raw($save);
    }

    function getList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new ProgramLevel();
        $list = $row->list($ss);
        return JDV::raw($list);
    }

    function getDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new ProgramLevel($req->id,$ss);
        $details = $row->details();
        return JDV::raw($details);
    }

    function delete(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new ProgramLevel($req->id,$ss);
        $delete = $row->delete();
        return JDV::raw($delete);
    }
}
