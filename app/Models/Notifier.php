<?php

namespace App\Models;
// use LaravelFCM\Facades\FCM;
use DV;
use XAuthService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Pagination\LengthAwarePaginator;
use DB;
use DBX;
use Illuminate\Support\Facades\Log;
use App\Models\Dms\Promotion;
use Config;
 use XUMTSettings;
 use XUser;
class Notifier
{
    protected static $admin_user_class ='admin';
    /**
     * $d = {branch_id,[user_id or target_user_id],[role_name] and other props such as "img", ...}
     * NOTE: Unlikc mobile users or other users with official_id,  the admin user's target_user_id or user_id is the uid matches with the value of "um_users.id"
    */
     protected static $promotion_categories = [
        'student_app_promotion',
        'parent_app_promotion',
        'school_promotion',
        'promotion'
    ];
    static function notify_admin($event_name, $cdata){
      $data = (object)$cdata;
      $subs_id = getCurrentSubsId(true);
      $branch_id = isset($data->branch_id)?$data->branch_id:null;
      //If "persist" is not specified then save the notification to database
      $data->persist = isset($data->persist)?$data->persist:1;
      if (!isset($data->sender_id)) $data->sender_id = isset($data->user_id)?$data->user_id:null;
      $role_name = isset($data->role_name)? $data->role_name:null;

      if(!$branch_id){
        Log::error('Failed to broadcast event '.$event_name. ' from user '.(isset($data->user_id)? $data->user_id : 'Empty'));
        return 'branch_id and sener_id are required to fire the event';
      }
      $succeeded = true;
      try{
          switch($event_name){
                    // case 'order_image_created':{
                    //   event(new \App\Events\order_image_created($data));
                    //   break;
                    // }
                    // case 'order_image_deleted':{
                    //   event(new \App\Events\order_image_deleted($data));
                    //   break;
                    // }
                    // case 'merchant_created_order':{
                    //   event(new \App\Events\MerchantCreatedOrder($data));
                    //   break;
                    // }
                    // case 'order_created':{
                    //   broadcast(new \App\Events\OrderCreated($data))->toOthers();
                    //   break;
                    // }
                    // case 'package_photo_picked':{
                    //   broadcast(new \App\Events\PackagePhotoPicked($data));
                    //   break;
                    // }
                    // case 'package_photo_deleted':{
                    //   broadcast(new \App\Events\PackagePhotoDeleted($data));
                    //   break;
                    // }
                    // case 'request_status_changed':{
                    //   broadcast(new \App\Events\RequestStatusChanged($data))->toOthers();
                    //   break;
                    // }
                    // case 'pending_request_created':{
                    //   event(new \App\Events\PendingRequestCreated($data));
                    //   break;
                    // }
                    // case 'driver_accepted_order':{
                    //   event(new \App\Events\DriverAcceptedOrder($data));
                    //   break;
                    // }
                    // case 'driver_delivered_item':{
                    //   event(new \App\Events\DriverDeliveredItem($data));
                    //   // must use this => Illuminate\Broadcasting\InteractsWithSockets
                    //   //return makeJsonResponse($data)->toOthers();
                    //   break;
                    // }
                    case 'message_received':{
                      event(new \App\Events\MessageReceived($data));
                      break;
                    }
                    // case 'package_status_changed':{
                    //     broadcast(new \App\Events\PackageStatusChanged($data))->toOthers();
                    //     break;
                    // }
                    // case 'order_deleted':{
                    //   event(new \App\Events\OrderDeleted($data));
                    //   break;
                    // }
                    // case 'driver_canceled_order':{
                    //   event(new \App\Events\DriverCanceledOrder($data));
                    //   break;
                    // }
                    // case 'pickup_driver_changed':{
                    //   broadcast(new \App\Events\PickupDriverChanged($data))->toOthers();
                    //   break;
                    // }
                    // case 'order_status_changed':{
                    //   broadcast(new \App\Events\OrderStatusChanged($data))->toOthers();
                    //   break;
                    // }
                    default:
                    {
                      $succeeded =false;
                      return "Failed to notify to Web Admin because provided event name is not correct";
                      break;
                    }
                  }

      }catch (\Exception $e){
        return $e->getMessage();
      }

      if($succeeded) {
         $user_id = isset($data->target_user_id)?$data->target_user_id: (isset($data->user_id)?$data->user_id:0);
         $ss = (object)['subs_id'=>$subs_id,'user_id'=>$user_id,'role_name'=>$role_name,'branch_id'=>$branch_id,'user_class'=>self::$admin_user_class];
         self::saveNotification_admin($ss,$data);
      }
      return null;
    }

