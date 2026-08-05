<div id="_main_employeeMovementComponent" class="mobile-padding px-3" style="display:none;">
    <div class="bg-white p-3 rounded-2 shadow" id="_divFilter">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_emp_movement"
                    placeholder="{{ \Vsd\Locales\Localization::trans('Search by name', 'titles') }}">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="el_employee" class="filter-field data-input" data-field="emp_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="el_event" class="data-input filter-field" data-field="event_id"></select>
            </div>
        </div>
    </div>
    <div class="mt-3" id="_emp_movement_list"></div>
</div>


