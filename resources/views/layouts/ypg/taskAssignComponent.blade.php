<div id="_main_task_assign_component" style="display:none;padding:20px 0 0;">
    <div class="d-flex justify-content-between w-100 rounded-2 shadow p-4" id="_divFilter_task_assign">

        <div class="d-flex justify-content-end w-50">
            <div class="d-flex filter-date-custom w-50">
                <label for="" class="form-label text-nowrap" style="color:#d1b54a;"
                    vslang = "filters.Start Date :"></label>
                <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="start_date"
                    placeholder="Start Date" />
            </div>
            <div class="d-flex filter-date-custom w-50">
                <label for="" class="form-label" style="color:#d1b54a;" vslang = "filters.End Date :"></label>
                <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="end_date"
                    placeholder="End Date" />
            </div>
        </div>

        <div class="d-flex justify-content-end w-50">
            <div class="d-flex align-items-center w-50">
                <input type="text" class="form-control rounded-5 filter-field" id="_search_task_assign"
                    placeholder="Search">
            </div>
            <div class="d-flex align-items-center justify-content-end w-25">
                <select type="id" id="el_status" class="data-input filter-field" data-field="status_id"></select>
            </div>
            <button type="button" class="btn_add" id="_btnTaskAssign">
                <i class="fa fa-street-view mr-2"></i>
                <span> Task Assign</span>
            </button>
        </div>
    </div>
    <div id="_task_assign_list" class="pt-3 p-4"></div>
</div>
