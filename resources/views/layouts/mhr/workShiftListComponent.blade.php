<div id="_main_workShiftListComponent" class="px-3 mobile-padding" style="display:none;">
    <div class="bg-white shadow p-3 rounded-2" id="_divFilter">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_work_shift_list_search"
                placeholder="{{ \Vsd\Locales\Localization::trans('Search by name', 'titles') }}">
            </div>
            <div class="ms-md-auto col-12 col-md-auto">
                <button type="button" class="w-100 btnAddNewPrm" id="_btnAddWorkShift">
                    <span vslang="buttons.Create Work Shift"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_work_shift_lists" class="mt-3"></div>
</div>
