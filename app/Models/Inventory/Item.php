<?php

namespace App\Models\Inventory;
use Illuminate\Pagination\LengthAwarePaginator;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\PublicStorage;
use DB;
 
class Item //extends Model
{
   //  //use HasFactory;
   //  protected $table = 'inv_items';
   //  protected $guarded = ['id'];
   //  protected $fillable =[]; // ['id','name','first_name','last_name','sex','date_of_birth','nationality_id','cp_name','cp_phone_number'];
      
   //  protected $primaryKey = 'id';
   //  public $incrementing = true;
   //  //protected $keyType = 'string';
   //  public $timestamps = true;
   //  protected $dateFormat = 'Y-m-d';
     
    protected $id = null;
    protected $userInfo =null;

    function __construct($id=null,$userInfo){
       $this->id = $id;
       $this->userInfo = $userInfo;
     }

    static function info($id,$byCode=false){
       $cols = "i.id,i.code,i.name,i.description,i.sku,i.unit_id,i.group_id,g.name AS group_name,g.category_id,i.cost,i.ws_selling_price,i.selling_price,i.sales_tax_rate"; 
       $rows = [];
       if($byCode){
         //if search item by code, user must supply $branch_id
         $rows = DB::table("inv_items as i")->join('inv_item_groups AS g','g.id','=','i.group_id')->where("i.code",$id)->selectRaw($cols)->take(1)->get();
       }
       else
         $rows = DB::table("inv_items as i")->join('inv_item_groups AS g','g.id','=','i.group_id')->where("i.id",$id)->selectRaw($cols)->take(1)->get();
       return isset($rows[0])?$rows[0]:null;    
    }

    static function getAttachments($item_id,$file_type="image"){
      $str_file_type ="1=1";
      if($file_type) $str_file_type ="file_type='$file_type'";
      return DB::table("inv_item_files as f")->where("f.item_id",$item_id)->whereRaw($str_file_type)->selectRaw("f.id,f.file_name,f.file_type,f.directory")->get();
    }

    //Example: Item::detailsBy(['sku'=>'PRO-AGB-200715']);
    static function detailsBy($field=[],$include_photo=false){
      $str_where="1=2";
      foreach($field as $key=>$value){
         $str_where .= ($str_where? ' AND ':'').$key."='$value'";
      }
      $str_where ="($str_where)";
      $cols = "i.branch_id,i.id,i.code,i.name,i.description,i.sku,i.unit_id,i.group_id,g.name AS group_name,g.category_id,i.cost,i.ws_selling_price,i.selling_price,i.sales_tax_rate"; 
      $rows = DB::table("inv_items as i")->join('inv_item_groups AS g','g.id','=','i.group_id')->whereRaw($str_where)->selectRaw($cols)->take(1)->get();
      if($include_photo){
         foreach($rows as $row){
            $branch_id = $row->branch_id;
            $files = self::getAttachments($row->id,'image');
            $row->image_url = PublicStorage::getUrl($branch_id,'item','image').$files->first()->file_name; 
            $i=0;$c=null;
            $urls =[];
            do{
               $c = isset($files[$i])?$files[$i]:null;
               if($c) break;
               $urls[] = PublicStorage::getUrl($branch_id,"item","image").$c->file_name; 
               $i++;
            }while($c);

            $row->images = $urls;
            return $row;
         }
      } 
      return isset($rows[0])?$rows[0]:null;
   }

    //returns error message if the item cannot be deleted, otherwise, return NULL
    static function getItemDeleteError($id){
       return null;
    }

    function delete($id=null,$ss=null){
       $id = $id?$id:$this->id;
       $ss =$ss?$ss:$this->userInfo; 
       $err = self::getItemDeleteError(($id));
       if($err) return DV::error($err);
       DB::table('inv_daily_stocks')->where('item_id',$id)->delete();
       DB::table('inv_current_stocks')->where('item_id',$id)->delete();
       DB::table('inv_items')->where('id',$id)->delete();
       return DV::success();
    }

