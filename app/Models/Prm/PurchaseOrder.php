<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;

class PurchaseOrder //extends Model
{
    protected $id = null;
    protected $userInfo  = null;
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
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
          "vendor_id"=>"0|number|exists=vendors.id",//supplyer_id
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
                          StockLog::log($ss,['action'=>'receive','qty'=>$item->qty,'uom'=>$uom,'trx_id'=>$trx_id,'sku'=>$new_sku],'inv');


              //end:: task to process each $item in $items array
          $i++;
      }while($item);
      if ($success_count===0) return DV::error("0 items were received in the purchase order");
      QTYChanged::dispatch(['user'=>$ss,'target_qty'=>'purchase_qty','warehouse_id'=>$warehouse_id,'stockclass_code'=>$stock_class,'items'=>$success_items]);
      return DV::success(['data'=>['success_count'=>$success_count,'count'=>$i]]);
  }
 function savePurchaseOrder($arr=[], $id = null, $ss = null) {

    $ss = $ss ?? $this->userInfo;
    $branch_id = $ss->branch_id;

    $v_rule = [
        "vendor_id" => "1|number|exists=vendors.id|Vendor identity is not correct",
        "po_number" => "0|string|0-50",
        "po_date" => "0|timestamp",
        "remarks" => "0|string|1-255",
        "items" => "1|array"
    ];
    $po_number = ['-', '_', '.', '#'];
    $res = DBX::validateObject($arr, $v_rule, 1, ['po_number' => $po_number], $ss->lang, false, null);
    if ($res->error) return DV::error($res->error);
    $inputs = $res->values; 
    $items = $inputs['items'];
    $po_date = convertDate($inputs['po_date']);
    if ($po_date > date('Y-m-d')) return DV::error('PO date cannot be later than today');
    if (!(bool)strtotime($po_date)) $po_date = getNowTime();


    $item= null;
    $i =0;
    $success_items = [];
    $success_count=0;
   do{
            if(!isset($items[$i])) break;
                 $item = $items[$i];
                 //$uom = $item->uom;
                //** item requirement [item_id,expiration_date,group_name,category,]
                //begin:: task to process each $item in $items array
                  $item_id = isset($item->id)?$item->id:($item->item_id ? $item->item_id :null);
                  $trx_id =0;
                  $defaulCost = DB::table('inv_item_costs')->where('item_id',$item_id)->take(1)->value('cost');
                  $item_cost = isset($item->cost)?$item->cost:$defaulCost;
                  $item->cost = $item_cost;
                //** Valid Qty */
                $validQty = self::validPOQty($po_id,[
                    'item_id' => $item_id,
                    'qty' => $item->qty,
                    'remarks' => isset($item->remarks)?$item->remarks:null,
                    'expire_date' => isset($item->expire_date)?$item->expire_date:null
                ],$ss);
                if($validQty->status_code !=200) return DV::error($validQty->error_message);

                //** if accepted item == purchase qty then skip that row */
                if($validQty->to_skip->item_id != $item_id){
                   //   $item_id = $item->id;
                  //Expiration is input by user on Item View
                  $expiration_date = isset($item->expiration_date)?$item->expiration_date:null;
                  $new_sku = self::createSKU($branch_id,$item_id,$expiration_date,$item->group_name,$item->category);
                  //$stock_item = $this->getStockRecord($branch_id,$warehouse_id,$stock_class,$item_id,$trx_date);

                  $input_item = ['id'=>$item->id,'sku'=>$new_sku,'code'=>$item->code,'uom'=>$item->uom,'purchase_qty'=>$item->qty];
                  //NOTE: Item::prepareDailyStockRecord() will ensure that there is one record in table "inv_daily_stock" for the (item_id,begin_qty,purchase_qty,avail_qty, ...)
                  $stock_class = isset($item->stock_class)?$item->stock_class:$inputs['stock_class'];
                  $stock_item = Item::prepareDailyStockRecord($ss,$warehouse_id,$stock_class,$input_item,$trx_date);
                  $update_qty =0;
                  if($stock_item){
                    $stock_item->qty = $item->qty;
                    $stock_item->cost = $item_cost;
                    $stock_item->expire_date = $item->expiration_date;
                    $x = self::updateStock($ss,$warehouse_id,$stock_item,'purchased_qty',$trx_date);
                      $trx_id = $stock_item->trx_id;
                      $uom = $stock_item->uom;
                    //   $update_qty = $stock_item->purchased_qty + $item->qty;
                    //   $update_ending_qty = $stock_item->ending_qty + $item->qty;
                    //   $x = DB::table(self::$daily_stock_table)->where('id',$stock_item->trx_id)->where('branch_id',$branch_id)->where('warehouse_id',$warehouse_id)->where('stock_class',$stock_class)->update([
                    //     'purchased_qty'=>$update_qty,
                    //     'update_uid'=>$ss->user_id,
                    //     'updated_at'=>getNowTime(),
                    //     'ending_qty' => $update_ending_qty,
                    //     'update_user'=>$ss->login_name
                    //   ]);
                      if($x->status === 'Error') return DV::error("Failed to udpate daily stock status");
                    //   $trx_id = $stock_item->trx_id;
                  }
                  //$item_stockclass = isset($item->stock_class)?$item->stock_class:$stock_class;
                  $success_count++;
                  $success_items[] = (object)['id'=>$item_id,'code'=>$item->code,'qty'=>$item->qty,'uom'=>$uom,'sku'=>$new_sku,'stock_class'=>$stock_class,'target_qty'=>'purchase_qty'];
                  StockLog::log($ss,['action'=>'receive','qty'=>$item->qty,'uom'=>$uom,'trx_id'=>$trx_id,'sku'=>$new_sku]);
                }
                //end:: task to process each $item in $items array
            $i++;

        }while($item);

        if ($success_count===0) {
           DBX::saveData($ss,self::$po_table,['id' => $po_id],['status_id' => 3],[],1);
            return DV::error("All items were received in the purchase order");
        }
        QTYChanged::dispatch(['user'=>$ss,'target_qty'=>'purchase_qty','warehouse_id'=>$warehouse_id,'stock_class'=>$stock_class,'items'=>$success_items]);
        return DV::success(['data'=>['success_count'=>$success_count,'count'=>$i,'success'=>$success_items],'message'=>$validQty->skip_row_msg]);
}
 static function validPOQty($po_id,$arr,$ss){
        $d = (object)$arr;
        $item_id = $d->item_id;
        $qty = $d->qty;
        $to_skip = (object)['item_id'=>0];
        $skip_count = 0;
        $skip_msg = null;
        $row = DB::table('purchase_orders_mi')->where('id',$po_id)->first();
        $items = DB::table('po_items_mi')->selectRaw('id,item_id,price,uom,po_id,qty,ifnull(accepted_qty,0) as accepted_qty,update_user,ifnull(delivered_qty,0) as delivered_qty,ifnull(rejected_qty,0) as rejected_qty')->get();
        // foreach($rows as $row){
        if($row){
            $poItem = self::getPOItemsMIInfo($items,$po_id,$item_id);
            if($poItem->error) return DV::error($poItem->message);
            $poQTY = $poItem->qty;
            $accepted_qty = $poItem->accepted_qty;
            $validQty = $poQTY>=$accepted_qty ? ($poQTY-$accepted_qty) : ($accepted_qty-$poItem);

            // $validQty = $poQTY - $accepted_qty - $poItem->delivered_qty - $poItem->rejected_qty;
            if($validQty == 0){
                $skip_msg = 'Cannot change remarks on full purchased order item quantity received';
                $skip_count ++;
                $to_skip = (object)['item_id' => $poItem->item_id];
                // continue;
            }
            if($qty > $validQty){
                $xitem = Item::getProps($item_id,'code,name') ?? (object)['name'=>''];
                $msg = $validQty>0? $xitem->name.' was already received '.$accepted_qty.' item'.($accepted_qty>1?'s':'').'. There '.($validQty>1?'are ':'is ').$validQty.' less'
                :'Receving qty must be equal or less than order qty on '.$xitem->name;
                return DV::error($msg);
            }
            if($poItem->id>0){
               DBX::saveData($ss,'po_items_mi',['id' => $poItem->id],[
                    'accepted_qty' => $accepted_qty+$qty,
                    'remarks' => isset($d->remarks)?$d->remarks:null,
                    'expire_date' => $d->expire_date
                ],[],1);
                if($qty == $validQty){
                    $ud =DBX::saveData($ss,self::$po_table,['id' => $po_id],['status_id' => 3],[],1);
                }
            }
        }
        if(count($items) == $skip_count) {
            //* update Po status
            $ud =DBX::saveData($ss,self::$po_table,['id' => $po_id],['status_id' => 3],[],1);
            return DV::error('All items were received, also remarks can not be changed');
        }
        return DV::success(['skip_row_msg'=>$skip_msg,'to_skip'=>$to_skip]);
    }

 static function savePoOrderItem($ss, $po_id, $item, $id) {

   
    $item = is_object($item) ? $item : (object)$item;

    // Calculate total price if not provided
    $total_price = $item->total ?? ($item->qty * ($item->unit_price ?? 0));

    $inputs = [
        "po_id" => $po_id,
        "item_id" => $item->item_id ?? $item->id ?? null,
        "qty" => $item->qty ?? 0,
        "unit" => $item->unit ?? null,
        "unit_price" => $item->unit_price ?? 0,
        "total_price" => $total_price,
    ];

    $saved_id = DBX::saveData($ss, 'purchase_order_items', ['id' => $id], $inputs, [], 1, false);

    if ($saved_id > 0) {
        $inputs['id'] = $saved_id;
        return (object)$inputs;
    }

    return null; // Failed to save
}


static function getProps($id,$cols = 'id,code,name'){
      return DB::table('items as i')->where('i.id',$id)->selectRaw($cols)->first();
    }
}
