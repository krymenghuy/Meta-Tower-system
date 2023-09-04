<?php
 use Illuminate\support\Facades\Auth;
 use Illuminate\Support\Facades\DB;
 use App\Models\UM;
 use Carbon\Carbon;
 use App\Models\DV;



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
    return str_replace(['\\', '%', '_'], ['\\\\', '\%', '\_'], $str);
}

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










function newOTP($length=6)
{
    return join('', array_map(function($value) { return $value == 1 ? mt_rand(1, 9) : mt_rand(0, 9); }, range(1, $length)));
}


function getAuthCode($d){

    if (!isset($d->decrypted)) $d->decrypted = 0;
  if(!isset($d->acc_tk_dms)) return null; //$d->access_token ='nI082mwubtCp0Tc92MRX9107tnvQfjiGd56pj8';

  $decrypted_token = null;
  if ($d->decrypted != 1) {
            $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
            $decrypted_token = $encrypter->decrypt($d->acc_tk_dms,false); //FALSE => to avoid serialization issue in decryption
            if (strpos($decrypted_token,'|')>0) {
                $parts = explode('|',$decrypted_token);
                if(isset($parts[1]))
                   $decrypted_token = $parts[1];
                else return null;
            }
  } else $decrypted_token = $d->acc_tk_dms;  /** In case external API called from mobile app => the $d->acc_tk_dms is decrypted already by, for example, by $senderModel->getSenderInfoByToken($request) **/

   if(session()->has('access_token')) {
          if (session('access_token') === $decrypted_token){
               $data =(object)[];
               $data->branch_id = session('branch_id',0);
               $data->user_id = session('user_id',0);
               $data->official_id = session('official_id',0);
               $data->login_name = session('login_name',0);
               $data->last_active_time = Carbon::now();
               return $data;
          }
      }

  $rows = DB::table('um_sessions AS u')->join('um_user_roles AS ur','ur.user_id','=','u.user_id')->where('u.access_token',$decrypted_token)->selectRaw('ur.role_id,u.branch_id,u.user_id, u.login_name,u.last_active_time,u.login_name')->limit(1)->get();
  foreach($rows as $row) {
      return $row;
  }
  return null;
}

function getSessionInfo($d){
    if (!isset($d->decrypted)) $d->decrypted = 0;
  if(!isset($d->acc_tk_dms)) return null; //$d->access_token ='nI082mwubtCp0Tc92MRX9107tnvQfjiGd56pj8';

  $decrypted_token = null;
  if ($d->decrypted != 1) {
            $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
            $decrypted_token = $encrypter->decrypt($d->acc_tk_dms,false); //FALSE => to avoid serialization issue in decryption
            if (strpos($decrypted_token,'|')>0) {
                $parts = explode('|',$decrypted_token);
                if(isset($parts[1]))
                   $decrypted_token = $parts[1];
                else return null;
            }
  } else $decrypted_token = $d->acc_tk_dms;  /** In case external API called from mobile app => the $d->acc_tk_dms is decrypted already by, for example, by $senderModel->getSenderInfoByToken($request) **/

   if(session()->has('access_token')) {
          if (session('access_token') === $decrypted_token){
               $data =(object)[];
               $data->branch_id = session('branch_id',0);
               $data->user_id = session('user_id',0);
               $data->official_id = session('official_id',0);
               $data->login_name = session('login_name',0);
               $data->last_active_time = Carbon::now();
               return $data;
          }
      }

  $rows = DB::table('um_sessions AS u')->join('um_user_roles AS ur','ur.user_id','=','u.user_id')->where('u.access_token',$decrypted_token)->selectRaw('ur.role_id,u.branch_id,u.user_id, u.login_name,u.last_active_time,u.login_name')->limit(1)->get();
  foreach($rows as $row) {
      return $row;
  }
  return null;
}



function makeJsonResponse($data) {
    $status_code = intVal(isset($data->status_code)?$data->status_code:0);
    if ($status_code > 0){
        if ($status_code ===401 || $status_code ===403 || $status_code ===405 || $status_code ===200) return response()->json($data);
        else return response()->json((object)['status'=>'Error','status_code'=>null,'error_message'=>'unexpected or invalid result']);
    } else return response()->json((object)['status'=>'OK','status_code'=>200,'data'=>$data]);
}

