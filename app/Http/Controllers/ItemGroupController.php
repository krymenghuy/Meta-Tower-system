<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use App\Models\Inventory\ItemGroup;
//use Session;
//use App\Locales\LocaleManager;

//use Illuminate\Support\Facades\DB;
//use App\DB\SQLDB;
//use DB;
//use SQLDB;
//use Carbon\Carbon;
use Sanitizer;

class ItemGroupController extends Controller
{
    function getItemGroups(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $d = $req->all();
        //$search_value =$req->search_value;
        $rows = ItemGroup::list($ss,$d);
        return JDV::result($rows);
    }   

    function saveItemGroup(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $d = $req->all(); 
        $res = ItemGroup::saveFresh($ss,$d);
        if ($res->id > 0) 
        return JDV::success(['id'=>$res->id]);
        else return JDV::error("Something wrong during saving item group");
    }

    function deleteItemGroup(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id;
        $x = ItemGroup::delete($id);
        return JDV::success();
    }

    function getItemGroupDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id;
        $row = ItemGroup::details($id);
        return JDV::result($row);
    }

}
