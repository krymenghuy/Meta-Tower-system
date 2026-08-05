<div id="_main_warningComponent" class="px-3 mobile-padding" style="display:none;">
    <div id="_divFilter_warning" class="bg-white shadow p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_warning_search" 
                placeholder="{{ \Vsd\Locales\Localization::trans('Search by name or code', 'titles') }}" >
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <select id="warning_type" class="filter-field data-input" data-field="warning_type_id" placeholder=""></select>
            </div>

            <div class="ms-md-auto text-md-end col-12 col-md-auto" style="overflow:visible;">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddWarning" title="Create warning">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span vslang="buttons.Create Warning"></span>
                </button>
            </div>
        </div> 
    </div> 
    <div id="_warning_list" class="mt-3"></div>
    
</div>