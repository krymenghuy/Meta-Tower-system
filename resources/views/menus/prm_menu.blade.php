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

<div class="kt-aside-menu-wrapper d-flex flex-column h-100" style="overflow:hidden" id="kt_aside_menu_wrapper">
    <div id="kt_aside_menu" class="kt-aside-menu" data-ktmenu-dropdown-timeout="500">
        <div class="kt-aside__brand d-flex flex-row" id="kt_aside_brand">
            <div class="kt-aside__brand-logo m-2">
                <img src="{{ asset('assets/images/meta/Meta_logo1.png') }}" alt="" class="img-logo rounded-2" />
            </div>
            <div class="kt-aside__brand-tools">
                <button class="kt-aside__brand-aside-toggler" id="kt_aside_toggler">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                            height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
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
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                            height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
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
                <button class="kt-aside__brand-aside-toggler kt-aside__brand-aside-toggler--left text-white"
                    id="kt_aside_toggler">
                    <span></span>
                </button>
            </div>
        </div>
        <div id="_dms_aside_menus" class="menu-pending">
            <ul class="kt-menu__nav side_menu_list">
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(200); ?>>
                    <a href="DashboardComponent" modid="238" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/dashboard.png') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Dashboard"></span>
                    </a>
                </li>
                <li class="kt-menu__section mb-2">
                    <h4 class="kt-menu__section-text " vslang="menus.Main Menu"></h4>
                    <i class="kt-menu__section-icon flaticon-more-v2"></i>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(201); ?>>
                    <a href="TenantComponent" modid="239" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons"
                                src="{{ asset('assets/images/icons/member.png') }}" /></span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Tenants"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(202); ?>>
                    <a href="SpaceComponent" modid="244" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/space.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color" vslang="menus.Spaces"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(203); ?>>
                    <a href="ContractComponent" modid="244" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/contract.png') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color" vslang="menus.Contracts"></span>
                    </a>
                </li> 
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(206); ?>>
                    <a href="ReservationComponent" modid="270" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/reservation.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Reservations"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(204); ?>>
                    <a href="InvoiceComponent" modid="270" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/receipt.png') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Invoices"></span>
                    </a>
                </li>  
                
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(205); ?>>
                    <a href="ReceiptComponent" modid="270" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/payment.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Receipts"></span>
                    </a>
                </li>
                
                <li class="kt-menu__section mb-2">
                    <h4 class="kt-menu__section-text " vslang="menus.Operational"></h4>
                    <i class="kt-menu__section-icon flaticon-more-v2"></i>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(202); ?>>
                    <a href="MaintenanceComponent" modid="244" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/maintenance.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color" vslang="menus.Maintenance"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(218); ?>>
                    <a href="ServiceRequestComponent" modid="270" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/service.png') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Service Requests"></span>
                    </a>
                </li>
                <li class="kt-menu__section mb-2">
                    <h4 class="kt-menu__section-text " vslang="menus.FINANCE / VENDORS"></h4>
                    <i class="kt-menu__section-icon flaticon-more-v2"></i>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(212); ?>>
                    <a href="VendorComponent" modid="244" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/vendor.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Vendors"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(212); ?>>
                    <a href="PurchaseOrdersComponent" modid="244" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/cart.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Purchase Orders"></span>
                    </a>
                </li>
                <li class="kt-menu__item d-none" aria-haspopup="true" <?php v_display(206); ?>>
                    <a href="ExpenseComponent" modid="270" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/expense.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Expense"></span>
                    </a>
                </li><li class="kt-menu__item" aria-haspopup="true" <?php v_display(206); ?>>
                    <a href="BillComponent" modid="270" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/money.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Bills"></span>
                    </a>
                </li>
                </li><li class="kt-menu__item" aria-haspopup="true" <?php v_display(206); ?>>
                    <a href="BillPaymentComponent" modid="270" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/money-bag.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Payments"></span>
                    </a>
                </li>
                
                <!-- <li class="kt-menu__item" aria-haspopup="true" <?php v_display(207); ?>>
                        <a href="ReportComponent" modid="270" class="menu-item kt-menu__link">
                            <span class="kt-menu__link-icon">
                                <img class="icons opacity-icons" src="{{ asset('assets/images/bhr/company.svg') }}" />
                            </span>
                            <span class="kt-menu__link-text font-color " vslang="menus.Report & Export"></span>
                        </a>
                    </li> -->
                <li class="kt-menu__section mb-2">
                    <h4 class="kt-menu__section-text " vslang="menus.System Settings"></h4>
                    <i class="kt-menu__section-icon flaticon-more-v2"></i>
                </li>
                <li class="kt-menu__item d-none" aria-haspopup="true" <?php v_display(209); ?>>
                    <a href="CompanyComponent" modid="270" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/setting.png') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Building profile"></span>
                    </a>
                </li>

                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(212); ?>>
                    <a href="BuildingComponent" modid="244" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons"
                                src="{{ asset('assets/images/icons/building.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Buildings"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(206); ?>>
                    <a href="AmenityComponent" modid="270" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons"
                                src="{{ asset('assets/images/icons/amenity.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Amenities"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(206); ?>>
                    <a href="ItemsComponent" modid="270" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons"
                                src="{{ asset('assets/images/icons/items.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Purchase Item"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(210); ?>>
                    <a href="ServiceComponent" modid="270" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons"
                                src="{{ asset('assets/images/icons/service_price.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Service"></span>
                    </a>
                </li>
                
                <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                    <?php v_display(null, [210, 211, 212, 213, 214]); ?>>
                    <a href="SettingComponent" class="kt-menu__link kt-menu__toggle">
                        <span class="kt-menu__link-icon">
                            <img class="icons" src="{{ asset('assets/images/icons/barcode.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text " vslang="menus.Settings"></span>
                        <i class="kt-menu__ver-arrow la la-angle-right"></i>
                    </a>

                    {{-- <li class="kt-menu__item" aria-haspopup="true" <?php v_display(206); ?>>
                        <a href="InvoiceSettingComponent" modid="270" class="menu-item kt-menu__link">
                            <span class="kt-menu__link-icon">
                                <img class="icons opacity-icons"
                                    src="{{ asset('assets/images/icons/items.svg') }}" />
                            </span>
                            <span class="kt-menu__link-text font-color " vslang="menus.Invoice Setting"></span>
                        </a>
                    </li> --}}
                    <!-- <div class="kt-menu__submenu">
                        <span class="kt-menu__arrow"></span>
                        <ul class="kt-menu__subnav"> -->
                            <!-- <li class="kt-menu__item" aria-haspopup="true" <?php v_display(211); ?>>
                                    <a href="AccessControlComponent" modid="270" class="menu-item kt-menu__link">
                                        <span class="kt-menu__link-icon">
                                            <img class="icons opacity-icons" src="{{ asset('assets/images/icons/access.svg') }}" />
                                        </span>
                                        <span class="kt-menu__link-text font-color " vslang="menus.Access Control"></span>
                                    </a>
                                </li> -->

                            <!-- <li class="kt-menu__item" aria-haspopup="true" <?php v_display(213); ?>>
                                    <a href="LocationComponent" modid="102" class="menu-item kt-menu__link">
                                        {{-- <span class="kt-menu__link-icon">
                                            <img class="icons opacity-icons"
                                                src="{{ asset('assets/images/icons/location.png') }}" />
                                        </span> --}}
                                        <span class="kt-menu__link-text font-color"
                                            vslang="menus.Countries and Cities"></span>
                                    </a>
                                </li> -->

            
                </li>
                <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true"
                    data-ktmenu-submenu-toggle="hover">
                    <a id="_main_lnkLogout" href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                        <span class="kt-menu__link-icon">
                            <img class="icons opacity-icons" src="{{ asset('assets/images/bhr/logout.svg') }}" />
                        </span>
                        <span class="kt-menu__link-text font-color " vslang="menus.Log Out">Log Out</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>

