<style>
    .pg-alert-card-line{
        border:0.5px solid #D9DFDF;
    }
    div.pg-alert-card.selected  .pg-alert-card-line{
        border:1px solid green;
        transform-origin: 0;
    }
    
</style>
<div id="_main_packageListComponent" style="display:none;padding:15px;margin-left:2px">
    <div class="d-flex justify-content-between w-100 bg-white rounded-3 p-3">
        <div class="d-flex gap-2">
            <input type="text" id="_pgl_search" class="form-control min-width-search height" placeholder="Search Package">
            <button type="button" id="_pgl_btnSearch" class="btn btn-outline-primary height">
                <i class="fas fa-sync-alt"></i>
            </button>
            <button id="_pgl_btnToggleFilter" role="button" class="btn btn-outline-success height">
                <i class="fas fa-list-alt"></i>
            </button>
        </div>
        <div class="d-flex gap-2">
            <button type="button" id="_pgl_btnPrint" class="btn btn-success height">
                <i class="fas fa-print"></i>
                <span class="trans-text" data-langprop="buttons.Print">Print</span>
            </button>
            <button type="button" id="_pgl_btnPDF" class="btn btn-primary height">
                <i class="fas fa-file-pdf"></i>
                <span class="trans-text" data-langprop="buttons.PDF">PDF</span>
            </button>
        </div>
    </div>
    <div class="pg-summary-container d-flex flex-fow gap-2 justify-content-start p-2 shadow border rounded-3">
         
        <div class="pg-alert-card card shadow p-2 border rounded-3 mr-3" data-statusid="5" data-name="overdue_aw">
            <div class="d-flex flex-column justify-content-center flex-wrap align-items-center p-2">
               <span class="data-input text-dark fs-5 fw-semibold" data-field="title">Overdue</span>
               <a href="javascript:void(0)" class="lnk-alert-list" data-statusid="5"><span class="data-input fs-5 fw-semibold" data-field="value">3 pcs</h5></a>
            </div>
            <span class="pg-alert-card-line" style="width:100%"></span>
            <span class="data-input text-muted p-1" style="font-size:0.8em" data-field="time_ago">Last 10 days</span>
         </div>

         <div class="pg-alert-card card shadow p-2 border rounded-3 mr-3" data-statusid="6" data-name="overdue_od">
            <div class="d-flex flex-column justify-content-center flex-wrap align-items-center p-2">
               <span class="data-input text-dark fs-5 fw-semibold" data-field="title">Overdue</span>
               <a href="javascript:void(0)" class="lnk-alert-list" data-statusid="6"><span class="data-input fs-5 fw-semibold" data-field="value">3 pcs</h5></a>
            </div>
            <span class="pg-alert-card-line" style="width:100%"></span>
           <span class="data-input text-muted p-1" style="font-size:0.8em" data-field="time_ago">Last 10 days</span>
         </div>

         <div class="pg-alert-card card shadow p-2 border rounded-3 mr-3" data-statusid="9" data-name="overdue_failed">
            <div class="d-flex flex-column justify-content-center flex-wrap align-items-center p-2">
               <span class="data-input text-dark fs-5 fw-semibold" data-field="title">Chhorng</span>
               <a href="javascript:void(0)" class="lnk-alert-list" data-statusid="9"><span class="data-input fs-5 fw-semibold" data-field="value">0 pcs</h5></a>
            </div>
            <span class="pg-alert-card-line" style="width:100%"></span>
           <span class="data-input text-muted p-1" style="font-size:0.8em" data-field="time_ago">Last 10 days</span>
         </div>
         <div class="pg-alert-card card shadow p-2 border rounded-3 mr-3" data-statusid="9" data-name="overdue_failed">
            <div class="d-flex flex-column justify-content-center flex-wrap align-items-center p-2">
               <span class="data-input text-dark fs-5 fw-semibold" data-field="title">Chhorng</span>
               <a href="javascript:void(0)" class="lnk-alert-list" data-statusid="9"><span class="data-input fs-5 fw-semibold" data-field="value">0 pcs</h5></a>
            </div>
            <span class="pg-alert-card-line" style="width:100%"></span>
           <span class="data-input text-muted p-1" style="font-size:0.8em" data-field="time_ago">Last 10 days</span>
         </div>
         <div class="pg-alert-card card shadow p-2 border rounded-3 mr-3" data-statusid="6" data-name="overdue_od">
            <div class="d-flex flex-column justify-content-center flex-wrap align-items-center p-2">
               <span class="data-input text-dark fs-5 fw-semibold" data-field="title">Overdue</span>
               <a href="javascript:void(0)" class="lnk-alert-list" data-statusid="6"><span class="data-input fs-5 fw-semibold" data-field="value">3 pcs</h5></a>
            </div>
            <span class="pg-alert-card-line" style="width:100%"></span>
           <span class="data-input text-muted p-1" style="font-size:0.8em" data-field="time_ago">Last 10 days</span>
         </div>
    </div>

    <div style="padding:10px 5px 10px 10px;margin-top:5px" class="table-responsive bg-white rounded-3 p-3 mt-3 w-100 border-style1 table-responsive-hover">
        <div id="_pgl_package_list"></div>
    </div>
