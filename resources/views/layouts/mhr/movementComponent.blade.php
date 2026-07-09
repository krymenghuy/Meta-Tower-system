<div id="_main_employeeMovementComponent" style="display:none;padding:20px 0 0;">
    <div class="d-flex justify-content-between shadow rounded-3 w-100 p-3" id="_divFilter">
        <div class="d-flex align-items-start w-100">
            <div class="d-flex align-items-center w-50">
                <div class="d-flex align-items-start w-75">
                    <div class="position-relative w-100">
                        <input type="text" class="form-control filter-field btn_search ps-5" id="_search_emp_movement" placeholder="Search...">
                        <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-4 text-muted"></i>
                    </div>
                    
                </div>
            </div>
            <div class="d-flex align-items-center justify-content-end w-50 gap-3">
                <div class="d-flex w-25">
                    <select type="id" id="el_employee" class="data-input filter-field" data-field="emp_id"></select>
                </div>
                <div class="d-flex align-items-center w-50">
                    <select type="id" id="el_event" class="data-input filter-field"
                        data-field="event_id"></select>
                </div>
            </div>
        </div>
    </div>
    <div class="px-3 mt-3" id="_emp_movement_list"></div>
</div>
