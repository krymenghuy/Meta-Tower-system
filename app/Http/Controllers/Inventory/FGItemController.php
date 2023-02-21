<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inventory\Settings;
use App\Models\JDV;
use App\Models\UM;
use DB;
use Session;

class FGItemController extends Controller
{
    //NOTE @item_class = {RM,MI,FG}. RM = "Raw Material",MI = "merchandising Item", FG ="Finished Goods" 
    protected static $item_class ="MI"; 
    //query group-list
    function getGroupList(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $search_value =$req->search_value;
        $group_id = $req->group_id;
        $country_id = $req->country_id;
        $category_id = $req->category_id;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
          $search_value = escape_like_str($search_value);
          $str_search ="(g.code ='$search_value' OR g.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
        }
        if ($group_id > 0) $str_moreWhere .=" AND g.id =$group_id";
        if($category_id > 0) $str_moreWhere .=" AND g.category_id =$category_id";
        if($country_id > 0)  $str_moreWhere .= " AND i.made_in_country_id =$country_id";
        //order by group_name
        $rows = DB::table('inv_item_groups as g')->join('inv_categories as c','c.id','=','g.category_id')->where('g.branch_id',$branch_id)->where("c.item_class",self::$item_class)->whereRaw($str_moreWhere)->whereRaw($str_search)->selectRaw("g.id,'Product' AS item_type,g.code,g.name,g.description,g.unit_id, g.sku,g.category_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,g.create_user,0 AS qty,formatDate(g.created_at) as created_at")->orderByRaw("g.name ASC")->get();
        return JDV::result($rows);
    }

    /***
     get items by variance group. For example, group ="Paracetamol", and items under this group can be:
      1. Paracetamol 500mg (France)
      2. Paracetamol 500mg (India)
      3. Paracetamol 1000mg (France) 
      4. Paracetamol 1000mg (India)
     ***/ 
    function getItemsByGroup(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $group_id = $req->group_id;

        $rows = DB::table('inv_items as i')->join('inv_item_groups as g','g.id','=','i.group_id')->join('inv_categories as c','c.id','=','g.category_id')->where('g.id',$group_id)->where('c.item_class',self::$item_class)->where('i.branch_id',$branch_id)->selectRaw("i.id,'Product' AS item_type,i.code,g.code as group_code,i.name,i.description,i.unit_id, i.sku,g.unit_id AS group_unit_id,g.sku AS group_sku,g.name as group_name,g.id as group_id,g.description as group_description, g.category_id, i.manufacturer_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,i.create_user,formatDate(i.created_at) as created_at, 0 AS qty")->orderByRaw("i.name ASC")->get();
        return JDV::result($rows);
    }

}
