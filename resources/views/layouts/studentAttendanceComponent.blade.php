<div id="_main_studentAttendanceComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-block p-3 rounded-4 bg-white">
        <div class="row row-cols-lg-4">
            <div class="col">
                <div class="form-group">
                    <label for="academic_year" class="form-label trans-text" data-langprop="titles.Academic Year"></label>
                    <select class="modal-select2 form-contorl data-input" data-field="academic_year"></select>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="campus" class="form-label trans-text" data-langprop="titles.Campus"></label>
                    <select class="modal-select2 form-contorl data-input" data-field="campus"></select>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="class" class="form-label trans-text" data-langprop="titles.Class"></label>
                    <select class="modal-select2 form-contorl data-input" data-field="class"></select>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="section" class="form-label trans-text" data-langprop="titles.Section"></label>
                    <select class="modal-select2 form-contorl data-input" data-field="section"></select>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-3">
        <div class="d-flex gap-2">
            <input type="search" class="form-control width--search-inner" placeholder="Search by Name or ID..."/>
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
    <div class="table-responsive mt-3 p-3">
        <table class="table tbl--san"></table>
    </div>
</div>