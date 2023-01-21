 <style>
     table#_apl_tblAppts>thead th {
         height: 38px;
         padding-bottom: 3px;
         font-weight: normal;
         text-transform: uppercase;
         border-bottom: 1px solid #F4DCAD;
         font-size: 0.8em;
     }

     .appt-info-wrapper {
         margin-top: -15px;
         padding: 15px;
         border-radius: 5px;
     }

     .dt-icon {
         height: 25px;
         width: 25px;
         opacity: 0.8;
     }

     .btn-icon {
         height: 25px;
         width: 25px;
         opacity: 0.8;
     }

     .thumbnail-wrapper {
         padding: 10px;
         margin-right: 15px;
         border-radius: 5px;
         overflow: hidden;
     }

     .profile-thumbnail {
         width: 150px;
         height: 150px;
     }

     .detail-header-text {
         display: block;
         padding: 3px 10px;
         font-weight: bold;
         font-size: 1.2em;
     }

     .detail-item {
         width: 100%;
         display: flex;
         flex-direction: row;
     }

     .detail-item .detail-item-label {
         width: 80px;
         font-weight: bold;
         font-size: 1em;
         padding: 3px;
     }

     .detail-item-empty {
         color: grey;
     }

     .detail-item .detail-item-value {
         font-weight: normal;
         font-size: 1em;
         padding: 3px;
     }

     .detail-item .detail-item-value::before {
         content: " : ";
     }

     .chief-complaint-list {
         display: block;
     }

     .chief-complaint-text {
         padding: 3px;
         display: block;
         font-size: 1.1em;
         color: #000;
     }

     ul#_appt_cc_list {
         margin-bottom: -25px;
     }

     ul#_appt_cc_list li,
     .apl-complaint-list li {
         font-size: 1em;
         padding: 3px;
         font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
     }

     .vital-signs,
     .medical-condition-panel {
         padding: 10px;
         border: 1.1px dotted orange;
         border-radius: 5px;
     }

     .service-reg-panel {
         padding: 5px;
         border: 1.1px dotted #E5E8E8;
         border-radius: 5px;
     }

    .medical-condition-panel {
        border-color: red;
    }

    .vital-signs input {
        outline: none !important;
        border: none;
        border-radius: 0;
        border-bottom: 1.1px solid grey;
    }

    .vital-signs input:focus {
         border-width: 2px;
    }

    #_main_appointmentListComponent .btn-outline-success,
    #_main_appointmentListComponent .btn-outline-primary,
    #_main_appointmentListComponent .btn-outline-warning {
        border-radius: 15px;
    }
 </style>

 <div id="_main_appointmentListComponent" style="display:none;padding-top:15px">
     <section class="content">
         <div class="container-fluid">
             <div class="d-flex justify-content-between" style="padding:10px">
                 <div class="d-flex col-md-6">
                    <button class="btn btn-outline-primary border border-primary rounded-pill" id="_apl_btnNewAppointment">
                        <i class="fa fa-calendar-check"></i>
                        &nbsp;<span class="trans-text" data-langprop="buttons.New Appointment">New Appointment</span>
                    </button>
                    <input id="_apl_search_appt" style="width:50%;margin-right:10px;margin-left:10px" type="text" class="form-control" placeholder="Search appointment">
                    <a id="_apl_btnFindAppt" class="btn btn-sm border border-rounded" href="javascript:void(0)">
                        <i class="fas fa-sync-alt mt-2"></i>
                    </a>
                 </div>

                 <div class="d-flex justify-content-end col-md-4">
                     <input class="input-sm form-control" data-select="datepicker" placeholder="Filter date" id="_apl_filter_date"/>&nbsp;
                     <select class="input-sm combo-box combo-box-strong" placeholder="Status" id="_apl_filter_status"></select>
                     <!-- <a id="_apl_btnPrint" href="javascript:void(0)"  class="btn btn-sm btn-primary" style="border-radius:10px;"><i class="fa-solid fas fa-print"></i> Print</a>&nbsp; -->
                     <!-- <a id="_apl_btnPDF" href="javascript:void(0)" class="btn btn-sm btn-success" style="border-radius:10px"><i class="fa-solid fas fa-file-pdf"></i> PDF</a>&nbsp; -->
                     <!-- <a id="_apl_btnExcel" href="javascript:void(0)"  class="btn btn-sm btn-default" style="border-radius:10px"><i class="fa-solid fas fa-file-pdf"></i> Excel</a> -->
                 </div>
             </div>

             <div class="flat-box"
                 style="margin:17px;padding:15px;overflow:auto;border-color:#A0DFF3;min-height:350px;">
                 <table class="table header-light-blue header-uppercase" id="_apl_tblAppts" style="margin-top:-25px !important;"></table>
             </div>
         </div>
     </section>
 </div>

 <!--begin::AppointmentDialog -->
 <div class="modal fade" id="_apl_dlgAppt" tabindex="-1" role="dialog" aria-labelledby="_apl_dlgAppt" aria-hidden="true">
     <div class="modal-dialog vs-modal-dialog modal-lg" role="dialog">
         <div class="modal-content">
             <div class="modal-header">
                 <h5 class="modal-title​ trans-text" data-langprop="titles.New Appointment" id="_apl_dlgAppt_title">New Appointment</h5>
             </div>
             <div class="modal-body">
                 <div class="row" id="_apl_dlgAppt_body">
                     <div class="form-group col-lg-6">
                         <div class="input-group">
                             <input id="_appt_search_client" type="text" class="form-control" placeholder="Patient ID or phone"/>
                             <div class="input-group-append">
                                <a id="_appt_btnFindClient" href="javascript:void(0)" class="btn btn-sm btn-outline-success">
                                    <i class="fa fa-search"></i>
                                </a>
                            </div>
                         </div>
                     </div>
                     <div class="form-group col-lg-6">
                     </div>

                     <div class="form-group col-lg-6">
                         <span class="simple-label trans-text" data-langprop="appointment.Client Name">Client
                             Name</span>
                         <div><input type="text" data-required="1" data-field="client_name" data-ffield="Client Name"
                                 class="form-control data-input" id="_appt_client_name"></div>
                     </div>
                     <div class="form-group col-lg-6">
                         <span class="simple-label trans-text" data-langprop="appointment.Gender">Gender</span>
                         <div>
                             <select data-field="client_sex" data-ffield="Sex" class="modal-select2 data-input"
                                 id="_appt_client_sex">
                                 <option value="M">Male</option>
                                 <option value="F">Female</option>
                                 <option value="O">Other</option>
                             </select>
                         </div>
                     </div>

                     <div class="form-group col-lg-6">
                         <span class="simple-label trans-text" data-langprop="appointment.Client Phone">Phone
                             Number</span>
                         <div><input type="text" data-required="0" data-field="client_phone_number"
                                 data-ffield="Client Phone" class="form-control data-input" id="_appt_client_phone">
                         </div>
                     </div>

                     <div class="form-group col-lg-6">
                         <span class="simple-label trans-text" data-langprop="appointment.Patient ID">Patient ID</span>
                         <div><input type="text" data-required="0" data-field="patient_code" data-ffield="Patient ID"
                                 class="form-control data-input" id="_appt_client_code" readOnly></div>
                     </div>

                     <div class="form-group col-lg-3">
                         <span class="simple-label trans-text" data-langprop="appointment.Email">Email</span>
                         <div><input type="text" data-type="email" data-ffield="Email" data-field="client_email"
                                 class="form-control data-input" id="_appt_client_email"></div>
                     </div>

                     <div class="form-group col-lg-3">
                         <span class="simple-label trans-text" data-langprop="appointment.Contact Channel">Contact
                             Channel</span>
                         <div><select data-type="number" data-ffield="Contact Channel" data-field="channel_id"
                                 class="modal-select2 data-input" id="_appt_contact_channel"></select></div>
                     </div>

                     <div class="form-group col-lg-3">
                         <span class="simple-label trans-text" data-langprop="appointment.Arrival Date">Date</span>
                         <div><input type="text" data-required="1" data-field="arrival_date" data-ffield="Arrival Date"
                                 class="form-control data-input" id="_appt_arrival_date" data-select="datepicker"></div>
                     </div>

                     <div class="form-group col-lg-3">
                         <span class="simple-label trans-text" data-langprop="appointment.Time">Time</span>
                         <div><input type="text" data-required="1" data-field="arrival_time" data-ffield="Arrival Time"
                                 class="form-control data-input" id="_appt_arrival_time" data-select="timepicker"></div>
                     </div>

                     <div class="form-group col-lg-6">
                         <span class="simple-label trans-text" data-langprop="appointment.Consultant">Consultant</span>
                         <div><select data-type="number" data-ffield="Consultant" data-field="consultant_id"
                                 class="modal-select2 data-input" id="_appt_consultant"></select></div>
                     </div>

                     <div class="form-group col-lg-3">
                         <span class="simple-label trans-text" data-langprop="appointment.Priority">Priority</span>
                         <div>
                             <select data-ffield="Appointment priority" data-field="priority"
                                 class="modal-select2 data-input">
                                 <option value="Normal">Normal</option>
                                 <option value="Urgent">Urgent</option>
                             </select>
                         </div>
                     </div>

                     <div class="form-group col-lg-3">
                         <span class="simple-label trans-text" data-langprop="appointment.Schedule Type">Schedule
                             Type</span>
                         <div>
                             <select data-ffield="Schedule type" data-field="schedule_type"
                                 class="modal-select2 data-input">
                                 <option value="On demand">On Demand</option>
                                 <option value="Followup">Followup</option>
                             </select>
                         </div>
                     </div>

                     <div class="form-group col-lg-12" style="display:none">
                         <span class="simple-label trans-text" data-langprop="appointment.Remarks">Remarks</span>
                         <div><input type="text" data-field="notes" data-ffield="Remarks"
                                 class="form-control data-input" id="_appt_notes"></div>
                     </div>

                     <div class="form-group col-lg-12 cc-input">
                         <span class="simple-label">
                             <span class="trans-text" data-langprop="appointment.Chief Complaints">Chief
                                 Complaints</span>&nbsp;
                             <a href="javascript:void(0)" id="appt_lnkAddChiefComplaint"><i class="fa fa-plus-circle"
                                     style="color:#14B1D1;font-size:1.2em"></i></a>
                         </span>
                         <div><select data-field="chief_complaint_code" data-ffield="Chief Complaint"
                                 class="modal-select2 data-input" id="_appt_chief_complaint"></select></div>
                     </div>
                     <div class="form-group col-lg-12 cc-input">
                         <div style="padding:10px">
                             <ul id="_appt_cc_list" style="list-style:none">
                             </ul>
                         </div>
                     </div>

                     <div class="dialog-error" style="right:15px">
                         <i class="fa fa-exclamation-triangle" style="color:red"></i>&nbsp;<span
                             style="margin-left:15px" id="_apl_dlgAppt_error" class="dialog-error-text"></span>
                     </div>
                 </div>
                 <!--Close row-->
             </div>
             <!--close body-->
             <div class="modal-footer">
                 <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i> <span
                         class="trans-text" data-langprop="buttons.Cancel">Cancel</span></button>
                 <button type="button" class="btn btn-primary" id="_apl_dlgAppt_btnSave"><i class="fa fa-save"></i><span
                         class="trans-text" data-langprop="buttons.Save">Save</span></button>
             </div>
         </div>
         <!--close Content-->
     </div>
 </div>
 <!--end::AppointmentDialog -->

 <!--begin::PatientDialog -->
 <div class="modal fade" id="_apl_dlgPatient" tabindex="-1" role="dialog" aria-labelledby="_apl_dlgPatient" aria-hidden="true">
     <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
         <div class="modal-content">
             <div class="modal-header">
                 <h5 class="modal-title trans-text " data-langprop="titles.Register Patient" id="_apl_dlgAppt_title">Register Patient</h5>
             </div>
             <div class="modal-body">
                 <div class="row" id="_apl_dlgPatient_body">
                     <div class="form-group col-lg-6">
                         <span class="simple-label trans-text" data-langprop="patient.Name">Name</span>
                         <div><input type="text" data-required="1" data-field="name" data-ffield="Patient Name" class="form-control data-input-reg"></div>
                     </div>

                     <div class="form-group col-lg-6">
                         <span class="simple-label trans-text" data-langprop="patient.Gender">Gender</span>
                         <div>
                             <select data-field="sex" data-ffield="Sex" class="modal-select2 data-input-reg">
                                 <option value="M">Male</option>
                                 <option value="F">Female</option>
                                 <option value="O">Other</option>
                             </select>
                         </div>
                     </div>

                     <div class="form-group col-lg-6">
                         <span class="simple-label trans-text" data-langprop="patient.Nationality">Nationality</span>
                         <div><select data-required="1" data-field="nationality_id" data-ffield="Nationality" class="modal-select2 data-input-reg" id="_pat_nationality"></select></div>
                     </div>

                     <div class="form-group col-lg-3">
                         <span class="simple-label trans-text" data-langprop="patient.Date of birth">Date of
                             birth</span>
                         <div><input data-required="1" data-field="date_of_birth" data-ffield="Date of birth" class="form-control data-input-reg" data-select="datepicker" id="_pat_dob"></div>
                     </div>

                     <div class="form-group col-lg-3">
                         <span class="simple-label"><span class="trans-text"
                                 data-langprop="patient.Age">Age</span>&nbsp;<span style="color:orange"
                                 id="_pat_age_unit"></span></span>
                         <div><input type="number" data-required="0" data-field="age" data-ffield="Patient Age"
                                 class="form-control data-input-reg" id="_pat_age"></div>
                     </div>
                     <div class="form-group col-lg-6">
                         <span class="simple-label trans-text" data-langprop="patient.Phone number">Phone Number</span>
                         <div><input type="number" data-required="1" data-field="phone_number"
                                 data-ffield="Phone number" class="form-control data-input-reg"></div>
                     </div>

                     <div class="form-group col-lg-6">
                         <span class="simple-label trans-text" data-langprop="patient.Email">Email</span>
                         <div><input type="text" data-type="email" data-ffield="Email" data-field="email"
                                 class="form-control data-input-reg"></div>
                     </div>


                     <div class="form-group col-lg-12" style="display:none">
                         <span class="simple-label trans-text" data-langprop="patient.Remarks">Remarks</span>
                         <div><input type="text" data-field="notes" data-ffield="Remarks"
                                 class="form-control data-input-reg"></div>
                     </div>

                     <div class="form-group col-lg-12">
                         <span style="margin-bottom:3px;display:block" class="header-text text-bold trans-text"
                             data-langprop="patient.Medical Conditions">Medical Conditions</span>
                         <div class="medical-condition-panel">
                             <div class="row" id="med_con_panel">
                             </div>
                         </div>
                     </div>

                     <div class="form-group col-lg-12 reg-only">
                         <span style="margin-bottom:3px;display:block" class="header-text text-bold trans-text"
                             data-langprop="patient.Vital Signs">Vital signs</span>
                         <div class="vital-signs">
                             <div class="row" id="pat_vital_signs">
                             </div>
                         </div>
                     </div>

                     <div class="form-group col-lg-12 reg-only">
                         <span style="margin-bottom:3px;display:block" class="header-text text-bold trans-text"
                             data-langprop="patient.Service Registration">Service Registration</span>
                         <div class="service-reg-panel">
                             <div class="row">
                                 <div class="form-group col-lg-6">
                                     <span class="simple-label trans-text"
                                         data-langprop="patient.Service Department">Service Department</span>
                                     <div><select data-required="0" data-field="department_id"
                                             data-ffield="Service Department" class="modal-select2 data-input"
                                             id="_pat_department" placeholder="Service department"></select></div>
                                 </div>
                                 <div class="form-group col-lg-6">
                                     <span class="simple-label trans-text" data-langprop="patient.Doctor Name">Doctor
                                         Name</span>
                                     <div><select data-required="0" data-field="consultant_id" data-ffield="Consultant"
                                             class="modal-select2 data-input" id="_pat_consultant"></select></div>
                                 </div>
                             </div>

                         </div>
                     </div>

                     <div class="dialog-error" style="right:15px">
                         <i class="fa fa-exclamation-triangle" style="color:red"></i>&nbsp;<span
                             style="margin-left:15px" id="_apl_dlgPatient_error" class="dialog-error-text"></span>
                     </div>
                 </div>
                 <!--close row-->
             </div>
             <!--close body-->
             <div class="modal-footer">
                 <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i> <span
                         class="trans-text" data-langprop="buttons.Cancel">Cancel</span></button>
                 <button type="button" class="btn btn-primary" id="_apl_dlgPatient_btnSave"><i
                         class="fa fa-register"></i><span class="trans-text"
                         data-langprop="buttons.Save">Save</span></button>
                 <button type="button" class="btn btn-success" id="_apl_dlgPatient_btnSaveAndQueue"><i
                         class="fa fa-queue"></i><span class="trans-text" data-langprop="buttons.Save and Queue">Save &
                         Queue</span></button>
             </div>
         </div>
         <!--close content-->
     </div>
 </div>
 <!--end::PatientDialog -->

 <!--begin::QServiceDialog -->
 <div class="modal fade" id="_qsd_dlgQService" tabindex="-1" role="dialog" aria-labelledby="_qsd_dlgQService_title"
     aria-hidden="true">
     <div class="modal-dialog modal-lg" role="dialog">
         <div class="modal-content">
             <div class="modal-header">
                 <h5 class="modal-title​ trans-text" data-langprop="titles.Choose Service Department"
                     id="_qsd_dlgQService_title">Choose Service Department</h5>
                 <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
             </div>
             <div class="modal-body">
                 <div class="row" id="_qsd_dlgQService_body">
                     <div class="form-group col-lg-6">
                         <span class="simple-label trans-text" data-langprop="appointment.Service Department">Service
                             Department</span>
                         <div>
                             <select data-required="1" data-field="department_id" data-ffield="Department"
                                 class="modal-select2 data-input" id="_qsd_department"></select>
                         </div>
                     </div>
                     <div class="form-group col-lg-6">
                         <span class="simple-label trans-text" data-langprop="appointment.Consultant">Consultant</span>
                         <div>
                             <select data-field="consultant_id" data-ffield="Consultant"
                                 class="modal-select2 data-input" id="_qsd_consultant"></select>
                         </div>
                     </div>

                     <div class="form-group col-lg-3" style="display:none">
                         <span class="simple-label trans-text" data-langprop="appointment.Priority">Priority</span>
                         <div>
                             <select data-required="0" data-ffield="Service priority" data-field="priority"
                                 class="modal-select2 data-input">
                                 <option value="Normal">Normal</option>
                                 <option value="Urgent">Urgent</option>
                             </select>
                         </div>
                     </div>

                     <div class="form-group col-lg-3" style="display:none">
                         <span class="simple-label trans-text" data-langprop="appointment.Schedule Type">Schedule
                             Type</span>
                         <div>
                             <select data-required="0" data-ffield="Schedule type" data-field="schedule_type"
                                 class="modal-select2 data-input">
                                 <option value="On demand">On Demand</option>
                                 <option value="Followup">Followup</option>
                             </select>
                         </div>
                     </div>

                     <div class="form-group col-lg-12">
                         <span class="simple-label trans-text" data-langprop="appointment.Remarks">Remarks</span>
                         <div><input type="text" data-field="notes" data-ffield="Remarks"
                                 class="form-control data-input" id="_qsd_remarks"></div>
                     </div>

                     <div class="form-group col-lg-12 cc-input" style="display:none">
                         <span class="simple-label">
                             <span class="trans-text" data-langprop="appointment.Chief Complaints">Chief
                                 Complaints</span>&nbsp;
                             <a href="javascript:void(0)" id="_qsd_lnkAddChiefComplaint"><i class="fa fa-plus-circle"
                                     style="color:#14B1D1;font-size:1.2em"></i></a>
                         </span>
                         <div><select data-field="chief_complaint_code" data-ffield="Chief Complaint"
                                 class="modal-select2 data-input" id="_qsd_chief_complaint"></select></div>
                     </div>
                     <div class="form-group col-lg-12 cc-input">
                         <div style="padding:10px">
                             <ul id="_qsd_cc_list" style="list-style:none">
                             </ul>
                         </div>
                     </div>

                     <div class="dialog-error" style="right:15px">
                         <i class="fa fa-exclamation-triangle" style="color:red"></i>&nbsp;<span
                             style="margin-left:15px" id="_apl_dlgPatient_error" class="dialog-error-text"></span>
                     </div>

                 </div>
                 <!--Close row-->
             </div>
             <!--close body-->
             <div class="modal-footer">
                 <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i> <span
                         class="trans-text" data-langprop="buttons.Cancel">Cancel</span></button>
                 <button type="button" class="btn btn-primary" id="_qsd_dlgQService_btnOK"><i
                         class="fa fa-save"></i><span class="trans-text"
                         data-langprop="buttons.Save">Save</span></button>
             </div>
         </div>
         <!--close Content-->
     </div>
 </div>
 <!--end::QServiceDialog -->
 