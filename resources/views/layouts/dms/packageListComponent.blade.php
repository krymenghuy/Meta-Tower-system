<style>
    table#_dl_tblPackages > thead th {
        color: #66BAF2;
        border-bottom: 1.5px inset #92D7EC;
        text-transform: uppercase;
        font-size: 0.9em;
    }

    table#_dl_tblPackages > tbody td span {
        font-size: 0.9em;
        font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
    }

    table#_dl_tblPackages > tbody td {
        font-size: 0.9em;
        font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
    }

    .pg-no_customer_phone {
        color: orange;
        font-size: 1em;
    }

    .pg-receiver_phone {
        color: green;
        font-size: 0.9em !important;
    }

    .pg-sender_phone {
        color: #34A1C3;
        padding: 3px;
        font-size: 1em !important;
    }

    .pg-receiver_phone::before {
        content: 'Receiver: ';
    }

    .pg-product_type {
        color: #8B8887;
        font-weight: bold;
        display: block;
        font-size: 1em;
    }

    .pg-sender_name {
        color: #41CCCE;
        font-size: 1.1em !important;
        font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
    }

    .pg-sender_type {
        color: #97AEAE;
        font-size: 1em;
    }

    .pg-zone_code {
        display: block;
        color: grey;
        font-size: 1em;
    }

    .pg-zone_name {
        display: inline-block;
        color: #000;
        font-size: 1em
    }

    .package_detail {
        background: #F8F9F9;
    }

    .pg-selected {
        background: #E8F6F3;
    }

    .vc-label {
        color: #555150;
        display: block;
        font-size: 1em;
        font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
    }

    .vc-value:hover {
        border-bottom: 1.1px solid red;
    }

    .vc-value {
        color: #000;
        display: block;
        max-width: 200px;
        overflow: hidden;
        padding-left: 5px;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .pg-badge-delivery_type {
        display: block;
        text-align: center;
        text-transform: uppercase;
        background: transparent;
        border: 2.5px solid green;
        border-radius: 45%;
        color: #000;
        width: 65px;
        height: 38px;
        padding: 8px 4px 4px 4px;
        font-size: 0.8em !important;
    }

    span.total-label {
        font-weight: bold;
        display: inline-block;
        font-size: 1.2em;
        width: 60px;
    }

    span.total-value {
        font-weight: bold;
        font-size: 1.1em;
    }

    span.total-value:before {
        content: '$';
    }

    .vc-value-edit {
        border-radius: 3px;
        background: #fff;
        padding: 5px;
    }

    .vc-value-edit:focus {
        border: 1.2px solid green;
        outline: 1.2px green;
    }

    span.pg-pickup_time {
        margin-top: 5px;
        display: block;
        font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
        font-size: 0.9em !important;
        padding: 3px;
    }

    span.pg-barcode {
        display: block;
        margin-right: 20px;
        font-size: 1em;
        color: orange;
    }

    span.pg-pickup_time::before {
        content: 'មកដល់: ';
    }

    .btn-on-delivery {
        border-bottom: 1.2px solid green;
    }

    ._pol_status {
        min-width: 100.18px;
    }

    ._pol_driver_name {
        display: block;
        padding: 3px;
        font-size: 0.9em;
    }
</style>

<div id="_main_packageListComponent" style="display:none;margin:10px">
    <div class="d-flex justify-content-between shadow rounded-3 p-2 bg-white">
        <div class="d-flex gap-2">
            <input type="text" id="_dl_search" class="form-control min-width-search" placeholder="Search package"> &nbsp;
            <button type="button" id="_dl_btnSearch" class="btn btn-outline-primary height">
                <i class="fas fa-sync-alt"></i>
            </button>
            <button id="_dl_btnToggleFilter" role="button" class="btn btn-outline-success height">
                <i class="fas fa-list-alt"></i>
            </button>
        </div>
        <div class="d-flex gap-2">
            <button type="button" id="_dl_btnPrint" class="btn btn-success height">
                <i class="fas fa-print"></i>
                <span>Print</span>
            </button>
            <button type="button" id="_dl_btnPDF" class="btn btn-primary height">
                <i class="fas fa-file-pdf"></i>
                <span>PDF</span>
            </button>
        </div>
    </div>
    <div class="table-responsive shadow rounded-3 p-3 bg-white mt-3 table-responsive-hover" style="min-height:43vw">
        <table id="_dl_tblPackages" class="table"></table>
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
                            <table id="dg_tblPersons" class="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Phone Number</th>
                                    </tr>
                                </thead>
                                <tbody id="dg_tblPersons_body"></tbody>
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

<div class="modal fade" id="_dl_dlgFilter" tabindex="-1" role="dialog" aria-labelledby="_dl_dlgFilterTitle" aria-hidden="true">
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
                    <select id="_dl_filter_warehouse" class="form-control dl_filter_field"></select>&nbsp;
                </div>
                <div class="row">
                    <div class="col-lg-3">
                        <span class="simple-label">From date</span>
                        <div>
                            <input id="_dl_filter_startdate" class="form-control dl_filter_field" data-select="datepicker" autocomplete="off">
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <span class="simple-label">To date</span>
                        <div>
                            <input id="_dl_filter_enddate" class="form-control dl_filter_field" data-select="datepicker" autocomplete="off">
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <span class="simple-label">Merchant</span>
                        <select id="_dl_filter_sender" class="modal-select2 dl_filter_field"></select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <span class="simple-label">Driver</span>
                        <select id="_dl_filter_driver" class="modal-select2 dl_filter_field"></select>
                    </div>
                    <div class="col-lg-6">
                        <span class="simple-label">Destination</span>
                        <select id="_dl_filter_zone" class="modal-select2 dl_filter_field"></select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <span class="simple-label">Type</span>
                        <select id="_dl_filter_dtype" class="v-select form-control dl_filter_field">
                            <option value="">All Types</option>
                            <option value="Normal">Normal</option>
                            <option value="Fast">Fast</option>
                        </select>
                    </div>
                    <div class="col-lg-6">
                        <span class="simple-label">Status</span>
                        <select id="_dl_filter_status" class="v-select form-control dl_filter_field"></select>&nbsp;
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

<div class="modal fade" id="_dl_dlgScanIn" tabindex="-1" role="dialog" aria-labelledby="_dl_dlgScanIn_title" aria-hidden="true">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_dl_dlgScanIn_title">Scan In (Failed Deliveries)</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <span class="simple-label">Warehouse</span>
                    <select id="_dl_scanin_warehouse" class="modal-select2"></select>&nbsp;
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <span class="simple-label">Remarks</span>
                        <input id="_dl_scanin_remarks" class="form-control dl_filter_field" autocomplete="off">
                    </div>
                    <div class="col-lg-6">
                        <span class="simple-label">Change to status</span>
                        <select id="_dl_scanin_status" class="form-control"></select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <span class="simple-label">Barcode</span>
                        <input id="_dl_scanin_barcode" class="form-control">
                    </div>
                    <div class="col-lg-6"></div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <span class="error_text" id="_dl_dlgScanin_error"></span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="_dl_dlgScanIn_btnClose" class="btn btn-secondary">
                    <i class="fa fa-times" style="color:red"></i>
                    Close
                </button>
            </div>
        </div>
    </div>
</div>