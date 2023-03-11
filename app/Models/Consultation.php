<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;
// use App\Models\Prescription;
// use App\Models\VitalSign;
// use App\Models\MedicalHistory;
// use App\Models\Diagnosis;
// use App\Models\LaboTest;
// use App\Models\PE;
// use App\Models\Advice;
// use App\Models\MedicalReport;

class Consultation extends Model
{
    use HasFactory;

    /*** @params: 
     *   $arr = ['chief_complaints'=>[],'vital_signs'=>[], 'medical_history'=>[], 'pe'=>string, labo_tests=>[], diagnosis => string, prescription=>[], advice=>string ] 
     *   chief_complaints = [{}]
     ***/
    protected $id = null;
    protected $userInfo = null;

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

   function getTicketId($id){
     $rows = DB::table('consultations AS c')->where('id',$id)->select('ticket_id')->take(1)->get();
     return isset($rows[0])? $rows[0]->ticket_id: null; 
   }
   
   static function ticketInfo($consult_id =0){
     $rows = DB::table('consultations AS c')->join('service_queue as q','q.id','=','c.ticket_id')->where('c.id',$id)->select('c.id AS consult_id, q.ticket_number, q.department_id,q.q_date, q.consultant_id, q.appt_id, q.person_id, q.status_id, q.client_id, q.priority')->take(1)->get();
   }

   function save($d = [], $ss = null){
       $ss = $ss? $ss: $this->getUserInfo();
       $res = validateObject($d,[
        'ticket_id'=>'1|positive',
        'chief_complaints'=>'0|array',
        'vital_signs'=>'0|array',
         'medical_history'=>'0|array',
        'prescription'=>'1|string|0-500',
        'labo_tests'=>'0|array',
        'diagnosis'=>'0|string',
        'physical_examination'=>'0|string|0-500',
        'advice'=>'0|string|0-500'
       ]);

       if ($res->error) return DV::error($res->error);
       $ticket_id = isset($inputs['ticket_id'])?$inputs['ticket_id']:null;
       if(!$ticket_id) return DV::error("Ticket ID is not valid");

       $consult_id = saveData($ss,'consultations',['id'=>$consult_id],[],1);
       if ($consult_id >0){
            $this->saveChiefComplaints($inputs['chief_complaints'],$ticket_id,$ss);
            $this->saveVitalSigns($inputs['vital_signs'],$ticket_id,$ss);
            $this->saveMedicalHistory($inputs['medical_history'],$ticket_id,$ss);
            $this->savePrescription($inputs['prescription'],$ticket_id,$ss);
            $this->saveLaboTests($inputs['labo_tests'],$ticket_id,$ss);
            $this->savePE($inputs['physical_examination'],$ticket_id,$ss);
            $this->saveAdvice($inputs['advice'],$ticket_id,$ss);
            return DV::success(['id'=>$consult_id]);
       }
       return DV::error('Failed to save consultation data');
    }

    static function getPatientId($branch_id, $ticket_id){
        $rows = DB::table("service_queue")->where('id',$ticket_id)->where('branch_id',$branch_id)->select("client_id as patient_id")->get();
        return isset($rows[0])?$rows[0]->patient_id:null;
    }
    
    function getChiefComplaints($ticket_id,$ss=null){
        $ss = $ss?$ss:$this->getUserInfo();
        return (object)[
          'cc_items'=>DB::table('appt_chief_complaints as ct')->join('chief_complaints as cc','cc.id','=','ct.chief_complaint_id')->where('ct.ticket_id',$ticket_id)->selectRaw("cc.id,cc.name")->get(),
          'chief_complaint_options'=>DB::table("chief_complaints")->where('branch_id',$ss->branch_id)->select('id','name as chief_complaint','code')->get()
        ];
    }

    static function laboTests($ticket_id,$ss){
        $branch_id = $ss->branch_id;
        $cols = ['s.id as test_id','s.name as test_name','t.test_date','t.result_date','t.consultant_comments','t.result_description','t.file_name','t.file_type'];
        return DB::table('patient_labo_tests as t')->join('medical_services as s','s.id','=','t.test_id')->where('t.branch_id',$branch_id)->where('ticket_id',$ticket_id)->select($cols)->get();
    }

