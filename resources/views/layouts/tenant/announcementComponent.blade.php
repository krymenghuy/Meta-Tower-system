<div id="_main_announcement_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_divFilter_announcement" class="bg-white shadow-sm p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_announcement" data-field="search_value" placeholder="{{ \Vsd\Locales\Localization::trans('Search announcement', 'titles') }}">
            </div>
            
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_filter_category" class="filter-field data-input" data-field="category" placeholder=""></select>
            </div>

            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_filter_priority" class="filter-field data-input" data-field="priority" placeholder=""></select>
            </div>

            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_filter_sort" class="filter-field data-input" data-field="sort" placeholder=""></select>
            </div>
        </div>
    </div>
    <div id="_announcement_list" class="mt-3 rounded-2"></div>
</div>
