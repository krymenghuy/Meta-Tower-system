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
    th div.d-n{
        display: none;
    }
    th:hover div.d-n{
        display: block !important;
    }
    th:hover div.d-b{
        display: none !important;
    }
</style>

<div id="_main_shipmentsComponent" style="display:none; margin-right:15px;">
    <div class="p-3 bg-white shadow rounded-3">
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
                    <input type="text" id="_pl_search"  class="form-control min-width-search height" data-field="search" placeholder="Search request"/>
                    <button type="button" id="_pl_btnSearch" class="btn btn-primary height">
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

<div class="modal fade" id="_pl_dlgPickupStatus" tabindex="-1" role="dialog" aria-labelledby="_pl_dlgPickupStatusTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_pl_dlgPickupStatusTitle">Set Pickup Status</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6">
                        <label for="" class="col-form-label">Order ID</label>
                        <input type="text" id="_pl_ps_order_code" class="form-control" readonly>
                        <input type="hidden" id="_pl_ps_order_id" class="data-input" data-field="order_id">
                    </div>
                    <div class="col-md-6">
                        <label for="" class="col-form-label">Merchant Name</label>
                        <input type="text" id="_pl_ps_sender_name" class="form-control" readonly>
                        <input type="hidden" id="_pl_ps_order_id" class="data-input" data-field="order_id">
                    </div>
                </div>
                <div class="row" style="display:none">
                    <div class="col-md-6">
                        <label for="" class="col-form-label">Request Date</label>
                        <input type="text" id="_pl_ps_request_date" class="form-control" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <label class="col-form-label">Status</label>
                        <select class="modal-select2" id="_pl_ps_status"></select>
                    </div>
                    <div class="col-md-6">
                        <label class="col-form-label">Driver</label>
                        <select class="modal-select2" id="_pl_ps_driver"></select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <span class="error_text" id="_pl_ps_error"></span>
                <button type="button" class="btn btn-secondary height" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary height" id="_pl_ps_btnOK"><span class="trans-text" data-langprop="buttons.OK"></span</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade modal-fullscreen" id="_pl_dlgPickupRequest" tabindex="-1" role="dialog" aria-labelledby="_pl_dlgPickupRequestTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="dialog">
        <div class="modal-content" style="width:90%">
            <div class="modal-header">
                <h5 class="modal-title" id="_pl_dlgPickupRequestTitle">Create Pickup Request</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="_pl_dlgPickupRequest_body" style="overflow:hidden !important">
                <div class="row gy-2">
                    <div class="form-group col-lg-3" style="display:none">
                        <label for="" class="col-form-label">Order ID</label>
                        <input id="_pl_pr_order_code" type="text" class="form-control data-input" data-field="order_code" readOnly>
                        <input id="_pl_pr_order_id" type="hidden" class="form-control data-input" data-field="order_id" readOnly>
                    </div>
                    <div class="form-group col-lg-4">
                        <label for="" class="col-form-label">Merchant</label>
                        <select class="modal-select2" id="_pl_pr_sender"></select>
                    </div>
                    <div style="display:none" class="form-group col-lg-3">
                        <label class="col-form-label">Sender Name</label>
                        <a href="javascript:void(0)" id="_pl_pr_lnkFindSender">
                            <i class="fa fa-search" style="color:green;font-size:1.3em"></i>
                        </a>
                        <input id="_pl_pr_sender_name" type="text" class="form-control data-input" data-field="sender_name" readonly>
                        <input id="_pl_pr_sender_id" type="hidden" class="form-control data-input" data-field="sender_id" readonly>
                        <input id="_pl_pr_sender_code" type="hidden" class="form-control data-input" data-field="sender_code" readonly>
                    </div>
                    <div class="form-group col-lg-4">
                        <label class="col-form-label">Delivery Type</label>
                        <select id="_pl_pr_delivery_type" class="modal-select2 data-input" data-field="delivery_type">
                            <option value="normal">Normal</option>
                            <option value="fast">Fast</option>
                        </select>
                    </div>
                    <div class="form-group col-lg-3" style="display:none">
                        <label class="col-form-label">Condition</label>
                        <select id="_pl_pr_delivery_condition" class="modal-select2 data-input" data-field="delivery_condition"></select>
                    </div>
                    <div class="form-group col-lg-4">
                        <label class="col-form-label">Product Type</label>
                        <a id="_pl_pr_lnkAddProductType" href="javascript:void(0)">
                            <i class="fa fa-plus" style="color:green"></i>
                        </a>
                        <select id="_pl_pr_product_type" class="modal-select2 data-input" data-field="product_type"></select>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="form-group col-lg-3">
                        <label class="col-form-label">Vehicle Type</label>
                        <a id="_pl_pr_lnkAddVehicleType" href="javascript:void(0)">
                            <i class="fa fa-plus" style="color:green"></i>
                        </a>
                        <select id="_pl_pr_vehicle_type" class="modal-select2 data-input" data-field="request_vehicle_type"></select>
                    </div>
                    <div class="form-group col-lg-3">
                        <label class="col-form-label">Number of packages</label>
                        <input id="_pl_pr_qty" type="number" class="form-control data-input" data-field="qty" value="1">
                    </div>
                    <div class="form-group col-lg-6">
                        <label class="col-form-label">Pickup Address</label>
                        <input id="_pl_pr_pickup_address" type="text" class="form-control data-input" data-field="pickup_address" placeholder="Pickup address">
                    </div>
                </div>
                <div class="row gy-2" style="display:none">
                    <div class="form-group col-lg-6">
                        <label class="col-form-label">Request Date</label>
                        <input id="_pl_pr_request_date" type="text" class="form-control data-input" data-field="request_date" data-select="datepicker">
                    </div>
                    <div class="form-group col-lg-6">
                        <label class="col-form-label">Pickup Date</label>
                        <input id="_pl_pr_pickup_date" type="text" class="form-control data-input" data-field="pickup_date" data-select="datepicker">
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-lg-12">
                        <div style="height:30px;"></div>
                        <div class="form-inline">
                            <button id="_pl_pr_add_package" class="btn btn-sm btn-outline-success height">
                                <i class="fa fa-plus fs-5"></i>
                                <span class="fs-5-08">Add</span>
                            </button>
                        </div>
                        <div style="height:5px"></div>
                        <div class="w-100 overflow-auto p-2 rounded-3 border" style="height:450px">
                            <table id="_pl_pr_tblPackages" class="table"></table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning height" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-success height" id="_pl_pr_btnSaveRequest">OK</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade modal-fullscreen" id="_pl_dlgPerformPickup" tabindex="-1" role="dialog" aria-labelledby="_pl_dlgPerformPickupTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="dialog">
        <div class="modal-content" style="width:90%">
            <div class="modal-header">
                <h5 class="modal-title" id="_pl_dlgPerformPickupTitle">Perform Pickup</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="_pl_dlgPerformPickup_body" style="overflow:hidden !important">
                <div class="row">
                    <div class="col-lg-3">
                        <label class="col-form-label">Receiving Warehouse</label>
                        <select id="_pl_dd_to_warehouse" class="modal-select2 data-input" data-field="to_warehouse_id"></select>
                    </div>
                    <div class="col-lg-3">
                        <label for="" class="col-form-label">Order ID</label>
                        <input id="_pl_dd_order_code" type="text" class="form-control data-input" data-field="order_code" readonly>
                        <input id="_pl_dd_order_id" type="hidden" class="form-control data-input" data-field="order_id" readonly>
                    </div>
                    <div class="col-lg-6">
                        <label class="col-form-label">Sender Name</label>
                        <input id="_pl_dd_sender_name" type="text" class="form-control data-input" data-field="sender_name" readonly>
                        <input id="_pl_dd_sender_id" type="hidden" class="form-control data-input" data-field="sender_id" readonly>
                        <input id="_pl_dd_sender_code" type="hidden" class="form-control data-input" data-field="sender_code" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <label class="col-form-label">Pickup Date</label>
                        <input id="_pl_dd_pickup_date" type="text" class="form-control data-input" data-field="pickup_date" data-select="datepicker">
                    </div>
                    <div class="col-lg-3" style="display:none">
                        <label class="col-form-label">Delivery Type</label>
                        <select id="_pl_dd_delivery_type" class="modal-select2" data-field="delivery_type">
                            <option value="Normal">Normal</option>
                            <option value="Fast">Fast</option>
                        </select>
                    </div>
                    <div class="col-lg-3">
                        <label class="col-form-label">Picked up By (Driver)</label>
                        <a href="javascript:void(0)" id="_pl_pp_lnkFindDriver">
                            <i class="fa fa-search" style="color:green;font-size:1.1em"></i>
                        </a>
                        <select id="_pl_dd_driver" class="modal-select2 data-input" data-field="driver"></select>
                        <input type="hidden" id="_pl_dd_driver_code">
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div style="height:30px"></div>
                        <div class="form-inline">
                            <button id="_pl_pp_add_package" class="btn btn-sm btn-outline-success">
                                <i class="fa fa-plus"></i>
                                Add
                            </button>
                            <span id="_pl_dd_pickup_context" style="color:green;font-weight:bold;font-size:1.3em">
                                The following packages were not picked up by an agent or driver.
                            </span>
                        </div>
                        <div style="height:5px"></div>
                        <div class="flat-box" style="width:100%;height:450px;overflow-x:auto;overflow-y:auto">
                            <table id="_pl_dd_tblPackages" class="table"></table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <span id="_pl_dd_pickup_type" style="color:orange;font-weight:bold;font-size:1.2em"></span>
                <button type="button" class="btn btn-warning" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="_pl_pp_btnPickup">Pick Now</button>
                <button type="button" class="btn btn-success" id="_pl_pp_btnPickOnArrival">Pick on Arrival</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade modal-fullscreen" id="_pl_dlgReceivePackages" tabindex="-1" role="dialog" aria-labelledby="_pl_dlgReceivePackagesTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="dialog">
        <div class="modal-content" style="width:90%">
            <div class="modal-header">
                <h5 class="modal-title" id="_pl_dlgReceivePackagesTitle">Verify Packages</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="_pl_dlgReceivePackages_body" style="overflow:hidden !important">
                <div class="row">
                    <div class="col-lg-3">
                        <label for="" class="col-form-label">Receiving Warehouse</label>
                        <select id="_pl_rps_to_warehouse" class="modal-select2 data-input" data-field="to_warehouse_id"></select>
                    </div>
                    <div class="col-lg-3">
                        <label for="" class="col-form-label">Order ID</label>
                        <input id="_pl_rps_order_code" type="text" class="form-control data-input" data-field="order_code" readonly>
                        <input id="_pl_rps_order_id" type="hidden" class="form-control data-input" data-field="order_id" readonly>
                    </div>
                    <div class="col-lg-6">
                        <label class="col-form-label">Sender Name</label>
                        <a href="javascript:void(0)" id="_pl_rps_lnkFindSender">
                            <i class="fa fa-search" style="color:green;font-size:1.3em"></i>
                        </a>
                        <input id="_pl_rps_sender_name" type="text" class="form-control data-input" data-field="sender_name" readonly>
                        <input id="_pl_rps_sender_id" type="hidden" class="form-control data-input" data-field="sender_id" readonly>
                        <input id="_pl_rps_sender_code" type="hidden" class="form-control data-input" data-field="sender_code" readonly>
                    </div>
                </div>
                <div style="height:15px"></div>
                <div class="row">
                    <div class="col-lg-3">
                        <label class="col-form-label">Delivery Date</label>
                        <input id="_pl_rps_delivery_date" type="text" class="form-control data-input" data-field="pickup_date" data-select="datepicker">
                    </div>
                    <div class="col-lg-3">
                        <label class="col-form-label">Delivery Type</label>
                        <select id="_pl_rps_delivery_type" class="modal-select2 data-input" data-field="delivery_type">
                            <option value="fast">Fast</option>
                            <option value="normal">Normal</option>
                        </select>
                    </div>
                    <div class="col-lg-6" style="display:none;">
                        <div style="display:flex;flex-direction:row;">
                            <div>
                                <img src="" style="margin-top:-10px;width:130px;height:100px" />
                            </div>
                            <div style="width:50%">
                                <label class="col-form-label">Delivery Agent/Driver</label>
                                <a href="javascript:void(0)" id="_pl_rps_lnkFindDriver">
                                    <i class="fa fa-search" style="color:green;font-size:1.1em"></i>
                                </a>
                                <select id="_pl_rps_driver" class="modal-select2 data-input" data-field="driver"></select>
                                <input type="hidden" id="_pl_rps_driver_code">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div style="height:15px;"></div>
                        <div class="form-inline">
                            <button id="_pl_rps_add_package" class="btn btn-sm btn-outline-success">
                                <i class="fa fa-plus"></i>
                                Add
                            </button>
                            <span id="_pl_rps_error" class="error_text"></span>
                        </div>
                        <div style="height:5px"></div>
                        <div style="width:100%;height:450px;overflow-x:auto;overflow-y:auto;border:1px solid #CCD1D1;padding:10px;border-radius:3px">
                            <table id="_pl_rps_tblPackages" class="table"></table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" data-dismiss="modal">
                    <i class="fa fa-times" style="font-size:1.3em;color:red"></i>
                    Close
                </button>
                <button type="button" class="btn btn-success" id="_pl_rps_btnVerify">
                    <i class="fa fa-check" style="font-size:1.3em;color:green"></i>
                    OK
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="_pl_dlgFilter" tabindex="-1" role="dialog" aria-labelledby="_pl_dlgFilterTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_pl_dlgFilterTitle">Filter Pickups</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-md-6">
                        <span class="simple-label">From Date</span>
                        <div><input id="_pl_filter_startdate" class="form-control dl_filter_field" data-select="datepicker" autocomplete="off"></div>
                    </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">To Date</span>
                        <div><input id="_pl_filter_enddate" class="form-control dl_filter_field" data-select="datepicker" autocomplete="off"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-md-6">
                        <span class="simple-label">Merchant</span>
                        <select id="_pl_filter_sender" class="modal-select2 form-control dl_filter_field"></select>
                    </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">Driver</span>
                        <select id="_pl_filter_driver" class="modal-select2 form-control dl_filter_field"></select>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-md-6">
                        <span class="simple-label">Type</span>
                        <select id="_pl_filter_dtype" class="modal-select2 dl_filter_field">
                            <option value="">All Types</option>
                            <option value="normal">Normal</option>
                            <option value="fast">Fast</option>
                        </select>
                    </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">Status</span>
                        <select id="_pl_filter_status" class="modal-select2 dl_filter_field"></select>
                    </div>
                </div>
                <div class="form-group col-md-12">
                    <span class="simple-label">Warehouse</span>
                    <select id="_pl_filter_warehouse" class="modal-select2 form-control dl_filter_field"></select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-default height" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary height" id="_pl_dlgFilter_btnOK">OK</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="_pl_dlgEmptyOrder" tabindex="-1" role="dialog" aria-labelledby="_pl_dlgEmptyOrderTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title trans-text" id="_pl_dlgEmptyOrderTitle" data-langprop="titles.New Shipment"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <!-- <div class="form-group col-lg-6">
                        <span class="simple-label">zone_code</span>
                        <select id="_plq_warehouse" class="modal-select2 data-input" data-field="zone_code"></select>
                    </div> -->
                    <div class="form-group col-md-6">
                        <span class="simple-label">Customer</span>
                        <div>
                            <select id="_plq_sender" class="modal-select2 data-input" data-field="sender_id"></select>
                        </div>
                    </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">from country</span>
                        <div>
                            <select id="_plq_from_country" class="modal-select2 data-input" data-field="from_country_id"></select>
                        </div>
                    </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">to country</span>
                        <div>
                            <select id ="_plq_to_country" class="modal-select2 data-input" data-field="to_country_id"></select>
                        </div>
                        <!-- <input type="number" class="form-control data-input" data-field="to_country_id" />   -->

                    </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">primary cp</span>
                        <div>
                            <select id ="_plq_primary_cp" class="modal-select2 data-input" data-field="primary_cp_id"></select>
                        </div>
                    </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">secondary cp</span>
                        <div>
                            <select id ="_plq_secondary_cp" class="modal-select2 data-input" data-field="secondary_cp_id"></select>
                        </div>
                    </div>
                    <!-- <div class="form-group col-md-6">
                        <span class="simple-label">effective_weight</span> -->
                        <input type="hidden" class="form-control data-input" data-field="effective_weight" />
                    <!-- </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">actual_weight</span> -->
                        <input type="hidden" class="form-control data-input" data-field="actual_weight" />
                    <!-- </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">markup_weight</span> -->
                        <input type="hidden" class="form-control data-input" data-field="markup_weight" />
                    <!-- </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">total_weight</span> -->
                        <input type="hidden" class="form-control data-input" data-field="total_weight" />
                    <!-- </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">carrier_total_weight</span> -->
                        <input type="hidden" class="form-control data-input" data-field="carrier_total_weight" />
                    <!-- </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">total_price</span> -->
                        <input type="hidden" class="form-control data-input" data-field="total_price" />
                    <!-- </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">carrier_cost</span> -->
                        <input type="hidden" class="form-control data-input" data-field="carrier_cost" />
                    <!-- </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">carrier_special_charge</span> -->
                        <input type="hidden" class="form-control data-input" data-field="carrier_special_charge" />
                    <!-- </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">total_carrier_cost</span> -->
                        <input type="hidden" class="form-control data-input" data-field="total_carrier_cost" />
                    <!-- </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">total_special_charge</span> -->
                        <input type="hidden" class="form-control data-input" data-field="total_special_charge" />
                    <!-- </div> -->
                    <div class="form-group col-md-6">
                        <span class="simple-label">receiver_name</span>
                        <input id="_plq_pikcup_address" class="form-control data-input" data-field="receiver_name" />
                    </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">remarks</span>
                        <input id="_plq_pikcup_address" class="form-control data-input" data-field="remarks" />
                    </div>
                    <div class="form-group col-md-12">
                        <span class="simple-label">receiver_address</span>
                        <input type="text" class="form-control data-input" data-field="receiver_address" />
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-default height" data-dismiss="modal"><span class="trans-text" data-langprop="buttons.Cancel"></span></button>
                <button type="button" class="btn btn-primary height" id="_pl_dlgEmptyOrder_btnOK"><span class="trans-text" data-langprop="buttons.Create"></span></button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="_dlgMagicEntry" tabindex="-1" role="dialog" aria-labelledby="_dlgMagicEntryTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_dlgMagicEntryTitle">Magic Entry</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-lg-6">
                        <span class="simple-label">Merchant</span>
                        <select id="_pkl_me_sender" class="modal-select2"></select>
                    </div>
                    <div class="form-group col-lg-6">
                        <span class="simple-label">Order</span>
                        <select id="_pkl_me_order_code" class="modal-select2"></select>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-lg-6">
                        <span class="simple-label">Default delivery type</span>
                        <select class="modal-select2" class="form-control" id="_pkl_default_delivery_type">
                            <option value="-n">Normal</option>
                            <option value="-f">Fast</option>
                        </select>
                    </div>
                    <div class="form-group col-lg-6">
                        <span class="simple-label">Package count</span>
                        <span id="_pkl_me_pkg_count" class="pkl-me-order">0</span>
                    </div>
                </div>
                <div class="row">
                    <div class="field-tips" id="_pkl_field_tips" style="margin-left:5px;">
                        <a class="field-tip" data-value="r-" href="javascript:void(0)">-r</a>
                        <a class="field-tip" href="javascript:void(0)">z-</a>
                        <a class="field-tip" href="javascript:void(0)">p-</a>
                        <a class="field-tip" href="javascript:void(0)">w-</a>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-lg-6">
                        <span class="simple-label">Field</span>
                        <select class="modal-select2" class="modal-select2" id="_pkl_field"></select>
                    </div>
                    <div class="form-group col-lg-6">
                        <span class="simple-label" id="_bkl_fiel_name">Enter your shortcut
                            <a href="javascript:void(0)" style="color:orange;font-weight:bold">(?)</a>
                        </span>
                        <input type="text" class="form-control" id="_pkl_command">
                    </div>
                </div>
                <div class="form-group col-lg-12">
                    <div id="_pkl_pg_fields" class="pkl-pg-info"></div>
                </div>
                <div class="form-group col-lg-12">
                    <div id="_pkl_me_summary" class="pkl-me-summary" style="display:none">
                        <span class="pkl-summary-total" data-name="Driver Total" data-field="driver_total">
                            Driver: $120
                        </span>
                        <span class="pkl-summary-total" data-name="To Merchant" data-field="amount_to_sender">
                            Merchant: $120
                        </span>
                        <span class="pkl-summary-total" data-name="Fees" data-field="fees">Fees: $120</span>
                    </div>
                </div>
                <div style="width:100%">
                    <span id="_dlgMagicEntry_error" class="error_text"></span>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" id="_dlgMagicEntry_btnSubmit">Submit</button>
                <button type="button" class="btn btn-primary" id="_dlgMagicEntry_btnClose">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="pkl_dlgPackage" tabindex="-1" role="dialog" aria-labelledby="pkl_dlgPackageTitle" aria-hidden="true">
    <div class="vs-modal-dialog modal-xl modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="pkl_dlgPackageTitle">Package Details</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="d-flex flex-row gap-2">
                 <div class="d-flex flex-column justify-content-between w-50 border border-secondary shadow-lg rounded-3">
                    <div style="max-height:65vh;overflow-y:auto">
                        <img id="pkl_dlgPackage_item_photo" class="w-100 h-100" class="item-photo-view" alt="package photo">
                    </div>
                    <div class="d-flex flex-row gap-2 p-1"> 
                        <a data-movetype="prev" href="javascript:void(0)" class="btn-move btn btn-sm btn-outline-info"><i class="fas fa-angle-double-left"></i></a> <a data-movetype="next" href="javascript:void(0)" class="btn-move btn btn-sm btn-outline-info"><i class="fas fa-angle-double-right"></i></a>
                        <span id="nav_info_text" class="fw-semibold text-black text-center"></span>
                    </div>
                 </div>

                 <div class="div-item-details w-50 p-2">
                    <div class="row" style="max-height:65vh;overflow-y:auto">
                        <div class="form-group col-lg-12">
                            <label for="" class="form-label trans-text" data-langprop="titles.Zone Code"></label>
                            <div><select id="pkl_dlgPackage_zone" data-required="1" class="modal-select2 data-input" data-field="zone_code"></select></div>  
                        </div>
                        <div class="form-group col-lg-12">
                            <label for="" class="form-label trans-text" data-langprop="titles.Receiver Phone"></label>
                            <div><input data-required="1" type="text" class="form-control data-input" data-field="receiver_phone"></div>  
                        </div>
                        <div class="form-group col-lg-12">
                            <label for="" class="form-label trans-text" data-langprop="titles.Price"></label>
                            <div><input data-required="1" type="number" class="form-control data-input" data-field="price"></div>  
                        </div>
                        <div class="form-group col-lg-12">
                            <label for="df_payer" class="form-label trans-text" data-langprop="titles.Fee Payer"></label>
                            <div><select data-required="1" class="modal-select2 data-input" data-field="df_payer">
                                <option value="sender">Sender</option>
                                <option value="receiver">Receiver</option>
                            </select></div>
                        </div>
                        <div class="form-group col-lg-12">
                            <label for="remarks" class="form-label trans-text" data-langprop="titles.Remarks"></label>
                            <div><input type="text" class="form-control data-input" data-field="remarks"></div>  
                        </div>

                        <div class="form-group col-lg-12">
                            <label for="" class="form-label modal-select2" data-langprop="titles.Service Type">Service Type</label>
                            <div><select data-required="1" class="modal-select2 data-input" data-field="delivery_type">
                                <option value="normal" selected>Normal</option>
                                <option value="fast">Fast</option>
                            </select></div>  
                        </div>

                        <div style="display:none" class="form-group col-lg-12">
                            <label for="remarks" class="form-label trans-text" data-langprop="titles.Fees"></label>
                            <div><input type="text" class="form-control" data-field="remarks" readonly></div>  
                        </div>
                        <div style="display:none"  class="form-group col-lg-12">
                            <label for="remarks" class="form-label trans-text" data-langprop="titles.Base Fee"></label>
                            <div><input type="text" class="form-control data-input" data-field="base_fee" readonly></div>  
                        </div>
                        <div style="display:none"  class="form-group col-lg-12">
                            <label for="remarks" class="form-label trans-text" data-langprop="titles.Additional"></label>
                            <div><input type="text" class="form-control data-input" data-field="delivery_fee" readonly></div>  
                        </div>

                        <div style="display:none" class="form-group col-lg-12">
                            <label for="size" class="form-label trans-text" data-langprop="titles.Size"></label>
                            <div><input type="text" class="form-control data-input" data-field="size"></div>  
                        </div>

                        <div style="display:none"  class="form-group col-lg-12">
                            <label for="actual_kg" class="form-label trans-text" data-langprop="titles.Actual KG"></label>
                            <div><input type="number" class="form-control data-input" data-field="actual_kg"></div>  
                        </div>

                        <div style="display:none" class="form-group col-lg-12">
                            <label for="billed_kg" class="form-label trans-text" data-langprop="titles.Billed KG"></label>
                            <div><input type="text" class="form-control data-input" data-field="billed_kg" readonly></div>  
                        </div>

                    </div>
                 </div>
              </div>     
            </div>
            <div class="modal-footer">
               <div class="pkl-entry-buttons d-flex fles-row gap-2">
                    <button type="button" id="pkl_dlgPackage_btnClose" class="btn btn-warning">Close</button>
                    <button id="pkl_dlgPackage_btnPrev" type="button" class="btn btn-info"><span>Pevious</span></button>
                    <button id="pkl_dlgPackage_btnSaveAndNext" type="button" class="btn btn-primary"><span>Save & Next</span></button>
                    <button id="pkl_dlgPackage_btnSave" type="button" class="btn btn-info"><span>Save</span></button>
               </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="ps_dlgSpecialCharge" tabindex="-1" role="dialog" aria-labelledby="ps_dlgSpecialChargeTitle" aria-hidden="true">
  <div class="modal-dialog modal-ms" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="ps_dlgSpecialChargeTitle">Add Special Charge</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
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
                <input type="text" class="form-control" id="ps-remarks" >
            </div>
        </div>
        <span id="ps_dlgSpecialCharge_error" class="error_text"></span>
      </div>
      <div class="modal-footer">
        
        <button type="button" class="btn btn-warning height" data-dismiss="modal">
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