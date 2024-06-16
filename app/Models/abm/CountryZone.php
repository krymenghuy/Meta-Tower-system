<?php

namespace App\Models\Abm;

use App\Models\DV;
use App\Models\Location\Country;
//use Sanitizer;
use Illuminate\Pagination\LengthAwarePaginator; 
use DB;

class CountryZone //extends Model
{
    protected $id = null;
    protected $userInfo = null;

    public function  __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo= $userInfo;
    }
  
    function save($arr,$id=null,$ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $id = $id?$id:$this->id;

        $v_rule = [
            'country_id'=>'1|int|exists=loc_countries.id',
            'zone_code'=>'1|number',
            'country_name'=>'0|string|0-250',
            'country_code'=>'0|string|0-35'
        ];

        $res = validateObject($arr,$v_rule,true, null,$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object)$inputs;

        $country_name = $inputs['country_name'];
        $country_code = $inputs['country_code'];
        unset($inputs['country_name'],$inputs['country_code']);

        $country_id = $inputs['country_id'];  
        //$create_country = false;
        if($country_name && $country_code){
            $res= Country::save(['name'=>$country_name, 'code'=>$country_code,'name_kh'=>$country_name,'nationality'=>$country_name],$ss);
            if(!$res->status =='OK'){
                $country_id = $res->id;
                //$create_country = true;
            }else return DV::error( $res->error_message);
          
        }else if(!$country_code  || !$country_name){
             return DV::error('country name and country code are required for standard zone assignment');
        }
        $inputs = [
            'country_id'=>$country_id,
            'zone_code'=>$d->zone_code
        ];
        $id = saveData($ss,'os_zone_countries',['id'=>$id],$inputs,[],1,false);
        return DV::depends($id,[],'Faled to save country zone');
    }

    static function getDeleteError($id){
        $country = DB::table('zone_countries')->where('id',$id)->selectRaw('id')->first();
        if(!$country) return 'Country does not exist in the zone list';
        return null;
    }

    static function list_all($arr,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $search_value =isset($d->search_value)?$d->search_value:null;
 
        $str_search = '2=2';
        if($search_value){
            $search_value = escape_like_str($search_value);
            $str_search = '(z.country_code LIKE \'%'.$search_value.'%\' OR z.country_name LIKE \'%'.$search_value.'%\')';
        }
        $str_active ='IFNULL(z.inactive,0)=0';
        return DB::table('loc_countries AS z')->where('z.branch_id',$branch_id)->whereRaw($str_search)->selectRaw('z.name')->get();
    }

    static function list($arr,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        
        $current_page = isset($d->current_page) ? $d->current_page : 1;
        $per_page = isset($d->per_page) ? $d->per_page : 10;
        if (!is_numeric($current_page)) $current_page = 1;
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value =isset($d->search_value)?$d->search_value:null;
 
        $str_search = '2=2';
        if($search_value){
            $search_value = escape_like_str($search_value);
            $str_search = '(c.code LIKE \'%'.$search_value.'%\' OR c.country_name LIKE \'%'.$search_value.'%\')';
        }

        $query = DB::table('zone_countries AS z')->join('loc_countries as c','c.id','=','z.country_id')->where('z.branch_id',$branch_id)->whereRaw($str_search)->selectRaw('z.name');
        $count_query = clone $query;
        $count = $count_query->count('z.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
     
    function details($id,$ss){
        $branch_id = $ss->branch_id;
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
       return  DB::table('os_zone_countries as z')->join('loc_countries as c','z.country_id','=','c.country_id')->where('z.id',$id)->where('z.branch_id',$branch_id)->selectRaw('z.id,z.zone_code,c.name AS country_name, c.code as country_code, z.create_user, formatTime(z.create_date)')->first();
 
    }

    function delete($id){
        $delete = DB::table('os_zone_countries')->where('id',$id)->delete();
        return DV::depends($delete,['action','deleted']);
    }
 
}
