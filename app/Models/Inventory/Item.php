<?php

namespace App\Models\Inventory;
use Illuminate\Pagination\LengthAwarePaginator;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\PublicStorage;
use App\Models\Accounting\Account;
use DB; 
//use Illuminate\Support\Collection;
 
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
    protected static $default_price_currency ="USD";
    protected static $default_cost_currency ="USD";
    protected static $item_class ="MI";
    protected static $price_table =[
      'retail'=>'retail_prices',
      'wholesale'=>'wholesale_prices'
    ];

    function __construct($id=null,$userInfo){
       $this->id = $id;
       $this->userInfo = $userInfo;
     }

     static function getPriceTable($type){
       return isset(self::$price_table[$type])?self::$price_table[$type]:"retail_prices";
     }

     //sales_type ="retail" | "wholesale"
    static function getDefaultSalesUOM($sales_type,$item_id){
       $rows = DB::Table("inv_default_unit")->where('item_id',$item_id)->where("usage",$sales_type)->selectRaw("id,uom")->take(1)->get();
       return isset($rows[0])?$rows[0]:null;
      //  $col ="used_for_wholesale";
      //  if($type ==='retail') $col ="used_for_retail";
      //  $rows = DB::table("inv_unit")->where('item_id',$item_id)->where($col,1)->take(1)->selectRaw("id,uom,parent_uint_id")->get();     
      //  return isset($rows[0])?$rows[0]:null;
    }

    static function getDefaultPurchaseUOM($item_id){
      $rows = DB::Table("inv_default_unit")->where('item_id',$item_id)->where("usage","purchase")->take(1)->selectRaw("id,uom")->get();
      return isset($rows[0])?$rows[0]:null;
      // $col ="used_for_purchase";
      // $rows = DB::table("inv_units")->where('item_id',$item_id)->where($col,1)->take(1)->selectRaw("id,uom,parent_uint_id")->get();     
      // return isset($rows[0])?$rows[0]:null;
    }

    static function saveDefaultUnit($usage,$uom,$item_id,$ss){
       $unit_id = DB::table("inv_units")->where("item_id",$item_id)->where('uom',$uom)->value("id");
       if(!$unit_id){
          $inputs= ["item_id"=>$item_id,"uom"=>$uom,"parent_unit_id"=>null];
          $unit_id = saveData($ss,"inv_units",["id"=>null],$inputs,[],1,false);
       }
       //if(!$unit_id) return DV::error("The provided UOM $uom does not exists for the item $item_id");
       $x_id = DB::table("inv_default_unit")->where("item_id",$item_id)->where("usage",$usage)->value('id');
       $inputs = ['item_id'=>$item_id,"unit_id"=>$unit_id,"uom"=>$uom,"usage"=>$usage];
       $x_id = saveData($ss,"inv_default_unit",['id'=>$x_id],$inputs,[],1,false);
       return DV::depends($x_id,["unit"=>$inputs],"Failed to save default unit");
   }

    function setDefaultUnit($usage,$uom,$item_id=null,$ss=null){
      $item_id = $item_id?$item_id:$this->id;
      $ss = $ss?$ss:$this->userInfo;
      return self::saveDefaultUnit($usage,$uom,$item_id,$ss);
    }
    /**
    *getPrice() return selling price based on sepcfied $sales_type = retail|wholesale
    * @params $type = retail|wholesale
    **/
    static function getPrice($type,$uom,$item_id){
      $table = self::getPriceTable($type);
      if(!$uom) {
         $uomInfo = self::getDefaultSalesUOM($type,$item_id);
         $uom = $uomInfo?$uomInfo->uom:null;
      }
      if(!$uom) return -1;
      $price = DB::table($table)->where('uom',$uom)->where('item_id',$item_id)->where('price_type',$type)->take(1)->value('price');
      return $price?$price:0; 
   }

   static function priceInfo_serialized($item_id){
      //$str_where="sales_type IN('retail','wholesale')";
      $rows = DB::table("inv_item_prices")->where('item_id',$item_id)->selectRaw("id,price,uom,unit_id,sales_type")->get();
      $data = (object)[];
      foreach($rows as $row){
         $sales_type =strtolower($row->sales_type); 
         if($sales_type==='retail') 
         {
            $data->retail_price = $row->price;
            $data->retail_uom = $row->uom;
            $data->retail_unit_id = $row->unit_id;
         }else if ($sales_type ==='wholesale'){
            $data->wholesale_price = $row->price;
            $data->wholesale_uom = $row->uom;
            $data->wholesale_unit_id = $row->unit_id;
         }
      } 
      return $data;
   }

   /**
    * method princeInfo($item_id) returns associative array ["retail"=>[{"price","uom","unit_id","currency_code"}, {..},..], "wholesale"=>[{"price","uom","unit_id","currency_code"},{},...] ]
   */
   static function priceInfo($item_id){
      //$str_where="sales_type IN('retail','wholesale')";
      $rows = DB::table("inv_item_prices")->where('item_id',$item_id)->selectRaw("id,price,uom,unit_id,currency_code,sales_type")->orderBy("sales_type","ASC")->get();
      return (object)[
         "retailPrices"=>self::getArrayElements($rows,'sales_type','retail'), 
         "wholesalePrices"=> self::getArrayElements($rows,'sales_type','wholesale')
      ];
   }

   //costInfo() return array of single element that represents cost info
   static function costInfo($id){
    //For simiplicity => use only one first saved Cost Info item. It means the only first "row(cost,uom,currency_code)" is used
     $row =  DB::table("inv_item_costs")->where("item_id",$id)->selectRaw("id,cost,uom,currency_code,unit_id")->get()->first();
     return $row?[$row]:[];
   }

   static function costByUOM($uom,$item_id){
      return DB::table("inv_item_costs")->where("item_id",$item_id)->where("uom",$uom)->selectRaw("id,cost,uom,currency_code,unit_id")->get()->first();
   }
   //return $row object that represent cost info
   function getCostInfoByUOM($uom,$item_id=null)
   {
      $item_id = $item_id?$item_id:$this->id;
      //For simiplicity => use only one first saved Cost Info item. It means the only first "row(cost,uom,currency_code)" is used
      return DB::table("inv_item_costs")->where("item_id",$item_id)->where("uom",$uom)->selectRaw("id,cost,uom,currency_code,unit_id")->get()->first();
   }
   
   /**
    * validateUOM($uom,$usage) checks if a given $uom is truly as UOM for the $usage such as {'purchase','retail','wholesale'}.
    * validateUOM() true or false
    * 
   */
   function validateUOM($uom,$usage='purchase',$item_id=null,$ss=null){
      $ss =$ss?$ss:$this->userInfo;
      $item_id = $item_id?$item_id:$this->id;
     $row= null; 
     if($usage==='purchase')
       $row = DB::table("inv_item_costs")->where('item_id',$item_id)->where("uom",$uom)->selectRaw("id")->take(1)->get()->first();
     else{
       //check if the given UO is valid UOM for selling
       $row = DB::table("inv_item_prices")->where('item_id',$item_id)->where("uom",$uom)->selectRaw("id")->take(1)->get()->first();
     }
     return $row?true:false;
   }
   

   static function averageCost(){
       return 0;
   }

   /**
    *similar to getPriceInfo(), {'retail_uom','retail_price','retail_unit_id','wholesale_uom','wholesale_price','wholesale_unit_id'} 
    * @params $type = retail|wholesale
    **/
    function getPriceInfo($item_id){   
      return self::priceInfo($item_id);
   }

    static function info($id,$byCode=false){
       $cols = "i.id,i.code,i.default_uom,i.name,i.description,i.group_id,g.name AS group_name,g.category_id,i.sales_tax_rate"; 
       $rows = [];
       if($byCode){
         //if search item by code, user must supply $branch_id
         $rows = DB::table("inv_items as i")->join('inv_item_groups AS g','g.id','=','i.group_id')->where("i.code",$id)->selectRaw($cols)->take(1)->get();
       }
       else
         $rows = DB::table("inv_items as i")->join('inv_item_groups AS g','g.id','=','i.group_id')->where("i.id",$id)->selectRaw($cols)->take(1)->get();
       foreach($rows as $row){
         $row->accountInfo = self::accountInfo($id);
         $row->priceInfo = self::priceInfo($id);
         $row->costInfo =self::costInfo($row->id);
         return $row;
       }    
   }
   
   static function basicInfo($id,$byCode=false){
      $cols = "i.id,i.code,i.default_uom,i.name,i.description,i.group_id,g.name AS group_name,g.cost,g.category_id,i.sales_tax_rate,i.purchase_tax_rate"; 
      $row = null;
      if($byCode){
        //if search item by code, user must supply $branch_id
        $row = DB::table("inv_items as i")->join('inv_item_groups AS g','g.id','=','i.group_id')->where("i.code",$id)->selectRaw($cols)->take(1)->get()->first();
      }
      else
        $row = DB::table("inv_items as i")->join('inv_item_groups AS g','g.id','=','i.group_id')->where("i.id",$id)->selectRaw($cols)->take(1)->get()->first();
     if($row){
       $uom = $row->default_uom;
       $costInfo = self::costByUOM($uom,$row->id);
       $costInfo = $costInfo?$costInfo:(object)['cost'=>0,'currency_code'=>null,'uom'=>null];
       $row->cost = $costInfo->cost;
       $row->costInfo = $costInfo;
     }
     return $row; 
  }

 static function getArrayElements($data, $property, $value) {
    if ($data instanceof Illuminate\Support\Collection || (is_object($data) && $data instanceof \Traversable)) {
        $matchedElements = $data->filter(function ($element) use ($property, $value) {
            $val = isset($element->{$property})?$element->{$property}:null;
            return  $val === $value;
        })->values()->all();

        if (empty($matchedElements)) {
            return [];
        }
        return $matchedElements;
    } elseif (is_array($data)) {
        $matchedElements = array_filter($data, function ($element) use ($property, $value) {
            return isset($element[$property]) && $element[$property] == $value;
        });

        if (empty($matchedElements)) {
            return [];
        }

        return array_values($matchedElements);
    }

    return [];
}
  
  
   /**
    * @params $arr = [
    *  'revenue_account_id'=>2,
    *  'cogs_account_id'=>3,
    *  'receivable_account_id'=>5,
    *  'tax_account_id'=>6,
    *  'freight_account_id'=>7,
    *  'payable_account_id'=>8,
    *  'inventory_account_id'=>9,
    *  'purchase_account_id'=>10
    *]
    * **/
   function saveAccountInfo($arr =[],$item_id = null,$ss = null){
      $item_id = $item_id?$item_id:$this->id;
      $ss = $ss?$ss:$this->userInfo;
      $inputs = ['item_id'=>$item_id];
      $arr = $arr? (array)$arr:[];
      foreach($arr as $key=>$acc_id){
         $verified_acc_id = DB::table("accounts")->where("id",$acc_id)->take(1)->value('id');
         $inputs[$key] = $verified_acc_id?$verified_acc_id:null; 
      }
      $a_id = DB::table("inv_item_accounts as a")->where('a.item_id',$item_id)->take(1)->value('item_id');
      $a_id = saveData($ss,"inv_item_accounts",['item_id'=>$a_id],$inputs,[],1,false);
      return DV::depends($a_id,["accounts"=>$inputs],"Failed to save account information"); 
   }

   function getAccountInfo($item_id=null){
       $item_id = $item_id?$item_id:$this->id;
       //$ss = $ss?$ss:$this->userInfo;
       return self::accountInfo($item_id);
   }
   /**
    * Returns list of accounts required for Sales/Puchase transaction
    * **/
    static function accountInfo($item_id){
      //Make sure all columns returned by the following query are account_id, so that the next line of code is toe query account_name for each account_id in a loop
      $rows = DB::table("inv_item_accounts as a")->where("item_id",$item_id)->selectRaw("a.branch_id,a.revenue_account_id,a.cogs_account_id,inventory_account_id,receivable_account_id,tax_account_id,freight_expense_account_id,puchase_account_id,payable_account_id")->get();
      $accs = [];
      foreach($rows as $row){
         $ss = (object)['branch_id'=>$row->branch_id];
         $accounts = Account::list(null,$ss);
         unset($row->branch_id);
         foreach($row as $col=>$account_id){
            $name_prop = str_replace("_id","",$col);
            $name_prop = str_replace("_"," ",$name_prop);
            $name_prop = str_replace("cogs","COGS",$name_prop);
            $cs = self::getArrayElements($accounts,"id",$account_id);
            if(isset($cs[0])){
               $account = $cs[0];
               $accs[] = (object)["field"=>$col,"account_id"=>$account_id,"account_name"=>$account->name,"label"=>$account->name];
            }else $accs[] = (object)["field"=>$col,"account_id"=>$account_id,"account_name"=>'មិនទាន់កំណត់',"label"=>$name_prop]; 
         }
         return $accs;
      }
      return null;
      // foreach($rows as $row){
      //    $ss = (object)['branch_id'=>$row->branch_id];
      //    $accounts = Account::list(null,$ss);
      //    unset($row->branch_id);
      //    foreach($row as $col=>$value){
      //       $name_prop = str_replace("_id","_name",$col);
      //       $cs = self::getArrayElements($accounts,"id",$value);
      //       if(isset($cs[0])){
      //          $account = $cs[0];
      //          $row->{$name_prop} =$account->name; 
      //       }else $row->{$name_prop} ='មិនទាន់កំណត់'; 
      //    }
      //    return $row;
      // }
      //return null;
    }
    
    /**
     * addAccountInfo() will add additional props to $item, for example, $item->receiable_account_name, ...
     * **/
    static function addAccountInfo($item){
      $item_id = $item->id;
      $rows = DB::table("inv_item_accounts as a")->where("item_id",$item_id)->selectRaw("a.branch_id,a.revenue_account_id,a.cogs_account_id,inventory_account_id,receivable_account_id,tax_account_id,freight_expense_account_id,puchase_account_id,payable_account_id")->get();
     
      foreach($rows as $row){
         $ss = (object)['branch_id'=>$row->branch_id];
         $accounts = Account::list($ss);
         unset($row->branch_id);
         foreach($row as $col=>$value){
            $cs = self::getArrayElements($accounts,"id",$value);
            if(isset($cs[0])){
               $account = $cs[0];
               $name_prop = str_replace("_id","_name",$col);
               $item->{$name_prop} =$account->name; 
            }
         }  
      }
      return $item;
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
      $cols = "i.branch_id,i.id,i.code,i.default_uom,i.name,i.description,i.group_id,g.name AS group_name,g.category_id,i.sales_tax_rate"; 
      $rows = DB::table("inv_items as i")->join('inv_item_groups AS g','g.id','=','i.group_id')->whereRaw($str_where)->selectRaw($cols)->take(1)->get();
         foreach($rows as $row){
            $branch_id = $row->branch_id;
            if($include_photo){
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
            }
            $row->accountInfo = self::accountInfo($row->id);
            $row->priceInfo = self::priceInfo($row->id);
            $row->costInfo = self::costInfo($row->id);
            return $row;
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

    static function validateGroupUOM($group_id,$uom,&$out_group_name=""){
      $row = DB::table("inv_group_units as gu")->where("group_id",$group_id)->where("uom",$uom)->selectRaw("group_id")->take(1)->get()->first();
      if(!$row) $out_group_name = DB::table("inv_item_groups as g")->where("id",$group_id)->value("name");
      return $row?true:false; 
    }

    /**can be considered as function saveItem()
     * **/
    function save($arr=[],$id=null,$ss=null){
      $ss =$ss?$ss:$this->userInfo;
      $id =$id?$id:$this->id;
      $branch_id = $ss->branch_id;
      $def_prefix =null;
      $def_code_length = 5;
      $validate_rule =[
        //"id"=>"0|number|identity=1",
        "name"=>"1|string|1-150",
        "description"=>"0|string",
        "brand_id"=>"0|exists=inv_brands.id",
        "manufacturer_id"=>"0|exists=inv_manufacturers.id",
        "brand_id"=>"0|number|exists=inv_brands.id",
        //"default_uom"=>"1|string|1-15",
        "costInfo"=>"0|array",
        "cost_info"=>"0|array",//serves as alternative prop to "costInfo"
        //retail price info = [{price,currency_code,uom}]
        "retail_price_info"=>"0|array",
        "wholesale_price_info"=>"0|array",
        "accountInfo"=>"0|array",
        "sales_tax_rate"=>"0|number|default=0",
        "purchase_tax_rate"=>"0|number|default=0",
        "made_in_country_id"=>"0|exists=inv_countries",
        "category_id"=>"1|number|exists=inv_categories.id",
        "group_id"=>"1|positive|exists=inv_item_groups.id",
        //AccountInfo is an object => {'payable_account_id':1,'revenue_account_id':2,....}
        "detail_type_id"=>"0|number|exists=inv_detailed_types.id"
      ];
      $check_unique = ["$branch_id|inv_items|name|id=$id|text=item name already exists $id"];
      
      $res = validateObject($arr,$validate_rule,true,[],$ss->lang,false,$check_unique);
      if($res->error) return DV::error($res->error);
      $inputs =$res->values;
      //$id = $res->id;
      $group_id = $inputs["group_id"];
       $created = (!$id || $id==0);
       
     
      $group_id = $inputs['group_id'];
      $category_id = $inputs['category_id'];
      $detail_type_id = $inputs['detail_type_id'];

      //$priceInfo is expected to array => [{'sales_type':'retail','uom':'tube','price':25,'currency_code':'USD'}, ...]
      $costInfo = isset($inputs['costInfo'])?$inputs['costInfo']:$inputs['cost_info'];
      $accountInfo = $inputs['accountInfo'];
      $retail_price_info = $inputs['retail_price_info'];
      $wholesale_price_info = $inputs['wholesale_price_info'];
      //$retail_price = $inputs['retail_price'];
      //$wholesale_price = $inputs['wholesale_price'];
      //if($wholesale_price ==0) $wholesale_price= $retail_price;

      unset($inputs['category_id']);
      unset($inputs['detail_type_id']);
      unset($inputs['costInfo']);
      unset($inputs['cost_info']);
      unset($inputs['accountInfo']);
      unset($inputs['retail_price_info']);
      unset($inputs['wholesale_price_info']);

      $p = (object)$retail_price_info;
      $uom = isset($p->uom)?$p->uom:null;
      $group_name="";
      if(!self::validateGroupUOM($group_id,$uom,$group_name)) return DV::error("Unit ".($uom?$uom:"retail UOM")." must also belong to product group \"$group_name\"");
      
      $id = saveData($ss,'inv_items',['id'=>$id],$inputs,[],1);
      if($id > 0){
        if($created) $new_code = setOfficialCode($branch_id,'inv_item_code_control','inv_items',['id'=>$id],$def_prefix,$def_code_length);
        if($category_id>0) saveData($ss,'inv_item_groups',['id'=>$group_id],['category_id'=>$category_id],[],1);
        if($detail_type_id>0) saveData($ss,'inv_item_groups',['id'=>$group_id],['detail_type_id'=>$detail_type_id],[],1);
           
        //save Brand Name, maufacturer name in "inv_item_groups" table
        saveData($ss,'inv_item_groups',['id'=>$group_id],['manufacturer_id'=>$inputs['manufacturer_id'],'brand_id'=>$inputs['brand_id']],[],1);
         //   if($retail_uom) self::saveDefaultUnit('retail',$retail_uom,$id,$ss);
         //   if($wholesale_uom) self::saveDefaultUnit('wholesale',$wholesale_uom,$id,$ss);
         //   if($purchase_uom) self::saveDefaultUnit('purchase',$purchase_uom,$id,$ss);

        //***Save Retail price and UOM
        ////$p = (object)$retail_price_info;
        ////$uom = isset($p->uom)?$p->uom:null;
        $price_currency_code = isset($p->currency_code)?$p->currency_code:self::$default_price_currency;
        $price = isset($p->price)?$p->price:0;
        //saveDefaultUnit() is to save default unit for different purpuses such as retail, wholesale, and purchase (current version => Not yet used this features)
        self::saveDefaultUnit('retail',$uom,$id,$ss);
        
        //Save default_uom. NOTE: default_uom is used retail, purchase, and especially the daily_stock_summary unit
        //Current version, and for simplicity => inv_items.default_uom is used for retail, wholesale,purchase
        DB::table("inv_items")->where("id",$id)->where('branch_id',$branch_id)->update(['default_uom'=>$uom]);

        //NOTE: sales_type ="retail" or "wholesale" is strictly lower case. These values stored for classification of prices
        $x = self::savePrices("retail",$uom,$price,$price_currency_code,$id,$ss);
        if($x->status ==='Error') return DV::error("Item has been saved but failed to save Retail Price because ".$x->error_message);
       
        //***Save Wholesale price and UOM
        $p = (object)$wholesale_price_info;
        $uom = isset($p->uom)?$p->uom:null;
        $price_currency_code = isset($p->currency_code)?$p->currency_code:self::$default_price_currency;
        $price = isset($p->price)?$p->price:0;
        self::saveDefaultUnit('wholesale',$uom,$id,$ss);
        //NOTE: sales_type ="retail" or "wholesale" is strictly lower case. These values stored for classification of prices
        $x = self::savePrices("wholesale",$uom,$price,$price_currency_code,$id,$ss);
        if($x->status ==='Error') return DV::error("Item has been saved but failed to save Wholesale Price because ".$x->error_message);
       
        //***Save cost information| Save Purchase Information
        $p = (object)$costInfo;
        $uom = isset($p->uom)?$p->uom:null;
        $cost_currency_code = isset($p->currency_code)?$p->currency_code:self::$default_cost_currency;
        $cost = isset($p->cost)?$p->cost:0;
        self::saveDefaultUnit('purchase',$uom,$id,$ss);
        self::saveCost($uom,$cost,$cost_currency_code,$id,$ss);
        
        //*** todo: saving Account information not yet finalized data struture and operation
        //$this->saveAccountInfo($accountInfo,$id,$ss); 
        //$this->setPrice(['uom'=>$sales_uom,'type'=>"retail","price"=>$retail_price,"currency_code"=>self::$default_price_currency],$id,$ss);
        //$this->setPrice(['uom'=>$sales_uom,'type'=>"wholesale","price"=>$retail_price,"currency_code"=>self::$default_price_currency],$id,$ss);
      }
      return DV::depends($id,['id'=>$id],"Something went wrong during saving inventory item");
    }

    /**
     * save detaul item's unit for retail, wholesale, purchase as specified by parameter $usage
     * @params $usage = {retail|wholesale|purchase}. The UOM is used when Sales to customer or when Purchase Inventory
     * **/
   function saveUnit($uom,$usage='retail',$parent_uom=null,$item_id=null,$ss=null){
      $item_id =$item_id?$item_id:$this->id;
      $ss = $ss?$ss:$this->userInfo;
      $unit_id = DB::table('inv_units')->where('uom',$uom)->where('item_id',$item_id)->value('id');
      if(!$unit_id){
          $parent_uint_id =null;
          if($parent_uom) $parent_uint_id = DB::table("inv_units")->where("item_id",$item_id)->where("uom",$parent_uom)->value("id"); 
          saveData($ss,"inv_units",['id'=>null],[
            "uom"=>$uom,
            "item_id"=>$item_id,
            "parent_unit_id"=>$parent_uint_id
          ],[],1,true);
      }
      //Add the new UOM to general Unit List in table "inv_uom"
      $general_uom_id = DB::table("inv_uom")->where("name")->take(1)->value("id");
      if($general_uom_id>0){
         saveData($ss,"inv_uom",['id'=>null],['name'=>$uom,'item_class'=>self::$item_class],[],1,false);
      }
      $u_id = DB::table('inv_default_unit')->where("item_id",$item_id)->where("uom",$uom)->where('usage',$usage)->value("id");
      $inputs = [ 
         "item_id"=>$item_id,
         "uom"=>$uom,
         "usage"=>$usage,
         "unit_id"=>$unit_id];
         $new_id = saveData($ss,"inv_default_unit",['id'=>$u_id],$inputs,[],1,false);
      return DV::depends($u_id,["unit"=>$inputs],"Failed to save unit for item $item_id"); 
   }
   
   /**
    * delete item's unit, including its detault units for borth retail, wholesale, and puchase
    * **/
   function deleteUOM($oum,$id=null,$ss=null){
      $id =$id?$id:$this->id;
      $ss = $ss?$ss:$this->userInfo;
      DB::table('inv_default_unit')->where("item_id",$id)->where("uom",$oum)->delete();
      DB::table('inv_units')->where("item_id",$id)->where("uom",$oum)->delete();
      return DV::success();
   }
   
   
   // /**
   //  * setPrice() will set retail price of wholesale price based on the given $type = retail|wholesale.
   //  * $arr is array. Exampe: ["uom","type"=>"retail","price"=>25,"currency_code"=>"USD"] or  ["type"=>"wholesale","price"=>25,"currency_code"=>"USD"]
   //  * $uom is Unit of Measurement, example : box, bottle, can, tube, ampule, and so on.
   //  * **/ 
   // function setPrice($arr, $id=null,$ss=null) {
   //    $item_id =$id?$id:$this->id;
   //    $ss = $ss?$ss:$this->userInfo;
   //    $price =isset($arr['price'])?$arr['price']:0;
   //    $uom =isset($arr['uom'])?$arr['uom']:0;
   //    $unit_id = DB::table('inv_units')->where('item_id',$item_id)->where('uom',$uom)->value('id');
   //    if(!$unit_id) return DV::error("Invalid UOM or unit name"); 
   //    $currency_code =isset($arr['currency_code'])?$arr['currency_code']:self::$default_price_currency; 
   //    $price_type = isset($arr['type'])?$arr['type']:(isset($arr['price_type'])?$arr['price_type']:"retail");
   //    $table = self::getPriceTable($price_type);
   //    $id = DB::table($table)->where("item_id",$item_id)->where('price_type',$price_type)->where('unit_id',$unit_id)->value('id');
   //    $new_id = null;
   //    // if(self::price_is_used($id,$price_type)){
   //    //    $new_id = saveData($ss,$table,['id'=>null],['price',$price,'currency_code'=>$currency_code,'unit_id'=>$unit_id,"used"=>1],[],1,true);
   //    // }else
   //    $new_id = saveData($ss,$table,['id'=>$id],['price',$price,'currency_code'=>$currency_code,'unit_id'=>$unit_id],[],1,true);
   //    return DV::depends($new_id,true,"Failed to update $price_type price");
   // }

   function setRetailPrice($price,$uom,$currency_code ='USD',$id=null,$ss=null){
      $item_id =$id?$id:$this->id;
      $ss = $ss?$ss:$this->userInfo;
      return self::savePrices('retail',$uom,$price,$currency_code,$id,$ss);
   }
     
   function setWholesalePrice($price,$uom,$currency_code ='USD',$id=null,$ss=null){
      $item_id =$id?$id:$this->id;
      $ss = $ss?$ss:$this->userInfo;
      return self::savePrices('wholesale',$uom,$price,$currency_code,$id,$ss);
   }
    
    //Given one account_id, returns account name from accounting charts of account
    protected static function getAccountName($account_id){
      $account_name = DB::table('accounts')->where('id',$account_id)->value('name');
      return $account_name?$account_name:'មិនទាន់កំណត់';
    }
    
    protected static function getBrandName($id){
      //tod; Cache brand list for performance
      return DB::table("inv_brands")->where('id',$id)->value("name");
    }

    //getManufacturer()
    protected static function getProducerName($id){
      return DB::table("inv_manufacturers")->where('id',$id)->value("name");
    }
    //similar to ::info() but it gives more detailed info about an item
    static function details($id,$include_photo=false){
        $cols = "i.branch_id,i.id,i.code,i.default_uom,i.name,i.description,g.id AS group_id, g.name as group_name,g.brand_id, g.manufacturer_id,g.category_id,(SELECT `name` FROM inv_categories WHERE id = g.category_id LIMIT 1) AS category,i.sales_tax_rate,i.purchase_tax_rate"; 
        $rows = DB::table("inv_items as i")->join('inv_item_groups as g','g.id','=','i.group_id')->where("i.id",$id)->selectRaw($cols)->take(1)->get();
        if(isset($rows[0])){
           $row = $rows[0];
           $ss = (object)['branch_id'=>$row->branch_id];
            $row->accountInfo = self::accountInfo($id);
            $row->priceInfo = self::priceInfo($id);
            $row->costInfo = self::costInfo($row->id);
            $row->manufacturer = self::getProducerName($row->manufacturer_id);
            $row->brand_name = self::getBrandName($row->brand_id);
            if($include_photo) $row->images = self::photos($id,$ss);  
          return $row;
        } 
        return null;  
     }

     /**beginQty() check in a given $warehouse_id and $stock_class_code (if stock_class is given) => how many qty of the item ($id) was a beginQTY  
      * @aprams: if $date =null, today's date is used to check beginQty of today, otherwise beginQty of the specified date is checked and returned
      *  
     **/
     static function beginQty($warehouse_id,$stock_class,$id,$byCode=false,$date=null){
          $today = date('Y-m-d');
         $str_where ="i.id =".($id?$id:0);
         if($byCode || $byCode===1) $str_where ="i.code ='$id'";  
         $begin_qty =0;
         
         $str_class = "1=1";
         if($stock_class) $str_class ="d.stockclass_code ='$stock_class'";
         if((bool)strtotime($date)){
            $row = DB::table("inv_daily_stocks as d")->join("inv_items as i",'i.id','=','d.item_id')->whereRaw($str_where)->whereRaw("DATE(d.trx_date) ='$date'")->where('d.warehouse_id',$warehouse_id)->whereRaw($str_class)->selectRaw('d.begin_qty,d.purchase_qty,d.sold_qty,d.customer_return_qty,d.vendor_return_qty,d.adjust_qty,d.trx_date')->take(1)->get()->first();     
            return $row?$row->begin_qty:0;
         }
         $row = DB::table("inv_daily_stocks as d")->join("inv_items as i",'i.id','=','d.item_id')->whereRaw($str_where)->where('d.warehouse_id',$warehouse_id)->whereRaw($str_class)->selectRaw('d.begin_qty,d.purchase_qty,d.sold_qty,d.customer_return_qty,d.vendor_return_qty,d.adjust_qty,d.trx_date')->orderByRaw("d.trx_date DESC")->take(1)->get()->first();
         if($row){
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
         //$today = date('Y-m-d');
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
    static function updateQty_many($ss,$warehouse_id,$items){
      $branch_id = $ss->branch_id;
      foreach($items as $x){
           $item = (object)$x;
          //default to stock_class ="A" if item's sctock class is not provided
          $item_stockclass = isset($item->stock_class)?$item->stock_class:null;
         if(!$item_stockclass) return false;
         $end_qty =self::endingQty($warehouse_id,$item_stockclass,$item->id,false,null);
         //$latest_qty = self::getLatestQty($item->target_qty,$item->qty,$end_qty);
        
         $current_stock_id = DB::table("inv_current_stocks")->where("item_id",$item->id)->where("warehouse_id",$warehouse_id)->where("stockclass_code",$item_stockclass)->value("id");
         if($current_stock_id)
          {
            $x = DB::table("inv_current_stocks")->where("id",$current_stock_id)->update([
               "qty"=>$end_qty,
               "sku"=>$item->sku,
               "uom"=>$item->uom,
               "updated_at"=>getNowTime(),
               "update_user"=>$ss->full_name,
               "update_uid"=>$ss->user_id
            ]);
          }else{
               DB::table('inv_current_stocks')->insert([
                  'branch_id'=>$branch_id,
                  'warehouse_id'=>$warehouse_id,
                  'stockclass_code'=>$item_stockclass,
                  'item_id'=>$item->id,
                  //'item_code'=>$item->code,
                  'qty'=>$end_qty,
                  'sku'=>$item->sku,
                  'uom'=>$item->uom,
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
     * 
     * **/
    function savePrices($sales_type,$uom=null,$price=0,$currency_code=null,$item_id=null,$ss=null){
       $item_id = $item_id?$item_id:$this->id;
       $ss=$ss?$ss:$this->userInfo;
       $currency_code = $currency_code?$currency_code:self::$default_price_currency;
       $types = ['retail','wholesale'];
       if(!self::validCurrency($currency_code)) throw new \Exception("Error at savePrices() => Currency code $currency_code is not valid");
       if(!in_array($sales_type,$types)) return DV::error("Sales type is not correct");
       if(!$uom) {
         $uomInfo = self::getDefaultSalesUOM($sales_type,$item_id);
         $uom = $uomInfo?$uomInfo->uom:null;
       }
       if(!$uom) return Dv::error("Unit or UOM for retail or wholesale cannot be empty");
       $unit_id = DB::table("inv_units")->where("item_id",$item_id)->where("uom",$uom)->take(1)->value("id");
       if(!$unit_id) return DV::error(($uom?$uom:"UOM")." is not a unit for the item $item_id");
       $price_id = DB::table("inv_item_prices")->where("item_id",$item_id)->where("sales_type",$sales_type)->take(1)->value('id');
       $inputs = ["item_id"=>$item_id,"uom"=>$uom,"unit_id"=>$unit_id,"price"=>$price,"sales_type"=>$sales_type,'currency_code'=>$currency_code];
       $new_id = saveData($ss,"inv_item_prices",["id"=>$price_id],$inputs,[],1,false);
       $inputs['id']=$new_id;
       return DV::depends($new_id,['price_info'=>$inputs],"Failed to save price");  
    }
  
    /**
     * validCurrency() return true or false depending on whether currency is valid or not
    */
    static function validCurrency($c){
      return in_array($c,['USD','KHR']);
    }
    /**
     * saveCost() saves cost per $uom. It is is purchase cost
     * **/
    function saveCost($uom=null,$cost=0,$currency_code = null,$item_id=null,$ss=null){
      $item_id = $item_id?$item_id:$this->id;
      $ss=$ss?$ss:$this->userInfo;
      if(!self::validCurrency($currency_code)) throw new \Exception("Error at saveCode() => Currency code $currency_code is not valid");
      if(!$uom){
         $uomInfo = self::getDefaultPurchaseUOM($item_id);
         $uom = $uomInfo? $uomInfo->uom:null;
      }
      if(!$uom) return DV::error("Purchase UOM cannot be empty");
      $unit_id = DB::table("inv_units")->where("item_id",$item_id)->where("uom",$uom)->take(1)->value("id");
      if(!$unit_id) return DV::error(($uom?$uom:"Empty UOM")." is not a unit for item $item_id");
      //*** CASE 1: update the first row of (item_id,uom,cost,currency_code) in table "inv_item_costs". Meaning that we use only one row for defining purchase cost information for each item
      $cost_id = DB::table("inv_item_costs")->where("item_id",$item_id)->take(1)->value('id');
      //*** CASE 2: update or create cost row (item_id,uom,cost,currency_code) in table "inv_item_costs". Meaning that we use multiple cost info for purchasing information for each item. Each UOM determines a cost per unit of purchase
      //$cost_id = DB::table("inv_item_costs")->where("item_id",$item_id)->where("uom",$uom)->take(1)->value('id');
      $currency_code =$currency_code?$currency_code:self::$default_cost_currency;
      $inputs = ["item_id"=>$item_id,"uom"=>$uom,"unit_id"=>$unit_id,"cost"=>$cost,'currency_code'=>$currency_code];
      $new_id = saveData($ss,"inv_item_costs",["id"=>$cost_id],$inputs,[],1,false);
      $inputs['id']=$new_id;
      return DV::depends($new_id,['cost_info'=>$inputs],"Failed to save item cost information");  
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

    /**
     * prepareDailyStockRecord() creates one row in table "inv_daily_stock" if it does not exist, and then return the row object {trx_id,item_id,item_code,begin_qty}
     * NOTE: paremeter $item is object = {id*,code*,sku*,uom*} // the start sign "*" means it is required prop
    */
    static function prepareDailyStockRecord($ss,$warehouse_id, $stockclass_code, $product_item,$trx_date=null){
          $trx_date = convertDate($trx_date);
          $item = (object)$product_item;
          $begin_qty = self::beginQty($warehouse_id,$stockclass_code,$item->id,false,null);
          if(!(bool)strtotime($trx_date)) $trx_date = date('Y-m-d'); 
            $branch_id = $ss->branch_id;
            //todo: need to decide on one daily stock tracking UOM for each item and stores that UOM in table "inv_daily_stock.uom" => all QTYs such as customer_return_qty, vendor_return_qty, sold_qty, .. must use the same UOM here
            $rows = DB::table("inv_daily_stocks as d")->whereRaw("DATE(trx_date) ='$trx_date'")->where("item_id",$item->id)->where('warehouse_id',$warehouse_id)->where('stockclass_code',$stockclass_code)->selectRaw("d.id,d.id as trx_id,d.item_id,d.item_code,d.uom,d.begin_qty,d.purchase_qty,d.sold_qty,d.adjust_qty,d.customer_return_qty,d.vendor_return_qty")->take(1)->get();
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
               "uom"=>$item->uom,
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
      return DB::table('inv_items as i')->join('inv_item_groups as g','g.id','=','i.group_id')->join('inv_categories as c','c.id','=','g.category_id')->where('i.branch_id',$branch_id)->whereRaw($str_moreWhere)->whereRaw($str_search)->selectRaw("i.id,'Product' AS item_type,i.code,g.code as group_code,i.name,i.description,g.name as group_name,g.id as group_id,g.description as group_description, g.category_id, i.manufacturer_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,i.create_user,formatDate(i.created_at) as created_at")->orderByRaw("g.name ASC,i.code ASC")->get();
      
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
      $query = DB::table('inv_items as i')->join('inv_item_groups as g','g.id','=','i.group_id')->join('inv_categories as c','c.id','=','g.category_id')->where('i.branch_id',$branch_id)->whereRaw($str_moreWhere)->whereRaw($str_search)->selectRaw("i.id,'Product' AS item_type,i.code,g.code as group_code,i.name,i.description,g.name as group_name,g.id as group_id,g.description as group_description, g.category_id, i.manufacturer_id, c.name AS category,g.detail_type_id,getItemDetailType(g.detail_type_id) as detail_type,i.create_user,formatDate(i.created_at) as created_at")->orderByRaw("g.name ASC,i.code ASC");
      $count_query = clone $query;
      $count = $count_query->count('g.id');
      $rows = $query->skip($skip_rows)->take($per_page)->get();
      return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
 
}
