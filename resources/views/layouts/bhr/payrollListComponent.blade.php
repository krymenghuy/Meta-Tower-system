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

    <div class="d-none row" id="pay_slip">
        <div class="d-flex justify-content-between">
            <div class="d-flex px-3 pt-3 w-50" id="btn_back">
                <button id="_btn_backTo_payrollList" style="background-color:#2b3991; width:100px; height:40px"
                    class="btn text-white shadow rounded-4 m-2 p-2" type="button">
                    <i class="fa-solid fa-angles-left "></i>
                    <span class="" vslang="buttons.Back">Back</span>
                </button>
            </div>
            <div class="payment_footer width-50">
                <button class="btn text-white shadow rounded-4 m-2 p-2"style="background-color:#2b3991; width:100px; height:40px" id="_btnPrint">Print</button>
            </div>
        </div>

        <div id="payment_info" class="payment_details">
        </div>

    </div>


</div>

<style>
    #_payrollList_list {
        height: 500px;
        padding-bottom: 80px;
        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    #_payrollList_list_paginator {
        bottom: 0;
        margin-top: 20px;
    }

    .payment_footer {
        display: flex;
        justify-content: flex-end;
        padding: 20px;


    }
</style>
