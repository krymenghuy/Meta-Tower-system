<div id="_main_seniorityComponent"  style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between w-100 p-3 " id="_divFilter">
        <div class="d-flex align-items-center w-50 gap-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field" id="_sdl_search_seniority"
                    placeholder="Search Seniority">
            </div>
            <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                <i class="la la-search"></i>
            </button>

        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-50 p-2">
            <div class="d-flex align-items-center justify-content-end gap-2 w-30 pl-5">
                <label for="" class="form-label text-nowrap" vslang="titles.Sort By"></label>
                <select type="id" id="el_sort_by" class="data-input filter-field"></select>
            </div>
            <button type="button" class="btn btn-primary" id="_btnAddseniority">
                <i class="fas fa-plus"></i>
                <span>Add Seniority</span>
            </button>
        </div>
    </div>

    <div class="p-3">
        <div id="_seniority_list"></div>
    </div>
</div>
<style>
    #_seniority_list_paginator{
        display: flex;
        position: fixed;
        bottom: 0;
    }
    #_seniority_list{
        overflow-y: auto;
        max-height: 420px;
        margin-bottom: 30px;
    }
</style>
