<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inventory\Item;
use App\Models\Inventory\ItemGroup;
//use App\Models\Inventory\StockUnit;
use App\Models\Inventory\Settings;
use App\Models\JDV;
use App\Models\UM;
  
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
        'units'=>Settings::options_unit($ss),
        'categories'=>Settings::options_category($ss),
        'manufacturer'=>Settings::options_manufacturer($ss)
       ];
       return JDV::result($data);
    }

    function getItemList(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Item::list($req->all(),$ss));
    }
     
    function getItemList_paginate(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      return JDV::result(Item::list_paginate($req->all(),$ss));
   }
   
    function deleteItem(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss);
      $id = $req->id?$req->id:$req->item_id;
       $item = new Item($id,$ss);     
      return JDV::raw($item->delete());
    }
     
    //return quick info of an item for itemsView on receipt/invoice/Receive Stock Form 
    function getItemInfo(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
      //$branch_id = $ss->branch_id;
      $id = $req->id;
      if(!$id) $id = $req->item_id;     
      return JDV::result(Item::info($id,false));
    }

    function getItemGroupInfo(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
      //$branch_id = $ss->branch_id;
      $group_id = $req->group_id;     
      return JDV::result(ItemGroup::info($ss,$group_id));
    }

    function getItemDetails(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
      $id = $req->id?$req->id:$req->item_id;
      //get item's details and also include item's photos as array of {'id','image_url'}
      return JDV::result(Item::details($id,true));  
    }

    function saveItem(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $id = $req->id?$req->id:$req->item_id;
        $item = new Item($id,$ss);
        return JDV::raw($item->save($req->all()));
    }
     
    function getItemPhotos(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
      $id = $req->id?$req->id:$req->item_id;
      $item = new Item($id,$ss);
      return JDV::result($item->getPhotos());
   }

    function deleteItemPhoto(Request $req) { 
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
        $id = $req->id?$req->id:$req->item_id;
        $item = new Item($id,$ss);
        $photo_id = $req->id?$req->id:$req->photo_id;
        return JDV::raw($item->deletePhoto($photo_id));
    }

    function addItemPhoto(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
      $id = $req->id?$req->id:$req->item_id;
      $item = new Item($id,$ss);
      $photo = $req->photo;
      return JDV::raw($item->addPhoto($photo));
    }

    /**
     * update or create item's photo. If there is no $photo_id provided then create a new item's photo, and returns new image_url
     * **/
    function saveItemPhoto(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
      $id = $req->id?$req->id:$req->item_id;
      $item = new Item($id,$ss);
      return JDV::raw($item->savePhoto($req->all()));
    }

    /**
     * returns a single, usually first photo among many of the item's photos
     * **/
    function getFirstItemPhoto(Request $req) { 
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
      $id = $req->id?$req->id:$req->item_id;
      $item = new Item($id,$ss);
      $images = $item->getPhotos();
      return JDV::result($images?$images->first():null);
    }
}
