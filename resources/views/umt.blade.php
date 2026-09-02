<?php
    if(!XAuthService::user()) return view('login.index');
?>

<!DOCTYPE html>
<html lang="<?php echo Session::get('lang','en'); ?>">
    <head>
        <base href="../">
        <meta charset="utf-8" />
        <title>Authorization Manager</title>
        <link type="images/png" rel="icon" href="{{ asset('assets/images/meta/Meta_logo.png') }}" />
        <meta name="description" content="Updates and statistics">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <meta name="sess_branch_id" content="{{ sess_company_id() }}" />
        <meta name="sess_user_id" content="{{ sess_user_id() }}" />
        <meta name="base_url" content="{{ url('/') }}" />
        <meta name="app_id" content="{{ sess_app_id('umt') }}" />
        <meta name="subs_id" content="{{ sess_subs_id() }}" />
        <meta name="main_route" content="umt" />
        <meta name="default_component" content="<?php echo $defaultComponent; ?>" />
        <meta name="asset_url" content="{{ asset('assets/') }}" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Battambang&family=Noto+Sans+Khmer:wght@400;700&display=swap" rel="stylesheet">


        <?php StyleManager::render('umt-style',1,27); ?>
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
                  .font-kh {
            /* font-family: Arial, Helvetica, serif; */
            font-family: "Khmer OS battambang";
            /* font-size: 14px; */
           /* font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; */

        }

        .font-en {
            /* font-family: Verdana, sans-serif; */
            /* font-size: 15px, important; */

              font-family: 'Inter', sans-serif;
           /* font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; */
        }
        </style>
        <?php
            ScriptManager::render('priority-one',1);
            ScriptManager::render('primary',1);
            ScriptManager::render('primary-async',1,2);
            ScriptManager::render('umt-primary-defer',1,7);
            ScriptManager::render('umt-components',1,37);
        ?>
    </head>
    <body style="display:none" class="kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-page--loading">
        <div id="vs_loading" class="vs-loader-bar"></div>
        <?php ScriptManager::render('primary-loader',1);?>
        <div id="_main_hidden_fields">
            <input type="hidden" id="__base_url" value="{{ url('/') }}">
            <input type="hidden" id="__xsp_name" value="_csrf_115578" />
            <input type="hidden" id="__xsp_value" value="<?php echo Str::random(30); ?>" />
        </div>
        <div id="kt_header_mobile" class="kt-header-mobile kt-header-mobile--fixed">
            <div class="kt-header-mobile__logo">
                <a href="javascript:void(0)">
                    <img alt="Logo" src="{{ asset('assets/images/logo/logo.jpg') }}" />
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
                    <h4 id="mobile_screen_title" class=" mobile-screen-title p-1"></h4>
                </div>
            </div>
        </div>
        <div class="kt-grid kt-grid--hor kt-grid--root">
            <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
                <div class="kt-aside kt-aside--fixed kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop" id="kt_aside">
                    @include('menus.umt_menu')
                </div>
                <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">
                    <div id="kt_header" class="kt-header kt-grid__item kt-header--fixed">
                        <div class="kt-header-menu-wrapper" id="kt_header_menu_wrapper" style="padding:10px">
                            <div class="d-flex">

                            <div class="mainview-top-right">
                                    <div class="vs-page-title d-flex flex-grow-1 mb-1 mt-1">
                                        <div class="screen-info">
                                            <span class="screen-title mb-0" vslang="titles.dashboard" style="text-transform:uppercase" id="screen_title">Dashboard</span>
                                        </div>
                                    </div>
                                    <div id="_main_top_right_menus" class="d-flex flex-row gap-2 flex-wrap justify-content-center align-items-center">
                                        <div class="form-inline">
                                        <div class="dropdown choose--language">
                                            <button id="_main_btn_lang" class="btn-dropdown main-menu-button align--language" data-menu="lang">
                                                <img src="{{ asset('assets/images/icons/khmer.png') }}" style="border-radius: 50%;height:25px;" />
                                                <span id="_main_lang_name" class="mx-2 text-white">
                                                    <?php
                                                        echo Session::get('lang_name', 'Khmer');
                                                    ?>
                                                </span>
                                                <i class="fa-solid fa-caret-down text-white ps-2 fs-5"></i>
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
                                        <div class="dropdown nav--notification">
                                            <button id="_main_btn_notif" class="btn-dropdown main-menu-button" data-menu="notif">
                                                <i class="fa-solid fa-bell text-white ms-2 fs-4"></i>
                                                <span class="number--notification" id="_main_notif_count">0</span>
                                            </button>
                                            <div class="dropdown-menu dropdown-menu-right notification-dropdown">
                                                <div class="con--header">
                                                    <span class="notif-header">Notification</span>
                                                </div>
                                                <div class="main-notif-panel"></div>
                                            </div>
                                        </div>

                                        <div class="dropdown app--list">
                                            <button class="btn-dropdown main-menu-button " data-menu="app">
                                                 <i class="fa-brands fa-microsoft text-white ms-2 fs-4"></i>
                                            </button>
                                            <?php
                                                $user = XAuthService::user();
                                                if (!$user) return redirect('/');
                                                $apps = collect($user->apps)->filter(fn($a) => !$a->is_mobile_app);
                                                $count = $apps->count();
                                                $width = $count <= 3 ? 300 : 310;
                                                $cols  = $count <= 4 ? 'row-cols-2' : 'row-cols-2';
                                                ?>

                                        <div class="dropdown-menu shadow-lg bg-white p-3 rounded-3"
                                            style="position:absolute; width:<?= $width ?>px; left:-260px; top:60px">
                                            <hr class="my-1">

                                            <div class="row main-app-menus text-center g-2 <?= $cols ?>">
                                                <?php foreach ($apps as $app): ?>
                                                    <?php
                                                        $icon = empty($app->icon_file_name)
                                                            ? '<i class="fa-solid fa-layer-group fs-1 text-primary-custom"></i>'
                                                            : '<img src="'.$app->icon_file_name.'" width="120" height="120" alt="'.($app->name ?? $app->app_name).'">';
                                                        $name  = $app->name ?? $app->app_name;
                                                        $route = '/'.ltrim($app->home_route, '/');
                                                    ?>
                                                    <div class="col mb-3">
                                                     <a href="<?= $route ?>"
                                                        class="text-decoration-none text-dark d-block app-link"
                                                        data-app-key="<?= htmlspecialchars($name) ?>">
                                                        <?= $icon ?>
                                                        <div class="small mt-2 text-nowrap app-name-label"><?= $name ?></div>
                                                    </a>

                                                    </div>
                                                <?php endforeach; ?>
                                            </div>
                                        </div>

                                        <script>
                                            document.addEventListener('DOMContentLoaded', function () {
                                            const appLinks = document.querySelectorAll('.app-link');
                                            const storageKey = 'selected_app_name';

                                            const selectedApp = localStorage.getItem(storageKey);
                                            if (selectedApp) {
                                                appLinks.forEach(link => {
                                                    if (link.dataset.appKey === selectedApp) {
                                                        link.classList.add('active');
                                                    }
                                                });
                                            }

                                            appLinks.forEach(link => {
                                                link.addEventListener('click', function () {
                                                    // Remove all active
                                                    appLinks.forEach(l => l.classList.remove('active'));

                                                    this.classList.add('active');
                                                    localStorage.setItem(storageKey, this.dataset.appKey);
                                                });
                                            });
                                        });
                                        </script>
