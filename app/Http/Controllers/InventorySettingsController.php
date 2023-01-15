<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory\Settings;
use App\Models\UM;
use App\Models\JDV;

class InventorySettingsController extends Controller
{
    function getComboItems_group(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Settings::options_group($ss)); 
    }

    //returns all sets of options for ProductDialog or Item-form. These options can be arrays of "units,item-groups"
    function getItemFormOptions(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Settings::item_form_options($ss)); 
    }

    function getComboItems_detailtype(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $category_id = $req->category_id;
        return JDV::result(Settings::options_detail_type($ss,$category_id)); 
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

    function getComboItems_unit(request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        return JDV::result(Settings::options_unit($ss)); 
    }

}
