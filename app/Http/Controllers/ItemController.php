<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory\Item;
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

        $str_search ="1=1";
        $str_group="1=1";
        if($search_value){
          $str_search ="(i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
        }
        if ($group_id >0) $str_group ="g.id =$group_id"; 
        //if ($brand_id >0) $str_brand ="g.id =$brand_id";
        $rows = DB::table('inv_items as i')->join('inv_groups as g','g.id','=','i.group_id')->where('i.branch_id',$branch_id)->whereRaw($str_group)->whereRaw($str_search)->selectRaw("i.id,NULL AS item_type,i.name,i.description,g.name,g.id as group_id,g.description,i.create_user,formatDate(i.created_at) as created_at")->orderByRaw("i.name ASC")->get();
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
     
    function getItemDetails(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
      $branch_id = $ss->branch_id;
      $id = $req->id;     
      $rows = DB::table("inv_items as i")->where('i.id',$id)->where('i.branch_id',$branch_id)->selectRaw("i.id,i.code,NULL as item_type,i.group_id,i.name,i.description,i.cost,i.created_at, i.create_user")->take(1)->get();
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
          "group_id"=>"1|positive|exists=inv_groups|id",
          "brand_id"=>"0|number|default=0",
          "manufacturer_id"=>"0|number|default=0",
          "cost"=>"0|number|default=0",
          "made_in_country_id"=>"0|number",
          "unit_id"=>"1|number|text=Stock Keeping Unit is required"
        ];
        $check_unique = ["$branch_id|inv_items|name|id=id"];
        $res = validateReq($req,$validate_rule,true,[],$ss->lang,false,$check_unique);
        if($res->error) return JDV::error($res->error);
        $inputs =$res->values;
        $id = $res->id;
        $id = saveData($ss,'inv_items',['id'=>$id],$inputs,[],1);
        if($id > 0){
          $new_code = setOfficialCode($branch_id,'inv_item_code_control','inv_items',['id'=>$id],$def_prefix,$def_code_length);  
          return JDV::success(['id'=>$id]);
        }
        else return JDV::error("Something went wrong during saving inventory item");
    }

    function setStockIn(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
        $branch_id = $ss->branch_id;
        $d = $req->all();
        
        $id = $d->item_id;
        $stockin_date = isset($d->stockin_date)?$d->stockin_date:null;
        $qty = $d->qty;

        DB::table('stockins')->insert([
          'branch_id'=>$branch_id,
          'stockin_date'=>$stockin_date,
          'item_id'=>$id,
          'qty'=>$qty,
          'create_user'=>$ss->full_name,
          'create_uid'=>$ss->user_id,
          'created_at'=>getNowTime()
        ]);

        return JDV::success();
    }
 
}
