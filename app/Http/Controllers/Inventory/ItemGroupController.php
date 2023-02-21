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
use DB;
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
    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $data = (object)[];
        $data->categories = DB::table('inv_categories')->where('branch_id',$branch_id)->selectRaw("id,name as category")->orderByRaw("name ASC")->get();
        $data->units = DB::table('inv_units')->where('branch_id',$branch_id)->selectRaw("id,name as unit_name")->orderByRaw("name ASC")->get();
        return JDV::result($data);
    }

    //getItemGroupInfo()
    function getGroupInfo(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id;
        return JDV::result(ItemGroup::info($ss,$id));
    }

}
