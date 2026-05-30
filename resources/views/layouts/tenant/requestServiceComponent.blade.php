<div id="_main_service_request_component" class="p-3 mobile-padding" style="display:none;">
     <div id="_divFilter_service_request" class="bg-white shadow-sm p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <div class="position-relative w-100">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_service_request" placeholder="Search by request no. or tenant">
            </div>
        </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="_service_request_category_id" class="filter-field data-input form-control" data-field="category_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="_service_request_status" class="filter-field data-input form-control" data-field="status_id" placeholder=" "></select>
            </div>
            <div class="ms-md-auto text-md-end col-12 col-md-auto">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnServiceRequest">
                        <i class="me-2 fa-brands fa-wpforms"></i>
                    <span vslang="buttons.Create New Request"></span>
                </button>
            </div>
        </div>
    </div>

    <div id="_service_request_list" class="table-responsive mt-3 rounded-2"></div>
</div>
