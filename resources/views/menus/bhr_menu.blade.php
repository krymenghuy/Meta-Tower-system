<style>
    li.kt-menu__section {
        margin-top: 8px !important;
        margin-bottom:8px !important;
        background: #dce5e5 !important;
        border: 1px solid #dce5e5 !important;
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


    .kt-menu__link-text[vslang]:hover {
        border-radius: 0px 0px 0px 20px;
        color:#cab54a;
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

        </div>

        <ul class="kt-menu__nav" id="_dms_aside_menus">
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(200); ?>>
                <a href="DashboardComponent" modid="200" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <!-- <i class="fas fa-chart-line icons opacity-icons"></i> -->
                        <img class="icons opacity-icons" src="{{ asset('assets/images/bhr/dashboard1.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Dashboard"></span>
                </a>
            </li>
            <li class="kt-menu__section" <?php v_display(null, [105, 106, 218, 220, 210, 102, 221, 216, 212, 100, 101]); ?>>
                <h4 class="kt-menu__section-text " vslang="menus.Employee Management"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>

            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(205); ?>>
                            <a href="EmployeeComponent" modid="205" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/bhr/user-list.svg') }}" />                    </span>
 
                                <span class="kt-menu__link-text font-color " vslang="menus.Employee"></span>
 
                            </a>
            </li>
 
          
             
            <!-- <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
 
                <?php v_display(null, [209]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/bhr/desktop.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color" vslang="menus.Payroll Management">
                        Payroll Management
                    </span>
                    <i class="kt-menu__ver-arrow la la-angle-right text-white"></i>
                </a>
                <div class="kt-menu__submenu"><span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                    <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                        <a href="PayrollComponent" modid="105" class="menu-item kt-menu__link">
                            <span class="kt-menu__link-icon">
                                <img class="icons opacity-icons" src="{{ asset('assets/images/bhr/pay.svg') }}" />
                            </span>
                            <span class="kt-menu__link-text font-color " vslang="menus.Payroll"></span>
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

                    </ul>
                </div>
            </li> -->

            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                <a href="LeaveComponent" modid="105" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/bhr/code_scan.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Leave Management"></span>
                </a>
            </li>
 
            
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                <a href="StaffAttendanceComponent" modid="105" class="menu-item kt-menu__link">
 
                    <span class="kt-menu__link-icon">
                    <img class="icons opacity-icons" src="{{ asset('assets/images/bhr/classroom.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Daily Attendance"></span>
                </a>
            </li>
 
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                <?php v_display(null, [209]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/bhr/paycard.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color" vslang="menus.Shift Management">
                        Workshift Management
                    </span>
                    <i class="kt-menu__ver-arrow la la-angle-right text-white"></i>
                </a>
                <div class="kt-menu__submenu"><span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(209); ?>>
                            <a href="WorkShiftListComponent" modid="209" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                    src="{{ asset('assets/images/icons/pickup_center.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color" vslang="menus.Shift List">
                                    Shift List
                                </span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(209); ?>>
                            <a href="WorkshiftComponent" modid="209" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                    src="{{ asset('assets/images/icons/pickup_center.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color" vslang="menus.Attendance Tracks">
                                    Attendance Tracks
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
 
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                <a href="EmployeeMovementComponent" modid="105" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/bhr/rotate.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Employee Movement"></span>
                </a>
            </li>

            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true"
                data-ktmenu-submenu-toggle="hover"<?php v_display(null, [100, 101]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/bhr/resize-svgrepo-com.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text text-nowrap " vslang="menus.Employee Benefits"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right text-white"></i>
                </a>
                <div class="kt-menu__submenu"><span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(202); ?>>
                            <a href="BenefitComponent" modid="202" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    {{-- <i class="fas fa-truck-plane icons opacity-icons"></i> --}}
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/department.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Benefit List"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(202); ?>>
                            <a href="EmployeeBenefitComponent" modid="202" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    {{-- <i class="fas fa-truck-plane icons opacity-icons"></i> --}}
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/department.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Staff Benefits"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                            <a href="BenefitDisbursementComponent" modid="-1" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/bhr/position.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Special Disburse Plan"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                            <a href="BenefitDisbursePolicyComponent" modid="105" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/sales_commissions.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Disburse Policies"></span>
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
                            src="{{ asset('assets/images/bhr/paycard.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color" vslang="menus.Accounts">
                        Accounts
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
                                <span class="kt-menu__link-text font-color" vslang="menus.Payroll Accounts">
                                    Payroll Accounts
                                </span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(209); ?>>
                            <a href="WalletAccountComponent" modid="209" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/pickup_center.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color" vslang="menus.Staff Wallets">
                                    Wallet Accounts
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(209); ?>>
            <a href="ExitFormComponent" modid="209" class="menu-item kt-menu__link">
                <span class="kt-menu__link-icon">
                    <img class="icons opacity-icons"
                        src="{{ asset('assets/images/icons/pickup_center.svg') }}" />
                </span>
                <span class="kt-menu__link-text font-color" vslang="menus.Exit Form"></span>
            </a>
            </li>

            <li class="kt-menu__section" <?php v_display(-1); ?>>
                <h4 class="kt-menu__section-text " vslang="menus.Staff Discipline"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
                        
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                            <a href="WarningComponent" modid="-1" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/bhr/warning.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Warning"></span>
                            </a>
            </li>

            <li class="kt-menu__section" <?php v_display(-1); ?>>
                <h4 class="kt-menu__section-text " vslang="menus.Payroll Management"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>

            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                <a href="PayrollComponent" modid="-1" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                    <img class="icons opacity-icons" src="{{ asset('assets/images/bhr/pay.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Payrolls"></span>
                </a>
            </li>

            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                <a href="PayrollListComponent" modid="-1" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/payroll_list.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Payroll List"></span>
                </a>
            </li>

            <li class="kt-menu__section" <?php v_display(-1); ?>>
                <h4 class="kt-menu__section-text " vslang="menus.Data and Insights"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
 
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                <a href="ReportCenterComponent" modid="-1" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/bhr/report.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Report Center"></span>
                </a>
            </li>

            <li class="kt-menu__section" <?php v_display(-1); ?>>
                <h4 class="kt-menu__section-text " vslang="menus.Settings"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
  
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                            <a href="ContractGeneratorComponent" modid="-1" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/bhr/position.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Contract Generator"></span>
                            </a>
            </li>

            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true"
                data-ktmenu-submenu-toggle="hover"<?php v_display(null, [100, 101]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/bhr/resize-svgrepo-com.svg') }}" />
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
                                    {{-- <i class="fas fa-truck-plane icons opacity-icons"></i> --}}
                                    <img class="icons opacity-icons" src="{{ asset('assets/images/icons/department.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Departments"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                            <a href="PositionComponent" modid="-1" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/bhr/position.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Positions"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                            <a href="JobsLevelComponent" modid="-1" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{asset('assets/images/icons/job_level.svg')}}">
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Job Levels"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                            <a href="TaxBracketComponent" modid="-1" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons" src="{{asset('assets/images/icons/tax_bracket.svg')}}">
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Tax Brackets"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                            <a href="SkillsComponent" modid="-1" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/icons/company_profile.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Skills"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                            <a href="HolidayComponent" modid="-1" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <i class="fas fa-truck-plane icons opacity-icons"></i>
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Holidays"></span>
                            </a>
                        </li> 
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                            <a href="LocationComponent" modid="105" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/bhr/code_scan.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Countries and Cities"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                            <a href="ExitCheckpiontsComponent" modid="105" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/bhr/code_scan.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Exit Checkpoints"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php v_display(105); ?>>
                            <a href="ExitFormItemComponent" modid="105" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/bhr/code_scan.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color " vslang="menus.Exit Form Items"></span>
                            </a>
                        </li>
                        
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                <a href="CompanyComponent" modid="-1" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/bhr/report.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Company Profile"></span>
                </a>
            </li>

            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                <a href="BranchManagementComponent" modid="-1" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/bhr/report.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Branch Management"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(-1); ?>>
                <a href="RoleManagementComponent" modid="-1" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons"
                            src="{{ asset('assets/images/bhr/report.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text font-color " vslang="menus.Roles and Users"></span>
                </a>
            </li>

            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a id="_main_lnkLogout" href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons opacity-icons" src="{{ asset('assets/images/bhr/logout.svg') }}" />
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
