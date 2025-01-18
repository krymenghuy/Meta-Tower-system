<div id="_main_payrollComponent" style="display:none;padding:20px 0 0;">
    <div class="d-flex justify-content-between w-100 p-4 mt-2 rounded-2 shadow" id="_divFilter">
        <div class="d-flex align-items-center justify-content-start gap-3 w-50 ">
            <div class="w-50">
                <input type="text" class="form-control filter-field d-flex btn_search" id="_search_payroll"
                    placeholder="Search" />
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
                <span>Add Payroll</span>
            </button>
        </div>
    </div>
     <div id="_payroll_list" class="mt-3 p-4"></div>
</div>
