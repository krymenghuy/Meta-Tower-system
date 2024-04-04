<div id="_main_customerListComponent" style="display:none;">
    <div class="d-flex justify-content-between shadow rounded-3 p-3 bg-white">
        <div class="d-flex gap-2">
            <div class="d-flex gap-2" id="_cuslist_filter_fields">
               <div class="min-width-select">
                    <select id="_cuslist_filter_agent" class="d-none modal-select2 filter-field" data-field="sales_agent_id"></select>
                </div>
                <!-- <div style="display:none" class="min-width-select">
                    <select id="_cuslist_filter_business_type" class="d-none modal-select2 filter-field" data-field="business_type"></select>
                </div> -->
                <div class="min-width-select">
                    <select id="_cuslist_filter_customer_status" class="modal-select2 filter-field" data-field="status_id">
                    </select>
                </div>
                <div>
                   <button type="button" class="btn btn-primary"><i class="fa fa-filter"></i></button>   
                </div>
            </div>
        </div>
        <div class="d-flex flex-row gap-2">
            <button id="_cuslist_btnCustomer" data-toggle="modal" class="btn btn-primary">
                <i class="la la-plus fs-5"></i>
                <span class="kt-hidden-mobile trans-text" data-langprop="titles.New Customer"></span>
            </button>
            <button id="_cuslist_btnPrint" class="btn btn-success height">
                <i class="fa fa-print fs-5"></i>
                <span class="trans-text" data-langprop="buttons.Print"></span>
            </button>
        </div>
    </div>

    <div class="d-flex justify-content-between shadow rounded-3 p-3 bg-white mt-2">
        <div class="d-flex gap-2">
            <div class="d-flex gap-1">
                <input type="text" id="_cuslist_Search" class="form-control" placeholder="Search customer">
                <button id="_cuslist_btnSearch" role="button" class="btn btn-outline-primary height">
                    <i class="la la-search"></i>
                </button>
            </div>
            <div class="d-flex gap-2">
                
            </div>
        </div>

        <div class="d-flex flex-row gap-2">
           
        </div>

    </div>

    <div class="rounded-3 mt-3 p-2">
        <div id="_cuslist_customer_list"></div>
    </div>
</div>

<div class="modal fade" id="_cuslist_dlgCustomer" tabindex="-1" role="dialog" aria-labelledby="_cuslist_dlgCustomerTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title trans-text" id="_cuslist_dlgCustomerTitle" data-langprop="titles.New Customer"></h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" style="height:75vh;overflow-y:auto">
                <div class="row" id="div_lead_info">
                    <div class="form-group col-lg-6">
                        <label for="code" class="form-label trans-text" data-langprop="titles.Customer ID"></label>
                        <input type="text" class="form-control data-input" data-field="code" placeholder="AUTO" readonly/>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="titles.Name"></label>
                        <input type="text" class="form-control data-input" data-field="name"/>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="sender_type_id" class="form-label trans-text" data-langprop="titles.Category"></label>
                        <select class="modal-select2 data-input" id="_cuslist_category" data-field="category_id"></select>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="business_type" class="form-label trans-text" data-langprop="titles.Business"></label>
                        <select class="modal-select2 data-input" data-field="business_type" id="_cuslist_lead_businesstype"></select>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="phone_number" class="form-label trans-text" data-langprop="titles.Phone Number"></label>
                        <input class="form-control data-input" type="text" data-field="phone_number"/>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="email" class="form-label trans-text" data-langprop="titles.Email"></label>
                        <input type="email" class="form-control data-input" data-field="email"/>
                    </div>
                    <div style="display:none" class="form-group col-lg-6">
                        <label for="cod" class="form-label trans-text" data-langprop="titles.COD"></label>
                        <select id="_cuslist_cod" class="modal-select2 data-input" data-field="cod">
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>
                    <div style="display:none" class="form-group col-lg-6">
                        <label for="cod_fee" class="form-label">
                            <span class="trans-text" data-langprop="titles.COD Fee"></span>
                            <span>%</span>
                        </label>
                        <input id="_cuslist_cod_fee" type="number" data-field="cod_fee" class="form-control data-input" placeholder="COD Fee %"/>
                    </div>
                    <div style="display:none" class="form-group col-lg-6">
                        <label for="price_list_id" class="form-label trans-text" data-langprop="titles.Price List"></label>
                        <select id="_cuslist_price_list" class="modal-select2 data-input" data-field="price_list_id"></select>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="sales_agent_id" class="form-label trans-text" data-langprop="titles.Referrer"></label>
                        <select id="_cuslist_sales_agent" class="modal-select2 data-input" data-field="sales_agent_id"></select>
                    </div>
                    <div class="form-group col-lg-12">
                        <label for="address" class="form-label trans-text" data-langprop="titles.Address"></label>
                        <textarea class="form-control data-input" data-field="address"></textarea>
                    </div>
                </div>
                <div class="row" id="lead_div_bank_account">
                            <div class="form-group col-lg-3">
                                <span class="simple-label">Bank Name</span>
                                <input type="text" data-field="bank_name" class="form-control data-input">
                            </div>
                            <div class="form-group col-lg-3">
                                <span class="simple-label">Account Number</span>
                                <input type="number" data-field="account_number" class="form-control data-input"/>
                            </div>
                            <div class="form-group col-lg-3">
                                <span class="simple-label">Account Name</span>
                                <input type="text" data-field="account_name" class="form-control data-input"/>
                            </div>
                </div>
            </div>
            <div class="modal-footer">
                <span id="_cuslist_sender_error" class="error_text"></span>
                <button type="button" class="btn btn-default btn-secondary" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button type="button" class="btn btn-success" id="_cuslist_dlgCustomer_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>