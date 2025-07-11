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
        background-color: #27444a;
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
        background-color: #27444a
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
        /* margin-top: 20px; */
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
        border-radius: 0px 0px 0px 20px;
        color:#cab54a;
    }
</style>

<?php
function v_display($mod_id, $module_ids = null)
{
    if (XAuthService::access_mod($mod_id, null, $module_ids)) {
        echo '';
    } else {
        echo ' style= "display:none" ';
    }
}
?>
  <!--class="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid" -->
<div class="kt-aside-menu-wrapper d-flex flex-column h-100" style="overflow:hidden" id="kt_aside_menu_wrapper">
    <div id="kt_aside_menu" class="kt-aside-menu"
        data-ktmenu-dropdown-timeout="500">
        <div class="kt-aside__brand d-flex flex-row" id="kt_aside_brand">
            <div class="kt-aside__brand-logo m-2">
                <img src="{{ asset('assets/images/logo/ksm-logo.png') }}" alt="" class="img-logo" />
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
                <button class="kt-aside__brand-aside-toggler kt-aside__brand-aside-toggler--left" id="kt_aside_toggler">
                    <span></span>
                </button>
            </div>
        </div>
         <div class="" id ="_dms_aside_menus" style="display:none;">
            <ul class="kt-menu__nav">
            <li class="kt-menu__item" aria-haspopup="true">
                <a href="DashboardComponent" class="menu-item kt-menu__link" modid="200" data-filter="true"
                    <?php vs_show(200); ?>>
                    <span class="kt-menu__link-icon">
                        <i>
                            <img class="icons" src="{{ asset('assets/images/icons/dashboard.png') }}" />
                        </i>
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.dashboard"></span>
                </a>
            </li>
            <li class="kt-menu__section mb-2">
                <h4 class="kt-menu__section-text " vslang="menus.students_management"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
            <li class="kt-menu__item" aria-haspopup="true">
                <a href="EnrolledStudentsComponent" class="menu-item kt-menu__link" modid="201"
                    <?php vs_show(201); ?>>
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/registration.png') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.enrolled_students"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true">
                <a href="OnLeaveStudentsComponent" class="menu-item kt-menu__link" modid="202"
                    <?php vs_show(202); ?>>
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/on_leave.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.onleave_students"></span>
                </a>
            </li>
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                <?php vs_show(null, [203, 204, 205, 206]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/payment_processing.png') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.payment_processing"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="TuitionPaymentsComponent" class="menu-item kt-menu__link" modid="204"
                                <?php vs_show(204); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons"
                                        src="{{ asset('assets/images/icons/payment_pending.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.tuition_payments"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="FindStudentComponent" class="menu-item kt-menu__link" modid="203"
                                <?php vs_show(203); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/find_student.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.find_student"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="DepositFeeComponent" class="menu-item kt-menu__link" modid="205"
                                <?php vs_show(205); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/deposit_fee.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.deposits"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="TestingFeeComponent" class="menu-item kt-menu__link" modid="233"
                                <?php vs_show(233); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons"
                                        src="{{ asset('assets/images/icons/non-tuition-fee.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.testing_fees"></span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="InvoicesComponent" class="menu-item kt-menu__link" modid="206"
                                <?php vs_show(206); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/invoices.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.invoices"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                <?php vs_show(null, [207, 208, 209, 210, 211]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/student_management.png') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.student_management"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="StudentInformationComponent" class="menu-item kt-menu__link" modid="207"
                                <?php vs_show(207); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons"
                                        src="{{ asset('assets/images/icons/student_information.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.student_information"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="PromoteStudentComponent" modid="208" class="menu-item kt-menu__link"
                                <?php vs_show(208); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons"
                                        src="{{ asset('assets/images/icons/promote_student.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.grade_promote"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="StudentGroupComponent" class="menu-item kt-menu__link" modid="209"
                                <?php vs_show(209); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/student_group.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.group"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
 
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                <?php vs_show(null, [217, 218]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/student_attendance.png') }}" />
                    </span>
                    <span class="kt-menu__link-text" vslang="menus.student_attendance"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="AttendanceDetailsComponent" class="menu-item kt-menu__link" modid="217"
                                <?php vs_show(217); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons"
                                        src="{{ asset('assets/images/icons/student_attendance.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.attendance_details"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="DailyLogsComponent" class="menu-item kt-menu__link" modid="218"
                                <?php vs_show(218); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons"
                                        src="{{ asset('assets/images/icons/student_attendance_report.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.daily_logs"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="kt-menu__section">
                <h4 class="kt-menu__section-text " vslang="menus.pricing_request"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                <?php vs_show(null, [219, 221, 220]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/fee_management.png') }}"
                            style="height: 25px" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.pricing_discounts"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="TuitionFeeComponent" class="d-none menu-item kt-menu__link" modid="219"
                                <?php vs_show(219); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/tuition_fee.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.Tuition Fees"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="PriceListComponent" class="menu-item kt-menu__link" modid="219"
                                <?php vs_show(219); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/tuition_fee.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.price_list"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="PolicyDiscountComponent" class="menu-item kt-menu__link" modid="221"
                                <?php vs_show(221); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons"
                                        src="{{ asset('assets/images/icons/policy_discount.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.Policy Discounts"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="ScholarshipComponent" class="menu-item kt-menu__link" modid="210"
                                <?php vs_show(210); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/discount_act.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.Scholarship"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="SiblingDiscountComponent" class="menu-item kt-menu__link" modid="237"
                                <?php vs_show(237); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons"
                                        src="{{ asset('assets/images/icons/sibling-discount.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.Siblings Discount"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="NonTuitionFeeComponent" class="menu-item kt-menu__link" modid="220"
                                <?php vs_show(220); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons"
                                        src="{{ asset('assets/images/icons/non-tuition-fee.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.non_tuition_fee"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="NonTuitionCategoryComponent" class="menu-item kt-menu__link" modid="236"
                                <?php vs_show(236); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/fee_type.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.nontuituin_category"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="ReferralFeeComponent" class="menu-item kt-menu__link" modid="444"
                                <?php vs_show(444); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons"
                                        src="{{ asset('assets/images/icons/sibling-discount.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.referral_fee"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>


            <li class="kt-menu__item" aria-haspopup="true">
                <a href="RequestDiscountComponent" class="menu-item kt-menu__link" modid="210"
                    <?php vs_show(210); ?>>
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/discount_act.png') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.discount_requests"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true">
                <a href="ActivitiesComponent" class="menu-item kt-menu__link" modid="211"
                    <?php vs_show(211); ?>>
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/activities.png') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.activity_requests"></span>
                </a>
            </li>
            <li style="" class="kt-menu__item" aria-haspopup="true">
                <a href="SuspendFeeComponent" class="menu-item kt-menu__link" modid="214"
                    <?php vs_show(214); ?>>
                    <span class="kt-menu__link-icon position-relative">
                        <img class="icons" src="{{ asset('assets/images/icons/approve.png') }}" />
                        <!-- <div class="bg-red">
                            <small data-field="leave_count" class="pending-count font-badge-label">5</small>
                        </div> -->
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.suspend_fee"></span>
                </a>
            </li>
            <li class="kt-menu__section mb-2">
                <h4 class="kt-menu__section-text " vslang="menus.approval_parent"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>

            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                <?php vs_show(null, [217, 218]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/student_attendance.png') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.approvals"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                        <a href="DiscountComponent" class="menu-item kt-menu__link" modid="212"
                            <?php vs_show(212); ?>>
                            <span class="kt-menu__link-icon position-relative">
                                <img class="icons" src="{{ asset('assets/images/icons/discount.png') }}" />
                                <div class="bg-red">
                                    <small data-field="discount_count"
                                        class="pending-count font-badge-label">5</small>
                                </div>
                            </span>
                            <span class="kt-menu__link-text " vslang="menus.discount"></span>
                        </a>
                    </li>
                    <li class="kt-menu__item" aria-haspopup="true">
                        <a href="AactivitiesComponent" class="menu-item kt-menu__link" modid="213"
                            <?php vs_show(213); ?>>
                            <span class="kt-menu__link-icon position-relative">
                                <img class="icons" src="{{ asset('assets/images/icons/a-activities.png') }}" />
                                <div class="bg-red">
                                    <small data-field="activity_count"
                                        class="pending-count font-badge-label">5</small>
                                </div>
                            </span>
                            <span class="kt-menu__link-text " vslang="menus.activity"></span>
                        </a>
                    </li>

                    <li class="kt-menu__item" aria-haspopup="true">
                        <a href="ApprovalLeaveComponent" class="menu-item kt-menu__link" modid="214"
                            <?php vs_show(214); ?>>
                            <span class="kt-menu__link-icon position-relative">
                                <img class="icons" src="{{ asset('assets/images/icons/approve.png') }}" />
                                <div class="bg-red">
                                    <small data-field="leave_count" class="pending-count font-badge-label">5</small>
                                </div>
                            </span>
                            <span class="kt-menu__link-text " vslang="menus.leave"></span>
                        </a>
                    </li>
                    <li class="kt-menu__item" aria-haspopup="true">
                        <a href="ApprovalSuspendFeeComponent" class="menu-item kt-menu__link" modid="214"
                            <?php vs_show(214); ?>>
                            <span class="kt-menu__link-icon position-relative">
                                <img class="icons" src="{{ asset('assets/images/icons/approve.png') }}" />
                                <div class="bg-red">
                                    <small data-field="Suspend_count"
                                        class="pending-count font-badge-label">5</small>
                                </div>
                            </span>
                            <span class="kt-menu__link-text " vslang="menus.suspend_fee"></span>
                        </a>
                    </li>
                    </ul>
                </div>
            </li>
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                    <?php vs_show(null, [216]); ?>>
                    <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                        <span class="kt-menu__link-icon">
                            <img class="icons" src="{{ asset('assets/images/icons/parents_account.png') }}" />
                        </span>
                        <span class="kt-menu__link-text " vslang="menus.parent_information"></span>
                        <i class="kt-menu__ver-arrow la la-angle-right"></i>
                    </a>
                    <div class="kt-menu__submenu ">
                        <span class="kt-menu__arrow"></span>
                        <ul class="kt-menu__subnav">
                            <li class="kt-menu__item" aria-haspopup="true">
                                <a href="ParentAccountsComponent" class="menu-item kt-menu__link" modid="216"
                                    <?php vs_show(216); ?>>
                                    <span class="kt-menu__link-icon">
                                        <img class="icons"
                                            src="{{ asset('assets/images/icons/manage_account.png') }}" />
                                    </span>
                                    <span class="kt-menu__link-text " vslang="menus.parent_accounts"></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>

            <li class="kt-menu__section mb-2">
                <h4 class="kt-menu__section-text " vslang="menus.teacher_schedule"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
            <li class="kt-menu__item" aria-haspopup="true">
                <a href="TeachersComponent" class="menu-item kt-menu__link" modid="200" data-filter="true">
                    <span class="kt-menu__link-icon">
                        <i>
                            <img class="icons" src="{{ asset('assets/images/icons/teacher.svg') }}" />
                        </i>
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.teachers"></span>
                </a>
            </li>
             <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                <?php vs_show(null, [222, 223]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/academic_calendar.png') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.schedule_management"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">

                     {{-- <li class="kt-menu__item" aria-haspopup="true">
                        <a href="ScheduleDaysComponent" class="menu-item kt-menu__link" modid="230"
                            <?php vs_show(230); ?>>
                            <span class="kt-menu__link-icon">
                                <img class="icons" src="{{ asset('assets/images/icons/schedule.svg') }}" />
                            </span>
                            <span class="kt-menu__link-text " vslang="menus.schedule_day"></span>
                        </a>
                    </li> --}}

            {{-- <li class="kt-menu__item" aria-haspopup="true">
                <a href="SubjectsComponent" class="menu-item kt-menu__link" modid="230"
                    <?php vs_show(230); ?>>
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/subject.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.subjects"></span>
                </a>
            </li> --}}
            <li class="kt-menu__item" aria-haspopup="true">
                <a href="CurriculaComponent" class="menu-item kt-menu__link" modid="200" data-filter="true">
                    <span class="kt-menu__link-icon">
                        <i>
                            <img class="icons" src="{{ asset('assets/images/icons/courses.svg') }}" />
                        </i>
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.curricula"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true">
                <a href="CoursesComponent" class="menu-item kt-menu__link" modid="200" data-filter="true">
                    <span class="kt-menu__link-icon">
                        <i>
                            <img class="icons" src="{{ asset('assets/images/icons/courses.svg') }}" />
                        </i>
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.courses"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true">
                <a href="ClassesComponent" class="menu-item kt-menu__link" modid="200"
                    data-filter="true">
                    <span class="kt-menu__link-icon">
                        <i>
                            <img class="icons" src="{{ asset('assets/images/icons/room.svg') }}" />
                        </i>
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.class"></span>
                </a>
            </li>
                    </ul>
                </div>
            </li>


            <li class="kt-menu__item" aria-haspopup="true">
                <a href="ReportCenterComponent" class="menu-item kt-menu__link" modid="225" <?php vs_show(225); ?>>
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/report_center.png') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.report"></span>
                </a>
            </li>
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                <?php vs_show(null, [222, 223]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/academic_calendar.png') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.academic_calendar"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="TermComponent" class="menu-item kt-menu__link" modid="222"
                                <?php vs_show(222); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/term.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.term"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="AcademicYearComponent" class="menu-item kt-menu__link" modid="223"
                                <?php vs_show(223); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/academic_year.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.academic_year"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="HolidayComponent" class="menu-item kt-menu__link" modid="223"
                                <?php vs_show(223); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/holiday.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.holiday"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
             <li class="kt-menu__section mb-2">
                <h4 class="kt-menu__section-text " vslang="menus.building_room"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
              <li class="kt-menu__item" aria-haspopup="true">
                <a href="BuildingsComponent" class="menu-item kt-menu__link" modid="200" data-filter="true">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/building.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.buildings"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true">
                <a href="RoomsComponent" class="menu-item kt-menu__link" modid="200" data-filter="true">
                    <span class="kt-menu__link-icon">
                            <img class="icons" src="{{ asset('assets/images/icons/room.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.rooms"></span>
                </a>
            </li>
            <li class="kt-menu__item" aria-haspopup="true">
                <a href="RoomTypeComponent" class="menu-item kt-menu__link" modid="230"
                    <?php vs_show(230); ?>>
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/room.svg') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.room_types"></span>
                </a>
            </li>
            <li class="kt-menu__section mb-2">
                <h4 class="kt-menu__section-text " vslang="menus.settings"></h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
            <li class="kt-menu__item" aria-haspopup="true">
                <a href="CompanyComponent" class="menu-item kt-menu__link" modid="226" <?php vs_show(226); ?>>
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/company_profile.png') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.company_profile"></span>
                </a>
            </li>
            <li class="kt-menu__item d-none" aria-haspopup="true">
                <a href="CampusComponent" class="menu-item kt-menu__link" modid="229" <?php vs_show(229); ?>>
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/campus.png') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.campus"></span>
                </a>
            </li>

            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                <?php vs_show(null, [230, 231, 232, 233, 236]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/setting.png') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.settings"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="ProgramComponent" class="menu-item kt-menu__link" modid="230"
                                <?php vs_show(230); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/program.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.program"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="SessionComponent" class="menu-item kt-menu__link" modid="232"
                                <?php vs_show(232); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/session.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.session"></span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="AttendancTracksComponent" class="menu-item kt-menu__link" modid="230"
                                <?php vs_show(230); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/attendance.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.attendance_tracks"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="TrackDetailsComponent" class="menu-item kt-menu__link" modid="230"
                                <?php vs_show(230); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/track_detail.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.track_details"></span>
                            </a>
                        </li>


                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="PaymentMethodComponent" class="menu-item kt-menu__link" modid="231"
                                <?php vs_show(231); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/bank.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.payment_methods"></span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="ImportDataComponent" class="menu-item kt-menu__link" modid="233"
                                <?php vs_show(233); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons"
                                        src="{{ asset('assets/images/icons/import_student.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.import_data"></span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true" <?php vs_show(105); ?>>
                            <a href="LocationComponent" modid="105" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons opacity-icons"
                                        src="{{ asset('assets/images/bhr/code_scan.svg') }}" />
                                </span>
                                <span class="kt-menu__link-text font-color "
                                    vslang="menus.Countries and Cities"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"
                <?php vs_show(null, [234, 235]); ?>>
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/mobile_setting.png') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.mobile_setting"></span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="MobileBannerComponent" class="menu-item kt-menu__link" modid="234"
                                <?php vs_show(234); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/banner.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.mobile_banner"></span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="MaterialItemsComponent" class="menu-item kt-menu__link" modid="234"
                                <?php vs_show(234); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/banner.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.book_item"></span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="AnnouncementComponent" class="menu-item kt-menu__link" modid="234"
                                <?php vs_show(234); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/banner.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.announcement"></span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="PromotionComponent" class="menu-item kt-menu__link" modid="235"
                                <?php vs_show(235); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/social_media.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.promotion"></span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="SocialMediaComponent" class="menu-item kt-menu__link" modid="235"
                                <?php vs_show(235); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/social_media.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.social_media"></span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="MobileTCComponent" class="menu-item kt-menu__link" modid="235"
                                <?php vs_show(235); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/social_media.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.term_condition"></span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="MobilePrivacyComponent" class="menu-item kt-menu__link" modid="235"
                                <?php vs_show(235); ?>>
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/social_media.png') }}" />
                                </span>
                                <span class="kt-menu__link-text " vslang="menus.privacy_statement"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a id="_main_lnkLogout" href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/log_out.png') }}" />
                    </span>
                    <span class="kt-menu__link-text " vslang="menus.logout"></span>
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

        const OFFSET_TOP = __brandArea.offsetHeight;

        // Set max height based on window height
        const updateMenuHeight = () => {
            const maxHeight = window.innerHeight - OFFSET_TOP;
            __dx.style.maxHeight = maxHeight + 'px';
            __dx.style.overflowY = 'hidden'; // Default hidden
        };

        // Initialize global app context if not yet defined
        window.vsapp = window.vsapp || {};
        window.vsapp.menuTranslated = false;

        // Attempt to translate menu using LocaleManager
        const tryTranslateMenu = () => {
            if (typeof LocaleManager === 'object' || typeof LocaleManager === 'function') {
                LocaleManager.translateZone(__dx, null, () => {});
                __dx.style.display = 'block';
                window.vsapp.menuTranslated = true;
            }
        };

        // Immediate translation attempt
        tryTranslateMenu();

        // Fallback translation on DOM load
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.vsapp.menuTranslated) {
                tryTranslateMenu();
            }
            updateMenuHeight(); // Set height on initial load
        });

        // Update height on window resize
        window.addEventListener('resize', updateMenuHeight);

        // Scrollbar appears on hover, hides on mouse out
        __dx.addEventListener('mouseover', () => {
            __dx.style.overflowY = 'auto';
        });

        __dx.addEventListener('mouseout', () => {
            __dx.style.overflowY = 'hidden';
        });
    })();
</script>

 