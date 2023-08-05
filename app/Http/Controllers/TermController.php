<?php

namespace App\Http\Controllers;

use App\Models\JDV;
use App\Models\Term;
use App\Models\UM;
use Illuminate\Http\Request;

class TermController extends Controller
{
    //
    function save(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new Term($req->id,$ss);
        $save = $row->save($req->all());
        return JDV::raw($save);
    }

    function getList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new Term(null,$ss);
        $list = $row->list($req->all(),$ss);
        return JDV::result($list);
    }

    function getDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new Term($req->id,$ss);
        $details = $row->details();
        return JDV::result($details);
    }

    function delete(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $row = new Term($req->id,$ss);
        $delete = $row->delete();
        return JDV::raw($delete);
    }
}
