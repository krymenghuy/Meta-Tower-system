<div id="_main_amenity_component" class="p-3 mobile-padding" style="display:none;">
     <div id="_divFilter_amenity" class="bg-white shadow-sm p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input  type="text" class="filter-field rounded-2 input-search" id="_search_amenity" placeholder="{{ \Vsd\Locales\Localization::trans('search_unit_name', 'labels') }}">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="building_id" class="filter-field data-input form-control" data-field="building_id" placeholder='vslang="titles.All buildings"'></select>
            </div>
            <div class="col-12 d-none col-md-6 col-lg-2">
                <select placeholder='vslang="titles.All Floors"' id="floor_id" class="filter-field data-input form-control" data-field="floor_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select placeholder='vslang="titles.All Categories"' id="amenity_category_id" class="filter-field data-input form-control" data-field="category_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select placeholder='vslang="titles.All Statuses"' type="id" id="_amenity_status" class="filter-field data-input form-control" data-field="status_id"></select>
            </div>
            <div class="ms-md-auto text-md-end col-12 col-md-3 col-lg-auto" style="overflow:visible;">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAmenity">
                    <i class="me-2 fa-brands fa-buffer"></i>
                    <span vslang="buttons.Create Amenity"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_amenity_list" class="table-responsive mt-3 rounded-2"></div>
</div>
