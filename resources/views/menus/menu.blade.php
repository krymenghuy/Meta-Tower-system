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

    /* div#kt_aside_menu{
     background:#ECF0F1 !important;
   } */
    .menu-selected {
        background-color: #0544d1;
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
    <!--data-ktmenu-scroll="1"-->
    <div id="kt_aside_menu" class="kt-aside-menu " data-ktmenu-vertical="1" data-ktmenu-scroll="1"
        data-ktmenu-dropdown-timeout="500">
        <ul class="kt-menu__nav" id="_dms_aside_menus" style="display:none">

            <li class="kt-menu__item" aria-haspopup="true">
                <a href="javascript:void(0)" id="_main_lnkDashboard" class="menu-item kt-menu__link">
                    <span class="kt-menu__link-icon">
                        <i><img src="{{ asset('assets/images/icons/dashboard.jpg') }}"
                                style="height:25px;"></i>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Dashboard">Dashboard</span>
                </a>
            </li>

            <!-- <li class="kt-menu__section ">
                  <h4 class="kt-menu__section-text">Student Loans</h4>
                  <i class="kt-menu__section-icon flaticon-more-v2"></i>
                </li> -->

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon"><i class="fas fa-mobile"></i></span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Reception">Reception</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkPatientFinder" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Patient Finder">Patient Finder</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkAppointments" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Appointments">Appointments</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkRegistration" class="menu-item kt-menu__link ">
                                <i class="kt-menu__link-bullet fas fa-map-marked-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Registration">Regirstation</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkTickets" class="menu-item kt-menu__link ">
                                <i class="kt-menu__link-bullet fas fa-map-marked-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Queues">Queues</span>
                            </a>
                        </li>

                    </ul>
                </div>
            </li>



            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon"><i class="fas fa-mobile"></i></span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Patients">Patients</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkPatientDashboard" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Patent Dashboard">Patient Dashboard</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkOPDList" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text" data-langprop="menus.OPD Patients">OPD
                                    List</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkPatientInvoices" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Patent Invoices">Patient Invoices</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkPatientCreditNotes"
                                class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Credit Notes">Credit Notes</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>


            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon"><i class="fas fa-mobile"></i></span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Consultation">Consultation</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkConsultantDashboard"
                                class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Consultant Dashboard">Consultant Dashboard</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkConsultantQueues" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Queues">Queues</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>


            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon"><i class="fas fa-mobile"></i></span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Services">Services</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkSurgeryServices" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Surgery Services">Surgery Services</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkNonsurgeryServices"
                                class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Non-surgery Services">Non-surgery Services</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon"><i class="fas fa-mobile"></i></span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Laboratory">Laboratory</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkLaboDashboard" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Laboratory Dashboard">Laboratory Dashboard</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkLaboTests" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Laboratory Tests">Laboratory Tests</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkLaboPartners" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Laboratory Partners">Laboratory Partners</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>


            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon"><i class="fas fa-mobile"></i></span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Inventory">Inventory</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkInventoryDashboard"
                                class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Inventory Dashboard">Inventory Dashboard</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkProductGroups" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Product Groups">Product Groups</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkProducts" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Products">Products</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkStockAdjustment" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Stock Adjustments">Stock Adjustments</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon"><i class="fas fa-mobile"></i></span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Employees">Employees</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkEmployeeList" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Employee List">Employee List</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkPositions" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Positions">Positions</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkDepartments" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Departments">Departments</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon"><i class="fas fa-mobile"></i></span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Incomes">Incomes</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkInvoices" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Invoices">Invoices</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkIncomePayments" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Payments">Payments</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkOtherRevenues" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Other Revenues">Other Revenues</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkIncomeCategories" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Income Categories">Income categories</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkIncomeBookingTemplates"
                                class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Booking Templates">Booking Templates</span>
                            </a>
                        </li>

                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon"><i class="fas fa-mobile"></i></span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Expenses">Expenses</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkExpenseBook" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Expense Book">Expense Book</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkExpenseCategories"
                                class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Expense Categories">Expense Categories</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkExpenseBookingTemplates"
                                class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Booking Templates">Booking Templates</span>
                            </a>
                        </li>

                    </ul>
                </div>
            </li>


            <li class="kt-menu__item" aria-haspopup="true">
                <a href="javascript:;" id="_mainLnkReportCenter" class="menu-item kt-menu__link ">
                    <span class="kt-menu__link-icon">
                        <!--<i class="fa-solid fas fa-chart-pie"></i>-->
                        <i><img src="{{ asset('assets/images/icons/General report.png') }}"
                                style="height:25px;"></i>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Reports">Report Center</span>
                </a>
            </li>


            <li class="kt-menu__section ">
                <h4 class="kt-menu__section-text">Settings</h4>
                <i class="kt-menu__section-icon flaticon-more-v2"></i>
            </li>
            <li class="kt-menu__item" aria-haspopup="true">
                <a href="javascript:;" id="_main_lnkCompanyProfile" class="menu-item kt-menu__link ">
                    <span class="kt-menu__link-icon">
                        <i class="fa fa-university"></i>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Company Profile">Company
                        Profile</span>
                </a>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon"><i class="fas fa-mobile"></i></span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Mobile Settings">Mobile
                        Settings</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkManageBrandImages_mobile"
                                class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon"><i class="fa fa-map-marker-alt"></i></span>
                                <span class="kt-menu__link-text trans-text trans-text"
                                    data-langprop="menus.Brand Images">Brand Images</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkPromotions" class="menu-item kt-menu__link ">
                                <span class="kt-menu__link-icon"><i class="fa fa-map-marker-alt"></i></span>
                                <span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Promotion">Promotions</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:void(0)" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon"><i class="fas fa-globe-asia"></i></span>
                    &nbsp;<span class="kt-menu__link-text trans-text" data-langprop="menus.Settings">Settings</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu ">
                    <span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkChiefCompaints" class="menu-item kt-menu__link ">
                                <i class="kt-menu__link-bullet fas fa-list-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Chief Compalaints">Chief Complaints</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkDiagnosisAutocomplete"
                                class="menu-item kt-menu__link ">
                                <i class="kt-menu__link-bullet fas fa-list-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Diagnosis">Diagnosis Autocomplete</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkPEAutocomplete" class="menu-item kt-menu__link ">
                                <i class="kt-menu__link-bullet fas fa-list-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Diagnosis">Examination Autocomplete</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkMedicalHistory" class="menu-item kt-menu__link ">
                                <i class="kt-menu__link-bullet fas fa-list-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Medical History">Medical History</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkServiceDepartments"
                                class="menu-item kt-menu__link ">
                                <i class="kt-menu__link-bullet fas fa-list-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Service Departments">Service Departments</span>
                            </a>
                        </li>
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkManageLocation" class="menu-item kt-menu__link">
                                <i class="kt-menu__link-bullet fas fa-map-marker-alt"><span></span></i>
                                &nbsp;<span class="kt-menu__link-text trans-text"
                                    data-langprop="menus.Locations">Locations</span>
                            </a>
                        </li>



                        <!-- <li class="kt-menu__item" aria-haspopup="true">
                                    <a href="javascript:void(0)" id="_main_lnkSemesterList" class="menu-item kt-menu__link ">
                                      <i class="kt-menu__link-bullet fas fa-list-alt"><span></span></i>
                                      <span class="kt-menu__link-text">&nbsp; Semester List</span>
                                    </a>
                                </li> -->

                        <!-- <li class="kt-menu__item" aria-haspopup="true">
                                    <a href="javascript:void(0)" id="_main_lnkLoanPurposes" class="menu-item kt-menu__link ">
                                      <i class="kt-menu__link-bullet fas fa-list-alt"><span></span></i>
                                      <span class="kt-menu__link-text">&nbsp; Loan Purposes</span>
                                    </a>
                                </li> -->

                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon"><i class="fa fa-user-check"></i></span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.User Management">User
                        Management</span>
                    <i class="kt-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="kt-menu__submenu "><span class="kt-menu__arrow"></span>
                    <ul class="kt-menu__subnav">
                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkManageRoles" class="menu-item kt-menu__link">
                                <span class="kt-menu__link-icon"><i class="fa fa-user-secret"></i></span>
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Manage Roles">Manage
                                    Roles</span>
                            </a>
                        </li>

                        <li class="kt-menu__item" aria-haspopup="true">
                            <a href="javascript:void(0)" id="_main_lnkManageUsers" class="menu-item kt-menu__link ">
                                <span class="kt-menu__link-icon"><i class="fa fa-users"></i></span>
                                <span class="kt-menu__link-text trans-text" data-langprop="menus.Manage Users">Manage
                                    Users</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">
                <a id="_main_lnkLogout" href="javascript:;" class="kt-menu__link kt-menu__toggle">
                    <span class="kt-menu__link-icon">
                        <i class="fas fa-sign-out-alt"></i>
                    </span>
                    <span class="kt-menu__link-text trans-text" data-langprop="menus.Log Out">Log Out</span>
                </a>
            </li>
        </ul>
        <!--end::ul.kt-menu__nav-->
    </div>
</div>

<script>
    let __dx = $('#_dms_aside_menus');
    //begin:: translate Aside menus. Translating Aside menus into the user's preferred Langauge. This job can also be done from Backend PHP code
    LocaleManager.translateZone('_dms_aside_menus');
    //main_view.setLangMenu(LocaleManager.lang); //At this point, object  "main_view" is not Yet defined, so main_view.setLangMenu() is now called in init() of  main_view.js instead
    __dx.show();
    //end:: translate Aside menus

    //Begin::Adjust Aside Menu's area for Scrolling behavior 
    //let __dx = $('#_dms_aside_menus');
    __dx.css('height', [(window.innerHeight - 65), 'px'].join(''));
    __dx.css('overflow-y', 'auto');
    let prev_selected_menu = null;
    //end::Adjust Aside Menu's area for Scrolling behavior

    //begin:: When user clicks on each Sude menu item => Hilight the selected menu item
    __dx.on('click', '.menu-item', function (e) {
        if (prev_selected_menu) prev_selected_menu.removeClass('menu-selected');
        $(this).toggleClass('menu-selected');
        prev_selected_menu = $(this);
    });
    //end:: When user clicks on each Sude menu item => Hilight the selected menu item

</script>
