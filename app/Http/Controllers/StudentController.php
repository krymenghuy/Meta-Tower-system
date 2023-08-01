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

    function student_payment_pending(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $rows = Student::student_payment_pending($req->all(),$ss);
        return JDV::result($rows);
    }

    function student_paginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $rows = Student::studentListPaginate($req->all(),$ss);
        return JDV::result($rows);
    }

    function student_payment(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $rows = Student::payment_section($req->all(),$req->id,$ss);
        return JDV::result($rows);
    }
}
