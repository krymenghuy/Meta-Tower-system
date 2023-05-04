<?php

namespace App\Models\Location;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\Location\City;
use DB;
use Illuminate\Support\Facades\Cache;

class Country //extends Model
{
    //use HasFactory;
    protected $id = null;
    protected $userInfo = null;
    protected static $table ="loc_countries";

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
    static function delete($country_id,$ss){
        if(!$country_id) $country_id =-1;
        City::deleteByParent($country_id); 
        $x = DB::table('loc_countries')->where('id',$country_id)->delete();
        return DV::success();
    }
    
    static function cache($minutes=30){
        $countries = DB::table('loc_countries AS c')->select('c.id','c.name','c.name_kh','c.nationality','c.nationality_kh')->orderBy('c.name','ASC')->get();
        Cache::put('countries',$countries,$minutes);
    }

    static function getById($id){
        $countries = Cache::get('countries');
        if(!$countries){
             self::cache(30);
             $countries = Cache::get('countries');
        } 
       $i=0;
       $c=null;
       do{
        if (!isset($countries[$i])) break;
        $c = $countries[$i];
         if($c->id == $id) return $c; 
        $i++;
       }while($c); 
       return (object)['id'=>null,'name'=>''];
    }

    static function list($ss){
         //$str_where ="1=1";
         return Cache::remember('countries',60,function(){
            return DB::table('loc_countries AS c')->select('c.id','c.name','c.name_kh','c.nationality','c.nationality_kh')->orderBy('c.name','ASC')->get();
         });
        
         //Cache::put('countries',$countries,15);
         //return $countries;
     }

     static function save($d,$ss){
        $sanitize_rules = [];
        $branch_id = $ss->branch_id;
        $check_unique = ["$branch_id|loc_countries|name|id=id"];
        $res = validateObject($d,['id'=>'0|number|identity=1','name'=>'1|string|0-100','name_kh'=>'0|string|0-100','nationality'=>'0|string|0-100'],true,$sanitize_rules,$ss->lang,false,$check_unique);
        if($res->error) return DV::error($res->error);
        $id = $res->id;
        $inputs = $res->values;
        $name_kh = $inputs['name_kh'];
        $name_kh = $name_kh?$name_kh:$inputs['name'];
        $inputs['name_kh'] = $name_kh;
        $inputs['nationality'] = isset($inputs['nationality'])?$inputs['nationality']: $inputs['name'];
        $id = saveData($ss,'loc_countries',['id'=>$id],$inputs,[],1);
        if($id >0) return DV::success(["id"=>$id]);
        return DV::error("something wrong during saving country");
     }

}
