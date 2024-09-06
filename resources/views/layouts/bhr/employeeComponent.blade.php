<div id="_main_employeeComponent" class="m-3" style="display:none;">
    <div class="d-flex justify-content-between shadow rounded-3 p-3 bg-white">
        <div class="d-flex gap-2">
            <div class="d-flex gap-2">
                <input type="text" class="form-control" id="_sdl_search_sender" placeholder="Search merchant">
                <button id="_sdl_btnSearch" role="button" class="btn btn-secondary height">
                    <i class="la la-search"></i>
                </button>
            </div>
            <div class="d-flex gap-2" id="_sdl_filter_fields">
                <!-- <div class="min-width-select">
                    <select id="_sdl_filter_business_type" class="d-none modal-select2 filter-field" data-field="business_type"></select>
                </div> -->
                <!-- <div class="min-width-select">
                    <select id="_sdl_filter_sender_status" class="modal-select2 filter-field" data-field="status_code">
                        <option value="">(All Statuses)</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div> -->
                <div>
                    <button id="_sdl_btnFilter" role="button" class="btn btn-primary height">
                        <i class="la la-filter"></i>
                        <span class="filter-info position-absolute text-center"></span>
                    </button>
                </div>
            </div>
        </div>
        <div class="d-flex flex-row gap-2">
            <button id="_sdl_btnNewSender" data-toggle="modal" class="btn btn-primary">
                <i class="la la-plus fs-5"></i>
                <span class="kt-hidden-mobile " vslang="titles.New Merchant"></span>
            </button>
            <button id="_sdl_btnPrint" class="btn btn-success height">
                <i class="fa fa-print fs-5"></i>
                <span class="" vslang="buttons.Print"></span>
            </button>
            <!-- <button id="_sdl_btnExcel" class="btn btn-primary height">
                <i class="fa fa-file-excel fs-5"></i>
                <span class="" vslang="buttons.Excel"></span>
            </button> -->
        </div>
    </div>
    <div class="rounded-3 mt-3 bg-transparent">
        <div id="_sdl_employee_list"></div>
    </div>
</div>

<div class="modal fade" id="_sdl_dlgSender" tabindex="-1" role="dialog" aria-labelledby="_sdl_dlgSenderTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title " id="_sdl_dlgSenderTitle" vslang="titles.New Merchant"></h4>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" style="height:75vh; overflow-y:auto">
                <div class="row" id="div_merchant_info">
                    <div class="form-group col-lg-6">
                        <label for="code" class="form-label " vslang="titles.Merchant ID"></label>
                        <input type="text" class="form-control data-input" data-field="code" placeholder="AUTO" readonly/>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label " vslang="titles.Merchant Name"></label>
                        <input type="text" class="form-control data-input" data-field="name"/>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="sender_type_id" class="form-label " vslang="titles.Merchant Type"></label>
                        <select class="modal-select2 data-input" id="_sdl_sender_sendertype" data-field="sender_type_id"></select>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="business_type" class="form-label " vslang="titles.Business"></label>
                        <select class="modal-select2 data-input" data-field="business_type" id="_sdl_sender_businesstype"></select>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="phone_number" class="form-label " vslang="titles.Phone Number"></label>
                        <input class="form-control data-input" type="text" data-field="phone_number"/>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="email" class="form-label " vslang="titles.Email"></label>
                        <input type="email" class="form-control data-input" data-field="email"/>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="cod" class="form-label " vslang="titles.COD"></label>
                        <select id="_sdl_cod" class="modal-select2 data-input" data-field="cod">
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="cod_fee" class="form-label">
                            <span class="" vslang="titles.COD Fee"></span>
                            <span>%</span>
                        </label>
                        <input id="_sdl_cod_fee" type="number" data-field="cod_fee" class="form-control data-input" placeholder="COD Fee %"/>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="price_list_id" class="form-label " vslang="titles.Price List"></label>
                        <select id="_sdl_price_list" class="modal-select2 data-input" data-field="price_list_id"></select>
                    </div>
                    <div class="col-lg-6">
                        <label for="sales_agent_id" class="form-label " vslang="titles.Referrer"></label>
                        <select id="_sdl_sales_agent" class="modal-select2 data-input" data-field="sales_agent_id"></select>
                    </div>
                    <div class="form-group col-lg-12">
                        <label for="address" class="form-label " vslang="titles.Address"></label>
                        <textarea class="form-control data-input" data-field="address"></textarea>
                    </div>
                    <div class="form-group col-lg-12">
                        <label for="address_link" class="form-label " vslang="titles.Pin Address"></label>
                        <textarea class="form-control data-input" data-field="address_link"></textarea>
                    </div>
                </div>
                <div class="row" id="div_bank_account">
                    <div class="col-lg-6" style="margin-top:15px">
                        <span class="fw-bold border-success">Primary Bank Account</span>
                        <div class="div-line border-success"></div>
                        <div class="border-style1 primary_bank_panel" id="sender_primary_bank_panel">
                            <div>
                                <span class="simple-label">Bank Name</span>
                                <input type="text" data-field="bank_name" class="form-control data-input">
                                <input class="data-input" data-field="id" type="hidden"/>
                            </div>
                            <div>
                                <span class="simple-label">Account Number</span>
                                <input type="number" data-field="account_number" class="form-control data-input"/>
                            </div>
                            <div>
                                <span class="simple-label">Account Name</span>
                                <input type="text" data-field="account_name" class="form-control data-input"/>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6" style="margin-top:15px">
                        <span class="fw-bold text-warning">Secondary Bank Account</span>
                        <div class="div-line border-warning"></div>
                        <div class="border-style1 secondary_bank_panel" id="sender_secondary_bank_panel">
                            <div>
                                <span class="simple-label">Bank Name</span>
                                <input type="text" data-field="bank_name" class="form-control data-input">
                                <input class="data-input" data-field="id" type="hidden"/>
                            </div>
                            <div>
                                <span class="simple-label">Account Number</span>
                                <input type="number" data-field="account_number" class="form-control data-input"/>
                            </div>
                            <div>
                                <span class="simple-label">Account Name</span>
                                <input type="text" data-field="account_name" class="form-control data-input"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <span id="_sdl_sender_error" class="error_text"></span>
                <button type="button" class="btn btn-default btn-secondary" data-bs-dismiss="modal">
                    <span class="" vslang="buttons.Cancel"></span>
                </button>
                <button type="button" class="btn btn-success" id="_sdl_sender_btnSave">
                    <span class="" vslang="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- <div class="modal fade" id="dlg_sdl_add_user" tabindex="-1" aria-labelledby="dlg_sdl_add_user_title" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title " vslang="titles.Create Merchant Login"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                    <span class="" vslang="buttons.Cancel"></span>
                </button>
                <button id="dlg_sdl_add_user_btn_save" type="button" class="btn btn-sm btn-primary">
                    <span class="" vslang="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div> -->