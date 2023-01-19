<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UM;
use DB;
use Session;

class Item extends Model
{
    use HasFactory;
    protected $table = 'items';
    protected $primaryKey = 'id';
    //public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $dateFormat = 'U';

    // //Automatice Current timestamp columns
    // const CREATED_AT = 'create_date';
    // const UPDATED_AT = 'update_date';

    //protected $connection = 'sqlite';

    //Model's default values for some attributes
    protected $attributes = [
        'item_type'=>'good',
        'group_id'=>1,
        'selling_price' => 0,
        'cost'=>0,
        'inactive'=>0,
        //'name'=>'some name',
        //'create_date'=>getNowTime(),
        'status'=>'normal' /** status ={normal, obsolete}**/
    ];

    protected $fillable =["*"];
    
    static function info($ss=null,$item=0){
        $branch_id = isset($ss)? $ss->branch_id:null;
        $str_branch = "1=1";
        if($branch_id>0) $str_branch ="branch_id =$branch_id";
        $rows = DB::table("inv_item_groups as g")->join('inv_items as i','i.group_id','=','g.id')->where('i.id',$item_id)->whereRaw($str_branch)->select("unit_id,sku,cost,selling_price,ws_selling_price")->take(1)->get();
    
    }
 
}