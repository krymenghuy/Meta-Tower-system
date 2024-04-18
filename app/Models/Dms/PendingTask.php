<?php

namespace App\Models\Dms;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\UM;
use App\Models\DV;
use Carbon\Carbon;
use DB;

class PendingTask //extends Model
{
    //use HasFactory;

    //create pending task for some action that needs OTP_CODE verification such as 
    // "change_phone_number","change_email","change_login_name"
    //NOTE:Changing password is different process from this pending_task because user need to verify otp_code first, and user enter new password
    static function create($action_name,$branch_id,$user_id,$org_value,$new_value,$otp_code){
        $allowed_actions = ['change_phone_number','change_email','change_login_name']; 
        //user exists by Login name or user_id or id
         if(!UM::existsBy('id',$user_id)) return DV::error('Failed to create pending update task because the user identity is not valid');  
     
        if(!in_array($action_name,$allowed_actions)) return DV::error('Action name is not correct!');  
        
        //Leave 2 minutes for pending tasks to be finished, otherwise delete them
       $expire_time = Carbon::now()->addMinute(2);
       $login_name = UM::getUserProp($user_id,'login_name');
       DB::table('change_info_otp')->where('branch_id',$branch_id)->where('user_id',$user_id)->where('action_name',$action_name)->delete();
       DB::table('change_info_otp')->insert(array(
           'branch_id'=>$branch_id,
           'login_name'=>$login_name,
           'user_id'=>$user_id,
           'action_name'=>$action_name,
           'org_value'=>$org_value,
           'new_value'=>$new_value,
           'otp_code'=>$otp_code,
           'expiry_time'=>$expire_time,
           'create_date'=>getNowTime()
       ));
       return DV::success();
    }

    //delete expired pending_tasks in table "change_info_otp"
    static function clear($branch_id=null){
        $now = getNowTime();
        if($branch_id>0)
          DB::table('change_info_otp')->where('branch_id',$branch_id)->whereRaw("expiry_time  <='$now'")->delete(); 
        else
          DB::table('change_info_otp')->whereRaw("expiry_time <='$now'")->delete(); 
        return null;  
    }

    //NOTE: change phone number also => changes the login name too
    //action_name ={'change_phone_number','change_email'}
    static function finish($action_name,$user_id,$otp_code){
        $row = DB::table('change_info_otp')->where('user_id',$user_id)->where('action_name',$action_name)->selectRaw("login_name,org_value,new_value,otp_code")->take(1)->first();
        //$org_value = null;
        $new_value = null;
        $login_name = null;
        $org_otp_code = null;
      
        if(!$row){
            //OTP record is not found!
            \Log::error('otp task error: OTP record for user_id: '.$user_id.' action: '.$action_name.' OTP_code: '.$otp_code.' NOT found. So action was not complete!');
            return DV::error('It seems the OTP code or action was expired or not found!');
        }
        //$org_value = $row->org_value;
        $new_value = $row->new_value;
        $login_name = $row->login_name;
         $org_otp_code = $row->otp_code;
    
        //$otp_code is otp_code provided by user for verifying
        if ($org_otp_code && $org_otp_code != $otp_code) return DV::error('otp code is not correct!'); 
        if (!$login_name) return DV::error('Login identity was not found. This can be caused by wrong user ID!'); 
        $task_done = false;
        $user = UM::getUserProps($user_id,'user_class,official_id,phone_number');
        if(!$user) return DV::error('User identity is not correct '.$user_id); 
   
        if($user){
            //if($user->user_class ==='merchant' || $user->user_class ==='sender'){
                //$id = Sender::getSenderProp($user->official_id,'id'); 
                //if(!$id) return DV::error('Merchant identity is unexpectedly invalid!'); 

                 switch($action_name){
                     case 'change_phone_number':{
                        //DB::table('sender')->where('id',$user->official_id)->update(array('phone_number'=>$new_value));
                        \App\Models\Dms\UM::updatePhoneNumber($new_value,$user_id);
                        //if($err) return DV::error('មិនទាន់អាចប្ត្តរលខទូរសព្ទ័. '.$err);
                        $task_done =true;
                        break;
                     }case 'change_email':{
                        //DB::table('sender')->where('id',$user->official_id)->update(array('email'=>$new_value));
                         \App\Models\Dms\UM::updateEmail($new_value,$user_id);
                        //if($err) return DV::error('មិនទាន់អាចប្ត្តរ email. '.$err);
                        $task_done =true;
                        break;
                     }case 'change_login_name':{
                        //DB::table('sender')->where('id',$user->official_id)->update(array('phone_number'=>$new_value));
                        return DV::error('Action to change login name is not allowed!');
                        break;
                     }
                     default:{
                        return DV::error('Action name is not valid');
                        break;
                    }
                 }
            //}
            // else if ($user->user_class='driver'){
            //     switch($action_name){
            //         case 'change_phone_number':{
            //            DB::table('driver')->where('id',$user->official_id)->update(array('phone_number'=>$new_value));
            //            DB::table('um_users')->where('id',$user_id)->update(array('login_name'=>$new_value,'phone_number'=>$new_value));
            //            $task_done =true;
            //            break;
            //         }case 'change_email':{
            //            DB::table('driver')->where('id',$user->official_id)->update(array('email'=>$new_value));
            //            $task_done =true;
            //            break;
            //         }case 'change_login_name':{
            //            //DB::table('driver')->where('id',$user->official_id)->update(array('phone_number'=>$new_value));
            //            return DV::error('Action unspecified');
            //            break;
            //         }default:{
            //             return DV::error('Action name is not valid');
            //             break;
            //         }
            //     }  
                   
            // }

            if ($task_done ==true) {
                self::clear();
                DB::table('change_info_otp')->where('otp_code',$otp_code)->where('user_id',$user_id)->delete();
                return DV::success();
            }  
        }
    }

}
