<div id="_main_accountComponent" class="mobile-padding px-3" style="display:none;">
    <div id="sub_content_account">
        <div class="bg-white rounded-2 shadow p-3" id="_divFilter">
                <div class="align-items-center row g-3">
                    <div class="col-12 col-md-6 col-lg-3">
                        <input type="text" class="filter-field rounded-2 input-search" id="_sdl_search_account" 
                        placeholder="{{ \Vsd\Locales\Localization::trans('Search by name', 'titles') }}">
                    </div>
                    <div class="col-12 col-md-6 col-lg-2">
                        <select id="el_department" class="data-input filter-field form-control" data-field="department_id">
                        </select>
                    </div>
                    <div class="col-12 col-md-6 col-lg-2">
                        <select id="el_account" class="data-input filter-field form-control" data-field="is_master_account">
                            <!-- <option value="1">Master Account</option>
                            <option value="0" selected>Staff Account</option> -->
                        </select>
                    </div>
                    <div class="ms-md-auto col-12 col-md-6 col-lg-5">
                        <div class="justify-content-end row g-2">
                            <div class="col-12 col-md-auto">
                                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddAccount">
                                    <i class="fas fa-user"></i>
                                    <span class="text-nowrap" vslang="buttons.Create Account"></span>
                                </button>
                            </div>

                            <div class="col-12 col-md-auto">
                                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddAccountMissing">
                                    <i class="fas fa-user"></i>
                                    <span vslang="buttons.Bulk Create"></span>
                                </button>
                            </div>
                        </div>
                        
                    </div>
                </div>
             
        </div>

        <div id="_account_list" class=" mt-3"></div>
    </div>

    <div class="d-none" id="view_transaction">
        <div class="d-flex w-100 bg-white rounded-3 shadow p-2 justify-content-between">
            <div class="d-flex px-3 pt-3">
                <button id="_btn_backTo_account" style="background-color:#2b3991; width:100px;"
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
        <div id="_transaction_info" class="m-4" style="height:500px; overflow-y:auto;"> </div>
    </div>

</div>
