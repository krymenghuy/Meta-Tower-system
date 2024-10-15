<div id="_main_leave_component"  style="display:none;padding:20px 0 0">
    <div class="d-flex  p-3 justify-content-between w-200 " id="_divFilter_leave">
        <div class="d-flex align-items-center w-100 gap-2">
            <div class="d-flex align-items-center w-100 gap-2">
                <input type="text" class="form-control filter-field" id="_sdl_search_leave" placeholder="Search Leave">

                <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                    <i class="la la-search"></i>
                </button>
                <div class="d-flex align-items-center w-50 gap-2form-group w-50">
                    <label for="" class="form-label  p-2" vslang="titles.Status"></label>
                    <select type="id" id="el_status" class="data-input filter-field" data-field="status"></select>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-100">
            <button type="button" class="btn btn-primary" id="_btnAddLeave">
                <i class="fas fa-plus"></i>
                <span>Add Leave Request </span>
            </button>
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
