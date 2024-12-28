<div id="_main_payrollListComponent" style="display:none;padding:20px 0 0">
    <div id="sub_content" class="p-0">
        <div class="d-flex justify-content-between w-100 p-2" id="_divFilter">
            <div class="d-flex align-items-center w-50 gap-2">
                <div class="d-flex align-items-center justify-content-end gap-2 w-50 pl-2">
                    <select type="id" id="el_filter_payrollList" class="data-input filter-field"></select>
                </div>
                <div class="d-flex align-items-center justify-content-end gap-2 w-25 pl-2">
                    <select type="id" id="el_filter_branch" class="data-input filter-field"></select>
                </div>
                {{-- <div class="d-flex align-items-center justify-content-end gap-2 w-25 pl-2">
                    <select type="id" id="el_sort_by" class="data-input filter-field"></select>
                </div> --}}
                <div class="d-flex align-items-center justify-content-end gap-2 w-25 pl-2">
                    <select type="id" id="el_filter_disburse" class="data-input filter-field"></select>
                </div>
            </div>

            <div class="d-flex align-items-center justify-content-end w-50 gap-2 pr-3">
                <button type="button" class="btn btn-primary" id="_btnImport" title="Import">
                    <i class="fa-solid fa-file-import" style="color: white;"></i>
                    <span></span>
                </button>
                <button type="button" class="btn btn-primary" id="_btnCalculate" title="Calculate">
                    <i class="fas fa-calculator"></i>
                    <span></span>
                </button>
                <button type="button" class="btn btn-primary" id="_btnDisburse" title="Disburse">
                    <i class="fa-solid fa-square-check"></i>
                    <span></span>
                </button>
            </div>
        </div>
        <div id="_payrollList_list" class="m-4"></div>
    </div>

    <div class="d-none row px-3 bg-white" id="pay_slip">
        <div class="d-flex w-100 bg-white rounded-3 shadow p-2 justify-content-between">
            <div class="d-flex justify-content-start  px-3 w-25" id="btn_back">
                <button id="_btn_backTo_payrollList" style="background-color:#2b3991;"
                    class="btn text-white shadow rounded-4" type="button">
                    <i class="fa-solid fa-angles-left "></i>
                    <span class="" vslang="buttons.Back">Back</span>
                </button>
            </div>
            <div class="d-flex justify-content-end w-25 px-3">
                <button class="btn text-white shadow rounded-4"style="background-color:#2b3991;" id="_btnPrint">
                    <i class="fa-solid fa-print"></i>Print
                </button>
            </div>
        </div>

        <div id="payment_info" class="payment_details p-2" style="height:550px;">
        </div>

    </div>


</div>


