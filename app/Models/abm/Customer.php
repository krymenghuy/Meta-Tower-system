<?php

namespace App\Models\abm;

use App\Models\UM;
use App\Models\PublicStorage;
use App\Models\DV;
use App\Models\JDV;
use DB;
use Sanitizer;
use Carbon\Carbon;
use Config;
use Illuminate\Pagination\LengthAwarePaginator;

class Customer //extends Model
{
  protected $id = null;
  protected $userInfo = null;
  protected static $img_dir = 'customer';

  function __construct($id = null, $userInfo = null)
  {
    $this->id = $id;
    $this->userInfo = $userInfo;
  }



  function getDefaultOptions()
  {
    //price_list_id =11 (Normal Condition)
    $data = (object) [
      'price_list_id' => self::getDefaultPriceList()->id,
      'cod' => 0,
      'cod_fee' => 0
    ];
    return $data;
  }

  static function getDefaultPriceList()
  {
    $row = DB::table('price_list_names AS l')->where('is_default', 1)->take(1)->selectRaw('id,name')->first();
    if ($row)
      return $row;
    return (object) ['id' => null, 'name' => ''];
  }





  function customerNameExists($ss, $name, $id)
  {
    $branch_id = $ss->branch_id;
    $name = Sanitizer::sanitize($name);
    $str_id = $id > 0 ? 's.id <> ' . $id : '1=1';

    $test_id = DB::table('sender AS s')->where('s.branch_id', $branch_id)->where('s.name', $name)->whereRaw($str_id)->value('s.id');
    return $test_id > 0;
  }
  static function updateMerchantName($id, $name)
  {
    DB::table('package')->where('sender_id', $id)->update(['sender_name' => $name]);
    DB::table('order_receivers')->where('sender_id', $id)->update(['sender_name' => $name]);
    DB::table('deleted_package')->where('sender_id', $id)->update(['sender_name' => $name]);
    DB::table('archived_package')->where('sender_id', $id)->update(['sender_name' => $name]);
    DB::table('um_users')->where('user_class', 'merchant')->where('official_id', $id)->update(['full_name' => $name]);
    return null;
  }

  static function updateMerchantPhone($id, $phone_number)
  {
    $user_id = UM::getUserId('merchant', 'official_id', $id);
    if ($user_id) {
      $res = UM::updatePhoneNumber($phone_number, $user_id);
      if ($res->status == 'Error')
        return $res->error_message;
    }
    DB::table('package')->where('sender_id', $id)->update(['sender_phone' => $phone_number]);
    DB::table('order_receivers')->where('sender_id', $id)->update(['sender_phone' => $phone_number]);
    DB::table('deleted_package')->where('sender_id', $id)->update(['sender_phone' => $phone_number]);
    DB::table('archived_package')->where('sender_id', $id)->update(['sender_phone' => $phone_number]);
    return null;
  }

