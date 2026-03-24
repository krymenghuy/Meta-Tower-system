<div id="_main_service_request_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_service_request" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <div class="position-relative w-100">
                <input type="text" class="form-control rounded-2 pe-5 filter-field " id="_search_service_request" placeholder="Search by Name or Room">
                <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
            </div>
        </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="_service_request_status" class="data-input filter-field form-control" data-field="status_id" placeholder="Status"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="_service_request_type_id" class="data-input filter-field form-control" data-field="service_type_id"></select>
            </div>
            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnServiceRequest">
                        <i class="fa-brands fa-usps"></i>
                    <span vslang="buttons.Request Service"></span>
                </button>
            </div>
        </div>
    </div>

    <div id="_service_request_list" class="table-responsive  mt-3 rounded-2"></div>
</div>
