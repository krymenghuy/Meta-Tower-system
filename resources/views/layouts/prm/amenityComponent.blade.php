<div id="_main_amenity_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_amenity" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="form-control rounded-2 pe-5 filter-field input-search" id="_search_amenity" placeholder="Search by ID or Name">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="building_id" class="data-input filter-field form-control" data-field="building_id"></select>
            </div>
            <div class="col-12 d-none col-md-6 col-lg-2">
                <select id="floor_id" class="data-input filter-field form-control" data-field="floor_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="amenity_category_id" class="data-input filter-field form-control" data-field="category_id"></select>
            </div>
             <div class="col-12 col-md-6 col-lg-2 ">
                <select type="id" id="_amenity_status" class="data-input filter-field form-control" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end" style="overflow:visible;">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnAmenity">
                    <i class="fa-brands fa-buffer"></i>
                    <span vslang="buttons.Create Amenity"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_amenity_list" class="table-responsive mt-3  rounded-2"></div>
</div>
