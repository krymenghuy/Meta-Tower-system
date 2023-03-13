<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;

//Vendor Purchase Order => Purchase Order made to vendor
class VPO extends Model
{
    use HasFactory;

    protected static $validate_rule = [
        'id'=>'0|identity=1',
        'issue_date'=>'1|date',
        'vendor_id'=>'1|exists=vendors.id',
        'remarks'=>'0|string',
        'items'=>'1|array'
    ];
    protected static $general_error ="Something ";
    protected static $table ="inv_po";
    protected static $items_table ="inv_po_items";

    static function handleGeneralError($method_name=null,$status_code=null){
       return DV::error("There was general error");
    }

    //create PO to Vendor
    static function createPO($ss,$d){
       $branch_id = $ss->branch_id;
       $v_unique = [];
       $res = validateObject($d,self::$validate_rule,true,[],$ss->lang,false,$v_unique);
       if($res->error) return DV::error($res->error);
       $inputs = $res->values;
       $items = $inputs['items'];
       unset($inputs['items']);
       //$id = $res->id;
       $id = saveData($ss,self::$table,['id'=>0],$inputs,[],1);
       if($id){
            $m = self::createPOItems($ss,$id,$items);
       }
       return self::handleGeneralError('createPO');
    }

    static function deletePO($ss,$id){
       $branch_id = $ss->branch_id;
       DB::table(self::$items_table)->where('po_id',$id)->where('branch_id',$branch_id)->delete(); 
       DB::table(self::$table)->where('id',$id)->where('branch_id',$branch_id)->delete();
       return DV::success();
    }

    static function createPOItems($ss,$id,$items){
        $branch_id = $ss->branch_id;
       DB::table(self::$items_table)->where('po_id',$id)->where('branch_id',$branch_id)->delete();  
       $success_cnt = 0;
       foreach($items as $item){
          $inputs = [
            'item_id'=>$item['item_id'],
            'qty'=>$item['qty'],
            'sku'=>$item['sku'],
            'description'=>$item['description'],
            'price'=>$item['price'],
            'discount'=>$item['discount'],
            'discount_in_percent'=>$item['discount_in_percent'] 
          ];
          $new_id = saveData($ss,self::$items_table,['id'=>0],$inputs,[],1);
          if($new_id){
            $success_cnt++;
          }
       }
        return DV::success(['data'=>['success_count'=>$success_cnt]]);
    }

    //$d = {search_value,vendor_id,start_date,end_date}
    static function list($ss,$d){
       $str_search ="1=1";
       $search_value = isset($d['search_value'])?$d['search_value']:null;
       $start_date = isset($d['start_date'])?$d['start_date']:null;
       $end_date = isset($d['end_date'])?$d['end_date']:null;
       $vendor_id = isset($d['vendor_id'])?$d['vendor_id']:null;
       if($search_value) $str_search .="(v.phone_number ='$search_value' OR v.name LIKE '%$search_value%')";
       if($vendor_id>0) $str_search .= "v.id = $vendor_id";

       $cols = ['po.id'];
       return DB::table(self::$table." as po")->join('vendors as v','v.id','po.vendor_id')->where($str_search)->where('branch_id',$branch_id)->select($cols)->orderBy('po.id','DESC')->get();
    }
}
