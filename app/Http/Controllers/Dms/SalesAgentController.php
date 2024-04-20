<?php

namespace App\Http\Controllers\Dms;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dms\SalesAgent;
use App\Models\UM;
use App\Models\JDV;
use App\Models\Dms\PendingTask;
use App\Models\Dms\MobileAppSettings;
use Illuminate\Support\Facades\Cache;
use Config;

class SalesAgentController extends Controller
{
    protected $salesAgentModel;
     
    function closeCommissionSummary(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $req->sales_agent_id ?? $req->id;
      $agent = new SalesAgent($id,$ss);
      $id = $ss->user_class === 'sales_agent'? $ss->official_id : ($req->sales_agent_id ?? $req->id );
      $data = $agent->closeCommissionSummary($req->all(),$id,$ss);
      return JDV::result($data);
   }

   function getPayments(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $req->sales_agent_id ?? $req->id; 
      $id = $ss->user_class === 'sales_agent'? $ss->official_id : $id;
      $req['sales_agent_id'] = $id;
      $data = SalesAgent::getPayments($req->all(),$ss);
      return JDV::result($data);
   }

   function getPaymentsByClosingId(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $closing_id= $req->closing_id;
      $id = $req->sales_agent_id;
      $data = SalesAgent::getPaymentsByClosingId($closing_id,$id,$ss);
      return JDV::result($data);
   }

   function getClosedCommissionSummaries(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $req->sales_agent_id ?? $req->id; 
      $id = $ss->user_class === 'sales_agent'? $ss->official_id : ($req->sales_agent_id ?? $req->id);
      $data = SalesAgent::getClosedCommissionSummaries($req->all(),$id,$ss);
      return JDV::result($data);
   }

   function getCommissionSummaries(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $req->sales_agent_id ?? $req->id; 
      $id = $ss->user_class === 'sales_agent'? $ss->official_id : ($req->sales_agent_id ?? $req->id);
      $agent = new SalesAgent($id,$ss);
      $data = $agent->getCommissionSummaries($req->all(),$id,$ss);
      return JDV::result($data);
   }

   function getLiveCommissionSummary(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $req->sales_agent_id ?? $req->id; 
      $id = $ss->user_class === 'sales_agent'? $ss->official_id : ($req->sales_agent_id ?? $req->id);
      $data = SalesAgent::getLiveCommissionSummary($req->all(),$id,$ss);
      return JDV::result($data);
   }

   //revertCommissionSummary()
   function reopenCommissionSummary(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $req->sales_agent_id ?? $req->id;
      $closing_id = $req->closing_id;
      $res = SalesAgent::reopenCommissionSummary($closing_id,$req->month,$req->year, $id,$ss);
      return JDV::raw($res);
   }

   
   function deleteCommissionPayment(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $req->sales_agent_id ?? $req->id;
      $agent = new SalesAgent($id,$ss);
      $trx_id = $req->trx_id ?? $req->id;
      $res = $agent->deleteCommissionPayment($trx_id,$ss);
      return JDV::raw($res);
   }

   function makeCommissionPayment(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = strtolower($ss->user_class) === 'sales_agent'? $ss->official_id : $req->id;
      $agent = new SalesAgent($id,$ss);
      $agent_id = $req->sales_agent_id ?? $req->agent_id;
      $res = $agent->makeCommissionPayment($req->all(),$agent_id,$ss);
      return JDV::raw($res);
   }
    
   function saveProfilePhoto(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $req->id ?? $req->sales_agent_id;
      $id = strtolower($ss->user_class) === 'sales_agent'? $ss->official_id : $id;
      $agent = new SalesAgent($id,$ss);
      $photo = $req->photo ?? $req->image;
      $res = $agent->saveProfilePhoto($photo,$id,$ss);
      return JDV::raw($res);
   }
    
   function deleteProfilePhoto(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $req->id ?? $req->sales_agent_id;
      $id = strtolower($ss->user_class) === 'sales_agent'? $ss->official_id : $id;
      $agent = new SalesAgent($id,$ss);
      $res = $agent->deleteProfilePhoto($id,$ss);
      return JDV::raw($res);
   }

   function getTargetCount(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $req->id ?? $req->sales_agent_id;
      $id = strtolower($ss->user_class) === 'sales_agent'? $ss->official_id : $id;
      $data = SalesAgent::countTarget($req->year,$req->month,$id,$ss);
      return JDV::result($data);
 }

   function getCommissionPayments(Request $req){
         $ss = UM::getUserInfoByToken($req,-1);
         if($ss->status_code !== 200) return JDV::raw($ss);
         $id = $req->id ?? $req->sales_agent_id;
         $id = strtolower($ss->user_class) === 'sales_agent'? $ss->official_id : $id;
         $agent = new SalesAgent($id,$ss);
         $data = $agent->getCommissionPayments($req->all(),$id,$ss);
         return JDV::result($data);
    }
  
