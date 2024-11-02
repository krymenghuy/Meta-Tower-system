<div id="_main_accountComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between w-100 p-4" id="_divFilter">
        <div class="d-flex align-items-center w-50 gap-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field" data-field="search_value" id="_sdl_search_account"
                    placeholder="Search Account">
            </div>
            
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-50 p-2">
            <div class="d-flex align-items-center justify-content-end gap-2 w-30">
                <label for="" class="form-label text-nowrap" vslang="titles."></label>
                <select type="id" id="el_sort_by" class="data-input filter-field" data-field="sort_by"></select>
            </div>
            <button type="button" class="btn btn-primary" id="_btnAddAccount">
                <i class="fas fa-plus"></i>
                <span>Add Account</span>
            </button>
        </div>
    </div>

    <div id="_account_list" class="m-4"></div>
</div>
<style>
    #_account_list{
        height: 510px;
        padding-bottom: 30px;
        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: none;
    }
    #_account_list_paginator {
        display: flex;
        position: fixed;
        bottom: 0;
    }
</style>
