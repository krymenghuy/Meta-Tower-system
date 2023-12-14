<style>
    .billing-balance-due {
        display: inline-block;
        color: orange;
        font-size: 1.2em;
        font-weight: bold;
        padding: 5px;
    }

    span.dms-sender_not_confirmed {
        content: 'Unconfirmed';
        display: block;
        color: orange;
        padding: 3px;
        font-size: 0.7em;
    }

    span.dms-sender_not_confirmed:before {
        content: 'Unconfirmed';
    }

    span.dms-sender_confirmed {
        display: block;
        color: green;
        padding: 3px;
        font-size: 0.7em;
    }

    span.dms-sender_confirmed:before {
        content: 'Confirmed';
    }

    .trx-img {
        max-width: 80px;
        max-height: 80px;
        border: 1px solid grey;
    }

    table#_spmt_tblItems>thead th,
    table#_spmt_tblPmts>thead th {
        text-transform: uppercase;
        font-size: 0.8em;
        color: #4E5151;
    }

    div.bl-report_filter_panel {
        border-radius: 3px;
        border: 1.1px solid #E1E5E5;
        padding: 10px;
    }

    table#_spmt_tblItems>.col-input {
        min-width: 100px;
    }

    a#_spmt_trx_delete_attachment {
        color: red;
    }

    .title-sender-account {
        font-size: 0.7em;
        color: green;
        display: block;
        padding: 2px;
    }
</style>

