<?php
 //use Illuminate\support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Facades\Image;

 use Illuminate\Http\Client\RequestException;


function getAccessBranches($ss=null,$filter_branch_id = null){
    if(!$ss) $ss = XAuthService::user();
    if(!$ss) return [0];
    $branches = $ss->branches;
    $branchIds = [];
    if(!isset($branches[0])){
      return DB::table('um_branches as b')->where('b.id',$ss->branch_id)->pluck('id');
    }
     foreach($branches as $b) $branchIds[] =$b->id;
     if($filter_branch_id > 0 && in_array($filter_branch_id,$branchIds)){
       return [$filter_branch_id];
     }
     if(!isset($branchIds[0]))  $branchIds[] = 0;
     return $branchIds;
}


function escape_like_str($portion) {
    $portion = mb_substr(trim($portion), 0, 250, 'UTF-8'); // Trim and limit to 250 chars
    return strtr($portion, ['\\' => '\\\\', '%' => '\\%', '_' => '\\_', '\'' => '\\\'']);
}

function strNoSpace($value){
    $value = preg_replace('/[^\p{Khmer}A-Za-z0-9@.\-\s]/u', '', $value);
    $value = trim($value);
    return $value;
}
function isExists($table,$pk,$checkCol,$inputValue,$updateID=null){
    $self_exists = DB::table($table)->where($pk)->selectRaw($checkCol)->first();
    if($updateID>0){
        if($self_exists && $self_exists->$checkCol !== $inputValue){
            $exists = DB::table($table)->where($checkCol,$inputValue)->exists();
            if($exists) return true;
        }
    }else{
        if($self_exists && $self_exists->$checkCol == $inputValue){
            $exists = DB::table($table)->where($checkCol,$inputValue)->exists();
            if($exists) return true;
        }
    }
    return false;
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



function newOTP($length=6)
{
    return join('', array_map(function($value) { return $value == 1 ? mt_rand(1, 9) : mt_rand(0, 9); }, range(1, $length)));
}


/**
 * Convert database date (ISO format) to any PHP date format.
 *
 * @param string|null $dbDate   Date from DB (e.g. 2026-02-27 or 2026-02-27 14:35:00)
 * @param string $format        PHP date format (default: d-M-Y)
 * @param string|null $timezone Optional timezone (e.g. 'Asia/Phnom_Penh')
 * @return string|null
 */
function formatDbDate(?string $dbDate, string $format = 'd-M-Y', ?string $timezone = null): ?string
{
    if (empty($dbDate)) {
        return null;
    }

    try {
        $tz = $timezone ? new DateTimeZone($timezone) : null;

        $date = $tz
            ? new DateTime($dbDate, $tz)
            : new DateTime($dbDate);

        return $date->format($format);

    } catch (Exception $e) {
        // Invalid date format
        return null;
    }
}

function formatOfficialDate(?string $date): ?string
{
    if (empty($date)) {
        return null;
    }

    $format = config('dbx_config.default_date_format', 'd-M-Y');

    try {
        return (new DateTime($date))->format($format);
    } catch (Exception $e) {
        return null;
    }
}

function formatOfficialTime(?string $dateTime): ?string
{
    if (empty($dateTime)) {
        return null;
    }

    $format = config('dbx_config.default_time_format', 'd-M-Y H:i');

    try {
        return (new DateTime($dateTime))->format($format);
    } catch (Exception $e) {
        return null;
    }
}


/**
 * Format date/time fields using official formats.
 *
 * @param object|array &$row
 * @param array $dateCols        Full date/datetime columns (supports "col as alias")
 * @param array $timeOnlyCols    Time-only columns (supports "col as alias")
 * @return void
 */
function setOfficialDates(&$row, array $dateCols = [], array $dateTimeCols= [], array $timeOnlyCols = []): void
{
    if (empty($dateCols) && empty($timeOnlyCols)) {
        return;
    }

    $dateFormat = config('dbx_config.default_date_format', 'd-M-Y');
    $timeFormat = config('dbx_config.default_time_only_format', 'H:i');
    $dateTimeFormat = config('dbx_config.default_datetime_format', 'd-M-Y H:i');

    // Process date columns
    foreach ($dateCols as $definition) {
        processOfficialColumn($row, $definition, $dateFormat);
    }

    // Process DateTime columns
    foreach ($dateTimeCols as $definition) {
        processOfficialColumn($row, $definition, $dateTimeFormat);
    }

    // Process time-only columns
    foreach ($timeOnlyCols as $definition) {
        processOfficialColumn($row, $definition, $timeFormat);
    }
}

/**
 * Internal processor for one column definition.
 */
function processOfficialColumn(&$row, string $definition, string $format): void
{
    // Parse alias: "col as alias"
    $parts = preg_split('/\s+as\s+/i', trim($definition));
    $source = trim($parts[0]);
    $target = isset($parts[1]) ? trim($parts[1]) : $source;

    $value = null;

    if (is_object($row)) {
        $value = $row->$source ?? null;
    } elseif (is_array($row)) {
        $value = $row[$source] ?? null;
    }

    if (!$value) {
        return;
    }

    try {
        $formatted = (new DateTime($value))->format($format);

        if (is_object($row)) {
            $row->$target = $formatted;
        } else {
            $row[$target] = $formatted;
        }

    } catch (Exception) {
        // silently ignore invalid date
    }
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
//                $data->last_active_time = getNowTime();
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
    \Log::info('str'.json_encode($str_where));
    if($x || $x===1){
       $updated = DB::table($code_control_table)->whereRaw($where_branch)->update(['last_id'=>$next_num]);
       if (!$updated) DB::table($code_control_table)->insert(['branch_id'=>$branch_id,'prefix'=>$def_prefix,'last_id'=>$next_num]);
       if ($onSuccess) $onSuccess();
       return (object)['status'=>'OK','code'=>$new_code];
    }
    return null;
    //return $prefix.$branch_id.formatNumber(1,$len);
}

function setOfficialCodeInvoice($branch_id, $code_control_table, $target_table, $key_field=[], $def_prefix="", $len=4, $onSuccess=null)
{
    if (empty($key_field)) return null;
    if (!$len) $len = 4;

    $yy = date('y');
    $prefix = $def_prefix . $yy . '-';

    $where_branch = "1=1";
    if ($branch_id > 0) {
        $where_branch = "branch_id = " . (int)$branch_id;
    }
    $where_branch .= " AND prefix = '" . addslashes($prefix) . "'";
    $row = DB::table($code_control_table)
        ->whereRaw($where_branch)
        ->select('last_id', 'prefix')
        ->first();

    $next_num = 0;
    if ($row) {
        $next_num = (int)$row->last_id;
    }
    $next_num++;
    $new_code = $prefix . formatNumber($next_num, $len);
    $str_where = "";
    foreach ($key_field as $pk_field => $pk_value) {
        if ($str_where) $str_where .= " AND ";
        $str_where .= "$pk_field = '" . addslashes($pk_value) . "'";
    }
    if (!$str_where) return null;

    $x = DB::table($target_table)
        ->whereRaw($str_where)
        ->update(['code' => $new_code]);

    \Log::info('setOfficialCode updated rows: ' . $x . ' | where: ' . $str_where);

    if ($x > 0) {
        $updated = DB::table($code_control_table)
            ->whereRaw($where_branch)
            ->update(['last_id' => $next_num]);

        if (!$updated) {
            DB::table($code_control_table)->insert([
                'branch_id' => $branch_id,
                'prefix'    => $prefix,
                'last_id'   => $next_num,
                'created_at' => date('Y-m-d H:i:s')
            ]);
        }

        if ($onSuccess) $onSuccess();

        return (object)[
            'status' => 'OK',
            'code'   => $new_code
        ];
    }

    return null;
}
function setOfficialExpenseNo($branch_id,$code_control_table,$target_table,$key_field=[],$def_prefix="",$len=5,Closure $onSuccess = null){
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

    $x = DB::table($target_table)->whereRaw($str_where)->update(['expense_no'=>$new_code]);
    \Log::info('str'.json_encode($str_where));
    if($x || $x===1){
       $updated = DB::table($code_control_table)->whereRaw($where_branch)->update(['last_id'=>$next_num]);
       if (!$updated) DB::table($code_control_table)->insert(['branch_id'=>$branch_id,'prefix'=>$def_prefix,'last_id'=>$next_num]);
       if ($onSuccess) $onSuccess();
       return (object)['status'=>'OK','expense_no'=>$new_code];
    }
    return null;
    //return $prefix.$branch_id.formatNumber(1,$len);
}
function setOfficialBillNumber($branch_id,$code_control_table,$target_table,$key_field=[],$def_prefix="",$len=5,Closure $onSuccess = null){
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

    $x = DB::table($target_table)->whereRaw($str_where)->update(['bill_number'=>$new_code]);
    \Log::info('str'.json_encode($str_where));
    if($x || $x===1){
       $updated = DB::table($code_control_table)->whereRaw($where_branch)->update(['last_id'=>$next_num]);
       if (!$updated) DB::table($code_control_table)->insert(['branch_id'=>$branch_id,'prefix'=>$def_prefix,'last_id'=>$next_num]);
       if ($onSuccess) $onSuccess();
       return (object)['status'=>'OK','bill_number'=>$new_code];
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

        if (in_array($status_code,[200,401,402,403,405])) return response()->json($data);
        else{
            $err_message = isset($data->error_message)? $data->error_message: 'Unexpected error '.$status_code;
            return response()->json((object)['status'=>'Error','status_code'=>$status_code,'error_message'=>$err_message]);
        }
    } else return response()->json((object)['status'=>'OK','status_code'=>200,'data'=>$data]);
}

//  //if module_id is supplied, then it means if module is accessible => allows access
//  function prn_allowed($prn_id,$module_id){
//     return UM::allowed($prn_id,$module_id);
//  }

 function getLastDayOfMonth($mDate)
 {
     $mDate = convertDate($mDate);
     $date = new DateTime($mDate);
     $date->modify('last day of this month');
     $last_date =  $date->format('Y-m-d');
     return $last_date;
 }

 function getMonthName($num,$full_name=false){
    switch($num){
        case 1:{
            return 'Jan';
        }
        case 2:{
            return 'Feb';
        }
        case 3:{
         return 'Mar';
     }
     case 4:{
         return 'Apr';
     }
     case 5:{
         return 'May';
     }
     case 6:{
         return 'Jun';
     }
     case 7:{
         return 'Jul';
     }
     case 8:{
         return 'Aug';
     }
     case 9:{
         return 'Sep';
     }
     case 10:{
         return 'Oct';
     }
     case 11:{
         return 'Nov';
     }
     case 12:{
         return 'Dec';
     }
    }
 }

 function isURL($str) {
    // Use filter_var with FILTER_VALIDATE_URL to check if it's a valid URL
    return filter_var($str, FILTER_VALIDATE_URL) !== false;
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

 function getKhmerDate($date = null) {
    $date = convertDate($date) ?? date('Y-m-d');
    // Define Khmer month numbers
    $khmerMonths = [
        1 => 'មករា',
        2 => 'កុម្ភៈ',
        3 => 'មិនា',
        4 => 'មេសា',
        5 => 'ឧសភា',
        6 => 'មិថុនា',
        7 => 'កក្កដា',
        8 => 'សីហា',
        9 => 'កញ្ញា',
        10 => 'តុលា',
        11 => 'វិច្ឆិកា',
        12 => 'ធ្នូ',
    ];

    // Extract day, month, and year components
    list($year, $month, $day) = explode('-', $date);

    // Convert the month to Khmer
    $monthInKhmer = $khmerMonths[(int)$month]; // Convert to integer to map correctly

    // Convert day and year to Khmer numerals
    $dayInKhmer = convertToKhmerNumerals($day);
    $yearInKhmer = convertToKhmerNumerals($year);

    // Return the formatted date
    return "ថ្ងៃទី​​ {$dayInKhmer} ខែ​​ {$monthInKhmer} ឆ្នាំ {$yearInKhmer}";
}

// Helper function to convert numbers to Khmer numerals
function convertToKhmerNumerals($number) {
    $result = '';

       // Khmer numerals map (0-9)
       $khmerNumerals = [
        '0' => '០',
        '1' => '១',
        '2' => '២',
        '3' => '៣',
        '4' => '៤',
        '5' => '៥',
        '6' => '៦',
        '7' => '៧',
        '8' => '៨',
        '9' => '៩',
     ];

    // Split the number into individual digits and convert each to Khmer numeral
    foreach (str_split($number) as $digit) {
        $result .= $khmerNumerals[$digit];
    }
    return $result;
}

 //daysInMonth()
 function days_in_month($month, $year){
    // calculate number of days in a month
    return $month == 2 ? ($year % 4 ? 28 : ($year % 100 ? 29 : ($year % 400 ? 28 : 29))) : (($month - 1) % 7 % 2 ? 30 : 31);
 }

 /** given start_date and end_date, returns object { "months"=> [12,1,2] , "years"=>[2023,2024,2024]} */
 function getMonthYearObject($start_date,$end_date){
    $i = 0;
    $next_date = ($start_date);
    $months = [];
    $years =[];
    do{
     $m = date('m', strtotime($next_date));
     $y = date('Y', strtotime($next_date));
     if (!in_array($m,$months)){
         $months[] = intval($m);
         $years[] = $y;
     }

     $next_date = date('Y-m-d', strtotime($next_date . ' +1 day'));
     $i++;
    }while($next_date <=$end_date);
    return (object)[
      'months'=>$months,
      'years'=>$years
    ];
 }

 function dateDiff_days($start_date,$end_date, $include_start_day = false){
    $date1 = new DateTime($start_date);
    $date2 = New DateTime($end_date);
    $diff = $date1->diff($date2);
    $days = $diff->days + ($include_start_day? 1:0);
    return $days;
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
  } else return 'File not found for deleting';
}

function readFileContent($fileName=null,$file_format = 'UTF-8')
{
    if (empty($fileName)) return null;
    if (!file_exists($fileName)) return null;
    $fileSize = filesize($fileName);
    if ($fileSize<=0) return null;
    $handle = fopen($fileName, 'r');
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

    // function getMIMEType($fileName =null)
    // {
    //     if (!$fileName) return null;
    //    $ext = getFileExtension($file_name);
    //    $ext= strtolower($ext?$ext:'');
    //    return $mimeTypes[$ext];
    // }

  function getNowTime()
   {
     return date('Y-m-d H:i:s');
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

  function getLocationUrl($latitude, $longitude) {
    // Check if latitude and longitude are valid
    if (!is_numeric($latitude) || !is_numeric($longitude)) {
        // Return empty string if either latitude or longitude is not valid
        return '';
    }

    // Google Maps API Base URL for directions
    $base_url = "https://www.google.com/maps/dir/?api=1";

    // Destination coordinates
    $destination = "&destination=" . $latitude . "," . $longitude;

    // Combine base URL and destination coordinates
    $url = $base_url . $destination;

    return $url;
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

    //sess_branch_id
    function sess_company_id(){
        $user =XAuthService::user();
        return $user->branch_id;
    }

    function sess_user_id(){
        return XAuthService::user()->id;
    }

    function sess_subs_id(){
        $user = XAuthService::user();
        if(!$user) return "";
        return $user->subs_id;
    }

    function sess_app_id($route_name){
        return XUMTSettings::getAppIdFromRoute($route_name);
    }

    function base_url($uri=null){
      //Normally css and js are stored in directory "public/assets/css ..."
      //but on local environment ASSET_URL is empty in .env file
      $public_folder = env('ASSET_URL');
      $public_folder =  $public_folder? $public_folder."/":null;
      return url('/')."/".$public_folder.$uri;
   }

    function getCurrentSubsId($use_env_value = false){
        $user = XAuthService::user();
        if(!$user){
             //This is correct only for Single-subscriber system.
             if ($use_env_value){
                $d = XSubscription::defaultSubscription(30);
                return ($d? $d->id: null);
             }
             else return null;
        }
        return $user->subs_id;
    }
    function getCurrentSubs($use_env_value=false){
        $user = XAuthService::user();
        if(!$user){
            if($use_env_value){
                //This is correct only for Single-subscriber system.
                $d = XSubscription::defaultSubscription(30);
                return (Object)['id'=>$d->id,'subscriber_id'=>$d->subscriber_id];
            }else return (Object)['id'=>null,'subscriber_id'=>null];
        }
        return (Object)['id'=>$user->subs_id,'subscriber_id'=>$user->subscriber_id];
    }

    function isBinary($string)
    {
        return preg_match('~[^\x20-\x7E\t\r\n]~', $string) > 0;
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

 function getMonthName_full($num)
 {
	 if ($num < 1) $num =1;
	 $months = array(0=>'January',1=>'February',2=>'March',3=>'April',4=>'May',5=>'June',6=>'July',7=>'August',8=>'September',9=>'October',10=>'November',11=>'December');

	 return $months[($num-1)];
 }

//  function deleteDataRow($table_name,$key_fields=[]){
//     $m_where ="";
//     foreach($key_fields as $field=>$value){
//         $sp = $m_where? " AND ":"";
//         if(is_numeric($value))
//            $m_where .= $sp.$field."=$value";
//         else $m_where .= $sp.$field."='$value'";
//     }
//     DB::table($table_name)->whereRaw($m_where)->delete();
//     return null;
//  }

//  //return row object based on the given key value
//  function getDataRow($table_name,$key_fields=[], $cols=null){
//     if(!$cols) $cols ="id";
//     $m_where ="";
//     foreach($key_fields as $field=>$value){
//         $sp = $m_where? " AND ":"";
//         if($value > 0)
//            $m_where .= $sp.$field."=$value";
//         else $m_where .= $sp.$field."='$value'";
//     }
//     return DB::table($table_name)->whereRaw($m_where)->selectRaw($cols)->take(1)->first();
//  }

//   //return value a specified field given key value
//   function getDataValue($table_name,$key_fields=[], $col=""){
//     if(!$col) $col ="id";
//      $m_where ="";
//       foreach($key_fields as $field=>$value){
//         $sp = $m_where? " AND ":"";
//         if(is_numeric($value))
//            $m_where .= $sp.$field."=$value";
//         else $m_where .= $sp.$field."='$value'";
//     }

//     $rows = DB::table($table_name)->whereRaw($m_where)->selectRaw($col)->take(1)->get();
//     foreach($rows as $row) return $row->{$col};
//     return null;
//  }

//  function record_exists($table_name,$key_field,$use_branch_id = 0){
//     $key_field_name =null;
//     $key_value = null;
//     foreach($key_field as $field=>$value){
//         $key_field_name = $field;
//         $key_value = $value;
//     }
//    $str_branch ="1=1";

//    if($use_branch_id){
//       $branch_id = XAuthService::getBranchId();
//       $str_branch ="branch_id = $branch_id";
//    }
//    return DB::table($table_name)->where($key_field_name,$key_value)->whereRaw($str_branch)->selectRaw($key_field_name)->take(1)->exists();

//  }

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
        $inputs[DBX::$updated_at] = getNowTime();
        DB::table($table_name)->where($key_field_name,$key_value)->whereRaw($str_branch)->update($inputs);
        $new_id = $key_value;
    }
    else{

        $inputs['branch_id'] = $ss->branch_id;
        $inputs['create_uid'] = $ss->user_id;
        $inputs['create_user'] = $ss->full_name;
        $inputs[DBX::$created_at] = getNowTime();
        DB::table($table_name)->insert($inputs);
        $new_id = DB::getPdo()->lastInsertId();
    }
    return $new_id;
 }

//  function createGUID() {
//     $timestamp = round(microtime(true) * 1000);
//     $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     $length = 30;

//     $randomString = substr(str_shuffle(str_repeat($characters, ceil($length / strlen($characters)))), 1, $length);

//     return  $timestamp . strtoupper($randomString);
// }

/** createUUID version 4. NOTE that 3A, for example, is converted to be ":", causing error in php code */
function createUUID($remove_hyphens = false) {
    $undesirableHex = [
        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
        '2A', '2B', '2C', '2D', '2E', '2F', '3A', '3B', '3C', '3D',
        '3E', '3F', '40', '5B', '5C', '5D', '5E', '5F', '60', '7B',
        '7C', '7D', '7E'
    ];
    do {
        $uuid = strtoupper($remove_hyphens ? str_replace('-', '', \Ramsey\Uuid\Uuid::uuid4()->toString()) : \Ramsey\Uuid\Uuid::uuid4()->toString());
    } while (containsUndesirableHex($uuid, $undesirableHex));
    return $uuid;
}

function containsUndesirableHex($hex, $undesirableHex) {
    foreach ($undesirableHex as $byte) {
        if (stripos($hex, $byte) !== false) return true;
    }
    return false;
}

function createUUIDV1()
{
    // Generate a Version 1 UUID (time-based)
    $uuid = sprintf(
        '%08x-%04x-%04x-%02x%02x-%012x',
        time(),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xff),
        mt_rand(0, 0xff),
        mt_rand(0, 0xffffffffffff)
    );

    return $uuid;
}

 //Unlike createForcibly(), the method DBX::saveData() checks the given $key_value. If it is given valid then UPDATE, else CREATE new record.
 //Unlike method createForcibly(), DBX::saveData() will commit UPDATE when the given key_value is positive even this key_value does not exists in target table
 //$pk_field_array is $key_fields. example ['id'=>120] or ["id"=>":student_id"]. In ":student_id", the "student_id" is the prop or array key, for example, $input['student_id']
 // $data_scope = {0 = not use branch_id and subs_id ,1 = use branch_id, 2 = use subs_id}.
 function saveData($ss,$table_name,$pk_field_array = [],$inputs=[],$extended_cols=[],$data_scope = 0,$endure_exits=false,$primary_key_type = 'auto_number'){
    $key_field =null;
    $key_value = null;
    $primary_key_type = $primary_key_type ?? 'auto_number';
    $primary_key_type = in_array($primary_key_type,['auto_number','number','int','integer'])? 'auto_number':$primary_key_type;
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

    $use_fixed_branch = 0;
    $use_fixed_subs_id = 0;
    if ($data_scope === 1){
        $subs_id = $ss->subs_id;
        $branch_id = $inputs['branch_id'] ?? $ss->branch_id;
        $use_fixed_branch = 1;
        $use_fixed_subs_id = 1;
    }else if($data_scope === 2){
        $subs_id = $ss->subs_id;
        $branch_id = $inputs['branch_id'] ?? $ss->branch_id;
        $use_fixed_branch = 1;
        $use_fixed_subs_id = 1;
    }
    else{
        $subs_id = null;
        $branch_id = null;
    }

    if ($key_value){
        //$str_branch ="1=1";
        //if ($use_fixed_branch && $branch_id) $str_branch = "branch_id =".$branch_id;
        $query = DB::table($table_name)->where($key_field,$key_value);
        if($use_fixed_subs_id ===1 && $subs_id) $query->where('subs_id',hex2bin($subs_id));
        //if($use_fixed_branch ===1 && $branch_id > 0) $query->where('branch_id',$branch_id);

        $inputs['update_uid'] = $ss->user_id;
        $inputs['update_user'] = $ss->full_name;
        $inputs[DBX::$updated_at] = getNowTime();
        $query->update($inputs);
        return $key_value;
    }else{
        $nowTime = getNowTime();
        if ($branch_id) $inputs['branch_id'] = $branch_id;
        if ($subs_id) $inputs['subs_id'] = hex2bin($subs_id);
        $inputs['create_uid'] = $ss->user_id;
        $inputs['create_user'] = $ss->full_name;
        $inputs[DBX::$created_at] = $nowTime;
        $inputs['update_uid'] = $ss->user_id;
        $inputs['update_user'] = $ss->full_name;
        $inputs[DBX::$updated_at] = $nowTime;

        $pk_value = null;

        if($primary_key_type === 'auto_number'){
            DB::table($table_name)->insert($inputs);
            $new_id = DB::getPdo()->lastInsertId();
            return $new_id;
        }else if ($primary_key_type ==='guid'){
            $pk_value =   str_replace('-','',createUUID());
            $inputs[$key_field]= $pk_value;
            DB::table($table_name)->insert($inputs);
            return $pk_value;
        }else if($primary_key_type ==='binary'){
            //pk_value is a binary(16) value ready to be insert into database tabe column of data type BINARY(16)
            //$pk_value = DB::raw("UNHEX(REPLACE('".createUUID()."', '-', ''))");
            $pk_value = hex2bin( str_replace('-','',createUUID()));
            $inputs[$key_field]= $pk_value;
            DB::table($table_name)->insert($inputs);
            return $pk_value;
        }
    }

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
        if(filter_var($base64_string, FILTER_VALIDATE_URL))  return (object)['error'=>'The data is not an image','image'=>null];
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
            $image = Image::make($base64_string);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    //return memory size in B, KB, MB
    //getImageSize() |
     function getBase64ImageSize($base64Image=null){
        try{
            $size_in_bytes = (int) (strlen(rtrim($base64Image, '=')) * 3 / 4);
            $size_in_kb = $size_in_bytes / 1024;
            //$size_in_mb    = $size_in_kb / 1024;
            return $size_in_kb;
        }
        catch(Exception $e){
            //Failed to check size
            return -1;
        }
    }


    //  function getPropValue($prop_name=null,$part3=null,$part4=null){
    //     //if(!$prop_name) return $part3? $part3: ($part4? $part4:null);
    //     if (!$prop_name) return null;
    //     $prop_found = false;
    //     if ($part3){
    //         $sts = explode('=',$part3);
    //         $varname = trim($sts[0]?$sts[0]:'');
    //         if ($varname ===$prop_name){
    //             $prop_found = true;
    //             return isset($sts[1])?$sts[1]:null;
    //         }
    //         //else if ($varname != $prop_name) return $part3;
    //     }

    //     if (!$prop_found  && $part4) {
    //         $sts = explode('=',$part4);
    //         $varname = trim($sts[0]?$sts[0]:'');
    //         if ($varname ===$prop_name) return isset($sts[1])?$sts[1]:null;
    //         //else if ($varname != $prop_name) return $part4;
    //     }
    //     return null;
    //     // if ($sts[0]===$prop_name) return isset($sts[1])?$sts[1]:null;
    //     // $sts = explode('=',$part4);
    //     // if ($sts[0]===$prop_name) return isset($sts[1])?$sts[1]:null;
    //  }


    // function validateDate($date,$format){
    //     //return date('Y-m-d',strtotime($date));
    //     //return  convertDate($date);
    //     if (!$date) return null;
    //     $d = DateTime::createFromFormat($format, $date);
    //     // The Y ( 4 digits year ) returns TRUE for any integer with any number of digits so changing the comparison from == to === fixes the issue.
    //     if ($d && $d->format($format) === $date) return $d;
    //     else return null;
    //  }

    //  function isPhoneNumber($phoneNumber) {
    //     if (ctype_digit($phoneNumber)) {
    //         if (strlen($phoneNumber) >=9 || strlen($phoneNumber) <= 12) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // function isEmail($email=null,$nullable=0){
    //     if (empty($email)) if ($nullable===1) return true;
    //     return true;
    // }

	// function seo_friendly_url($string){
	// 	$string = str_replace(array('[\', \']'), '', $string);
	// 	$string = preg_replace('/\[.*\]/U', '', $string);
	// 	$string = preg_replace('/&(amp;)?#?[a-z0-9]+;/i', '-', $string);
	// 	$string = htmlentities($string, ENT_COMPAT, 'utf-8');
	// 	$string = preg_replace('/&([a-z])(acute|uml|circ|grave|ring|cedil|slash|tilde|caron|lig|quot|rsquo);/i', '\\1', $string );
	// 	$string = preg_replace(array('/[^a-z0-9]/i', '/[-]+/') , '-', $string);
	// 	return strtolower(trim($string, '-'));
	// }

    // function getStoragePath($private=false){
    //     if($private)
    //       {
    //         $path = Storage::disk('private')->path('');
    //       }else{
    //          //$path = Storage::disk('public')->path('');
    //          $path = getcwd().Config::get('app.storage_dir');
    //       }
    //     return $path;
    // }

    // //To upport misspelling version
    // function getAdminAppId(){
    //     return Config::get('app.app_id');
    // }

    // function thisAppId()
    // {
    //   return Config::get('app.app_id');
    // }

    // function getAppId(){
    //     return Config::get('app.app_id');
    // }

    function channel_prefix(){
        //NOTE: main.js => mThis.backend_channel_name = 'houex.backend.${branch_id}'
        return Config::get('app.pusher_channel_prefix');  //return "vsdev.";
    }

    // function topic_prefix($user_class=null){
    //     $user_class = strtolower($user_class);
    //     if($user_class ==='sales_agent')
    //        return Config::get('app.fcm_topic_prefix_salesapp').$user_class;  //return "vsdev".$user_class;
    //     else return Config::get('app.fcm_topic_prefix').$user_class;  //return "vsdev".$user_class;
    // }

    function getServerKey($user_class=null){
        $user_class = strtolower($user_class);
        if($user_class==='sales_agent')
        return Config::get('app.fcm_server_key_salesapp');
        else return Config::get('app.fcm_server_key');
        //return "AAAAsd6RSXs:APA91bH79xi7hY-x1HIpHmwK0GiMq53MVdEc0ruVQt6r60Et8Ww6c1RP1YGs0_Sx_RCUDHvmfI1-Sa4v5KBIVwGha6AC_Q0410CIrwXdJ3KaPx_4c0ftVbfW8FplfJiW52kLbD21WIZT";
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

    function validateUrl($url, $otherwise = '') {
        // Check if URL is empty or null
        if (!$url) {
            //\Log::info('URL is empty or null');
            return $otherwise;
        }

        // Construct the local file path based on the provided URL
        $localFilePath = public_path(parse_url($url, PHP_URL_PATH));

        // Check if the file exists
        if (file_exists($localFilePath) && is_file($localFilePath)) {
            // Get the file extension
            $fileExtension = pathinfo($localFilePath, PATHINFO_EXTENSION);

            // List of allowed file extensions (add more as needed)
            $allowedExtensions = array('jpg', 'jpeg', 'png', 'gif');

            // Check if the file extension is in the list of allowed extensions
            if (in_array(strtolower($fileExtension), $allowedExtensions)) {
                // File exists and has a valid extension
                return $url;
            }
            // else {
            //     \Log::info('File extension not allowed: ' . $fileExtension);
            // }
        }
        // else {
        //     \Log::info('File does not exist or is not a valid file: ' . $localFilePath);
        // }

        // File does not exist or does not have a valid extension
        return $otherwise;
    }

    function getImageUrl($branch_id,$user_class,$file_name){
        $user_class = strtolower($user_class);
        if($file_name !=null){
            return XPublicStorage::getURl($branch_id,$user_class,'image').$file_name;
        }
        return null;
    }

    function OPICall($prompt)
        {
            try {
                // Your OpenAI API key
                $apiKey = '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';

                // Endpoint URL
                $endpoint = 'https://api.openai.com/v1/chat/completions'; // Update the endpoint for GPT-4

                // Request data
                $data = [
                    'messages' => $prompt,
                    'max_tokens' => 50,
                    "model"=>'gpt-3.5-turbo-instruct',
                    "temperature"=> 0.7,
                    "top_p" => 1.0,
                    "n" => 1,
                    "stop"=> "\n"
                ];

                // Make the API call
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json',
                ])->post($endpoint, $data);

                // Process the response
                if ($response->successful()) {
                    return $response->json();
                } else {
                    return response()->json(['error' => 'OPI call failed', 'details' => $response->json()], $response->status());
                }
            } catch (RequestException $e) {
                return response()->json(['error' => 'RequestException', 'details' => $e->getMessage()], 500);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Exception', 'details' => $e->getMessage()], 500);
            }
        }

        function getSQLParts_months($input, $month_col_expression = null, $year_col_expression=null) {
            $month_col_expression = $month_col_expression ?? 'c.op_month';
            $year_col_expression = $year_col_expression ?? 'c.op_year';
            if(!$input){
                return (object)[
                    'sql'=>'7=7',
                    'years'=>[],
                    'months'=>[],
                    'last_month_info'=>(object)['month'=>0,'year'=>0],
                    'error'=>''
                ];
            }

            $months = [
                "Jan" => 1, "Feb" => 2, "Mar" => 3, "Apr" => 4, "May" => 5, "Jun" => 6,
                "Jul" => 7, "Aug" => 8, "Sep" => 9,"Sept" => 9, "Oct" => 10, "Nov" => 11, "Dec" => 12,
                "1" => 1, "2" => 2, "3" => 3, "4" => 4, "5" => 5, "6" => 6,
                "7" => 7, "8" => 8, "9" => 9, "10" => 10, "11" => 11, "12" => 12
            ];
            $current_month_num = date('m');
            $current_year = date('Y');
            $def_start_month = ($current_month_num -6 <1? 1: $current_month_num -6 ).' '.$current_year;

            $sts = explode(' to ',$input);
            $start_point = $sts[0];
            $end_point = isset($sts[1])?$sts[1]: $def_start_month;
            $start_point  =  $start_point ?? $start_point;

            $ps = explode(' ',$start_point);
            if($ps[0] =='all'){
                return (object)[
                    'sql'=>'5=5',
                    'years'=>[],
                    'months'=>[],
                    'last_month_info'=>(object)['month'=>0,'year'=>0],
                    'error'=>''
                ];
            }
            $start_month = isset($months[$ps[0]])?$months[$ps[0]]:date('m');
            $start_year = isset($ps[1])? $ps[1] : date('Y');

            $start_months= [];
            $start_months[$start_year] = $start_month;

            $ps = explode(' ',$end_point);
            if($ps[0] =='all'){
                return (object)[
                    'sql'=>'5=5',
                    'years'=>[],
                    'months'=>[],
                    'last_month_info'=>(object)['month'=>0,'year'=>0],
                    'error'=>''
                ];
            }

            $end_month = isset($months[$ps[0]])?$months[$ps[0]]:date('m');
            $end_year = isset($ps[1])?$ps[1] : date('Y');

            if (!$end_month || !$end_year){
                return (object)[
                    'sql'=>'2=3',
                    'years'=>[],
                    'months'=>[],
                    'last_month_info'=>(object)['month'=>0,'year'=>0],
                    'error'=>'The ending month and ending year are not correct!'
                ];
            }
            if($end_year < $start_year){
                return (object)[
                    'sql'=>'1=2',
                    'years'=>[],
                    'months'=>[],
                    'last_month_info'=>(object)['month'=>0,'year'=>0],
                    'error'=>'The starting year must be earlier than the ending year'
                ];
            }
            else if($end_month < $start_month && $start_year == $end_year){
                return (object)[
                    'sql'=>'2=3',
                    'years'=>[],
                    'months'=>[],
                    'last_month_info'=>(object)['month'=>0,'year'=>0],
                    'error'=>'The starting month must be earlier than the ending month'
                ];
            }

            $end_months = [];
            $end_months[$end_year] = $end_month;

            $years = [];
            $tmp_year = floatval($start_year);
            do{

                $years[] = $tmp_year;
                    $m = isset($start_months[$tmp_year])? $start_months[$tmp_year]:1;
                    for($i=$m;$i<=12;$i++){
                        if($tmp_year == $end_year){
                             if($i <= $end_month) $q_months[$tmp_year][]= $i;
                        }else $q_months[$tmp_year][]= $i;

                    }

                $tmp_year++;
            } while($tmp_year <= $end_year);

            $str_months = '';
            foreach($years as $year){
              $str_months = $str_months.($str_months? ' OR ': '') . ' (' .$year_col_expression.' = '.$year.' AND '.$month_col_expression.' IN ('.implode(',',$q_months[$year]).'))';
            }
            return (object)[
                'sql'=>'('.$str_months.')',
                'years'=>$years,
                'months'=>$q_months,
                'last_month_info'=>(object)['month'=>$end_month,'year'=>$end_year],
                'error'=>null
            ];
        }

    ?>
