<style>
    a._dpmt_print_barcode>i:hover {
        transform: scale(1.7);
        transition-property: transform;
        color: green;
    }

    input.checkbox-lg {
        width: 18px;
        height: 18px;
    }

    .billing-paid-text {
        color: green !important;
        font-size: 1.1em;
        font-weight: bold;
    }

    .billing-unpaid-text {
        color: red !important;
        font-size: 1.1em;
        font-weight: bold;
    }

    span.billing-pmt-notes {
        color: grey;
        font-size: 0.9em;
    }

    span#_dpmt_filter_driver_name,
    span.billing-forwarding_cost,
    span.billing-cod_amount {
        color: #ABEBC6;
        font-size: 1.2em;
        font-weight: bold;
    }

    span.billing-balance-due {
        font-weight: bold;
        color: blue;
        font-size: 1.2em;
    }

    span.bl-section-title {
        color: #D0D8D7;
        font-weight: bold;
        font-size: 1em;
    }

    ul.bl-report-list>li {
        list-style: none;
    }

    ul.bl-report-list>li>a {
        display: block;
        padding: 5px;
        font-size: 1.2em;
        border-bottom: 1.5px solid #CDD7D6;
    }

    div.bl-report_filter_panel {
        border: 1px inset #E0E7E6;
        border-radius: 2px;
    }

    a.bl-report-selected {
        font-weight: bold;
    }

    table#_dpmt_tblItems>thead th,
    table#_dpmt_tblPmts>thead th {
        font-size: 0.9em;
        text-transform: uppercase;
        color: #4E5151;
    }

    table#_dpmt_tblItems>.col-input {
        min-width: 100px;
    }

    .trx-img {
        min-width: 80px;
        min-height: 80px;
    }

    .dpmt-driver_name {
        display: block;
        padding: 3px;
        font-size: 0.9em;
        color: orange;
    }
</style>

