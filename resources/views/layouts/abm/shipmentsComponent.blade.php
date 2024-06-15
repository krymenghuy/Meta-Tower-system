<style>
    .dbc-card-period {
        padding: 3px;
        display: inline-block;
        font-size: 0.9em;
        color: gray;
        font-style: italic;
    }

    span.pl-request_time {
        color: #1E38A4;
        font-size: 0.8em;
        display: block;
        border-top: 1px solid #1E38A4;
        padding: 5px;
    }

    span svg {
        display: none;
    }

    .small-box>.inner {
        min-height: 160px;
        max-height: 166px;
    }

    .dbc-card-title {
        margin-top: -3px;
        font-size: 1.2em;
        color: #ACB4B4;
        font-weight: bold;
    }

    .dashboard-title {
        font-size: 1.2em;
        color: grey;
        display: inline-block;
        padding: 0px !important;
    }

    .dbc-card-line {
        width: 100%;
        margin-top: -2px;
        border-top: 1px solid #E4EAEB;
        margin: auto;
    }

    .dbc-card-percent-delivered {
        font-size: 0.6em;
        color: green;
    }

    div.dbc-no-rows-found {
        border-radius: 5px;
        border: 1.2px solid solid #90ECD5;
        color: #A9BBB4;
        font-size: 1.2em;
        padding: 4px;
    }

    .dbc-card-percent-returned {
        font-size: 0.6em;
        color: red;
    }

    .card {
        overflow: auto;
    }

    .card::-webkit-scrollbar {
        height: 4px;
        width: 4px;
    }

    .card::-webkit-scrollbar-thumb {
        background-color: #D8F3F4;
        outline: 0px !important;
    }

    .dbc-currency {
        padding: 3px;
        font-size: 0.6em;
        color: grey;
    }

    th div.d-n {
        display: none;
    }

    th:hover div.d-n {
        display: block !important;
    }

    th:hover div.d-b {
        display: none !important;
    }

    table.shipment td {
        vertical-align: middle;
        /* Vertically center the content */
        /* text-align: center; Horizontally center the content */
    }

    tr td a.btn_shipment_action>i.action-button-zoomin {
        transform: scale(1.5);
        transition: transform .2s;
        color: #96c949 !important;
    }
</style>

<div id="_main_shipmentsComponent" style="display:none; margin-right:15px;">
    <div class="p-3 bg-white shadow mt-3 rounded-3">
        <div class="kt-portlet__head-toolbar form-inline" id="_dl_filter_panel">
            <div class="d-flex w-100 justify-content-between">
                <div class="d-flex flex-row gap-2 " id="_sdl_filter_fields">
                    <div class="btn-group">
                        <!-- <button id="_pl_btnNewPickup" data-toggle="modal" class="btn btn-primary height">New Order</button> -->
                        <button id="btn_newQuickOrder" class="btn btn-primary height">
                            <i class="fa-solid fa-circle-plus"></i>
                            <span class="trans-text" data-langprop="buttons.Shipment">Shipment</span>
                        </button>
                    </div>
                    <input type="text" id="_pl_search" class="form-control min-width-search height" data-field="search"
                        placeholder="Search request" />
                    <button type="button" id="_pl_btnRefresh" class="btn btn-primary height">
                        <i class="fa fa-sync-alt"></i>
                    </button>
                    <button type="button" class="btn btn-outline-success height" id="_pl_btnToggleFilter">
                        <i class="fa fa-list-alt"></i>
                    </button>
                </div>
                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-danger" id="_pl_lnkDailyPackages">
                        <i class="la la-print"></i>
                        Daily Packages
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div id="order_list_wrapper" class="shadow-lg bg-white rounded-3 border p-0 mt-3 overflow-auto " style="">
        <div id="_shm_div_order_list" class=" overflow-auto w-100"></div>
    </div>
</div>

<div class="modal fade" id="_pl_dlgPickupStatus" tabindex="-1" role="dialog" aria-labelledby="_pl_dlgPickupStatusTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_pl_dlgPickupStatusTitle">Set shipment Status</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6">
                        <label for="" class="col-form-label">Shipment ID</label>
                        <input type="text" id="_pl_ps_shipment_code" class="form-control" readonly>
                        <input type="hidden" id="_pl_ps_shipment_id" class="data-input" data-field="shipment_id">
                    </div>
                    <div class="col-md-6">
                        <label for="" class="col-form-label">Customer Name</label>
                        <input type="text" id="_pl_ps_sender_name" class="form-control" readonly>
                        <input type="hidden" id="_pl_ps_order_id" class="data-input" data-field="dhipment_id">
                    </div>
                </div>
                <div class="row" style="display:none">
                    <div class="col-md-6">
                        <label for="" class="col-form-label">Request Date</label>
                        <input type="text" id="_pl_ps_request_date" class="form-control" readonly>
                    </div>
                </div>
                <div class="row" id="div_select_fields">
                    <div class="col-md-6">
                        <label class="col-form-label">Status</label>
                        <select class="modal-select2 status-field" id="_pl_ps_status"></select>
                    </div>
                    <div class="col-md-6" style="display:none">
                        <label class="col-form-label">Driver</label>
                        <select class="modal-select2" id="_pl_ps_driver"></select>
                    </div>
                    <div class="col-md-6 qr_code d-none" style="display:">
                        <label for="" class="col-form-label">Set Qr Code</label>
                        <input type="number" id="_pl_ps_qr_code" class="form-control">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <span class="error_text" id="_pl_ps_error"></span>
                <button type="button" class="btn btn-secondary height" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary height" id="_pl_ps_btnOK"><span class="trans-text"
                        data-langprop="buttons.OK"></span< /button>
            </div>
        </div>
    </div>
