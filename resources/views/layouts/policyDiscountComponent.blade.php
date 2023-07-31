<div id="_main_policyDiscountComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex gap-2">
        <button id="pld_btn_add" class="btn btn-sm btn-primary" type="button">
            <i class="fa-solid fa-plus"></i>
            <span class="trans-text" data-langprop="buttons.Add Policy"></span>
        </button>
        <input id="_pdl_search" type="search" class="form-control width--search-inner" placeholder="Search..."/>
        <button class="btn btn-sm btn-primary" type="button">
            <span class="trans-text" data-langprop="buttons.Filter By Year"></span>
            <i class="fa-solid fa-caret-down ps-2"></i>
        </button>
    </div>
    <div id="tbl_pld" class="table-responsive mt-3 p-3 border rounded-3 bg-white"></div>
</div>

<div id="dlg__pld" class="modal fade" tabindex="-1" aria-labelledby="dlg__pld_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="d-block">
                    <h5 class="modal-title"></h5>
                    <small class="modal-title--sm"></small>
                </div>
                <button class="btn-close" type="button" aria-label="Close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="price_list_id" class="form-label trans-text" data-langprop="titles.Name"></label>
                    <div class="width-select-dialog">
                        <select id="dlg_pld_price_list" class="modal-select2 data-input" data-field="price_list_id"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="pmt_option_id" class="form-label trans-text" data-langprop="titles.Payment Option"></label>
                    <div class="width-select-dialog">
                        <select id="dlg_pld_pmt_option" class="modal-select2 data-input" data-field="pmt_option_id"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="session_id" class="form-label trans-text" data-langprop="titles.Session"></label>
                    <div class="width-select-dialog">
                        <select id="dlg_pld_session" class="modal-select2 data-input" data-field="session_id"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="discount" class="form-label trans-text" data-langprop="titles.Discount"></label>
                    <input type="number" class="form-control data-input" data-field="discount"/>
                </div>
                <div class="form-group">
                    <label for="discount_type" class="form-label trans-text" data-langprop="titles.Discount Type"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="discount_type">
                            <option value="percentage">Percentage (%)</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-sm btn-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_pld_btn_save" class="btn btn-sm btn-primary" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>