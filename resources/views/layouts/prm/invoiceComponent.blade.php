<div id="_main_invoice_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_invoice" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="position-relative w-100">
                <input type="text" class="form-control rounded-2 pe-5 filter-field input-search" id="_search_invoice" placeholder="Search By Tenant or Invoice No">
            </div>
         </div>

            {{-- <div class="col-12 col-md-6 col-lg-2 ">
                <select id="building_id" class="data-input filter-field form-control" data-field="building_id"></select>
            </div> --}}
           <div class="col-12 col-md-6 col-lg-2">
                <select id="payment_status" class="data-input filter-field form-control" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnInvoice">
                        <i class="fa-solid fa-file-invoice-dollar mr-2"></i>
                    <span vslang="buttons.Generate Invoice"></span>
                </button>
            </div>

        </div>

    </div>

    <div id="_invoice_list" class="table-responsive  mt-3 bg-white rounded-2 border"></div>
</div>

<script src="{{ asset('js/components/prm/PrintInvoiceDialog.js') }}"></script>



