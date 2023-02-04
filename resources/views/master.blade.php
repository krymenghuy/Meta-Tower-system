<?php 
   if(!Session::get('login_name')) return response()->view('/'); 
   $role= \App\Models\UM::firstRole(Session::get('user_id'));
   $role_id = $role?$role->id:null;
   if ($role_id != 1 && $role_id != 2) return response()->view('/'); 
?>

<!DOCTYPE html>
<html lang="<?php echo Session::get('lang','en'); ?>">
<!-- begin::Head -->

<head>
    <?php ScriptManager::render('priority-one',0);?>
    <!--begin::Base Path (base relative path for assets of this page) -->
    <base href="../">

    <!--end::Base Path -->
    <meta charset="utf-8" />
    <title>Esthederm Clinic Management</title>
    <link type="images/png" rel="icon" href="{{ asset('assets/images/logo/logo.jpg') }}">
    <meta name="description" content="Updates and statistics">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Prevent error 419 when we use ajax -->
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta name="sess_branch_id" content="{{ sess_company_id() }}" />
    <meta name="sess_user_id" content="{{ sess_user_id() }}" />
    <meta name="base_url" content="{{ url('/') }}" />
    <meta name="asset_url" content="{{ asset('assets/') }}" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!--begin::Fonts -->
    <script>
        // WebFontConfig = {
        //     google: {
        //         families: ['Roboto:300,400,700']
        //     }
        // };

        // (function(d) {
        //     var wf = d.createElement('script'), s = d.scripts[0];
        //     wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
        //     wf.async = true;
        //     s.parentNode.insertBefore(wf, s);
        // })(document);

    </script>
    <!--end::Fonts -->

    <!-- <link rel="stylesheet" href="{{ asset('assets/material-css/bootstrap.min.css') }}"> -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet"
        type="text/css" />
    <!-- <link rel="stylesheet" href="{{ asset('assets/material-css/mdb.min.css') }}"> -->
    <!-- <link rel="stylesheet" href="{{ asset('assets/material-css/compiled-addons-4.20.0.min.css') }}"> -->

    <!--begin::Page Vendors Styles(used by this page) -->
    <link href="{{ asset('assets/vendors/custom/datatables/datatables.bundle.css') }}"
        rel="stylesheet" type="text/css" />
    <!--end::Page Vendors Styles -->

    <!--begin::Page Vendors Styles(used by this page) -->
    <!-- <link href="{{ asset('assets/vendors/custom/fullcalendar/fullcalendar.bundle.css') }}" rel="stylesheet" type="text/css" /> -->

    <!--end::Page Vendors Styles -->

    <!--begin:: Global Mandatory Vendors -->
    <link
        href="{{ asset('assets/vendors/general/perfect-scrollbar/css/perfect-scrollbar.css') }}"
        rel="stylesheet" type="text/css" />

    <!--end:: Global Mandatory Vendors -->

    <!-- <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"> -->

    <!--begin:: Global Optional Vendors -->
    <link href="{{ asset('assets/vendors/general/tether/dist/css/tether.css') }}"
        rel="stylesheet" type="text/css" />
    <link
        href="{{ asset('assets/vendors/general/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css') }}"
        rel="stylesheet" type="text/css" />
    <link
        href="{{ asset('assets/vendors/general/bootstrap-datetime-picker/css/bootstrap-datetimepicker.css') }}"
        rel="stylesheet" type="text/css" />
    <link
        href="{{ asset('assets/vendors/general/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.css') }}"
        rel="stylesheet" type="text/css" />

    <link href="{{ asset('assets/css/select2.min.css') }}" rel="stylesheet" type="text/css" />
    <link
        href="{{ asset('assets/vendors/general/owl.carousel/dist/assets/owl.theme.default.css') }}"
        rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/vendors/general/dropzone/dist/dropzone.css') }}"
        rel="stylesheet" type="text/css" />

    <link
        href="{{ asset('assets/vendors/general/bootstrap-markdown/css/bootstrap-markdown.min.css') }}"
        rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/vendors/general/animate.css/animate.css') }}"
        rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/vendors/general/toastr/build/toastr.css') }}"
        rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/vendors/general/morris.js/morris.css') }}" rel="stylesheet"
        type="text/css" />

    <!-- <link href="{{ asset('assets/vendors/general/socicon/css/socicon.css') }}" rel="stylesheet" type="text/css" /> -->
    <link
        href="{{ asset('assets/vendors/custom/vendors/line-awesome/css/line-awesome.css') }}"
        rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/font-awesome/6.2.0/css/all.min.css') }}"
        rel="stylesheet" type="text/css" />

    <!--end:: Global Optional Vendors -->

    <!--begin::Global Theme Styles(used by all pages) -->
    <link href="{{ asset('assets/css/demo1/style.bundle.css') }}" rel="stylesheet"
        type="text/css" />
    <!--end::Global Theme Styles -->

    <!--begin::Layout Skins(used by all pages) -->
    <link href="{{ asset('assets/css/demo1/skins/header/base/light.css') }}"
        rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/loader.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/jquery.datepicker2.css') }}" rel="stylesheet"
        type="text/css" />
    <!-- <link href="{{ asset('assets/css/vs_multiple_select.css') }}" rel="stylesheet" type="text/css" /> -->
    <link href="{{ asset('assets/css/kt_override.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/app.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/vsstyle.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/sweetalert2.min.css') }}" rel="stylesheet" type="text/css" />

    <!-- Admin LTE -->
    <!-- <link href="{{ asset('assets/css/adminlte.css') }}" rel="stylesheet" type="text/css" /> -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/chart.js/Chart.css') }}">
    <!-- Ionicons -->
    <!-- <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"> -->
    <!-- ::End AndimLte -->

    <style type="text/css">
        /* html,body{
          font-size:1em; 
          font-family:'Robotto','Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)',"Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",'Arial (sans-serif)','Tahoma (sans-serif)';
        }
         */
        <blade media|%20(min-width%3A%201025px)%20%7B>.kt-header--fixed.kt-subheader--fixed.kt-subheader--enabled .kt-wrapper {
            padding-top: 65px !important;
        }

        .required:after {
            content: '*';
            color: red;
            padding-left: 5px;
        }

        .btn-dropdown {
            min-width: 36px;
        }

        .required:after {
            content: '*';
            color: red;
            padding-left: 5px;
        }

        .mainview-top-right {
            margin-right: 0;
            display: block;
        }

        .mainview-top-right .dropdown-menu {
            padding: 0;
        }

        .main-task-item {
            display: block;
            padding: 5px;
            border-radius: 3px;
            border: 1px solid #CDEDF1;
            margin: 0;
            font-size: 0.9em;
        }

        .main-task-item .task-text {
            color: grey;
            display: block;
            padding: 3px;
            font-size: 0.89em;
        }

        .main-task-item .task-buttons {
            position: relative;
        }

        .main-task-item .task-title {
            color: #000;
            display: block;
            padding: 3px;
        }

        .main-notif-item {
            display: block;
            padding: 3px;
            border-radius: 5px;
            border: 1px solid #F5EFD8;
            margin: 0;
        }

        .main-notif-item .notif-title {
            display: inline-block;
            padding: 3px;
            font-weight: bold;
            color: grey;
            font-size: 0.9em;
        }

        .main-notif-item .notif-text {
            display: block;
            padding: 3px;
            color: grey;
            font-size: 0.89em;
        }

        .menu-item-icon {
            height: 25px;
            width: 25px;
        }

        .user-menu-item {
            width: 100%;
            padding: 10px 20px 10px 20px;
            font-size: 1.1em;
            display: inline-block;
            border-bottom: 1px solid lightgrey;
        }

        .lang-menu-item {
            width: 100%;
            padding: 5px 5px 10px 10px;
            font-size: 1.1em;
            display: inline-block;
            border-bottom: 1px solid lightgrey;
        }

        .main-task-panel {
            margin-top: -7px;
            width: 450px;
            max-height: 500px;
            overflow: auto;
        }

        .main-notif-panel {
            margin-top: -7px;
            border-radius: 5px;
            width: 450px;
            max-height: 35vwpx;
            overflow: auto;
        }

        .main-user-menus {
            width: 250px;
            margin-top: -7px;
            max-height: 500px;
            overflow: auto;
        }

        .main-lang-menus {
            width: 250px;
            margin-top: -7px;
            max-height: 500px;
            overflow: auto;
        }

        .task-header,
        .notif-header {
            margin-top: -7px;
            border-radius: 5px 5px 0px 0px;
            display: inline-block;
            width: 100%;
            padding: 3px;
            font-weight: bold;
            color: #fff;
            font-size: 1em;
        }

        .user-menu-header {
            margin-top: -7px;
            display: inline-block;
            width: 100%;
            font-size: 1.2em;
            background-color: #1CB6CD;
            font-weight: bold;
        }

        .lang-menu-header {
            margin-top: -7px;
            display: inline-block;
            width: 100%;
            font-size: 1.1em;
            background-color: #1CB6CD;
            font-weight: bold;
        }

        .task-header {
            background-color: #1CB6CD;
        }

        .notif-header {
            background-color: #E5C40A;
        }

        .task-btn-approved,
        .task-btn-rejected {
            font-size: 0.9em;
        }

        .input-group-addon {
            background: #F2F7F7;
            text-align: center;
            padding: 5px;
            min-width: 35px;
            border: 0.9px solid #DBDFDF;
            border-radius: 3px 0px 0px 3px;
        }

        /* .btn-outline-success, .btn-outline-danger, .btn-outline-primary, .btn-outline-warning{
          border-width:0.9px !important;
          font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)' !important;
        }
        */
        .kt-menu__link-text {
            font-size: 0.9em;
            font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
        }

        table th td {
            font-size: 0.9em;
            font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';

        }

        .kt-menu__item--open {
            background-color: #fff;
        }

        .kt-menu__item--open>a .kt-menu__link-text {
            font-weight: bold !important;
        }

        .screen-title {
            color: #000 !important;
            font-size: 1.2em;
            font-weight: bold;
            font-family:Montserrat;
            opacity:0.7;
        }

        /* #kt_header{
          background-image: url("{{ asset('assets/images/bg/silver1.jpg') }}");
          background-repeat: no-repeat, repeat;
        }
        #kt_aside_brand {
          background-image: url("{{ asset('assets/images/bg/silver.jpg') }}");
          background-repeat: no-repeat, no-repeat;
        } */

        /** ensure dropdown menus inside table appear above table **/
        .table .dropdown {
            position: absolute;
        }

        /* .backdrop {
        z-index:100;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: black;
        opacity: 0.5;
      } */

    </style>

    <?php
    ScriptManager::render('primary',1);
    ScriptManager::render('primary-async',1);
    ScriptManager::render('primary-defer',1);
    ScriptManager::render('pdfmake',0);
  ?>

