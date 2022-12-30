<?php

namespace App\Models\ServiceQ;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UM;
use DB;
use App\Models\DV;

class QTicket extends Model
{
    use HasFactory;
    protected $table = 'service_queue';
    protected $guarded = ['id'];
    protected $fillable =['id','ticket_number','client_id','client_name','section_id','section_type','created_at','create_user','create_uid'];
      
    protected $primaryKey = 'id';
    public $incrementing = true;
    //protected $keyType = 'string';
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d';
    
    protected static $validation_rule = [
        "client_id"=>"1|number",
        "department_id"=>"0|number|default=0",
        "consultant_id"=>"0|number",
        "appt_id"=>"0|number",
        "priority"=>"0|choice|Normal,Urgent", //Case-sensitive
        "schedule_type"=>"0|choice|Followup,On demand|default=On Demand",
        "status_id"=>"0|positive",
        "remarks"=>"0|string"
    ];

    //Default ticket pref is used only for the first ticket only (After that prefix is directly retrievd from database table)
    const DEFAULT_TICKET_PREFIXES = [
        0=>'G', //General Department
        1=>'G', //General Department
        2=>'D', //Dermatology Department
        3=>'P' //Plastic Surgery Department
    ];

    //Branch of the subscriber (company)
    protected static $com_branch_id =1;  
    protected static $sanitize_rule = ['ticket_number'=>['-']];
    protected static  $checkUnique = [];

    //@param $d =['client_id','department_id','consultant_id','priority','schedule_type','remarks']
    static function create($ss,$d){
        //if(!$ss) $ss = UM::getUserInfoByToken($req,-1);
        //if($ss->status_code !=200) return $ss; //user not authenticated
        if(!$ss) return DV::error('Authentication information is missing!'); 
        $branch_id = $ss->branch_id;
        $res = validateObject($d,self::$validation_rule,true,self::$sanitize_rule,false,$ss->lang,self::$checkUnique);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $department_id = $inputs['department_id'];
        $today_date = date('Y-m-d');
        $ticket_number = self::createTicketNumber($branch_id,self::$com_branch_id,$today_date,$department_id,self::DEFAULT_TICKET_PREFIXES[$department_id],5);
        $inputs['ticket_number'] =$ticket_number; 
        
        if(!isset($inputs['ticket_number'])) return DV::error('Failed to create waiting ticket number');
        $inputs['q_date'] = $today_date;
        //Error 500, may occur if there is no array key "client_id". But this key must exist at this point of execution 
        $client_id = $inputs['client_id'];
        $inputs['person_id'] = self::getPersonId($client_id);
        $appt_id = isset($d['appt_id'])?$d['appt_id']:0;

        if ($appt_id > 0){
              //Get appoinment's info "schedule_type","priority"
              if(!isset( $inputs['schedule_type'])){
                $rows = DB::table('appointments')->where('id',$appt_id)->selectRaw("schedule_type,priority")->take(1)->get();
                foreach($rows as $row){
                    $inputs['priority'] = $row->priority;
                    $inputs['schedule_type'] = $row->schedule_type;
                }
            }
        }

        $ticket_id = saveData($ss,'service_queue',['id'=>0],$inputs,[],1);
        if($ticket_id >0){
            $status_id_queued =3;

            if($appt_id > 0){
                DB::table('appointments')->where('id',$appt_id)->where('branch_id',$branch_id)->update(['status_id'=>$status_id_queued]);
                DB::table('appt_chief_complaints')->where('appt_id',$appt_id)->update(['ticket_id'=>$ticket_id]);
                DB::table('patient_vital_signs')->where('appt_id',$appt_id)->where('branch_id',$branch_id)->update(['ticket_id'=>$ticket_id]);
            }

            $statusInfo = (object)['status_id'=>$status_id_queued,'status'=>'Queued'];
            return DV::success(['id'=>$ticket_id,'ticket_number'=>$ticket_number,'status_info'=>$statusInfo]);
        }
        else return DV::error('Something went wrong during saving queue');
    }

    static function createTicketNumber($branch_id,$com_branch_id, $q_date,$department_id=0,$def_prefix ="T",$len=5){
        if(!$def_prefix) $def_prefix="T";
        $code_control_table ="queue_ticket_control";
        $q_date = convertDate($q_date);
        //$com_branch_id =1;

        if(!$len) $len=5;
        $str_where =null;

        if($branch_id>0){
            $str_where = "branch_id =$branch_id";
        }
        
        if($department_id > 0){
            $str_where .= ($str_where? " AND ":"")."department_id = $department_id";
        }

        if($com_branch_id > 0){
            $str_where .= ($str_where? " AND ":"")."com_branch_id = $com_branch_id";
        }
        $str_where .= ($str_where? " AND ":"")."q_date = '$q_date'";

        $rows = DB::table($code_control_table)->whereRaw($str_where)->selectRaw("last_id,prefix")->take(1)->get();
        $next_num = 0;
        $prefix=null;
        foreach($rows as $row){
          $next_num = $row->last_id;
          $prefix =$row->prefix;
        }
        if(!$prefix) $prefix = $def_prefix;
    
        $next_num++;
        $new_code = $prefix.$branch_id.formatNumber($next_num,$len);
        
        $updated = DB::table($code_control_table)->whereRaw($str_where)->update(['last_id'=>$next_num]);
        if (!$updated) DB::table($code_control_table)->insert(['branch_id'=>$branch_id,'prefix'=>$def_prefix,'last_id'=>$next_num,'department_id'=>$department_id,'com_branch_id'=>$com_branch_id,'q_date'=>$q_date]);
        return $new_code;
    }

    static function getPersonId($client_id=0){
      $row = getDataRow('patients',['id'=>$client_id],"person_id");
      if($row) return $row->person_id;
      return null;
    }

