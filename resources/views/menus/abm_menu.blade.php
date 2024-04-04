<style>
    li.kt-menu__section {
        margin-top: 8px !important;
        background: #EBF5FB;
        border: 1px solid #D0D3D4;
        padding: 10px;
    }

    .kt-menu__section-text {
        font-weight: bold !important;
    }

    .menu-selected {
        background-color: #007bff;
        border-radius: 0px 20px 20px 0px;
        color: #fff !important;
    }

    .kt-menu__link-icon img {
        width: 22px;
        height: 22px;
        object-fit: contain;
        margin-right: 5px;
    }
</style>

<?php
    function v_display($mod_id, $module_ids = null){
        if(App\Models\UM::access_mod($mod_id, null, $module_ids)){
            echo '';
        }
        else{
            echo ' style= "display:none" ';
        }
    }
?>

<div class="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid" id="kt_aside_menu_wrapper">
    <div id="kt_aside_menu" class="kt-aside-menu" data-ktmenu-vertical="1" data-ktmenu-scroll="1" data-ktmenu-dropdown-timeout="500">
        <div class="kt-aside__brand kt-grid__item" id="kt_aside_brand">
            <div class="kt-aside__brand-logo ">
                <img src="{{ asset('assets/images/logo/jto2.jpg') }}" alt="" class="img-logo" />
            </div>
            <div class="kt-aside__brand-tools">
                <button class="kt-aside__brand-aside-toggler" id="kt_aside_toggler" style="padding:15px;font-size:1.3em !important">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                                <path d="M5.29288961,6.70710318 C4.90236532,6.31657888 4.90236532,5.68341391 5.29288961,5.29288961 C5.68341391,4.90236532 6.31657888,4.90236532 6.70710318,5.29288961 L12.7071032,11.2928896 C13.0856821,11.6714686 13.0989277,12.281055 12.7371505,12.675721 L7.23715054,18.675721 C6.86395813,19.08284 6.23139076,19.1103429 5.82427177,18.7371505 C5.41715278,18.3639581 5.38964985,17.7313908 5.76284226,17.3242718 L10.6158586,12.0300721 L5.29288961,6.70710318 Z" id="Path-94" fill="#000000" fill-rule="nonzero" transform="translate(8.999997, 11.999999) scale(-1, 1) translate(-8.999997, -11.999999)" />
                                <path d="M10.7071009,15.7071068 C10.3165766,16.0976311 9.68341162,16.0976311 9.29288733,15.7071068 C8.90236304,15.3165825 8.90236304,14.6834175 9.29288733,14.2928932 L15.2928873,8.29289322 C15.6714663,7.91431428 16.2810527,7.90106866 16.6757187,8.26284586 L22.6757187,13.7628459 C23.0828377,14.1360383 23.1103407,14.7686056 22.7371482,15.1757246 C22.3639558,15.5828436 21.7313885,15.6103465 21.3242695,15.2371541 L16.0300699,10.3841378 L10.7071009,15.7071068 Z" id="Path-94" fill="#000000" fill-rule="nonzero" opacity="0.3" transform="translate(15.999997, 11.999999) scale(-1, 1) rotate(-270.000000) translate(-15.999997, -11.999999)" />
                            </g>
                        </svg>
                    </span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                                <path d="M12.2928955,6.70710318 C11.9023712,6.31657888 11.9023712,5.68341391 12.2928955,5.29288961 C12.6834198,4.90236532 13.3165848,4.90236532 13.7071091,5.29288961 L19.7071091,11.2928896 C20.085688,11.6714686 20.0989336,12.281055 19.7371564,12.675721 L14.2371564,18.675721 C13.863964,19.08284 13.2313966,19.1103429 12.8242777,18.7371505 C12.4171587,18.3639581 12.3896557,17.7313908 12.7628481,17.3242718 L17.6158645,12.0300721 L12.2928955,6.70710318 Z" id="Path-94" fill="#000000" fill-rule="nonzero" />
                                <path d="M3.70710678,15.7071068 C3.31658249,16.0976311 2.68341751,16.0976311 2.29289322,15.7071068 C1.90236893,15.3165825 1.90236893,14.6834175 2.29289322,14.2928932 L8.29289322,8.29289322 C8.67147216,7.91431428 9.28105859,7.90106866 9.67572463,8.26284586 L15.6757246,13.7628459 C16.0828436,14.1360383 16.1103465,14.7686056 15.7371541,15.1757246 C15.3639617,15.5828436 14.7313944,15.6103465 14.3242754,15.2371541 L9.03007575,10.3841378 L3.70710678,15.7071068 Z" id="Path-94" fill="#000000" fill-rule="nonzero" opacity="0.3" transform="translate(9.000003, 11.999999) rotate(-270.000000) translate(-9.000003, -11.999999)" />
                            </g>
                        </svg>
                    </span>
                </button>
                <button class="kt-aside__brand-aside-toggler kt-aside__brand-aside-toggler--left" id="kt_aside_toggler">
                    <span></span>
                </button>
            </div>
        </div>
        <ul class="kt-menu__nav" id="_dms_aside_menus" style="display:none">
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(200); ?>>
                <a href="DashboardComponent" modid="200" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/dashboard/dashboard-statistics-5499.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Dashboard"></span>
                </a>
            </li>
          
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(201); ?>>
                <a href="CustomersComponent" modid="201" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/pickup_center.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Customers"></span>
                </a>
            </li>

            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(202); ?>>
                <a href="SuppliersComponent" modid="202" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/package_trail.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Suppliers"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(214); ?>>
                <a href="SeleAgentsComponent" modid="214" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/order_image.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Sale Agents"></span>
                </a>
            </li>

            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(203); ?>>
                <a href="ShipmentsComponent" modid="203" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/manage_fleet.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Shipments"></span>
                </a>
            </li>
            <!-- <li class="kt-menu__item" aria-haspopup="true" <?php v_display(204); ?>>
                <a href="CompletedPackageListComponent" modid="204" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/complete_delivery.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Finished Packages"></span>
                </a>
            </li> -->
            <li class="kt-menu__section" <?php v_display(null,[205,206,223,219,213]);?>>
                <h4 class="kt-menu__section-text trans-text" data-langprop="menus.Billings & Payments"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(205); ?>>
                <a href="BillingValidationComponent" modid="205" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/driver_transaction.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Billing Validation"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(206); ?>>
                <a href="AccountingComponent" modid="206" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/marchant_transactions.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color text-nowrap trans-text" data-langprop="menus.Accounting"></span>
                </a>
            </li>
            <!-- <li class="kt-menu__item" aria-haspopup="true" style="display:none" <?php v_display(223);?>>
                <a href="SalesAgentsComponent" modid="223" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/sales_commissions.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Sales Commissions"></span>
                </a>
            </li> -->
            <!-- <li class="d-none kt-menu__item" aria-haspopup="true" <?php v_display(219);?>>
                <a href="DriverBalancesCompoment" class="menu-item kt-menu__link" modid="219">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/marchant_transactions.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color text-nowrap trans-text" data-langprop="menus.Driver Balances"></span>
                </a>
            </li> -->
            <!-- <li class="d-none kt-menu__item" aria-haspopup="true" <?php v_display(213); ?>>
                <a href="MerchantBalancesCompoment" modid="213" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/marchant_transactions.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color text-nowrap trans-text" data-langprop="menus.Merchant Balances"></span>
                </a>
            </li>
            <li class="kt-menu__section" <?php v_display(null,[207,208,222]);?>>
                <h4 class="kt-menu__section-text trans-text" data-langprop="menus.Partner Management">Partner Management</h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(207); ?>>
                <a href="DriverListComponent" modid="207" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/manage_drivers.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Driver Management"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(208); ?>>
                <a href="SenderListComponent" modid="208" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/manage_merchants.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color trans-text text-nowrap" data-langprop="menus.Merchant Management"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true" style="display:none" <?php v_display(222);?>>
                <a href="SalesAgentsComponent" modid="222" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/manage_sale_staff.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Sales Agents"></span>
                </a>
            </li> -->
            <li class="kt-menu__section" <?php v_display(null,[209]);?>>
                <h4 class="kt-menu__section-text trans-text" data-langprop="menus.Reports"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(209); ?>>
                <a href="ReportCenterComponent" modid="209" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/general_report.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Report Center"></span>
                </a>
            </li>
            <li class="kt-menu__section" <?php v_display(null,[105,106,218,220,210,102,221,216,212,100,101]);?>>
                <h4 class="kt-menu__section-text trans-text" data-langprop="menus.Settings"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                <a href="SettingsComponent" modid="105" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/company_profile.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Settings"></span>
                </a>
            </li>
            <!-- <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover" <?php v_display(null,[106,218])?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/mobile_setting.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Mobile Settings"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(106); ?>>
                            <a href="MobileBrandImagesComponent" modid="106" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/brand_image.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Brand Images"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(218); ?>>
                            <a href="PromotionComponent" modid="218" class="menu-item kt-menu__link ">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/promotion.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Promotions"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover" <?php v_display(null,[220,210,102,221,216,212]);?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/general_settings.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.General Settings"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(212); ?>>
                            <a href="ExchangeRatesComponent" modid="212" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/exchange_rate.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Exchange Rates"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(216); ?>>
                            <a href="ProductCategoriesComponent" modid="216" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/product_categories.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color text-nowrap trans-text" data-langprop="menus.Product Categories"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(221); ?>>
                            <a href="RemarksComponent" modid="221" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/product_categories.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color text-nowrap trans-text" data-langprop="menus.Remarks"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(102); ?>>
                            <a href="LocationComponent" modid="102" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/countries_and_cities.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color text-nowrap trans-text" data-langprop="menus.Countries and Cities"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(210); ?>>
                            <a href="DeliveryZoneComponent" modid="210" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/delivery_zones.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Delivery Zones"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(220); ?>>
                            <a href="PriceSettingsComponent" modid="220" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/zone_price.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Zone Prices"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li> -->
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"<?php v_display(null, [100, 101]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/users_management.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text text-nowrap trans-text" data-langprop="menus.User Roles & Permissions">User Roles & Permissions</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu"><span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(101);?>>
                            <a href="RoleManagementComponent" modid="101" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/manage_roles.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Role Management"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(100);?>>
                            <a href="UserManagementComponent" modid="100" class="menu-item kt-menu__link ">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/manage_users.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.User Management"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a id="_main_lnkLogout" href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/log_out.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color trans-text" data-langprop="menus.Log Out">Log Out</span>
                </a>
            </li>
        </ul>
    </div>
</div>

<script>
    let __dx = $('#_dms_aside_menus');
    LocaleManager.translateZone('_dms_aside_menus', null, () => {
        return;
    });
    __dx.show();

    __dx.css('height', ((window.innerHeight - 65)+'px'));
    __dx.css('overflow-y', 'auto');
    window.addEventListener('resize',function(){
        __dx.css('height', ((window.innerHeight - 65)+'px'));
        __dx.css('overflow-y', 'auto');
    });
    let prev_selected_menu = null;

    __dx.on('mouseover',function(){
        $(this).css('overflow-y', 'auto');
    });

    __dx.on('mouseout',function(){
        $(this).css('overflow-y', 'hidden');
    });

    // __dx.on('click', '.menu-item',function(e){
    //     if (prev_selected_menu) prev_selected_menu.removeClass('menu-selected');
    //     $(this).toggleClass('menu-selected');
    //     prev_selected_menu = $(this);
    // });
</script>