<div id="_main_driverPmtComponent" style="display:none;padding:5px">
    <div id="_dpmt_content" class="w-100" style="padding:10px;">
        <div class="tab-view" id="_dpmt_driverTabView">
            <div class="tab-header gap-1 mb-3 set-parent-active">
                <a href="javascript:void(0)" class="tab-button active" data-viewname="dpmt_deliveries" data-target="_dpmt_panel_deliveries">
                    <span class="p-2 border rounded-3 bg-white">DELIVERIES</span>
                </a>
                <a href="javascript:void(0)" class="tab-button" data-viewname="dpmt_payments" data-target="_dpmt_panel_payments">
                    <span class="p-2 border rounded-3 bg-white">PAYMENTS</span>
                </a>
                <a href="javascript:void(0)" class="tab-button" data-viewname="dpmt_reports" data-target="_dpmt_panel_reports">
                    <span class="p-2 border rounded-3 bg-white">REPORTS</span>
                </a>
            </div>
            <div class="tab-body">
                <div class="tab-panel" id="_dpmt_panel_deliveries" style="height:81.25vh" data-viewname="dpmt_deliveries">
                    <div class="d-flex flex-column gap-2 bg-white p-3 rounded-3 border">
                        <div class="d-flex gap-2 justify-content-between">
                            <div class="d-flex flex-column gap-2">
                                <div class="d-flex gap-2" id="_dpmt_filter_panel">
                                    <div class="min-width-select">
                                        <select class="select2 dpmt_filter_field" id="_dpmt_filter_warehouse" data-placeholder="Choose warehouse"></select>
                                    </div>
                                    <div class="min-width-select">
                                        <select class="select2 dpmt_filter_field" id="_dpmt_filter_driver" data-placeholder="Choose driver"></select>
                                    </div>
                                    <button type="button" id="_dpmt_btnToggleFilter" class="btn btn-sm btn-outline-primary">
                                        <i class="fas fa-list-alt fs-5 text-success"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="input-group flex-nowrap min-width-search">
                                <input type="text" id="_dpmt_search" class="form-control" placeholder="Search package" autocomplete="false">
                                <div class="input-group-text" role="button">
                                    <span id="_dpmt_btnSearch">
                                        <i class="fas fa-sync-alt fs-5 text-success"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <button id="_dpmt_btnSelectAll" type="button" class="btn btn-sm btn-outline-primary">
                                <i class="fa fa-check fs-5"></i>
                                <span>All</span>
                            </button>
                            <button id="_dpmt_btnReceivePmt" type="button" class="btn btn-sm btn-outline-success">
                                <span>Receive Pmt</span>
                            </button>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="table-responsive p-3 bg-white rounded-3 border mt-3 table-responsive-hover">
                            <table id="_dpmt_tblItems" class="table"></table>
                        </div>
                    </div>
                </div>
                <div class="tab-panel" id="_dpmt_panel_payments" style="height:81.25vh" data-viewname="dpmt_payments">
                    <div class="d-flex justify-content-between bg-white p-2 shadow border rounded-3">
                            <div class="d-flex flex-row gap-2">
                                        <div class="d-flex flex-column min-width-select">
                                           <label for="_dpmt_filter_pmt_driver" class="trans-text fw-semibold ml-1" data-langprop="titles.Driver"></label>  
                                           <select class="select2 dpmt_filter_field" id="_dpmt_filter_pmt_driver"></select>
                                        </div>
                                        <div class="min-width-select">
                                            <label for="_dpmt_filter_trx_status" class="trans-text fw-semibold ml-1" data-langprop="titles.Status"></label>  
                                            <select class="select2 dpmt_filter_field" id="_dpmt_filter_trx_status">
                                                <option value="">(All)</option>
                                                <option value="1">Pending</option>
                                                <option value="2">Approved</option>
                                            </select>
                                        </div>
                                        <div class="d-flex flex-column">
                                            <label for="_dpmt_filter_pmt_startdate" class="trans-text fw-semibold ml-1" data-langprop="titles.From Date"></label>   
                                            <div> <input id="_dpmt_filter_pmt_startdate" class="form-control dpmt_filter_field" data-select="datepicker"> </div>
                                        </div>
                                        <div class="d-flex flex-column">
                                            <label for="_dpmt_filter_pmt_enddate" class="trans-text fw-semibold ml-1" data-langprop="titles.To Date"></label>    
                                           <div> <input id="_dpmt_filter_pmt_enddate" class="form-control dpmt_filter_field" data-select="datepicker"> </div>
                                        </div>
                            </div>
                            <div class="d-flex gap-2">
                               <!-- <div>
                                    <button class="btn btn-primary"><i class="fa fa-print"></i></button>
                               </div> -->
                            </div>
                    </div>

                    <div class="d-flex justify-content-between bg-white p-2 pl-4 pr-4 shadow border rounded-3 mt-1">
                          <div class="d-flex flex-column mt-1">
                              <div class="d-flex flex-row gap-2">
                                    <span class="fw-semibold fs-5 text-success">Total: </span>
                                    <span id="_dpmt_pmt_total" class="fw-semibold fs-5 text-success">$0</span>
                              </div>
                              <div id="_dpmt_pmt_breakdown" class="mt-1 d-flex flex-row border-top border-lg border-primary p-2 gap-3">
                                 <span>ACLEDA 120 USD</span>
                              </div> 
                          </div>
                          <div class="d-flex gap-2 mt-1">
                               <span class="fw-semibold fs-5">Transaction Count: </span>
                               <span id="_dpmt_pmt_count" class="fw-semibold fs-5">0</span>
                          </div>
                         
                         <div>
                         <button id="_dpmt_btnApproveAll" class="btn btn-primary"><i class="fa fa-check"></i> <span class="trans-text" data-langprop="buttons.Approve All"></span></button>
                         </div>  
                    </div>
                    <div class="shadow border rounded-3 p-2 w-100 bg-white mt-2">
                       <div id="_dpmt_pmt_list" class="w-100"></div>
                    </div>
                </div>
                <div class="tab-panel flat-box mt-3" id="_dpmt_panel_reports" style="height:81.25vh" data-viewname="dpmt_reports">
                    <div class="bg-white p-3 rounded-3 border">
                        <span class="bl-section-title text-dark">DRIVER REPORT</span>
                        <div class="div-line" style="border-color:#E7ECEC; width:30%"></div>
                        <div class="row">
                            <div class="col-lg-6">
                                <ul class="bl-report-list d-flex flex-column gap-2" id="_dpmt_report_list">
                                    <li>
                                        <a data-rptname="dr_package_list" class="report-item" href="javascript:void(0)">Delivered Packages Report</a>
                                    </li>
                                    <li>
                                        <a data-rptname="dr_summarized_deliveries" class="report-item" href="javascript:void(0)">Summarized Deliveries Report</a>
                                    </li>
                                    <li>
                                        <a data-rptname="dr_driver_pmts" class="report-item" href="javascript:void(0)">Payments by Driver</a>
                                    </li>
                                    <li>
                                        <a data-rptname="dr_driver_commissions" class="report-item" href="javascript:void(0)">Commissions to Driver</a>
                                    </li>
                                    <li style="display:none">
                                        <a data-rptname ="dr_pmts_to_driver" class="report-item" href="javascript:void(0)">Payments to Driver</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-lg-6">
                                <div class="bl-report_filter_panel p-3">
                                    <div class="w-100">
                                        <span class="simple-label">Report on driver</span>
                                        <div class="w-100">
                                            <select class="select2" id="_dpmt_rptfilter_driver" data-placeholder="Choose driver"></select>
                                        </div>
                                    </div>
                                    <div class="d-flex gap-2 w-100">
                                        <div class="form-group w-50">
                                            <span class="simple-label">From</span>
                                            <div>
                                                <input id="_dpmt_rptfilter_start_date" class="form-control" data-select="datepicker">
                                            </div>
                                        </div>
                                        <div class="form-group w-50">
                                            <span class="simple-label">To</span>
                                            <div>
                                                <input id="_dpmt_rptfilter_end_date" class="form-control" data-select="datepicker">
                                            </div>
                                        </div>
                                    </div>
                                    <div style="height:10px"></div>
                                    <div class="form-inline">
                                        <button id="_dpmt_btnRunReport" role="button" class="btn btn-sm btn-success">
                                            <i class="fa fa-list-alt"></i>
                                            <span>Run Report</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- <div class="modal fade" id="_dpmt_dlgReceivePmt1" tabindex="-1" role="dialog" aria-labelledby="_dpmt_dlgReceivePmt1_title" aria-hidden="true">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_dpmt_dlgReceivePmt1_title">Receive Payment</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-lg-6">
                        <span class="simple-label">Payer</span>
                        <input id="_dpmt_receive_payer" class="form-control" readonly>
                    </div>
                    <div class="form-group col-lg-6">
                        <span class="simple-label">Package count</span>
                        <input id="_dpmt_receive_package_count" class="form-control" readonly>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        <span class="simple-label">Balance Due</span>
                        <input id="_dpmt_receive_amount_due" type="number" class="form-control" autocomplete="off" readonly>
                    </div>
                    <div class="col-lg-6">
                        <span class="simple-label">Amount</span>
                        <input id="_dpmt_receive_amount" type="number" class="form-control" autocomplete="off">
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-md-6">
                        <span class="simple-label">Payment method</span>
                        <select id="_dpmt_receive_pmt_method1" class="form-control" disabled>
                            <option value="Cash" selected>Cash</option>
                        </select>
                    </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">Amount in cash</span>
                        <input type="number" class="form-control" id="_dpmt_receive_cash">
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-md-6">
                        <span class="simple-label">Payment method</span>
                        <select id="_dpmt_receive_pmt_method2" class="form-control">
                            <option value="Wing">Wing</option>
                            <option value="ABA">ABA</option>
                            <option value="ACLEDA">ACLEDA</option>
                        </select>
                    </div>
                    <div class="form-group col-md-6">
                        <span class="simple-label">Amount (bank transfer)</span>
                        <input type="number" class="form-control" id="_dpmt_receive_noncash">
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <span class="simple-label">Description</span>
                        <input id="_dpmt_receive_notes" type="text" class="form-control" autocomplete="off">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <span id="_dpmt_error" class="error_text"></span>&nbsp;&nbsp;
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                    <i class="fa fa-times" style="color:red"></i>
                    <span>Cancel</span>
                </button>
                <button type="button" class="btn btn-primary" id="_dpmt_dlgReceivePmt_btnOK">
                    <i class="fas fa-check" style="color:#fff"></i>
                    <span>OK</span>
                </button>
            </div>
        </div>
    </div>