<!--
                                         <div class="dropdown-menu shadow-lg bg-white mr-3 rounded-2 mt-3" style="position:absolute;width:250px;left:-220px;top:45px">
                                                <span class="app-menu-header ps-4 text-primary-custom">Edvance System</span>
                                                <hr class="my-1">

                                            </div> -->

                                        </div>
                                        <!-- <div class="dropdown-menu shadow-lg bg-white rounded-3 mt-3" style="position:absolute;width:325px;left:-220px;top:35px">
                                                <span class="app-menu-header"></span>
                                                <div class="main-app-menus">
                                                    <span class="app-menu-item">
                                                        <a id="" class="dropdown-item" href="{{ url('/ksm')}}">
                                                            <i class="fa fa-cube"></i>
                                                            Edvance System
                                                        </a>
                                                    </span>
                                                    <div class="dropdown-divider"></div>
                                                    <span class="app-menu-item">
                                                        <a id="" class="dropdown-item" href="{{ url('/umt')}}">
                                                            <i class="fas fa-cog"></i>
                                                            User Role Management
                                                        </a>
                                                    </span>
                                                </div>
                                            </div>

                                        </div> -->

                                        <div class="dropdown user--info">
                                            <button id="_main_btn_user" class="btn-dropdown main-menu-button" data-menu="user">
                                                <img src="{{ asset('assets/images/icons/user.png') }}" style="border-radius:50%;height:25px;" />
                                                <span class="mx-2 text-white">
                                                    <?php
                                                        $user =XAuthService::user();
                                                        echo $user->full_name;
                                                    ?>
                                                </span>
                                            </button>
                                            <div class="dropdown-menu dropdown-menu-right user--login shadow rounded-3 p-3">
                                                <span class="user-menu-header"></span>
                                                <div class="main-user-menus">
                                                    <span class="user-menu-item">
                                                        <a id="_main_mnu_about" class="dropdown-item" href="javascript:void(0)">
                                                            <i class="fas fa-cog"></i>
                                                            About Edvance
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
                            </div>
                            <!-- <div class="show--title">
                                <div class="screen-info">
                                    <h5 class="screen-title mb-0 " vslang="titles.dashboard" style="text-transform:uppercase" id="screen_title">Dashboard</h5>
                                </div>
                            </div> -->
                        </div>
                        <div class="vs-loader-bar" id="vs_loader"></div>
                    </div>
                    <!--Removed class "kt-content" from this DIV -->
                    <div id="_p2" class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content" >
                        <div id="_p1" class="h-100">
                            <div class="pb-2" id="_app_content">
                                @include('layouts.umt.roleManagementComponent')
                                @include('layouts.umt.userManagementComponent')
                                @include('layouts.umt.campusManagementComponent')
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
