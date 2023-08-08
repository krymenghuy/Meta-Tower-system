<?php

namespace App\Http\Controllers;

use App\Models\JDV;
use App\Models\Student;
use App\Models\UM;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    //
    function studentRegistration(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $register = Student::saveStudent($req->all(),$req->id,$ss);
        return JDV::raw($register);
    }

    function studentPaginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $rows = Student::studentListPaginate($req->all(),$ss);
        return JDV::result($rows);
    }

    function studentDetials(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $details = Student::getStudentDetails($req->id,$ss);
        return JDV::result($details);
    }

    function deleteStudent(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $delete = Student::deleteStudent($req->id,$ss);
        return JDV::raw($delete);
    }

    function findStudent(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $find = Student::findStudent($req->all(),$ss);
        return JDV::result($find);

    }
}
