<style>
    .btn-act{
        padding: 4px 20px;
        color: #008767;
        background-color: #16c0985c;
        border: 2px solid #008767;
    }
    .btn-act-inactive{
        padding: 4px 20px;
        color: #fe1f1f;
        background-color: #ff000059;
        border: 2px solid #fe1f1f;
    }
    td .d-block{
        padding: 18px 0;
    }
    .kt-aside--fixed .kt-aside {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 98;
  }
</style>
<div id="_main_suppliersComponent" style="display:none; margin-right:15px;">
    <div class="d-flex justify-content-between shadow rounded-3 p-3 bg-white">
        <div class="d-flex gap-2">
            <div class="d-flex gap-2">
                <input type="text" class="form-control" id="_sdl_search_sender" placeholder="Search Supplier">
                <button id="_sdl_btnSearch" role="button" class="btn btn-primary height">
                    <i class="la la-search"></i>
                </button>
            </div>
            <div class="d-flex gap-2" id="_sdl_filter_fields">
                <div class="min-width-select d-none">
                    <select id="_sdl_filter_business_type" class="d-none modal-select2 filter-field" data-field="business_type"></select>
                </div>
                <div class="min-width-select">
                    <select id="_sdl_filter_sender_status" class="modal-select2 filter-field" data-field="status_code">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="d-flex flex-row gap-2">
            <button id="_sdl_btnNewSupplier" data-toggle="modal" class="btn btn-primary">
                <i class="la la-plus fs-5"></i>
                <span class="kt-hidden-mobile trans-text" data-langprop="titles.New Supplier"></span>
            </button>
            <button id="_sdl_btnPrint" class="btn btn-success height">
                <i class="fa fa-print fs-5"></i>
                <span class="trans-text" data-langprop="buttons.Print"></span>
            </button>
            <button id="_sdl_btnExcel" class="btn btn-primary height">
                <i class="fa fa-file-excel fs-5"></i>
                <span class="trans-text" data-langprop="buttons.Excel"></span>
            </button>
        </div>
    </div>
    <div class="rounded-3 mt-3 bg-white ">
        <div id="_sdl_supplier_list" ></div>
    </div>
</div>

<div class="modal fade" id="_sdl_dlgSupplier" tabindex="-1" role="dialog" aria-labelledby="_sdl_dlgSupplierTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title trans-text" id="_sdl_dlgSupplierTitle" data-langprop="titles.New Merchant"></h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row" id="div_merchant_info">
                    <div class="col-xs-12 col-md-12 col-lg-3">
                        <div class="d-flex align-items-center"> <div id="_supplier_profile_photo" style="height:165px" class="mt-2"></div></div>
                     </div>
                     <div class="col-9">
                        <div class="row">
                            <div class="form-group col-lg-6">
                                <label for="id" class="form-label trans-text" data-langprop="titles.Supplier ID"></label>
                                <input type="text" class="form-control data-input" data-field="id" placeholder="AUTO" readonly/>
                                <input type="hidden" class="form-control data-input" data-field="code" placeholder="AUTO" readonly/>
                            </div>
                            <div class="form-group col-lg-6">
                                <label for="name" class="form-label trans-text" data-langprop="titles.Merchant Name"></label>
                                <input type="text" class="form-control data-input" data-field="name"/>
                            </div>
                            
                            <div class="form-group col-lg-6">
                                <label for="phone_number" class="form-label trans-text" data-langprop="titles.Phone Number"></label>
                                <input class="form-control data-input" type="text" data-field="phone_number"/>
                            </div>
                            <div class="form-group col-lg-6">
                                <label for="email" class="form-label trans-text" data-langprop="titles.Email"></label>
                                <input type="email" class="form-control data-input" data-field="email"/>
                            </div>
                        </div>
                     </div>
                    
                    
                    <div class="form-group col-lg-6">
                        <label for="price_list_id" class="form-label trans-text" data-langprop="titles.Price List"></label>
                        <select id="_sdl_price_list" class="modal-select2 data-input" data-field="price_list_id"></select>
                    </div>
                    <div class="col-lg-6">
                        <label for="sales_agent_id" class="form-label trans-text" data-langprop="titles.Referrer"></label>
                        <select id="_sdl_sales_agent" class="modal-select2 data-input" data-field="sales_agent_id"></select>
                    </div>
                    <div class="form-group col-lg-12">
                        <label for="address" class="form-label trans-text" data-langprop="titles.Address"></label>
                        <textarea class="form-control data-input" data-field="address"></textarea>
                    </div>
                    <input type="hidden" class="form-control data-input" data-field="status_code"  />

                </div>
                
            </div>
            <div class="modal-footer">
                <span id="_sdl_sender_error" class="error_text"></span>
                <button type="button" class="btn btn-default btn-secondary" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button type="button" class="btn btn-success" id="_sdl_supplier_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="dlg_sdl_add_user" tabindex="-1" aria-labelledby="dlg_sdl_add_user_title" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title trans-text" data-langprop="titles.Create Merchant Login"></h5>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_sdl_add_user_btn_save" type="button" class="btn btn-sm btn-primary">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>