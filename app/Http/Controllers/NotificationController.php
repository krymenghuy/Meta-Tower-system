<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

use LaravelFCM\Facades\FCM;
use LaravelFCM\Message\OptionsBuilder;
use LaravelFCM\Message\PayloadDataBuilder;
use LaravelFCM\Message\PayloadNotificationBuilder;
use LaravelFCM\Message\Topics;

class NotificationController extends Controller
{
    public function testNotification(){
        $notificationBuilder = new PayloadNotificationBuilder('my title');
        $notificationBuilder->setBody('My Testing')
                            ->setSound('default');
        
        $notification = $notificationBuilder->build();
        
        $topic = new Topics();
        $topic->topic('push_for_all_shop');
        
        $topicResponse = FCM::sendToTopic($topic, null, $notification, null);
        
        $topicResponse->isSuccess();
        $topicResponse->shouldRetry();
        $topicResponse->error();

    }
}
