<div id="_main_accountComponent" class="mobile-padding px-3" style="display:none;">
    <div id="sub_content_account" class="p-0">
        <div class="d-flex p-3 justify-content-between rounded-2 shadow" id="_divFilter">
                <div class="d-flex align-items-center w-25 gap-2 pl-3">
                    <div class="position-relative w-100">
                        <input type="text" class="form-control filter-field btn_search ps-5" id="_sdl_search_account" placeholder="Search...">
                        <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-4 text-muted"></i>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2 w-25">
                    <select id="el_sort_by_department" class="data-input filter-field"
                        data-field="department_id"></select>
                </div>
                <div class="d-flex align-items-center gap-2 w-30">
                    <select id="el_sort_by_account" class="modal-select2 data-input filter-field" data-field="is_master_account">
                        <option value="1">Master Account</option>
                        <option value="0" selected>Staff Account</option>
                    </select>
                </div>
                <div class="d-flex align-items-center gap-2 w-30">
                    <button type="button" class="btn btn-primary btn_add" id="_btnAddAccount">
                        <i class="fas fa-user"></i>
                        <span class="text-nowrap" vslang="titles.Create Account"></span>
                    </button>
                </div>
                <div class="d-flex align-items-center  gap-2 w-30">
                    <button type="button" class="btn btn-primary btn_add" id="_btnAddAccountMissing">
                        <i class="fas fa-user"></i>
                        <span vslang="titles.Bulk Create"></span>
                    </button>
                </div>
        </div>

        <div id="_account_list" class=" mt-4 px-4"></div>
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
