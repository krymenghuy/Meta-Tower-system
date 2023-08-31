<?php

namespace App\Http\Controllers;

use App\Models\JDV;
use App\Models\PromoteStudent;
use App\Models\UM;
use Illuminate\Http\Request;

class PromoteStudentController extends Controller
{
    //
    function promoteStudents(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new PromoteStudent();
        $promote = $x->promoteStudents($req->all(),$ss);
        return JDV::raw($promote);
    }

    function promoteListPaginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new PromoteStudent();
        $promote = $x->promotedStudentListPag($req->all(),$ss);
        return JDV::result($promote);

    }

    function verifyPromotedStudent(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new PromoteStudent();
        $verify = $x->verifyPromotedStudent($req->all(),$ss);
        return JDV::result($verify);

    }


    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $x = new PromoteStudent(null,$ss);
        $options = $x->getFormOptions($req,$ss);
        return JDV::result($options);
    }
}