    static function sanitizeString($inputString) {
      $sanitizedString = '';
      try {
          $sanitizedString = preg_replace('/(?:\\\\x[0-9A-Fa-f]{2})+|[[:cntrl:][:punct:]]/u', '', $inputString);
          return mb_convert_encoding($sanitizedString, 'UTF-8');
      } catch (\Throwable $e) {
          Log::error("Error sanitizing string at method Notifier::sanitizeString() : {$e->getMessage()}\r\n{$e->getTraceAsString()}");
          return mb_convert_encoding($inputString, 'UTF-8'); // Return original string on error
      }
    }

  
static function getNotifCategory($category){
  $cacheKey = "notif_category_{$category}";
  $row = Cache::remember($cacheKey, 15, function() use ($category) {
      return DB::table('notif_categories as c')
          ->where('notif_category', $category)
          ->selectRaw('id, notif_category AS name')
          ->first();
  });
  if (!$row) {
      return (object)[
          'id' => 1,
          'name' => 'default'
      ];
  }
  return $row;
}

   //$d = {title,message,image_url}
   static function saveNotification_admin($userInfo,$d){
    if(!$userInfo){
       \Log::error('Notifier->saveNotification_admin() failed to save or persist notification data because the userInfo or $ss is not provided');
       return;
    } 
    $branch_id = $userInfo->branch_id ?? null;
    $user_class=$userInfo->user_class;
    $category = $userInfo->category ?? 'default';
    $subs_id = $userInfo->subs_id ?? getCurrentSubsId(true);
    if (!$subs_id){
      \Log::error('Failed to save notification info for Admin because $sub_id is missing or empty');
      return;
    }
    $app_id = getAppIdByUserClass($user_class);
    $expiry_time = convertDate(Carbon::now()->addDay(2));
    $message = self::sanitizeString($d->message);
    $category_id = self::getNotifCategory($category)->id; //default category
    DB::table('notifications')->insert([
      'subs_id'=>hex2bin($subs_id),
      'app_id'=>hex2bin($app_id),
      'branch_id'=>$branch_id,
      //"event_name"=>$event_name,
      'role_name'=>$userInfo->role_name,
      'user_class'=>$user_class,
      'user_id'=>$userInfo->user_id,
      'title'=>empty($d->title)?'NA':$d->title,
      'message'=>$message,
      'image_url'=>isset($d->image_url)?$d->image_url:null,
      'expiry_time'=>$expiry_time,
      'category_id'=>$category_id,
      'create_date'=>getNowTime()
    ]);
 }

   /** This function is intended to be used for non-Admin users, or mobile users (Those uses have official_id) $byCol = official_id|login_name   */
  //  static function getUserId($subs_id,$officialId_or_loginName,$byCol='official_id',$user_class = null){
  //     $users = Cache::get('users');
  //     if(!$byCol) $byCol = 'official_id';

  //     if ($users === null || !isset($users[0])) {
  //       $users = DB::table('um_users as u')->where('u.subs_id',hex2bin($subs_id))->selectRaw('u.lang,u.id,u.login_name,u.official_id,u.user_class')->get();
  //       Cache::put('users',$users,10);
  //     }
  //     $c =null;
  //     $i =0;
  //     do{
  //        if(!isset($users[$i])) break;
  //          $c = $users[$i];
  //          if ($byCol ==='official_id'){
  //            if($c->official_id == $officialId_or_loginName && $c->user_class == $user_class) return $c->id;
  //          }else{
  //            if($c->$byCol == $officialId_or_loginName) return $c->id;
  //          }
           
  //        $i++;
  //     }while($c);
  //     return null;
  //  }

