<div id="_main_activitiesComponent" class="mobile-padding p-3" style="display:none">
    <div id="_att_elFilter" class="bg-white p-3 rounded-4">
        <div class="row row-cols-lg-4 gy-2">
            <div class="col">
                <div class="form-group">
                    <label for="academic_year" class="form-label trans-text" data-langprop="titles.Academic Year"></label>
                    <div class="width--filter-inner">
                        <select class="modal-select2 data-input" data-field="academic_year"></select>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="campus_id" class="form-label trans-text" data-langprop="titles.Campus"></label>
                    <div class="width--filter-inner">
                        <select class="modal-select2 data-input" data-field="campus_id"></select>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="level_id" class="form-label trans-text" data-langprop="titles.Class"></label>
                    <div class="width--filter-inner">
                        <select class="modal-select2 data-input" data-field="level_id"></select>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="session_id" class="form-label trans-text" data-langprop="titles.Session"></label>
                    <div class="width--filter-inner">
                        <select class="modal-select2 data-input" data-field="session_id"></select>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-3">
        <div id="div_att_hasList" class="div--att-hasList">
            <div class="d-flex justify-content-between">
                <div class="d-flex gap-2">
                    <button id="_att_btn_new" class="btn btn-primary" type="button">
                        <span class="trans-text" data-langprop="buttons.New Request"></span>
                    </button>
                    <div class="width--filter-inner">
                        <select id="_att_elRequest" class="modal-select2"></select>
                    </div>
                    <input type="search" class="form-control width--search-inner"/>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-warning" type="button">
                        <span class="trans-text" data-langprop="buttons.Send Request"></span>
                    </button>
                </div>
            </div>
            <div id="div_att_list" class="table-responsive mt-3 p-3 rounded-3 bg-white"></div>
        </div>
    </div>
</div>

<div class="modal fade" id="dlg_att_" tabindex="-1" aria-labelledby="dlg_att_title" aria-hidden="true">
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
                    <label for="request_type_id" class="form-label trans-text" data-langprop="titles.Request Type"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="request_type_id"></select>
                    </div>
                </div>
                <div class="stop form-group">
                    <label for="remarks" class="form-label trans-text" data-langprop="titles.Note"></label>
                    <textarea class="form-control data-input" data-field="remarks"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_att_btn_save" type="button" class="btn btn-primary">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>