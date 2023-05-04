<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ServiceQ\QTicket;
use App\Models\JDV;
use App\Models\UM;
use App\Models\GeneralSettings;
use App\Models\Patient;

class QTicketController extends Controller
{
    function ticket_form_options(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $rows = Patient::findSimilar(['search_value'=>$req->search_value],$ss);
        return JDV::result([
            'items'=>GeneralSettings::options_department($ss),
            //basic Info about patient such as code, name,phone_number, email
            'clientInfo'=>isset($rows[0])?$rows[0]:null
        ]);
    }
    
    function getTicketList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $d = $req->all();
        $d['branch_id'] = $ss->branch_id;
        return JDV::result(QTicket::list($d));
    }

    function deleteTicket(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss,[]); //user not authenticated
        //$d ={branch_id,id} 
        $ticket = new QTicket($req->id,$ss); 
        return JDV::raw($ticket->delete());
    }

    function getTicketDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $id = $req->id?$req->id:$req->ticket_id;
        return JDV::result(QTicket::info($id,$ss)); 
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

    function savePatientPhoto(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        //$branch_id = $ss->branch_id;
        $ticket_id = $req->ticket_id? $req->ticket_id:$req->id;
        $ticket = new QTicket($ticket_id,$ss);
        $res = $ticket->savePatientPhoto($req->all());
        if($res->status_code ===200) return JDV::result(['id'=>$res->id,'new_image_url'=>$res->new_image_url,'image_urls'=>$res->image_urls]);
        return JDV::error($res->error_message);
    }
    
    function deletePatientPhoto(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $branch_id = $ss->branch_id;
        $ticket = new QTicket();
        $res = $ticket->deletePatientPhoto($req->id,$ss);
        if($res->status_code ===200) return JDV::result(['image_urls'=>$res->image_urls]);
        return JDV::error($res->error_message);
    }

    function getPatientPhotos(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $branch_id = $ss->branch_id;
        $ticket_id = $req->ticket_id? $req->ticket_id:$req->id;
        $ticket = new QTicket($ticket_id,$ss);
        $rows = $ticket->getPatientPhotos();
        return JDV::result($rows);
    }

    function getPatientVitalSigns(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $id = $req->id?$req->id:$req->ticket_id;
        $ticket = new QTicket($id,$ss);
        $res = $ticket->getVitalSigns();
        return JDV::result($res);
    }

    function getChiefComplaints(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $id = $req->id?$req->id:$req->ticket_id;
        $ticket = new QTicket($id,$ss);
        $res = $ticket->getChiefComplaints();
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
        $ticket = new QTicket(null,$ss);
        $res = $ticket->create($inputs);
        if ($res->status_code ===200) return JDV::success(['id'=>$res->id,'ticket_number'=>$res->ticket_number,'status_info'=>$res->status_info]);
        return JDV::raw($res);
    }
}
