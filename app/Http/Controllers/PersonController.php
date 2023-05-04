<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use DB;

class PersonController extends Controller
{
    //SavePersonInfoByApptId()
    function savePersonInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);  //user not authenticated
        $branch_id = $ss->branch_id;

        $check_unique = []; //["$branch_id|persons|phone_number|id|text=The phone number is already in use by someone else"];
        $validate_rule = [
            "id"=>"0|number|identity=1", //person_id
            "appt_id"=>"0|number",
            "patient_id"=>"0|number",
            "name"=>"1|string|1-200|text=Name is required",
            "first_name"=>"0|string|0-50",
            "last_name"=>"0|string|0-50",
            "sex"=>"1|choice|M,F,O|text=Gender must be one of these choices M, F, O",
            "date_of_birth"=>"1|date",
            "phone_number"=>"1|phone",
            "email"=>"0|email",
            "address"=>"0|string"
        ];

        $res = validateReq($req,$validate_rule,true,[],$ss->lang,false,$check_unique);
        if($res->error) return JDV::error($res->error);
        $inputs = $res->values;
        $person_id = isset($res->id)?$res->id:null;
        $appt_id = $inputs['appt_id'];
        $patient_id = $inputs['patient_id'];
        if(!$person_id) $person_id = $this->getPersonId($appt_id,"appointments","id");
        if(!$person_id) $person_id = $this->getPersonId($patient_id,"patients","id");
        //if(!$person_id) return JDV::error("Person identity is not valid. There is no person profile that matches with the given id $person_id");
        
        $first_name = $inputs['first_name'];
        $last_name = $inputs['last_name'];

        $full_name =$inputs['name'];
        $nameInfo = getnameParts($inputs['name']);
        if(!$last_name) $inputs['last_name'] = $nameInfo->last_name;
        if(!$first_name) $inputs['first_name'] = $nameInfo->first_name;

        unset($inputs['name']);
        unset($inputs['appt_id']);
        unset($inputs['patient_id']);

        $person_id = saveData($ss,'persons',['id'=>$person_id],$inputs,[],1);
        if($person_id > 0){
            if($appt_id > 0){
                DB::table('appointments')->where('id',$appt_id)->update([
                    'client_name'=>$full_name,
                    'client_sex'=>$inputs['sex'],
                    'client_phone_number'=>$inputs['phone_number'],
                    'client_email'=>$inputs['email']
                ]);
            }

            if($patient_id>0){
                $customer_table = \App\Models\Invoice\InvoiceSettings::$customer_table;
                DB::table($customer_table)->where('id',$patient_id)->update([
                    'name'=>$full_name
                ]);
            }
            return JDV::success(['id'=>$person_id]);
        }
        return JDV::error('Something went wrong during updaing person info');
    }

    /** $table_name = {'appointments','customers','clients','patients'}
     *  
     */

    protected function getPersonId($id,$table_name="appointments",$col_name="id"){
      $rows =[];
      if($table_name ==='appointments')
       $rows = DB::table("appointments as appt")->join('patients as pt','appt.client_id','=','pt.id')->join('persons as p','p.id','=','pt.person_id')->where("appt.id",$id)->selectRaw('p.id as person_id')->take(1)->get();
      else
        $rows = DB::table("$table_name as c")->join('persons as p','p.id','=','c.person_id')->where("c.$col_name",$id)->selectRaw('p.id as person_id')->take(1)->get();
      foreach($rows as $row) return $row->person_id;
      return null;
    }

    //getPersonInfoByApptId()
    function getPersonInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $branch_id = $ss->branch_id;
        $appt_id = $req->appt_id;
        $patient_id = $req->patient_id;
        $person_id = $req->id;
               
        if(!$person_id) $person_id = $this->getPersonId($appt_id,"appointments","id");
        if(!$person_id){
            $customer_table = \App\Models\Invoice\InvoiceSettings::$customer_table;
            $person_id = $this->getPersonId($patient_id,$customer_table,"id");
            //$customer_table = \App\Models\Invoice\InvoiceSettings::$customer_table;
            //$rows = Db::table($customer_table.' as c')->join('persons as p','p.id','=','c.person_id')->selectRaw("p.id")->take(1)->get();
            //$person_id = isset($rows[0])?$rows[0]->id:null;
        }

        if(!$person_id) return JDV::error('Person identity is not valid');

        $info = getDataRow('persons',['id'=>$person_id],"id,CONCAT(last_name,' ',first_name) AS name,sex,formatDate(date_of_birth) as date_of_birth,first_name,last_name,national_id,phone_number,email,address");
        return JDV::result($info);
    }

    function getPersonList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return  JDV::raw($ss); //user not authenticated
        $branch_id = $ss->branch_id;
        $rows = DB::table("persons")->where('branch_id',$branch_id)->selectRaw('id,name,first_name,last_name,sex,formatDate(date_of_birth) as date_of_birth,phone_number,email,address')->orderBy('name','ASC')->get();
        return JDV::result($rows);
    }
}
