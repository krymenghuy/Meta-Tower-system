<style>
    li.kt-menu__section {
        margin-top: 8px !important;
        background: #EBF5FB !important;
        border: 1px solid #f2f7f8 !important;
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
        /* background-color: #EBF5FB !important; */
        box-shadow: 1px 1px 1px #000000 !important;
        border-radius: 25px 0px 0px 25px;
        color: #000000;
    }

    .kt-menu__link-icon img {
        width: 24px;
        height: 24px;
        object-fit: contain;
        margin-right: 5px;
    }

    #kt_aside_menu {
        background-color: #2B3991;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        color: white;
    }

    .kt-menu__link-text {
        color: #fff;
    }

    .kt-menu__section {
        color: #0e0e0e;
        /* border-radius: 0px 0px 20px 0px; */
        padding: 10px;
        margin-bottom: 15px;
    }

    /* #kt_aside_menu_wrapper {
        background-color: #2B3991;
    } */

    #kt_aside_brand {
        display: flex;
        height: 100%;
    }

    .kt-aside__brand-logo {
        height: 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        background-color: #2b3991;
    }

    #_dms_aside_menus {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        margin-top: -20px;
    }

    .company {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 20px;
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: bold;
        color: white;
    }

    /* .company img {
        width: 80px;
        height: 60px;
        border-radius: 50%;
    } */


    /* .company_name {
        color: white
    } */

    .admin_info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: bold;
        /* color: #ffffff; */
        margin-top: 20px;
    }

    .admin_info img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

    /* .kt-menu__link-text[vslang] {
        color: #ffffff;
    } */
    .kt-menu__item:hover {
        /* background-color: #dff1fb !important; */
        /* border-radius: 0px 0px 20px 0px; */
    }

    .kt-menu__link-text[vslang]:hover {
        border-radius: 0px 0px 0px 20px;
        color: #000000;
    }
</style>

<?php
function v_display($mod_id, $module_ids = null)
{
    if (App\Models\UM::access_mod($mod_id, null, $module_ids)) {
        echo '';
    } else {
        echo ' style= "display:none" ';
    }
}
?>

