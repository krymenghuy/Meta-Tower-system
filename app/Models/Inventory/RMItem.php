<?php

namespace App\Models\Inventory;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use DB;
 
class RMItem //extends Model
{
   //use HasFactory;
   //  protected $table = 'inv_items';
   //  protected $guarded = ['id'];
   //  protected $fillable =[]; // ['id','name','first_name','last_name','sex','date_of_birth','nationality_id','cp_name','cp_phone_number'];
      
   //  protected $primaryKey = 'id';
   //  public $incrementing = true;
   //  //protected $keyType = 'string';
   //  public $timestamps = true;
   //  protected $dateFormat = 'Y-m-d';

    //merchandising item class 'RM' for Raw Material
    protected static $item_class ='RM';
    protected $id = null;
    protected $userInfo = null;

    function __construct($id =null, $userInfo=null){
       $this->id = $id;
       $this->userInfo = $userInfo;
    }

    function getId(){
      return $this->id;
    }
    function getUserInfo(){
      return $this->userInfo;
    }
    function uniqid(){
      $branch_id = Session('branch_id',random_int()); 
      return uniqid($branch_id);
    }
    function save($d = [], $ss = null) { 
      $ss = $ss?$ss:$this->getUserInfo();
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
      
      $res = validateObject($d,$validate_rule,true,[],$ss->lang,false,$check_unique);
      if($res->error) return DV::error($res->error);
      $inputs =$res->values;
      $id = $res->id;
      
      //$unit_id = $inputs['unit_id'];
      //$unit = StockUnit::info($unit_id);
      //if (!$unit) return DV::error("Unit ID id not valid. There is no valid SKU found!");
      //$inputs['sku'] = $unit->name;
      
      $group_id = $inputs['group_id'];
      $category_id = $inputs['category_id'];
      $detail_type_id = $inputs['detail_type_id'];
      unset($inputs['category_id']);
      unset($inputs['detail_type_id']);
      
      $item_created = false;
      if (!$id) $item_created = true;

      $inputs['item_class'] = self::$item_class;
      $id = saveData($ss,'inv_items',['id'=>$id],$inputs,[],1);
      if($id > 0){
        if ($item_created) $new_code = setOfficialCode($branch_id,'inv_item_code_control','inv_items',['id'=>$id],$def_prefix,$def_code_length);
        if($category_id>0) saveData($ss,'inv_item_groups',['id'=>$group_id],['category_id'=>$category_id],[],1);
        if($detail_type_id>0) saveData($ss,'inv_item_groups',['id'=>$group_id],['detail_type_id'=>$detail_type_id],[],1);
        return DV::success(['id'=>$id]);
      }
      else return DV::error("Something went wrong during saving inventory item");
    }
    
    static function list($d,$ss) { 
      //$ss = $ss?$ss:$this->getUserInfo();
      $branch_id = $ss->branch_id;
      $search_value =isset($d['search_value'])?$d['search_value']:null;
      $group_id = isset($d['group_id'])?$d['group_id']:null;
      $country_id = isset($d['country_id'])?$d['country_id']:null;
      $category_id = isset($d['category_id'])?$d['category_id']:null;

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
      return DB::table('inv_items as i')->join('inv_item_groups as g','g.id','=','i.group_id')->join('inv_categories as c','c.id','=','g.category_id')->where('i.branch_id',$branch_id)->whereRaw($str_moreWhere)->where('i.item_class',self::$item_class)->whereRaw($str_search)->selectRaw("i.id,'Product' AS item_type,i.code,g.code as group_code,i.name,i.description,i.unit_id, i.sku,g.unit_id AS group_unit_id,g.sku AS group_sku,g.name as group_name,g.id as group_id,g.description as group_description, g.category_id, i.manufacturer_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,i.create_user,formatDate(i.created_at) as created_at")->orderByRaw("g.name ASC,i.code ASC")->get();   
  }

