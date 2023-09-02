<div id="_main_promoteStudentComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex gap-2 bg-white rounded-3 p-3">
        <button id="_pms_btn_new" class="btn btn-primary btn-sm" type="button">
            <span class="trans-text text-nowrap" data-langprop="buttons.Promote Student"></span>
        </button>
        <div class="input-group flex-nowrap">
            <input type="search" id="el_pms_search" class="form-control width-search-box"/>
            <div class="input-group-text">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
        </div>
    </div>
    <div id="tbl_pms_" class="table-responsive p-3 bg-white rounded-3 mt-3 table-responsive-hover"></div>
</div>

<div class="modal fade" id="dlg_pms_" tabindex="-1" aria-labelledby="dlg_pms_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title trans-text" data-langprop="titles.Promote Student"></h5>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="term_id" class="form-label trans-text" data-langprop="titles.Current Term"></label>
                            <div class="width-select-dialog">
                                <select class="modal-select2 data-input data-term" data-field="term_id"></select>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="next_term_id" class="form-label trans-text" data-langprop="titles.Next Term"></label>
                            <div class="width-select-dialog">
                                <select class="modal-select2 data-input" data-field="next_term_id" disabled></select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <label for="program_id" class="form-label trans-text" data-langprop="titles.Program"></label>
                        <div class="width-select-dialog">
                            <select class="modal-select2 data-input data-program" data-field="program_id"></select>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <label for="total_student" class="form-label trans-text" data-langprop="titles.Total Student"></label>
                        <input type="text" class="form-control data-input" data-field="total_student" readonly/>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_pms_btn_save" type="button" class="btn btn-primary btn-sm btn-animate">
                    <span class="trans-text text-nowrap" data-langprop="buttons.Promote Now"></span>
                </button>
            </div>
        </div>
    </div>
</div>