<div id="_main_payrollComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between w-100 p-3 " id="_divFilter">
        <div class="d-flex align-items-center w-50 gap-2 pr-5">
            <div class="w-100 pl-3">
                <input type="text" class="form-control filter-field" id="_sdl_search_payroll"
                    placeholder="Search Payroll">
            </div>
            <div class="d-flex align-items-center justify-content-end gap-2 w-50 ">
                <select type="id" id="el_sort_by" class="data-input filter-field"></select>
            </div>

            <div class="d-flex align-items-center justify-content-end gap-2 w-50">
                <select type="id" id="el_status" class="data-input filter-field" data-field="status"></select>
            </div>

        </div>
        <div class="d-flex align-items-center w-50 gap-2 pl-5 ">

            <div>
                <input data-select="datepicker" class="form-control filter-field" data-field="start_date"
                    placeholder="Start Date" id="_payroll_filter_start_date" />
            </div>
            <div>
                <input data-select="datepicker" class="form-control filter-field" data-field="end_date"
                    placeholder="End Date" id="_payroll_fliter_end_date" />
            </div>
            <div class="d-flex align-items-center justify-content-end gap-2 w-50 pr-4">
                <button type="button" class="btn btn-primary" id="_btnAddSalary">
                    <i class="fas fa-plus"></i>
                    <span>Add Salary</span>
                </button>
                <button type="button" class="btn btn-primary" id="_btnpayslip">
                    <i class="fas fa-print"></i>
                    <span>Payslip</span>
                </button>
            </div>
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
