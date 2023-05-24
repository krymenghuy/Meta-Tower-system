<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
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
  
class ItemGroupController extends Controller
{
    function getItemGroups(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        //$search_value =$req->search_value;
        return JDV::result(ItemGroup::list($req->all(),$ss));
    }   

    function getItemGroups_paginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        //$search_value =$req->search_value;
        return JDV::result(ItemGroup::list_paginate($req->all(),$ss));
    }

    function saveItemGroup(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id?$req->id:$req->group_id;
        $g = new ItemGroup($id,$ss); 
        $res = $g->save($req->all());
        return JDV::raw($res);
        // if ($res->status_code === 200)
        //     return JDV::success(['id'=>$res->id]);
        // else return JDV::error($res->error_message);
    }

    function renameGroup(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id?$req->id:$req->group_id;
        $group = new ItemGroup($id,$ss); 
        return JDV::raw($group->rename($req->name));
        // if ($res->status_code === 200)
        //     return JDV::success(['id'=>$res->id]);
        // else return JDV::error($res->error_message);
    }

    function deleteItemGroup(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id?$req->id:$req->group_id;
        $g = new ItemGroup($id,$ss); 
        return JDV::raw($g->delete());
    }

    function getItemGroupDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id?$req->id:$req->group_id;
        return JDV::result(ItemGroup::details($id,$ss));
    }
    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id?$req->id:$req->group_id;
        return JDV::result(ItemGroup::form_options($id,$ss)); 
    }

    //getItemGroupInfo()
    function getGroupInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id?$req->id:$req->group_id;
        return JDV::result(ItemGroup::info( $id,$ss));
    }

}