    function save($arr=[],$id=null,$ss=null){
      $ss =$ss?$ss:$this->userInfo;

      $branch_id = $ss->branch_id;
      $def_prefix =null;
      $def_code_length = 5;
      $validate_rule =[
        "id"=>"0|number|identity=1",
        "name"=>"1|string|1-150",
        "description"=>"0|string",
        "brand_id"=>"0|exists=inv_brands.id",
        "manufacturer_id"=>"0|exists=inv_manufacturers.id",
        "brand_id"=>"0|number|exists=inv_brands.id",
        "cost"=>"0|number|default=0",
        "sales_tax_rate"=>"0|number|default=0",
        "purchase_tax_rate"=>"0|number|default=0",
        "made_in_country_id"=>"0|exists=inv_countries",
        "unit_id"=>"0|exists=inv_units.id|text=SKU is required",
        "category_id"=>"1|number|exists=inv_categories.id",
        "group_id"=>"1|positive|exists=inv_item_groups.id",
        "selling_price"=>"0|number",
        "ws_selling_price"=>"0|number",
        "cost"=>"0|number",
        "cost_account_id"=>"0|number",
        "revenue_account_id"=>"0|number",
        "tax_account_id"=>"0|number",
        "inventory_account_id"=>"0|number",
        "detail_type_id"=>"0|number|exists=inv_detailed_types.id"
      ];
      $check_unique = ["$branch_id|inv_items|name|id=id|text=item name already exists"];
      
      $res = validateObject($arr,$validate_rule,true,[],$ss->lang,false,$check_unique);
      if($res->error) return DV::error($res->error);
      $inputs =$res->values;
      $id = $res->id;
       $created = (!$id || $id==0);
      //$unit_id = $inputs['unit_id'];
      //$unit = StockUnit::info($unit_id);
      //if (!$unit) return DV::error("Unit ID id not valid. There is no valid SKU found!");
      //$inputs['sku'] = $unit->name;
      
      $group_id = $inputs['group_id'];
      $category_id = $inputs['category_id'];
      $detail_type_id = $inputs['detail_type_id'];
      $ws_selling_price = $inputs['ws_selling_price'];
      if($ws_selling_price ==0) $inputs['ws_selling_price'] = $inputs['selling_price'];

      unset($inputs['category_id']);
      unset($inputs['detail_type_id']);
      $id = saveData($ss,'inv_items',['id'=>$id],$inputs,[],1);
      if($id > 0){
        $new_code = null;
        if($created) $new_code = setOfficialCode($branch_id,'inv_item_code_control','inv_items',['id'=>$id],$def_prefix,$def_code_length);
        if($category_id>0) saveData($ss,'inv_item_groups',['id'=>$group_id],['category_id'=>$category_id],[],1);
        if($detail_type_id>0) saveData($ss,'inv_item_groups',['id'=>$group_id],['detail_type_id'=>$detail_type_id],[],1);

        //save Brand Name, maufacturer name in "inv_item_groups" table
        saveData($ss,'inv_item_groups',['id'=>$group_id],['manufacturer_id'=>$inputs['manufacturer_id'],'brand_id'=>$inputs['brand_id']],[],1);
        
      }
      return DV::depends($id,['id'=>$id],"Something went wrong during saving inventory item");
    }

    //Given one account_id, returns account name from accounting charts of account
    protected static function getAccountName($account_id){
      $account_name = DB::table('accounts')->where('id',$account_id)->value('name');
      return $account_name?$account_name:'មិនទាន់កំណត់';
    }
    
    protected static function getBrandName($id){
      return null;
    }