</div>









<div class="modal fade" id="_pl_dlgEmptyOrder" tabindex="-1" role="dialog" aria-labelledby="_pl_dlgEmptyOrderTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title trans-text" id="_pl_dlgEmptyOrderTitle" data-langprop="titles.New Shipment"></h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-lg-12">
                        <label for="id" class="form-label trans-text" data-langprop="titles.Shipment ID"></label>
                        <input type="text" class="form-control data-input" data-field="id" placeholder="AUTO"
                            readonly />
                        <input type="hidden" class="form-control data-input" data-field="code" placeholder="AUTO"
                            readonly />
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="customer" class="form-label trans-text" data-langprop="titles.Customer"></label>
                        <select id="_plq_sender" class="modal-select2 data-input" data-field="sender_id"></select>
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="from_country" class="form-label trans-text"
                            data-langprop="titles.From Country"></label>
                        <select id="from_country" class="modal-select2 data-input" data-field="from_country_id">
                            <option value="1">Cambodia</option>

                        </select>
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="to_country" class="form-label trans-text" data-langprop="titles.To Country"></label>
                        <select id="_plq_to_country" class="modal-select2 data-input"
                            data-field="to_country_id"></select>
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="item_type" class="form-label trans-text" data-langprop="titles.Item Type"></label>
                        <select id="_sdl_item_type" class="modal-select2 data-input" data-field="item_type">
                            <option value="">Select item</option>
                            <option value="doc">Doc</option>
                            <option value="non_doc">Non-doc</option>
                        </select>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="primary_cp" class="form-label trans-text"
                            data-langprop="titles.Primary (CP)"></label>
                        <select id="_plq_primary_cp" class="modal-select2 data-input"
                            data-field="primary_cp_id"></select>
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="secondary_cp" class="form-label trans-text"
                            data-langprop="titles.Secondary (CP)"></label>
                        <select id="_plq_secondary_cp" class="modal-select2 data-input"
                            data-field="secondary_cp_id"></select>
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="receiver_name" class="form-label trans-text" data-langprop="titles.Receiver Name"></label>
                        <input type="text" id="" class="form-control data-input" data-field="receiver_name" />
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="remarks" class="form-label trans-text" data-langprop="titles.Remarks"></label>
                        <input type="text" id="" class="form-control data-input" data-field="remarks" />
                    </div>



                    <div class="form-group col-lg-12">
                        <label for="receiver_address" class="form-label trans-text" data-langprop="titles.Receiver Address"></label>
                        <textarea class="form-control data-input" data-field="receiver_address"></textarea>
                    </div>





                    
                   
                   
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-default height" data-bs-dismiss="modal"><span
                        class="trans-text" data-langprop="buttons.Cancel"></span></button>
                <button type="button" class="btn btn-primary height" id="_pl_dlgEmptyOrder_btnOK"><span
                        class="trans-text" data-langprop="buttons.Create"></span></button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="ps_dlgSpecialCharge" tabindex="-1" role="dialog" aria-labelledby="ps_dlgSpecialChargeTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-ms" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="ps_dlgSpecialChargeTitle">Add Special Charge</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <input type="hidden" class="form-control" id="ps-sc_id">
                    <div class="form-group col-lg-12">
                        <span class="simple-label">Shipment id</span>
                        <input type="number" class="form-control" id="ps-shipment_id" readonly>
                    </div>
                    <div class="form-group col-lg-12">
                        <span class="simple-label">Charge Category</span>
                        <input type="text" class="form-control" id="ps-newsc_category">
                    </div>
                    <div class="form-group col-lg-12">
                        <span class="simple-label">Charge</span>
                        <input type="number" class="form-control" id="ps-newsc_charge">
                    </div>
                    <div class="form-group col-lg-12">
                        <span class="simple-label">Remarks</span>
                        <input type="text" class="form-control" id="ps-remarks">
                    </div>
                </div>
                <span id="ps_dlgSpecialCharge_error" class="error_text"></span>
            </div>
            <div class="modal-footer">

                <button type="button" class="btn btn-warning height" data-bs-dismiss="modal">
                    <i class="fa fa-times fs-5 text-danger"></i>
                    <span>Cancel</span>
                </button>
                <button type="button" class="btn btn-success height" id="ps_dlgSpecialCharge_btnOK">
                    <i class="fa fa-check fs-5 text-success"></i>
                    <span>Add</span>
                </button>
            </div>
        </div>
    </div>
</div>