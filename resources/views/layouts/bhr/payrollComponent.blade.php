<div id="_main_payrollComponent" style="display:none;padding:20px 0 0">
    <div class=" d-flex justify-content-between w-100 p-2 " id="_divFilter">
        <div class="d-flex align-items-center w-50 gap-2 ">
                <div class="d-flex align-items-center justify-content-end gap-2 w-50 pl-2">
                    <select type="id" id="el_filter_payroll" class="data-input filter-field"></select>
                </div>

        </div>

        <div class="d-flex align-items-center  justify-content-end w-50 gap-2 pr-3">
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                  Payroll Actions
                </button>
                <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                  <li><a class="dropdown-item "  id="_btnAddPayroll">Add Payroll</a></li>
                  <li><a class="dropdown-item" id="_btnEditPayroll">Edit Payroll</a></li>
                  <li><a class="dropdown-item" id="_btnDeletePayroll">Delete Payroll</a></li>
                  <li><a class="dropdown-item" id ="btnAuthorized">Authorized</a></li>
                  <li><a class="dropdown-item" id="_btnDisbursed">Disbursed</a></li>
                </ul>
              </div>
                <button type="button" class="btn btn-primary" id="_btnImport">
                    <i class="fa-solid fa-file-import" style="color: white;"></i>
                    <span></span>
                </button>

                <button type="button" class="btn btn-primary" id="_btnInsert">
                    <i class="fa-regular fa-square-plus" style="color: white;"></i>
                    <span></span>
                </button>


                <button type="button" class="btn btn-primary" id="_btnCalculate">
                    <i class="fas fa-calculator"></i>
                    <span></span>
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
