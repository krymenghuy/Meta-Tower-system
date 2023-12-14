<style>
    .sender-cod-info {
        display: flex;
        flex-direction: column;
    }

    .sender-cod-info-option,
    .sender-cod-info-percent {
        display: inline-block;
        padding: 3px;
        font-size: 0.9em;
    }

    .sender-cod-info-option {
        border: 0.8px solid orange;
        text-align: center;
        border-radius: 5px;
        font-weight: bold;
    }

    .sender-cod-info-percent {
        color: green;
    }
</style>

<div id="_main_senderListComponent" style="display:none;margin:15px">
    <div style="width:100%;display:flex;flex-direction:column">
        <div class="dms-content-header form-inline">
            <div class="form-inline" style="width:50%;margin-top:-25px;">
                <button id="_sdl_btnNewSender" href="javascript:void(0)" data-toggle="modal" class="btn btn-primary height" style="margin-top:35px">
                    <i class="la la-plus"></i>
                    <span class="kt-hidden-mobile">New Merchant</span>
                </button>
                <div style="width:15px"></div>
                <div>
                    <span class="simple-label">Merchant Type</span>
                    <select id="_sdl_filter_sender_type" class="form-control _sdl_filter_field height"></select> &nbsp;
                </div> &nbsp;
                <div class="d-none">
                    <span class="simple-label">Business Type</span>
                    <select id="_sdl_filter_business_type" class="form-control _sdl_filter_field height"></select>&nbsp;
                </div>&nbsp;
                <div class="v-control-group" style="display:none">
                    <span class="simple-label">Status</span>
                    <select id="_sdl_filter_sender_status" class="form-control _sdl_filter_field height"></select>&nbsp;
                </div>&nbsp;
                <div>
                    <span class="simple-label">Referred By</span>
                    <select id="_sdl_filter_sales_agent" class="select2 _sdl_filter_field height"></select>&nbsp;
                </div>
            </div>
            <div style="width:50%">
                <div class="form-inline" style="float:right">
                    <input type="text" class="form-control height" id="_sdl_search_sender" placeholder="search">&nbsp;
                    <button id="_sdl_btnSearch" role="button" class="btn btn-primary height">
                        <i class="fa fa-sync-alt"></i>
                    </button>
                    <div style="width:25px"></div>
                    <div style="float:right">
                        <button id="_sdl_btnPrint" class="btn btn-success height">
                            <i class="fa fa-print"></i>
                        </button>
                        <button id="_sdl_btnPDF" class="btn btn-primary height">
                            <i class="fa fa-file-pdf"></i>
                        </button>
                        <button id="_sdl_btnExcel" class="btn btn-default height">
                            <i class="fa fa-file-excel"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="dms-content-body flat-box" style="padding:10px;margin-top:10px">
            <table class="table" id="_sdl_tblSenders">
                <tbody id="_sdl_tblSenders_body"></tbody>
            </table>
        </div>
    </div>
</div>

<div class="modal fade" id="_sdl_dlgSender" tabindex="-1" role="dialog" aria-labelledby="_sdl_dlgSenderTitle" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_sdl_dlgSenderTitle">New Merchant</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="_sdl_dlgSender_body">
                <div id="_sdl_dlgSender_sender_panel">
                    <div class="row">
                        <div class="col-lg-6">
                            <span class="simple-label">Merchant ID</span>
                            <input type="text" class="form-control data-input" data-field="code" placeholder="AUTO" readOnly>
                        </div>
                        <div class="col-lg-6">
                            <span class="simple-label">Merchant Name</span>
                            <input type="text" class="form-control data-input" data-field="name">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-3">
                            <span class="simple-label">Merchant Type</span>
                            <select class="modal-select2 data-input" id="_sdl_sender_sendertype" data-field="sender_type_id"></select>
                        </div>
                        <div class="col-lg-3">
                            <span class="simple-label">Business Type</span>
                            <select class="modal-select2 data-input" data-field="business_type" id="_sdl_sender_businesstype"></select>
                        </div>
                        <div class="col-lg-3">
                            <span class="simple-label">Phone Number</span>
                            <input class="form-control data-input" type="text" data-field="phone_number" />
                        </div>
                        <div class="col-lg-3">
                            <span class="simple-label">Email</span>
                            <input type="email" class="form-control data-input" data-field="email">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <span class="simple-label">Address</span>
                            <textarea class="form-control data-input" data-field="address"></textarea>
                        </div>
                        <div class="col-lg-6">
                            <span class="simple-label">Refered By Agent</span>
                            <select id="_sdl_sales_agent" class="modal-select2 data-input" data-field="sales_agent_id"></select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-lg-3">
                            <span class="simple-label">COD</span>
                            <select id="_sdl_cod" class="form-control data-input" data-field="cod">
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                            </select>
                        </div>
                        <div class="form-group col-lg-3">
                            <span class="simple-label">COD Fee(%)</span>
                            <input id="_sdl_cod_fee" type="number" data-field="cod_fee" class="form-control data-input" placeholder="COD Fee %">
                        </div>
                        <div class="form-group col-lg-6">
                            <span class="simple-label">Price List</span>
                            <select id="_sdl_price_list" class="modal-select2 data-input" data-field="price_list_id"></select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6" style="margin-top:15px">
                        <span style="font-weight:bold;color:green;display:block">Primary Bank Account</span>
                        <div class="div-line" style="border-color:green"></div>
                        <div class="border-style1 primary_bank_panel" id="sender_primary_bank_panel">
                            <div>
                                <span class="simple-label">Bank Name</span>
                                <input type="text" data-field="bank_name" class="form-control data-input">
                                <input class="data-input" data-field="id" type="hidden">
                            </div>
                            <div>
                                <span class="simple-label">Account Number</span>
                                <input type="number" data-field="account_number" class="form-control data-input">
                            </div>
                            <div>
                                <span class="simple-label">Account Name</span>
                                <input type="text" data-field="account_name" class="form-control data-input">
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6" style="margin-top:15px">
                        <span style="font-weight:bold;color:orange;display:block">Secondary Bank Account</span>
                        <div class="div-line" style="border-color:orange"></div>
                        <div class="border-style1 secondary_bank_panel" id="sender_secondary_bank_panel">
                            <div>
                                <span class="simple-label">Bank Name</span>
                                <input type="text" data-field="bank_name" class="form-control data-input">
                                <input class="data-input" data-field="id" type="hidden">
                            </div>
                            <div>
                                <span class="simple-label">Account Number</span>
                                <input type="number" data-field="account_number" class="form-control data-input">
                            </div>
                            <div>
                                <span class="simple-label">Account Name</span>
                                <input type="text" data-field="account_name" class="form-control data-input">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <span id="_sdl_sender_error" class="error_text"></span>
                <button type="button" class="btn btn-default btn-secondary height" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-success height" id="_sdl_sender_btnSave">Save</button>
            </div>
        </div>
    </div>
</div>