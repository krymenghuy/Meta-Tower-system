<?php

namespace App\Http\Controllers;

use App\Models\JDV;
use App\Models\Program;
use App\Models\UM;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    //
    function save(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new Program($req->id,$ss);
        $save = $row->save($req->all());
        return JDV::raw($save);
    }

    function getList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new Program();
        $list = $row->list($ss);
        return JDV::result($list);
    }

    function getList_paginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new Program();
        $list = $row->list_paginate($req->all(),$ss);
        return JDV::result($list);
    }

    function get_levels_by_program(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $rows = Program::getLevelByProgram($req,$ss);
        return JDV::result($rows);
    }

    function getDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new Program($req->id,$ss);
        $details = $row->details();
        return JDV::result($details);
    }

    function delete(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new Program($req->id,$ss);
        $delete = $row->delete();
        return JDV::raw($delete);
    }
}
