<?php

namespace App\Http\Controllers\Inventory;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use App\Models\Inventory\Category;
use DB;

class CategoryController extends Controller
{
    function getCategories(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticate
        return JDV::result( Category::list($req->all(),$ss));
    }   

    function saveCategory(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id?$req->id:$req->category_id;
        $cat = new Category($id,$ss);
        return JDV::raw($cat->save($req->all()));
    }

    function deleteCategory(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id?$req->id:$req->category_id;
        $cat = new Category($id,$ss);
        return JDV::raw($cat->delete());
    }

    function getCategoryDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $id = $req->id?$req->id:$req->category_id;
        return JDV::result(Category::details($id,$ss));
    }

}
