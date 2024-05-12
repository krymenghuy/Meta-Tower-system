<!DOCTYPE html>
<html lang="<?php echo Session::get('lang', 'en'); ?>">
    <head>
        <base href="../">
        <meta charset="utf-8" />
        <title>Delivery Management System</title>
        <link type="images/png" rel="icon" href="{{ asset('assets/images/logo/logo.jpg') }}" />
        <meta name="description" content="Updates and statistics">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <meta name="sess_branch_id" content="{{ sess_company_id() }}" />
        <meta name="sess_user_id" content="{{ sess_user_id() }}" />
        <meta name="base_url" content="{{ url('/') }}" />
        <meta name="main_route" content="dms" />
        <meta name="default_component" content="<?php echo $defaultComponent; ?>" />
        <meta name="asset_url" content="{{ asset('assets') }}" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">
        <?php
            StyleManager::render('dms-style', 1);
        ?>
        <?php
            ScriptManager::render('priority-one',1);
            ScriptManager::render('primary', 1);
            ScriptManager::render('primary-defer',1);
            ScriptManager::render('dms-components', 1);
            ScriptManager::render('pdfmake', 1);
        ?>
    </head>
    <body style="display:none" class="kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed">
        <div id="vs_loading"></div>
        <?php
            ScriptManager::render('primary-loader', 1);
        ?>
        <div id="_main_hidden_fields">
            <input type="hidden" id="__base_url" value="{{ url('/') }}"/>
            <input type="hidden" id="__xsp_name" value="_csrf_115578" />
            <input type="hidden" id="__xsp_value" value="<?php echo Str::random(30); ?>" />
        </div>
        <div id="kt_header_mobile" class="kt-header-mobile kt-header-mobile--fixed">
            <div class="kt-header-mobile__logo">
                <a href="javascript:void(0)">
                    <img alt="Logo" src="{{ asset('assets/images/logo/logo.png') }}" />
                </a>
            </div>
            <div class="kt-header-mobile__toolbar" style="margin-bottom:10px">
                <button class="kt-header-mobile__toggler kt-header-mobile__toggler--left" id="kt_aside_mobile_toggler">
                    <span class="text-primary"></span>
                </button>
                <button class="kt-header-mobile__topbar-toggler" id="kt_header_mobile_topbar_toggler">
                    <i class="flaticon-more"></i>
                </button>
                <div class="d-flex flex-row justify-content-center w-100 shadow rounded-5 mb-2 mt-1">
                    <h4 id="mobile_screen_title" class="trans-text mobile-screen-title p-1"></h4>
                </div>
            </div>
        </div>
        <div class="kt-grid kt-grid--hor kt-grid--root">
            <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
                <div class="kt-aside kt-aside--fixed kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop" id="kt_aside">
                    @include('menus.dms_menu')
                </div>
                <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">
                    <div id="kt_header" class="kt-header kt-grid__item kt-header--fixed">
                        <div class="animation-line line--loader" style="display:none" id="vs_loader"></div>
                        <div class="kt-header-menu-wrapper" id="kt_header_menu_wrapper">
                            <div class="d-flex flex-row flex-wrap justify-content-between">
                                <div class="mainview-top-right">
                                    <div class="show--title flex-grow-1">
                                        <div class="screen-info">
                                            <h5 class="screen-title mb-0 trans-text" data-langprop="titles.dashboard" style="text-transform:uppercase" id="screen_title">Dashboard</h5>
                                        </div>
                                    </div>
                                    <div id="_main_top_right_menus" class="d-flex flex-row gap-2 flex-wrap justify-content-center align-items-center">
                                        <div class="dropdown shadow-lg rounded-5 bg-white choose--language">
                                            <button id="_main_btn_lang" class="btn-dropdown align--language" data-menu="lang">
                                                <img class="mr-1" src="{{ asset('assets/images/icons/khmer.png') }}" style="height:25px" />
                                                <span id="_main_lang_name">
                                                    <?php
                                                        echo Session::get('lang_name', 'Khmer');
                                                    ?>
                                                </span>
                                                <i class="fa-solid fa-caret-down ps-2 fs-5"></i>
                                            </button>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <span class="lang-menu-header"></span>
                                                <div class="main-lang-menus">
                                                    <span class="lang-menu-item">
                                                        <a class="dropdown-item lnk-lang" data-lang="km" data-name="ខ្មែរ" href="javascript:void(0)">
                                                            <img class="menu-item-icon" src="{{ asset('assets/images/icons/khmer.png') }}" />
                                                            ខ្មែរ
                                                        </a>
                                                    </span>
                                                    <span class="lang-menu-item">
                                                        <a class="dropdown-item lnk-lang" data-lang="en" data-name="English" href="javascript:void(0)">
                                                            <img class="menu-item-icon" src="{{ asset('assets/images/icons/english.png') }}" />
                                                            English
                                                        </a>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="dropdown mr-3 shadow-lg rounded-5 bg-white nav--notification">
                                            <button id="_main_btn_notif" class="btn-dropdown main-menu-button" data-menu="notif">
                                                <i class="fa-regular fa-bell fs-4"></i>
                                                <span class="number--notification notif-count" id="_main_notif_count">0</span>
                                            </button>
                                            <div class="dropdown-menu dropdown-menu-right notification-dropdown position-absolute">
                                                <div class="con--header">
                                                    <span class="d-block text-center text-white">Notification</span>
                                                </div>
                                                <div class="main-notif-panel"></div>
                                            </div>
                                        </div>

                                        <div class="dropdown shadow-lg rounded-5 bg-white app--list">
                                            <button class="btn-dropdown main-menu-button ml-1" data-menu="app">
                                                 <img class="ml-2 mt-1" style="width:25px; height:25px" src="{{ asset('assets/images/icons/grid.svg')}}" />
                                                <span></span>
                                            </button>
 
                                            <div class="dropdown-menu shadow-lg bg-white rounded-3 mt-3" style="position:absolute;width:250px;left:-220px;top:35px">
                                                <span class="app-menu-header"></span>
                                                <div class="main-app-menus">
                                                    <span class="app-menu-item">
                                                        <a id="" class="dropdown-item" href="{{ url('/dms')}}">
                                                            <i class="fa fa-cube"></i>
                                                            Delivery Management
                                                        </a>
                                                    </span>
                                                    <div class="dropdown-divider"></div>
                                                    <span class="app-menu-item">
                                                        <a id="" class="dropdown-item" href="{{ url('/abm')}}">
                                                            <i class="fa fa-cube"></i>
                                                            Airway Bill Management
                                                        </a>
                                                    </span>
                                                    <div class="dropdown-divider"></div>
                                                    <span class="app-menu-item">
                                                        <a id="" class="dropdown-item" href="{{ url('/gmt')}}">
                                                            <i class="fas fa-cog"></i>
                                                            GM Tools
                                                        </a>
                                                    </span>
                                                </div>
                                            </div>

                                        </div>

                                        <div class="dropdown shadow-lg rounded-5 bg-white user--info">
                                            <button id="_main_btn_user" class="btn-dropdown main-menu-button" data-menu="user">
                                                <img src="{{ asset('assets/images/icons/user.png') }}" class="menu-item-icon ml-2" />
                                                <!-- <span>
                                                    <?php
                                                        //echo Session::get('login_name', 'Unknown');
                                                    ?>
                                                </span> -->
                                            </button>
 
                                            <div class="dropdown-menu dropdown-menu-left bg-white shadow-lg mt-3" style="width:150px;position:absolute;left:-120px;top:40px;">
                                                <span class="user-menu-header"></span>
                                                <div class="main-user-menus">
                                                    <span class="user-menu-item">
                                                        <a id="_main_mnu_about" class="dropdown-item" href="javascript:void(0)">
                                                            <i class="fas fa-cog"></i>
                                                            About DMS
                                                        </a>
                                                    </span>
                                                    <div class="dropdown-divider"></div>
                                                    <span class="user-menu-item">
                                                        <a id="_main_mnu_logout" class="dropdown-item" href="javascript:void(0)">
                                                            <i class="fas fa-sign-out-alt"></i>
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
                    </div> 
                    <div id="_p2" class="h-100 mt-1" id="kt_content">  <!-- <div id="_p2" class="row" id="kt_content">   -->
                        <div id="" class="h-100">
                            <div class="pb-2" id="_app_content"> <!-- <div class="col-sm-12 col-lg-12" id="_app_content" style="margin-top:-15px"> -->
                                @include('layouts.dms.dashboardComponent')
                                @include('layouts.dms.orderImagesComponent')
                                @include('layouts.dms.pickupListComponent')
                                @include('layouts.dms.packageListComponent')
                                @include('layouts.dms.completedPackageListComponent')
                                @include('layouts.dms.tripListComponent')
                                @include('layouts.dms.companyComponent')
                                @include('layouts.dms.generalSettingsComponent')
                                @include('layouts.dms.driverPaymentComponent')
                                @include('layouts.dms.senderPaymentComponent')
                                @include('layouts.dms.merchantBalancesComponent')
                                @include('layouts.dms.leadListComponent')
                                @include('layouts.dms.salesCommissionPolicyComponent')
                                @include('layouts.dms.salesCommissionPaymentsComponent')
                                @include('layouts.dms.driverBalancesComponent')
                                @include('layouts.dms.driverListComponent')
                                @include('layouts.dms.salesAgentsComponent')
                                @include('layouts.dms.commentsComponent')
                                @include('layouts.dms.postersComponent')
                                @include('layouts.dms.senderListComponent')
                                @include('layouts.dms.mobilePrivacyComponent')
                                @include('layouts.dms.mobileTCComponent')
                              
                                @include('layouts.um.userManagementComponent')
                                @include('layouts.um.roleManagementComponent')
                                @include('layouts.geo.locationComponent')
                                @include('layouts.dms.mobileBrandImagesComponent')
                                @include('layouts.dms.socialMediaComponent')
                                @include('layouts.dms.promotionComponent')
                                @include('layouts.dms.deliveryZoneComponent')
                                @include('layouts.dms.priceSettingsComponent')
                                @include('layouts.dms.exchangeRatesComponent')
                                @include('layouts.dms.productCategoriesComponent')
                                @include('layouts.dms.remarksComponent')
                                @include('layouts.dms.reportCenterComponent')
                              
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>