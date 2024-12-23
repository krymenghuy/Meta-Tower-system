<div id="_main_leave_component" style="display:none;padding:20px 0 0;">
    <div id="_divFilter_leave" class="px-3">
        <div class="d-flex w-100 gap-2 bg-white shadow rounded-3 p-3">
            <div class="d-flex w-50">
                <button type="button"  class="btn_add" id="_btnAddLeave">
                    <!-- <i class="fas fa-plus"></i> -->
                    <span>Leave Request</span>
                </button>
            </div>
            <div class="d-flex justify-content-end gap-3 w-50">
                <div class="d-flex align-items-center w-75">
                    <input type="text" class="form-control filter-field btn_search" id="_sdl_search_leave"
                        placeholder="Search here....">
                </div>
                <div class="d-flex align-items-center" style="width:200px">
                    <select id="el_status" class="data-input filter-field " data-field="status"></select>
                </div>
                

            </div>

        </div>
        <div class="d-flex align-items-center gap-2 w-100">
            <div class="d-flex w-50">
               
            </div>
            <div class="d-flex justify-content-end w-50 gap-3 p-2">
                <div class="d-flex flex-column w-50">
                    <label for="_leave_filter_start_date" class="form-label" style="color:#d1b54a;">Start Date</label>
                    <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="start_date"
                        placeholder="Start Date" id="_leave_filter_start_date" />
                </div>
                <div class="d-flex flex-column w-50">
                    <label for="_leave_fliter_end_date" class="form-label" style="color:#d1b54a;">End Date</label>
                    <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="end_date"
                        placeholder="End Date" id="_leave_fliter_end_date" />
                </div>
            </div>

        </div>
    </div>
    <div id="_leave_request_list" class="mt-3 px-3"></div>
</div>

<style>
    #_leave_request_list {
        height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    #_leave_request_list_paginator {
        bottom: 0;
    }
</style>
