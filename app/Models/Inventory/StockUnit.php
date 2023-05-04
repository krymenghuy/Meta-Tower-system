<?php

namespace App\Models\Inventory;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use DB;

class StockUnit //extends Model
{
    //use HasFactory;
    protected static $unit_name =null;
    protected $item_code =null;
    protected $id = null;
    protected $userInfo = null;
     
    function __construct($id=null,$userInfo=null){
         $this->id = $id;
         $this->userInfo = $userInfo;
    }
  
    function getUserInfo(){
        return $this->userInfo;
    }

    function getId(){
        return $this->id;
    }

    function getByName($unit_name,$ss=null){
       $ss = $ss? $ss:$this->getUserInfo(); 
       $rows = DB::table('inv_units AS u')->where('u.name',$unit_name)->select('u.id')->take(1)->get();
       foreach($rows as $row){
        return new StockUnit($row->id,$ss);
       }
      return null;
    }
     
    // static function getItemId($item_code){
    //     return getDataRow("inv_items",["item_code"=>$item_code,"id"]);
    // }

    //NOTE:  $id_or_name is unit_name or unit_id
    static function existsByItemCode($item_code,$id_or_name=null){
        $item_id = self::getItemId($item_code);
        return self::existsByItemId($item_id,$id_or_name);
    }

    //NOTE:  $id_or_name is unit_name or unit_id
    static function existsByItemId($item_id,$id_or_name=null){
        if($id_or_name > 0){
          return DB::table('inv_units as u')->where('item_id',$item_id)->where('u.id',$id_or_name)->select("id")->take(1)->exists();
        }else{
          return DB::table('inv_units as u')->where('item_id',$item_id)->where('u.name',$id_or_name)->select("id")->take(1)->exists();
        }
    }

    static function info($unit_name=null){
        if(!$unit_name) $unit_name = self::$unit_name;
        $rows = DB::table("inv_units as u")->where('u.name',$unit_name)->selectRaw("u.id,u.name,u.description")->take(1)->get();
        return (isset($rows[0])?$rows[0]:null);
    }

    function getInfo($unit_name=null){
        if(!$unit_name) $unit_name = self::$unit_name;
        $rows = DB::table("inv_units as u")->where('u.name',$unit_name)->selectRaw("u.id,u.name,u.description")->take(1)->get();
        return (isset($rows[0])?$rows[0]:null);
    }

    // @param $sku can be unit_id or sku (unit name)
    //returns qty in the given unit, regardless the item's unit being saved in the database table. 
    function countUnit($sku){
       return null;    
    }
 
    function contains($child_unit_name=null){
       if(!$child_unit_name) return false; 
       $rows = DB::table("inv_units as pu")->join("inv_units as u","pu.id","=","u.parent_unit_id")->where('pu.name',$self::$unit_name)->where("u.name",$child_unit_name)->selectRaw('id')->take(1)->get();
       return isset($rows[0])?true:false; 
    }
    
    //given a sub unit name, it returns quanity in terms of that sub unit per 1 current parent unit determined by self::$unit_name
    //returns negative (-1) then the given sub_unit_name is not contained in the current parent unit self:$unit_name,
    //returns 0 when there is no sub_unit supplied
    function getQty($sub_unit_name){
        if(!$sub_unit_name) return 0;
        $rows = DB::table("inv_units as u")->join("inv_units as pu",'pu.id','=','u.parent_unit_id')->where("u.name",self::$sub_unit_name)->where("pu.name",self::$unit_name)->selectRaw("u.qty")->take(1)->get();
        if(!isset($rows[0])){
             return -1;
        }else{
            return is_numeric($rows[0]->qty)?$rows[0]->qty:0;
        }
    }

    //it returns quantity in terms of immediate sub_unit. It returns object {sub_unit_qty: number,sub_unit_name: string,unit_name:string,qty:number}
    function getQtyInfo($qty=1){
       ////*** For item code "D0001", does item_code "D0001" has a unit named "bottle"?
       //StockUnit::getByItemCode("D0001","bottle")
       ////*** For item code "D0001", how many pills are there in one bottle?
       //StockUnit::getByItemCode("D0001","bottle")->getQty("pill");
       return 0;
    }
}
