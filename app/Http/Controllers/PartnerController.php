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

class PartnerController extends Controller
{
   
    function getPartnerList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $rows = DB::table('partners as p')->where('p.branch_id',$branch_id)->selectRaw("p.id,p.name,email,address,phone_number,phone_number1,partner_type,person_id")->get(); 
        return JDV::result($rows);
    }
 
    function savePartner(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;

        $validate_rule = [
            'id' => '0|number|identity=1',
            'name'=>'1|string|1-250',
            'address'=>'0|string',
            'email'=>'0|email',
            'phone_number'=>'0|phone',
            'phone_number1'=>'0|phone',
            'partner_type'=>'0|choice|person,institution',
            'cp_name'=>'0|string',
            'cp_phone_number'=>'0|phone',
            'cp_email'=>'0|email'
        ];
        $check_unique = ["$branch_id|partners|name|id=id"];
        $res = validateReq($req,$validate_rule,true,[],$ss->lang,false,$check_unique);
        if($res->error) return JDV::error($res->error);
        $inputs = $res->values;
      
        $id = $res->id;
        //if(!isset($inputs['description'])) $inputs['description'] = $inputs['name'];
        $id = saveData($ss,'partners',['id'=>$id],$inputs,[],1);
        if($id > 0 ) return JDV::success(['id'=>$id]);
        else return JDV::error("Something went wrong during saving partner");
    }

    function canDeletePartner(){
         return true;
    }
    
    function deletePartner(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $id = $req->id;
        if(!$this->canDeletePartner($id)) return JDV::error("Cannot delete partner because of some existing data");
        DB::table('partners')->where('id',$id)->where('branch_id',$branch_id)->delete();
        return JDV::success();
    }
}
