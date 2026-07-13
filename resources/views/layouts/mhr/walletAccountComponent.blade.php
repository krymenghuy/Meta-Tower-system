<div id="_main_walletAccountComponent" class="mobile-padding px-3" style="display:none;">
    <div id="sub_wallet_content">
            <div class="bg-white p-3 rounded-2 shadow" id="_wla_divFilter">
            <div class="row align-items-center g-3">
                <div class="col-12 col-md-6 col-lg-3">
                    <input type="text" class="filter-field rounded-2 input-search" id="_wla_search_wallet_account" 
                    placeholder="{{ \Vsd\Locales\Localization::trans('Search by name', 'titles') }}">
                </div>
                <div class="col-12 col-md-6 col-lg-2">
                    <select id="_wla_filter_department" class="data-input filter-field form-control" data-field="department_id">
                    </select>
                </div>
                    <div class="ms-md-auto col-12 col-md-6 col-lg-5">
                        <div class="justify-content-end row g-2">
                            <div class="col-12 col-md-auto">
                                <button type="button" class="btnAddNewPrm" id="_btnWalletAddAccount">
                                    <i class="fas fa-plus"></i>
                                    <span vslang="buttons.Create Account"></span>
                                </button>
                            </div>
                            <div class="col-12 col-md-auto">
                                <button type="button" class="btnAddNewPrm" id="_btnWalletAddAccountMissing">
                                    <i class="fas fa-plus"></i>
                                    <span vslang="buttons.Bulk Create"></span>
                                </button>
                            </div>
                        </div>
                    </div>
            </div>
        </div>

        <div id="_wallet_account_list" class="mt-3"></div>
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

