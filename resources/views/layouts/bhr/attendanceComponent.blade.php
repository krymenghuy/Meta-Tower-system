<div id="_main_attendanceComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex  p-3 justify-content-between w-200 " id="_divFilter">
        <div class="d-flex align-items-center justify-content-start gap-2 w-100">
            <button type="button" class="btn btn-primary" id="_btnAddAttendance">
                <i class="fas fa-plus"></i>
                <span>Add Attendance</span>
            </button>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100 gap-2">
            <div class="d-flex align-items-end w-50 gap-2">
                <input type="text" class="form-control filter-field" id="_sdl_search_attendance"
                    placeholder="Search Attendance">

                <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                    <i class="la la-search"></i>
                </button>
            </div>
        </div>
    </div>
    <div id="_attendenceTop">
        <div class="_attendance_cards">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Staff Attendance</h5>
                    <p class="card-text">100 staffs</p>
                    <a href="">See Detail</a>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Staff Permision</h5>
                    <p class="card-text">100 staffs</p>
                    <a href="">See Detail</a>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Staff Absent</h5>
                    <p class="card-text">100 staffs</p>
                    <a href="">See Detail</a>
                </div>
            </div>
        </div>
    </div>
    <div id="_attendance_list" class="p-3"></div>
</div>
<style>
    #_attendenceCenter,
    #_attendenceTop{
        display: flex;
        padding: 20px;
    }
    ._attendance_cards{
        display: flex;
        width: 100%;
        gap: 20px;
    }
    .card{
        display: flex;
        flex-direction: column;
        width: 20%;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(53, 51, 51, 0.19);
    }
    .card-body{
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>

