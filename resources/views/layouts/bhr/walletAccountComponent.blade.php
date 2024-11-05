<div id="_main_walletAccountComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between w-100 p-2 " id="_divFilter">
        <div class="d-flex align-items-center w-50 gap-2">
            <div class="d-flex align-items-center w-50 gap-2 pl-3">
                <input type="text" class="form-control filter-field" id="_sdl_search_wallet_account"data-field="search_value"
                    placeholder="Search Here">
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-50 pr-3">
            <div class="d-flex align-items-center justify-content-end gap-2 w-30">
                <label for="" class="form-label text-nowrap" vslang="titles."></label>
                <select type="id" id="el_sort_by" class="data-input filter-field" data-field="sort_by"></select>
            </div>
            <button type="button" class="btn btn-primary" id="_btnWalletAddAccount">
                <i class="fas fa-plus"></i>
                <span>Add Account</span>
            </button>
        </div>
    </div>

    <div id="_wallet_account_list" class="m-4"></div>
</div>
<style>
    #_wallet_account_list{
        height: 460px;
        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    #_wallet_account_list_paginator {
        bottom: 0;
    }
</style>
