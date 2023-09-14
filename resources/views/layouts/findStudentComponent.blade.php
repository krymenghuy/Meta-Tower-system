<div id="_main_findStudentComponent" class="mobile-padding p-3" style="display:none">
    <div id="div--fsd" class="div--fsd">
        <div class="d-flex gap-2">
            <input id="_fns_search" type="search" class="form-control width--search-inner data-input" data-field="search_value" placeholder="Search student"/>
            <button id="_fns_btnFind" class="btn btn-success btn-sm text-nowrap" type="button">
                <i class="fa-solid fa-magnifying-glass"></i>
                <span class="trans-text" data-langprop="buttons.Find"></span>
            </button>
            <button id="_fns_btn_filter" class="btn btn-primary btn-sm text-nowrap" type="button">
                <i class="fa-solid fa-filter"></i>
                <span class="trans-text" data-langprop="buttons.Filter"></span>
            </button>
        </div>
        <div id="_fns_student_list" class="p-3 mt-3 fns-set-overflow"></div>
    </div>
</div>

<div id="dlg_fns_" class="modal fade" tabindex="-1" aria-labelledby="dlg_fns_title" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <div class="d-block">
                    <h4 class="modal-title"></h4>
                    <small class="modal-title--sm"></small>
                </div>
                <button class="btn-close" type="button" aria-label="Close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="d-flex justify-content-between">
                    <div class="d-block">
                        <p class="pb-0 mb-1">
                            <span class="width-invoice-text">Student ID</span>
                            <span class="px-2">:</span>
                            <span class="data-invoice" data-field="student_code"></span>
                        </p>
                        <p class="pb-0 mb-1">
                            <span class="width-invoice-text">Student Name</span>
                            <span class="px-2">:</span>
                            <span class="data-invoice" data-field="student_name"></span>
                        </p>
                        <p class="pb-0 mb-1">
                            <span class="width-invoice-text">Class Name</span>
                            <span class="px-2">:</span>
                            <span class="data-invoice" data-field="level"></span>
                        </p>
                    </div>
                    <div class="d-block">
                        <p class="pb-0 mb-1">
                            <span class="width-invoice-text">Invoice#</span>
                            <span class="px-2">:</span>
                            <span class="data-invoice" data-field="invoice_number"></span>
                        </p>
                        <p class="pb-0 mb-1">
                            <span class="width-invoice-text">Invoice Date</span>
                            <span class="px-2">:</span>
                            <span class="data-invoice" data-field="inv_date"></span>
                        </p>
                        <p class="pb-0 mb-1">
                            <span class="width-invoice-text">Due Date</span>
                            <span class="px-2">:</span>
                            <span>
                                <input data-select="datepicker" class="data-invoice form-date data-input" data-field="due_date"/>
                            </span>
                        </p>
                    </div>
                </div>
                <div class="d-flex mt-3 pe-3">
                    <a href="javascript:void(0)" class="btn-tuition-fee ttn-fee" data-view="ttn-fee">
                        <span class="trans-text" data-langprop="titles.Tuition Fee"></span>
                    </a>
                    <a href="javascript:void(0)" class="btn-tuition-fee" data-view="n-ttn-fee">
                        <span class="trans-text" data-langprop="titles.Non Tuition Fee"></span>
                    </a>
                </div>
                <div id="dlg_fns_tbl" class="table-responsive p-3 rounded-3 bg-light"></div>
                <hr class="height-line"/>
                <div class="d-flex justify-content-end">
                    <div class="d-flex flex-column gap-3">
                        <p class="pb-0 mb-1 ps-0">
                            <span class="width-invoice-text">Deduct Deposite</span>
                            <span class="px-2">:</span>
                            <span class="data-invoice" data-field="deposite_amount"></span>
                        </p>
                        <p class="pb-0 mb-1 ps-0">
                            <span class="width-invoice-text">Total</span>
                            <span class="px-2">:</span>
                            <span id="inv_total" class="data-invoice" data-field="total"></span>
                        </p>
                    </div>
                </div>
                <div class="d-block">
                    <p>Note:</p>
                    <div class="px-3">
                        <textarea class="data-invoice form-control data-input" data-field="note"></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_fns_btn_save" class="btn btn-primary btn-sm btn-animate" type="button">
                    <span class="trans-text" data-langprop="buttons.Generate"></span>
                </button>
            </div>
        </div>
    </div>
</div>

<div id="_dlgStudentDiscount" class="modal fade" tabindex="-1" aria-labelledby="_dlgStudentDiscount_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title"></h4>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-lg-6">
                        <label for="student_name" class="form-label trans-text" data-langprop="titles.Student Name"></label>
                        <div><input class="form-control data-input" data-field="student_name" readonly></div>
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="level_name" class="form-label trans-text" data-langprop="titles.Price List"></label>
                        <div class="d-flex flex-row gap-1"><input class="form-control data-input" data-field="price_list_name" readonly /><input class="form-control data-input" data-field="admission_date" readonly></div>
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="policy_discount" class="form-label trans-text" data-langprop="titles.Policy Discount"></label>
                        <div><input class="form-control data-input" data-field="policy_discount"></div>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="special_discount" class="form-label trans-text" data-langprop="titles.Special Discount"></label>
                        <div><input class="form-control data-input" data-field="special_discount" /></div>
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="other_discount" class="form-label trans-text" data-langprop="titles.Other Discount"></label>
                        <div><input class="form-control data-input" data-field="other_discount" /></div>
                    </div>

                    <div class="form-group col-lg-12">
                        <label for="remarks" class="form-label trans-text" data-langprop="titles.Remarks"></label>
                        <input class="form-control data-input" data-field="remarks"/>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="_dlgStudentDiscount_btnSave" type="button" class="btn btn-primary btn-sm">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>