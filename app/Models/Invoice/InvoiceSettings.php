<?php

namespace App\Models\Invoice;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use DB;

class InvoiceSettings //extends Model
{
    //For customers list, point to table "patients", not customers. Because "customers" table is used for normal business context, Not for Hospital or Medical Clinic
    public static $customer_table ="patients";
    
    //use HasFactory;
    static function signer_name($branch_id){
      $row = getDataRow('settings_string',['branch_id'=>$branch_id,'op_key'=>'invoice_signer_name'],"op_value");
      return isset($row)?$row->op_value:null;  
    }

    //return Invoice's base currency code, and current exchange rate
    static function currency($branch_id){
      $rows = DB::table('settings_invoice_currency')->where('branch_id',$branch_id)->select('currency_code','exchange_rate')->take(1)->get();
      foreach($rows as $row) return $row;
      return (object)['currency_code'=>'USD','exchange_rate'=>1];
    }

    static function invoice_form_options($ss){
      return (object)[
        "customers"=>self::options_customer($ss),
        "pmt_terms"=>self::options_pmt_terms($ss),
        "items"=>self::options_item($ss),
        "services"=>self::options_service($ss)
        //,"labo"=>self::options_service($ss)
      ];
   }

   static function options_item($ss){
    $branch_id = $ss->branch_id;
    return DB::table('inv_items AS i')->where('i.branch_id',$branch_id)->selectRaw("i.id as `value`,i.name as text")->orderByRaw('i.name ASC')->get();
   }
   static function options_customer($ss){
    $branch_id = $ss->branch_id;
    return DB::table(self::$customer_table.' as c')->where('c.branch_id',$branch_id)->join('persons as p','p.id','=','c.person_id')->select("c.id",DB::raw("CONCAT(p.last_name,' ',p.first_name) AS customer_name"))->orderBy('customer_name','ASC')->get();
   }

   static function options_service($ss){
     $branch_id = $ss->branch_id;
     return DB::table('medical_services as s')->where('branch_id',$branch_id)->selectRaw("s.id as value,s.name as text")->get();
   }

    static function options_pmt_terms($ss){
        //$branch_id = $ss->branch_id;
        return [
            (object)['code'=>' net 30','description'=>'Immediate'],
            (object)['code'=>' net 30','description'=>'net 30'],
            (object)['code'=>' net 60','description'=>'net 60']
        ];
    }

    static function payment_bank($branch_id){
       $rows = DB::table('settings_string')->where('branch_id',$branch_id)->whereIn('op_key',['pmt_bank_name','pmt_account_number','pmt_account_name'])->select('id','op_key','op_value')->get();
       $account = (object)['account_number'=>null,'account_name'=>'','bank_name'=>''];
       foreach($rows as $row) $account->{$row->op_key} = $row->op_value;
       return $account;
    }

    static function entry_accounts($branch_id){
     return (object)[
        'receivable_account'=>(object)['id'=>"","name"=>""],
        'inventory_account'=>(object)['id'=>"","name"=>""]
     ];
    }
}
