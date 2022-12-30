 <style>
  table#_pal_tblPatients> thead th{
     font-weight:normal;
     text-transform:uppercase;
     border-bottom:1px solid orange;
     font-size:0.8em; 
  }
  .patient-info-wrapper{
    padding:10px;
    border-left:1.5px dotted red;
    border-right:1.5px dotted red;
  }
</style>

<div id="_main_patientListComponent" style="display:none;">
      <section class="content">
       <div class="container-fluid">
 
          <div class="d-flex justify-content-between" style="padding:10px">
              <div class="d-flex col-md-6">
                  <button class="vs-btn-md vs-btn-md-primary" id="_pal_btnNewPatient"><img class="btn-icon" src="{{asset('assets/images/icons/appointment.png')}}" alt="">&nbsp;<span class="trans-text" data-langprop="buttons.New Patient">New Patient</span></button>
                  <input id="_pal_search" style="width:50%;margin-right:10px;margin-left:10px" type="text" class="form-control" placeholder="Search patient">
                  <a id="_pal_btnSearch" class="vs-btn-round vs-btn-success" href="javascript:void(0)" ><i class="fas fa-sync-alt"></i></a>
              </div>

              <div class="d-flex justify-content-end col-md-6">
                  <!-- <a id="_pal_btnPrint" href="javascript:void(0)"  class="btn btn-sm btn-primary" style="border-radius:10px;"><i class="fa-solid fas fa-print"></i> Print</a>&nbsp; -->
                  <!-- <a id="_pal_btnPDF" href="javascript:void(0)" class="btn btn-sm btn-success" style="border-radius:10px"><i class="fa-solid fas fa-file-pdf"></i> PDF</a>&nbsp; -->
                  <!-- <a id="_pal_btnExcel" href="javascript:void(0)"  class="btn btn-sm btn-default" style="border-radius:10px"><i class="fa-solid fas fa-file-pdf"></i> Excel</a> -->
              </div>
          </div>
          
          <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#EEEA8D;min-height:350px;">
              <table class="table" id="_pal_tblPatients" style="margin-top:-25px !important;"></table>
          </div>
 
      </div>
     </section>
</div>

<!--begin::CODialog -->
<div class="modal fade" id="_pal_dlPatient" tabindex="-1" role="dialog" aria-labelledby="_pal_dlPatient" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
         <h5 class="modal-title​ trans-text" data-langprop="titles.New Appointment" id="_pal_dlPatient_title">New Patient</h5>
         <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row" id="_pal_dlPatient_body">
                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="patient.Paitent ID">ID</span> 
                            <div><input type="text" data-required="0" data-field="code" data-ffield="Patient ID" class="form-control data-input" readOnly></div> 
                        </div>

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="patient.Name">Name</span> 
                            <div><input type="text" data-required="1" data-field="name" data-ffield="Name" class="form-control data-input" id="_pat_name"></div> 
                        </div>

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="patient.Nationality">Nationality</span> 
                            <div><select data-required="1" data-field="nationality_id" data-ffield="Nationality" class="modal-select2 data-input" id="_apt_nat"></select></div> 
                        </div>

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="patient.Date of Birth">Date of Birth</span> 
                            <div><input data-required="1" data-field="date_of_birth" data-ffield="Date of Birth" class="form-control data-input" id="_pat_dob" data-select="datepicker"></div> 
                        </div>

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="patient.Gender">Gender</span> 
                            <div>
                                <select data-field="client_sex" data-ffield="Sex" class="form-control data-input">
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                </select>
                            </div> 
                        </div>

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="patient.Email">Email</span> 
                            <div><input type="text" data-type="email" data-ffield="Email" data-field="client_email" class="form-control data-input" id="_appt_client_email"></div> 
                        </div>

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="patient.Phone Number">Phone Number</span> 
                            <div><input data-type="number" data-ffield="Phone Number" data-field="phone_number" class="form-control data-input"></div> 
                        </div>

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="patient.Contact Channel">Patient Type</span> 
                            <div><select data-type="string" data-ffield="Patient Type" data-field="patient_type" class="modal-select2 data-input" id="_pat_type"></select></div> 
                        </div>

                        <div class="form-group col-lg-12">
                            <span class="simple-label trans-text" data-langprop="patient.Remarks">Remarks</span> 
                            <div><input type="text" data-field="remarks" data-ffield="Remarks" class="form-control data-input" id="_pat_remarks"></div> 
                        </div>
 
                        <div>
                           <span style="margin-left:15px" id="_pal_dlPatient_error" class="error_text"></span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i> <span class="trans-text" data-langprop="buttons.Cancel">Cancel</span></button>
                        <button type="button" class="btn btn-success" id="_pal_dlPatient_btnSave"><i class="fa fa-check"></i><span class="trans-text" data-langprop="buttons.Save"></span></button>
                    </div>
            </div><!--close row-->
        </div><!--close body--> 
     </div><!--close dialog-content--> 
  </div><!--close modal-dialog--> 
<!--end::CODialogDialog -->

 