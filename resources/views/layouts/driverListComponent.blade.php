<style>
  table#_drl_tblDrivers>thead th{
     text-transform:uppercase;
     font-size:0.8em;
     border-bottom:1.2px inset blue;
  }
  table#_drl_tblDrivers>tbody td{
     font-size:0.8em;
     font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
  }
</style>
<div id="_main_driverListComponent" style="display:none;margin:15px;">
          <div style="width:100%;display:flex;flex-direction:row">
              <div class="form-inline" style="width:50%">
                          <a id="_drl_btnNewDriver" href="javascript:;" data-toggle="modal" class="btn btn-primary">
                                <i class="la la-plus"></i>
                                <span class="kt-hidden-mobile">New Driver</span>
                          </a>
                            <div style="width:15px;"></div>
                            <select id="_drl_filter_driver_shift" class="form-control _drl_filter_field"></select> &nbsp;
                            &nbsp;
                            <select id="_drl_filter_driver_status" class="form-control _drl_filter_field"></select>&nbsp;
              </div>
               <div style="width:50%">
                      <div class="form-inline" style="float:right">
                            <input id="_drl_search_driver" type="text" class="form-control" placeholder="name, phone">
                            &nbsp;<button id="_drl_btnSearch"  type="button" class="btn btn-outline-success"><i class="fa fa-sync-alt"></i></button> 
                             <div style="width:25px"></div>
                            <div class="form-inline">
                              <button id="_drl_btnPrint" role="button" class="btn btn-success"><i class="fas fa-print"></i> Print</button> &nbsp;
                              <button id="_drl_btnPDF" role="button" class="btn btn-primary"><i class="fas fa-file-pdf"></i> PDF</button>&nbsp;
                              <button style="display:none" id="_drl_btnExcel" role="button" class="btn btn-default"><i class="fas fa-file-excel"></i> Excel</button>
                          </div>
                      </div> 
               </div>
           </div>

        <div class="border-style1" style="padding:10px;margin-top:10px">
                    <table class="table" id="_drl_tblDrivers"> <tbody id="_drl_tblDrivers_body"></tbody></table>
        </div>
</div>
 
 <!--begin::DriverDialog-->
 <div class="modal fade" id="_drl_dlgDriver" tabindex="-1" role="dialog" aria-labelledby="_drl_dlgDriverTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_drl_dlgDriverTitle">New Driver</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="_drl_dlgDriver_body">
          <div class="row">
             <div class="col-lg-6">
               <label for="" class="col-form-label">Driver ID</label>
               <input type="text" class="form-control data-input" data-field="code" placeholder="AUTO" readOnly>
             </div>
              <div class="col-lg-6">
                <label for="" class="col-form-label">National ID</label>
                <input type="text" class="form-control data-input" data-field="national_id">  
               </div>
          </div>
           
          <div class="row">
             <div class="col-lg-6">
               <label for="" class="col-form-label">Name</label>
               <input type="text" class="form-control data-input" data-field="name">
             </div>
              <div class="col-lg-6">
                <label for="" class="col-form-label">Name (khmer)</label>
                <input type="text" class="form-control data-input" data-field="name_kh">  
               </div>
          </div>

          <div class="row">
             <div class="col-lg-3">
                <label class="col-form-label">Date Of Birth</label>
                <input class="form-control data-input" data-field="date_of_birth" data-select="datepicker">
             </div>
             <div class="col-lg-3">
                    <label for="" class="col-form-label">Sex</label>
                    <select class="form-control data-input" data-field="sex">
                      <option value=""></option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
             </div>
             <div class="col-lg-3">
                <label for="" class="col-form-label">Emp Type</label>
                <select class="form-control data-input" id="_drl_driver_emptype" data-field="emp_type"></select>
             </div>
             <div class="col-lg-3">
                 <label for="" class="col-form-label">Shift</label>
                <select class="form-control data-input" id="_drl_driver_shift" data-field="shift">
                   <option value="FD">Full Day</option>
                   <option value="HD">Half Day</option>
                </select>
             </div>
           </div>

           <div class="row">
            <div class="col-lg-6">
                <label class="col-form-label">Phone Number</label>
                <input class="form-control data-input" type="text" data-field="phone_number"/>
                </div>  
                <div class="col-lg-6">
                <label class="col-form-label">Email</label>
                <input type="email" class="form-control data-input" data-field="email">
                </div>
          </div> 
          
          <div class="row">
              <div class="col-lg-12">
              <label class="col-form-label">Address</label>
              <textarea class="form-control data-input" data-field="address"></textarea>
              </div>
          </div>

          <div class="row" style="display:none">
           <div class="col-lg-6">
                <label class="col-form-label">Contact Person Name</label>
                <input class="form-control data-input" data-field="cp_name">
             </div>
            <div class="col-lg-6">
                <label class="col-form-label">Contact Person</label>
                  <input class="form-control data-input" data-field="cp_phone_number"/>
            </div>
          </div> 

          <div class="row">
           <div class="col-lg-6">
                <label class="col-form-label">Vehicle Type</label>
                <select id="_drl_driver_vehicletype" class="form-control data-input" data-field="vehicle_type">
                </select>
             </div>
            <div class="col-lg-6">
                 <label class="col-form-label">Vehicle Number</label>
                  <input type="text" class="form-control data-input" data-field="vehicle_number">
            </div>
          </div> 

          <div class="row">
             <div class="col-lg-6">
                   <label class="col-form-label">Default Warehouse</label>
                   <select id="_drl_driver_default_warehouse" class="form-control data-input" data-field="default_warehouse_id">
                  </select>
             </div>
            <div class="col-lg-6" style="display:none">
               <label class="col-form-label">Driver Status</label>
                <select id="_drl_driver_status" class="form-control data-input" data-field="status_code"></select>
            </div>
          </div> 

      </div>
      <div class="modal-footer">
         <span id="_drl_driver_error" class="error_text"></span> 
        <button type="button" class="btn btn-warning" data-dismiss="modal"><i class="fa fa-times" style="color:red"></i> Cancel</button>
         <button type="button" class="btn btn-primary" id="_drl_driver_btnSave"><i class="fa fa-check" style="color:green"></i> Save</button>
      </div>
    </div>
  </div>
