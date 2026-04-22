<div id="_main_vendor_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_vendor" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="form-control rounded-2 pe-5 filter-field input-search" id="_search_vendor" placeholder="Search By Name or Phone">
         </div>
            <div class="col-12 col-md-6 col-lg-2 ">
                <select type="id" id="_vendor_type_id" class="data-input filter-field form-control" data-field="vendor_type_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2 ">
                <select type="id" id="_vendor_category_id" class="data-input filter-field form-control" data-field="category_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2 ">
                <select type="id" id="_vendor_status_id" class="data-input filter-field form-control" data-field="status_id"></select>
            </div>

            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end" style="overflow:visible;">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnVendor">
                    <i class="fa-solid fa-user-plus"></i>
                    <span vslang="buttons.Create Vendor"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_vendor_list" class="table-responsive mt-3  rounded-2"></div>
</div>
