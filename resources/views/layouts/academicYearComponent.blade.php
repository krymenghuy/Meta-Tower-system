<div id="_main_academicYearComponent" class="mobile-padding p-3" style="display:none">
    <div class="p-3 bg-white rounded-3">
        <button id="_adm_btn_new" class="btn btn-primary btn-sm" type="button">
            <span class="trans-text" data-langprop="buttons.New"></span>
        </button>
    </div>
    <div class="table-responsive p-3 bg-white rounded-3 mt-3">
        <table id="_adm_tbl" class="table"></table>
    </div>
</div>

<div class="modal fade" id="dlg_adm_" tabindex="-1" aria-labelledby="dlg_adm_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title"></h1>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="academic_year" class="form-label trans-text" data-langprop="titles.Academic Year"></label>
                    <input type="text" class="form-control data-input" data-field="academic_year"/>
                </div>
                <div class="form-group">
                    <label for="academic_year" class="form-label trans-text" data-langprop="titles.Start Date"></label>
                    <input data-select="datepicker" class="form-control data-input" data-field="start_date"/>
                </div>
                <div class="form-group">
                    <label for="academic_year" class="form-label trans-text" data-langprop="titles.End Date"></label>
                    <input data-select="datepicker" class="form-control data-input" data-field="end_date"/>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_adm_btn_save" type="button" class="btn btn-primary btn-sm btn-animate">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>