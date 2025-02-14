<?php
return [
    'user_classes' => [
        'admin' => [
            'used' => 1,
            'name' => 'Staff',
            'token_age' => null,
            'login_type' => 'name',
            'new_user_password_required' => 1,
            'fcm_topic_prefix'=>'bhr'
        ],
        'sales_agent' => [
            'used' => 1,
            'name' => 'Sales Agent',
            'token_age' => 0,
            'login_type' => 'phone',
            'new_user_password_required' => 1
        ]
    ],
    'profile_tables' => [
        //'merchant' => ['table' => 'sender', 'key_field' => 'id', 'code_field' => 'code', 'photo_field' => 'photo_file_name'],
        //'driver' => ['table' => 'driver', 'key_field' => 'id', 'code_field' => 'code', 'photo_field' => 'photo_file_name'],
        //'sales_agent' => ['table' => 'sales_agents', 'key_field' => 'id', 'code_field' => 'code', 'photo_field' => 'photo_file_name'],
        'admin' => ['table' => 'um_users', 'key_field' => 'id', 'code_field' => 'official_code', 'photo_field' => 'photo_file_name']
    ],
    'use_jwt' => true,
    'jwt' => [
        'jwt_encode' => 'HS256',
        'jwt_lifespan' => 2147483647,
        'jwt_key' => 'This is JWT key',
        'jwt_payload' => [
            'iis' => '',
            'aud' => ''
        ]
    ],
    //Fee apps refer to apps that we do not need to control permissions or module access. Users can access to everything
    'free_apps' => [
            // 'merchant_app_id' => env('MERCHANT_APP_ID', 'default_merchant_app_id'),
            // 'merchant_portal_app_id' => env('MERCHANT_PORTAL_APP_ID', 'default_merchant_portal_app_id'),
            // 'driver_app_id' => env('DRIVER_APP_ID', 'default_driver_app_id'),
            // 'sales_app_id' => env('SALES_APP_ID', 'default_sales_app_id'),
    ],
];