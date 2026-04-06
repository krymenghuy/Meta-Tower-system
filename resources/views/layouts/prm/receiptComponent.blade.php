<div id="_main_receipt_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_receipt" class="rounded-2 p-3 bg-white shadow-lg">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <div class="position-relative w-100">
                <input type="text" class="form-control rounded-2 pe-5 filter-field " id="_search_receipt" placeholder="Search By Name or Invoice No">
                <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
            </div>
         </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="receipt_status" class="data-input filter-field form-control" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="payment_method_id" class="data-input filter-field form-control" data-field="payment_method_id"></select>
            </div>

            {{-- <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end" style="overflow:visible;">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnReceipt">
                      <i class="fa-solid fa-money-check-dollar mr-2"></i>
                    <span vslang="buttons.Receipt"></span>
                </button>
            </div> --}}
        </div>

        

    </div>
    <div id="_receipt_list" class="table-responsive  mt-3 rounded-2"></div>
</div>

