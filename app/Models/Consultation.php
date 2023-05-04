<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;
// use App\Models\Prescription;
// use App\Models\VitalSign;
// use App\Models\MedicalHistory;
// use App\Models\Diagnosis;
// use App\Models\LaboTest;
// use App\Models\PE;
// use App\Models\Advice;
use App\Models\Inventory\Settings;
class Consultation //extends Model
{
    //use HasFactory;

    /*** @params: 
     *   $arr = ['chief_complaints'=>[],'vital_signs'=>[], 'medical_history'=>[], 'pe'=>string, labo_tests=>[], diagnosis => string, prescription=>[], advice=>string ] 
     *   chief_complaints = [{}]
     ***/
    protected $id = null;
    protected $userInfo = null;

    //NOTE that $id is ticket_id
   function __construct($id=null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;
   }

   function getUserInfo(){
    return $this->userInfo;
   }
   function getId(){
    return $this->id;
   }

   function getTicketId(){
    return $this->id;
   }
   
   static function ticketInfo($consult_id =0){
     $rows = DB::table('consultations AS c')->join('service_queue as q','q.id','=','c.ticket_id')->where('c.id',$id)->select('c.id AS consult_id, q.ticket_number, q.department_id,q.q_date, q.consultant_id, q.appt_id, q.person_id, q.status_id, q.client_id, q.priority')->take(1)->get();
   }

//    function save($d = [], $ss = null){
//        $ss = $ss? $ss: $this->getUserInfo();
//        $res = validateObject($d,[
//         'ticket_id'=>'1|positive',
//         'chief_complaints'=>'0|array',
//         'vital_signs'=>'0|array',
//         'medical_history'=>'0|array',
//         'prescription'=>'1|string|0-500',
//         'labo_tests'=>'0|array',
//         'diagnosis'=>'0|string',
//         'physical_examination'=>'0|string|0-500',
//         'advice'=>'0|string|0-500'
//        ]);

//        if ($res->error) return DV::error($res->error);
//        $ticket_id = isset($inputs['ticket_id'])?$inputs['ticket_id']:null;
//        if(!$ticket_id) return DV::error("Ticket ID is not valid");

//        $consult_id = saveData($ss,'consultations',['id'=>$consult_id],[],1);
//        if ($consult_id >0){
//             $this->saveChiefComplaints($inputs['chief_complaints'],$ticket_id,$ss);
//             $this->saveVitalSigns($inputs['vital_signs'],$ticket_id,$ss);
//             $this->saveMedicalHistory($inputs['medical_history'],$ticket_id,$ss);
//             $this->savePrescription($inputs['prescription'],$ticket_id,$ss);
//             $this->saveLaboTests($inputs['labo_tests'],$ticket_id,$ss);
//             $this->savePE($inputs['physical_examination'],$ticket_id,$ss);
//             $this->saveAdvice($inputs['advice'],$ticket_id,$ss);
//             return DV::success(['id'=>$consult_id]);
//        }
//        return DV::error('Failed to save consultation data');
//     }
    
    static function getPatientId($branch_id, $ticket_id){
        $rows = DB::table("tickets")->where('id',$ticket_id)->where('branch_id',$branch_id)->select("client_id as patient_id")->get();
        return isset($rows[0])?$rows[0]->patient_id:null;
    }
    
    function getChiefComplaints($ticket_id,$ss=null){
        $ss = $ss?$ss:$this->getUserInfo();
        return (object)[
          'cc_items'=>DB::table('appt_chief_complaints as ct')->join('chief_complaints as cc','cc.id','=','ct.chief_complaint_id')->where('ct.ticket_id',$ticket_id)->selectRaw("cc.id,ct.chief_complaint_id,cc.name")->get(),
          'chief_complaint_options'=>DB::table("chief_complaints")->where('branch_id',$ss->branch_id)->select('id','name as chief_complaint','code')->get()
        ];
    }

