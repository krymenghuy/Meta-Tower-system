<?php

namespace App\Models\Location;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\Location\City;
use DB;
use Illuminate\Support\Facades\Cache;

use function PHPUnit\Framework\isEmpty;

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
    
    // static function cache($minutes=30){
    //     $countries = DB::table('loc_countries AS c')->select('c.id','c.name','c.name_kh','c.nationality','c.nationality_kh')->orderBy('c.name','ASC')->get();
    //     Cache::put('countries',$countries,$minutes);
    // }
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

    static function listAll($ss){
       return DB::table('loc_countries as c')->selectRaw('c.id,c.name,c.name_kh,c.nationality,c.region')->get();
    }
    static function nationality($id, $countries = null) {
        static $cache = [
            'countries' => null,
            'timestamp' => null
        ];
    
        // Check if cache exists and is within the 30-second freshness window
        if (!$countries) {
            $currentTime = time();
            if ($cache['countries'] && ($currentTime - $cache['timestamp'] <= 30)) {
                $countries = $cache['countries'];
            } else {
                // Fetch fresh data and update the cache
                $countries = DB::table('loc_countries as c')
                    ->selectRaw('id, name, nationality')
                    ->get();
                $cache['countries'] = $countries;
                $cache['timestamp'] = $currentTime;
            }
        }
    
        // Find the matching country
        $founds = $countries->filter(function($c) use ($id) {
            return $c->id === $id;
        });
    
        return $founds->isEmpty() ? null : $founds->first()->nationality;
    }
 
    static function list($arr,$ss){
         $branch_id = $ss->branch_id;
         $d = (object)$arr;
         $search_value = $d->search_value ?? null;
     
         $str_search = '2=2';
         if($search_value){
             $search_value = escape_like_str($search_value);
             $str_search = '(c.name LIKE \'%'.$search_value.'%\')';
         }
         //return Cache::remember('countries',60,function(){
            return DB::table('loc_countries AS c')
            ->where('c.branch_id',$branch_id)
            ->whereRaw($str_search)
            ->selectRaw('c.id,c.name,c.name_kh,c.code,c.standard_zone,c.nationality,c.nationality_kh,c.create_user,formatDate(c.create_date) as create_date')
            ->orderBy('c.standard_zone','ASC')->get();

         //});
        
         //Cache::put('countries',$countries,15);
         //return $countries;
     }


    //  static function list($arr,$ss){
    //      //$str_where ="1=1";
        
    //      return Cache::remember('countries',60,function(){
    //         return DB::table('loc_countries AS c')
    //         ->where('c.branch_id',$branch_id)
    //         ->where($str_search)
    //         ->select('c.id','c.name','c.name_kh','c.code','c.standard_zone','c.nationality','c.nationality_kh','c.create_user','c.create_date')
            
    //         ->orderBy('c.name','ASC')->get();
    //      });
        
    //      //Cache::put('countries',$countries,15);
    //      //return $countries;
    //  }

     static function save($d,$ss){
        $sanitize_rules = [];
        $branch_id = $ss->branch_id;
        $check_unique = ["$branch_id|loc_countries|name|id=id"];
        $res = validateObject($d,['id'=>'0|number|identity=1','name'=>'1|string|0-100','name_kh'=>'0|string|0-100','code'=>'1|string|0-25','nationality'=>'0|string|0-150'],true,$sanitize_rules,$ss->lang,false,$check_unique);
        if($res->error) return DV::error($res->error);
        $id = $res->id;
        $inputs = $res->values;
        $name = $inputs['name'];
        $name_kh = $inputs['name_kh'];
        $code = $inputs['code'];
        // $name_kh = $name_kh?$name_kh:$inputs['name'];
        // $name_kh = $name_kh?$name_kh:$inputs['name_kh'];
        // $name_kh = $name_kh?$name_kh:$inputs['code'];
        // $name_kh = $name_kh?$name_kh:$inputs['standard_zone'];

        $inputs['name']= $name;
        $inputs['name_kh'] = $name_kh;
        $inputs['code'] = $code; 
         
        $inputs['nationality'] = isset($inputs['nationality'])?$inputs['nationality']: $inputs['name'];
        $id = saveData($ss,'loc_countries',['id'=>$id],$inputs,[],1,false);
        if($id >0) return DV::success(["id"=>$id,'country'=>$d]);
        return DV::error("something wrong during saving country");
     }

     static function create($d,$ss){
        $sanitize_rules = [];
        // $branch_id = $ss->branch_id;
        // $check_unique = ["$branch_id|loc_countries|name|id=id"];
        $res = validateObject($d,['name'=>'1|string|0-200','name_kh'=>'0|string|0-200','code'=>'1|string|0-25','nationality'=>'0|string|0-150'],true,$sanitize_rules,$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        //$id = $res->id;
        $inputs = $res->values;
        $name = $inputs['name'];
        if(self::nameInUse($name, null)) return DV::error('Country named ? already exists::'.$name);
        $name_kh = $inputs['name_kh'];
        $code = $inputs['code'];
         
        $inputs['name']= $name;
        $inputs['name_kh'] = $name_kh;
        $inputs['code'] = $code; 
         
        $inputs['nationality'] = isset($inputs['nationality'])? $inputs['nationality']: $inputs['name'];
        $id = saveData($ss,'loc_countries',['id'=>null],$inputs,[],1,false);
        if($id >0) return (object)['status'=>'OK','id'=>$id, 'country'=>$inputs];
        return DV::error("something wrong during creating country");
     }

     static function existsById($id){
        return DB::table('loc_countries as c')->where('id',$id)->value('id');
     }
     static function nameInUse($name, $id=null){
        $str_id = $id > 0 ? ' c.id <> '.$id : '2=2';
        return DB::table('loc_countries as c')->whereRaw($str_id)->where('name',$name)->value('id');
     }
     static function update($d,$id, $ss){
        $sanitize_rules = [];
        if($id) return DV::error('Country ID is required to update country data');
        if(!self::existsById($id)) return DV::error('Country ID ? does not exist::'.$id);
       
        $res = validateObject($d,['name'=>'1|string|0-200','name_kh'=>'0|string|0-200','code'=>'1|string|0-25','nationality'=>'0|string|0-150'],true,$sanitize_rules,$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object)$inputs;
        if(self::nameInUse($d->name, $id)) return DV::error('Country named ? already exists::'.$d->name);
        $name = $inputs['name'];
        $name_kh = $inputs['name_kh'];
        $code = $inputs['code'];
         
        $inputs['name']= $name;
        $inputs['name_kh'] = $name_kh;
        $inputs['code'] = $code; 
         
        $inputs['nationality'] = isset($inputs['nationality'])? $inputs['nationality']: $inputs['name'];
        $id = saveData($ss,'loc_countries',['id'=>$id],$inputs,[],1,false);
        if($id >0) return (object)['status'=>'OK','id'=>$id, 'country'=>$inputs];
        return DV::error("something wrong during updating country");
     }
}
