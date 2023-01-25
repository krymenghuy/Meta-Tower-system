<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Events\MessageReceived;
  
use LaravelFCM\Facades\FCM;
use LaravelFCM\Message\OptionsBuilder;
use LaravelFCM\Message\PayloadDataBuilder;
use LaravelFCM\Message\PayloadNotificationBuilder;
use LaravelFCM\Message\Topics;

use App\Models\UM;
use App\Models\DV;
use Session;
use Config;
use Carbon\Carbon;
use DB;

class Notifier extends Model
{
    use HasFactory;

    static function notify_admin($event_name, $d){
      if (!$d) $data = (object)[];
      $data = (object)$d;
      if (!isset($data->sender_id)) $data->sender_id = isset($data->user_id)?$data->user_id:null;
      if(!isset($data->branch_id) || $data->branch_id <=0 || !isset($data->sender_id) || $data->sender_id <=0){
        //log::error('$branch_id is NULL, so cannot fire event "MessageReceived" ' );
        return "branch_id and sener_id are required to fire the event";
      }

      try{
          switch($event_name){
                    case 'AppointmentAdded':{
                      event(new \App\Events\AppointmentAdded($data)); 
                      break;
                    }
                    case 'TicketAdded':{
                      event(new \App\Events\TicketAdded($data)); 
                      break;
                    }
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
                  //   case 'package_status_changed':{
                  //       $rows = DB::table('package_statuses AS ps')->where('id',$data->status_id)->limit(1)->select('name AS status')->get(); 
                  //       $status = null;
                  //       foreach($rows as $row) $status = $row->status;
                  //       $data->status = $status;
                  //       event(new \App\Events\PackageStatusChanged($data));
                  //       break;
                  //   }
                  //   case 'order_status_changed':{
                  //     broadcast(new \App\Events\OrderStatusChanged($data))->toOthers();
                  //     break;
                  // }
                  //   case 'order_status_changed':{

                  //     break;
                  //   }default:
                    {
                      return "Failed to notify to Web Admin because provided event name is not correct"; 
                      break;
                    } 
                  } 
      }catch (\Exception $e){
          return $e->getMessage();   
      } 
        return null;
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


    //Admin notifies to driver app (targeting specific driver_id or groups or all drivers)
     //$eventInfo = {'branch_id','event_name',target_user_id,'message','title','image_url','branch_id'}
     //if no @user_id specified => notification to all drivers.
     //NOTE $d = $eventInfo
     //$data is data Object to sent with the event
   static function notify_driver($eventInfo,$data=null,$persist=false){
        //Driver App ID = '584C7FF2122D11EC89909801A8B0D7XKD'

        //Change this $app_prefix for different mobile app to different clients. For example, driver for BroExpress, Driver App for KonmonDelivery, or Driver app for Development environment
        $app_prefix ="dev";
        $d = $eventInfo;
        $app_id = getDriverAppId(); 
        $branch_id = isset($d->branch_id)?$d->branch_id:1;
        $target_user_id = isset($d->target_user_id)?$d->target_user_id:null;
        //if (empty($user_id)) $user_id = isset($d->user_id)?$d->user_id:null;
        $d->image_url = isset($d->image_url)?$d->image_url:null;

        $event_name = $d->event_name;

        // $optionBuilder = new OptionsBuilder();
        // $optionBuilder->setTimeToLive(60*20);

        // $notificationBuilder = new PayloadNotificationBuilder($d->title);
        // $notificationBuilder->setBody($d->message)
        //             ->setSound('default');

        //$dataBuilder = new PayloadDataBuilder();
        //NOTE $data is an associative array
        //$dataBuilder->addData($data);

        // $option = $optionBuilder->build();
        // $notification = $notificationBuilder->build();
        //$data = $dataBuilder->build();

        //$token = "a_registration_from_your_database";
        //$downstreamResponse = FCM::sendTo($token, $option, $notification, $data);

        $notificationBuilder = new PayloadNotificationBuilder($d->title);
        $notificationBuilder->setData((array)$data)
                            ->setBody($d->message)
                            ->setSound('default');
        
        $notification = $notificationBuilder->build();
        
        $topic = new Topics();
        $topic->topic($app_prefix.$event_name.".".$target_user_id);

        if(!is_array($data)) $data = (array)$data;
        $topicResponse = FCM::sendToTopic($topic,null, $notification,null);
        
        $topicResponse->isSuccess();
        $topicResponse->shouldRetry();
        $status = $topicResponse->error();
         if ($status == 1 && $persist==true){
              $expiry_time = Carbon::now()->addDay(2);
              //Save notification in db table
              DB::table('notifications')->insert(array(
                'app_id'=>$app_id,
                //"event_name"=>$event_name,
                "user_class"=>"driver", //target user_class
                'user_id'=>$user_id,
                'branch_id'=>$branch_id,
                'message'=>$d->message,
                'title'=>$d->title,
                'image_url'=>$d->image_url,
                'expiry_time'=>$expiry_time,
                'is_read'=>0,
                'create_date'=>getNowTime()
              ));
             // return $status;
         }    
         return $status;
   }
    
   static function notify_merchant($eventInfo,$data=null,$persist=false){
    //Driver App ID = '584C7FF2122D11EC89909801A8B0D7XKD'

    //Change this $app_prefix for different mobile app to different clients. For example, driver for BroExpress, Driver App for KonmonDelivery, or Driver app for Development environment
    $app_prefix ="dev";
    $d = $eventInfo;
    $app_id = getMerchantAppId(); 
    $branch_id = isset($d->branch_id)?$d->branch_id:1;
    $target_user_id = isset($d->target_user_id)?$d->target_user_id:null;
    //if (empty($user_id)) $user_id = isset($d->user_id)?$d->user_id:null;
    $d->image_url = isset($d->image_url)?$d->image_url:null;

    $event_name = $d->event_name;

    // $optionBuilder = new OptionsBuilder();
    // $optionBuilder->setTimeToLive(60*20);

    // $notificationBuilder = new PayloadNotificationBuilder($d->title);
    // $notificationBuilder->setBody($d->message)
    //             ->setSound('default');

    //$dataBuilder = new PayloadDataBuilder();
    //NOTE $data is an associative array
    //$dataBuilder->addData($data);

    // $option = $optionBuilder->build();
    // $notification = $notificationBuilder->build();
    //$data = $dataBuilder->build();

    //$token = "a_registration_from_your_database";
    //$downstreamResponse = FCM::sendTo($token, $option, $notification, $data);

    $notificationBuilder = new PayloadNotificationBuilder($d->title);
    $notificationBuilder->setData((array)$data)
                        ->setBody($d->message)
                        ->setSound('default');
    
    $notification = $notificationBuilder->build();
    
    $topic = new Topics();
    $topic->topic($app_prefix.$event_name.".".$target_user_id);

    if(!is_array($data)) $data = (array)$data;
    $topicResponse = FCM::sendToTopic($topic,null, $notification,null);
    
    $topicResponse->isSuccess();
    $topicResponse->shouldRetry();
    $status = $topicResponse->error();

     if ($status == 1 && $persist==true){
          $expiry_time = Carbon::now()->addDay(2);
          //Save notification in db table
          DB::table('notifications')->insert(array(
            'app_id'=>$app_id,
            //"event_name"=>$event_name,
            "user_class"=>"driver", //target user_class
            'user_id'=>$user_id,
            'branch_id'=>$branch_id,
            'message'=>$d->message,
            'title'=>$d->title,
            'image_url'=>$d->image_url,
            'expiry_time'=>$expiry_time,
            'is_read'=>0,
            'create_date'=>getNowTime()
          ));
         // return $status;
     }    
     return $status;
}

   //Admin or (Web) to Merchant or Driver (Mobile apps) (target_user_id ="*" => target all user of the @user_class) 
   //@event = {'name','title','message',image_url}
   //@payload is optional param that stores data holding extra information
   //$target_user_id ="*" => the notification is for all users of the given @user_class
   static function notify_app_users($branch_id,$user_class,$target_user_id,$event,$payload=null){
        //$branch_id = $ss->branch_id;
        $app_id = null;
        $event_name = $event->name;
        $title = $event->title;
        $message = $event->message;
        $image_url = isset($event->image_url)?$event->image_url:null;

        if ($target_user_id ==="*") $target_user_id = null;

        if($user_class ==='merchant') $app_id = getMerchantAppId();
        else if ($user_class ==='driver') $app_id = getDriverAppId();
        
        if(!$app_id) return DV::error('user_class or app_id is not correct');
    
        $expiry_time = Carbon::now()->addDay(2);

        //$dataBuilder = new PayloadDataBuilder();
        //$dataBuilder->addData([ 'data' => $payload]);

        $notificationBuilder = new PayloadNotificationBuilder($title);
        $notificationBuilder->setBody($message)
                            ->setSound('default')
                            ->setIcon($image_url);
                            //->setTimeToLive(60*20);
        $notification = $notificationBuilder->build();
        $notification->image = $image_url;
        $topic = new Topics();

        //use $target_user_id as topic_name to be broadasted through google FCM to Mobile App  
        //$topic_name =$target_user_id;
        $topic->topic($target_user_id?$target_user_id:"*");
        $topicResponse = FCM::sendToTopic($topic, null, $notification,null);
        
        $topicResponse->isSuccess();
        $topicResponse->shouldRetry();
        $status = $topicResponse->error();
       
        //if ($status == 1){
             
              //Save notification in db table
              if(!is_numeric($target_user_id)) $target_user_id = null;
              DB::table('notifications')->insert(array(
                'app_id'=>$app_id,
                'branch_id'=>$branch_id,
                'user_class'=>$user_class,
                'message'=>$message,
                'title'=>$title,
                'image_url'=>$image_url,
                'user_id'=>$target_user_id,
                'expiry_time'=>$expiry_time,
                'is_read'=>0,
                'create_date'=>getNowTime()
              ));
              //return $status;
         //}    
         return DV::success(["notification_status"=>$status]);
   }
 
   //$d= {'branch_id','user_class','user_id'}
   static function getNotificationListByUser($d){
      $ss = UM::getUserInfoByToken($d,-1);
      if ($ss->status_code !=200) return DV::emptyResult($ss->status_code,[]);
      return [];
      $branch_id = $ss->branch_id;
      $user_id = $d->user_id;
      $user_class = $d->user_class;
      
      $app_id = getAdminAppId();
     
      $more_wheres =null;
      if ($user_id > 0)
        $more_wheres .="(n.user_id ='".$user_id."' OR IFNULL(n.user_id,0) =0)";
      else  $more_wheres ="n.user_id = -1";  //return empty rows if there is user_id supplied
      $rows = DB::table('notifications AS n')->where('branch_id',$branch_id)->where('app_id',$app_id)->whereRaw($more_wheres)->selectRaw("n.id,is_read(n.id,n.user_id) AS is_read,CASE IFNULL(user_id,0) WHEN 0 THEN 'all' ELSE 'me' END AS target_user,message,title,is_read,image_url,create_date")->orderByRaw("create_date DESC")->get();
      return $rows;
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

    function send_fcm($token,$title,$message,$sub_title) {
      $url = "https://fcm.googleapis.com/fcm/send";
      $msg = array('message' => $message,
          'title' => $title,
          'subtitle' => $sub_title,
          'tickerText' => '...', //ticker text
          'vibrate' => 1,
          'sound' => 1
      );
  
      $fields = array('to' => $token,
          'priority' => 'high',
          'data' => array('message' => $msg)
           );
  
      $fcm_server_key = Config::get('app.fcm_server_key');     
      $headers = array(
        "Authorization:key=$fcm_server_key",
          //"Authorization:key=AAAABQs1Uak:APA91bFZldm-qTVqgZCnABLSz3Jn-QgTBjgYSP9_2FH5jY5LJtfMdQ0V-pK7O1-E2lpfHx2GaIj0PtsrsDWxVzo1ZOKh2lVghS6TnJVBxbVpM-V3kriXRIVbOC_ESTaxDH4buakWPaKR",
          'Content-Type:application/json'
      );
  
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_POST, true);
      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
      curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
      curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
      curl_setopt($ch, CURLOPT_TIMEOUT, 10);
      $result = curl_exec($ch);
      if ($result === FALSE) {
          die('CURL FAILED ' . curl_error($ch));
      }
  
      $info = curl_getinfo($ch);
  
      curl_close($ch);
      return array('result' => $result, 'status' => $info['http_code']);
  }
    
}
