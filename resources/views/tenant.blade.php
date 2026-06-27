
<!DOCTYPE html>
<html lang="<?php $user = XAuthService::user();
  echo $user->lang ?? 'en';
?>">
<head>
    <base href="../">
    <meta charset="utf-8" />
    <title>Meta Client</title>
    <link type="images/png" rel="icon" href="{{ asset('assets/images/meta/Meta_logo1.png') }}" />
    <meta name="description" content="Updates and statistics">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta name="sess_branch_id" content="{{ sess_company_id() }}" />
    <meta name="sess_user_id" content="{{ sess_user_id() }}" />
    <meta name="base_url" content="{{ url('/') }}" />
    <meta name="main_route" content="tenant" />
    <meta name="app_id" content="{{ sess_app_id('tenant') }}" />
    <meta name="subs_id" content="{{ sess_subs_id() }}" />
    <meta name="default_component" content="<?php echo $defaultComponent; ?>" />
    <meta name="asset_url" content="{{ asset('assets') }}" />
    <meta name="tenant_name"
      content="<?php echo $user ? $user->full_name : ''; ?>" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">
    <?php
    StyleManager::render('tenant-style', 1, 43);
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
      .font-kh {
            /* font-family: Arial, Helvetica, serif; */
            /* font-family: Verdana, sans-serif; */
           /* font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; */
            font-family: 'Khmer OS Battambang';
            /* font-family: "Fasthand", cursive; */
        }

        .font-en {
            /* font-family: Verdana, sans-serif; */

            /* font-family: 'Battambang'; */
             /* font-family: "Source Sans 3", sans-serif; */
             /* font-family: "Open Sans", sans-serif; */
             /* font-family: "Roboto", sans-serif; */

            /* font-family: 'Segoe UI', sans-serif; */
            /* font-family: Arial, sans-serif; */
            font-family: "Marcellus", serif;
           /* font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; */
        }
        .svg-white {
    filter: brightness(0) invert(1);
}

    </style>
    <?php
    ScriptManager::render('priority-one', 1, 10);
    ScriptManager::render('primary', 1, 14);
    ScriptManager::render('primary-defer', 1, 38);

    ScriptManager::render('tenant-components', 1, 250);
    //ScriptManager::render('pdfmake', 1);
    ?>
</head>

