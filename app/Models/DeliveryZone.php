<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;
use Session;
use Carbon\Carbon;

class DeliveryZone extends Model
{
    use HasFactory;

    function getDeliveryZoneList($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $rows = DB::table('zones AS z')->join('loc_countries AS c','c.id','=','z.country_id')->join('loc_cities AS city','city.id','=','z.city_id')->join('loc_districts AS dist','dist.id','=','z.district_id')->join('loc_communes AS com','com.id','=','z.commune_id')->where('z.branch_id',$branch_id)->selectRaw('z.zone_type,z.id,z.zone_code,z.zone_name,z.country_id,z.city_id,z.district_id,z.commune_id,c.name_kh AS country_name, city.name_kh AS city_name, dist.name AS district_name, com.name AS commune_name, IFNULL(z.price,0) AS price, z.description')->get();
        return $rows;  
    }

    //used to return list of zones to mobile apps
    function getComboItems_zone($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $rows = DB::table('zones AS z')->where('z.branch_id',$branch_id)->selectRaw('z.id,z.zone_type,z.zone_code,z.zone_name')->get();
        return $rows;
    } 

    function getDeliveryZoneDetails($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $zone_id = $d->zone_id;
        $rows = DB::table('zones AS z')->join('loc_countries AS c','c.id','=','z.country_id')->join('loc_cities AS city','city.id','=','z.city_id')->join('loc_districts AS dist','dist.id','=','z.district_id')->join('loc_communes AS com','com.id','=','z.commune_id')->where('z.branch_id',$branch_id)->where('z.id',$zone_id)->limit(1)->selectRaw('z.zone_type,z.id,z.zone_code,z.zone_name,z.country_id,z.city_id,z.district_id,z.commune_id,c.name_kh AS country_name, city.name_kh AS city_name, dist.name AS district_name, com.name AS commune_name, IFNULL(z.price,0) AS price, z.description')->get();
        foreach($rows as $row) return $row;
        return null;  
    } 
    function zoneNameExists($uss,$zone_name,$id) {
       $branch_id = $uss->branch_id;
       $zone_name = sanitize($zone_name);
       $id = sanitize($id);

       if($id > 0)
         return DB::table('zones')->where('branch_id',$branch_id)->where('zone_name',$zone_name)->where('id','<>',$id)->limit(1)->exists();
       else 
         return DB::table('zones')->where('branch_id',$branch_id)->where('zone_name',$zone_name)->limit(1)->exists();
    }

    function zoneCodeExists($uss,$zone_code,$id) {
        $branch_id = $uss->branch_id;
        $zone_code = sanitize($zone_code);
        $id = sanitize($id);
        if($id > 0)
          return DB::table('zones')->where('branch_id',$branch_id)->where('zone_code',$zone_code)->where('id','<>',$id)->limit(1)->exists();
        else 
          return DB::table('zones')->where('branch_id',$branch_id)->where('zone_code',$zone_code)->limit(1)->exists();
     }

    function saveDeliveryZone($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $id = sanitize($d->id);
        $zone_name = sanitize($d->zone_name);
        $zone_code = sanitize($d->zone_code);  
        if ($this->zoneNameExists($ss,$zone_name,$id)) return "Zone Name already exists";
        if ($this->zoneCodeExists($ss,$zone_code,$id)) return "Zone Code already exists";
        $zone_code = trim($zone_code);
        
        if($id > 0) {
            DB::table('zones')->where('id',$id)->where('branch_id',$branch_id)->update(array(
                'zone_type'=>sanitize($d->zone_type),
                'zone_name'=>$zone_name,
                'zone_code'=>$zone_code,
                'country_id'=>sanitize($d->country_id),
                'city_id'=>sanitize($d->city_id),
                'district_id'=>sanitize($d->district_id),
                'commune_id'=>sanitize($d->commune_id),
                'price'=>sanitize($d->price), //Default delivery fee in this zone.
                'create_user'=>$ss->login_name,
                'create_date'=>getNowTime()
            ));
        }else{
            DB::table('zones')->insert(array(
                'branch_id'=>$branch_id,
                'zone_type'=>sanitize($d->zone_type),
                'zone_name'=>$zone_name,
                'zone_code'=>$zone_code,
                'country_id'=>sanitize($d->country_id),
                'city_id'=>sanitize($d->city_id),
                'district_id'=>sanitize($d->district_id),
                'commune_id'=>sanitize($d->commune_id),
                'price'=>sanitize($d->price), //Default delivery fee in this zone.
                'create_user'=>$ss->login_name,
                'create_date'=>getNowTime()
            ));
        }
        return null;
    }

    function deleteDeliveryZone($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $id = sanitize($d->id);
        //$rows = DB::table('zones AS z')->where('branch_id',$branch_id)->where('z.id',$id)->limit(1)->selectRaw('z.zone_code,z.district_id, z.commune_id')->get(1);
        //$commune_id = null;
        //foreach($rows as $row) $commune_id = $row->commune_id;
        DB::table('zones')->where('branch_id',$branch_id)->where('id',$id)->delete();
        return null;
    }

    function getZoneName($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $zone_code = $d->zone_code;
        $rows = DB::table('zones AS s')->where('branch_id',$branch_id)->where('zone_code',$zone_code)->selectRaw('zone_name')->limit(1)->get();
        foreach($rows as $row) return $row->zone_name;
        return null;
    }
    function getZoneInfo($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $zone_code = $d->zone_code;
        $delivery_type = isset($d->delivery_type)?$d->delivery_type:null; //Default to "Normal"
        $sender_id = isset($d->sender_id)?$d->sender_id:0;

        $rows = DB::table('zones AS s')->where('branch_id',$branch_id)->where('zone_code',$zone_code)->selectRaw('zone_code,zone_name,price AS default_price,zone_type,fast_price, normal_price')->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;
    }
}
