<?php

namespace App\Models\Dms;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;

class Currency extends Model
{
    use HasFactory;
    use HasFactory;
    protected $table = 'currencies';
    protected $primaryKey = 'id';
    //public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $dateFormat = 'U';

    // //Automatice Current timestamp columns
    // const CREATED_AT = 'create_date';
    // const UPDATED_AT = 'update_date';

    //protected $connection = 'sqlite';

    // //Model's default values for some attributes
    // protected $attributes = [
         
    // ];

    protected $fillable =["id","name","code","symbol","symol_after","decimal_points"];
    
    static function saveRates($date,$buy_rate=1,$sell_rate){
       
    }

    static function saveBuyRate($date,$rate=1){

    }

    static function saveSellRate($date,$rate=1){

    }

    static function list($ss){
        $branch_id = $ss->branch_id;
        return DB::table('currencies')->where('branch_id',$branch_id)->selectRaw("id,code,name,symbol,symbol_after,decimal_points,create_user,update_user,formatDate(created_at) as created_at")->orderByRaw("name ASC")->get();
    }

    static function details($ss,$id){
        $branch_id = $ss->branch_id;
        $rows = DB::table('currencies')->where('id',$id)->where('branch_id',$branch_id)->selectRaw("id,code,name,symbol,symbol_after,decimal_points,create_user,update_user,formatDate(created_at) as created_at")->take(1)->get();
        return isset($rows[0])?$rows[0]:null;
    }

    static function info($ss,$id){
        $branch_id = $ss->branch_id;
        $rows = DB::table('currencies')->where('id',$id)->where('branch_id',$branch_id)->selectRaw("id,code,name,symbol,symbol_after,decimal_points,create_user,update_user,formatDate(created_at) as created_at")->take(1)->get();
        return isset($rows[0])?$rows[0]:null;
    }
 
    static function commitDelete($ss,$id){
      $branch_id = $ss->branch_id;
      DB::table('currencies')->where('id',$id)->where('branch_id',$branch_id)->delete();
      return DV::success();
    }

    static function commitSave($ss,$d){
        $branch_id = $ss->branch_id;
        $validate_rule = [
            "id"=>"0|identity=1",
            "name"=>"1|string|1-50",
            "code"=>"1|string|1-5",
            "symbol"=>"1|string|1-5",
            "symbol_after"=>"0|choice|0,1",
            "decimal_points"=>"0|number|default=2" 
         ];
         $unique = ["$branch_id|currencies|code|id=id|text=Currency code already exists"];
         $res = validateObject($d,$validate_rule,true,['symbol'=>['$','៛']],$ss->lang,false,$unique);
         if($res->error) return DV::error($res->error);
         $inputs = $res->values;
         $id = $res->id;
         $id = saveData($ss,'currencies',['id'=>$id],$inputs,[],1);
         if($id) return DV::success(['id'=>$id]);
         else return DV::error('Something went wrong saving currency data');
    }
}
