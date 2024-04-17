<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Dms\UM;
use App\Models\Dms\JDV;
use DB;
//NOTE: we use table "product_types" and column name "name" for categories
//Current version of DMS => the actual application of product_type is in table "order,package"
class CategoryController extends Controller
{
    function categoryExists($branch_id,$category,$id){
       $str_id = $id > 0? 'id <> '.$id : '1=1';
       return  DB::table('product_types as d')->where('d.branch_id',$branch_id)->where('d.name',$category)->whereRaw($str_id)->select('id')->take(1)->first();
    }

    function saveCategory(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss;
        $branch_id = $ss->branch_id;
        $id = $req->id; 
        $category = $req->category;
        if(!$category) $category = $req->name;
        if(!$category) return JDV::error('Product Type cannot be empty');
        $old_category = $this->getCategoryName($branch_id,$id);
        if($this->categoryExists($branch_id,$category,$id)) return JDV::error("Category $category already exists");
        $inputs = ['name'=>$category];
        
        $id = saveData($ss,"product_types",['id'=>$id],$inputs,[],1);
        if ($id > 0){
           if ($old_category != $category){
              $this->updateCatgory($branch_id,$id,$category);
           } 
           return JDV::success(['id'=>$id]);
        }
        return JDV::error('Something when wrong during saving category data');
    }

    function getCategoryName($branch_id,$id){
        if(!$id) $id =0;
        $rows = DB::table('product_types as d')->where('branch_id',$branch_id)->where('id',$id)->select("name")->take(1)->get();
        return isset($rows[0])?$rows[0]->name:null; 
    }

    //Temporarily, we delete category by $name , not by $id
    function deleteCategory(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);;
        $branch_id = $ss->branch_id;
        $id = $req->id;
        $name = $req->category;
        if(!$name) $name = $req->name;
        DB::table('product_types')->where('branch_id',$branch_id)->where('name',$name)->delete();
        return JDV::success(); 
    }
     
    public function getCategories(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $branch_id = $ss->branch_id;
        $rows = DB::table("product_types as d")->where('branch_id',$branch_id)->selectRaw('d.id,d.name,IFNULL(d.update_user,d.create_user) AS update_user, formatTime(d.update_date) AS updated_at')->orderBy("name","ASC")->get();
        return JDV::result($rows);
    }

    public function getCategories_paginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $branch_id = $ss->branch_id;
        $d = (object)$req->all();
        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $query = DB::table("product_types as d")->where('branch_id',$branch_id)->selectRaw('d.id,d.name,IFNULL(d.update_user,d.create_user) AS update_user, formatTime(d.update_date) AS updated_at')->orderBy("name","ASC");
        $count_query = clone $query;
        $count = $count_query->count('d.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        $data = new LengthAwarePaginator($rows, $count, $per_page, $current_page);
        return JDV::result($data);
    }

    function getCategoryDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $branch_id = $ss->branch_id;
        $id = $req->id;
        //$category = $req->category;
        //if(!$category) $category = $req->name;
        //if($id>0)
        $rows = DB::table("product_types as d")->where('d.id',$id)->where('d.branch_id',$branch_id)->selectRaw('d.id,d.name,d.create_user')->take(1)->get();
        //else $rows = DB::table("product_types as d")->where('d.name',$category)->where('branch_id',$branch_id)->selectRaw('d.id,d.name,d.create_user')->take(1)->get();  
        return  JDV::result(isset($rows[0])?$rows[0]:null);

    }
 
    //After saving catgory = > apply update to other user table such table "order", "package"
    function updateCatgory($branch_id,$id,$category){
        $cat = getDataRow("product_types",["id"=>$id],"name");
        if(!$cat) return JDV::error("category ID is not valid");
        $old_category = $cat->name;
        //if(!$old_category) return JDV::error("Old category cannot be empty");
        DB::table('order')->where('product_type',$old_category)->where('branch_id',$branch_id)->update([
            'product_type'=>$category
        ]);
        DB::table('package')->where('product_type',$old_category)->where('branch_id',$branch_id)->update([
            'product_type'=>$category
        ]);
        return JDV::success();
    }
}
