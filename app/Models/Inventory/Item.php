<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use DB;
 
class Item extends Model
{
    use HasFactory;
    protected $table = 'inv_items';
    protected $guarded = ['id'];
    protected $fillable =[]; // ['id','name','first_name','last_name','sex','date_of_birth','nationality_id','cp_name','cp_phone_number'];
      
    protected $primaryKey = 'id';
    public $incrementing = true;
    //protected $keyType = 'string';
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d';
     
    static function info($id){
       $cols = "i.id,i.name,i.description,i.sku,i.unit_id,i.group_id,g.name AS group_name,g.category_id,i.cost,i.ws_selling_price,i.selling_price"; 
       $rows = DB::table("inv_items as i")->join('inv_item_groups AS g','g.id','=','i.group_id')->where("i.id",$id)->selectRaw($cols)->take(1)->get();
       return isset($rows[0])?$rows[0]:null;    
    }

    //similar to ::info() but it gives more detailed info about an item
    static function details($id){
        $cols = "i.id,i.name,i.description,i.sku,i.unit_id,g.unit_id as group_uint_id,g.sku as group_ask, g.name as group_name,g.category_id,i.selling_price,i.ws_selling_price,i.cost"; 
        $rows = DB::table("inv_items as i")->join('inv_groups as g','g.id','=','i.group_id')->join()->where("i.id",$id)->selectRaw($cols)->take(1)->get();
        return isset($rows[0])?$rows[0]:null;    
     }
}
