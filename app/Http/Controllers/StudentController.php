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
}
