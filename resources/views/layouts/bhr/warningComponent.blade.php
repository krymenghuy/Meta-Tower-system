<div id="_main_warningComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex  px-3 mt-3 justify-content-between w-100 " id="_warning_component">
        <div class="d-flex align-items-center w-100 gap-2">
        <button type="button" class="btn_add" id="_btnAddWarning">
                <span>Employee Warning</span>
            </button>
            
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-100">
        <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field btn_search" id="_warning_search" placeholder="Search Warning Here ........">

               
            </div>
        </div>
    </div>
    <div id="_warning_list" class="px-3 mt-4"></div>
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
   #_main_warningComponent th,
   #_main_warningComponent td {
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
