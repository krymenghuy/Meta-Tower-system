<div id="_main_staffAttendanceComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex p-3 justify-content-between w-100 " id="_divFilter_attendance">
        <div class="d-flex align-items-center w-50 gap-2">
                <div class="form-group">
                    <label for="academic_year" class="form-label " vslang="titles.Branch"></label>
                    <div class="d-flex align-items-start w-50">
                        <select id="el_emp_branch" class="data-input filter-field" data-field="branch_id"></select>
                    </div>
                </div>
            
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-100">
                
            <button type="button" class="btn_add" id="_btnAddStaffAttendance">
                <i class="fas fa-plus"></i>
                <span>Add StaffAttendance </span>
            </button>
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field btn_search" id="_staff_attendance_search"
                    placeholder="Search attendance ...">

             
            </div>
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
