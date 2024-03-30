<style>
    .dropdown-menu i {
        width: 27px !important;
    }

    i.trl-menu-icon {
        display: inline-block;
        width: 10px;
        font-size: 1em !important;
    }

    table#_trl_tblTrips > thead th {
        text-transform: uppercase;
        color: #073c93 !important;
        font-weight:bold;
        font-size: 1em;
        font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
    }

    table#_trl_tblTrips > tbody td {
        font-size: 0.9em;
        padding-top: 5px;
    }

    tr.dpl-selected {
        background: #52BE80;
    }

    tr.dpl-selected td {
        color: #fff !important;
        font-weight: bold;
    }

    .trl_copy_barcode {
        display: block;
        padding: 3px;
    }

    .trl-pg-checked {
        padding: 3px;
        display: block;
        min-width: 30px;
        text-align: center;
        border-radius: 100px;
        border: 2px solid red;
    }

    .trl-numero {
        padding: 3px;
    }

    .trl-product-type {
        display: block;
        padding: 3px;
    }

    table.trl-package_table>thead th {
        color: #64C5E5 !important;
        padding:15px;
        font-weight: bold;
        font-size: 0.9em;
        text-transform: uppercase;
        border-bottom: 1px solid #DEE3E4;
        padding: 5px;
    }

    .trl-sendername-text,
    .trl-senderphone-text,
    .trl-receivername-text,
    .trl-receiverphone-text .trl-zonecode-text,
    .trl-zonename-text {
        display: block;
        padding: 0px;
        font-size: 0.9em;
        font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
        color: #000;
    }

    .trl-sendername-text {
        font-size: 1.1em;
        color: green !important;
    }

    .trl-senderphone-text,
    .trl-receiverphone-text {
        margin-top: 3px;
        padding: 5px;
        font-size: 0.8em !important;
    }

    .dpl_da_change_status {
        width: 100px;
    }

    .pg-badge-delivery_type {
        border-color: #B1F5E2 !important;
    }

    table.trl-package_table > tbody td {
        border: none;
        padding:10px;
        font-size: 1em !important;
        font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
        color: #120272;
    }

    div.package_list_wrapper {
        padding:20px;
        border-radius: 3px;
        border: 1px solid grey;
        background: #F8F9F8;
        border-radius: 5px;
        width: 100%;
        margin-top: 10px;
    }

    table#_trl_trip_tblPackages > tbody span.zone_code,
    table#_trl_trip_tblPackages > tbody span.zone_name,
    table#_trl_trip_tblPackages > tbody span.sender_name,
    table#_trl_trip_tblPackages > tbody span.sender_phone,
    table#_trl_trip_tblPackages > tbody span.receiver_address {
        display: block;
        font-size: 1em;
        font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
    }

    table#_trl_tblTrips > thead th,
    table#_trl_trip_tblPackages > thead th {
        font-size: 0.9em;
        color: #74B1E2;
        text-transform: uppercase;
    }

    table#_trl_tblTrips td {
        font-size: 0.9em;
        font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
    }
 
    #map {
        height: 90vh;
    }
</style>

<div id="_main_tripListComponent" style="display:none;margin:15px">
    <div id="_trl_trip_list_panel">
        <div class="d-flex justify-content-between shadow rounded-3 bg-white p-2">
            <div class="d-flex gap-2 flex-nowrap">
                <button id="_trl_btnNewTrip" class="btn btn-primary height">
                    <span class="text-center text-nowrap">New Trip</span>
                </button>
                <input type="text" id="_trl_search" class="form-control min-width-search height" placeholder="Search package" autocomplete="false">
                <button type="button" id="_trl_btnSearch" class="btn btn-outline-primary height">
                    <i class="fas fa-sync-alt"></i>
                </button>
                <button role="button" id="_trl_btnToggleFilter" class="btn btn-outline-primary height">
                    <i class="fas fa-filter"></i>
                </button>
            </div>
            <div class="d-flex gap-2 justify-content-end">
                <button id="_trl_btnPrint" role="button" class="btn btn-success height">
                    <i class="fas fa-print"></i>
                    <span>Print</span>
                </button>
                <button id="_trl_btnPDF" role="button" class="btn btn-primary height">
                    <i class="fas fa-file-pdf"></i>
                    <span>PDF</span>
                </button>
            </div>
        </div>
        <div id="_trl_triplist_container" class="table-responsive shadow p-3 rounded-3 bg-white mt-3 table-responsive-hover">
            <table id="_trl_tblTrips" class="table"></table>
        </div>
    </div>
    <div id="_trl_tracking_map_panel" style="display:none">
        <div class="form-inline" style="margin-left:25px">
            <button id="_trl_btnShowTrips" class="btn btn-sm btn-success">
                <i class="fa fa-list-alt"></i>
                <span>Back to Fleets</span>
            </button>
            <select class="modal-select2" id="_trl_filter_tracking_driver"></select>
        </div>
        <div class="container">
            <div id="map"></div>
        </div>
    </div>
