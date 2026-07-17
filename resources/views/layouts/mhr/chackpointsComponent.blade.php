<div id="_main_chackpoints_component" class="mobile-padding px-3" style="display:none;">
    <div class="bg-white p-3 rounded-2 shadow" id="_divFilter">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_chackpoints_search"
                placeholder="{{ \Vsd\Locales\Localization::trans('Search by name', 'titles') }}">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="el_chackpoints_type" class="filter-field data-input" data-field="leave_type_id"></select>
            </div>
            <div class="ms-md-auto col-12 col-md-auto">
                <button type="button" class="w-100 btnAddNewPrm" id="_btnAddChackpoints">
                    <span vslang="buttons.Create Chackpoints"></span>
                </button>
            </div>
        </div>

    </div>
    <div id="_chackpoints_list" class="mt-3"></div>
</div>

