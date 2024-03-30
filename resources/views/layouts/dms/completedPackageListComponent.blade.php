<div id="_main_completedPackageListComponent" style="display:none;padding:15px;margin-left:2px">
    <div class="d-flex justify-content-between w-100 bg-white rounded-3 p-3">
        <div class="d-flex gap-2">
            <input type="text" id="_cpl_search" class="form-control min-width-search height" placeholder="Search Package">
            <button type="button" id="_cpl_btnSearch" class="btn btn-outline-primary height">
                <i class="fas fa-sync-alt"></i>
            </button>
            <button id="_cpl_btnToggleFilter" role="button" class="btn btn-outline-success height">
                <i class="fas fa-list-alt"></i>
            </button>
        </div>
        <div class="d-flex gap-2">
            <button type="button" id="_cpl_btnPrint" class="btn btn-success height">
                <i class="fas fa-print"></i>
                <span class="trans-text" data-langprop="buttons.Print">Print</span>
            </button>
            <button type="button" id="_cpl_btnPDF" class="btn btn-primary height">
                <i class="fas fa-file-pdf"></i>
                <span class="trans-text" data-langprop="buttons.PDF">PDF</span>
            </button>
        </div>
    </div>
    <div style="padding:10px 5px 10px 10px;margin-top:5px" class="table-responsive bg-white rounded-3 p-3 mt-3 w-100 border-style1 table-responsive-hover">
        <div id="_cpl_package_list"></div>
    </div>
</div>

<div class="modal fade" id="_cpl_dlgFilter" tabindex="-1" role="dialog" aria-labelledby="_cpl_dlgFilterTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title trans-text" id="_cpl_dlgFilterTitle" data-langprop="general.Package Filter">Package Filter</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                  <div class="form-group col-lg-12">
                    <label class="form-label trans-text" data-langprop="general.Warehouse">Warehouse</label>
                    <select id="_cpl_filter_warehouse" class="form-control filter-field" data-field="warehouse_id"></select>
                  </div>
                    <div class="form-group col-lg-3">
                        <label class="form-label trans-text" data-langprop="general.Finish Date (Start)">From Date</label>
                        <div>
                            <input id="_cpl_filter_startdate" class="form-control filter-field"
                                data-select="datepicker" autocomplete="off" data-field="start_date">
                        </div>
                    </div>
                    <div class="form-group col-lg-3">
                        <label class="form-label trans-text" data-langprop="general.Finish Date (End)">To Date</label>
                        <div>
                            <input id="_cpl_filter_enddate" class="form-control filter-field"
                                data-select="datepicker" autocomplete="off" data-field="end_date">
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <label class="form-label trans-text" data-langprop="general.Merchant">Merchant</label>
                        <select id="_cpl_filter_sender" class="modal-select2 filter-field" data-field="sender_id"></select>
                    </div>

                    <div class="form-group col-lg-6">
                        <label class="form-label trans-text" data-langprop="general.Driver">Driver</label>
                        <select id="_cpl_filter_driver" class="modal-select2 filter-field" data-field="driver_id"></select>
                    </div>
                    <div class="form-group col-lg-6">
                        <label class="form-label trans-text" data-langprop="general.Picked up by">Picked up by</label>
                        <select id="_cpl_filter_pickup_driver" class="modal-select2 filter-field" data-field="pickup_driver_id"></select>
                    </div>

                    <div class="form-group col-lg-6">
                        <label class="form-label trans-text" data-langprop="general.Type">Type</label>
                        <select id="_cpl_filter_dtype" class="modal-select2 filter-field" data-field="delivery_type">
                            <option value="">All Types</option>
                            <option value="Normal">Normal</option>
                            <option value="Fast">Fast</option>
                        </select>
                    </div>
                    <div class="form-group col-lg-6">
                        <label class="form-label trans-text" data-langprop="general.Status">Status</label>
                        <select id="_cpl_filter_status" class="modal-select2 filter-field" data-field="status_id"></select>
                    </div>
                    <div class="form-group col-lg-6">
                        <label class="form-label trans-text" data-langprop="titles.Driver Payment">Driver Payment</label>
                        <select id="_cpl_filter_pmt_driver" class="modal-select2 filter-field" data-field="driver_pmt_status_id">
                            <option value="-1">All</option>
                            <option value="1">Paid</option>
                            <option value="0">Unpaid</option>
                        </select>
                    </div>
                    <div class="form-group col-lg-6">
                        <label class="form-label trans-text" data-langprop="general.Merchant Payment">Merchant Payment</label>
                        <select id="_cpl_filter_pmt_merchant" class="modal-select2 filter-field" data-field="sender_pmt_status_id">
                            <option value="-1">All</option>
                            <option value="1">Paid</option>
                            <option value="0">Unpaid</option>
                        </select>
                    </div>
                </div>
           
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-default height" data-dismiss="modal">
                    <i class="fa fa-times" style="color:red"></i>
                    Cancel
                </button>
                <button type="button" class="btn btn-primary height" id="_cpl_dlgFilter_btnOK">
                    <i class="fa fa-list-alt" style="color:#fff"></i>
                    OK
                </button>
            </div>
        </div>
    </div>
</div>
