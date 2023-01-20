<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory\Item;
use App\Models\Inventory\ItemGroup;
use App\Models\Inventory\StockUnit;
use App\Models\Inventory\Settings;
use App\Models\JDV;
use App\Models\UM;
use DB;
use Session;

class ItemController extends Controller
{
    // protected $item;
    // public function __construct() {
    //     $this->item = new Item();
    // }

    function uniqid(){
      $branch_id = Session('branch_id',random_int()); 
      return uniqid($branch_id);
    }

    function getForm_options(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;

       $data =[
        'groups'=>Settings::options_group($ss),
        'brands'=>Settings::options_brand($ss),
        'units'=>Settings::options_unit($ss),
        'categories'=>Settings::options_category($ss),
        'manufacturer'=>Settings::options_manufacturer($ss)
       ];
       return JDV::result($data);
    }

    function getItemList(Request $req) { 
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
          $str_search ="(i.code ='$search_value' OR i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
        }
        if ($group_id > 0) $str_moreWhere .=" AND g.id =$group_id";
        if($category_id > 0) $str_moreWhere .=" AND g.category_id =$category_id";
        if($country_id > 0)  $str_moreWhere .= " AND i.made_in_country_id =$country_id";
        //if ($brand_id >0) $str_brand ="g.id =$brand_id";
        //order by group_name or group_code
        $rows = DB::table('inv_items as i')->join('inv_item_groups as g','g.id','=','i.group_id')->join('inv_categories as c','c.id','=','g.category_id')->where('i.branch_id',$branch_id)->whereRaw($str_moreWhere)->whereRaw($str_search)->selectRaw("i.id,'Product' AS item_type,i.code,g.code as group_code,i.name,i.description,i.unit_id, i.sku,g.unit_id AS group_unit_id,g.sku AS group_sku,g.name as group_name,g.id as group_id,g.description as group_description, g.category_id, i.manufacturer_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,i.create_user,formatDate(i.created_at) as created_at")->orderByRaw("g.name ASC,i.code ASC")->get();
        return JDV::result($rows);
    }
     
    function deleteItem(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
      $branch_id = $ss->branch_id;
      $id = $req->id;     
      $r =  Item::where('branch_id',$branch_id)->where('id',$id)->delete();
      //if($r) 
      return JDV::success();
      //else return JDV::error("Failed to delete inventory item $id");
    }
     
    //return quick info of an item for itemsView on receipt/invoice/Receive Stock Form 
    function getItemInfo(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
      $branch_id = $ss->branch_id;
      $id = $req->id;     
      return JDV::result(Item::info($ss,$id));
    }

    function getItemGroupInfo(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
      $branch_id = $ss->branch_id;
      $group_id = $req->group_id;     
      return JDV::result(ItemGroup::info($ss,$group_id));
    }

    function getItemDetails(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
      $branch_id = $ss->branch_id;
      $id = $req->id;     
      $rows = DB::table('inv_items as i')->join('inv_item_groups as g','g.id','=','i.group_id')->join('inv_categories as c','c.id','=','g.category_id')->where('i.id',$id)->where('i.branch_id',$branch_id)->selectRaw("i.id,'Product' AS item_type,i.code,g.code as group_code,i.name,i.description,g.name as group_name,g.id as group_id,g.description as group_description, g.category_id, i.manufacturer_id, i.unit_id,g.unit_id as group_unit_id,i.sku,g.sku as group_sku,c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,i.create_user,formatDate(i.created_at) as created_at")->take(1)->get();
      return JDV::result(isset($rows[0])?$rows[0]:null);  
    }

    function saveItem(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
        $branch_id = $ss->branch_id;
      
        $def_prefix =null;
        $def_code_length = 5;
        $validate_rule =[
          "id"=>"0|number|identity=1",
          "name"=>"1|string|1-150",
          "description"=>"0|string",
          "brand_id"=>"0|exists=inv_brands.id",
          "manufacturer_id"=>"0|exists=inv_manufacturers.id",
          "cost"=>"0|number|default=0",
          "made_in_country_id"=>"0|exists=inv_countries",
          "unit_id"=>"0|exists=inv_units.id|text=SKU is required",
          "category_id"=>"1|number|exists=inv_categories.id",
          "detail_type_id"=>"0|number|exists=inv_detailed_types.id",
          "group_id"=>"1|positive|exists=inv_item_groups.id"
        ];
        $check_unique = ["$branch_id|inv_items|name|id=id|text=item name already exists"];
        
        $res = validateReq($req,$validate_rule,true,[],$ss->lang,false,$check_unique);
        if($res->error) return JDV::error($res->error);
        $inputs =$res->values;
        $id = $res->id;
        
        //$unit_id = $inputs['unit_id'];
        //$unit = StockUnit::info($unit_id);
        //if (!$unit) return JDV::error("Unit ID id not valid. There is no valid SKU found!");
        //$inputs['sku'] = $unit->name;
        
        $group_id = $inputs['group_id'];
        $category_id = $inputs['category_id'];
        $detail_type_id = $inputs['detail_type_id'];
        unset($inputs['category_id']);
        unset($inputs['detail_type_id']);
        $id = saveData($ss,'inv_items',['id'=>$id],$inputs,[],1);
        if($id > 0){
          $new_code = setOfficialCode($branch_id,'inv_item_code_control','inv_items',['id'=>$id],$def_prefix,$def_code_length);
          if($category_id>0) saveData($ss,'inv_item_groups',['id'=>$group_id],['category_id'=>$category_id],[],1);
          if($detail_type_id>0) saveData($ss,'inv_item_groups',['id'=>$group_id],['detail_type_id'=>$detail_type_id],[],1);
          return JDV::success(['id'=>$id]);
        }
        else return JDV::error("Something went wrong during saving inventory item");
    }
     
    // function setStockIn(Request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
    //     $branch_id = $ss->branch_id;
    //     $d = $req->all();
        
    //     $id = $d->item_id;
    //     $stockin_date = isset($d->stockin_date)?$d->stockin_date:null;
    //     $qty = $d->qty;

    //     DB::table('stockins')->insert([
    //       'branch_id'=>$branch_id,
    //       'stockin_date'=>$stockin_date,
    //       'item_id'=>$id,
    //       'qty'=>$qty,
    //       'create_user'=>$ss->full_name,
    //       'create_uid'=>$ss->user_id,
    //       'created_at'=>getNowTime()
    //     ]);

    //     return JDV::success();
    // }
 
}
