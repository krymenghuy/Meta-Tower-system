<?php

namespace App\Models\Abm;

use App\Models\DV;
use Sanitizer;
use Illuminate\Pagination\LengthAwarePaginator; 
use DB;

class CountryZone //extends Model
{
    protected $id = null;
    protected $userInfo = null;

    public function  __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo=$userInfo;
    }

    function countryNameExists($ss,$country_name,$id) {
        $branch_id = $ss->branch_id;
        $country_name = Sanitizer::sanitize($country_name);
        $str_id = $id > 0? 'z.id <> '.$id:'1=1';
        $test_id = DB::table('country_zones AS z')->where('z.branch_id',$branch_id)->where('z.country_name',$country_name)->whereRaw($str_id)->value('z.id');
        return $test_id > 0; 
    }
    function save($arr,$id=null,$ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $id = $id?$id:$this->id;

        $v_rule = [
            'country_code'=>'1|string|1-50',
            'country_name'=>'1|string|1-250',
            'standard_zone'=>'1|number'
            
        ];
        $res = validateObject($arr,$v_rule,true,['country_name'=>['-']],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $country_name = $inputs['country_name'];
        if($this->countryNameExists($ss,$country_name,$id)) return DV::error('Country Name already exists');

        $id = saveData($ss,'country_zones',['id'=>$id],$inputs,[],1,false);
        return DV::depends($id,['action'=>'saved']);
    }
    static function getDeleteError($id){
        $country = DB::table('country_zones')->where('id',$id)->selectRaw('id,zone_code')->first();
        if(!$country) return 'Country ID does not exist';

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
    function details($id,$ss){
        $branch_id = $ss->branch_id;
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $row = DB::table('country_zones')->where('id',$id)->where('branch_id',$branch_id)->selectRaw('id,country_code,country_name,standard_zone,create_user')->first();
        return $row;
    }
    function delete($id){
        $delete = DB::table('country_zones')->where('id',$id)->delete();
        return DV::depends($delete,['action','deleted']);
    }



}
