<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ServiceQ\QTicket;
use App\Models\JDV;
use App\Models\UM;
use Session;
use DB;

class QTicketController extends Controller
{
    function getTicketList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::emptyResult($ss); //user not authenticated
        $d = $req->all();
        $d['branch_id'] = $ss->branch_id;
        return JDV::result(QTicket::list($d));
    }

    function deleteTicket(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss,[]); //user not authenticated
        //$d ={branch_id,id} 
        $d = [
            'branch_id'=>$ss->branch_id,
            'id'=>$req->id
        ];
        return JDV::raw(QTicket::deletePermanent($d));
    }

    function getTicketDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::emptyResult($ss,null); //user not authenticated
        $row = QTicket::info([
            'branch_id'=>$ss->branch_id,
            'id'=>$req->id
        ]);
        return JDV::result($row);
    }

    function addChiefComplaint(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $res = QTicket::addChiefComplaint($ss,[
            'ticket_id'=>$req->ticket_id,
            'chief_complaint_id'=>$req->chief_complaint_id
        ]);
       return JDV::raw($res);
    }

    function getPatientVitalSigns(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $branch_id = $ss->branch_id;
        $ticket_id = $req->ticket_id;

        $res = QTicket::vitalSigns($branch_id,$ticket_id);
        return JDV::result($res);
    }

    function getPatientDescription(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $branch_id = $ss->branch_id;
        $ticket_id = $req->ticket_id;

        $res = QTicket::description($branch_id,$ticket_id);
        return JDV::result($res);
    }

    function getDoctorAdvice(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $branch_id = $ss->branch_id;
        $ticket_id = $req->ticket_id;

        $res = QTicket::advice($branch_id,$ticket_id);
        return JDV::result($res);
    }
 
    function getPatientPE(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $branch_id = $ss->branch_id;
        $ticket_id = $req->ticket_id;

        $res = QTicket::physicalExamination($branch_id,$ticket_id);
        return JDV::result($res);
    }

    function getPatientDiagnosis(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $branch_id = $ss->branch_id;
        $ticket_id = $req->ticket_id;

        $res = QTicket::diagnosis($branch_id,$ticket_id);
        return JDV::result($res);
    }

    function getPatientLaboTests(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $branch_id = $ss->branch_id;
        $ticket_id = $req->ticket_id;

        $res = QTicket::laboTests($branch_id,$ticket_id);
        return JDV::result($res);
    }

    function deleteChiefComplaint(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $res = QTicket::deleteChiefComplaint([
            'ticket_id'=>$req->ticket_id,
            'chief_complaint_id'=>$req->chief_complaint_id
        ]);
        return JDV::raw($res);
    }

    function createTicket(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        //Todo: we can use @appt_id to obtain @client_id
        $inputs =[
            'appt_id'=>$req->appt_id,
            'client_id'=>$req->client_id,
            'department_id'=>$req->department_id,
            'consultant_id'=>$req->consultant_id,
            'priority'=>$req->priority,
            'schedule_type'=>$req->schedule_type,
            'remarks'=>$req->remarks
        ];
        $res = QTicket::create($ss,$inputs);
        return JDV::raw($res);
    }
}
