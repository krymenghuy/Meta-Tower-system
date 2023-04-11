<?php 
    if(!Session::get('login_name')) return view('login.index'); 
    $role= \App\Models\UM::firstRole(Session::get('user_id'));
    $role_id = $role?$role->id:null;

    if ($role_id != 1 && $role_id != 2){
        echo "It seems you do not have correct role in this system. Contact administrator to resolve this issue";
        return;
    }
?>

<!DOCTYPE html>
<html lang="<?php echo Session::get('lang','en'); ?>">
    <head>
        <?php ScriptManager::render('priority-one',1);?>
        <base href="../">
        <meta charset="utf-8" />
        <title>Clinic Management System</title>
        <link type="images/png" rel="icon" href="{{ asset('assets/images/logo/logo.png') }}"/>
        <meta name="description" content="Updates and statistics">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <meta name="sess_branch_id" content="{{ sess_company_id() }}" />
        <meta name="sess_user_id" content="{{ sess_user_id() }}" />
        <meta name="base_url" content="{{ url('/') }}" />
        <meta name="asset_url" content="{{ asset('assets/') }}" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <?php StyleManager::render('vsmclinic-style',1); ?> 
        <style type="text/css">
            @media (min-width:1025px){
                .kt-header--fixed.kt-subheader--fixed.kt-subheader--enabled .kt-wrapper {
                    padding-top: 65px !important;
                }
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

            .kt-menu__link-text {
                font-size: 0.9em;
                font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }

            table th td {
                font-size: 0.9em;
                font-family: 'Khmer OS Content','Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
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

            .table .dropdown {
                position: absolute;
            }
        </style>
        <?php
            ScriptManager::render('primary',0);
            ScriptManager::render('primary-async',0);
            ScriptManager::render('primary-defer',1);
            ScriptManager::render('components',1);
        ?>
    </head>
    <body class="kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-page--loading">
        <div id="_main_hidden_fields">
            <input type="hidden" id="__base_url" value="{{ url('/') }}">
            <input type="hidden" id="__xsp_name" value="_csrf_115578" />
            <input type="hidden" id="__xsp_value" value="<?php echo Str::random(30); ?>" />
        </div>
        <img id="vs_loader1" width="270" height="170" style="display:none;position:fixed;z-index:1000;top:40%;left:40%" class="vs-loader" src="{{ asset('assets/images/vslogo1.gif') }}"/>
        <div id="kt_header_mobile" class="kt-header-mobile kt-header-mobile--fixed">
            <div class="kt-header-mobile__logo">
                <a href="javascript:void(0)">
                    <img alt="Logo" src="{{ asset('assets/images/logo/logo_esthederm.png') }}" />
                </a>
            </div>
            <div class="kt-header-mobile__toolbar">
                <button class="kt-header-mobile__toggler kt-header-mobile__toggler--left" id="kt_aside_mobile_toggler">
                    <span class="text-primary"></span>
                </button>
                <button class="kt-header-mobile__topbar-toggler" id="kt_header_mobile_topbar_toggler">
                    <i class="flaticon-more"></i>
                </button>
            </div>
        </div>
        <div class="kt-grid kt-grid--hor kt-grid--root">
            <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
                <div class="kt-aside kt-aside--fixed kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop" id="kt_aside">
                    @include('menus.menu')
                </div>
                <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">
                    <div id="kt_header" class="kt-header kt-grid__item kt-header--fixed">
                        <div class="kt-header-menu-wrapper" id="kt_header_menu_wrapper" style="padding:10px">
                            <div style="width:100%">
                                <div class="form-inline" style="float:left">
                                    <div class="screen-info">
                                        <div>
                                            <h5 class="screen-title trans-text" data-langprop="titles.dashboard" style="text-transform:uppercase" id="screen_title"></h5>
                                        </div>
                                    </div>
                                </div>
                                <div id="_main_top_right_menus" class="mainview-top-right" style="float:right">
                                    <div class="form-inline">
                                        <div class="dropdown">
                                            <button style="display:none" id="_main_btn_lang" class="btn-dropdown" data-menu="lang"
                                                style="margin-right:10px;padding:0px;border:none;background:none">
                                                <img class="mr-1" src="{{ asset('assets/images/icons/khmer.png') }}" style="height:25px" />
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
                                                        <a class="dropdown-item lnk-lang" data-lang="km" data-name="ខ្មែរ" href="javascript:void(0)">
                                                            <img class="menu-item-icon" src="{{ asset('assets/images/icons/khmer.png') }}"/>
                                                            ខ្មែរ
                                                        </a>
                                                    </span>
                                                    <span class="lang-menu-item">
                                                        <a class="dropdown-item lnk-lang" data-lang="en" data-name="English" href="javascript:void(0)">
                                                            <img class="menu-item-icon" src="{{ asset('assets/images/icons/english.png') }}"/>
                                                            English
                                                        </a>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="dropdown mr-3">
                                            <button id="_main_btn_notif" class="btn-dropdown" data-menu="notif" style="border:none;background:none">
                                                <img src="{{ asset('assets/images/icons/ringing.png') }}" style="height:18px;" />
                                                <span style="position:absolute;top:-15%;right:5%;color:red" id="_main_notif_count">0</span>
                                            </button>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <span class="notif-header">Notification</span>
                                                <div class="main-notif-panel"></div>
                                            </div>
                                        </div>
                                        <div class="dropdown">
                                            <button id="_main_btn_user" class="btn-dropdown" data-menu="user" style="margin-right:10px;padding:0px;border:none;background:none">
                                                <img class="mr-1" src="{{ asset('assets/images/icons/user.png') }}" style="height:30px"/>
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
                                                        <a id="_main_mnu_about" class="dropdown-item" href="javascript:void(0)">
                                                            <i class="fas fa-cog"></i>
                                                            About MClinic
                                                        </a>
                                                    </span>
                                                    <span class="user-menu-item">
                                                        <a id="_main_mnu_logout" class="dropdown-item" href="javascript:void(0)">
                                                            <i class="fas fa-sign-out-alt" style="font-size:0.8em"></i>
                                                            Log out
                                                        </a>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="animation-line" id="vs_loader" style="margin-top:25px"></div>
                    </div>
                    <div id="_p2" class="kt-content kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content" style="margin-top:-50px">
                        <div id="_p1" class="row">
                            <div class="col-lg-12 shadow-box" id="_app_content" style="background-color:#fff">
                                @include('layouts.inputBoxes')
                                @include('layouts.dashboardComponent')
                                @include('layouts.dashboard2Component')
                                @include('layouts.patientFinderComponent')
                                @include('layouts.appointmentListComponent')
                                @include('layouts.queueComponent')
                                @include('layouts.consultationQueueComponent')
                                @include('layouts.employeeListComponent')
                                @include('layouts.positionsComponent')
                                @include('layouts.laboPartnersComponent')
                                @include('layouts.vendorListComponent')
                                @include('layouts.invoicesComponent')
                                @include('layouts.patientRecieptsComponent')
                                @include('layouts.medicalServiceComponent')
                                @include('layouts.servicePlansComponent')
                                @include('layouts.serviceTrackingComponent')
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
                                @include('layouts.exchangeRatesComponent')
                                @include('layouts.stockTransferComponent')
                                @include('layouts.um.userManagementComponent')
                                @include('layouts.um.roleManagementComponent')
                                @include('layouts.mobileBrandImagesComponent')
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="kt-footer kt-grid__item kt-grid kt-grid--desktop kt-grid--ver-desktop" id="kt_footer">
                <div class="kt-container kt-container--fluid">
                    <div class="kt-footer__copyright">
                        2021&nbsp;&copy;&nbsp;
                        <a href="www.vectorasoft.com" target="_blank" class="kt-link">Vectorasoft</a>
                    </div>
                </div>
            </div>
        </div>
        <div>
        <div id="kt_scrolltop" class="kt-scrolltop">
            <i class="fa fa-arrow-up"></i>
        </div>
    </body>
</html>