<?php

namespace App\Models\Location;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;
use App\Models\Location\District;
use Illuminate\Support\Facades\Cache;
class City //extends Model
{
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

    static function cache($minutes=3){
        $countries = DB::table('loc_cities AS c')->select('c.id','c.name')->orderBy('c.name','ASC')->get();
        Cache::put('cities',$countries,$minutes);
    }

    static function getById($id){
        $cities = Cache::get('cities');
        if(!$cities){
             self::cache(3);
             $cities = Cache::get('cities');
        }
       $i=0;
       $c=null;
       do{
        if (!isset($cities[$i])) break;
        $c = $cities[$i];
         if($c->id == $id) return $c;
        $i++;
       }while($c);
       return (object)['id'=>null,'name'=>''];
    }

    static function delete($city_id,$ss){
        if(!$city_id) $city_id =-1;
        District::deleteByParent($city_id);
        $x = DB::table('loc_cities')->where('id',$city_id)->delete();
        return DV::success();
    }
    static function deleteByParent($country_id){
        DB::table('loc_cities')->where('country_id',$country_id)->delete();
        return DV::success();
    }
    static function list($country_id=null,$ss){
        $str_country="1=1";
        if($country_id) $str_country ="country_id =$country_id";
        return DB::table('loc_cities AS c')->whereRaw($str_country)->join('loc_countries as p','p.id','=','c.country_id')->select('c.id','c.name','c.country_id','p.name as country')->orderBy('c.name','ASC')->get();
    }
    static function save($d,$ss){
        $sanitize_rules = [];
        $branch_id = $ss->branch_id;
        $check_unique = ["$branch_id|loc_cities|name|id=id"];
        $res = validateObject($d,['id'=>'0|number|identity=1','name'=>'1|string|1-100','name_kh'=>'0|string|0-100','country_id'=>'1|positive|exists=loc_countries.id'],true,$sanitize_rules,$ss->lang,false,$check_unique);
        if($res->error) return DV::error($res->error);
        $id = $res->id;
        $inputs = $res->values;
        $name_kh = $inputs['name_kh'];
        $name_kh = $name_kh?$name_kh:$inputs['name'];
        $id = saveData($ss,'loc_cities',['id'=>$id],$inputs,[],1,0);
        if($id >0) return DV::success(["city"=>$inputs]);
        return DV::error("something wrong during saving city name");
     }

     static function options_city($country_id = null,$ss = null){
        $str_country = $country_id > 0 ? 'c.id ='.$country_id: '1=1';
        return DB::table('loc_countries as c')->join('loc_cities as city','city.country_id', '=','c.id')->whereRaw($str_country)->selectRaw('city.id, city.name, city.name_kh')->orderByRaw('city.name ASC')->get();
     }

}
