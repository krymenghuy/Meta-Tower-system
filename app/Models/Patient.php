<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use Session;
use DB;
use App\Models\DV;
use App\Models\Person;
use App\Models\Lead;
use App\Models\ServiceQ\QTicket;

class Patient //extends Model
{
    //use HasFactory;
    protected static $default_official_id_prefix="P";
    protected static $official_id_length=5;
  
    static function personId($id){
      $rows = DB::table('patients')->where('id',$id)->selectRaw("person_id")->take(1)->get();
      return isset($rows[0])?$rows[0]->person_id:null;
    }

    static function getDataPropsBy($retrieve_by_fields = [], $select_cols="id",$conj ="AND"){
       $str_where="1=2";
       if($conj) $conj=" AND ";
       foreach($retrieve_by_fields as $field_name=>$value){
         $str_where .= ($str_where? $conj : "")." $field_name ='$value'";
       }
       $rows = DB::table('patients')->whereRaw($str_where)->selectRaw($select_cols)->take(1)->get();
      return isset($rows[0])? $rows[0] : null;
    }

    // public function saveQuietly(array $options = [])
    // {
    //     return static::withoutEvents(function () use ($options) {
    //         return $this->save($options);
    //     });
    // }
 
    protected static function saveVitalSigns($ss,$appt_id,$patient_id,$ticket_id=null,$vitalSigns =[]){
        $branch_id = $ss->branch_id;
        //Assume that the Vital sign's Check Time (check_time) is equal to booking time (created_at)
        //NOTE: $ticket_id is NOT empty when $addToQueue = true. (User Register patient and Add to Queue at the same time)
        DB::table('patient_vital_signs')->where('patient_id',$patient_id)->where('branch_id',$branch_id)->delete();
        foreach($vitalSigns as $item){
            $create_time = getNowTime();

            //Set default description to display_name of each vital sign
            $description=$item['display_name'];
            DB::table('patient_vital_signs')->insert([
                //"session_id"=>null,
                "branch_id"=>$branch_id,
                "patient_id"=>$patient_id,
                "appt_id"=>$appt_id,
                "ticket_id"=>$ticket_id,
                "vital_sign_id"=>$item['id'],
                "vital_sign_value"=>$item['value'],
                "description"=>$description,
                "check_time"=>$create_time,
                "created_at"=>$create_time,
                "create_uid"=>$ss->user_id,
                "create_user"=>$ss->full_name
            ]);
        }
    }

    //@param $mcs is array of medical conditions [{'id','name','value'},...]
    protected static function saveMedicalConditions($ss,$patient_id,$mcs =[]){
        $branch_id = $ss->branch_id;
        //Assume that the Vital sign's Check Time (check_time) is equal to booking time (created_at)

        foreach($mcs as $item){
            $create_time = getNowTime();

            //Set default description to display_name of each medical condition
            $description=$item['display_name'];
            DB::table('patient_medical_conditions')->where('patient_id',$patient_id)->where('branch_id',$branch_id)->delete();
            DB::table('patient_medical_conditions')->insert([
                //"session_id"=>null,
                "branch_id"=>$branch_id,
                "patient_id"=>$patient_id,
                "mc_item_id"=>$item['id'],
                "description"=>$description,
                "mc_value"=>$item['value'],
                "status"=>"Active",
                "observe_date"=>$create_time,
                "created_at"=>$create_time,
                "create_uid"=>$ss->user_id,
                "create_user"=>$ss->full_name
            ]);
        }
    }