</div>
 <!--end::DriverDialog-->



 <!--begin::DriverCommissionDialog DriverCompDialog -->
 <div class="modal fade" id="_drl_dlgDriverComp" tabindex="-1" role="dialog" aria-labelledby="_drl_dlgDriverCompTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="_drl_dlgDriverCompTitle">Modify Driver Commissions</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      <div class="modal-body" id="_drl_dlgDriverComp_body">
          <div class="row">
             <div class="col-lg-6">
               <label for="" class="col-form-label">Driver ID</label>
               <input id="_drl_comm_driver_code" type="text" class="form-control data-input" data-field="code" placeholder="AUTO" readOnly>
             </div>
              <div class="col-lg-6">
                <label for="" class="col-form-label">Driver Name</label>
                <input id="_drl_comm_driver_name" type="text" class="form-control data-input" data-field="driver_name" readOnly>  
               </div>
          </div>
        
          <div class="row">
             <div class="col-lg-3">
                 <label class="col-form-label">Employment Type</label>
                 <select id="_drl_comm_emp_type" class="form-control data-input" data-field="emp_type">
                    <option value="full time">Full Time</option>
                    <option value="part time">Part Time</option>
                 </select>
             </div>
             <div class="col-lg-3">
                 <label class="col-form-label">Work Shift</label>
                 <select id="_drl_comm_shift" class="form-control data-input" data-field="shift">
                    <option value="FD">Full Day</option>
                    <option value="HD">Half Day</option>
                    <option value="NA">NA</option>
                 </select>
             </div>
              <div class="col-lg-6">
                 <label class="col-form-label">Monthly Salary</label>
                 <input id="_drl_comm_salary" type="number" class="form-control data-input" data-field="salary">
               </div>
          </div>
          <span class="form-heading1" style="display:block;margin-top:15px;">Normal Delivery</span>
          <div class="div-line" style="border-color:red;margin-top:5px;margin-bottom:15px;width:70%"></div>
          <div class="row">
               <div class="col-lg-6">
                  <label for="" class="col-form-label">Pickup Commission (USD)</label>
                  <input id="commission_pickup_normal" type="number" class="form-control data-input" data-field="comm_pickup_normal">
              </div>
                <div class="col-lg-6">
                 <label for="" class="col-form-label">Delivery Commission (UDS)</label>
                  <input id="commission_delivery_normal" type="number" class="form-control data-input" data-field="comm_delivery_normal">  
               </div>
          </div>

          <span class="form-heading1" style="display:block;margin-top:15px;">Fast Delivery</span>
          <div class="div-line" style="border-color:green;margin-top:5px;margin-bottom:15px;width:70%"></div>
          <div class="row">
             <div class="col-lg-6">
               <label for="" class="col-form-label">Pickup Commission (USD)</label>
               <input id="commission_pickup_fast" type="number" class="form-control data-input" data-field="comm_pickup_fast">
             </div>
              <div class="col-lg-6">
                <label for="" class="col-form-label">Delivery Commission (USD)</label>
                <input id="commission_delivery_fast" type="number" class="form-control data-input" data-field="comm_delivery_fast">  
               </div>
          </div>
        </div>

      <div class="modal-footer">
         <span id="_drl_driver_comm__error" class="error_text"></span> 
         <button type="button" class="btn btn-warning" data-dismiss="modal"><i class="fa fa-times" style="color:red"></i> Close</button>
         <button type="button" class="btn btn-success" id="_drl_comm_btnSave"><i class="fa fa-check" style="color:green"></i> Save</button>
      </div>
    </div>
  </div>
</div>
 <!--end::DriverCommissionDialog-->

<script async src="{{ asset('js/DriverListComponent.js') }}"></script>