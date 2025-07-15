<?php

namespace App\Models\Location;


use Illuminate\Support\Facades\DB;
use DV;
use DBX;
class Village
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

    static function save($d, $ss)
    {
        $sanitize_rules = [];
        $branch_id = $ss->branch_id;
        $check_unique = ["$branch_id|loc_villages|name|id=id"];

        $res = DBX::validateObject(
            $d,
            [
                'id' => '0|number|identity=1',
                'name' => '1|string|0-100',
                'name_kh' => '0|string|0-100',
                'commune_id' => '1|number|exists=loc_communes.id'
            ],
            true,
            $sanitize_rules,
            $ss->lang,
            false,
            $check_unique
        );

        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $id = $res->id;

        $inputs['name_kh'] = $inputs['name_kh'] ?: $inputs['name'];
        $inputs['branch_id'] = $branch_id;

        $id = DBX::saveData($ss, 'loc_villages', ['id' => $id], $inputs, [], 0);

        if ($id > 0) return DV::success(["village" => $inputs]);

        return DV::error("something wrong during saving village");
    }

    static function list($commune_id=null,$ss)
    {
        $str_where ="1=1";
        if($commune_id) $str_where ="v.commune_id =$commune_id";
        return DB::table('loc_villages AS v')
            ->whereRaw($str_where)
            ->join('loc_communes as c','c.id','=','v.commune_id')
            ->join('loc_districts as d','d.id','=','c.district_id')
            ->join('loc_cities as ct','ct.id','=','d.city_id')
            ->join('loc_countries as co','co.id','=','ct.country_id')
            ->select('v.id','v.name','v.name_kh','v.commune_id','c.name as commune','d.name as district','ct.name as city','co.name as country')
            ->orderBy('c.name','ASC')->get();
    }

    static function options_village($commune_id = null,$ss = null){
        $str_commune = $commune_id > 0 ? 'v.commune_id ='.$commune_id: '1=1';
        return DB::table('loc_villages as v')
            ->whereRaw($str_commune)
            ->join('loc_communes as c','c.id','=','v.commune_id')
            ->join('loc_districts as d','d.id','=','c.district_id')
            ->join('loc_cities as ct','ct.id','=','d.city_id')
            ->join('loc_countries as co','co.id','=','ct.country_id')
            ->selectRaw('v.id, v.name, v.name_kh,c.id as commune_id, c.name as commune,d.id as district_id, d.name as district,ct.id as city_id, ct.name as city,co.id as country_id, co.name as country')
            ->orderByRaw('v.name ASC')->get();
    }

    function getVillageFromOption($id = null, $ss = null)
    {
        $id = $id?$id:$this->id;
        $village_detail = DB::table('loc_villages')->where('id',$id)->selectRaw('id,name,name_kh')->first();
        return (object)[
            'zone'=>$village_detail ?? null
        ];
    }

}
