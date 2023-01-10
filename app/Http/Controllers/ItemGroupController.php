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
        $res = ItemGroup::commitSave($ss,$d);
        if ($res->status_code === 200)
            return JDV::success(['id'=>$res->id]);
        else return JDV::error($res->error_message);
    }

    function deleteItemGroup(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id;
        $res = ItemGroup::commitDelete($ss,$id);
        return JDV::raw($res);
    }

    function getItemGroupDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id;
        $row = ItemGroup::details($ss,$id);
        return JDV::result($row);
    }

}