<div id="_main_senderPmtComponent" style="display:none;padding:5px">
    <div id="_spmt_content" class="w-100 p-3">
        <div class="tab-view" id="_spmt_senderTabView">
            <div class="tab-header gap-2 set-parent-active">
                <a href="javascript:void(0)" class="tab-button active" data-viewname="spmt_deliveries" data-target="_spmt_panel_deliveries">
                    <span class="p-2 rounded-3 border bg-white">DELIVERIES</span>
                </a>
                <a href="javascript:void(0)" class="tab-button" data-viewname="spmt_payments" data-target="_spmt_panel_payments">
                    <span class="p-2 rounded-3 border bg-white">TRANSACTIONS</span>
                </a>
                <a href="javascript:void(0)" class="tab-button" data-viewname="spmt_reports" data-target="_spmt_panel_reports">
                    <span class="p-2 rounded-3 border bg-white">REPORTS</span>
                </a>
            </div>
            <div class="tab-body mt-1">
                <div class="tab-panel" id="_spmt_panel_deliveries" style="height:65vh" data-viewname="spmt_deliveries">
                    <div class="d-flex flex-column bg-white rounded-3 p-3 border">
                        <div class="d-flex justify-content-between">
                            <div class="d-flex gap-2" id="_spmt_filter_panel">
                                <div class="min-width-select" style="display:none">
                                    <select class="select2 height" id="_spmt_filter_deliveries_warehouse" data-placeholder="Choose Warehouse"></select>
                                </div>
                                <div class="min-width-select">
                                    <select class="select2 height" id="_spmt_filter_deliveries_sender" data-placeholder="Choose Merchant"></select>
                                </div>
                                <button type="button" id="_spmt_btnToggleFilter" class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-list-alt fs-5"></i>
                                </button>
                                <button id="_spmt_btnSelectAll" type="button" class="btn btn-sm btn-outline-success">
                                    <i class="fa fa-check fs-5"></i>
                                    <span>All</span>
                                </button>
                            </div>
                            <div class="input-group flex-nowrap min-width-search">
                                <input type="text" id="_spmt_search" class="form-control" placeholder="Search package" autocomplete="false">
                                <div class="input-group-text" id="_spmt_btnSearch" role="button">
                                    <i class="fas fa-sync-alt fs-5 text-success"></i>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-cotnent-btween mt-3">
                            <div class="d-flex gap-2">
                                <div class="d-flex gap-2">
                                    <a style="display:none" id="_spmt_btnPay" href="javascript:void(0)">
                                        <span class="btn btn-sm btn-outline-success">Pay Merchant</span>
                                    </a>
                                    <a style="display:none" id="_spmt_btnReceivePmt" href="javascript:void(0)">
                                        <span class="btn btn-sm btn-outline-success">Receive Pmt</span>
                                    </a>
                                    <a style="display:none" id="_spmt_btnSettleZero" href="javascript:void(0)">
                                        <span class="btn btn-sm btn-outline-success">Settle</span>
                                    </a>
                                </div>
                                <div class="d-flex gap-2 border border-secondary shadow rounded-2 align-items-center bg-white">
                                    <span class="fw-semibold p-1 trans-text" data-langprop="titles.Balance: "></span>
                                    <span id="_spmt_balance_due" class="fw-semibold text-dark p-1">$0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-responsive p-3 rounded-3 mt-3 bg-white border table-responsive-hover">
                        <table id="_spmt_tblItems" class="table"></table>
                    </div>
                </div>
                <div class="tab-panel" id="_spmt_panel_payments" style="height:65vh" data-viewname="spmt_payments">
                    <!-- <div class="row">
                        <div class="col-lg-12">
                            <div class="d-flex gap-2" id="_spmt_filter_panel">
                                <div class="min-width-select">
                                    <select class="select2 spmt_filter_field" id="_spmt_filter_pmt_sender"></select>
                                </div>
                                <div>
                                    <input id="_spmt_filter_pmt_startdate" class="form-control spmt_filter_field" data-select="datepicker">
                                </div>
                                <div>
                                    <input id="_spmt_filter_pmt_enddate" class="form-control spmt_filter_field" data-select="datepicker">
                                </div>
                            </div>
                        </div>
                    </div> -->
                   
                    <div class="d-flex justify-content-between bg-white p-2 shadow border rounded-3">
                            <div class="d-flex flex-row gap-2">
                                        <div class="d-flex flex-column min-width-select">
                                           <label for="_spmt_filter_pmt_sender" class="trans-text fw-semibold ml-1" data-langprop="titles.Merchant"></label>  
                                           <select class="select2 spmt_filter_field" id="_spmt_filter_pmt_sender" data-field="agent_id"></select>
                                        </div>
                                         
                                        <div class="d-flex flex-column min-width-select">
                                           <label for="_spmt_filter_trx_type" class="trans-text fw-semibold ml-1" data-langprop="titles.Trans Type"></label>  
                                           <select class="select2 spmt_filter_field" id="_spmt_filter_trx_type" data-field="trx_type">
                                            <option value="">All</option>
                                            <option value="disbursement">Money Out</option>
                                            <option value="receipt">Money In</option>
                                           </select>
                                        </div>
                                         
                                        <div class="d-flex flex-column">
                                            <label for="_spmt_filter_pmt_startdate" class="trans-text fw-semibold ml-1" data-langprop="titles.From Date"></label>   
                                            <div> <input id="_spmt_filter_pmt_startdate" class="form-control spmt_filter_field" data-field="start_date" data-select="datepicker"> </div>
                                        </div>
                                        <div class="d-flex flex-column">
                                            <label for="_spmt_filter_pmt_enddate" class="trans-text fw-semibold ml-1" data-langprop="titles.To Date"></label>    
                                           <div> <input id="_spmt_filter_pmt_enddate" class="form-control spmt_filter_field" data-field="end_date" data-select="datepicker"> </div>
                                        </div>
                            </div>
                            <div class="d-flex gap-2">
                               <div>
                                    <button id="_spmt_btnPrint" class="btn btn-primary mt-4"><i class="fa fa-print"></i> Print</button>
                               </div>
                            </div>
                    </div>

                    <div class="d-flex justify-content-between p-2 pl-4 pr-4 bg-white p-2 shadow border rounded-3 mt-1">
                         <div class="d-flex flex-column mt-1">
                                <div class="d-flex gap-2 mt-1">
                                    <span class="fw-semibold fs-5">Total: </span>
                                    <span id="_spmt_pmt_total" class="fw-semibold fs-5">$0</span>
                                </div>
                                <div id="_spmt_pmt_breakdown" class="mt-1 d-flex flex-row border-top border-lg border-primary p-2 gap-3">
                                        <span>ACLEDA 120 USD</span>
                                </div> 
                          </div>
                          <div class="d-flex gap-2 mt-1">
                               <span class="fw-semibold fs-5">Transaction Count: </span>
                               <span id="_spmt_pmt_count" class="fw-semibold fs-5">0</span>
                          </div>
                          <div>
                          <button id="_spmt_btnApproveAll" class="btn btn-primary"><i class="fa fa-check"></i> <span class="trans-text" data-langprop="buttons.Approve All"></span></button>
                          </div>  
                    </div>
                    <div class="shadow border rounded-3 p-2 w-100 bg-white mt-2">
                       <div id="_spmt_pmt_list" class="w-100"></div>
                    </div>

                </div>
                <div class="tab-panel flat-box" id="_spmt_panel_reports" style="height:65vh" data-viewname="spmt_reports">
                    <div class="bg-white rounded-3 p-3">
                        <div class="div-line" style="border-color:#E7ECEC;width:30%"></div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="bl-report_filter_panel" style="padding:15px;">
                                    <div class="form-group">
                                        <span class="simple-label">Merchant name</span>
                                        <div class="w-100">
                                            <select class="select2" id="_spmt_rptfilter_sender" data-placeholder="Choose merchant"></select>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <span class="simple-label">Pmt. status</span>
                                        <div class="w-100">
                                            <select class="select2" id="_spmt_rptfilter_sender_pmt_status" data-placeholder="(Paid & Unpaid)">
                                                <option value="-1" selected>(Paid & Unpaid)</option>
                                                <option value="0">Unpaid</option>
                                                <option value="1">Paid</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="d-flex gap-2">
                                        <div class="form-group w-50">
                                            <span class="simple-label">From</span>
                                            <div>
                                                <input id="_spmt_rptfilter_start_date" class="form-control" data-select="datepicker">
                                            </div>
                                        </div>
                                        <div class="form-group w-50">
                                            <span class="simple-label">To</span>
                                            <div>
                                                <input id="_spmt_rptfilter_end_date" class="form-control" data-select="datepicker">
                                            </div>
                                        </div>
                                    </div>
                                    <div style="height:10px;"></div>
                                    <div class="form-inline">
                                        <button id="_spmt_btnRunReport" type="button" class="btn btn-sm btn-success">
                                            <i class="fa fa-list-alt fs-5"></i>
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
 
