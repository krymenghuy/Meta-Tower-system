<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
// use App\Events\MessageReceived;
// use App\Events\order_image_created;
// use App\Events\order_image_deleted;

// use LaravelFCM\Facades\FCM;
// use LaravelFCM\Message\OptionsBuilder;
// use LaravelFCM\Message\PayloadDataBuilder;
// use LaravelFCM\Message\PayloadNotificationBuilder;
// use LaravelFCM\Message\Topics;
use App\Models\DV;
use Carbon\Carbon;
use DB;

class Notifier //extends Model
{
    //use HasFactory;

    //$d = {branch_id,user_id or sender_id, and other props such as "img", ...}
    static function notify_admin($event_name, $cdata){
      $admin_user_class ='admin';
      $data =(object)$cdata;
      $branch_id = $cdata->branch_id;
      //If "persist" is not specified then save the notification to database
      $data->persist = isset($data->persist)?$data->persist:0;
      if (!isset($data->sender_id)) $data->sender_id = isset($data->user_id)?$data->user_id:null;
      if(!isset($data->branch_id) || $data->branch_id <=0){
        //log::error('$branch_id is NULL, so cannot fire event "MessageReceived" ' );
        return "branch_id and sener_id are required to fire the event";
      }
      $succeeded = true;
      try{
          switch($event_name){
                    case 'pickup_call':{
                      event(new \App\Events\PickupCall($data));
                      break;
                    }
                    case 'message_received':{
                      broadcast(new \App\Events\MessageReceived($data))->toOthers();
                      break;
                    }
                    case 'OtherEventName':{
                      broadcast(new \App\Events\OtherEvent($data))->toOthers();
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
        if($succeeded && $data->persist ==1) {
          $ss = (object)['branch_id'=>$branch_id,'user_class'=>$admin_user_class];
          self::saveNotification_admin($ss,$data);
        }
        return null;
    }

    //$d = {title,message,image_url}
    static function saveNotification_admin($userInfo,$d){
      $branch_id = $userInfo->branch_id;
      $user_class=$userInfo->user_class;
      $app_id = getAppIdByUserClass($user_class);
      $target_user_id =0;
      $expiry_time = convertDate(Carbon::now()->addDay(2));
      $message = mb_convert_encoding($d->message, 'UTF-8');
      DB::table('notifications')->insert([
        'app_id'=>$app_id,
        //"event_name"=>$event_name,
        "user_class"=>$user_class,
        'user_id'=>$target_user_id,
        'branch_id'=>$branch_id,
        'title'=>empty($d->title)?'NA':$d->title,
        'message'=>$message,
        'image_url'=>isset($d->image_url)?$d->image_url:null,
        'expiry_time'=>$expiry_time,
        'create_date'=>getNowTime()
      ]);
  }
  
    // static function notify_relevant($event_name){
    //     switch($event_name){
    //       case 'driver_acccepted_order':{
    //          //inform Admin

    //          //Inform Merchant

    //         break;
    //       }
    //       case 'driver_delivered_item':{
    //          //Inform Admin

    //          //Inform merchant

    //         break;
    //       }

    //     }
    // }
 

/***
 notify_mobile() takes @data as param:
 $data =[
    ['user_class','target_user_id','title','message','data','persist'],
    ['user_class','target_user_id','title','message','data','persist']
  ]

notify_mobile() is to send notifications to one or more apps based on the given param @data = array()
***/
static function notify_mobile($branch_id,$data=[]){
  $i=0;
  $c = null;
  do{
      if(!isset($data[$i])) break;
      $c = (object)$data[$i];
      $str_topic = null;

      $target_user_id = isset($c->target_user_id)?$c->target_user_id:null;
      $user_class = isset($c->user_class)?$c->user_class:null;
      $app_id = getAppIdByUserClass($user_class);
      $persist = isset($c->persist)?$c->persist:null;
      $image_url = isset($c->image_url)?$c->image_url:null;
      $custom_data = isset($c->data)?$c->data:null;
      if($target_user_id>0)
        $str_topic = $branch_id.topic_prefix($user_class)."private".$target_user_id;
      else
         $str_topic = $branch_id.topic_prefix($user_class)."public";

          $notification = [
              //"condition"=>" 'private' in topics",
              'topic'=>$str_topic,
              'title' => isset($c->title)?$c->title:'KSM',
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
          $succeeded = 0;
          $res = self::fcm_send($str_topic,$notification,$custom_data);
          //if(isset($res->message_id) && $res->message_id) $succeeded =1;

          if($persist ==1 || $persist==true){
              $expiry_time = Carbon::now()->addDay(2);
              //Save notification in db table
              DB::table('notifications')->insert(array(
                'app_id'=>$app_id,
                //"event_name"=>$event_name,
                "user_class"=>$user_class,
                'user_id'=>$target_user_id,
                'branch_id'=>$branch_id,
                'title'=>isset($c->title)?$c->title:'KSM',
                'message'=>isset($c->message)?$c->message:'',
                'image_url'=>$image_url,
                'expiry_time'=>$expiry_time,
                'create_date'=>getNowTime()
              ));
          }
      $i++;
  }while($c);
  return $res ; //DV::success(['topic'=>$str_topic,'server_key'=>getServerKey()]);
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
    static function getNotificationListByUser($user_id){
       $user = \App\Models\UM::getUserProps($user_id,"id,user_class,app_id,branch_id");
       if(!$user) return [];
        $branch_id = $user->branch_id;
        $user_id = $user->id;
        $user_class = $user->user_class;
        $app_id = getAppIdByUserClass($user_class);

        $more_wheres ="";
        if ($user_id > 0)
          $more_wheres .="(n.user_id =$user_id OR IFNULL(n.user_id,0) =0)";
        else  $more_wheres ="n.user_id = -1";  //return empty rows if there is user_id supplied
        $str_date = "DATE(create_date) ='".date('Y-m-d')."'";
        return DB::table('notifications AS n')->where('n.branch_id',$branch_id)->where('app_id',$app_id)->whereRaw($more_wheres)->whereRaw($str_date)->whereRaw("IFNULL(is_read,0)=0")->selectRaw("n.id,is_read(n.id,n.user_id) AS is_read,CASE IFNULL(user_id,0) WHEN 0 THEN 'all' ELSE 'me' END AS target_user,message,title,image_url,create_date")->orderBy("n.id","DESC")->get();
    }

    //$notification = ['title','body','icon'=>null,'sound'=>'default']
    static function fcm_send($topic_name,$notification=[],$custom_data=[]) {
      //$apiKey = 'AIzaSyD5hjn0SeDJTHasyISJhnXIRVrj-0ZUdRU';
      $apiKey =getServerKey();
      //if(!is_array($custom_data)) $custom_data =  (array)$custom_data;
      $custom_data = (object)$custom_data; /*  $custom_data MUST be an object in for notification to work */
      $fields = ['to' => '/topics/'.$topic_name, 'notification' => $notification,'data'=>$custom_data];
       
      $headers = ['Authorization: key='.$apiKey, 'Content-Type: application/json', 'priority' => 10];

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
        $more_wheres = "(n.user_id =$user_id OR IFNULL(n.user_id,0)=0)";
        $rows = DB::table('notifications AS n')->whereRaw($more_wheres)->selectRaw("n.id,n.user_id")->get();
        DB::table('notifications AS n')->where("user_id",$user_id)->update(["is_read"=>1]);
        foreach($rows as $row){
          $rs = DB::table('notification_reads AS r')->where('notif_id',$row->id)->where('user_id',$user_id)->selectRaw("r.id")->limit(1)->get();
          if(!isset($rs[0])){
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
      if($user_class) $str_user_class ="n.user_class ='$user_class'";
      $rows = DB::table('notifications AS n')->whereRaw($str_user_class)->where('n.user_id',$user_id)->whereRaw('is_read(n.id,n.user_id) =0')->selectRaw('COUNT(n.id) AS cnt')->get();
      foreach($rows as $row) return $row->cnt;
      return 0;
     }

}
