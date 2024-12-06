<div id="_main_positionComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex  p-3 justify-content-between w-200 " id="_divFilter">
        <div class="d-flex align-items-center justify-content-start gap-2 w-100">
            <button type="button" class="btn_add" id="_btnAddPosition">
                <i class="fas fa-plus"></i>
                <span>Add Position</span>
            </button>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100 gap-2">
            <div class="d-flex align-items-center w-75">
                <input type="text" class="form-control btn_search filter-field" id="_sdl_search_position"
                    placeholder="Search Position">

                
            </div>
        </div>
    </div>
    <div id="_position_list" class="pt-3 px-3"></div>
</div>
<style>
    #_position_list_paginator {
        bottom: 0;
    }

    #_position_list {
        height: 550px;
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
        white-space: wrap;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: nowrap;
        max-width: 100px;
    }
</style>
