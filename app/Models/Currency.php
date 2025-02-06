<?php

namespace App\Models;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use DB;

class Currency //extends Model
{
    //use HasFactory;
    protected $id = null, $userInfo = null;
    function __construct($id=null, $userInfo = null)
    {
         $id = $id;
         $userInfo = $userInfo;
    }

    function save($arr,$id =null, $ss= null){
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
          $v_rule = [
             'name'=>'1|string|1-10',
             'code'=>'1|string|1-10',
             'symbol'=>'1|string|1-5',
             'decmial_points'=>'0|number|default=2',
             'thousand_separator'=>'0|string|0-2'
          ];
          $res = validateObject($arr,$v_rule,true,['thousand_separator'=>['.',',','symbol'=>['$','៛']]], $ss->lang,false);
          if($res->error) return DV::error($res->error);
          $inputs = $res->values;
          $id = saveData($ss,'currencies',['id'=>$id],$inputs,[],1,false);
          return DV::depends($id);
    }

    static function options_currency($ss){
        $subs_id = $ss->subs_id;
        $bin_subs_id = hex2bin($subs_id);
        return DB::table('currencies as c')->where('c.subs_id',$bin_subs_id)->selectRaw('c.id,c.code,c.name')->get();
    }

    function getList($ss){
        $ss = $ss ?? $this->userInfo;
        $subs_id = $ss->subs_id;
        $bin_subs_id = hex2bin($subs_id);
        return DB::table('currencies as c')->where('subs_id',$bin_subs_id)->selectRaw('c.id,c.code,c.name,c.symbol,c.decimal_points,c.thousand_separator')->get();
    }
    function getDetails($id){
        return DB::table('currencies as c')->where('id',$id)->selectRaw('c.id,c.code,c.name,c.symbol,c.decimal_points,c.thousand_separator')->first();
    }

    function delete($id){
        DB::table('currencies')->where('id',$id)->delete();
        return DV::depends(1);
    }

    function getFormOptions($id,$ss){
        $currency = $id? $this->getDetails($id): null;
        return (object)[
             'currency'=>$currency,
             'countries'=>DB::table('loc_countries asc')->selectRaw('id,name,name_kh')->get()
        ];

    }


}
