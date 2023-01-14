<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;

class Category extends Model
{
    use HasFactory;

    static function list($ss,$d){
        $branch_id = $ss->branch_id;
        $str_search ="1=1";
        $search_value = isset($d['search_value'])?$d['search_value']:null;
        $search_value = escape_like_str($search_value);
        if($search_value){
            $str_search ="(c.name LIKE '%$search_value%')";
        }
        $cols = "c.id,c.name,c.description,c.create_user,formatDate(c.created_at) as created_at";
        return DB::table("inv_categories as c")->where('c.branch_id',$branch_id)->whereRaw($str_search)->selectRaw($cols)->orderByRaw("c.name ASC")->get();    
    }

   //group_in_use()| groupInUse() 
   static function inUse($branch_id,$cat_id){
     $rows = DB::table('inv_item_groups as i')->where('i.category_id',$cat_id)->selectRaw("i.id")->take(1)->get();
     foreach($rows as $row) return true;
     return false; 
   }

   static function commitDelete($ss,$id){
      $branch_id = $ss->branch_id;
      if(self::inUse($branch_id,$id)) return DV::error("Cannot delete category that is already in use");
      $x = DB::table('inv_categories')->where('id',$id)->where('branch_id',$branch_id)->delete();
      //if ($x) 
      return DV::success();
      //else return DV::error("Failed to delete inventory group");
   }

   static function details($ss,$id){
        $branch_id = $ss->branch_id;
        $cols = "c.id,c.name,c.description,c.create_user,formatDate(c.created_at) as created_at";
        $rows =  DB::table("inv_categories as c")->where('c.id',$id)->where('c.branch_id',$branch_id)->selectRaw($cols)->take(1)->get();
        return isset($rows[0])?$rows[0]:null; 
   }
 
   static function commitSave($ss,$d){
    $branch_id = $ss->branch_id;
    $validate_rule = [
        'id'=>'0|number|identity=1',
        'name'=>'1|string|1-150',
        'description'=>'0|string',
        'item_class'=>'0|choice|RM,FG,MI|default=MI'
    ];
    //NOTE: @item_class = {RM,FG,MI} RM = "Raw Material", FG = "Finished Goods", MI ="Merchandising Item"
    $check_unique = ["$branch_id|inv_categories|name|id=id|text=Category already exists"];
    $res = validateObject($d,$validate_rule,true,[],$ss->lang,false,$check_unique);
    if($res->error) return DV::error($res->error);
    $inputs = $res->values;
    $id = $res->id;
    $id = saveData($ss,'inv_categories',['id'=>$id],$inputs,[],1);
    if($id > 0) return DV::success(['id'=>$id]);
    return DV::error("Something went wrong during saving item category");
  }


}
