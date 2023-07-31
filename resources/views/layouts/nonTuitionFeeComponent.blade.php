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

<div id="dlg__ntf" class="modal fade" tabindex="-1" aria-labelledby="dlg__ntf_title" aria-hidden="true">
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
                    <label for="fee_type" class="form-label trans-text" data-langprop="titles.Fee Type"></label>
                    <input type="text" class="form-control data-input" data-field="fee_type"/>
                </div>
                <div class="form-group">
                    <label for="academic_period" class="form-label trans-text" data-langprop="titles.Academic Period"></label>
                    <input type="text" class="form-control data-input" data-field="academic_period"/>
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
            </div>
            <div class="modal-footer">
                <button class="btn btn-sm btn-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-sm btn-primary btn--save" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>