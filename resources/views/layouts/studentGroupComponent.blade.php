<div id="_main_studentGroupComponent" class="mobile-padding p-3" style="display:none">
    <div class="p-3 bg-white rounded-3">
        <button id="_sdg_btn_new" class="btn btn-primary btn-sm" type="button">
            <i class="fa-solid fa-plus"></i>
            <span class="trans-text" data-langprop="buttons.Add Group"></span>
        </button>
    </div>
    <div class="table-responsive p-3 mt-3 rounded-3 bg-white">
        <table id="_sdg_tbl" class="table"></table>
    </div>
</div>

<div id="dlg_sdg_" class="modal fade" tabindex="-1" aria-labelledby="dlg_sdg_title" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="name" class="form-label trans-text" data-langprop="titles.Group"></label>
                            <input type="text" class="form-control data-input" data-field="name"/>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="program_type" class="form-label trans-text" data-langprop="titles.Program Type"></label>
                            <input type="text" class="form-control data-input" data-field="program_type"/>
                        </div>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="session_id" class="form-label trans-text" data-langprop="titles.Session"></label>
                            <div class="width-select-dialog">
                                <select id="dlg_sdg_session" class="modal-select2 data-input" data-field="session_id"></select>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="level_id" class="form-label trans-text" data-langprop="titles.Level"></label>
                            <div class="width-select-dialog">
                                <select id="dlg_sdg_level" class="modal-select2 data-input" data-field="level_id"></select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="check_in_time" class="form-label trans-text" data-langprop="titles.Check In Time"></label>
                            <input type="time" class="form-control data-input" data-field="check_in_time"/>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="check_out_time" class="form-label trans-text" data-langprop="titles.Check Out Time"></label>
                            <input type="time" class="form-control data-input" data-field="check_out_time"/>
                        </div>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="term_id" class="form-label trans-text" data-langprop="titles.Term"></label>
                            <div class="width-select-dialog">
                                <select class="modal-select2 data-input" data-field="term_id"></select>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="total_students" class="form-label trans-text" data-langprop="titles.Total Student"></label>
                            <input type="number" class="form-control data-input" data-field="total_students"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_sdg_btn_save" class="btn btn-primary btn-sm" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>