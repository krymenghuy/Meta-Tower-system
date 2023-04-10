<style>
    li.kt-menu__section {
        margin-top: 8px !important;
        background: #EBF5FB;
        border: 1px solid #D0D3D4;
        padding: 10px;
        box-shadow: 1.5px 2px #D0D3D4;
    }

    .kt-menu__section-text {
        font-weight: bold !important;
    }

    .menu-selected {
        background-color: #ff7b03;
        border-top: 1.2px dotted orange;
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

<div class="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid" id="kt_aside_menu_wrapper">
    <div id="kt_aside_menu" class="kt-aside-menu" data-ktmenu-vertical="1" data-ktmenu-scroll="1" data-ktmenu-dropdown-timeout="500">
        <div class="kt-aside__brand kt-grid__item py-2 pt-4" id="kt_aside_brand">
            <div class="kt-aside__brand-logo">
                <img src="{{ asset('assets/images/icons/logo.jpg') }}" alt="" class="img-logo"/>
            </div>
            <div class="kt-aside__brand-tools">
                <button class="kt-aside__brand-aside-toggler" id="kt_aside_toggler" style="padding:10px;font-size:1.3em !important">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                                <path d="M5.29288961,6.70710318 C4.90236532,6.31657888 4.90236532,5.68341391 5.29288961,5.29288961 C5.68341391,4.90236532 6.31657888,4.90236532 6.70710318,5.29288961 L12.7071032,11.2928896 C13.0856821,11.6714686 13.0989277,12.281055 12.7371505,12.675721 L7.23715054,18.675721 C6.86395813,19.08284 6.23139076,19.1103429 5.82427177,18.7371505 C5.41715278,18.3639581 5.38964985,17.7313908 5.76284226,17.3242718 L10.6158586,12.0300721 L5.29288961,6.70710318 Z" id="Path-94" fill="#000000" fill-rule="nonzero" transform="translate(8.999997, 11.999999) scale(-1, 1) translate(-8.999997, -11.999999)" />
                                <path d="M10.7071009,15.7071068 C10.3165766,16.0976311 9.68341162,16.0976311 9.29288733,15.7071068 C8.90236304,15.3165825 8.90236304,14.6834175 9.29288733,14.2928932 L15.2928873,8.29289322 C15.6714663,7.91431428 16.2810527,7.90106866 16.6757187,8.26284586 L22.6757187,13.7628459 C23.0828377,14.1360383 23.1103407,14.7686056 22.7371482,15.1757246 C22.3639558,15.5828436 21.7313885,15.6103465 21.3242695,15.2371541 L16.0300699,10.3841378 L10.7071009,15.7071068 Z" id="Path-94" fill="#000000" fill-rule="nonzero" opacity="0.3" transform="translate(15.999997, 11.999999) scale(-1, 1) rotate(-270.000000) translate(-15.999997, -11.999999)"/>
                            </g>
                        </svg>
                    </span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                                <path d="M12.2928955,6.70710318 C11.9023712,6.31657888 11.9023712,5.68341391 12.2928955,5.29288961 C12.6834198,4.90236532 13.3165848,4.90236532 13.7071091,5.29288961 L19.7071091,11.2928896 C20.085688,11.6714686 20.0989336,12.281055 19.7371564,12.675721 L14.2371564,18.675721 C13.863964,19.08284 13.2313966,19.1103429 12.8242777,18.7371505 C12.4171587,18.3639581 12.3896557,17.7313908 12.7628481,17.3242718 L17.6158645,12.0300721 L12.2928955,6.70710318 Z" id="Path-94" fill="#000000" fill-rule="nonzero"/>
                                <path d="M3.70710678,15.7071068 C3.31658249,16.0976311 2.68341751,16.0976311 2.29289322,15.7071068 C1.90236893,15.3165825 1.90236893,14.6834175 2.29289322,14.2928932 L8.29289322,8.29289322 C8.67147216,7.91431428 9.28105859,7.90106866 9.67572463,8.26284586 L15.6757246,13.7628459 C16.0828436,14.1360383 16.1103465,14.7686056 15.7371541,15.1757246 C15.3639617,15.5828436 14.7313944,15.6103465 14.3242754,15.2371541 L9.03007575,10.3841378 L3.70710678,15.7071068 Z" id="Path-94" fill="#000000" fill-rule="nonzero" opacity="0.3" transform="translate(9.000003, 11.999999) rotate(-270.000000) translate(-9.000003, -11.999999)"/>
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
            <li class="kt-menu__item" aria-haspopup="true">
                <a href="javascript:void(0)" id="_main_lnkDashboard" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <i>
                            <img class="icons" src="{{ asset('assets/images/icons/dashboard.svg') }}" style="height:25px">
                        </i>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Dashboard">Dashboard</span>
                </a>
            </li>

            <li style="display:none" class="kt-menu__item" aria-haspopup="true">
                <a href="javascript:void(0)" id="_main_lnkDashboard2" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <i>
                            <img class="icons" src="{{ asset('assets/images/icons/dashboard.svg') }}" style="height:25px;">
                        </i>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Dashboard 2">Dashboard 2</span>
                </a>
            </li>

            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/hospital_reception.svg') }}" style="height: 25px;"/>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Reception">Reception</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li style="display:none" class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkPatientFinder" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/patient_finder.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Patient Finder">Patient Finder</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkAppointments" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/appointment.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Appointments">Appointments</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkTickets" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/queue.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Queues">Queues</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkPatientInvoices" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/invoice.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Invoices">Invoices</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{asset('assets/images/icons/patient.svg')}}"/>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Patients">Patients</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkOPDList" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/opd_patient.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.OPD Patients">OPD List</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{asset('assets/images/icons/consultation.svg')}}"/>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Consultation">Consultation</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkConsultantQueues" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/queue.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Queues">Queues</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/customer_service.svg') }}"/>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Services">Services</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                       <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkServicePlans" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/surgery_equipment.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Service Plans"></span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkMedicalServices" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/surgery_equipment.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Medical Services">Services</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/laboratory.svg') }}"/>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Partners">Partners</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkLaboPartners" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/laboratory_partner.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Labo Partners">Labo Partners</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item" aria-haspopup="true">
                <a href="javascript:void(0)" id="_main_lnkVendors" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <i>
                            <img class="icons" src="{{ asset('assets/images/icons/dashboard.svg') }}" style="height:25px"/>
                        </i>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Vendors">Vendors</span>
                </a>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{asset('assets/images/icons/inventory.svg')}}"/>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Inventory">Inventory</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true" style="display:none">
                            <a href="javascript:void(0)" id="_main_lnkInventoryDashboard"
                                class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/dashboard.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Inventory Dashboard">Inventory Dashboard</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkStockTracking" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/stock_tracking.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Stock Tracking">Stock Tracking</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkStockAdjustment" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/stock_adjustment.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Stock Adjustments">Stock Adjustments</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkStockTransfer" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/stock_adjustment.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Stock Transfer">Stock Transfer</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkItems" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/product.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Products">Products</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkItemGroups" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/hierarchical_structure.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Product Groups">Product Groups</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkCategories" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/hierarchical_structure.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Product Categories">Categories</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{asset('assets/images/icons/employee.svg')}}"/>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Employees">Employees</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkEmployeeList" class="menu-item kt-menu__link">
                                 <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/employee_list.svg')}}"/>
                                 </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Employee List">Employee List</span>
                            </a>
                        </li>
                         <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkWorkSchedules" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/position.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Work Schedules">Work Schedues</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{asset('assets/images/icons/money_bag.svg')}}"/>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Incomes">Incomes</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkIncomeInvoices" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/invoice.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Invoices">Invoices</span>
                            </a>
                        </li>

                        <li style="display:none" class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkPatientReceipts" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/invoice.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Reciepts">Receipts</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkIncomePayments" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/payment.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Payments">Payments</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkOtherRevenues" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/other_revenus.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Other Revenues">Other Revenues</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkIncomeCategories" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/income_category.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Income Categories">Income categories</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkIncomeBookingTemplates"
                                class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/booking_templates.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Booking Templates">Booking Templates</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/expenses.svg') }}"/>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Expenses">Expenses</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkExpenseBook" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/expense_book.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Expense Book">Expense Book</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkPatientCreditNotes" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/credit_note.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Credit Notes">Credit Notes</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkExpenseCategories" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/expense_category.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Expense Categories">Expense Categories</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkExpenseBookingTemplates"
                                class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/booking_templates.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Booking Templates">Booking Templates</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item" aria-haspopup="true">
                <a href="javascript:void(0)" id="_mainLnkReportCenter" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/general_report.png')}}" style="height:25px"/>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Reports">Report Center</span>
                </a>
            </li>

            <li class="kt-menu__section ">
                <h4 class="kt-menu__section-text">Settings</h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
            <li class="kt-menu__item" aria-haspopup="true">
                <a href="javascript:void(0)" id="_main_lnkCompanyProfile" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{asset('assets/images/icons/company_profile.svg')}}"/>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Company Profile">Company Profile</span>
                </a>
            </li>

            <li style="display:none" class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{asset('assets/images/icons/mobile_setting.svg')}}"/>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Mobile Settings">Mobile Settings</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkManageBrandImages_mobile" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/brand_image.svg')}}"/>
                                </span>
                                <span class="kt-menu__link-text trans-text trans-text" data-langprop="menus.Brand Images">Brand Images</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkPromotions" class="menu-item kt-menu__link ">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/promotion.svg')}}"/>
                                </span>
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Promotion">Promotions</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{asset('assets/images/icons/settings.svg')}}"/>
                    </span>
                    &nbsp;
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Settings">Settings</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkChiefCompaints" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/chief_complaints_diagnosis.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Chief Complaints">Chief Complaints</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkServiceDepartments" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/departments.svg') }}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Departments">Departments</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkManageLocation" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/location.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Locations">Locations</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkExchangeRate" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/exchange_rate.svg')}}"/>
                                </span>
                                &nbsp;
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Exchange Rate">Exchange Rate</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{ asset('assets/images/icons/user_management.svg') }}"/>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.User Management">User Management</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu"><span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkManageRoles" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{ asset('assets/images/icons/manage_role.svg') }}"/>
                                </span>
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Manage Roles">Manage Roles</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkManageUsers" class="menu-item kt-menu__link ">
                                <span class="kt-menu__link-icon">
                                    <img class="icons" src="{{asset('assets/images/icons/manage_users.svg')}}"/>
                                </span>
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Manage Users">Manage Users</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a id="_main_lnkLogout" href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <img class="icons" src="{{asset('assets/images/icons/log_out.svg')}}"/>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Log Out">Log Out</span>
                </a>
            </li>
        </ul>
    </div>
</div>

<script>
    let __dx = $('#_dms_aside_menus');
    LocaleManager.translateZone('_dms_aside_menus');
    __dx.show();
    __dx.css('height', [(window.innerHeight) - 65, 'px'].join(''));
    __dx.css('overflow-y','auto');
    window.addEventListener('resize',function(){
        __dx.css('height', [(window.innerHeight) - 65, 'px'].join(''));
        __dx.css('overflow-y','auto');
    });
    let prev_selected_menu = null;

    __dx.on('mouseover', function () {
        $(this).css('overflow-y', 'auto');
    });

    __dx.on('mouseout', function() {
        $(this).css('overflow-y', 'hidden');
    });

    __dx.on('click', '.menu-item', function (e) {
        if (prev_selected_menu) prev_selected_menu.removeClass('menu-selected');
        $(this).toggleClass('menu-selected');
        prev_selected_menu = $(this);
    });
</script>