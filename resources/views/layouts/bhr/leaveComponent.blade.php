<div id="_main_leave_component"  style="display:none;padding:20px 0 0">
    <div class="d-flex  p-3 justify-content-between w-200 " id="_divFilter_leave">
        <div class="d-flex align-items-center w-100 gap-2 p-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field" id="_sdl_search_leave" placeholder="Search">


            </div>
                <div class="d-flex align-items-center w-25 gap-2">
                    <!-- <label for="" class="form-label  p-2" vslang="titles.Status"></label> -->
                    <select type="id" id="el_status" class="data-input filter-field" data-field="status"></select>
                </div>
                <div class="d-flex align-items-center w-25 gap-2 pr-4 ">
                    <select type="id" id="el_leave_type" class="data-input filter-field" data-field="leave_type"></select>
                </div>

        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-100 p-2">
            <div class="d-flex align-items-center justify-content-end gap-2 w-30">
                <input data-select="datepicker" class="form-control filter-field" data-field="start_date" placeholder="Start Date" id="_leave_filter_start_date" />
            </div>
            <div class="d-flex align-items-center justify-content-end gap-2 w-30">
                    <input data-select="datepicker" class="form-control filter-field" data-field="end_date" placeholder="End Date" id="_leave_fliter_end_date" />
                </div>
            <div class="d-flex align-items-center justify-content-end gap-2 w-40 text-nowrap">
                <button type="button" class="btn btn-primary" id="_btnAddLeave">
                    <i class="fas fa-plus"></i>
                    <span>Add Leave Request </span>
                </button>
            </div>
        </div>

    </div>
    <div id="_leave_request_list" class="p-3"></div>
</div>

<style>
    #_leave_request_list_paginator{
        display: flex;
        position: fixed;
        bottom: 0;
    }
</style>
