<div id="_main_emp_leave_component" class="px-3 mobile-padding" style="display:none;">
    <div id="_divFilter_emp_leave" class="bg-white rounded-2 shadow p-3">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_leave"
                    placeholder="{{ \Vsd\Locales\Localization::trans('Search by name or code', 'titles') }}">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="el_status" class="filter-field data-input" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2 d-none">
                <select type="id" id="el_leave_type" class="filter-field data-input" data-field="leave_type_id"></select>
            </div>
            <div class="col-md-6 col-lg-2">
                <div class="flex-fill material-input outlined" style="margin-bottom: 0;">
                    <input data-select="datepicker" class="filter-field form-control range-filter" placeholder=" " data-field="start_date" />
                    <label vslang="titles.Start Date" class="form-label">Start Date</label>
                </div>
            </div>

            <div class="col-12 col-md-6 col-lg-2">
                <div class="flex-fill material-input outlined" style="margin-bottom: 0;">
                    <input data-select="datepicker" class="filter-field form-control range-filter" placeholder=" " data-field="end_date" />
                    <label vslang="titles.End Date" class="form-label">End Date</label>
                </div>
            </div>
            
            <div class="ms-md-auto text-md-end col-12 col-md-auto">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddLeave">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span vslang="buttons.Leave Request"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_leave_request_list" class="mt-3"></div>
</div>
