<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\JDV;
use App\Models\UM;
use DB;
use Session;

class ItemController extends Controller
{
    protected $item;
    public function __construct() {
        $this->item = new Item();
    }

    function uniqid(){
      $branch_id = Session('branch_id',random_int()); 
      return uniqid($branch_id);
    }

    function getForm_options(Request $request) { 
      $r = $this->item->getForm_options($request);
      return makeJsonResponse($r);
    }
 
    function getItemList(Request $request) { 
        $ss = UM::getUserInfoByToken($request,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;

        //$this->item->branch_id = $branch_id;     
        //$this->item->name = 'Some name hhh';
        //$this->item->create_user = $ss->full_name;
        $rows = DB::table('service_items as i')->where('i.branch_id',$branch_id)->selectRaw("id,name,description,price,displayMoney(price,currency_code) as display_price,create_user, created_at")->orderBy('name','ASC')->get(); 
        //$r =  $this->item::selectRaw("name,")->where('branch_id',$branch_id)->orderBy('name')->get();
       
        return JDV::result($rows);
    }
     
    function deleteItem(Request $request) { 
      $ss = UM::getUserInfoByToken($request,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
      $branch_id = $ss->branch_id;
      $id = $d->id;     
      $r =  $this->item::where('branch_id',$branch_id)->where('id',$id)->delete();
      return JDV::success();
    }
      
    function saveItem(Request $request) { 
        $ss = UM::getUserInfoByToken($request,-1);
        if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
        $branch_id = $ss->branch_id;
      
        $item = new Item(); 
        extendProps($request->all(),$item);
        $r =  $item::create();
        return JDV::success();
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
          'create_date'=>getNowTime()
        ]);

        return JDV::success();
    }
 
}
