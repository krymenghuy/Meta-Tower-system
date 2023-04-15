<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
//If we use UUID instead of integer appointment_id
//use Illuminate\Database\Eloquent\Concerns\HasUuids;
use DB;
use App\Models\DV;
use App\Models\ServiceQ\QTicket;
use Carbon\Carbon;
class Appointment //extends Model
{
    //use HasFactory;
    protected $id =null;
    protected $userInfo = null;

    function __construct($id=null,$userInfo){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    function getId(){
        return $this->id;
    }

    function getUserInfo(){
        return $this->userInfo;
    }

    //save() will either Create or Update appointment
    function save($d=[],$ss=null){
        $ss = $ss? $ss: $this->getUserInfo();
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;

        $sanitize_rules = ['client_email'=>['@','.','-'],'address'=>['#','.','-']];
        $check_unique = [];
        $res = validateObject($d,[
            'id'=>'0|number|identity=1',
            'client_id'=>'0|number|default=0',
            'lead_id'=>'0|number|default=0',
            'client_name'=>'0|string',
            'client_sex'=>'1|choice|M,F|text=Gender must be M or F',
            'client_phone_number'=>'0|phone',
            'client_email'=>'0|email',
            'arrival_date'=>'0|date|text=Arrival date is not correct',
            'arrival_time'=>'0|time|text=',
            'consultant_id'=>'0|number|default=0',
            'channel_id'=>'1|positive|text=Contact channel is not valid',
            'priority'=>'0|choice|Urgent,Normal',
            'schedule_type'=>'0|choice|On demand,Followup',
            'notes'=>'0|string',
            'status_id'=>'0|number|default=1', /** 0= Canceled, 1= Pending, 2=Registered, 3 = Queued, 4= Served **/
            'chief_complaint_items'=>"0|array|" 
        ],true,$sanitize_rules,$ss->lang,false,$check_unique);

       if($res->error) return DV::error($res->error,$ss->lang);
 
       $inputs = $res->values;
       $chief_complaint_items =[];
       if (isset($inputs['chief_complaint_items'])) $chief_complaint_items = $inputs['chief_complaint_items'];
       unset($inputs['chief_complaint_items']);

       
       $client_name = $inputs['client_name'];
       $client_phone = $inputs['client_phone_number'];
 
       $patient_code="";
       $client_id =0;
       $lead_id =0;

       $client = Patient::retrieveBy($branch_id,['phone_number'=>$client_phone]);
       if (!$client){
          $lead_res = DV::validateProps($inputs,['client_phone_number'=>'1|phone|','client_name'=>'1|string','client_sex'=>'0|string|default=M']);
          if($lead_res->error) return DV::error($lead_res->error);
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
                       }else DV::error("Problem during saving of new prospect`s information");
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
       
       $arrival_time = $inputs['arrival_time'];
       if(!$arrival_time) $inputs['arrival_time'] = getNowTime();
       else  $inputs['arrival_time'] = getNowTime(); 
       $arrival_date = $inputs['arrival_date'];
       if(!(bool)strtotime($arrival_date)) $inputs['arrival_date'] = date('Y-m-d');

       //$create_case = 1; means creating new appointment, Not updating existing appointment
       $create_case = 0; 
       $appt_id = isset($res->id)?$res->id:0;
       if(!$appt_id) $create_case = 1;
       $inputs['arrival_date'] = convertDate( $arrival_date? $arrival_date :date('Y-m-d') );
       $appt_id = saveData($ss,'appointments',['id'=>$appt_id],$inputs,1); 
       if($appt_id > 0)
        {
            $this->saveChiefComplaints($ss,$appt_id,$chief_complaint_items);
            if($create_case ===1)  Notifier::notify_admin('AppointmentAdded',["user_id"=>$ss->user_id,"login_name"=>$ss->login_name,"appt_id"=>$appt_id,"client_name"=>$inputs['client_name'],"client_phone_number"=>$inputs['client_phone_number']]);
            return DV::success(['id'=>$appt_id]);
        }
       else return DV::error("Something went wrong in saving appointment!");
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

    function list($d =[],$ss=null){ 
        if (!$ss) $ss = $this->getUserInfo();
        $branch_id = $ss->branch_id;
        $search_value = isset($d['search_value'])?$d['search_value']:null;
        $filter_date = isset($d['date'])?convertDate($d['date']): null;
        $filter_status_id = isset($d['status_id'])?$d['status_id']:null;
        //on first creation of appointment, order last ID first
        $order_by_id = isset($d['order_by_id'])? $d['order_by_id']:null;

        $str_where ="1=1";
        if ($search_value){
            $search_value = escape_like_str($search_value);
            $str_where ="(appt.client_code = '$search_value' OR appt.client_name LIKE '%$search_value%' OR appt.client_phone_number ='$search_value')";
        }

        if((bool) strtotime($filter_date)){
            $str_where .= ($str_where? ' AND ':'')."Date(appt.arrival_date) ='$filter_date'";  
        }

        if($filter_status_id >0 || $filter_status_id ==-1){
          $str_where .= ($str_where? ' AND ':'')."appt.status_id =$filter_status_id";  
        }
        $str_order="arrival_time1 desc";
        if ($order_by_id ) $str_order ="id DESC"; 
        $cols ="appt.id,appt.consultant_id,formatTime(arrival_time) AS arrival_time,formatDate(arrival_date) as arrival_date,appt.client_id,appt.create_user,formatDate(appt.created_at) AS created_at,client_name, client_sex,client_phone_number,client_email,appt.schedule_type,appt.priority,appt.channel_id,cc.name as contact_channel, appt.notes, appt.status_id, getApptStatus(appt.branch_id,appt.status_id) As status, getPatientCode(appt.branch_id,appt.client_id) AS patient_code, appt.arrival_time AS arrival_time1";
        return DB::table("appointments as appt")->join('contact_channels as cc','cc.id','=','appt.channel_id')->where('appt.branch_id',$branch_id)->whereRaw($str_where)->selectRaw($cols)->orderByRaw($str_order)->get();  
         
    }

    //$d = ['client_id','department_id','consultant_id']
    function addToQueue($d = [],$ss=null){
        //$id = $this->getId();
        if(!$ss) $ss = $this->getUserInfo();
        $branch_id = $ss->branch_id;
        //Todo: we can use @appt_id to obtain @client_id
        if (!isset($d['appt_id'])) $d['appt_id'] = $this->getId();

        $res = validateObject($d,[
            'appt_id'=>"1|positive",
            'client_id'=>'0|number',
            'department_id'=>'1|positive',
            'consultant_id'=>'0|number'
        ],true,[],$ss->lang,false,null);

        if($res->error) return DV::error($res->error);
        $ticket = new QTicket(null,$ss);
        return $ticket->create($inputs);
    }

    static function details($id,$branch_id){
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
            return $row;
        }
        return null;
    }

    function getDetails($id=null,$ss=null){
        if (!$id) $id = $this->getId();
        if(!$ss) $ss = $this->getUserInfo();
        return self::details($id,$ss->branch_id);
    }

    //$d = ['cc_id']
    function addChiefComplaint($d= [], $id=null, $ss=[]){
        if (!$id) $id = $this->getId();
        if(!$ss) $ss = $this->getUserInfo();
        $branch_id = $ss->branch_id;
        $cc_id = $d['cc_id'];
        DB::table('appt_chief_complaints')->insert([
            'appt_id'=>$id, //This is appt_id
            'chief_complaint_id'=>$cc_id
        ]);
        return DV::success();
    }

    function removeChiefComplaint($cc_id=0,$appt_id=null,$ss=null){
        if (!$appt_id) $appt_id = $this->getId();
        if(!$ss) $ss = $this->getUserInfo();
        $branch_id = $ss->branch_id;
        DB::table('appt_chief_complaints')->where('chief_complaint_id',$cc_id)->where('appt_id',$appt_id)->delete();
        return DV::success();
    }
   
    function delete($appt_id=null,$ss=null){
        if (!$appt_id) $appt_id = $this->getId();
        if(!$ss) $ss = $this->getUserInfo();
        DB::table('patient_vital_signs')->where('appt_id',$appt_id)->delete();
        DB::table('appointments')->where('id',$appt_id)->where('branch_id',$ss->branch_id)->delete();
        return DV::success();
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

    function findClient($d =[],$ss=null){
        $ss = $ss?$ss: $this->getUserInfo();
        $branch_id = $ss->branch_id;
        $search_value = $d['search_value']?$d['search_value']:null;
       
        $str_search ="1=2";
        if($search_value){
            $search_value = escape_like_str($search_value);
            $str_search ="(p.phone_number ='$search_value' OR pt.code ='$search_value' OR CONCAT(p.last_name,' ',p.first_name) LIKE '%$search_value%')";
        }
        $rows =  DB::table('persons as p')->join('patients as pt','pt.person_id','=','p.id')->where('pt.branch_id',$branch_id)->whereRaw($str_search)->selectRaw("pt.id, pt.id as patient_id,pt.code,p.id as person_id,concat(p.last_name,' ',p.first_name) AS `name`,p.sex,p.phone_number,p.email,p.cp_phone_number,p.address")->get();
        //$person = Patient::retrieveBy($branch_id,['phone_number'=>$phone_number,'national_id'=>$national_id]);
        if(!isset($rows[0]) || count($rows) ===0){
            if($search_value){
                $search_value = escape_like_str($search_value);
                $str_search ="l.phone_number ='$search_value'";
            }
            $rows =DB::table('leads as l')->where('l.branch_id',$branch_id)->whereRaw($str_search)->selectRaw("l.id as lead_id,l.name,l.phone_number,l.sex,l.email")->get();
        }
        return isset($rows[0])?$rows[0]:null;
    }
}