    function getLaboTests($ticket_id,$ss=null){
        $ticket_id =$ticket_id? $ticket_id:$this->getId();
        $ss = $ss?$ss:$this->getUserInfo();
        return self::laboTests($ticket_id,$ss); 
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

    function saveVitalSigns($vital_sign_items =[],$ticket_id=null,$ss=null){
        $ticket_id = $ticket_id? $ticket_id:$this->getTicketId();
        $ss = $ss? $ss: $this->getUserInfo();
        foreach($vital_sign_items as $a_item){
            $item = (object)$a_item;
            $row = getDataRow('vital_signs',['id'=>$item->id],"id,display_name as description");
            if($row){
                DB::table('patient_vital_signs')->where('ticket_id',$ticket_id)->where('vital_sign_id',$item->id)->delete();
                saveData($ss,'patient_vital_signs',['id'=>null],['ticket_id'=>$ticket_id,'vital_sign_id'=>$item->id],[],1);
            }  
        }
        return DV::success();
    }

    function saveChiefComplaint($cc_id,$ticket_id=null,$ss=null){
      $ticket_id = $ticket_id? $ticket_id:$this->getTicketId();
      $ss = $ss? $ss: $this->getUserInfo();
      $row = getDataRow('chief_complaints',['id'=>$cc_id],"id");
      if(!$row) return DV::error("Chief complaint id is not correct!");
      DB::table('appt_chief_complaints')->where('ticket_id',$ticket_id)->where('chief_complaint_id',$cc_id)->delete();
      $inputs =[
        'chief_complaint_id'=>$cc_id,
        'ticket_id'=>$ticket_id
      ];
      saveData($ss,'appt_chief_complaints',['id'=>null],$inputs,[],1);
      return DV::success();
    }

    static function saveChiefComplaints($ss,$ticket_id,$items=[]){
        $patient_id = self::getPatientId($ss->branch_id,$ticket_id);
        $cnt =0;
        foreach($items as $x){
            $cc_id = $x['id'];
            $item = self::getChieComplaintInfo($cc_id);
            if($item){
                $inputs= [
                    'ticket_id'=>$ticket_id,
                    'chief_complaint_id'=>$cc_id,
                    'description'=>$item->description
                    //,'category'=>$item->category
                ];
                $id = saveData($ss,'appt_chief_complaints',["ticket_id"=>":ticket_id","chief_complaint_id"=>$cc_id],$inputs,[],1,true);
                $cnt++;
            } 
          
        }
        return DV::success();
    }

    // static function saveVitalSigns($ss,$items,$ticket_id){
    //     $patient_id = self::getPatientId($ss->branch_id,$ticket_id);
    //     $cnt =0;
    //     $patient_id = self::getPatientId($ss->branch_id,$ticket_id);
    //     foreach($items as $x){
    //         $vs_id = isset($x['id'])?$x['id']:0;
    //         $item = self::getVitalSignInfo($vs_id);
    //         if($item){
    //             $inputs= [
    //                 'ticket_id'=>$ticket_id,
    //                 'patient_id'=>$patient_id,
    //                 'description'=>$item->description,
    //                 'category'=>$item->category,
    //                 'observed_value'=>$x['observed_value']
    //             ];
    //             $id = saveData($ss,'consult_vital_signs',['ticket_id'=>$ticket_id,'vs_id'=>$vs_id],$inputs,[],1,true);
    //             $cn++;
    //         }
    //     }
    //     return DV::success(); 
    // }


    static function saveDiagnosis($items =[],$ticket_id=null,$ss=null){
        foreach($items as $a_item){
            $item = (object)$a_item;
            $inputs= [
                'ticket_id'=>$ticket_id,
                'content'=>$item->content,
                'category'=>$item->category
            ];
            $id = saveData($ss,'patient_diagnosis',$inputs,[],1);
        }
        return DV::success(); 
    }
 
    //Medical history is array of items [{category,content},{category,content},{...}]
    function saveMedicalHistory($items=[],$ticket_id=null,$ss=null){
        foreach($items as $arr_item){
            $item = (object)$arr_item;
            $inputs= [
                'ticket_id'=>$ticket_id,
                'content'=>$item->content,
                'category'=>$item->category
            ];
            $id = saveData($ss,'patient_medical_history',$inputs,[],1);
        }
        return DV::success(); 
    }

    function savePE($ss,$items,$ticket_id){
        foreach($items as $item){
            $inputs= [
                'ticket_id'=>$ticket_id,
                'content'=>$item->content,
                'category'=>$item->category
            ];
            $id = saveData($ss,'consult_pe',$inputs,[],1);
        }
        return DV::success(); 
    }

    static function saveLaboTests($ss,$items,$ticket_id){
        foreach($items as $item){
            $inputs= [
                'ticket_id'=>$ticket_id,
                'test_name'=>$test->name,
                'provider_id'=>$test->provider_id,
                'description'=>$test->description,
                'result_summary'=>null,
                'status_id'=>1 //Pending
            ];
            $id = saveData($ss,'consult_labo_tests',$inputs,[],1);
        }
        return DV::success(); 
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

             saveData($ss,"prescription_items",['id'=>$t_id],[
                'ticket_id'=>$ticket_id,
                'prescription_id'=>$id,
                'item_id'=>$item['item_id'],
                'qty'=>$item['qty'],
                'usage'=>$item['usage'],
                'duration_unit'=>$dur_unit, //"day"
                'duration'=>$dur_days, //15
                'reason'=>$item['reason'],
                'remarks'=>$item['remarks']
             ],[],1);
             $cnt++;
         }

         return DV::success(["id"=>$id,"item_count"=>$cnt]);
      }
      return DV::error("Something went wrong during saving prescription");
    }

    static function saveAdvice($ss,$items,$ticket_id){
        foreach($items as $item){
            $inputs= [
                'ticket_id'=>$ticket_id,
                'content'=>$item->content,
                'category'=>$item->category
            ];
            $id = saveData($ss,'consult_advice',$inputs,[],1);
        }
        return DV::success(); 
    }

    static function commitDelete($ss,$ticket_id=0){
         DB::table('consult_chief_complaints')->delete('ticket_id',$ticket_id);
         DB::table('consult_vital_signs')->delete('ticket_id',$ticket_id);
         DB::table('consult_pe')->delete('ticket_id',$ticket_id);
         DB::table('consult_labo_tests')->delete('ticket_id',$ticket_id);
         DB::table('prescription_items')->delete('ticket_id',$ticket_id);
         DB::table('prescriptions')->delete('ticket_id',$ticket_id);
         DB::table('consult_advice')->delete('ticket_id',$ticket_id);
         DB::table('consult_diagnosis')->delete('ticket_id',$ticket_id);
         //1= Waiting, 2 = Serving, 3 = Closed
         DB::table('service_queue')->where('id',$ticket_id)->update(['status_id'=>2]);
         return DV::success();
    }
 
    static function findById($ss,$id){

    }
}
