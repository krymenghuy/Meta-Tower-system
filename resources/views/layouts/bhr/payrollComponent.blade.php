<div id="_main_payrollComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between w-100 p-3" id="_divFilter">
        <div class="d-flex align-items-center w-50 gap-2 pr-5">
            <div class="w-100 pl-3">
                <input type="text" class="form-control filter-field" id="_sdl_search_payroll"
                    placeholder="Search Payroll"/>
            </div>
        </div>



        <div class="d-flex align-items-center justify-content-end gap-2 w-50">
            <select type="id" id="el_status" class="data-input filter-field" data-field="status"></select>
        </div>



            <div class="d-flex align-items-center justify-content-end gap-2 w-50 text-nowrap">
                <button type="button" class="btn btn-primary" id="_btnAddpayroll">
                    <i class="fas fa-plus"></i>
                    <span>Add Payroll</span>
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

