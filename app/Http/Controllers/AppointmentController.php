<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\ServiceQ\QTicket;
//use App\Models\Lead;
use App\Models\JDV;
use App\Models\UM;
use App\Models\Notifier;
use Session;
use DB;

class AppointmentController extends Controller
{
    
    function getAppointmentList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $search_value = $req->search_value;
        $filter_date = convertDate($req->date);
        $filter_status_id = $req->status_id;
        
        $str_where ="1=1";
        if ($search_value){
            $search_value = escape_like_str($search_value);
            $str_where ="(appt.client_code = '$search_value' OR appt.client_name LIKE '%$search_value%' OR appt.client_phone_number ='$search_value')";
        }

        if((bool)strtotime($filter_date)){
            $str_where .= ($str_where? ' AND ':'')."Date(appt.arrival_date) ='$filter_date'";  
        }

        if($filter_status_id >0 || $filter_status_id ==-1){
          $str_where .= ($str_where? ' AND ':'')."appt.status_id =$filter_status_id";  
        }

        $cols ="appt.id,appt.consultant_id,formatTime(arrival_time) AS arrival_time,formatDate(arrival_date) as arrival_date,appt.client_id,appt.create_user,formatDate(appt.created_at) AS created_at,client_name, client_sex,client_phone_number,client_email,appt.schedule_type,appt.priority,appt.channel_id,cc.name as contact_channel, appt.notes, appt.status_id, getApptStatus(appt.branch_id,appt.status_id) As status, getPatientCode(appt.branch_id,appt.client_id) AS patient_code, appt.arrival_time AS arrival_time1";
        $rows = DB::table("appointments as appt")->join('contact_channels as cc','cc.id','=','appt.channel_id')->where('appt.branch_id',$branch_id)->whereRaw($str_where)->selectRaw($cols)->orderByRaw("arrival_time1 desc")->get();  
        return JDV::result($rows);
        
        // Appointment::query()->whereRaw("id>2")->cursor()->each(function($data){
        //      return $data;
        // });
        
        // Appointment::chunk(2, function($rows)
        // {
        //      JDV::result($rows);
        //     // foreach ($rows as $appt)
        //     // {
        //     //     $ms[] = $appt;
        //     //     //do something here
        //     // }
        //     // return $ms;
        // });

