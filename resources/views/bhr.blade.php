<!DOCTYPE html>
<html lang="<?php $user = App\Services\Umt\AuthService::user();
echo $user->lang ?? 'en'; ?>">
<head>
    <base href="../">
    <meta charset="utf-8" />
    <title>BHR</title>
    <link type="images/png" rel="icon" href="{{ asset('assets/images/logo/lc_logo.svg') }}" />
    <meta name="description" content="Updates and statistics">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta name="sess_branch_id" content="{{ sess_company_id() }}" />
    <meta name="sess_user_id" content="{{ sess_user_id() }}" />
    <meta name="base_url" content="{{ url('/') }}" />
    <meta name="main_route" content="bhr" />
    <meta name="app_id" content="{{ sess_app_id('dms') }}" />
    <meta name="subs_id" content="{{ sess_subs_id() }}" />
    <meta name="default_component" content="<?php echo $defaultComponent; ?>" />
    <meta name="asset_url" content="{{ asset('assets') }}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">
    <?php
    StyleManager::render('bhr-style', 1, 2);
    ?>
    <style>
        /* Custom animations for the modal like Materialize css effect */
        .modal.fade .modal-dialog {
            transform: scale(0.7);
            transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
            opacity: 0;
        }

        .modal.show .modal-dialog {
            transform: scale(1);
            opacity: 1;
        }

        .modal-content {
            border-radius: 15px !important;
        }

        .pg-alert-card-line {
            border: 0.5px solid #D9DFDF;
        }

        div.pg-alert-card.selected .pg-alert-card-line {
            border: 1px solid green;
            transform-origin: 0;
        }

        .pg-crosstab {
            padding: 4px;
            border-radius: 3px;
            border: 1px dotted green;
        }

        .pg-crosstab table td {
            padding: 3px 3px 3px 10px;
            vertical-align: middle;
            text-align: center;
            margin: 4px 4px 4px 4px;
            color: #fff;
            border-bottom: 1px solid #EDF3F7;
        }
    </style>
    <?php
    ScriptManager::render('priority-one', 1, 3);
    ScriptManager::render('primary', 1, 6);
    ScriptManager::render('bhr-primary-defer', 1, 6);
    ScriptManager::render('bhr-components', 1, 8);
    //ScriptManager::render('pdfmake', 1);
    ?>
</head>

