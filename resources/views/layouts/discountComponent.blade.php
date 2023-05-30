<div id="_main_discountComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-block bg-white p-3 rounded-4">
        <div class="d-flex">
            <span class="trans-text fs-5" data-langprop="titles.Special Discount"></span>
            <span class="px-2 fs-5">/</span>
            <span class="trans-text fs-5" data-langprop="titles.Child Policy"></span>
        </div>
        <div class="row row-cols-lg-4 gap-2 mt-3">
            <div class="col">
                <div class="form-group">
                    <label for="discount_type" class="form-label trans-text" data-langprop="titles.Discount Type"></label>
                    <select class="modal-select2 form-control data-input" data-field="discount_type"></select>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="academic_year" class="form-label trans-text" data-langprop="titles.Academic Year"></label>
                    <select class="modal-select2 form-control data-input" data-field="academic_year"></select>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="start_date" class="form-label trans-text" data-langprop="titles.From"></label>
                    <input data-select="datepicker" class="form-control data-input" data-field="start_date"/>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="end_date" class="form-label trans-text" data-langprop="titles.To"></label>
                    <input data-select="datepicker" class="form-control data-input" data-field="end_date"/>
                </div>
            </div>
        </div>
    </div>
    <div class="d-flex gap-2 mt-3">
        <button class="btn btn-primary btn-sm" type="button">
            <span class="trans-text" data-langprop="buttons.Approve"></span>
        </button>
        <input type="search" class="form-control width--search-inner" placeholder="Search by Name or ID..."/>
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
    <div class="table-responsive mt-3 p-3">
        <table class="table tbl__apv"></table>
    </div>
</div>