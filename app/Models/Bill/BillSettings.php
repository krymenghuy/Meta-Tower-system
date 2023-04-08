<?php

namespace App\Models\Bill;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;

class BillSettings //extends Model
{
    //use HasFactory;
    static function options_vendor_type($ss){
      return DB::table('vendor_types')->select(['id','description as vendor_type'])->get();
    }

    //$arr = ['vendor_type','id']
    static function saveVendorType($arr,$ss){
       $d= (object)$arr;
       $res = validateObject($arr,['id'=>'0|number|identity=1','name'=>'1|string|1-50']);
       if($res->error) return DV::error($res->error);
       $id = $res->id;
       $id = saveData($ss,'vendor_types',['id'=>$id],['description'=>$res->values['name']],[],1);
       return DV::depends($id,['items'=>self::options_vendor_type($ss),'id'=>$id],"Something wrong in saving vendor type"); 
    }

    static function deleteVendorType($id,$ss=null){
      $x = DB::table('vendor_types')->where('id',$id)->delete(); 
      return DV::depends(true,self::options_vendor_type($ss),"Failed to delete vendor type"); 
   }
}
