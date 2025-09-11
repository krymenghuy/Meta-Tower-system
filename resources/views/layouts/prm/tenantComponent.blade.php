<div id="_main_accountStaff_component" class="mobile-padding p-3" style="display:none;">
    <div class="d-flex justify-content-between w-100 rounded-2 shadow p-3 mt-2" style="background-color:#ffffff;" id="_divFilter_accountStaff">
        <div class="d-flex justify-content-start gap-3 w-50">
            <div class="d-flex justify-content-start w-50 position-relative">
                <input type="text" class="form-control rounded-2 filter-field pe-5" id="_search_accountStaff_info" placeholder="Search">
                <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
            </div>
             <div class="d-flex">
                    <select type="id" id="el_status" class="data-input filter-field" data-field="status_id"></select>
                </div>
        </div>
        <div class="d-flex align-items-center justify-content-end w-50">
            <button type="button" class="btnAddNewPrm" id="_btnAddAccountStaff">
                <i class="fa fa-user-plus me-2"></i>
                <span vslang="buttons.Create Account Staff"></span>
            </button>
        </div>
    </div>
    <div id="_staffAccount_info_list" class="mt-3 p-3 bg-white rounded-2"></div>
</div>
