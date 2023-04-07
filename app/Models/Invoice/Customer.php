<?php

namespace App\Models\Invoice;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\Invoice\InvoiceSettings;
use DB;

class Customer //extends Model
{
    //use HasFactory;
    //protected static $customer_table ="patients";

    static function info($branch_id,$id=0){
        $customer_table = InvoiceSettings::$customer_table;
        $cols = ['c.id','c.name','c.phone_number','c.email','c.billing_address','c.currency_code'];
        $rows = DB::table("$customer_table as c")->where('id',$id)->where('branch_id',$branch_id)->select($cols)->take(1)->get();
        return isset($rows[0])?$rows[0]:null;
    }
    
    static function getProps($id,$cols=null){
      $customer_table = InvoiceSettings::$customer_table;
      if (!$cols) $cols = "c.id, p.id as person_id, CONCAT(p.last_name,' ',p.first_name) AS name, p.address, c.billing_address, p.email, p.phone_number, 'Individual' AS customer_type";  
      $rows = DB::table($customer_table. " AS c")->join('persons as p','p.id','=','c.person_id')->where('c.id',$id)->selectRaw($cols)->take(1)->get();
      return isset($rows[0])?$rows[0]:null;  
    }
}
