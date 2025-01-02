<div id="_main_employee_benefit_component" style="display:none; padding: 20px 0 0">
    <div class="d-flex justify-content-between w-100 p-3 mt-2 rounded-2 shadow" id="_divFilter_employee_benefit">
        <div class="d-flex align-items-center w-50 gap-2">
            <button type="button" class="btn btn-primary-custom rounded-5" id="_btn_add_benefit">
                <i class="fa-solid fa-layer-group"></i>
                <span>Add Benefit</span>
            </button>
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-50">
            <div class="d-flex align-items-center justify-content-end gap-2 w-25 pr-2">
                <select type="id" id="el_benefit" class="data-input filter-field" data-field="benefit_id"></select>
            </div>
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field btn_search" id="_sdl_search_bonus"
                    placeholder="Search Benefits">
            </div>
        </div>
    </div>

    <div class="">
        <div id="_employee_bonus_list" class="mt-4 p-3"></div>
    </div>
</div>
<style>
    #_employee_bonus_list_paginator {
        bottom: 0;
    }

    #_main_employee_benefit_component th,
    #_main_employee_benefit_component td {
        padding: 10px;
        vertical-align: middle;
        text-align: left;
        overflow: hidden;
        white-space: wrap;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: nowrap;
        max-width: 100px;
    }
</style>
