<div id="_main_purchases_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_purchases" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="form-control rounded-2 pe-5 filter-field input-search" id="_po_search" placeholder="Search By name or Po Number">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_po_vendor_id" class="data-input filter-field form-control" data-field="vendor_id"></select>
            </div>
             <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_po_status_id" class="data-input filter-field form-control" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end" style="overflow:visible;">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnPurchases">
                    <i class="fa-brands fa-first-order"></i>
                    <span vslang="buttons.Purchase Orders"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_purchases_list" class="table-responsive mt-3  rounded-2"></div>
</div>
