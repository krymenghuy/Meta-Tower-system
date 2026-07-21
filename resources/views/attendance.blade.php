<!DOCTYPE html>
<html lang="<?php echo Session::get('lang', 'en'); $user = XAuthService::user(); ?>">
    <head>
        <base href="../">
        <meta charset="utf-8" />
        <title>Attendance</title>
        <link type="images/png" rel="icon" href="{{ asset('assets/images/meta/Meta_logo.png') }}" />
        <meta name="description" content="Updates and statistics">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <meta name="sess_branch_id" content="{{ sess_company_id() }}" />
        <meta name="sess_user_id" content="{{ sess_user_id() }}" />
        <meta name="base_url" content="{{ url('/') }}" />
        <meta name="asset_url" content="{{ asset('assets/') }}" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <?php
            StyleManager::render('prm-style', 1, 3);
        ?>
        <?php
            ScriptManager::render('attendance-script', 1,10);
        ?>
    </head>
    <body>
        <div id="_main_hidden_fields">
            <input type="hidden" id="__base_url" value="{{ url('/') }}"/>
            <input type="hidden" id="__xsp_name" value="_csrf_115578" />
            <input type="hidden" id="__xsp_value" value="<?php echo Str::random(30); ?>" />
        </div>
        <div class="h-100">
            @include('layouts.mhr.scanAttendanceComponent')
        </div>
    </body>
</html>
