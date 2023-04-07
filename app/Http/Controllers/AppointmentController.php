<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\JDV;
use App\Models\UM;

class AppointmentController extends Controller{
    function getTest(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $row = (object)['name'=>'dara','phone_number'=>'012345436'];
        return JDV::raw($row);
    }
    
    function getAppointmentList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $appt = new Appointment(null,$ss);
        return JDV::result($appt->list($req->all()));
    }

    function addToQueue(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $appt = new Appointment($req->appt_id,$ss);
        $res = $appt->addToQueue();
        if ($res->status ==='OK') return JDV::success(['status_info'=>$res->status_info,'ticket_id'=>$res->ticket_id,'ticket_number'=>$res->ticket_number]);
        return JDV::raw($res);
    }

    function getAppointmentDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id;
        $appt = new Appointment($req->id,$ss);
        return JDV::result($appt->getDetails());
    }

    //Add Chief complaint to an Appointment
    function addChiefComplaint(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->appt_id?$req->appt_id:$req->id;
        $appt = new Appointment($id,$ss);
        $res = $appt->addChiefComplaint($req->all());
        return JDV::raw($res);
    }

     //Remove Chief complaint to an Appointment
    function removeChiefComplaint(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $appt = new Appointment($req->appt_id,$ss);
        $res = $appt->removeChiefComplaint($req->cc_id);
        return JDV::raw($res);
    }

    function deleteAppointment(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->appt_id?$req->appt_id:$req->id;
        $appt = new Appointment($id,$ss); 
        return JDV::raw($appt->delete());
    }
    
    //saveAppointment() can Create or Update
    function saveAppointment(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $appt = new Appointment(null,$ss);
        $res = $appt->save($req->all());
        if ($res->status_code ===200) return JDV::success(['id'=>$res->id]);
        return JDV::raw($res);
    }

    //find Client, if not found then find Lead or prospect
    //NOTE: return only one client as object, Not array
    function findClient(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $appt = new Appointment(null,$ss);
        return JDV::result($appt->findClient($req->all()));
    }
}