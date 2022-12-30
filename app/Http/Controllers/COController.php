<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
use Session;
use DB;
use Sanitizer;
use Localization;

class COController extends Controller
{
    function getCOList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $search_value =$req->search_value;
        $str_search ="1=1";
        if($search_value){
            $search_value = escape_like_str($search_value);
            $str_search ="(phone_number ='$search_value' OR name LIKE '%$search_value%')";
        }
        $rows = DB::table("credit_officers as co")->where('branch_id',$branch_id)->whereRaw($str_search)->selectRaw("co.id,co.name,co.sex,co.phone_number,co.inactive, CASE IFNULL(co.inactive,0) WHEN 0 THEN 'Active' ELSE 'Inactive' END AS status,(select national_id from persons as p where p.id = co.person_id limit 1) AS national_id")->get();
        return JDV::json($rows);
    }

    function saveCO(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        //$d =$req->all();
        $name = $req->name;

        $res = getValues($req,[
          'id'=>'0|identity=1',
          'name'=>'1|string|0-100',
          'sex'=>'1|choice|M,F|',
          'phone_number'=>'0|phone|',
          'address'=>'0|string' 
        ], true,
        [],$ss->lang,false,
        ["$ss->branch_id|credit_officers|name,sex|id=id|text=Credit officer ? already exists::$name;"]);

       if($res->error) return JDV::error($res->error);
       $co_id = saveData($ss,'credit_officers',['id'=>$res->id],$res->values,[],1);
       if($co_id>0) return JDV::success(['id'=>$co_id]);
       return JDV::error('some error occured in saving CO profile'); 
    }

    function deleteCO(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id;
        $branch_id = $ss->branch_id;
        DB::table('credit_officers')->where('id',$id)->delete(); 
        return JDV::success();
    }

    function getCODetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $id = $req->id;
        $rows = DB::table('credit_officers as co')->where('id',$id)->selectRaw("co.id,co.name,co.sex,co.address,co.phone_number")->take(1)->get();  
        return JDV::json(isset($rows[0])?$rows[0]:null);
    }

    
}
