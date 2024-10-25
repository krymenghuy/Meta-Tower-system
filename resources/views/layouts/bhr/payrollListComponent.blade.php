<div id="_main_payrollListComponent" style="display:none;padding:20px 0 0">
    <div class=" d-flex justify-content-between w-100 p-2 " id="_divFilter">
        <div class="d-flex align-items-center w-50 gap-2 ">
                <div class="d-flex align-items-center justify-content-end gap-2 w-50 pl-2">
                    <select type="id" id="el_filter_payrollList" class="data-input filter-field"></select>
                </div>

        </div>

        <div class="d-flex align-items-center  justify-content-end w-50 gap-2 pr-3">

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
        <div id="_payrollList_list"></div>
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
