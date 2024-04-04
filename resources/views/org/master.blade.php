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
        <base href="../">
        <meta charset="utf-8" />
        <title>Kids World School</title>
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
        <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <?php ScriptManager::render('priority-one',1);?>
        <?php StyleManager::render('vsksm-style',1); ?> 
        <?php
            ScriptManager::render('primary',1);
            ScriptManager::render('primary-async',1);
            ScriptManager::render('primary-defer',1);
            ScriptManager::render('components',1);
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
                    <img alt="Logo" src="{{ asset('assets/images/logo/ksm-logo.png') }}" />
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
                            <div class="d-flex">
                                <div id="_main_top_right_menus" class="mainview-top-right">
                                    <div class="form-inline">
                                        <div class="dropdown choose--language">
                                            <button id="_main_btn_lang" class="btn-dropdown main-menu-button align--language" data-menu="lang">
                                                <img class="mr-1" src="{{ asset('assets/images/icons/khmer.png') }}" style="height:25px"/>
                                                <span id="_main_lang_name">
                                                    <?php
                                                        echo Session::get('lang_name','Khmer');
                                                    ?>
                                                </span>
                                                <i class="fa-solid fa-caret-down ps-2 fs-5"></i>
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
                                        <div class="dropdown mr-3 nav--notification">
                                            <button id="_main_btn_notif" class="btn-dropdown main-menu-button" data-menu="notif">
                                                <i class="fa-regular fa-bell fs-4"></i>
                                                <span class="number--notification" id="_main_notif_count">0</span>
                                            </button>
                                            <div class="dropdown-menu dropdown-menu-right notification-dropdown">
                                                <div class="con--header">
                                                    <span class="notif-header">Notification</span>
                                                </div>
                                                <div class="main-notif-panel"></div>
                                            </div>
                                        </div>
                                        <div class="dropdown user--info">
                                            <button id="_main_btn_user" class="btn-dropdown main-menu-button" data-menu="user">
                                                <img class="mr-1" src="{{ asset('assets/images/icons/user.png') }}" style="height:30px"/>
                                                <span>
                                                    <?php
                                                        echo Session::get('login_name','Unknown');
                                                    ?>
                                                </span>
                                            </button>
                                            <div class="dropdown-menu dropdown-menu-right user--login">
                                                <span class="user-menu-header"></span>
                                                <div class="main-user-menus">
                                                    <span class="user-menu-item">
                                                        <a id="_main_mnu_about" class="dropdown-item" href="javascript:void(0)">
                                                            <i class="fas fa-cog"></i>
                                                            About KSM
                                                        </a>
                                                    </span>
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
                            <div class="show--title">
                                <div class="screen-info">
                                    <h5 class="screen-title mb-0 trans-text" data-langprop="titles.dashboard" style="text-transform:uppercase" id="screen_title">Dashboard</h5>
                                </div>
                            </div>
                        </div>
                        <div class="animation-line line--loader d-none" id="vs_loader"></div>
                    </div>
                    <div id="_p2" class="kt-content kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                        <div id="_p1" class="row">
                            <div class="col-lg-12 shadow-box mt-3 ps-4" id="_app_content">
                                @include('layouts.inputBoxes')
                                @include('layouts.dashboardComponent')
                                @include('layouts.enrolledStudentsComponent')
                                @include('layouts.onLeaveStudentsComponent')
                                @include('layouts.tuitionFeeComponent')
                                @include('layouts.policyDiscountComponent')
                                @include('layouts.nonTuitionFeeComponent')
                                @include('layouts.depositFeeComponent')
                                @include('layouts.findStudentComponent')
                                @include('layouts.invoicesComponent')
                                @include('layouts.studentInformationComponent')
                                @include('layouts.activitiesComponent')
                                @include('layouts.discountComponent')
                                @include('layouts.aActivitiesComponent')
                                @include('layouts.manageAccountComponent')
                                @include('layouts.printStudentCardsComponent')
                                @include('layouts.idCardSettingsComponent')
                                @include('layouts.studentAttendanceComponent')
                                @include('layouts.studentAttendanceReportComponent')
                                @include('layouts.reportCenterComponent')
                                @include('layouts.companyComponent')
                                @include('layouts.locationComponent')
                                @include('layouts.um.userManagementComponent')
                                @include('layouts.um.roleManagementComponent')
                                @include('layouts.programComponent')
                                @include('layouts.studentGroupComponent')
                                @include('layouts.campusComponent')
                                @include('layouts.termComponent')
                                @include('layouts.academicYearComponent')
                                @include('layouts.paymentReviewComponent')
                                @include('layouts.requestDiscountComponent')
                                @include('layouts.promoteStudentComponent')
                                @include('layouts.assignStudentComponent')
                                @include('layouts.accountRequestComponent')
                                
                            
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