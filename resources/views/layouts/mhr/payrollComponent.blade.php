<div id="_main_payrollComponent" class="mobile-padding px-3" style="display:none;">
    <div id="_divFilter" class="bg-white rounded-2 shadow p-3">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_payroll" placeholder="Search by name">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="el_authorized" class="filter-field data-input" data-field="authorized"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="el_disbursed" class="filter-field data-input" data-field="disbursed"></select>
            </div>
            
            <div class="ms-md-auto text-md-end col-12 col-md-auto">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddpayroll">
                    <i class="fa-solid fa-user-plus"></i>
                    <span vslang="buttons.Add Payroll"></span>
                </button>
            </div>
        </div>
    </div>
     <div id="_payroll_list" class=" mt-3"></div>
</div>