  static function getUserId($subs_id, $officialId_or_loginName, $byCol = 'official_id', $user_class = null) {
    $cacheKey = 'users_' . $subs_id; // Unique cache key per subs_id
    $users = Cache::get($cacheKey);
    $subs_id_bin = hex2bin($subs_id);

    if ($users === null) {
        // Retrieve only necessary columns and filter by subs_id in the query
        $users = DB::table('um_users')
            ->where('subs_id', $subs_id_bin)
            ->select('id', 'login_name', 'official_id', 'user_class')
            ->get()
            ->toArray(); // Convert collection to array for faster access
        Cache::put($cacheKey, $users, 600); // Cache for 10 minutes (600 seconds)
    }

    // Use array_filter for better performance on checking conditions
    $filteredUsers = array_filter($users, function($user) use ($officialId_or_loginName, $byCol, $user_class) {
        if ($byCol === 'official_id') {
            return $user->official_id == $officialId_or_loginName && $user->user_class == $user_class;
        } else {
            return $user->$byCol == $officialId_or_loginName;
        }
    });

    // Return the id of the first matched user or null if none found
    return !empty($filteredUsers) ? reset($filteredUsers)->id : null;
}
 
/***
 notify_mobile() takes @data as param:
 $data =[
    ['user_class','target_user_id','title','message','data','persist'],
    ['user_class','target_user_id','title','message','data','persist']
  ]
  notify_mobile() is to send notifications to one or more apps based on the given param @data = array()
  // static function notify_mobile($branch_id,$data=[]):void{ ... }
***/

static function getCategory($category){
  $cache_key = 'notifCat_' . $category;
  $data = Cache::get($cache_key);
  $field = 'notif_category';
  if ($data !== null) return $data;
  
  $value = $category; 
  if ($category && is_numeric($category) && $category > 0) $field = 'id';
  $row = DB::table('notif_categories as c')
            ->where($field, $value)
            ->selectRaw('id, notif_category AS name')
            ->first();
  if (!$row) {
      $row = (object) ['id' => 1, 'name'=>'default'];
  }
  Cache::put($cache_key, $row, 60*30); // Cache for 30 minutes
  return $row;
}
 
/**
 *  $category can be provided via $data->category or via the third parameter $category_id directly
  * $scope = {subs_id, $branch_id, $role|target_role}
*/
static function notify_mobile($scope,$data=[],$category_id = null){
  $i=0;
  $c = null;
  $res = null;
  $scopeInfo = (object)$scope;
  $subs_id = $scopeInfo->subs_id ?? getCurrentSubsId(true);

  $bin_subs_id = $subs_id? hex2bin($subs_id) : null;
  $branch_id = $scopeInfo->branch_id ?? '';
  $target_role = $scopeInfo->role ?? ($scopeInfo->target_role ?? null); 
  do{
      if(!isset($data[$i])) break;
      $c = (object)$data[$i];
      $str_topic = null;
      if (!$bin_subs_id){
         if(isset($c->subs_id)) $bin_subs_id = hex2bin($c->subs_id);
      }
      if(!$branch_id) $branch_id = $c->branch_id ?? null;
      if(!$target_role) $target_role = $c->role ?? ( $c->target_role ?? null);
      $category = $c->category ?? 'default';
      $user_id = isset($c->user_id) ? $c->user_id : null;
      //Cancel notification when there is $official_id provided, but the $user_id is not found! => It means that a merchant has profile, but does not have login account on mobile app yet
      $cancel_notif = false;
      if($user_id ===null || $user_id ==''){
        $official_id = isset($c->target_user_id)?$c->target_user_id:null;
        if($official_id > 0){
          $user_id = self::getUserId($subs_id,$official_id,'official_id');
          if(!$user_id){
            $cancel_notif =true;
            //Log::info("Notify to user_class =$c->user_class, target_user_id = $official_id, user_id = \"No mobile login yet\" , message =$c->message ");
          }
        }
      }
      if(!$cancel_notif){
        $target_role = $c->role ?? ($c->target_role  ?? null);
        $user_class = $c->user_class ?? null;
        $persist = $c->persist ?? null;
        $image_url = $c->image_url ?? null;
        $photo_file_name = $c->photo_file_name ?? null;
        $custom_data = $c->data ?? null;
        $detail_id = $c->detail_id ?? null;
        if (is_array( $custom_data ) &&  !isset($custom_data[0]))  $custom_data = null; //This is VERY IMPORTANT to avoid silent error and Live Notification not appear on mobile 
        if($user_id===null || $user_id=='' || $user_id ==0)
          $str_topic = $subs_id.$branch_id.topic_prefix($user_class).'general';
        else
          $str_topic = $subs_id.$branch_id.topic_prefix($user_class).'private'.$user_id;
            $notification = [
                //"condition"=>" 'private' in topics",
                'topic'=>$str_topic,
                'title' => isset($c->title)?$c->title:'DMS',
                //'body' =>$c->message."($str_topic)", //message body
                'body' =>$c->message, //." ($str_topic)",
                //'android_channel_id' => isset($d->channelId)?$d->channelId:null,
                'icon' => isset($c->image_url)?$c->image_url:null,
                'sound' =>isset($c->sound)?$c->sound:'default'
                //'click_action'=>"url to do something",
                //'badge' => $c->badge,
                //'tag' => $c->tag,
                //'color' => $c->color,
                //'click_action' => $c->clickAction,
                //'body_loc_key' => $c->bodyLocationKey,
                //'body_loc_args' => $c->bodyLocationArgs,
                //'title_loc_key' => $c->titleLocationKey,
                //'title_loc_args' => $c->titleLocationArgs,
            ];
            //$succeeded = 0;
            $res = self::fcm_send($user_class,$str_topic,$notification,$custom_data);
            //if(isset($res->message_id) && $res->message_id) $succeeded =1;
            if($persist ==1 || $persist==true){
                //$app_id = getAppIdByUserClass($user_class);
                try{
                  $category_id = $category_id ?? self::getCategory($category)->id;
                  $category_id = $category_id ?? 1;
                  $expiry_time = Carbon::now()->addDay(3);

                  $inputs = [
                    'subs_id'=>$bin_subs_id,
                    'role_name'=>$target_role,
                    "user_class"=>$user_class,
                    //'app_id'=>hex2bin($app_id),
                    'branch_id'=>$branch_id,
                    'detail_id'=>$detail_id,
                    'photo_file_name'=>$photo_file_name, 
                    'user_id'=>$user_id,
                    'title'=>isset($c->title)?$c->title:'DMS',
                    'message'=>isset($c->message)?$c->message:'',
                    'image_url'=>$image_url,
                    'expiry_time'=>$expiry_time,
                    'category_id'=>$category_id,
                    // 'create_date'=>getNowTime()
                  ];
                  $notif_id = null;
                  $nowTime =getNowTime();
                  if($detail_id && $category_id > 0) $notif_id = DB::table('notifications')->where('detail_id',$detail_id)->where('category_id',$category_id)->value('id');
                  $ss = $ss ?? XAuthService::user();
                  if (!$ss){
                    $ss = (object)[
                      'subs_id'=>$subs_id,
                      'user_id'=>0,
                      'full_name'=>'Guest',
                      'login_name'=>'Guest',
                      DBX::$created_at => $nowTime,
                      DBX::$updated_at => $nowTime
                    ];
                  }
                  DBX::saveData($ss,'notifications',['id'=>$notif_id],$inputs,[],$subs_id? 1 :0,false);
                }catch(\Exception $e){
                   Log::error('Notifier Error: problem in saving notification message');
                   Log::error($e->getMessage());
                   Log::error($e->getTraceAsString());
                }
            }
      }
      $i++;
  }while($c);

  $x = json_decode($res);
  if(!$x || gettype($x) ==='String') return (object)['topic'=>$str_topic,'result'=>$x];
  $x->topic = $str_topic;
  return $x;
 }