<body style="display:none"
    class="kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed">
    <div id="vs_loading"></div>
    <?php
    ScriptManager::render('primary-loader', 1);
    ?>
    <div id="_main_hidden_fields">
        <input type="hidden" id="__base_url" value="{{ url('/') }}" />
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
                <h4 id="mobile_screen_title" class=" mobile-screen-title p-1"></h4>
            </div>
        </div>
    </div>
    <div class="kt-grid kt-grid--hor kt-grid--root">
        <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
            <div class="kt-aside kt-aside--fixed kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop"
                id="kt_aside">
                @include('menus.bhr_menu')
            </div>
            <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">
                <div id="kt_header" class="kt-header kt-grid__item kt-header--fixed">
                    <div class="animation-line line--loader" style="display:none" id="vs_loader"></div>
                    <div class="kt-header-menu-wrapper" id="kt_header_menu_wrapper">
                        <div class="d-flex flex-row flex-wrap shadow justify-content-between" style="background-color:#ececec;">
                            <div class="mainview-top-right">
                                <div class="show--title mx-4 p-3 flex-grow-1 ">
                                    <div style="height:18px" class="screen-info d-flex flex-row justify-content-between align-items-center  w-100">
                                        <div>
                                            <h6 class="screen-title mb-0 " vslang="titles.dashboard"
                                          style="color:grey;" id="screen_title">Dashboard</h6>
                                       </div>
                                    </div>
                                </div>
                                <div id="_main_top_right_menus"
                                    class="d-flex flex-row gap-2 w-50 flex-wrap px-5 justify-content-end align-items-center">
                                    <div class="dropdown shadow-lg rounded-5 bg-white choose--language">
                                        <button id="_main_btn_lang" class="btn-dropdown align--language"
                                            data-menu="lang">
                                            <img class="mr-1" src="{{ asset('assets/images/icons/khmer.png') }}"
                                                style="height:25px" />
                                            <span id="_main_lang_name" class="text-primary-custom">
                                                <?php
                                                echo Session::get('lang_name', 'Khmer');
                                                ?>
                                            </span>
                                            <i class="fa-solid fa-caret-down ps-2 fs-5" style="color:#2b3991;"></i>
                                        </button>
                                        <div class="dropdown-menu dropdown-menu-right">
                                            <span class="lang-menu-header"></span>
                                            <div class="main-lang-menus">
                                                <span class="lang-menu-item">
                                                    <a class="dropdown-item lnk-lang" data-lang="km"
                                                        data-name="ខ្មែរ" href="javascript:void(0)">
                                                        <img class="menu-item-icon"
                                                            src="{{ asset('assets/images/icons/khmer.png') }}" />
                                                        ខ្មែរ
                                                    </a>
                                                </span>
                                                <span class="lang-menu-item">
                                                    <a class="dropdown-item lnk-lang" data-lang="en"
                                                        data-name="English" href="javascript:void(0)">
                                                        <img class="menu-item-icon"
                                                            src="{{ asset('assets/images/icons/english.png') }}" />
                                                        English
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="dropdown  shadow-lg rounded-5 bg-white nav--notification">
                                        <button id="_main_btn_notif" class="btn-dropdown main-menu-button"
                                            data-menu="notif">
                                            <i class="fa-solid fa-bell tool-tip fs-4" style="color:#2b3991;"><span class="tool-tiptext fs-6">Notifications</span></i>
                                            <span class="number--notification notif-count"
                                                id="_main_notif_count">0</span>
                                        </button>
                                        <div
                                            class="dropdown-menu dropdown-menu-right notification-dropdown position-absolute">
                                            <div class="con--header">
                                                <span class="d-block text-center text-white">Notification</span>
                                            </div>
                                            <div class="main-notif-panel"></div>
                                        </div>
                                    </div>

                                    <div class="dropdown shadow-lg rounded-5 bg-white app--list">
                                        <button class="btn-dropdown main-menu-button " data-menu="app">
                                        <i class="fa-solid fa-table tool-tip fs-4" style="color:#2b3991;"><span class="tool-tiptext fs-6">Menu System</span></i>
                                            <span></span>
                                        </button>

                                        <div class="dropdown-menu shadow-lg bg-white rounded-3 mt-3"
                                            style="position:absolute;width:325px;left:-220px;top:35px">
                                            <span class="app-menu-header"></span>
                                            <div class="main-app-menus">
                                                <?php
                                                $user = App\Services\Umt\AuthService::user();
                                                if (!$user) {
                                                    return redirect('/');
                                                }
                                                $apps = $user->apps;
                                                $cnt = 0;
                                                foreach ($apps as $app) {
                                                    if (!$app->is_mobile_app) {
                                                        $expected_user_class = $app->user_class ?? '';
                                                        $open_new_tab = $expected_user_class == $user->user_class ? '' : 'target="_blank"';
                                                        $app_icon = empty($app->icon_file_name) ? '<i class="fa fa-cube"></i>' : $app->icon_file_name;
                                                        $app_name = $app->name ?? $app->app_name;
                                                        echo ($cnt > 0 ? '<div class="dropdown-divider"></div>' : '') . '<span class="app-menu-item">' . '<a id="" class="dropdown-item" href="/' . $app->home_route . '" ' . $open_new_tab . '>' . $app_icon . ' ' . $app_name . '</a>' . '</span>';
                                                        $cnt++;
                                                    }
                                                }

                                                ?>

                                            </div>
                                        </div>

                                    </div>

                                    <div class="dropdown shadow-lg rounded-5 bg-white user--info">
                                        <button id="_main_btn_user" class="btn-dropdown main-menu-button"
                                            data-menu="user">
                                            <img class="mr-1" src="{{ asset('assets/images/bhr/junior.png') }}" style="height:30px" />
                                                <span class="text-primary-custom">
                                                    <?php
                                                        $user = App\Services\Umt\AuthService::user();
                                                        echo $user ? $user->full_name : '';
                                                    ?>
                                                </span>
                                        </button>

                                        <div class="dropdown-menu dropdown-menu-left bg-white shadow-lg mt-3"
                                            style="width:150px;position:absolute;left:-120px;top:40px;">
                                            <span class="user-menu-header"></span>
                                            <div class="main-user-menus">
                                                <span class="user-menu-item">
                                                    <a id="_main_mnu_about" class="dropdown-item"
                                                        href="javascript:void(0)">
                                                        <i class="fas fa-cog"></i>
                                                        About BHR
                                                    </a>
                                                </span>
                                                <div class="dropdown-divider"></div>
                                                <span class="user-menu-item">
                                                    <a id="_main_mnu_logout" class="dropdown-item"
                                                        href="javascript:void(0)">
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
                <div id="_p2" class="h-100 mt-1" id="kt_content">
                    <div id="" class="h-100">
                        <div class="pb-2" id="_app_content">
                            @include('layouts.bhr.dashboardComponent')
                            @include('layouts.bhr.reportCenterComponent')
                            @include('layouts.common.socialMediaComponent')
                            @include('layouts.bhr.employeeComponent')
                            @include('layouts.bhr.skillsComponent')
                            @include('layouts.bhr.jobsLevelComponent')
                            @include('layouts.bhr.payrollComponent')
                            @include('layouts.bhr.payrollListComponent')
                            @include('layouts.bhr.departmentComponent')
                            @include('layouts.bhr.positionComponent')
                            @include('layouts.bhr.leaveComponent')
                            @include('layouts.bhr.warningComponent')
                            @include('layouts.bhr.employeebonusComponent')
                            @include('layouts.bhr.employeeseniorityComponent')
                            @include('layouts.bhr.attendanceComponent')
                            @include('layouts.bhr.staffAttendanceComponent')
                            @include(' layouts.bhr.employeemovementComponent')
                            @include('layouts.bhr.employeeBenefitComponent')
                            @include('layouts.bhr.accountComponent')
                            @include('layouts.bhr.taxbracketComponent')
                            @include('layouts.bhr.walletAccountComponent')
                            @include('layouts.bhr.holidayComponent')
                            @include('layouts.bhr.workshiftComponent')
                            @include('layouts.bhr.workShiftListComponent')
                            @include('layouts.bhr.benefitDisbursementComponent')
                            @include('layouts.bhr.benefitDisbursePolicyComponent')
                            @include('layouts.bhr.benefitComponent')
                            @include('layouts.bhr.exitCheckpointsComponent')
                            @include('layouts.bhr.exitFormComponent')
                            @include('layouts.bhr.exitFormItemComponent')
                            @include('layouts.common.locationComponent')
                            @include('layouts.common.companyComponent')
                            @include('layouts.umt.branchManagementComponent')
                            @include('layouts.umt.roleManagementComponent')
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