    //Create a new patient profile.
    //@param $mc_items = [{'id':1,'name':'Allergy',value:1},...]
    //@param vital_signs = [{'id':1,'display_name':'Body temperature',value:37.5},...]
    //@param $appt_id is Appointment identifier that is available only when user register a patient profile from the Appointment list
    //@param array $d = ['appt_id'=>0,'person_id'=>0,'name'=>'','first_name','last_name', 'sex','date_of_birth','phone_number','email','address','national_id','has_membership_card'=>'0|1','vital_signs','mc_items'=>[]]
    static function register($req){
        $com_branch_id=1;
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        
        $d = $req->all();
        $addToQueue = isset($d['addToQueue'])?$d['addToQueue']:0;
        $appt_id = isset($d['appt_id'])?$d['appt_id']:0; //This one is currently not used
        $lead_id = isset($d['lead_id'])?$d['lead_id']:0; //This is needed to update field "appointments.client_id"
        $person_id = isset($d['person_id'])?$d['person_id']:null;
        $national_id = isset($d['national_id'])?$d['national_id']:null;
        $phone_number = isset($d['phone_number'])?$d['phone_number']:null;
        //$email = isset($d['email'])?$d['email']:null;

        //begin:: In case of AddingToQueue =1
            $department_id  =null;
            $consultant_id = null;
            if($addToQueue == 1){
                $department_id = isset($d['department_id'])? $d['department_id']:null;
                $consultant_id = isset($d['consultant_id'])? $d['consultant_id']:null;
                if(!$department_id) return DV::error("Servicing department is required for assigning patient to the waiting queue");
            }
       //end:: In case of AddingToQueue =1

        //NOTE: $person_id is always Overwritten here because method Person::quickInfo() will always find out person identity using phone number, nationality, or email
        $person = Person::detailsBy(['national_id'=>$national_id,'phone_number'=>$phone_number],"id,name,phone_number,email");
        if(!$person){
            $d['date_of_birth'] = convertDate($d['date_of_birth']);
            $x = Person::forceSave($d,$ss);
            if($x->status === 'Error') return DV::error($x->error_message);
            $person_id = $x->person_id;
        }else $person_id = $person->id;
         
        $patient_id = isset($d['id'])?$d['id']:0;
        if ($patient_id > 0) return DV::error("Patient identity $patient_id should not be given because you are attempting to register new patient profile");
        //If Person_id is supplied => use @person_id to get patient_id from "patients" table. NOTE. in patients table, there is unique (person_id,patient_id,[patient_code])
        if($person_id>0) $patient = self::getDataPropsBy(['branch_id'=>$branch_id,'person_id'=>$person_id],"id");
        if ($patient) $patient_id = $patient->id;
        //if(self::where("person_id",$person_id)->exists()) return DV::error("The person with phone number ? is already a patient::$phone_number"); 
        
        $new_patient_register = false;
        if (!$patient_id){
            $patient_id = saveData($ss,'patients',['id'=>0],['person_id'=>$person_id,'patient_type'=>'OPD','com_branch_id'=>$com_branch_id,'code'=>null,'remarks'=>null],[],1);
            $new_patient_register = true;
        }
        
        if ($patient_id > 0){
            //Set Patient Code / Official Patient ID
            if ($new_patient_register) $ff = setOfficialCode($branch_id,'patient_code_control','patients',['id'=>$patient_id],self::$default_official_id_prefix,self::$official_id_length);

            //In case user registers Client from Appointment view, there is appointment ID (appt_id) that can be used to update field "appointments.client_id to patient_id and appointments.client_type to 'client' "  
            if($lead_id > 0){
                DB::table('appointments')->where('branch_id',$branch_id)->where('lead_id',$lead_id)->update([
                    'client_id'=>$patient_id,
                    'client_name'=>$d['name'],
                    'client_sex'=>$d['sex'],
                    'client_phone_number'=>$d['phone_number'],
                    'status_id'=>($addToQueue? 3:2)
                ]);
            }

            // //Update person's name, phone_number, sex => to avoid difference in Name or phone between Appoinment View and Queued Ticket view
            // DB::table('persons')->where('branch_id',$branch_id)->where('id',$person_id)->update([
            //     'name'=>$d['name'],
            //     'sex'=>$d['sex'],
            //     'phone_number'=>$d['phone_number']
            // ]);

            //Save vital_sign items
            $medicalConditions = isset($d['mc_items'])?$d['mc_items']:[];
            $vital_signs = isset($d['vital_signs'])?$d['vital_signs']:[];
           
            //Save medical conditions such as Alergic, and other condition
            self::saveMedicalConditions($ss,$patient_id,$medicalConditions);

            $statusInfo = (object)['status'=>'Registered','status_id'=>2];  /** status_id => 0=Canceled, 1= Pending , 2 = Registered, 3=Queued, 4 = Served **/
            //register patient to Servicing department such as Cardiology, or Dermatology, or Heart Center
            $ticket = null;
            if ($addToQueue == 1){
                $ticket = new QTicket(null,$ss);
                $t_res = $ticket->create(['client_id'=>$patient_id,'department_id'=>$department_id,'consultant_id'=>$consultant_id]); 
                //Save patient's vital signs with Ticket ID
                self::saveVitalSigns($ss,$appt_id,$patient_id,$t_res->id,$vital_signs);
            }else{
                //save patient's vital signs without Ticket ID
                self::saveVitalSigns($ss,$appt_id,$patient_id,null,$vital_signs); 
            }

            return DV::success(['person_id'=>$person_id,'patient_id'=>$patient_id,'patient_code'=>$ff? $ff->code:null,'status_info'=>$statusInfo]);
        }else return DV::error('Something went wrong during saving patient data');

    }
    static function profilePhoto($patient_id){
        $row = getDataRow('patients',['id'=>$patient_id],'photo_file_name,branch_id');
        if(!$row) return null;
        $branch_id = $row->branch_id;
        return PublicStorage::getUrl($branch_id,'patient','image').$row->photo_file_name;
    }
    static function profileInfo($patient_id,$include_medical_history=false,$include_medication_details=false){
         $person_id = self::personId($patient_id);
         $cols="id as person_id,'NA' AS code,concat(last_name,' ',first_name) as name, first_name,last_name,sex,date_of_birth,phone_number,address,p.email,'Cambodian' AS nationality,0 AS height, 0 as weight, 0 AS age";
         $data = (object)[];
         $data->basic_info = Person::detailsBy(['id'=>$person_id],$cols);
         $data->basic_info->image_url = Patient::profilePhoto($patient_id);
         if($include_medical_history) $data->medical_history = self::medicalHistory($patient_id);
         if($include_medication_details) $data->include_medication_details = self::medicationDetails($patient_id);
         return $data;
    }

