<?php

namespace App\Models\Inventory;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use DB;
use App\Models\DV;

class ItemGroup //extends Model
{
    //use HasFactory;

    //Lengnth of the item_group code or Item Code Number
    static protected $official_code_length =5;
    protected $id =null;
    protected $userInfo = null;

    function __construct($id=null,$userInfo=null){
         $this->id = $id;
         $this->userInfo = $userInfo;
    }

    static function list($d,$ss){
        $branch_id = $ss->branch_id;
        $str_search ="1=1";
        $search_value = isset($d['search_value'])?$d['search_value']:null;
        $search_value1 = escape_like_str($search_value);
        if($search_value1){
            $str_search ="(g.code ='$search_value1' OR g.name LIKE '%$search_value1%')";
        }
        $cols = "g.id,g.code,g.name,g.description,g.create_user,g.sku,g.unit_id, g.brand_name,g.manufacturer_id,formatDate(g.created_at) as created_at";
        return DB::table("inv_item_groups as g")->where('g.branch_id',$branch_id)->whereRaw($str_search)->selectRaw($cols)->orderByRaw("g.name ASC")->get(); 
    }

    static function list_paginate($d,$ss){
        $branch_id = $ss->branch_id;
        $str_search ="1=1";
        $search_value = isset($d['search_value'])?$d['search_value']:null;
        $current_page = isset($d['current_page'])?$d['current_page']:1;
        $per_page = isset($d['per_page'])?$d['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page-1) * $per_page;

        $search_value1 = escape_like_str($search_value);
        if($search_value1){
            $skip_rows=0;
            $str_search ="(g.code ='$search_value1' OR g.name LIKE '%$search_value1%')";
        }
        $cols = "g.id,g.code,g.name,g.description,g.create_user,g.sku,g.unit_id, g.brand_name,g.manufacturer_id,formatDate(g.created_at) as created_at";
        $query = DB::table("inv_item_groups as g")->where('g.branch_id',$branch_id)->whereRaw($str_search)->selectRaw($cols)->orderByRaw("g.name ASC");
        $count_query = clone $query;
        $count = $count_query->count('g.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
 
   //group_in_use()| groupInUse() 
   static function inUse($branch_id,$group_id){
     $rows = DB::table('inv_items as i')->where('i.group_id',$group_id)->where('i.branch_id',$branch_id)->selectRaw("i.id")->take(1)->get();
     foreach($rows as $row) return true;
     return false; 
   }

    function delete($id=null,$ss=null){
      $id = $id?$id:$this->id;
      $ss = $ss?$ss:$this->userInfo;  
      $branch_id = $ss->branch_id;
      if(self::inUse($branch_id,$id)) return DV::error("Cannot delete group that is already in use");
      $x = DB::table('inv_item_groups')->where('id',$id)->where('branch_id',$branch_id)->delete();
      //if ($x) 
      return DV::success();
      //else return DV::error("Failed to delete inventory group");
   }

   static function details($id,$ss){
        $branch_id = $ss->branch_id;
        $cols = "g.id,g.code,g.unit_id,g.sku,g.category_id,g.name,g.description, g.brand_name,g.manufacturer_id, g.create_user,formatDate(g.created_at) as created_at";
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

  function save($d=[],$id=null,$ss=null){
    $ss = $ss?$ss:$this->userInfo;
    $id = $id?$id:$this->id;
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
    if(!$id) $id = $res->id;
    $is_create_case = (!$id || $id ==0);
    
    $code = $inputs['code'];
    if($code){
       if(self::codeInUse($branch_id,$code,$id)) return DV::error("Item code $code is already in use");
    }
   
    $group_prefix = strtoupper(substr($inputs['name'],0,3));
    $id = saveData($ss,'inv_item_groups',['id'=>$id],$inputs,[],1);
    if($id > 0 && $is_create_case){
        setOfficialCode($branch_id,'inv_group_code_control','inv_item_groups',['id'=>$id],$group_prefix,self::$official_code_length,null); 
    }
    return DV::depends($id,['id'=>$id],"Something went wrong during saving item group");
  }

  static function skuInfo($group_id=0,$ss=null){
      $branch_id = isset($ss)? $ss->branch_id:null;
      $str_branch = "1=1";
      if($branch_id>0) $str_branch ="branch_id =$branch_id";
      $rows = DB::table("inv_item_groups")->where('id',$group_id)->whereRaw($str_branch)->select("unit_id","sku","cost")->take(1)->get();
      return isset($rows[0])?$rows[0]:null;
  }

  static function info($group_id=0,$ss=null){
      $branch_id = isset($ss)? $ss->branch_id:null;
      $str_branch = "1=1";
      if($branch_id>0) $str_branch ="branch_id =$branch_id";
      $rows = DB::table("inv_item_groups")->where('id',$group_id)->whereRaw($str_branch)->select("unit_id","sku","cost","selling_price","ws_selling_price")->take(1)->get();
      return isset($rows[0])?$rows[0]:null;
  }

  static function form_options($ss){
    $branch_id = $ss->branch_id;
    $data = (object)[];
    $data->categories = DB::table('inv_categories')->where('branch_id',$branch_id)->selectRaw("id,name as category")->orderByRaw("name ASC")->get();
    $data->units = DB::table('inv_units')->where('branch_id',$branch_id)->selectRaw("id,name as unit_name")->orderByRaw("name ASC")->get();
    return $data;
  }

}
