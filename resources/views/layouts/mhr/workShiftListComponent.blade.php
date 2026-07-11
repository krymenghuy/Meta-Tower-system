<style>
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
</style>

<div id="_main_workShiftListComponent" style="display:none;padding:20px 0 0 ">
    <div class="d-flex justify-content-between w-100 p-3 rounded-3 shadow" id="_divFilter">
        <div class="d-flex align-items-start justify-content-start w-25">
            <div class="position-relative w-100">
                <input type="text" class="form-control filter-field btn_search ps-5" id="_work_shift_list_search" placeholder="Search...">
                <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-4 text-muted"></i>
            </div>
            
        </div>
        <div class="d-flex align-items-center justify-content-end w-50">
            <button type="button" class="btn_add" id="_btnAddWorkShift">
                <span><i class="fa fa-calendar mr-2"></i>Add Shift</span>
            </button>
        </div>
    </div>
    <div id="_work_shift_lists" class="mt-3 px-3"></div>
</div>
