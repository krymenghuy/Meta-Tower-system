<div id="_main_payrollListComponent" class="mobile-padding px-3" style="display:none;">
    <div id="sub_content">
        <div class="p-3 mt-2 rounded-2 shadow" id="_divFilter">
            <div class="align-items-center row g-3">
                <button class="btn btn-warning d-none" id = "_btn_issues" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" vslang="buttons.Issues">
                </button>
                 <div class="col-12 col-md-6 col-lg-2">
                    <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnBackToPayroll">
                        <i class="fa-solid fa-angles-left "></i>
                        <span vslang="buttons.Back"></span>
                        <!-- <i class="fa-solid fa-reply-all tool-tip fs-6 text-white"> <span class="tool-tiptext fs-6 mt-2" vslang="buttons.Back"></span></i> -->
                    </button>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                    <input type="text" class="filter-field rounded-2 input-search" id="_search_payroll_list" placeholder="{{ \Vsd\Locales\Localization::trans('search_name', 'labels') }}">
                </div>
                <div class="col-12 col-md-6 col-lg-2">
                    <select type="id" id="el_filter_payrollList" class="data-input filter-field"></select>
                </div>
                <div class="col-12 col-md-6 col-lg-2">
                    <select type="id" id="el_filter_branch" class="data-input filter-field"></select>
                </div>
               
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="d-flex flex-wrap justify-content-lg-end gap-3"> 
                        <button class="d-flex justify-content-center align-items-center bg-primary border-0 rounded-2"
                            style="width: 30px; height: 30px;" id="_btnImport">
                            <i class="fa-solid fa-file-import tool-tip fs-6" style="color: #fff;">
                                <span class="tool-tiptext fs-6" vslang="buttons.Import Staff List"></span></i>
                        </button>

                        <button class="d-flex justify-content-center align-items-center bg-danger border-0 rounded-2"
                            style="width: 30px; height: 30px;" id="_btnCalculate">
                            <i class="fa-solid fa-calculator tool-tip fs-6" style="color: #fff;">
                                <span class="tool-tiptext fs-6"vslang="buttons.Calculate"></span></i>
                        </button>
                        <button class="d-flex justify-content-center align-items-center bg-warning rounded-2 border-0"
                            style="width: 30px; height: 30px;" id="_btnAuthorized">
                            <i class="fa-solid fa-check tool-tip fs-6" style="color: #fff;">
                                <span class="tool-tiptext fs-6" vslang="buttons.Authorize"></span></i>
                        </button>
                        <button class="d-flex justify-content-center align-items-center bg-success rounded-2 border-0 "
                            style="width: 30px; height: 30px;" id="_btnDisburse">
                            <i class="fa-solid fa-square-check tool-tip fs-6" style="color: #fff;">
                                <span class="tool-tiptext fs-6" vslang="buttons.Disburse"></span></i>
                        </button>
                        <button class="d-flex justify-content-center align-items-center bg-warning rounded-2 border-0 "
                            style="width: 30px; height: 30px;" id="_btnReverseTransactions">
                            <i class="fa-solid fa-refresh tool-tip fs-6" style="color: #fff;">
                                <span class="tool-tiptext fs-6" vslang="buttons.Reverse"></span></i>
                        </button>
                    </div>
                </div>
                {{-- <div class="d-flex align-items-center justify-content-end w-25 ">
                    <select type="id" id="el_filter_disburse" class="data-input filter-field"></select>
                </div> --}}
            </div>
        </div>
        <div class="collapse" id="collapseExample">
            <div class="card card-body m-2" id = "_issues_list">
                Some placeholder content for the collapse component. This panel is hidden by default but revealed when
                the user activates the relevant trigger.
            </div>
        </div>
        <div id="_payrollList_list" class="mt-3 h-100"></div>
    </div>

    <div class="d-none row bg-white" id="pay_slip">
        <div class="d-flex w-100 bg-white rounded-3 shadow p-4 justify-content-between">
            <div class="d-flex justify-content-start  px-3 w-25">
                <button id="_btn_backTo_payrollList" style="background-color:#2b3991;"
                    class="btn text-white shadow rounded-4" type="button">
                    <i class="fa-solid fa-angles-left "></i>
                    <span class="" vslang="buttons.Back">Back</span>
                </button>
            </div>
            <div class="d-flex justify-content-end w-25 px-3">
                <button class="btn text-white shadow rounded-4"style="background-color:#2b3991;" id="_print_pay_slip">
                    <i class="fa-solid fa-print"></i>Print
                </button>
            </div>
        </div>

        <div id="payment_info" class="payment_details px-4 mt-3"
            style="height:500px; overflow-y:auto; overflow-x:hidden; scrollbar-width: none;"></div>
    </div>


</div>
