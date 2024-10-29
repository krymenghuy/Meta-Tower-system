<div id="_main_employeeMovementComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between w-100 p-3" id="_divFilter">
        <div class="d-flex align-items-start w-100">
            <div class="d-flex w-50">
                <button type="button" class="btn text-white" style="background-color:#2b3991;" id="_btnAddMovement">
                    <i class="fas fa-plus"></i>
                    <span>Add Movement</span>
                </button>
            </div>
            <div class="d-flex align-items-center justify-content-end gap-2 w-75 gap-3">
                <div class="d-flex w-50 gap-3">
                    <div class="d-flex align-items-end w-100">
                        <input type="text" class="form-control rounded-5 filter-field" id="_sdl_search_emp_movement"
                            placeholder="Search Movement">
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <label for="" class="form-label px-2 text-nowrap text-primary-custom"
                        vslang="titles.Sort By"></label>
                    <select type="id" id="el_sort_by" class="data-input filter-field"></select>
                </div>
                <div class="d-flex align-items-center">
                    <select type="id" id="el_event" class="data-input filter-field"
                        data-field="event_id"></select>
                </div>
            </div>
        </div>
    </div>
    <div class="shadow mt-2 overflow-hidden">
        <div class="px-3" id="_emp_movement_list"></div>
    </div>
</div>

