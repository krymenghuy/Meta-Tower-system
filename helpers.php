<?php
 use Illuminate\support\Facades\Auth;
 use Illuminate\Support\Facades\DB;
 use Carbon\Carbon;

function escape_like_str($str) {
    return str_replace(['\\', '%', '_'], ['\\\\', '\%', '\_'], $str);
}

//return UNIQUE random  string at a given length
function getUniqueString($length)
{
      $random= "";

  srand((double)microtime()*1000000);

  $data = "AbcDE123IJKLMN67QRSTUVWXYZ";
  $data .= "aBCdefghijklmn123opq45rs67tuv89wxyz";
  $data .= "0FGH45OP89";

  for($i = 0; $i < $length; $i++)
  {
      $random .= substr($data, (rand()%(strlen($data))), 1);
  }
  return $random;
}

//returns $result object {'error_message'=>'some error message here','status'=>'Error'} if one of the given @fields[] is empty. @fields = ['name','phone_number',...]
//$d is an object $d = {'name','phone_number','email','address',...}
function nonEmptyFields($d,$fields){
   $aa =$d; 
   $result = (object)['error_message'=>null,'status'=>'OK'];
   foreach($fields as $f){
       $val = isset($d->{$f})?$d->{$f}:null;
        if (empty($val)){
            $result->error_message = "Field `$f` is required";
            $result->status ='Error';
            return $result;
        } 
   }
   return $result; 
}

//Task such as changing Phone number requires OTP_CODE
//$sms_text = 'អរគុណសំរាប់ការចុះឈ្មោះ​។ លេខសម្ងាត់ #'
function createPendingTask($ss,$db_action,$sms_text,$sql_text){
     $branch_id = $ss->branch_id;
     $login_name = $ss->login_name;
     $user_id = $ss->user_id;
     $official_id = isset($ss->official_id)?$ss->official_id:null;
     $org_phone_number =UM::getUserProp($user_id,'phone_number'); 

     if (empty($db_action)) $db_action ="unspecified";
     //if (empty($otp_code)) return "Failed to create pending task. OTP CODE cannot be empty";
      
     $otp_code = $this->newOTP(6);
     $sms_text = str_replace('#',$otp_code,$sms_text);

     $smsModel = new SMS();
     $m_result = $smsModel->_sendSMS($phone_number,$sms_text,null); 

     if ($m_result->status=='Error') {
        $err = "Failed to create pending task.".isset($m_result->error_message)?$m_result->error_message:null;
        return $err;
     }else{
         //start:: create text file sql file

         //end:: create text file or sql file
         
        $expiry_time = Carbon::now()->addSecond(60);
        DB::table('pending_tasks')->insert(array(
           'branch_id'=>$branch_id,
           'user_id'=>$user_id,
           'official_id'=>$official_id,
           "action_file_name"=>$file_name,
           "action_file_type"=>$file_type,
           "otp_code"=>$otp_code,
           "expiry_time"=>$expiry_time 
        ));
        return null;
     }
 
}

function completePendingTask($user_id,$phone_number,$otp_code){
 
}
 
function newOTP($length=6)
{
    return join('', array_map(function($value) { return $value == 1 ? mt_rand(1, 9) : mt_rand(0, 9); }, range(1, $length)));
}


