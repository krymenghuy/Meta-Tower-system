<div id="_main_termComponent" class="mobile-padding p-3" style="display:none">
    <div class="p-3 bg-white rounded-3">
        <button id="_trm_btn_new" class="btn btn-primary btn-sm" type="button">
            <span class="trans-text" data-langprop="buttons.New"></span>
        </button>
    </div>
    <div class="table-responsive p-3 bg-white rounded-3 mt-3">
        <table id="_trm_tbl" class="table"></table>
    </div>
</div>

<div id="dlg_trm_" class="modal fade" tabindex="-1" aria-labelledby="dlg_trm_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button class="btn-close" type="button" aria-label="Close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="name" class="form-label trans-text" data-langprop="titles.Name"></label>
                    <input type="text" class="form-control data-input" data-field="name"/>
                </div>
                <div class="form-group">
                    <label for="period_type" class="form-label trans-text" data-langprop="titles.Period Type"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="period_type">
                            <option value="Term">Term</option>
                            <option value="Semester">Semester</option>
                        </select>
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
                    <div class="width-select-dialog">
                        <select id="dlg_trm_academic" class="modal-select2 data-input" data-field="academic_year"></select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_trm_btn_save" class="btn btn-primary btn-sm" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>