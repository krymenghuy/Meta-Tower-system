<div id="_main_requestDiscountComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex gap-2 p-3 bg-white rounded-3">
        <button id="_rqdc_btn_new" class="btn btn-primary" type="button">
            <span class="trans-text" data-langprop="buttons.New Request"></span>
        </button>
        <div class="height-select2">
            <select class="modal-select2"></select>
        </div>
        <input type="search" class="form-control width--search-inner"/>
    </div>
    <div id="_rqdc_tbl" class="table-responsive p-3 bg-white rounded-3 mt-3"></div>
</div>

<div class="modal fade" id="dlg_rqdc_" tabindex="-1" aria-labelledby="dlg_rqdc_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="student_id" class="form-label trans-text" data-langprop="titles.Student Name"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="student_id"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="discount_type_id" class="form-label trans-text" data-langprop="titles.Discount Type"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="discount_type_id"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="amount" class="form-label trans-text" data-langprop="titles.Amount"></label>
                    <div class="width-select-dialog">
                        <input type="number" class="form-control data-input" data-field="amount"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="type" class="form-label trans-text" data-langprop="titles.Type"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="type"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="remarks" class="form-label trans-text" data-langprop="titles.Note"></label>
                    <textarea class="form-control data-input" data-field="remarks"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button type="button" class="btn btn-primary btn-sm">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>