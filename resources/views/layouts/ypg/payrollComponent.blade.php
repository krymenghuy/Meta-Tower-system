<div id="_main_payrollComponent" style="display:none;padding:20px 0 0;">
    <div class="d-flex justify-content-between w-100 p-4 rounded-2 shadow" id="_divFilter">
        <div class="d-flex align-items-center justify-content-start gap-3 w-50 ">
            <div class="d-flex w-50">
                <div class="position-relative w-100">
                    <input type="text" class="form-control filter-field btn_search ps-5" id="_search_payroll" placeholder="Search...">
                    <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-4 text-muted"></i>
                </div>
            </div>
            <div class="d-flex align-items-center justify-content-end w-25">
                <select type="id" id="el_authorized" class="data-input filter-field"
                    data-field="authorized"></select>
            </div>
            <div class="d-flex align-items-center justify-content-end w-25">
                <select type="id" id="el_disbursed" class="data-input filter-field"
                    data-field="disbursed"></select>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end gap-3 w-25 ">
            <button type="button" class="btn_add" id="_btnAddpayroll">
                <i class="fa fa-usd mr-2"></i>
                <span vslang="buttons.Add Payroll"></span>
            </button>
        </div>
    </div>
     <div id="_payroll_list" class=" mt-4 px-4"></div>
</div>