    static function getUnreadCount_admin($d=null){
        return 0;
    }
     static function isPromotion($category)
    {
        return strpos($category, '_promotion') !== false
            || in_array($category, self::$promotion_categories);
    }

    static function markReadAll_admin($d =null){
        return null;
    }
 
    //$d= {'branch_id','user_class','user_id'}
    // static function getNotificationListByUser($arr, $ss =null,$use_cache= 1){
    //    $user_id = null;
    //    $user_class =null;
    //    $d = (object)$arr;
    //    $category = $d->category ?? 'default';
    //    $ss = $ss ?? XAuthService::user();
    //    //Need to be cautious when the system is running as SaS model (or subscription model) where multiple companies are subscribers
    //    $branch_id = 0;
    //    $bin_subs_id = null;
    //    $category = strtolower($category);
    //    $cache_key = 'notifls';
    //    if($ss){
    //       $user_id = $ss->user_id;
    //       $user_class = strtolower($ss->user_class);
    //       $branch_id = $ss->branch_id;
    //       $subs_id = $ss->subs_id;
    //       $bin_subs_id = hex2bin($subs_id);
    //       $cache_key .=$user_class.$branch_id.$user_id.$category;
    //    }
    //    if ($use_cache){
    //       $cache_key = str_replace(['/','-','?','@','|'],'',$cache_key);
    //       $data = Cache::get($cache_key);
    //       if($data !==null) return $data;
    //    }
    //     $more_wheres =$user_class? 'n.user_class =\''.escape_like_str($user_class).'\' ': '1=1';
    //     if ($user_id > 0)
    //       $more_wheres .=' AND (n.user_id ='.$user_id.' OR IFNULL(n.user_id,0) =0)';
    //     else $more_wheres .=' AND IFNULL(n.user_id,0) =0';  //return empty rows if there is user_id supplied
    //     $str_date = '1=1'; //'DATE(create_date) =\''.date('Y-m-d').'\'';
    //     $str_read ='1=1';
    //     if (in_array(strtolower($user_class),['merchant','driver','sales_agent'])){
    //         $str_read = 'is_read(n.id,'.($user_id? $user_id:0).') = 0 AND IFNULL(is_read,0)=0';
    //     }else{
    //         $str_read = ' DATEDIFF(now(),n.create_date) <=30 ';
    //     }
    //     $col_date = DBX::formatDate('n.create_date','create_date');
    //     $col_time = DBX::formatTimeOnly('n.create_date','time');
    //     $def_image_url = '';
    //     $query = DB::table('notifications AS n')->join('notif_categories as c','c.id','=','n.category_id')
    //     ->whereRaw($more_wheres)->whereRaw($str_date)->whereRaw($str_read)
    //     ->selectRaw('n.id,n.detail_id,is_read(n.id,n.user_id) AS is_read,CASE IFNULL(user_id,0) WHEN 0 THEN \'all\' ELSE \'me\' END AS target_user,message,title,image_url,c.text_color, c.title_color,n.photo_file_name, \'\' AS image_url,'.$col_date.','.$col_time)->orderBy('n.id','DESC');
    //     if($bin_subs_id) $query->where('n.subs_id',$bin_subs_id);
    //     if($category) $query->where('c.notif_category',$category);
    //     //if(is_numeric($branch_id) && $branch_id > 0) $query->where('n.branch_id',$branch_id);
    //     $data = $query->get();
    //     if($category ==='merchant_app_promotion'){
    //        foreach($data as &$row){
    //         if($row->detail_id){
    //           $row->image_url = Promotion::photo($ss,$row->detail_id,$row->photo_file_name);
    //         }
    //        }
    //     }
    //     Cache::put($cache_key,$data,5);
    //     return $data;
    // }

