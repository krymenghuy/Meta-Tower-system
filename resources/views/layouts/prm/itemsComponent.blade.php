<div id="_main_item_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_item" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="form-control rounded-2 pe-5 filter-field input-search" id="_search_item" placeholder="Search By Code or Name">
         </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_item_category_id" class="data-input filter-field form-control" data-field="category_id"></select>
            </div>

            <div class="col-12 col-md-auto ms-md-auto text-md-end" style="overflow:visible;">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnItem">
                    <i class="fa-solid fa-plus me-2"></i>
                    <span vslang="buttons.Create Item"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_item_list" class="table-responsive mt-3 rounded-2"></div>
</div>
