<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use Session;
use DB;

class PersonController extends Controller
{
    //SavePersonInfoByApptId()
    function savePersonInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;  //user not authenticated
        $branch_id = $ss->branch_id;
        $validate_rule = [
            "id"=>"0|number|identity=1", //person_id
            "appt_id"=>"0|number",
            "name"=>"1|string|1-200|text=Name is required",
            "sex"=>"1|choice|M,F,O|text=Gender must be one of these choices M, F, O",
            "date_of_birth"=>"1|date",
            "phone_number"=>"1|phone",
            "email"=>"0|email",
            "address"=>"0|string"
        ];

        $res = validateReq($req,$validate_rule,true,[],$ss->lang,false,[]);
        if($res->error) return JDV::error($res->error);
        $inputs = $res->values;
        $person_id = isset($res->id)?$res->id:null;
        $appt_id = $inputs['appt_id'];
        if(!$person_id) $person_id = $this->getPersonId($appt_id);
        if(!$person_id) return JDV::error("Person identity is not valid. There is no person profile that matches with the given id $person_id");
        
        unset($inputs['appt_id']);
        $person_id = saveData($ss,'persons',['id'=>$person_id],$inputs,[],1);
        if($person_id > 0){
            DB::table('appointments')->where('id',$appt_id)->update([
                'client_name'=>$inputs['name'],
                'client_sex'=>$inputs['sex'],
                'client_phone_number'=>$inputs['phone_number'],
                'client_email'=>$inputs['email']
            ]);
            return JDV::success(['id'=>$person_id]);
        }
        return JDV::error('Something went wrong during updaing person info');
    }

    protected function getPersonId($appt_id){
      $rows = DB::table('appointments as appt')->join('patients as c','c.id','appt.client_id')->join('persons as p','p.id','=','c.person_id')->where('appt.id',$appt_id)->selectRaw('p.id as person_id')->take(1)->get();
      foreach($rows as $row) return $row->person_id;
      return null;
    }

    //getPersonInfoByApptId()
    function getPersonInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::emptyResult($ss,[]); //user not authenticated
        $branch_id = $ss->branch_id;
        $appt_id = $req->appt_id;
        $person_id = $req->id;
               
        if(!$person_id) $person_id = $this->getPersonId($appt_id);
        if(!$person_id) return JDV::error('Person identity is not valid');

        $info = getDataRow('persons',['id'=>$person_id],"id,name,sex,formatDate(date_of_birth) as date_of_birth,first_name,last_name,national_id,phone_number,email,address");
        return JDV::result($info);
    }

    function getPersonList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return  JDV::emptyResult($ss,[]); //user not authenticated
        $branch_id = $ss->branch_id;
        $rows = DB::table("persons")->where('branch_id',$branch_id)->selectRaw('id,name,first_name,last_name,sex,formatDate(date_of_birth) as date_of_birth,phone_number,email,address')->orderBy('name','ASC')->get();
        return JDV::result($rows);
    }
}
