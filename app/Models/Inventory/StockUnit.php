<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;

class StockUnit extends Model
{
    use HasFactory;

    static function info($id){
        $rows = DB::table("inv_units as u")->where('u.id',$id)->selectRaw("u.id,u.name,u.description")->take(1)->get();
        return (isset($rows[0])?$rows[0]:null);
    }

    // @param $sku can be unit_id or sku (unit name)
    //returns qty in the given unit, regardless the item's unit being saved in the database table. 
    static function countUnit($sku){
         
    }
}