</div>

<div class="modal fade" id="_trl_dlgDeliveryTrip" tabindex="-1" role="dialog" aria-labelledby="_trl_dlgDeliveryTripTitle" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_trl_dlgDeliveryTripTitle">New Delivery Trip</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="_trl_dlgDelivery_body" style="overflow:hidden !important">
                <div class="row">
                    <div class="col-lg-3">
                        <label for="" class="col-form-label">Depart Time</label>
                        <span class="text-muted"> (Now)</span>
                        <input id="_trl_trip_depart_time" class="form-control data-input" data-field="depart_time" data-select="timepicker" readOnly>
                    </div>
                    <div class="col-lg-3" style="display:none">
                        <label class="col-form-label">Delivery Type</label>
                        <select id="_trl_trip_delivery_type" class="modal-select2 data-input" data-field="delivery_type">
                            <option value="Normal">Normal</option>
                            <option value="Fast">Fast</option>
                        </select>
                    </div>
                    <div class="col-lg-4">
                        <label class="col-form-label">Barcode</label>
                        <div class="d-flex gap-2">
                            <input type="text" class="form-control" id="_trl_trip_barcode" style="min-width:300" placeholder="Barcode">
                            <button id="_trl_trip_btnScan" role="button" class="btn btn-sm btn-outline-primary height">
                                <span class="fs-6">Scan</span>
                            </button>
                            <button type="button" id="_trl_trip_btnPrintBarcode" style="float:left" class="btn btn-sm btn-outline-success height">
                                <i class="fa fa-barcode"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div style="height:10px"></div>
                <div class="row">
                    <div class="col-lg-3">
                        <label class="col-form-label">Vehicle Type</label>
                        <select class="modal-select2" id="_trl_trip_vehicle_type"></select>
                    </div>
                    <div class="col-lg-3">
                        <div class="d-flex align-items-center">
                            <label class="col-form-label pe-2">Driver</label>
                            <a href="javascript:void(0)" id="_trl_trip_lnkFindDriver">
                                <i class="fa fa-search text-success" style="font-size:1.1em"></i>
                            </a>
                        </div>
                        <input id="_trl_trip_driver_name" type="text" class="form-control data-input" data-field="driver_name" readOnly>
                        <input id="_trl_trip_driver_id" type="hidden" class="form-control data-input" data-field="driver_id" readOnly>
                        <input id="_trl_trip_driver_code" type="hidden" class="form-control data-input" data-field="driver_code" readOnly>
                    </div>
                    <div class="col-lg-6">
                        <span id="_trl_trip_error" class="error_text">Error test here</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="w-100 overflow-x-auto overflow-y-hidden p-2 rounded-3" style="margin-top:10px;height:450px;border:1.2px dotted grey">
                            <table id="_trl_trip_tblPackages" class="table trl-package_table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Sender</th>
                                        <th>Receiver</th>
                                        <th>Zone</th>
                                        <th>Delivery Type</th>
                                        <th>COD</th>
                                        <th>Fees</th>
                                        <th>Total (USD)</th>
                                        <th>Total (KHR)</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody id="_trl_trip_tblPackages_body"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-default height" id="_trl_trip_btnClose">
                    <i class="fa fa-times" style="font-size:1.3em;color:red"></i>
                    <span>Close</span>
                </button>
                <button type="button" class="btn btn-success height" id="_trl_trip_btnSaveTrip">
                    <i class="fa fa-check" style="font-size:1.3em;color:green"></i>
                    <span>Start Delivery</span>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="_trl_dlgFilter" tabindex="-1" role="dialog" aria-labelledby="_trl_dlgFilterTitle" aria-hidden="true">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_trl_dlgFilterTitle">Filter Trips</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="">
                    <span class="simple-label">Warehouse</span>
                    <select id="_trl_filter_warehouse" class="modal-select2 trip_filter_field"></select>&nbsp;
                </div>
                <div class="row">
                    <div class="form-group col-lg-6">
                        <span class="simple-label">From Date</span>
                        <div>
                            <input id="_trl_filter_startdate" class="form-control trip_filter_field" data-select="datepicker" autocomplete="off">
                        </div>
                    </div>
                    <div class="form-group col-lg-6">
                        <span class="simple-label">To Date</span>
                        <div>
                            <input id="_trl_filter_enddate" class="form-control trip_filter_field" data-select="datepicker" autocomplete="off">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <span class="simple-label">Driver</span>
                        <select id="_trl_filter_driver" class="modal-select2 trip_filter_field"></select>
                    </div>
                    <div class="col-lg-6">
                        <span class="simple-label">Status</span>
                        <select id="_trl_filter_status" class="modal-select2 trip_filter_field"></select>&nbsp;
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-default height" data-dismiss="modal">
                    <i class="fa fa-times" style="color:red"></i>
                    <span>Cancel</span>
                </button>
                <button type="button" class="btn btn-primary height" id="_trl_dlgFilter_btnOK">
                    <i class="fa fa-list-alt" style="color:#fff"></i>
                    <span>OK</span>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="_trl_dlgPackageStatus" tabindex="-1" role="dialog" aria-labelledby="_trl_dlgPackageStatusTitle" aria-hidden="true">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_trl_dlgPackageStatusTitle">Change Package Status</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div>
                    <span class="simple-label">Select status</span>
                    <select id="_trl_ps_status" class="modal-select2"></select>
                </div>
                <div class="row">
                    <div class="col-lg-12" style="display:none">
                        <span class="simple-label">Notes</span>
                        <input id="_trl_ps_notes" class="form-control" autocomplete="off">
                    </div>
                </div>
                <div class="row">
                    <span style="margin:15px;" class="error_text d-block" id="_trl_ps_error"></span>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                    <i class="fa fa-times text-danger"></i>
                    <span>Cancel</span>
                </button>
                <button type="button" class="btn btn-primary" id="_trl_dlgPackageStatus_btnSave">
                    <i class="fas fa-check text-white"></i>
                    <span>Change Now</span>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="_trl_dlgAddItemTotrip" tabindex="-1" role="dialog" aria-labelledby="_trl_dlgAddItemTotripTitle" aria-hidden="true">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_trl_dlgAddItemTotripTitle">Change Package to Trip</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-lg-12">
                        <span class="simple-label">
                            Barcode
                            <i class="fa fa-barcode"></i>
                        </span>
                        <div>
                            <input type="text" id="_trl_apt_barcode" class="form-control">
                        </div>
                    </div>
                    <div style="display:none" class="form-group col-lg-12">
                        <span class="simple-label">Select Status</span>
                        <select id="_trl_apt_status" class="modal-select2"></select>
                    </div>
                    <div style="display:none" class="form-group col-lg-12">
                        <span class="simple-label">Notes</span>
                        <input id="_trl_apt_notes" class="form-control" autocomplete="off">
                    </div>
                    <div class="form-group col-lg-12">
                        <span class="error_text" id="_trl_dlgAddItemTotrip_error"></span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" data-dismiss="modal">
                    <i class="fa fa-times"></i>
                    <span>Close</span>
                </button>
                <button type="button" class="btn btn-primary" id="_trl_dlgAddItemTotrip_btnSaveAndNew">
                    <span>Add & New</span>
                </button>
                <button type="button" class="btn btn-success" id="_trl_dlgAddItemTotrip_btnSave">
                    <span>Add & Close</span>
                </button>
            </div>
        </div>
    </div>
</div>