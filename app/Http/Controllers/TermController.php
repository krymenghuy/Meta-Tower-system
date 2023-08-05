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

        $term = new Term();
        $terms = $term->list($req->all(),$ss);
        return JDV::result($terms);
    }

    function getDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $term = new Term($req->id,$ss);
        $details = $term->details();
        return JDV::result($details);
    }

    function delete(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $term = new Term($req->id,$ss);
        $x = $term->delete();
        return JDV::raw($x);
    }
    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $term = new Term(null,$ss);
        return JDV::result($term->getFormOptions($req->all()));
    }
}