//$d = {'acc_tk_dms','decrypted'=> 0 or 1}. If "decrypted =1" => no need to run decryption again, this is in case of external api
function getSessionInfo($d){
    //Todo: Catch error if $d is not an object for unexpected case
    if (!isset($d->decrypted)) $d->decrypted = 0;
    //if(!isset($d->is_cookie)) $d->is_cookie = 0; /** NOTE: if is_cookie = 1 => the decrypted value is split by vertial bar | for equal sign (= ) or key = value pair **/
    /**instead of property "access_token", we use prop name as "acc_tk_dms" **/
  //if (!empty($d->bearerToken())) $d->acc_tk_dms = $d->bearerToken();  
  if(!isset($d->acc_tk_dms)) return null; //$d->access_token ='nI082mwubtCp0Tc92MRX9107tnvQfjiGd56pj8';
  //else if($d->bearerToken() ==null) return null;

  $decrypted_token = null;
  if ($d->decrypted != 1) {
            // get the encrypter service
            $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
            // decrypt
            $decrypted_token = $encrypter->decrypt($d->acc_tk_dms,false); //FALSE => to avoid serialization issue in decryption
            /*** IMPORTANT NOTE: 
             $result of decryption is => e3aab7a9bb6892c7ee1a1495300d667fe8823428|o1MZKGPJIHm3S6kqiG415LWEidURA75QAI2GGE => therefore, we need to split this key|value by vertical bar character | 
            ***/
            if (strpos($decrypted_token,'|')>0) {
                $parts = explode('|',$decrypted_token);
                if(isset($parts[1])) 
                   $decrypted_token = $parts[1];
                else return null;
            }  
  } else $decrypted_token = $d->acc_tk_dms;  /** In case externam API called from mobile app => the $d->acc_tk_dms is decrypted already by, for example, by $senderModel->getSenderInfoByToken($request) **/
    
   if(session()->has('access_token')) {
          if (session('access_token') === $decrypted_token){
               $data =(object)[];
               $data->branch_id = session('branch_id',0);
               $data->user_id = session('user_id',0);
               $data->login_name = session('login_name',0);
               //$data->full_name = session('full_name',0);
               $data->last_active_time = Carbon::now();
               return $data;
          }
      }

  $rows = DB::table('um_sessions AS u')->where('u.access_token',$decrypted_token)->selectRaw('u.branch_id,u.user_id, u.login_name,u.last_active_time,u.login_name')->limit(1)->get();
  foreach($rows as $row) {
      //TODO: check for last active_time compared to now() for session expiration
      return $row;
  } 
  return null;
}

/***
  NOTE: $d->data.status ='Error' => it is usually data validation error. such as project name cannot be empty etc... 
        $d->status ='Error' => there are two improtant cases
          (1). $d->status_code ='350' => Error User unauthenticated
          (2). $d->status_code ='360'=>Error User does not have permission to do the intended action 
        $status_code = {300,350,360}. 300 = whatever general error caught arbitrarily, 350 = "User not logged in". 360 = "User does not have permission"  
 ***/
/** if error_message NOT empty = > $d->status ='Error' **/
function makeJsonResponse($data,$error_code=300,$error_message=null) {
    $d = (object)[]; 
    
     if($error_code ==350 || $data =='#350')
     {
        $data =null;
        $error_message ="Authentication failed. Error code: 100"; /** user not authenticated **/
     } 
       
     if($error_code ==351) 
       $error_message ="access token is null or not missing"; /** user not authenticated **/
     else if ($error_code ==360) 
       $error_message ="Permission is required to carry out this task. Status code: 360";
     if (!empty($error_message))     
         {
           if (empty($error_code)) $error_code =300;
           $d->status ='Error';
           $d->error_message = $error_message;
           $d->status_code = $error_code;
         }
     else {
       $d->status ='OK';
       $d->status_code =200;
       $d->error_message = null;
     }
        $d->data = $data;  
   return response()->json($d);
}

function prn_allowed($prn_id){
    return true;
} 

 function getLastDayOfMonth($mDate)
 {
     $mDate = $this->convertDate($mDate);
     $date = new DateTime($mDate);
     $date->modify('last day of this month');
     $last_date =  $date->format('Y-m-d');
     return $last_date;
 }

 function processQueryString($query_string=null,$sanitize =true,$allow_chars=[]){
    $cs=[];
    $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
    $query_string = $encrypter->decrypt($query_string,false); //FALSE => to avoid serialization issue in decryption
    parse_str($query_string, $cs);
    foreach($cs as $name => $value) {
        if ($sanitize == true || $sanitize == 1) 
          $cs[$name] = (is_string($value))? sanitize($value,$allow_chars) : $value;
        else
           $cs[$name] = $value;    
     } 
       
     $obj = (object)($cs); //Convert first layer props to object (NOT recursive casting, so if the array is nested, please process specific prop manually for better performance)
     //print_r('my input = '.$data);
     return  $obj;
 }

