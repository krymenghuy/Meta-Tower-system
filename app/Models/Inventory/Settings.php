<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
//use App\Models\UM;
use DB;

//begin:: Inventory Settings class
class Settings extends Model
{
    use HasFactory;
    protected static $item_class ='MI';

    static function options_group($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_item_groups as g')->where('g.branch_id',$branch_id)->where('g.item_class',self::$item_class)->selectRaw("g.id,g.name as group_name,g.description")->orderByRaw('g.name ASC')->get();
    }
    static function options_brand($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_brands as b')->where('b.branch_id',$branch_id)->where('b.item_class',self::$item_class)->selectRaw("b.id,b.name as brand_name")->orderByRaw('b.name ASC')->get();
    }
    static function options_category($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_categories')->where('branch_id',$branch_id)->where('item_class',self::$item_class)->selectRaw("id,name as category")->orderByRaw('name ASC')->get();
    }
    
    static function options_stockclass($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_stock_classes as c')->where('c.branch_id',$branch_id)->where('c.item_class',self::$item_class)->selectRaw("c.id,c.code,c.name as stock_class")->orderByRaw('c.name ASC')->get();
    }

    static function options_warehouse($ss){
        $branch_id = $ss->branch_id;
        return DB::table('warehouses as c')->where('c.branch_id',$branch_id)->select("c.id","c.name as warehouse_name")->orderByRaw('c.name ASC')->get();
    }

    static function options_unit($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_uom')->where('branch_id',$branch_id)->selectRaw("uom")->orderByRaw('uom ASC')->distinct()->get();
    }
    static function options_uom($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_uom')->where('branch_id',$branch_id)->selectRaw("uom")->orderByRaw('uom ASC')->get();
    }

    static function options_customer($ss){
        $branch_id = $ss->branch_id;
        return DB::table('customers as c')->where('c.branch_id',$branch_id)->join('partners as pn','pn.id','=','c.id')->selectRaw("c.id,pn.name as customer_name")->orderBy('pn.name','ASC')->get();
        //for mClinic
        //return DB::table('customers as c')->where('c.branch_id',$branch_id)->select("c.id","c.name as customer_name")->orderBy('c.name','ASC')->get();
    }

    static function options_pmt_terms($ss){
        //$branch_id = $ss->branch_id;
        return [
            (object)['code'=>' net 30','description'=>'net 30'],
            (object)['code'=>' net 60','description'=>'net 60']
        ];
    }

    static function options_manufacturer($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_manufacturers as m')->where('m.branch_id',$branch_id)->where('item_class',self::$item_class)->selectRaw("m.id,m.name as manufacturer")->orderByRaw('m.name ASC')->get();
    }

    static function options_detail_type($category_id,$ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_detailed_types AS d')->where('d.category_id',$category_id)->where('item_class',self::$item_class)->where('d.branch_id',$branch_id)->selectRaw("d.id,d.name as detail_type")->orderByRaw('d.name ASC')->get();
    }
 
    static function item_form_options($ss){
        $branch_id = $ss->branch_id;
        $groups =  DB::table('inv_item_groups as g')->where('g.branch_id',$branch_id)->where('item_class',self::$item_class)->selectRaw("g.id,g.name as group_name,g.description")->orderByRaw('g.name ASC')->get();
        $units =  DB::table('inv_units as u')->where('u.branch_id',$branch_id)->selectRaw("u.id,u.name as unit_name,u.description")->orderByRaw('u.name ASC')->get();
        $categories =  DB::table('inv_categories')->where('branch_id',$branch_id)->where('item_class',self::$item_class)->selectRaw("id,name as category")->orderByRaw('name ASC')->get(); 
        $manufacturers = DB::table('inv_manufacturers as m')->where('m.branch_id',$branch_id)->where('item_class',self::$item_class)->selectRaw("m.id,m.name as manufacturer")->orderByRaw('m.name ASC')->get();
        $brands = DB::table("inv_brands as b")->where('b.branch_id',$branch_id)->where('item_class',self::$item_class)->selectRaw("b.id,b.name as brand_name")->orderBy('b.name','ASC')->get();
        return (object)[
            'groups'=>$groups,
            'units'=>$units,
            'brands'=>$brands,
            'categories'=>$categories,
            'manufacturers'=>$manufacturers
        ];
    }
    static function options_vendor($ss){
        $branch_id = $ss->branch_id;
        return DB::table('vendors AS d')->where('d.branch_id',$branch_id)->selectRaw("d.id,d.name as vendor_name")->orderByRaw('d.name ASC')->get();
    }
    static function options_item($ss){
        $branch_id = $ss->branch_id;
        return DB::table('inv_items AS i')->where('i.branch_id',$branch_id)->where('item_class',self::$item_class)->selectRaw("i.id as `value`,i.name as text")->orderByRaw('i.name ASC')->get();
    }

    static function receive_stock_form_options($ss){
        return (object)[
            "vendors"=>self::options_vendor($ss),
            "items"=>self::options_item($ss)
        ];
    }
    static function stock_tracking_options($ss){
       return (object)[
         "categories"=>self::options_category($ss),
         "stockclasses"=>self::options_stockclass($ss),
         "warehouses"=>self::options_warehouse($ss)
       ];
    }

    static function receive_vpo_options($ss){
        return (object)[
          "vendors"=>self::options_vendor($ss),
          "stockclasses"=>self::options_stockclass($ss),
          "warehouses"=>self::options_warehouse($ss),
          "items"=>self::options_item($ss)
        ];
     }

     static function invoice_form_options($ss){
        return (object)[
          "customers"=>self::options_customer($ss),
          "pmt_terms"=>self::options_pmt_terms($ss),
          "items"=>self::options_item($ss)
        ];
     }

