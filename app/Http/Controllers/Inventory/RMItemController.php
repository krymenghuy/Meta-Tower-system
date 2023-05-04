<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inventory\RMItem;
use App\Models\Inventory\RMItemGroup;
use App\Models\Inventory\RMStockUnit;
use App\Models\Inventory\RMSettings;
use App\Models\JDV;
use App\Models\UM;
 
class RMItemController extends Controller
{
    // protected $item;
    // public function __construct() {
    //     $this->item = new RMItem();
    // }
 
    function getForm_options(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;

       $data =[
        'groups'=>RMSettings::options_group($ss),
        'brands'=>RMSettings::options_brand($ss),
        'units'=>RMSettings::options_unit($ss),
        'categories'=>RMSettings::options_category($ss),
        'manufacturer'=>RMSettings::options_manufacturer($ss)
       ];
       return JDV::result($data);
    }

    function getItemList(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(RMItem::list($req->all(),$ss));
    }
     
    function deleteItem(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
      $branch_id = $ss->branch_id;
      $id = $req->id;
      $item = new RMItem($id);     
      return JDV::raw($item->delete());
    }
     
    //return quick info of an item for itemsView on receipt/invoice/Receive Stock Form 
    function getItemInfo(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
      $branch_id = $ss->branch_id;
      $id = $req->id;
      if(!$id) $id = $req->item_id;
      return JDV::result(RMItem::details($id));
    }

    function getItemGroupInfo(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
      $branch_id = $ss->branch_id;
      $group_id = $req->group_id? $req->group_id: $req->id;     
      return JDV::result(ItemGroup::info($group_id));
    }

    function getItemDetails(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
      $id = $req->id;
      if(!$id) $id = $req->item_id;
      return JDV::result(RMItem::details($id));
    }

    function saveItem(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $item = new RMItem(null,$ss);
        $res = $item->save($req->all());
        if ($res->status_code ===200) return JDV::success(['id'=>$res->id]);
        return JDV::error("Something went wrong in saving item data"); 
    }
       
}
