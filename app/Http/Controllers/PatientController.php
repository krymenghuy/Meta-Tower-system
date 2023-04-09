<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use App\Models\Patient;
  
class PatientController extends Controller
{
    
    function getPatientQuickInfo(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->client_id?$req->client_id:$req->id;
      if(!$id) $id = $req->patient_id;
      return JDV::result(Patient::quickInfo($id)); 
    }

    // function savePatient_DEL(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return $ss; //user not authenticated
    //     $branch_id = $ss->branch_id;
    //     $res = getValues($req,[
    //         'id'=>'0|number|identity=1',
    //         'person_id'=>'0|string',
    //         'client_name'=>'0|string',
    //         'client_sex'=>'0|choice|M,F',
    //         'client_phone_number'=>'0|phone',
    //         'client_email'=>'0|email',
    //         'arrival_date'=>'1|date|format=m-d-Y|text=Arrival date is not correct',
    //         'arrival_time'=>'1|time|text=',
    //         'consultant_id'=>'0|number|default=0',
    //         'channel_id'=>'1|number',
    //         'notes'=>'0|string' 
    //     ],true,['email'=>'@'],$ss->lang,false,[]);

    //    if($res->error) return JDV::error($res->error,$ss->lang);
    //    $inputs = $res->values;
    //    $inputs['branch_id'] = $branch_id;
    //    $inputs['create_user'] = $ss->full_name;
    //    $inputs['create_uid'] = $ss->user_id;
    //    $inputs['created_at'] = time();

    //    $client_id = $inputs['client_id'];
    //    if ($client_id > 0){
    //        $client = getDataRow('patients',['id'=>$client_id]);
    //        if (!$client) return JDV::json("Client identity does not exist");
    //        $inputs['client_type'] ='client';
    //    }else{

    //        //JDV::validateProps() returns object {"error" as string,"inputs" as array}. If error ==null => no error 
    //        $res = JDV::validateProps($inputs,['client_phone_number'=>'1|phone|','client_name'=>'1|string','client_sex'=>'0|string|default=M']);
    //        if($res->error) return JDV::error($res->error);
    //        $client_phone = $res->inputs['client_phone_number'];
          
    //        //$leadData = transformArrayProps($res->inputs,['client_phone'=>'phone_number','client_name','name','client_sex'=>'sex']);
    //        $lead = getDataRow('leads',['phone_number'=>$client_phone],"id,name");  
    //        $lead_id = 0;
    //        if($lead)  $lead_id = $lead->id;

    //        $lead_id = createForcibly($ss,'leads',['id'=>$lead_id],[
    //         "name"=>$res->inputs['client_name'],
    //         "sex"=>$res->inputs['client_sex'],
    //         "phone_number"=>$client_phone,
    //         "status_id"=>2 // status_id = {1=Lead,2=prospect}
    //        ],[],1);
          
    //        if($lead_id>0){
    //            $inputs['client_type'] ='lead';
    //            $inputs['client_id'] =$lead_id;
    //        }else JDV::error("Problem during saving of new prospect`s information");
    //     }

    //    $appt = Appointment::create($inputs);
    //    if($appt->id > 0)
    //         return JDV::success(['id'=>$appt->id]);
    //    else return JDV::error("Something went wrong in saving appointment!");
    // }
  
}
