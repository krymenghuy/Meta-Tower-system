<?php
namespace App\Services;
use App\Events\QTYChanged;
use DB;
use App\Models\DV;
use App\Models\Inventory\Item;
use App\Models\Inventory\StockUnit;
use App\Models\Inventory\StockLog;

class MIStockManager {
 
    protected static $item_class ="MI";
    function __construct(){
        return;
    } 
     
   //Receive PO items and increase Inventory items  
    function receiveVPO($ss,$data){
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
        $res = validateObject($data,$validate_rule,true,[],$ss->lang,false,$check_unique);
        if($res->error) return DV::error($res->error);
        
        $inputs = $res->values;
        $items = $inputs['items'];

        $trx_date = convertDate($inputs['trx_date']);
        if($trx_date > date('Y-m-d')) return DV::error('Transaction date cannot be later than today');
        if(!(bool)strtotime($trx_date)) $trx_date = getNowTime();

        $stockclass_code = $inputs['stockclass_code'];
        $warehouse_id = 1; //$inputs["warehouse_id"];

        if(!(bool)strtotime($trx_date)) $trx_date = $inputs['trx_date'];

        //return DV::result($items); 
        $item= null;
        $i =0;
        $success_items = [];
        $success_count=0;
        $error = [];
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

                  $itemInfo = null;
                  if ($item_id>0){
                    $itemInfo = Item::info($item_id);
                  }else{
                     $itemInfo = Item::info(isset($item->item_code)?$item->item_code:"",true,$branch_id);
                  }
                      if(!$unitInfo) $errors[] ="UOM for item ID $itemInfo->id is not valid or not found!";
                      if($itemInfo & $unitInfo){
                            $item_id = $itemInfo->id;
                            //$stock_item = $this->getStockRecord($branch_id,$warehouse_id,$stockclass_code,$item_id,$trx_date);
                            $input_item = ['id'=>$itemInfo->id,'code'=>$itemInfo->code,'sku'=>$item->sku,'unit_id'=>$unitInfo->id,'purchase_qty'=>$item->qty];
                            $stock_item = Item::prepareDailyStockRecord($ss,$warehouse_id,$stockclass_code,$input_item,$trx_date);
                            $update_qty =0;
                            if($stock_item){
                               $trx_id = $stock_item->trx_id;  
                               $update_qty = $stock_item->purchase_qty + $item->qty; 
                               $x = DB::table('inv_daily_stocks')->where('id',$stock_item->trx_id)->where('branch_id',$branch_id)->where('warehouse_id',$warehouse_id)->where('stockclass_code',$stockclass_code)->update([
                                  'purchase_qty'=>$update_qty,
                                  'update_uid'=>$ss->user_id,
                                  'updated_at'=>getNowTime(),
                                  'update_user'=>$ss->login_name
                               ]);
                               if(!$x) return DV::error("Failed to udpate daily stock status");
                               $trx_id = $stock_item->trx_id;   
                            }
                            $item_stockclass = isset($item->stockclass_code)?$item->stockclass_code:$stockclass_code;
                            $success_count++;  
                            $success_items[] = (object)['id'=>$item_id,'code'=>$itemInfo->code,'qty'=>$item->qty,'sku'=>$item->sku,'stockclass_code'=>$item_stockclass,'target_qty'=>'purchase_qty'];
                            StockLog::log($ss,['action'=>'receive','qty'=>$item->qty,'sku'=>$item->sku,'trx_id'=>$trx_id]);
                      } //end:: if item exists in table "inv_items" 
               
                //end:: task to process each $item in $items array
            $i++;
        }while($item);
        if ($success_count===0) return DV::error("0 items were received in the purchase order");
        QTYChanged::dispatch(['user'=>$ss,'target_qty'=>'purchase_qty','warehouse_id'=>$warehouse_id,'stockclass_code'=>$stockclass_code,'items'=>$success_items]);
        return DV::success(['data'=>['success_count'=>$success_count,'count'=>$i]]);
    }

    //getGroupList()
    function getGroupList($ss,$data) { 
        $branch_id = $ss->branch_id;
        $warehouse_id =isset($data['warehouse_id'])?$data['warehouse_id']:1;
        //throw new \Exception("warrehouse = $warehouse_id");
        $stock_class =isset($data['stock_class'])?$data['stock_class']:null;
        if(!$stock_class) $stock_class =isset($data['stock_class_code'])?$data['stock_class_code']:null;
        if(!$stock_class) $stock_class =isset($data['stockclass_code'])?$data['stockclass_code']:null;

        $search_value =isset($data['search_value'])?$data['search_value']:"";
        $group_id = isset($data['group_id'])?$data['group_id']:null;
        $country_id =isset( $data['country_id'])? $data['country_id']:null;
        $category_id = isset($data['category_id'])?$data['category_id']:null;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
          $search_value = escape_like_str($search_value);
          $str_search ="(g.code ='$search_value' OR g.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%' OR g.id = (select group_id FROM inv_items where code ='$search_value' LIMIT 1))";
        }
        if ($group_id > 0) $str_moreWhere .=" AND g.id =$group_id";
        if($category_id > 0) $str_moreWhere .=" AND g.category_id =$category_id";
        if($country_id > 0)  $str_moreWhere .= " AND i.made_in_country_id =$country_id";
        //order by group_name
        $rows = DB::table('inv_item_groups as g')->join('inv_categories as c','c.id','=','g.category_id')->where('g.branch_id',$branch_id)->where("c.item_class",self::$item_class)->whereRaw($str_moreWhere)->whereRaw($str_search)->selectRaw("g.id,'Product' AS item_type,g.code,g.name,g.description,g.unit_id, g.sku,g.category_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,g.create_user, 0 AS qty, NULL AS last_updated,formatDate(g.created_at) as created_at")->orderByRaw("g.name ASC")->get();
        foreach($rows as $row){
           $e = $this->getLastQty_group($warehouse_id,$row->id,$stock_class);
           $row->qty =$e->qty;
           $row->last_updated = $e->last_updated;
        }
        return $rows;
    }

      /***
     get items by variance group. For example, group ="Paracetamol", and items under this group can be:
      1. Paracetamol 500mg (France)
      2. Paracetamol 500mg (India)
      3. Paracetamol 1000mg (France) 
      4. Paracetamol 1000mg (India)
     ***/ 
    function getItemsByGroup($ss,$data) { 
        $branch_id = $ss->branch_id;
        $warehouse_id = isset($data['warehouse_id'])? $data['warehouse_id']:1;
        $group_id = $data['group_id'];
        $stock_class = isset($data['stockclass_code'])?$data['stockclass_code']:null;
        if(!$stock_class)  $stock_class = isset($data['stock_class'])?$data['stock_class']:null;
        //$str_warehouse = "1=1";
        //if($warehouse_id>0) $str_warehouse="g.warehouse_id =$warehouse_id";
        if(!$stock_class) $stock_class = isset($data['stock_class_code'])?$data['stock_class_code']:null;
        $rows =  DB::table('inv_items as i')->join('inv_item_groups as g','g.id','=','i.group_id')->join('inv_categories as c','c.id','=','g.category_id')->where('g.id',$group_id)->where('c.item_class',self::$item_class)->where('i.branch_id',$branch_id)->selectRaw("i.id,'Product' AS item_type,i.code,g.code as group_code,i.name,i.description,i.unit_id, i.sku,g.unit_id AS group_unit_id,g.sku AS group_sku,g.name as group_name,g.id as group_id,g.description as group_description, g.category_id, i.manufacturer_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,i.create_user,formatDate(i.created_at) as created_at")->orderByRaw("i.name ASC")->get();
        foreach($rows as $row){
            $e = $this->getLastQty($warehouse_id,$row->id,$stock_class); 
            $row->qty =$e->qty;
            $row->last_updated = $e->last_updated; 
        }
        return $rows;
    }

    function getLastQty_group($warehouse_id,$group_id,$stock_class=null){
        //$str_stockclass ="1=1";
        //if($stock_class) $str_stockclass ="c.stockclass_code ='$stock_class'";
        $empty_result = (object)['qty'=>0,'last_updated'=>null];
        //If no warehouse is selected return zero. todo: later consider showing qty for all warehouses in this case
        if(!$warehouse_id) return $empty_result;
        $rows = [];
        if($stock_class) 
        {
               $rows = DB::table('inv_current_stocks as c')->join('inv_items as i','i.id','=','c.item_id')->where('i.group_id',$group_id)->where('c.warehouse_id',$warehouse_id)->where('c.stockclass_code',$stock_class)->selectRaw("c.qty as qty,c.created_at")->orderBy('c.id','DESC')->take(1)->get();
               foreach($rows as $row) 
               return (object)[
                   'qty'=>$row->qty,
                   'last_updated'=>date('d M Y',strtotime($row->created_at))
               ];
        }
        else{
            $rows = DB::table('inv_current_stocks as c')->join('inv_items as i','i.id','=','c.item_id')->where('i.group_id',$group_id)->where('c.warehouse_id',$warehouse_id)->selectRaw("c.qty, c.created_at")->orderBy('c.id','DESC')->get();
            $last_date =null;
            $cnt =0;
            $qty =0;
            foreach($rows as $row){
              if($cnt ===0) $last_date = $row->created_at;
              $qty +=$row->qty;
              $cnt++;
            }
            return (object)[
               'qty'=>$qty,
               'last_updated'=>$last_date? date('d M Y',strtotime($last_date)) : null
           ];
        }    
        return $empty_result;
      }

   function getLastQty($warehouse_id,$item_id,$stock_class=null){
     //$str_stockclass ="1=1";
     //if($stock_class) $str_stockclass ="c.stockclass_code ='$stock_class'";
     $empty_result = (object)['qty'=>0,'last_updated'=>null];
     //If no warehouse is selected return zero. todo: later consider showing qty for all warehouses in this case
     if(!$warehouse_id) return $empty_result;
     $rows = [];
     if($stock_class) 
     {
            $rows = DB::table('inv_current_stocks as c')->where('c.item_id',$item_id)->where('c.warehouse_id',$warehouse_id)->where('stockclass_code',$stock_class)->selectRaw("c.qty as qty,c.created_at")->orderBy('c.id','DESC')->take(1)->get();
            foreach($rows as $row) 
            return (object)[
                'qty'=>$row->qty,
                'last_updated'=>date('d M Y',strtotime($row->created_at))
            ];
     }
     else{
       
         $rows = DB::table('inv_current_stocks as c')->where('c.item_id',$item_id)->where('c.warehouse_id',$warehouse_id)->selectRaw("c.qty, c.created_at")->orderBy('c.id','DESC')->get();
         $last_date =null;
         $cnt =0;
         $qty =0;
         foreach($rows as $row){
           if($cnt ===0) $last_date = $row->created_at;
           $qty +=$row->qty;
           $cnt++;
         }
         return (object)[
            'qty'=>$qty,
            'last_updated'=>$last_date? date('d M Y',strtotime($last_date)):null
        ];
     }    
     return $empty_result;
   }

   function deleteVPO($ss,$id){
      $branch_id = $ss->branch_id;
      DB::table('inv_vpo_items')->where('order_id',$id)->where('branch_id',$branch_id)->delete();
      DB::table('inv_vpo')->where('id',$id)->where('branch_id',$branch_id)->delete();
      return DV::success();
   }

   function itemCodeInUse($code,$item_id =0){
      $str_id ="1=1";
      if($item_id > 0) $str_id ="i.id <> $item_id";
      return DB::table("inv_items as i")->where('i.code',$code)->whereRaw($str_id)->select('id')->take(1)->exists(); 
   }

   //Change item's Code, Name, Description
   function updateItemBasicInfo($ss,$d){
    $branch_id = $ss->branch_id;
    $valiate_rule = [
      'item_id'=>'1|identity=1',
      'name'=>'1|string|1-100',
      'code'=>'1|string|text=Item code is required',
      'description'=>'0|string|1-150'
      ];

     $res = validateObject($d,$valiate_rule,true,[],$ss->lang,false,null);
     if($res->error) return DV::error($res->error); 
     $inputs = $res->values;
     $item_id = $res->item_id;
     if(!$item_id) return DV::error("Item ID is not valid");
    if($item_id){
      $code = $inputs['code'];  
      if($this->itemCodeInUse($code,$item_id)) return DV::error("Item code $code already in use");    
      $x = saveData($ss,'inv_items',['id'=>$item_id],$inputs,[],0);
      return DV::success(); 
    }
    else return DV::error("Failed to update item information");
    
  }

   //Update item's name, code, description, group_id 
   function updateItemInfo($ss,$d){
    $branch_id = $ss->branch_id;
    $valiate_rule = [
      'item_id'=>'1|identity=1',
      'name'=>'1|string|1-100',
      'code'=>'1|string|text=Item code is required',
      'description'=>'0|string|1-150',
      'group_id'=>'1|positive|Item group is required'
      ];

     $res = validateObject($d,$valiate_rule,true,[],$ss->lang,false,null);
     if($res->error) return DV::error($res->error); 
     $inputs = $res->values;
     $item_id = $res->item_id;
     if(!$item_id) return DV::error("Item ID is not valid");
    if($item_id){
      $code = $inputs['code'];  
      if($this->itemCodeInUse($code,$item_id)) return DV::error("Item code $code already in use");    
      $x = saveData($ss,'inv_items',['id'=>$item_id],$inputs,[],0);
      return DV::success(); 
    }
    else return DV::error("Failed to update item information");
  }

   //Update item's selling price (wholesale price & retail price), cost
   function updateItemPrices($ss,$d){
      $branch_id = $ss->branch_id;
      $valiate_rule = [
        'item_id'=>'1|identity=1',
        'ws_selling_price'=>'0|number',
        'selling_price'=>'0|number',
        'cost'=>'0|number'
        ];
       $res = validateObject($d,$valiate_rule,true,[],$ss->lang,false,null);
       if($res->error) return DV::error($res->error); 
       $inputs = $res->values;
       $item_id = $res->item_id;
       if(!$item_id) return DV::error("Item ID is not valid");
      if($item_id){
        $x = saveData($ss,'inv_items',['id'=>$item_id],$inputs,[],0);
        return DV::success(); 
      }
      else return DV::error("Failed to update item cost and prices");
      
   }

    //Update item's SKU and do unit conversion for item available in stock
    function updateItemSKU($ss,$d){
        $branch_id = $ss->branch_id;
        $valiate_rule = [
          'item_id'=>'1|identity=1',
          'sku'=>'0|exists=inv_units.name|text=The given SKU is not correct'
          ];
         $res = validateObject($d,$valiate_rule,true,[],$ss->lang,false,null);
         if($res->error) return DV::error($res->error); 
         $inputs = $res->values;
         $item_id = $res->item_id;
         if(!$item_id) return DV::error("Item ID is not valid");
        if($item_id){
          $x = saveData($ss,'inv_items',['id'=>$item_id],$inputs,[],0);
          return DV::success(); 
        }
        else return DV::error("Failed to update item SKU");
        
     }
 
}

?>