    static function latestTicket($patient_id){
      $rows = DB::table("tickets as t")->where('client_id',$patient_id)->select('id','ticket_number','created_at')->orderBy('t.id','DESC')->take(1)->get();
      return isset($rows[0])?$rows[0]:null; 
    }

    static function medicalHistory($patient_id){
      $last_ticket = self::latestTicket($patient_id);
      if(!$last_ticket) return [];
      $ticket_id = $last_ticket->id;
      return DB::table('patient_medical_history as h')->where('ticket_id',$ticket_id)->select('id','category','content','created_at')->get();
    }

    static function medicationDetails($patient_id){
        $last_ticket = self::latestTicket($patient_id);
        if(!$last_ticket) return [];
        $ticket_id = $last_ticket->id;
        return DB::table('patient_prescription_items as pi')->join('inv_items as itm','pi.item_id','=','itm.id')->where('pi.ticket_id',$ticket_id)->select('pi.id','pi.item_id','itm.code','itm.name','pi.sku','pi.qty','pi.usage','pi.duration_days','pi.remarks','reason','pi.created_at')->get();
    }
    // static function deletePermanent($req){
    //     $com_branch_id=1;
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return $ss; //user not authenticated
    //     $branch_id = $ss->branch_id;
    //     $id = $req->id;
    //     $x = self::where('branch_id',$branch_id)->where('id',$id)->delete(); 
    //     if ($x===1) return DV::success(['result'=>$x]);
    //     else return DV::error("No matching patient found for deleting!");
    // }

    //  //set patient code or patient official ID number
    //  function setFriendlyId($id,$branch_id=0,$len=5){
 
    // }

    static function findSimilar($req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $search_value = escape_like_str($req->search_value);

        $str_search="1=1";
        if($search_value) $str_search ="(p.phone_number ='$search_value' OR pt.code ='$search_value' OR concat(p.last_name,' ',p.first_name) LIKE '%$search_value%' OR p.national_id ='$search_value')";
        $cols ="pt.id,pt.code,p.id as person_id,concat(p.last_name,' ',p.first_name) AS name,p.sex, formatDate(pt.created_at) AS created_at,p.phone_number,p.email,p.address,pt.remarks,pt.create_user";
        $rows = DB::table("patients AS pt")->join('persons as p','p.id','=','pt.person_id')->where('pt.branch_id',$branch_id)->whereRaw($str_search)->selectRaw($cols)->orderByRaw("pt.created_at desc")->get();    
        return DV::result($rows);
    }
   
    //verify if the one of the given fields (Phone, national_id, email,) is true => then he or she is a client or patient
    //$retrieveFields is array of fields in table "persons" alias as "p" only
    static function verifyByFields($branch_id,$retrieveByFields=[]){
        $more_where =null;
        foreach($retrieveByFields as $field_name=>$value){
            if($value){
                $str = "p.$field_name ='$value'";
                $more_where .= ($more_where?" OR ":"").$str;
            }
        }
        if($more_where) return null;
        $more_where =$more_where?$more_where:"1=2";

        $cols ="pt.id";
        $rows =  DB::table('persons as p')->join('patients as pt','pt.person_id','=','p.id')->where('pt.branch_id',$branch_id)->whereRaw($more_where)->selectRaw($cols)->take(1)->get();
        return isset($rows[0]);
    }
 
