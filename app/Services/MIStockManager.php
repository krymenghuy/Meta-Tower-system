<?php
namespace App\Services;
use App\Events\QTYChanged;
use DB;
use App\Models\DV;
use App\Models\Inventory\Item;
//use App\Models\Inventory\StockUnit;
use App\Models\Inventory\StockLog;

class MIStockManager {
 
    protected static $item_class ="MI";
    function __construct(){
        return;
    } 
     
    function validateItems($items=[]){
      $new_items = [];
      foreach($items as $x){
        $x_item = (object)$x;
        $item_id = isset($x_item->id)?$x_item->id:$x_item->item_id;
        $itemInfo = $this->getItemInfo($item_id);
        if(!$itemInfo) return (object)['items'=>[],"error"=>"Invalid item ID $item_id"];
        if(!isset($x->stock_class) || !$x->stock_class){
          $x->stock_class = isset($x->stockclass_code)?$x->stockclass_code:null;
          if(!$x->stock_class) return (object)['items'=>[],"error"=>"Stock Class is not valid for item ID $item_id"];
        }
        //$uom = isset($x_item->uom)?$x_item->uom:null;
        //IMPORTANT NOTE: we currently use "detault_uom" or inv_items.default_uom for standard stock keeping unit UOM for daily_stock_summary
        $uom = $itemInfo->default_uom;  
        $item = new Item($item_id,null);
        //$qty_convert = $this->convertUOM($item_id,$item->qty,$item->uom,$stock_item->$uom);
        if(!$item->validateUOM($uom)) {
           return (object)["error"=>($uom?$uom:"Empty")." is not a valid purchase UOM for item $item_id","items"=>[]];
        }
        //used on the default_uom, get cost per default_uom (Purchase Context)
        $costInfo = $item->getCostInfoByUOM($uom);
        $x->id = $itemInfo->id;
        //$x->stock_class ="" //user have to input stock_class
        $x->code = $itemInfo->code;
        $x->cost = $costInfo->cost;
        $x->uom = $costInfo->uom;
        $x->name = $itemInfo->name;
        $x->group_id = $itemInfo->group_id;
        $x->category_id = $itemInfo->category_id;
        $x->category= $itemInfo->category;
        $x->group_name = $itemInfo->group_name;
        $new_items[] = $x;
      }
      return (object)["error"=>null,"items"=>$new_items];
    }

    function getItemInfo($item_id){
      return DB::table("inv_items as i")->join("inv_item_groups as g","g.id","=","i.group_id")->where("i.id",$item_id)->selectRaw("i.id,g.category_id,i.code,i.name,i.default_uom,i.group_id,g.name AS group_name, (SELECT `name` FROM inv_categories as c WHERE c.id =g.category_id LIMIT 1) AS category")->get()->first();
    }

    static function createSKU($branch_id,$item_id=null,$expiration_date = null,$group_name=null,$category=null){
        if(!$group_name && !$category){
            $c = self::getItemInfo($item_id);
            $group_name = $c->group_name;
            $category = $c->category;
        }
        // Generate a random unique identifier
        $unique_id = uniqid();
        
        // If no expiration date is provided, use the current timestamp
        if (empty($expiration_date)) {
            $expiration_date = date('ymdHis');
        } else {
            // Format the expiration date as a string without separators
            $expiration_date = date('ymd', strtotime($expiration_date));
        }

        // Combine the product group name, category, and expiration date (or unique ID if no expiration date)
        $sku = strtoupper(substr($group_name, 0, 3)) . '-' . strtoupper(substr($category, 0, 4)) . '-' . strtoupper($expiration_date) . '-' . strtoupper(substr($unique_id, -3));
        
        // Check if SKU already exists in the database
        $sku_exists = self::SKUExists($branch_id,$sku);
        
        // If the SKU already exists, generate a new SKU recursively
        if ($sku_exists) {
            $sku = self::createSKU($branch_id,null, $expiration_date,$group_name, $category);
        }
        return $sku;
  }

  static function SKUExists($branch_id,$sku) {
     return DB::table("inv_item_sku as k")->where('k.branch_id',$branch_id)->where('sku',$sku)->select("item_id")->take(1)->exists();
  }

