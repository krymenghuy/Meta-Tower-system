<?php

namespace App\Models\Dms;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\UM;
use DB;
use Sanitizer;
use Illuminate\Pagination\LengthAwarePaginator; 

class DeliveryZone //extends Model
{
    //use HasFactory;
    protected $id = null, $userInfo = null;
    public function  __construct($id=null,$userInfo=null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    /**
     * isCovered() returns TRUE if the zone is within the coverage area of delivery. NOTE: some areas are not within the zone of service
    */
    static function isCovered($zone_code){
      return true; 
    }

    /** used in Mobile app and Print zone list */
    static function listAll($arr,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $search_value =isset($d->search_value)?$d->search_value:null;

        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search = '2=2';
        if($search_value){
            $search_value = escape_like_str($search_value);
            $str_search = '(z.zone_code LIKE \'%'.$search_value.'%\' OR z.zone_name LIKE \'%'.$search_value.'%\')';
        }
        $str_active ='IFNULL(z.inactive,0)=0';
       return DB::table('zones AS z')->join('loc_communes AS com','com.id','=','z.commune_id')->join('loc_districts AS dist','dist.id','=','com.district_id')->join('loc_cities AS city','city.id','=','dist.city_id')->join('loc_countries AS c','c.id','=','city.country_id')->where('z.branch_id',$branch_id)->whereRaw($str_active)->whereRaw($str_search)->selectRaw('z.zone_type,z.id,z.zone_code,z.zone_name,z.country_id,z.city_id,z.district_id,z.commune_id,c.name_kh AS country_name, city.name AS city_name, dist.name AS district_name, com.name AS commune_name, IFNULL(z.price,0) AS price, z.description')->get();
    }

    static function list($arr,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $search_value =isset($d->search_value)?$d->search_value:null;

        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search = '2=2';
        if($search_value){
            $search_value = escape_like_str($search_value);
            $str_search = '(z.zone_code = \''.$search_value.'\' OR z.zone_name LIKE \'%'.$search_value.'%\')';
        }
        $str_active ='IFNULL(z.inactive,0)=0';
        $query = DB::table('zones AS z')->join('loc_communes AS com','com.id','=','z.commune_id')->join('loc_districts AS dist','dist.id','=','com.district_id')->join('loc_cities AS city','city.id','=','dist.city_id')->join('loc_countries AS c','c.id','=','city.country_id')->where('z.branch_id',$branch_id)->whereRaw($str_active)->whereRaw($str_search)->selectRaw('z.zone_type,z.id,z.zone_code,z.zone_name,z.country_id,z.city_id,z.district_id,z.commune_id,c.name_kh AS country_name, city.name AS city_name, dist.name AS district_name, com.name AS commune_name, IFNULL(z.price,0) AS price, z.description');
        $count_query = clone $query;
        $count = $count_query->count('z.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);

    }

    static function list_all($arr,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $search_value =isset($d->search_value)?$d->search_value:null;
 
        $str_search = '2=2';
        if($search_value){
            $search_value = escape_like_str($search_value);
            $str_search = '(z.zone_code LIKE \'%'.$search_value.'%\' OR z.zone_name LIKE \'%'.$search_value.'%\')';
        }
        $str_active ='IFNULL(z.inactive,0)=0';
        return DB::table('zones AS z')->join('loc_communes AS com','com.id','=','z.commune_id')->join('loc_districts AS dist','dist.id','=','com.district_id')->join('loc_cities AS city','city.id','=','dist.city_id')->join('loc_countries AS c','c.id','=','city.country_id')->where('z.branch_id',$branch_id)->whereRaw($str_active)->whereRaw($str_search)->selectRaw('z.zone_type,z.id,z.zone_code,z.zone_name,z.country_id,z.city_id,z.district_id,z.commune_id,c.name_kh AS country_name, city.name AS city_name, dist.name AS district_name, com.name AS commune_name, IFNULL(z.price,0) AS price, z.description')->get();
    }
 
    //used to return list of zones to mobile apps
    function getComboItems_zone($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $rows = DB::table('zones AS z')->where('z.branch_id',$branch_id)->selectRaw('z.id,z.zone_type,z.zone_code,z.zone_name')->get();
        return $rows;
    } 

    static function details($id){
        //$branch_id = $ss->branch_id;
        //$zone_id = $id;
        return DB::table('zones AS z')->join('loc_countries AS c','c.id','=','z.country_id')->join('loc_cities AS city','city.id','=','z.city_id')->join('loc_districts AS dist','dist.id','=','z.district_id')->join('loc_communes AS com','com.id','=','z.commune_id')->where('z.id',$id)->selectRaw('z.zone_type,z.id,z.zone_code,z.zone_name,z.country_id,z.city_id,z.district_id,z.commune_id,c.name_kh AS country_name, city.name_kh AS city_name, dist.name AS district_name, com.name AS commune_name, IFNULL(z.price,0) AS price, z.description')->take(1)->first();  
    }

    function zoneNameExists($ss,$zone_name,$id) {
        $branch_id = $ss->branch_id;
        $zone_name = Sanitizer::sanitize($zone_name);
        $str_id = $id > 0? 'z.id <> '.$id:'1=1';
        $test_id = DB::table('zones AS z')->where('z.branch_id',$branch_id)->join('loc_districts as d','d.id','=','z.district_id')->join('loc_communes as c','c.id','=','z.commune_id')->join('loc_countries as x','x.id','=','z.country_id')->where('z.zone_name',$zone_name)->whereRaw($str_id)->value('z.id');
        return $test_id > 0; 
    }

    function zoneCodeExists($ss,$zone_code,$id) {
        $branch_id = $ss->branch_id;
        $zone_code = Sanitizer::sanitize($zone_code);
        $str_id = $id > 0? 'z.id <> '.$id:'1=1';
        $test_id =  DB::table('zones AS z')->where('z.branch_id',$branch_id)->join('loc_districts as d','d.id','=','z.district_id')->join('loc_communes as c','c.id','=','z.commune_id')->join('loc_countries as x','x.id','=','z.country_id')->where('z.zone_code',$zone_code)->whereRaw($str_id)->value('z.id');
        return $test_id > 0; 
    }

    static function getFormOptions($id=null,$ss){
       $zone = null;
       if($id>0) $zone = self::details($id); 
       return (object)[
         'countries'=>GeneralSettings::options_country($ss),
         'senders'=>GeneralSettings::options_sender($ss),
         'zone_types'=>GeneralSettings::options_zone_type($ss),
         'zone'=>$zone
       ];  
    }

    function save($arr =[],$id = null,$ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $id = $id?$id:$this->id;
        //$branch_id = $ss->branch_id;
        $v_rule = [
            'zone_name'=>'1|string|1-250',
            'zone_code'=>'1|string|1-15',
            'zone_type'=>'1|choice|local,international,Local,International',
            'country_id'=>'1|number|exists=loc_countries.id',
            'city_id'=>'0|number|exists=loc_cities.id',
            'district_id'=>'0|number|exists=loc_districts.id',
            'commune_id'=>'0|number|exists=loc_communes.id'
        ];
        $res = validateObject($arr,$v_rule,true,['zone_code'=>['-']],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $zone_name = $inputs['zone_name'];
        $zone_code = $inputs['zone_code'];
        if ($this->zoneNameExists($ss,$zone_name,$id)) return DV::error('Zone Name already exists');
        if ($this->zoneCodeExists($ss,$zone_code,$id)) return DV::error('Zone Code already exists');
        $zone_code = trim($zone_code);
        
        $id = saveData($ss,'zones',['id'=>$id],$inputs,[],1,false);
        return DV::depends($id,null,'Failed to save zone'); 
    }

    static function getDeleteError($id){
      $zone = DB::table('zones')->where('id',$id)->selectRaw('id,zone_code,country_id')->first();
      if(!$zone) return 'Zone ID does not exist';  
      //$row = DB::table('package as p')->where('zone_code',$zone->zone_code)->selectRaw('id')->take(1)->first();
      //if($row) return 'Zone code "'.$zone->zone_code.'" has been already used';
      return null;
    }

    function delete($id=null) {   
        //$branch_id = $ss->branch_id;
        $id = $id?$id:$this->id;
        $err = self::getDeleteError($id);
        if($err) return DV::error($err);
        $x = DB::table('zones')->where('id',$id)->delete();
        return DV::depends($x,null,'Failed to delete zone');
    }

    function getZoneName($zone_code,$ss) {
        return DB::table('zones AS s')->where('branch_id',$ss->branch_id)->where('zone_code',$zone_code)->value('zone_name');
    }
    
    static function getZoneInfoByCode($code,$ss) {
        $branch_id = $ss->branch_id;
        return DB::table('zones AS z')->where('z.branch_id',$branch_id)->where('z.zone_code',$code)->selectRaw('zone_code,zone_name,price AS default_price,zone_type,fast_price, normal_price')->take(1)->first();
    }
}
