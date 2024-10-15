<div id="_main_bonusComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex  p-3 justify-content-between w-100 " id="_divFilter">
        <div class="d-flex align-items-center w-50 gap-2">
            <div class="w-50">
                <input type="text" class="form-control filter-field" id="_sdl_search_bonus" placeholder="Search Bonus">
            </div>
            <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                <i class="la la-search"></i>
            </button>
            <button type="button" class="btn btn-primary" id="_btnAddBonus">
                <i class="fas fa-plus"></i>
                <span>Add Bonus</span>
            </button>
        </div>


    </div>

    <div class="p-3">
        <div id="_bonus_list"></div>
    </div>
</div>
<style>
    #_bonus_list_paginator {
        display: flex;
        position: fixed;
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