     static function getNotificationListByUser(array $arr, $ss = null, int $use_cache = 1)
{
    $ss = $ss ?? XAuthService::user();
    if (!$ss) {
        return collect();
    }

    $d = (object) $arr;

    $user_id    = (int) ($ss->user_id ?? 0);
    $user_class = strtolower((string) ($ss->user_class ?? ''));
    $branch_id  = (int) ($ss->branch_id ?? 0);
    $subs_id    = (string) ($ss->subs_id ?? '');
    $category   = strtolower((string) ($d->category ?? ''));

    $created_at = DBX::createdAt();

    $cache_key = 'notifls:' . md5(json_encode([
        'u' => $user_id,
        'c' => $user_class,
        'b' => $branch_id,
        's' => $subs_id,
        'k' => $category
    ]));

    if ($use_cache && ($cached = Cache::get($cache_key)) !== null) {
        return $cached;
    }

    $query = DB::table('notifications AS n')
        ->join('notif_categories AS c', 'c.id', '=', 'n.category_id')
        ->where('n.user_class', $user_class);

    if ($user_id > 0) {
        $query->where(function ($q) use ($user_id) {
            $q->where('n.user_id', $user_id)
              ->orWhereNull('n.user_id')
              ->orWhere('n.user_id', 0);
        });
    } else {
        $query->where(function ($q) {
            $q->whereNull('n.user_id')
              ->orWhere('n.user_id', 0);
        });
    }

    if (!XUMTSettings::correctUserClass($user_class)) {
        $query->whereNotExists(function ($q) use ($user_id) {
            $q->select(DB::raw(1))
              ->from('notification_reads AS nr')
              ->whereColumn('nr.notif_id', 'n.id')
              ->where('nr.user_id', $user_id);
        });
    } else {
        $query->whereDate("n.$created_at", '=', date('Y-m-d'));
    }
    if ($subs_id !== '') {
        $query->whereRaw(DBX::whereBinary('n.subs_id',$subs_id));
    }

    if ($category !== '') {
        $query->where('c.notif_category', $category);
    }
    $query->select([
        'n.id',
        'n.detail_id',
        'n.message',
        'n.title',
        'n.image_url',
        'n.photo_file_name',
        'c.text_color',
        'c.title_color',
    ]);

    // Safe derived columns
    $query->selectRaw("
        CASE 
            WHEN n.user_id IS NULL OR n.user_id = 0 THEN 'all'
            ELSE 'me'
        END AS target_user
    ");

    $query->selectRaw(DBX::formatDate("n.$created_at", 'create_date'));
    $query->selectRaw(DBX::formatTimeOnly("n.$created_at", 'time',true));

    $data = $query->orderBy('n.id', 'desc')->get();

    if (self::isPromotion($category)) {
        foreach ($data as $row) {
            if (!empty($row->detail_id)) {
                $row->image_url = Promotion::photo(
                    $ss,
                    $row->detail_id,
                    $row->photo_file_name
                );
            }
        }
    }

    Cache::put($cache_key, $data, 5);

    return $data;
}

 
    //$d= {'branch_id','user_class','user_id'}
    static function getNotificationListByUser_paginate($arr, $ss){
      $d = (object)$arr;
      $category_id = $d->category_id ?? 1;
      $use_cache = isset($d->use_cache)?$d->use_cache:1;

      $current_page =isset($d->current_page)?$d->current_page:1;
      $per_page =isset($d->per_page)?$d->per_page:10;
      if(!is_numeric($current_page)) $current_page=1;
      $skip_rows = ($current_page -1) * $per_page;
      $cache_key = 'notifls11';
      foreach($d as $key => $val) $cache_key .= $val;
      $cache_key = str_replace(['/','-','?','@','|'],'',$cache_key);

      $user_id = null;
      $user_class =null;
      //Need to be cautious when the system is running as SAS model where multiple companies are subscribers
      $branch_id = 1;

      if($ss){
         $user_id = $ss->user_id;
         $user_class = $ss->user_class;
         $branch_id = $ss->branch_id;
         $cache_key .=$user_class.$branch_id.$user_id.$category_id;
         $subs_id = $ss->subs_id;
         $bin_subs_id = hex2bin($subs_id);
      }
      if( $use_cache){
        $data = Cache::get($cache_key);
        if($data!==null) return $data;
      }
       //$app_id = getAppIdByUserClass($user_class);
       $str_branch_id = $branch_id > 0?'n.branch_id ='.$branch_id : '1=1';
       $more_wheres =$user_class? 'n.user_class =\''.$user_class.'\' ': '1=1';
       if ($user_id > 0)
         $more_wheres .=' AND ((n.user_id ='.$user_id.' OR IFNULL(n.user_id,0) =0)';
       else $more_wheres .=' AND IFNULL(n.user_id,0) =0)';  //return empty rows if there is user_id supplied
       $str_date = '1=1'; //'DATE(create_date) =\''.date('Y-m-d').'\'';
       $str_read ='1=1';
       if (in_array(strtolower($user_class),['merchant','driver','sales_agent'])){
           $str_read = 'is_read(n.id,'.($user_id? $user_id:0).') = 0 AND IFNULL(is_read,0)=0';
       }else{
           $str_read = 'DATEDIFF(now(),n.create_date) <=30';
       }
       $query = DB::table('notifications AS n')->join('notif_categories as c','c.id','=','n.category_id')->where('n.subs_id',$bin_subs_id)->whereRaw($str_branch_id)->whereRaw($more_wheres)->whereRaw($str_date)->whereRaw($str_read)->selectRaw('n.id,is_read(n.id,n.user_id) AS is_read,CASE IFNULL(user_id,0) WHEN 0 THEN \'all\' ELSE \'me\' END AS target_user,message,title,image_url,c.text_color, c.title_color, formatTime(n.create_date) AS create_date')->orderBy('n.id','DESC');
       $q_count = clone $query;
       $count = $q_count->count('n.id'); 
       $rows = $query->skip($skip_rows)->take($per_page)->get();
       $data = new LengthAwarePaginator($rows, $count, $per_page, $current_page);
       Cache::put($cache_key, $data,5);
       return $data;
   }

    //$notification = ['title','body','icon'=>null,'sound'=>'default']
    static function fcm_send($user_class,$topic_name,$notification=[],$custom_data=array()){
      //$apiKey = 'AIzaSyD5hjn0SeDJTHasyISJhnXIRVrj-0ZUdRU';
      $apiKey =getServerKey($user_class);
      //if(!is_array($custom_data)) $custom_data = (array)$custom_data;
      $fields = array('to' => '/topics/'.$topic_name, 'notification' => $notification, 'data'=>$custom_data);
      $headers = array('Authorization: key='.$apiKey, 'Content-Type: application/json', 'priority' => 10);
      $url = 'https://fcm.googleapis.com/fcm/send';
      // var_dump($fields);

      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_POST, true);
      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

      curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
      $result = curl_exec($ch);
      curl_close($ch);

       return $result;
    }

