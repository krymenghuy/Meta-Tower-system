<style>
    .btn-act-inactive {
        padding: 14px;
        color: #fe1f1f;
        background-color: #ff000059;
        border-radius: 5px;
        text-align: center;
    }

    #work_shift_type {
        background-color: #1f386b;
        color: #fff;
        border-radius: 5px;
    }

    .btn-act-check-in {
        padding: 14px;
        color: #008767;
        background-color: #16c0985c;
        border-radius: 5px;
        text-align: center;
    }

    .bg-check-out {
        padding: 14px;
        color: #84600b;
        background-color: #ffe625ae;
        border-radius: 5px;
        text-align: center;
    }

    ._work_shift_body {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    ._work_shift_body .row {
        display: flex;
        justify-content: space-between;

    }

    .time_cards {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        flex: 1;
        margin-left: 15px;
        padding: 5px;
    }

    #_main_workshiftComponent .row {
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        height: 440px;
        border-radius: 8px;
        width: 100%;
    }

    .day_card {
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        width: 100%;
    }

    .day_label {
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 1.2em;
        text-transform: uppercase;
    }

    .shift_card {
        display: flex;
        justify-content: space-between;
        background-color: #fff;
        /* border: 1px solid #545252; */
        border-radius: 5px;
        margin: 5px 0;
        padding: 10px;
        width: 100%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .shift_element {
        text-align: left;
    }

    .shift_time {
        font-size: 1em;
        font-weight: bold;
        margin-bottom: 5px;
    }

    .shift_action {
        font-size: 0.9em;
        color: #555;
    }



    .shift_header:hover,
    .shift_date:hover {
        background-color: rgba(255, 255, 255, 0.509);
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

    .week {
        display: flex;
        gap: 7px;
        /* Adds spacing between the days */
    }

    .days {
        flex: 1;
        padding: 10px 0;
        border: 2px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
        user-select: none;
        transition: all 0.3s ease;
    }

    .days:hover {
        border-color: #1de67a;
        background-color: #bfdffb;
    }

    .days.active {
        border-color: #00ff9d;
        background-color: #007bff;
        color: white;
    }

    #shift-container {
        display: grid;
        grid-template-rows: auto 1fr;
        gap: 10px;
        padding: 10px;
        font-family: Arial, sans-serif;
    }

    .shift-header {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        background-color: #324c80;
        color: white;
        padding: 10px 0;
        text-align: center;
        font-weight: bold;
    }

    .shift-body {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px;
    }

    .shift-column {
        min-height: 150px;
        border: 1px solid #ddd;
        padding: 5px;
        background-color: #f9f9f9;
    }

    .shift-entry {
        padding: 10px;
        margin: 5px 0;
        text-align: center;
        border-radius: 5px;
    }

    .check-in {
        background-color: #c8f1e0;
        color: #045d56;
    }

    .check-out {
        background-color: #e0e7f9;
        color: #3b5998;
    }

    .weekend {
        background-color: #f9d6d6;
        color: #a94442;
    }

    .bg-green {
        background-color: #57c899;
        /* border: #02ffc4 2px solid; */
        color: white;
        border-radius: 5px;
        padding: 10px;
        margin: 5px 0;
    }

    .bg-gold {
        background-color: #e3aa00db;
        color: white;
        border-radius: 5px;
        padding: 10px;
        margin: 5px 0;
    }

    .bg-red {
        background-color: #b95862;
        color: white;
        border-radius: 5px;
        padding: 10px;
        margin: 5px 0;
    }

    .shift_card {
        padding: 10px;
        /* border: 1px solid #314166; */
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
        margin: 5px 0;
    }

    .day_label {
        font-weight: bold;
        font-size: 1.2em;
        margin-bottom: 10px;
        text-transform: uppercase;
    }

    .no_shifts {
        font-size: 0.9em;
        color: #999;
        margin-top: 5px;
    }

    .days.disabled {
        pointer-events: none;
        opacity: 0.5;
    }
</style>

<div id="_main_work_shiftComponent" class="px-3 mobile-padding" style="display:none;">
    <div class="bg-white shadow p-3 rounded-2" id="_divFilter">
        <div class="d-flex align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <select id="el_work_shift" name="shifts" class="filter-field data-input" data-field="shifts"></select>
            </div>
            <div class="ms-md-auto text-md-end col-12 col-md-auto" style="overflow:visible;">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddShiftDetail" title="Create new shift">
                    <i class="fa-solid fa-qrcode" style="color: rgb(255, 255, 255);"></i>
                    
                    <span vslang="buttons.Create Scan Time"></span>
                </button>
            </div>
        </div>
    </div>

    <div id="_work_shift_header" class="mt-3"> 
    </div>

    <div id="_work_shift_body" class="px-2">

    </div>
</div>