    static function info($id,$byCode=false,$branch_id=null){
       $cols = "i.id,i.code,i.name,i.description,i.sku,i.unit_id,i.group_id,g.name AS group_name,g.category_id,i.cost,i.ws_selling_price,i.selling_price,i.sales_tax_rate"; 
       $rows = [];
       if($byCode){
         //if search item by code, user must supply $branch_id
         if(!$branch_id) return null;
         $rows = DB::table("inv_items as i")->join('inv_item_groups AS g','g.id','=','i.group_id')->where("i.code",$id)->where('i.branch_id',$branch_id)->selectRaw($cols)->take(1)->get();
       }
       else
         $rows = DB::table("inv_items as i")->join('inv_item_groups AS g','g.id','=','i.group_id')->where("i.id",$id)->selectRaw($cols)->take(1)->get();
       return isset($rows[0])?$rows[0]:null;    
    }

    //similar to ::info() but it gives more detailed info about an item
    static function details($id){
        $cols = "i.id,g.id AS group_id,i.name,i.description,i.sku,i.unit_id,g.unit_id as group_uint_id,g.sku as group_ask, g.name as group_name,g.category_id,i.selling_price,i.ws_selling_price,i.cost"; 
        $rows = DB::table("inv_items as i")->join('inv_item_groups as g','g.id','=','i.group_id')->where("i.id",$id)->selectRaw($cols)->take(1)->get();
        return isset($rows[0])?$rows[0]:null;    
     }
    
    function getDetails($id=null,$ss = null){
      $id = $id?$id:$this->getId();
      $ss = $ss?$ss:$this->getUserInfo();
      return self::details($id);
    }

    function delete($id=null,$ss=null){
      $id = $id?$id:$this->getId();
      $ss = $ss?$ss:$this->getUserInfo();
      DB::table('inv_daily_stocks')->where('item_id',$id)->delete();
      DB::table('inv_current_stocks')->where('item_id',$id)->delete();
      DB::table('inv_items')->where('id',$id)->delete();
      return DV::success();
    }

    //return Integer Qty
    function getBeginQty($warehouse_id,$stock_class,$date=null){
       $id = $this->getId();
       return self::beginQty($warehouse_id,$stock_class,$id,false,$date);
    } 

    function getEndingQty($warehouse_id,$stock_class,$date=null){
      $id = $this->getId();
      return self::endingQty($warehouse_id,$stock_class,$id,false,$date);
    } 

     //beginningQty()
     static function beginQty($warehouse_id,$stock_class,$id,$byCode=false,$date=null){
          $today = date('Y-m-d');
         $str_where ="i.id =".($id?$id:0);
         if($byCode || $byCode===1) $str_where ="i.code ='$id'";  
         $begin_qty =0;
         
         $str_class = "1=1";
         if($stock_class) $str_class ="d.stockclass_code ='$stock_class'";
         if((bool)strtotime($date)){
            $rows = DB::table("inv_daily_stocks as d")->join("inv_items as i",'i.id','=','d.item_id')->whereRaw($str_where)->whereRaw("DATE(d.trx_date) ='$date'")->where('d.warehouse_id',$warehouse_id)->whereRaw($str_class)->selectRaw('d.begin_qty,d.purchase_qty,d.sold_qty,d.customer_return_qty,d.vendor_return_qty,d.adjust_qty,d.trx_date')->take(1)->get();     
            return isset($rows[0])?$rows[0]->begin_qty:0;
         }

         $rows = DB::table("inv_daily_stocks as d")->join("inv_items as i",'i.id','=','d.item_id')->whereRaw($str_where)->where('d.warehouse_id',$warehouse_id)->whereRaw($str_class)->selectRaw('d.begin_qty,d.purchase_qty,d.sold_qty,d.customer_return_qty,d.vendor_return_qty,d.adjust_qty,d.trx_date')->orderByRaw("d.trx_date DESC")->take(1)->get();
         foreach($rows as $row){
             $trx_date = convertDate($row->trx_date);
             if($trx_date < $today){
                 $begin_qty = $row->begin_qty + $row->purchase_qty - $row->sold_qty -$row->vendor_return_qty + $row->customer_return_qty + $row->adjust_qty;  
                 return $begin_qty;
            }else if($trx_date === $today) return $row->begin_qty;
             else return 0;
         }
         return $begin_qty;
     }

