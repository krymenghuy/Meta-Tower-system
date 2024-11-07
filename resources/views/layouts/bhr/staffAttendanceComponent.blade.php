<div id="_main_staffAttendanceComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex  p-4 justify-content-between w-200 " id="_divFilter_attendance">
        <div class="d-flex align-items-center w-100 gap-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field btn_search" id="_staff_attendance_search"
                    placeholder="Search attendance ...">

                <button id="_sdl_btnSearch" role="button" class="btn btn-primary rounded-5">
                    <i class="la la-search"></i>
                </button>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-100">
                <div class="d-flex align-items-center w-50">
                    <input data-select="datepicker" class="form-control filter-field form_input" data-field="attendance_date"
                        placeholder="Attendance Date" id="_filter_attendance_date" />
                </div>
            <button type="button" class="btn_add" id="_btnAddStaffAttendance">
                <i class="fas fa-plus"></i>
                <span>Add StaffAttendance </span>
            </button>
        </div>
    </div>
    <div id="_staff_attendance_list" class="m-4"></div>
</div>
<style>
    #_staff_attendance_list {
        height: 480px;
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
