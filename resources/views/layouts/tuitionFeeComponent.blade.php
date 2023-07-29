<div id="_main_tuitionFeeComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex gap-2">
        <button class="btn btn-sm btn-primary btn--add" type="button">
            <i class="fa-solid fa-plus"></i>
            <span class="trans-text" data-langprop="buttons.Add Price List"></span>
        </button>
        <input type="search" class="form-control width--search-inner" placeholder="Search..."/>
        <button class="btn btn-sm btn-primary" type="button">
            <span class="trans-text" data-langprop="buttons.Filter By Year"></span>
            <i class="fa-solid fa-caret-down ps-2"></i>
        </button>
    </div>
    <div id="_ttf_tbl" class="table-responsive mt-3 p-3 bg-white border rounded-3"></div>
</div>

<div id="dlg__ttf" class="modal fade" tabindex="-1" aria-labelledby="dlg__ttf_title" aria-hidden="true">
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
                    <label for="program_id" class="form-label trans-text" data-langprop="titles.Program"></label>
                    <div class="width-select-dialog">
                        <select id="dlg_ttf_program" class="modal-select2 data-input" data-field="program_id"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="price_list_id" class="form-label trans-text" data-langprop="titles.Name"></label>
                    <div class="width-select-dialog">
                        <select id="dlg_ttf_price_list" class="modal-select2 data-input" data-field="list_id"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="start_date" class="form-label trans-text" data-langprop="titles.Start Date"></label>
                    <input data-select="datepicker" class="form-control data-input" data-field="start_date"/>
                </div>
                <div class="form-group">
                    <label for="end_date" class="form-label trans-text" data-langprop="titles.End Date"></label>
                    <input data-select="datepicker" class="form-control data-input" data-field="end_date"/>
                </div>
                <div class="form-group">
                    <label for="academic_year" class="form-label trans-text" data-langprop="titles.Academic Year"></label>
                    <input type="text" class="form-control data-input" data-field="academic_year"/>
                </div>
                <div class="form-group">
                    <label for="description" class="form-label trans-text" data-langprop="titles.Description"></label>
                    <textarea class="form-control data-input" data-field="description"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-sm btn-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_ttf_btn_save" class="btn btn-sm btn-primary" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>