    static function retrieveBy($branch_id,$retrieveByFields=[],$conj="OR"){
        $more_where =null;
        if(!$conj) $conj ="OR";
        foreach($retrieveByFields as $field_name=>$value){
            if($value){
                $str = "p.$field_name ='$value'";
                $more_where .= ($more_where?" $conj ":"").$str;
            }
        }
        if(!$more_where) return null;
        $more_where =$more_where?$more_where:"1=2";

        $cols ="pt.id,p.id as person_id,pt.code,concat(p.last_name,' ',p.first_name) as name,p.first_name,p.last_name,p.sex,p.phone_number,p.email,p.address,p.nationality_id,formatDate(date_of_Birth) as date_of_birth,cp_name,cp_phone_number,cp_email";
        $rows =  DB::table('persons as p')->join('patients as pt','pt.person_id','=','p.id')->where('pt.branch_id',$branch_id)->whereRaw($more_where)->selectRaw($cols)->take(1)->get();
        return isset($rows[0])?$rows[0]:null;
    }

    //returns details of one patient (including personal details and medical conditions)
    static function info($id){
        $more_where =null;
        $cols ="p.id,,concat(p.last_name,' ',p.first_name) as name,p.first_name,p.last_name,p.sex,p.phone_number,p.email,p.address,p.nationality_id,formatDate(date_of_Birth) as date_of_birth,cp_name,cp_phone_number,cp_email";
        $rows =  DB::table('persons as p')->join('patients as pt','pt.person_id','=','p.id')->where('pt.id',$id)->selectRaw($cols)->take(1)->get();
        foreach($rows as $row){
            $cols1 ="pmc.id,pmc.mc_value,pmc.description";
            $row->mc_items = DB::table("patient_medical_conditions as pmc")->where('patient_id',$id)->selectRaw($cols1)->take(1)->get();
            return $row;
        }
        return null;
    }

    //returns details of one patient's personal details. and does not include medical conditions
    static function quickInfo($id){
        $more_where =null;
        $cols ="p.id,concat(p.last_name,' ',p.first_name) as name, p.first_name,p.last_name,p.sex,p.phone_number,p.email,p.address,p.nationality_id,formatDate(date_of_Birth) as date_of_birth,cp_name,cp_phone_number,cp_email";
        $rows =  DB::table('persons as p')->join('patients as pt','pt.person_id','=','p.id')->where('pt.id',$id)->selectRaw($cols)->take(1)->get();
        return null;
    }

    static function list($req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $search_value = $req->search_value;
        $cols ="pt.id,pt.code,p.id as person_id,concat(p.last_name,' ',p.first_name) as name,p.sex, formatDate(pt.created_at) AS created_at,p.phone_number,p.email,p.address,pt.remarks,pt.create_user";
        $rows= DB::table("patients AS pt")->join('persons as p','p.id','=','pt.person_id')->where('pt.branch_id',$branch_id)->selectRaw($cols)->orderByRaw("pt.created_at desc")->get();  
        return DV::result($rows);
    }


     //Before and After photos
     //::photos() returns array of image_urls (last three photos or photos taken during the last consulting session) 
     static function photos($req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $patient_id = $req->patient_id;  
        $cols ="ph.file_name,ph.file_type,ph.create_user,ph.created_at";
        $rows = DB::table("patient_photos AS ph")->join('patients as pt','ph.patient_id','=','pt.id')->where('ph.patient_id',$patient_id)->where('pt.branch_id',$branch_id)->selectRaw($cols)->orderByRaw("ph.created_at desc")->take(3)->get();    
        foreach($rows as $row){
            $row->image_url = "";
        }
        return DV::result($rows);
    }
 
    //::history() returns array of medical reports by date and doctor's name 
    static function history($req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $search_value = escape_like_str($req->search_value);

       return DV::result([
        'medical_reports'=>[],
        'medical_history'=>null
       ]);
    }

    //::invoice() returns array of invoice info (number, date,amount)
    static function invoices($req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $search_value = escape_like_str($req->search_value);

        return DV::result([]);
    }

}
