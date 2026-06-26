<div id="_main_contract_component" class="p-3 mobile-padding" style="display: none;">
   <div id="_divFilter_contract" class= "p-3 rounded-2" style="background-color:white;">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <div class="position-relative w-100">
                    <input type="text" class="filter-field rounded-2 input-search" id="_search_contract" placeholder="{{ \Vsd\Locales\Localization::trans('Search by tenant, phone or unit', 'titles') }}">
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <select id="business_type_id" class="filter-field data-input form-control" data-field="business_type_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="el_contract_status_id" class="filter-field data-input form-control" data-field="status_id"></select>
            </div>
            <div class="ms-md-auto text-md-end col-12 col-md-auto">
            <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddContract">
                <i class="me-2 fa-regular fa-file-lines"></i>
                <span vslang="buttons.Create Contract"></span>
            </button>
            </div>
        </div>
    </div>
    <div id="_contract_list" class="table-responsive mt-3 rounded-2"></div>
</div>

