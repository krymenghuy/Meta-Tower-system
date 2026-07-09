<div id="_main_emp_leave_component" class="px-3 mobile-padding" style="display:none;">
    <div id="_divFilter_emp_leave" class="bg-white rounded-2 shadow p-3">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_leave" placeholder="Search here....">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="el_status" class="filter-field data-input" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="el_leave_type" class="filter-field data-input" data-field="leave_type_id"></select>
            </div>
            
            <div class="ms-md-auto text-md-end col-12 col-md-auto" style="overflow:visible;">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddLeave">
                    <i class="fa-solid fa-right-from-bracket" style="color: rgb(249, 251, 255);"></i>
                    <span vslang="buttons.Set Leave"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_leave_request_list" class="mt-3"></div>
</div>
