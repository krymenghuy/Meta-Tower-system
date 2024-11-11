<div id="_main_warningComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex  p-4 justify-content-between w-200 " id="_warning_component">
        <div class="d-flex align-items-center w-100 gap-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field btn_search" id="_warning_search" placeholder="Search Warning Here ........">

                <button id="_sdl_btnSearch" role="button" class="btn btn-primary rounded-5">
                    <i class="la la-search"></i>
                </button>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-100">
            <button type="button" class="btn_add" id="_btnAddWarning">
                <i class="fas fa-plus"></i>
                <span>Add Warning</span>
            </button>
        </div>
    </div>
    <div id="_warning_list" class="m-4"></div>
</div>

<style>
    #_warning_list_paginator{
        bottom: 0;
    }
    #_warning_list {
        height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }
    th,
    td {
        padding: 10px;
        vertical-align: middle;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: nowrap;
        max-width: 100px;
    }
</style>