     //if parameter $stock_class is not subb
     static function endingQty($warehouse_id,$stock_class,$id,$byCode=false,$date=null){
         $today = date('Y-m-d');
         $str_where ="i.id =$id";
         if($byCode || $byCode===1) $str_where ="i.code ='$id'";  
         $end_qty =0;

         $str_class ="1=1";
         if($stock_class) $str_class ="d.stockclass_code ='$stock_class'";
         if((bool)strtotime($date)){
            $rows = DB::table("inv_daily_stocks as d")->join("inv_items as i",'i.id','=','d.item_id')->whereRaw($str_where)->where('d.warehouse_id',$warehouse_id)->whereRaw($str_class)->whereRaw("DATE(d.trx_date) ='$date'")->selectRaw('SUM(d.begin_qty) AS begin_qty,SUM(d.purchase_qty) AS purchase_qty,SUM(d.sold_qty) AS sold_qty,SUM(d.customer_return_qty) AS customer_return_qty,SUM(d.vendor_return_qty) AS vendor_return_qty, SUM(d.adjust_qty) AS adjust_qty')->get();     
            foreach($rows as $row){
               $end_qty =$row->begin_qty + $row->purchase_qty - $row->sold_qty -$row->vendor_return_qty + $row->customer_return_qty + $row->adjust_qty;
               return $end_qty;
            }
            return self::endingQty($warehouse_id,$stock_class,$id,$byCode,null);
         }else{
            $rows = DB::table("inv_daily_stocks as d")->join("inv_items as i",'i.id','=','d.item_id')->whereRaw($str_where)->where('d.warehouse_id',$warehouse_id)->whereRaw($str_class)->selectRaw('SUM(d.begin_qty) AS begin_qty,SUM(d.purchase_qty) AS purchase_qty,SUM(d.sold_qty) AS sold_qty,SUM(d.customer_return_qty) AS customer_return_qty,SUM(d.vendor_return_qty) AS vendor_return_qty, SUM(d.adjust_qty) AS adjust_qty, DATE(trx_date) AS trx_date')->groupByRaw("trx_date")->orderByRaw("trx_date DESC")->take(1)->get();     
            foreach($rows as $row){
               $end_qty =$row->begin_qty + $row->purchase_qty - $row->sold_qty -$row->vendor_return_qty + $row->customer_return_qty + $row->adjust_qty;
               return $end_qty;
            }
            return $end_qty;
         }
         return $end_qty;
     }

   function getCurrentQty($id=null){
      $id = $id?$id:$this->getId();
      return self::currentQty($id,false);
   }

   //return current quantity of an item. if parameter $byCode =1 then, it will find item by item code  
   static function currentQty($id=0,$byCode=false){
      $str_where ="i.id =$id";
      if($byCode || $byCode===1) $str_where ="i.code ='$id'";  
      $rows = DB::table("inv_current_stocks as c")->join("inv_items as i",'i.id','=','c.item_id')->whereRaw($str_where)->selectRaw("qty")->take(1)->get();
      return isset($rows[0])?$rows[0]->qty:0;  
   }
 
   static function getLatestQty($target_qty_var,$qty=0,$ending_qty=0){
      switch($target_qty_var){
         case 'purchase_qty':{
            return ($ending_qty + $qty); 
            break;
         }
         case 'sold_qty':{
            return ($ending_qty - $qty); 
            break;
         }
         case 'adjust_qty':{
            return ($ending_qty + $qty); 
            break;
         }
         case 'customer_return_qty':{
            return ($ending_qty + $qty); 
            break;
         }
         case 'vendor_return_qty':{
            return ($ending_qty - $qty); 
            break;
         }
         default:{
            return $ending_qty;
            break;
         }
      }
   }