<div class="modal fade" id="_spmt_dlgFilter" tabindex="-1" role="dialog" aria-labelledby="_spmt_dlgFilterTitle"
    aria-hidden="true">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_spmt_dlgFilterTitle">Filter Transactions</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-lg-12">
                        <span id="_spmt_filter_sender_name" class="text-primary p-1 fw-semibold"></span>
                    </div>
                    <div class="form-group col-lg-6">
                        <span class="simple-label">From</span>
                        <div>
                            <input id="_spmt_filter_start_date" data-field="start_date"class=" form-control spmt_filter_field" data-select="datepicker" autocomplete="off">
                        </div>
                    </div>
                    <div class="form-group col-lg-6">
                        <span class="simple-label">To</span>
                        <div>
                            <input id="_spmt_filter_end_date" data-field="end_date"
                             class=" form-control spmt_filter_field" data-select="datepicker" autocomplete="off">
                        </div>
                    </div>
                    <div class="form-group col-lg-6">
                        <span class="simple-label">Delivery Status</span>
                        <select id="_spmt_filter_package_status" data-field="status_id"
                            class="modal-select2 spmt_filter_field">
                            <option value="-1">(All)</option>
                            <option value="8" selected>Delivered</option>
                            <option value="6">On Delivery</option>
                            <option value="9">Failed</option>
                        </select>
                    </div>
                    <div class="form-group col-lg-6">
                        <span class="simple-label">Payment Status</span>
                        <select id="_spmt_filter_pmt_status" data-field="sender_pmt_status_id"
                            class="modal-select2 spmt_filter_field">
                            <option value="-1">(All)</option>
                            <option value="0" selected>Unpaid</option>
                            <option value="1">Paid</option>
                        </select>
                    </div>
                    <div class="form-group col-lg-6">
                        <span class="simple-label">Delivery Type</span>
                        <select id="_spmt_filter_dtype" data-field="delivery_type"
                            class="modal-select2 spmt_filter_field">
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
                    Cancel
                </button>
                <button type="button" class="btn btn-primary" id="_spmt_dlgFilter_btnOK">
                    <i class="fa fa-list-alt" style="color:#fff"></i>
                    OK
                </button>
            </div>
        </div>
    </div>
</div>
