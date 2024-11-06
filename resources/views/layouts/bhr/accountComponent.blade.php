<div id="_main_accountComponent" style="display:none;padding:20px 0 0">
    <div id="sub_content" class="p-0">
        <div class="d-flex justify-content-between w-100 p-2" id="_divFilter">
            <div class="d-flex align-items-center w-50 gap-2">
                <div class="d-flex align-items-center w-50 gap-2 pl-3">
                    <input type="text" class="form-control filter-field" data-field="search_value"
                        id="_sdl_search_account" placeholder="Search Account">
                </div>

            </div>
            <div class="d-flex align-items-center justify-content-end gap-2 w-50 pr-3">
                <div class="d-flex align-items-center justify-content-end gap-2 w-30">
                    <label for="" class="form-label text-nowrap" vslang="titles."></label>
                    <select type="id" id="el_sort_by" class="data-input filter-field"
                        data-field="sort_by"></select>
                </div>
                <button type="button" class="btn btn-primary" id="_btnAddAccount">
                    <i class="fas fa-plus"></i>
                    <span>Add Account</span>
                </button>
            </div>
        </div>

        <div id="_account_list" class="m-4"></div>
    </div>

    <div class="d-none " id="view_transaction_info">
        <div class="d-flex px-3 pt-3" id="btn_back">
            <button id="_btn_backTo_account" style="background-color:#2b3991; width:100px;"
                class="btn text-white shadow rounded-4 m-2 p-2" type="button">
                <i class="fa-solid fa-angles-left "></i>
                <span class="" vslang="buttons.Back">Back</span>
            </button>
        </div>
        <div id="_transaction_info" class="m-4"> </div>

    </div>
</div>
<style>
    #_account_list{
        height: 500px;
        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    #_account_list_paginator {
        bottom: 0;
        margin-top: 20px;
    }
</style>
