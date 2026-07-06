<?php
return [
    'connection' => env('AUTHDB_CONNECTION', 'auth_db'),
    'user_classes' => [
        'admin' => [
            'used' => 1,
            'name' => 'Staff',
            'token_age' => null,
            'login_type' => 'name',
            'new_user_password_required' => 1,
            'fcm_topic_prefix'=>'prm'
        ],
        'tenant' => [
            'used' => 1,
            'name' => 'Tenant',
            'token_age' => 0,
            'login_type' => 'name',
            'new_user_password_required' => 1,
            'fcm_topic_prefix'=>'tenant'

        ],
        'tenant_member' =>[
            'used' => 1,
            'name' => 'Tenant Member',
            'parent_class'=>'tenant',
            'token_age' => null,
            'login_type' => 'name',
            'new_user_password_required' => 1,
            'fcm_topic_prefix'=>'tenant'
        ],
    ],
    'profile_tables' => [
        'tenant' => ['table' => 'tenants', 'key_field' => 'id', 'code_field' => 'code', 'photo_field' => 'photo_file_name'],
        'tenant_member' => ['table' => 'team_member', 'key_field' => 'id', 'code_field' => 'code', 'photo_field' => 'photo_file_name'],
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
        // env('STUDENT_APP_ID', null),
        // env('TEACHER_APP_ID', null),
        // env('PARENT_APP_ID', null)
    ],
];