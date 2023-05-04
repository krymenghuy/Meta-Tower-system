<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
use App\Models\PatientHistory;

class PatientHistoryController extends Controller
{
    function getMedicalHistory(Request $req){
       $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);
       $data = PatientHistory::medicalHistory($req->id,$ss);
       return JDV::result($data); 
    }

    function getHistoricalMedication(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id?$req->id:$req->patient_id;
        $data = PatientHistory::medications($id,$ss);
        return JDV::result($data); 
     }

     function getHistoricalPE(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id?$req->id:$req->patient_id;
        $data = PatientHistory::pe($id,$ss);
        return JDV::result($data);
     }

     function getHistoricalServices(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id?$req->id:$req->patient_id;
        $data = PatientHistory::services($id,$ss);
        return JDV::result($data);        
     }

     function getHistoricalLaboTests(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id?$req->id:$req->patient_id;
        $data = PatientHistory::laboTests($id,$ss);
        return JDV::result($data); 
     }

     function getHistoricalDiagnosis(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id?$req->id:$req->patient_id;
        $data = PatientHistory::diagnosis($id,$ss);
        return JDV::result($data); 
     }

     function getHistoricalAdvice(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id?$req->id:$req->patient_id;
        $data = PatientHistory::advice($id,$ss);
        return JDV::result($data); 
     }

     function getHistoricalFollowups(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->id?$req->id:$req->patient_id;
        $data = PatientHistory::followups($id,$ss);
        return JDV::result($data); 
     }
}
