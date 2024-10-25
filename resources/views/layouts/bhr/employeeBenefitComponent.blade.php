<div id="_main_employee_benefit_component" style="display:none; padding: 20px;">
    <div class="d-flex justify-content-between w-100 p-3 " id="_divFilter_emp_benefit">
        <div class="d-flex align-items-center w-50 gap-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field" id="_sdl_search_bonus" placeholder="Search Bonus">
            </div>
            <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                <i class="la la-search"></i>
            </button>
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-50">
            <div class="d-flex align-items-center justify-content-end gap-2 w-50">
                <label for="" class="form-label " vslang="titles"></label>
                <select type="id" id="el_category" class="data-input filter-field" data-field="category"></select>
            </div>
            <button type="button" class="btn btn-primary" id="_btn_add_benefit">
                <i class="fas fa-plus"></i>
                <span>Add Benefit</span>
            </button>
        </div>
    </div>

    <div class="p-3">
        <div id="_employee_bonus_list"></div>
    </div>
</div>
<style>
    #_employee_bonus_list_paginator {
        display: flex;
        position: fixed;
        bottom: 0;
    }

    th,
    td {
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
    #_employee_bonus_list{
        height: 550px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }
</style>
