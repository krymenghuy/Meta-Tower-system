<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/** the follow "use items" for FCM only **/
use NotificationChannels\Fcm\FcmChannel;
use NotificationChannels\Fcm\FcmMessage;
use NotificationChannels\Fcm\Resources\AndroidConfig;
use NotificationChannels\Fcm\Resources\AndroidFcmOptions;
use NotificationChannels\Fcm\Resources\AndroidNotification;
use NotificationChannels\Fcm\Resources\ApnsConfig;
use NotificationChannels\Fcm\Resources\ApnsFcmOptions;


class OrderCreated extends Notification
{
    protected $data =null;

    public function _construct($d){
      $this->data = $d;
    }

    public function via($notifiable)
    {
        return [FcmChannel::class];
    }
     
    public function toFcm($notifiable)
    {
        return FcmMessage::create()
            ->setData(['data' => $this->data])
            ->setNotification(\NotificationChannels\Fcm\Resources\Notification::create()
                ->setTitle('Order Created')
                ->setBody('Now new order created.')
                ->setImage('http://example.com/url-to-image-here.png'))
            ->setAndroid(
                AndroidConfig::create()
                    ->setFcmOptions(AndroidFcmOptions::create()->setAnalyticsLabel('analytics'))
                    ->setNotification(AndroidNotification::create()->setColor('#0A0A0A'))
            )->setApns(
                ApnsConfig::create()
                    ->setFcmOptions(ApnsFcmOptions::create()->setAnalyticsLabel('analytics_ios')));
    }

    // // optional method when using kreait/laravel-firebase:^3.0, this method can be omitted, defaults to the default project
    // public function fcmProject($notifiable, $message)
    // {
    //     // $message is what is returned by `toFcm`
    //     return 'app'; // name of the firebase project to use
    // }
     
}