      //for mobile user to remove unread-count for specific notifcaition
      static function markRead($notif_id, $user_id){
        if (!$notif_id) return DV::error("Notification identifier is not supplied");
        DB::table('notification_reads')->where('notif_id',$notif_id)->where('user_id',$user_id)->delete();
        DB::table('notification_reads')->insert(['user_id'=>$user_id,'notif_id'=>$notif_id]);
        return null;
    }

    //for mobile app user remove All unread-count
    //returns NULL in case of No Error
    static function markReadAll($user_id){
      //$branch_id = $ss->branch_id;
      if(!$user_id) return null;
      $sql = 'SELECT n.id, n.user_id
      FROM notifications AS n
      WHERE
          n.user_id = '.$user_id.'
          AND n.is_read = 0
          AND n.create_date >= DATE_SUB(NOW(), INTERVAL 90 DAY)
      UNION
      SELECT n.id, n.user_id
      FROM notifications AS n
      WHERE
          n.user_id = 0
          AND n.is_read = 0
          AND n.create_date >= DATE_SUB(NOW(), INTERVAL 90 DAY);
      ';
      $rows = DB::select(DB::raw($sql));
      //DB::table('notifications AS n')->where("user_id",$user_id)->update(["is_read"=>1]);
      foreach($rows as $row){
        $test_id = DB::table('notification_reads AS r')->where('notif_id',$row->id)->where('user_id',$user_id)->take(1)->value('r.id');
        if(!$test_id){
            DB::table('notification_reads')->insert(['user_id'=>$user_id,'notif_id'=>$row->id]);
        }
      }
      return null;
   }

