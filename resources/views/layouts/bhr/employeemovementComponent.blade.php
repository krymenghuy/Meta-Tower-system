<div id="_main_employeeMovementComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between w-100 p-3 " id="_divFilter">
        <div class="d-flex align-items-center w-50 gap-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field" id="_sdl_search_emp_movement"
                    placeholder="Search Movement">
            </div>
            <div class="d-flex align-items-center w-25 gap-2 pr-4 ">
                <select type="id" id="el_event" class="data-input filter-field" data-field="event_id"></select>
            </div>

        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-50 p-2">
            <div class="d-flex align-items-center justify-content-end gap-2 w-30">
                <label for="" class="form-label text-nowrap" vslang="titles.Sort By"></label>
                <select type="id" id="el_sort_by" class="data-input filter-field"></select>
            </div>
            <button type="button" class="btn btn-primary" id="_btnAddMovement">
                <i class="fas fa-plus"></i>
                <span>Add Movement</span>
            </button>
        </div>
    </div>

    <div class="p-3">
        <div id="_emp_movement_list"></div>
    </div>
</div>
<style>
    #_seniority_list_paginator {
        display: flex;
        position: fixed;
        bottom: 0;
    }
</style>