     /*** @params
       $ss is userInfo = {branch_id,user_class,official_id,official_code,login_name,full_name}
       $items = [{id*,code*,sku,qty*,target_qty*}]
      ***/
    static function updateQty_many($ss,$warehouse_id,$stockclass_code,$items){
      $branch_id = $ss->branch_id;
      foreach($items as $item){
         $end_qty =self::endingQty($warehouse_id,$stockclass_code,$item->id,false,null);
         $latest_qty = self::getLatestQty($item->target_qty,$item->qty,$end_qty);
         $item_stockclass = isset($item->stockclass_code)?$item->stockclass_code:$stockclass_code;
         $x =  DB::table("inv_current_stocks")->where("item_id",$item->id)->where("warehouse_id",$warehouse_id)->where("stockclass_code",$item_stockclass)->where('branch_id',$branch_id)->update([
            "qty"=>$end_qty,
            "sku"=>$item->sku,
            "updated_at"=>getNowTime(),
            "update_user"=>$ss->full_name,
            "update_uid"=>$ss->user_id
         ]);

         if (!$x){
               DB::table('inv_current_stocks')->insert([
                    'branch_id'=>$branch_id,
                    'warehouse_id'=>$warehouse_id,
                    'stockclass_code'=>$item_stockclass,
                    'item_id'=>$item->id,
                    'item_code'=>$item->code,
                    'qty'=>$end_qty,
                    'sku'=>$item->sku,
                    "updated_at"=>getNowTime(),
                    "update_user"=>$ss->full_name,
                    "update_uid"=>$ss->user_id
               ]);
               
         }
      }
      
      return false;
    } 
 
    //updateQty() is static, while updateCurrentQty() is non-static method. They do the same task
    function updateCurrentQty($warehouse_id,$stockclass_code,$item_id=null,$ss=null){
      $item_id = $item_id?$item_id:$this->getId();
      $ss = $ss?$ss: $this->getUserInfo();
      $item = self::info($item_id); 
      return self::updateQty_many($ss,$warehouse_id,$stockclass_code,[$item]);
    }

    static function updateQty($ss,$warehouse_id,$stockclass_code,$item_id){
       $item = self::info($item_id); 
       return self::updateQty_many($ss,$warehouse_id,$stockclass_code,[$item]);
    }
    
    //create daily_stock_record, if not exists, and then return the row object {trx_id,item_id,item_code,begin_qty}
    //NOTE: paremeter $item is object = {id*,code*,sku*,unit_id*} // start "*" means required
    static function prepareDailyStockRecord($ss,$warehouse_id, $stockclass_code, $product_item,$trx_date=null){
          $trx_date = convertDate($trx_date);
          $item = (object)$product_item;
          $begin_qty = self::beginQty($warehouse_id,$stockclass_code,$item->id,false,null);
          if(!(bool)strtotime($trx_date)) $trx_date = date('Y-m-d'); 
            $branch_id = $ss->branch_id;
            $rows = DB::table("inv_daily_stocks as d")->whereRaw("DATE(trx_date) ='$trx_date'")->where("item_id",$item->id)->where('warehouse_id',$warehouse_id)->where('stockclass_code',$stockclass_code)->selectRaw("d.id,d.id as trx_id,d.item_id,d.item_code,d.begin_qty,d.purchase_qty,d.sold_qty,d.adjust_qty,d.customer_return_qty,d.vendor_return_qty")->take(1)->get();
            foreach($rows as $row){
               return $row;
            }
 
            $inputs = [
               "branch_id"=>$branch_id,
               "warehouse_id"=>$warehouse_id,
               "stockclass_code"=>$stockclass_code,
               "trx_date"=>$trx_date,
               "item_id"=>$item->id,
               "item_code"=>$item->code,
               "begin_qty"=>$begin_qty,
               "purchase_qty"=>isset($item->purchase_qty)?$item->purchase_qty:0,
               "sold_qty"=>isset($item->sold_qty)?$item->sold_qty:0,
               "customer_return_qty"=>isset($item->customer_return_qty)?$item->customer_return_qty:0,
               "vendor_return_qty"=>isset($item->vendor_return_qty)?$item->vendor_return_qty:0,
               "adjust_qty"=>isset($item->adjust_qty)?$item->adjust_qty:0,
               "sku"=>$item->sku,
               "unit_id"=>$item->id,
               "created_at"=>getNowTime(),
               "create_user"=>$ss->login_name,
               "create_uid"=>$ss->user_id,
               "updated_at"=>getNowTime(),
               "update_user"=>$ss->login_name,
               "update_uid"=>$ss->user_id
            ];
            DB::table('inv_daily_stocks')->insert($inputs);
            $trx_id = DB::getPdo()->lastInsertId();
            if ($trx_id > 0) {
               $inputs['trx_id'] = $trx_id;
               return (object) $inputs;
            }else return null; /** return NULL for failed operation **/
    }

}
