<?php

namespace App\Http\Controllers\Inventory;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inventory\RMSettings;
use App\Models\UM;
use App\Models\JDV;

class RMSettingsController extends Controller
{
    function getComboItems_group(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(RMSettings::options_group($ss)); 
    }

    function getComboItems_warehouse(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(RMSettings::options_warehouse($ss)); 
    }

    //returns all sets of options for ProductDialog or Item-form. These options can be arrays of "units,item-groups"
    function getItemFormOptions(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(RMSettings::item_form_options($ss)); 
    }

    function getReceiveStockFormOptions(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(RMSettings::receive_stock_form_options($ss)); 
    }

    function getReceiveVPOOptions(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(RMSettings::receive_vpo_options($ss)); 
    }
    
    function getComboItems_detailtype(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $category_id = $req->category_id;
        return JDV::result(RMSettings::options_detail_type($ss,$category_id)); 
    }
    
    function getComboItems_stockclass(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $category_id = $req->category_id;
        return JDV::result(RMSettings::options_stockclass($ss)); 
    }
    
    function getComboItems_manufacturer(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(RMSettings::options_manufacturer($ss)); 
    }

    function getComboItems_category(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(RMSettings::options_category($ss)); 
    }

    function getComboItems_unit(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(RMSettings::options_unit($ss)); 
    }

    //saveSKU()|CreateUnit()
    function saveUnit(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $res = RMSettings::saveUnit($ss,$req->all());
        if($res->status ==='OK') return JDV::success(['id'=>$res->id]);
        else return JDV::error($res->error_message); 
    }

    function saveManufacturer(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $res = RMSettings::saveManufacturer($ss,$req->all());
        if($res->status ==='OK') return JDV::success(['id'=>$res->id]);
        else return JDV::error($res->error_message); 
    }

    function deleteUnit(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $res = RMSettings::deleteUnit($ss,$req->id);
        if($res->status ==='OK') return JDV::success();
        else return JDV::error($res->error_message); 
    }
     
    function deleteManufacturer(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $res = RMSettings::deleteManufacturer($ss,$req->id);
        if($res->status ==='OK') return JDV::success(['id'=>$res->id]);
        else return JDV::error($res->error_message); 
    }

     //saveBrandName() |createBrandName()
    function saveBrand(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $res = RMSettings::saveBrand($ss,$req->all());
        if($res->status ==='OK') return JDV::success(['id'=>$res->id]);
        else return JDV::error($res->error_message); 
    }
     
    function deleteBrand(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $res = RMSettings::deleteBrand($ss,$req->id);
        if($res->status ==='OK') return JDV::success();
        else return JDV::error($res->error_message); 
    }

    function getStockTrackingFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(RMSettings::stock_tracking_options($ss)); 
    }

    function invoice_form_options(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(RMSettings::invoice_form_options($ss)); 
    }
}