    static function laboTests($ticket_id,$ss){
        $branch_id = $ss->branch_id;
        $cols = ['t.id','s.id as test_id','t.labo_id','s.name as test_name','t.test_date','t.result_date','t.consultant_comments','t.result_description','t.remarks','t.file_name','t.file_type'];
        return DB::table('patient_labo_tests as t')->join('medical_services as s','s.id','=','t.test_id')->where('t.branch_id',$branch_id)->where('ticket_id',$ticket_id)->select($cols)->get();
    }
 
    function getLaboTestData($ticket_id=null,$ss=null){
        $ss = $ss?$ss:$this->getUserInfo();
        $ticket_id = $ticket_id?$ticket_id:$this->getId();
        $branch_id = $ss->branch_id;
        return (object)[
            'labo_test_options'=>DB::table('medical_services AS s')->join('test_labos as l','s.id','=','l.test_id')->where('s.branch_id',$branch_id)->select(['s.id as value','s.name as text'])->orderBy('s.name','ASC')->get(),
            'labo_options'=>DB::table('test_labos as l')->join('partners as p','p.id','=','l.labo_id')->where('p.branch_id',$branch_id)->select(['p.id as value','p.name as text'])->orderBy('p.name','ASC')->get(),
            'labo_tests'=>self::laboTests($ticket_id,$ss)
        ];
    }

    static function getVitalSignInfo($vs_id =0){
        $rows = DB::table("vital_signs")->where('id',$vs_id)->select("id","display_name as description")->take(1)->get();
        return isset($rows[0])?$rows[0]:null;
    }

    static function getChieComplaintInfo($cc_id =0){
       $rows = DB::table("chief_complaints")->where('id',$cc_id)->select("id","name as description","code")->take(1)->get();
       return isset($rows[0])?$rows[0]:null;
    }

    //todo: check $ticket_id is unexepceeted wrong value
    function saveVitalSigns($vital_sign_items =[],$ticket_id=null,$ss=null){
        $ticket_id = $ticket_id? $ticket_id:$this->getTicketId();
        $ss = $ss? $ss: $this->getUserInfo();
        $branch_id = $ss->branch_id;
        $patient_id = self::getPatientId($branch_id,$ticket_id);
        foreach($vital_sign_items as $a_item){
            $item = (object)$a_item;
            $vs_id = $item->vital_sign_id;
            $row = getDataRow('vital_signs',['id'=>$vs_id],"id,display_name as description");
            if($row){
                $description = $row->description;
                $existing = $item->id > 0;
                $existing_updated = false;
                if($existing){
                    $existing_updated = DB::table('patient_vital_signs')->where('ticket_id',$item->ticket_id)->where('vital_sign_id',$vs_id)->update([
                        'vital_sign_value'=>$item->observed_value,
                        'description'=>$description,
                        'update_user'=>$ss->full_name,
                        'update_uid'=>$ss->user_id,
                        'updated_at'=> getNowTime()
                    ]);
                }
                if(!$existing_updated){
                    saveData($ss,'patient_vital_signs',['id'=>null],['ticket_id'=>$item->ticket_id,'vital_sign_id'=>$item->vital_sign_id,'patient_id'=>$patient_id,'vital_sign_value'=>$item->observed_value,'description'=>$description],[],1);
                } 
                
            }  
        }
        return DV::success(['vital_signs'=>$this->getVitalSigns($ticket_id,$ss)]);
    }

