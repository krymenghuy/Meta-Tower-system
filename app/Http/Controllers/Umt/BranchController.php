<?php

namespace App\Http\Controllers\Umt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use App\Models\Umt\Branch;

class BranchController extends Controller
{
    function getBranchList(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $rows = Branch::list($req->all(),$ss);
        return JDV::result($rows);
    }

    function deleteBranch(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->branch_id;
        $branch = new Branch($id,$ss);
        $res = $branch->delete($id);
        return JDV::raw($res); 
    }

    function saveBranch(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->branch_id;
        $branch = new Branch($id,$ss);
        $res = $branch->save($req->all(),$id,$ss);
        return JDV::raw($res); 
    }
    function getFormOptions(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id ?? $req->branch_id;
        $user_id = $req->user_id;
        $data = Branch::getFormOptions($id,$user_id,$ss);
        return JDV::result($data); 
    }
    function setDirector(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $rows = Branch::setDirector($req->all(),$ss);
        return JDV::raw($rows);
    }

}