  function save($arr, $id = null, $ss = null)
  {

    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;
    $branch_id = $ss->branch_id;
    $v_rule = [
      'id' => '0|identity=1',
      'lead_id' => '0|number',
      'name' => '1|string|0-100',
      'name_kh' => '0|string|0-100',
      'sender_type_id' => '0|positive|exists=sender_type.id',
      'business_type' => '0|string|0-150',
      'email' => '0|email',
      'address' => '0|string|0-250',
      'phone_number' => '1|phone|0-50',
      'sales_agent_id' => '0|number|default=1',
      'os_agent_types_id' => '0|number',
      'adr_country_id' => '0|number',
      'adr_city_id' => '0|number',
      'adr_district_id' => '0|number',
      'cod' => '0|choice|0,1|default=0',
      'cod_fee' => '0|number|default=0',
      'price_list_id' => '0|number',
      'code' => '0|string|0-25'


      //'loc_lat'=>'0|number|default=0',
      //'loc_lng'=>'0|number|default=0',
      // 'sales_agent_id'=>'0|number',


    ];



    $checkUnque = ["$branch_id|sender|name,phone_number,code|id=id|text=Sender or Customer already exists by name,phone number, or email"];

    $res = validateObject($arr, $v_rule, true, ['email' => ['-', '.', ',', '@', '_']], $ss->lang, false, $checkUnque);
    if ($res->error)
      return DV::error($res->error);
    $id = $id ?? $res->id;
    $inputs = $res->values;
    $d = (object) $inputs;
    
    $d->phone_number = str_replace(' ', '', $inputs['phone_number']);
    $inputs['phone_number'] = $d->phone_number;
    if (!$d->phone_number)
      return DV::error('Phone number is required for valid Customer account');
    $sender_created = $id > 0 ? 0 : 1;
    if ($id > 0) {
      $org_sender = DB::table('sender_classes as sc')->where('sc.id', $id)->selectRaw('sc.sender_id,sc.sender_class')->take(1)->first();
      if (!$org_sender)
        return DV::error('Failed to identify existing merchant for updating their information');
      if ($d->phone_number != $org_sender->phone_number) {
        //Change merchant's phone number in tables "um_users","package","order_receivers", and then notify merchant Mobile App
        $change_phone_error = self::updateMerchantPhone($id, $d->phone_number);
        if ($change_phone_error)
          return DV::error($change_phone_error);
      }
      if ($org_sender->name != $d->name) {
        //Change merchant's name in tables "um_users","package","order_receivers", and then notify Merchant mobile App
        $change_name_error = self::updateMerchantName($id, $d->name);
        if ($change_name_error)
          return DV::error($change_name_error);
      }
    }
    $id = saveData($ss, 'sender', ['id' => $id], $inputs, [], 1, false);


    if ($id > 0) {
      $new_code = null;
      if ($sender_created === 1) {
        $new_code = $this->getNextSenderCode($ss); // formatNumber($sender_id,5);
        //$inputs['code'] = $new_code;
        DB::table('sender')->where('id', $id)->update(['code' => $new_code]);
      }
      return DV::depends(1, ['sender' => $inputs, 'id' => $id, 'action' => 'saved']);


    }
    return DV::error('Something went wrong in saving sender profile');


  }

  function saveProfilePicture($photo_data, $file_type = null, $id = null, $ss = null)
  {
    $id = $id ? $id : $this->id;
    $ss = $ss ? $ss : $this->userInfo;
    $sender = DB::table('sender as s')->where('id', $id)->selectRaw('id,branch_id,photo_file_name')->first();
    $delete_image = (!$photo_data || isImage($photo_data));
    if (!$sender)
      return DV::error('Customer identity is not correct!');
    if ($delete_image) {
      PublicStorage::delete($ss->branch_id, 'customer', 'image', $sender->photo_file_name);
      DB::table('sender')->where('id', $id)->update(['photo_file_name' => null]);
    }
    return PublicStorage::saveImage($ss->branch_id, self::$img_dir, null, $photo_data, null, ['id' => $id, 'store' => 'sender.photo_file_name']);
  }
  static function defaultImage($branch_id)
  {
    return PublicStorage::getUrl($branch_id, 'default', 'image') . 'default_merchant.png';
  }
  static function getProfilePicture($id)
  {
    $row = DB::table('sender as s')->where('id', $id)->selectRaw('s.branch_id,s.photo_file_name')->first();
    if (!$row) {
      return self::defaultImage(1);
    }
    $url = PublicStorage::getUrl($row->branch_id, 'customer', 'image') . $row->photo_file_name;
    return validateUrl($url, '');
  }
  function deleteProfilePicture($id = null, $ss = null)
  {
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;
    $sender = DB::table('sender as s')->where('id', $id)->selectRaw('id,branch_id,photo_file_name')->first();
    if (!$sender)
      return DV::error('Merchant identity is not correct!');
    PublicStorage::delete($ss->branch_id, 'merchant', 'image', $sender->photo_file_name);
    DB::table('sender')->where('id', $id)->update(['photo_file_name' => null]);
    return DV::success();
  }

