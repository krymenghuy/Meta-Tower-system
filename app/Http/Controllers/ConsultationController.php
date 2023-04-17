<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
use App\Models\Consultation;
use App\Models\PatientHistory;

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

    function getPatientVitalSigns(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $c = new Consultation(null,$ss);
        $data = $c->getVitalSigns($req->ticket_id,$ss);
        return JDV::result($data);
    }

  

    function deleteChiefComplaint(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $c = new Consultation(null,$ss);
        $res= $c->deleteChiefComplaint($req->id);
        return JDV::success();
    }

    function removePrescriptionItem(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $ticket_id = $req->ticket_id;
        $c = new Consultation($ticket_id,$ss);
        $err= $c->removePrescriptionItem($req->id);
        if ($err) return JDV::error($err);
        return JDV::success();
    }

    function savePrescriptionItem(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $ticket_id = $req->ticket_id;
        $c = new Consultation($ticket_id,$ss);
        $res= $c->savePrescriptionItem($req->all());
        if ($res->status ==='OK') return JDV::success(['id'=>$res->id]);
        return JDV::raw($res);
    }

    function getPrescription(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $ticket_id = $req->ticket_id;
        $c = new Consultation($ticket_id,$ss);
        $data= $c->getPrescription();
        return JDV::result($data);
    }

    
    function removeServiceItem(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $ticket_id = $req->ticket_id;
        $c = new Consultation($ticket_id,$ss);
        $err= $c->removeServiceItem($req->id);
        if ($err) return JDV::error($err);
        return JDV::success();
    }

    function saveServiceItem(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $ticket_id = $req->ticket_id;
        $c = new Consultation($ticket_id,$ss);
        $res= $c->saveServiceItem($req->all());
        if ($res->status ==='OK') return JDV::success(['id'=>$res->id]);
        return JDV::raw($res);
    }

    function getServiceDetails(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $ticket_id = $req->ticket_id;
        $c = new Consultation($ticket_id,$ss);
        $data= $c->getServiceDetails();
        return JDV::result($data);
    }


    function removeLaboTest(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $ticket_id = $req->ticket_id;
        $c = new Consultation($ticket_id,$ss);
        $err= $c->removeLaboTest($req->id);
        if ($err) return JDV::error($err);
        return JDV::success();
    }

    function saveLaboTest(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $ticket_id = $req->ticket_id;
        $c = new Consultation($ticket_id,$ss);
        $res= $c->saveLaboTest($req->all());
        if ($res->status ==='OK') return JDV::success(['id'=>$res->id]);
        return JDV::success(['id'=>$res->id]);
    }
 
    function getLaboTests(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $ticket_id = $req->ticket_id;
        $c = new Consultation($ticket_id,$ss);
        $data= $c->getLaboTests();
        return JDV::result($data);
    }
  
    function getLaboTestInfo(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $test_id = $req->id?$req->id:$req->test_id;
        $c = new Consultation(null,$ss);
        $row= $c->getLaboTestInfo($test_id);
        return JDV::result($row);
    }
    //Save one chief complaint
    function saveChiefComplaint(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $c = new Consultation($req->ticket_id,$ss);
        //$id = combined key ($cc_id,$tiket_id). $is is used when user choose to update existing chief complaint
        $err= $c->saveChiefComplaint($req->id,$req->cc_id);
        if($err) return JDV::error($err);
        return JDV::success();
    }
    // //Save many chief complaints
    // function saveChiefComplaint(Request $req){
    //     $ss = UM::getUserInfoBytoken($req,-1);
    //     if($ss->status_code !==200) return JDV::raw($ss);
    //     $c = new Consultation(null,$ss);
    //     $res= $c->saveChiefComplaints($req->all());
    // }

    //Not yet used.
    function saveVitalSigns(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $c = new Consultation($req->ticket_id,$ss);
        $res= $c->saveVitalSigns($req->all());
        return JDV::result(['vital_signs'=>$res->vital_signs]);
    }

    //Used by ConsultDialog to save patient's vital sign one by one as Doctor changes value of Vital sign
    function saveVitalSignOne(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $c = new Consultation($req->ticket_id,$ss);
        $res= $c->saveVitalSignOne($req->all());
        return JDV::raw($res);
    }

    function saveMedicalHistory(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $c = new Consultation();
        $res= $c->saveMedicalHistory($req->items,$req->ticket_id,$ss);
        return JDV::raw($res);
    }

    function getMedicalHistory(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id =$req->ticket_id? $req->ticket_id:$req->id;
        $c = new Consultation($id,$ss);
        $data= $c->getMedicalHistory();
        return JDV::result($data);
    }

    function getPE(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->ticket_id?$req->ticket_id:$req->id;
        $c = new Consultation($id,$ss);
        return JDV::result($c->getPE());
    }

    function savePE(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id =$req->ticket_id?$req->ticket_id:$req->id;
        $c = new Consultation($id,$ss);
        $res= $c->savePE($req->items);
        return JDV::result($res);
    }

    function getDiagnosis(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->ticket_id?$req->ticket_id:$req->id;
        $c = new Consultation($id,$ss);
        return JDV::result($c->getDiagnosis());
    }

    function getFollowups(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->ticket_id?$req->ticket_id:$req->id;
        $c = new Consultation($id,$ss);
        return JDV::result($c->getFollowups());
    }

    function saveDiagnosis(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id =$req->ticket_id?$req->ticket_id:$req->id;
        $c = new Consultation($id,$ss);
        $res= $c->saveDiagnosis($req->items);
        return JDV::result($res);
    }
    
    function saveAdvice(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id =$req->ticket_id?$req->ticket_id:$req->id;
        $c = new Consultation($id,$ss);
        $res= $c->saveAdvice($req->items);
        return JDV::result($res);
    }

    function getAdvice(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->ticket_id?$req->ticket_id:$req->id;
        $c = new Consultation($id,$ss);
        return JDV::result($c->getAdvice());
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
        //$section_name = $req->section_name;
        $c = new Consultation($req->ticket_id,$ss);
        $data = $c->getLaboTestData();
        return JDV::result($data);
    }

    function getHistory_medicalHistory(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PatientHistory($req->patient_id,$ss);
        $data = $p->medicalHistory();
        return JDV::result($data);
    }

    function getHistory_pe(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PatientHistory($req->patient_id,$ss);
        $data = $p->pe();
        return JDV::result($data);
    }

    function getHistory_labo(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PatientHistory($req->patient_id,$ss);
        $data = $p->labo_tests();
        return JDV::result($data);
    }

    function getHistory_diagnosis(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PatientHistory($req->patient_id,$ss);
        $data = $p->diagnosis();
        return JDV::result($data);
    }

    function getHistory_prescription(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PatientHistory($req->patient_id,$ss);
        $data = $p->prescription();
        return JDV::result($data);
    }

    function getHistory_services(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PatientHistory($req->patient_id,$ss);
        $data = $p->services();
        return JDV::result($data);
    }
    function getHistory_advice(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PatientHistory($req->patient_id,$ss);
        $data = $p->advice();
        return JDV::result($data);
    }
    function getHistory_followup(Request $req){
        $ss = UM::getUserInfoBytoken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PatientHistory($req->patient_id,$ss);
        $data = $p->followups();
        return JDV::result($data);
    }
}
