<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
//use Carbon\Carbon;
//use Sanitizer;
//use Illuminate\Support\Facades\Cache;
use XSubscription;
use XPublicStorage;
use DB;
use DBX;
use DV;

class CompanyProfile //extends Model
{
  //use HasFactory;
   protected $userInfo = null;
   protected static $logo_dir ="identity";
   protected static $img_dir ='brand-images', $soc_media_img_dir ='social_media';

   function __construct($userInfo=null){
      $this->userInfo = $userInfo;
   }

   function getUserInfo(){
    return $this->userInfo;
   }

    static function saveDetails($arr, $ss)
{
    //$subs_id = $ss->subs_id;
    $customer_id = $ss->subscriber_id;
    if (!$customer_id){
      return DV::error('Customer ID is not found!');
    }
    $bin_customer_id = hex2bin($customer_id);
    $validate_rule = [
      'name' => '1|string|1-150',
      'name_kh' => '0|string|0-150',
      'phone_number' => '1|phone|0-80',
      'email' => '0|email|0-100',
      'first_cp_name' => '0|string|0-100',
      'second_cp_name' => '0|string|0-100',
      'address' => '0|string|0-250',
      'address_kh' => '0|string|0-250',
      'first_cp_phone' => '0|phone|0-50',
      'second_cp_phone' => '0|phone|0-50',
      'logo' => '0|image'
    ];

    $res = DBX::validateObject($arr, $validate_rule, true, ['email' => ['.', '-', '@'], 'address' => ['.', '-', ',', '#']], $ss->lang, false, []);
    if ($res->error)
      return DV::error($res->error);
    $inputs = $res->values;
    $logo = $inputs['logo'];
    unset($inputs['logo']);

    $address_kh = $inputs['address_kh'];
    if (!$address_kh)
      $inputs['address_kh'] = $inputs['address'];

    $name_kh = $inputs['name_kh'];
    if (!$name_kh)
      $inputs['name_kh'] = $inputs['name'];
     $customer_id = DBX::saveData($ss, 'um_customers',['id'=>$bin_customer_id], $inputs, [], 0, 'binary');
    if ($customer_id) {
      if ($logo)
        XPublicStorage::saveImage(['subs_id' => $ss->subs_id, 'branch_id' => $ss->branch_id, 'dir_name' => self::$logo_dir], null, $logo, ['id' => $customer_id, 'store' => 'um_customers.logo_file_name']);
    }
    return DV::depends($customer_id, null, 'Failed to update company information');
  }



   static function contactInfo($ss){
    $subs_id = $ss->subs_id;
    $subs = XSubscription::props($subs_id,DBX::getHEX('customer_id','customer_id'));
    $subscriber_id = $ss->subscriber_id ?? ($subs? $subs->customer_id : null);
    $bin_customer_id = null;
    if($subscriber_id) $bin_customer_id =  $subscriber_id;
    if (!$bin_customer_id) return null;
    $links = DB::table('social_media as l')->where('l.customer_id',$bin_customer_id)->selectRaw('l.id,l.name,l.url, NULL AS image_url')->get();
    $row = DB::table('um_customers as c')->where('c.id',$bin_customer_id)->selectRaw('c.phone_number, c.email,c.address,c.address_kh, \'\' AS map_url')->first();
    //$contacts = DB::table('contacts as c')->where('c.customer_id',$bin_customer_id)->selectRaw("c.id,c.contact_by,c.contact_type")->get();
    return (object)[
      'links'=>$links,
      'contact_info'=>$row
    ];
  }

  static function socialMediaList($ss){
    $customer_id = $ss->subscriber_id ?? null;
    $branch_id = null;
    if(!$customer_id){
       $subs_id = $ss->subs_id ?? null;
       if($subs_id != null) {
           $row = DB::table('um_subscriptions as s')->where('s.id',hex2bin($subs_id))->selectRaw(DBX::getHex('s.customer_id','customer_id'))->first();
           if($row != null) $customer_id = $row->customer_id;
       }
    }
    if(!$customer_id) return [];
    $bin_customer_id = hex2bin($customer_id);
    $rows = DB::table('social_media')->where('customer_id',$bin_customer_id)->selectRaw('file_name,name,url,id')->get();
    foreach($rows as $row){
        if($row->file_name != null){
            $row->image_url = XPublicStorage::getUrl(['subs_id'=>$ss->subs_id,'branch_id'=>$branch_id,'dir'=>self::$soc_media_img_dir],'image').$row->file_name;
        }else  $row->image_url = $row->file_name;
        unset($row->file_name);
    }
    return $rows;
}

