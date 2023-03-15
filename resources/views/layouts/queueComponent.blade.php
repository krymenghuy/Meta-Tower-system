 <style>
    table#_qul_tblTickets>thead th {
        height: 38px;
        padding-bottom: 3px;
        font-weight: normal;
        text-transform: uppercase;
        border-bottom: 1px solid #F4DCAD;
        font-size: 0.8em;
        font-family: 'Khmer OS Content','Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
    }

    .ticket-info-wrapper {
        margin-top: -15px;
        padding: 15px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
    }

    .ticket-patient-info .thumbnail-wrapper {
        height: 160px !important;
    }

    .ticket-patient-info {
        display: flex;
        flex-direction: row;
        padding: 10px;
    }

    .qul-ticket-number {
        display: block;
        padding: 3px;
        color: #0D1905;
        font-size: 1.3em;
        font-weight: bold;
    }

    .qul-arrival-time {
        color: grey;
        font-size: 1em;
        display: block;
        padding: 3px;
    }

    .btn-ticket-tab {
        padding: 5px;
        min-width: 100px;
        border-radius: 15px;
        border: 1.2px solid grey;
        text-align: center;
        margin-right: 10px;
        transform: scale(0.9);
    }

    .btn-ticket-tab--active {
        border: 1.8px solid #5AC612;
        color: #4CB506 !important;
        font-weight: bold;
        transform: scale(1);
    }
 </style>

<div id="_main_queueComponent" class="mobile-padding" style="display:none;padding-top:15px">
    <section class="content">
        <div class="container-fluid">
            <div class="d-flex justify-content-between" style="padding:10px">
                <div class="d-flex col-md-6">
                    <button class="btn btn-outline-primary border border-primary rounded-pill" id="_qul_btnNewAppointment">
                        <i class="fa fa-calendar-check"></i>
                        &nbsp;
                        <span class="trans-text" data-langprop="buttons.Add Ticket">Add Ticket</span>
                    </button>
                    <input id="_qul_search_ticket" style="width:50%;margin-right:10px;margin-left:10px" type="text" class="form-control" placeholder="Search ticket"/>
                    <a id="_qul_btnFindTicket" class="btn btn-outline-success" href="javascript:void(0)">
                        <i class="fas fa-sync-alt"></i>
                    </a>
                </div>

                <div class="d-flex justify-content-end col-md-4">
                    <input data-select="datepicker" class="input-sm form-control" placeholder="Filter date" id="_qul_filter_date" autocomplete="off"/>&nbsp;
                    <select class="input-sm" placeholder="Status" id="_qul_filter_status"></select>
                </div>
            </div>

            <div class="flat-box"
                style="margin:17px;padding:15px;overflow:auto;border-color:#A0DFF3;min-height:350px;">
                <table class="table header-light-blue header-uppercase" id="_qul_tblTickets" style="margin-top:-25px !important;"></table>
            </div>
        </div>
    </section>
</div>

