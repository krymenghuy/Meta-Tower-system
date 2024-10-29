<div id="_main_departmentComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex  p-4 justify-content-between w-200 " id="_divFilter">
        <div class="d-flex align-items-center justify-content-start gap-2 w-100">
            <button type="button" class="btn btn-primary" id="_btnAddDepartment">
                <i class="fas fa-plus"></i>
                <span>Add Department</span>
            </button>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100 gap-2">
            <div class="d-flex align-items-end w-50 gap-2">
                <input type="text" class="form-control filter-field" id="_sdl_search_department"
                    placeholder="Search Department">

                <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                    <i class="la la-search"></i>
                </button>
            </div>
        </div>

    </div>
    <div id="_dep_list" class="m-4"></div>
</div>
<style>
    #_dep_list {
        height: 600px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;

    }

    #_dep_list_paginator {
        bottom: 0;
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
