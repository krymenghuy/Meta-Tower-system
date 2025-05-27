<div id="_main_register_deceased_component" style="display:none;padding:20px 0 0;">
    <div class="d-flex justify-content-between w-100 rounded-2 shadow p-4" id="_divFilter_register_deceased">
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

        <div class="d-flex align-items-center justify-content-start w-50 gap-2">
            <div class="d-flex align-items-center w-50">
                <input type="text" class="form-control rounded-5 filter-field" id="_search_register_deceased"
                    placeholder="Search">
            </div>
          
            <div class="d-flex align-items-center justify-content-end gap-2 w-25">
                <button type="button" class="btn_add" id="_btnRegisterDeceased">
                    <i class="fa fa-street-view mr-2"></i>
                    <span>Register</span>
                </button>
            </div>

        </div>

    </div>
    <div id="_register_deceased_list" class="pt-3 p-4"></div>
</div>
