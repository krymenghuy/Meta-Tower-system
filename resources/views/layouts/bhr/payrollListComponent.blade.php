<div id="_main_payrollListComponent" style="display:none;padding:20px 0 0">
    <div id="sub_content" class="p-0">
        <div class="d-flex justify-content-between w-100 p-3 mt-2 rounded-2 shadow" id="_divFilter">
            <div class="d-flex align-items-center w-50 px-3 gap-2">
                <div class="d-flex align-items-center justify-content-end  w-50 ">
                    <select type="id" id="el_filter_payrollList" class="data-input filter-field"></select>
                </div>
                <div class="d-flex align-items-center justify-content-end w-25 ">
                    <select type="id" id="el_filter_branch" class="data-input filter-field"></select>
                </div>

                <div class="d-flex align-items-center justify-content-end w-25 ">
                    <select type="id" id="el_filter_disburse" class="data-input filter-field"></select>
                </div>
            </div>

            <div class="d-flex align-items-center justify-content-end w-50 px-3 gap-3">
                <div class="d-flex justify-content-center w-50">
                    <input type="text" class=" rounded-5 form-control filter-field" id="_search_payroll_list"
                        placeholder="search payroll ">

                </div>
                <div class="d-flex gap-2">

                    <button class="d-flex justify-content-center align-items-center border-0 rounded-circle"
                        style="background-color:#2b3991; width: 40px; height: 40px;" id="_btnImport">
                        <i class="fa-solid fa-file-import tool-tip fs-6" style="color: #fff;"><span
                                class="tool-tiptext fs-6 ">Import Staff List</span></i>

                    </button>

                    <button class="d-flex justify-content-center align-items-center bg-danger border-0 rounded-circle "
                        style="width: 40px; height: 40px;" id="_btnCalculate">
                        <i class="fa-solid fa-calculator tool-tip fs-6" style="color: #fff;"><span
                                class="tool-tiptext fs-6">Calculate</span></i>
                    </button>
                    <button class="d-flex justify-content-center align-items-center bg-success rounded-circle border-0 "
                        style="width: 40px; height: 40px;" id="_btnDisburse">
                        <i class="fa-solid fa-square-check tool-tip fs-6" style="color: #fff;"> <span
                                class="tool-tiptext fs-6">Disburse</span></i>
                    </button>
                </div>


            </div>
        </div>
        <div id="_payrollList_list" class="px-3 mt-3"></div>
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

        <div id="payment_info" class="payment_details p-2" style="height:520px;">
        </div>

    </div>


</div>