<div id="_qul_dlgConsult" class="modal fade" tabindex="-1" aria-labelledby="consult-title" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
                <h4>Consultation Window</h4>
            </div>
            <div class="modal-body">
                <div class="tab-view" id="_consultTabView">
                    <div class="tab-header">
                        <a href="javascript:void(0)" class="tab-button trans-text" data-viewname="history" data-target="tab_panel_history" data-langprop="patient.HISTORY">History</a>
                        <a href="javascript:void(0)" class="tab-button trans-text" data-langprop="patient.CONSULTATION" data-viewname="consultation" data-target="tab_panel_consult">Consultation</a>
                    </div>

                    <div class="tab-body">
                        <div class="tab-panel border-3d" data-viewname="history" id="tab_panel_history">
                            <div class="row">
                                <div class="col-xl-3 custom-width">
                                    <ul id="_history_menus" class="nav flex-column">
                                        <li class="nav-item history_style_custom d-flex align-items-center">
                                            <span class="history_icon">
                                                <img class="size_of_icons_consult" src="{{ asset('assets/images/icons/medical_history_consult.svg') }}"/>
                                            </span>
                                            <a href="javascript:void(0)" data-viewname="medical-reports" class="nav-link trans-text" data-langprop="history.Medical Reports"></a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="col-xl-9">
                                    <div id="_history_panel" style="width:100%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-panel border-3d" data-viewname="consultation" id="tab_panel_consult">
                            <div class="row">
                                <div class="col-xl-3 custom-width">
                                    <ul id="_consult_menus" class="nav flex-column">
                                        <li class="nav-item consult-style-custom d-flex align-items-center">
                                            <span class="consult-icon">
                                                <img class="size_of_icons_consult" src="{{ asset('assets/images/icons/chief_complaints.svg') }}"/>
                                            </span>
                                            <a href="javascript:void(0)" data-viewname="chief-complaints" class="nav-link trans-text" data-langprop="consult.Chief Complaints"></a>
                                        </li>
                                        <li class="nav-item consult-style-custom d-flex align-items-center">
                                            <span class="consult-icon">
                                                <img class="size_of_icons_consult" src="{{ asset('assets/images/icons/vital_signs.svg') }}"/>
                                            </span>
                                            <a href="javascript:void(0)" data-viewname="vital-signs" class="nav-link trans-text" data-langprop="consult.Vital Signs"></a>
                                        </li>

                                        <li class="nav-item consult-style-custom d-flex align-items-center">
                                            <span class="consult-icon">
                                                <img class="size_of_icons_consult" src="{{ asset('assets/images/icons/medical_history_consult.svg') }}"/>
                                            </span>
                                            <a href="javascript:void(0)" data-viewname="medical-history" class="nav-link trans-text" data-langprop="consult.Medical History"></a>
                                        </li>

                                        <li class="nav-item consult-style-custom d-flex align-items-center">
                                            <span class="consult-icon">
                                                <img class="size_of_icons_consult" src="{{ asset('assets/images/icons/physical_examination.svg') }}"/>
                                            </span>
                                            <a href="javascript:void(0)" data-viewname="physical-examination" class="nav-link trans-text" data-langprop="consult.Physical Examination"></a>
                                        </li>
                                        <li class="nav-item consult-style-custom d-flex align-items-center">
                                            <span class="consult-icon">
                                                <img class="size_of_icons_consult" src="{{ asset('assets/images/icons/laboratory_tests.svg') }}"/>
                                            </span>
                                            <a href="javascript:void(0)" data-viewname="labo-tests" class="nav-link trans-text" data-langprop="consult.Laboratory Tests"></a>
                                        </li>
                                        <li class="nav-item consult-style-custom d-flex align-items-center">
                                            <span class="consult-icon">
                                                <img class="size_of_icons_consult" src="{{ asset('assets/images/icons/diagnosis.svg') }}"/>
                                            </span>
                                            <a href="javascript:void(0)" data-viewname="diagnosis" class="nav-link trans-text" data-langprop="consult.Diagnosis"></a>
                                        </li>
                                        <li class="nav-item consult-style-custom d-flex align-items-center">
                                            <span class="consult-icon">
                                                <img class="size_of_icons_consult" src="{{ asset('assets/images/icons/prescription.svg') }}"/>
                                            </span>
                                            <a href="javascript:void(0)" data-viewname="prescription" class="nav-link trans-text" data-langprop="consult.Prescription"></a>
                                        </li>
                                        <li class="nav-item consult-style-custom d-flex align-items-center">
                                            <span class="consult-icon">
                                                <img class="size_of_icons_consult" src="{{ asset('assets/images/icons/service.svg') }}"/>
                                            </span>
                                            <a href="javascript:void(0)" data-viewname="service" class="nav-link trans-text" data-langprop="consult.Service"></a>
                                        </li>
                                        <li class="nav-item consult-style-custom d-flex align-items-center">
                                            <span class="consult-icon">
                                                <img class="size_of_icons_consult" src="{{ asset('assets/images/icons/recommendations.svg') }}"/>
                                            </span>
                                            <a href="javascript:void(0)" data-viewname="advice" class="nav-link trans-text" data-langprop="consult.Recommendations"></a>
                                        </li>
                                        <li class="nav-item consult-style-custom d-flex align-items-center">
                                            <span class="consult-icon">
                                                <img class="size_of_icons_consult" src="{{ asset('assets/images/icons/medical_report.svg') }}"/>
                                            </span>
                                            <a href="javascript:void(0)" data-viewname="medical-report" class="nav-link trans-text" data-langprop="consult.Medical Report"></a>
                                        </li>
                                        <li class="nav-item consult-style-custom d-flex align-items-center">
                                            <span class="consult-icon">
                                                <img class="size_of_icons_consult" src="{{ asset('assets/images/icons/medical_certificate.svg') }}"/>
                                            </span>
                                            <a href="javascript:void(0)" data-viewname="medical-certificate" class="nav-link trans-text" data-langprop="consult.Medical Certificate"></a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="col-xl-9">
                                    <div id="_consult_panel" style="width:100%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="vs-btn-custom-secondary" type="button" data-dismiss="modal">Cancel</button>
                <button id="_qul_dlgConsult_btnSave" class="vs-btn-custom-primary" type="button">Save</button>
            </div>
        </div>
    </div>
</div>