<div id="_main_payrollComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between w-100 p-3 " id="_divFilter">
        <div class="d-flex align-items-center w-50 gap-2 pr-5">
            <div class="w-100 pl-3">
                <input type="text" class="form-control filter-field" id="_sdl_search_payroll"
                    placeholder="Search Payroll">
            </div>
            <div class="d-flex align-items-center justify-content-end gap-2 w-50 ">
                <select type="id" id="el_filter_payroll" class="data-input filter-field"></select>
            </div>

        </div>
        <div class="d-flex align-items-center justify-content-end w-50 gap-2 pl-5 ">
            <button type="button" class="btn btn-primary" id="_btnAddPayroll">
                <i class="fas fa-plus"></i>
                <span>Add Payroll</span>
            </button>
            <button type="button" class="btn btn-primary" id="_btnImport">
                <i class="fas fa-plus"></i>
                <span>Import Payroll</span>
            </button>
            <button type="button" class="btn btn-primary" id="_btnInsert">
                <i class="fas fa-plus"></i>
                <span>Insert Payroll</span>
            </button>
        </div>
    </div>

    <div class="p-3">
        <div id="_payroll_list"></div>
    </div>
</div>

<style>
    th,
    td {
        padding: 10px;
        vertical-align: middle;
        text-align: left;
        overflow: hidden;
        white-space: wrap;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: nowrap;
        max-width: 100px;
    }
</style>