</head>

<!-- end::Head -->

<!-- begin::Body -->

<body
    class="kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-page--loading">
    <div id="_main_hidden_fields">
        <input type="hidden" id="__base_url" value="{{ url('/') }}">
        <input type="hidden" id="__xsp_name" value="_csrf_115578" />
        <input type="hidden" id="__xsp_value" value="<?php echo Str::random(30); ?>" />
    </div>

    <!-- <div class="backdrop"></div> -->
    <img id="vs_loader1" width="270" height="170" style="display:none;position:fixed;z-index:1000;top:40%;left:40%"
        class="vs-loader" src="{{ asset('assets/images/vslogo1.gif') }}">
    <!-- begin:: Page -->

    <!-- begin:: Header Mobile -->
    <div id="kt_header_mobile" class="kt-header-mobile  kt-header-mobile--fixed ">
        <div class="kt-header-mobile__logo">
            <a href="javascript:;">
                <img alt="Logo" src="{{ asset('assets/media/logos/logo-light.png') }}" />
            </a>
        </div>
        <div class="kt-header-mobile__toolbar">
            <button class="kt-header-mobile__toggler kt-header-mobile__toggler--left" id="kt_aside_mobile_toggler">
                <span class="text-primary"></span>
            </button>
            <!-- <button class="kt-header-mobile__toggler" id="kt_header_mobile_toggler">
          <span class="text-success"></span>
        </button> -->
            <button class="kt-header-mobile__topbar-toggler" id="kt_header_mobile_topbar_toggler">
                <i class="flaticon-more"></i>
            </button>
        </div>
    </div>
    <!-- end:: Header Mobile -->
    <div class="kt-grid kt-grid--hor kt-grid--root">
        <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">

            <!-- begin:: Aside -->
            <!-- <button class="kt-aside-close " id="kt_aside_close_btn">
          <i class="la la-close"></i>
        </button> -->
            <div class="kt-aside  kt-aside--fixed  kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop"
                id="kt_aside">

                <!-- begin:: Aside -->
                <div class="kt-aside__brand kt-grid__item" id="kt_aside_brand">
                    <div class="kt-aside__brand-logo">
                        <!-- <span id="_dms_brand_label">{{ session('login_name') }}</span> -->
                        <img src="{{ asset('assets/images/icons/logo.jpg') }}" alt=""
                            class="img-logo" />
                    </div>

                    <div class="kt-aside__brand-tools">
                        <button class="kt-aside__brand-aside-toggler" id="kt_aside_toggler"
                            style="padding;10px;font-size:1.3em !important">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                                        <path
                                            d="M5.29288961,6.70710318 C4.90236532,6.31657888 4.90236532,5.68341391 5.29288961,5.29288961 C5.68341391,4.90236532 6.31657888,4.90236532 6.70710318,5.29288961 L12.7071032,11.2928896 C13.0856821,11.6714686 13.0989277,12.281055 12.7371505,12.675721 L7.23715054,18.675721 C6.86395813,19.08284 6.23139076,19.1103429 5.82427177,18.7371505 C5.41715278,18.3639581 5.38964985,17.7313908 5.76284226,17.3242718 L10.6158586,12.0300721 L5.29288961,6.70710318 Z"
                                            id="Path-94" fill="#000000" fill-rule="nonzero"
                                            transform="translate(8.999997, 11.999999) scale(-1, 1) translate(-8.999997, -11.999999) " />
                                        <path
                                            d="M10.7071009,15.7071068 C10.3165766,16.0976311 9.68341162,16.0976311 9.29288733,15.7071068 C8.90236304,15.3165825 8.90236304,14.6834175 9.29288733,14.2928932 L15.2928873,8.29289322 C15.6714663,7.91431428 16.2810527,7.90106866 16.6757187,8.26284586 L22.6757187,13.7628459 C23.0828377,14.1360383 23.1103407,14.7686056 22.7371482,15.1757246 C22.3639558,15.5828436 21.7313885,15.6103465 21.3242695,15.2371541 L16.0300699,10.3841378 L10.7071009,15.7071068 Z"
                                            id="Path-94" fill="#000000" fill-rule="nonzero" opacity="0.3"
                                            transform="translate(15.999997, 11.999999) scale(-1, 1) rotate(-270.000000) translate(-15.999997, -11.999999) " />
                                    </g>
                                </svg>
                            </span>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                                        <path
                                            d="M12.2928955,6.70710318 C11.9023712,6.31657888 11.9023712,5.68341391 12.2928955,5.29288961 C12.6834198,4.90236532 13.3165848,4.90236532 13.7071091,5.29288961 L19.7071091,11.2928896 C20.085688,11.6714686 20.0989336,12.281055 19.7371564,12.675721 L14.2371564,18.675721 C13.863964,19.08284 13.2313966,19.1103429 12.8242777,18.7371505 C12.4171587,18.3639581 12.3896557,17.7313908 12.7628481,17.3242718 L17.6158645,12.0300721 L12.2928955,6.70710318 Z"
                                            id="Path-94" fill="#000000" fill-rule="nonzero" />
                                        <path
                                            d="M3.70710678,15.7071068 C3.31658249,16.0976311 2.68341751,16.0976311 2.29289322,15.7071068 C1.90236893,15.3165825 1.90236893,14.6834175 2.29289322,14.2928932 L8.29289322,8.29289322 C8.67147216,7.91431428 9.28105859,7.90106866 9.67572463,8.26284586 L15.6757246,13.7628459 C16.0828436,14.1360383 16.1103465,14.7686056 15.7371541,15.1757246 C15.3639617,15.5828436 14.7313944,15.6103465 14.3242754,15.2371541 L9.03007575,10.3841378 L3.70710678,15.7071068 Z"
                                            id="Path-94" fill="#000000" fill-rule="nonzero" opacity="0.3"
                                            transform="translate(9.000003, 11.999999) rotate(-270.000000) translate(-9.000003, -11.999999) " />
                                    </g>
                                </svg>
                            </span>
                        </button>

                        <button class="kt-aside__brand-aside-toggler kt-aside__brand-aside-toggler--left"
                            id="kt_aside_toggler">
                            <span></span>
                        </button>
                    </div>
                </div>
                <!-- end:: Aside -->

                <!-- begin:: Aside Menu -->
                @include('menus.menu')
                <!-- end:: Aside Menu -->
            </div>
            <!-- end:: Aside -->
            <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">

                <!-- begin:: Header -->
                <div id="kt_header" class="kt-header kt-grid__item  kt-header--fixed">

                    <!-- begin:: Header Menu-->
                    <div class="kt-header-menu-wrapper" id="kt_header_menu_wrapper" style="padding:10px">
                        <div style="width:100%;">
                            <div class="form-inline" style="float:left">
                                <div class="screen-info">
                                    <!-- <div>
                                        <h5 class="screen-title trans-text" data-langprop="titles.dashboard"
                                            style="text-transform:uppercase" id="screen_title"></h5>
                                    </div> -->
                                </div>
                            </div>

                            <div id="_main_top_right_menus" class="mainview-top-right" style="float:right">
                                <div class="form-inline">
                                    <div class="dropdown">
                                        <button id="_main_btn_lang" class="btn-dropdown" data-menu="lang"
                                            style="display:none;margin-right:10px;padding:0px;border:none;background:none;">
                                            <img class="mr-1"
                                                src="{{ asset('assets/images/icons/khmer.png') }}"
                                                style="height:25px;" />
                                            <span id="_main_lang_name">
                                                <?php
                                                echo Session::get('lang_name','Khmer');
                                                ?>
                                            </span>
                                        </button>
                                        <div class="dropdown-menu dropdown-menu-right">
                                            <span class="lang-menu-header"></span>
                                            <div class="main-lang-menus">
                                                <span class="lang-menu-item">
                                                    <a class="dropdown-item lnk-lang" data-lang="km" data-name="ខ្មែរ"
                                                        href="javascript:void(0)">
                                                        <img class="menu-item-icon"
                                                            src="{{ asset('assets/images/icons/khmer.png') }}" />
                                                        ខ្មែរ
                                                    </a>
                                                </span>
                                                <span class="lang-menu-item">
                                                    <a class="dropdown-item lnk-lang" data-lang="en" data-name="English"
                                                        href="javascript:void(0)">
                                                        <img class="menu-item-icon"
                                                            src="{{ asset('assets/images/icons/english.png') }}" />
                                                        English
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- <div class="dropdown">
                  <button id="_main_btn_tasks" class="btn-dropdown" data-menu="task" style="border:none;background:none;">
                    <img src="{{ asset('assets/images/icons/request.png') }}" style="height:20px;"/>
                    <span style="position:absolute;top:-15%;right:5%;color:red;" id="_main_span_task_count">0</span>
                  </button>
                  <div class="dropdown-menu dropdown-menu-right">
                    <span class="task-header">Requests</span> 
                    <div class="main-task-panel"></div>
                  </div>
                </div> -->

                                    <div class="dropdown mr-3">
                                        <button id="_main_btn_notif" class="btn-dropdown" data-menu="notif"
                                            style="border:none;background:none;">
                                            <img src="{{ asset('assets/images/icons/ringing.png') }}"
                                                style="height:18px;" />
                                            <span style="position:absolute;top:-15%;right:5%;color:red;"
                                                id="_main_notif_count">0</span>
                                        </button>
                                        <div class="dropdown-menu dropdown-menu-right">
                                            <span class="notif-header">Notification</span>
                                            <div class="main-notif-panel"></div>
                                        </div>
                                    </div>

                                    <div class="dropdown">
                                        <button id="_main_btn_user" class="btn-dropdown" data-menu="user"
                                            style="margin-right:10px;padding:0px;border:none;background:none;">
                                            <img class="mr-1"
                                                src="{{ asset('assets/images/icons/user.png') }}"
                                                style="height:30px;" />
                                            <span>
                                                <?php
                        echo Session::get('login_name','Unknown');
                      ?>
                                            </span>
                                        </button>
                                        <div class="dropdown-menu dropdown-menu-right">
                                            <span class="user-menu-header"></span>
                                            <div class="main-user-menus">
                                                <span class="user-menu-item">
                                                    <a id="_main_mnu_about" class="dropdown-item"
                                                        href="javascript:void(0)">
                                                        <i class="fas fa-cog"></i> About MClinic
                                                    </a>
                                                </span>
                                                <span class="user-menu-item">
                                                    <a id="_main_mnu_logout" class="dropdown-item"
                                                        href="javascript:void(0)">
                                                        <i class="fas fa-sign-out-alt" style="font-size:0.8em"></i> Log
                                                        out
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- end:: Header Menu -->

                    <div class="animation-line" id="vs_loader" style="margin-top:25px;"></div>
                </div>
                <!-- end:: Header -->

                <!-- Begin::Container -->
                <div id="_p2" class="kt-content kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content"
                    style="margin-top:-50px;">
                    <div id="_p1" class="row">
                        <h5 class="screen-title trans-text ms-5 py-2" data-langprop="titles.dashboard" style="text-transform:uppercase" id="screen_title"></h5>
                        <div class="col-lg-12 shadow-box" id="_app_content" style="background-color:#fff;">
                            <!-- if put "layouts.tripListComponent" at bottom  => then there is error in pages -->
                            @include('layouts.inputBoxes')
                            @include('layouts.dashboardComponent')
                            @include('layouts.patientFinderComponent')
                            @include('layouts.appointmentListComponent')
                            @include('layouts.queueComponent')
                            @include('layouts.consultationQueueComponent')
                            @include('layouts.employeeListComponent')
                            @include('layouts.positionsComponent')
                            @include('layouts.laboPartnersComponent')
                            @include('layouts.vendorsComponent')
                            @include('layouts.patientInvoicesComponent')
                            @include('layouts.patientRecieptsComponent')
                            @include('layouts.medicalServiceComponent')
                            @include('layouts.itemsComponent')
                            @include('layouts.itemGroupsComponent')
                            @include('layouts.stockTrackingComponent')
                            @include('layouts.categoriesComponent')
                            @include('layouts.patientListComponent')
                            @include('layouts.expenseBookComponent')
                            @include('layouts.reportCenterComponent')
                            @include('layouts.companyComponent')
                            @include('layouts.locationComponent')
                            @include('layouts.serviceDepartmentsComponent')
                            @include('layouts.chiefComplaintsComponent')
                            @include('layouts.exchangeRateComponent')
                            @include('layouts.um.userManagementComponent')
                            @include('layouts.um.roleManagementComponent')
                            @include('layouts.mobileBrandImagesComponent')
                        </div>
                        <!--end:: div#_app_content-->
                        <?php 
            ScriptManager::render('mainjs',1); 
            ScriptManager::render('components',1); 
          ?>
                    </div>
                </div>
            </div>
            <!--added to fix layout-->
        </div>

        <!-- End::Container -->

        <!-- begin:: Footer -->

        <div class="kt-footer  kt-grid__item kt-grid kt-grid--desktop kt-grid--ver-desktop" id="kt_footer">
            <div class="kt-container  kt-container--fluid ">
                <div class="kt-footer__copyright">
                    2021&nbsp;&copy;&nbsp;<a href="www.vectorasoft.com" target="_blank" class="kt-link">Vectorasoft</a>
                </div>
                <!-- <div class="kt-footer__menu">
        <a href="http://keenthemes.com/metronic" target="_blank" class="kt-footer__menu-link kt-link">About</a>
        <a href="http://keenthemes.com/metronic" target="_blank" class="kt-footer__menu-link kt-link">Team</a>
        <a href="http://keenthemes.com/metronic" target="_blank" class="kt-footer__menu-link kt-link">Contact</a>
      </div> -->
            </div>
        </div>

        <!-- end:: Footer -->
    </div>
    <!-- </div>
</div>  -->
    <div>
        <!-- end:: Page -->

        <!-- begin::Scrolltop -->
        <div id="kt_scrolltop" class="kt-scrolltop">
            <i class="fa fa-arrow-up"></i>
        </div>
        <!-- end::Scrolltop -->


        <!-- begin::Global Config(global config for global JS scripts) -->
        <script>
            let KTAppOptions = {
                "colors": {
                    "state": {
                        "brand": "#5d78ff",
                        "dark": "#282a3c",
                        "light": "#ffffff",
                        "primary": "#5867dd",
                        "success": "#34bfa3",
                        "info": "#36a3f7",
                        "warning": "#ffb822",
                        "danger": "#fd3995"
                    },
                    "base": {
                        "label": ["#c5cbe3", "#a1a8c3", "#3d4465", "#3e4466"],
                        "shape": ["#f0f3ff", "#d9dffa", "#afb4d4", "#646c9a"]
                    }
                }
            };

        </script>

        <!-- end::Global Config -->
</body>
<!-- end::Body -->

</html>
