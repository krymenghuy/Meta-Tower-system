<div id="_main_studentAttendanceReportComponent" class="mobile-padding p-3" style="display:none">
    <div class="bg-white p-3 rounded-4">
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
                    <label for="level_id" class="form-label trans-text" data-langprop="titles.Grade"></label>
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
    <div class="d-flex bg-white rounded-3 p-3 mt-3">
        <div class="d-flex gap-2">
            <input type="search" class="form-control width--search-inner data-input"/>
            <button class="btn btn-sm btn-primary text-nowrap" type="button">
                <i class="fa-solid fa-magnifying-glass"></i>
                <span class="trans-text" data-langprop="buttons.Find"></span>
            </button>
        </div>
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
    <div id="tbl_astr_" class="table-responsive bg-white rounded-3 mt-3 p-3 table-responsive-hover"></div>
</div>