<script>
    (() => {
        const waitForLocaleManager = (cb) => {
            if (
                window.LocaleManager &&
                typeof window.LocaleManager.translateZone === 'function'
            ) {
                cb();
                return;
            }
            requestAnimationFrame(() => waitForLocaleManager(cb));
        };

        // ------------------------------------------------------------
        // 2️⃣ Menu initialization (runs ONLY when LocaleManager exists)
        // ------------------------------------------------------------
        const initMenu = () => {
            const menuPanel = document.querySelector('#kt_aside_menu_wrapper');
            const __dx = menuPanel?.querySelector('#_dms_aside_menus');
            const __brand = menuPanel?.querySelector('#kt_aside_brand');
            if (!__dx) return;

            const updateMenuHeight = () => {
                const offsetTop = __brand?.offsetHeight || 0;
                __dx.style.maxHeight = (window.innerHeight - offsetTop) + 'px';
                __dx.style.overflowY = 'hidden';
            };

            // Prevent double execution (important for SPA / VSRoute)
            window.vsapp = window.vsapp || {};
            if (window.vsapp.menuTranslated) return;

            LocaleManager.translateZone(__dx, null, () => {
                window.vsapp.menuTranslated = true;
                requestAnimationFrame(updateMenuHeight);
            });
            __dx.classList.remove('menu-pending');
            __dx.classList.add('menu-ready');
            -
                window.addEventListener('resize', updateMenuHeight);

            __dx.addEventListener('mouseenter', () => {
                __dx.style.overflowY = 'auto';
            });

            __dx.addEventListener('mouseleave', () => {
                __dx.style.overflowY = 'hidden';
            });
        };

        // ------------------------------------------------------------
        // 3️⃣ Boot
        // ------------------------------------------------------------
        waitForLocaleManager(initMenu);
    })();
</script>
