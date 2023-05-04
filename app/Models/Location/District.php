<?php

namespace App\Models\Location;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use DB;
 
class District //extends Model
{
    //use HasFactory;
    protected $id = null;
    protected $userInfo = null;
    function __construct($id=null,$userInfo=null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    function getUserInfo(){
        return $this->userInfo;
    }
    function getId(){
        return $this->id;
    }

    static function deleteByParent($city_id){
        DB::table('loc_districts')->where('city_id',$city_id)->delete();
        return DV::success();
    }
    static function delete($district_id,$ss){
        if(!$district_id) $district_id =-1;
        //Commune::deleteByParent($district_id); 
        $x = DB::table('loc_districts')->where('id',$district_id)->delete();
        return DV::success();
    }

     static function list($city_id=null,$ss){
         $str_where ="1=1";
         if($city_id) $str_where ="z.city_id =$city_id";
         return DB::table('loc_districts AS z')->join('loc_cities AS c','c.id','=','z.city_id')->join('loc_countries AS c1','c1.id','=','c.country_id')->whereRaw($str_where)->selectRaw('z.id,z.name,z.name_kh,c1.id as country_id,c1.name AS country_name,c.id as city_id,c.name AS city_name')->get();
         //return DB::table('loc_districts AS d')->join('loc_cities as ct','ct.id','=','d.city_id')->select('c.id','c.name','c.district_id','ct.name as city')->join('loc_countries as co','co.id','=','ct.country_id')->orderBy('d.name','ASC')->get();  
     }
     static function save($d,$ss){
        $sanitize_rules = [];
        $branch_id = $ss->branch_id;
        $check_unique = ["$branch_id|loc_districts|name|id=id"];
        $res = validateObject($d,['id'=>'0|number|identity=1','name'=>'1|string|0-100','name_kh'=>'0|string|0-100','city_id'=>'1|positive|exists=loc_cities.id'],true,$sanitize_rules,$ss->lang,false,$check_unique);
        if($res->error) return DV::error($res->error);
        $id = $res->id;
        $inputs = $res->values;
        $name_kh = $inputs['name_kh'];
        $name_kh = $name_kh?$name_kh:$inputs['name'];
        $id = saveData($ss,'loc_districts',['id'=>$id],$inputs,[],0);
        if($id >0) return DV::success(["district"=>$inputs]);
        return DV::error("something wrong during saving district");
     }

}