        //return JDV::result([]);
        //return  JDV::result(Appointment::all());
    }

    function addToQueue(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        //Todo: we can use @appt_id to obtain @client_id
        $inputs =[
            'appt_id'=>$req->appt_id,
            'client_id'=>$req->client_id,
            'department_id'=>$req->department_id,
            'consultant_id'=>$req->consultant_id
        ];
        $res = QTicket::create($ss,$inputs);
        return JDV::raw($res);
    }

    function getAppointmentDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $id = $req->id;
        $cols ="appt.id,appt.client_id,appt.consultant_id,getConsultanName(appt.consultant_id) as consultant_name, DATE_FORMAT(arrival_time,'%r') AS arrival_time,DATE_FORMAT(arrival_date,'%d %b %Y') as arrival_date,appt.lead_id,appt.client_id,appt.create_user,DATE_FORMAT(appt.created_at,'%d %b %Y') AS created_at,
        client_name,
        client_sex,
        client_email,
        client_phone_number,
        appt.schedule_type,
        appt.priority, 
        appt.channel_id, cc.name as contact_channel, appt.notes, getPatientCode(appt.branch_id, appt.client_id) as patient_code, getApptStatus(appt.branch_id,appt.status_id) AS status, getTicketNumber(appt.branch_id,appt.id) as ticket_number, appt.status_id";
        $rows = DB::table("appointments as appt")->join('contact_channels as cc','cc.id','=','appt.channel_id')->where('appt.branch_id',$branch_id)->where('appt.id',$id)->selectRaw($cols)->get();  
        foreach($rows as $row){
            $row->chief_complaints = DB::table("appt_chief_complaints as apc")->join('chief_complaints as cc','cc.id','=','apc.chief_complaint_id')->where('apc.appt_id',$row->id)->selectRaw("cc.id,cc.name")->get();
            return JDV::result($row);
        }
        return JDV::result([]);
    }

    //Add Chief complaint to an Appointment
    function addChiefComplaint(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $appt_id = $req->appt_id;
        $cc_id = $req->cc_id;
        DB::table('appt_chief_complaints')->insert([
            'appt_id'=>$appt_id,
            'chief_complaint_id'=>$cc_id
        ]);
        return JDV::success();
    }

     //Remove Chief complaint to an Appointment
    function removeChiefComplaint(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $appt_id = $req->appt_id;
        $cc_id = $req->cc_id;
        DB::table('appt_chief_complaints')->where('chief_complaint_id',$cc_id)->where('appt_id',$appt_id)->delete();
        return JDV::success();
    }

    function deleteAppointment(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $id = $req->id;
        Appointment::destroy($id);
        return JDV::success();
    }
 
    protected function validateChiefComplaintItems($items=[]){
      $inputs = [];  
      foreach($items as $item){
          if(!isset($item['name']) || empty($item['name'])) return (object)['error'=>"Invalid chief complaint description or name","inputs"=>[]];
          $item_id = isset($item['id'])?$item['id']:0;
          //if (!is_numeric($item_id)) return (object)['error'=>"Invalid chief complaint ID","inputs"=>[]];
          $item['id'] = $item_id;
          $inputs[] =$item; 
      }
      return (object)['error'=>null,"inputs"=>$inputs];
    }
    
    function saveChiefComplaints($ss,$appointment_id,$items){
       $res = $this->validateChiefComplaintItems($items);
       if($res->error) return $res->error;
       $inputs = $res->inputs;
       
       foreach($inputs as $cc){
              $item_id = isset($cc['id'])?$cc['id']:0;
              if(!$item_id) $item_id = saveData($ss,'chief_complaints',['id'=>0],$cc,0);
              if($item_id>0){
                unset($cc['name']);
                $item_id = saveData($ss,'appt_chief_complaints',['id'=>0],['appt_id'=>$appointment_id,'chief_complaint_id'=>$cc['id']],0);
              } 
       }
       return null;
    } 

    function saveAppointment(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;

        $sanitize_rules = ['client_email'=>['@','.','-'],'address'=>['#','.','-']];
        $check_unique = [];
        $res = validateReq($req,[
            'id'=>'0|number|identity=1',
            'client_id'=>'0|number|default=0',
            'lead_id'=>'0|number|default=0',
            'client_name'=>'0|string',
            'client_sex'=>'1|choice|M,F',
            'client_phone_number'=>'0|phone',
            'client_email'=>'0|email',
            'arrival_date'=>'1|date|text=Arrival date is not correct',
            'arrival_time'=>'1|time|text=',
            'consultant_id'=>'0|number|default=0',
            'channel_id'=>'1|positive|text=Contact channel is not valid',
            'priority'=>'0|choice|Urgent,Normal',
            'schedule_type'=>'0|choice|On demand,Followup',
            'notes'=>'0|string',
            'status_id'=>'0|number|default=1', /** 0= Canceled, 1= Pending, 2=Registered, 3 = Queued, 4= Served **/
            'chief_complaint_items'=>"0|array|" 
        ],true,$sanitize_rules,$ss->lang,false,$check_unique);

       if($res->error) return JDV::error($res->error,$ss->lang);
 
       $inputs = $res->values;

       $chief_complaint_items =[];
       if (isset($inputs['chief_complaint_items'])) $chief_complaint_items = $inputs['chief_complaint_items'];
       unset($inputs['chief_complaint_items']);

       $arrival_time = $inputs['arrival_time'];
       $client_name = $inputs['client_name'];
       $client_phone = $inputs['client_phone_number'];

       $inputs['arrival_time'] = convertDate($inputs['arrival_date'])." ".date('h:i',strtotime($arrival_time));
       $patient_code="";
       $client_id =0;
       $lead_id =0;

       $client = Patient::retrieveBy($branch_id,['phone_number'=>$client_phone]);
       if (!$client){
          $lead_res = JDV::validateProps($inputs,['client_phone_number'=>'1|phone|','client_name'=>'1|string','client_sex'=>'0|string|default=M']);
          if($lead_res->error) return JDV::error($lead_res->error);
          $lead = getDataRow('leads',['phone_number'=>$client_phone],"id,name");
                if($lead) 
                   $lead_id = $lead->id;
                else{
                        //In case that the person is Not Client, and Not a lead too => create a new lead's profile
                        $lead_id = createForcibly($ss,'leads',['id'=>$lead_id],[
                        "name"=>$lead_res->inputs['client_name'],
                        "sex"=>$lead_res->inputs['client_sex'],
                        "phone_number"=>$client_phone,
                        "status_id"=>2 // This is Lead's status, not  appointment's status. status_id = {1=Lead,2=prospect}
                       ],[],1);
                      
                       if($lead_id>0){
                           $inputs['lead_id'] =$lead_id;
                       }else JDV::error("Problem during saving of new prospect`s information");
                }        
       }else{
          //In case client exists by Phone number
          $client_id = $client->id;
          $patient_code = $client->code;
          /** status_id => 0= Canceled, 1=pending 2=Registered 3=Queued 4=Served. For existing customer's appointment => status_id =2 **/
          $inputs['status_id'] = 2;
       }

       $inputs['client_id'] = $client_id;
       $inputs['lead_id'] = $lead_id;
       $inputs['client_code'] = $patient_code;

       //$create_case = 1; means creating new appointment, Not updating existing appointment
       $create_case = 0; 
       $appt_id = isset($res->id)?$res->id:0;
       if(!$appt_id) $create_case = 1;
       $appt_id = saveData($ss,'appointments',['id'=>$appt_id],$inputs,1); 
       if($appt_id > 0)
        {
            $this->saveChiefComplaints($ss,$appt_id,$chief_complaint_items);
            if($create_case ===1)  Notifier::notify_admin('AppointmentAdded',["user_id"=>$ss->user_id,"login_name"=>$ss->login_name,"appt_id"=>$appt_id,"client_name"=>$inputs['client_name'],"client_phone_number"=>$inputs['client_phone_number']]);
            return JDV::success(['id'=>$appt_id]);
        }
       else return JDV::error("Something went wrong in saving appointment!");
    }

    //find Client, if not found then find Lead or prospect
    //NOTE: return only one client as object, Not array
    function findClient(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $search_value = $req->search_value;
       
        $str_search ="1=2";
        if($search_value){
            $search_value = escape_like_str($search_value);
            $str_search ="p.phone_number ='$search_value' OR pt.code ='$search_value'";
        }
        $rows = DB::table('persons as p')->join('patients as pt','pt.person_id','=','p.id')->where('pt.branch_id',$branch_id)->whereRaw($str_search)->selectRaw("pt.id as patient_id,p.id as person_id,p.name,p.sex,p.phone_number,p.email,p.cp_phone_number")->get();
        //$person = Patient::retrieveBy($branch_id,['phone_number'=>$phone_number,'national_id'=>$national_id]);
        if(!isset($rows[0])){
            if($search_value){
                $search_value = escape_like_str($search_value);
                $str_search ="l.phone_number ='$search_value'";
            }
            $rows =DB::table('leads as l')->where('l.branch_id',$branch_id)->whereRaw($str_search)->selectRaw("l.id as lead_id,l.name,l.phone_number,l.sex,l.email")->get();
        }
        return JDV::result(isset($rows[0])?$rows[0]:null);
    }
}