/** create a file in a directory. Create directories if they do not exist **/	
function createFile($file_type,$fileName, $fileContent){
    //TODO: Check file size before saving
    $file_type = trim(strtolower($file_type));
     $result = (object)array('error'=>null,'filename'=>null); 
      //$result->error = $file_type;
      //return $result;
      $dir = dirname($fileName);
      if (!file_exists($dir)) {
         mkdir($dir, 0755, true); //permission
          //$result->error = 'Storage file or folder does not exist';
          //return $result;
      }
    //$file_type ='x-msdownload' //Executable file .exe
     $img_types = ['jpg','png','jpeg','svg','pdf'];       
    // $parts = explode('/', $dir);
     // $file = array_pop($parts);
     // $dir = '';
     // foreach($parts as $part)
         // if(!is_dir($dir .= "/".$part)) mkdir($dir);
         
         
    /* First stepSecurity: clean up using code-ignitter function */
    //$fileContent = $this->security->xss_clean($fileContent);
    
    # Decode the Base64 string, making sure that it contains only valid characters
     $bin = base64_decode($fileContent, true);
     $test = base64_encode($bin);
     if ($test != $fileContent) {
         $result->error= "Invalid file content";
         return $result;
     }			
       
     # Perform a basic validation to make sure that the result is a valid PDF file
     # Be aware! The magic number (file signature) is not 100% reliable solution to validate PDF files
     # Moreover, if you get Base64 from an untrusted source, you must sanitize the PDF contents
     $ext ='';
     if ( strpos($file_type,'vnd.openxmlformats-officedocument.wordprocessingml') !== false )//Word
     {
         $ext= '.docx';
     } else if (strpos($file_type,'msword') !==false)
     {
         $ext= '.doc';
     }			
     else if (strpos($file_type,'vnd.openxmlformats-officedocument.spreadsheetml') !== false)//Excel
     {
         $ext= '.xlsx';
     }
     else if ($file_type =='pdf') //PDF
     {
         $ext= '.pdf';
         if (strpos($bin, '%PDF')  != 0 ) 
         {
             $result->error = "This pdf file does not have PDF file signature";
             return $result;
         }
          
           
     } else if (in_array($file_type,$img_types)) //image files
     {
         $ext= ".".$file_type; // in this case: use $file_type as extension directly
     } else  {
          
         $result->error= "This file file type is not allowed";
         return $result;
     }
      
     if(empty($ext)) {
         $result->error= "Invalid file type";
         return $result;
     }
       
     $success = file_put_contents($fileName.$ext, $bin);
     
     // $myfile = fopen($dir."/".$file, "w") or die ("Unable to open file!");
     
     // fwrite($myfile, $contents);
     // fclose($myfile);
     $result->filename = $fileName.$ext;
     $result->extension= $ext;
     return (object)$result;
 }
function deleteFile($fileName)
{
  if (file_exists($fileName)) {
     unlink($fileName);
     return null;
  } else return "File not found for deleting"; 
 
}

function readFileContent($fileName=null)
{    
 if (empty($fileName)) return null;   
 if (!file_exists($fileName)) return null;
 $fileSize = filesize($fileName);
 if ($fileSize<=0) return null;
 $handle = fopen($fileName, "r");
 $contents = fread($handle, $fileSize);
 fclose($handle);
 return $contents;
}	
// function readFileContentLineByLine($path) {
 // $lines = []; //read lines into array of lines
 // $handle = fopen($path, "r");

 // while(!feof($handle)) {
     // $lines[] = trim(fgets($handle));
 // }

 // fclose($handle);
 // return $lines;
// }

function getFileExtension($file_name) {
  return pathinfo($file_name, PATHINFO_EXTENSION);
}
	
function getMIMEType($fileName =null)
{
  if (!$fileName) return null;
  $ext = $this->getFileExtension($fileName);
  if ($ext =='pdf') return "application/pdf";
  else if ($ext =='xlsx') return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  else if ($ext =="xls" ) return "application/vnd.ms-excel";
  else if ($ext =="xlsm") return "application/vnd.ms-excel.sheet.macroEnabled.12"; 	
  else if ($ext =="docx") return "application/vnd.openxmlformats-officedocument.wordprocessingm";	
  else if ($ext =='doc') return "application/msword";
  else if ($ext =="gif") return "image/gif";
  else if ($ext =="jpg") return "image/jpeg";
  else if ($ext =="png") return "image/png"; 
  return $ext;	 
}	 

    function thisAppId()
    {
    return '7E33ZA1E2D7811EB92C09801A7B0D2FC'; 
    }
       
   function getNowTime()
   {
       return Carbon::now()->format("Y-m-d H:i:s");
   }
   
   //change date format to yyyy-mm-dd
   function convertDate($date)
   {
       if(!(bool)strtotime($date)) return null;
       
       return date('Y-m-d H:i:s', strtotime($date));
   }

   function formatNumber($num,$len)
    {
        if ($len<=0) $len =5;
        return str_pad($num, $len, '0', STR_PAD_LEFT);
    }
    
    // //the following functions return value of Session variables to be used in .blade or javascript file, for example: {{sess_user_token}}
    // function sess_user_token(){
    //     return Session('access_token',null);
    // }

    public function sess_company_id(){
        return Session('branch_id',null);
    }

    public function sess_user_id(){
        return Session('user_id',null);
    }

    //return base_url to be used  in "reports/genreport.blade.php" (css and script)
    public function base_url($url=null){
       return URL::to('/').$uri;
    }
 
 //@key can be id that refers to column (settings_string.id) or a key that refers to (settings_string.key)
