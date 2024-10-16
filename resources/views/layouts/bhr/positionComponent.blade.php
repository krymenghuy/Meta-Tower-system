<div id="_main_positionComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex  p-3 justify-content-between w-200 " id="_divFilter">
        <div class="d-flex align-items-center justify-content-start gap-2 w-100">
            <button type="button" class="btn btn-primary" id="_btnAddPosition">
                <i class="fas fa-plus"></i>
                <span>Add Position</span>
            </button>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100 gap-2">
            <div class="d-flex align-items-center w-100 gap-2">
                <input type="text" class="form-control filter-field" id="_sdl_search_position"
                    placeholder="Search Position">

                <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                    <i class="la la-search"></i>
                </button>
                <div class="d-flex align-items-center">
                    <!-- <label for="" class="form-label  p-2" vslang="titles.Status"></label> -->
                    <select type="id" id="el_status" class="data-input filter-field" data-field="status_id"></select>
                </div>
            </div>
        </div>
    </div>
    <div id="_position_list" class="p-3"></div>
</div>
<style>
    #_position_list_paginator {
        display: flex;
        position: fixed;
        bottom: 0;
    }

    #_position_list {
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        height: 550px;
        gap: 10px;
        justify-content: center;
        padding: 20px;
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
