<style>
    .btn-act-inactive {
        padding: 14px;
        color: #fe1f1f;
        background-color: #ff000059;
        border: 2px solid #fe1f1f;
        border-radius: 5px;
        /* width: 135px; */
        text-align: center;
    }
    #work_shift_type{
        background-color: #2b3991;
        color: #fff;
        border-radius: 5px;
    }
    .btn-act-check-in {
        padding: 14px;
        color: #008767;
        background-color: #16c0985c;
        border: 2px solid #008767;
        border-radius: 5px;
        /* width: 135px; */
        text-align: center;
    }

    .btn-act-afternoon {
        padding: 14px;
        color: #84600b;
        background-color: #ffe625ae;
        border: 2px solid #928101f6;
        border-radius: 5px;
        width: 135px;
        text-align: center;
    }

    #_work_shift_header .col-1-5,
    #_work_shift_body .col-1-5 {
        flex: 1 1 14%;
        text-align: center;
    }

    #_work_shift_body {
        display: flex;
        flex-direction: column;
        height: 550px;
        gap: 1rem;
        margin-top: 10px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;

    }

    .shift_header:hover,
    .shift_date:hover {
        background-color: rgba(81, 1, 92, 0.376);
        transition: background-color 0.3s ease;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.46);
        transition: box-shadow 0.3s ease;
        border-radius: 20px;
        cursor: pointer;
        scale: 1.1;
    }

    .work_shift {
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        background-color: rgba(21, 16, 16, 0.687);
        margin: 5px 0px 0px 0px;
        border-radius: 5px;
    }

    .scane_time {
        height: 460px;
        display: flex;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    .shift-status {
        padding: 5px;
        width: 200px;
    }
    .shift-status:hover{
        transition: background-color 0.3s ease;
        transition: box-shadow 0.3s ease;
        border-radius: 20px;
        cursor: pointer;
        scale: 1.01;
    }
    .listview-container{
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width:none;
    }
    .work_shift:hover {
        transition: box-shadow 0.3s ease;
        border-radius: 20px;
        cursor: pointer;
        scale: 1.01;
    }

    #el_work_shift {
        cursor: pointer;
        padding: 8px;
        cursor: pointer;
        border-radius: 20px;
    }
    #_main_workshiftComponent{
        height: 400px;
        gap: 1rem;
    }
    #_work_shift_list{
        display: flex;
        padding: 0;
    }
    #_work_shift_list_paginator{
        display: flex;
        justify-content: flex-end;
        margin-top: -30px;
    }
    
</style>

<div id="_main_workshiftComponent" style="display:block;padding:20px">
    <div class="d-flex py-2 pt-2 justify-content-between w-200" id="_divFilter">
        <div class="d-flex align-items-center w-100 gap-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field btn_search" id="_work_shift_search"
                    placeholder="Search.........">
                <button id="_sdl_btnSearch" role="button" class="btn btn-primary rounded-5">
                    <i class="la la-search"></i>
                </button>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100 gap-2">
            <div class="d-flex align-items-center" style="width:200px">
                <select id="el_work_shift" name="shifts" class="data-input filter-field" data-field="shifts"></select>
            </div>
            <button type="button" class="btn_add" id="_btnAddWorkShift">
                <i class="fas fa-plus"></i>
                <span>Add Work Shift</span>
            </button>
            <button type="button" class="btn_add" id="_btnAddShiftDetail">
                <i class="fas fa-plus"></i>
                <span>Add Shift Detail</span>
            </button>
        </div>
    </div>

    <div id="_work_shift_header">
        {{-- <div id="work_shift_type" class="col-12 p-3 border d-flex gap-2" >
            <div class="col-2 w-100 shift_header">Work Shift Type</div>
            <div class="shift_date col-1-5">Monday</div>
            <div class="shift_date col-1-5">Tuesday</div>
            <div class="shift_date col-1-5">Wednesday</div>
            <div class="shift_date col-1-5">Thusday</div>
            <div class="shift_date col-1-5">Friday</div>
            <div class="shift_date col-1-5">Saturday</div>
            <div class="shift_date col-1-5">Sunday</div>
        </div> --}}
    </div>

    <div id="_work_shift_body">
            <!-- <div class="col-2 work_shift">Work Shift A</div> 
        <div class="scane_time d-block">
            <div class="shift_time d-flex" id="shift_time_row1">
                <div class="col-1-5 shift-status">
                    <div class="btn-act-check-in">
                        <div class="morning_shift">8:00AM</div>
                        <span>Check In</span>
                    </div>
                </div>
                <div class="col-1-5 shift-status">
                    <div class="btn-act-check-in">
                        <div class="morning_shift">8:00AM</div>
                        <span>Check In</span>
                    </div>
                </div>
                <div class="col-1-5 shift-status">
                    <div class="btn-act-check-in">
                        <div class="afternoon_shift">8:00AM</div>
                        <span>Check In</span>
                    </div>
                </div>
                <div class="col-1-5 shift-status">
                    <div class="btn-act-check-in">
                        <div class="morning_shift">8:00AM</div>
                        <span>Check In</span>
                    </div>
                </div>
                <div class="col-1-5 shift-status">
                    <div class="btn-act-check-in">
                        <div class="morning_shift">8:00AM</div>
                        <span>Check In</span>
                    </div>
                </div>
                <div class="col-1-5 shift-status">
                    <div class="btn-act-check-in">
                        <div>5:00PM</div>
                        <span>Check In</span>
                    </div>
                </div>
                <div class="col-1-5 shift-status">
                    <div class="btn-act-inactive">
                        <div class="inactive">Day Off</div>
                        <span>weekend</span>
                    </div>

                </div>
            </div>
            <div class="shift_time d-flex">
                <div class="col-1-5 shift-status">
                    <div class="btn-act-check-in">
                        <div class="morning_shift">8:30AM</div>
                        <span>Check In</span>
                    </div>
                </div>
                <div class="col-1-5 shift-status">
                    <div class="btn-act-check-in">
                        <div class="morning_shift">8:30AM</div>
                        <span>Check In</span>
                    </div>
                </div>
                <div class="col-1-5 shift-status">
                    <div class="btn-act-check-in">
                        <div class="afternoon_shift">8:30AM</div>
                        <span>Check In</span>
                    </div>
                </div>
                <div class="col-1-5 shift-status">
                    <div class="btn-act-check-in">
                        <div class="morning_shift">8:30AM</div>
                        <span>Check In</span>
                    </div>
                </div>
                <div class="col-1-5 shift-status">
                    <div class="btn-act-check-in">
                        <div class="morning_shift">8:30AM</div>
                        <span>Check In</span>
                    </div>
                </div>
                <div class="col-1-5 shift-status">
                    <div class="btn-act-check-in">
                        <div>5:00PM</div>
                        <span>Check In</span>
                    </div>
                </div>
                <div class="col-1-5 shift-status">
                    <div class="btn-act-inactive">
                        <div class="inactive">Day Off</div>
                        <span>weekend</span>
                    </div>

                </div>
            </div>
        </div> -->
    </div>
    <div id="_work_shift_list"></div>
</div>
