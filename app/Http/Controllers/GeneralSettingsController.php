<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GeneralSettings;
use App\Models\ContactChannel;
use App\Models\JDV;
use App\Models\UM;
use Session;
use Localization;

use DB;
use SQLDB;
use Carbon\Carbon;
use Sanitizer;


class GeneralSettingsController extends Controller
{
    protected $settingModel;
    public function __construct()
    {
        $this->settingModel = new GeneralSettings();
    }
  
    function getComboItems_channel(Request $req){
        $rows = DB::table('contact_channels as cc')->where('cc.branch_id',0)->selectRaw("cc.id,cc.name as channel_name")->get();
        return JDV::result($rows);
    }
  
    function getProductData(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss); //user not authenticated
      $branch_id = $ss->branch_id;
      $rows = DB::table('inv_items as i')->where('i.branch_id',$branch_id)->selectRaw("i.id as `value`,i.name as `text`")->get();
      $data = (object)[];
      $data->products = $rows;
      $data->usage_options = [
        ['value'=>"1x2","text"=>"1x2"],
        ['value'=>"1x3","text"=>"1x3"],
        ['value'=>"Apply","text"=>"Apply"],
        ['value'=>"Other instruction","text"=>"Other instruction"]
      ]; 
      return JDV::result($data);
    }

    function getComboItems_consultant(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss); //user not authenticated
      $branch_id = $ss->branch_id;
      $rows = self::getComboItems_consultant_internal($branch_id);
      return JDV::result($rows);
    }
     
    function getComboItems_chief_complaint(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss); //user not authenticated
      $branch_id = $ss->branch_id;
      $rows = DB::table("chief_complaints as cc")->where('cc.branch_id',$branch_id)->selectRaw("cc.id,cc.name,cc.code")->get(); 
      return JDV::result($rows);
    }

    function getReportFilter_options(Request $request) {
      $r = $this->settingModel->getReportFilter_options($request); 
      if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }
    
    function getPaymentFormOptions(Request $request) {
      $r = $this->settingModel->getPaymentFormOptions($request); 
      if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }
    
    function getOccupations(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        //$d = Sanitizer::sanitizeObject($req->all(),[]);
        $rows = DB::table('occupations as o')->where('branch_id',$branch_id)->selectRaw("id,name as occupation")->get(); 
        return JDV::result($rows);
    }

    function getLoanPurposes(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = $ss->branch_id;
      $rows = DB::table('loan_purposes as l')->where('branch_id',$branch_id)->selectRaw("id,name as purpose")->get(); 
      return $rows;  
    }
 
    function occupation_exists($branch_id, $name){
      $rows = DB::table('occupations as c')->where('branch_id',$branch_id)->where('name',$name)->selectRaw("id")->limit(1)->get();
      foreach($rows as $row) return true;
      return false;
    }

    function purpose_exists($branch_id, $name){
        $rows = DB::table('loan_purposes as c')->where('branch_id',$branch_id)->where('name',$name)->selectRaw("id")->limit(1)->get();
        foreach($rows as $row) return true;
        return false;
    }

    function saveChiefComplaint(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //User not authenticated
      $branch_id = $ss->branch_id;
      $d = Sanitizer::sanitizeObject($req->all(),[]);
      $id = getValue($d,'id');
      $name = getValue($d,'name');
      $parts = explode(':',$name);
      $code = null;
      if (isset($parts[1])){
        $code = $parts[0];
        $name = $parts[1];
      }

      if(!$name) return JDV::error("Chief complaint description or name cannot be empty");
      if($this->ChiefCompaintExists($branch_id,$name,$id)) return "This Chief Complaint already exists!";

      $inputs = ['name'=>$name,'code'=>null];
      $new_id = saveData($ss,'chief_complaints',['id'=>$id],$inputs,[],1);
      if ($new_id>0){
        $this->setChiefCompaintCode($new_id,$code); 
        return JDV::success(['id'=>$new_id]);
      }
      else return JDV::error("SOmething went wrong when trying to save Chief complaint data");
    }

    static function getComboItems_consultant_internal($branch_id,$department_id=0){
      $str_where ="ep.position_id IN(2,3) and ep.status ='Active'";
      return DB::table("employees as e")->join('persons as p','p.id','=','e.person_id')->join('employee_positions as ep','ep.emp_id','=','e.id')->where('e.branch_id',$branch_id)->whereRaw($str_where)->selectRaw("e.id,p.name as consultant_name,e.code")->get();
    }

    static function getComboItems_department(Request $req){
       $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !=200) return $ss; //user not authenticated
       $branch_id = $ss->branch_id;
       $rows = DB::table("departments as d")->selectRaw("d.id,d.name as department_name")->orderBy('d.id','ASC')->get();
       return JDV::result($rows);
    }

    static function getComboItems_appt_status(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      //$branch_id = $ss->branch_id;
      $rows = DB::table("appt_statuses")->selectRaw("id,name as appt_status")->orderBy('id','ASC')->get();
      return JDV::result($rows);
   }

   static function getComboItems_ticket_status(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    //$branch_id = $ss->branch_id;
    $rows = DB::table("ticket_statuses")->selectRaw("id,name as ticket_status")->orderBy('id','ASC')->get();
    return JDV::result($rows);
  }

    function getPatientRegisterOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $department_id =$req->department_id;

        $vital_sign_fields = DB::table("vital_signs as vt")->where('vt.branch_id',$branch_id)->selectRaw("vt.id,vt.category,vt.display_name,vt.value_type,vt.display_order")->orderByRaw("vt.display_order ASC")->get();
        $nationalities = DB::table("loc_countries as c")->selectRaw("c.id,c.name as nationality,c.name_kh as nationality_kh")->orderByRaw("c.name asc")->get();
        $mc_items = DB::table("medical_conditions as i")->where('branch_id',$branch_id)->where('i.value_type','boolean')->selectRaw("i.id,i.name as display_name,i.value_type,i.range,i.display_order")->orderByRaw('i.display_order ASC')->get();
        $departments = DB::table('departments as d')->where('branch_id',$branch_id)->selectRaw("id,name as department_name,description")->orderBy('id','ASC')->orderBy('name','ASC')->get();
        $consultants = self::getComboItems_consultant_internal($branch_id,$department_id);
        return JDV::result((object)['vital_sign_fields'=>$vital_sign_fields,'nationalities'=>$nationalities,'mc_items'=>$mc_items,"consultants"=>$consultants,"departments"=>$departments]); 
    }

    function ChiefCompaintExists($branch_id,$name=null,$id=0){
        if($name) return false;
        $str_id = "1=1";
        if($id > 0) $str_id ="id <> $id";
        return DB::table('chief_complaints')->where('branch_id',$branch_id)->where('name',$name)->whereRaw($str_id)->selectRaw("id")->exists();
    }

    function setChiefCompaintCode($id,$code=null){
        if(!$code) $code = $id;
        DB::table('chief_complaints')->where('id',$id)->update(['code'=>$code]);
    }

    function saveOccupation(Request $req) {
        $ss = UM::getUserInfoByToken($req,207);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $d = Sanitizer::sanitizeObject($req->all(),[]);
        $id = getValue($d,'id');
        $name = getValue($d,'name');

        if(!$name) return JDV::error('Occupation name cannot be empty');
        if($this->occupation_exists($branch_id,$name)) return JDV::error("The provided occupation already exists");
        
        DB::table('occupations')->insert(array(
            'name'=>$name,
            'branch_id'=>$branch_id,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
        ));
        $new_id = DB::getPdo()->lastInsertId();
        return JDV::success(['id'=>$new_id,'occupation'=>$name]); 
    }
   
    function saveLoanPurpose(Request $request){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $d = Sanitizer::sanitizeObject($req->all(),[]);
        $id = getValue($d,'id');
        $name = getValue($d,'name');
    
        if(!$name) return DV::error('Purpose name cannot be empty');
        if($this->purpose_exists($branch_id,$name)) return JDV::error("The provided purpose already exists");
        
        DB::table('loan_purposes')->insert(array(
            'name'=>$name,
            'branch_id'=>$branch_id,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
        ));
        $new_id = DB::getPdo()->lastInsertId();
        return JDV::success();  
    }

    function getCollateralTypes(){
       $rows = DB::table('collateral_types as c')->selectRaw("c.id,c.name,c.category")->get();
       return JDV::result($rows);
    }

    function getProgramOptions(Request $request) {
          $r = $this->settingModel->getProgramOptions($request); 
          if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
          else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
          return makeJsonResponse($r);
    }

    function saveProgram(Request $request) {
          $r = $this->settingModel->saveProgram($request); 
          if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
          else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
          return makeJsonResponse($r);
    }

    function getProductTypes(Request $request) {
        $r = $this->settingModel->getProductTypes($request); 
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
         else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
   }

   
   //$d = {phone_number,text}
   function sendMessage(Request $request) {
          $r = $this->settingModel->sendMessage($request); 
          if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
          else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
          return makeJsonResponse($r);
   }

   function deleteProductType(Request $request) {
        $r = $this->settingModel->deleteProductType($request); 
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
   }

   function saveProductType(Request $request){
        $r = $this->settingModel->saveProductType($request); 
        if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
   }


    //api/settings/test-sql
    function testSQL(Request $req){
        //$ss = UM::getUserInfoByToken($req,-1);
        //if($ss->status_code !=200) return $ss; //user not authenticated
        //$branch_id = $ss->branch_id;
        //$d = Sanitizer::sanitizeObject($req->all(),[]);
        //$rows = DB::table('acm_classes as cl')->selectRaw("cl.classId, cl.Subject,cl.CurEnrollment")->take(30)->get();

        $res = SQLDB::executeSP('test_getClassList',[
          ['name'=>'@course_code','value'=>'100'],
          ['name'=>'@term_id','value'=>93]   
        ],"@error");

        //if ($res->status==='Error')
           return JDV::result($res);  
        //else return JDV::result($out_param);
    }
}
