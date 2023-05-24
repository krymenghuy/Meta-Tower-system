<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inventory\Settings;
use App\Models\Inventory\Item;
use App\Models\UM;
use App\Models\JDV;

class InventorySettingsController extends Controller
{
    function getComboItems_group(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Settings::options_group($ss)); 
    }

    function getComboItems_warehouse(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Settings::options_warehouse($ss)); 
    }

    //returns all sets of options for ProductDialog or Item-form. These options can be arrays of "units,item-groups"
    function getItemFormOptions(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Settings::item_form_options($ss)); 
    }

    function getReceiveStockFormOptions(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Settings::receive_stock_form_options($ss)); 
    }

    function getReceiveVPOOptions(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Settings::receive_vpo_options($ss)); 
    }
    
    function getComboItems_detailtype(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $category_id = $req->category_id;
        return JDV::result(Settings::options_detail_type($category_id,$ss)); 
    }
   
    function getComboItems_sku(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $item_id = $req->id?$req->id:$req->item_id;
        $item = new Item($item_id,$ss);
        return JDV::result($item->getSKUList()); 
    }
     
    function getComboItems_stockclass(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        //$category_id = $req->category_id;
        return JDV::result(Settings::options_stockclass($ss)); 
    }
    
    function getComboItems_manufacturer(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Settings::options_manufacturer($ss)); 
    }

    function getComboItems_category(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Settings::options_category($ss)); 
    }

    // function getComboItems_unit(request $req){
    //     $ss = UM::getUserInfoByToken($req,-1);
    //     if($ss->status_code !=200) return $ss; //user not authenticated
    //     return JDV::result(Settings::options_unit($ss)); 
    // }

    function getComboItems_uom(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Settings::options_uom($ss)); 
    }

    //saveSKU()|CreateUnit()
    function saveUOM(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $res = Settings::saveUOM($req->all(),$ss);
        return JDV::raw($res);
    }

    function deleteUOM(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $res = Settings::deleteUOM($req->uom,$ss);
        return JDV::raw($res);
    }

    function saveManufacturer(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $res = Settings::saveManufacturer($req->all(),$ss);
        return JDV::raw($res);
    }
 
    function deleteManufacturer(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $res = Settings::deleteManufacturer($req->id,$ss);
        return JDV::raw($res);
    }

     //saveBrandName() |createBrandName()
    function saveBrand(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $res = Settings::saveBrand($req->all(),$ss);
        return JDV::raw($res);
    }
     
    function deleteBrand(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $res = Settings::deleteBrand($req->id,$ss);
        return JDV::raw($res);
    }

    function getStockTrackingFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Settings::stock_tracking_options($ss)); 
    }

    function invoice_form_options(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Settings::invoice_form_options($ss)); 
    }
}
