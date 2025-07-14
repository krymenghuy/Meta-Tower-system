<?php

namespace App\Models\Location;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use DV;
use DBX;
class Commune //extends Model
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

      static function deleteByParent($district_id){
        DB::table('loc_communes')->where('district_id',$district_id)->delete();
        return DV::success();
    }
    static function delete($commune_id,$ss){
        if(!$commune_id) $commune_id =-1;
        //Commune::deleteByParent($district_id);
        $x = DB::table('loc_communes')->where('id',$commune_id)->delete();
        return DV::depends(['action'=>'deleted']);
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
        $res = DBX::validateObject($d,['id'=>'0|number|identity=1','name'=>'1|string|0-100','name_kh'=>'0|string|0-100','district_id'=>'1|number|exists=loc_districts.id'],true,$sanitize_rules,$ss->lang,false,$check_unique);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $id = $res->id;
        $name_kh = $inputs['name_kh'];
        $name_kh = $name_kh?$name_kh:$inputs['name'];
        $id = DBX::saveData($ss,'loc_communes',['id'=>$id],$inputs,[],0);
        if($id >0) return DV::success(["commune"=>$inputs]);
        return DV::error("something wrong during saving commune");
     }
     static function options_commune($district_id = null,$ss = null){
        $str_district = $district_id > 0 ? 'd.id ='.$district_id: '1=1';
        return DB::table('loc_countries as c')->join('loc_cities as city','city.country_id', '=','c.id')->join('loc_districts as d','d.city_id','=','city.id')->join('loc_communes as cn','cn.district_id','=','d.id')->whereRaw($str_district)->selectRaw('cn.id, cn.name, cn.name_kh, d.name As district_name, d.id AS district_id, city.name AS city_name,  city.id AS city_id, c.id AS country_id,c.name as country_name')->orderByRaw('cn.name ASC')->get();
     }

    function getCommuneFromOption($id = null, $ss = null)
    {
        $id = $id?$id:$this->id;
        $commune_detail = DB::table('loc_communes')->where('id',$id)->selectRaw('id,name,name_kh')->first();
        return (object)[
            'zone'=>$commune_detail ?? null
        ];
    }
}
