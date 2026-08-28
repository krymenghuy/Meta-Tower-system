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
        <div class="" id ="_dms_aside_menus" class="menu-pending">
            <ul class="kt-menu__nav side_menu_list">
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(400); ?>>
                    <a href="DashboardComponent" modid="400" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/dashboard.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.dashboard"></span>
                    </a>
                </li>
                <li class="mb-2 kt-menu__section">
                    <h4 class="kt-menu__section-text" vslang="menus.main_menu"></h4>
                    <i class="kt-menu__section-icon flaticon-more-v2"></i>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(401); ?>>
                    <a href="EmployeeComponent" modid="401" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/group.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.employees"></span>
                    </a>
                </li>
                <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                    <?php v_display(null, [402,403,404,405]); ?>>
                    <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons"
                                src="{{ asset('assets/images/bhr/user-list.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.employee_actions">
                        </span>
                        <i class="la-angle-right text-white kt-menu__ver-arrow la"></i>
                    </a>
                    <div class="kt-menu__submenu"><span class="kt-menu__arrow"></span>
                        <ul class="kt-menu__subnav">
                            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(403); ?>>
                                <a href="EmployeeBenefitComponent" modid="403" class="menu-item kt-menu__link">
                                    <span class="kt-menu__link-icon">
                                        <img class="opacity-icons icons" src="{{ asset('assets/images/icons/transaction.svg') }}" />
                                    </span>
                                    <span class="font-color kt-menu__link-text" vslang="menus.benefits"></span>
                                </a>
                            </li>
                            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(402); ?>>
                                <a href="MovementComponent" modid="402" class="menu-item kt-menu__link">
                                    <span class="kt-menu__link-icon">
                                        <img class="opacity-icons icons" src="{{ asset('assets/images/icons/reservation.svg') }}" />
                                    </span>
                                    <span class="font-color kt-menu__link-text" vslang="menus.movements"></span>
                                </a>
                            </li>
                            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(404); ?>>
                                <a href="WarningComponent" modid="404" class="menu-item kt-menu__link">
                                    <span class="kt-menu__link-icon">
                                        <img class="opacity-icons icons" src="{{ asset('assets/images/bhr/warning.svg') }}" />
                                    </span>
                                    <span class="font-color kt-menu__link-text" vslang="menus.warnings"></span>
                                </a>
                            </li>
                            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(431); ?>>
                                <a href="DeductionComponent" modid="431" class="menu-item kt-menu__link">
                                    <span class="kt-menu__link-icon">
                                        <img class="opacity-icons icons" src="{{ asset('assets/images/bhr/journal-check.svg') }}" />
                                    </span>
                                    <span class="font-color kt-menu__link-text" vslang="menus.deductions"></span>
                                </a>
                            </li>
                            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(405); ?>>
                                <a href="ExitFormComponent" modid="405" class="menu-item kt-menu__link">
                                    <span class="kt-menu__link-icon">
                                        <img class="opacity-icons icons"
                                            src="{{ asset('assets/images/bhr/attachment.svg') }}" />
                                    </span>
                                    <span class="font-color kt-menu__link-text" vslang="menus.exit_forms"></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(406); ?>>
                    <a href="EmployeeAttendanceComponent" modid="406" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/contract.png') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.daily_attendance"></span>
                    </a>
                </li>
                <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                    <?php v_display(null, [407,408]); ?>>
                    <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons"
                                src="{{ asset('assets/images/bhr/content-settings.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.shift_management">
                        </span>
                        <i class="la-angle-right text-white kt-menu__ver-arrow la"></i>
                    </a>
                    <div class="kt-menu__submenu"><span class="kt-menu__arrow"></span>
                        <ul class="kt-menu__subnav">
                            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(407); ?>>
                                <a href="WorkShiftComponent" modid="407" class="menu-item kt-menu__link">
                                    <span class="kt-menu__link-icon">
                                        <img class="opacity-icons icons"
                                            src="{{ asset('assets/images/icons/google-task.svg') }}" />
                                    </span>
                                    <span class="font-color kt-menu__link-text" vslang="menus.work_shifts"></span>
                                </a>
                            </li>
                            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(408); ?>>
                                <a href="AttendanceTracksComponent" modid="408" class="menu-item kt-menu__link">
                                    <span class="kt-menu__link-icon">
                                        <img class="opacity-icons icons" src="{{ asset('assets/images/icons/receipt.png') }}" />
                                    </span>
                                    <span class="font-color kt-menu__link-text" vslang="menus.attendance_tracking"></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="mb-2 kt-menu__section">
                    <h4 class="kt-menu__section-text" vslang="menus.leaves_management"></h4>
                    <i class="kt-menu__section-icon flaticon-more-v2"></i>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(409); ?>>
                    <a href="LeaveComponent" modid="409" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/contract.png') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.leave_request"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(410); ?>>
                    <a href="UninformedLeaveComponent" modid="410" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons"
                                src="{{ asset('assets/images/bhr/code_scan.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.uninformed_leaves"></span>
                    </a>
                </li>
                <li class="mb-2 kt-menu__section">
                    <h4 class="kt-menu__section-text" vslang="menus.payroll_accounts"></h4>
                    <i class="kt-menu__section-icon flaticon-more-v2"></i>
                </li>
                
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(411); ?>>
                    <a href="PayrollComponent" modid="411" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/transaction.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.payrolls"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(412); ?>>
                    <a href="PayrollListComponent" modid="412" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons"
                                src="{{ asset('assets/images/icons/google-task.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.payroll_list"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(413); ?>>
                    <a href="PayrollAccountComponent" modid="413" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/p_account.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.payroll_account"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(414); ?>>
                    <a href="WalletAccountComponent" modid="414" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/w_account.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.staff_wallet"></span>
                    </a>
                </li>
                <li class="mb-2 kt-menu__section d-none">
                    <h4 class="kt-menu__section-text" vslang="menus.benefit_disbursements"></h4>
                    <i class="kt-menu__section-icon flaticon-more-v2"></i>
                </li>
               
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(415); ?>>
                    <a href="BenefitComponent" modid="415" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/receipt.png') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.benefit_list"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(417); ?>>
                    <a href="BenefitDisbursementComponent" modid="417" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/receipt.png') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.benefit_disbursements"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(418); ?>>
                    <a href="BenefitDisbursePolicyComponent" modid="418" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/bhr/journal-check.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.disburse_policies"></span>
                    </a>
                </li>
                <li class="mb-2 kt-menu__section">
                    <h4 class="kt-menu__section-text" vslang="menus.reporting"></h4>
                    <i class="kt-menu__section-icon flaticon-more-v2"></i>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(430); ?>>
                    <a href="ReportComponent" modid="430" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/bhr/company.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.reports"></span>
                    </a>
                </li>
                
                <li class="mb-2 kt-menu__section">
                    <h4 class="kt-menu__section-text" vslang="menus.settings"></h4>
                    <i class="kt-menu__section-icon flaticon-more-v2"></i>
                </li>
             
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(432); ?>>
                    <a href="ImportDataComponent" modid="432" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/bhr/import_student.png') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.import_data"></span>
                    </a>
                </li>
                
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(419); ?>>
                    <a href="HolidayComponent" modid="419" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{ asset('assets/images/icons/holiday.svg') }}" />
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.holidays"></span>
                    </a>
                </li>
                <li class="kt-menu__item" aria-haspopup="true" <?php v_display(416); ?>>
                    <a href="TaxBracketComponent" modid="416" class="menu-item kt-menu__link">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons" src="{{asset('assets/images/icons/tax_bracket.svg')}}">
                        </span>
                        <span class="font-color kt-menu__link-text" vslang="menus.tax_brackets"></span>
                    </a>
                </li>
                <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true"
                    data-ktmenu-submenu-toggle="hover"<?php v_display(null, [420,421,422,423,424,425]); ?>>
                    <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                        <span class="kt-menu__link-icon">
                            <img class="opacity-icons icons"
                                src="{{ asset('assets/images/icons/setting.png') }}" />
                        </span>
                        <span class="text-nowrap kt-menu__link-text" vslang="menus.general_settings">general_settings</span>
                        <i class="la-angle-right text-white kt-menu__ver-arrow la"></i>
                    </a>
                    <div class="kt-menu__submenu"><span class="kt-menu__arrow"></span>
                        <ul class="kt-menu__subnav">
                            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(420); ?>>
                                <a href="DepartmentComponent" modid="420" class="menu-item kt-menu__link">
                                    <span class="kt-menu__link-icon">
                                        {{-- <i class="opacity-icons fas fa-truck-plane icons"></i> --}}
                                        <img class="opacity-icons icons" src="{{ asset('assets/images/icons/department.svg') }}" />
                                    </span>
                                    <span class="font-color kt-menu__link-text" vslang="menus.departments"></span>
                                </a>
                            </li>                        
                            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(421); ?>>
                                <a href="PositionComponent" modid="421" class="menu-item kt-menu__link">
                                    <span class="kt-menu__link-icon">
                                        <img class="opacity-icons icons"
                                            src="{{ asset('assets/images/bhr/position.svg') }}" />
                                    </span>
                                    <span class="font-color kt-menu__link-text" vslang="menus.positions"></span>
                                </a>
                            </li>
                            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(422); ?>>
                                <a href="JobsLevelComponent" modid="422" class="menu-item kt-menu__link">
                                    <span class="kt-menu__link-icon">
                                        <img class="opacity-icons icons" src="{{asset('assets/images/icons/job_level.svg')}}">
                                    </span>
                                    <span class="font-color kt-menu__link-text" vslang="menus.job_levels"></span>
                                </a>
                            </li>
                            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(423); ?>>
                                <a href="SkillsComponent" modid="423" class="menu-item kt-menu__link">
                                    <span class="kt-menu__link-icon">
                                        <img class="opacity-icons icons"
                                            src="{{ asset('assets/images/icons/company_profile.svg') }}" />
                                    </span>
                                    <span class="font-color kt-menu__link-text" vslang="menus.skills"></span>
                                </a>
                            </li>
                            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(424); ?>>
                                <a href="CheckPointCategoryComponent" modid="424" class="menu-item kt-menu__link">
                                    <span class="kt-menu__link-icon">
                                        <img class="opacity-icons icons"
                                            src="{{ asset('assets/images/icons/form.svg') }}" />
                                    </span>
                                    <span class="font-color kt-menu__link-text" vslang="menus.checkpoint_evaluation"></span>
                                </a>
                            </li>
                            <li class="kt-menu__item" aria-haspopup="true" <?php v_display(425); ?>>
                                <a href="CheckPointComponent" modid="425" class="menu-item kt-menu__link">
                                    <span class="kt-menu__link-icon">
                                        <img class="opacity-icons icons"
                                            src="{{ asset('assets/images/icons/item.svg') }}" />
                                    </span>
                                    <span class="font-color kt-menu__link-text" vslang="menus.checkpoints"></span>
                                </a>
                            </li>
                            
                        </ul>
                    </div>
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

<!-- <script>
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

</script> -->