   //Receive PO items and increase Inventory items  
    function receiveVPO($data,$ss){
        $branch_id = $ss->branch_id;
        $validate_rule = [
            "type"=>"1|choice|MI,RM,FG",
            "warehouse_id"=>"1|number|default=1|exists=warehouses.id|default=1|text=Warehouse identity does not exist",
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
        $x_res= $this->validateItems($items);
        if($x_res->error) return DV::error($x_res->error);
        $items = $x_res->items;

        $trx_date = convertDate($inputs['trx_date']);
        if($trx_date > date('Y-m-d')) return DV::error('Transaction date cannot be later than today');
        if(!(bool)strtotime($trx_date)) $trx_date = getNowTime();

        //before it was called "stockclass_code", not "stock_class"
        //$default_stock_class = $inputs['stock_class'];
        $warehouse_id = $inputs["warehouse_id"]; //default to 1

        if(!(bool)strtotime($trx_date)) $trx_date = $inputs['trx_date'];
        //return DV::result($items); 
        $item= null;
        $i =0;
        $success_items = [];
        $success_count=0;
        //$errors = [];
        do{
            if(!isset($items[$i])) break;
                 $item = $items[$i];
                 //$uom = $item->uom;
                 
                //begin:: task to process each $item in $items array
                  $item_id = isset($item->id)?$item->id:null;
                  $trx_id =0;
                            $item_id = $item->id;
                            //Expiration is input by user on Item View
                            $expiration_date = isset($item->expiration_date)?$item->expiration_date:null;
                            $new_sku = self::createSKU($branch_id,$item_id,$expiration_date,$item->group_name,$item->category);
                            //$stock_item = $this->getStockRecord($branch_id,$warehouse_id,$stockclass_code,$item_id,$trx_date);
                            $input_item = ['id'=>$item->id,'sku'=>$new_sku,'code'=>$item->code,'uom'=>$item->uom,'purchase_qty'=>$item->qty];
                            //NOTE: Item::prepareDailyStockRecord() will ensure that there is one record in table "inv_daily_stock" for the (item_id,begin_qty,purchase_qty,avail_qty, ...)
                            $stock_class = $item->stock_class;
                            $stock_item = Item::prepareDailyStockRecord($ss,$warehouse_id,$stock_class,$input_item,$trx_date);
                            $update_qty =0;
                            if($stock_item){
                               $trx_id = $stock_item->trx_id; 
                               $uom = $stock_item->uom;
                               $update_qty = $stock_item->purchase_qty + $item->qty; 
                               $x = DB::table('inv_daily_stocks')->where('id',$stock_item->trx_id)->where('branch_id',$branch_id)->where('warehouse_id',$warehouse_id)->where('stockclass_code',$stock_class)->update([
                                  'purchase_qty'=>$update_qty,
                                  'update_uid'=>$ss->user_id,
                                  'updated_at'=>getNowTime(),
                                  'update_user'=>$ss->login_name
                               ]);
                               if(!$x) return DV::error("Failed to udpate daily stock status");
                               $trx_id = $stock_item->trx_id;   
                            }
                            //$item_stockclass = isset($item->stockclass_code)?$item->stockclass_code:$stockclass_code;
                            $success_count++;  
                            $success_items[] = (object)['id'=>$item_id,'code'=>$item->code,'qty'=>$item->qty,'uom'=>$uom,'sku'=>$new_sku,'stock_class'=>$stock_class,'target_qty'=>'purchase_qty'];
                            StockLog::log($ss,['action'=>'receive','qty'=>$item->qty,'uom'=>$uom,'trx_id'=>$trx_id,'sku'=>$new_sku]);
                      
               
                //end:: task to process each $item in $items array
            $i++;
        }while($item);
        if ($success_count===0) return DV::error("0 items were received in the purchase order");
        QTYChanged::dispatch(['user'=>$ss,'target_qty'=>'purchase_qty','warehouse_id'=>$warehouse_id,'stockclass_code'=>$stock_class,'items'=>$success_items]);
        return DV::success(['data'=>['success_count'=>$success_count,'count'=>$i]]);
    }

    function convertUOM($item_id,$qty,$from_uom,$to_uom){
        if($from_uom === $to_uom){
           return (object)["error"=>null,"qty"=>$qty,"uom"=>$to_uom];
        }else{
           $itemInfo =$this->getItemInfo($item_id);
           $item_name ="product item";
           if(!$itemInfo) $item_name = "product ".$itemInfo->name;
           return (object)["error"=>"Problem in converting unit from $from_uom to $to_uom for ".$item_name,"qty"=>$qty,"uom"=>$to_uom];
        }
    }

    /**
     * getGroupList() for stock tracking purpose.
     * for stock tracking purpose, we display groups with at least one child item (or product variance) in it
     * **/
    function getGroupList($data,$ss) { 
        $branch_id = $ss->branch_id;
        $warehouse_id =isset($data['warehouse_id'])?$data['warehouse_id']:1;
        //throw new \Exception("warrehouse = $warehouse_id");
        $stock_class =isset($data['stock_class'])?$data['stock_class']:null;
        //if(!$stock_class) $stock_class =isset($data['stock_class_code'])?$data['stock_class_code']:null;
        if(!$stock_class) $stock_class =isset($data['stockclass_code'])?$data['stockclass_code']:null;

        $search_value =isset($data['search_value'])?$data['search_value']:null;
        $group_id = isset($data['group_id'])?$data['group_id']:null;
        $country_id =isset( $data['country_id'])? $data['country_id']:null;
        $category_id = isset($data['category_id'])?$data['category_id']:null;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
          $search_value = escape_like_str($search_value);
          $str_search ="(g.code ='$search_value' OR g.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%' OR g.id = (select group_id FROM inv_items where code ='$search_value' OR `name` LIKE '%$search_value%' LIMIT 1))";
        }
        if ($group_id > 0) $str_moreWhere .=" AND g.id =$group_id";
        if($category_id > 0) $str_moreWhere .=" AND g.category_id =$category_id";
        if($country_id > 0)  $str_moreWhere .= " AND i.made_in_country_id =$country_id";
        //order by group_name
        $rows = DB::table('inv_item_groups as g')->join('inv_categories as c','c.id','=','g.category_id')->whereRaw("has_child(g.id)=1")->where('g.branch_id',$branch_id)->where("c.item_class",self::$item_class)->whereRaw($str_moreWhere)->whereRaw($str_search)->selectRaw("g.id,'Product' AS item_type,g.code,g.name,g.description, g.sku,g.category_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,g.create_user, 0 AS qty, NULL AS last_updated,formatDate(g.created_at) as created_at")->orderByRaw("g.name ASC")->get();
        foreach($rows as $row){
           $e = $this->getLastQty_group($warehouse_id,$row->id,$stock_class);
           $row->qty =$e->qty;
           $row->uom = $e->uom;
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
    function getItemsByGroup($data,$ss) { 
        $branch_id = $ss->branch_id;
        $warehouse_id = isset($data['warehouse_id'])? $data['warehouse_id']:1;
        $group_id = $data['group_id'];
        $stock_class = isset($data['stock_class'])?$data['stock_class']:null;
        if(!$stock_class)  $stock_class = isset($data['stockclass_code'])?$data['stockclass_code']:null;
        //$str_warehouse = "1=1";
        //if($warehouse_id>0) $str_warehouse="g.warehouse_id =$warehouse_id";
        //if(!$stock_class) $stock_class = isset($data['stock_class_code'])?$data['stock_class_code']:null;
        $rows =  DB::table('inv_items as i')->join('inv_item_groups as g','g.id','=','i.group_id')->join('inv_categories as c','c.id','=','g.category_id')->where('g.id',$group_id)->where('c.item_class',self::$item_class)->where('i.branch_id',$branch_id)->selectRaw("i.id,'Product' AS item_type,i.code,g.code as group_code,i.name,i.description,g.name as group_name,g.id as group_id,g.description as group_description, g.category_id, i.manufacturer_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,i.create_user,formatDate(i.created_at) as created_at")->orderByRaw("i.name ASC")->get();
        foreach($rows as $row){
            $e = $this->getLastQty($warehouse_id,$row->id,$stock_class); 
            $row->qty =$e->qty;
            $row->uom =$e->uom;
            $row->last_updated = $e->last_updated; 
        }
        return $rows;
    }

    function getLastQty_group($warehouse_id,$group_id,$stock_class=null){
        //$str_stockclass ="1=1";
        $def_uom ="pcs";
        //if($stock_class) $str_stockclass ="c.stockclass_code ='$stock_class'";
        $empty_result = (object)['qty'=>0,"uom"=>$def_uom,'last_updated'=>null];
        //If no warehouse is selected return zero. todo: later consider showing qty for all warehouses in this case
        if(!$warehouse_id) return $empty_result;
        $rows = [];
        if($stock_class) 
        {
               $row = DB::table('inv_current_stocks as c')->join('inv_items as i','i.id','=','c.item_id')->where('i.group_id',$group_id)->where('c.warehouse_id',$warehouse_id)->where('c.stockclass_code',$stock_class)->selectRaw("c.qty as qty,c.uom,c.created_at as last_updated")->orderBy('c.id','DESC')->take(1)->get()->first();
               if(!$row) $row = (object)["uom"=>$def_uom,"qty"=>0,"last_updated"=>""]; 
               return (object)[
                        'qty'=>$row->qty,
                        'uom'=>$row->uom,
                        'last_updated'=>date('d M Y',strtotime($row->last_updated))
                      ];
                 
        }
        else{
            $rows = DB::table('inv_current_stocks as c')->join('inv_items as i','i.id','=','c.item_id')->where('i.group_id',$group_id)->where('c.warehouse_id',$warehouse_id)->selectRaw("c.qty,c.uom,c.created_at as last_updated")->orderBy('c.id','DESC')->get();
            $last_date =null;
            $cnt =0;
            $qty =0;
            $uom ="";
            foreach($rows as $row){
              if($cnt ===0) $last_date = $row->last_updated;
              $qty +=$row->qty;
              $uom = $row->uom;
              $cnt++;
            }
            return (object)[
               'qty'=>$qty,
               'uom'=>$uom,
               'last_updated'=>$last_date? date('d M Y',strtotime($last_date)) : null
           ];
        }    
        return $empty_result;
      }

   function getLastQty($warehouse_id,$item_id,$stock_class=null){
     //$str_stockclass ="1=1";
     $def_uom ="pcs";
     //if($stock_class) $str_stockclass ="c.stockclass_code ='$stock_class'";
     $empty_result = (object)['qty'=>0,"uom"=>$def_uom,'last_updated'=>null];
     //If no warehouse is selected return zero. todo: later consider showing qty for all warehouses in this case
     if(!$warehouse_id) return $empty_result;
     $rows = [];
   
     if($stock_class) 
     {
            $row = DB::table('inv_current_stocks as c')->where('c.item_id',$item_id)->where('c.warehouse_id',$warehouse_id)->where('stockclass_code',$stock_class)->selectRaw("c.qty as qty,c.uom,c.created_at as last_updated")->orderBy('c.id','DESC')->take(1)->get()->first();
           if($row) 
            return (object)[
                'qty'=>$row->qty,
                'uom'=>$row->uom,
                'last_updated'=>date('d M Y',strtotime($row->last_updated))
            ];
           else return (object)["qty"=>0,"uom"=>$def_uom,'last_updated'=>""]; 
     }
     else{
       
         $rows = DB::table('inv_current_stocks as c')->where('c.item_id',$item_id)->where('c.warehouse_id',$warehouse_id)->selectRaw("c.qty,c.uom, c.created_at as last_updated")->orderBy('c.id','DESC')->get();
         $last_date =null;
         $cnt =0;
         $qty =0;
         $uom ="";
         foreach($rows as $row){
           if($cnt ===0) $last_date = $row->last_updated;
           $qty +=$row->qty;
           $uom = $row->uom;
           $cnt++;
         }
         return (object)[
            'qty'=>$qty,
            'uom'=>$uom,
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

  //  //Update item's selling price (wholesale price & retail price), cost
  //  function updateItemPrices($ss,$d){
  //     $branch_id = $ss->branch_id;
  //     $valiate_rule = [
  //       'item_id'=>'1|identity=1',
  //       'priceInfo'=>'0|array',
  //       'cost'=>'0|number',
  //       'cost'=>'0|number'
  //       ];
  //      $res = validateObject($d,$valiate_rule,true,[],$ss->lang,false,null);
  //      if($res->error) return DV::error($res->error); 
  //      $inputs = $res->values;
  //      $item_id = $res->item_id;
  //      if(!$item_id) return DV::error("Item ID is not valid");
  //     if($item_id){
  //       $x = saveData($ss,'inv_items',['id'=>$item_id],$inputs,[],0);
  //       return DV::success(); 
  //     }
  //     else return DV::error("Failed to update item cost and prices");
      
  //  }

    // //Update item's SKU and do unit conversion for item available in stock
    // function updateItemUOM($ss,$d){
    //     //$branch_id = $ss->branch_id;
    //     $valiate_rule = [
    //       'item_id'=>'1|identity=1',
    //       'uom'=>'0|exists=inv_units.uom|text=The given UOM is not correct'
    //       ];
    //      $res = validateObject($d,$valiate_rule,true,[],$ss->lang,false,null);
    //      if($res->error) return DV::error($res->error); 
    //      $inputs = $res->values;
    //      $item_id = $res->item_id;
    //      if(!$item_id) return DV::error("Item ID is not valid");
    //     if($item_id){
    //       $x = saveData($ss,'inv_units',['id'=>$item_id],$inputs,[],true);
    //       return DV::success(); 
    //     }
    //     else return DV::error("Failed to update item UOM");
        
    //  }
 
}

?>