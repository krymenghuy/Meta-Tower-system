<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
//use App\Models\UM;
use DB;

//begin:: Inventory Settings class
class Settings extends Model
{
    use HasFactory;

    static function options_group($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_groups as g')->where('branch_id',$branch_id)->selectRaw("g.id,g.name,g.description")->orderByRaw('g.name ASC')->get();
    }
    static function options_brand($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_brands as b')->where('b.branch_id',$branch_id)->selectRaw("b.id,b.name")->orderByRaw('b.name ASC')->get();
    }
    static function options_manufacturer($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_manufacturers as m')->where('m.branch_id',$branch_id)->selectRaw("m.id,m.name")->orderByRaw('m.name ASC')->get();
    }

    static function item_form_options($ss){
        $branch_id = $ss->branch_id;
        $groups =  DB::table('inv_groups as g')->where('g.branch_id',$branch_id)->selectRaw("g.id,g.name,g.description")->orderByRaw('g.name ASC')->get();
        $units =  DB::table('inv_units as u')->selectRaw("u.id,u.name,u.description")->orderByRaw('u.name ASC')->get(); 
        return (object)[
            'groups'=>$groups,
            'units'=>$units
        ];
    }
    
}
