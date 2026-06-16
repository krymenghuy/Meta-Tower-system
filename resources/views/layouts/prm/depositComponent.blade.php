<div id="_main_deposit_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_divFilter_service" class="bg-white shadow-sm p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_service" placeholder="Search by name">
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <select type="id" id="_service_category_id" class="filter-field data-input" data-field="category_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_service_type_id" class="filter-field data-input" data-field="type_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_charge_as" class="filter-field data-input" data-field="charge_as"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2 d-none">
                <select type="id" id="_status_id" class="filter-field data-input" data-field="status_id"></select>
            </div>
            <div class="ms-md-auto text-md-end col-12 col-md-auto">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnService">
                    <i class="me-2 fa-solid fa-circle-plus"></i>
                    <span vslang="buttons.Create Service"></span>
                </button>
            </div>
        </div>
        
    </div>
    <div id="_deposit_list" class="mt-3 rounded-2"></div>
</div>