<body style="display:none"
    class="kt-demo-panel--right kt-offcanvas-panel--right kt-quick-panel--right kt-aside--fixed kt-header--fixed kt-header-mobile--fixed kt-subheader--fixed kt-subheader--enabled kt-subheader--solid kt-aside--enabled">
    <div id="vs_loading" class="vs-loader-bar"></div>
    <?php
    ScriptManager::render('primary-loader', 1);
    ?>
    <div id="_main_hidden_fields">
        <input type="hidden" id="__base_url" value="{{ url('/') }}" />
        <input type="hidden" id="__xsp_name" value="_csrf_115578" />
        <input type="hidden" id="__xsp_value" value="<?php echo Str::random(30); ?>" />
    </div>
    <div id="kt_header_mobile" class="kt-header-mobile--fixed kt-header-mobile">
        <div class="kt-header-mobile__logo">
            <a href="javascript:void(0)">
                <img alt="Logo" src="{{ asset('assets/images/meta/Meta_logo.png') }}" />
            </a>
        </div>
        <div class="kt-header-mobile__toolbar" style="margin-bottom:10px">
            <button class="kt-header-mobile__toggler--left kt-header-mobile__toggler" id="kt_aside_mobile_toggler">
                <span class="text-primary"></span>
            </button>
            <button class="kt-header-mobile__topbar-toggler" id="kt_header_mobile_topbar_toggler">
                <i class="flaticon-more"></i>
            </button>
            <div class="d-flex flex-row justify-content-center shadow mt-1 mb-2 rounded-5 w-100">
                <h4 id="mobile_screen_title" class="p-1 mobile-screen-title"></h4>
            </div>
        </div>
    </div>
    <div class="kt-grid kt-grid--hor kt-grid--root">
        <div class="kt-grid kt-grid--ver kt-grid__item kt-grid__item--fluid kt-page">
            <div class="kt-aside--fixed kt-grid kt-grid--desktop kt-grid--hor-desktop kt-aside kt-grid__item"
                id="kt_aside">
                @include('menus.tenant_menu')
            </div>
            <div class="kt-grid kt-grid--hor kt-grid__item kt-grid__item--fluid kt-wrapper" id="kt_wrapper">
                <div id="kt_header" class="kt-header--fixed kt-header kt-grid__item">
                    <div class="animation-line line--loader" style="display:none" id="vs_loader"></div>
                    <div class="kt-header-menu-wrapper" id="kt_header_menu_wrapper">
                        <div class="d-flex flex-row flex-wrap justify-content-between shadow" style="background-color:#e7e7e7;">
                           <div id="_main_top_right_menus" class="mainview-top-right">
                                <div class="d-flex flex-grow-1 mx-4 show--title">
                                  <div class="screen-info" id="kt_header_menu_wrapper">
                                            <span class="mb-0 text-nowrap screen-title" vslang="titles.dashboard" style="text-transform:uppercase;" id="screen_title"></span>
                                        </div>
                                        <div class="d-flex justify-content-end w-100 align-item-center">
                                            <div class="rounded-circle">
                                                <a href="javascript:void(0)" id="_db_filter_data" class="btn-filter-summery-db mt-1">
                                                    <!-- <i class="text-white fa-solid fa-filter fs-5"></i> -->
                                                     <!-- <img class="me-2 svg-white" style="height:20px;" src="{{ asset('assets/images/icons/filter-circle.svg') }}" /> -->
                                                </a>
                                            </div>
                                        </div>
                                </div>
                                <div id="_main_top_right_menus" class="d-flex flex-row flex-wrap align-items-center justify-content-end gap-2 px-3 w-50">
                                    <div class="dropdown choose--language">
                                            <button id="_main_btn_lang" class="btn-dropdown main-menu-button align--language" data-menu="lang">
                                                <img src="{{ asset('assets/images/icons/khmer.png') }}" style="border-radius: 50%;height:25px;" />
                                                <span id="_main_lang_name" class="mx-2" style="color:#6b6f82;">
                                                    <?php
                                                        echo Session::get('lang_name', 'Khmer');
                                                    ?>
                                                </span>
                                                <i class="ps-2 fa-caret-down fa-solid fs-5" style="color:#6b6f82;"></i>
                                            </button>
                                            <div class="dropdown-menu-right dropdown-menu">
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
                                        <button id="_main_btn_notif" class="btn-dropdown main-menu-button"
                                            data-menu="notif">
                                            <i class="fa-regular fa-bell fs-4" style="color:#6b6f82;"></i>
                                            <span class="number--notification notif-count"
                                                id="_main_notif_count">0</span>
                                        </button>
                                        <div
                                            class="dropdown-menu-right shadow-lg rounded-2 dropdown-menu notification-dropdown">
                                            <div class="con--header">
                                                <span class="notif-header">Notification</span>
                                            </div>
                                            <div class="main-notif-panel"></div>
                                        </div>
                                    </div>

                                    <div class="dropdown app--list">
                                        <button class="btn-dropdown main-menu-button" data-menu="app"> <i class="fa-solid fa-indent fs-4 ms-2" style="color:#6b6f82;"></i> </button>

                                        <?php
                                            $user = XAuthService::user();
                                            if (!$user) return redirect('/');
                                            $apps = collect($user->apps)->filter(fn($a) => !$a->is_mobile_app);
                                        ?>

                                        <div class="bg-white shadow-lg p-3 rounded-2 dropdown-menu dropdown-menu-end"
                                            style="min-width:320px; max-width:380px;left:-150px;top:60px;">
                                            <div class="text-center row row-cols-3 g-3">
                                                <?php foreach ($apps as $app): ?>
                                                    <?php
                                                        $icon = empty($app->icon_file_name)
                                                            ? '<div class="d-flex align-items-center justify-content-center bg-light mx-auto rounded-circle" style="width:56px; height:56px;">
                                                                <i class="fa-layer-group text-primary-custom fa-solid fs-3"></i>
                                                            </div>'
                                                            : '<div class="d-flex align-items-center justify-content-center bg-light mx-auto rounded-circle overflow-hidden" style="width:56px; height:56px;">
                                                                <img src="'.$app->icon_file_name.'"  alt="'.($app->name ?? $app->app_name).'" style="width:100%; height:100%; object-fit:cover;">
                                                            </div>';
                                                        $name  = $app->name ?? $app->app_name;
                                                        $route = '/'.ltrim($app->home_route, '/');
                                                    ?>
                                                    <div class="col">
                                                        <a href="<?= $route ?>"
                                                        class="d-block text-dark text-decoration-none app-link small"
                                                        data-app-key="<?= htmlspecialchars($name) ?>">
                                                            <?= $icon ?>
                                                            <div class="mt-2 text-truncate"><?= $name ?></div>
                                                        </a>
                                                    </div>
                                                <?php endforeach; ?>
                                            </div>
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
                                                appLinks.forEach(l => l.classList.remove('active'));
                                                this.classList.add('active');
                                                localStorage.setItem(storageKey, this.dataset.appKey);
                                            });
                                        });
                                    });
                                    </script>


                                    <div class="dropdown user--info">
                                        <button id="_main_btn_user" class="btn-dropdown main-menu-button"
                                            data-menu="user">
                                            <img src="<?php echo $user->image_url; ?>" style="border-radius:50%;height:25px" />
                                                <span class="mx-2" style="color:#6b6f82;">
                                                    <?php
                                                        //$user = App\Services\Umt\XAuthService::user();
                                                        echo $user ? $user->full_name : '';
                                                    ?>
                                                </span>
                                        </button>

                                        <div class="dropdown-menu-left bg-white shadow-lg rounded-2 dropdown-menu"
                                            style="width:250px;position:absolute;left:-150px;top:60px;">
                                            <span class="user-menu-header"></span>
                                            <div class="main-user-menus">
                                                <span class="user-menu-item">
                                                    <a id="_main_mnu_about" class="dropdown-item"
                                                        href="javascript:void(0)">
                                                        <i class="m-2 fas fa-cog"></i>
                                                        About Meta Client
                                                    </a>
                                                </span>
                                                <span class="user-menu-item">
                                                    <a id="_main_mnu_changepwd" class="dropdown-item"
                                                        href="javascript:void(0)">
                                                        <i class="m-2 fas fa-key"></i>
                                                        Change password
                                                    </a>
                                                </span>
                                                <div class="dropdown-divider"></div>
                                                <span class="user-menu-item">
                                                    <a id="_main_mnu_logout" class="dropdown-item"
                                                        href="javascript:void(0)">
                                                        <i class="m-2 fas fa-sign-out-alt"></i>
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
                <div id="_p2" class="h-100" id="kt_content">
                    <div id="" class="h-100">
                        <div class="pb-2" id="_app_content">
                            @include('layouts.tenant.dashboardComponent')
                            @include('layouts.tenant.teamComponent')
                            @include('layouts.tenant.contractsComponent')
                            @include('layouts.tenant.contracts2Component')
                            @include('layouts.tenant.invoicesComponent')
                            @include('layouts.tenant.receiptsComponent')
                            @include('layouts.tenant.requestServiceComponent')
                            @include('layouts.tenant.announcementComponent')
                            @include('layouts.tenant.reservationComponent')
                            @include('layouts.tenant.tenantProfileComponent')
                            @include('layouts.tenant.servicesComponent')






                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</body>

</html>
