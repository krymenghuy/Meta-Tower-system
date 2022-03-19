<?php

return [
    'driver' => env('FCM_PROTOCOL', 'http'),
    'log_enabled' => false,

    'http' => [
        'server_key' =>'AAAABQs1Uak:APA91bFZldm-qTVqgZCnABLSz3Jn-QgTBjgYSP9_2FH5jY5LJtfMdQ0V-pK7O1-E2lpfHx2GaIj0PtsrsDWxVzo1ZOKh2lVghS6TnJVBxbVpM-V3kriXRIVbOC_ESTaxDH4buakWPaKR',
        'sender_id' =>'21662880169',
        'server_send_url' => 'https://fcm.googleapis.com/fcm/send',
        'server_group_url' => 'https://android.googleapis.com/gcm/notification',
        'timeout' => 30.0, // in second
    ],
];
