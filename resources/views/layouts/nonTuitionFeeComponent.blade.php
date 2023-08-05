<div id="_main_nonTuitionFeeComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex gap-2">
        <button id="ntf_btn_add" class="btn btn-sm btn-primary" type="button">
            <i class="fa-solid fa-plus"></i>
            <span class="trans-text" data-langprop="buttons.Add List"></span>
        </button>
        <input type="search" class="form-control width--search-inner" placeholder="Search..."/>
        <button class="btn btn-sm btn-primary" type="button">
            <span class="trans-text" data-langprop="buttons.Filter By Year"></span>
            <i class="fa-solid fa-caret-down ps-2"></i>
        </button>
    </div>
    <div class="table-responsive mt-3 p-3 border rounded-3 bg-white">
        <table id="tbl_ntf" class="table"></table>
    </div>
</div>

<div id="dlg_ntf" class="modal fade" tabindex="-1" aria-labelledby="dlg_ntf_title" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <div class="d-block">
                    <h5 class="modal-title"></h5>
                    <small class="modal-title--sm"></small>
                </div>
                <button class="btn-close" type="button" aria-label="Close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="row row-cols-lg-2 gy-2">
                    <div class="col">
                        <div class="form-group">
                            <label for="fee_type" class="form-label trans-text" data-langprop="titles.Fee Type"></label>
                            <input type="text" class="form-control data-input" data-field="name"/>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="program_id" class="form-label trans-text" data-langprop="titles.Program"></label>
                            <div class="width-select-dialog">
                                <select id="dlg_ntf_program" class="modal-select2 data-input" data-field="program_id"></select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row row-cols-lg-2 gy-2">
                    <div class="col">
                        <div class="form-group">
                            <label for="amount" class="form-label trans-text" data-langprop="titles.Amount"></label>
                            <input type="number" class="form-control data-input" data-field="amount"/>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="currency_code" class="form-label trans-text" data-langprop="titles.Currency"></label>
                            <div class="width-select-dialog">
                                <select class="modal-select2 data-input" data-field="currency_code">
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row row-cols-lg-2 gy-2">
                    <div class="col">
                        <div class="form-group">
                            <label for="academic_year" class="form-label trans-text" data-langprop="titles.Academic Year"></label>
                            <div class="width-select-dialog">
                                <select id="dlg_ntf_academic" class="modal-select2 data-input" data-field="academic_year"></select>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <label for="description" class="form-label trans-text" data-langprop="titles.Description"></label>
                        <textarea class="form-control data-input" data-field="description"></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-sm btn-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_ntf_btn_save" class="btn btn-sm btn-primary" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>