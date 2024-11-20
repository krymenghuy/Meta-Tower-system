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

    #work_shift_type {
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

    .shift-status:hover {
        transition: background-color 0.3s ease;
        transition: box-shadow 0.3s ease;
        border-radius: 20px;
        cursor: pointer;
        scale: 1.01;
    }

    .listview-container {
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
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

    #_main_workshiftComponent {
        height: 400px;
        gap: 1rem;
    }

    #_work_shift_list {
        display: flex;
        padding: 0;
    }

    #_work_shift_list_paginator {
        display: flex;
        justify-content: flex-end;
        margin-top: -30px;
    }

    .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;
        padding: 0px 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 600px;
    }

    .view-selector button,
    .nav-button {
        background-color: #f0f0f0;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .view-selector button:hover,
    .nav-button:hover,
    .filter-button:hover {
        background-color: #e0e0e0;
    }

    .days {
        display: flex;
        gap: 10px;
        /* Adds spacing between the days */
    }

    .day {
        padding: 10px 15px;
        border: 2px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
        user-select: none;
        transition: all 0.3s ease;
    }

    .day:hover {
        border-color: #007bff;
        background-color: #bfdffb;
    }

    .day.active {
        border-color: #007bff;
        background-color: #007bff;
        color: white;
    }
</style>

<div id="_main_workshiftComponent" style="display:block;padding:20px">
    <div class="d-flex py-2 pt-2 justify-content-between w-200" id="_divFilter">
        {{-- <div class="d-flex align-items-center w-100 gap-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field btn_search" id="_work_shift_search"
                    placeholder="Search.........">
                <button id="_sdl_btnSearch" role="button" class="btn btn-primary rounded-5">
                    <i class="la la-search"></i>
                </button>
            </div>
        </div> --}}
        <div class="header-container" id="_work_shift_search">
            <div class="view-selector">
                <button>Week 3</button>
            </div>
            <div class="date-navigation" id="week_date">
                <button class="nav-button">&lt;</button>
                <span class="date-range">Nov 18 - Nov 24</span>
                <button class="nav-button">&gt;</button>
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
    </div>

    <div id="_work_shift_body">
    
    </div>
    <div id="_work_shift_list"></div>
</div>

