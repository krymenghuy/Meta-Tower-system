<?php

namespace App\Models\Inventory;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use DB;
class UOM //extends Model
{
    //use HasFactory;
    protected $uom = null, $item_id = null, $userInfo = null;
    protected $id = null;
    function __construct($item_id=null,$uom=null,$userInfo=null){
        $this->item_id = $item_id;
        $this->uom = $uom;
        $this->userInfo = $userInfo;
        $this->id = DB::table("inv_units")->where("uom",$uom)->where("item_id",$item_id)->value("id");
    }
    
    static function getUnitId($uom,$item_id){
        return DB::table("inv_units")->where("uom",$uom)->where("item_id",$item_id)->value("id");
    }

    function children($uom=null){
       $item_id = $this->item_id;
       //$parent_uom = $this->uom;
       //$parent_uint_id = self::getUnitId($parent_uom,$item_id);
       if($uom)
        return DB::table('inv_units')->where('item_id',$item_id)->where('parent_unit_id',$this->id)->where('uom',$uom)->take(1)->selectRaw("qty,uom as name,item_id")->get()->first();
       else return DB::table('inv_units')->where('item_id',$item_id)->where('parent_unit_id',$this->id)->selectRaw("id,uom as name,qty,item_id")->get();     
    }

    /**
     * add Child UOM by specifiying its name, and 
     * ***/
    function addChild($name,$qty=1,$ss=null){
       $id = $this->id;
       $ss = $ss?$ss:$this->userInfo;
       if(!$id) return DV::error("Failed to identify parent unit ID");
       $new_id = saveData($ss,"inv_units",['id'=>null],["uom"=>$name,"qty"=>$qty,"parent_unit_id"=>$id],[],1,true);
       return DV::depends($new_id,['id'=>$new_id],"Failed to create child UOM");
    }
    
    /**
     * save() is to update or create UOM. $arr = ['name','qty','parent_unit_id' or 'parent_uom']
     * json param can be {'name':"bottle","qty":10,"parent_uom":"box"}
     * **/
    function save($arr,$id=null,$ss=null){
      $id = $id?$id:$this->id;
      $ss = $ss?$ss:$this->userInfo;
      $item_id = $arr['item_id'];
      $name = $arr['name'];
      $parent_uom = null;
      $parent_unit_id = isset($arr['parent_unit_id'])?$arr['parent_unit_id']:null;
      if(!$parent_unit_id){
        $parent_uom = isset($arr['parent_uom'])?$arr['parent_uom']:null;
        if($parent_uom)  $parent_unit_id = self::getUnitId($parent_uom,$item_id);
      }
 
      
      $qty = $arr['qty'];
      $id = self::getUnitId($name,$item_id);
      $new_id = saveData($ss,"inv_units",['id'=>$id],['item_id'=>$item_id,'uom'=>$name,"qty"=>$qty,"parent_unit_id"=>$parent_unit_id],[],1,true); 
      return DV::depends($new_id,['id'=>$new_id],"Failed to save UOM");
    }

    function delete($id=null,$ss=null){
        $id = $id?$id:$this->id;
        $ss = $ss?$ss:$this->userInfo;
        //$item_id = $this->item_id;
        DB::table('inv_units')->where('id',$id)->delete();
        return DV::success();
    }
    
    function deleteChild($name){
        $id = $id?$id:$this->id;
        $ss = $ss?$ss:$this->userInfo;
        $item_id = $this->item_id;
        DB::table("inv_units")->where('uom',$name)->where('item_id',$item_id)->delete();
        return DV::success();
    }
}