    //@params $d = {'branch_id','search_value','filter_date','filter_status'}
    static function list($d){
        $branch_id = $d['branch_id'];
        $search_value = isset($d['search_value'])?$d['search_value']:null;
        $filter_date = isset($d['date'])? convertDate($d['date']):null;
        $filter_status_id = isset($d['status_id'])?$d['status_id']:null;
        
        $str_where ="1=1";
        if ($search_value){
            $search_value = escape_like_str($search_value);
            $str_where ="(s.client_name LIKE '%$search_value%' OR cl.code = '$search_value')";
        }

        if((bool)strtotime($filter_date)){
            $str_where .= ($str_where? ' AND ':'')."Date(s.q_date) ='$filter_date'";  
        }

        if($filter_status_id >0 || $filter_status_id ==-1){
          $str_where .= ($str_where? ' AND ':'')."s.status_id =$filter_status_id";  
        }

        $cols ="s.id,s.consultant_id,s.ticket_number,formatDate(s.q_date) AS q_date,s.client_id,s.person_id,s.create_user,formatDate(s.created_at) AS created_at,p.name as client_name,p.phone_number as client_phone_number,p.email as client_email,p.sex as client_sex,s.schedule_type,s.priority,s.remarks, s.status_id, sts.name AS status, cl.code AS client_code";
        $rows = DB::table('service_queue as s')->join('ticket_statuses as sts','sts.id','=','s.status_id')->join('persons as p','p.id','=','s.person_id')->join('patients as cl','p.id','=','cl.person_id')->where('s.branch_id',$branch_id)->whereRaw($str_where)->selectRaw($cols)->orderByRaw('s.created_at DESC')->get();
        return $rows;
    }

    //@param $d = ['chief_complaint_id','ticket_id']
    static function addChiefComplaint($ss,$d){ 
        $ticket_id = $d['ticket_id'];  
        $ticket= getDataRow('service_queue',['id'=>$ticket_id],"appt_id");
        $appt_id = null;
        if($ticket) $ticket = $ticket->appt_id;
        $d['appt_id'] = $appt_id; 
        saveData($ss,'appt_chief_complaints',['id'=>0],$d,[],0);
        // *** IMPORTANT NOTE: In case that the target table has no auto-increment field, method saveData() does not return positive ID value 
        return DV::success();
        //else return DV::error('Something when wrong in saving Chief Complaint. There might be no auto-increment ID field');
    } 

    static function deletePermanent($d){
        $branch_id = $d['branch_id'];
        $id = $d['id'];
        $x = DB::table('service_queue')->where('id',$id)->where('branch_id',$branch_id)->delete();
        return DV::success(['id'=>$id]);
    }

    //@param $d = {'branch_id','id'}
    static function info($d){
        $ticket_id = $d['id'];
        $branch_id = $d['branch_id'];
        $cols ="s.branch_id,s.id,s.appt_id,s.person_id,getPatientCode(s.branch_id,s.client_id) as client_code,s.client_id,p.name as client_name,p.sex as client_sex,p.phone_number as client_phone_number,p.email as client_email,s.ticket_number,s.status_id, getConsultanName(s.consultant_id) as consultant_name,'None' AS membership_card";
        $rows = DB::table('service_queue as s')->join('ticket_statuses as sts','sts.id','=','s.status_id')->join('persons as p','p.id','=','s.person_id')->where('s.id',$ticket_id)->where('s.branch_id',$branch_id)->selectRaw($cols)->take(1)->get();
        foreach($rows as $row){
            $row->vital_signs = self::getVitalSigns($row->branch_id,$row->id);
            $row->chief_complaints = self::getChiefComplaints($row->branch_id,$row->id);
            $row->mc_items = self::getMedicalConditions($row->branch_id,$row->id);
            return $row;
        }
        return null;
    }

    static function getVitalSigns($branch_id,$ticket_id=0){
        return DB::table('patient_vital_signs as ps')->join('vital_signs as vs','vs.id','=','ps.vital_sign_id')->where('ps.ticket_id',$ticket_id)->where('ps.branch_id',$branch_id)->selectRaw("vs.id,vs.display_name as name,ps.vital_sign_value, ps.description")->take(4)->get();
    }

    static function getChiefComplaints($branch_id,$ticket_id=0){
        //NOTE: table appt_chief_complaints does not have column "branch_id"
        return DB::table('appt_chief_complaints as ct')->join('chief_complaints as cc','cc.id','=','ct.chief_complaint_id')->where('ct.ticket_id',$ticket_id)->selectRaw("cc.id,cc.name")->get();
    }

    //@param $d = ['ticket_id','chief_complaint_id']
    static function deleteChiefComplaint($d){
        $chief_complaint_id = $d['chief_complaint_id'] ;
        $ticket_id = $d['ticket_id']; 
        DB::table('appt_chief_complaints')->where('ticket_id',$ticket_id)->where('chief_complaint_id',$chief_complaint_id)->delete();
        return DV::success();
    }

    static function getMedicalConditions($branch_id,$ticket_id=0){
       $patient_id = self::patientId($branch_id,$ticket_id); 
       return DB::table('patient_medical_conditions AS pmc')->where('pmc.patient_id',$patient_id)->selectRaw("pmc.id,pmc.description,pmc.mc_value,pmc.display_order")->orderByRaw("pmc.display_order")->get(); 
    }

    static function patientId($branch_id,$ticket_id){
      $rows = DB::table('service_queue as s')->where('id',$ticket_id)->where('branch_id',$branch_id)->selectRaw('client_id')->take(1)->get();
      return isset($rows[0])? $rows[0]->client_id:null;
    }
}
