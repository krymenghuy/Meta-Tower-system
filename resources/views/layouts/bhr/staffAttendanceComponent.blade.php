<div id="_main_staffAttendanceComponent" style="display:none;padding:20px 0 0">
    <div class="_staff_attendance_top">
        <div class="search">
            <input class="filter-field" type="text" id="_staff_attendance_search"
                placeholder="Search staff attendance Here ........">
        </div>
        <div class="top_actions">
            <div class="btnAddStaffAttendance" data-bs-toggle="modal" data-bs-target="#addStaffAttendanceModal"
                id="_btnAddStaffAttendance">
                <i class="fa fa-plus"></i>Add StaffAttendance
            </div>
        </div>
    </div>
    <div id="_staff_attendance_list"></div>
</div>
<style>
    #_staff_attendance_list_paginator {
        display: flex;
        position: fixed;
        margin-top: 50px;
    }

    #_staff_attendance_list {
        max-width: 100%;
        margin: 15px;
    }

    ._staff_attendance_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 20px;
    }

    #_staff_attendance_search {
        width: 500px;
        padding: 10px 20px;
        border-radius: 20px;
        border: 1px solid #ccc;
        background-color: #fff;
        display: flex;
        align-items: center;
        outline: none;
        gap: 10px;
    }

    .top_actions {
        display: flex;
        align-items: center;
        margin-right: 5px;
        gap: 20px;
    }

    .btnAddStaffAttendance {
        padding: 10px 20px;
        background-color: #2b5f92;
        color: #fff;
        border: none;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
    }

    .btnAddStaffAttendance:hover {
        background-color: #2989b8;
    }
</style>
