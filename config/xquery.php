<?php
return [

  'optimize_for_search' => [
    'enabled' => true,
  ],

  'route' => [
    'enabled'    => true,
    'prefix'     => 'api',
    'path'       => 'xquery',
    'middleware' => ['api'],
    'allow_get'  => true,
    'allow_post' => true,
  ],

  'allow_all_tables' => env('XQUERY_ALLOW_ALL_TABLES', false),

  'allow_where_raw_all_tables' => false,
  'allow_where_raw' => [
    'driver'  => false,
    'sender'  => false,
    'package' => false,
  ],

  'allowed_tables' => [
    // 'students',
  ],

  'allowed_columns' => [
    'tenants' => ['id','name','code','name_kh','email','phone_number'],
  ],

  'searchable_columns' => [
    'students' => ['name','code','phone_number','email'],
  ],

  'allowed_join_tables' => [
    // 'students' => ['enrollments'],
  ],

  'limits' => [
    'max_limit_get'  => 50,
    'max_limit_post' => 50,
    'default_limit'  => 20,
    'min_chars_get'  => 0,
  ],

  'where_ops' => [
    '=', '!=', '<', '<=', '>', '>=',
    'IN', 'NOT IN',
    'IS', 'IS NOT',
    'LIKE','ILIKE',
    'BETWEEN',
    'STARTSWITH',
    'ENDS',
    'CONTAINS'
  ],

  'blueprint' => [
    'enable_cache' => true,
    'ttl_seconds'  => (int) env('XQUERY_BLUEPRINT_TTL', 300),
    'cache_prefix' => 'vs_xquery_blueprint:',
  ],

  'sql_cache' => [
    'enabled'      => true,
    'ttl_seconds'  => 300,
    'cache_prefix' => 'vs_xquery_sql:',
  ],

  'throttle' => [
    'enabled'         => true,
    'min_interval_ms' => 150,
    'ttl_seconds'     => 5,
    'mode'            => 'sleep',
    'cache_prefix'    => 'vs_xquery_throttle:',
  ],
  'route' => [
      'enabled' => true,
      'prefix' => 'api',
      'path' => 'xquery',

      'middleware' => [
          'auth.api',
          //'throttle:600,1',
      ],

      'allow_post' => true,
  ],

  'debug' => [
    'log_sql' => false,
    'show_query_exec_time'=> false,
  ],
];