    static function point2point_distance($lat1, $lon1, $lat2, $lon2, $unit='K')
    {
        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $miles = $dist * 60 * 1.1515;
        $unit = strtoupper($unit);

        if ($unit == "K")
        {
            return ($miles * 1.609344);
        }
        else if ($unit == "N")
        {
        return ($miles * 0.8684);
        }
        else
        {
        return $miles;
      }
    }

     //return count of unread notifications
     static function getUnreadCount($user_id,$user_class=null){
        if(!$user_id) return 0;
        $str_user_class ="1=1";
        $cach_key = 'unreadnotif_'.$user_id;
        $cnt = Cache::get($cach_key);
        if($cnt !==null){
          //Log::info('cached unread-count = '.$cnt);
          return $cnt;
        }
        if($user_class) $str_user_class ='n.user_class =\''.$user_class.'\'';
        $rows = DB::table('notifications AS n')->whereRaw($str_user_class)->where('n.user_id',$user_id)->whereRaw('is_read(n.id,n.user_id) =0')->selectRaw('COUNT(n.id) AS cnt')->get();
        foreach($rows as $row){
          Cache::put($cach_key,$row->cnt,35);
          //Log::info('queried unread-count = '.$row->cnt);
          return $row->cnt;
        }
        Cache::put($cach_key,0,35);
        return 0;
     }

