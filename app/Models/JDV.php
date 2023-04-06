<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use Localization;

//JDV is the Data Valiator class
class JDV
{
    use HasFactory;

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
       $error_message = match($status_code){
          401 => $error_message? $error_message:"Authentication failed",
          402 => $error_message?$error_message:"Token Expired",
          403 => $error_message?$err_message:"Permission required",
          default => function(){
            $status_code =200;
            $error_message="";
          }
       };
       return makeJsonResponse ((object)['status'=>'Error','status_code'=>$status_code,'error_message'=>Localization::translate($lang,$error_message),'data'=>$def_result]);
       
      //  switch($status_code){
      //           case 401:{
      //               $error_message = $error_message?$error_message:"Authentication failed";
      //               return makeJsonResponse((object)['status'=>'Error','status_code'=>401,'error_message'=>Localization::translate($lang,$error_message),'data'=>$def_result]);
      //           }
      //           case 402:{
      //               $error_message = $error_message?$error_message:"Token Expired";
      //               return makeJsonResponse((object)['status'=>'Error','status_code'=>402,'error_message'=>Localization::translate($lang,$error_message),'data'=>$def_result]);
      //           }
      //           case 403:{
      //               $err_message = $error_message?$err_message:"Permission required";
      //               return makeJsonResponse ((object)['status'=>'Error','status_code'=>403,'error_message'=>Localization::translate($lang,$error_message),'data'=>$def_result]);
      //           } 
      //           default:
      //           {
      //               return makeJsonResponse ((object)['status'=>'OK','status_code'=>200,'data'=>$def_result]);
      //           }

      //  }

    }
 
    //return error object. default status code is 405 for Data Validation error;
    static function error($err_message=null,$lang=null,$status_code=405,$err_code=null,$createLogFile=false){
        if (!$lang) $lang = Session('lang','en');
        
        if(!$status_code) $status_code=0;
        if($status_code === 200) $status_code =405;// Status_code cannot be 200 for error
        $err_message=$err_message?$err_message:"There was an error but error message was not supplied by the developer";
        $langSection ='validation';
        return makeJsonResponse ((object)['error_message'=>Localization::translate($lang,$err_message,$langSection),'status'=>'Error','status_code'=>$status_code,"error_code"=>$err_code]); 
        //if $createLogFile ==true then todo: create log file to store error message
    }

    // //$return_type = {'text','object','boolean','bool'}
    // static function validate($lang='en',$data_type,$data,$return_type='object'){
    //    if ($data_type ==='phone' || $data_type ==='phone_number') {
    //         if (str_len($data) > 20) return self::error($lang,'Phone number is too long');
    //    }else if ($data_type ==='email'){
    //         if (str_len($data) > 100) return self::error($lang,'email is too long');
    //    }
    //     return (object)['status'=>'OK','error_message'=>null];
    // }

    static function success($arrs =[],$status_code=200){
      //default status_code for create, update, delete is "200"
      if(!$arrs) $arrs = [];
      $res = (object)['status_code'=>200,'status'=>'OK','error_message'=>null];
      $d = (object)[];
      foreach($arrs as $prop=>$val) $d->{$prop} = $val;
      $res->data = $d;
      return makeJsonResponse($res);
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
      if(is_object($rows)){
         if(isset($rows->status)) if($rows->status ==='Error') return self::error($rows->error_message);
         else{
            $outputs = [];
            $remove_props = ['status','status_code','error_message'];
            foreach($rows as $prop=>$val) if(!in_array($prop,$remove_props)) $outputs[$prop] = $val;
            return self::success($outputs);
         }
      }
      return response()->json((object)['status'=>'OK','status_code'=>200,'data'=>$rows]);
   }

   static function raw($data){
    return response()->json($data);
   }

}
