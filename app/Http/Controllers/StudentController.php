<?php

namespace App\Http\Controllers;

use App\Models\GeneralSettings;
use App\Models\JDV;
use App\Models\Student;
use App\Models\UM;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    function saveAudioFile(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $id =$req->id?$req->id:$req->student_id;
        $st = new Student($id,$ss);
        $res = $st->saveAudioFile($req->base64);
        return JDV::result($res);
    }

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

    function getStudentBasicInfoDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $x = new Student($req->id,$ss);

        $details =$x->getStudentBasicInfoDetails($req->id,$ss);
        return JDV::result($details);
    }

    function deleteStudentEnrollment(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $delete = Student::deleteStudentEnrollment($req->id,$ss);
        return JDV::raw($delete);
    }

    function deleteVerifiedStudent(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $delete = Student::deleteVerifiedStudent($req->id,$ss);
        return JDV::raw($delete);
    }

    function studentInformation(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $list = Student::studentInformation($req->all(),$ss);
        return JDV::result($list);
    }

    function getStudentEnrollmentInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $list = Student::getStudentEnrollmentInfo($req->all(),$ss);
        return JDV::result($list);
    }

    function updateStudentInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $x = new Student(null,$ss);
        $update = $x->updateStudentInfo($req->all(),$ss);
        return JDV::raw($update);
    }

    function formOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $options = GeneralSettings::optionsFindVerifyPmt();

        return JDV::result($options);
    }

    function setStudentOnLeave(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;

        $x = new Student();
        $set = $x->setLeave($req->all(),$req->id,$ss);
        return JDV::raw($set);
    }

}
