<div id="_main_staffAttendanceComponent" style="display:none;padding:20px 0 0">
        <div class="shadow rounded-3 p-3">
            <div id="container_scan_filter" class="row px-3">
                <div class="col-sm-12 col-md-6 col-lg-3">
                    <div class="form-group">
                        <label for="branch_id" class="form-label" style="color: #cab567;" vslang="titles.LC Branch"></label>
                        <div class="width-select-dialog">
                            <select class="filter-field data-input" data-field="branch_id"></select>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-3">
                    <div class="form-group">
                        <label for="emp_type_id" class="form-label " style="color: #cab567;" vslang="titles.All Employee"></label>
                        <div class="width-select-dialog">
                            <select class="filter-field data-input" data-field="emp_type_id"></select>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-3">
                    <div class="form-group">
                        <label for="department_id" class="form-label " style="color: #cab567;" vslang="titles.Department"></label>
                        <div class="width-select-dialog">
                            <select class="filter-field data-input" data-field="department_id"></select>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-3">
                    <div class="form-group">
                        <label for="work_shift_id" class="form-label " style="color: #cab567;" vslang="titles.WorkShift"></label>
                        <div class="width-select-dialog">
                            <select class="filter-field data-input" data-field="work_shift_id"></select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex w-100 px-4 py-3 justify-content-between">
                <div class="d-flex align-items-center w-25">
                    <div class="position-relative w-100">
                        <input type="text" class="form-control filter-field btn_search ps-5" id="_staff_attendance_search" placeholder="Search...">
                        <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-4 text-muted"></i>
                    </div>
                </div>
                <div class="d-flex w-50 justify-content-end">
                    <button type="button" class="btn_add" id="_btnAddStaffAttendance">
                        <i class="fa-solid px-1 fa-clipboard-user"></i>
                        <span>Create Attendance</span>
                    </button>
                </div>
            </div>
        </div>
    <div id="_staff_attendance_list" class="mt-3 px-3"></div>
</div>

