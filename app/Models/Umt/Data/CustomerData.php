<?php

namespace App\Models\Umt\Data;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\Umt\Data\DataConvertor;

class CustomerData //extends Model
{
    //use HasFactory;
    public static $customers = [];

    static function createData()
    {
         self::$customers = [
           [
             'id'=>createUUID(true),
             'name'=>'HOU EXPRESS',
             'phone_number'=>'0000000',
             'email'=>'owner@houxpress.com',
             'billing_address'=>'NA',
             'address'=>'',
             'address_kh'=>'',
             'first_cp_name'=>'',
             'second_cp_name'=>'',
             'first_cp_email'=>'',
             'second_cp_email'=>'',
             'logo_file_name'=>''
           ]
         ];
    }
   
   static function first($binary_cols = []){
    if (!isset(self::$customers[0])) self::createData();
    return DataConvertor::prepare($binary_cols, self::$customers[0]);
 
   }
   static function list($binary_cols = []){
     if (!isset(self::$customers[0])) self::createData();
      return DataConvertor::prepare($binary_cols, self::$customers);
   }
}
