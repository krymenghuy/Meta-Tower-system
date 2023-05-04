<?php

namespace App\Http\Controllers\Inventory;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use App\Models\Inventory\RMCategory;
use DB;

class RMCategoryController extends Controller
{
    function getCategories(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $d = $req->all();
        //$search_value =$req->search_value;
        return JDV::result(RMCategory::list($d,$ss));
    }   

    function saveCategory(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $d = $req->all(); 
        $res = RMCategory::commitSave($d,$ss);
        if ($res->status_code === 200)
            return JDV::success(['id'=>$res->id]);
        else return JDV::error($res->error_message);
    }

    function deleteCategory(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id;
        $res = RMCategory::commitDelete($id,$ss);
        return JDV::raw($res);
    }

    function getCategoryDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id;
        return JDV::result(RMCategory::details($id,$ss));
    }

}
