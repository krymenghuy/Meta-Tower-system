<div id="_main_leave_component" style="display:none;padding:20px 0 0;">
    <div id="_divFilter_leave" class="px-3">
        <div class="d-flex w-100 gap-2 mt-3">
            <div class="d-flex justify-content-end gap-3 w-50">
                <div class="d-flex align-items-center w-50">
                    <select id="el_status" class="data-input filter-field " data-field="status"></select>
                </div>
                <div class="d-flex align-items-center w-50">
                    <select id="el_leave_session" class="data-input filter-field " data-field="session"></select>
                    <!-- <select id="el_leave_type" class="form-control rounded-5 data-input filter-field" data-field="session">
                        <option value="">All Sessions</option>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                    </select> -->
                </div>
            </div>
            <div class="d-flex justify-content-end w-50">
                <div class="d-flex filter-dete-custom w-50">
                    <label for="_leave_filter_start_date" class="form-label text-nowrap" style="color:#d1b54a;">Start Date :</label>
                    <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="start_date"
                        placeholder="Start Date" id="_leave_filter_start_date" />
                </div>
                <div class="d-flex filter-dete-custom w-50">
                    <label for="_leave_fliter_end_date" class="form-label" style="color:#d1b54a;">End Date :</label>
                    <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="end_date"
                        placeholder="End Date" id="_leave_fliter_end_date" />
                </div>
            </div>
        </div>
        <div class="d-block w-100 mt-3">
            <div class="d-flex justify-content-between w-100">
                <button type="button"  class="btn_add d-flex gap-2" id="_btnAddLeave">
                    <i class="fa-solid fa-person-walking-arrow-right fs-5 text-white"></i>
                    <span>Leave Request</span>
                </button>
                <div class="d-flex align-items-center" style="min-width: 300px;">
                    <input type="text" class="form-control filter-field btn_search" id="_sdl_search_leave"  placeholder="Search here....">
                </div>
            </div>
        </div>
    </div>
    <div id="_leave_request_list" class="mt-3 px-3"></div>
</div>

<style>
</style>