    //todo: check $ticket_id is unexepceeted wrong value
    //Used ob ConsultDialog to save one vital sign at a time as doctor's change value of patient's vital sign
    function saveVitalSignOne($vital_sign_item=[],$ticket_id=null,$ss=null){
        $ticket_id = $ticket_id? $ticket_id:$this->getTicketId();
        $ss = $ss? $ss: $this->getUserInfo();
        $branch_id = $ss->branch_id;
        $patient_id = self::getPatientId($branch_id,$ticket_id);

            $item = (object)$vital_sign_item;
            $vs_id = $item->vital_sign_id;
            $row = getDataRow('vital_signs',['id'=>$vs_id],"id,display_name as description");
            if($row){
                $description = $row->description;
                $existing = $item->id > 0;
                $existing_updated = false;
                $id = $item->id;
                if($existing){
                    $existing_updated = DB::table('patient_vital_signs')->where('ticket_id',$item->ticket_id)->where('vital_sign_id',$vs_id)->update([
                        'vital_sign_value'=>$item->observed_value,
                        'description'=>$description,
                        'update_user'=>$ss->full_name,
                        'update_uid'=>$ss->user_id,
                        'updated_at'=> getNowTime()
                    ]);
                }
                if(!$existing_updated){
                    $id = saveData($ss,'patient_vital_signs',['id'=>null],['ticket_id'=>$item->ticket_id,'vital_sign_id'=>$item->vital_sign_id,'patient_id'=>$patient_id,'vital_sign_value'=>$item->observed_value,'description'=>$description],[],1); 
                } 
                return DV::depends($id,['id'=>$id],"Failed to save patient vital sign");
            }
            return DV::error("Failed to save patient vital sign because of unidentifiable vital sign ID");
       
    }

    //saveChiefComplaint() saves one chief complaint at a time. It returns NULL if no error, and returns error message if error
    //$id is the combined key of ($cc_id,$ticket_id). $id is used in case, user select new Chief complaint to replace the old one
    function saveChiefComplaint($id,$cc_id,$ticket_id=null,$ss=null){
      $ticket_id = $ticket_id? $ticket_id:$this->getTicketId();
      $ss = $ss? $ss: $this->getUserInfo();
      $appt_id = null;
      $row = getDataRow('tickets',['id'=>$ticket_id],"appt_id");
      if($row) $appt_id = $row->appt_id;
      //return "ticket $id $cc_id  $ticket_id "; 
      $row = getDataRow('chief_complaints',['id'=>$cc_id],"id,name AS description");
      if(!$row) return "Chief complaint id is not correct!";
      $description = $row->description;
      $inputs =[
        'appt_id'=>$appt_id,
        'ticket_id'=>$ticket_id,
        'chief_complaint_id'=>$cc_id,
        'description'=>$description
        ];
        if ($id > 0) DB::table('appt_chief_complaints')->where('id',$id)->update($inputs);
        else{
            $inputs['create_uid'] = $ss->user_id;
            $inputs['create_user'] = $ss->full_name;
            $inputs['created_at'] = getNowTime();
            DB::table('appt_chief_complaints')->insert($inputs);
        }
        //$new_id = saveData($ss,'appt_chief_complaints',['id'=>$id],$inputs,[],0);
        return null;

        //   $x = DB::table('appt_chief_complaints')->where('ticket_id',$ticket_id)->where('chief_complaint_id',$cc_id)->update(['description'=>$description]);
        //   if (!$x)
        //     {
            
        //     } else return null;
    }
    
    function deleteChiefComplaint($id =null){
        DB::table('appt_chief_complaints')->where('id',$id)->delete();
        return null;
    }

    function removeServiceItem($id,$ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        DB::table('patient_services')->where('id',$id)->where('ticket_id',$ticket_id)->delete();
        return null;
    }

