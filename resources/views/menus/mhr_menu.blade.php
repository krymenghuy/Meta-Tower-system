<!-- <style>
    li.kt-menu__section {
        margin: 8px 0 !important;
        background: #cbb858 !important;
        border: 1px solid #cbb858 !important;
        opacity: 0.9;
        padding: 10px;
    }

    .admin_email {
        display: flex;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 60%;
    }

    .kt-menu__section-text {
        font-weight: bold !important;
    }

    .menu-selected {
        box-shadow: 1px 1px 1px #000 !important;
        /* border-radius: 25px 0 0 25px; */
        color: #1a1647;
    }

    .kt-menu__link-icon img {
        width: 22px;
        height: 22px;
        object-fit: contain;
        margin-right: 5px;
        color: #fff;
    }

    #kt_aside_brand{
      background-color: #D6D6D6;
    }

    #_dms_aside_menus, #kt_aside_menu {
         background-color: #D6D6D6;
    }
    .kt-menu__link-text {
        color: #1a1647;
    }

    .kt-menu__section {
        color: #ffffff;
        padding: 10px;
        margin-bottom: 15px;
    }

    .kt-aside__brand-logo {
        height: 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        background-color: #D6D6D6;
    }

    /* #_dms_aside_menus::-webkit-scrollbar {
        display: none;
    } */

    .company {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: bold;
        color: white;
    }

    .admin_info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: bold;
        margin-top: 20px;
    }

    .admin_info img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

    .kt-menu__link-text[vslang]:hover {
        border-radius: 0 0 0 20px;
        color: #cab54a;
    }
</style> -->

<?php
function v_display($mod_id, $module_ids = null)
{
    if (XAuthService::access_mod($mod_id, null, $module_ids)) {
        echo '';
    } else {
        echo ' style="display:none" ';
    }
}
?>

