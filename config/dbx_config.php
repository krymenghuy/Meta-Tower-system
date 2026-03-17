<?php

/**
 * ============================================================================
 * DBX Configuration
 * ============================================================================
 *
 * This configuration controls how DBX optimizes and interacts with
 * databases across different engines.
 *
 * DBX focuses on:
 *  - Index optimization
 *  - Case-insensitive search support
 *  - Query performance
 *  - Large dataset scalability
 *  - Schema analysis & integrity checks
 *
 * Works across:
 *  - PostgreSQL
 *  - MySQL / MariaDB
 *  - SQL Server
 *  - Oracle
 *
 * Developers usually only adjust:
 *   - searchable columns
 *   - compound indexes
 *   - timestamp column mapping
 *
 * ============================================================================
 */

return [

  'audit' => [

        /*
        |--------------------------------------------------------------------------
        | Enable / Disable Audit System Globally
        |--------------------------------------------------------------------------
        */
        'enabled' => true,

        /*
        |--------------------------------------------------------------------------
        | Audit Table Suffix
        |--------------------------------------------------------------------------
        | Example:
        |   package -> package_audit
        */
        'table_suffix' => '_audit',

        /*
        |--------------------------------------------------------------------------
        | Queue Name
        |--------------------------------------------------------------------------
        | Set null to use default queue
        */
        'queue' => 'audit',

        /*
        |--------------------------------------------------------------------------
        | Bulk Insert Chunk Size
        |--------------------------------------------------------------------------
        */
        'chunk_size' => 300,

        /*
        |--------------------------------------------------------------------------
        | Retry Attempts
        |--------------------------------------------------------------------------
        */
        'tries' => 3,

    ],
    'default_date_format'=>'d-M-Y',
    'default_time_format'=>'h:i',
    'default_datetime_format'=>'d-M-Y h:i',
    /*
    |--------------------------------------------------------------------------
    | Export Directory
    |--------------------------------------------------------------------------
    |
    | Optimization SQL scripts are exported here.
    | Default: database/optimization
    |
    */

    'export_to_directory' => database_path('optimization'),


    /*
    |--------------------------------------------------------------------------
    | Timestamp Column Mapping
    |--------------------------------------------------------------------------
    |
    | DBX automatically uses these columns for:
    |   - ordered pagination
    |   - cursor pagination
    |   - incremental queries
    |
    | Map DBX logical names to actual column names.
    |
    */

    'timestamp_columns' => [
        'created_at' => 'created_at', // or 'create_date'
        'updated_at' => 'updated_at', // or 'update_date'
    ],


    /*
    |--------------------------------------------------------------------------
    | Case-Insensitive Search Columns
    |--------------------------------------------------------------------------
    |
    | Columns that are frequently searched case-insensitively.
    |
    | DBX creates LOWER(column) indexes for PostgreSQL.
    | Other DB engines usually already support CI collation.
    |
    | Patterns:
    |   exact match:
    |       "name"
    |
    |   suffix match:
    |       "_email" matches:
    |           father_email
    |           contact_email
    |
    */
    'strict_text_search_columns' => [
        'code',
        'phone_number',
        'name_norm',
        'category_norm',
        'name_kh_norm',
        'status_norm',
        'descriptive_name_norm',
    ],

    'audit' => [

        /*
        |--------------------------------------------------------------------------
        | Enable / Disable Audit System Globally
        |--------------------------------------------------------------------------
        */
        'enabled' => true,

        /*
        |--------------------------------------------------------------------------
        | Audit Table Suffix
        |--------------------------------------------------------------------------
        | Example:
        |   package -> package_audit
        */
        'table_suffix' => '_audit',

        /*
        |--------------------------------------------------------------------------
        | Queue Name
        |--------------------------------------------------------------------------
        | Set null to use default queue
        */
        'queue' => 'audit',

        /*
        |--------------------------------------------------------------------------
        | Bulk Insert Chunk Size
        |--------------------------------------------------------------------------
        */
        'chunk_size' => 300,

        /*
        |--------------------------------------------------------------------------
        | Retry Attempts
        |--------------------------------------------------------------------------
        */
        'tries' => 3,

    ],
    'default_date_format'=>'d-M-Y',
    'default_time_format'=>'d-M-Y h:i',

    
    'fuzzy_search'=>[

        /*
        |--------------------------------------------------------------------------
        | Use Normalized Columns
        |--------------------------------------------------------------------------
        |
        | true  = index raw column directly (fastest)
        | false = DBX applies SQL normalization:
        |         LOWER(), REPLACE(), regex, etc.
        |
        | Recommended: true in production.
        |
        */
        'use_normalized_columns'=>true,

        /*
        |--------------------------------------------------------------------------
        | Fuzzy Search Columns
        |--------------------------------------------------------------------------
        |
        | Column name patterns matched across ALL tables.
        |
        | Patterns:
        |   name       → exact match
        |   _email     → suffix match
        |
        | PostgreSQL additionally uses trigram indexes.
        |
        */
        'normalized_columns'=>[
            'students'=>[
                '_search_student'=>['code','name','name_kh','phone_number'],
            ],
            'student_groups'=>[
                '_search_group'=>['descriptive_name','name'],
            ],
            'um_app_modules'=>[
                '_search_name'=>['name','code']
            ],
        ],
        'columns'=>[
            'name',
            'code',
            'phone_number',
            'email',
            '_email',
            '_phone',
            'description',
            'remarks',
            'notes',
            'category',
            'descriptive_name'
        ]
    ],
    /*
    |--------------------------------------------------------------------------
    | Compound Index Recommendations
    |--------------------------------------------------------------------------
    |
    | Frequently queried column combinations.
    |
    | Format:
    |
    |  table_name => [
    |       ['col1','col2'],
    |       ['col3','col4','col5']
    |  ]
    |
    */

    'compound_indexes' => [

        // Example logistics system
        'package' => [
            ['subs_id', 'create_date'],
            ['branch_id', 'status_id'],
            ['driver_id', 'status_id'],
        ],

        'delivery_packages' => [
            ['package_id', 'authorized'],
        ],

        'users' => [
            ['subs_id', 'role_id'],
        ],
    ],


    /*
    |--------------------------------------------------------------------------
    | Unique Index Expectations
    |--------------------------------------------------------------------------
    |
    | DBX integrity checker validates uniqueness here.
    |
    */

    'unique_indexes' => [

        'users' => [
            ['login_name'],
            ['email'],
        ],

        'drivers' => [
            ['code'],
        ],
    ],


    /*
    |--------------------------------------------------------------------------
    | Pagination Defaults
    |--------------------------------------------------------------------------
    |
    | Used by DBX fastPaginate and cursorPaginate.
    |
    */

    'pagination' => [
        'default_limit' => 20,
        'max_limit' => 500,
    ],


    /*
    |--------------------------------------------------------------------------
    | Large Dataset Threshold
    |--------------------------------------------------------------------------
    |
    | DBX switches strategies after threshold.
    |
    */

    'large_table_threshold' => 10_000_000,


    /*
    |--------------------------------------------------------------------------
    | Optimization Rules
    |--------------------------------------------------------------------------
    |
    | Global toggles for DBX optimizer.
    |
    */

    'optimizer' => [

        'auto_ci_indexes' => true,
        'auto_compound_indexes' => true,
        'analyze_tables_after_index' => true,

        'skip_system_tables' => true,
    ],


    /*
    |--------------------------------------------------------------------------
    | Integrity Check Rules
    |--------------------------------------------------------------------------
    |
    | Used by dbx:optimize:check-integrity
    |
    */

    'integrity' => [
        'check_duplicate_indexes' => true,
        'check_missing_indexes' => true,
        'check_unused_indexes' => false,
    ],


    /*
    |--------------------------------------------------------------------------
    | Logging
    |--------------------------------------------------------------------------
    |
    */

    'logging' => [
        'enabled' => true,
        'channel' => 'stack',
    ],
    /*
    |--------------------------------------------------------------------------
    | DBX Error Exposure Level
    |--------------------------------------------------------------------------
    | Controls how much internal detail is exposed in validation
    | and runtime errors.
    |
    | business   = User-safe, no internal details
    | technical  = Developer-focused, includes debug information
    */
    'error_exposure_level' =>  'business', //env('APP_DEBUG') ? 'technical' : 'business',

     /*
    |--------------------------------------------------------------------------
    | DBX Field Display Aliases
    |--------------------------------------------------------------------------
    | Used for smart friendly field name resolution in validation messages.
    */

    'validate_field_aliases' => [
        'sex' => 'Gender',
        'dob' => 'Date of Birth',
        'qr_code' => 'QR Code',
        'descriptive_name' => 'Group Label'
    ],

    /*
    |--------------------------------------------------------------------------
    | Uppercase Words
    |--------------------------------------------------------------------------
    | Words that should remain uppercase when converting snake_case.
    */

    'validate_upper_words' => [
        'id' => 'ID',
        'qr' => 'QR',
        'ip' => 'IP',
        'api' => 'API',
        'url' => 'URL',
    ],



    'audit' => [

        /*
        |--------------------------------------------------------------------------
        | Enable / Disable Audit System Globally
        |--------------------------------------------------------------------------
        */
        'enabled' => true,

        /*
        |--------------------------------------------------------------------------
        | Audit Table Suffix
        |--------------------------------------------------------------------------
        | Example:
        |   package -> package_audit
        */
        'table_suffix' => '_audit',

        /*
        |--------------------------------------------------------------------------
        | Queue Name
        |--------------------------------------------------------------------------
        | Set null to use default queue
        */
        'queue' => 'audit',

        /*
        |--------------------------------------------------------------------------
        | Bulk Insert Chunk Size
        |--------------------------------------------------------------------------
        */
        'chunk_size' => 300,

        /*
        |--------------------------------------------------------------------------
        | Retry Attempts
        |--------------------------------------------------------------------------
        */
        'tries' => 3,

    ],
    'default_date_format'=>'d-M-Y',
    'default_time_format'=>'d-M-Y h:i',




];