<div class="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid" id="kt_aside_menu_wrapper">
    <div id="kt_aside_menu" class="kt-aside-menu" data-ktmenu-vertical="1" data-ktmenu-scroll="1"
        data-ktmenu-dropdown-timeout="500">
        <div class="kt-aside__brand-logo">
            <div class="company pt-3">
                <img src="{{ asset('assets/images/logo/lc_logo.svg') }}" alt="" class="img-logo" />
                <!-- <span class="company_name mt-3">LC CASH EXPRESS CO.,LTD.</span> -->
                {{-- <div class="kt-aside__brand kt-grid__item" id="kt_aside_brand">
                    <div class="kt-aside__brand-tools">
                        <button class="kt-aside__brand-aside-toggler" id="kt_aside_toggler"
                            style="padding:10px;font-size:1.3em !important">
                        </button>
                        <button class="kt-aside__brand-aside-toggler kt-aside__brand-aside-toggler--left"
                            id="kt_aside_toggler">
                            <span></span>
                        </button>
                    </div>
                </div> --}}
            </div>
            {{-- <div class="admin_info">
                <img src="{{ asset('assets/images/logo/ratanak_pic.svg') }}" alt="admin">
                <span class="admin_name">Ratanak Khoeurn</span>
                <span class="admin_email">ratanak.khoeurn@student.passerellesnumeriques.org</span>
            </div> --}}
        </div>

        <ul class="kt-menu__nav" id="_dms_aside_menus">
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(200); ?>>
                <a href="DashboardComponent" modid="200" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <!-- <i class="fas fa-chart-line icons opacity-icons"></i> -->
                        <img class="icons opacity-icons" src="{{ asset('assets/images/bhr/Grid.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Dashboard"></span>
                </a>
            </li>





            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(205); ?>>
                <a href="EmployeeComponent" modid="205" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/manage_sale_staff.svg') }}" />
                        <!-- <i class="fas fa-tasks icons opacity-icons"></i> -->
                        <!-- <svg class="icons opacity-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.<path d="M139.6 35.5a12 12 0 0 0 -17 0L58.9 98.8l-22.7-22.1a12 12 0 0 0 -17 0L3.5 92.4a12 12 0 0 0 0 17l47.6 47.4a12.8 12.8 0 0 0 17.6 0l15.6-15.6L156.5 69a12.1 12.1 0 0 0 .1-17zm0 159.2a12 12 0 0 0 -17 0l-63.7 63.7-22.7-22.1a12 12 0 0 0 -17 0L3.5 252a12 12 0 0 0 0 17L51 316.5a12.8 12.8 0 0 0 17.6 0l15.7-15.7 72.2-72.2a12 12 0 0 0 .1-16.9zM64 368c-26.5 0-48.6 21.5-48.6 48S37.5 464 64 464a48 48 0 0 0 0-96zm432 16H208a16 16 0 0 0 -16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0 -16-16zm0-320H208a16 16 0 0 0 -16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16V80a16 16 0 0 0 -16-16zm0 160H208a16 16 0 0 0 -16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0 -16-16z"/></svg> -->
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Employee Management"></span>
                </a>
            </li>

            {{-- <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true"
                data-ktmenu-submenu-toggle="hover"<?php v_display(null, [100, 101]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/bhr/User_check.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text text-nowrap " vslang="menus.Employee Benefits">
                        Employee Benefits</span>
                    <i class="kt-menu__ver-arrow la la-angle-right text-white"></i>
                </a>
                <div class="kt-menu__submenu"><span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                            <a href="EmployeeBonusComponent" modid="-1" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/bhr/User_check.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Bonus"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                            <a href="EmployeeSeniorityComponent" modid="-1" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/bhr/User_check.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Seniority"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li> --}}

            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                <a href="EmployeeBenefitComponent" modid="105" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/sales_commissions.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Employee Benefits"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                <a href="EmployeeMovementComponent" modid="105" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/users_management.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Employee Movement"></span>
                </a>
            </li>
            {{-- <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                <a href="LeaveComponent" modid="105" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/bhr/User x.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Leave Menegement"></span>
                </a>
            </li> --}}
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                <a href="PayrollComponent" modid="105" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/marchant_transactions.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Payroll Management"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                <a href="PayrollListComponent" modid="105" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/payroll_list.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Payroll list"></span>
                </a>
            </li>
            {{-- <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                <a href="AttendanceComponent" modid="-1" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/bhr/User_check.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Attendance Management"></span>
                </a>
            </li> --}}

            {{-- <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                <a href="StaffAttendanceComponent" modid="209" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/icons/general_report.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Employee Attendance"></span>
                </a>
            </li> --}}
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                <?php v_display(null, [209]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/icons/attendance.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color" vslang="menus.Attendance Management">
                        Attendance Management
                    </span>
                    <i class="kt-menu__ver-arrow la la-angle-right text-white"></i>
                </a>
                <div class="kt-menu__submenu"><span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                            <a href="LeaveComponent" modid="105" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/absent.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Leave Management"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                            <a href="StaffAttendanceComponent" modid="209" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/present.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Employee Attendance"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                <?php v_display(null, [209]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/icons/general_settings.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color" vslang="menus.Account Management">
                        Account Management
                    </span>
                    <i class="kt-menu__ver-arrow la la-angle-right text-white"></i>
                </a>
                <div class="kt-menu__submenu"><span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(209); ?>>
                            <a href="AccountMenagmentComponent" modid="209" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/mobile_setting.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color" vslang="menus.Payroll Account">
                                    Payroll Account
                                </span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(209); ?>>
                            <a href="WalletAccountComponent" modid="209" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/pickup_center.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color" vslang="menus.Wallet Account">
                                    Wallet Account
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            {{-- <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                <a href="SkillsComponent" modid="-1" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/icons/company_profile.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Skills"></span>
                </a>
            </li> --}}
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                <a href="PositionComponent" modid="-1" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/bhr/position.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Position"></span>
                </a>
            </li>
            <li class="kt-menu__section" <?php v_display(null, [105, 106, 218, 220, 210, 102, 221, 216, 212, 100, 101]); ?>>
                <h4 class="kt-menu__section-text " vslang="menus.Settings"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true"
                data-ktmenu-submenu-toggle="hover"<?php v_display(null, [100, 101]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/icons/users_management.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text text-nowrap " vslang="menus.General Settings">General
                        Settings</span>
                    <i class="kt-menu__ver-arrow la la-angle-right text-white"></i>
                </a>
                <div class="kt-menu__submenu"><span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(202); ?>>
                            <a href="DepartmentComponent" modid="202" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <i class="fas fa-truck-plane icons opacity-icons"></i>
                                    <!-- <img class="icons opacity-icons" src="{{ asset('assets/images/icons/package_trail.svg') }}" /> -->
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Department"></span>
                            </a>
                        </li>
                     
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                            <a href="JobsLevelComponent" modid="-1" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <i class="fas fa-tasks icons opacity-icons"></i>
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Job Level"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                            <a href="TaxBracketComponent" modid="-1" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <i class="fas fa-tasks icons opacity-icons"></i>
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Tax Bracket"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                <a href="ReportComponent" modid="-1" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/icons/general_report.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Report Center"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                <a href="WarningComponent" modid="-1" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/warning.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Warning"></span>
                </a>
            </li>
            {{-- /* skills*/ --}}



            {{-- /*jobs level*/ --}}
            {{-- <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                <a href="HolidayComponent" modid="-1" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <i class="fas fa-truck-plane icons opacity-icons"></i>
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Holiday"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(201); ?>>
                <a href="CompanySetupComponent" modid="201" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/icons/company_profile.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Company Setup"></span>
                </a>
            </li>
            <li class="d-none kt-menu__item kt-menu__item--submenu" aria-haspopup="true"
                data-ktmenu-submenu-toggle="hover" <?php v_display(null, [220, 210, 102, 221, 216, 212]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/icons/general_settings.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.General Settings"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                            <a href="CountryZonesComponent" modid="105" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/delivery_zones.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Country Zone"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(220); ?>>
                            <a href="PriceSettingsComponent" modid="220" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/zone_price.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Customer Zone Prices"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(230); ?>>
                            <a href="SupplierPriceSettingsComponent" modid="220" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/zone_price.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Supplier Zone Prices"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class=" kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                <?php v_display(null, [220, 210, 102, 221, 216, 212]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/icons/general_settings.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.Histhory setup"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                            <a href="CountryZonesComponent" modid="105" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/delivery_zones.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Holiday Setup"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(220); ?>>
                            <a href="AutomaticEmployeeComponent" modid="220" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/zone_price.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Automatic Employee"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(230); ?>>
                            <a href="DepartmentListComponent" modid="220" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/zone_price.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Department List"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(230); ?>>
                            <a href="PositionListComponent" modid="220" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/zone_price.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Position List"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class=" kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                <?php v_display(null, [220, 210, 102, 221, 216, 212]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/icons/general_settings.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.Whole Database backup"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                            <a href="WholeDatadaseBackupComponent" modid="105" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/delivery_zones.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Whole Database Backup"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(220); ?>>
                            <a href="RestorDatabaseComponent" modid="220" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/zone_price.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Restore Database"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(230); ?>>
                            <a href="DataInportComponent" modid="220" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/zone_price.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Data Import"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(230); ?>>
                            <a href="DataExportComponent" modid="220" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/zone_price.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Data Export"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true"
                data-ktmenu-submenu-toggle="hover"<?php v_display(null, [100, 101]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/icons/users_management.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text text-nowrap "
                        vslang="menus.staff movement">User & Role Management</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu"><span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(101); ?>>
                            <a href="RoleManagementComponent" modid="101" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/manage_roles.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Role Management"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(100); ?>>
                            <a href="UserManagementComponent" modid="100" class="menu-item kt-menu__link ">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/manage_users.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.User Management"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li> --}}



            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a id="_main_lnkLogout" href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/icons/log_out.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Log Out">Log
                        Out</span>
                </a>
            </li>
        </ul>
    </div>
</div>

<script>
    let __dx = document.querySelector('#_dms_aside_menus');
    LocaleManager.translateZone(__dx, null, () => {
        return;
    });
    __dx.style.display = 'block';
    __dx.style.height = (window.innerHeight - 65) + 'px';
    __dx.style.overflowY = 'auto';


    window.addEventListener('resize', function() {
        __dx.style.height = (window.innerHeight - 65) + 'px';
        __dx.style.overflowY = 'auto';
    });

    let prev_selected_menu = null;
    __dx.addEventListener('mouseover', function() {
        __dx.style.overflowY = 'auto';
    });

    __dx.addEventListener('mouseout', function() {
        __dx.style.overflowY = 'hidden';
    });
</script>
