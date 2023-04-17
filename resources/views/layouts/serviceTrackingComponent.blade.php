<div id="_main_serviceTrackingComponent" class="mobile-padding" style="display:none; padding-top:15px">
    <div class="px-3">
        <div class="d-flex gap-2">
            <button class="btn btn-primary" type="button" id="st_btnNew">
                <span class="trans-text" data-langprop="service.Add Track"></span>
            </button>
        </div>
        <div class="table-responsive rounded-3 border border-success mt-3 p-3">
            <table class="table table-hover table-th" id="_tbl_service_tracking"></table>
        </div>
    </div>
</div>

<div id="st_dlgService_Tracking" class="modal fade" tabindex="-1" aria-labelledby="st_dlgService_Tracking_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title fs-5" id="st_dlgService_Tracking_title"></h5>
            </div>
            <div class="modal-body">
                <div class="row py-2">
                    <div class="col-lg-4">
                        <label class="form-label trans-text" data-langprop="titles.Date"></label>
                    </div>
                    <div class="col-lg-8">
                        <input data-select="datepicker" class="form-control data-input" data-field="date"/>
                    </div>
                </div>

                <div class="row py-2">
                    <div class="col-lg-4">
                        <label class="form-label trans-text" data-langprop="titles.Customer"></label>
                    </div>
                    <div class="col-lg-8">
                        <select id="st_dlgService_client" class="form-select modal-select2 data-input" data-field="client_id"></select>
                    </div>
                </div>
               
                <div class="row py-2">
                    <div class="col-lg-4">
                        <label class="form-label trans-text" data-langprop="titles.Service Plan"></label>
                    </div>
                    <div class="col-lg-8">
                        <select id ="st_dlgService_service_plan" class="modal-select2 data-input" data-field="service_plan_id"></select>
                    </div>
                </div>

                <div class="row py-2">
                    <div class="col-lg-4">
                        <label class="form-label trans-text" data-langprop="titles.Service"></label>
                    </div>
                    <div class="col-lg-8">
                        <select id ="st_dlgService_service" class="modal-select2 data-input" data-field="service_id"></select>
                    </div>
                </div>
           
                <div style="display:none" class="row py-2">
                    <div class="col-lg-4">
                        <label class="form-label trans-text" data-langprop="titles.Price"></label>
                    </div>
                    <div class="col-lg-8">
                        <input type="number" class="form-control data-input" data-field="price"/>
                    </div>
                </div>

                <div class="row py-2">
                    <div class="col-lg-4">
                        <label class="form-label trans-text" data-langprop="titles.Doctor Name"></label>
                    </div>
                    <div class="col-lg-8">
                        <select id="st_dlgService_doctor" class="modal-select2 data-input" data-field="doctor_id"></select>
                    </div>
                </div>

                <div class="row py-2">
                    <div class="col-lg-4">
                        <label class="form-label trans-text" data-langprop="titles.Nurse"></label>
                    </div>
                    <div class="col-lg-8">
                        <select id="st_dlgService_first_nurse" class="modal-select2 data-input" data-field="first_nurse_id"></select>
                    </div>
                </div>

                <div class="row py-2">
                    <div class="col-lg-4">
                        <label class="form-label trans-text" data-langprop="titles.Doctor Commission"></label>
                    </div>
                    <div class="col-lg-8">
                        <input type="number" class="form-control data-input" data-field="doctor_commission"/>
                    </div>
                </div>

                <div class="row py-2">
                    <div class="col-lg-4">
                        <label class="form-label trans-text" data-langprop="titles.Nurse Commission"></label>
                    </div>
                    <div class="col-lg-8">
                        <input type="number" class="form-control data-input" data-field="first_nurse_commission"/>
                    </div>
                </div>
                <div class="row py-2">
                    <div class="col-lg-4">
                        <label class="form-label trans-text" data-langprop="titles.Invoice Number"></label>
                    </div>
                    <div class="col-lg-8">
                        <input type="text" class="form-control data-input" data-field="invoice_number"/>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="st_dlgService_Tracking_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>

