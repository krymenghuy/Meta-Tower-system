<div id="_main_setting_component" class="mobile-padding p-3" style="display:none;">
    <div id="_divFilter_setting" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="rounded-2 filter-field input-search" id="_search_setting" placeholder="Search by name">
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <select type="id" id="_setting_category_id" class="data-input filter-field" data-field="category_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_setting_type_id" class="data-input filter-field" data-field="type_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2 ">
                <select type="id" id="_charge_as" class="data-input filter-field" data-field="charge_as"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2  d-none">
                <select type="id" id="_status_id" class="data-input filter-field" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-auto ms-md-auto text-md-end">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnService">
                    <i class="fa-solid fa-circle-plus me-2"></i>
                    <span vslang="buttons.Create Service"></span>
                </button>
            </div>
        </div>
        
    </div>
    <div id="_setting_list" class="mt-3 rounded-2"></div>
</div>