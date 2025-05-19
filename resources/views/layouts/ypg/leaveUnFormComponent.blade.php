<div id="_main_leave_unform_component" style="display:none;padding:20px 0 0;">
    <div id="_divFilter_leave" class="px-4">
        <div class="d-flex w-100 gap-2 mt-4">
            <div class="d-flex justify-content-between gap-3 w-50">
                {{-- <div class="d-flex align-items-center w-50">
                    <select id="el_leave_session" class="data-input filter-field " data-field="session"></select>
                    <!-- <select id="el_leave_type" class="form-control rounded-5 data-input filter-field" data-field="session">
                        <option value="">All Sessions</option>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                    </select> -->
                </div> --}}
                <div class="d-flex justify-content-between w-100 gap-2">
                    <div class="d-flex align-items-start w-50">
                        <div class="position-relative w-100">
                        <input type="text" class="form-control filter-field btn_search ps-5" id="_search_uninform_leave"
                            placeholder="search...">
                            <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-4 text-muted"></i>
                    </div>
                    </div>
                    <div class="d-flex align-items-start w-50">
                        <select id="el_wark_shift" class="data-input filter-field " data-field="status"></select>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-end w-50 gap-3">
                <div class="d-flex filter-date-custom w-50">
                    <label for="" class="form-label text-nowrap" style="color:#d1b54a;" vslang = "filters.Start Date :"></label>
                    <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="start_date"
                        placeholder="Start Date" />
                </div>
                <div class="d-flex filter-date-custom w-50">
                    <label for="" class="form-label" style="color:#d1b54a;" vslang = "filters.End Date :"></label>
                    <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="end_date"
                        placeholder="End Date" id="" />
                </div>
            </div>
        </div>
        {{-- <div class="d-block w-100 mt-3">
            <div class="d-flex justify-content-between w-100">
                <!-- <button type="button"  class="btn_add d-flex gap-2" id="_btnAddLeave">
                    <i class="fa-solid fa-person-walking-arrow-right fs-5 text-white"></i>
                    <span>Leave Request</span>
                </button> -->
                <div class="d-flex align-items-center" style="min-width: 300px;">
                    <input type="text" class="form-control filter-field btn_search" id="_search_uninform_leave"  placeholder="Search">
                </div>
            </div>
        </div> --}}
    </div>
    <div id="_leave_unform_list" class="mt-4 px-4"></div>
</div>

<style>
</style>
