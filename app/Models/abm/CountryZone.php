<?php

namespace App\Models\Abm;

use App\Models\DV;
use App\Models\Location\Country;
//use Sanitizer;
//use Illuminate\Pagination\LengthAwarePaginator; 
use DB;

class CountryZone //extends Model
{
    protected $id = null;
    protected $userInfo = null;

    public function  __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo= $userInfo;
    }
  
    static function zoneCountryExistsByName($country_name){
       return DB::table('os_zone_countries as z')->join('loc_countries as c','c.id','=','z.country_id')->where('c.name',$country_name)->selectRaw('id')->first();
    }

    function saveZone($country_id, $zone_code, $country_code, $country_name, $ss)
    {
       if(!$zone_code) return DV::error('zone code is required, and it must be a number');
       if (!$country_id){
         if(!$country_name && !$country_code) return DV::error('Country name and country code are required');
         $res = Country::create([
            'name'=>$country_name,
            'code'=>$country_code,
            'name_kh'=>$country_name,
            'nationality'=>$country_name
         ],$ss);
         if($res->status !='OK') return DV::error($res->error_message);
         $country_id = $res->id;
           
         if($country_id > 0){
            $inputs = [
                'country_id'=>$country_id,
                'zone_code'=>$zone_code
            ];
             
            $new_id = saveData($ss,'os_zone_countries',['id'=>null],$inputs,[],1,false);
            return DV::depends($new_id,null,'Failed to create standard zone');
         }
      }

       if(!$country_id) return DV::error('Failed to identify the country');

       DB::table('os_zone_countries')->where('country_id',$country_id)->update([
        'zone_code'=>$zone_code,
        'update_date'=>getNowTime(),
        'update_user'=>$ss->full_name,
        'update_uid'=>$ss->user_id
       ]);
       if($country_name && $country_code){
         DB::table('loc_countries')->where('id',$country_id)->update([
            'name'=>$country_name,
            'code'=>$country_code,
            'update_date'=>getNowTime(),
            'update_user'=>$ss->full_name,
            'update_uid'=>$ss->user_id
         ]);
       }
       return DV::depends(1);  
    } 

    // function save($arr,$id=null,$ss=null){
    //     $ss = $ss?$ss:$this->userInfo;
    //     $id = $id?$id:$this->id;
    //     $v_rule = [
    //         'country_id'=>'0|number|exists=loc_countries.id',
    //         'zone_code'=>'1|number',
    //         'country_name'=>'0|string|0-250',
    //         'country_code'=>'0|string|0-35'
    //     ];

    //     $res = validateObject($arr,$v_rule,true, null,$ss->lang,false,null);
    //     if($res->error) return DV::error($res->error);
    //     $inputs = $res->values;
    //     $d = (object)$inputs;

    //     $country_name = $d->country_name;
    //     $country_code = $d->country_code;
    //     $country_id = $d->country_id;
    //     unset($inputs['country_name'],$inputs['country_code']);

    //     //$create_country = false;
    //     if($id > 0){
    //         if($country_name && $country_code){
    //             //user wants to unpdate country name and country code for existing zone                 
    //             $res= Country::update(['name'=> $country_name, 'code'=> $country_code,'name_kh'=> $country_name,'nationality'=> $country_name],$country_id, $ss);
    //             if(!$res->status =='OK'){
    //                 $country_id = $res->id;
    //                 //$create_country = true;
    //             }else return DV::error( $res->error_message);
              
    //         }
    //         // else if(!$country_code  || !$country_name){
    //         //     //Just update zone_code only
    //         //      DB::table('os_zone_countries')->where('id',$id)->update([
    //         //         'country_id'=>$country_id, 
    //         //         'zone_code'=>$d->zone_code
    //         //      ]);
    //         // }
    //     }else
    //     {
    //         if($country_id > 0){
    //             $inputs = [
    //                 'country_id'=>$country_id,
    //                 'zone_code'=>$d->zone_code
    //             ];
    //             $id = saveData($ss,'os_zone_countries',['id'=>null],$inputs,[],1,false);

    //         } else return DV::error('Country name and country code are required to assign standard zone');  
    //     }
 
    //     // $inputs = [
    //     //     'country_id'=>$country_id,
    //     //     'zone_code'=>$d->zone_code
    //     // ];
    //     // $id = saveData($ss,'os_zone_countries',['id'=>$id],$inputs,[],1,false);
    //     // return DV::depends($id,[],'Faled to save country zone');
    // }

    static function getDeleteError($id){
        $country = DB::table('zone_countries')->where('id',$id)->selectRaw('id')->first();
        if(!$country) return 'Country does not exist in the zone list';
        return null;
    }

    // static function list_all($arr,$ss){
    //     $branch_id = $ss->branch_id;
    //     $d = (object)$arr;
    //     $search_value =isset($d->search_value)?$d->search_value:null;
 
    //     $str_search = '2=2';
    //     if($search_value){
    //         $search_value = escape_like_str($search_value);
    //         $str_search = '(z.country_code LIKE \'%'.$search_value.'%\' OR z.country_name LIKE \'%'.$search_value.'%\')';
    //     }
    //     $str_active ='IFNULL(z.inactive,0)=0';
    //     return DB::table('loc_countries AS z')->where('z.branch_id',$branch_id)->whereRaw($str_search)->selectRaw('z.name')->get();
    // }

    static function list($arr,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $search_value =isset($d->search_value)?$d->search_value:null;
 
        $str_search = '2=2';
        $str_search_zone = '3=3';
        if($search_value){
            $search_value = escape_like_str($search_value);
            $str_search = '(c.code LIKE \'%'.$search_value.'%\' OR c.name LIKE \'%'.$search_value.'%\')';
            $str_search_zone = $search_value > 0 ?'z.zone_code ='.$search_value : '2=2';
        }
        $zones = DB::table('os_zone_countries AS z')->join('loc_countries as c','c.id','=','z.country_id')->whereRaw($str_search_zone)->whereRaw($str_search)->where('z.branch_id',$branch_id)->selectRaw('z.id,z.zone_code,z.country_id, z.update_user, formatTime(z.update_date) AS update_date')->get();
        $rows = DB::table('loc_countries as c')->whereRaw($str_search)->selectRaw('c.id as country_id,c.name as country_name,c.code as country_code')->get();
        foreach($rows as $row){
            $country_id = $row->country_id;
            $founds = $zones->filter(function($x) use($country_id){
                return $x->country_id == $country_id;
            });
            $zone = '';
            if($founds) $zone = $founds->first();
            $row->id = $zone? $zone->id : null;
            $row->zone_code = $zone? $zone->zone_code: '';
            $row->update_user = $zone?  $zone->update_user: '';
            $row->update_date = $zone?  $zone->update_date: '';
        }
        return $rows;
    }
     
    function details($id,$ss){
        $branch_id = $ss->branch_id;
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
       return  DB::table('os_zone_countries as z')->join('loc_countries as c','z.country_id','=','c.country_id')->where('z.id',$id)->where('z.branch_id',$branch_id)->selectRaw('z.id,z.zone_code,c.name AS country_name, c.code as country_code, z.create_user,z.update_user, formatTime(z.update_date) AS create_date')->first();
 
    }

    function delete($id){
        $delete = DB::table('os_zone_countries')->where('id',$id)->delete();
        return DV::depends($delete,['action','deleted']);
    }
 
    static function getFormOptions($id, $country_id,$ss){
        $zone_country = null;
        if($id > 0){
           $zone_country = DB::table('os_zone_countries as z')->join('loc_countries as c','c.id','=','z.country_id')->where('z.id',$id)->selectRaw('z.id,z.country_id,z.zone_code,c.name as country_name, c.code as country_code')->first();
        }else if($country_id >0){
           $zone_country = DB::table('loc_countries as c')->where('c.id',$country_id)->selectRaw('\'\' AS id, c.id AS country_id, c.name as country_name, c.code as country_code')->first(); 
        }
        return (object)[
            'country'=>$zone_country
        ];
    }
}
