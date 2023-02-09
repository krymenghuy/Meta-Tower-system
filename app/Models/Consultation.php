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
    
    static function commitSave($ss,$arr){
       $d = (object)$arr;
       $ticket_id = $d->ticket_id;
       //$patient_id = $d->patient_id;
       $chief_complaints = $d->chief_complaints;
       $vital_signs = $d->vital_signs;
    //    $medical_history = $d->medical_history;
    //    $pe = $d->physical_examination;
    //    $labo_tests = $d->labo_tests;
    //    $diagnosis = $d->diagnosis;
    //    $prescription = $d->prescription;
    //    $advice = $d->advice;
       
       $res =null;
       $item_errors =[];
       $res = self::saveChiefComplaints($ss,$chief_complaints,$ticket_id);
       if($res->status ==='Error') $item_errors[] = $res->error_message;

       $res = self::saveVitalSigns($ss,$vital_signs,$ticket_id);
       if($res->status ==='Error') $item_errors[] = $res->error_message;

    //    $res = self::saveMedicalHistory($ss,$medical_history,$ticket_id);
    //    if($res->status ==='Error') $item_errors[] = $res->error_message;

    //    $res = self::savePE($ss,$pe,$ticket_id);
    //    if($res->status ==='Error') $item_errors[] = $res->error_message;

    //    $res = self::saveLaboTests($ss,$labo_tests,$ticket_id);
    //    if($res->status ==='Error') $item_errors[] = $res->error_message;

    //    $res = self::saveDiagnosis($ss,$diagnosis,$ticket_id);
    //    if($res->status ==='Error') $item_errors[] = $res->error_message;

    //    $res = self::savePrescription($ss,$prescription,$ticket_id);
    //    if($res->status ==='Error') $item_errors[] = $res->error_message;

    //    $res = self::saveAdvice($ss,$advice,$ticket_id);
    //    if($res->status ==='Error') $item_errors[] = $res->error_message;
       
       $consultation_id =null;
       return (object)[
         'status'=>'OK',
         'status_code'=>200,
         'data'=>[
                'item_errors'=>$item_errors,
                'ticket_id'=>$ticket_id,
                'consultation_id'=>$consultation_id
             ]
         ];
    }

    static function getPatientId($branch_id, $ticket_id){
        $rows = DB::table("service_queue")->where('id',$ticket_id)->where('branch_id',$branch_id)->select("client_id as patient_id")->get();
        return isset($rows[0])?$rows[0]->patient_id:null;
    }

    static function getVitalSignInfo($vs_id =0){
        $rows = DB::table("vital_signs")->where('id',$vs_id)->select("id","display_name as description")->take(1)->get();
        return isset($rows[0])?$rows[0]:null;
    }

    static function getChieComplaintInfo($cc_id =0){
       $rows = DB::table("chief_complaints")->where('id',$cc_id)->select("id","name as description","code")->take(1)->get();
       return isset($rows[0])?$rows[0]:null;
    }

    static function saveChiefComplaints($ss,$items,$ticket_id){
        $patient_id = self::getPatientId($ss->branch_id,$ticket_id);
        $cnt =0;
        foreach($items as $x){
            $cc_id = $x['id'];
            $item = self::getChieComplaintInfo($cc_id);
            if($item){
                $inputs= [
                    'ticket_id'=>$ticket_id,
                    'patient_id'=>$patient_id,
                    'description'=>$item->description,
                    'category'=>$item->category
                ];
                $id = saveData($ss,'consult_chief_complaints',["ticket_id"=>":ticket_id","cc_id"=>$cc_id],$inputs,[],1,true);
                $cnt++;
            } 
          
        }
        return DV::success();
    }

    static function saveVitalSigns($ss,$items,$ticket_id){
        $patient_id = self::getPatientId($ss->branch_id,$ticket_id);
      
        $cnt =0;
        $patient_id = self::getPatientId($ss->branch_id,$ticket_id);
        foreach($items as $x){
            $vs_id = isset($x['id'])?$x['id']:0;
            $item = self::getVitalSignInfo($vs_id);
            if($item){
                $inputs= [
                    'ticket_id'=>$ticket_id,
                    'patient_id'=>$patient_id,
                    'description'=>$item->description,
                    'category'=>$item->category,
                    'observed_value'=>$x['observed_value']
                ];
                $id = saveData($ss,'consult_vital_signs',['ticket_id'=>$ticket_id,'vs_id'=>$vs_id],$inputs,[],1,true);
                $cn++;
            }
        }
        return DV::success(); 
    }


    static function saveDiagnosis($ss,$items,$ticket_id){
        foreach($items as $item){
            $inputs= [
                'ticket_id'=>$ticket_id,
                'content'=>$item->content,
                'category'=>$item->category
            ];
            $id = saveData($ss,'consult_diagnosis',$inputs,[],1);
        }
        return DV::success(); 
    }
 
    //Medical history is array of items [{category,content},{category,content},{...}]
    static function saveMedicalHistory($ss,$items,$ticket_id){
        foreach($items as $item){
            $inputs= [
                'ticket_id'=>$ticket_id,
                'content'=>$item->content,
                'category'=>$item->category
            ];
            $id = saveData($ss,'consult_medical_history',$inputs,[],1);
        }
        return DV::success(); 
    }

    static function savePE($ss,$items,$ticket_id){
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
