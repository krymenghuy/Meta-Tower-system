<div id="_main_payrollComponent"  style="display:none;padding:20px 0 0">
    <div class="d-flex  p-3 justify-content-between w-100 " id="_divFilter">
        <div class="d-flex align-items-center w-50 gap-2">
            <div class="w-50">
                <input type="text" class="form-control filter-field" id="_sdl_search_payroll"
                    placeholder="Search Payroll">
            </div>
            <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                <i class="la la-search"></i>
            </button>
            <button type="button" class="btn btn-primary" id="_btnAddSalary">
                <i class="fas fa-plus"></i>
                <span>Add Salary</span>
            </button>
        </div>

        <div class="d-flex align-items-center justify-content-end gap-2 w-50">
            <div class="form-group">
                <label for="" class="form-label " vslang="titles.Sort By"></label>
                <select type="id" id="el_sort_by" class="modal filter-field"></select>
            </div>
            <div class="form-group">
                <label for="" class="form-label " vslang="titles.Status"></label>
                <select type="id" id="el_status" class="modal filter-field "></select>
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
