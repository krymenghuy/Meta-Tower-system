<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
//use Carbon\Carbon;
//use Sanitizer;
use DB;

class CompanyProfile //extends Model
{
  //use HasFactory;
   protected $userInfo = null;
   protected static $logo_dir ="identity";
   protected static $img_dir ='brand-images';

   function __construct($userInfo=null){
      $this->userInfo = $userInfo;
   }

   function getUserInfo(){
    return $this->userInfo;
   }

    static function saveDetails($arr, $ss) {
        $branch_id = $ss->branch_id;
        $validate_rule = [
            'name'=>'1|string|1-150',
            'name_kh'=>'0|string|0-150',
        'phone_number'=>'1|phone|0-80',
        'email'=>'0|email|0-100',
        'first_cp_name'=>'0|string|0-100',
        'second_cp_name'=>'0|string|0-100',
        'address'=>'0|string|0-250',
        'address_kh'=>'0|string|0-250',
        'first_cp_phone'=>'0|phone|0-50',
        'second_cp_phone'=>'0|phone|0-50',
        'logo'=>'0|image'

        ];
     $res = validateObject($arr,$validate_rule,true,['email'=>['.','-','@']],$ss->lang,false,[]);
     if($res->error) return DV::error($res->error);
     $inputs = $res->values;
     $logo = $inputs['logo'];
     unset($inputs['logo']);

     $address_kh = $inputs['address_kh'];
     if(!$address_kh) $inputs['address_kh'] = $inputs['address'];

     $name_kh = $inputs['name_kh'];
     if (!$name_kh) $inputs['name_kh'] = $inputs['name'];
     $id = saveData($ss,'um_branches',['branch_id'=>$branch_id],$inputs,[],0);
     if($id){
       if($logo) PublicStorage::saveImage($branch_id,self::$logo_dir,null,$logo,['branch_id'=>$branch_id,'store'=>'um_branches.logo_file_name']);
     }
     return DV::depends($id,null,'Failed to update company information');
   }

   function getDetails($ss) {
      $ss = $ss?$ss:$this->getUserInfo();
      $branch_id = $ss->branch_id;
      $rows = DB::table('um_branches')->where('branch_id',$branch_id)->selectRaw("branch_id,name,name_kh,`address`,address_kh,phone_number,email,first_cp_name,second_cp_name,first_cp_phone,second_cp_phone")->take(1)->get();
      foreach($rows as $row) {
        $row->logo_url =self::logoUrl($ss);
        return $row;
      }
      return null;
   }

  static function details($branch_id) {
    $rows = DB::table('um_branches')->where('branch_id',$branch_id)->selectRaw("branch_id,name,name_kh,`address`,address_kh,phone_number,email,first_cp_name,second_cp_name,first_cp_phone,second_cp_phone")->take(1)->get();
    foreach($rows as $row) {
      $row->logo_url =self::logoUrl((object)['branch_id'=>$branch_id]);
      return $row;
    }
    return null;
 }
  /** Start Save  and retrieve company's logo **/
  static function saveLogo($d,$ss)
  {
    $branch_id = $ss->branch_id;
	  $file_type = isset($d['file_type'])?$d['file_type']:'png';
    $photo = isset($d['photo_data'])?$d['photo_data']: (isset($d['photoData'])?$d['photoData']:null);

    $logo_file_name = DB::table('um_branches')->where('branch_id',$branch_id)->selectRaw('logo_file_name')->take(1)->value('logo_file_name');
    //if($logo_file_name) PublicStorage::delete($branch_id,self::$logo_dir,'image',$logo_file_name);
    $maxSize =500;
	  $res = PublicStorage::saveImage($branch_id,self::$logo_dir,$file_type,$photo,$maxSize);
    if($res->status ==='OK'){
      DB::table('um_branches')->where('branch_id',$branch_id)->update(['logo_file_type'=>$res->extension,'logo_file_name'=>$res->file_name]);
      $url = PublicStorage::getUrl($branch_id,self::$logo_dir ,'image').$res->file_name;
      return DV::depends(1,['logo_url'=>$url]);
    }else return DV::error($res->error_message);

  }

  static function logoUrl($ss){
    $branch_id = 0;
    if(is_numeric($ss)) $branch_id  = $ss;
    else $branch_id = $ss->branch_id;
    $branch = getDataRow('um_branches',['branch_id',$branch_id],"logo_file_name");
    if(!$branch) return null;
    return PublicStorage::getUrl($branch_id,self::$logo_dir,'image').$branch->logo_file_name;
  }

  function getLogoUrl($ss=null)
  {
     $ss = $ss?$ss:$this->getUserInfo();
     return self::logoUrl($ss);
  }

  static function deleteLogo($ss)
  {
     //$ss = $ss?$ss:$this->getUserInfo();
     $branch_id = $ss->branch_id;
     $rows = DB::table('um_branches')->where('branch_id',$branch_id)->selectRaw('logo_file_name')->take(1)->get();
     foreach($rows as $row) PublicStorage::delete($branch_id,self::$logo_dir,'image',$row->logo_file_name);
     DB::table('um_branches')->where('branch_id',$branch_id)->update(array('logo_file_type'=>null,'logo_file_name'=>null));
     return DV::success();
  }
}
