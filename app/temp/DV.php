<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Localization;

class DV extends Model
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

    static function getErrors($d,$spec,$context=null){
            $arr = (array)$d;
            foreach($arr as $key=>$value){
                 foreach($spec as $f=>$v){
                     if($f === $key){
                          $friendly_col_name = self::getFriendlyName($key,$context); 
                         if(is_array($v)){
                              if(!in_array($arr[$key],$v)) return "$friendly_col_name must be one of these ".implode(',',$v);
                         } 
                         else if(!$v || $v ==='string') {
                               if(empty($arr[$key]) || !isset($arr[$key])) return $friendly_col_name." is required";
                          }else if($v==='date' || $v==='datetime' || $v==='time'){
                               if(!(bool)strtotime($arr[$key])) return $friendly_col_name." is not valid!"; 
                          } else if($v==='positive'){
                             if(!($arr[$key]>0)) return $friendly_col_name." must be a positive number"; 
                         }
                         else if($v==='email'){
                             if(!self::isEmail($arr[$key])) return $friendly_col_name." is not valid"; 
                         }else if($v==='phone'){
                             if(!self::isPhoneNumber($arr[$key])) return $friendly_col_name." is not valid"; 
                         }
                     } 
                 }
            }
            return null;
         
    }

    static function emptyResult($status_code =0,$def_result=null,$lang ='en'){
       if (!$lang) $lang = Session('lang','en');
       switch($status_code){
        case 401:{
            return (object)['status'=>'Error','status_code'=>401,'error_message'=>Localization::translate($lang,'authentication failed'),'data'=>$def_result];
        }
        case 403:{
            return (object)['status'=>'Error','status_code'=>403,'error_message'=>Localization::translate($lang,'permission is required'),'data'=>$def_result];
        } 
        default:
        {
            return (object)['status'=>'OK','status_code'=>200,'data'=>$def_result];
        }

       }  
  
    }

    static function error($err_message=null,$lang ='en',$status_code=405,$err_code=null,$createLogFile=false){
        $lang = Session('lang','en');
        if(!$status_code) $status_code=0;
        if($status_code===200) $status_code =405;// Status_code cannot be 200 for error
        $err_message=$err_message?$err_message:"The data input is not correct!";
        return (object)['error_message'=>Localization::translate($lang,$err_message,'validation'),'status'=>'Error','status_code'=>$status_code,"error_code"=>$err_code]; 
    }


    static function success($arrs =[],$status_code=200){
      $data = (object)['status_code'=>200,'status'=>'OK','error_message'=>null];
      foreach($arrs as $prop=>$val) $data->{$prop} = $val;
      return $data;
    } 
}
