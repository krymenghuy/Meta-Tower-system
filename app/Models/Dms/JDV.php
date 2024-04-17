<?php

namespace App\Models\Dms;
use Localization;
use Session;

//JDV is the Data Valiator class
class JDV //extends Model
{
    //use HasFactory;
   static function isEmail($e){
     return filter_var($e, FILTER_VALIDATE_EMAIL);
   }
   static function isPhoneNumber($phone){
      $len = strlen($phone?$phone:'');
      if($len >25) return false;
      else if($len<=0) return false;
      else return true;
   }
 
   static function getFriendlyName($field=''){
     return str_replace("_"," ",$field);
   }

    //return error_message if any, otherwise returns NULL
    //$spec = ['level_id'=>validation_spec,'name'=>'string']
    //example of 'validation_spec' is "1|string|5-50|text=description is required" or "1|date|format=d-M-Y|text=date of birth is not correct"
    static function validateProps($arr,$fields,$lang=null){
            if(!$lang) $lang = Session('lang','en');
            $inputs = [];

            foreach($fields as $field=>$spec){
                //processInput() is defined
                $val = isset($arr[$field])?$arr[$field]:null;
                $res = processInput($field,$val, $spec,$lang);
                if($res->error) return (object)['inputs'=>[],'error'=>$res->error];
                $inputs[$field] = $val;
            }
            return (object)['inputs'=>$inputs,'error'=>null];
    }

    static function emptyResult($status_code =0,$def_result=null,$lang='en',$error_message=null){
       if (!$lang) $lang = Session('lang','en');
       if (is_object($status_code)) $status_code = $status_code->status_code;
       $error_message = match($status_code){
          401 => $error_message ?? 'Authentication failed',
          402 => $error_message ?? 'Token Expired',
          403 => $error_message ?? 'Permission required',
          default => function(){
            $status_code =200;
            $error_message="";
          }
       };
       return makeJsonResponse ((object)['status'=>'Error','status_code'=>$status_code,'error_message'=>Localization::translate($lang,$error_message),'data'=>$def_result]);
    }
 
    //return Authentication error, with status_code =401
    static function authError($status_code=401){
         $langSection ='validation';
         if (!$lang) $lang = Session::get('lang','en');
         if($status_code===401) $err_message ="Authentication failed";
        return makeJsonResponse ((object)['error_message'=>Localization::translate($lang,$err_message,$langSection),'status'=>'Error','status_code'=>$status_code]);
    }

    //return error object. default status code is 405 for Data Validation error;
    static function error($err_message=null,$lang=null,$status_code=405,$err_code=null,$log=false){
      $def_langSection = 'validation';
      $lang = $lang ?? Session::get('lang','en');
      $err_message = $err_message? Localization::translate($lang,$err_message,$def_langSection) : 'There was an error but no error message provided by developer';
      $response = (object)['status'=>'Error','status_code'=>$status_code,'error_code'=>$err_code,'error_message'=>$err_message];
      if(!$status_code) $status_code = 405;
      else if($status_code == 200) $status_code =405;// Status_code cannot be 200 for error
      if($log) Log::info('JDV => Caught Error: '.$err_message);
      return makeJsonResponse($response);     
    }
  
    static function success($arrs =[],$status_code=200){
      //default status_code for create, update, delete is "200"
      if(!$arrs) $arrs = [];
      $d =[];
      $has_extra_props = false;
      foreach($arrs as $prop=>$val) $d[$prop] = $val; 
      return makeJsonResponse((object)$d,200);
    } 

    //returns SELECT QUERY result as JSON array.
    //This method should be predicated soon!
    static function json($rows){
        return response()->json((object)['status'=>'OK','status_code'=>200,'data'=>$rows]);
    }

    //DV::result($rows) returns SELECT or query result ready to be encoded as JSON straight to be sent to Browser
    //JDV::result() and DV::result() return query results inhabited under "data" property. Example $res->data = [... query result ...]
    static function result($rows=[]){
      //default status_code for create, update, delete is "200"
       return response()->json((object)['status'=>'OK','status_code'=>200,'data'=>$rows]);
   }

   static function raw($data){
    return response()->json($data);
   }

}
