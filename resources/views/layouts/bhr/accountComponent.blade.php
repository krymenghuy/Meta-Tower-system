<div id="_main_accountComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between w-100 p-3 " id="_divFilter">
        <div class="d-flex align-items-center w-50 gap-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field" id="_sdl_search_account"
                    placeholder="Search Account">
            </div>
            <div class="d-flex align-items-center w-50">
                <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="create_date" placeholder="Start Date" id="_leave_filter_start_date" />
            </div>
            <div class="d-flex align-items-center w-50">
                <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="update_date" placeholder="End Date" id="_leave_fliter_end_date" />
            </div>

        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-50 p-2">
            <div class="d-flex align-items-center justify-content-end gap-2 w-30">
                <label for="" class="form-label text-nowrap" vslang="titles."></label>
                <select type="id" id="el_sort_by" class="data-input filter-field"></select>
            </div>
            <button type="button" class="btn btn-primary" id="_btnAddAccount">
                <i class="fas fa-plus"></i>
                <span>Add Account</span>
            </button>
        </div>
    </div>

    <div class="p-3">
        <div id="_account_list"></div>
    </div>
</div>
<style>
    #_account_list{
        height: 560px;
        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    #_account_list_paginator {
        bottom: 0;
    }
</style>
