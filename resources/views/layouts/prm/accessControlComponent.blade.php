<div id="_main_access_control_component" class="mobile-padding p-3" style="display:none;">
    <div id="_divFilter_access_control" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="rounded-2 filter-field input-search form-control" id="_search_access" data-field="search_value" placeholder="{{ \Vsd\Locales\Localization::trans('Search by name', 'titles') }}">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="_status_id" class="data-input filter-field form-select" data-field="status"></select>
            </div>
            <div class="col-12 col-md-auto ms-md-auto text-md-end">
                <button type="button" class="btnAddNewPrm btn btn-primary w-100 w-md-auto" id="_btnAccessCard">
                    <i class="fa-solid fa-circle-plus me-2"></i>
                    <span vslang="buttons.Create Access Card"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_access_control_list" class="mt-3 rounded-2"></div>
</div>