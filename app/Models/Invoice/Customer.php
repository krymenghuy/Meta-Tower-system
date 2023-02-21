<?php

namespace App\Models\Invoice;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;

class Customer extends Model
{
    use HasFactory;

    static function info($branch_id,$id=0){
        $cols = ['c.id','c.name','c.phone_number','c.email','c.billing_address','c.currency_code'];
        $rows = DB::table('customers as c')->where('id',$id)->where('branch_id',$branch_id)->select($cols)->take(1)->get();
        return isset($rows[0])?$rows[0]:null;
    }
}