</div> -->

<div class="modal fade" id="_dpmt_dlgFilter" tabindex="-1" role="dialog" aria-labelledby="_dpmt_dlgFilterTitle" aria-hidden="true">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_dpmt_dlgFilterTitle">Filter Transactions</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-lg-12">
                        <span>
                            <img style="width:35px" src="{{ asset('assets/images/icons/deliveryman.png') }}" alt="">
                        </span>
                        <span id="_dpmt_filter_driver_name" class="fw-semibold p-1 text-primary"></span>
                    </div>
                    <div class="form-group col-lg-6">
                        <span class="simple-label">From</span>
                        <div> <input id="_dpmt_filter_start_date" data-field="start_date" class=" form-control dpmt_filter_field" data-select="datepicker" autocomplete="off"></div>
                    </div>
                    <div class="form-group col-lg-6">
                        <span class="simple-label">To</span>
                       <div> <input id="_dpmt_filter_end_date" data-field="end_date" class=" form-control dpmt_filter_field" data-select="datepicker" autocomplete="off"></div>
                    </div>

                    <div class="form-group col-lg-6">
                        <span class="simple-label">Delivery Status</span>
                        <select id="_dpmt_filter_package_status" data-field="status_id" class="modal-select2 dpmt_filter_field">
                            <option value="-1">(All)</option>
                            <option value="8" selected>Delivered</option>
                            <option value="6">On Delivery</option>
                            <option value="9">Failed</option>
                        </select>
                    </div>

                    <div class="form-group col-lg-6">
                        <span class="simple-label">Payment Status</span>
                        <select id="_dpmt_filter_pmt_status" data-field="driver_pmt_status_id" class="modal-select2 dpmt_filter_field">
                            <option value="-1">(All)</option>
                            <option value="0" selected>Unpaid</option>
                            <option value="2">Pending</option>
                            <option value="1">Paid</option>
                        </select>
                    </div>

                    <div class="form-group col-lg-6">
                        <span class="simple-label">Delivery Type</span>
                        <select id="_dpmt_filter_dtype" data-field="delivery_type" class="modal-select2 dpmt_filter_field">
                            <option value="">All Types</option>
                            <option value="Normal">Normal</option>
                            <option value="Fast">Fast</option>
                        </select>
                    </div>

                </div>
               
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                    <i class="fa fa-times" style="color:red"></i>
                    <span>Cancel</span>
                </button>
                <button type="button" class="btn btn-primary" id="_dpmt_dlgFilter_btnOK">
                    <i class="fa fa-list-alt" style="color:#fff"></i>
                    <span>OK</span>
                </button>
            </div>
        </div>
    </div>
</div>