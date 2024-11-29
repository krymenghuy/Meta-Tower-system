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
            </div>
        </div>
    </div>
    <div id="_attendenceTop">
        <div class="_attendance_cards">
            <div class="_attendance_card1">
                <div class="_attendance_card_body">
                    <h5 class="_attendance_card_title1">All Staff</h5>
                    <div class="_attendance_card_text1"><h3>100</h3><span>staffs</span></div>
                    <a href="">See Detail</a>
                </div>
            </div>
            <div class="_attendance_card2">
                <div class="_attendance_card_body">
                    <h5 class="_attendance_card_title2">Staff Attendance</h5>
                    <div class="_attendance_card_text2"><h3>90</h3><span>/100</span><span style="margin-left: 5px">staffs</span></div>
                    <a href="">See Detail</a>
                </div>
            </div>
            <div class="_attendance_card3">
                <div class="_attendance_card_body">
                    <h5 class="_attendance_card_title3">Staff On Leave</h5>
                    <div class="_attendance_card_text3"><h3>10</h3><span>/100</span><span style="margin-left: 5px">staffs</span></div>
                    <a href="">See Detail</a>
                </div>
            </div>
        </div>
    </div>
    <div id="_attendance_list" class="p-3"></div>
</div>
<style>
    /* Add your CSS styles here */
    ._attendance_cards {
        display: flex;
        gap: 20px;
        padding: 20px;
    }
    ._attendance_card1,
    ._attendance_card2,
    ._attendance_card3 {
        height: 150px;
        width: 300px;
        background-color: #f8f9fa;
        box-shadow: 0 4px 8px 0 rgba(30, 30, 30, 0.149);
        border-radius: 10px;
        overflow: hidden;
    }
    ._attendance_card1:hover,
    ._attendance_card2:hover,
    ._attendance_card3:hover {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
        cursor: pointer;
        scale: 1.01;
    }
    ._attendance_card_body {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        width: 100%;
        padding: 20px;
    }

    ._attendance_card_title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    ._attendance_card_text1,
    ._attendance_card_text2,
    ._attendance_card_text3 {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    ._attendance_card_text1 h3{
        font-size: 30px;
        font-weight: bold;
        margin-right: 10px;
        font-family: "Montserrat", sans-serif;
        color: rgb(16, 56, 186);
    }
    ._attendance_card_text2 h3{
        font-size: 30px;
        font-weight: bold;
        margin-right: 10px;
        font-family: "Montserrat", sans-serif;
        color: rgb(15, 137, 27);
    }
    ._attendance_card_text3 h3{
        font-size: 30px;
        font-weight: bold;
        margin-right: 10px;
        font-family: "Montserrat", sans-serif;
        color: rgb(233, 62, 76);
    }
    a {
        color: #007bff;
        text-decoration: none;
    }
</style>
