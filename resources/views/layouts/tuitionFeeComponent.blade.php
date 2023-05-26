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
    <div class="table-responsive mt-3 p-3">
        <table class="table tbl-ttf"></table>
    </div>
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
                    <label for="name" class="form-label trans-text" data-langprop="titles.Name"></label>
                    <input type="text" class="form-control data-input" data-field="name"/>
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