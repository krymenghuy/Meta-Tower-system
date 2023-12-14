<div id="_main_driverListComponent" style="display:none;padding:15px">
    <div class="d-flex justify-content-between bg-white rounded-3 p-3 border">
        <div class="d-flex gap-2">
            <button id="_drl_btnNewDriver" data-toggle="modal" class="btn btn-primary text-nowrap">
                <i class="la la-plus"></i>
                <span class="kt-hidden-mobile text-nowrap">New Driver</span>
            </button>
            <div class="min-width-select">
                <select id="_drl_filter_driver_shift" class="modal-select2 _drl_filter_field"></select>
            </div>
            <div class="min-width-select">
                <select id="_drl_filter_driver_status" class="modal-select2 _drl_filter_field"></select>
            </div>
        </div>
        <div class="d-flex gap-2">
            <div class="input-group flex-nowrap">
                <input id="_drl_search_driver" type="text" class="form-control height" placeholder="name, phone">
                <div id="_drl_btnSearch" class="input-group-text" role="button">
                    <i class="fa fa-sync-alt fs-5 text-success"></i>
                </div>
            </div>
            <div class="d-flex gap-2">
                <button id="_drl_btnPrint" type="button" class="btn btn-success text-nowrap">
                    <i class="fas fa-print fs-5"></i>
                    <span>Print</span>
                </button>
                <button id="_drl_btnPDF" type="button" class="btn btn-primary text-nowrap">
                    <i class="fas fa-file-pdf fs-5"></i>
                    <span>PDF</span>
                </button>
                <button style="display:none" id="_drl_btnExcel" type="button" class="btn btn-default text-nowrap">
                    <i class="fas fa-file-excel fs-5"></i>
                    <span>Excel</span>
                </button>
            </div>
        </div>
    </div>
    <div class=" p-3 mt-3 bg-white rounded-3 border-lg rounded-3 shadow bg-white">
        <div id="_drl_driver_list" class="w-100 table-responsive table-responsive-hover"></div>
    </div>
</div>

<div class="modal fade" id="_drl_dlgDriver" tabindex="-1" role="dialog" aria-labelledby="_drl_dlgDriverTitle" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog modal-lg" role="dialog">
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
                        <label for="code" class="col-form-label">Driver ID</label>
                        <input type="text" class="form-control data-input" data-field="code" placeholder="AUTO" readonly>
                    </div>
                    <div class="col-lg-6">
                        <label for="national_id" class="col-form-label">National ID</label>
                        <input type="text" class="form-control data-input" data-field="national_id">
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <label for="name" class="col-form-label">Name</label>
                        <input type="text" class="form-control data-input" data-field="name">
                    </div>
                    <div class="col-lg-6">
                        <label for="name_kh" class="col-form-label">Name (khmer)</label>
                        <input type="text" class="form-control data-input" data-field="name_kh">
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-lg-3">
                        <label class="col-form-label">Date Of Birth</label>
                        <div>
                            <input class="form-control data-input" data-field="date_of_birth" data-select="datepicker">
                        </div>
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="sex" class="col-form-label">Sex</label>
                        <div class="">
                            <select class="modal-select2 data-input" data-field="sex">
                                <option value=""></option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="emp_type" class="col-form-label">Emp Type</label>
                        <div>
                            <select class="modal-select2 data-input" id="_drl_driver_emptype" data-field="emp_type"></select>
                        </div>
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="shift" class="col-form-label">Shift</label>
                        <div class="">
                            <select class="modal-select2 data-input" id="_drl_driver_shift" data-field="shift">
                                <option value="FD">Full Day</option>
                                <option value="HD">Half Day</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-lg-6">
                        <label for="phone_number" class="col-form-label">Phone Number</label>
                        <div><input class="form-control data-input" type="text" data-field="phone_number" /></div>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="email" class="col-form-label">Email</label>
                       <div> <input type="email" class="form-control data-input" data-field="email"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-lg-12">
                        <label for="address" class="col-form-label">Address</label>
                        <textarea class="form-control data-input" data-field="address"></textarea>
                    </div>
                </div>
                <div class="row" style="display:none">
                    <div class="col-lg-6">
                        <label for="cp_name" class="col-form-label">Contact Person Name</label>
                        <input class="form-control data-input" data-field="cp_name">
                    </div>
                    <div class="col-lg-6">
                        <label for="cp_phone_number" class="col-form-label">Contact Person</label>
                        <input class="form-control data-input" data-field="cp_phone_number" />
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-lg-6">
                        <label for="vehicle_type" class="col-form-label">Vehicle Type</label>
                        <div class="min-width-select max-width-select">
                            <select id="_drl_driver_vehicletype" class="modal-select2 data-input" data-field="vehicle_type"></select>
                        </div>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="vehicle_number" class="col-form-label">Vehicle Number</label>
                        <input type="text" class="form-control data-input" data-field="vehicle_number">
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-lg-6">
                        <label for="default_warehouse_id" class="col-form-label">Default Warehouse</label>
                        <select id="_drl_driver_default_warehouse" class="form-control data-input" data-field="default_warehouse_id"></select>
                    </div>
                    <div class="col-lg-6" style="display:none">
                        <label for="status_code" class="col-form-label">Driver Status</label>
                        <div class="min-width-select max-width-select">
                            <select id="_drl_driver_status" class="modal-select2 data-input" data-field="status_code"></select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <span id="_drl_driver_error" class="error_text"></span>
                <button type="button" class="btn btn-warning" data-dismiss="modal">
                    <i class="fa fa-times text-danger fs-5"></i>
                    <span>Cancel</span>
                </button>
                <button type="button" class="btn btn-primary" id="_drl_driver_btnSave">
                    <i class="fa fa-check text-white fs-5"></i>
                    <span>Save</span>
                </button>
            </div>
        </div>
    </div>
