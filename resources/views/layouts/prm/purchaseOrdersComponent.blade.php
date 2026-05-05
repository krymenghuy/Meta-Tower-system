<div id="_main_purchases_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_purchases" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="rounded-2 filter-field input-search" id="_po_search" placeholder="Search by po number or vendor">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_po_vendor_id" class="data-input filter-field form-control" data-field="vendor_id"></select>
            </div>
             <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_po_status_id" class="data-input filter-field form-control" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-auto ms-md-auto text-md-end" style="overflow:visible;">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnPurchases">
                    <i class="fa-brands fa-first-order me-2"></i>
                    <span vslang="buttons.Purchase Orders"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_purchases_list" class="table-responsive mt-3  rounded-2"></div>
</div>
