<?php

namespace App\Communication;
use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use Session;
use Carbon\Carbon;
use DB;

class SMS
{
    use HasFactory;

    //$d = {phone_number , text, [sender_name]}
    function sendSMS($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $phone_numbers = isset($d->phone_numbers)?sanitize($d->phone_numbers):null;
        $text = isset($d->text)?$d->text:null;
        $sender_name = isset($d->sender_name)?$d->sender_name:null;
        return self::send($phone_numbers,$text,$sender_name='SMS Info');
    }
     
    static function _getAuthCode(){
        $password = 'Ex0!s9Y^';
        $user_name ='broexpress_prp';
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
        if ($err_message == null) {
            $result->status='OK';
            $result->error_message = null;
        }else {
            $result->status ='Error';
            $result->error_message = $err_message;
            return $result;
        }
        $obj = json_decode($json_string);
        $result->authorization_code = $obj->data->authorization_code;
        return $result;
    }

    static function _getAccessToken(){
        $result = (object)array('status'=>'OK','error_message'=>null); 
        $m = self::_getAuthCode();
        if ($m->status =='Error') {
            $result->status = 'Error';
            $result->error_message = $m->error_message;
            return $result; 
        }

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
        $result = (object)array('status'=>'OK','error_message'=>null);
        if ($err_message == null) {
            $result->status='OK';
            $result->error_message = null;
        }else {
            $result->status->status='Error';
            $result->error_message = $err_message;
            return $result;
        }
        $obj = json_decode($json_string,true);
        $result->access_token = $obj['data']['access_token'];
        return $result;
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

    // send() is a static function and is the same as _sendSMS(). But $this->sendSMS() is different in @parameter
    static function send($phone_numbers,$text=null,$sender_name= null){
        if (empty($sender_name)) $sender_name ='SMS Info'; //Note that $sender_name or senderID needs to be registered with Plasgate telecom company
        if (empty($text) || empty($phone_numbers)) return "phone_numbers or text cannot be empty";
        $nums = [];
        $result = (object)array('status'=>'OK','error_message'=>null);
        if (strpos('|',$phone_numbers)) 
             $nums = explode('|',$phone_numbers);
        else $nums = explode(',',$phone_numbers);
        $numbers = [];
        foreach($nums as $num) $numbers[] = self::formatPhoneNumber_static($num);  
        $fields = array(
          (object)['number'=>$numbers, //must be array
          'senderID'=>$sender_name,
          'text'=>$text,
          'type'=>'sms',
          "lifeTime"=>555,
          "delivery"=>false]
        );
 
        $m = self::_getAccessToken();
        if ($m->status =='Error') {
            $result->status ='Error';
            $result->error_message = $m->error_message;
            return $result;
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://restapi.plasgate.com/v1/send");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'X-Access-Token: '.$m->access_token
        ));
             //curl_setopt($ch, CURLOPT_HTTPHEADER, array('x-api-key: XXXXXX', 'Content-Type: text/plain'));
             curl_setopt($ch,CURLOPT_POSTFIELDS, json_encode($fields));     

				//curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
				 
				curl_setopt($ch, CURLOPT_RETURNTRANSFER,1); // Do not send to screen
				//WHEN SET CURLOPT_RETURNTRANSFER TO FALSE => the resulting json string has '1' at the end of string causing fucking shit error in ajax receiving method.
				//curl_setopt($ch, CURLOPT_RETURNTRANSFER,false); 
              //curl_setopt($ch, CURLOPT_HEADER, TRUE);
            curl_setopt($ch, CURLOPT_POST, 1);
            //Following two lines make insecure connection, by neglecting SSL verification
            curl_setopt($ch,CURLOPT_SSL_VERIFYPEER, 1);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        
             $try_timeout = 600;
             curl_setopt($ch,CURLOPT_TIMEOUT,$try_timeout); // Set timeout to 60s
			 curl_setopt($ch, CURLOPT_FAILONERROR, true); // Required for HTTP error codes to be reported via our call to curl_error($ch)
		 
				// *** Remember that when you want cURL to connect to SSL and verify the certificate you priorly have to download and save the CA certificate (firefox can do this) to your application and reference it in your cURL call. For example: **//

				// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
				// curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
				// curl_setopt($ch, CURLOPT_CAINFO, getcwd() . "/CACertificats/AddTrustExternalCARoot.crt");
				//curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
				//curl_setopt($ch,CURLOPT_USERPWD,$user.':'.$pass); // Set uname/pass
				 
				// Execute request
				$json_string = curl_exec($ch);

				// Check if any error occurred
                $err_message = null;
				if (curl_errno($ch)) {
				   $err_message =curl_error($ch); //'Failed to access the source server';
				   //$info = curl_getinfo($ch);  //$info['total_time'] $info['ssl_verify_result'] = {0,1}
				   //$err_message = var_dump($info);// 'ssl_verified = '.$info['ssl_verify_result'];
				   if (strpos($err_message,'Could not resolve host') == true) $err_message ="Failed to connect to the SMS server. You may check your internet connection";
				   
				}
        curl_close($ch);
         
        if ($err_message == null) {
          $result->status ='OK';
          $result->error_message = null;
          $result->data = json_decode($json_string,true);
          return $result;
        }else {
            $result->status ='Error';
            $result->error_message = $err_message;
            $result->data = json_decode($json_string,true);
            return $result;
        }
    }

    function _sendSMS($phone_numbers,$text=null,$sender_name= null){
       self::send($phone_numbers,$text=null,$sender_name= null);
    }
    
    static function getMessageTemplate($purpose){
        $purpose = strtolower($purpose);
        if($purpose ==='change_password') return "លេខសំងត់ otp_code សំរាប់ប្តូរពាក្យសំងាត់";
        else return "លេខសំងាត់ otp_code សំរាប់"; 
    }

}
