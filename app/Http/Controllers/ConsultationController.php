<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
use App\Models\Consultation;

class ConsultationController extends Controller
{
    function saveConsultationData(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $consult = new Consultation(null,$ss);
        //NOTE: $req->all() must have property "ticket_id"
        $res = $consult->save($req->all());
        if($res->status ==='OK') return JDV::success(['id'=>$res->id]);
        else return JDV::error($res->error_message);    
    }

    function deleteConsultationData(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $res = Consultation::commitDelete($ss,$req->id);
        return JDV::raw($res);
    }
    
    function getChiefComplaints(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $c = new Consultation(null,$ss);
        $data = $c->getChiefComplaints($req->ticket_id,$ss);
        return JDV::result($data);
    }

    //Save one chief complaint
    function saveChiefComplaint(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $c = new Consultation();
        $res= $c->saveChiefComplaint($req->cc_id,$req->ticket_id,$ss);
        return JDV::success();
    }
    // //Save many chief complaints
    // function saveChiefComplaint(Request $req){
    //     $ss = UM::getUserInfoBytoken($req,-1);
    //     if($ss->status_code !==200) return JDV::raw($ss);
    //     $c = new Consultation(null,$ss);
    //     $res= $c->saveChiefComplaints($req->all());
    // }

    function saveVitalSigns(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $c = new Consultation();
        $res= $c->saveVitalSigns($req->all(),$req->ticket_id,$ss);
        return JDV::success();
    }

    function saveMedicalHistory(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $c = new Consultation();
        $res= $c->saveMedicalHistory($req->items,$req->ticket_id,$ss);
        return JDV::raw($res);
    }
    function getConsultationData(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $section_name = $req->section_name;
        $row = Consultation::findBy($ss,$res->id,$section_name);
        return JDV::result($row);
    }

    function getLaboTestData(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $section_name = $req->section_name;
        $c = new Consultation($req->ticket_id,$ss);
        $data = $c->getLaboTestData();
        return JDV::result($data);
    }

}
