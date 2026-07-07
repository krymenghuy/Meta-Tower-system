<div id="_main_emp_leave_component" style="display:none;padding:20px 0 0;">
    <div id="_divFilter_emp_leave" class="d-flex justify-content-between w-100 rounded-3 shadow p-3">
            <div class="d-flex justify-content-start gap-3 w-100">
                <div class="d-flex align-items-center w-50">
                    <div class="d-flex align-items-center position-relative" style="min-width: 300px;">
                        <input type="text" class="form-control filter-field btn_search ps-5" id="_search_leave" placeholder="Search here....">
                        <i class="fa-solid fa-search position-absolute top-50 start-0 translate-middle-y ms-4"></i>
                    </div>
                </div>
                <div class="d-flex justify-content-end align-items-center w-50 gap-3">
                    <div class="d-flex align-items-center w-50">
                        <select id="el_status" class="data-input filter-field " data-field="status"></select>
                    </div>
                    <div class="d-flex align-items-center w-50">
                        <select id="el_leave_type" class="data-input filter-field " data-field="leave_type_id"></select>
                    </div>
                </div>
            </div>
    </div>
    
    <div class="d-flex justify-content-between w-100 px-3 mt-3">
        <div class="d-flex align-items-center justify-content-start w-50 gap-3">
            <div class="d-flex filter-date-custom w-50">
                <label for="" class="form-label text-nowrap" style="color:#d1b54a;" vslang = "filters.Start Date :"></label>
                <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="start_date"
                    placeholder="Select Leave Date" />
            </div>
            <div class="d-flex filter-date-custom w-50">
                <label for="" class="form-label" style="color:#d1b54a;" vslang = "filters.End Date :"></label>
                <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="end_date"
                    placeholder="Select Leave Date" />
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end w-50">
            <button type="button" class="btn_add d-flex gap-2 align-items-center" id="_btnAddLeave">
                <i class="fa-solid fa-person-walking-arrow-right fs-5 text-white"></i>
                <span vslang = "buttons.Leave Request"></span>
            </button>
        </div>
    </div>
    <div id="_leave_request_list" class="mt-3 px-3"></div>
</div>

<style>
</style>
