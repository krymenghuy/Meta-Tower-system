<div id="_main_serviceTrackingComponent" class="mobile-padding" style="display:none; padding-top:15px">
    <div class="px-3">
        <div class="d-flex gap-2">
            <button class="btn btn-primary" type="button" id="st_btnNew">
                <span class="trans-text" data-langprop="service.Add Service Tracking"></span>
            </button>
        </div>
        <div class="table-responsive rounded-3 border border-success mt-3 p-3">
            <table class="table table-hover table-th" id="_tbl_service_tracking"></table>
        </div>
    </div>
</div>

<div id="st_dlg_Service_Tracking" class="modal fade" tabindex="-1" aria-labelledby="st_dlg_Service_Tracking_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title fs-5" id="st_dlg_Service_Tracking_title"></h5>
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
                        <label class="form-label trans-text" data-langprop="titles.Service"></label>
                    </div>
                    <div class="col-lg-8">
                        <select class="form-select modal-select2 data-input" data-field="service"></select>
                    </div>
                </div>
                <div class="row py-2">
                    <div class="col-lg-4">
                        <label class="form-label trans-text" data-langprop="titles.Customer"></label>
                    </div>
                    <div class="col-lg-8">
                        <select class="form-select modal-select2 data-input" data-field="customer"></select>
                    </div>
                </div>
                <div class="row py-2">
                    <div class="col-lg-4">
                        <label class="form-label trans-text" data-langprop="titles.Staff Name"></label>
                    </div>
                    <div class="col-lg-8">
                        <select class="form-select modal-select2 data-input" data-field="staff_name"></select>
                    </div>
                </div>
                <div class="row py-2">
                    <div class="col-lg-4">
                        <label class="form-label trans-text" data-langprop="titles.Commission"></label>
                    </div>
                    <div class="col-lg-8">
                        <input type="number" class="form-control data-input" data-field="commission"/>
                    </div>
                </div>
                <div class="row py-2">
                    <div class="col-lg-4">
                        <label class="form-label trans-text" data-langprop="titles.Price"></label>
                    </div>
                    <div class="col-lg-8">
                        <input type="number" class="form-control data-input" data-field="price"/>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="st_dlg_Service_Tracking_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>