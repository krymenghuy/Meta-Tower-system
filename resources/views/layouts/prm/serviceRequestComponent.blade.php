<div id="_main_service_request_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_service_request" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <div class="position-relative w-100">
                <input type="text" class="rounded-2 filter-field input-search" id="_search_service_request" placeholder="Search by request no or tenant">
            </div>
        </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="_service_request_category_id" class="data-input filter-field form-control" data-field="category_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="_service_request_status" class="data-input filter-field form-control" data-field="status_id" placeholder="Status"></select>
            </div>
            <div class="col-12 col-md-auto ms-md-auto text-md-end">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnServiceRequest">
                        <i class="fa-brands fa-wpforms me-2"></i>
                    <span vslang="buttons.Create New Request"></span>
                </button>
            </div>
        </div>
    </div>

    <div id="_service_request_list" class="table-responsive  mt-3 rounded-2"></div>
</div>
