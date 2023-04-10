<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use Session;
use Localization;

use DB;
use SQLDB;
use Carbon\Carbon;
use Sanitizer;

class MedicalServiceController extends Controller
{
   
    function getMedicalServices(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $search_value = $req->search_value;
        $department_id = $req->department_id;
        $str_search = "1=1";
        if($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "d.name LIKE '%$search_value%' OR ms.name LIKE '%$search_value%'";
        }
      
        $rows = DB::table('medical_services as ms')->join('departments as d','d.id','=','ms.department_id')->where('d.id',$department_id)->where('ms.branch_id',$branch_id)->whereRaw($str_search)->selectRaw("ms.id,ms.name,ms.description,ms.price,displayMoney(price,currency_code) as display_price,ms.cost,displayMoney(cost,currency_code) as display_cost,ms.department_id,d.name as department_name,treatment_method,service_type")->orderBy('ms.id','DESC')->get();
        return JDV::result($rows);
    }

    function getMedicalServiceInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        //$branch_id = $ss->branch_id;
        $id = $req->id;
        $row = getDataRow('medical_services',['id'=>$id],"id,name,ifnull(price,0) as price,tax_rate");
        return JDV::result($row);
    }

    function department_exists($branch_id,$dep_id){
       return DB::table('departments')->where('id',$dep_id)->where('branch_id',$branch_id)->select("id")->exists();
    }

    function saveMedicalService(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;

        $validate_rule = [
            'id' => '0|number|identity=1',
            'name'=>'1|string|1-100',
            'description'=>'0|string',
            'department_id'=>'1|number',
            'treatment_method'=>'1|choice|none,nonsurgery,minor surgery,surgery',
            'service_type'=>'1|choice|consultation,labo,treatment',
            'price'=>'0|number',
            'cost'=>'0|number',
            'is_package'=>'1|number|default=0'
            //'arrival_date' => 'required|date|numeric|unique:customers,phone'
        ];
        $check_unique =["$branch_id|medical_services|name|id=id"];
        $res = validateReq($req,$validate_rule,true,[],$ss->lang,false,$check_unique);
        if($res->error) return JDV::error($res->error);
        $inputs = $res->values;
        if(!$this->department_exists($branch_id,$inputs['department_id'])) return JDV::error("Department ID does not exist");

        $id = $res->id;
        //if(!isset($inputs['description'])) $inputs['description'] = $inputs['name'];
        $id = saveData($ss,'medical_services',['id'=>$id],$inputs,[],1);
        if($id > 0 ) return JDV::success(['id'=>$id]);
        else return JDV::error("Something went wrong during saving medial service");
    }

    function deleteMedicalService(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $id = $req->id;
        DB::table('medical_services')->where('id',$id)->where('is_package',0)->where('branch_id',$branch_id)->delete();
        return JDV::success();
    }

    function getMedicalServiceDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $id = $req->id;
        $row = getDataRow('medical_services',['id'=>$id],"id,name,department_id,description,price,service_type,treatment_method,create_user,created_at");
        return JDV::result($row);
    }

}
