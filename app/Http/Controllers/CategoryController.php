<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use App\Models\Inventory\Category;
use DB;

class CategoryController extends Controller
{
    function getCategories(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $d = $req->all();
        //$search_value =$req->search_value;
        $rows = Category::list($ss,$d);
        return JDV::result($rows);
    }   

    function saveCategory(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $d = $req->all(); 
        $res = Category::commitSave($ss,$d);
        if ($res->status_code === 200)
            return JDV::success(['id'=>$res->id]);
        else return JDV::error($res->error_message);
    }

    function deleteCategory(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id;
        $res = Category::commitDelete($ss,$id);
        return JDV::raw($res);
    }

    function getCategoryDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id;
        $row = Category::details($ss,$id);
        return JDV::result($row);
    }

}
