<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Localization;

class JDV extends Model
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

    static function getErrors($arr,$fields,$lang=null){
            if(!$lang) $lang = Session('lang','en');
            $res = (object)['inputs'=>[],'error_message'=>null];
            $inputs = [];

            foreach($fields as $field=>$spec){
                $val = isset($arr[$field])?$arr[$field]:null;
                $res = processInput($field,$val, $spec,$lang);
                $inputs[$field] = $val;
                if($res->error) return (object)['inputs'=>[],'error'=>$res->error];
            }
            return (object)['inputs'=>$inputs,'error'=>null];
    }

    static function emptyResult($status_code =0,$def_result=null,$lang='en'){
       if (!$lang) $lang = Session('lang','en');
        
       switch($status_code){
        case 401:{
            return makeJsonResponse((object)['status'=>'Error','status_code'=>401,'error_message'=>Localization::translate($lang,'authentication failed'),'data'=>$def_result]);
        }
        case 403:{
            return makeJsonResponse ((object)['status'=>'Error','status_code'=>403,'error_message'=>Localization::translate($lang,'permission is required'),'data'=>$def_result]);
        } 
        default:
        {
            return makeJsonResponse ((object)['status'=>'OK','status_code'=>200,'data'=>$def_result]);
        }

       }
    }
 
    static function error($err_message=null,$lang=null,$status_code=405,$err_code=null,$createLogFile=false){
        if (!$lang) $lang = Session('lang','en');
        
        if(!$status_code) $status_code=0;
        if($status_code === 200) $status_code =405;// Status_code cannot be 200 for error
        $err_message=$err_message?$err_message:"The data input is not correct!";
        $langSection ='validation';
        return makeJsonResponse ((object)['error_message'=>Localization::translate($lang,$err_message,$langSection),'status'=>'Error','status_code'=>$status_code,"error_code"=>$err_code]); 
    }


    static function success($arrs =[],$status_code=200){
      if(!$arrs) $arrs = [];
      $res = (object)['status_code'=>200,'status'=>'OK','error_message'=>null];
      $d = (object)[];
      foreach($arrs as $prop=>$val) $d->{$prop} = $val;
      $res->data = $d;
      return makeJsonResponse($res);
    } 

    static function json($rows){
        return response()->json((object)['status'=>'OK','status_code'=>200,'data'=>$rows]);
    }
}