    function getCommissionPaymentByMonth(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $req->id ?? $req->sales_agent_id;
      $id = strtolower($ss->user_class) === 'sales_agent'? $ss->official_id : $id;
      $agent = new SalesAgent($id,$ss);
      //$arr = ['month'=>3, 'year':2024] 
      $data = $agent->getCommissionPaymentByMonth($req->all(),$id,$ss);
      return JDV::result($data);
   }

    function getCommissionSummary_mobile(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = strtolower($ss->user_class) =='sales_agent'? $ss->official_id : ($req->sales_agent_id ?? $req->id);
      $agent = new SalesAgent($id,$ss);
      //$month_range = $req->month_range;
      // if($month_range){
      //     $sts = explode('_',$month_year);
      //     $req['month'] = $sts[0];
      //     $req['year'] = isset($sts[1])? $sts[1]: date('Y');
      // }
      $data = $agent->getCommissionSummary_mobile($req->all(),$id,$ss);
      return JDV::result($data);
    }

    function getCommissionPolicyDetails(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = strtolower($ss->user_class) =='sales_agent'? $ss->official_id : $req->id;
      $data = SalesAgent::getCommissionPolicyDetails($id);
      return JDV::result($data);
    }

    function getSummaryPackagesByMonth(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $ss->official_id;
      $agent = new SalesAgent($id,$ss);
      $data =  $agent->getSummaryPackagesByMonth($req->all());
      return JDV::result($data);
    }

    function getMerchantList(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $ss->official_id;
      /** if there is no $sale_gent_id provided then do not return any maarchant list */
      if (!$id) $id = -10;
      $rows = SalesAgent::merchantList($req->all(),$id,$ss);
      return JDV::result($rows);
    }
  
    function getActiveAgents(){
      $today = date('Y-m-d');
      $year = date('Y');
      
      $m = date('m');
      $months = [$m];
      for($i=1;$i<4;$i++){
         $t_month = $m -$i;
         if($t_month >=1) $months[] = $t_month;
         else break;
      }
      $active_agents = DB::table('package_sales_commissions as c')->join('package as p','p.id','=','c.package_id')->join('sales_agents AS a','a.id','=','c.sales_agent_id')->whereRaw('YEAR(p.delivery_time) = '.$year)->whereRaw('MONTH(p.delivery_time) IN '.$months)->selectRaw('a.id,a.name')->distinct()->get();
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
      $cache_key = $ss->user_class.'profile_'.$ss->user_id;
      $cache_data = Cache::get($cache_key);
      if($cache_data !== null) return JDV::result($cache_data);
      $data = \App\Models\SalesAgent::details($agent_id,$ss);  
      if(!$data) return JDV::error('It seems your profile information does not exist or is missing');
      $data->notif_topic_private= $ss->branch_id.topic_prefix($ss->user_class)."private".$ss->user_id;
      $data->notif_topic_general=$ss->branch_id.topic_prefix($ss->user_class)."general";
      Cache::put($cache_key,$data,10);
      return JDV::result($data);
   }
   
  /** {"phone_number","otp_code"} */ 
  function updatePhoneNumber(Request $req){
   $ss = UM::getUserInfoByToken($req,-1); 
   if($ss->status_code !==200) return JDV::raw($ss);
   $res = PendingTask::finish('change_phone_number',$ss->user_id, $req->otp_code);
   return JDV::raw($res);
 }
 
 /** {account_number, account_name, bank_name}*/
 function saveBankAccount(Request $req) {
   $ss = UM::getUserInfoByToken($req);
   if($ss->status_code !==200) return JDV::raw($ss);
   if (strtolower($ss->user_class) !=='sales_agent') return DV::error('It seems you are not a sales agent');
   $id = $ss->official_id;
   $res = SalesAgent::saveBankAccount($req->all(),$id,$ss);
   return JDV::raw($res);
}

function getBankAccount(Request $req) {
   $ss = UM::getUserInfoByToken($req);
   if($ss->status_code !==200) return JDV::raw($ss);
   if (strtolower($ss->user_class) !=='sales_agent') return DV::error('It seems you are not a sales agent');
   $id =  $ss->official_id;
   $data = SalesAgent::getBankAccount($id,$ss);
   return JDV::result($data);
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
        $result->user->image_url = UM::getUserPhoto($user->branch_id,$user->user_class,$user->id); //PublicStorage::getProfilePhoto_url($user->id);
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

   function getPaymentFormOptions(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $agent = new SalesAgent(null,$ss);
      $data = $agent->getPaymentFormOptions(true,false,$ss);
      return JDV::result($data);
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

//   function getPaymentFormOptions(Request $req){
//     $ss = UM::getUserInfoByToken($req,-1);
//     if($ss->status_code !== 200) return JDV::raw($ss);
//     $data = SalesAgent::getPaymentFormOptions(true,true,$ss);
//     return JDV::result($data);   
//   }

  /** begin: Test functions */
 
  function getTargetCountInfo_realtime(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !== 200) return JDV::raw($ss);
      $id = $ss->user_class==='sales_agent'? $ss->official_id : ($req->id ?? $req->sales_agent_id);
      return JDV::result(SalesAgent::getTargetCountInfo_realtime($req->year,$req->month,$id,$ss));
  }
 
  /** end::Test functions */
}
