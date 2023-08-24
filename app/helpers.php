<?php
 //use Illuminate\support\Facades\Auth;
 use Illuminate\Support\Facades\DB;
 use App\Models\UM;
 use Carbon\Carbon;
 use App\Models\DV;
 use Intervention\Image\Facades\Image;
 //BEGIN:: LocaleManager class

 //END:: LocaleManager class

 $mimeTypes = [
    'pdf'=>"application/pdf",
    'xlsx'=>"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    'xls'=>"application/vnd.ms-excel",
    'xlsm'=>"application/vnd.ms-excel.sheet.macroEnabled.12",
    'docx'=>"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    'doc'=>"application/msword",
    'gif'=>"image/gif",
    'jpeg'=>"image/jpeg",
    'jpg'=>"image/jpeg",
    'png'=>"image/png",
    'csv'=>"text/csv"
];

function escape_like_str($str) {
    return str_replace(['\\', '%', '_','\''], ['\\\\', '\%', '\_',''], $str);
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

/**
 * filter or search through $rows or $array based on a given value and return array of matched items
 * filterItems() returns empty array if no matches found
 * **/
 function filterItems($data, $property, $value) {
    if ($data instanceof Illuminate\Support\Collection || (is_object($data) && $data instanceof \Traversable)) {
        $matchedElements = $data->filter(function ($element) use ($property, $value) {
            $val = isset($element->{$property})?$element->{$property}:null;
            return  $val === $value;
        })->values()->all();

        if (empty($matchedElements)) {
            return [];
        }
        return $matchedElements;
    } elseif (is_array($data)) {
        $matchedElements = array_filter($data, function ($element) use ($property, $value) {
            return isset($element[$property]) && $element[$property] == $value;
        });

        if (empty($matchedElements)) {
            return [];
        }

        return array_values($matchedElements);
    }

    return [];
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

// //Task such as changing Phone number requires OTP_CODE
// //$sms_text = 'អរគុណសំរាប់ការចុះឈ្មោះ​។ លេខសម្ងាត់ #'
// function createPendingTask($ss,$db_action,$sms_text,$sql_text){
//      $branch_id = $ss->branch_id;
//      $login_name = $ss->login_name;
//      $user_id = $ss->user_id;
//      $official_id = isset($ss->official_id)?$ss->official_id:null;
//      $org_phone_number =UM::getUserProp($user_id,'phone_number');

//      if (empty($db_action)) $db_action ="unspecified";
//      //if (empty($otp_code)) return "Failed to create pending task. OTP CODE cannot be empty";

//      $otp_code = $this->newOTP(6);
//      $sms_text = str_replace('#',$otp_code,$sms_text);

//      $smsModel = new SMS();
//      $m_result = $smsModel->_sendSMS($phone_number,$sms_text,null);

//      if ($m_result->status=='Error') {
//         $err = "Failed to create pending task.".isset($m_result->error_message)?$m_result->error_message:null;
//         return $err;
//      }else{
//          //start:: create text file sql file

//          //end:: create text file or sql file

//         $expiry_time = Carbon::now()->addSecond(60);
//         DB::table('pending_tasks')->insert(array(
//            'branch_id'=>$branch_id,
//            'user_id'=>$user_id,
//            'official_id'=>$official_id,
//            "action_file_name"=>$file_name,
//            "action_file_type"=>$file_type,
//            "otp_code"=>$otp_code,
//            "expiry_time"=>$expiry_time
//         ));
//         return null;
//      }

// }


function newOTP($length=6)
{
    return join('', array_map(function($value) { return $value == 1 ? mt_rand(1, 9) : mt_rand(0, 9); }, range(1, $length)));
}


// function getAuthCode($d){

//     //Todo: Catch error if $d is not an object for unexpected case
//     if (!isset($d->decrypted)) $d->decrypted = 0;
//     //if(!isset($d->is_cookie)) $d->is_cookie = 0; /** NOTE: if is_cookie = 1 => the decrypted value is split by vertial bar | for equal sign (= ) or key = value pair **/
//     /**instead of property "access_token", we use prop name as "acc_tk_dms" **/
//   //if (!empty($d->bearerToken())) $d->acc_tk_dms = $d->bearerToken();
//   if(!isset($d->acc_tk_dms)) return null; //$d->access_token ='nI082mwubtCp0Tc92MRX9107tnvQfjiGd56pj8';
//   //else if($d->bearerToken() ==null) return null;

//   $decrypted_token = null;
//   if ($d->decrypted != 1) {
//             // get the encrypter service
//             $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
//             // decrypt
//             $decrypted_token = $encrypter->decrypt($d->acc_tk_dms,false); //FALSE => to avoid serialization issue in decryption
//             /*** IMPORTANT NOTE:
//              $result of decryption is => e3aab7a9bb6892c7ee1a1495300d667fe8823428|o1MZKGPJIHm3S6kqiG415LWEidURA75QAI2GGE => therefore, we need to split this key|value by vertical bar character |
//             ***/
//             if (strpos($decrypted_token,'|')>0) {
//                 $parts = explode('|',$decrypted_token);
//                 if(isset($parts[1]))
//                    $decrypted_token = $parts[1];
//                 else return null;
//             }
//   } else $decrypted_token = $d->acc_tk_dms;  /** In case external API called from mobile app => the $d->acc_tk_dms is decrypted already by, for example, by $senderModel->getSenderInfoByToken($request) **/

//    if(session()->has('access_token')) {
//           if (session('access_token') === $decrypted_token){
//                $data =(object)[];
//                $data->branch_id = session('branch_id',0);
//                $data->user_id = session('user_id',0);
//                //official_id is person_id in this context, and is necessary only for Borrower's login
//                $data->official_id = session('official_id',0);
//                $data->login_name = session('login_name',0);
//                //$data->full_name = session('full_name',0);
//                $data->last_active_time = Carbon::now();
//                return $data;
//           }
//       }

//   $rows = DB::table('um_sessions AS u')->join('um_user_roles AS ur','ur.user_id','=','u.user_id')->where('u.access_token',$decrypted_token)->selectRaw('ur.role_id,u.branch_id,u.user_id, u.login_name,u.last_active_time,u.login_name')->limit(1)->get();
//   foreach($rows as $row) {
//       //TODO: check for last active_time compared to now() for session expiration
//       return $row;
//   }
//   return null;
// }

function setOfficialCode($branch_id,$code_control_table,$target_table,$key_field=[],$def_prefix="",$len=5,Closure $onSuccess = null){
    if (!$key_field) return null;
    if(!$len) $len=5;

    $where_branch ="1=1";
    if($branch_id>0){
        $where_branch = "branch_id =$branch_id";
    }
    if ($def_prefix) $where_branch .=" AND prefix ='$def_prefix'";

    $str_where=null;
    foreach($key_field as $pk_field=>$pk_value) $str_where ="$pk_field='$pk_value'";
    if(!$str_where) return null;

    $rows = DB::table($code_control_table)->whereRaw($where_branch)->selectRaw("last_id,prefix")->take(1)->get();
    $next_num = 0;
    $prefix=null;
    foreach($rows as $row){
      $next_num = $row->last_id;
      $prefix =$row->prefix;
    }
    if(!$prefix) $prefix = $def_prefix;

    $next_num++;
    $new_code = $prefix.$branch_id.formatNumber($next_num,$len);

    $x = DB::table($target_table)->whereRaw($str_where)->update(['code'=>$new_code]);
    if($x || $x===1){
       $updated = DB::table($code_control_table)->whereRaw($where_branch)->update(['last_id'=>$next_num]);
       if (!$updated) DB::table($code_control_table)->insert(['branch_id'=>$branch_id,'prefix'=>$def_prefix,'last_id'=>$next_num]);
       if ($onSuccess) $onSuccess();
       return (object)['status'=>'OK','code'=>$new_code];
    }
    return null;
    //return $prefix.$branch_id.formatNumber(1,$len);
}

//@param $name_orientation => 0="Khmer or Asia where faimily name appears first", 1="European or American"
//process person's name and return object {'first_name','last_name'} depending on the specified @name_orientation.
function getNameParts($name,$name_orienation=0){
    $parts = explode(' ',$name);
    if (!$name_orienation)
     {
          $first_name = isset($parts[1])? $parts[1]:"";
         $first_name .= isset($parts[2])? " ".$parts[2]:"";
         $first_name .= isset($parts[3])? " ".$parts[3]:"";
         return (object)['first_name'=>$first_name,'last_name'=>$parts[0]];
     }
    else{
         $last_name = isset($parts[1])? $parts[1]:"";
         $last_name .= isset($parts[2])? " ".$parts[2]:"";
         $last_name .= isset($parts[3])? " ".$parts[3]:"";
        return (object)['first_name'=>$parts[0],'last_name'=>$parts[1]];
    }

}

/***
  NOTE: $d->data.status ='Error' => it is usually data validation error. such as project name cannot be empty etc...
        $d->status ='Error' => there are two improtant cases
          (1). $d->status_code ='401' => Error User unauthenticated
          (2). $d->status_code ='403'=>Error User does not have permission to do the intended action
        $status_code = {300,350,360}. 300 = whatever general error caught arbitrarily, 350 = "User not logged in". 360 = "User does not have permission"
 ***/

//$add_status_info {status="OK","status_code"=200, "data"=>whatever data ($data)}
//OR $status_info {status="Error","status_code"=403,"error_message="some err message", "data"=>whatever data ($data)}

function makeJsonResponse($data) {
    $status_code = intVal(isset($data->status_code)?$data->status_code:0);
    if ($status_code > 0){
        if ($status_code ===401 || $status_code===402 || $status_code ===403 || $status_code ===405 || $status_code ===200) return response()->json($data);
        else return response()->json((object)['status'=>'Error','status_code'=>null,'error_message'=>"unexpected or invalid result. Status code $status_code"]);
    } else return response()->json((object)['status'=>'OK','status_code'=>200,'data'=>$data]);
}

//if module_id is supplied, then it means if module is accessible => allows access
function prn_allowed($prn_id,$module_id){
   return UM::allowed($prn_id,$module_id);
}

 function getLastDayOfMonth($mDate)
 {
     $mDate = convertDate($mDate);
     $date = new DateTime($mDate);
     $date->modify('last day of this month');
     $last_date =  $date->format('Y-m-d');
     return $last_date;
 }

 function dateAdd($interval,$num=0, $date=null,$return_format ='Y-m-d'){
    $st = $num>= 0? "+$num days":"-$num days";
    if($interval ==='day')
      $st = $num>= 0? "+$num days":"-$num days";
    else if ($interval==='week')
      $st = $num>= 0? "+$num weeks":"-$num weeks";
    else if ($interval==='month')
      $st = $num>= 0? "+$num months":"-$num months";
    else if ($interval==='year')
      $st = $num>= 0? "+$num years":"-$num years";

    return date($return_format,strtotime($date.$st));
 }

 function days_in_month($month, $year){
    // calculate number of days in a month
    return $month == 2 ? ($year % 4 ? 28 : ($year % 100 ? 29 : ($year % 400 ? 28 : 29))) : (($month - 1) % 7 % 2 ? 30 : 31);
 }

 function diff_time($start_time,$current_time){
    $startTimeTimestamp = strtotime($start_time);
    $currentDateTimeTimestamp = strtotime($current_time);

    // Calculate the difference in minutes
    $minuteDifference = round(($currentDateTimeTimestamp - $startTimeTimestamp) / 60);
    return $minuteDifference;
 }

 function getAge($year_of_birth){
    $birth_year = date('Y',strtotime($year_of_birth));
    $currentYear = date('Y');

    return $currentYear - $birth_year;

 }


 function numToMonth($num,$is_short_cut=false){
    if($num>12 || $num<1) return DV::error('num must be between 1 and 12');
    if(!$is_short_cut){
        $is_short_cut = null;
    }else{
        $is_short_cut = 3;
    }

    $dateObj = DateTime::createFromFormat('!m', $num);
    return  substr($dateObj->format('F'),0,$is_short_cut);
 }
 function formatMinsTime($minutes) {
    if ($minutes < 60) {
        return $minutes . " min";
    } else {
        $hours = floor($minutes / 60);
        $remainingMinutes = $minutes % 60;
        return $hours . " hour" . ($hours > 1 ? "s" : "") . ($remainingMinutes > 0 ? " " . $remainingMinutes . " min" : "");
    }
}

 function dateDiff_days($start_date,$end_date){
    $date1 = new DateTime($start_date);
    $date2 = New DateTime($end_date);
    $diff = $date1->diff($date2);
    return $diff->days;
 }

 function processQueryString($query_string=null,$sanitize =true,$allow_chars=[]){
    $cs=[];
    $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
    $query_string = $encrypter->decrypt($query_string,false); //FALSE => to avoid serialization issue in decryption
    parse_str($query_string, $cs);
    foreach($cs as $name => $value) {
        if ($sanitize === true || $sanitize === 1)
          $cs[$name] = (is_string($value))? Sanitizer::sanitize($value,$allow_chars) : $value;
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
     $img_types = ['jpg','png','jpeg','svg','pdf','heif'];
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
         $result->error= "File content is not valid. Base64 data is expected";
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
     if(!$success){
       return DV::error("Failed to save file in the destination folder!");
     }
     // $myfile = fopen($dir."/".$file, "w") or die ("Unable to open file!");

     // fwrite($myfile, $contents);
     // fclose($myfile);

     //Some old application code depends on this
     $result->filename = $fileName.$ext;
      //new prop "file_name"
     $result->file_name = $fileName.$ext;

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

    function getFileExtension($file_name=null) {
    return pathinfo($file_name, PATHINFO_EXTENSION);
    }

    function getMIMEType($fileName =null)
    {
        if (!$fileName) return null;
       $ext = getFileExtension($file_name);
       $ext= strtolower($ext?$ext:'');
       return $mimeTypes[$ext];
    }

   function getNowTime()
   {
       return Carbon::now()->format("Y-m-d H:i:s");
   }

   function isValidTime($time_string) {
     $date_time = DateTime::createFromFormat('H:i', $time_string);
     return $date_time && $date_time->format('H:i') == $time_string;
   }

   function createTimestamp($time_string,$today_date=null) {
    // Get today's date in the desired format
    if(!$today_date) $today_date = date("Y-m-d");

    // Combine today's date and the input time string
    $datetime_string = $today_date . " " . $time_string;

    // Convert the datetime string to a timestamp
    $timestamp = strtotime($datetime_string);

    // Format the timestamp in the desired format
    $formatted_timestamp = date("Y-m-d H:i:s", $timestamp);

    return $formatted_timestamp;
 }

   //change date format to yyyy-mm-dd
   function convertDate($date)
   {
       if(!(bool)strtotime($date)) return null;

       return date('Y-m-d', strtotime($date));
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

    function sess_company_id(){
        return Session('branch_id',null);
    }

    function sess_user_id(){
        return Session('user_id',null);
    }

    function base_url($uri=null){
      //Normally css and js are stored in directory "public/assets/css ..."
      //but on local environment ASSET_URL is empty in .env file
      $public_folder = env('ASSET_URL');
      $public_folder =  $public_folder? $public_folder."/":null;
      return url('/')."/".$public_folder.$uri;
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

 function transformArrayProps($inputs=[],$transform_cols=[]){
    foreach($transform_cols as $key=>$value){
        $inputs[$value] = $inputs[$key];
        unset($inputs[$key]);
    }
    return $inputs;
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

 function deleteDataRow($table_name,$key_fields=[]){
    $m_where ="";
    foreach($key_fields as $field=>$value){
        $sp = $m_where? " AND ":"";
        if(is_numeric($value))
           $m_where .= $sp.$field."=$value";
        else $m_where .= $sp.$field."='$value'";
    }
    DB::table($table_name)->whereRaw($m_where)->delete();
    return null;
 }

 //return row object based on the given key value
 function getDataRow($table_name,$key_fields=[], $cols=null){
    if(!$cols) $cols ="id";
    $m_where ="";
    foreach($key_fields as $field=>$value){
        $sp = $m_where? " AND ":"";
        if(is_numeric($value))
           $m_where .= $sp.$field."=$value";
        else $m_where .= $sp.$field."='$value'";
    }

    $rows = DB::table($table_name)->whereRaw($m_where)->selectRaw($cols)->take(1)->get();
    foreach($rows as $row) return $row;
    return null;
 }

  //return value a specified field given key value
  function getDataValue($table_name,$key_fields=[], $col=""){
    if(!$col) $col ="id";
     $m_where ="";
      foreach($key_fields as $field=>$value){
        $sp = $m_where? " AND ":"";
        if(is_numeric($value))
           $m_where .= $sp.$field."=$value";
        else $m_where .= $sp.$field."='$value'";
    }

    $rows = DB::table($table_name)->whereRaw($m_where)->selectRaw($col)->take(1)->get();
    foreach($rows as $row) return $row->{$col};
    return null;
 }

 function record_exists($table_name,$key_field,$use_branch_id = 0){
    $key_field_name =null;
    $key_value = null;
    foreach($key_field as $field=>$value){
        $key_field_name = $field;
        $key_value = $value;
    }
   $str_branch ="1=1";

   if($use_branch_id){
      $branch_id = Session::get('branch_id',0);
      $str_branch ="branch_id = $branch_id";
   }
   return DB::table($table_name)->where($key_field_name,$key_value)->whereRaw($str_branch)->selectRaw($key_field_name)->take(1)->exists();

 }

 //createForcibly() will checks if the given key_value actually exists in the target table. If it does not exists, then createForcibly() will CREATE. If the given key_value exists in target table, this method UPDATE
 //create record in a table silently if the given $key_value is positive but does not exist in the target table
 /***
  *scenario => "Save appointment => save lead info such as (name,phone,sex, ...) silently. Do not save lead info if a valid client_id is given"
  * ***/
 function createForcibly($ss,$table_name,$key_field = [],$inputs=[],$extended_cols=[],$use_branch_id = 0){
    $key_field_name =null;
    $key_value = null;
    foreach($key_field as $field=>$value){
        $key_field_name = $field;
        $key_value = $value;
    }

    $new_id = null;
    if(is_array($extended_cols)) foreach($extended_cols as $prop=>$value) $inputs[$prop] = $value;

    if ($key_value > 0 || record_exists($table_name,$key_field,$use_branch_id)){

        $str_branch ="1=1";
        if ($use_branch_id) $str_branch = "branch_id =".$ss->branch_id?$ss->branch_id:0;
        $inputs['update_uid'] = $ss->user_id;
        $inputs['update_user'] = $ss->full_name;
        $inputs['updated_at'] = getNowTime();
        DB::table($table_name)->where($key_field_name,$key_value)->whereRaw($str_branch)->update($inputs);
        $new_id = $key_value;
    }
    else{

        $inputs['branch_id'] = $ss->branch_id;
        $inputs['create_uid'] = $ss->user_id;
        $inputs['create_user'] = $ss->full_name;
        $inputs['created_at'] = getNowTime();
        DB::table($table_name)->insert($inputs);
        $new_id = DB::getPdo()->lastInsertId();
    }
    return $new_id;
 }

 /**
  * saveData() will update existing row based on the provided PRIMARY KEY FIELD specifying in @pk_field_array. If the primary key value is provided as postive number then => if "the primary key Value is not found" AND "@ensure_exists is TRUE" => a new record is created and the new primary key is returned.
  * if @ensure_exists (that is default to False) is not specified => saveData() will update record when pk value is positive, otherwise create new record and returned pk_key
  * $pk_field_array is $key_fields. example ['id'=>120] or ["id"=>":student_id"]. In ":student_id", the "student_id" is the prop or array key, for example, $input['student_id']
  ***/

  function saveData($ss,$table_name,$pk_field_array = [],$inputs=[],$extended_cols=[],$use_branch_id = 0,$ensure_exists = false){
    $key_field =null;
    $key_value = null;
    foreach($pk_field_array as $field=>$value){
        $key_field = $field;
        if (substr($value,0,1)===":")
          {
            $prop = substr($value,1,strlen($value));
            $key_value =$inputs[$prop];
          }else $key_value = $value;
    }

    $new_id = null;
    if(is_array($extended_cols)) foreach($extended_cols as $prop=>$value) $inputs[$prop] = $value;
    //row_affected => there is some value has been changed

    $must_create = false;
    if ($key_value>0){
        $str_branch ="1=1";
        if ($use_branch_id) $str_branch = "branch_id =".$ss->branch_id?$ss->branch_id:0;
        $query = DB::table($table_name)->where($key_field,$key_value)->whereRaw($str_branch);
        $row_exists = $query->take(1)->selectRaw($key_field)->exists();
        if($row_exists){
            $inputs['update_uid'] = $ss->user_id;
            $inputs['update_user'] = $ss->full_name;
            $inputs['updated_at'] = getNowTime();
            $query->update($inputs);
            //DB::table($table_name)->where($key_field,$key_value)->whereRaw($str_branch)->update($inputs);
            $new_id = $key_value;
            return $new_id;
        }
        else $must_create =true;
    }

    if(!$key_value || ($ensure_exists && $must_create)){
        if ($use_branch_id) $inputs['branch_id'] = $ss->branch_id;
        $nowTime = getNowTime();
        $inputs['create_uid'] = $ss->user_id;
        $inputs['create_user'] = $ss->full_name;
        $inputs['created_at'] = $nowTime;
        $inputs['update_uid'] = $ss->user_id;
        $inputs['update_user'] = $ss->full_name;
        $inputs['updated_at'] = $nowTime;
        DB::table($table_name)->insert($inputs);
        $new_id = DB::getPdo()->lastInsertId();
        return $new_id;
    }else return null;
 }

 //setIdentityFields() | setCommonCols() | setCommonInputs()
 function setCommonFields($d,$ss,$action = 'create',$include_branch_id=1){
        if ($action === 'create'){
            if ($include_branch_id===1) $d['branch_id'] = $ss->branch_id;
            $d['created_at'] = getNowTime();
            $d['create_uid'] = $ss->user_id;
            $d['create_user'] = $ss->full_name;
        }else{
            $d['updated_at'] = getNowTime();
            $d['update_uid'] = $ss->user_id;
            $d['update_user'] = $ss->full_name;
        }
       return $d;
  }


    //Replace charater (?) in string, through the use of array ['A','B','C']
    //str_raplce_special()
    function replace_marks($str,$arr)
    {
        $out="";
        $x=0;
        $dd = explode("?",$str);
        foreach ($dd as $part)
        {
            $out.=$part;
            if (isset($dd[$x+1])) $out.=isset($arr[$x])?$arr[$x]:'';
            $x++;

        }
        return $out;
    }

    //compress Image Size
    //default max_size to 500 KB
    function resizeImage_base64($base64_string,$maxSize=500000){
        //For quick process, we can check if the provided $base64_string is a URL or not. IF not, go further to process the base64 into image object
        if(filter_var($base64_string, FILTER_VALIDATE_URL)) return null;
        // Set maximum allowed image size (in bytes)
        $maxSize =$maxSize? $maxSize:1000000; // 1 MB
        $image = null;
        try{
            $image = Image::make($base64_string);
        }catch(\Exception $e){
            //return NULL if the base64 is NOT valid image
            return (object)['error'=>$e->getMessage(),'image'=>null];
        }

        // Get image size (in bytes)
        $imageSize = $image->filesize();

        // Check if image size exceeds the maximum allowed size
        if ($imageSize > $maxSize) {
            // Resize image to a smaller size
            $image->resize(800, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
        }
        // Save image to disk
        //$image->save('path/to/saved-image.jpg');
        return (object)['error'=>null,'image'=>$image];
    }
    // //returns compressed image as base64 format in png. By default, compression to 500 KB
    // function getCompressedImage($base64_str, $size_kb = 500,$default_ext ="png"){
    //     // // Base64 encoded string of an image
    //     // $base64_str = "base64-encoded-string-of-image";

    //     // Maximum file size limit in bytes
    //     $max_file_size = $size_kb * 1024; // 500 KB

    //     // Decode the base64 string to binary data
    //     $image_data = base64_decode($base64_str);

    //     // Create an image resource from the binary data using GD library
    //     $image = imagecreatefromstring($image_data);
    //     if (!$image) return (object)[
    //         'status'=>'Error',
    //         'error_message'=>'Image data is not valid',
    //         'data'=>null
    //     ];

    //     // Get the current image size
    //     $image_width = imagesx($image);
    //     $image_height = imagesy($image);

    //     // Set the target width and height based on the current size
    //     $target_width = $image_width;
    //     $target_height = $image_height;

    //     // Calculate the maximum size of the compressed image
    //     $default_ext = $default_ext?$default_ext:"png";
    //     $max_compressed_size = $max_file_size - strlen("data:image/$default_ext;base64,");

    //     // Loop until the compressed image size is within the limit
    //     do {
    //         // Create a blank canvas for the new image
    //         $new_image = imagecreatetruecolor($target_width, $target_height);

    //         // Copy the image data from the old image to the new image
    //         imagecopy($new_image, $image, 0, 0, 0, 0, $target_width, $target_height);

    //         // Get the binary data of the compressed image
    //         ob_start();
    //         imagepng($new_image, null, 9); // 9 is the highest compression level
    //         $compressed_image_data = ob_get_clean();

    //         // Destroy the new image resource
    //         imagedestroy($new_image);

    //         // Get the size of the compressed image data
    //         $compressed_size = strlen($compressed_image_data);

    //         // Adjust the target size based on the current size and the compressed size
    //         if ($compressed_size > $max_compressed_size) {
    //             $target_width = floor($target_width * sqrt($max_compressed_size / $compressed_size));
    //             $target_height = floor($target_height * sqrt($max_compressed_size / $compressed_size));
    //         }
    //     } while ($compressed_size > $max_compressed_size);

    //     // // Save the compressed image as a PNG file
    //     // file_put_contents("path/to/new-image.png", $compressed_image_data);

    //     // Free up memory by destroying the image resources
    //     imagedestroy($image);
    //     return (object)['status'=>'OK','data'=>$compressed_image_data];
    // }

    // //return object {photo_data,extension}. If the given $data is not an image, this method returns object with photo_data equal to NULL
    // function checkImage($base64_string){
    //     $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif','heif','heic','svg'];

    //     $parts = explode("/",$base64_string);
    //     if(!isset($parts[1])) return null;

    //     $sts = explode(";",$parts[1]);
    //     $ext = isset($sts[0])?$sts[0]:null;

    //     if (in_array($ext, $allowed_extensions)){
    //         $base64_string_without_extension = str_replace('data:image/'.$ext.';base64,', '', $base64_string);
    //         $d = getCompressedImage($base64_string_without_extension);
    //         if($d->status ==='Error')
    //           return (object)[
	//             'photo_data'=>null,
	//             'extension'=>null,
	//             'error_message'=>'Image data is not valid',
	//             'status'=>'Error'
	//             ];

    //         return (object)[
    //         	'status'=>'OK',
    //             'photo_data'=>$d->image_data,
    //             'extension'=>$ext
    //         ];
    //     }else return (object)[
    //         'photo_data'=>null,
    //         'extension'=>null,
    //         'error_message'=>'The file extension is not allowed image format',
    //         'status'=>'Error'
    //     ];
    // }

    //get file extension from base64 image only. for documents, the prefix of base64 string contains mime-type instead
    function getFileExtensionFromBase64($base64_string){
        $parts = explode("/",$base64_string);
        if(!isset($parts[1])) return null;
        $sts = explode(";",$parts[1]);
        return isset($sts[0])?$sts[0]:null;
    }

    //Check if base64 is an image. NOTE this method is to check based on extension information of the base64 string,
    //so the provided base64 must be something like this "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
    function isImage($base64_string){
        $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif','heif','heic','svg'];
        $ext = getFileExtensionFromBase64($base64_string);
        //$file_extension = strtolower(pathinfo($base64_string, PATHINFO_EXTENSION));
        return in_array($ext, $allowed_extensions);
    }

    function isValidImage_base64($base64_string){
        try {
            $image = Image::make($base64String);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    //return memory size in B, KB, MB
    //getImageSize() |
     function getBase64ImageSize($base64Image=null){
        try{
            //$size_in_bytes = (int) (strlen(rtrim($base64Image, '=')) * 3 / 4);
            $size_in_kb = $size_in_bytes / 1024;
            //$size_in_mb    = $size_in_kb / 1024;
            return $size_in_kb;
        }
        catch(Exception $e){
            //Failed to check size
            return -1;
        }
    }

     function getInterval($part3=null){
         if (!$part3) return (object)['min'=>-1,'max'=>-1]; /** No interval specificed and No number specified **/

         $sts = explode('-',$part3);
         $min = isset($sts[0])?$sts[0]:null;
         $max = isset($sts[1])?$sts[1]:null;

         if (is_numeric($min) && is_numeric($max)) /** min and max are well specified example "5-50" **/
            return (object)['min'=>$min,'max'=>$max];
         else if (is_numeric($min)) /** min specified but no max. Or there is ONLY one numbder specified **/
         {
            if ($min <=0) return (object)['min'=>$min,'max'=>null];
            else if ($min > 0) return (object)['min'=>0,'max'=>$min];
         }
         else
            return (object)['min'=>-1,'max'=>-1]; /** No interval specificed and No number specified **/
        //  if(strpost($part3,'-') !==false){

        //  }else return (object)['min'=>-1,'max'=>-1];
     }

     function getPropValue($prop_name=null,$part3=null,$part4=null){
        //if(!$prop_name) return $part3? $part3: ($part4? $part4:null);
        if (!$prop_name) return null;
        $prop_found = false;
        if ($part3){
            $sts = explode('=',$part3);
            $varname = trim($sts[0]?$sts[0]:'');
            if ($varname ===$prop_name){
                $prop_found = true;
                return isset($sts[1])?$sts[1]:null;
            }
            //else if ($varname != $prop_name) return $part3;
        }

        if (!$prop_found  && $part4) {
            $sts = explode('=',$part4);
            $varname = trim($sts[0]?$sts[0]:'');
            if ($varname ===$prop_name) return isset($sts[1])?$sts[1]:null;
            //else if ($varname != $prop_name) return $part4;
        }
        return null;
        // if ($sts[0]===$prop_name) return isset($sts[1])?$sts[1]:null;
        // $sts = explode('=',$part4);
        // if ($sts[0]===$prop_name) return isset($sts[1])?$sts[1]:null;
     }

     /***process $input value based on a given $spec string such as:
        1. "0|number|identity=1" (This field is used as key field, and is NOT part of the input fields for INSERT or UPDATE)
        1. "1|string|5-25|default=your default value|text=your error message"
        2. "1|positive|1-55|default=5|text=age cannot be zero"
        3. "0|number|1-55|default=5",
        4. 'sex'=>"1|choice|M,F|default=F,
        5. 'loan_compound_cycle'=>"0|choice|monthly,daily,yearly,weekly|default=monthly
      ***/
     //It returns object {value,error}

    function processInput($field_name=null,$val=null, $spec='',$lang =null){
        /***
          1. "prop_name"=> "0|string|0|default=dsfdgdf"
          2. "prop_name"=> "1|string|5-25|default=sfdsfdf|first name is required"
          3. "status"=>"1|string|default=active"
          4. "age"=>"1|number|0|default=1"
          5. "items"=>"1|object"
          6. "type"=>"1|array|Fast,Normal"
          7. "payment_date" => "1|date|default=@today"
          8. "appointment_time"=>"1|timestamp|default=@now",
          9. "other_time"=> "1|time|default=@now"
          10. "cp_phone"=>"depend=cp_name,cp_email|string"   Means that "cp_phone" is required only when user inputs cp_name and cp_email
          11. Example  "brand_id"=>"1|exists=inv_brands.id" or "group_id"=> "0|exists=inv_groups"  that means to check to ensure that the given @brancd_id exists in table "inv_brands" by primary field "id"

          ***/

    $lang = Session('lang','en'); //default langauge to English
    $field_name = $field_name?str_replace('_',' ',$field_name):'Some field name'; //$field_name is used to show which technical field_name has validation error
    $parts = explode('|',$spec);
    $part1 = isset($parts[0])?$parts[0]:null; /* {0,1} */
    $part2 = isset($parts[1])?$parts[1]:''; //{'string','date','time','timestamp','phone','email'} OR "default=50" or "default=sdfsddsfd"
    $part3 = isset($parts[2])?$parts[2]:''; // range: 1-50 length of text, or min and max of number
    $part4 = isset($parts[3])?$parts[3]:''; //this can be text_prop or default value for 'string' data type
    $part5 = isset($parts[4])?$parts[4]:''; //This is $text_prop
    //this is text_prop to be translated. This text_prop is stored in km.php or en.php.
    //$text_prop is usually given as "text=phone number is required" or simply "phone number is required"
    $tmp = isset($parts[4])?$parts[4]:null;

    $my_text_prop = getPropValue('text',$part3,$part4);

    $def_val = getPropValue('default',$part4,$part3);
    $val = ($val===null || $val==='')?$def_val:$val;

    $is_identity = getPropValue('identity',$part3,$part2); // example:  "id"=>"0|identity=1"
    $is_identity = $is_identity?(int)$is_identity:0;

    //if the value is supplied, then check if there is exist_checking requred for one-to-one or one-to-many relationships.
    //**** EXAMPLE  "brand_id"=>"1|exists=inv_brands.id" => check to ensure that the given @brancd_id exists in table "inv_brands" by primary field "id"
    if ($val){
        //if () return (object)['error'=>$val,'default_value'=>'ddd'];
        $check_exists_rule = getPropValue('exists',$part2,$part3);
        if($check_exists_rule){
            if (!checkExists($check_exists_rule,$val))  return (object)['error'=>Localization::translate($lang,"$field_name ID is not valid or does not exist"),'default_value'=>null];
        }
    }

    if ($is_identity === 1)
        return (object)['error'=>null,'is_identity'=>1,'default_value'=>$val];
    else if ($part1==0 || $part1===false)
        return (object)['error'=>null,'default_value'=>$val]; //value is not required
    else if ($part1==1 || $part1===true){

                if ($part2 === 'string' || !$part2){
                    //$my_text_prop = $part4; //here
                    if (!$val) return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name cannot be empty"),'default_value'=>$def_val];
                    $interval = getInterval($part3);
                    if ($interval->min ===-1 && $interval->max ===-1){
                        if (!$val) return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name cannot be empty"),'default_value'=>$def_val];
                    }else{
                        //if there is interval to check
                        $len = strlen($val?$val:'');
                        if ($len >= $interval->min && $len <= $interval->max)
                           return (object)['error'=>null,'default_value'=>$val];
                        else
                            return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name length must be between $interval->min and $interval->max",[$interval->min,$interval->max]),
                            'default_value'=>$val
                            ];
                    }

                } else if ($part2 === 'positive'){
                     $interval = getInterval($part3);
                     if ($val <0 || !is_numeric($val)) $val = $def_val;
                     if ($val <0 || !is_numeric($val)) return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name must be positive")];

                     if ($interval->min ===-1 && $interval->max ===-1)
                     {
                        //This case: there are No Interval specified for the value of positive number
                        if($val> 0)
                            return (object)['error'=>null,'default_value'=>$val];
                        else return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name must be a positive number")];
                     }else{
                        if($val < $interval->min || $val > $interval->max)
                           return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name must be between $interval->min and $interval->max",[$interval->min,$interval->max])];
                        else return (object)['error'=>null,'default_value'=>$val];
                     }

                }else if ($part2 === 'date') {
                        //NOTE: $val ="03 Nov" or "03-Nov" => (bool)strtotime($val) return 1 this can cause problem with date validation

                        //$val = str_replace('-',' ',$val);

                        $format = getPropValue('format',$part3);
                        if (!$format){
                            $format = getPropValue('format',$part3);
                            if (!$my_text_prop) $my_text_prop = getPropValue('text',$part3);
                        }

                        //If there is NO date format specified for the input
                        if (!$format){
                            // *** Option 1: Check if it is date. If yes => return date format "Y-m-d" for MYSQL database
                            if ((bool)strtotime($val))
                                 return (object)['error'=>null,'default_value'=>convertDate($val)];
                            else return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name is not correct",['Y-m-d'])];
                        }else{
                            //// *** Option 2: Check date and its format to ensure the specified format is matched with the input
                            $m_date = validateDate($val,$format);
                            if($m_date){
                                //$m_date = date('Y-m-d',$m_date);
                                return (object)['error'=>null,'default_value'=>$m_date->format('Y-m-d')];
                            }
                            else return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name is not correct. Date format $format is expected",[$format])];
                        }

                 }else if ($part2 ==='time' || $part2 ==='timestamp') {
                    if((bool)strtotime($val))
                      return (object)['error'=>null,'default_value'=>date("Y-m-d H:i:s",strtotime($val))];
                    else return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name is not correct. Timestamp expected")];
                }else if ($part2==='email') {
                    if(isEmail($val))
                        return (object)['error'=>null,'default_value'=>$val];
                    else return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name is not correct. Email is expected")];
                }else if ($part2==='phone'){
                    if(isPhoneNumber($val))
                    return (object)['error'=>null,'default_value'=>$val];
                    else return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name is not correct")];
                }
                else if ($part2 === 'option' ||$part2 === 'choice'){
                    $arr = explode(',',$part3);
                    if (in_array($val,$arr))  return (object)['error'=>null,'default_value'=>$val];
                    else return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name must be one of $part3")];
                }else if ($part2 === 'number' || $part2 === 'numeric'){
                    $interval = getInterval($part3);
                    if ($interval->min ===-1 && $interval->max ===-1)
                    {
                         if (is_numeric($val))
                            return (object)['error'=>null,'default_value'=>$val];
                         else
                            return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name must be a number. Given value is ".($val?$val:'empty'))];

                    }else{
                       if($val < $interval->min || $val > $interval->max)
                          return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name must be between $interval->min and $interval->max",[$interval->min,$interval->max])];
                       else return (object)['error'=>null,'default_value'=>$val];
                    }

                }else if ($part2 === 'object' || $part2 === 'array'){

                        //if $val is empty or NULL then do not treat it as validation error for JSON object or JSON array
                        if (!$val) return (object)['error'=>null,'default_value'=>null];
                          if(is_string($val))
                             $obj = json_decode($val);
                          else
                             $obj = json_decode(json_encode($val));
                        if ($obj)
                           return (object)['error'=>null,'default_value'=>$obj];
                        else
                           return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name is not a invalid JSON format")];
                } else if ($part2 ==='image' || $part2==='file' || $part2==='base64'){

                        $interval = getInterval($part3);
                        $file_types = getPropValue('type',$part4,$part3);
                        $types = explode(';',$file_types);
                        $ext = getFileExtensionFromBase64($val);
                        if (!in_array($ext, $types)) return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name file type is not allowed")];
                        $size = getBase64ImageSize($val);
                        if ($interval->min===-1 && $interval->max===-1){
                            $image=null;
                            $mx= resizeImage_base64($val);
                            if(!$mx->error) $image= $mx->image;
                            //If the provided image data is not valid returns null silently
                            return (object)['error'=>null,'default_value'=>$image];
                        }else{
                            if ($size < $interval->min || $size > $interval->max)
                            return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name file size should be between ? and ?"),[$interval->min, $interval->max]];
                            else{
                                $image =null;
                                $mx = resizeImage_base64($val);
                                if (!$mx->error) $image = $mx->image;
                                //If the provided image data is not valid returns null silently
                                return (object)['error'=>null,'default_value'=>$image];
                            }
                        }
                }
                else {
                    //This case can happen when $spec ="1|" or "1|default=1" where data_type is not specified as "string or as number?"
                    //This case can happen when $spec ="1|text=fdgfdgf:ddfgf1" where data_type is not specified as "string or as number?"
                    $def_val = getPropValue('default',$part2,null);

                    //NOTE thtat $def_val==0 => ($def_val) = false
                    if ($def_val || $def_val==0){
                        //return whatever value because data_type is not specified for validation
                        return (object)['error'=>null,'default_value'=>$def_val];
                    }else {

                       if($part1===1)
                            return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name cannot be empty"),'default_value'=>null];
                       else
                          return (object)['error'=>null,'default_value'=>null]; /** NULL value is OK and no error **/
                    }

                }

            } else /** this case happens when ($part1 !=0 and $part1 != 1) **/
            {
                //"address"=>"depend=name,email!phone_number|string". This means that "address" is required when there is input of "name and (email or phone_number)"
                $ff = getPropValue('depend',$part1);
                //In case there is no dependency field specified
                if (!$ff){
                    //In case that user specified $spec as, for example: "string" or "string|0", so NOT defining "1|string" or "0|string". NOTE that 1= "required", 0 = "not required"
                    return (object)['error'=>null,'default_value'=>$val];
                }else {
                    //In this case : "address"=>"depend=name,email!phone_number|string"
                            $dep_fields = explode(',',$ff?$ff:'');
                            $all_exps = true;  //All dependency fields have values
                            foreach($dep_fields as $dField){
                                $or_exp=false;//one of the dependency field has value ( false = not have value)
                                $or_fields = explode('!',$dField);
                                foreach($or_fields as $f){
                                        $v = isset($d[$f])?$d[$f]:null;
                                        if($v){
                                            $or_exp = true;
                                            break;
                                        }
                                }

                                if (!$or_exp){
                                        $all_exps = false;
                                        break;
                                }
                            }
                }//end:: if "depend=name,email" etc...
                if($all_exps){
                    switch($part2){
                        case 'string':{
                           if(!$val) return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name cannot be empty"),'default_value'=>$val];
                           break;
                        }
                        case 'number':{
                            if(!is_numeric($val)) return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name must be a number"),'default_value'=>$val];
                            break;
                        }
                        case 'date':{
                            if((bool)strtotime($val)) return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name is not valid"),'default_value'=>$val];
                            break;
                        }
                        case 'phone':{
                            if(!isPhoneNumber($val)) return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name is not valid"),'default_value'=>$val];
                            break;
                        }
                        default:{
                            if(!is_numeric($val)) return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name must be a number"),'default_value'=>$val];
                            break;
                        }
                    }
                    return (object)['error'=>null,'default_value'=>$val];

                }

            }
            return (object)['error'=>null,'default_value'=>$val];
    }

     function getValue($obj,$prop,$sanitize=0,$sanitize_options=[],$allow_raw=1){
        $val = isset($obj->{$prop})?$obj->{$prop}:null;
        return $sanitize? Sanitizer::sanitize($val,$sanitize_options,$allow_raw):$val;
     }

     //returns true if exists. If @check_exists_rule or @val is not supplied = > it returns TRUE
     function checkExists($check_exists_rule="",$val=null){
        if(!$val || !$check_exists_rule) return true;
        $exists_rule_parts = explode(".",$check_exists_rule);
        $table_name = $exists_rule_parts[0];
        if($table_name){
            $exist_col = isset($exists_rule_parts[1])?$exists_rule_parts[1]:'id';
            $row = getDataRow($table_name,[$exist_col=>$val],$exist_col);
            return $row?true:false;
        }
        return true;
     }

     //NOTE:
     /*** validateReq() | getValues() ***/
     /***
       $req is the $request object send from client browser. getValues() will retrieve parameter list by $req->all() that is associative array of params;
       $fields = ['first_name'=>'1|string|1-50|default:null|first name cannot be empty','sex'=>'1|array|M,F|default:M|Gender must be M or F','1|phone_number|3-25'|phone number is not valid,'delivery_type'=>'1|array|Fast,Normal|exactcase:1|default:Normal'];
       $include_all_fields =1 => include all fields sent through http request object from client, Otherwise,getValues() returns only fields within the given validation array "$fields"
       $unique_specs "$branch_id|persons|first_name,last_name,email!phone_number|id|text=person already exists"
       ***/
      function validateReq($req, $fields = [],$sanitize=1,$sanitize_options =[],$lang='en',$include_all_fields=0,$unique_specs=null){
        $langSection ='validation';
        $identity_field = null;
        $identity_value = null;

        $d = $req->all();
        $outputs = [];
        //$to_check_unique = isset($unique_specs);
        foreach($fields as $field=>$spec){
              $val = null;
              $op = null;
              if (is_array($sanitize_options)) $op = isset($sanitize_options[$field])?$sanitize_options[$field]:null;
              $raw_val = isset($d[$field])?$d[$field]:null;

              if(is_array($raw_val))
                    $val = ($sanitize)? Sanitizer::sanitizeObject($raw_val,$op):$raw_val;
              else if($raw_val) $val = ($sanitize)? Sanitizer::sanitize($raw_val,$op):$raw_val;

              $res = processInput($field,$val,$spec,$lang);
              if($res->error) return (object)['error'=>$res->error,'values'=>null];

               $is_identity = isset($res->is_identity)?(int)$res->is_identity:0;

                if ($is_identity ==1)
                {
                    $identity_field = $field;
                    $identity_value = $val;
                }
                else
                  $outputs[$field] = $res->default_value;
        }

        if ($include_all_fields)  foreach($d as $col=>$value) if (!isset($outputs[$col])) $outputs[$col] = $value;

        $unique_error =null;
        if (is_array($unique_specs)){
            $pk_field =[];
            if ((double)$identity_value > 0) $pk_field[$identity_field] = $identity_value;
            else if ($identity_value) $pk_field[$identity_field] = "'$identity_value'";

            foreach($unique_specs as $u_spec){
                $parts = explode('|',$u_spec);
                $part4= $parts[3]; //example  "id=person_id" where "id" is the table PK field name and "person_id" is the data's prop that contains id value
                $parts1 = explode('=',$part4); //"id=person_id"
                $pk_field_name = isset($parts1[0])?$parts1[0]:null;
                $pk_value =null;

                if($pk_field_name){
                        $pk_input_prop = isset($parts1[1])?$parts1[1]:null;
                        if (!$pk_input_prop) $pk_input_prop = $identity_field;
                        if(is_numeric($pk_input_prop)) $pk_value = $pk_input_prop;
                        else $pk_value= isset($d[$pk_input_prop])?$d[$pk_input_prop]:null;
                }

                if ($u_spec) $unique_error = checkUnique($d,$pk_field_name,$pk_value,$u_spec,$lang,$langSection);
                if ($unique_error){
                   $trans_err = Localization::translate($lang,$unique_error,null,$lang,$langSection,);
                   return (object)['error'=>$trans_err,'values'=>null];
                }
            }
        }

        $result =['error'=>null,'values'=>$outputs];
        if ($identity_field) $result[$identity_field]= $identity_value;
        return (object)$result;

     }

     /** getValuesBySection() | validateArray() | validateObject() **/
     //getValues() process $req->all() automcatically. While getValuesBySection() process a section or an prop value based on given array such as  $d['personal_data']
     function validateObject($d, $fields = [],$sanitize=1,$sanitize_options =[],$lang='en',$include_all_fields=0,$unique_specs=null){
        $langSection ='validation';
        $identity_field = null;
        $identity_value = null;

        //$d = $req->all();
        $outputs = [];
        foreach($fields as $field=>$spec){
              $val = null;
              $op = null;
              if (is_array($sanitize_options)) $op = isset($sanitize_options[$field])?$sanitize_options[$field]:null;
              if(isset($d[$field])) $val = ($sanitize)? Sanitizer::sanitize($d[$field],$op):$d[$field];
                //Check field specification
                /***
                 1. 0|string|0|default:dsfdgdf
                 2. 1|string|5-25|default:sfdsfdf
                 3. 1|string|default:active
                 4. 1|number|0|default:1
                 5. 1|object|default:null
                 6. 1|array|Fast,Normal|exactcase:1
                ***/

                $res = processInput($field,$val,$spec,$lang);
                //if (!$res) return (object)['error'=>"$field $def_val",'values'=>null];
                if($res->error) return (object)['error'=>$res->error,'values'=>null];

                $is_identity = isset($res->is_identity)?(int)$res->is_identity:0;
                if ($is_identity ===1)
                {
                    $identity_field = $field;
                    $identity_value = $val;
                }
                else
                  $outputs[$field] = $res->default_value;

        }

        if ($include_all_fields)  foreach($d as $col=>$value) if (!isset($outputs[$col])) $outputs[$col] = $value;
        //Check Uniqeness
        $unique_error =null;
        if (is_array($unique_specs)){
            foreach($unique_specs as $u_spec){
                //$u_spec ="$ss->branch_id|persons|first_name,last_name!phone_number|id=person_id|text=person already exists"
                $parts = explode('|',$u_spec);
                $part4= $parts[3]; //example  "id=person_id" where "id" is the table PK field name and "person_id" is the data's prop that contains id value
                $parts1 = explode('=',$part4); //"id=person_id"
                $pk_field_name = isset($parts1[0])?$parts1[0]:null;
                $pk_value =null;
                if($pk_field_name){
                        /** For example, input from frontend is d['person_id'], so "person_id" is pk_input_prop **/
                        $pk_input_prop = isset($parts1[1])?$parts1[1]:null;
                        if (!$pk_input_prop) $pk_input_prop = $identity_field;
                        if(is_numeric($pk_input_prop)) $pk_value = $pk_input_prop;
                        else $pk_value= isset($d[$pk_input_prop])?$d[$pk_input_prop]:null;
                }

                //NOTE: $pk_field is associateive array. Example: ['person_id'=>101] . This is needed for avoid check duplicate in case of UPDATE exiting item " where person_id <> 101"
                if ($u_spec) $unique_error = checkUnique($d,$pk_field_name,$pk_value,$u_spec,$lang,$langSection);
                if ($unique_error){
                    $trans_err = Localization::translate($lang,$unique_error,null,$lang,$langSection,);
                    return (object)['error'=>$trans_err,'values'=>null];
                }
            }

        }

        $result = (object)['error'=>null,'values'=>$outputs];
        if ($identity_field) $result->{$identity_field} = $identity_value;
        return $result;

        // foreach($fields as $field){
        //    if(isset($d[$field]))
        //       $outputs[$field] = $sanitize===1? Sanitizer::sanitize($d[$field]):$d[$field];
        //    else $outputs[$field] = null;
        // }
        // return (object)$outputs;
     }

     /***
         $spec = "$branch_id|persons|first_name,last_name,sex,date_of_birth|id=person_id|text=that person already exists::$var1;$var2"
         $spec = "$branch_id|persons|phone_number!email,f2,f3|id|text=that person already exists::$var1;$var2"
         $pk_field = ['id'=>101]. then it will be used as " AND id <> 101" to avoid checking uplicate item in case of UPDATE
    ***/
    function checkUnique($d,$pk_field_name,$pk_value,$spec=null,$lang='en',$langSection='validation'){
        if (!$spec) return null; //"Failed to check uniqueness of data";
        $parts = explode('|',$spec);
        if(!isset($parts[0])) return "Failed to check uniqueness of data. Unique_spec= $spec";
        if(!isset($parts[1])) return "Failed to check uniqueness of data. Unique Spec= $spec";
        if (!isset($parts[2])) return "Failed to check uniqueness of data. Unique Spec= $spec";

        $branch_id = $parts[0];
        $table = $parts[1];
        $field_list = explode(',',$parts[2]);
        $m_where ="";
        $select_cols =$pk_field_name?$pk_field_name:"id"; //presume a default. That all tables have a "id" column
        //$checking_field_cnt = 0;
        foreach($field_list as $fields){
             $sts = explode('!',$fields);
             $i =0;
             $where_con="";
             $has_or=0;
             foreach($sts as $f){
                //NOTE: For example, you want to check duplicate Phone_number. If phone_number is NULL or empty => do not check duplicate
                if ($f && isset($d[$f])){
                    if (!$has_or || $has_or ===0) $has_or = $where_con?1:0;
                    //if (!isset($d[$f])) return "Error in checking uniqueness because field $f is empty or it is not supplied";
                    $where_con .= ($where_con? ' OR ':''). $f."='".$d[$f]."'";
                    //$checking_field_cnt++;
                    $i++;
                }
             }
             if ($has_or) $where_con = "($where_con)";
             $m_where .= ($m_where? ' AND ':'').$where_con;
        }

        //Following line => do not check duplicate for NULL value or Zero value for the target field
        if ($i===0) return null;
        $str_pk = "";

        if($pk_value > 0) $str_pk = " AND $table.$pk_field_name <> $pk_value";
        else if($pk_value) $str_pk =" AND $table.$pk_field_name <> '$pk_value'";
         $text = getPropValue('text',$parts[3]);
        if (!$text) $text = getPropValue('text',isset($parts[4])?$parts[4]:'');

        $str_branch = "1=1 ";
        if ($branch_id > 0) $str_branch ="branch_id =$branch_id ";
        $m_where =  $str_branch." AND ".$m_where.$str_pk;
        $rows = DB::table($table)->whereRaw($m_where)->selectRaw($select_cols)->take(1)->get();
        if (count($rows)>0)
          return $text?$text:"$table already exists";
        else return null;
    }

    function validateDate($date,$format){
        //return date('Y-m-d',strtotime($date));
        //return  convertDate($date);
        if (!$date) return null;
        $d = DateTime::createFromFormat($format, $date);
        // The Y ( 4 digits year ) returns TRUE for any integer with any number of digits so changing the comparison from == to === fixes the issue.
        if ($d && $d->format($format) === $date) return $d;
        else return null;
     }

    function isPhoneNumber($phone_number=null,$nullable=0){
      if (empty($phone_number)) if ($nullable===0) return false;
      return true;
    }

    function isEmail($email=null,$nullable=0){
        if (empty($email)) if ($nullable===1) return true;
        return true;
    }

	// function seo_friendly_url($string){
	// 	$string = str_replace(array('[\', \']'), '', $string);
	// 	$string = preg_replace('/\[.*\]/U', '', $string);
	// 	$string = preg_replace('/&(amp;)?#?[a-z0-9]+;/i', '-', $string);
	// 	$string = htmlentities($string, ENT_COMPAT, 'utf-8');
	// 	$string = preg_replace('/&([a-z])(acute|uml|circ|grave|ring|cedil|slash|tilde|caron|lig|quot|rsquo);/i', '\\1', $string );
	// 	$string = preg_replace(array('/[^a-z0-9]/i', '/[-]+/') , '-', $string);
	// 	return strtolower(trim($string, '-'));
	// }

    function getUrlDirectory($url) {
        $url_parts = parse_url($url); // Parse the URL into its components

        // Rebuild the URL without the filename
        $url_directory = $url_parts['scheme'] . '://' . $url_parts['host'] . $url_parts['path'];
        $url_directory = rtrim($url_directory, '/'); // Remove trailing slash if it exists

        // Get the last directory name from the URL
        $directory_parts = explode('/', $url_directory);
        $last_directory = end($directory_parts);

        // Check if the last directory is a filename
        $filename_parts = explode('.', $last_directory);
        if (count($filename_parts) > 1) {
            array_pop($directory_parts); // Remove the last directory (which is the filename)
            $url_directory = implode('/', $directory_parts);
        }

        return $url_directory;
    }

    function getStoragePath($private=false){
        if($private)
          {
            $path = Storage::disk('private')->path('');
          }else{
             //$path = Storage::disk('public')->path('');
             $path = getcwd().Config::get('app.storage_dir');
          }
        return $path;
    }

    //return public url
    function getStorageUrl(){
      return url('').Config::get('app.storage_dir'); //"/uploads/companies/";
    }

    //To upport misspelling version
    function getAdminAppId(){
        return Config::get('app.app_id');
    }

    function thisAppId()
    {
      return Config::get('app.app_id');
    }

    function getAppId(){
        return Config::get('app.app_id');
    }

    function getAppIdByUserClass(){
        //return Student Mobile App ID by default
        return Config::get('app.app_id');
    }

    function channel_prefix(){
        return Config::get('app.pusher_channel_prefix');
    }

    function extendProps($cols=[],$d=null){
        if (!$cols) return $d;
        else if (!$d) return $d;
        $cols1 = (array)$cols;
        foreach($cols1 as $key=>$value) $d->{$key} = $value;
        return $d;
    }
    /**
     * checkFileUrl() checks if a url points to existing file. If the file does not exists, it return false.
     * This is useful when api response many images files to browsers, so to avoid many errors of 404
     * **/
    function checkFileUrl($url) {
        $localFilePath = $_SERVER['DOCUMENT_ROOT'] . parse_url($url, PHP_URL_PATH);
        return file_exists($localFilePath) && getimagesize($localFilePath);
    }
    function validateUrl($url,$otherWise="") {
        $localFilePath = $_SERVER['DOCUMENT_ROOT'] . parse_url($url, PHP_URL_PATH);
        $exists = file_exists($localFilePath) && getimagesize($localFilePath);
        return $exists?$url:$otherWise;
    }

    function isValidLanguage($lang){
        return in_array($lang,["kh","en","ch"]);
    }
    function prepareTranslationInput(&$translate_cols,&$inputs,$lang="en"){
        if(!isValidLanguage($lang)) return $inputs;
        foreach($translate_cols as $col){
            //if(isset($inputs[$col])){
                     $trans_col = $col."_$lang";
                     $inputs[$trans_col] = isset($inputs[$col])?$inputs[$col]:null;
                     unset($inputs[$col]);
            //}
        }
        // $cols ="";
        // foreach($inputs as $k=>$v){
        //    $cols .= ",".$k;
        // }
        // throw new \Exception($cols);
        return $inputs;
    }

    /***when running Select Query, us this function to prepare SELECT columns to be pick the column names of desired lang.
    For example, the original query specifies "select name, desction from property" then prepareQueryColumns() will convert it into "select name_kh, description_kh from properties" based on
    the given $translate_cols, and $lang.
      NOTE: $translate_cols =["name","description"] this tells prepareQueryColumns() to convert $select_cols into "name_kh,description_kh" or "name_en,description_en" depending on $lang
       $select_cols is a string, NOT array. For example "id,name,description as description_one, ..."
    **/
    function prepareQueryColumns(&$translate_cols,&$select_cols,$lang="en"){
        $query_cols =explode(",",$select_cols);
        $i=0;
        $new_cols =null;
        foreach($query_cols as $col){
            $col = strtolower(trim($col?$col:""));
            $sts = explode(" as ",$col);
            $use_col =null;
            if(isset($sts[1])){
                if (in_array($sts[0],$translate_cols))
                  $use_col = $sts[0]."_$lang as ".$sts[1];
                else $use_col = $sts[0]." as ".$sts[1];
            }else if (in_array($sts[0],$translate_cols))
            {
                //Remove . from automatic alias. Example, "p.name" => so we use "name" as alisa. Store new alias name in $a_col
                $ts = explode(".",$sts[0]);
                $a_col ="";
                if(isset($ts[1])) $a_col = $ts[1]; else $a_col = $ts[0];
                $use_col = $sts[0]."_$lang as ".$a_col;
            }
            else $use_col = $sts[0];
            $new_cols .= (($new_cols && $use_col)? ",":"").$use_col;
            $i++;
        }
        return $new_cols;
    }

    function findFutureMonths($start_date,$months){
        $last_day = getLastDayOfMonth($start_date);
        $start_month = date('m',strtotime($start_date));
        $start_year = date('Y',strtotime($start_date));
        $start_month += 1;
        $days = dateDiff_days($start_date,$last_day);
        $date = $last_day;
        $i=1;
        do{
            $days = days_in_month($start_month,$start_year);
            $date = dateAdd('day',$days,$date);
            $start_month ++;
            $i++;
        }while($i<=$months);

        return (object)['end_date' => $date];
    }
?>
