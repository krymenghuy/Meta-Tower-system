<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inventory\Settings;
use App\Events\QTYChanged;
use App\Models\JDV;
use App\Models\UM;
use App\Models\Inventory\StockUnit;
use App\Models\Inventory\Item;
use App\Models\Inventory\VPO;
use App\Models\Inventory\StockLog;
use DB;
use Session;

class FGStockController extends Controller
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
          $str_search ="(g.code ='$search_value' OR g.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%' OR g.id IN (SELECT group_id FROM inv_items WHERE code ='$search_value'))";
        }
        if ($group_id > 0) $str_moreWhere .=" AND g.id =$group_id";
        if($category_id > 0) $str_moreWhere .=" AND g.category_id =$category_id";
        if($country_id > 0)  $str_moreWhere .= " AND i.made_in_country_id =$country_id";
        //order by group_name
        $rows = DB::table('inv_item_groups as g')->join('inv_categories as c','c.id','=','g.category_id')->where('g.branch_id',$branch_id)->where("c.item_class",self::$item_class)->whereRaw($str_moreWhere)->whereRaw($str_search)->selectRaw("g.id,'Product' AS item_type,g.code,g.name,g.description,g.unit_id,g.sku,g.category_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,g.create_user,getGroupQty(g.id) AS qty,formatDate(g.created_at) as created_at")->orderByRaw("g.name ASC")->get();
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

        $rows = DB::table('inv_items as i')->join('inv_item_groups as g','g.id','=','i.group_id')->join('inv_categories as c','c.id','=','g.category_id')->where('g.id',$group_id)->where('c.item_class',self::$item_class)->where('i.branch_id',$branch_id)->selectRaw("i.id,'Product' AS item_type,i.code,g.code as group_code,i.name,i.description,i.unit_id, i.sku,g.unit_id AS group_unit_id,g.sku AS group_sku,g.name as group_name,g.id as group_id,g.description as group_description, g.category_id, i.manufacturer_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,i.create_user,formatDate(i.created_at) as created_at, getItemQty(i.id) AS qty")->orderByRaw("i.name ASC")->get();
        return JDV::result($rows);
    }

    //given an item_id,trx_date, it returns object recpresneting the stock info for the item
    function getStockRecord($branch_id,$warehouse_id,$stockclass_code,$item_id,$trx_date =null){
         $date = date('Y-m-d');
         if((bool)strtotime($trx_date)) $date = convertDate($trx_date);
         $str_date = "DATE(trx_date) ='$date'";
         //NOTE: important field "si.id" is the stock ID used to update stock trx record
         $cols = "si.id,si.item_id,si.item_code,si.trx_date,si.warehouse_id,si.stockclass_code,si.begin_qty,si.purchase_qty,si.sold_qty,customer_return_qty,vendor_return_qty,adjust_qty,sku,unit_id";
         $rows = DB::table('inv_daily_stocks as si')->where('si.item_id',$item_id)->whereRaw($str_date)->where('warehouse_id',$warehouse_id)->where('stockclass_code',$stockclass_code)->where('si.branch_id',$branch_id)->selectRaw($cols)->take(1)->get();
         return isset($rows[0])? $rows[0]: null;                        
    }
 
    function receiveVPO(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $branch_id = $ss->branch_id;
        $vpo = VPO::fromReq($req);
        $res= StockManager::receiveVPO($vpo);
        return JDV::raw($res); 
    }
 
    //update item's price (retail,wholesale prices) and cost, and sku
    function updateItemInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $res = $this->stickManager->stoupdateItemInfo($ss,$req->all());
        return JDV::raw($res); 
    }
}
