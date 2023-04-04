<?php

namespace App\Models\Location;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;

class Commune //extends Model
{
    //use HasFactory;
    protected $id = null;
    protected $userInfo = null;
    function __construct($id=null,$ss=null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    function getUserInfo(){
        return $this->userInfo;
    }
    function getId(){
        return $this->id;
    }

      static function deleteByParent($district_id){
        DB::table('loc_communes')->where('district_id',$district_id)->delete();
        return DV::success();
    }
    static function delete($commune_id,$ss){
        if(!$commune_id) $commune_id =-1;
        //Commune::deleteByParent($district_id); 
        $x = DB::table('loc_communes')->where('id',$commune_id)->delete();
        return DV::success();
    }
     
     static function list($district_id=null,$ss){
         $str_where ="1=1";
         if($district_id) $str_where ="c.district_id =$district_id";
         return DB::table('loc_communes AS c')->whereRaw($str_where)->join('loc_districts as d','d.id','=','c.district_id')->join('loc_cities as ct','ct.id','=','d.city_id')->join('loc_countries as co','co.id','=','ct.country_id')->select('c.id','c.name','c.name_kh','c.district_id','d.name as district','ct.name as city','co.name as country')->orderBy('c.name','ASC')->get();  
     }

     static function save($d,$ss){
        $sanitize_rules = [];
        $branch_id = $ss->branch_id;
        $check_unique = ["$branch_id|loc_communes|name|id=id"];
        $res = validateObject($d,['id'=>'0|number|identity=1','name'=>'1|string|0-100','name_kh'=>'0|string|0-100','district_id'=>'1|positive|exists=loc_districts.id'],true,$sanitize_rules,$ss->lang,false,$check_unique);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $id = $res->id;
        $name_kh = $inputs['name_kh'];
        $name_kh = $name_kh?$name_kh:$inputs['name'];
        $id = saveData($ss,'loc_communes',['id'=>$id],$inputs,[],0);
        if($id >0) return DV::success(["commune"=>$inputs]);
        return DV::error("something wrong during saving commune");
     }
}