<!--class="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid" -->
<div class="d-flex flex-column h-100 kt-aside-menu-wrapper" style="overflow:hidden" id="kt_aside_menu_wrapper">
    <div id="kt_aside_menu" class="kt-aside-menu" data-ktmenu-dropdown-timeout="500">
        <div class="d-flex flex-row kt-aside__brand" id="kt_aside_brand">
            <div class="m-2 kt-aside__brand-logo">
                <img src="{{ asset('assets/images/meta/Meta_logo1.png') }}" alt="" class="rounded-2 img-logo" />
            </div>
            <div class="kt-aside__brand-tools">
                <button class="kt-aside__brand-aside-toggler" id="kt_aside_toggler">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                                <path
                                    d="M5.29288961,6.70710318 C4.90236532,6.31657888 4.90236532,5.68341391 5.29288961,5.29288961 C5.68341391,4.90236532 6.31657888,4.90236532 6.70710318,5.29288961 L12.7071032,11.2928896 C13.0856821,11.6714686 13.0989277,12.281055 12.7371505,12.675721 L7.23715054,18.675721 C6.86395813,19.08284 6.23139076,19.1103429 5.82427177,18.7371505 C5.41715278,18.3639581 5.38964985,17.7313908 5.76284226,17.3242718 L10.6158586,12.0300721 L5.29288961,6.70710318 Z"
                                    id="Path-94" fill="#000000" fill-rule="nonzero"
                                    transform="translate(8.999997, 11.999999) scale(-1, 1) translate(-8.999997, -11.999999)" />
                                <path
                                    d="M10.7071009,15.7071068 C10.3165766,16.0976311 9.68341162,16.0976311 9.29288733,15.7071068 C8.90236304,15.3165825 8.90236304,14.6834175 9.29288733,14.2928932 L15.2928873,8.29289322 C15.6714663,7.91431428 16.2810527,7.90106866 16.6757187,8.26284586 L22.6757187,13.7628459 C23.0828377,14.1360383 23.1103407,14.7686056 22.7371482,15.1757246 C22.3639558,15.5828436 21.7313885,15.6103465 21.3242695,15.2371541 L16.0300699,10.3841378 L10.7071009,15.7071068 Z"
                                    id="Path-94" fill="#000000" fill-rule="nonzero" opacity="0.3"
                                    transform="translate(15.999997, 11.999999) scale(-1, 1) rotate(-270.000000) translate(-15.999997, -11.999999)" />
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
                                    transform="translate(9.000003, 11.999999) rotate(-270.000000) translate(-9.000003, -11.999999)" />
                            </g>
                        </svg>
                    </span>
                </button>
                <button class="kt-aside__brand-aside-toggler--left text-white kt-aside__brand-aside-toggler"
                    id="kt_aside_toggler">
                    <span></span>
                </button>
            </div>
        </div>
        <div class="" id ="_dms_aside_menus" style="display:none;">
            <ul class="kt-menu__nav">
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(300); ?>>
                    <a href="DashboardComponent" modid="300" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/dashboard.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.Overview"></span>
                    </a>
                </li>
                <li class="mb-2 kt-menu__section">
                    <h4 class="kt-menu__section-text" vslang="menus.Main Menu"></h4>
                    <i class="kt-menu__section-icon flaticon-more-v2"></i>
                </li>

                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(307); ?>>
                    <a href="EmployeeManagementComponent" modid="307" class=" menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/group.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.Employee Management">Employee Management</span>
                    </a>
                </li>

                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(309); ?>>
                    <a href="ContractsComponent" modid="309" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/contract.png') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.Leave Requests">Leave Requests</span>
                    </a>
                </li>

                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(301); ?>>
                    <a href="ReservationComponent" modid="301" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/reservation.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.Employee Movements">Employee Movements</span>
                    </a>
                </li>
                <li class="mb-2 kt-menu__section">
                    <h4 class="kt-menu__section-text" vslang="menus.Employee Benefits"></h4>
                    <i class="kt-menu__section-icon flaticon-more-v2"></i>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(302); ?>>
                    <a href="InvoicesComponent" modid="302" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/receipt.png') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.Benefit List">Benefit List</span>
                    </a>
                </li>

                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(303); ?>>
                    <a href="TransactionComponent" modid="303" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/transaction.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.Employee Benefits">Employee Benefits</span>
                    </a>
                </li>
                <li class="mb-2 kt-menu__section">
                    <h4 class="kt-menu__section-text" vslang="menus.FINANCE & ACCOUNTING"></h4>
                    <i class="kt-menu__section-icon flaticon-more-v2"></i>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(302); ?>>
                    <a href="InvoicesComponent" modid="302" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/receipt.png') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.Payroll Account">Payroll Account</span>
                    </a>
                </li>

                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(303); ?>>
                    <a href="TransactionComponent" modid="303" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/transaction.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.Payroll">Payroll</span>
                    </a>
                </li>

                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(304); ?>>
                    <a href="RequestServiceComponent" modid="304" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons"
                                src="{{ asset('assets/images/icons/google-task.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.Payroll List">Payroll List</span>
                    </a>
                </li>

                <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true"
                    data-ktmenu-submenu-toggle="hover">
                    <a id="_main_lnkLogout" href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                        <span class="kt-menu__link-icon">
                            <img class="icons" src="{{ asset('assets/images/bhr/logout.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text" vslang="menus.logout"></span>
                    </a>
                </li>

            </ul>
        </div>
    </div>
</div>

<script>
    (() => {
        const menuPanel = document.querySelector('#kt_aside_menu_wrapper');
        const __dx = menuPanel.querySelector('#_dms_aside_menus');
        const __brandArea = menuPanel.querySelector('#kt_aside_brand');
        if (!__dx) return;

        const updateMenuHeight = () => {
            const offsetTop = __brandArea.offsetHeight || 0;
            const maxHeight = window.innerHeight - offsetTop;
            __dx.style.maxHeight = maxHeight + 'px';
            __dx.style.overflowY = 'hidden';
        };

        window.vsapp = window.vsapp || {};
        window.vsapp.menuTranslated = false;

        const tryTranslateMenu = () => {
            if (typeof LocaleManager === 'object' || typeof LocaleManager === 'function') {
                LocaleManager.translateZone(__dx, null, () => {});
                __dx.style.display = 'block';
                window.vsapp.menuTranslated = true;
            }
        };

        document.addEventListener('DOMContentLoaded', () => {
            tryTranslateMenu();
            setTimeout(updateMenuHeight, 0); // ensure layout is ready
        });

        window.addEventListener('resize', updateMenuHeight);

        __dx.addEventListener('mouseover', () => {
            __dx.style.overflowY = 'auto';
        });
        __dx.addEventListener('mouseout', () => {
            __dx.style.overflowY = 'hidden';
        });
    })();

</script>