function prn_allowed($prn_id,$module_id){
   return UM::allowed($prn_id,$module_id);
}

 function getLastDayOfMonth($mDate)
 {
     $mDate = $this->convertDate($mDate);
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
    return $month == 2 ? ($year % 4 ? 28 : ($year % 100 ? 29 : ($year % 400 ? 28 : 29))) : (($month - 1) % 7 % 2 ? 30 : 31);
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
     return  $obj;
 }

function createFile($file_type,$fileName, $fileContent){
    $file_type = trim(strtolower($file_type));
     $result = (object)array('error'=>null,'filename'=>null);
      $dir = dirname($fileName);
      if (!file_exists($dir)) {
         mkdir($dir, 0755, true); //permission
      }
     $img_types = ['jpg','png','jpeg','svg','pdf'];



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


     $result->filename = $fileName.$ext;
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


    function sess_company_id(){
        return Session('branch_id',null);
    }

    function sess_user_id(){
        return Session('user_id',null);
    }

    function base_url($uri=null){
      $public_folder = env('ASSET_URL');
      $public_folder =  $public_folder? $public_folder."/":null;
      return url('/')."/".$public_folder.$uri;
    }

 function get_settings_value($user_session,$key,$valueType)
 {
     $branch_id = $user_session->branch_id;
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
 }

 function save_setting($user_session,$type,$key,$value,$description =null)
 {
	$branch_id = $user_session->branch_id;
	$tbl ="settings_string";
    if (strtolower($type) =='number') $tbl ="settings_number";
    $rows = [];
    $f = " `key` ='".$key."' ";
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

 function getDataRow($table_name,$key_fields=[], $cols=null){
    if(!$cols) $cols ="id";
    $m_where ="";
    foreach($key_fields as $field=>$value) $m_where .= $field."='$value'";
    $rows = DB::table($table_name)->whereRaw($m_where)->selectRaw($cols)->take(1)->get();
    foreach($rows as $row) return $row;
    return null;
 }

  function getDataValue($table_name,$key_fields=[], $col){
    if(!$col) $col ="id";
    $m_where ="";
    foreach($key_fields as $field=>$value) $m_where .= $field."='$value'";
    $rows = DB::table($table_name)->whereRaw($m_where)->selectRaw($col)->take(1)->get();
    foreach($rows as $row) return $row->{$col};
    return null;
 }

 function saveData($ss,$table_name,$update_field = [],$inputs=[],$extended_cols=[],$use_branch_id = 0){
    $key_field =null;
    $key_value = null;
    foreach($update_field as $field=>$value){
        $key_field = $field;
        $key_value = $value;
    }

    $new_id = null;
    foreach($extended_cols as $prop=>$value) $inputs[$prop] = $value;
    if ($key_value>0){
        $str_branch ="1=1";
        if ($use_branch_id) $str_branch = "branch_id =".$ss->branch_id?$ss->branch_id:0;
        $inputs['update_uid'] = $ss->user_id;
        $inputs['update_user'] = $ss->full_name;
        $inputs['update_date'] = getNowTime();
        DB::table($table_name)->where($key_field,$key_value)->whereRaw($str_branch)->update($inputs);
        $new_id = $key_value;
    }else{
        $inputs['branch_id'] = $ss->branch_id;
        $inputs['create_uid'] = $ss->user_id;
        $inputs['create_user'] = $ss->full_name;
        $inputs['create_date'] = getNowTime();
        DB::table($table_name)->insert($inputs);
        $new_id = DB::getPdo()->lastInsertId();
    }
    return $new_id;
 }

 function setCommonFields($d,$ss,$action = 'create',$include_branch_id=1){
        if ($action === 'create'){
            if ($include_branch_id===1) $d['branch_id'] = $ss->branch_id;
            $d['create_date'] = getNowTime();
            $d['create_uid'] = $ss->user_id;
            $d['create_user'] = $ss->full_name;
        }else{
            $d['update_date'] = getNowTime();
            $d['update_uid'] = $ss->user_id;
            $d['update_user'] = $ss->full_name;
        }
       return $d;
  }


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

     function getBase64ImageSize($base64Image=null){
        try{
            $size_in_kb = $size_in_bytes / 1024;
            return $size_in_kb;
        }
        catch(Exception $e){
            return -1;
        }
    }

    function getFileExtensionFromBase64($b){
        return null;
    }

    function processImage($b){
         return $b;
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

     }

     function getPropValue($prop_name=null,$part3=null,$part4=null){
        if (!$prop_name) return null;
        if ($part3){
            $sts = explode('=',$part3);
            $varname = trim($sts[0]?$sts[0]:'');
            if ($varname ===$prop_name) return isset($sts[1])?$sts[1]:null;
        }
        else if ($part4) {
            $sts = explode('=',$part4);
            $varname = trim($sts[0]?$sts[0]:'');
            if ($varname ===$prop_name) return isset($sts[1])?$sts[1]:null;
        } else return null;
     }


    function processInput($field_name=null,$val=null, $spec='',$lang =null){

    $lang = Session('lang','en'); //default langauge to English
    $field_name = $field_name?str_replace('_',' ',$field_name):'Some field name'; //$field_name is used to show which technical field_name has validation error
    $parts = explode('|',$spec);
    $part1 = isset($parts[0])?$parts[0]:null; /* {0,1} */
    $part2 = isset($parts[1])?$parts[1]:''; //{'string','date','timestamp','phone','email'} OR "default=50" or "default=sdfsddsfd"
    $part3 = isset($parts[2])?$parts[2]:''; // range: 1-50 length of text, or min and max of number
    $part4 = isset($parts[3])?$parts[3]:''; //this can be text_prop or default value for 'string' data type
    $part5 = isset($parts[4])?$parts[4]:''; //This is $text_prop
    $tmp = isset($parts[4])?$parts[4]:null;

    $my_text_prop = getPropValue('text',$part3,$part4);

    $def_val = getPropValue('default',$part4,$part3);
    $val = $val?$val:$def_val;

    $is_identity = getPropValue('identity',$part2); // example:  "id"=>"0|identity=1"

    if ($is_identity==1)
        return (object)['error'=>null,'is_identity'=>1,'default_value'=>$val];
    else if ($part1==0 || $part1===false)
        return (object)['error'=>null,'default_value'=>$val]; //value is not required
    else if ($part1==1 || $part1===true){

                if ($part2 === 'string' || !$part2){

                    if (!$val) return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name cannot be empty"),'default_value'=>$def_val];
                    $interval = getInterval($part3);
                    if ($interval->min ===-1 && $interval->max ===-1){
                        if (!$val) return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name cannot be empty"),'default_value'=>$def_val];
                    }else{
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
                        if($val> 0)
                            return (object)['error'=>null,'default_value'=>$val];
                        else return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name must be a positive number")];
                     }else{
                        if($val < $interval->min || $val > $interval->max)
                           return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name must be between $interval->min and $interval->max",[$interval->min,$interval->max])];
                        else return (object)['error'=>null,'default_value'=>$val];
                     }

                }else if ($part2 === 'date') {


                        $format = getPropValue('format',$part3);
                        if (!$format){
                            $format = getPropValue('format',$part3);
                            if (!$my_text_prop) $my_text_prop = getPropValue('text',$part3);
                        }

                        if (!$format){
                                 return (object)['error'=>null,'default_value'=>convertDate($val)];
                        }else{
                            $m_date = validateDate($val,$format);
                            if($m_date){
                                return (object)['error'=>null,'default_value'=>$m_date->format('Y-m-d')];
                            }
                            else return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name is not correct. Date format $format is expected",[$format])];
                        }

                 }else if ($part2 ==='timestamp') {
                    if((bool)strtotime($val))
                    return (object)['error'=>null,'default_value'=>$val];
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
                            return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name must be a number")];

                    }else{
                       if($val < $interval->min || $val > $interval->max)
                          return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name must be between $interval->min and $interval->max",[$interval->min,$interval->max])];
                       else return (object)['error'=>null,'default_value'=>$val];
                    }

                }else if ($part2 === 'object' || $part2 === 'array'){

                        if (!$val) return (object)['error'=>null,'default_value'=>null];

                          $obj = json_decode($val);
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
                            $b = processImage($val);
                            if ($b) return (object)['error'=>null,'default_value'=>$b];
                        }else{
                            if ($size < $interval->min || $size > $interval->max)
                            return (object)['error'=>Localization::translate($lang,$my_text_prop?$my_text_prop:"$field_name file size should be between ? and ?"),[$interval->min, $interval->max]];
                            else{
                                $b = processImage($val);
                                if ($b) return (object)['error'=>null,'default_value'=>$b];
                            }
                        }


                }
                else {
                    $def_val = getPropValue('default',$part2,null);

                    if ($def_val || $def_val==0){
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
                $ff = getPropValue('depend',$part1);
                if (!$ff){
                    return (object)['error'=>null,'default_value'=>$val];
                }else {
                            $dep_fields = explode(',',$ff?$ff:'');
                            $all_exps = true;  //All dependecy fields have values
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

     function getValues($req, $fields = [],$sanitize=1,$sanitize_options =[],$lang='en',$include_all_fields=1,$unique_specs=null){
        $langSection ='validation';
        $identity_field = null;
        $identity_value = null;

        $d = $req->all();
        $outputs = [];
        foreach($fields as $field=>$spec){
              $val = null;
              $op = null;
              if (is_array($sanitize_options)) $op = isset($sanitize_options[$field])?$sanitize_options[$field]:null;
              if(isset($d[$field])) $val = ($sanitize)? Sanitizer::sanitize($d[$field],$op):$d[$field];
              $res = processInput($field,$val,$spec,$lang);
              if($res->error) return (object)['error'=>$res->error,'values'=>null];

               $is_identity = isset($res->is_identity)?$res->is_identity:0;
                if ($is_identity ===1)
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
            if ((double)$identity_value > 0) $pk_field =[$identity_field] = $identity_value;
            else if ($identity_value) $pk_field =[$identity_field] = "'$identity_value'";

            foreach($unique_specs as $u_spec){
                $parts = explode('|',$u_spec);
                $part4= $parts[3]; //example  "id=person_id" where "id" is the table PK field name and "person_id" is the data's prop that contains id value
                $parts1 = explode('=',$part4); //"id=person_id"
                $pk_field_name = isset($parts1[0])?$parts1[0]:null;
                $pk_value =null;
                if($pk_field_name){
                        $pk_input_prop = isset($parts1[1])?$parts1[1]:null;
                        if (!$pk_input_prop) $pk_input_prop = $identity_field;
                        $pk_value= isset($d[$pk_input_prop])?$d[$pk_input_prop]:null;
                }
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

     }



     function getValuesBySection($d, $fields = [],$sanitize=1,$sanitize_options =[],$lang='en',$include_all_fields=1,$unique_specs=null){
        $langSection ='validation';
        $identity_field = null;
        $identity_value = null;

        $outputs = [];
        foreach($fields as $field=>$spec){
              $val = null;
              $op = null;
              if (is_array($sanitize_options)) $op = isset($sanitize_options[$field])?$sanitize_options[$field]:null;
              if(isset($d[$field])) $val = ($sanitize)? Sanitizer::sanitize($d[$field],$op):$d[$field];

                $res = processInput($field,$val,$spec,$lang);
                if($res->error) return (object)['error'=>$res->error,'values'=>null];

                $is_identity = isset($res->is_identity)?$res->is_identity:0;
                if ($is_identity ===1)
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
            foreach($unique_specs as $u_spec){
                $parts = explode('|',$u_spec);
                $part4= $parts[3]; //example  "id=person_id" where "id" is the table PK field name and "person_id" is the data's prop that contains id value
                $parts1 = explode('=',$part4); //"id=person_id"
                $pk_field_name = isset($parts1[0])?$parts1[0]:null;
                $pk_value =null;
                if($pk_field_name){
                        $pk_input_prop = isset($parts1[1])?$parts1[1]:null;
                        if (!$pk_input_prop) $pk_input_prop = $identity_field;
                        $pk_value= isset($d[$pk_input_prop])?$d[$pk_input_prop]:null;
                }
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

     }

    function checkUnique($d=null,$pk_field_name,$pk_value,$spec=null,$lang='en',$langSection='validation'){
        if (!$spec) return "Failed to check uniqueness of data";
        $parts = explode('|',$spec);
        if(!isset($parts[0])) return "Failed to check uniqueness of data. Unique_spec= $spec";
        if(!isset($parts[1])) return "Failed to check uniqueness of data. Unique Spec= $spec";
        if (!isset($parts[2])) return "Failed to check uniqueness of data. Unique Spec= $spec";

        $branch_id = $parts[0];
        $table = $parts[1];
        $field_list = explode(',',$parts[2]);

        $m_where ="";
        $select_cols =$pk_field_name; //presume a default. That all tables have a "id" column
        foreach($field_list as $fields){
             $sts = explode('!',$fields);
             $i =0;
             $where_con="";
             $has_or=0;
             foreach($sts as $f){
                if ($f){
                    $has_or = $where_con?1:0;
                    if (!isset($d[$f])) return "Error in checking uniqueness because field $f is empty or it is not supplied";
                    if ($d[$f]) $where_con .= ($where_con? ' OR ':''). $f."='".$d[$f]."'";
                    $i++;
                }
             }
             if ($has_or) $where_con = "($where_con)";
             $m_where .= ($m_where? ' AND ':'').$where_con;
        }



        $str_pk = "";

        if($pk_value > 0) $str_pk = " AND $table.$pk_field_name <> $pk_value";
        else if($pk_value) $str_pk =" AND $table.$pk_field_name <> '$pk_value'";
        $text = getPropValue('text',$parts[3]);
        if (!$text)
        {
              $text = getPropValue('text',$parts[4]);
        }

        $str_branch = "1=1 ";
        if ($branch_id > 0) $str_branch ="branch_id =$branch_id ";
        $m_where =  $str_branch." AND ".$m_where.$str_pk;
        $rows = DB::table($table)->whereRaw($m_where)->selectRaw($select_cols)->limit(1)->get();
        if (count($rows)>0)
          return $text?$text:"$table already exists";
        else return null;
    }

    function validateDate($date,$format){
        if (!$date) return null;
        $d = DateTime::createFromFormat($format, $date);
        if ($d && $d->format($format) === $date) return $d;
        else return null;
     }

    function isPhoneNumber($phone_number=null,$nullable=0){
      if (empty($phone_number)) if ($nullable===1) return true;
      return true;
    }

    function isEmail($email=null,$nullable=0){
        if (empty($email)) if ($nullable===1) return true;
        return true;
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

    function channel_prefix(){
        //NOTE: main.js => mThis.backend_channel_name = 'houex.backend.${branch_id}'
        return Config::get('app.pusher_channel_prefix');  //return "vsdev.";
    }

    function topic_prefix($user_class){
        return Config::get('app.fcm_topic_prefix').$user_class;  //return "vsdev".$user_class;
    }

    function getServerKey(){
        return Config::get('app.fcm_server_key'); 
        //return "AAAAsd6RSXs:APA91bH79xi7hY-x1HIpHmwK0GiMq53MVdEc0ruVQt6r60Et8Ww6c1RP1YGs0_Sx_RCUDHvmfI1-Sa4v5KBIVwGha6AC_Q0410CIrwXdJ3KaPx_4c0ftVbfW8FplfJiW52kLbD21WIZT";
    }

    function getAppIdByUserClass($user_class){
        if ($user_class ==='parent') return Config::get('app.customer_app_id');
        else  if ($user_class ==='admin') return Config::get('app.app_id');
        else  if ($user_class ==='staff') return Config::get('app.app_id');
        else return Config::get('app.app_id');
     }

    function extendProps($cols=[],$d=null){
        if (!$cols) return $d;
        else if (!$d) return $d;
        $cols1 = (array)$cols;
        foreach($cols1 as $key=>$value) $d->{$key} = $value;
        return $d;
    }
?>
