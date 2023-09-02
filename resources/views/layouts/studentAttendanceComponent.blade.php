<div id="_main_studentAttendanceComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-block p-3 rounded-4 bg-white">
        <div class="row row-cols-lg-4">
            <div class="col">
                <div class="form-group">
                    <label for="academic_year" class="form-label trans-text" data-langprop="titles.Academic Year"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="academic_year"></select>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="campus_id" class="form-label trans-text" data-langprop="titles.Campus"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="campus_id"></select>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="level_id" class="form-label trans-text" data-langprop="titles.Class"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="level_id"></select>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="session_id" class="form-label trans-text" data-langprop="titles.Session"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="session_id"></select>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-3">
        <div class="d-flex gap-2">
            <input type="search" id="el_san_search" class="form-control width--search-inner"/>
            <button class="btn btn-sm btn-primary text-nowrap" type="button">
                <i class="fa-solid fa-magnifying-glass"></i>
                <span class="trans-text" data-langprop="buttons.Find"></span>
            </button>
            <div class="d-flex justify-content-end w-100">
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-primary" type="button">
                        <i class="fa-solid fa-print"></i>
                        <span class="trans-text" data-langprop="buttons.Print"></span>
                    </button>
                    <button class="btn btn-sm btn-success" type="button">
                        <i class="fa-regular fa-file-excel"></i>
                        <span class="trans-text" data-langprop="buttons.Excel"></span>
                    </button>
                    <button class="btn btn-sm btn-danger" type="button">
                        <i class="fa-regular fa-file-pdf"></i>
                        <span class="trans-text" data-langprop="buttons.PDF"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div id="tbl--san" class="table-responsive mt-3 p-3 rounded-3 bg-white table-responsive-hover"></div>
</div>

<div class="modal fade" id="dlg_san_" tabindex="-1" aria-labelledby="dlg_san_title" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title trans-text" data-langprop="titles.Modify Student Attendance"></h5>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col">
                        <div class="form-group">
                            <label for="session_date" class="form-label trans-text" data-langprop="titles.Session Date"></label>
                            <input data-select="datepicker" class="form-control data-input" data-field="session_date"/>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="checkin_time" class="form-label trans-text" data-langprop="titles.Check In Time"></label>
                            <input type="time" class="form-control data-input" data-field="checkin_time"/>
                        </div>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col">
                        <div class="form-group">
                            <label for="in_remarks" class="form-label trans-text" data-langprop="titles.Check In Remarks"></label>
                            <textarea class="form-control data-input" data-field="in_remarks"></textarea>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="checkout_time" class="form-label trans-text" data-langprop="titles.Check Out Time"></label>
                            <input type="time" class="form-control data-input" data-field="checkout_time"/>
                        </div>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col">
                        <div class="form-group">
                            <label for="out_remarks" class="form-label trans-text" data-langprop="titles.Check Out Remarks"></label>
                            <textarea class="form-control data-input" data-field="out_remarks"></textarea>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="status_id" class="form-label trans-text" data-langprop="titles.Status"></label>
                            <div class="width-select-dialog">
                                <select id="dlg_el_status" class="modal-select2 data-input" data-field="status_id"></select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_san_btn_save" type="button" class="btn btn-primary btn-sm">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>