  function getNextSenderCode($uss, $len = 4)
  {
    $branch_id = $uss->branch_id;
    $prefix = 'HM';
    $str_prefix = $prefix ? 'prefix =\'' . $prefix . '\'' : '2=2';
    $row = DB::table('sender_code_control AS c')->where('branch_id', $branch_id)->whereRaw($str_prefix)->selectRaw('TRIM(c.prefix) AS prefix,c.last_id')->take(1)->first();
    if ($row) {
      $num = $row->last_id;
      $prefix = trim($row->prefix);
      $num += 1;
      DB::table('sender_code_control')->where('branch_id', $branch_id)->whereRaw($str_prefix)->update(['last_id' => $num]);
      return $prefix . $branch_id . formatNumber($num, $len);
    }
    DB::table('sender_code_control')->insert(array('branch_id' => $branch_id, 'last_id' => 1, 'prefix' => $prefix));
    return $prefix . $branch_id . formatNumber(1, $len);
  }
  static function list($arr, $ss)
  {
    $d = (object) $arr;
    $branch_id = $ss->branch_id;

    $current_page = isset($d->current_page) ? $d->current_page : 1;
    $per_page = isset($d->per_page) ? $d->per_page : 10;
    if (!is_numeric($current_page))
      $current_page = 1;
    $skip_rows = ($current_page - 1) * $per_page;

    $status = isset($d->status_code) ? $d->status_code : 'active';
    //$sender_type_id = isset($d->sender_type_id)? $d->sender_type_id:null;
    $business_type = isset($d->business_type) ? $d->business_type : null;
    $search_value = isset($d->search_value) ? $d->search_value : null;
    $sales_agent_id = isset($d->sales_agent_id) ? $d->sales_agent_id : null;
    $str_agent = '11=11';
    /** $sales_agent_id = -1 means "To query merchants who are not referred by any sales agent " 
     *  $sales_agent_id = null or zero => means query merchants either refered by agent or no referrer
     */
    if ($sales_agent_id == -1)
      $str_agent = 's.sales_agent_id IS NULL';
    else if ($sales_agent_id > 0)
      $str_agent = 's.sales_agent_id =' . $sales_agent_id;
    //$str_sender_type = null;
    $str_business_type = '1=1';
    $str_status = '3=3'; // Active, Inactive
    $str_search = '2=2';
    //$str_agent = null;

    if ($search_value) {
      $search_value = escape_like_str($search_value);
      $str_search = "(s.code ='$search_value' OR s.name LIKE '%" . $search_value . "%' OR s.phone_number ='" . $search_value . "' )";
    } else {
      //if($sender_type_id>0) $str_sender_type ="AND s.sender_type_id ='".Sanitizer::sanitize($sender_type_id)."' ";
      if ($business_type) {
        $business_type = escape_like_str($business_type);
        $str_business_type = 's.business_type LIKE \'%' . $business_type . '%\'';
      }
      if (in_array(strtolower($status), ['active', 'inactive']))
        $str_status = 's.status_code =\'' . $status . '\'';
    }
    $select_referrer_name = ',(SELECT r.`name` FROM sales_agents as r WHERE r.id = s.sales_agent_id LIMIT 1) AS referrer_name';
    //$query = DB::table('sender_classes as sc')->join('sender as s ','s.id','sc.sender_id')->selectRaw('s.branch_id,s.id,s.code,s.status_code,s.photo_file_name,s.name,s.name_kh,s.address,s.phone_number,s.price_list_id, getPriceListName(s.price_list_id) AS price_list_name,s.cod,s.cod_fee,s.email,s.business_type,s.address,s.sender_type_id, (SELECT t.name FROM sender_type AS t WHERE t.id = s.sender_type_id LIMIT 1) AS sender_type,(SELECT os.name FROM os_agent_types AS os WHERE os.id = s.os_agent_types_id LIMIT 1) AS agent_type,s.sales_agent_id AS referrer_id '.$select_referrer_name.',s.create_user,formatTime(s.create_date) AS created_at, sc.sender_class')->where('s.branch_id',$branch_id)->whereRaw($str_agent)->whereRaw($str_search)->whereRaw($str_status)->whereRaw($str_business_type)->orderBy('s.id','DESC');
    //  $query = DB::table('sender as s')->join('sender_classes as sc ','sc.id','s.id')->selectRaw('s.branch_id,s.id,s.code,s.status_code,s.photo_file_name,s.name,s.name_kh,s.address,s.phone_number,s.price_list_id, getPriceListName(s.price_list_id) AS price_list_name,s.cod,s.cod_fee,s.email,s.business_type,s.address,s.sender_type_id, (SELECT t.name FROM sender_type AS t WHERE t.id = s.sender_type_id LIMIT 1) AS sender_type,(SELECT os.name FROM os_agent_types AS os WHERE os.id = s.os_agent_types_id LIMIT 1) AS agent_type,s.sales_agent_id AS referrer_id '.$select_referrer_name.',s.create_user,formatTime(s.create_date) AS created_at, sc.sender_class')->where('s.branch_id',$branch_id)->whereRaw($str_agent)->whereRaw($str_search)->whereRaw($str_status)->whereRaw($str_business_type)->orderBy('s.id','DESC');
    $query = DB::table('sender as s')
      ->join('sender_classes as sc', 'sc.sender_id', '=', 's.id')
      ->selectRaw(' sc.sender_class,  s.branch_id,s.id,s.code,s.status_code,s.photo_file_name,s.name,s.name_kh,s.address,s.phone_number,s.price_list_id, getPriceListName(s.price_list_id) AS price_list_name,s.cod,s.cod_fee,s.email,s.business_type,s.address,s.sender_type_id, (SELECT t.name FROM sender_type AS t WHERE t.id = s.sender_type_id LIMIT 1) AS sender_type,(SELECT os.name FROM os_agent_types AS os WHERE os.id = s.os_agent_types_id LIMIT 1) AS agent_type,s.sales_agent_id AS referrer_id ' . $select_referrer_name . ',s.create_user,formatTime(s.create_date) AS created_at')
      ->where('s.branch_id', $branch_id)
      //->where('sender_class','oversea')
      ->whereRaw($str_agent)
      ->whereRaw($str_search)
      ->whereRaw($str_status)
      ->whereRaw($str_business_type)->orderBy('s.id', 'DESC');

    $count_query = clone $query;
    $count = $count_query->count('s.id');
    $rows = $query->skip($skip_rows)->take($per_page)->get();
    foreach ($rows as $row) {
      $row->image_url = '';
      // $row->bank_accounts = self::bankAccounts($row->id,null);
      $row->mobile_login = UM::getAccountInfo($row->id, 'official_id', 'customer');
      if ($row->photo_file_name)
        $row->image_url = PublicStorage::getUrl($row->branch_id, 'customer', 'image') . $row->photo_file_name;
      unset($row->photo_file_name);
      //if(!$row->image_url) $row->image_url =self::defaultImage($ss->branch_id);
    }

    return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
  }


