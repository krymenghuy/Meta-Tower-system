<div id="_main_aActivitiesComponent" class="mobile-padding p-3" style="display:none">
    <div class="p-3 rounded-4 bg-white">
        <div class="row row-cols-lg-4">
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
        <button class="btn btn-sm btn-primary" type="button">
            <span class="trans-text text-nowrap" data-langprop="buttons.Confirm Cancel"></span>
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
    <div id="tbl__aavt" class="table-responsive p-3 bg-white rounded-3 mt-3"></div>
</div>