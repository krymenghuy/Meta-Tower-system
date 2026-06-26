<?php

namespace App\Models;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
//use Carbon\Carbon;
//use Sanitizer;
use App\Models\Umt\Subscription;
use XPublicStorage;
use DB;
use Vsd\Database\DBX;
use DV;
use XSubscriber;
use XSubscription;

class CompanyProfile //extends Model
{
  //use HasFactory;
  protected $userInfo = null;
  protected static $logo_dir = "identity";
  protected static $img_dir = 'brand-images', $soc_media_img_dir = 'social_media';

  function __construct($userInfo = null)
  {
    $this->userInfo = $userInfo;
  }

  function getUserInfo()
  {
    return $this->userInfo;
  }

  //saveSubscriber() this is master account information for subscriber
  static function saveDetails($arr, $ss)
  {
    $cus = new XSubscriber();
    $res = $cus->upsert($arr,$ss);
    if($res->status === 'Error'){
       $res->error_message = 'Failed to update company information! Error information should be already logged for tracing';
    }
    return $res;
  }

  static function contactInfo($ss)
  {
    $subs_id = $ss->subs_id;
    $subs = Subscription::props($subs_id, DBX::getHEX('customer_id', 'customer_id'));
    $subscriber_id = $ss->subscriber_id ?? ($subs ? $subs->customer_id : null);
    $bin_customer_id = null;
    if ($subscriber_id)
      $bin_customer_id = $subscriber_id;
    if (!$bin_customer_id)
      return null;
    $links = DB::table('social_media as l')->whereRaw(DBX::whereBinary('l.customer_id',$subscriber_id))->selectRaw('l.id,l.name,l.url, NULL AS image_url')->get();
    $row = XSubscriber::firstBy(['_raw_'=>DBX::whereBinary('id',$subscriber_id)],'c.phone_number, c.email,c.address,c.address_kh, \'\' AS map_url');
    //$row = DB::table('um_customers as c')->whereRaw(DBX::whereBinary('c.id',$subscriber_id))->selectRaw('c.phone_number, c.email,c.address,c.address_kh, \'\' AS map_url')->first();
    //$contacts = DB::table('contacts as c')->where('c.customer_id',$bin_customer_id)->selectRaw("c.id,c.contact_by,c.contact_type")->get();
    return (object) [
      'links' => $links,
      'contact_info' => $row
    ];
  }

  static function socialMediaList($ss)
  {
    // $customer_id = $ss->subscriber_id ?? null;
    $str_customer_id = DBX::whereBinary('customer_id', $ss->subscriber_id);

    $branch_id = null;
    if (!$str_customer_id) {
      //  $subs_id = $ss->subs_id ?? null;
      $str_subs_id = DBX::whereBinary('s.id', $ss->subs_id);
      if ($str_subs_id != null) {
         $customer_id  = XSubscription::valueBy(['_raw_'=>$str_subs_id]);
         $row =  XSubscription::query()->alias('s')->whereRaw($str_subs_id)->selectRaw(DBX::getHex('s.customer_id', 'customer_id'))->first();
        //if ($row != null) $customer_id = $row->customer_id;
      }
    }
    if (!$customer_id)
      return [];
    $rows = DB::table('social_media')->whereRaw($str_customer_id)->selectRaw('file_name,name,url,id')->get();
    foreach ($rows as $row) {
      if ($row->file_name != null) {
        $row->image_url = XPublicStorage::getUrl(['subs_id' => $ss->subs_id, 'branch_id' => $branch_id, 'dir' => self::$soc_media_img_dir], 'image') . $row->file_name;
      } else
        $row->image_url = $row->file_name;
      unset($row->file_name);
    }
    return $rows;
  }

  static function connectWithUs($ss)
  {
    $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
    $subs = XSubscription::firstBy(['_raw_'=> DBX::whereBinary('id',$subs_id)], DBX::getHEX('customer_id', 'customer_id'));
    //$subscriber_id = $ss->subscriber_id ?? ($subs ? $subs->customer_id : null);
    $bin_customer_id = null;
    //if ($subscriber_id) $bin_customer_id = DBX::whereBinary('id', $ss->subscriber_id);
    if (!$bin_customer_id) return null;

    $row = XSubscriber::firstBy(['_raw_'=>DBX::whereBinary('id', $ss->subscriber_id)],'phone_number,phone_number AS phone_number1,website,email,address,address_kh,\'\' AS map_url');
    //$row = DB::table('um_customers as b')->whereRaw($bin_customer_id)->selectRaw('b.phone_number, b.phone_number AS phone_number1,b.website,b.email,b.address,b.address_kh,\'\' AS map_url')->first();
    if (!$row) return null;
    $ss->subscriber_id = $subs->customer_id;
    return (object) [
      'contact_info' => $row,
      'social_media_list' => self::socialMediaList($ss)
    ];
  }

  function getDetails($ss)
  {
    $ss = $ss ?? $this->userInfo;
    $customer_id = $ss->subscriber_id;
    if (!$customer_id) return null;
    $col_customer_id = DBX::getHEX('id', 'id');
    $row = XSubscriber::firstBy(['_raw_'=>DBX::whereBinary('id',$customer_id)],$col_customer_id . ',name,name_kh,address, address_kh, phone_number,email,first_cp_name,second_cp_name,first_cp_phone,second_cp_phone,website,billing_address,first_cp_sex,first_cp_dob,first_cp_nid,first_cp_nid_issue_date,first_cp_address');
    //$row = DB::table('um_customers')->whereRaw(DBX::whereBinary('id',$customer_id))->selectRaw($col_customer_id . ',name,name_kh,address, address_kh, phone_number,email,first_cp_name,second_cp_name,first_cp_phone,second_cp_phone,website')->first();
    if (!$row)
      return null;
    $row->logo_url = self::logoUrl($ss);
    return $row;
  }

static function details($ss)
{
    $customer_id = $ss->subscriber_id;
    $where_customer_id = DBX::whereBinary('id', $customer_id);

    $col_customer_id = DBX::getHEX('id', 'id');
    $row = XSubscriber::firstBy(
        ['_raw_' => $where_customer_id],
        $col_customer_id . ",name,name_kh,address,address_kh,phone_number,email,first_cp_name,second_cp_name,first_cp_phone,second_cp_phone,first_cp_email,second_cp_email,first_cp_position,second_cp_position,website"
    );

    if (!$row) {
        $row = new \stdClass();
    }

     $row->logo_url = self::logoUrl($ss);
    return $row;
}

  /** Start Save  and retrieve company's logo **/
  static function saveLogo($d, $ss)
  {
     return XSubscriber::saveLogo($d,$ss);
  }

  static function logoUrl($ss)
  {
    return XSubscriber::getLogoUrl($ss);
  }

  function getLogoUrl($ss = null)
  {
    $ss = $ss ?? $this->userInfo;
    self::logoUrl($ss);
  }

  static function deleteLogo($ss)
  {
    return XSubscriber::deleteLogo($ss);
  }
}
