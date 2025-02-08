<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;

use App\Locales\LocaleManager;
use App\Services\Umt\AuthService;
use Illuminate\Support\Facades\Log;
//DV is the Data Valiator class
class DV
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
   
   static function getFriendlyName($col, $context){
       if($context=='academic_program'){
                if($col=='name')
                return "Program name";
                else if($col =='major_name')
                return 'Major';
                else if($col =='degree_name')
                return 'Degree name';
                else return $col;
       } else if($context =='person'){
                if($col=='name')
                    return "Name";
                else if($col =='first_name' || $col =='first_name_kh')
                    return 'First name';
                else if($col =='last_name' || $col =='last_name_kh')
                   return 'Last name';
                else if($col =='phone_number')
                   return 'Phone number';
                else if($col =='email')
                   return 'Email';
                else if($col =='adr_commune_id')
                   return 'Address';
                else if($col =='adr_city_id')
                   return 'Address';
                else if($col =='adr_district_id')
                   return 'Address';
                else return $col;
       }
       else{
          return $col;
       }

   }

    //return error_message if any, otherwise returns NULL
    //$spec = ['level_id'=>'positive','name'=>'string']
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

    //Check $id. If it is positive then return success([id=>$id]), otherwise return DV::error($error_message)
    static function depends($id,$obj=null,$error_message="Something went wrong...!"){
       if(!$id) return self::error($error_message);
       else return self::result($obj);
    }

    static function emptyResult($status_code =0,$def_result=null,$lang =null,$error_message = null){
           
       switch($status_code){
        case 401:{
            $error_message = $error_message ?? 'Authentication failed';
            return (object)['status'=>'Error','status_code'=>401,'error_message'=>LocaleManager::trans($error_message,null,null,$lang),'data'=>$def_result];
        }
        //error:402 => Expired token
        case 402:{
            $error_message = $error_message ?? 'Token Expired';
            return (object)['status'=>'Error','status_code'=>402,'error_message'=>LocaleManager::trans($error_message,null,null,$lang),'data'=>$def_result];
        }
        case 403:{
            $err_message = $error_message ?? 'Permission required';
            return (object)['status'=>'Error','status_code'=>403,'error_message'=>LocaleManager::trans($error_message,null,null,$lang),'data'=>$def_result];
        }
        default:
        {
            return (object)['status'=>'OK','status_code'=>200,'data'=>$def_result];
        }

       }
    }

    //return error object. default status code is 405 for Data Validation error;
    static function error($err_message=null,$lang=null,$status_code=405,$err_code=null,$log=false){
        $c_user = AuthService::user();
        $lang = $lang ?? ($c_user? $c_user->lang:'en');
        $def_langSection = 'validation';
        $err_message = $err_message? LocaleManager::trans($err_message,$def_langSection,null,$lang):'There was an error but no error message provided by developer';
        $response = (object)['status'=>'Error','status_code'=>$status_code,'error_code'=>$err_code,'error_message'=>$err_message];
        if(!$status_code) $status_code = 405;
        else if($status_code == 200) $status_code =405;// Status_code cannot be 200 for error
        $err_message = $err_message ?? '';
        if($log) Log::info('Caught Error: '.$err_message);
        return $response;
    }

    static function authFailed($lang ='en'){
       return self::error('User authentication Failed',$lang,401);
    }

    static function needPermission($prn_number, $lang = null){
        $c_user = AuthService::user();
        $lang = $lang ?? ($c_user? $c_user->lang:'en');
        return self::error('Permission ?? is required::'.$prn_number,$lang,405);
    }

    static function permissionRequired($prn_number, $lang = null){
        $c_user = AuthService::user();
        $lang = $lang ?? ($c_user? $c_user->lang:'en');
        return self::error('Permission ?? is required::'.$prn_number,$lang,405);
    }
    // //$return_type = {'text','object','boolean','bool'}
    // static function valiate($data_type,$data,$return_type='object'){
    //     $lang = Session('lang','en');
    //    if ($data_type ==='phone' || $data_type ==='phone_number') {
    //         if (str_len($data) > 20) return self::error(Localization::translate($lang,'phone number is too long'));
    //    }else if ($data_type ==='email'){
    //         if (str_len($data) > 100) return self::error(Localization::translate($lang,'email is too long'));
    //    }
    //     return (object)['status'=>'OK','error_message'=>null];
    // }

    //DV::result($rows) returns SELECT or query result ready to be encoded as JSON straight to be sent to Browser
    //JDV::result() and DV::result() return query results inhabited under "data" property. Example $res->data = [... query result ...]
    static function result($rows=[]){
        //default status_code for create, update, delete is "200"
      $data = (object)['status_code'=>200,'status'=>'OK','data'=>$rows];
      return $data;
    }

    //NOTE that JDV::success() and DV::success(['a'=>v]) returns result as object $res without "data" property that extends the additional properties. The reason is that DV::success() is used internally
    static function success($arrs =[],$status_code=null){
        //default status_code for create, update, delete is "200"
        $status_code = $status_code?$status_code:200;
        $data = (object)['status_code'=>$status_code,'status'=>'OK','error_message'=>null];
        foreach($arrs as $prop=>$val) $data->{$prop} = $val;
        return $data;
    }
}
