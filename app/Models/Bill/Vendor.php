<?php

namespace App\Models\Bill;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;

class Vendor //extends Model
{
   protected $id =null;
   protected $userInfo =null;
   
   function __construct($id=null,$userInfo=null){
     $this->id = $id;
     $this->userInfo = $userInfo;
   }
   function getId(){
    return $this->id;
   }
   function getUserInfo(){
     return $this->userInfo;
   }

   //Use HasFactory;
   function save($arr,$id=null,$ss=null){
       $id = $id?$id:$this->getId();
       $ss = $ss?$ss:$this->getUserInfo();
       $v_rule = [
        'id'=>"0|number|identity=1",
         "name"=>"1|string|1-100",
         "vendor_type_id"=>"1|number|exists=vendor_types.id|text=Vendor Type is not valid",
         "tax_number"=>"0|string|0-30",
         "phone_number"=>"1|phone|0-50",
         "email"=>"0|string|0-100",
         "address"=>"0|string|0-250",
         "photo"=>"0|image"
       ];
       $branch_id = $ss->branch_id;
       $unique = ["$branch_id|vendors|name,phone_number,email|id"];
       $res = validateObject($arr,$v_rule,true,['email'=>['@','.','-'],$ss->lang,false,$unique]);
       if($res->error) return DV::error($res->error);
       $inputs = $res->values;
       $id = $res->id;
       $image = $inputs['photo'];
       unset($inputs['photo']);
       $id = saveData($ss,"vendors",["id"=>$id],$inputs,[],1);
       if($id){
        if($image){
              $res = PublicStorage::saveProfilePicture($ss,"vendor",null,$image,null,['id'=>$id,'store'=>"vendors.photo_file_name"]);
              if($res->status ==='OK') $inputs['image_url'] = $res->image_url;

        }  
       }
       return DV::depends($id,['id'=>$id,'vendor'=>$inputs],"Something went wrong in saving vendor");
   }

   function delete($id=null,$ss=null){
      $ss = $ss?$ss:$this->getUserInfo();
      $id = $id?$id:$this->getId();
      DB::table("vendors")->where('id',$id)->delete();
      return DV::depends(true,self::list([],$ss)); 
   }

   static function list($arr=[],$ss=null){
      $branch_id = $ss->branch_id;
      $cols =["d.id","d.name","d.phone_number","d.person_id","d.email","d.address","d.vendor_type_id","t.description as vendor_type"];
      return Db::table("vendors as d")->join('vendor_types as t','t.id','=','d.vendor_type_id')->where('d.branch_id',$branch_id)->select($cols)->orderBy('name','ASC')->get(); 
   }
 
   function getList($arr=[],$ss=null){
     $ss = $ss?$ss:$this->getUserInfo();
     return self::list($arr,$ss);
   }

   static function details($id,$ss){
    $branch_id = $ss->branch_id;
    $cols =["d.id","d.name","d.phone_number","d.person_id","d.email","d.address","d.vendor_type_id","t.description AS vendor_type"];
    $rows =  Db::table("vendors as d")->join('vendor_types as t','t.id','=','d.vendor_type_id')->where('d.id',$id)->where('d.branch_id',$branch_id)->select($cols)->orderBy('name','ASC')->take(1)->get();
    return isset($rows[0])?$rows[0]:null;
   }

}
