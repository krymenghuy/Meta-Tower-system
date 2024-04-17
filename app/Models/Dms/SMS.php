<?php

namespace App\Models\Dms;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\Dms\UM;
use App\Models\Dms\DV;
//use Carbon\Carbon;
use DB;
use Sanitizer;
use Config;
use Illuminate\Support\Facades\Log;
class SMS //extends Model
{
    //use HasFactory;
    //$d = {phone_number , text, [sender_name]}
    function sendSMS($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $phone_numbers = isset($d->phone_numbers)?Sanitizer::sanitize($d->phone_numbers):null;
        $text = isset($d->text)?$d->text:null;
        $sender_name = isset($d->sender_name)?$d->sender_name:null;
        return self::send($phone_numbers,$text,$sender_name='SMS Info');
    }
     
    static function _getAuthCode(){
        $password = Config::get('app.plasgate_sms_password'); //'Ex0!s9Y^'
        $user_name =Config::get('app.plasgate_sms_user'); //'broexpress_prp';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://restapi.plasgate.com/v1/authorize");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));
   
        $fields = (object)array(
            'username'=>$user_name,
            'password'=>$password
        );
        curl_setopt($ch,CURLOPT_POSTFIELDS, json_encode($fields));     
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1); // Do not send to screen
        curl_setopt($ch, CURLOPT_POST, 1);				 
        curl_setopt($ch,CURLOPT_SSL_VERIFYPEER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
         
        $try_timeout = 600;
        curl_setopt($ch,CURLOPT_TIMEOUT,$try_timeout); // Set timeout to 60s
		curl_setopt($ch, CURLOPT_FAILONERROR, true); // Required for HTTP error codes to be reported via our call to curl_error($ch)
		  	 
		// Execute request
		$json_string = curl_exec($ch);

		// Check if any error occurred
        $err_message = null;
		if (curl_errno($ch)) {
			$err_message =curl_error($ch); //'Failed to access the source server'
			 if (strpos($err_message,'Could not resolve host') == true) $err_message ="Failed to connect to the SMS server. You may check your internet connection";	   
		}
        curl_close($ch);
        $result = (object)array('status'=>'OK','error_message'=>null);
        if($err_message) return DV::error($err_message);
        $obj = json_decode($json_string);
        return DV::success(['authorization_code'=>$obj->data->authorization_code]);
    }

    static function _getAccessToken(){
        $m = self::_getAuthCode();
        if ($m->status =='Error') return DV::error($m->error_message);  

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://restapi.plasgate.com/v1/accesstoken");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));
   
        $fields = (object)array(
            'authorization_code'=>$m->authorization_code
        );
        curl_setopt($ch,CURLOPT_POSTFIELDS, json_encode($fields));     
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1); // Do not send to screen
        curl_setopt($ch, CURLOPT_POST, 1);				 
        curl_setopt($ch,CURLOPT_SSL_VERIFYPEER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
         
        $try_timeout = 600;
        curl_setopt($ch,CURLOPT_TIMEOUT,$try_timeout); // Set timeout to 60s
		curl_setopt($ch, CURLOPT_FAILONERROR, true); // Required for HTTP error codes to be reported via our call to curl_error($ch)
		 
			 
		// Execute request
		$json_string = curl_exec($ch);

		// Check if any error occurred
        $err_message = null;
		if (curl_errno($ch)) {
			$err_message =curl_error($ch); //'Failed to access the source server'
			 if (strpos($err_message,'Could not resolve host') == true) $err_message ="Failed to connect to the SMS server. You may check your internet connection";	   
		}
        curl_close($ch);
        if($err_message) return DV::error($err_message);
        $obj = json_decode($json_string,true);
        return DV::success(['access_token'=>$obj['data']['access_token']]);
    }
    
    static function formatPhoneNumber_static($d){
        $new_num = null;
        if (empty($d)) return null;
        $d = trim(str_replace(' ','',$d));
        if (substr($d,0,1) =='0')
        {
            $new_num = '855'.substr($d,1,strlen($d)-1);
        }else if (substr($d,0,3) =='855'){
            $new_num = $d;
        }else if(substr($d,0,4) =='+855'){
            $new_num = substr($d,1,strlen($d)-1);
        }
        return $new_num;

    }

    function formatPhoneNumber($d){
        return self::formatPhoneNumber_static($d);
    }
 
    static function send($phone_number, $text = null, $sender_name = null) {
       try{
        $sender_name = $sender_name ?? config::get('app.plasgate_sms_sender_name');
        if (empty($text) || empty($phone_number)) return DV::error("phone_number or text cannot be empty");
        $private = Config::get('app.plasgate_private_key');
        $secret = Config::get('app.plasgate_sms_secret');
        $payload = ['sender'=>$sender_name,'to'=>  self::formatPhoneNumber_static($phone_number),'content'=> $text];
 
        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_URL => 'https://cloudapi.plasgate.com/rest/send?private_key=' . $private,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT =>0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_SSL_VERIFYPEER => 2,
            CURLOPT_FAILONERROR=>true,
            CURLOPT_CAINFO => storage_path('plasgate/ed4af1b392f59973.pem'), 
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => array(
                'X-Secret: ' . $secret,
                'Content-Type: application/json'
            ),
        ));

        $json_string = curl_exec($ch);
        $err_message = null;
    
        if (curl_errno($ch)) {
            $err_message = curl_error($ch);
            if (strpos($err_message, 'Could not resolve host') !== false) {
                $err_message = "Failed to connect to the SMS server. You may check your internet connection";
            }
        }
        
        curl_close($ch);
        if ($err_message) {
            return DV::error($err_message);
        }
        
        return DV::success(['data' => json_decode($json_string, true)]);
       }catch(\Exception $e){
         Log::error('Failed to send sms: '.$text. ' to number '.$phone_number);
         Log::error($e->getMessage());
         Log::error($e->getTraceAsString());
       }
    }
 
    function _sendSMS($phone_numbers,$text=null,$sender_name= null){
       self::send($phone_numbers,$text=null,$sender_name= null);
    }
    
    static function getMessageTemplate($branch_id,$purpose,$otp=null){
        $purpose = strtolower($purpose);
        $b = DB::table('um_branches as b')->where('branch_id',$branch_id)->selectRaw('name,phone_number')->first();
        $company_name = $b?$b->name.': ':'';
        switch($purpose){
            case "change_password":{
                return $company_name. ' លេខសំងត់ '.($otp?$otp:"otp_code").' សំរាប់ប្តូរពាក្យសំងាត់';
                break;
            }
            case "reset_password":{
                return $company_name. " លេខសំងត់ ".($otp?$otp:"otp_code")." សំរាប់ប្តូរពាក្យសំងាត់";
            }
            case "forget_password":{
                return $company_name." លេខសំងត់ ".($otp?$otp:"otp_code")." សំរាប់ប្តូរពាក្យសំងាត់";
            }
            default:{
                return $company_name. " លេខសំងត់ ".($otp?$otp:"otp_code");
                break;
            }
        }
    }

}
