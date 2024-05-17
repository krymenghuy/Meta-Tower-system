<?php 
    if(!Session::get('login_name')) return view('login.index'); 
    // $role= \App\Models\UM::firstRole(Session::get('user_id'));
    // $role_id = $role?$role->id:null;

    // if ($role_id != 1 && $role_id != 2){
    //     echo "It seems you do not have correct role in this system. Contact administrator to resolve this issue";
    //     return;
    //}
?>

<!DOCTYPE html>
<html lang="<?php echo Session::get('lang','en'); ?>">
    <head>
        <base href="../">
        <meta charset="utf-8" />
        <title>JTO</title>
        <link type="images/png" rel="icon" href="{{ asset('assets/images/logo/logo.png') }}"/>
        <meta name="description" content="Updates and statistics">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <meta name="sess_branch_id" content="{{ sess_company_id() }}" />
        <meta name="sess_user_id" content="{{ sess_user_id() }}" />
        <meta name="base_url" content="{{ url('/') }}" />
        <meta name="main_route" content="abm" />
        <meta name="default_component" content="<?php echo $defaultComponent; ?>" />
        <meta name="asset_url" content="{{ asset('assets/') }}" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <?php StyleManager::render('abm-style',1); ?> 
        <?php
            ScriptManager::render('priority-one',1);
            ScriptManager::render('primary',1);
            ScriptManager::render('primary-async',1);
            ScriptManager::render('primary-defer',1);
            ScriptManager::render('abm-components',1);
        ?>
    </head>
    <body style="display:none" class="kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-page--loading">
        <div id="vs_loading"></div>
        <?php ScriptManager::render('primary-loader',1);?> 
        <div id="_main_hidden_fields">
            <input type="hidden" id="__base_url" value="{{ url('/') }}">
            <input type="hidden" id="__xsp_name" value="_csrf_115578" />
            <input type="hidden" id="__xsp_value" value="<?php echo Str::random(30); ?>" />
        </div>
        <div id="kt_header_mobile" class="kt-header-mobile kt-header-mobile--fixed">
            <div class="kt-header-mobile__logo">
                <a href="javascript:void(0)">
                    <img alt="Logo" src="{{ asset('assets/images/logo/logo.png') }}" />
                </a>
            </div>
            <div class="kt-header-mobile__toolbar">
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
                    @include('menus.abm_menu')
                </div>
                <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">
                    <div id="kt_header" class="kt-header kt-grid__item kt-header--fixed">
                        <div class="kt-header-menu-wrapper" id="kt_header_menu_wrapper" style="padding:10px">
                            <div class="d-flex">
                               
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
                                                        <a id="" class="dropdown-item" href="{{ url('/usm')}}">
                                                            <i class="fas fa-cog"></i>
                                                            User Management
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
                            <!-- <div class="show--title">
                                <div class="screen-info">
                                    <h5 class="screen-title mb-0 trans-text" data-langprop="titles.dashboard" style="text-transform:uppercase" id="screen_title">Dashboard</h5>
                                </div>
                            </div> -->
                        </div>
                        <div class="animation-line line--loader d-none" id="vs_loader"></div>
                    </div>
                    <!--Removed class "kt-content" from this DIV -->
                    <div id="_p2" class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content" style="margin-top: 15px">
                        <div id="_p1" class="row">
                            <div class="col-lg-12 shadow-box ps-4" id="_app_content">
                                @include('layouts.abm.dashboardComponent')
                                @include('layouts.abm.countryZonesComponent')
                                @include('layouts.abm.customersComponent')
                                @include('layouts.abm.shipmentsComponent')
                                @include('layouts.abm.suppliersComponent')
                                @include('layouts.abm.salesAffiliatesComponent')

                                @include('layouts.abm.priceSettingsComponent')
                                @include('layouts.abm.locationComponent')
                                
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
        </div>
        <div id="kt_scrolltop" class="kt-scrolltop">
            <i class="fa fa-arrow-up"></i>
        </div>
    </body>
</html>