  static function list_all($arr, $ss)
  {
    $branch_id = $ss->branch_id;
    $d = (object) $arr;

    $status = isset($d->status_code) ? $d->status_code : 'active';
    $search_value = isset($d->search_value) ? $d->search_value : null;

    $str_search = '2=2';
    $str_status = '3=3';

    if ($search_value) {
      $search_value = escape_like_str($search_value);
      $str_search = '(s.name LIKE \'%' . $search_value . '%\' OR phone_number LIKE \'%' . $search_value . '%\')';
    } else {
      if (in_array(strtolower($status), ['active', 'inactive']))
        $str_status = 's.status_code =\'' . $status . '\'';
    }
    $select_referrer_name = ',(SELECT r.`name` FROM sales_agents as r WHERE r.id = s.sales_agent_id LIMIT 1) AS referrer_name';
    $query = DB::table('sender as s')
    ->join('sender_classes as sc', 'sc.sender_id', '=', 's.id')

    ->selectRaw(' sc.sender_class ,s.branch_id,s.id,s.code,s.status_code,s.photo_file_name,s.name,s.name_kh,s.address,s.phone_number,s.create_date,s.price_list_id, getPriceListName(s.price_list_id) AS price_list_name,s.cod,s.cod_fee,s.email,s.business_type,s.address,s.sender_type_id, (SELECT t.name FROM sender_type AS t WHERE t.id = s.sender_type_id LIMIT 1) AS sender_type,s.sales_agent_id AS referrer_id ' . $select_referrer_name . ',s.create_user,formatTime(s.create_date) AS created_at')->where('s.branch_id', $branch_id)->whereRaw($str_search)->whereRaw($str_status)->orderBy('s.id', 'DESC');
    $rows = $query->get();
    foreach ($rows as $row) {
      $row->image_url = '';
      // $row->bank_accounts = self::bankAccounts($row->id,null);
      // $row->mobile_login = \App\Models\UM::getAccountInfo($row->id,'official_id','merchant');
      if ($row->photo_file_name)
        $row->image_url = PublicStorage::getUrl($row->branch_id, 'merchant', 'image') . $row->photo_file_name;
      unset($row->photo_file_name);
      //if(!$row->image_url) $row->image_url =self::defaultImage($ss->branch_id);
    }
    return $rows;


  }

