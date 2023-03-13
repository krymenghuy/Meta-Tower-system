<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory\Settings;
use App\Events\QTYChanged;
use App\Models\JDV;
use App\Models\UM;
use App\Models\Inventory\StockUnit;
use App\Models\Inventory\Item;
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
 
    //Receive PO items and increase Inventory items  
    function receiveItems(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $branch_id = $ss->branch_id;

        $validate_rule = [
            "type"=>"1|choice|RM,FG",
            "warehouse_id"=>"1|exists=warehouses.id|default=1|text=Warehouse identity does not exist",
            //"block"=>"1|exists=inv_blocks.code|default=A",
            "stockclass_code"=>"1|string|exists=inv_stock_classes.code|default=A",
            "po_number"=>"0|string|0-25",
            "trx_date"=>"0|timestamp",
            "vendor_id"=>"0|number|exists=vendors.id",
            "items"=>"1|object"
        ];

        $check_unique = null;
        $res = validateReq($req,$validate_rule,true,[],$ss->lang,false,$check_unique);
        if($res->error) return JDV::error($res->error);
        
        $inputs = $res->values;
        $items = $inputs['items'];

        $trx_date = convertDate($inputs['trx_date']);
        if($trx_date > date('Y-m-d')) return JDV::error('Transaction date cannot be later than today');
        if(!(bool)strtotime($trx_date)) $trx_date = getNowTime();

        $stockclass_code = $inputs['stockclass_code'];
        $warehouse_id = 1; //$inputs["warehouse_id"];

        if(!(bool)strtotime($trx_date)) $trx_date = $inputs['trx_date'];

        //return JDV::result($items); 
        $item= null;
        $i =0;
        $success_items = [];
        do{
            if(!isset($items[$i])) break;
                $item = $items[$i];
                //begin:: task to process each $item in $items array
                  $unitInfo = StockUnit::info($item->sku);
                
                  $item_id = isset($item->id)?$item->id:null;
                  //$begin_qty = Item::beginQty($warehouse_id,$stockclass_code,$item_id,false,null);
                  $sold_qty =0;
                  $customer_return_qty =0;
                  $vendor_return_qty = 0;
                  $adjust_qty = 0;
                  $trx_id =0;
                  if(!$item_id) $item_id = isset($item->item_id)?$item->item_id:0;
                      $itemInfo = Item::info($item_id);
                      if($itemInfo){  
                            //$stock_item = $this->getStockRecord($branch_id,$warehouse_id,$stockclass_code,$item_id,$trx_date);
                            $input_item = ['id'=>$itemInfo->id,'code'=>$itemInfo->code,'sku'=>$item->sku,'unit_id'=>$unitInfo->id];
                            $stock_item = Item::prepareDailyStockRecord($ss,$warehouse_id,$stockclass_code,$input_item,$trx_date);
                            $update_qty =0;
                            if($stock_item){
                               $trx_id = $stock_item->trx_id;  
                               $update_qty = $stock_item->purchase_qty + $item->qty; 
                               DB::table('inv_daily_stocks')->where('id',$stock_item->trx_id)->where('branch_id',$branch_id)->where('warehouse_id',$warehouse_id)->where('stockclass_code',$stockclass_code)->update([
                                  'purchase_qty'=>$update_qty,
                                  'update_uid'=>$ss->user_id,
                                  'updated_at'=>getNowTime(),
                                  'update_user'=>$ss->login_name
                               ]);
                              $trx_id = $stock_item->trx_id;   
                            }
                            $item_stockclass = isset($item->stockclass_code)?$item->stockclass_code:$stockclass_code;  
                            $success_items[] = (object)['id'=>$item_id,'code'=>$itemInfo->code,'qty'=>$item->qty,'sku'=>$item->sku,'stockclass_code'=>$item_stockclass,'target_qty'=>'purchase_qty'];
                            StockLog::log($ss,['action'=>'receive','qty'=>$item->qty,'sku'=>$item->sku,'trx_id'=>$trx_id]);
                      } //end:: if item exists in table "inv_items" 
               
                //end:: task to process each $item in $items array
            $i++;
        }while($item);

        QTYChanged::dispatch(['user'=>$ss,'target_qty'=>'purchase_qty','warehouse_id'=>$warehouse_id,'stockclass_code'=>$stockclass_code,'items'=>$success_items]);
        return JDV::success($items);
    }


}