</div>

<div class="modal fade" id="_dl_dlgFilter" tabindex="-1" role="dialog" aria-labelledby="_dl_dlgFilter" aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_dl_dlgFilterTitle">Filter Packages</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <span class="simple-label">Warehouse</span>
                    <select id="_dl_filter_warehouse" class="form-control dl_filter_field" data-field="warehouse_id"></select>&nbsp;
                </div>
                <div class="row">
                    <div class="col-lg-3">
                        <span class="simple-label">From date</span>
                        <div>
                            <input id="_dl_filter_startdate" class="form-control dl_filter_field" data-field="start_date" data-select="datepicker" autocomplete="off">
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <span class="simple-label">To date</span>
                        <div>
                            <input id="_dl_filter_enddate" class="form-control dl_filter_field" data-field="end_date" data-select="datepicker" autocomplete="off">
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <span class="simple-label">Merchant</span>
                        <select id="_dl_filter_sender" class="modal-select2 dl_filter_field" data-field="sender_id"></select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <span class="simple-label">Driver</span>
                        <select id="_dl_filter_driver" class="modal-select2 dl_filter_field" data-field="driver_id"></select>
                    </div>
                    <div class="col-lg-6">
                        <span class="simple-label">Destination</span>
                        <select id="_dl_filter_zone" class="modal-select2 dl_filter_field" data-field="zone_code"></select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <span class="simple-label">Type</span>
                        <select id="_dl_filter_dtype" class="modal-select2 dl_filter_field" data-field="delivery_type">
                            <option value="">All Types</option>
                            <option value="Normal">Normal</option>
                            <option value="Fast">Fast</option>
                        </select>
                    </div>
                    <div class="col-lg-6">
                        <span class="simple-label">Status</span>
                        <select id="_dl_filter_status" class="modal-select2 dl_filter_field" data-field="status_id"></select>&nbsp;
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-default height" data-dismiss="modal">
                    <i class="fa fa-times" style="color:red"></i>
                    Cancel
                </button>
                <button type="button" class="btn btn-primary height" id="_dl_dlgFilter_btnOK">
                    <i class="fa fa-list-alt" style="color:#fff"></i>
                    OK
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="dg_dlgFindPerson" tabindex="-1" role="dialog" aria-labelledby="dg_dlgFindPersonTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="dg_dlgFindPersonTitle">Find Person</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-lg-6">
                        <input class="form-control" type="text" id="dg_person_search" placeholder="id, name, phone number">
                    </div>
                    <div class="col-lg-6">
                        <button type="button" id="dg_btnFindPerson" class="btn btn-primary height">
                            <i class="fa fa-search"></i>
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div style="height:15px"></div>
                        <span style="font-weight:bold;font-size:1.3em">Looking for someone?</span>
                        <div class="div-line" style="width:50%;border-color:green"></div>
                        <div id="dg_tblPersons_wrapper">
                            <table id="dg_tblPersons" class="table fixed-body-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Phone Number</th>
                                    </tr>
                                </thead>
                                <tbody id="dg_tblPersons_body" style="height:250px"></tbody>
                            </table>
                        </div>
                        <div>
                            <span style="font-size:1.3em;color:green;font-weight:bold" id="dg_lblInfo">
                                No Person Found!
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-default height" data-dismiss="modal" id="dg_findperson_btnClose">Cancel</button>
                <button type="button" class="btn btn-primary height" id="dg_btnChoosePerson">OK</button>
            </div>
        </div>
    </div>
</div>
