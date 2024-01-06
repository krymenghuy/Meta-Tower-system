<?php

namespace App\Models;
// use LaravelFCM\Facades\FCM;
use App\Models\DV;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use DB;
use Illuminate\Support\Facades\Log;

class Notifier
{
    protected static $admin_user_class ='admin';
    /**
     * $d = {branch_id,[user_id or target_user_id],[role_name] and other props such as "img", ...}
     * NOTE: Unlikc mobile users or other users with official_id,  the admin user's target_user_id or user_id is the uid matches with the value of "um_users.id"
    */
    static function notify_admin($event_name, $cdata){
      $data = (object)$cdata;
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
                    case 'order_image_created':{
                      event(new \App\Events\order_image_created($data));
                      break;
                    }
                    case 'order_image_deleted':{
                      event(new \App\Events\order_image_deleted($data));
                      break;
                    }
                    case 'merchant_created_order':{
                      event(new \App\Events\MerchantCreatedOrder($data));
                      break;
                    }
                    case 'order_created':{
                      broadcast(new \App\Events\OrderCreated($data))->toOthers();
                      break;
                    }
                    case 'package_photo_picked':{
                      broadcast(new \App\Events\PackagePhotoPicked($data));
                      break;
                    }
                    case 'package_photo_deleted':{
                      broadcast(new \App\Events\PackagePhotoDeleted($data));
                      break;
                    }
                    case 'request_status_changed':{
                      broadcast(new \App\Events\RequestStatusChanged($data))->toOthers();
                      break;
                    }
                    case 'pending_request_created':{
                      event(new \App\Events\PendingRequestCreated($data));
                      break;
                    }
                    case 'driver_accepted_order':{
                      event(new \App\Events\DriverAcceptedOrder($data));
                      break;
                    }
                    case 'driver_delivered_item':{
                      event(new \App\Events\DriverDeliveredItem($data));
                      // must use this => Illuminate\Broadcasting\InteractsWithSockets
                      //return makeJsonResponse($data)->toOthers();
                      break;
                    }
                    case 'message_received':{
                      event(new \App\Events\MessageReceived($data));
                      break;
                    }
                    case 'package_status_changed':{
                        broadcast(new \App\Events\PackageStatusChanged($data))->toOthers();
                        break;
                    }
                    case 'order_deleted':{
                      event(new \App\Events\OrderDeleted($data));
                      break;
                    }
                    case 'driver_canceled_order':{
                      event(new \App\Events\DriverCanceledOrder($data));
                      break;
                    }
                    case 'pickup_driver_changed':{
                      broadcast(new \App\Events\PickupDriverChanged($data))->toOthers();
                      break;
                    }
                    case 'order_status_changed':{
                      broadcast(new \App\Events\OrderStatusChanged($data))->toOthers();
                      break;
                    }
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
         $ss = (object)['user_id'=>$user_id,'role_name'=>$role_name,'branch_id'=>$branch_id,'user_class'=>self::$admin_user_class];
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

   //$d = {title,message,image_url}
   static function saveNotification_admin($userInfo,$d){
    $branch_id = $userInfo->branch_id;
    $user_class=$userInfo->user_class;
    $app_id = getAppIdByUserClass($user_class);
    $expiry_time = convertDate(Carbon::now()->addDay(2));
    $message = self::sanitizeString($d->message);
    DB::table('notifications')->insert([
      'app_id'=>$app_id,
      //"event_name"=>$event_name,
      'role_name'=>$userInfo->role_name,
      'user_class'=>$user_class,
      'user_id'=>$userInfo->user_id,
      'branch_id'=>$branch_id,
      'title'=>empty($d->title)?'NA':$d->title,
      'message'=>$message,
      'image_url'=>isset($d->image_url)?$d->image_url:null,
      'expiry_time'=>$expiry_time,
      'create_date'=>getNowTime()
    ]);
 }

   /** This function is intended to be used for non-Admin users, or mobile users (Those uses have official_id) $byCol = official_id|login_name   */
   static function getUserId($branch_id,$officialId_or_loginName,$byCol='official_id'){
      $users = Cache::get('users') || [];
      if(!$byCol) $byCol = 'official_id';

      if (!isset($users[0]) || !$users) {
        $users = DB::table('um_users as u')->where('branch_id',$branch_id)->selectRaw('u.lang,u.id,u.login_name,u.official_id,u.user_class')->get();
        Cache::put('users',$users,5);
      }
      $c =null;
      $i =0;
      do{
         if(!isset($users[$i])) break;
           $c = $users[$i];
           if($c->$byCol == $officialId_or_loginName) return $c->id;
         $i++;
      }while($c);
      return null;
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

static function notify_mobile($branch_id,$data=[]){
  $i=0;
  $c = null;

  //  foreach($data as $f){
  //   $d = (object)$f;
  //   $official_id = isset($d->target_user_id)?$d->target_user_id:null;
  //   $user_id = self::getUserId($branch_id,$official_id,'official_id');
  //   Log::info("Notify to user_class =$d->user_class, target_user_id = $official_id, user_id = $user_id , message =$d->message ");
  //  }
  //return null;

  do{
      if(!isset($data[$i])) break;
      $c = (object)$data[$i];
      $str_topic = null;
      $user_id = isset($c->user_id)? $c->user_id:null;

      //Cancel notification when there is $official_id provided, but the $user_id is not found! => It means that a merchant has profile, but does not have login account on mobile app yet
      $cancel_notif = false;
      if($user_id ===null || $user_id ==''){
        $official_id = isset($c->target_user_id)?$c->target_user_id:null;
        if($official_id > 0){
          $user_id = self::getUserId($branch_id,$official_id,'official_id');
          if(!$user_id){
            $cancel_notif =true;
            //Log::info("Notify to user_class =$c->user_class, target_user_id = $official_id, user_id = \"No mobile login yet\" , message =$c->message ");
          }

        }
      }
      if(!$cancel_notif){
        $user_class = isset($c->user_class)?$c->user_class:'no_user_class';
        $app_id = getAppIdByUserClass($user_class);
        $persist = isset($c->persist)?$c->persist:null;
        $image_url = isset($c->image_url)?$c->image_url:null;
        $custom_data = isset($c->data)?$c->data:null;
        if($user_id===null || $user_id=='')
          $str_topic = $branch_id.topic_prefix($user_class).'general';
        else
          $str_topic = $branch_id.topic_prefix($user_class).'private'.$user_id;

            $notification = [
                //"condition"=>" 'private' in topics",
                'topic'=>$str_topic,
                'title' => isset($c->title)?$c->title:'DMS',
                //'body' =>$c->message."($str_topic)", //message body
                'body' =>$c->message." ($str_topic)",
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
            $res = self::fcm_send($str_topic,$notification,$custom_data);
            //if(isset($res->message_id) && $res->message_id) $succeeded =1;
            if($persist ==1 || $persist==true){
                try{
                  $expiry_time = Carbon::now()->addDay(3);
                  //Save notification in db table
                  DB::table('notifications')->insert(array(
                    'app_id'=>$app_id,
                    //"event_name"=>$event_name,
                    "user_class"=>$user_class,
                    'user_id'=>$user_id,
                    'branch_id'=>$branch_id,
                    'title'=>isset($c->title)?$c->title:'DMS',
                    'message'=>isset($c->message)?$c->message:'',
                    'image_url'=>$image_url,
                    'expiry_time'=>$expiry_time,
                    'create_date'=>getNowTime()
                  ));
                }catch(\Exception $e){
                   Log::error('Notifier Error: problem in saving notification message');
                   Log::error($e->getMessage());
                   Log::error($e->getTraceAsString());
                }
              
            }

      }
      $i++;
  }while($c);

  // $x = json_decode($res);
  // $x->topic = $str_topic;
  // return $x;
 }

    static function getUnreadCount_admin($d=null){
        return 0;
    }

    static function markReadAll_admin($d =null){
        return null;
    }

    //$d= {'branch_id','user_class','user_id'}
    static function getNotificationListByUser($ss){
       $user_id = null;
       $user_class =null;
       //Need to be cautious when the system is running as SAS model where multiple companies are subscribers
       $branch_id = 1;

       if($ss){
          $user_id = $ss->user_id;
          $user_class = $ss->user_class;
          $branch_id = $ss->branch_id;
       }

        //$app_id = getAppIdByUserClass($user_class);

        $more_wheres =$user_class? 'n.user_class =\''.$user_class.'\' ': '1=1';
        if ($user_id > 0)
          $more_wheres .=' AND (n.user_id ='.$user_id.' OR IFNULL(n.user_id,0) =0)';
        else $more_wheres .=' AND IFNULL(n.user_id,0) =0)';  //return empty rows if there is user_id supplied
        $str_date = '1=1'; //'DATE(create_date) =\''.date('Y-m-d').'\'';
        $str_read ='1=1';
        if (in_array(strtolower($user_class),['merchant','driver'])){
            $str_read = 'is_read(n.id,'.($user_id?$user_id:0).') =0 AND IFNULL(is_read,0)=0';
        }else{
            $str_read ='DATEDIFF(now(),n.create_date) <=30';
        }
        return DB::table('notifications AS n')->where('n.branch_id',$branch_id)->whereRaw($more_wheres)->whereRaw($str_date)->whereRaw($str_read)->selectRaw("n.id,is_read(n.id,n.user_id) AS is_read,CASE IFNULL(user_id,0) WHEN 0 THEN 'all' ELSE 'me' END AS target_user,message,title,image_url,create_date")->orderBy('n.id','DESC')->get();
    }

    //$notification = ['title','body','icon'=>null,'sound'=>'default']
    static function fcm_send($topic_name,$notification=[],$custom_data=array()) {
      //$apiKey = 'AIzaSyD5hjn0SeDJTHasyISJhnXIRVrj-0ZUdRU';
      $apiKey =getServerKey();
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
        if($user_class) $str_user_class ='n.user_class =\''.$user_class.'\'';
        $rows = DB::table('notifications AS n')->whereRaw($str_user_class)->where('n.user_id',$user_id)->whereRaw('is_read(n.id,n.user_id) =0')->selectRaw('COUNT(n.id) AS cnt')->get();
        foreach($rows as $row) return $row->cnt;
        return 0;
     }

  static function clearNotifications($ss=null){
      $str_branch_id = $ss?'branch_id ='.$ss->branch_id : '1=1';
      $start_date = dateAdd('day',-10,date('Y-m-d'),'Y-m-d');
      $str_date = 'DATE(create_date) <=\''.$start_date.'\'';
      $q =  DB::table('notifications')->whereRaw($str_date)->whereRaw($str_branch_id);
      $notif_count = $q->count('notifications.id');
      $q->delete();

      $qr = DB::table('notification_reads')->whereRaw($str_date)->whereRaw($str_branch_id);
      $qr_count = $qr->count('notification_reads.id');
      $qr->delete();
      $today = date('Y-m-d');
      DB::table('notif_last_clearing_date')->delete();
      DB::table('notif_last_clearing_date')->insert(['last_clearing_date'=>$today]);
      $cnt = self::cleanMerchants();
      return DV::success(['merchant_deleted'=>$cnt,'deleted'=>$notif_count,'read_notif_deleted'=>$qr_count,'message'=>$notif_count. ' notifications were deleted!']);
  }

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
