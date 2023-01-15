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
        return DB::table('inv_item_groups as g')->where('g.branch_id',$branch_id)->selectRaw("g.id,g.name as group_name,g.description")->orderByRaw('g.name ASC')->get();
    }
    static function options_brand($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_brands as b')->where('b.branch_id',$branch_id)->selectRaw("b.id,b.name as brand_name")->orderByRaw('b.name ASC')->get();
    }
    static function options_category($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_categories')->where('branch_id',$branch_id)->selectRaw("id,name as category")->orderByRaw('name ASC')->get();
    }
    
    static function options_unit($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_units')->where('branch_id',$branch_id)->selectRaw("id,name as unit_name")->orderByRaw('name ASC')->get();
    }

    static function options_manufacturer($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_manufacturers as m')->where('m.branch_id',$branch_id)->selectRaw("m.id,m.name")->orderByRaw('m.name ASC')->get();
    }

    static function options_detail_type($ss,$category_id){
        $branch_id = $ss->branch_id;
        return DB::table('inv_detailed_types AS d')->where('d.category_id',$category_id)->where('d.branch_id',$branch_id)->selectRaw("d.id,d.name as detail_type")->orderByRaw('d.name ASC')->get();
    }
 
    static function item_form_options($ss){
        $branch_id = $ss->branch_id;
        $groups =  DB::table('inv_item_groups as g')->where('g.branch_id',$branch_id)->selectRaw("g.id,g.name as group_name,g.description")->orderByRaw('g.name ASC')->get();
        $units =  DB::table('inv_units as u')->where('u.branch_id',$branch_id)->selectRaw("u.id,u.name as unit_name,u.description")->orderByRaw('u.name ASC')->get();
        $categories =  DB::table('inv_categories')->where('branch_id',$branch_id)->selectRaw("id,name as category")->orderByRaw('name ASC')->get(); 
        $manufacturers = DB::table('inv_manufacturers as m')->where('m.branch_id',$branch_id)->selectRaw("m.id,m.name as manufacturer")->orderByRaw('m.name ASC')->get();
        return (object)[
            'groups'=>$groups,
            'units'=>$units,
            'categories'=>$categories,
            'manufacturers'=>$manufacturers
        ];
    }
    
}
