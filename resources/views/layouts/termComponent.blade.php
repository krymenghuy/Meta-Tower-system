<div id="_main_termComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex flex-row p-3 bg-white rounded-3 justify-content-between">
        <div class="d-flex gap-2">
            <select id="_term_filter_academic_year" class="modal-select2"></select>
        </div>
        <button id="_trm_btn_new" class="btn btn-primary btn-sm" type="button">
            <i class="fa fa-plus"></i>
            <span class="trans-text" data-langprop="buttons.New Term"></span>
        </button>
    </div>
    <div id="_term_list" class="p-3 bg-white rounded-3 mt-3">
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
                <div class="row">
                    <div class="form-group col-lg-12">
                        <div id="_term_acad_year_label"></div>
                        <div class="width-select-dialog">
                            <select id="dlg_trm_academic" class="modal-select2 data-input" data-field="ac_year_id"></select>
                        </div>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="start_date" class="form-label trans-text" data-langprop="titles.Start Date"></label>
                        <input data-select="datepicker" class="form-control data-input" data-field="start_date"/>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="end_date" class="form-label trans-text" data-langprop="titles.End Date"></label>
                        <input data-select="datepicker" class="form-control data-input" data-field="end_date"/>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="period_type" class="form-label trans-text" data-langprop="titles.Type"></label>
                        <div class="width-select-dialog">
                            <select class="modal-select2 data-input" data-field="period_type">
                                <option value="Term">Term</option>
                                <option value="Semester">Semester</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="period_type" class="form-label trans-text" data-langprop="titles.Semester Number"></label>
                        <div class="width-select-dialog">
                            <select class="modal-select2 data-input" data-field="semester_number">
                                <option value="1">First</option>
                                <option value="2">Second</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group col-lg-12">
                        <label for="name" class="form-label trans-text" data-langprop="titles.Term Name"></label>
                        <input type="text" class="form-control data-input" data-field="name"/>
                    </div>        
                    <div class="form-group col-lg-12">
                        <label for="dlg_trm_prev_term" class="form-label trans-text" data-langprop="titles.Previous Term"></label>
                        <div class="width-select-dialog">
                            <select id="dlg_trm_prev_term" class="modal-select2 data-input" data-field="prev_term_id"></select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_trm_btn_save" class="btn btn-primary btn-sm btn-animate" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>

<div id="dlgAcadYear" class="modal fade" tabindex="-1" aria-labelledby="dlgAcadYear_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button class="btn-close" type="button" aria-label="Close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-lg-12">
                        <label for="_academic_year" class="form-label trans-text" data-langprop="titles.Academic Year"></label>
                        <div class="width-select-dialog">
                            <input id="_academic_year" class="form-control data-input" data-field="academic_year"/>
                        </div>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="start_date" class="form-label trans-text" data-langprop="titles.Start Date"></label>
                        <input data-select="datepicker" class="form-control data-input" data-field="start_date"/>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="end_date" class="form-label trans-text" data-langprop="titles.End Date"></label>
                        <input data-select="datepicker" class="form-control data-input" data-field="end_date"/>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlgAcadYear_btnSave" class="btn btn-primary btn-sm btn-animate" type="button">
                    <span class="trans-text" data-langprop="buttons.OK"></span>
                </button>
            </div>
        </div>
    </div>
</div>