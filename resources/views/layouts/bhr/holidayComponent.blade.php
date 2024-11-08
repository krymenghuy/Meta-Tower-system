<div id="_main_holidayComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between w-100 p-4" id="_divFilter">
        <div class="d-flex align-items-start w-100">
            <div class="d-flex w-50">
                <button type="button" class="btn text-white rounded-5" style="background-color:#2b3991;"
                    id="_btnAddHoliday">
                    <i class="fas fa-plus"></i>
                    <span>Add Holiday</span>
                </button>
            </div>
            <div class="d-flex align-items-center justify-content-end gap-2 w-75 gap-3">
                <div class="d-flex justify-content-end gap-3 w-50">
                    <div class="d-flex align-items-center w-50">
                        <input data-select="datepicker" class="form-control filter-field rounded-5"
                            data-field="start_date" placeholder="Start Date" id="_leave_filter_start_date" />
                    </div>
                    <div class="d-flex align-items-center w-50">
                        <input data-select="datepicker" class="form-control filter-field rounded-5"
                            data-field="end_date" placeholder="End Date" id="_leave_fliter_end_date" />
                    </div>
                </div>
                <div class="d-flex w-50 gap-3">
                    <div class="d-flex align-items-end w-100">
                        <input type="text" class="form-control btn_search filter-field" id="_sdl_search_holiday"
                            placeholder="Search Holiday">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="m-4" id="_holiday_list"></div>
</div>
<style>
    #_holiday_list {
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        max-height: 500px;
    }
</style>
