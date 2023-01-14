<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use DB;

class EmployeeController extends Controller
{
    function getEmployeeList(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $search_value =$req->search_value;
        //$department_id = $req->department_id;

        $str_search ="1=1";
        if($search_value){
          $str_search ="(e.code ='$search_value' OR e.name LIKE '%$search_value%')";
        }
        
        //if ($brand_id >0) $str_brand ="g.id =$brand_id";
        $rows = DB::table('employees as e')->join('persons as p','p.id','=','e.person_id')->where('e.branch_id',$branch_id)->whereRaw($str_search)->selectRaw("e.id,e.code,p.name,p.first_name, p.last_name,p.sex, p.email, p.phone_number,e.create_user,formatDate(p.date_of_birth) as date_of_birth")->orderByRaw("p.name ASC")->get();
        return JDV::result($rows);
    }
     
    function deleteEmployee(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
      $branch_id = $ss->branch_id;
      $id = $req->id;     
      $x = DB::table('employees')->where('id',$id)->where('branch_id',$branch_id)->delete();
      //if($r) 
      return JDV::success();
      //else return JDV::error("Failed to delete inventory item $id");
    }
     
    function getEmployeeDetails(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
      $branch_id = $ss->branch_id;
      $id = $req->id;
      $rows = DB::table('employees as e')->join('persons as p','p.id','=','e.person_id')->where('e.id',$id)->where('e.branch_id',$branch_id)->selectRaw("e.id,e.code,p.name,p.first_name, p.last_name,p.sex, p.email, p.phone_number,e.create_user,formatDate(p.date_of_birth) as date_of_birth,e.employment_type")->take(1)->get();
      return JDV::result(isset($rows[0])?$rows[0]:null);
    }

    function getPersonId($emp_id){
        $row = getDataRow('employees',['id'=>$emp_id],'person_id');
        return isset($row)? $row->person_id:null; 
    }

    function saveEmployee(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
        $branch_id = $ss->branch_id;
      
        $def_prefix =null;
        $def_code_length = 5;

        $check_unique = [];
        $validate_rule =[
          "id"=>"0|number|identity=1",
          "person_id"=>"0|number|",
          "name"=>"1|string|1-150",
          "first_name"=>"0|string",
          "last_name"=>"0|string",
          "date_of_birth"=>"1|date",
          "sex"=>"1|choice|M,F,O",
          "phone_number"=>"1|phone",
          "email"=>"0|email",
          "address"=>"0|string",
          "position_id"=>"0|number|default=0",
          "department_id"=>"0|number|default=0",
          "employment_type"=>"1|choice|part time,full time,other",
          "salary"=>"0|number|default=0",
          "currency_code"=>"0|string|default=USD"
        ];

        $res = validateReq($req,$validate_rule,true,[],$ss->lang,false,$check_unique);
        if($res->error) return JDV::error($res->error);
        $inputs =$res->values;
        $full_name = getNameParts($inputs['name']);
        $inputs['first_name'] = $full_name->first_name;
        $inputs['last_name'] = $full_name->last_name;
        $emp_id = $res->id; //emp_id
        $person_id = $inputs['person_id'];
       
        $person_id = saveData($ss,'persons',['id'=>$person_id],
        [ 
          "name"=>$inputs['name'],
          "first_name"=>$inputs['first_name'],
          'last_name'=>$inputs['last_name'],
          'sex'=>$inputs['sex'],
          'date_of_birth'=>$inputs['date_of_birth'],
          'phone_number'=>$inputs['phone_number'],
          'email'=>$inputs['email'],
          'address'=>$inputs['address']  
        ],
        null,1);

        if ($person_id > 0){
            $emp_id = saveData($ss,'employees',['id'=>$emp_id],
            [
                "person_id"=>$person_id,
                "employment_type"=>$inputs['employment_type'],
                "salary"=>$inputs['salary'],
                'currency_code'=>$inputs['currency_code']
            ]
            ,null,1);

            if($emp_id > 0){
                $new_code = setOfficialCode($branch_id,'employee_code_control','employees',['id'=>$emp_id],$def_prefix,$def_code_length);
                return JDV::success(['emp_id'=>$emp_id]); 
            }else return JDV::error("Failed to save employee data"); /** failed in saving record to employees table **/
        }else  JDV::error("Something went wrong during saving person data");
        
    }

}