/** for example, you can call get_settings_value(1,"string") or get_settings_value("default_currency","string"), both ways return a default currency code  **/ 
 function get_settings_value($user_session,$key,$valueType)
 {
     $branch_id = $user_session->branch_id;  
	 //ValueType = {'string','number'}
	 $setting_table= null;
	 if ($valueType =='number')
	   $setting_table = 'settings_number';
	  else
	  $setting_table = 'settings_string'; /* this case can be String or Date value */
    
      $rows =null;
     if (is_numeric($key)) 
	   $rows= DB::table($setting_table)->where('branch_id',$branch_id)->where('id',$key)->selectRaw('value')->limit(1)->get();
     else
     $rows= DB::table($setting_table)->where('branch_id',$branch_id)->where('key',$key)->selectRaw('value')->limit(1)->get(); 	 
	 foreach($rows as $row)  return $row->value;
	 return NULL;
	 //Todo: create error log behind the scense, when get_settings_value() could not find keyname => for support user to knows why something strange happens sometimes
 }
  
 function save_setting($user_session,$type,$key,$value,$description =null)
 {
	$branch_id = $user_session->branch_id; 
	$tbl ="settings_string";
    if (strtolower($type) =='number') $tbl ="settings_number";
    $rows = [];
    $f = " `key` ='".$key."' "; 
    // if ($key > 0){
    //    $f = " `id1` ='".$key."' ";     	
    //    $rows = DB::table($tbl)->where('branch_id',$branch_id)->whereRaw($f)->select('branch_id')->limit(1)->get();
    // }
    // else
    $rows = DB::table($tbl)->where('branch_id',$branch_id)->whereRaw($f)->selectRaw('branch_id')->limit(1)->get(); 
       foreach($rows as $row) {
            DB::table($tbl)->where('branch_id',$branch_id)->where('key',$key)->update(array(
                'value'=>$value
            ));
        return null;  
      }

     DB::table($tbl)->insert(array(
         'branch_id'=>$branch_id,
         'key'=>$key,
         'value'=>$value,
         'description'=>$description
     ));
     return null;
 }

 
 function getDefaultCurrency($user_session)
 {
     $branch_id = $user_session->branch_id;
	 $code = $this->get_settings_value('default_currency','string');
     $rows = DB::table('currencies')->where('branch_id',$branch_id)->where('code',$code)->selectRaw('code,symbol')->limit(1)->get();
	 foreach($rows as $row) return $row;
     $this->save_setting($user_session,'string','default_currency','USD','Default currency');
     return (object)array('code'=>'USD','symbol'=>'$');

  }
  
 function getMonthName_full($num)
 {
	 if ($num < 1) $num =1;
	 $months = array(0=>'January',1=>'February',2=>'March',3=>'April',4=>'May',5=>'June',6=>'July',7=>'August',8=>'September',9=>'October',10=>'November',11=>'December');
	 
	 return $months[($num-1)];
 }
 

 function getEncodedChar($c=null)
	 {
		 if ($c == "-")
                return "&U01;";
            if ($c == "$")
                return "&U02;";
            else if ($c == "(")
                return "&U03;";

            else if ($c == ")")
                return "&U04;";

            else if ($c == "@")
                return "&U05;";

            else if ($c == "/")
                return "&U06;";

            else if ($c == "#")
                return "&U11;";

            else if ($c == ":")
                return "&U09;";

            else if ($c == ";") // This is special case because semicolon is used in encoding, for example &U14;
                return ";";

            else if ($c == "&")
                return "&";

            else if ($c == "=")
                return "&U14;";

            else if ($c == "\\")
                return "&U13;";

            else if ($c == ".")
                return "&U16;";

            else if ($c == ",")
                return "&U17;";
            else if ($c == "?")
                return "&U18;";

            else if ($c == "[")
                return "&U19;";
            else if ($c == "]")
                return "&U20;";
            else if ($c == "+")
                return "&U21;";
            else if ($c == "'")
                return "&U10;";
            else if ($c == "\"")
                return "&U22;";
            else
                return "";
	 }
	
	function sanitize($text,$allowed_chars=[])
	{
	  if (is_numeric($text)) return $text;
	  //if ((bool)strtotime($text)) return $text;
	  if ($allowed_chars =='email') {
        if (filter_var($text, FILTER_VALIDATE_EMAIL)) {
            return $text; 
        } else return null;
      }

	  $badChars = [".",",","~", "^","(", ")", "@", "&","&amp;", "!", "$", "#", "*", ";", "/","+", "-", "%", "=", "\"", "'", "\\", ":", "<", ">", "&quot;", "&lt;", "&gt;", "&#x27;", "&#x2F;", "&#60;", "&#62;", "&#34;", ".fromCharCode","{","}","[","]","?" ];
       
	  $badCharCount = 32; /* No need to loop for counting array again */
	  $i = 0;
	  $c = null;
	  $cnt = $badCharCount -1;
	  
	  // $mBadChars = array();
	  // $mGoodChars = array();
	  
	  do{
	    //if (isset($badChars[$i]))
		$c = $badChars[$i];
	    $x = strpos($text,$c); /* Check for bad character inside the whole string */
		
		if ($x != FALSE && $x >=0) /* There is bad character in this string ($text) */
		{		 
			// $mBadChars[] = $c;
			// $mGoodChars[] = $this->getEncodedChar($c);
			
			 // /*if we allow this special char then replace it with encoded char, Otherwise, remove this bad char */
			 if (in_array($c,$allowed_chars))
				$text = str_replace($c,$this->getEncodedChar($c),$text);
			 else 
				$text = str_replace($c,'',$text);
				//$text = str_replace(',','&U11;',$text);
		}
	    $i++;
	  }while($i <=$cnt);
	  
	 
	  return $text; 
	  //return $this->db->escape_str($text);
	}
	
	function seo_friendly_url($string){
		$string = str_replace(array('[\', \']'), '', $string);
		$string = preg_replace('/\[.*\]/U', '', $string);
		$string = preg_replace('/&(amp;)?#?[a-z0-9]+;/i', '-', $string);
		$string = htmlentities($string, ENT_COMPAT, 'utf-8');
		$string = preg_replace('/&([a-z])(acute|uml|circ|grave|ring|cedil|slash|tilde|caron|lig|quot|rsquo);/i', '\\1', $string );
		$string = preg_replace(array('/[^a-z0-9]/i', '/[-]+/') , '-', $string);
		return strtolower(trim($string, '-'));
	}

   function sanitizeIn($value,$type=null)
	{
		if (is_numeric($value) || !$value) return $value;
		
		switch ($type)
		{
			case 'email':
			{
				return filter_var($value, FILTER_SANITIZE_EMAIL);
				break;
			}
			case 'date':
			{
				if((bool)strtotime($value)) return $value;
				break;
			}
			case 'url':
			{
				return $this->seo_friendly_url($value);
				break;
			}				
			default:
			{
				return $this->sanitize($value,null);
				break;
			}
		}
		   
		//return strip_tags($value);
		//return htmlentities($value,ENT_QUOTES, 'UTF-8');
	    return sanitize($value); 
	}
   
 
    function getStoragePath($private=false){
        if($private)
          {
            $path = Storage::disk('private')->path('');
          }else{
             //$path = Storage::disk('public')->path('');
             $path = getcwd(). "/uploads/companies/";
          }
        return $path;
    }

    //return public url
    function getStorageUrl(){
      return url('')."/uploads/companies/";
    } 

    function getMerhcantAppId(){
      return "38DC051E122D11EC89909801A7B0D1FCH";
    }

    function getDriverAppId(){
        return "584C7FF2122D11EC89909801A8B0D7XKD";
    }
?>