  static function connectWithUs($ss){
      $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
      $subs = XSubscription::props($subs_id,DBX::getHEX('customer_id','customer_id'));
      $subscriber_id = $ss->subscriber_id ?? ($subs? $subs->customer_id : null);
      $bin_customer_id = null;
      if($subscriber_id) $bin_customer_id =  hex2bin($subscriber_id);
      if (!$bin_customer_id) return null;
     $col_phone1 = DBX::ifNull('b.phone_number1','b.phone_number','phone_number1');
     $row = DB::table('um_customers as b')->where('b.id',$bin_customer_id)->selectRaw('b.phone_number, '.$col_phone1.',b.website,b.email,b.address,b.address_kh,\'\' AS map_url')->first();
     if(!$row) return null;
     $ss->subscriber_id = $subs->customer_id;
     return (object)[
          'contact_info'=>$row,
          'social_media_list'=>self::socialMediaList($ss)
     ];
  }

   function getDetails($ss) {
      $ss = $ss ?? $this->userInfo;
      $customer_id = $ss->subscriber_id;
      if(!$customer_id) return null;
      $bin_customer_id = hex2bin($customer_id);
      $col_customer_id = DBX::getHEX('id','id');
      $row = DB::table('um_customers')->where('id',$bin_customer_id)->selectRaw($col_customer_id.',name,name_kh,`address`,address_kh, phone_number,email,first_cp_name,second_cp_name,first_cp_phone,second_cp_phone')->first();
      if (!$row) return null;
      $row->logo_url =self::logoUrl($ss);
      return $row;
   }

  static function details($ss) {
    $customer_id = $ss->subscriber_id;
    if(!$customer_id) return null;
    $bin_customer_id = hex2bin($customer_id);
    $col_customer_id = DBX::getHEX('id','id');
    $row = DB::table('um_customers')->where('id',$bin_customer_id)->selectRaw($col_customer_id.",name,name_kh,`address`,address_kh,phone_number,email,first_cp_name,second_cp_name,first_cp_phone,second_cp_phone")->first();
    if(!$row) return null;
      $row->logo_url =self::logoUrl($ss);
      return $row;
 }

  /** Start Save  and retrieve company's logo **/
  static function saveLogo($d,$ss)
  {
    //$branch_id = null; // $ss->branch_id;
    $customer_id = $ss->subscriber_id;
    if(!$customer_id) return DV::error('Invalid subscriber ID');
    $bin_customer_id = hex2bin($customer_id);

	  $file_type = isset($d['file_type'])?$d['file_type']:'png';
    $photo = isset($d['photo_data'])?$d['photo_data']: (isset($d['photoData'])?$d['photoData']:null);
    $delete_photo = (!$photo || isImage($photo));
    $logo_file_name = DB::table('um_customers')->where('id',$bin_customer_id)->selectRaw('logo_file_name')->value('logo_file_name');
    if ($delete_photo){
      XPublicStorage::delete (['subs_id'=>$ss->subs_id, 'branch_id'=>null,'dir'=>self::$logo_dir],'image',$logo_file_name);
    }
    $maxSize =500;
	  $res = XPublicStorage::saveImage(['subs_id'=>$ss->subs_id,'branch_id'=>null,'dir'=>self::$logo_dir],$file_type,$photo,$maxSize,['id'=>$bin_customer_id,'store'=>'um_customers.logo_file_name']);
    if($res->status ==='Error') return DV::error($res->error_message);
    return DV::depends(1);
  }

  static function logoUrl($ss){
    $customer_id = $ss->subscriber_id;
    if(!$customer_id) return "";
    $bin_customer_id = hex2bin($customer_id);
    $branch = DB::table('um_customers')->where('id',$bin_customer_id)->selectRaw('logo_file_name')->first();
    if(!$branch) return "";
    $url = XPublicStorage::getUrl(['subs_id'=>$ss->subs_id, 'branch_id'=>null,'dir'=>self::$logo_dir],'image').$branch->logo_file_name;
    return ValidateUrl($url,'');
  }

  function getLogoUrl($ss=null)
  {
    $ss = $ss ?? $this->userInfo;
    return self::logoUrl($ss);
  }

  static function deleteLogo($ss)
  {
    $customer_id = $ss->subscriber_id;
    if(!$customer_id) return DV::error('invalid subscriber ID');
    $bin_customer_id = hex2bin($customer_id);
    $branch_id = null;

     $row = DB::table('um_customers')->where('id', $bin_customer_id)->selectRaw('logo_file_name')->first();
     if($row) XPublicStorage::delete(['subs_id'=>$ss->subs_id,'branch_id'=>$branch_id,'dir_name'=>self::$logo_dir],'image',$row->logo_file_name);
     DB::table('um_customers')->where('id',$bin_customer_id)->update(array('logo_file_name'=>null));
     return DV::depends(1);
  }
}
