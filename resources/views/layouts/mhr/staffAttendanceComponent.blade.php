<div id="_main_staffAttendanceComponent" style="display:none;">
        <div id="_divFilter_staff_attendance" class="bg-white shadow p-3 rounded-2">
            <div class="align-items-center row g-3">
                <div class="col-12 col-md-6 col-lg-3">
                    <input type="text" class="filter-field rounded-2 input-search" id="_attendance_search"
                        placeholder="{{ \Vsd\Locales\Localization::trans('Search by name', 'titles') }}">
                </div>
                {{-- <div class="col-12 col-md-6 col-lg-2">
                    <select type="id" id="sa_status" class="filter-field data-input" data-field="status_id"></select>
                </div> --}}
                <div class="col-12 col-md-6 col-lg-2">
                    <select type="id" id="work_shift" class="filter-field data-input" data-field="work_shift_id" placeholder=""></select>
                    
                </div>
                
                <div class="ms-md-auto text-md-end col-12 col-md-auto" style="overflow:visible;">
                    <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddStaffAttendance">
                        {{-- <i class="fa-right-from-bracket fa-solid" style="color: rgb(249, 251, 255);"></i> --}}
                        <i class="fa-brands fa-nfc-symbol" style="color: rgb(249, 251, 255);"></i>
                        <span vslang="buttons.Set Attendance"></span>
                    </button>
                </div>
            </div>
        </div>
    <div id="_staff_attendance_list" class="mt-3 px-3"></div>
</div>

