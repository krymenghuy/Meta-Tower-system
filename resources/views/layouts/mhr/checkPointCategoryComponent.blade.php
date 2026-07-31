<div id="_main_check_point_category_component" class="px-3 mobile-padding" style="display:none;">
    <div class="bg-white shadow p-3 rounded-2" id="_divFilter">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_check_point_category_search"
                placeholder="{{ \Vsd\Locales\Localization::trans('Search by name', 'titles') }}">
            </div>
            <div class="ms-md-auto col-12 col-md-auto">
                <button type="button" class="w-100 btnAddNewPrm" id="_btnAddCheckPointCategory">
                    <i class="fa-solid fa-check-double"></i>
                    <span vslang="buttons.Create Evaluation"></span>
                </button>
            </div>
        </div>

    </div>
    <div id="_check_point_category_list" class="mt-3"></div>
</div>
