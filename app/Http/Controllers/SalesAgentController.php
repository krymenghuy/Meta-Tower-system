<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SalesAgent;
use App\Models\UM;
use App\Models\JDV;
use App\Models\PublicStorage;
use App\Models\PendingTask;
use App\Models\MobileAppSettings;
use Config;

class SalesAgentController extends Controller
{
    protected $salesAgentModel;
    
    function getMerchantList(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $ss->official_id;
      /** if there is no $sale_gent_id provided then do not return any maarchant list */
      if (!$id) $id = -10;
      $rows = SalesAgent::merchantList($req->all(),$id,$ss);
      return JDV::result($rows);
    }

    function updateStatus(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
       $agent = new SalesAgent();
       $status_code = $req->status_code;
       $id = $req->id ?? $req->agent_id;
       $res = $agent->updateStatus($status_code,$id);
       return JDV::raw($res); 
    }

    function getMerchantList_all(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $ss->official_id;
      /** if there is no $sale_gent_id provided then do not return any maarchant list */
      if (!$id) $id = -10;
      $rows = SalesAgent::merchantList_all($req->all(),$id,$ss);
      return JDV::result($rows);
    }

    function saveSalesAgent(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !== 200) return JDV::raw($ss);
        $id = $req->id ?? $req->agent_id;
        $agent = new SalesAgent($id,$ss);
      return JDV::raw($agent->save($req->all(),$id,$ss));
   }

   function deleteSalesAgent(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $req->id;
      $agent = new SalesAgent($id,$ss);
      return JDV::raw($agent->delete());
   }

   /** Send OTP in case of Forget Password */
   function forget_send_otp(Request $req){
      $ss = ['branch_id'=>1,'lang'=>'km'];
      $req['user_class'] ='sales_agent';
      $um = new UM();
      $res = $um->sendOTPCode_phone($req->all(),$ss); 
      return JDV::raw($res);
   }
   
   function getProfileInfo(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if ($ss->status_code !==200) return JDV::raw($ss);
      $agent_id = $ss->official_id;
      $data = \App\Models\SalesAgent::details($agent_id,$ss);  
      if(!$data) return JDV::error('It seems your profile information does not exist or is missing');
      $data->notif_topic_private= $ss->branch_id.topic_prefix($ss->user_class)."private".$ss->user_id;
      $data->notif_topic_general=$ss->branch_id.topic_prefix($ss->user_class)."general";
      return JDV::result($data);
   }
  /** {"phone_number","otp_code"} */ 
  function updatePhoneNumber(Request $req){
   $ss = UM::getUserInfoByToken($req,-1); 
   if($ss->status_code !==200) return JDV::raw($ss);
   $res = PendingTask::finish('change_phone_number',$ss->user_id, $req->otp_code);
   return JDV::raw($res);
 }
   //$d = {name, [phone_number], email, address}
   function updateProfile(Request $req) {
      $ss = UM::getUserInfoByToken($req);
      if($ss->status_code !==200) return JDV::raw($ss);
      if (strtolower($ss->user_class) !=='sales_agent') return DV::error('It seems you are not a sales agent');
      $id =  $ss->official_id;
      $d = new SalesAgent($id,$ss);
      $res = $d->updateProfile_mobile($req->all(),$id);
      return JDV::raw($res); 
   }

   function forget_verify_otp(Request $req){
      $user_class ='sales_agent';
      $login_name = $req->phone_number;
      $otp_code = $req->otp_code;
      $r = UM::matchOTP($login_name,$otp_code,$user_class);
      return JDV::result($r?'true':'false');
   }
    //Reset password. In case of Forget password
  //@d = {'phone_number','otp_code','password'};
  function forget_reset_password(Request $req){
   $user_class = 'sales_agent';
   $login_name = $req->login_name?$req->login_name:$req->phone_number;
   $otp_code = $req->otp_code;
   $password = $req->password;
   $res = UM::resetPassword_forget($login_name,$user_class,$otp_code,$password);
   return JDV::raw($res);
  }
 
   function send_otp_preregister(Request $req) {
      $agent = new SalesAgent();
      $req['user_class']='sales_agent';
      $res = $agent->send_otp_preregister($req->all());
      return JDV::raw($res);
   }

   function verify_otp_preregister(Request $req) {
      $agent = new SalesAgent();
      $req['user_class']='sales_agent';
      $res = $agent->verify_otp_preregister($req->all());
      return JDV::raw($res);
   }
  
   /** SaleAgent login */
   function login(Request $req){
      $app_id = $req->app_id;
      $login_name = $req->login_name;
      $pwd = $req->password;
      $um = new UM(); 
      $result = $um->verifyUser($app_id,$login_name,$pwd);
      if($result->status ==='OK'){
        $user =  $result->user;  
        $result->user->image_url = PublicStorage::getProfilePhoto_url($user->id);
        $result->user->notif_topic_private= $user->branch_id.topic_prefix($user->user_class)."private".$user->user_id;
        $result->user->notif_topic_general= $user->branch_id.topic_prefix($user->user_class)."general";
      }
      return $result;
   }

   //Sel-register
   function register(Request $req) {
      $ss =(object)['branch_id'=>1];
      $agent = new SalesAgent(null,$ss);
      $res = $agent->register($req->all(),$ss);
      return JDV::raw($res); 
   }

   /** returns the paginated list */
   function getList(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      return JDV::result(SalesAgent::list($req->all(),$ss));
   }
   
     /** returns list of all Sales agent */
   function getListAll(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      return JDV::result(SalesAgent::listAll($req->all(),$ss));
   }

   function getFormOptions(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !== 200) return JDV::raw($ss);
    $id = $req->id;
    return JDV::result(SalesAgent::getFormOptions($id,$ss));
   }

   function getDetails(Request $req) {
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !== 200) return JDV::raw($ss);
    $id = $req->id;
    return JDV::result(SalesAgent::details($id,$ss));
  }

  function getBrandImages_mobile(Request $request){
   $request['branch_id'] = 1;
   $app_id = Config::get('app.sales_app_id');
   return JDV::result(MobileAppSettings::getBrandImages($app_id));  
 }
}
