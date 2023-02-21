<?php

namespace App\Models\Invoice;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;

class InvoiceSettings extends Model
{
    use HasFactory;

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
