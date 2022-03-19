<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

//DV is the Data Valiator class
class DV extends Model
{
    use HasFactory;

    //return error object
    static function error($err_message,$log = false){
        $result = (object)['error_message'=>$err_message,'status'=>'error'];
        return $result;
    }

    //$return_type = {'text','object','boolean','bool'}
    static function valiate($data_type,$data,$return_type='object'){
       if ($data_type==='phone' || $data_type==='phone_number') {
            if (str_len($data) > 20) return self::error('Phone number is too long');
       }else if ($data_type ==='email'){
            if (str_len($data) > 100) return self::error('email is too long');
       }
        return (object)['status'=>'OK','error_message'=>null];
    }
    static function success($arrs =[]){
      $data = (object)['status'=>'OK','error_message'=>null];
      foreach($arrs as $prop=>$val) $data->{$prop} = $val;
      return $data;
    } 
}
