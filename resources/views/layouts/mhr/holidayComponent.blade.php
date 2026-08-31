<div id="_main_holidayComponent" class="px-3 mobile-padding" style="display:none;">
    <div id="_divFilter_holiday" class="bg-white shadow p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_holiday" 
                placeholder="{{ \Vsd\Locales\Localization::trans('search_name', 'labels') }}">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="holiday_type" class="filter-field data-input" data-field="holiday_type_id" placeholder=""></select>
            </div>
            <div class="ms-md-auto text-md-end col-12 col-md-auto">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddHoliday">
                    <i class="fa-solid fa-calendar-day"></i>
                    <span vslang="buttons.Create Holiday"></span>
                </button>
            </div>
        </div>
    </div>
    <div class="mt-3" id="_holiday_list"></div>
</div>

