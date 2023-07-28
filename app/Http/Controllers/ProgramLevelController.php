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
        $row = new programLevel($req->id,$ss);
        return JDV::raw($row->save($req->all()));
    }

    function getList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new ProgramLevel();
        $list = $row->list($req->program_id,$ss);
        return JDV::raw($list);
    }

    function getDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new ProgramLevel($req->id,$ss);
        $details = $row->details();
        return JDV::result($details);
    }

    function delete(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $row = new ProgramLevel($req->id,$ss);
        return JDV::raw($row->delete($req->id,$req->program_id));
    }
}