  static function details($id, $ss, $includeProfilePicture = false)
  {
    $branch_id = $ss->branch_id;
    //$cols = 's.id,s.code,s.name,s.name_kh,s.address,s.cod,s.cod_fee,s.price_list_id,s.phone_number,s.email,s.business_type,s.price_list_id,sales_agent_id,s.category_id,c.`name` AS category,s.status_id,ls.`name` AS status,s.reopen_count,s.closing_status_id';    
    $row = DB::table('sender as s')->selectRaw('s.id,s.code,s.name,s.name_kh,s.address,s.cod,s.cod_fee,s.price_list_id,s.phone_number,s.email,s.business_type,s.sender_type_id, (SELECT t.name FROM sender_type AS t WHERE t.id = s.sender_type_id LIMIT 1) AS sender_type,s.price_list_id,sales_agent_id')->where('s.branch_id', $branch_id)->where('s.id', $id)->first();
    if (!$row)
      return null;
    if ($includeProfilePicture)
      $row->image_url = PublicStorage::getProfilePhoto_url($ss->user_id);
    return $row;
  }


  static function getFormOptions($id, $ss)
  {
    $branch_id = $ss->branch_id;
    $customer_details = null;
    if ($id > 0)
      $customer_details = self::details($id, $ss);
    $data = (object) [];
    $data->sender = $customer_details;
    $data->branches = [(object) ['id' => 1, 'branch_name' => 'Head Quarter']];
    $data->sales_agents = DB::table('sales_agents as a')->where('a.branch_id', $branch_id)->selectRaw('id,name AS agent_name')->get();
    //$data->categories = DB::table('lead_categories as c')->selectRaw('id,name AS category')->get();
    $data->business_types = DB::table('sender_business_types')->selectRaw('business_type')->get();
    $data->customer_statuses = DB::table('sender_statuses')->selectRaw('code as status_code, name as status_name')->get();
    //$data->closing_statuses = DB::table('closing_statuses AS cs')->selectRaw('scs.id,cs.name AS closing_status')->get();
    $data->price_list = DB::table('price_list_names AS l')->where('branch_id', $branch_id)->selectRaw('l.id,l.name as price_list')->get();
    $data->sender_types = DB::table('sender_type')->selectRaw('id,name as sender_type')->get();

    return $data;
  }
  function delete($id)
  {
    $id = $id ? $id : $this->id;

    $delete = DB::table('sender')->where('id', $id)->delete();
    return DV::depends($delete, ['action', 'deleted']);
  }

  function setPriceList($price_list_id, $id = null, $ss = null)
  {
    $ss = $ss ?? $this->userInfo;
    $id = $id ?? $this->id;
    $branch_id = Sanitizer::sanitize($ss->branch_id);
    $p = getDataRow('price_list_names', ["id" => $price_list_id], "id,name");
    if (!$p)
      return DV::error("Price list ID is not valid");
    $p_name = $p->name;
    DB::table('sender')->where('id', $id)->update(
      array(
        'price_list_id' => $price_list_id
      )
    );
    return DV::success(['list_name' => $p_name, 'list_id' => $price_list_id]);
  }



}
