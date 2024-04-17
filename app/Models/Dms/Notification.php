<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Notifiable;
use DB;

class Notification extends Model
{
    use HasFactory;

    public function sendNotification()
    {
        $this->notify(new PackageDelivered($this)); //Pass the model data to the OneSignal Notificator
    }

    public function routeNotificationForOneSignal()
    {
        return ['tags' => ['key' => 'device_uuid', 'relation' => '=', 'value' => '1234567890-abcdefgh-1234567']];
    }
}
