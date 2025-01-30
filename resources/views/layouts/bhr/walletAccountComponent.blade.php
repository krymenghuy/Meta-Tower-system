<div id="_main_walletAccountComponent" style="display:none;padding:20px 0 0">
    <div id="sub_wallet_content" class="p-0">
            <div class="d-flex justify-content-between w-100 p-3 mt-2 rounded-2 shadow" id="_divFilter">
            <div class="d-flex align-items-center w-50 gap-2">
                <div class="d-flex align-items-center w-50 gap-2 pl-3">
                    <input type="text" class="form-control filter-field btn_search"
                        id="_sdl_search_wallet_account"data-field="search_value" placeholder="Search here">
                </div>
            </div>
            <div class="d-flex align-items-center justify-content-end gap-2 w-50 pr-3">
                <div class="d-flex align-items-center justify-content-end gap-2 w-30">
                    <label for="" class="form-label text-nowrap" vslang="titles."></label>
                    <select type="id" id="el_sort_by" class="data-input filter-field"
                        data-field="sort_by"></select>
                </div>
                <button type="button" class="btn_add" id="_btnWalletAddAccount">
                    <i class="fas fa-plus"></i>
                    <span>Add Account</span>
                </button>
                <button type="button" class="btn_add" id="_btnWalletAddAccountMissing">
                    <i class="fas fa-plus"></i>
                    <span>Add Account Missing</span>
                </button>
            </div>
        </div>

        <div id="_wallet_account_list" class="m-4"></div>
    </div>

    <div class="d-none" id="view_wallet_transaction">
        <div class="d-flex w-100 bg-white rounded-3 shadow p-2 justify-content-between">
            <div class="d-flex px-3 pt-3" id="btn_back">
                <button id="_btn_backTo_wallet_account" style="background-color:#2b3991; width:100px;"
                    class="btn text-white shadow rounded-4 m-2 p-2" type="button">
                    <i class="fa-solid fa-angles-left"></i>
                    <span class="" vslang="buttons.Back">Back</span>
                </button>
            </div>
            <div class="d-flex px-3 pt-3">
                <button id="_print_transaction" style="background-color:#2b3991; width:100px;"
                    class="btn text-white shadow rounded-4 m-2 p-2" type="button" id="_print_transaction">
                    <i class="fa-solid fa-print"></i>
                    <span class="" vslang="buttons.Print">Print</span>
                </button>
            </div>
        </div>
        <div id="_wallet_transaction_info" class="m-4" style="height:500px; overflow-y:auto;"> </div>
    </div>

</div>