    //getManufacturer()
    protected static function getProducerName($id){
      return null;
    }
    //similar to ::info() but it gives more detailed info about an item
    static function details($id,$include_photo=false){
        $cols = "i.branch_id,i.id,i.name,i.description,i.sku,i.unit_id,g.unit_id as group_unit_id,g.id AS group_id,g.sku as group_sku, g.name as group_name,g.brand_id, g.manufacturer_id,g.category_id,(SELECT `name` FROM inv_categories WHERE id = g.category_id LIMIT 1) AS category,i.selling_price,i.ws_selling_price,i.cost, i.sales_tax_rate,i.purchase_tax_rate,i.revenue_account_id, i.tax_account_id, i.inventory_account_id,i.cost_account_id"; 
        $rows = DB::table("inv_items as i")->join('inv_item_groups as g','g.id','=','i.group_id')->where("i.id",$id)->selectRaw($cols)->take(1)->get();
        if(isset($rows[0])){
           $row = $rows[0];
           $ss = (object)['branch_id'=>$row->branch_id];
           $row->tax_account_name =self::getAccountName($row->tax_account_id);
           $row->revenue_account_name =self::getAccountName($row->revenue_account_id);
           $row->cost_account_name =self::getAccountName($row->cost_account_id);
           $row->inventory_account_name =self::getAccountName($row->inventory_account_id);
           $row->manufacturer = self::getProducerName($row->manufacturer_id);
           $row->brand_name = self::getBrandName($row->brand_id);
           if($include_photo) $row->images = self::photos($id,$ss);  
          return $row;
        } 
        return null;  
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

   //return current quantity of an item. if parameter $byCode =1 then, it will find item by item code  
   static function getCurrentQty($id=0,$byCode=false){
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
         //$latest_qty = self::getLatestQty($item->target_qty,$item->qty,$end_qty);
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
 
    static function updateQty($ss,$warehouse_id,$stockclass_code,$item_id){
       $item = self::info($item_id); 
       return self::updateQty_many($ss,$warehouse_id,$stockclass_code,[$item]);
    }

    static function getAttachmentExists($file_id){
      return DB::table("inv_item_files")->where('id',$file_id)->select('id')->exists();
    }
  
    /**
     * add item's photo, if it does not exist, otherwise update the existing photo based on the gievn $photo_id
     * $arr[] => ['photo_id'=>integer,'photo'=>null] 
     * **/
    function savePhoto($arr =[],$id=null,$ss=null){
      $item_id = $id?$id:$this->id;
      $ss =$ss?$ss:$this->userInfo;
      $branch_id = $ss->branch_id;
      if(!$item_id) return DV::error("Item or product ID is not valid");
      //$photo_id is Optional parameter
      $photo_id = isset($arr['photo_id'])?$arr['photo_id']:null;
      $photo= isset($arr['photo'])?$arr['photo']:null;
      $prev_images = DB::table("inv_item_files")->where('id',$photo_id)->where('item_id',$item_id)->selectRaw("id,file_name,file_type")->take(1);
      
      $to_create_new_image = true;
      $img_store = null;
      if(self::getAttachmentExists($photo_id)){
         $row = $prev_images->first();
         if($row) {
            PublicStorage::delete($branch_id,"item","image",$row->file_name);
            $img_store = ['id'=>$photo_id,'store'=>"inv_item_files.file_name"];
         }
         $to_create_new_image = false;
      }else $photo_id = null;

      $mx = PublicStorage::saveImage($branch_id,"item",null,$photo,null, $img_store);
      if($mx->status ==='OK') 
      {
         //insert new row to table "inv_item_files" in case of creating new image
         if($to_create_new_image){
            $inputs = [
               'item_id'=>$item_id,
               'file_name'=>$mx->file_name,
               'file_type'=>'image',
               'directory'=>getUrlDirectory($mx->image_url)
            ];
            $new_photo_id = saveData($ss,'inv_item_files',['id'=>null],$inputs,[],1);
            $photo_id = $new_photo_id;
         }
         return DV::depends($photo_id,['id'=>$photo_id,'image_url'=>$mx->image_url]);
        
      }else return DV::error($mx->error_message);
    }

    function addPhoto($photo,$id=null,$ss=null){
       $item_id = $id?$id:$this->id;
       $ss =$ss?$ss:$this->userInfo;
       $branch_id = $ss->branch_id;
       $mx = PublicStorage::saveImage($branch_id,"item",null,$photo,null,null);
       if($mx->status==='OK'){
         $inputs = [
            'item_id'=>$item_id,
            'file_type'=>'image',
            'file_name'=>$mx->file_name,
            'directory'=>getUrlDirectory($mx->image_url)
          ];
          $id = saveData($ss,"inv_item_files",['id'=>null],$inputs,[],1); 
          $inputs['id']=$id;
          return DV::depends($id,['id'=>$id,'image_url'=>$mx->image_url],"Failed to save item photo");  
       }else return DV::error($mx->error_message);
    }

    static function photos($id,$ss){
      $branch_id = $ss->branch_id;
      $rows = self::getAttachments($id,"image");
      $imgs = [];
      foreach($rows as $row){
         $url = PublicStorage::getUrl($branch_id,"item","image").$row->file_name;
         $imgs[] = ['id'=>$row->id,'image_url'=>$url]; 
      }
      return $imgs;
    }

    function getPhotos($id=null,$ss=null){
      $id = $id?$id:$this->id;
      $ss =$ss?$ss:$this->userInfo;
      return self::photos($id,$ss);
    }

    function deletePhoto($photo_id,$id=null,$ss=null){
      $item_id = $id?$id:$this->id;
      $ss =$ss?$ss:$this->userInfo;
      $branch_id = $ss->branch_id;
      $query = DB::table("inv_item_files")->where('id',$photo_id)->where('item_id',$item_id)->select("id,file_name,file_type")->take(1);
      $row = $query->get()->first();
      if($row) PublicStorage::delete($branch_id,"item","image",$row->file_name);
      $query->delete();
      return DV::depends(1,['imgs'=>$this->getPhotos($item_id,$ss)]);
    }

    //create daily_stock_record, if it does not exist, and then return the row object {trx_id,item_id,item_code,begin_qty}
    //NOTE: paremeter $item is object = {id*,code*,sku*,unit_id*} // start "*" means it is required prop
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
               "purchase_qty"=>0,
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

    static function list($filter,$ss) { 
      $branch_id = $ss->branch_id;
      $search_value =isset($filter['search_value'])?$filter['search_value']:null;
      $group_id = isset($filter['group_id'])? $filter['group_id']:null;
      $country_id = isset($filter['country_id'])? $filter['country_id']:null;
      $category_id = isset($filter['category_id'])? $filter['category_id']:null;

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
      return DB::table('inv_items as i')->join('inv_item_groups as g','g.id','=','i.group_id')->join('inv_categories as c','c.id','=','g.category_id')->where('i.branch_id',$branch_id)->whereRaw($str_moreWhere)->whereRaw($str_search)->selectRaw("i.id,'Product' AS item_type,i.code,g.code as group_code,i.name,i.description,i.unit_id, i.sku,g.unit_id AS group_unit_id,g.sku AS group_sku,g.name as group_name,g.id as group_id,g.description as group_description, g.category_id, i.manufacturer_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,i.create_user,formatDate(i.created_at) as created_at")->orderByRaw("g.name ASC,i.code ASC")->get();
      
    }

    static function list_paginate($filter,$ss) { 
      $branch_id = $ss->branch_id;
      $search_value =isset($filter['search_value'])?$filter['search_value']:null;
      $current_page =isset($filter['current_page'])?$filter['current_page']:1;
      $per_page =isset($filter['per_page'])?$filter['per_page']:10;
      if(!is_numeric($current_page)) $current_page=1;
      $skip_rows = ($current_page -1) * $per_page;

      $group_id = isset($filter['group_id'])? $filter['group_id']:null;
      $country_id = isset($filter['country_id'])? $filter['country_id']:null;
      $category_id = isset($filter['category_id'])? $filter['category_id']:null;

      $str_search ="1=1";
      $str_moreWhere="1=1";
      if($search_value){
         $skip_rows =0;
        $search_value = escape_like_str($search_value);
        $str_search ="(i.code ='$search_value' OR i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
      }
      if ($group_id > 0) $str_moreWhere .=" AND g.id =$group_id";
      if($category_id > 0) $str_moreWhere .=" AND g.category_id =$category_id";
      if($country_id > 0)  $str_moreWhere .= " AND i.made_in_country_id =$country_id";
      //if ($brand_id >0) $str_brand ="g.id =$brand_id";
      //order by group_name or group_code
      $query = DB::table('inv_items as i')->join('inv_item_groups as g','g.id','=','i.group_id')->join('inv_categories as c','c.id','=','g.category_id')->where('i.branch_id',$branch_id)->whereRaw($str_moreWhere)->whereRaw($str_search)->selectRaw("i.id,'Product' AS item_type,i.code,g.code as group_code,i.name,i.description,i.unit_id, i.sku,g.unit_id AS group_unit_id,g.sku AS group_sku,g.name as group_name,g.id as group_id,g.description as group_description, g.category_id, i.manufacturer_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,i.create_user,formatDate(i.created_at) as created_at")->orderByRaw("g.name ASC,i.code ASC");
      $count_query = clone $query;
      $count = $count_query->count('g.id');
      $rows = $query->skip($skip_rows)->take($per_page)->get();
      return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
 
}
