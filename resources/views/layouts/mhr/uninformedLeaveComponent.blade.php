<!-- <div id="_main_emp_Uninform_leave_component" class="px-3 mobile-padding" style="display:none;">
    <div id="_divFilter_emp_leave" class="bg-white rounded-2 shadow p-3">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_leave"
                    placeholder="{{ \Vsd\Locales\Localization::trans('Search by name or code', 'titles') }}">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="el_status" class="filter-field data-input" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="el_leave_type" class="filter-field data-input" data-field="leave_type_id"></select>
            </div>
            
            <div class="ms-md-auto text-md-end col-12 col-md-auto" style="overflow:visible;">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddLeave">
                    <i class="fa-solid fa-right-from-bracket" style="color: rgb(249, 251, 255);"></i>
                    <span vslang="buttons.Set Leave"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_leave_request_list" class="mt-3"></div>
</div> -->
<div id="_main_leave_unform_component" style="display:none;padding:20px 0 0;">
    <div id="_divFilter_leave" class="d-flex justify-content-between w-100 rounded-3 shadow p-3">
        <div class="d-flex w-100 gap-2 mt-3">
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
                        placeholder="Select Start Date" />
                </div>
                <div class="d-flex filter-date-custom w-50">
                    <label for="" class="form-label" style="color:#d1b54a;" vslang = "filters.End Date :"></label>
                    <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="end_date"
                        placeholder="Select End Date"/>
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

