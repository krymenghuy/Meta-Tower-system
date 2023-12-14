<div id="_main_saleAgentsComponent" style="display:none;" class="m-2">
    <div class="w-100">
        <div class="d-flex flex-row justify-content-between" id="div_filter_fields">
            <div class="d-flex gap-2">
                <input type="text" class="form-control" id="_sal_search_agent" placeholder="Search agent">
                <button id="_sal_btnSearch" class="btn btn-primary" type="button"><i class="fa fa-search"></i></button>
            </div>
            <div class="d-flex gap-2">
              <select  id="_sal_filter_agent_type" class="modal-select2 filter-field" data-field="agent_type"></select>
              <select  id="_sal_filter_agent_status" class="modal-select2 filter-field" data-field="status_code"></select>
            </div>
            <div class="d-flex gap-2">
               <button id="_sal_btnNewAgent" class="btn btn-primary" type="button"><i class="fa fa-user-plus"></i> <span class="trans-text" data-langprop="buttons.New Agent"></span></button>
               <button id="_sal_btnPrint" class="btn btn-secondary" type="button"><i class="fa fa-print"></i> <span class="trans-text" data-langprop="buttons.Print"></span></button>
            </div>
        </div>
        <div class="p-2 shadow rounded-3 bg-white mt-2">
            <div id="div_sales_agent_list"></div>
        </div>
    </div>
</div>

<div class="modal fade" id="_sal_dlgSalesAgent" tabindex="-1" role="dialog" aria-labelledby="_sal_dlgSalesAgentTitle" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_sal_dlgSalesAgentTitle">New Sales Agent</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="_sal_dlgSalesAgent_body">
                <div id="_sal_dlgSalesAgent_fields">
                    <div class="row">
                        <div class="col-lg-6">
                            <label class="simple-label">Agent ID</label>
                            <input type="text" class="form-control data-input" data-field="code" placeholder="AUTO" readOnly>
                        </div>
                        <div class="col-lg-6">
                            <label class="simple-label">Agent Type</label>
                            <select class="form-control data-input" id="_sal_agent_type" data-field="agent_type_id"></select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-3">
                            <label class="simple-label">Agent Name</label>
                            <input type="text" class="form-control data-input" data-field="name">
                        </div>
                        <div class="col-lg-3">
                            <label class="simple-label">Phone Number</label>
                            <input class="form-control data-input" data-field="phone_number" />
                        </div>
                        <div class="col-lg-3">
                            <label class="simple-label">Email</label>
                            <input class="form-control data-input" data-field="email">
                        </div>
                        <div class="col-lg-3">
                            <label class="simple-label">Commission (USD)</label>
                            <input type="number" class="form-control data-input" data-field="commission">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <label class="simple-label">Address</label>
                            <textarea class="form-control data-input" data-field="address"></textarea>
                        </div>
                    </div>
                </div>
                <div class="row" style="display:none">
                    <div class="col-lg-6" style="margin-top:15px">
                        <span style="font-weight:bold;color:green;display:block">Primary Bank Account</span>
                        <div class="div-line" style="border-color:green"></div>
                        <div class="border-style1 primary_bank_panel" id="_sal_primary_bank_panel">
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
                <span id="_sal_agent_error" class="error_text"></span>
                <button type="button" class="btn btn-default btn-secondary height" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-success height" id="_sal_dlgSalesAgent_btnSave">Save</button>
            </div>
        </div>
    </div>
</div>