    //CreateUnit()
    static function saveUOM($d,$ss){
        $branch_id = $ss->branch_id;
        $validate_rule = [
          'id'=>'0|identity=1',
          'uom'=>'1|string|1-25',
          'item_class'=>'1|choice|MI,RM,FG'
        ];
        
        $check_unique = ["$branch_id|inv_uom|uom;item_class|id=id|text=UOM name already exists"];
        $res = validateObject($d,$validate_rule,true,[],$ss->lang,false,$check_unique);
        if($res->error) return DV::error($res->error);
        $id = $res->id;
        $inputs = $res->values;
        $uom = $inputs["uom"];
        $id = saveData($ss,'inv_uom',['id'=>$id],['item_class'=>self::$item_class,'uom'=>$inputs['uom']],[],1);
        return DV::depends($id,['uom'=>$uom,"units"=>self::options_uom($ss)],"Failed to save UOM");
    }

    // static function saveUOM($ss,$d){
    //     if($ss->status_code !=200) return $ss; //user not authenticated
    //     $branch_id = $ss->branch_id;
    //     $validate_rule = [
    //       'id'=>'0|identity=1',
    //       'name'=>'1|string|1-25',
    //       'sub_uom'=>'0|string|1-25',
    //       'sub_uom_qty'=>'0|number|default=1'
    //     ];
        
    //     $check_unique = ["$branch_id|inv_uom|name|id=id|text=UOM name already exists"];
    //     $res = validateObject($d,$validate_rule,true,[],$ss->lang,false,$check_unique);
    //     if($res->error) return DV::error($res->error);
    //     $id = $res->id;
    //     $inputs = $res->values;
    //     $id = saveData($ss,'inv_uom',['id'=>$id],['item_class'=>self::$item_class,'uom'=>$inputs['uom'], 'parent_unit_id'=>null,'qty'=>1],[],1);
    //     if($id >0){
    //           $sub_unit_name = $inputs['sub_unit_name'];
    //           if($sub_unit_name){
    //             $row = getDataRow('inv_units',['branch_id'=>$branch_id,'name'=>$sub_unit_name],'id');
    //             $id1 = isset($row)?$row->id:0;
    //             $id1 = saveData($ss,'inv_units',['id'=>$id1],['item_class'=>self::$item_class,'name'=>$sub_unit_name, 'parent_unit_id'=>$id,'qty'=>$inputs['sub_unit_qty']],[],1);
    //           } 
              
    //     }
    //     return DV::success(['id'=>$id]);
    // }
 
    static function saveManufacturer($d,$ss){
        $branch_id = $ss->branch_id;
        $validate_rule = [
          'id'=>'0|number|identity=1',
          'name'=>'1|string|1-100'
        ];
        $check_unique = ["$branch_id|inv_manufacturers|name|id=id|text =manufacturer ? already exists::@name"];
        $res = validateObject($d,$validate_rule,true,[],$ss->lang,false,$check_unique);
        if($res->error) return DV::error($res->error);
        $id = $res->id;
        $inputs = $res->values;
        $inputs['item_class'] = self::$item_class;
        $id = saveData($ss,'inv_manufacturers',['id'=>$id],$inputs,[],1);
        return DV::depends($id,['manufacturers'=>self::options_manufacturer($ss),"id"=>$id],"Failed to save manufacturer");
    }

    static function saveBrand($d,$ss){
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;

        $validate_rule = [
          'id'=>'0|identity=1',
          'brand_name'=>'1|string|1-150'
        ];
        
        $check_unique = ["$branch_id|inv_brands|name|id=id|text =Brand name already exists"];
        $res = validateObject($d,$validate_rule,true,[],$ss->lang,false,$check_unique);
        if($res->error) return DV::error($res->error);
        $id = $res->id;
        $inputs = $res->values;
        $inputs['name'] = $inputs['brand_name'];
        unset($inputs['brand_name']);
        $inputs['item_class'] = self::$item_class;
        $id = saveData($ss,'inv_brands',['id'=>$id],$inputs,[],1);
        return DV::depends($id,['brands'=>self::options_brand($ss),"id"=>$id],"Failed to save brand name");
    }
 
    static function deleteBrand($id,$ss){
        if(self::brandInUse($id)) return DV::error("Brand is already in use");
           $x = DB::table("inv_brands")->where("id",$id)->delete();
        return DV::depends(1,['brands'=>self::options_brand($ss)]);
    }

    static function unitInUse($uom){
      return DB::table('inv_item_groups')->where('uom',$uom)->select("id")->take(1)->exists();
    }

    static function brandInUse($id){
        return DB::table('inv_item_groups AS g')->where('brand_id',$id)->select("id")->take(1)->exists();
    }
  
    static function manufacturerInUse($id){
        return DB::table('inv_items')->where('manufacturer_id',$id)->select("id")->take(1)->exists();
    }

    static function deleteUOM($uom,$ss){
      $branch_id = $ss->branch_id;  
      if(self::unitInUse($uom)) return DV::error("Cannot delete UOM that is already in use");  
      $x = DB::table('inv_uom')->where('uom',$uom)->where('branch_id',$branch_id)->delete();
      return DV::depends(1,["units"=>self::options_uom($ss)]);
    }
  
    static function deleteManufacturer($id,$ss){
        if(self::manufacturerInUse($id)) return DV::error("Cannot delete manufacturer that is already in use");  
        $x = DB::table('inv_manufacturers')->where('id',$id)->where('branch_id',$ss->branch_id)->delete();
        return DV::depends(1,["manufacturers"=>self::options_manufacturer($ss)]);
    }
}
