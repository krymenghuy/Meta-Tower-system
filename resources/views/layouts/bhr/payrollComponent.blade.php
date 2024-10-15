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

<div class="modal fade" id="dlg_sdl_add_Payroll" tabindex="-1" aria-labelledby="dlg_sdl_add_payroll_title"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title " vslang="titles.Create Payroll List"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row gap-0" id="_sdl_payroll_info">
                    <div class="form-group col-12">
                        <label for="name" class="form-label " vslang="titles.Name"></label>
                        <select class=" data-input" id="_sdl_name_id" data-field="emp_id"></select>
                    </div>
                    <div class="form-group  col-12 d.none">

                        <div id="info"></div>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label " vslang="titles.Rate"></label>
                        <input type="text" class="form-control data-input" data-field="rate" />
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label " vslang="titles.Salary"></label>
                        <input type="text" class="form-control data-input" data-field="salary" />
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label " vslang="titles.Start Date"></label>
                        <input type="date" class="form-control data-input" data-field="start_date" />
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label " vslang="titles.End Date"></label>
                        <input type="date" class="form-control data-input" data-field="end_date" />
                    </div>

                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                    <span class="" vslang="titles.Cancel"></span>
                </button>
                <button id="dlg_sdl_add_payroll_btn_save" type="button" class="btn btn-sm btn-primary">
                    <span class="" vslang="titles.Save"></span>
                </button>
            </div>
        </div>
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