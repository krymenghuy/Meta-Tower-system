<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;

class ItemGroup extends Model
{
    use HasFactory;

    //Lengnth of the item_group code or Item Code Number
    static protected $official_code_length =5;
    static function list($ss,$d){
        $branch_id = $ss->branch_id;
        $str_search ="1=1";
        $search_value = isset($d['search_value'])?$d['search_value']:null;
        $search_value = escape_like_str($search_value);
        if($search_value){
            $str_search ="(g.name LIKE '%$search_value%')";
        }
        $cols = "g.id,g.name,g.description,g.create_user,formatDate(g.created_at) as created_at";
        return DB::table("inv_item_groups as g")->where('g.branch_id',$branch_id)->whereRaw($str_search)->selectRaw($cols)->orderByRaw("g.name ASC")->get();
        
    }

   //group_in_use()| groupInUse() 
   static function inUse($branch_id,$group_id){
     $rows = DB::table('inv_items as i')->where('i.group_id',$group_id)->selectRaw("i.id")->take(1)->get();
     foreach($rows as $row) return true;
     return false; 
   }

   static function commitDelete($ss,$id){
      $branch_id = $ss->branch_id;
      if(self::inUse($branch_id,$id)) return DV::error("Cannot delete group that is already in use");
      $x = DB::table('inv_item_groups')->where('id',$id)->where('branch_id',$branch_id)->delete();
      //if ($x) 
      return DV::success();
      //else return DV::error("Failed to delete inventory group");
   }

   static function details($ss,$id){
        $branch_id = $ss->branch_id;
        $cols = "g.id,g.name,g.description,g.create_user,formatDate(g.created_at) as created_at";
        $rows =  DB::table("inv_item_groups as g")->where('g.id',$id)->where('g.branch_id',$branch_id)->selectRaw($cols)->take(1)->get();
        return isset($rows[0])?$rows[0]:null; 
   }
 
   static function codeInUse($branch_id,$code,$id=0){
     if(!$code) return false;
     $str_where ="code ='$code'";
     if($id>0) $str_where .=" AND id <> $id";
     $rows = DB::table('inv_item_groups')->where('branch_id',$branch_id)->whereRaw($str_where)->select('id')->take(1)->get();
     return isset($rows[0])?true:false;
   }

   static function commitSave($ss,$d){
    $branch_id = $ss->branch_id;
    $validate_rule = [
        'id'=>'0|number|identity=1',
        'code'=>'0|string|3-20|',
        'name'=>'1|string|1-150|text=Group name cannot be empty',
        'description'=>'0|string',
        'category_id'=>'1|positive|exists=inv_categories.id|default=1',
        'unit_id'=>'0|number|exists=inv_units.id'
    ];
    $check_unique = ["$branch_id|inv_item_groups|name|id=id|text=Group ? already exists::@name"];
    $res = validateObject($d,$validate_rule,true,[],$ss->lang,false,$check_unique);
    if($res->error) return DV::error($res->error);
    $inputs = $res->values;
    $id = $res->id;

    $code = $inputs['code'];
    if($code){
       if(self::codeInUse($branch_id,$code,$id)) return DV::error("Item code $code is already in use");
    }
   
    $group_prefix = strtoupper(substr($inputs['name'],0,3));

    $id = saveData($ss,'inv_item_groups',['id'=>$id],$inputs,[],1);
    if($id > 0){
      
        setOfficialCode($branch_id,'inv_group_code_control','inv_item_groups',['id'=>$id],$group_prefix,self::$official_code_length,null); 
        return DV::success(['id'=>$id]);
    }

    return DV::error("Something went wrong during saving item group");
  }


}