    function saveServiceItem($item=[],$ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss? $ss: $this->getUserInfo();
        $res = validateObject($item,['id'=>'0|number|identity=1','service_id'=>'1|number|exists=medical_services.id','qty'=>'0|number|default=1','sku'=>'0|string|default=none','remarks'=>'0|string|0-150','doctor_id'=>'0|number|exists=employees.id','first_nurse_id'=>'0|number|exists=employees.id'],true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $id = $res->id;
        $inputs = $res->values;
        //important to add ticket_id
        $inputs['ticket_id'] = $ticket_id;
        $inputs['patient_id'] = self::getPatientId($ss->branch_id,$ticket_id);
        $service_id = $inputs['service_id'];
        $serviceInfo = self::serviceInfo($service_id,"price");
        if(!$serviceInfo) return DV::error("Service $service_id is not valid");
        $inputs['price'] = $serviceInfo->price; 
        $id = saveData($ss,'patient_services',['id'=>$id],$inputs,[],1);
        if($id>0) return DV::success(['id'=>$id]);
        return DV::error("Something went wrong saving patient service");
    }

    function getComoItems_service($ss){
      return DB::table('medical_services as s')->where('branch_id',$ss->branch_id)->select(['id','name as service_name'])->orderBy('s.name','ASC')->get();
    }

    function getComoItems_emp($ss){
        return DB::table('persons as p')->join('employees as e','e.person_id','=','p.id')->where('e.branch_id',$ss->branch_id)->select(['e.id','e.code',DB::raw("CONCAT(p.last_name,' ',p.first_name) AS staff_name")])->orderBy('staff_name','ASC')->get();
    }

    function getServiceDetails($ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss? $ss: $this->getUserInfo();
        $cols = ['ps.id','ps.patient_id','ps.service_id','ps.qty','ps.sku','ps.remarks','ps.doctor_id','ps.first_nurse_id','second_nurse_id','ps.created_at','ps.create_user'];
        
        //Get service options for Dropdown list
        $options= $this->getComoItems_service($ss);
        $options_service =[];
        foreach($options as $i){
            $options_service[] = (object)['value'=>$i->id,'text'=>$i->service_name];
        }

        //Get staff list options for "Performed by" drop-down list
        $options= $this->getComoItems_emp($ss);
        $options_emp =[];
        foreach($options as $i){
            $options_emp[] = (object)['value'=>$i->id,'text'=>$i->staff_name?$i->staff_name:'(No name)'];
        }

        return (object)[
            'options_service'=>$options_service,
            'options_emp'=>$options_emp,
            'options_nurse'=>$options_emp,
            'items'=>DB::table('patient_services as ps')->where('ps.ticket_id',$ticket_id)->select($cols)->get(),
            //'headerInfo'=>null
         ];
    }


    //getAssignedServices()
    function getPrescribedServices($ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss? $ss: $this->getUserInfo();
        $branch_id = $ss->branch_id;
        $cols = ['ps.id','ps.patient_id','ps.service_id','ps.qty','ps.sku','ps.remarks','ps.emp_id','ps.created_at','ps.create_user','price'];
        return DB::table('patient_services as ps')->where('ps.ticket_id',$ticket_id)->where('ps.branch_id',$branch_id)->select($cols)->get(); 
    }

    function removePrescriptionItem($id,$ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        DB::table('patient_prescription_items')->where('id',$id)->where('ticket_id',$ticket_id)->delete();
        return null;
    }
    function savePrescriptionItem($item=[],$ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss? $ss: $this->getUserInfo();
        $patient_id = self::getPatientId($ss->branch_id,$ticket_id);
        $res = validateObject($item,['id'=>'0|number|identity=1','item_id'=>'1|number|exists=inv_items.id','qty'=>'1|number','sku'=>'1|string','usage'=>'0|string|0-150','duration_days'=>'0|number','reason'=>'0|string|0-200'],true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $id = $res->id;
        $inputs = $res->values;
        $item_id = $inputs['item_id'];
        //important to add ticket_id
        $inputs['ticket_id'] = $ticket_id;
        $itemInfo = self::itemInfo($item_id,"selling_price,ws_selling_price");
        if(!$itemInfo) return DV::error("Item $item_id is not valid!"); 
        $inputs['price'] = $itemInfo->selling_price;
        $inputs['patient_id'] = $patient_id;
        $id = saveData($ss,'patient_prescription_items',['id'=>$id],$inputs,[],1);
        if($id>0) return DV::success(['id'=>$id]);
        return DV::error("Something went wrong saving prescription item");
    }

    function getPrescription($ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss? $ss: $this->getUserInfo();
        $cols = ['pi.id','pi.item_id','pi.qty','pi.sku','pi.duration_days','pi.usage','pi.reason','pi.remarks','pi.created_at','pi.create_user'];
        $options_product= Settings::options_product($ss);
        $options =[];
        foreach($options_product as $i){
            $options[] = (object)['value'=>$i->id,'text'=>$i->name];
        }
        return (object)[
            'options_product'=>$options,
            'items'=>DB::table('patient_prescription_items as pi')->where('pi.ticket_id',$ticket_id)->select($cols)->get(),
            //'headerInfo'=>null
         ];
    }
     
    function getPrescribedItems($ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss? $ss: $this->getUserInfo();
        $cols = ['pi.id','pi.item_id','pi.qty','pi.sku','pi.duration_days','pi.usage','pi.reason','pi.remarks','pi.created_at','pi.create_user','price'];
        return DB::table('patient_prescription_items as pi')->where('pi.ticket_id',$ticket_id)->select($cols)->get();
    }

    //save many chiefComplaints. $items = [{cc_id,description},{cc_id,description},...]
    function saveChiefComplaints($items=[],$ticket_id=null,$ss=null){
        $patient_id = self::getPatientId($ss->branch_id,$ticket_id);
        $errors = [];
        $error_count =0;
        foreach($items as $arr_item){
            $item = (object)$arr_item;
            $err = $this->saveChiefComplaint($item->cc_id,$ticket_id,$ss);
            if($err){
                $error_count++;
                $errors[] = $err;
            }
        }
        return DV::success(['error_count'=>$error_count,'errors'=>$errors]);
    }
    
    function getMedicalHistory($ticket_id=null,$ss=null){
      $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
      $ss = $ss?$ss:$this->getUserInfo();
      $rows = DB::table('patient_medical_history as h')->where('h.ticket_id',$ticket_id)->select('h.id','h.category','h.content')->get();
      $data =[];
      foreach($rows as $row){
        $data[$row->category] = $row->content; 
      }
      return (object)$data;
    }

    //Medical history is array of items [{category,content},{category,content},{...}]
    function saveMedicalHistory($items=[],$ticket_id=null,$ss=null){
        foreach($items as $item){
            //$item = (object)$arr_item;
            $category = $item['category'];
            $content = $item['content'];
            if($content && $category){
                $inputs= [
                    'ticket_id'=>$ticket_id,
                    'content'=>$content,
                    'category'=>$category
                ];
                $x = DB::table('patient_medical_history')->where('ticket_id',$ticket_id)->where('category',$category)->update(['content'=>$content,'update_user'=>$ss->full_name,'updated_at'=>getNowTime()]);
                if(!$x) saveData($ss,'patient_medical_history',['id'=>null],$inputs,[],1);
            }
        }
        return DV::success(); 
    }

    //savePhysicalExamination()
    function savePE($items,$ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss?$ss:$this->getUserInfo();
        $patient_id = self::getPatientId($ss->branch_id,$ticket_id);
        foreach($items as $item){
            $category = $item['category'];
            $content = $item['content'];
            if($content){
                $inputs= [
                    'patient_id'=>$patient_id,
                    'ticket_id'=>$ticket_id,
                    'content'=>$content,
                    'category'=>$category,
                    'update_uid'=>$ss->user_id,
                    'updated_at'=>getNowTime(),
                    'update_user'=>$ss->full_name
                ];
                $x = DB::table("patient_pe")->where('ticket_id',$ticket_id)->where('category',$category)->update($inputs);
                if(!$x) saveData($ss,'patient_pe',['id'=>null],$inputs,[],1);
            }
           
        }
        return null; 
    }
    
    //returns array of pe items. pe-items => [{category,content},...]
    function getPE($ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss? $ss : $this->getUserInfo();  
        return [getDataRow('patient_pe',['ticket_id'=>$ticket_id,'category'=>'General'],"category,content")];
    }

    function saveDiagnosis($items,$ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss?$ss:$this->getUserInfo();
        $patient_id = self::getPatientId($ss->branch_id,$ticket_id);
        foreach($items as $item){
            $category = isset($item['category'])?$item['category']:'General';
            $content = $item['content'];
            if($content){
                $inputs= [
                    'consult_date'=>getNowTime(), 
                    'ticket_id'=>$ticket_id,
                    'patient_id'=>$patient_id,
                    'content'=>$content,
                    'category'=>$category,
                    'update_uid'=>$ss->user_id,
                    'updated_at'=>getNowTime(),
                    'update_user'=>$ss->full_name
                ];
                $x = DB::table("patient_diagnosis")->where('ticket_id',$ticket_id)->where('category',$category)->update($inputs);
                if(!$x) saveData($ss,'patient_diagnosis',['id'=>null],$inputs,[],1);
            }
           
        }
        return null; 
    }
    
    //returns array of diagnosis items. items => [{category,content},...]. There can be Primary diagnosis or secondary dianosis
    function getDiagnosis($ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss? $ss : $this->getUserInfo();  
       return [getDataRow('patient_diagnosis',['ticket_id'=>$ticket_id,'category'=>'General'],"category,content")];
    }

    function getFollowups($ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss? $ss : $this->getUserInfo();  
       return (object)[
        'followup_status_id'=>1,
        'followup_remarks'=>'Some remarks about this followup', /** for doctor himself or other doctor who would meet this patient this case to see **/
        'consultant_id'=>null,
        //Each appointment = {arrival_date,arrival_time,consultant_id,remarks,appt_type='followup'}
        'appointments'=>[]
       ];
    }
    
    
    function saveAdvice($items,$ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss?$ss:$this->getUserInfo();
        $patient_id = self::getPatientId($ss->branch_id,$ticket_id);
        foreach($items as $item){
            $category = isset($item['category'])?$item['category']:'General';
            $content = $item['content'];
            if($content){
                $inputs= [
                    'ticket_id'=>$ticket_id,
                    'patient_id'=>$patient_id,
                    'content'=>$content,
                    'category'=>$category,
                    'update_uid'=>$ss->user_id,
                    'updated_at'=>getNowTime(),
                    'update_user'=>$ss->full_name
                ];
                $x = DB::table("patient_advice")->where('ticket_id',$ticket_id)->where('category',$category)->update($inputs);
                if(!$x) saveData($ss,'patient_advice',['id'=>null],$inputs,[],1);
            }
           
        }
        return null; 
    }
    
    function getAdvice($ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss? $ss : $this->getUserInfo();  
       return [getDataRow('patient_advice',['ticket_id'=>$ticket_id,'category'=>'General'],"category,content")];
    }

    //getTestInfo()  return info about services, and labo test
    static function serviceInfo($service_id,$cols =null){
        $cols = $cols?$cols:"price";
        return getDataRow('medical_services',['id'=>$service_id],$cols);
    }
    static function itemInfo($item_id,$cols =null){
        $cols = $cols?$cols:"selling_price,cost,ws_selling_price";
        return getDataRow('inv_items',['id'=>$item_id],$cols);
    }

    //save one labo test at a time
    function saveLaboTest($test,$ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss? $ss : $this->getUserInfo();
        $res = validateObject($test,['id'=>'0|number|identity=1','test_id'=>'1|number|exists=medical_services.id|text=Test ID is not valid','labo_id'=>'1|number|exists=partners.id|text=Labo ID does not exist','remarks'=>'0|string|0-150'],true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $id = $res->id;
        $patient_id = self::getPatientId($ss->branch_id,$ticket_id);
        if(!$patient_id) return DV::error('Failed to identify patient given the ticket ID');
        $test_id = $test['test_id']; //Not "id", but test_id, where id refers to Primary key in table "patient_labo_tests"
        $testInfo = self::serviceInfo($test_id,"price");
        if(!$testInfo) 
        return DV::error("Test ID $test_id is not valid");
        $price = isset($testInfo->price)?$testInfo->price: (isset($testInfo->selling_price)?$testInfo->selling_price:0);
        $inputs['patient_id']=$patient_id;
        $inputs['ticket_id']=$ticket_id;
        $inputs['price'] = $price?$price:0;
        $id = saveData($ss,'patient_labo_tests',['id'=>$id],$inputs,[],1);
        if ($id>0) return DV::success(['id'=>$id]);
        return DV::error("Somethign went wrong saving patient labo test");
    }
 
    // function saveLaboTests($tests,$ticket_id=null,$ss=null){
    //     $errors = [];
    //     foreach($tests as $test){
    //         $res = $this->saveLaboTest($test,$ticket_id,$ss);
    //         if($res->status ==='Error') $errors[] = $res->error_message;
    //     }
    //     return null;
    // }

    function removeLaboTest($id,$ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss? $ss : $this->getUserInfo();
        DB::table('patient_labo_tests')->where('id',$id)->where('ticket_id',$ticket_id)->delete();
        return null;
    }

    function getLaboTests($ticket_id=null,$ss=null){
        $ticket_id = $ticket_id?$ticket_id:$this->getTicketId();
        $ss = $ss? $ss : $this->getUserInfo();
        $branch_id = $ss->branch_id;
        $cols = ['t.id','t.test_id','s.name','t.labo_id','t.result_date','t.test_date','t.file_name','file_type','t.created_at','t.create_user','t.consultant_comments','t.result_description','t.remarks','t.price'];
        return DB::table('patient_labo_tests AS t')->join('medical_services as s','s.id','=','t.test_id')->where('ticket_id',$ticket_id)->where('service_type','labo')->where('t.branch_id',$branch_id)->select($cols)->orderBy('s.name','ASC')->get();
    }
    
    function getDefaultLabo($test_id){
      $rows = DB::table('test_labos as l')
      ->join('partners as p','p.id','=','l.labo_id')
      ->where('l.test_id',$test_id)
      ->select(['p.id','p.name'])
      ->orderBy('prefer_rank','ASC')
      ->take(1)->get();
      return isset($rows[0])? $rows[0]:null;
    }

    function getLaboTestInfo($test_id){
       $cols =['s.id','s.name','s.price','s.description','sku'];
       $rows = DB::table('medical_services as s')->where('id',$test_id)->where('s.service_type','labo')->select($cols)->take(1)->get();
       foreach($rows as $row){
         $labo = $this->getDefaultLabo($test_id);
         $row->default_labo_id = $labo->id;
         $row->default_labo_name = $labo->name;
         return $row;
       } 
       return null;
    }

    //@params $d = ['id'=>0,'consultant_id'=>number, 'issue_date'=>date, 'items'=>[]]
    static function savePrescription($ss,$d,$ticket_id){
      $d ['ticket_id'] = $ticket_id;
      $validate_rule = [
        "id"=>"0|identity=1",
        "ticket_id"=>"1|exists=service_queue.id|text=Ticket ID is not valid",
        "issue_date"=>"1|date",
        "consultant_id"=>"1|positive|exists=employees.id|text=Consultant identity is not valid",
        "items"=>"1|array"
       ];

      $res = validateObject($d,$validate_rule,true,[],$ss->lang,false,null);
      if($res->error) return DV::error($res->error);
      $inputs = $res->values;
      $id = saveData($ss,"prescriptions",['id'=>$id],$inputs,[],1);
      if($id>0){
         //save prescription items
         $items = $res['items'];
         $cnt = 0;
         foreach($items as $item){
             $t_id = isset($item['id'])?$item['id']:0;
             $dur_days = isset($item['duration'])?$item['duration']:0;
             $dur_unit = isset($item['duration_unit'])?$item['duration_unit']:'day';
             $itemInfo = self::itemInfo($t_id,"price");
             if($itemInfo){
                saveData($ss,"patient_prescription_items",['id'=>$t_id],[
                    'ticket_id'=>$ticket_id,
                    'prescription_id'=>$id,
                    'item_id'=>$item['item_id'],
                    'qty'=>$item['qty'],
                    'price'=>$itemInfo->price,
                    'usage'=>$item['usage'],
                    'duration_unit'=>$dur_unit, //"day"
                    'duration'=>$dur_days, //15
                    'reason'=>$item['reason'],
                    'remarks'=>$item['remarks']
                 ],[],1);
             }
             
             $cnt++;
         }

         return DV::success(["id"=>$id,"item_count"=>$cnt]);
      }
      return DV::error("Something went wrong during saving prescription");
    }
  
    static function getStoreValue_vt($values,$vs_id){
        foreach($values as $vs) if($vs->vital_sign_id ===$vs_id) return $vs->vital_sign_value;
        return null;
    }
    function getVitalSigns($id=null,$ss=null){
        $branch_id = $ss->branch_id;
        $rows = DB::table('vital_signs as v')->where('branch_id',$branch_id)->selectRaw("'' AS id,v.id AS vital_sign_id,'' AS vital_sign_value, v.display_name as description")->take(5)->get();
        $values =  DB::table('patient_vital_signs as pvt')->where('pvt.branch_id',$branch_id)->where('pvt.ticket_id',$id)->selectRaw("pvt.id,vital_sign_id,vital_sign_value,pvt.description")->get();
        foreach($rows as $row){
           $row->vital_sign_value = self::getStoreValue_vt($values,$row->vital_sign_id);
        }    
        return $rows;
    }
  
    function getDetails($id=null,$ss=null){
      $id = $id?$id:$this->getId();
      $ss = $ss?$ss:$this->getUserInfo();
      $items= $this->getPE($id,$ss);
      $pe="";
      foreach($items as $i) $pe = $i?$i->content:'គ្មាន';
      $dia = "";
      $items = $this->getDiagnosis($id,$ss);
      foreach($items as $i) $dia = $i?$i->content:'គ្មាន';

      $advice="";
      $items = $this->getAdvice($id,$ss);
      foreach($items as $i) $advice = $i?$i->content:'គ្មាន';

      return (object)[
        'chief_complaints'=>$this->getChiefComplaints($id,$ss),
        'vital_signs'=>$this->getVitalSigns($id,$ss),
        'medical_history'=>$this->getMedicalHistory($id,$ss),
        'pe'=>$pe,
        'labo_tests'=>$this->getLaboTests($id,$ss),
        'diagnosis'=>$dia,
        'prescription'=>$this->getPrescription($id,$ss),
        'services'=>$this->getServiceDetails($id,$ss),
        'advice'=>$advice
      ];
    }
    // function delete($id,$id=null,$ss=null){
    //      //DB::table('appt_chief_complaints')->delete('ticket_id',$ticket_id);
    //      DB::table('ticket_vital_signs')->delete('ticket_id',$ticket_id);
    //      DB::table('patient_pe')->delete('ticket_id',$ticket_id);
    //      DB::table('patient_labo_tests')->delete('ticket_id',$ticket_id);
    //      DB::table('prescription_items')->delete('ticket_id',$ticket_id);
    //      DB::table('prescriptions')->delete('ticket_id',$ticket_id);
    //      DB::table('patient_services')->delete('ticket_id',$ticket_id);
    //      DB::table('patient_advice')->delete('ticket_id',$ticket_id);
    //      DB::table('patient_diagnosis')->delete('ticket_id',$ticket_id);
    //      //1= Waiting, 2 = Serving, 3 = Closed
    //      //DB::table('tickets')->where('id',$ticket_id)->update(['status_id'=>2]);
    //      return DV::success();
    // }
 
    static function findById($ss,$id){

    }
}