  /** Notifier:: details() return Promotion details with Description and Image Url for mobile popup screen */
  static function details($id,$ss){
      $subs_id = $ss->subs_id;
      $row = DB::table('notifications as n')->join('notif_categories as c','c.id','=','n.category_id')
      ->where('n.id',$id)
      //->where('n.subs_id',hex2bin($subs_id))
      ->selectRaw('n.id,n.detail_id,c.notif_category as category')->first();
      if(!$row) return null;
      $cat = strtolower($row->category);
      if($cat ==='merchant_app_promotion'){
        return Promotion::details($row->detail_id,$ss);
      } else return null;
  }

  static function clearNotifications($ss=null){
      $subs_id = $ss->subs_id;
      $bin_subs_id = hex2bin($subs_id);
      $str_branch_id = $ss?'branch_id ='.$ss->branch_id : '1=1';
      $start_date = dateAdd('day',-10,date('Y-m-d'),'Y-m-d');
      $str_date = 'DATE(create_date) <=\''.$start_date.'\'';
      $q =  DB::table('notifications')->whereRaw($str_date)->whereRaw($str_branch_id);
      $notif_count = $q->count('notifications.id');
      $q->delete();

      $qr = DB::table('notification_reads')->where('n.subs_id',$bin_subs_id)->whereRaw($str_date)->whereRaw($str_branch_id);
      $qr_count = $qr->count('notification_reads.id');
      $qr->delete();
      $today = date('Y-m-d');
      DB::table('notif_last_clearing_date')->where('n.subs_id',$bin_subs_id)->delete();
      DB::table('notif_last_clearing_date')->where('n.subs_id',$bin_subs_id)->insert(['last_clearing_date'=>$today]);
      $cnt = self::cleanMerchants();
      return DV::success(['merchant_deleted'=>$cnt,'deleted'=>$notif_count,'read_notif_deleted'=>$qr_count,'message'=>$notif_count. ' notifications were deleted!']);
  }

  //Temporary fix function
  static function cleanMerchants(){
    $phones = ["010696369","010802882","011298289","012411366","012912303","016383886","061491455","061708706","067313335","069341394","069540880","077383739","077410518","085887761","087928058","087941130","0888588816","089553306","092603004","092919916","093202565","093555369","093935565","0968058375","0969590396","0969997724","0977958001","098332257","098409000","098533985","098691222","098717796","098795078"];
    $cnt_deleted = 0;
    foreach($phones as $p){
       $rows = DB::table('sender as s')->where('s.phone_number',$p)->selectRaw('id,phone_number,status_code')->get();
       foreach($rows as $r){
         $p_count = DB::table('package AS p')->where('p.sender_id',$r->id)->count('p.id');
         if($p_count <=0){
          $x = DB::table('sender')->where('id',$r->id)->delete();
          if($x){
            $another_sid = DB::table('sender')->where('phone_number',$p)->take(1)->value('id');
            if($another_sid){
              DB::table('um_users')->where('official_id',$r->id)->update([
                'official_id'=>$another_sid
              ]);
            }
           $cnt_deleted++;
          }
         }
       }
    }

    return $cnt_deleted;
 }

}
