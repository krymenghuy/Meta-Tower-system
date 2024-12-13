<div id="_main_staffAttendanceComponent" style="display:none;padding:20px 0 0">
        <div class="bg-white rounded-4 mt-2">
            <div id="container_scan_filter" class="row px-4 py-2">
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
        </div>
        <div class="d-flex w-100 gap-2 px-4 mt-2 py-2">
            <div class="d-flex w-50">
                <button type="button" class="btn_add" id="_btnAddStaffAttendance">
                <i class="fa-solid px-1 fa-clipboard-user"></i>
                    <span>Create Attendance</span>
                </button>
            </div>
        <div class="d-flex justify-content-end gap-3 w-50">
            <div class="d-flex align-items-center w-75">
                <input type="text" class="form-control data-input filter-field btn_search" id="_staff_attendance_search"
                placeholder="Search here">
            </div>

        </div>

        </div>
    <div id="_staff_attendance_list" class="m-4"></div>
</div>
<style>
    #_staff_attendance_list {
        height: 390px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    #_staff_attendance_list_paginator {
        bottom: 0;
    }

    .choices__list {
        max-height: 600px;
        overflow-y: auto;
    }

</style>
