<?php

namespace App\Models\ServiceQ;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\Consultation;
use App\Models\UM;
use DB;
use App\Models\PublicStorage;
use App\Models\DV;
use App\Models\Notifier;

class QTicket //extends Model
{
    //use HasFactory;
    //protected $table = 'tickets';
    //protected $guarded = ['id'];
    // protected $fillable =['id','ticket_number','client_id','client_name','section_id','section_type','created_at','create_user','create_uid'];
      
    // protected $primaryKey = 'id';
    // public $incrementing = true;
    // //protected $keyType = 'string';
    // public $timestamps = true;
    // protected $dateFormat = 'Y-m-d';
    
    protected static $validation_rule = [
        "id"=>"0|number|identity=1",
        "com_branch_id"=>"0|number",
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
    protected  $com_branch_id =1;  
    protected static $sanitize_rule = ['ticket_number'=>['-']];
    protected static  $checkUnique = [];
    
    protected $id = null;
    protected $userInfo = null;
    function __construct($id=null,$userInfo=null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function getUserInfo(){
        return $this->userInfo;
    }
    function getId(){
        return $this->id;
    }

    
    //@param $d =['client_id','department_id','consultant_id','priority','schedule_type','remarks']
    function create($d=[],$ss=null){
        if (!$ss) $ss = $this->getUserInfo(); 
        if(!$ss) return DV::error('Authentication information is missing!'); 
        $branch_id = $ss->branch_id;
        if (!isset($d['id'])) $d['id'] = $this->getId();

        $res = validateObject($d,self::$validation_rule,true,self::$sanitize_rule,false,$ss->lang,self::$checkUnique);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        
        $department_id = $inputs['department_id'];
        $today_date = date('Y-m-d');
        $def_ticket_prefix = isset(self::DEFAULT_TICKET_PREFIXES[$department_id])?self::DEFAULT_TICKET_PREFIXES[$department_id]:"P";
        $ticket_number = self::createTicketNumber($branch_id,$inputs['com_branch_id'],$today_date,$department_id,$def_ticket_prefix,5);
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

        //In case of Registering patient and add them to Queque directly
        $inputs['status_id'] =1;
        $ticket_id = saveData($ss,'tickets',['id'=>0],$inputs,[],1);
        if($ticket_id >0){
            $status_id_queued =3;

            if($appt_id > 0){
                DB::table('appointments')->where('id',$appt_id)->where('branch_id',$branch_id)->update(['status_id'=>$status_id_queued]);
                DB::table('appt_chief_complaints')->where('appt_id',$appt_id)->update(['ticket_id'=>$ticket_id]);
                DB::table('patient_vital_signs')->where('appt_id',$appt_id)->where('branch_id',$branch_id)->update(['ticket_id'=>$ticket_id]);  
            }
            
            $statusInfo = (object)['status_id'=>$status_id_queued,'status'=>'Queued'];
            Notifier::notify_admin('TicketAdded',["user_id"=>$ss->user_id,"login_name"=>$ss->login_name,"ticket_id"=>$ticket_id,"ticket_number"=>$ticket_number]);
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

    function getPatentInfo($ticket_id = null){
       $ticket_id = $ticket_id?$ticket_id:$this->getId();
       $rows = DB::table('tickets as t')->join('persons as p','p.id','=','t.person_id')->where('t.id',$ticket_id)->select('t.client_id as id','t.id as ticket_id','p.id as person_id','p.first_name','p.last_name',DB::raw("CONCAT(p.last_name,' ',p.first_name) as name"),'sex','phone_number','email','address')->take(1)->get();
       return isset($rows[0])?$rows[0]:null;
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
        $filter_date = isset($d['date'])? convertDate($d['date']):date('Y-m-d');
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

        $cols ="s.id,s.invoice_id,s.consultant_id,s.ticket_number,formatDate(s.q_date) AS q_date,s.client_id,s.person_id,s.create_user,formatDate(s.created_at) AS created_at,concat(p.last_name,' ',p.first_name) as client_name,p.phone_number as client_phone_number,p.email as client_email,p.sex as client_sex,s.schedule_type,s.priority,s.remarks, s.status_id, sts.name AS status, cl.code AS client_code";
        return DB::table('tickets as s')->join('ticket_statuses as sts','sts.id','=','s.status_id')->join('persons as p','p.id','=','s.person_id')->join('patients as cl','p.id','=','cl.person_id')->where('s.branch_id',$branch_id)->whereRaw($str_where)->selectRaw($cols)->orderByRaw('s.id DESC')->get();
    }

    //@param $d = ['chief_complaint_id','ticket_id']
    static function addChiefComplaint($ss,$d){ 
        $ticket_id = $d['ticket_id'];  
        $ticket= getDataRow('tickets',['id'=>$ticket_id],"appt_id");
        $appt_id = null;
        if($ticket) $ticket = $ticket->appt_id;
        $d['appt_id'] = $appt_id; 
        saveData($ss,'appt_chief_complaints',['id'=>0],$d,[],0);
        // *** IMPORTANT NOTE: In case that the target table has no auto-increment field, method saveData() does not return positive ID value 
        return DV::success();
        //else return DV::error('Something when wrong in saving Chief Complaint. There might be no auto-increment ID field');
    } 

    static function canDelete($id){
        $row = getDataRow('tickets',['id'=>$id],"id,status_id");
        if(!$row) return true;
        //Served ticket cannot be deleted
        if($row->status_id ===3) return false;
        return true;
    }

    static function getProps($id,$cols=[]){
       $rows = DB::table('tickets as t')->where('t.id',$id)->select($cols)->take(1)->get();
       return isset($rows[0])?$rows[0]:null; 
    }

    function delete($id=null,$ss=null){
        $id = $id? $id:$this->getId();
        $ss = $ss?$ss:$this->getUserInfo();

        $ticket = self::getProps($id,['appt_id','status_id']);
        if(!$ticket) return DV::error('invalid ticket ID');
        if($ticket->status_id ===3) return DV::error("Served ticket cannot be deleted");
        DB::table('patient_vital_signs')->where('ticket_id',$id)->delete();
        $x = DB::table('tickets')->where('id',$id)->delete();
        //Change Appointment Status back to "Registered"
        DB::table('appointments')->where('id',$ticket->appt_id)->update([
            'status_id'=>2
        ]);
        return DV::success(['id'=>$id]);
    }

    //@param $d = {'branch_id','id'}
    static function info($id,$ss,$include_cc=true,$include_vs=true,$include_mc=true){
        //$ticket_id = $id? $id: $this->getId();
        //$ss = $ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $cols ="s.branch_id,s.id,s.appt_id,s.person_id,getPatientCode(s.branch_id,s.client_id) as client_code,s.client_id,CONCAT(p.last_name,' ',p.first_name) as client_name,p.sex as client_sex,p.phone_number as client_phone_number,p.email as client_email,s.ticket_number,s.status_id, getConsultanName(s.consultant_id) as consultant_name,'None' AS membership_card";
        $rows = DB::table('tickets as s')->join('ticket_statuses as sts','sts.id','=','s.status_id')->join('persons as p','p.id','=','s.person_id')->where('s.id',$id)->where('s.branch_id',$branch_id)->selectRaw($cols)->take(1)->get();
        foreach($rows as $row){
            if ($include_cc) $row->chief_complaints = self::chiefComplaints($row->branch_id,$row->id);
            if ($include_vs) $row->vital_signs = self::vitalSigns($row->branch_id,$row->id);
            if($include_mc) $row->mc_items = self::medicalConditions($row->branch_id,$row->id);
            return $row;
        }
        return null;
    }

    static function countPatientPhotos($patient_id){
        $rows = DB::table("patient_photos")->where('patient_id',$patient_id)->selectRaw("COUNT(id) AS cnt")->get();
        foreach($rows as $row) return $row->cnt;
        return -1;
    }

    function savePatientPhoto($d =[],$ss=[]){
        $id = $this->getId();
        $ss = $ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $patient_id = isset($d['patient_id'])?$d['patient_id']:null;
        $ticket_id = isset($d['ticket_id'])? $d['ticket_id']:null;
        if (!$ticket_id) return DV::error("Ticket ID is not valid");
        if (!$patient_id){
            $ticket = $this->getProps($ticket_id,["client_id AS patient_id"]);
            if($ticket) $patient_id = $ticket->patient_id;
        }
        if (!$patient_id) return DV::error("Failed to identify patient for the ticket ID $ticket_id");
        $photo_count = self::countPatientPhotos($patient_id);
        if($photo_count>=3) return DV::error("Cannot upload more than three photos");
        //Patient photo category is for example, "Before","After"
        $category = isset($d['category'])?$d['category']:'general';
        $file_ext = isset($d['file_type'])?$d['file_type']:$d['file_ext'];
        $res = PublicStorage::saveImage($branch_id,'patient',$file_ext,$d['photoData']);
        if($res->status==='OK'){
            $inputs = ['patient_id'=>$patient_id,'ticket_id'=>$ticket_id,'file_name'=>$res->file_name,'file_type'=>$file_ext,'category'=>$category];
            $new_photo_id = saveData($ss,'patient_photos',['id'=>null],$inputs,[],1);
            if ($new_photo_id > 0)
            {
                $image_url=PublicStorage::getUrl($branch_id,"patient","image").$res->file_name;
                //return new_image_id, new_image_url, image_urls
                return DV::success(['id'=>$new_photo_id,'new_image_url'=>$image_url,'image_urls'=>$this->getPatientPhotos($ticket_id,$ss)]);
            }
            return DV::error('Something went wrong saving image file');
        }
        return DV::error($res->error_message);      
    }

    //use ticket_id to retrieve patient's photos
    function getPatientPhotos($ticket_id =0,$ss=[]){
        $ticket_id = $ticket_id? $ticket_id:$this->getId();
        $ss = $ss? $ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $ticket = self::getProps($ticket_id,["id","client_id AS patient_id"]);
        if(!$ticket) return [];
        $patient_id = $ticket->patient_id;
        $rows = DB::table('patient_photos')->where('patient_id',$patient_id)->select("id","file_name","category")->orderBy("category","ASC")->get();
        foreach($rows as $row){
            $url = PublicStorage::getUrl($branch_id,'patient','image');
            $url .=$row->file_name;
            $row->image_url = $url;
        }
        return $rows;
    }

    function deletePatientPhoto($image_id,$ss){
       $branch_id = $ss->branch_id;
       $img = getDataRow("patient_photos",['id'=>$image_id],"ticket_id,file_name,category");
       if(!$img) return DV::error("Image ID is not valid"); 
       $ticket_id = $img->ticket_id;
       $file = PublicStorage::getDiskPath($branch_id,"patient","image").$img->file_name;
       $res = PublicStorage::deleteFile($file);
       DB::table('patient_photos')->where('id',$image_id)->where('branch_id',$branch_id)->delete();
       //return remaining list of photos for frontend to refresh phoho list
       return DV::success(['image_urls'=>$this->getPatientPhotos($ticket_id,$ss)]);
    }

    function getDetails($id=null,$ss= [],$include_cc=true,$include_vs=true,$include_mc=true){
        $id = $id? $id:$this->getId();
        $ss = $ss?$ss:$this->getUserInfo();
        return self::info($id,$ss,$include_cc,$include_vs,$include_mc);
    }

    function getVitalSigns($ticket_id=0,$ss=[]){
        $ticket_id = $ticket_id?$ticket_id:$this->getId();
        $ss = $ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        return self::vitalSigns($branch_id,$ticket_id);
    }

    static function chiefComplaints($branch_id,$ticket_id=0){
        //NOTE: table appt_chief_complaints does not have column "branch_id"
        return DB::table('appt_chief_complaints as ct')->join('chief_complaints as cc','cc.id','=','ct.chief_complaint_id')->where('ct.ticket_id',$ticket_id)->selectRaw("ct.id,cc.id AS chief_complaint_id,cc.name")->get();
    }
    function getChiefComplaints($ticket_id=null,$ss=null){
        $ss = $ss? $ss:$this->getUserInfo();
        $ticket_id = $ticket_id?$ticket_id:$this->getId();
        return self::chiefComplaints($ss->branch_id,$ticket_id);
    }

    //@param $d = ['ticket_id','chief_complaint_id']
    static function deleteChiefComplaint($d){
        $chief_complaint_id = $d['chief_complaint_id'] ;
        $ticket_id = $d['ticket_id']; 
        DB::table('appt_chief_complaints')->where('ticket_id',$ticket_id)->where('chief_complaint_id',$chief_complaint_id)->delete();
        return DV::success();
    }

    static function medicalConditions($branch_id,$ticket_id=0){
       $patient_id = self::patientId($branch_id,$ticket_id); 
       return DB::table('patient_medical_conditions AS pmc')->where('pmc.patient_id',$patient_id)->selectRaw("pmc.id,pmc.description,pmc.mc_value,pmc.display_order")->orderByRaw("pmc.display_order")->get(); 
    }

    function getMedicalConditions($ticket_id = null,$ss=[]){
      $ss = $ss?$ss:$this->getUserInfo();
      $ticket_id = $ticket_id?$ticket_id: $this->getId();  
      return self::medicalConditions($ss->branch_id,$ticket_id);
    }

    static function patientId($branch_id,$ticket_id){
      $rows = DB::table('tickets as s')->where('id',$ticket_id)->where('branch_id',$branch_id)->selectRaw('client_id')->take(1)->get();
      return isset($rows[0])? $rows[0]->client_id:null;
    }

    static function vitalSigns($branch_id,$ticket_id=0){
      return DB::table('patient_vital_signs as pvt')->where('pvt.branch_id',$branch_id)->where('pvt.ticket_id',$ticket_id)->selectRaw("pvt.id,vital_sign_id,vital_sign_value,pvt.description")->take(5)->get();
    }
     
    static function laboTests($branch_id,$ticket_id=0){
        return DB::table('patient_labo_tests as l')->join('medical_services as s','s.id','=','l.test_id')->where('l.branch_id',$branch_id)->where('l.ticket_id',$ticket_id)->selectRaw("l.id,l.test_id,l.labo_id,s.name,l.remarks,l.result_description,l.consultant_comments,l.test_date,l.result_date")->take(5)->get();
    }
    static function physicalExamination($branch_id,$ticket_id=0){
        return getDataValue('patient_consult_items',['ticket_id'=>$ticket_id,'branch_id'=>$branch_id,'item_type'=>'pe'],"description");
         
    }

    static function diagnosis($branch_id,$ticket_id=0){
        return getDataValue('patient_consult_items',['ticket_id'=>$ticket_id,'branch_id'=>$branch_id,'item_type'=>'diagnosis'],"description");
    }
    
    //Recommendations
    static function advice($branch_id,$ticket_id=0){
        return getDataValue('patient_consult_items',['ticket_id'=>$ticket_id,'branch_id'=>$branch_id,'item_type'=>'advice'],"description");
    }
    static function prescription($branch_id,$ticket_id=0){
        return DB::table('patient_prescribed_items as c')->join('patients as p','p.id','=','c.patient_id')->where('c.branch_id',$branch_id)->where('c.ticket_id',$ticket_id)->selectRaw("c.id,c.description,c.dosage,c.reason")->get();
    }
}