</div>

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
                        <label for="code" class="col-form-label">Driver ID</label>
                        <input id="_drl_comm_driver_code" type="text" class="form-control data-input" data-field="code" placeholder="AUTO" readonly>
                    </div>
                    <div class="col-lg-6">
                        <label for="driver_name" class="col-form-label">Driver Name</label>
                        <input id="_drl_comm_driver_name" type="text" class="form-control data-input" data-field="driver_name" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3">
                        <label for="emp_type" class="col-form-label">Employment Type</label>
                        <div class="min-width-select max-width-select">
                            <select id="_drl_comm_emp_type" class="modal-select2 data-input" data-field="emp_type">
                                <option value="full time">Full Time</option>
                                <option value="part time">Part Time</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <label for="shift" class="col-form-label">Work Shift</label>
                        <div class="min-width-select max-width-select">
                            <select id="_drl_comm_shift" class="modal-select2 data-input" data-field="shift">
                                <option value="FD">Full Day</option>
                                <option value="HD">Half Day</option>
                                <option value="NA">NA</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <label for="salary" class="col-form-label">Monthly Salary</label>
                        <input id="_drl_comm_salary" type="number" class="form-control data-input" data-field="salary">
                    </div>
                </div>
                <span class="form-heading1" style="display:block;margin-top:15px;">Normal Delivery</span>
                <div class="div-line" style="border-color:red;margin-top:5px;margin-bottom:15px;width:70%"></div>
                <div class="row">
                    <div class="col-lg-6">
                        <label for="comm_pickup_normal" class="col-form-label">Pickup Commission (USD)</label>
                        <input id="commission_pickup_normal" type="number" class="form-control data-input" data-field="comm_pickup_normal">
                    </div>
                    <div class="col-lg-6">
                        <label for="comm_delivery_normal" class="col-form-label">Delivery Commission (USD)</label>
                        <input id="commission_delivery_normal" type="number" class="form-control data-input" data-field="comm_delivery_normal">
                    </div>
                </div>
                <span class="form-heading1" style="display:block;margin-top:15px;">Fast Delivery</span>
                <div class="div-line border-success" style="margin-top:5px;margin-bottom:15px;width:70%"></div>
                <div class="row">
                    <div class="col-lg-6">
                        <label for="comm_pickup_fast" class="col-form-label">Pickup Commission (USD)</label>
                        <input id="commission_pickup_fast" type="number" class="form-control data-input" data-field="comm_pickup_fast">
                    </div>
                    <div class="col-lg-6">
                        <label for="comm_delivery_fast" class="col-form-label">Delivery Commission (USD)</label>
                        <input id="commission_delivery_fast" type="number" class="form-control data-input" data-field="comm_delivery_fast">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <span id="_drl_driver_comm__error" class="error_text"></span>
                <button type="button" class="btn btn-warning" data-dismiss="modal">
                    <i class="fa fa-times fs-5 text-danger"></i>
                    <span>Close</span>
                </button>
                <button type="button" class="btn btn-success" id="_drl_comm_btnSave">
                    <i class="fa fa-check fs-5 text-success"></i>
                    <span>Save</span>
                </button>
            </div>
        </div>
    </div>
</div>